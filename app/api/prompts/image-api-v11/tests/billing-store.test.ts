import assert from "node:assert/strict";
import { mkdtempSync, rmSync } from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  checkRateLimit,
  getBillingProfileByUserId,
  getMonthlyUsage,
  incrementUsage,
  upsertBillingProfile,
} from "../lib/billing/store.ts";

delete (globalThis as typeof globalThis & { __billingStore__?: unknown }).__billingStore__;

test("persists billing profiles and usage to disk", () => {
  const tempDir = mkdtempSync(path.join(os.tmpdir(), "billing-store-"));
  process.env.BILLING_STORE_FILE = path.join(tempDir, "billing-store.json");

  const profile = upsertBillingProfile({
    appUserId: "user-1",
    stripeCustomerId: "cus_123",
    plan: "pro",
    cycle: "monthly",
  });

  assert.equal(profile.stripeCustomerId, "cus_123");
  assert.equal(getBillingProfileByUserId("user-1")?.plan, "pro");

  const usage = incrementUsage("user-1");
  assert.equal(usage.requestCount, 1);
  assert.equal(getMonthlyUsage("user-1").requestCount, 1);

  rmSync(tempDir, { recursive: true, force: true });
});

test("enforces a per-minute rate limit", () => {
  const tempDir = mkdtempSync(path.join(os.tmpdir(), "billing-store-"));
  process.env.BILLING_STORE_FILE = path.join(tempDir, "billing-store.json");

  const first = checkRateLimit("user-2", 2, new Date("2026-01-01T00:00:00.000Z"));
  const second = checkRateLimit("user-2", 2, new Date("2026-01-01T00:00:10.000Z"));
  const third = checkRateLimit("user-2", 2, new Date("2026-01-01T00:00:20.000Z"));

  assert.equal(first.allowed, true);
  assert.equal(second.allowed, true);
  assert.equal(third.allowed, false);

  rmSync(tempDir, { recursive: true, force: true });
});
