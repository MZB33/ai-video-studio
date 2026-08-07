import { NextResponse } from "next/server";
import { type PlanId } from "@/lib/billing-constants";
import { readBillingIdentity } from "@/lib/billing-auth";
import { hasPlanAccess } from "@/lib/billing-store";

export async function requireMinimumPlan(request: Request, requiredPlan: PlanId) {
  if (process.env.BYPASS_BILLING_GUARDS === "true") {
    return null;
  }

  const { userId } = readBillingIdentity(request);

  if (!userId) {
    return NextResponse.json(
      {
        error: "Billing account is not provisioned",
        action: "Call /api/account/provision first",
        requiredPlan,
        upgradeUrl: "/pricing",
      },
      { status: 401 }
    );
  }

  const allowed = await hasPlanAccess(userId, requiredPlan);
  if (allowed) return null;

  return NextResponse.json(
    {
      error: `This endpoint requires the ${requiredPlan.toUpperCase()} plan`,
      requiredPlan,
      upgradeUrl: "/pricing",
    },
    { status: 402 }
  );
}
