import { NextResponse } from "next/server";
import {
  buildCsrfCookieAttributes,
  createCsrfToken,
  getCsrfCookieName,
} from "@/lib/auth";

export async function GET() {
  const csrfToken = createCsrfToken();
  const response = NextResponse.json({ csrfToken });
  response.headers.set(
    "Set-Cookie",
    `${getCsrfCookieName()}=${csrfToken}; ${buildCsrfCookieAttributes()}`
  );
  return response;
}
