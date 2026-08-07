import { NextResponse } from "next/server";
import {
  type BillingCycle,
  type PlanId,
  type SubscriptionStatus,
} from "@/lib/billing-constants";
import {
  addPaymentRecord,
  ensureBillingAccount,
  getUserIdByCustomerId,
  linkCustomerToUser,
  setAccountPlan,
} from "@/lib/billing-store";
import { getStripeClient, resolvePlanByPriceId } from "@/lib/stripe-billing";

function normalizeCycle(value: string | null | undefined): BillingCycle {
  return value === "annual" ? "annual" : "monthly";
}

function normalizePlan(value: string | null | undefined): PlanId {
  if (value === "pro" || value === "studio" || value === "business") {
    return value;
  }
  return "free";
}

function toSubscriptionStatus(status: string | null | undefined): SubscriptionStatus {
  if (
    status === "active" ||
    status === "trialing" ||
    status === "past_due" ||
    status === "canceled" ||
    status === "incomplete"
  ) {
    return status;
  }
  return "free";
}

export async function POST(request: Request) {
  const stripe = getStripeClient();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    return NextResponse.json({ error: "Stripe webhook is not configured" }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  const payload = await request.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid webhook signature";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const metadata = session.metadata || {};
        const userId = metadata.userId || (typeof session.client_reference_id === "string" ? session.client_reference_id : "");
        const plan = normalizePlan(metadata.plan);
        const cycle = normalizeCycle(metadata.cycle);
        const customerId = typeof session.customer === "string" ? session.customer : "";
        const email = session.customer_details?.email || "";

        if (userId) {
          await ensureBillingAccount(userId, email);
          if (customerId) {
            await linkCustomerToUser(customerId, userId);
          }
          await setAccountPlan(userId, {
            email,
            stripeCustomerId: customerId || undefined,
            planId: plan,
            billingCycle: cycle,
            subscriptionStatus: "active",
            stripeSubscriptionId:
              typeof session.subscription === "string" ? session.subscription : undefined,
          });
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        const customerId = typeof subscription.customer === "string" ? subscription.customer : "";
        const userId =
          (subscription.metadata?.userId as string | undefined) ||
          (customerId ? await getUserIdByCustomerId(customerId) : null);

        if (!userId) break;

        const firstPriceId =
          subscription.items.data[0]?.price?.id || "";
        const resolved = resolvePlanByPriceId(firstPriceId);
        const plan = normalizePlan(subscription.metadata?.plan) || resolved?.plan || "free";
        const cycle = normalizeCycle(subscription.metadata?.cycle) || resolved?.cycle || "monthly";

        const currentPeriodEndValue =
          typeof (subscription as { current_period_end?: number | null }).current_period_end === "number"
            ? (subscription as { current_period_end?: number | null }).current_period_end
            : null;

        await setAccountPlan(userId, {
          stripeCustomerId: customerId || undefined,
          stripeSubscriptionId: subscription.id,
          planId: plan,
          billingCycle: cycle,
          subscriptionStatus: toSubscriptionStatus(subscription.status),
          currentPeriodEnd: currentPeriodEndValue
            ? new Date(currentPeriodEndValue * 1000).toISOString()
            : undefined,
          cancelAtPeriodEnd: Boolean((subscription as { cancel_at_period_end?: boolean }).cancel_at_period_end),
        });
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object;
        const customerId = typeof invoice.customer === "string" ? invoice.customer : "";
        const userId = customerId ? await getUserIdByCustomerId(customerId) : null;
        if (!userId) break;

        const firstLine = invoice.lines.data[0] as { price?: { id?: string | null } } | undefined;
        const priceId = firstLine?.price?.id || "";
        const resolved = resolvePlanByPriceId(priceId);

        await addPaymentRecord(userId, {
          eventId: event.id,
          invoiceId: invoice.id,
          amountUsd: (invoice.amount_paid || 0) / 100,
          currency: (invoice.currency || "usd").toUpperCase(),
          status: invoice.status || "paid",
          planId: resolved?.plan || "free",
          billingCycle: resolved?.cycle || "monthly",
          createdAt: new Date((invoice.created || Math.floor(Date.now() / 1000)) * 1000).toISOString(),
        });

        await setAccountPlan(userId, {
          lastInvoiceDate: new Date().toISOString(),
        });

        break;
      }

      default:
        break;
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook processing failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
