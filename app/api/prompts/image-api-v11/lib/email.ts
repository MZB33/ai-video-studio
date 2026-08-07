type AuthEmailKind = "verify-email" | "reset-password";

type SendResult = {
  delivered: boolean;
  mode: "resend" | "log";
};

const RESEND_API_URL = "https://api.resend.com/emails";

function getAppOrigin(requestUrl: string): string {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (configured) {
    return configured.replace(/\/$/, "");
  }
  return new URL(requestUrl).origin;
}

function requireEnv(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function buildRecoveryUrl(requestUrl: string, mode: AuthEmailKind, token: string): string {
  const base = `${getAppOrigin(requestUrl)}/auth/recovery`;
  const params = new URLSearchParams({
    mode,
    token,
  });
  return `${base}?${params.toString()}`;
}

async function sendViaResend(args: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  const apiKey = requireEnv("RESEND_API_KEY");
  const from = requireEnv("AUTH_EMAIL_FROM");

  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from,
      to: [args.to],
      subject: args.subject,
      html: args.html,
    }),
  });

  if (!response.ok) {
    const details = await response.text().catch(() => "");
    throw new Error(`Email delivery failed (${response.status}): ${details || "unknown provider error"}`);
  }
}

function buildEmailHtml(args: {
  headline: string;
  instruction: string;
  actionUrl: string;
  actionText: string;
  expiresAt: string;
}): string {
  return [
    "<div style=\"font-family:Segoe UI,Arial,sans-serif;line-height:1.6;color:#0f172a\">",
    `<h2 style=\"margin:0 0 12px\">${args.headline}</h2>`,
    `<p style=\"margin:0 0 16px\">${args.instruction}</p>`,
    `<p style=\"margin:0 0 16px\"><a href=\"${args.actionUrl}\" style=\"display:inline-block;padding:10px 16px;border-radius:999px;background:#06b6d4;color:#0f172a;text-decoration:none;font-weight:700\">${args.actionText}</a></p>`,
    `<p style=\"margin:0 0 8px;font-size:13px;color:#475569\">This link expires at: ${new Date(args.expiresAt).toUTCString()}</p>`,
    `<p style=\"margin:0;font-size:12px;color:#64748b\">If you did not request this, you can ignore this email.</p>`,
    "</div>",
  ].join("");
}

export async function sendAuthActionEmail(args: {
  kind: AuthEmailKind;
  to: string;
  token: string;
  expiresAt: string;
  requestUrl: string;
}): Promise<SendResult> {
  const actionUrl = buildRecoveryUrl(args.requestUrl, args.kind, args.token);
  const isVerify = args.kind === "verify-email";

  const subject = isVerify ? "Verify your account email" : "Reset your account password";
  const html = buildEmailHtml({
    headline: isVerify ? "Verify your email" : "Reset your password",
    instruction: isVerify
      ? "Click the button below to verify your email and complete account setup."
      : "Click the button below to set a new password for your account.",
    actionUrl,
    actionText: isVerify ? "Verify Email" : "Reset Password",
    expiresAt: args.expiresAt,
  });

  try {
    await sendViaResend({
      to: args.to,
      subject,
      html,
    });
    return { delivered: true, mode: "resend" };
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      throw error;
    }

    // Development fallback: print link if provider credentials are not configured.
    console.info("[auth-email:log]", {
      kind: args.kind,
      to: args.to,
      actionUrl,
      expiresAt: args.expiresAt,
    });
    return { delivered: false, mode: "log" };
  }
}
