import { NextResponse } from "next/server";
import { readBillingIdentity } from "@/lib/billing-auth";
import { ensureBillingAccount, setAccountPlan } from "@/lib/billing-store";
import { getStripeClient } from "@/lib/stripe-billing";

export async function POST(request: Request) {
  const identity = readBillingIdentity(request);
  if (!identity.userId) {
    return NextResponse.json({ error: "No billing identity found" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const action = typeof body?.action === "string" ? body.action : "";

  if (action !== "cancel" && action !== "renew") {
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  }

  const account = await ensureBillingAccount(identity.userId, identity.email);
  const stripe = getStripeClient();

  if (stripe && account.stripeSubscriptionId) {
    await stripe.subscriptions.update(account.stripeSubscriptionId, {
      cancel_at_period_end: action === "cancel",
    });
  }

  const updated = await setAccountPlan(account.userId, {
    cancelAtPeriodEnd: action === "cancel",
  });

  return NextResponse.json({ ok: true, account: updated });
}
