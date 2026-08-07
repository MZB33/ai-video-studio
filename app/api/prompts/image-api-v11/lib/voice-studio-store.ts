import {
  deletePronunciationEntry,
  getPronunciationEntries,
  getVoiceVersions,
  patchVoiceVersion,
  saveVoiceVersion,
  upsertPronunciationEntry,
  type StoredPronunciationEntry,
  type StoredVoiceVersion,
} from "./db-store.ts";

export type VoiceVersion = StoredVoiceVersion;
export type PronunciationEntry = StoredPronunciationEntry;

export function listVoiceVersions(appUserId: string): VoiceVersion[] {
  return getVoiceVersions(appUserId);
}

export function createVoiceVersion(version: VoiceVersion): VoiceVersion {
  return saveVoiceVersion(version.appUserId, version);
}

export function updateVoiceVersion(
  appUserId: string,
  versionId: string,
  updates: Partial<VoiceVersion>
): VoiceVersion | undefined {
  return patchVoiceVersion(appUserId, versionId, updates);
}

export function listPronunciationEntries(appUserId: string): PronunciationEntry[] {
  return getPronunciationEntries(appUserId);
}

export function savePronunciationEntry(entry: PronunciationEntry): PronunciationEntry {
  return upsertPronunciationEntry(entry.appUserId, entry);
}

export function removePronunciationEntry(appUserId: string, entryId: string): void {
  deletePronunciationEntry(appUserId, entryId);
}
