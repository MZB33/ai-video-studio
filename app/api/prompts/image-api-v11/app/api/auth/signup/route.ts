import { NextResponse } from "next/server";
import {
  buildCsrfCookieAttributes,
  buildSessionCookieAttributes,
  buildSessionCookieValue,
  createCsrfToken,
  createSession,
  createUser,
  getCsrfCookieName,
  getSessionCookieName,
  validateCsrfRequest,
} from "@/lib/auth";

type Body = {
  email?: string;
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
    const email = String(body.email ?? "").trim();
    const password = String(body.password ?? "");

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    if (password.length < 12) {
      return NextResponse.json({ error: "Password must be at least 12 characters long" }, { status: 400 });
    }

    const user = createUser({ email, password });
    const session = createSession(user.userId);
  const csrfToken = createCsrfToken();

    const response = NextResponse.json({
      user: {
        userId: user.userId,
        email: user.email,
      },
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
    const message = error instanceof Error ? error.message : "Unable to sign up";
    if (/CSRF/i.test(message)) {
      return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
    }
    const status = /already exists/i.test(message) ? 409 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
