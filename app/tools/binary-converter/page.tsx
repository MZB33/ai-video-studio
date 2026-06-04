"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";

export default function BinaryConverterPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"binToDec" | "decToBin">("binToDec");
  const [input, setInput] = useState("101101");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const convert = () => {
    try {
      if (mode === "binToDec") {
        if (!/^[01]+$/.test(input.trim())) throw new Error("Enter a valid binary string.");
        setOutput(String(parseInt(input.trim(), 2)));
      } else {
        const value = Number(input);
        if (!Number.isFinite(value)) throw new Error("Enter a valid decimal number.");
        setOutput(value.toString(2));
      }
      setError("");
    } catch (err) {
      setOutput("");
      setError(err instanceof Error ? err.message : "Invalid input");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f172a 0%, #111827 100%)", padding: "1rem 1rem 80px 1rem" }}>
      <div style={{ marginBottom: "1.5rem", paddingTop: "1rem" }}>
        <button onClick={() => router.back()} style={{ background: "rgba(255,255,255,0.16)", border: "none", padding: "8px 16px", borderRadius: 40, color: "white", cursor: "pointer", marginBottom: "1rem" }}>← Back</button>
        <h1 style={{ color: "white", margin: 0, fontSize: "1.8rem" }}>💻 Binary Converter</h1>
        <p style={{ color: "rgba(255,255,255,0.75)", marginTop: "0.25rem" }}>Convert between binary and decimal values.</p>
      </div>

      <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: 24, padding: "1.5rem", maxWidth: 760, margin: "0 auto" }}>
        <div style={{ display: "grid", gap: "1rem", marginBottom: "1rem" }}>
          <label style={{ display: "flex", flexDirection: "column", gap: 6, fontWeight: 600 }}>
            Mode
            <select value={mode} onChange={(e) => setMode(e.target.value as any)} style={{ width: "100%", padding: "0.95rem 1rem", borderRadius: 16, border: "1px solid #d1d5db", fontSize: "1rem" }}>
              <option value="binToDec">Binary → Decimal</option>
              <option value="decToBin">Decimal → Binary</option>
            </select>
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 6, fontWeight: 600 }}>
            Input
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={mode === "binToDec" ? "101101" : "45"} style={{ width: "100%", padding: "0.95rem 1rem", borderRadius: 16, border: "1px solid #d1d5db", fontFamily: "monospace" }} />
          </label>
        </div>

        <button onClick={convert} style={{ width: "100%", padding: "1rem", background: "#2563eb", color: "white", border: "none", borderRadius: 40, fontWeight: 700, cursor: "pointer" }}>Convert</button>

        {error && <div style={{ marginTop: "1rem", padding: "1rem", borderRadius: 16, background: "#fee2e2", color: "#b91c1c" }}>{error}</div>}

        <div style={{ marginTop: "1.5rem", padding: "1.25rem", borderRadius: 20, background: "#f8fafc", border: "1px solid #e2e8f0", fontFamily: "monospace" }}>
          <div style={{ fontSize: "0.9rem", color: "#4b5563", marginBottom: 8 }}>Result</div>
          <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>{output || "Press Convert to view the value"}</div>
        </div>
      </div>

      <BottomNav active="tools" onNavigate={(href) => router.push(href)} />
    </div>
  );
}
