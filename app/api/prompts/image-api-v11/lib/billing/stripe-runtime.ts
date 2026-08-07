export function getStripeRuntimeUnavailableError() {
  return new Error("Stripe integration is not available in this environment. Configure the Stripe package and credentials to enable billing routes.");
}
