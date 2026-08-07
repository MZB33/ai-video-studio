import { createRequire } from "node:module";
import { getStripeSecretKey } from "./config";

const require = createRequire(import.meta.url);
const Stripe = require("stripe");

type StripeClient = InstanceType<typeof Stripe>;

let stripeClient: StripeClient | null = null;

export function stripe(): StripeClient {
  if (!stripeClient) {
    stripeClient = new Stripe(getStripeSecretKey(), {
      apiVersion: "2025-02-24.acacia",
    });
  }

  return stripeClient;
}
