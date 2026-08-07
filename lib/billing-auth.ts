import { NextResponse } from "next/server";
import {
  BILLING_PLAN_COOKIE,
  BILLING_STATUS_COOKIE,
  BILLING_USER_EMAIL_COOKIE,
  BILLING_USER_ID_COOKIE,
  type PlanId,
  type SubscriptionStatus,
} from "@/lib/billing-constants";

type CookieMap = Record<string, string>;

function parseCookieHeader(cookieHeader: string | null): CookieMap {
  if (!cookieHeader) return {};

  return cookieHeader
    .split(";")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .reduce((accumulator, entry) => {
      const equalsIndex = entry.indexOf("=");
      if (equalsIndex <= 0) return accumulator;
      const key = entry.slice(0, equalsIndex).trim();
      const value = entry.slice(equalsIndex + 1).trim();
      accumulator[key] = decodeURIComponent(value);
      return accumulator;
    }, {} as CookieMap);
}

export function readBillingIdentity(request: Request) {
  const cookieMap = parseCookieHeader(request.headers.get("cookie"));

  return {
    userId: cookieMap[BILLING_USER_ID_COOKIE] || "",
    email: cookieMap[BILLING_USER_EMAIL_COOKIE] || "",
    plan: (cookieMap[BILLING_PLAN_COOKIE] as PlanId | undefined) || "free",
    subscriptionStatus:
      (cookieMap[BILLING_STATUS_COOKIE] as SubscriptionStatus | undefined) || "free",
  };
}

export function createBillingUserId() {
  return crypto.randomUUID();
}

type CookiePayload = {
  userId: string;
  email?: string;
  plan: PlanId;
  subscriptionStatus: SubscriptionStatus;
};

export function applyBillingIdentityCookies(
  response: NextResponse,
  payload: CookiePayload
) {
  const secure = process.env.NODE_ENV === "production";
  const maxAge = 60 * 60 * 24 * 365;

  response.cookies.set(BILLING_USER_ID_COOKIE, payload.userId, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge,
  });

  if (payload.email) {
    response.cookies.set(BILLING_USER_EMAIL_COOKIE, payload.email, {
      httpOnly: true,
      secure,
      sameSite: "lax",
      path: "/",
      maxAge,
    });
  }

  response.cookies.set(BILLING_PLAN_COOKIE, payload.plan, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge,
  });

  response.cookies.set(BILLING_STATUS_COOKIE, payload.subscriptionStatus, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge,
  });
}
