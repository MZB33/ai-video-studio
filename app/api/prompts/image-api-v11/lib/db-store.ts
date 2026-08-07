import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const store = require("./db-store.cjs");

export function getBillingProfileByUserId(appUserId: string) {
  return store.getBillingProfileByUserId(appUserId);
}

export function getBillingProfileByCustomerId(customerId: string) {
  return store.getBillingProfileByCustomerId(customerId);
}

export function upsertBillingProfile(profile: {
  appUserId: string;
  stripeCustomerId: string;
  email?: string;
  subscriptionId?: string;
  subscriptionStatus?: string;
  plan?: "pro" | "studio" | "business";
  cycle?: "monthly" | "yearly";
  currentPeriodEnd?: number;
}) {
  return store.upsertBillingProfile(profile);
}

export function getMonthlyUsage(appUserId: string) {
  return store.getMonthlyUsage(appUserId);
}

export function setMonthlyUsage(appUserId: string, monthKey: string, requestCount: number) {
  store.setMonthlyUsage(appUserId, monthKey, requestCount);
}

export function getRateLimitTimestamps(appUserId: string) {
  return store.getRateLimitTimestamps(appUserId);
}

export function setRateLimitTimestamps(appUserId: string, timestamps: number[]) {
  store.setRateLimitTimestamps(appUserId, timestamps);
}

export function savePromptHistoryEntry(entry: {
  id: string;
  appUserId: string;
  story: string;
  createdAt: string;
  result: string[];
}) {
  store.savePromptHistoryEntry(entry);
}

export function getPromptHistory(appUserId: string) {
  return store.getPromptHistory(appUserId);
}

export type StoredUser = {
  id: string;
  email: string;
  role?: "reviewer" | "approver";
  passwordHash: string;
  passwordSalt: string;
  passwordIterations: number;
  createdAt: string;
  emailVerifiedAt?: string;
  updatedAt?: string;
};

export type StoredSession = {
  id: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
};

export type StoredAuthToken = {
  id: string;
  userId: string;
  type: "email_verification" | "password_reset";
  tokenHash: string;
  createdAt: string;
  expiresAt: string;
};

export function getUserById(userId: string): StoredUser | undefined {
  return store.getUserById(userId);
}

export function getUserByEmail(email: string): StoredUser | undefined {
  return store.getUserByEmail(email);
}

export function listUsers(): StoredUser[] {
  return store.listUsers();
}

export function saveUser(user: StoredUser): StoredUser {
  return store.saveUser(user);
}

export function patchUser(userId: string, updates: Partial<StoredUser>): StoredUser | undefined {
  return store.patchUser(userId, updates);
}

export function saveSession(session: StoredSession): StoredSession {
  return store.saveSession(session);
}

export function getSession(sessionId: string): StoredSession | undefined {
  return store.getSession(sessionId);
}

export function deleteSession(sessionId: string): void {
  store.deleteSession(sessionId);
}

export function saveAuthToken(record: StoredAuthToken): StoredAuthToken {
  return store.saveAuthToken(record);
}

export function getAuthTokenByHash(type: StoredAuthToken["type"], tokenHash: string): StoredAuthToken | undefined {
  return store.getAuthTokenByHash(type, tokenHash);
}

export function deleteAuthToken(tokenId: string): void {
  store.deleteAuthToken(tokenId);
}

export function deleteAuthTokensByUserAndType(userId: string, type: StoredAuthToken["type"]): void {
  store.deleteAuthTokensByUserAndType(userId, type);
}

export type StoredVoiceVersion = {
  id: string;
  appUserId: string;
  createdAt: string;
  label: "A" | "B" | "Custom";
  status: "candidate" | "approved" | "rejected";
  text: string;
  characterId: string;
  languageCode: string;
  accent: string;
  behaviorId: string;
  useCaseId: string;
  speed: number;
  pitch: number;
  energy: number;
  audioDataUrl: string;
  analytics?: {
    durationSeconds: number;
    sampleRate: number;
    peakDbfs: number;
    rmsDbfs: number;
    estimatedLufs: number;
    crestFactorDb: number;
    waveformPoints: number[];
    recommendedRange: {
      peakDbfsMax: number;
      rmsDbfsMin: number;
      rmsDbfsMax: number;
      estimatedLufsMin: number;
      estimatedLufsMax: number;
    };
  };
  renderPrompt: string;
  approvalNotes?: string;
  approvalRole?: "reviewer" | "approver";
  approvalActor?: string;
  auditTrail?: Array<{
    at: string;
    actorRole: "reviewer" | "approver";
    actorName: string;
    action: "created" | "status_changed" | "note_updated";
    status: "candidate" | "approved" | "rejected";
    notes?: string;
  }>;
};

export type StoredPronunciationEntry = {
  id: string;
  appUserId: string;
  languageCode: string;
  accent: string;
  term: string;
  phoneme: string;
  replacement: string;
  notes?: string;
  updatedAt: string;
};

export function getVoiceVersions(appUserId: string): StoredVoiceVersion[] {
  return store.getVoiceVersions(appUserId);
}

export function saveVoiceVersion(appUserId: string, version: StoredVoiceVersion): StoredVoiceVersion {
  return store.saveVoiceVersion(appUserId, version);
}

export function patchVoiceVersion(
  appUserId: string,
  versionId: string,
  updater: Partial<StoredVoiceVersion>
): StoredVoiceVersion | undefined {
  return store.patchVoiceVersion(appUserId, versionId, updater);
}

export function getPronunciationEntries(appUserId: string): StoredPronunciationEntry[] {
  return store.getPronunciationEntries(appUserId);
}

export function upsertPronunciationEntry(
  appUserId: string,
  entry: StoredPronunciationEntry
): StoredPronunciationEntry {
  return store.upsertPronunciationEntry(appUserId, entry);
}

export function deletePronunciationEntry(appUserId: string, entryId: string): void {
  store.deletePronunciationEntry(appUserId, entryId);
}
