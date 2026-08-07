export type BillingPlan = "pro" | "studio" | "business";
export type BillingCycle = "monthly" | "yearly";

export type PlanGuardConfig = {
  requestsPerMinute: number;
  requestsPerMonth: number;
  maxConcurrentJobs: number;
  includedRenderMinutes: number;
  overageRateUsd: {
    promptRequest: number;
    renderMinute: number;
    storageGb: number;
  };
};

export const PLAN_GUARD_CONFIG: Record<BillingPlan, PlanGuardConfig> = {
  pro: {
    requestsPerMinute: 90,
    requestsPerMonth: 25000,
    maxConcurrentJobs: 2,
    includedRenderMinutes: 300,
    overageRateUsd: {
      promptRequest: 0.0008,
      renderMinute: 0.07,
      storageGb: 0.2,
    },
  },
  studio: {
    requestsPerMinute: 240,
    requestsPerMonth: 120000,
    maxConcurrentJobs: 8,
    includedRenderMinutes: 2500,
    overageRateUsd: {
      promptRequest: 0.0005,
      renderMinute: 0.05,
      storageGb: 0.12,
    },
  },
  business: {
    requestsPerMinute: 600,
    requestsPerMonth: 450000,
    maxConcurrentJobs: 20,
    includedRenderMinutes: 10000,
    overageRateUsd: {
      promptRequest: 0.0003,
      renderMinute: 0.035,
      storageGb: 0.08,
    },
  },
};

export const PLAN_PRICE_ENV: Record<BillingPlan, Record<BillingCycle, string>> = {
  pro: {
    monthly: "STRIPE_PRICE_PRO_MONTHLY",
    yearly: "STRIPE_PRICE_PRO_YEARLY",
  },
  studio: {
    monthly: "STRIPE_PRICE_STUDIO_MONTHLY",
    yearly: "STRIPE_PRICE_STUDIO_YEARLY",
  },
  business: {
    monthly: "STRIPE_PRICE_BUSINESS_MONTHLY",
    yearly: "STRIPE_PRICE_BUSINESS_YEARLY",
  },
};
