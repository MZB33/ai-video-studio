import type { BillingCycle, BillingPlan } from "./plans";
import {
  getBillingProfileByCustomerId as getBillingProfileByCustomerIdDb,
  getBillingProfileByUserId as getBillingProfileByUserIdDb,
  getMonthlyUsage as getMonthlyUsageDb,
  getPromptHistory as getPromptHistoryDb,
  getRateLimitTimestamps,
  savePromptHistoryEntry as savePromptHistoryEntryDb,
  setMonthlyUsage,
  setRateLimitTimestamps,
  upsertBillingProfile as upsertBillingProfileDb,
} from "../db-store.ts";

export type BillingProfile = {
  appUserId: string;
  stripeCustomerId: string;
  email?: string;
  subscriptionId?: string;
  subscriptionStatus?: string;
  plan?: BillingPlan;
  cycle?: BillingCycle;
  currentPeriodEnd?: number;
};

export type GuardUsage = {
  monthKey: string;
  requestCount: number;
};

export function getBillingProfileByUserId(appUserId: string): BillingProfile | undefined {
  return getBillingProfileByUserIdDb(appUserId);
}

export function getBillingProfileByCustomerId(customerId: string): BillingProfile | undefined {
  return getBillingProfileByCustomerIdDb(customerId);
}

export function upsertBillingProfile(profile: BillingProfile): BillingProfile {
  return upsertBillingProfileDb(profile);
}

export function currentMonthKey(date = new Date()): string {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function getMonthlyUsage(appUserId: string): GuardUsage {
  const monthKey = currentMonthKey();
  const usage = getMonthlyUsageDb(appUserId);

  if (!usage.monthKey || usage.monthKey !== monthKey) {
    setMonthlyUsage(appUserId, monthKey, 0);
    return { monthKey, requestCount: 0 };
  }

  return { monthKey, requestCount: usage.requestCount };
}

export function incrementUsage(appUserId: string): GuardUsage {
  const monthKey = currentMonthKey();
  const current = getMonthlyUsageDb(appUserId);
  const nextCount = (current.monthKey === monthKey ? current.requestCount : 0) + 1;
  setMonthlyUsage(appUserId, monthKey, nextCount);
  return { monthKey, requestCount: nextCount };
}

export function checkRateLimit(appUserId: string, limit: number, now = new Date()): { allowed: boolean; remaining: number } {
  const windowMs = 60_000;
  const cutoff = now.getTime() - windowMs;
  const recent = getRateLimitTimestamps(appUserId).filter((timestamp: number) => timestamp > cutoff);

  if (recent.length >= limit) {
    return { allowed: false, remaining: 0 };
  }

  recent.push(now.getTime());
  setRateLimitTimestamps(appUserId, recent);
  return { allowed: true, remaining: Math.max(limit - recent.length, 0) };
}

export function savePromptHistoryEntry(entry: {
  id: string;
  appUserId: string;
  story: string;
  createdAt: string;
  result: string[];
}) {
  savePromptHistoryEntryDb(entry);
}

export function getPromptHistory(appUserId: string) {
  return getPromptHistoryDb(appUserId);
}
