"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";

export default function PercentageCalculatorPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"of" | "is">("of");
  const [value, setValue] = useState("20");
  const [total, setTotal] = useState("150");
  const [percent, setPercent] = useState("15");

  const calculate = () => {
    if (mode === "of") {
      return `${((Number(percent) / 100) * Number(total) || 0).toFixed(2)}`;
    }
    return `${(Number(value) === 0 || Number(total) === 0 ? 0 : (Number(value) / Number(total)) * 100).toFixed(2)}`;
  };

  const result = calculate();

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #5b21b6 0%, #4338ca 100%)", padding: "1rem 1rem 80px 1rem" }}>
      <div style={{ marginBottom: "1.5rem", paddingTop: "1rem" }}>
        <button onClick={() => router.back()} style={{ background: "rgba(255,255,255,0.18)", border: "none", padding: "8px 16px", borderRadius: 40, color: "white", cursor: "pointer", marginBottom: "1rem" }}>
          ← Back
        </button>
        <h1 style={{ color: "white", margin: 0, fontSize: "1.8rem" }}>% Percentage Calculator</h1>
        <p style={{ color: "rgba(255,255,255,0.8)", marginTop: "0.25rem" }}>Convert values and percentages with one simple tool.</p>
      </div>

      <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: 24, padding: "1.5rem", maxWidth: 760, margin: "0 auto" }}>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
          <button
            onClick={() => setMode("of")}
            style={{ flex: 1, padding: "0.9rem 1rem", borderRadius: 16, border: "none", cursor: "pointer", background: mode === "of" ? "#7c3aed" : "#e5e7eb", color: mode === "of" ? "white" : "#111827", fontWeight: 700 }}
          >
            Percentage of Value
          </button>
          <button
            onClick={() => setMode("is")}
            style={{ flex: 1, padding: "0.9rem 1rem", borderRadius: 16, border: "none", cursor: "pointer", background: mode === "is" ? "#7c3aed" : "#e5e7eb", color: mode === "is" ? "white" : "#111827", fontWeight: 700 }}
          >
            Value is Percent
          </button>
        </div>

        {mode === "of" ? (
          <div style={{ display: "grid", gap: "1rem" }}>
            <label style={{ display: "flex", flexDirection: "column", gap: 6, fontWeight: 600 }}>
              Percentage (%)
              <input
                type="number"
                value={percent}
                onChange={(e) => setPercent(e.target.value)}
                placeholder="e.g. 15"
                step="0.01"
                style={{ width: "100%", padding: "0.9rem 1rem", borderRadius: 16, border: "1px solid #d1d5db", fontSize: "1rem" }}
              />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 6, fontWeight: 600 }}>
              Value
              <input
                type="number"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
                placeholder="e.g. 150"
                step="0.01"
                style={{ width: "100%", padding: "0.9rem 1rem", borderRadius: 16, border: "1px solid #d1d5db", fontSize: "1rem" }}
              />
            </label>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "1rem" }}>
            <label style={{ display: "flex", flexDirection: "column", gap: 6, fontWeight: 600 }}>
              Value
              <input
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="e.g. 20"
                step="0.01"
                style={{ width: "100%", padding: "0.9rem 1rem", borderRadius: 16, border: "1px solid #d1d5db", fontSize: "1rem" }}
              />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 6, fontWeight: 600 }}>
              Total value
              <input
                type="number"
                value={total}
                onChange={(e) => setTotal(e.target.value)}
                placeholder="e.g. 150"
                step="0.01"
                style={{ width: "100%", padding: "0.9rem 1rem", borderRadius: 16, border: "1px solid #d1d5db", fontSize: "1rem" }}
              />
            </label>
          </div>
        )}

        <div style={{ marginTop: "1.5rem", padding: "1.25rem", borderRadius: 20, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
          <h2 style={{ margin: 0, fontSize: "1.1rem", marginBottom: "0.75rem" }}>Result</h2>
          <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>
            {mode === "of"
              ? `${percent || 0}% of ${total || 0} = $${result}`
              : `${value || 0} is ${result}% of ${total || 0}`}
          </div>
        </div>
      </div>

      <BottomNav active="tools" onNavigate={(href) => router.push(href)} />
    </div>
  );
}
