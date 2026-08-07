import { NextResponse } from "next/server";
import {
  createPasswordResetToken,
  validateCsrfRequest,
} from "@/lib/auth";
import { sendAuthActionEmail } from "@/lib/email";

type Body = {
  email?: string;
};

function parseBody(value: unknown): Body {
  if (!value || typeof value !== "object") {
    return {};
  }
  return value as Body;
}

export async function POST(req: Request) {
  try {
    validateCsrfRequest(req);
    const body = parseBody(await req.json().catch(() => ({})));
    const email = String(body.email ?? "").trim();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const { token, expiresAt } = createPasswordResetToken(email);
    const sendResult = await sendAuthActionEmail({
      kind: "reset-password",
      to: email,
      token,
      expiresAt,
      requestUrl: req.url,
    });

    // In production this token should be emailed, never returned.
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ ok: true, expiresAt, delivered: sendResult.delivered });
    }

    return NextResponse.json({ ok: true, token, expiresAt, deliveryMode: sendResult.mode });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create password reset token";
    if (/CSRF/i.test(message)) {
      return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
    }
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
