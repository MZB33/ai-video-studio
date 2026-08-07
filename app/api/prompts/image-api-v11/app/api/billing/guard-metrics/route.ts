import { NextResponse } from "next/server";
import { requireAuthenticatedUserId } from "@/lib/billing/identity";
import { PLAN_GUARD_CONFIG } from "@/lib/billing/plans";
import { getBillingProfileByUserId, getMonthlyUsage } from "@/lib/billing/store";

export async function GET() {
  try {
    const appUserId = await requireAuthenticatedUserId();
    const profile = getBillingProfileByUserId(appUserId);
    const plan = profile?.plan ?? "pro";
    const usage = getMonthlyUsage(appUserId);
    const planConfig = PLAN_GUARD_CONFIG[plan];

    return NextResponse.json({
      appUserId,
      plan,
      subscriptionStatus: profile?.subscriptionStatus ?? "unknown",
      planGuard: {
        requestsPerMinute: planConfig.requestsPerMinute,
        requestsPerMonth: planConfig.requestsPerMonth,
        maxConcurrentJobs: planConfig.maxConcurrentJobs,
        includedRenderMinutes: planConfig.includedRenderMinutes,
        overageRateUsd: planConfig.overageRateUsd,
      },
      usage: {
        monthKey: usage.monthKey,
        requestCount: usage.requestCount,
        remainingRequests: Math.max(planConfig.requestsPerMonth - usage.requestCount, 0),
      },
      allPlanRateCards: PLAN_GUARD_CONFIG,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to retrieve API-Guard metrics";
    const status = /Unauthenticated/.test(message) ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
