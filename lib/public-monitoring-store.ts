import { createHash } from "node:crypto";
import { Redis } from "@upstash/redis";

type VisitRecord = {
  visitorId: string;
  path: string;
  userAgent: string;
  referrer: string;
  ipHash: string;
  firstSeenAt: string;
  lastSeenAt: string;
  visitCount: number;
};

type ErrorRecord = {
  visitorId: string;
  path: string;
  message: string;
  stack: string;
  createdAt: string;
};

type Summary = {
  storage: "memory" | "upstash";
  uniqueVisitors: number;
  recentVisits: Array<Pick<VisitRecord, "visitorId" | "path" | "lastSeenAt" | "visitCount">>;
  recentErrors: ErrorRecord[];
};

type MemoryStore = {
  visitors: Map<string, VisitRecord>;
  recentErrors: ErrorRecord[];
};

declare global {
  var __aiVideoPublicMonitoringStore: MemoryStore | undefined;
}

const RECENT_ITEM_LIMIT = 50;
const VISITOR_SET_KEY = "monitor:visitors";
const RECENT_VISITS_KEY = "monitor:recent-visits";
const RECENT_ERRORS_KEY = "monitor:recent-errors";

function getMemoryStore(): MemoryStore {
  if (!globalThis.__aiVideoPublicMonitoringStore) {
    globalThis.__aiVideoPublicMonitoringStore = {
      visitors: new Map<string, VisitRecord>(),
      recentErrors: [],
    };
  }

  return globalThis.__aiVideoPublicMonitoringStore;
}

function getRedisClient() {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }

  return new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL,
    token: process.env.UPSTASH_REDIS_REST_TOKEN,
  });
}

function hashIp(ipAddress: string) {
  return createHash("sha256").update(ipAddress || "unknown").digest("hex").slice(0, 16);
}

function getClientIp(headers: Headers) {
  const forwarded = headers.get("x-forwarded-for") || headers.get("x-real-ip") || "unknown";
  return forwarded.split(",")[0]?.trim() || "unknown";
}

function normalizeText(value: unknown, fallback = "") {
  return typeof value === "string" ? value.slice(0, 1000) : fallback;
}

async function sendMonitoringAlert(payload: {
  type: string;
  summary: Summary;
  details?: Record<string, unknown>;
}) {
  const webhookUrl = process.env.MONITORING_ALERT_WEBHOOK_URL;

  if (!webhookUrl) {
    return;
  }

  try {
    await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        source: "ai-video-app",
        ...payload,
      }),
    });
  } catch (error) {
    console.error("MONITORING ALERT ERROR:", error instanceof Error ? error.message : String(error));
  }
}

export function isMonitoringSummaryAuthorized(headers: Headers) {
  const secret = process.env.MONITORING_API_KEY;

  if (!secret) {
    return process.env.NODE_ENV !== "production";
  }

  return headers.get("x-monitoring-key") === secret;
}

export async function recordPublicVisit(headers: Headers, payload: { visitorId: string; path: string; referrer?: string; userAgent?: string; }) {
  const visitorId = normalizeText(payload.visitorId);
  const path = normalizeText(payload.path, "/");

  if (!visitorId || !path) {
    return;
  }

  const now = new Date().toISOString();
  const userAgent = normalizeText(payload.userAgent || headers.get("user-agent"), "unknown");
  const referrer = normalizeText(payload.referrer || headers.get("referer"));
  const ipHash = hashIp(getClientIp(headers));
  const redis = getRedisClient();

  if (redis) {
    const visitorKey = `monitor:visitor:${visitorId}`;
    const existing = await redis.hgetall<Record<string, string | number>>(visitorKey);
    const visitCount = Number(existing?.visitCount || 0) + 1;
    const firstSeenAt = typeof existing?.firstSeenAt === "string" ? existing.firstSeenAt : now;

    await redis.sadd(VISITOR_SET_KEY, visitorId);
    await redis.hset(visitorKey, {
      visitorId,
      path,
      userAgent,
      referrer,
      ipHash,
      firstSeenAt,
      lastSeenAt: now,
      visitCount,
    });
    await redis.lpush(RECENT_VISITS_KEY, JSON.stringify({ visitorId, path, lastSeenAt: now, visitCount }));
    await redis.ltrim(RECENT_VISITS_KEY, 0, RECENT_ITEM_LIMIT - 1);
    return;
  }

  const store = getMemoryStore();
  const existing = store.visitors.get(visitorId);

  store.visitors.set(visitorId, {
    visitorId,
    path,
    userAgent,
    referrer,
    ipHash,
    firstSeenAt: existing?.firstSeenAt || now,
    lastSeenAt: now,
    visitCount: (existing?.visitCount || 0) + 1,
  });
}

export async function recordFrontendError(headers: Headers, payload: { visitorId: string; path: string; message: string; stack?: string; }) {
  const visitorId = normalizeText(payload.visitorId);
  const path = normalizeText(payload.path, "/");
  const message = normalizeText(payload.message, "Unknown frontend error");
  const stack = normalizeText(payload.stack);
  const createdAt = new Date().toISOString();
  const errorRecord: ErrorRecord = { visitorId, path, message, stack, createdAt };
  const redis = getRedisClient();

  if (redis) {
    await redis.lpush(RECENT_ERRORS_KEY, JSON.stringify(errorRecord));
    await redis.ltrim(RECENT_ERRORS_KEY, 0, RECENT_ITEM_LIMIT - 1);
    const summary = await getMonitoringSummary();
    await sendMonitoringAlert({
      type: "frontend-error",
      summary,
      details: {
        visitorId,
        path,
        message,
      },
    });
    return;
  }

  const store = getMemoryStore();
  store.recentErrors.unshift(errorRecord);
  store.recentErrors = store.recentErrors.slice(0, RECENT_ITEM_LIMIT);

  const summary = await getMonitoringSummary();
  await sendMonitoringAlert({
    type: "frontend-error",
    summary,
    details: {
      visitorId,
      path,
      message,
    },
  });
}

export async function getMonitoringSummary(): Promise<Summary> {
  const redis = getRedisClient();

  if (redis) {
    const [uniqueVisitors, recentVisitsRaw, recentErrorsRaw] = await Promise.all([
      redis.scard(VISITOR_SET_KEY),
      redis.lrange<string>(RECENT_VISITS_KEY, 0, 19),
      redis.lrange<string>(RECENT_ERRORS_KEY, 0, 19),
    ]);

    return {
      storage: "upstash",
      uniqueVisitors: Number(uniqueVisitors || 0),
      recentVisits: (recentVisitsRaw || []).map((item) => JSON.parse(item)),
      recentErrors: (recentErrorsRaw || []).map((item) => JSON.parse(item)),
    };
  }

  const store = getMemoryStore();
  const visitors = Array.from(store.visitors.values()).sort((left, right) => right.lastSeenAt.localeCompare(left.lastSeenAt));

  return {
    storage: "memory",
    uniqueVisitors: store.visitors.size,
    recentVisits: visitors.slice(0, 20).map((item) => ({
      visitorId: item.visitorId,
      path: item.path,
      lastSeenAt: item.lastSeenAt,
      visitCount: item.visitCount,
    })),
    recentErrors: store.recentErrors.slice(0, 20),
  };
}