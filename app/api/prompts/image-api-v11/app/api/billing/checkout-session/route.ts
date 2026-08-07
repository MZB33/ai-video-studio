import { NextResponse } from "next/server";
import { getAppBaseUrl, getPriceId } from "@/lib/billing/config";
import { getOrCreateStripeCustomer } from "@/lib/billing/customers";
import { requireAuthenticatedUserId } from "@/lib/billing/identity";
import type { BillingCycle, BillingPlan } from "@/lib/billing/plans";

type RequestBody = {
  plan?: BillingPlan;
  cycle?: BillingCycle;
  email?: string;
  successUrl?: string;
  cancelUrl?: string;
};

const VALID_PLANS: BillingPlan[] = ["pro", "studio", "business"];
const VALID_CYCLES: BillingCycle[] = ["monthly", "yearly"];

export async function POST(req: Request) {
  try {
    const appUserId = await requireAuthenticatedUserId();
    const body = (await req.json()) as RequestBody;

    if (!body.plan || !VALID_PLANS.includes(body.plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    if (!body.cycle || !VALID_CYCLES.includes(body.cycle)) {
      return NextResponse.json({ error: "Invalid cycle" }, { status: 400 });
    }

    const appBaseUrl = getAppBaseUrl();
    const priceId = getPriceId(body.plan, body.cycle);
    const customerId = await getOrCreateStripeCustomer(appUserId, body.email);

    return NextResponse.json({
      checkoutSessionId: "disabled",
      url: body.successUrl ?? `${appBaseUrl}/billing/success?session_id=disabled`,
      customerId,
      priceId,
      note: "Stripe checkout is disabled in this local build. Configure the runtime package and credentials to enable live checkout.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create checkout session";
    const status = /Unauthenticated/.test(message) ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
