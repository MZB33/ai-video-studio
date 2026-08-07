"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";

export default function RegexTesterPage() {
  const router = useRouter();
  const [pattern, setPattern] = useState("\\d+");
  const [flags, setFlags] = useState("g");
  const [text, setText] = useState("There are 12 apples and 7 oranges.");

  const result = useMemo(() => {
    try {
      const regex = new RegExp(pattern, flags);
      const matches = [...text.matchAll(regex)].map((match) => ({ match: match[0], groups: match.slice(1) }));
      return { matches, error: "" };
    } catch (err) {
      return { matches: [], error: err instanceof Error ? err.message : "Invalid regex" };
    }
  }, [pattern, flags, text]);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #111827 0%, #1f2937 100%)", padding: "1rem 1rem 80px 1rem" }}>
      <div style={{ marginBottom: "1.5rem", paddingTop: "1rem" }}>
        <button onClick={() => router.back()} style={{ background: "rgba(255,255,255,0.16)", border: "none", padding: "8px 16px", borderRadius: 40, color: "white", cursor: "pointer", marginBottom: "1rem" }}>← Back</button>
        <h1 style={{ color: "white", margin: 0, fontSize: "1.8rem" }}>🔎 Regex Tester</h1>
        <p style={{ color: "rgba(255,255,255,0.75)", marginTop: "0.25rem" }}>Test regular expressions against sample text and inspect matches.</p>
      </div>

      <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: 24, padding: "1.5rem", maxWidth: 760, margin: "0 auto" }}>
        <label style={{ display: "flex", flexDirection: "column", gap: 6, fontWeight: 600 }}>
          Pattern
          <input value={pattern} onChange={(e) => setPattern(e.target.value)} placeholder="\\d+" style={{ width: "100%", padding: "0.95rem 1rem", borderRadius: 16, border: "1px solid #d1d5db", fontFamily: "monospace" }} />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: 6, fontWeight: 600, marginTop: "1rem" }}>
          Flags
          <input value={flags} onChange={(e) => setFlags(e.target.value)} placeholder="gimsuy" style={{ width: "100%", padding: "0.95rem 1rem", borderRadius: 16, border: "1px solid #d1d5db", fontFamily: "monospace" }} />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: 6, fontWeight: 600, marginTop: "1rem" }}>
          Text
          <textarea value={text} onChange={(e) => setText(e.target.value)} rows={4} style={{ width: "100%", padding: "1rem", borderRadius: 16, border: "1px solid #d1d5db", fontFamily: "monospace", resize: "vertical" }} />
        </label>

        {result.error && <div style={{ marginTop: "1rem", padding: "1rem", borderRadius: 16, background: "#fee2e2", color: "#b91c1c" }}>{result.error}</div>}

        <div style={{ marginTop: "1.5rem", padding: "1.25rem", borderRadius: 20, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: "0.9rem", color: "#4b5563", marginBottom: 8 }}>Matches</div>
          {result.matches.length ? result.matches.map((item, index) => (
            <div key={index} style={{ marginBottom: index < result.matches.length - 1 ? "1rem" : 0, padding: "0.85rem", borderRadius: 16, background: "white", border: "1px solid #e5e7eb" }}>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>Match #{index + 1}: <span style={{ fontFamily: "monospace" }}>{item.match}</span></div>
              {item.groups.length > 0 && <div style={{ color: "#4b5563", fontSize: "0.9rem" }}>Groups: {item.groups.map((group, idx) => <span key={idx} style={{ marginRight: 8 }}>{idx + 1}: <strong>{group}</strong></span>)}</div>}
            </div>
          )) : <div style={{ color: "#6b7280" }}>No matches found.</div>}
        </div>
      </div>

      <BottomNav active="tools" onNavigate={(href) => router.push(href)} />
    </div>
  );
}
