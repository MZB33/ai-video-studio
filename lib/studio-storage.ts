export const STORY_STORAGE_KEY = "cs_story";
export const GALLERY_STORAGE_KEY = "cs_gallery";
export const LANGUAGE_STORAGE_KEY = "cs_lang";
export const THEME_STORAGE_KEY = "cs_theme";

export const LANGUAGES = ["en", "ur", "hi", "ar"] as const;
export const THEMES = ["dark", "light", "cinema"] as const;

export type StoredLanguage = (typeof LANGUAGES)[number];
export type StoredTheme = (typeof THEMES)[number];

export interface StoredGalleryItem {
  id?: string;
  url?: string;
  prompt?: string;
  timestamp?: number;
}

export function readStorageValue(key: string): string {
  if (typeof window === "undefined") {
    return "";
  }

  return window.localStorage.getItem(key) ?? "";
}

export function writeStorageValue(key: string, value: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, value);
}

export function readGallery(): StoredGalleryItem[] {
  const raw = readStorageValue(GALLERY_STORAGE_KEY);

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function readLanguage(): StoredLanguage {
  const value = readStorageValue(LANGUAGE_STORAGE_KEY);
  return LANGUAGES.includes(value as StoredLanguage) ? (value as StoredLanguage) : "en";
}

export function readTheme(): StoredTheme {
  const value = readStorageValue(THEME_STORAGE_KEY);
  return THEMES.includes(value as StoredTheme) ? (value as StoredTheme) : "cinema";
}