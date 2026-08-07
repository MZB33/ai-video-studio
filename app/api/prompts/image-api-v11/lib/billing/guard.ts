import { PLAN_GUARD_CONFIG } from "./plans";
import { checkRateLimit, getBillingProfileByUserId, getMonthlyUsage, incrementUsage } from "./store";

export function getPlanForUser(appUserId: string): keyof typeof PLAN_GUARD_CONFIG {
  const profile = getBillingProfileByUserId(appUserId);
  return profile?.plan ?? "pro";
}

export function checkAndConsumeQuota(appUserId: string): {
  allowed: boolean;
  plan: keyof typeof PLAN_GUARD_CONFIG;
  requestCount: number;
  remainingRequests: number;
  monthlyLimit: number;
} {
  const plan = getPlanForUser(appUserId);
  const usage = getMonthlyUsage(appUserId);
  const monthlyLimit = PLAN_GUARD_CONFIG[plan].requestsPerMonth;
  const rateLimit = checkRateLimit(appUserId, PLAN_GUARD_CONFIG[plan].requestsPerMinute);

  if (!rateLimit.allowed) {
    return {
      allowed: false,
      plan,
      requestCount: usage.requestCount,
      remainingRequests: 0,
      monthlyLimit,
    };
  }

  if (usage.requestCount >= monthlyLimit) {
    return {
      allowed: false,
      plan,
      requestCount: usage.requestCount,
      remainingRequests: 0,
      monthlyLimit,
    };
  }

  const nextUsage = incrementUsage(appUserId);

  return {
    allowed: true,
    plan,
    requestCount: nextUsage.requestCount,
    remainingRequests: Math.max(monthlyLimit - nextUsage.requestCount, 0),
    monthlyLimit,
  };
}
