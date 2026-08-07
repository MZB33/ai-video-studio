import { createHash, pbkdf2Sync, randomBytes, timingSafeEqual } from "node:crypto";
import {
  deleteAuthToken,
  deleteAuthTokensByUserAndType,
  deleteSession,
  getAuthTokenByHash,
  getSession,
  getUserByEmail,
  getUserById,
  listUsers,
  patchUser,
  saveAuthToken,
  saveSession,
  saveUser,
} from "./db-store.ts";

type StoredUser = {
  id: string;
  email: string;
  role?: "reviewer" | "approver";
  passwordHash: string;
  passwordSalt: string;
  passwordIterations: number;
  createdAt: string;
  updatedAt?: string;
};

type StoredSession = {
  id: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
};

type StoredAuthToken = {
  id: string;
  userId: string;
  type: "email_verification" | "password_reset";
  tokenHash: string;
  createdAt: string;
  expiresAt: string;
};

const SESSION_COOKIE_NAME = "prompt-studio-session";
const CSRF_COOKIE_NAME = "prompt-studio-csrf";
const CSRF_HEADER_NAME = "x-csrf-token";
const SESSION_DURATION_MS = 1000 * 60 * 60 * 24 * 14;
const CSRF_DURATION_MS = 1000 * 60 * 60 * 2;
const PASSWORD_ITERATIONS = 210_000;
const PASSWORD_KEYLEN = 64;
const PASSWORD_DIGEST = "sha512";
const LOGIN_WINDOW_MS = 1000 * 60 * 15;
const MAX_FAILED_LOGINS = 5;
const LOGIN_LOCKOUT_MS = 1000 * 60 * 15;
const EMAIL_VERIFICATION_TOKEN_MS = 1000 * 60 * 60 * 24;
const PASSWORD_RESET_TOKEN_MS = 1000 * 60 * 30;

type LoginGuardEntry = {
  firstFailedAt: number;
  count: number;
  lockedUntil?: number;
};

const loginGuard = new Map<string, LoginGuardEntry>();

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function hashPassword(password: string, salt: string, iterations: number): string {
  return pbkdf2Sync(password, salt, iterations, PASSWORD_KEYLEN, PASSWORD_DIGEST).toString("hex");
}

function secureCompare(a: string, b: string): boolean {
  const left = Buffer.from(a, "utf8");
  const right = Buffer.from(b, "utf8");
  if (left.length !== right.length) {
    return false;
  }
  return timingSafeEqual(left, right);
}

export function getSessionCookieName(): string {
  return SESSION_COOKIE_NAME;
}

export function buildSessionCookieValue(sessionId: string): string {
  return encodeURIComponent(sessionId);
}

export function buildSessionCookieAttributes(): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `Path=/; HttpOnly; SameSite=Strict; Max-Age=${Math.floor(SESSION_DURATION_MS / 1000)}${secure}`;
}

export function buildClearedSessionCookieAttributes(): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure}`;
}

export function buildCsrfCookieAttributes(): string {
  const secure = process.env.NODE_ENV === "production" ? "; Secure" : "";
  return `Path=/; HttpOnly; SameSite=Strict; Max-Age=${Math.floor(CSRF_DURATION_MS / 1000)}${secure}`;
}

export function getCsrfCookieName(): string {
  return CSRF_COOKIE_NAME;
}

export function getCsrfHeaderName(): string {
  return CSRF_HEADER_NAME;
}

export function createCsrfToken(): string {
  return randomBytes(24).toString("hex");
}

export function readCsrfTokenFromCookie(cookieHeader: string | null | undefined): string | undefined {
  return parseCookie(cookieHeader, CSRF_COOKIE_NAME);
}

export function validateCsrfRequest(req: Request): void {
  const cookieToken = readCsrfTokenFromCookie(req.headers.get("cookie"));
  const headerToken = req.headers.get(CSRF_HEADER_NAME) ?? "";

  if (!cookieToken || !headerToken || !secureCompare(cookieToken, headerToken)) {
    throw new Error("Invalid CSRF token");
  }
}

function parseCookie(cookieHeader: string | null | undefined, name: string): string | undefined {
  if (!cookieHeader) {
    return undefined;
  }

  const cookies = cookieHeader.split(";").map((entry) => entry.trim());
  for (const cookie of cookies) {
    const [cookieName, ...rest] = cookie.split("=");
    if (cookieName === name && rest.length > 0) {
      return decodeURIComponent(rest.join("="));
    }
  }

  return undefined;
}

export function extractSessionIdFromCookie(cookieHeader: string | null | undefined): string | undefined {
  return parseCookie(cookieHeader, SESSION_COOKIE_NAME);
}

export function createUser(args: { email: string; password: string }): { userId: string; email: string } {
  const email = normalizeEmail(args.email);
  if (!email) {
    throw new Error("Email is required");
  }

  if (args.password.length < 12) {
    throw new Error("Password must be at least 12 characters long");
  }

  if (getUserByEmail(email)) {
    throw new Error("An account with that email already exists");
  }

  const salt = randomBytes(16).toString("hex");
  const passwordHash = hashPassword(args.password, salt, PASSWORD_ITERATIONS);
  const userId = `user_${randomBytes(12).toString("hex")}`;
  const createdAt = new Date().toISOString();

  const user: StoredUser = {
    id: userId,
    email,
    role: listUsers().length === 0 ? "approver" : "reviewer",
    passwordHash,
    passwordSalt: salt,
    passwordIterations: PASSWORD_ITERATIONS,
    createdAt,
    updatedAt: createdAt,
  };

  saveUser(user);
  return { userId: user.id, email: user.email };
}

function createOneTimeToken(args: { userId: string; type: StoredAuthToken["type"]; durationMs: number }): { token: string; expiresAt: string } {
  const now = Date.now();
  const token = randomBytes(32).toString("hex");
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const expiresAt = new Date(now + args.durationMs).toISOString();

  deleteAuthTokensByUserAndType(args.userId, args.type);
  saveAuthToken({
    id: `tok_${randomBytes(10).toString("hex")}`,
    userId: args.userId,
    type: args.type,
    tokenHash,
    createdAt: new Date(now).toISOString(),
    expiresAt,
  });

  return { token, expiresAt };
}

function findValidToken(type: StoredAuthToken["type"], token: string): StoredAuthToken {
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const record = getAuthTokenByHash(type, tokenHash);
  if (!record) {
    throw new Error("Invalid or expired token");
  }

  const expiry = Date.parse(record.expiresAt);
  if (!Number.isFinite(expiry) || expiry <= Date.now()) {
    deleteAuthToken(record.id);
    throw new Error("Invalid or expired token");
  }

  return record;
}

export function createEmailVerificationToken(email: string): { token: string; expiresAt: string } {
  const normalizedEmail = normalizeEmail(email);
  const user = getUserByEmail(normalizedEmail);
  if (!user) {
    throw new Error("Account not found");
  }

  return createOneTimeToken({
    userId: user.id,
    type: "email_verification",
    durationMs: EMAIL_VERIFICATION_TOKEN_MS,
  });
}

export function verifyEmailWithToken(token: string): { userId: string; email: string } {
  const record = findValidToken("email_verification", token);
  const user = getUserById(record.userId);
  if (!user) {
    deleteAuthToken(record.id);
    throw new Error("Invalid or expired token");
  }

  const nowIso = new Date().toISOString();
  patchUser(user.id, {
    emailVerifiedAt: nowIso,
    updatedAt: nowIso,
  });
  deleteAuthToken(record.id);

  return { userId: user.id, email: user.email };
}

export function createPasswordResetToken(email: string): { token: string; expiresAt: string } {
  const normalizedEmail = normalizeEmail(email);
  const user = getUserByEmail(normalizedEmail);
  if (!user) {
    throw new Error("Account not found");
  }

  return createOneTimeToken({
    userId: user.id,
    type: "password_reset",
    durationMs: PASSWORD_RESET_TOKEN_MS,
  });
}

export function resetPasswordWithToken(args: { token: string; password: string }): { userId: string; email: string } {
  if (args.password.length < 12) {
    throw new Error("Password must be at least 12 characters long");
  }

  const record = findValidToken("password_reset", args.token);
  const user = getUserById(record.userId);
  if (!user) {
    deleteAuthToken(record.id);
    throw new Error("Invalid or expired token");
  }

  const salt = randomBytes(16).toString("hex");
  const passwordHash = hashPassword(args.password, salt, PASSWORD_ITERATIONS);
  const nowIso = new Date().toISOString();

  patchUser(user.id, {
    passwordHash,
    passwordSalt: salt,
    passwordIterations: PASSWORD_ITERATIONS,
    updatedAt: nowIso,
  });

  deleteAuthToken(record.id);
  return { userId: user.id, email: user.email };
}

export function authenticateUser(args: { email: string; password: string }): { userId: string; email: string } {
  const email = normalizeEmail(args.email);
  const user = getUserByEmail(email);
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const hash = hashPassword(args.password, user.passwordSalt, user.passwordIterations);
  if (!secureCompare(hash, user.passwordHash)) {
    throw new Error("Invalid email or password");
  }

  if (!user.emailVerifiedAt) {
    throw new Error("Email is not verified. Verify your email before signing in.");
  }

  return { userId: user.id, email: user.email };
}

function createLoginGuardKey(email: string, clientIp: string): string {
  const normalizedEmail = normalizeEmail(email);
  const normalizedIp = (clientIp || "unknown").trim().toLowerCase();
  return createHash("sha256").update(`${normalizedEmail}|${normalizedIp}`).digest("hex");
}

export function checkLoginAllowed(args: { email: string; clientIp: string; now?: number }): { allowed: boolean; retryAfterSeconds?: number } {
  const now = args.now ?? Date.now();
  const key = createLoginGuardKey(args.email, args.clientIp);
  const entry = loginGuard.get(key);

  if (!entry) {
    return { allowed: true };
  }

  if (entry.lockedUntil && entry.lockedUntil > now) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(Math.ceil((entry.lockedUntil - now) / 1000), 1),
    };
  }

  if (now - entry.firstFailedAt > LOGIN_WINDOW_MS) {
    loginGuard.delete(key);
    return { allowed: true };
  }

  return { allowed: true };
}

export function registerFailedLogin(args: { email: string; clientIp: string; now?: number }): { locked: boolean; retryAfterSeconds?: number } {
  const now = args.now ?? Date.now();
  const key = createLoginGuardKey(args.email, args.clientIp);
  const entry = loginGuard.get(key);

  if (!entry || now - entry.firstFailedAt > LOGIN_WINDOW_MS) {
    loginGuard.set(key, { firstFailedAt: now, count: 1 });
    return { locked: false };
  }

  const nextCount = entry.count + 1;
  if (nextCount >= MAX_FAILED_LOGINS) {
    const lockedUntil = now + LOGIN_LOCKOUT_MS;
    loginGuard.set(key, {
      firstFailedAt: entry.firstFailedAt,
      count: nextCount,
      lockedUntil,
    });
    return {
      locked: true,
      retryAfterSeconds: Math.max(Math.ceil((lockedUntil - now) / 1000), 1),
    };
  }

  loginGuard.set(key, {
    firstFailedAt: entry.firstFailedAt,
    count: nextCount,
  });
  return { locked: false };
}

export function clearFailedLogin(args: { email: string; clientIp: string }): void {
  const key = createLoginGuardKey(args.email, args.clientIp);
  loginGuard.delete(key);
}

export function createSession(userId: string): { sessionId: string; expiresAt: string } {
  const user = getUserById(userId);
  if (!user) {
    throw new Error("Invalid user");
  }

  const sessionId = randomBytes(32).toString("hex");
  const now = Date.now();
  const expiresAt = new Date(now + SESSION_DURATION_MS).toISOString();

  const session: StoredSession = {
    id: sessionId,
    userId,
    createdAt: new Date(now).toISOString(),
    expiresAt,
  };

  saveSession(session);
  return { sessionId, expiresAt };
}

export function revokeSession(sessionId: string): void {
  if (!sessionId) {
    return;
  }
  deleteSession(sessionId);
}

export function resolveUserFromSessionCookie(
  cookieHeader: string | null | undefined
): { userId: string; email: string; role: "reviewer" | "approver" } | undefined {
  const sessionId = extractSessionIdFromCookie(cookieHeader);
  if (!sessionId) {
    return undefined;
  }

  const session = getSession(sessionId);
  if (!session) {
    return undefined;
  }

  const expiry = Date.parse(session.expiresAt);
  if (!Number.isFinite(expiry) || expiry <= Date.now()) {
    deleteSession(sessionId);
    return undefined;
  }

  const user = getUserById(session.userId);
  if (!user) {
    deleteSession(sessionId);
    return undefined;
  }

  return { userId: user.id, email: user.email, role: user.role ?? "reviewer" };
}

export function hashSessionIdForTelemetry(sessionId: string): string {
  return createHash("sha256").update(sessionId).digest("hex");
}
