import { BillingCycle, BillingPlan, PLAN_PRICE_ENV } from "./plans";

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getStripeSecretKey(): string {
  return requiredEnv("STRIPE_SECRET_KEY");
}

export function getStripeWebhookSecret(): string {
  return requiredEnv("STRIPE_WEBHOOK_SECRET");
}

export function getPriceId(plan: BillingPlan, cycle: BillingCycle): string {
  const envName = PLAN_PRICE_ENV[plan][cycle];
  return requiredEnv(envName);
}

export function getAppBaseUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}
