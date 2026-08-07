/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("node:fs");
const path = require("node:path");

function getStoreFilePath() {
  return process.env.BILLING_STORE_FILE || path.resolve(/*turbopackIgnore: true*/ __dirname, "..", ".data", "app-store.json");
}

function createStoreState() {
  return {
    profiles: {},
    usage: {},
    rateLimits: {},
    history: {},
    users: {},
    sessions: {},
    authTokens: {},
    voiceStudio: {
      versionsByUser: {},
      pronunciationByUser: {},
    },
  };
}

function ensureStoreFile() {
  const storeFile = getStoreFilePath();
  const dir = path.dirname(storeFile);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(storeFile)) {
    fs.writeFileSync(storeFile, JSON.stringify(createStoreState(), null, 2));
  }
}

function readStore() {
  ensureStoreFile();
  const storeFile = getStoreFilePath();
  const raw = fs.readFileSync(storeFile, "utf8");
  try {
    const parsed = JSON.parse(raw);
    return {
      profiles: parsed.profiles ?? {},
      usage: parsed.usage ?? {},
      rateLimits: parsed.rateLimits ?? {},
      history: parsed.history ?? {},
      users: parsed.users ?? {},
      sessions: parsed.sessions ?? {},
      authTokens: parsed.authTokens ?? {},
      voiceStudio: {
        versionsByUser: parsed.voiceStudio?.versionsByUser ?? {},
        pronunciationByUser: parsed.voiceStudio?.pronunciationByUser ?? {},
      },
    };
  } catch {
    const fresh = createStoreState();
    fs.writeFileSync(getStoreFilePath(), JSON.stringify(fresh, null, 2));
    return fresh;
  }
}

function getVoiceVersions(appUserId) {
  const store = getStore();
  return store.voiceStudio?.versionsByUser?.[appUserId] ?? [];
}

function saveVoiceVersion(appUserId, version) {
  const store = getStore();
  if (!store.voiceStudio) {
    store.voiceStudio = { versionsByUser: {}, pronunciationByUser: {} };
  }
  const existing = store.voiceStudio.versionsByUser[appUserId] ?? [];
  store.voiceStudio.versionsByUser[appUserId] = [version, ...existing].slice(0, 60);
  writeStore(store);
  return version;
}

function patchVoiceVersion(appUserId, versionId, updater) {
  const store = getStore();
  const versions = store.voiceStudio?.versionsByUser?.[appUserId] ?? [];
  const index = versions.findIndex((item) => item.id === versionId);
  if (index < 0) {
    return undefined;
  }

  const next = {
    ...versions[index],
    ...updater,
  };
  versions[index] = next;
  store.voiceStudio.versionsByUser[appUserId] = versions;
  writeStore(store);
  return next;
}

function getPronunciationEntries(appUserId) {
  const store = getStore();
  return store.voiceStudio?.pronunciationByUser?.[appUserId] ?? [];
}

function upsertPronunciationEntry(appUserId, entry) {
  const store = getStore();
  if (!store.voiceStudio) {
    store.voiceStudio = { versionsByUser: {}, pronunciationByUser: {} };
  }

  const entries = store.voiceStudio.pronunciationByUser[appUserId] ?? [];
  const index = entries.findIndex((item) => item.id === entry.id);

  if (index >= 0) {
    entries[index] = { ...entries[index], ...entry };
  } else {
    entries.unshift(entry);
  }

  store.voiceStudio.pronunciationByUser[appUserId] = entries.slice(0, 300);
  writeStore(store);
  return entry;
}

function deletePronunciationEntry(appUserId, entryId) {
  const store = getStore();
  const entries = store.voiceStudio?.pronunciationByUser?.[appUserId] ?? [];
  const next = entries.filter((entry) => entry.id !== entryId);
  store.voiceStudio.pronunciationByUser[appUserId] = next;
  writeStore(store);
}

function writeStore(store) {
  ensureStoreFile();
  fs.writeFileSync(getStoreFilePath(), JSON.stringify(store, null, 2));
}

function getStore() {
  const store = readStore();
  return store;
}

function normalizeProfile(profile) {
  return {
    appUserId: profile.appUserId,
    stripeCustomerId: profile.stripeCustomerId,
    email: profile.email,
    subscriptionId: profile.subscriptionId,
    subscriptionStatus: profile.subscriptionStatus,
    plan: profile.plan,
    cycle: profile.cycle,
    currentPeriodEnd: profile.currentPeriodEnd,
  };
}

function getBillingProfileByUserId(appUserId) {
  return getStore().profiles[appUserId];
}

function getBillingProfileByCustomerId(customerId) {
  const store = getStore();
  const profiles = Object.values(store.profiles ?? {});
  return profiles.find((profile) => profile.stripeCustomerId === customerId);
}

function upsertBillingProfile(profile) {
  const normalized = normalizeProfile(profile);
  const store = getStore();
  store.profiles[normalized.appUserId] = normalized;
  writeStore(store);
  return normalized;
}

function getMonthlyUsage(appUserId) {
  const store = getStore();
  return store.usage[appUserId] ?? { monthKey: "", requestCount: 0 };
}

function setMonthlyUsage(appUserId, monthKey, requestCount) {
  const store = getStore();
  store.usage[appUserId] = { monthKey, requestCount };
  writeStore(store);
}

function getRateLimitTimestamps(appUserId) {
  const store = getStore();
  return store.rateLimits[appUserId] ?? [];
}

function setRateLimitTimestamps(appUserId, timestamps) {
  const store = getStore();
  store.rateLimits[appUserId] = timestamps;
  writeStore(store);
}

function savePromptHistoryEntry(entry) {
  const store = getStore();
  const entries = store.history[entry.appUserId] ?? [];
  store.history[entry.appUserId] = [{ ...entry }, ...entries].slice(0, 10);
  writeStore(store);
}

function getPromptHistory(appUserId) {
  const store = getStore();
  return store.history[appUserId] ?? [];
}

function getUserById(userId) {
  const store = getStore();
  return store.users[userId];
}

function getUserByEmail(email) {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  if (!normalizedEmail) {
    return undefined;
  }

  const store = getStore();
  const users = Object.values(store.users ?? {});
  return users.find((user) => user.email === normalizedEmail);
}

function listUsers() {
  const store = getStore();
  return Object.values(store.users ?? {});
}

function saveUser(user) {
  const store = getStore();
  store.users[user.id] = { ...user };
  writeStore(store);
  return store.users[user.id];
}

function patchUser(userId, updates) {
  const store = getStore();
  const existing = store.users[userId];
  if (!existing) {
    return undefined;
  }

  store.users[userId] = {
    ...existing,
    ...updates,
  };
  writeStore(store);
  return store.users[userId];
}

function saveSession(session) {
  const store = getStore();
  store.sessions[session.id] = { ...session };
  writeStore(store);
  return store.sessions[session.id];
}

function getSession(sessionId) {
  const store = getStore();
  return store.sessions[sessionId];
}

function deleteSession(sessionId) {
  const store = getStore();
  if (store.sessions[sessionId]) {
    delete store.sessions[sessionId];
    writeStore(store);
  }
}

function saveAuthToken(record) {
  const store = getStore();
  store.authTokens[record.id] = { ...record };
  writeStore(store);
  return store.authTokens[record.id];
}

function getAuthTokenByHash(type, tokenHash) {
  const store = getStore();
  const tokens = Object.values(store.authTokens ?? {});
  return tokens.find((token) => token.type === type && token.tokenHash === tokenHash);
}

function deleteAuthToken(tokenId) {
  const store = getStore();
  if (store.authTokens[tokenId]) {
    delete store.authTokens[tokenId];
    writeStore(store);
  }
}

function deleteAuthTokensByUserAndType(userId, type) {
  const store = getStore();
  let touched = false;
  for (const [tokenId, token] of Object.entries(store.authTokens ?? {})) {
    if (token.userId === userId && token.type === type) {
      delete store.authTokens[tokenId];
      touched = true;
    }
  }
  if (touched) {
    writeStore(store);
  }
}

module.exports = {
  getBillingProfileByUserId,
  getBillingProfileByCustomerId,
  upsertBillingProfile,
  getMonthlyUsage,
  setMonthlyUsage,
  getRateLimitTimestamps,
  setRateLimitTimestamps,
  savePromptHistoryEntry,
  getPromptHistory,
  getUserById,
  getUserByEmail,
  listUsers,
  saveUser,
  patchUser,
  saveSession,
  getSession,
  deleteSession,
  saveAuthToken,
  getAuthTokenByHash,
  deleteAuthToken,
  deleteAuthTokensByUserAndType,
  getVoiceVersions,
  saveVoiceVersion,
  patchVoiceVersion,
  getPronunciationEntries,
  upsertPronunciationEntry,
  deletePronunciationEntry,
};
