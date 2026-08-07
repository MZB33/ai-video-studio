"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";

const FONTS = [
  "Georgia, serif",
  "Times New Roman, serif",
  "Trebuchet MS, sans-serif",
  "Verdana, sans-serif",
  "Courier New, monospace",
  "Lucida Console, monospace",
  "Palatino, serif",
  "Garamond, serif",
  "Tahoma, sans-serif",
  "Segoe UI, sans-serif",
];

export default function FontPickerPage() {
  const router = useRouter();
  const [font, setFont] = useState(FONTS[0]);
  const [text, setText] = useState("Design is intelligence made visible.");

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding: "1rem 1rem 80px 1rem" }}>
      <div style={{ marginBottom: "1.5rem", paddingTop: "1rem" }}>
        <button onClick={() => router.back()} style={{ background: "rgba(255,255,255,0.2)", border: "none", padding: "8px 16px", borderRadius: 40, color: "white", cursor: "pointer", marginBottom: "1rem" }}>← Back</button>
        <h1 style={{ color: "white", margin: 0, fontSize: "1.8rem" }}>🔤 Font Picker</h1>
        <p style={{ color: "rgba(255,255,255,0.8)", marginTop: "0.25rem" }}>Preview typography combinations instantly</p>
      </div>

      <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: 24, padding: "1.5rem", maxWidth: 900, margin: "0 auto" }}>
        <label style={{ display: "flex", flexDirection: "column", gap: 6, fontWeight: 700, marginBottom: "1rem" }}>
          Preview text
          <textarea
            value={text}
            onChange={(event) => setText(event.target.value)}
            rows={3}
            style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: 14, padding: "0.8rem", resize: "vertical" }}
          />
        </label>

        <div style={{ display: "grid", gap: 10 }}>
          {FONTS.map((fontName) => (
            <button
              key={fontName}
              onClick={() => setFont(fontName)}
              style={{
                border: `1px solid ${font === fontName ? "#4f46e5" : "#e2e8f0"}`,
                borderRadius: 14,
                padding: "0.8rem",
                textAlign: "left",
                background: font === fontName ? "#eef2ff" : "white",
                cursor: "pointer",
              }}
            >
              <div style={{ fontSize: "0.8rem", color: "#64748b", marginBottom: 4, fontFamily: "monospace" }}>{fontName}</div>
              <div style={{ fontFamily: fontName, fontSize: "1.2rem", color: "#0f172a" }}>{text}</div>
            </button>
          ))}
        </div>

        <div style={{ marginTop: "1rem", borderRadius: 14, border: "1px solid #e2e8f0", padding: "1rem", background: "#f8fafc" }}>
          <div style={{ fontSize: "0.8rem", color: "#64748b", marginBottom: 5 }}>Selected font stack</div>
          <div style={{ fontFamily: "monospace" }}>{font}</div>
        </div>
      </div>

      <BottomNav active="tools" onNavigate={(href) => router.push(href)} />
    </div>
  );
}
