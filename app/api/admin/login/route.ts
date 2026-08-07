import { NextResponse } from "next/server";
import {
  MONITORING_ADMIN_COOKIE,
  getExpectedMonitoringAdminSession,
} from "@/lib/monitoring-admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const password = typeof body?.password === "string" ? body.password : "";
    const expectedSession = getExpectedMonitoringAdminSession();

    if (!expectedSession || !password) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const providedSession = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(password)
    );
    const providedToken = Array.from(new Uint8Array(providedSession))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");

    if (providedToken !== expectedSession) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set(MONITORING_ADMIN_COOKIE, expectedSession, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/admin",
      maxAge: 60 * 60 * 12,
    });

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}