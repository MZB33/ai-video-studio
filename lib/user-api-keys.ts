import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto";
import { Redis } from "@upstash/redis";

export type UserProviderKeys = {
  replicateApiToken?: string;
  huggingfaceApiKey?: string;
  openaiApiKey?: string;
  elevenlabsApiKey?: string;
  voicerssApiKey?: string;
  googleTtsKey?: string;
};

type EncryptedUserProviderKeys = {
  [K in keyof UserProviderKeys]?: string;
};

let redisSingleton: Redis | null = null;
const memoryKeyStore = new Map<string, EncryptedUserProviderKeys>();

function getRedis() {
  if (redisSingleton) return redisSingleton;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;

  redisSingleton = new Redis({ url, token });
  return redisSingleton;
}

function userKeysKey(userId: string) {
  return `billing:user-keys:${userId}`;
}

function getEncryptionKey() {
  const secret = process.env.USER_API_KEYS_ENCRYPTION_SECRET || "";
  if (!secret) return null;
  return createHash("sha256").update(secret).digest();
}

function encryptValue(value: string) {
  const key = getEncryptionKey();
  if (!key) {
    // Fallback mode for local development if no encryption secret is set.
    return `plain:${Buffer.from(value, "utf8").toString("base64")}`;
  }

  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `enc:${iv.toString("base64")}:${tag.toString("base64")}:${encrypted.toString("base64")}`;
}

function decryptValue(payload: string) {
  if (!payload) return "";

  if (payload.startsWith("plain:")) {
    return Buffer.from(payload.slice(6), "base64").toString("utf8");
  }

  if (!payload.startsWith("enc:")) {
    return "";
  }

  const key = getEncryptionKey();
  if (!key) return "";

  const [, ivB64, tagB64, dataB64] = payload.split(":");
  if (!ivB64 || !tagB64 || !dataB64) return "";

  const iv = Buffer.from(ivB64, "base64");
  const tag = Buffer.from(tagB64, "base64");
  const encrypted = Buffer.from(dataB64, "base64");

  const decipher = createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);

  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString("utf8");
}

function normalizeKeys(input: UserProviderKeys) {
  const next: UserProviderKeys = {};
  const entries = Object.entries(input) as Array<[keyof UserProviderKeys, string | undefined]>;
  for (const [key, value] of entries) {
    if (!value) continue;
    const trimmed = value.trim();
    if (trimmed) {
      next[key] = trimmed;
    }
  }
  return next;
}

export function maskKey(value: string) {
  if (!value) return "";
  if (value.length <= 8) return "••••";
  return `${value.slice(0, 4)}••••${value.slice(-4)}`;
}

export async function getUserApiKeys(userId: string) {
  if (!userId) return null;

  const redis = getRedis();
  const encrypted = redis
    ? await redis.get<EncryptedUserProviderKeys>(userKeysKey(userId))
    : memoryKeyStore.get(userId) || null;

  if (!encrypted) return null;

  const decrypted: UserProviderKeys = {};
  const entries = Object.entries(encrypted) as Array<[keyof UserProviderKeys, string | undefined]>;

  for (const [key, value] of entries) {
    if (!value) continue;
    const plain = decryptValue(value);
    if (plain) {
      decrypted[key] = plain;
    }
  }

  return decrypted;
}

export async function saveUserApiKeys(userId: string, updates: UserProviderKeys) {
  if (!userId) throw new Error("User id is required");

  const normalized = normalizeKeys(updates);
  if (Object.keys(normalized).length === 0) {
    return getUserApiKeys(userId);
  }

  const redis = getRedis();
  const existingEncrypted = redis
    ? ((await redis.get<EncryptedUserProviderKeys>(userKeysKey(userId))) || {})
    : (memoryKeyStore.get(userId) || {});

  const nextEncrypted: EncryptedUserProviderKeys = { ...existingEncrypted };
  const entries = Object.entries(normalized) as Array<[keyof UserProviderKeys, string]>;

  for (const [key, value] of entries) {
    nextEncrypted[key] = encryptValue(value);
  }

  if (redis) {
    await redis.set(userKeysKey(userId), nextEncrypted);
  } else {
    memoryKeyStore.set(userId, nextEncrypted);
  }

  return getUserApiKeys(userId);
}
