import { NextResponse } from "next/server";
import {
  buildClearedSessionCookieAttributes,
  extractSessionIdFromCookie,
  getSessionCookieName,
  revokeSession,
  validateCsrfRequest,
} from "@/lib/auth";

export async function POST(req: Request) {
  try {
    validateCsrfRequest(req);
  } catch {
    return NextResponse.json({ error: "Invalid CSRF token" }, { status: 403 });
  }

  const sessionId = extractSessionIdFromCookie(req.headers.get("cookie"));
  if (sessionId) {
    revokeSession(sessionId);
  }

  const response = NextResponse.json({ ok: true });
  response.headers.set("Set-Cookie", `${getSessionCookieName()}=; ${buildClearedSessionCookieAttributes()}`);
  return response;
}
