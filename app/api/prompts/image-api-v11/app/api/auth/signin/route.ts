import { NextResponse } from "next/server";
import {
  authenticateUser,
  buildSessionCookieAttributes,
  buildSessionCookieValue,
  buildCsrfCookieAttributes,
  checkLoginAllowed,
  clearFailedLogin,
  createCsrfToken,
  createSession,
  getCsrfCookieName,
  getSessionCookieName,
  registerFailedLogin,
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
  const body = parseBody(await req.json().catch(() => ({})));
  const email = String(body.email ?? "").trim();
  const password = String(body.password ?? "");
  const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  try {
    validateCsrfRequest(req);

    const loginAllowed = checkLoginAllowed({ email, clientIp });
    if (!loginAllowed.allowed) {
      const response = NextResponse.json(
        { error: "Too many failed login attempts. Try again later." },
        { status: 429 }
      );
      if (loginAllowed.retryAfterSeconds) {
        response.headers.set("Retry-After", String(loginAllowed.retryAfterSeconds));
      }
      return response;
    }

    const user = authenticateUser({ email, password });
    clearFailedLogin({ email, clientIp });
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
    const message = error instanceof Error ? error.message : "Invalid email or password";
    if (/CSRF/i.test(message)) {
      return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
    }

    if (/not verified/i.test(message)) {
      return NextResponse.json({ error: message }, { status: 403 });
    }

    if (email) {
      const lockState = registerFailedLogin({ email, clientIp });
      if (lockState.locked) {
        const response = NextResponse.json(
          { error: "Too many failed login attempts. Try again later." },
          { status: 429 }
        );
        if (lockState.retryAfterSeconds) {
          response.headers.set("Retry-After", String(lockState.retryAfterSeconds));
        }
        return response;
      }
    }

    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }
}
