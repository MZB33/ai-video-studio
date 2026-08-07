import { createHash } from "node:crypto";

export const MONITORING_ADMIN_COOKIE = "monitoring_admin_session";

export function hashAdminSecret(secret: string) {
  return createHash("sha256").update(secret).digest("hex");
}

export function getMonitoringAdminSecret() {
  return process.env.MONITORING_ADMIN_PASSWORD || "";
}

export function getExpectedMonitoringAdminSession() {
  const secret = getMonitoringAdminSecret();
  return secret ? hashAdminSecret(secret) : "";
}