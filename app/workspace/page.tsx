/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";
import {
  readGallery,
  readStorageValue,
  STORY_STORAGE_KEY,
  type StoredGalleryItem,
} from "@/lib/studio-storage";

const actions = [
  {
    title: "Open Studio",
    description: "Return to the cinematic workspace and continue generating scenes.",
    href: "/",
  },
  {
    title: "Browse AI Tools",
    description: "Jump into the full tool library for image, voice, video, and utility workflows.",
    href: "/ai-tools",
  },
  {
    title: "Category Dashboard",
    description: "Explore the category-based dashboard for quick access to the platform sections.",
    href: "/dashboard/home",
  },
];

function formatDate(timestamp?: number) {
  if (!timestamp) {
    return "Recently updated";
  }

  return new Date(timestamp).toLocaleString();
}

export default function WorkspacePage() {
  const router = useRouter();
  const [story] = useState(() => readStorageValue(STORY_STORAGE_KEY));
  const [gallery] = useState<StoredGalleryItem[]>(() => readGallery());

  const trimmedStory = story.trim();
  const storyPreview = trimmedStory || "No saved story yet. Start from Home to create your first cinematic prompt set.";
  const recentShots = gallery.slice(0, 3);
  const latestTimestamp = recentShots[0]?.timestamp;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f172a 0%, #1d4ed8 55%, #22c55e 100%)",
        color: "white",
        padding: "2rem 1rem 96px",
      }}
    >
      <div
        style={{
          maxWidth: 960,
          margin: "0 auto",
          display: "grid",
          gap: "1.5rem",
        }}
      >
        <section
          style={{
            background: "rgba(15, 23, 42, 0.58)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 28,
            padding: "1.75rem",
          }}
        >
          <p style={{ margin: 0, color: "#93c5fd", fontSize: "0.8rem", letterSpacing: "0.18em", textTransform: "uppercase" }}>
            My Work
          </p>
          <h1 style={{ margin: "0.75rem 0 0", fontSize: "2rem" }}>Saved studio work</h1>
          <p style={{ margin: "0.75rem 0 0", color: "rgba(255,255,255,0.82)", maxWidth: 640, lineHeight: 1.6 }}>
            This page now surfaces the story draft and generated gallery already saved by the main studio.
          </p>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "1rem",
          }}
        >
          {[
            { label: "Saved story", value: trimmedStory ? `${trimmedStory.length} chars` : "Empty" },
            { label: "Gallery items", value: String(gallery.length) },
            { label: "Last update", value: formatDate(latestTimestamp) },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 24,
                padding: "1.2rem",
              }}
            >
              <div style={{ fontSize: "0.76rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.72)" }}>
                {item.label}
              </div>
              <div style={{ fontSize: "1.05rem", fontWeight: 700, marginTop: "0.4rem" }}>{item.value}</div>
            </div>
          ))}
        </section>

        <section
          style={{
            background: "rgba(255,255,255,0.12)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 28,
            padding: "1.5rem",
            display: "grid",
            gap: "0.85rem",
          }}
        >
          <div>
            <div style={{ fontSize: "0.8rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#bfdbfe" }}>
              Story draft
            </div>
            <p style={{ margin: "0.75rem 0 0", lineHeight: 1.7, color: "rgba(255,255,255,0.86)" }}>
              {storyPreview}
            </p>
          </div>
          <button
            onClick={() => router.push("/")}
            style={{
              justifySelf: "start",
              background: "#38bdf8",
              color: "#082f49",
              border: "none",
              borderRadius: 999,
              padding: "0.8rem 1.1rem",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Open in studio
          </button>
        </section>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "1rem",
          }}
        >
          {actions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              style={{
                textDecoration: "none",
                color: "inherit",
                background: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 24,
                padding: "1.25rem",
                display: "grid",
                gap: "0.6rem",
                boxShadow: "0 18px 40px rgba(15, 23, 42, 0.22)",
              }}
            >
              <strong style={{ fontSize: "1.05rem" }}>{action.title}</strong>
              <span style={{ color: "rgba(255,255,255,0.78)", lineHeight: 1.5 }}>{action.description}</span>
            </Link>
          ))}
        </section>

        <section
          style={{
            background: "rgba(15, 23, 42, 0.48)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 28,
            padding: "1.5rem",
          }}
        >
          <div style={{ fontSize: "0.8rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "#bbf7d0" }}>
            Recent gallery
          </div>
          {recentShots.length > 0 ? (
            <div
              style={{
                marginTop: "1rem",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "1rem",
              }}
            >
              {recentShots.map((item, index) => (
                <div
                  key={item.id ?? item.url ?? index}
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 22,
                    overflow: "hidden",
                  }}
                >
                  {item.url ? (
                    <img
                      src={item.url}
                      alt={item.prompt || `Saved gallery item ${index + 1}`}
                      style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }}
                    />
                  ) : null}
                  <div style={{ padding: "1rem" }}>
                    <div style={{ fontWeight: 700 }}>Shot {index + 1}</div>
                    <p style={{ margin: "0.5rem 0 0", color: "rgba(255,255,255,0.78)", lineHeight: 1.5 }}>
                      {item.prompt || "Prompt unavailable for this saved image."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ margin: "1rem 0 0", color: "rgba(255,255,255,0.78)" }}>
              No saved images yet. Generate scenes on the home page and they will appear here.
            </p>
          )}
        </section>
      </div>

      <BottomNav active="workspace" onNavigate={(href) => router.push(href)} />
    </main>
  );
}