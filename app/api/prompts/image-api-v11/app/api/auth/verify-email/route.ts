import { NextResponse } from "next/server";
import {
  createCsrfToken,
  createSession,
  buildSessionCookieAttributes,
  buildSessionCookieValue,
  buildCsrfCookieAttributes,
  getCsrfCookieName,
  getSessionCookieName,
  validateCsrfRequest,
  verifyEmailWithToken,
} from "@/lib/auth";

type Body = {
  token?: string;
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
    const token = String(body.token ?? "").trim();

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    const user = verifyEmailWithToken(token);
    const session = createSession(user.userId);
    const csrfToken = createCsrfToken();

    const response = NextResponse.json({
      ok: true,
      user,
      expiresAt: session.expiresAt,
    });

    response.headers.set(
      "Set-Cookie",
      `${getSessionCookieName()}=${buildSessionCookieValue(session.sessionId)}; ${buildSessionCookieAttributes()}`
    );
    response.headers.append(
      "Set-Cookie",
      `${getCsrfCookieName()}=${csrfToken}; ${buildCsrfCookieAttributes()}`
    );

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to verify email";
    if (/CSRF/i.test(message)) {
      return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
    }
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
