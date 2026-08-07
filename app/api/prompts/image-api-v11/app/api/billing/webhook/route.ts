import { NextResponse } from "next/server";
import { getStripeWebhookSecret } from "@/lib/billing/config";
import { saveCheckoutCompletion, saveSubscriptionState } from "@/lib/billing/customers";
import { getBillingProfileByCustomerId, upsertBillingProfile } from "@/lib/billing/store";
import { stripe } from "@/lib/billing/stripe";

function toCustomerId(customer: string | { id?: string } | null): string | undefined {
  if (!customer) {
    return undefined;
  }

  return typeof customer === "string" ? customer : customer.id;
}

export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing stripe-signature header" }, { status: 400 });
  }

  const payload = await req.text();

  const webhookSecret = getStripeWebhookSecret();
  if (!webhookSecret) {
    return NextResponse.json({ error: "Stripe webhook secret is not configured" }, { status: 503 });
  }

  try {
    const event = stripe().webhooks.constructEvent(payload, signature, webhookSecret);
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;
        const appUserId =
          session.client_reference_id ??
          session.metadata?.appUserId ??
          undefined;
        const customerId = toCustomerId(session.customer);

        if (appUserId && customerId) {
          saveCheckoutCompletion({
            appUserId,
            stripeCustomerId: customerId,
            stripeSubscriptionId:
              typeof session.subscription === "string"
                ? session.subscription
                : session.subscription?.id,
            email: session.customer_details?.email ?? undefined,
          });
        }

        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        saveSubscriptionState(subscription);
        break;
      }
      case "invoice.payment_succeeded": {
        const invoice = event.data.object;
        const customerId = toCustomerId(invoice.customer);

        if (customerId) {
          const existing = getBillingProfileByCustomerId(customerId);
          if (existing) {
            upsertBillingProfile({
              ...existing,
              subscriptionStatus: "active",
            });
          }
        }

        break;
      }
      default: {
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook handler error";
    if (message.includes("Stripe") || message.includes("Unexpected token")) {
      return NextResponse.json({ error: message }, { status: 500 });
    }
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
