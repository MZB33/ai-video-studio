import { getPromptHistory as getPromptHistoryDb, savePromptHistoryEntry as savePromptHistoryEntryDb } from "./db-store.ts";

export type PromptHistoryEntry = {
  id: string;
  appUserId: string;
  story: string;
  createdAt: string;
  result: string[];
};

export function savePromptHistoryEntry(entry: PromptHistoryEntry): PromptHistoryEntry {
  savePromptHistoryEntryDb(entry);
  return entry;
}

export function getPromptHistory(appUserId: string): PromptHistoryEntry[] {
  return getPromptHistoryDb(appUserId);
}
