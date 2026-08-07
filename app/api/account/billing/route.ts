import { NextResponse } from "next/server";
import { applyBillingIdentityCookies, createBillingUserId, readBillingIdentity } from "@/lib/billing-auth";
import { ensureBillingAccount, listPaymentRecords } from "@/lib/billing-store";

export async function GET(request: Request) {
  const identity = readBillingIdentity(request);
  const userId = identity.userId || createBillingUserId();
  const account = await ensureBillingAccount(userId, identity.email);
  const payments = await listPaymentRecords(account.userId, 30);

  const response = NextResponse.json({
    ok: true,
    account,
    payments,
    verification: {
      userProvisioned: Boolean(account.userId),
      planCookiePresent: Boolean(identity.plan),
      lastInvoiceTracked: Boolean(account.lastInvoiceDate),
      paymentRecords: payments.length,
    },
  });

  applyBillingIdentityCookies(response, {
    userId: account.userId,
    email: account.email,
    plan: account.planId,
    subscriptionStatus: account.subscriptionStatus,
  });

  return response;
}
