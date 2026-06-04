"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";

const parseNumbers = (input: string) => {
  return input.split(/[,\s]+/).map((value) => Number(value)).filter((n) => !Number.isNaN(n));
};

export default function StatisticsCalculatorPage() {
  const router = useRouter();
  const [data, setData] = useState("12 7 3 14 9 10 6");
  const numbers = useMemo(() => parseNumbers(data), [data]);

  const mean = numbers.length ? numbers.reduce((sum, n) => sum + n, 0) / numbers.length : 0;
  const sorted = [...numbers].sort((a, b) => a - b);
  const median = numbers.length ? (sorted.length % 2 === 1 ? sorted[(sorted.length - 1) / 2] : (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2) : 0;
  const mode = numbers.length ? (() => {
    const freq = new Map<number, number>();
    let maxCount = 0;
    let modeValue = numbers[0];
    for (const n of numbers) {
      const count = (freq.get(n) || 0) + 1;
      freq.set(n, count);
      if (count > maxCount) { maxCount = count; modeValue = n; }
    }
    return maxCount > 1 ? modeValue : NaN;
  })() : NaN;
  const variance = numbers.length ? numbers.reduce((sum, n) => sum + Math.pow(n - mean, 2), 0) / numbers.length : 0;
  const stddev = Math.sqrt(variance);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)", padding: "1rem 1rem 80px 1rem" }}>
      <div style={{ marginBottom: "1.5rem", paddingTop: "1rem" }}>
        <button onClick={() => router.back()} style={{ background: "rgba(255,255,255,0.16)", border: "none", padding: "8px 16px", borderRadius: 40, color: "white", cursor: "pointer", marginBottom: "1rem" }}>← Back</button>
        <h1 style={{ color: "white", margin: 0, fontSize: "1.8rem" }}>📊 Statistics Calculator</h1>
        <p style={{ color: "rgba(255,255,255,0.75)", marginTop: "0.25rem" }}>Compute mean, median, mode, variance, and standard deviation instantly.</p>
      </div>

      <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: 24, padding: "1.5rem", maxWidth: 760, margin: "0 auto" }}>
        <label style={{ display: "block", fontWeight: 600, marginBottom: "0.75rem" }}>Data set</label>
        <textarea
          value={data}
          onChange={(e) => setData(e.target.value)}
          rows={3}
          placeholder="Enter numbers separated by spaces or commas"
          style={{ width: "100%", padding: "1rem", borderRadius: 16, border: "1px solid #d1d5db", fontSize: "1rem", fontFamily: "monospace", resize: "vertical" }}
        />

        <div style={{ marginTop: "1.5rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
          <div style={{ background: "white", borderRadius: 16, padding: "1rem", boxShadow: "0 10px 25px rgba(15,23,42,0.05)" }}>
            <div style={{ fontSize: "0.9rem", color: "#4b5563", marginBottom: 6 }}>Mean</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>{numbers.length ? mean.toFixed(2) : "—"}</div>
          </div>
          <div style={{ background: "white", borderRadius: 16, padding: "1rem", boxShadow: "0 10px 25px rgba(15,23,42,0.05)" }}>
            <div style={{ fontSize: "0.9rem", color: "#4b5563", marginBottom: 6 }}>Median</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>{numbers.length ? median.toFixed(2) : "—"}</div>
          </div>
          <div style={{ background: "white", borderRadius: 16, padding: "1rem", boxShadow: "0 10px 25px rgba(15,23,42,0.05)" }}>
            <div style={{ fontSize: "0.9rem", color: "#4b5563", marginBottom: 6 }}>Mode</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>{Number.isNaN(mode) ? "None" : mode.toFixed(2)}</div>
          </div>
          <div style={{ background: "white", borderRadius: 16, padding: "1rem", boxShadow: "0 10px 25px rgba(15,23,42,0.05)" }}>
            <div style={{ fontSize: "0.9rem", color: "#4b5563", marginBottom: 6 }}>Std Dev</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>{numbers.length ? stddev.toFixed(2) : "—"}</div>
          </div>
        </div>

        <div style={{ marginTop: "1.5rem", padding: "1rem", borderRadius: 16, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: "0.85rem", color: "#4b5563" }}><strong>Numbers parsed:</strong> {numbers.length > 0 ? numbers.join(", ") : "None"}</div>
        </div>
      </div>

      <BottomNav active="tools" onNavigate={(href) => router.push(href)} />
    </div>
  );
}
