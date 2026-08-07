"use client";

import { useRouter } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";

export default function NanoBananaProFreePage() {
  const router = useRouter();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "1rem 1rem 80px 1rem",
      }}
    >
      <div style={{ marginBottom: "1.5rem", paddingTop: "1rem" }}>
        <button
          onClick={() => router.back()}
          style={{
            background: "rgba(255,255,255,0.2)",
            border: "none",
            padding: "8px 16px",
            borderRadius: 40,
            color: "white",
            cursor: "pointer",
            marginBottom: "1rem",
          }}
        >
          ← Back
        </button>
        <h1 style={{ color: "white", margin: 0, fontSize: "1.8rem" }}>🍌 NANO BANANA PRO FREE</h1>
        <p style={{ color: "rgba(255,255,255,0.8)", marginTop: "0.25rem" }}>
          Linked from the app as a fast shortcut to the built-in image generator.
        </p>
      </div>

      <div
        style={{
          background: "rgba(255,255,255,0.95)",
          borderRadius: 24,
          padding: "1.5rem",
          maxWidth: 760,
          margin: "0 auto",
        }}
      >
        <p style={{ marginTop: 0, color: "#475569", lineHeight: 1.7 }}>
          This app entry is now linked and can be opened directly from Home and AI Tools.
          Use it as a branded shortcut into the image workflow.
        </p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button
            onClick={() => router.push("/tools/image")}
            style={{
              padding: "0.875rem 1.25rem",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "none",
              borderRadius: 40,
              fontSize: "1rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Open Image Generator
          </button>
          <button
            onClick={() => router.push("/ai-tools")}
            style={{
              padding: "0.875rem 1.25rem",
              background: "white",
              color: "#4f46e5",
              border: "1px solid #c7d2fe",
              borderRadius: 40,
              fontSize: "1rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Browse AI Tools
          </button>
        </div>
      </div>

      <BottomNav active="tools" onNavigate={(href) => router.push(href)} />
    </div>
  );
}