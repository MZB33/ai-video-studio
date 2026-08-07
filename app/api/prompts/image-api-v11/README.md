This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Stripe Billing Setup

## Secure Account Authentication

This app now supports secure email/password authentication:

- `POST /api/auth/signup`
- `POST /api/auth/signin`
- `POST /api/auth/signout`
- `GET /api/auth/me`
- `GET /api/auth/csrf`
- `POST /api/auth/request-email-verification`
- `POST /api/auth/verify-email`
- `POST /api/auth/request-password-reset`
- `POST /api/auth/reset-password`

Production email delivery for auth recovery:

- `RESEND_API_KEY`: API key for Resend email delivery.
- `AUTH_EMAIL_FROM`: Verified sender address (for example `Auth <no-reply@yourdomain.com>`).
- `NEXT_PUBLIC_APP_URL`: Public app URL used to build verification/reset links.

In development, if email provider credentials are not configured, auth recovery links are logged and tokens remain visible in API responses for local testing.

Security behavior:

- Passwords are hashed using PBKDF2 (`sha512`) with per-user random salt and high iteration count.
- Session IDs are random 256-bit values stored server-side.
- Session cookie is `HttpOnly`, `SameSite=Strict`, path scoped to `/`, and uses `Secure` in production.
- CSRF token validation is enforced for sign-in, sign-up, sign-out, email verification, and password reset requests.
- Sign-in attempts are rate-limited and temporarily locked after repeated failed attempts.
- Email verification and password reset tokens are one-time use and expire automatically.
- Protected app pages redirect unauthenticated users to `/auth`.

For strong account security, enforce unique passwords and consider adding MFA in a future iteration.

This project includes production-ready backend billing routes:

- `POST /api/billing/checkout-session` (subscription checkout session)
- `POST /api/billing/portal-session` (Stripe Customer Portal for invoice download/payment method updates)
- `POST /api/billing/webhook` (Stripe webhook handler)
- `GET /api/billing/guard-metrics` (plan-tier quotas/rate card metrics)

### 1) Configure environment variables

Copy `.env.example` to `.env.local` and fill in values:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_APP_URL`
- `STRIPE_PRICE_PRO_MONTHLY`
- `STRIPE_PRICE_PRO_YEARLY`
- `STRIPE_PRICE_STUDIO_MONTHLY`
- `STRIPE_PRICE_STUDIO_YEARLY`
- `STRIPE_PRICE_BUSINESS_MONTHLY`
- `STRIPE_PRICE_BUSINESS_YEARLY`

### 2) Create products and prices for each paid plan/cycle

Run:

```bash
npm run stripe:seed
```

Then copy the printed `STRIPE_PRICE_*` values into your environment variables.

### 3) Bind real app authentication to billing user ID

Billing endpoints require a real authenticated app user ID header (for example `x-user-id`, `x-auth-user-id`, `x-clerk-user-id`, `x-supabase-user-id`, `x-firebase-uid`).

This replaces cookie-provisioned billing identity and ensures billing is attached to real app logins.

### 4) Respect local, national, and international restrictions

This app must be used in compliance with all applicable laws and regulations, including local, national, state, provincial, and international rules governing content generation, copyright, trademark, publicity, privacy, and export controls. You are responsible for ensuring that your use of the service and any generated outputs are lawful in your jurisdiction and in any jurisdiction where the content is distributed or used.

Do not use the app for unlawful, harmful, deceptive, or privacy-invasive activities. If a jurisdiction restricts or prohibits specific uses of AI-generated content, you must not use the app for those purposes.

### 5) Follow the app usage guidelines

Use the app in a simple, intentional way:

- Start with a clear story idea, mood, or visual direction.
- Keep your input concise and specific so the generated prompts stay focused.
- Review the output before using it in a project, publication, or client workflow.
- Make sure your use case complies with applicable laws, platform rules, and audience expectations.
- Avoid generating or distributing content that is misleading, harmful, infringing, or otherwise restricted by law.

### 6) Prepare for common support scenarios

The app should be able to help users with common issues using a simple problem-and-solution pattern:

- If generation fails: check whether the input is too short, too vague, or outside the allowed use cases.
- If requests are exhausted: review the current plan, usage window, and remaining quota.
- If history is missing: confirm the same user identity is being used for generation and history lookup.
- If something feels unexpected: review the displayed error, simplify the prompt, and confirm the usage restrictions and guidelines apply to the case.

This support structure can be expanded over time into a full FAQ or in-app help center. The app now also includes an automated support layer that detects common states such as generation errors, low quota, short prompts, and empty history, then suggests the next best step automatically.

### 7) Configure Stripe webhook endpoint

Create webhook endpoint in Stripe dashboard:

- URL: `https://your-domain.com/api/billing/webhook`
- Events:
	- `checkout.session.completed`
	- `customer.subscription.created`
	- `customer.subscription.updated`
	- `customer.subscription.deleted`
	- `invoice.payment_succeeded`

Copy the webhook signing secret into `STRIPE_WEBHOOK_SECRET`.
