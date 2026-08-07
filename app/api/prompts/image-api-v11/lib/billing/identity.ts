import { resolveUserFromSessionCookie } from "../auth.ts";

type HeadersStore = {
  get(name: string): string | null | undefined;
};

const AUTH_ID_HEADERS = [
  "x-user-id",
  "x-auth-user-id",
  "x-clerk-user-id",
  "x-stack-user-id",
  "x-supabase-user-id",
  "x-firebase-uid",
] as const;

const SESSION_COOKIE_NAME = "prompt-studio-user-id";

function extractBearerUserId(value: string | null | undefined): string | undefined {
  if (!value) {
    return undefined;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  if (trimmed.toLowerCase().startsWith("bearer ")) {
    const token = trimmed.slice(7).trim();
    return token || undefined;
  }

  return trimmed;
}

export function extractAuthenticatedUserIdFromHeaders(headersLike: Record<string, string | undefined | null>): string | undefined {
  for (const name of AUTH_ID_HEADERS) {
    const value = extractBearerUserId(headersLike[name]);
    if (value) {
      return value;
    }
  }

  const authorization = extractBearerUserId(headersLike.authorization);
  if (authorization) {
    return authorization;
  }

  return undefined;
}

export function extractAuthenticatedUserIdFromCookie(cookieHeader: string | null | undefined): string | undefined {
  const authUser = resolveUserFromSessionCookie(cookieHeader);
  if (authUser?.userId) {
    return authUser.userId;
  }

  if (!cookieHeader) {
    return undefined;
  }

  const cookies = cookieHeader.split(";").map((entry) => entry.trim());
  for (const cookie of cookies) {
    const [name, value] = cookie.split("=");
    if (name === SESSION_COOKIE_NAME && value) {
      return decodeURIComponent(value);
    }
  }

  return undefined;
}

async function getHeadersStore(): Promise<HeadersStore> {
  try {
    const { headers } = await import("next/headers");
    return await headers();
  } catch {
    return {
      get() {
        return undefined;
      },
    };
  }
}

export async function requireAuthenticatedUserId(): Promise<string> {
  const headerStore = await getHeadersStore();
  const fromCookie = extractAuthenticatedUserIdFromCookie(headerStore.get("cookie"));
  if (fromCookie) {
    return fromCookie;
  }

  if (process.env.ALLOW_HEADER_AUTH === "true") {
    const fromHeaders = extractAuthenticatedUserIdFromHeaders({
      ...Object.fromEntries(AUTH_ID_HEADERS.map((name) => [name, headerStore.get(name)])),
      authorization: headerStore.get("authorization"),
    });

    if (fromHeaders) {
      return fromHeaders;
    }
  }

  throw new Error(
    "Unauthenticated request. Sign in to create a secure session cookie before using this endpoint."
  );
}

export async function requireAuthenticatedSessionUser(): Promise<{
  userId: string;
  email: string;
  role: "reviewer" | "approver";
}> {
  const headerStore = await getHeadersStore();
  const authUser = resolveUserFromSessionCookie(headerStore.get("cookie"));
  if (authUser) {
    return authUser;
  }

  throw new Error(
    "Unauthenticated request. Sign in to create a secure session cookie before using this endpoint."
  );
}
