"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";

function randomHex() {
  return `#${Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0")}`;
}

function generatePalette(count = 5) {
  return Array.from({ length: count }, () => randomHex());
}

export default function ColorPalettePage() {
  const router = useRouter();
  const [palette, setPalette] = useState<string[]>(generatePalette());

  const copyPalette = async () => {
    await navigator.clipboard.writeText(palette.join(", "));
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding: "1rem 1rem 80px 1rem" }}>
      <div style={{ marginBottom: "1.5rem", paddingTop: "1rem" }}>
        <button onClick={() => router.back()} style={{ background: "rgba(255,255,255,0.2)", border: "none", padding: "8px 16px", borderRadius: 40, color: "white", cursor: "pointer", marginBottom: "1rem" }}>← Back</button>
        <h1 style={{ color: "white", margin: 0, fontSize: "1.8rem" }}>🎨 Color Palette</h1>
        <p style={{ color: "rgba(255,255,255,0.8)", marginTop: "0.25rem" }}>Generate and copy design-ready palettes</p>
      </div>

      <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: 24, padding: "1.5rem", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: "1rem" }}>
          <button onClick={() => setPalette(generatePalette())} style={{ padding: "0.8rem 1rem", borderRadius: 999, border: "none", background: "#4f46e5", color: "white", fontWeight: 700, cursor: "pointer" }}>
            Generate palette
          </button>
          <button onClick={copyPalette} style={{ padding: "0.8rem 1rem", borderRadius: 999, border: "1px solid #cbd5e1", background: "white", color: "#0f172a", fontWeight: 700, cursor: "pointer" }}>
            Copy all hex
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: 12 }}>
          {palette.map((hex) => (
            <button
              key={hex}
              onClick={() => navigator.clipboard.writeText(hex)}
              style={{ border: "1px solid #e2e8f0", borderRadius: 16, overflow: "hidden", cursor: "pointer", background: "white" }}
            >
              <div style={{ height: 90, background: hex }} />
              <div style={{ padding: "0.7rem", fontFamily: "monospace", fontWeight: 700, color: "#0f172a" }}>{hex}</div>
            </button>
          ))}
        </div>
      </div>

      <BottomNav active="tools" onNavigate={(href) => router.push(href)} />
    </div>
  );
}
