import { NextResponse } from "next/server";
import { createBillingUserId, applyBillingIdentityCookies, readBillingIdentity } from "@/lib/billing-auth";
import { type BillingCycle, type PlanId } from "@/lib/billing-constants";
import { ensureBillingAccount, linkCustomerToUser, setAccountPlan } from "@/lib/billing-store";
import { getAppBaseUrl, getStripeClient, getStripePriceId } from "@/lib/stripe-billing";

const planIds: PlanId[] = ["free", "pro", "studio", "business"];

const checkoutUrls: Record<PlanId, Partial<Record<BillingCycle, string>>> = {
  free: {
    monthly: process.env.FREE_CHECKOUT_URL,
    annual: process.env.FREE_ANNUAL_CHECKOUT_URL,
  },
  pro: {
    monthly: process.env.PRO_MONTHLY_CHECKOUT_URL || process.env.PRO_CHECKOUT_URL,
    annual: process.env.PRO_ANNUAL_CHECKOUT_URL,
  },
  studio: {
    monthly: process.env.STUDIO_MONTHLY_CHECKOUT_URL,
    annual: process.env.STUDIO_ANNUAL_CHECKOUT_URL,
  },
  business: {
    monthly: process.env.BUSINESS_MONTHLY_CHECKOUT_URL,
    annual: process.env.BUSINESS_ANNUAL_CHECKOUT_URL,
  },
};

function parsePlan(planParam: string | null): PlanId {
  if (planParam && planIds.includes(planParam as PlanId)) {
    return planParam as PlanId;
  }
  return "pro";
}

function parseCycle(cycleParam: string | null): BillingCycle {
  return cycleParam === "annual" ? "annual" : "monthly";
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const plan = parsePlan(searchParams.get("plan"));
  const cycle = parseCycle(searchParams.get("cycle"));
  const identity = readBillingIdentity(request);
  const userId = identity.userId || createBillingUserId();
  const email = searchParams.get("email") || identity.email || "";

  const account = await ensureBillingAccount(userId, email);

  if (plan === "free") {
    const updated = await setAccountPlan(userId, {
      planId: "free",
      billingCycle: "monthly",
      subscriptionStatus: "free",
      email: account.email || email,
    });

    const response = NextResponse.redirect(`${getAppBaseUrl(request)}/account/billing`, 307);
    applyBillingIdentityCookies(response, {
      userId,
      email: updated.email,
      plan: updated.planId,
      subscriptionStatus: updated.subscriptionStatus,
    });
    return response;
  }

  const stripe = getStripeClient();
  const stripePrice = getStripePriceId(plan, cycle);
  if (stripe && stripePrice) {
    const baseUrl = getAppBaseUrl(request);

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: stripePrice, quantity: 1 }],
      success_url: `${baseUrl}/account/billing?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/pricing?checkout=cancelled`,
      metadata: {
        userId,
        plan,
        cycle,
      },
      customer: account.stripeCustomerId || undefined,
      customer_email: account.stripeCustomerId ? undefined : (account.email || email || undefined),
      allow_promotion_codes: true,
      subscription_data: {
        metadata: {
          userId,
          plan,
          cycle,
        },
      },
    });

    if (session.customer && typeof session.customer === "string") {
      await linkCustomerToUser(session.customer, userId);
    }

    if (!session.url) {
      return NextResponse.json({ error: "Stripe session URL is missing" }, { status: 500 });
    }

    const response = NextResponse.redirect(session.url, 303);
    applyBillingIdentityCookies(response, {
      userId,
      email: account.email || email,
      plan: account.planId,
      subscriptionStatus: account.subscriptionStatus,
    });
    return response;
  }

  const checkoutUrl = checkoutUrls[plan][cycle];

  if (!checkoutUrl) {
    const envPrefix = plan.toUpperCase();
    const envName = `${envPrefix}_${cycle.toUpperCase()}_CHECKOUT_URL`;

    return NextResponse.json(
      {
        error: `${plan.toUpperCase()} ${cycle} checkout is not configured. Set ${envName} in production.`,
      },
      { status: 503 }
    );
  }

  const response = NextResponse.redirect(checkoutUrl, 307);
  applyBillingIdentityCookies(response, {
    userId,
    email: account.email || email,
    plan: account.planId,
    subscriptionStatus: account.subscriptionStatus,
  });
  return response;
}
