#!/usr/bin/env node
import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;

if (!secretKey) {
  console.error("Missing STRIPE_SECRET_KEY. Export it before running this script.");
  process.exit(1);
}

const stripe = new Stripe(secretKey, {
  apiVersion: "2025-02-24.acacia",
});

const planMatrix = [
  {
    code: "PRO",
    name: "Pro",
    description: "For solo creators shipping frequently",
    monthly: 2900,
    yearly: 29000,
  },
  {
    code: "STUDIO",
    name: "Studio",
    description: "For growing teams with higher throughput",
    monthly: 9900,
    yearly: 99000,
  },
  {
    code: "BUSINESS",
    name: "Business",
    description: "For production workloads and advanced quotas",
    monthly: 24900,
    yearly: 249000,
  },
];

async function ensureProduct(plan) {
  const product = await stripe.products.create({
    name: `${plan.name} Plan`,
    description: plan.description,
    metadata: {
      plan: plan.name.toLowerCase(),
    },
  });

  return product;
}

async function createRecurringPrice(productId, amount, interval, planName, cycle) {
  return stripe.prices.create({
    currency: "usd",
    unit_amount: amount,
    recurring: {
      interval,
    },
    product: productId,
    metadata: {
      plan: planName.toLowerCase(),
      cycle,
    },
  });
}

async function main() {
  const envOutput = [];

  for (const plan of planMatrix) {
    const product = await ensureProduct(plan);

    const monthlyPrice = await createRecurringPrice(
      product.id,
      plan.monthly,
      "month",
      plan.name,
      "monthly"
    );

    const yearlyPrice = await createRecurringPrice(
      product.id,
      plan.yearly,
      "year",
      plan.name,
      "yearly"
    );

    envOutput.push(`STRIPE_PRICE_${plan.code}_MONTHLY=${monthlyPrice.id}`);
    envOutput.push(`STRIPE_PRICE_${plan.code}_YEARLY=${yearlyPrice.id}`);
  }

  console.log("\nCreated Stripe products/prices. Copy these values into your env file:\n");
  console.log(envOutput.join("\n"));
}

main().catch((error) => {
  console.error("Failed to create Stripe products/prices:", error);
  process.exit(1);
});
