import { NextResponse } from "next/server";
import { applyBillingIdentityCookies, createBillingUserId, readBillingIdentity } from "@/lib/billing-auth";
import { ensureBillingAccount } from "@/lib/billing-store";

export async function GET(request: Request) {
  const identity = readBillingIdentity(request);
  const userId = identity.userId || createBillingUserId();
  const account = await ensureBillingAccount(userId, identity.email);

  const response = NextResponse.json({
    ok: true,
    userId: account.userId,
    email: account.email,
    planId: account.planId,
    subscriptionStatus: account.subscriptionStatus,
  });

  applyBillingIdentityCookies(response, {
    userId: account.userId,
    email: account.email,
    plan: account.planId,
    subscriptionStatus: account.subscriptionStatus,
  });

  return response;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email = typeof body?.email === "string" ? body.email.trim() : "";

  const identity = readBillingIdentity(request);
  const userId = identity.userId || createBillingUserId();
  const account = await ensureBillingAccount(userId, email || identity.email);

  const response = NextResponse.json({
    ok: true,
    userId: account.userId,
    email: account.email,
    planId: account.planId,
    subscriptionStatus: account.subscriptionStatus,
  });

  applyBillingIdentityCookies(response, {
    userId: account.userId,
    email: account.email,
    plan: account.planId,
    subscriptionStatus: account.subscriptionStatus,
  });

  return response;
}
