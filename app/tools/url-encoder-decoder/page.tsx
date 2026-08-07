"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";

export default function UrlEncoderDecoderPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [input, setInput] = useState("https://example.com/?q=hello world");

  const computed = useMemo(() => {
    try {
      if (mode === "encode") {
        return { output: encodeURIComponent(input), error: "" };
      }
      return { output: decodeURIComponent(input), error: "" };
    } catch (err) {
      return { output: "", error: err instanceof Error ? err.message : "Invalid input" };
    }
  }, [mode, input]);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #111827 0%, #0f172a 100%)", padding: "1rem 1rem 80px 1rem" }}>
      <div style={{ marginBottom: "1.5rem", paddingTop: "1rem" }}>
        <button onClick={() => router.back()} style={{ background: "rgba(255,255,255,0.16)", border: "none", padding: "8px 16px", borderRadius: 40, color: "white", cursor: "pointer", marginBottom: "1rem" }}>← Back</button>
        <h1 style={{ color: "white", margin: 0, fontSize: "1.8rem" }}>🔗 URL Encoder / Decoder</h1>
        <p style={{ color: "rgba(255,255,255,0.75)", marginTop: "0.25rem" }}>Encode or decode URL-safe text instantly.</p>
      </div>

      <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: 24, padding: "1.5rem", maxWidth: 760, margin: "0 auto" }}>
        <div style={{ display: "grid", gap: "1rem", marginBottom: "1rem" }}>
          <label style={{ display: "flex", flexDirection: "column", gap: 6, fontWeight: 600 }}>
            Mode
            <select
              value={mode}
              onChange={(e) => setMode(e.target.value as "encode" | "decode")}
              style={{ width: "100%", padding: "0.95rem 1rem", borderRadius: 16, border: "1px solid #d1d5db", fontSize: "1rem" }}
            >
              <option value="encode">Encode</option>
              <option value="decode">Decode</option>
            </select>
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: 6, fontWeight: 600 }}>
            Input
            <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={4} style={{ width: "100%", padding: "1rem", borderRadius: 16, border: "1px solid #d1d5db", fontFamily: "monospace", resize: "vertical" }} />
          </label>
        </div>

        {computed.error && <div style={{ marginTop: "1rem", padding: "1rem", borderRadius: 16, background: "#fee2e2", color: "#b91c1c" }}>{computed.error}</div>}

        <div style={{ marginTop: "1.5rem", padding: "1.25rem", borderRadius: 20, background: "#f8fafc", border: "1px solid #e2e8f0", fontFamily: "monospace" }}>
          <div style={{ fontSize: "0.9rem", color: "#4b5563", marginBottom: 8 }}>Output</div>
          <div style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{computed.output || "Output will appear here"}</div>
        </div>
      </div>

      <BottomNav active="tools" onNavigate={(href) => router.push(href)} />
    </div>
  );
}
