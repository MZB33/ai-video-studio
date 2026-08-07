import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  authenticateUser,
  buildSessionCookieAttributes,
  checkLoginAllowed,
  clearFailedLogin,
  createCsrfToken,
  createEmailVerificationToken,
  createPasswordResetToken,
  createSession,
  getCsrfCookieName,
  getCsrfHeaderName,
  createUser,
  extractSessionIdFromCookie,
  getSessionCookieName,
  registerFailedLogin,
  resetPasswordWithToken,
  resolveUserFromSessionCookie,
  revokeSession,
  validateCsrfRequest,
  verifyEmailWithToken,
} from "../lib/auth.ts";

test("creates and authenticates user with hashed password", () => {
  const tempDir = mkdtempSync(path.join(os.tmpdir(), "auth-store-"));
  process.env.BILLING_STORE_FILE = path.join(tempDir, "auth-store.json");

  const created = createUser({
    email: "User@example.com",
    password: "this-is-a-very-strong-password",
  });

  const verification = createEmailVerificationToken("user@example.com");
  verifyEmailWithToken(verification.token);

  const authenticated = authenticateUser({
    email: "user@example.com",
    password: "this-is-a-very-strong-password",
  });

  assert.equal(authenticated.userId, created.userId);
  assert.equal(authenticated.email, "user@example.com");

  rmSync(tempDir, { recursive: true, force: true });
});

test("creates, resolves, and revokes session", () => {
  const tempDir = mkdtempSync(path.join(os.tmpdir(), "auth-store-"));
  process.env.BILLING_STORE_FILE = path.join(tempDir, "auth-store.json");

  const created = createUser({
    email: "session@example.com",
    password: "session-password-12345",
  });

  const session = createSession(created.userId);
  const cookieHeader = `${getSessionCookieName()}=${session.sessionId}; other=value`;

  assert.equal(extractSessionIdFromCookie(cookieHeader), session.sessionId);
  assert.equal(buildSessionCookieAttributes().includes("HttpOnly"), true);
  assert.equal(buildSessionCookieAttributes().includes("SameSite=Strict"), true);

  const resolved = resolveUserFromSessionCookie(cookieHeader);
  assert.equal(resolved?.userId, created.userId);

  revokeSession(session.sessionId);
  const resolvedAfterRevoke = resolveUserFromSessionCookie(cookieHeader);
  assert.equal(resolvedAfterRevoke, undefined);

  rmSync(tempDir, { recursive: true, force: true });
});

test("validates csrf token by matching cookie and header", () => {
  const token = createCsrfToken();
  const request = new Request("http://localhost/api/auth/signin", {
    method: "POST",
    headers: {
      cookie: `${getCsrfCookieName()}=${encodeURIComponent(token)}`,
      [getCsrfHeaderName()]: token,
    },
  });

  assert.doesNotThrow(() => validateCsrfRequest(request));

  const badRequest = new Request("http://localhost/api/auth/signin", {
    method: "POST",
    headers: {
      cookie: `${getCsrfCookieName()}=${encodeURIComponent(token)}`,
      [getCsrfHeaderName()]: "different-token",
    },
  });

  assert.throws(() => validateCsrfRequest(badRequest));
});

test("locks login attempts after repeated failures", () => {
  const email = "lockout@example.com";
  const clientIp = "203.0.113.9";
  const now = Date.now();

  clearFailedLogin({ email, clientIp });

  for (let index = 0; index < 4; index += 1) {
    const state = registerFailedLogin({ email, clientIp, now });
    assert.equal(state.locked, false);
  }

  const lockState = registerFailedLogin({ email, clientIp, now });
  assert.equal(lockState.locked, true);

  const allowed = checkLoginAllowed({ email, clientIp, now });
  assert.equal(allowed.allowed, false);

  clearFailedLogin({ email, clientIp });
});

test("creates and consumes email verification token once", () => {
  const tempDir = mkdtempSync(path.join(os.tmpdir(), "auth-store-"));
  process.env.BILLING_STORE_FILE = path.join(tempDir, "auth-store.json");

  const created = createUser({
    email: "verify@example.com",
    password: "verify-password-12345",
  });

  const verification = createEmailVerificationToken("verify@example.com");
  assert.equal(Boolean(verification.token), true);

  const verified = verifyEmailWithToken(verification.token);
  assert.equal(verified.userId, created.userId);

  assert.throws(() => verifyEmailWithToken(verification.token));

  rmSync(tempDir, { recursive: true, force: true });
});

test("resets password with one-time token", () => {
  const tempDir = mkdtempSync(path.join(os.tmpdir(), "auth-store-"));
  process.env.BILLING_STORE_FILE = path.join(tempDir, "auth-store.json");

  createUser({
    email: "reset@example.com",
    password: "old-password-12345",
  });

  const verification = createEmailVerificationToken("reset@example.com");
  verifyEmailWithToken(verification.token);

  const reset = createPasswordResetToken("reset@example.com");
  const resetResult = resetPasswordWithToken({
    token: reset.token,
    password: "new-password-67890",
  });
  assert.equal(resetResult.email, "reset@example.com");

  const authenticated = authenticateUser({
    email: "reset@example.com",
    password: "new-password-67890",
  });
  assert.equal(authenticated.email, "reset@example.com");

  assert.throws(() => resetPasswordWithToken({ token: reset.token, password: "another-password-12345" }));

  rmSync(tempDir, { recursive: true, force: true });
});
