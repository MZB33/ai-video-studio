"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";

const table = Array.from({ length: 95 }, (_, index) => {
  const code = index + 32;
  return { code, char: String.fromCharCode(code) };
});

export default function AsciiTablePage() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => {
    if (!search.trim()) return table;
    const value = search.trim().toLowerCase();
    return table.filter((entry) => entry.char.toLowerCase() === value || String(entry.code) === value);
  }, [search]);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #111827 0%, #0f172a 100%)", padding: "1rem 1rem 80px 1rem" }}>
      <div style={{ marginBottom: "1.5rem", paddingTop: "1rem" }}>
        <button onClick={() => router.back()} style={{ background: "rgba(255,255,255,0.16)", border: "none", padding: "8px 16px", borderRadius: 40, color: "white", cursor: "pointer", marginBottom: "1rem" }}>← Back</button>
        <h1 style={{ color: "white", margin: 0, fontSize: "1.8rem" }}>🔡 ASCII Table</h1>
        <p style={{ color: "rgba(255,255,255,0.75)", marginTop: "0.25rem" }}>Browse ASCII codes or search by character or numeric code.</p>
      </div>

      <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: 24, padding: "1.5rem", maxWidth: 760, margin: "0 auto" }}>
        <label style={{ display: "flex", flexDirection: "column", gap: 6, fontWeight: 600, marginBottom: "1rem" }}>
          Search character or code
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="A or 65" style={{ width: "100%", padding: "0.95rem 1rem", borderRadius: 16, border: "1px solid #d1d5db", fontFamily: "monospace" }} />
        </label>

        <div style={{ maxHeight: 420, overflow: "auto", borderRadius: 20, border: "1px solid #e5e7eb" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead style={{ position: "sticky", top: 0, background: "#f8fafc" }}>
              <tr>
                <th style={{ padding: "0.9rem 1rem", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>Code</th>
                <th style={{ padding: "0.9rem 1rem", textAlign: "left", borderBottom: "1px solid #e5e7eb" }}>Character</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry) => (
                <tr key={entry.code} style={{ background: "white" }}>
                  <td style={{ padding: "0.75rem 1rem", borderBottom: "1px solid #e5e7eb", fontFamily: "monospace" }}>{entry.code}</td>
                  <td style={{ padding: "0.75rem 1rem", borderBottom: "1px solid #e5e7eb", fontFamily: "monospace" }}>{entry.char}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <BottomNav active="tools" onNavigate={(href) => router.push(href)} />
    </div>
  );
}
