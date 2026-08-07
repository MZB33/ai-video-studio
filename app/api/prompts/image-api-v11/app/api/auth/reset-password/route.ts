import { NextResponse } from "next/server";
import {
  createCsrfToken,
  createSession,
  buildSessionCookieAttributes,
  buildSessionCookieValue,
  buildCsrfCookieAttributes,
  getCsrfCookieName,
  getSessionCookieName,
  resetPasswordWithToken,
  validateCsrfRequest,
} from "@/lib/auth";

type Body = {
  token?: string;
  password?: string;
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
    const password = String(body.password ?? "");

    if (!token || !password) {
      return NextResponse.json({ error: "Token and password are required" }, { status: 400 });
    }

    const user = resetPasswordWithToken({ token, password });
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
    const message = error instanceof Error ? error.message : "Unable to reset password";
    if (/CSRF/i.test(message)) {
      return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
    }
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
