import { Redis } from "@upstash/redis";
import {
  hasPlanAtLeast,
  isPaidStatus,
  type BillingCycle,
  type PlanId,
  type SubscriptionStatus,
} from "@/lib/billing-constants";

export interface BillingAccount {
  userId: string;
  email: string;
  planId: PlanId;
  billingCycle: BillingCycle;
  subscriptionStatus: SubscriptionStatus;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd?: string;
  lastInvoiceDate?: string;
  updatedAt: string;
  createdAt: string;
}

export interface BillingPaymentRecord {
  eventId: string;
  invoiceId?: string;
  amountUsd: number;
  currency: string;
  status: string;
  planId: PlanId;
  billingCycle: BillingCycle;
  createdAt: string;
}

const memoryAccounts = new Map<string, BillingAccount>();
const memoryCustomerLinks = new Map<string, string>();
const memoryPayments = new Map<string, BillingPaymentRecord[]>();

let redisSingleton: Redis | null = null;

function nowIso() {
  return new Date().toISOString();
}

function getRedis() {
  if (redisSingleton) return redisSingleton;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  redisSingleton = new Redis({ url, token });
  return redisSingleton;
}

function accountKey(userId: string) {
  return `billing:account:${userId}`;
}

function customerKey(customerId: string) {
  return `billing:customer:${customerId}`;
}

function paymentsKey(userId: string) {
  return `billing:payments:${userId}`;
}

function createDefaultAccount(userId: string, email?: string): BillingAccount {
  const now = nowIso();
  return {
    userId,
    email: email || "",
    planId: "free",
    billingCycle: "monthly",
    subscriptionStatus: "free",
    cancelAtPeriodEnd: false,
    createdAt: now,
    updatedAt: now,
  };
}

export async function getBillingAccount(userId: string) {
  if (!userId) return null;

  const redis = getRedis();
  if (!redis) {
    return memoryAccounts.get(userId) || null;
  }

  const account = await redis.get<BillingAccount>(accountKey(userId));
  return account || null;
}

export async function upsertBillingAccount(account: BillingAccount) {
  const next: BillingAccount = {
    ...account,
    updatedAt: nowIso(),
    createdAt: account.createdAt || nowIso(),
  };

  const redis = getRedis();
  if (!redis) {
    memoryAccounts.set(next.userId, next);
    return next;
  }

  await redis.set(accountKey(next.userId), next);
  return next;
}

export async function ensureBillingAccount(userId: string, email?: string) {
  const existing = await getBillingAccount(userId);
  if (existing) {
    if (email && !existing.email) {
      return upsertBillingAccount({ ...existing, email });
    }
    return existing;
  }

  const created = createDefaultAccount(userId, email);
  return upsertBillingAccount(created);
}

export async function linkCustomerToUser(customerId: string, userId: string) {
  if (!customerId || !userId) return;

  const redis = getRedis();
  if (!redis) {
    memoryCustomerLinks.set(customerId, userId);
    return;
  }

  await redis.set(customerKey(customerId), userId);
}

export async function getUserIdByCustomerId(customerId: string) {
  if (!customerId) return null;

  const redis = getRedis();
  if (!redis) {
    return memoryCustomerLinks.get(customerId) || null;
  }

  const userId = await redis.get<string>(customerKey(customerId));
  return userId || null;
}

export async function addPaymentRecord(userId: string, payment: BillingPaymentRecord) {
  if (!userId) return;

  const redis = getRedis();
  if (!redis) {
    const current = memoryPayments.get(userId) || [];
    memoryPayments.set(userId, [payment, ...current].slice(0, 100));
    return;
  }

  await redis.lpush(paymentsKey(userId), payment);
  await redis.ltrim(paymentsKey(userId), 0, 99);
}

export async function listPaymentRecords(userId: string, limit = 25) {
  const redis = getRedis();
  if (!redis) {
    return (memoryPayments.get(userId) || []).slice(0, limit);
  }

  const rows = await redis.lrange<BillingPaymentRecord[]>(paymentsKey(userId), 0, limit - 1);
  return Array.isArray(rows) ? rows : [];
}

export async function setAccountPlan(
  userId: string,
  update: Partial<BillingAccount>
) {
  const account = await ensureBillingAccount(userId);
  const merged: BillingAccount = {
    ...account,
    ...update,
    userId,
    updatedAt: nowIso(),
  };

  return upsertBillingAccount(merged);
}

export async function hasPlanAccess(userId: string, requiredPlan: PlanId) {
  const account = await getBillingAccount(userId);
  if (!account) return requiredPlan === "free";

  if (requiredPlan === "free") return true;

  if (!isPaidStatus(account.subscriptionStatus)) return false;
  return hasPlanAtLeast(account.planId, requiredPlan);
}
