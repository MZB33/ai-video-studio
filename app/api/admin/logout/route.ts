import { NextResponse } from "next/server";
import { MONITORING_ADMIN_COOKIE } from "@/lib/monitoring-admin";

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL("/admin/login", request.url));
  response.cookies.set(MONITORING_ADMIN_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/admin",
    maxAge: 0,
  });

  return response;
}