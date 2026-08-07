import assert from "node:assert/strict";
import test from "node:test";
import {
  extractAuthenticatedUserIdFromCookie,
  extractAuthenticatedUserIdFromHeaders,
} from "../lib/billing/identity.ts";

test("extracts a user id from auth headers and session cookies", () => {
  const fromHeaders = extractAuthenticatedUserIdFromHeaders({
    "x-user-id": "alice",
    authorization: "Bearer token-123",
  } as Record<string, string | undefined>);

  const fromCookie = extractAuthenticatedUserIdFromCookie("prompt-studio-user-id=carol; other=value");
  const fromSessionCookie = extractAuthenticatedUserIdFromCookie("prompt-studio-session=session-1; other=value");

  assert.equal(fromHeaders, "alice");
  assert.equal(fromCookie, "carol");
  assert.equal(fromSessionCookie, undefined);
});
