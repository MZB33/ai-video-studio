"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";
import {
  LANGUAGES,
  THEMES,
  readGallery,
  readLanguage,
  readStorageValue,
  readTheme,
  STORY_STORAGE_KEY,
  writeStorageValue,
  LANGUAGE_STORAGE_KEY,
  THEME_STORAGE_KEY,
  type StoredLanguage,
  type StoredTheme,
} from "@/lib/studio-storage";

const languageLabels: Record<StoredLanguage, string> = {
  en: "English",
  ur: "Urdu",
  hi: "Hindi",
  ar: "Arabic",
};

const themeLabels: Record<StoredTheme, string> = {
  dark: "Dark",
  light: "Light",
  cinema: "Cinema",
};

export default function ProfilePage() {
  const router = useRouter();
  const [language, setLanguage] = useState<StoredLanguage>(() => readLanguage());
  const [theme, setTheme] = useState<StoredTheme>(() => readTheme());
  const [storyLength] = useState(() => readStorageValue(STORY_STORAGE_KEY).trim().length);
  const [galleryCount] = useState(() => readGallery().length);
  const [savedNotice, setSavedNotice] = useState("");

  useEffect(() => {
    if (!savedNotice) {
      return;
    }

    const timeoutId = window.setTimeout(() => setSavedNotice(""), 1500);
    return () => window.clearTimeout(timeoutId);
  }, [savedNotice]);

  const updateLanguage = (value: StoredLanguage) => {
    setLanguage(value);
    writeStorageValue(LANGUAGE_STORAGE_KEY, value);
    setSavedNotice("Language saved");
  };

  const updateTheme = (value: StoredTheme) => {
    setTheme(value);
    writeStorageValue(THEME_STORAGE_KEY, value);
    setSavedNotice("Theme saved");
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top, #f59e0b 0%, #ea580c 38%, #7c2d12 100%)",
        color: "white",
        padding: "2rem 1rem 96px",
      }}
    >
      <div
        style={{
          maxWidth: 880,
          margin: "0 auto",
          display: "grid",
          gap: "1.25rem",
        }}
      >
        <section
          style={{
            background: "rgba(17, 24, 39, 0.42)",
            backdropFilter: "blur(14px)",
            border: "1px solid rgba(255,255,255,0.14)",
            borderRadius: 28,
            padding: "1.75rem",
            display: "grid",
            gap: "0.75rem",
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 999,
              display: "grid",
              placeItems: "center",
              background: "rgba(255,255,255,0.18)",
              fontSize: "2rem",
            }}
          >
            👤
          </div>
          <div>
            <p style={{ margin: 0, color: "#fed7aa", fontSize: "0.8rem", letterSpacing: "0.18em", textTransform: "uppercase" }}>
              Profile
            </p>
            <h1 style={{ margin: "0.6rem 0 0", fontSize: "2rem" }}>Account hub</h1>
            <p style={{ margin: "0.75rem 0 0", color: "rgba(255,255,255,0.84)", lineHeight: 1.6, maxWidth: 620 }}>
              This page now reflects the app settings already used by the studio, so Profile is a real preferences surface instead of a placeholder.
            </p>
          </div>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "1rem",
          }}
        >
          {[
            { label: "Saved language", value: languageLabels[language] },
            { label: "Saved theme", value: themeLabels[theme] },
            { label: "Story length", value: `${storyLength} chars` },
            { label: "Gallery items", value: String(galleryCount) },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                background: "rgba(255,255,255,0.14)",
                border: "1px solid rgba(255,255,255,0.14)",
                borderRadius: 22,
                padding: "1rem 1.1rem",
              }}
            >
              <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.72)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                {item.label}
              </div>
              <div style={{ marginTop: "0.45rem", fontSize: "1rem", fontWeight: 600 }}>{item.value}</div>
            </div>
          ))}
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1rem",
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.14)",
              border: "1px solid rgba(255,255,255,0.14)",
              borderRadius: 24,
              padding: "1.25rem",
              display: "grid",
              gap: "0.8rem",
            }}
          >
            <div>
              <div style={{ fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.72)" }}>
                Language preference
              </div>
              <div style={{ marginTop: "0.3rem", fontWeight: 700 }}>{languageLabels[language]}</div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
              {LANGUAGES.map((option) => (
                <button
                  key={option}
                  onClick={() => updateLanguage(option)}
                  style={{
                    background: language === option ? "#fff7ed" : "rgba(255,255,255,0.12)",
                    color: language === option ? "#9a3412" : "white",
                    border: "1px solid rgba(255,255,255,0.18)",
                    borderRadius: 999,
                    padding: "0.65rem 0.9rem",
                    cursor: "pointer",
                    fontWeight: 700,
                  }}
                >
                  {languageLabels[option]}
                </button>
              ))}
            </div>
          </div>

          <div
            style={{
              background: "rgba(255,255,255,0.14)",
              border: "1px solid rgba(255,255,255,0.14)",
              borderRadius: 24,
              padding: "1.25rem",
              display: "grid",
              gap: "0.8rem",
            }}
          >
            <div>
              <div style={{ fontSize: "0.78rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.72)" }}>
                Theme preference
              </div>
              <div style={{ marginTop: "0.3rem", fontWeight: 700 }}>{themeLabels[theme]}</div>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.6rem" }}>
              {THEMES.map((option) => (
                <button
                  key={option}
                  onClick={() => updateTheme(option)}
                  style={{
                    background: theme === option ? "#fde68a" : "rgba(255,255,255,0.12)",
                    color: theme === option ? "#78350f" : "white",
                    border: "1px solid rgba(255,255,255,0.18)",
                    borderRadius: 999,
                    padding: "0.65rem 0.9rem",
                    cursor: "pointer",
                    fontWeight: 700,
                  }}
                >
                  {themeLabels[option]}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section
          style={{
            background: "rgba(17, 24, 39, 0.38)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.14)",
            borderRadius: 24,
            padding: "1.25rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem",
            flexWrap: "wrap",
          }}
        >
          <div>
            <div style={{ fontWeight: 700 }}>Preferences sync to the studio</div>
            <div style={{ marginTop: "0.35rem", color: "rgba(255,255,255,0.8)" }}>
              Update them here, then return to Home to keep working with the same saved settings.
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "center", flexWrap: "wrap" }}>
            {savedNotice ? <span style={{ color: "#fde68a", fontWeight: 700 }}>{savedNotice}</span> : null}
            <button
              onClick={() => router.push("/account/billing")}
              style={{
                background: "rgba(255,255,255,0.14)",
                color: "white",
                border: "1px solid rgba(255,255,255,0.24)",
                borderRadius: 999,
                padding: "0.8rem 1rem",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              Open billing
            </button>
            <button
              onClick={() => router.push("/")}
              style={{
                background: "#fff7ed",
                color: "#9a3412",
                border: "none",
                borderRadius: 999,
                padding: "0.8rem 1rem",
                cursor: "pointer",
                fontWeight: 700,
              }}
            >
              Back to studio
            </button>
          </div>
        </section>
      </div>

      <BottomNav active="profile" onNavigate={(href) => router.push(href)} />
    </main>
  );
}