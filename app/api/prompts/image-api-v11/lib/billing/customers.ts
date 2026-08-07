import type { BillingCycle, BillingPlan } from "./plans";
import { getBillingProfileByCustomerId, getBillingProfileByUserId, upsertBillingProfile } from "./store";
import { getStripeRuntimeUnavailableError } from "./stripe-runtime";

type PlanCycle = {
  plan?: BillingPlan;
  cycle?: BillingCycle;
};

export function resolvePlanCycleFromPriceId(priceId?: string | null): PlanCycle {
  if (!priceId) {
    return {};
  }

  const table: Record<string, PlanCycle> = {
    [process.env.STRIPE_PRICE_PRO_MONTHLY ?? ""]: { plan: "pro", cycle: "monthly" },
    [process.env.STRIPE_PRICE_PRO_YEARLY ?? ""]: { plan: "pro", cycle: "yearly" },
    [process.env.STRIPE_PRICE_STUDIO_MONTHLY ?? ""]: { plan: "studio", cycle: "monthly" },
    [process.env.STRIPE_PRICE_STUDIO_YEARLY ?? ""]: { plan: "studio", cycle: "yearly" },
    [process.env.STRIPE_PRICE_BUSINESS_MONTHLY ?? ""]: { plan: "business", cycle: "monthly" },
    [process.env.STRIPE_PRICE_BUSINESS_YEARLY ?? ""]: { plan: "business", cycle: "yearly" },
  };

  return table[priceId] ?? {};
}

export async function getOrCreateStripeCustomer(appUserId: string, _email?: string): Promise<string> {
  void _email;
  const existing = getBillingProfileByUserId(appUserId);
  if (existing?.stripeCustomerId) {
    return existing.stripeCustomerId;
  }

  throw getStripeRuntimeUnavailableError();
}

export function saveCheckoutCompletion(args: {
  appUserId: string;
  stripeCustomerId: string;
  stripeSubscriptionId?: string;
  email?: string;
}): void {
  const existing = getBillingProfileByUserId(args.appUserId);

  upsertBillingProfile({
    appUserId: args.appUserId,
    stripeCustomerId: args.stripeCustomerId,
    email: args.email ?? existing?.email,
    subscriptionId: args.stripeSubscriptionId ?? existing?.subscriptionId,
    subscriptionStatus: existing?.subscriptionStatus,
    plan: existing?.plan,
    cycle: existing?.cycle,
    currentPeriodEnd: existing?.currentPeriodEnd,
  });
}

export function saveSubscriptionState(subscription: { customer: unknown; items: { data: Array<{ price?: { id?: string | null } }> }; id: string; status: string; current_period_end?: number | null }): void {
  const customerId = typeof subscription.customer === "string" ? subscription.customer : (subscription.customer as { id?: string } | null)?.id;
  const existing = customerId ? getBillingProfileByCustomerId(customerId) : undefined;

  if (!existing?.appUserId) {
    return;
  }

  const firstItem = subscription.items.data[0];
  const priceId = firstItem?.price?.id ?? null;
  const { plan, cycle } = resolvePlanCycleFromPriceId(priceId);

  upsertBillingProfile({
    ...existing,
    subscriptionId: subscription.id,
    subscriptionStatus: subscription.status,
    plan: plan ?? existing.plan,
    cycle: cycle ?? existing.cycle,
    currentPeriodEnd: subscription.current_period_end ?? existing.currentPeriodEnd,
  });
}
