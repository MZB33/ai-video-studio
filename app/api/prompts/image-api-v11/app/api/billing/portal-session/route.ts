import { NextResponse } from "next/server";
import { getAppBaseUrl } from "@/lib/billing/config";
import { getOrCreateStripeCustomer } from "@/lib/billing/customers";
import { requireAuthenticatedUserId } from "@/lib/billing/identity";

type RequestBody = {
  returnUrl?: string;
  email?: string;
};

export async function POST(req: Request) {
  try {
    const appUserId = await requireAuthenticatedUserId();
    const body = (await req.json().catch(() => ({}))) as RequestBody;
    const customerId = await getOrCreateStripeCustomer(appUserId, body.email);

    return NextResponse.json({
      portalUrl: body.returnUrl ?? `${getAppBaseUrl()}/billing`,
      customerId,
      note: "Stripe customer portal is disabled in this local build. Configure the runtime package and credentials to enable live portal sessions.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create customer portal session";
    const status = /Unauthenticated/.test(message) ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
