import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE_NAME = "prompt-studio-session";

const PROTECTED_PATH_PREFIXES = ["/", "/billing", "/guide", "/voice-studio-pro"];
const AUTH_PATH = "/auth";

function isProtectedPath(pathname: string): boolean {
  if (pathname === "/") {
    return true;
  }

  return PROTECTED_PATH_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function hasSessionCookie(cookieHeader: string | null): boolean {
  if (!cookieHeader) {
    return false;
  }

  const cookies = cookieHeader.split(";").map((entry) => entry.trim());
  for (const cookie of cookies) {
    const [name, ...rest] = cookie.split("=");
    if (name === SESSION_COOKIE_NAME && rest.length > 0 && rest.join("=").trim()) {
      return true;
    }
  }

  return false;
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/_next") || pathname.startsWith("/api") || pathname === "/favicon.ico") {
    return NextResponse.next();
  }

  const hasSession = hasSessionCookie(req.headers.get("cookie"));

  if (pathname === AUTH_PATH && hasSession) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isProtectedPath(pathname) && !hasSession) {
    return NextResponse.redirect(new URL(AUTH_PATH, req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
