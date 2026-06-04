"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";

export default function EmiCalculatorPage() {
  const router = useRouter();
  const [principal, setPrincipal] = useState("250000");
  const [annualRate, setAnnualRate] = useState("9.2");
  const [months, setMonths] = useState("60");
  const [result, setResult] = useState<null | { emi: string; total: string; interest: string }>(null);
  const [error, setError] = useState("");

  const calculateEmi = () => {
    const p = Number(principal);
    const monthlyRate = Number(annualRate) / 100 / 12;
    const n = Number(months);

    if (!p || p <= 0 || !monthlyRate || n <= 0) {
      setError("Enter valid principal, rate, and tenure values.");
      setResult(null);
      return;
    }

    const emi = (p * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
    if (!Number.isFinite(emi)) {
      setError("Unable to calculate EMI with the given values.");
      setResult(null);
      return;
    }

    const total = emi * n;
    const interest = total - p;

    setResult({ emi: emi.toFixed(2), total: total.toFixed(2), interest: interest.toFixed(2) });
    setError("");
  };

  const clear = () => {
    setPrincipal("");
    setAnnualRate("");
    setMonths("");
    setResult(null);
    setError("");
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f172a 0%, #111827 100%)", padding: "1rem 1rem 80px 1rem" }}>
      <div style={{ marginBottom: "1.5rem", paddingTop: "1rem" }}>
        <button onClick={() => router.back()} style={{ background: "rgba(255,255,255,0.12)", border: "none", padding: "8px 16px", borderRadius: 40, color: "white", cursor: "pointer", marginBottom: "1rem" }}>
          ← Back
        </button>
        <h1 style={{ color: "white", margin: 0, fontSize: "1.8rem" }}>🏦 EMI Calculator</h1>
        <p style={{ color: "rgba(255,255,255,0.75)", marginTop: "0.25rem" }}>Compute monthly installments with loan amount, rate, and tenure.</p>
      </div>

      <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: 24, padding: "1.5rem", maxWidth: 760, margin: "0 auto" }}>
        <div style={{ display: "grid", gap: "1rem", marginBottom: "1.25rem" }}>
          <label style={{ display: "flex", flexDirection: "column", gap: 6, fontWeight: 600 }}>
            Principal amount
            <input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              placeholder="e.g. 250000"
              style={{ width: "100%", padding: "0.9rem 1rem", borderRadius: 16, border: "1px solid #d1d5db", fontSize: "1rem" }}
            />
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: 6, fontWeight: 600 }}>
            Annual interest rate (%)
            <input
              type="number"
              value={annualRate}
              onChange={(e) => setAnnualRate(e.target.value)}
              placeholder="e.g. 9.2"
              step="0.01"
              style={{ width: "100%", padding: "0.9rem 1rem", borderRadius: 16, border: "1px solid #d1d5db", fontSize: "1rem" }}
            />
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: 6, fontWeight: 600 }}>
            Loan duration (months)
            <input
              type="number"
              value={months}
              onChange={(e) => setMonths(e.target.value)}
              placeholder="e.g. 60"
              style={{ width: "100%", padding: "0.9rem 1rem", borderRadius: 16, border: "1px solid #d1d5db", fontSize: "1rem" }}
            />
          </label>
        </div>

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <button onClick={calculateEmi} style={{ flex: 1, minWidth: 140, padding: "0.95rem 1rem", background: "#047857", color: "white", border: "none", borderRadius: 40, fontWeight: 700, cursor: "pointer" }}>
            Calculate EMI
          </button>
          <button onClick={clear} style={{ flex: 1, minWidth: 140, padding: "0.95rem 1rem", background: "#111827", color: "white", border: "none", borderRadius: 40, fontWeight: 700, cursor: "pointer" }}>
            Clear
          </button>
        </div>

        {error && <div style={{ marginTop: "1rem", padding: "1rem", borderRadius: 16, background: "#fee2e2", color: "#b91c1c" }}>{error}</div>}

        {result && (
          <div style={{ marginTop: "1.5rem", padding: "1.25rem", borderRadius: 20, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
            <h2 style={{ margin: 0, fontSize: "1.1rem", marginBottom: "0.75rem" }}>EMI Summary</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem" }}>
              <div style={{ background: "white", borderRadius: 16, padding: "1rem", boxShadow: "0 10px 25px rgba(15,23,42,0.05)" }}>
                <div style={{ fontSize: "0.9rem", color: "#4b5563", marginBottom: 6 }}>Monthly EMI</div>
                <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>${result.emi}</div>
              </div>
              <div style={{ background: "white", borderRadius: 16, padding: "1rem", boxShadow: "0 10px 25px rgba(15,23,42,0.05)" }}>
                <div style={{ fontSize: "0.9rem", color: "#4b5563", marginBottom: 6 }}>Total payment</div>
                <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>${result.total}</div>
              </div>
              <div style={{ background: "white", borderRadius: 16, padding: "1rem", boxShadow: "0 10px 25px rgba(15,23,42,0.05)" }}>
                <div style={{ fontSize: "0.9rem", color: "#4b5563", marginBottom: 6 }}>Total interest</div>
                <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>${result.interest}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      <BottomNav active="tools" onNavigate={(href) => router.push(href)} />
    </div>
  );
}
