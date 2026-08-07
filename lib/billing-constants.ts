export type PlanId = "free" | "pro" | "studio" | "business";
export type BillingCycle = "monthly" | "annual";

export type SubscriptionStatus =
  | "free"
  | "active"
  | "trialing"
  | "past_due"
  | "canceled"
  | "incomplete";

export const BILLING_USER_ID_COOKIE = "ai_billing_user_id";
export const BILLING_USER_EMAIL_COOKIE = "ai_billing_user_email";
export const BILLING_PLAN_COOKIE = "ai_billing_plan";
export const BILLING_STATUS_COOKIE = "ai_billing_status";

const PLAN_RANK: Record<PlanId, number> = {
  free: 0,
  pro: 1,
  studio: 2,
  business: 3,
};

export function hasPlanAtLeast(current: PlanId, required: PlanId) {
  return PLAN_RANK[current] >= PLAN_RANK[required];
}

export function isPaidStatus(status: SubscriptionStatus) {
  return status === "active" || status === "trialing";
}
