import Stripe from "stripe";
import { type BillingCycle, type PlanId } from "@/lib/billing-constants";

let stripeClient: Stripe | null = null;

export function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return null;

  if (!stripeClient) {
    stripeClient = new Stripe(secretKey, {
      apiVersion: "2026-07-29.dahlia",
    });
  }

  return stripeClient;
}

const priceEnvMap: Record<Exclude<PlanId, "free">, Record<BillingCycle, string | undefined>> = {
  pro: {
    monthly: process.env.STRIPE_PRICE_PRO_MONTHLY,
    annual: process.env.STRIPE_PRICE_PRO_ANNUAL,
  },
  studio: {
    monthly: process.env.STRIPE_PRICE_STUDIO_MONTHLY,
    annual: process.env.STRIPE_PRICE_STUDIO_ANNUAL,
  },
  business: {
    monthly: process.env.STRIPE_PRICE_BUSINESS_MONTHLY,
    annual: process.env.STRIPE_PRICE_BUSINESS_ANNUAL,
  },
};

export function getStripePriceId(plan: PlanId, cycle: BillingCycle) {
  if (plan === "free") return null;
  return priceEnvMap[plan][cycle] || null;
}

export function resolvePlanByPriceId(priceId: string): { plan: PlanId; cycle: BillingCycle } | null {
  const entries = Object.entries(priceEnvMap) as Array<[
    Exclude<PlanId, "free">,
    Record<BillingCycle, string | undefined>
  ]>;

  for (const [plan, byCycle] of entries) {
    for (const cycle of ["monthly", "annual"] as BillingCycle[]) {
      if (byCycle[cycle] && byCycle[cycle] === priceId) {
        return { plan, cycle };
      }
    }
  }

  return null;
}

export function getAppBaseUrl(request: Request) {
  const url = new URL(request.url);
  if (process.env.APP_BASE_URL) {
    return process.env.APP_BASE_URL.replace(/\/$/, "");
  }

  const forwardedProto = request.headers.get("x-forwarded-proto");
  const forwardedHost = request.headers.get("x-forwarded-host");
  if (forwardedProto && forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`;
  }

  return `${url.protocol}//${url.host}`;
}
