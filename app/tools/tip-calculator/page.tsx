"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";

export default function TipCalculatorPage() {
  const router = useRouter();
  const [subtotal, setSubtotal] = useState("45.00");
  const [tipPercent, setTipPercent] = useState("18");
  const [people, setPeople] = useState("1");

  const values = useMemo(() => {
    const bill = Number(subtotal) || 0;
    const tip = bill * (Number(tipPercent) / 100);
    const total = bill + tip;
    const perPerson = people && Number(people) > 0 ? total / Number(people) : total;
    return {
      tip: tip.toFixed(2),
      total: total.toFixed(2),
      perPerson: perPerson.toFixed(2),
    };
  }, [subtotal, tipPercent, people]);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0d9488 0%, #0f766e 100%)", padding: "1rem 1rem 80px 1rem" }}>
      <div style={{ marginBottom: "1.5rem", paddingTop: "1rem" }}>
        <button onClick={() => router.back()} style={{ background: "rgba(255,255,255,0.18)", border: "none", padding: "8px 16px", borderRadius: 40, color: "white", cursor: "pointer", marginBottom: "1rem" }}>
          ← Back
        </button>
        <h1 style={{ color: "white", margin: 0, fontSize: "1.8rem" }}>💸 Tip Calculator</h1>
        <p style={{ color: "rgba(255,255,255,0.8)", marginTop: "0.25rem" }}>Split bills and calculate the tip in seconds.</p>
      </div>

      <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: 24, padding: "1.5rem", maxWidth: 760, margin: "0 auto" }}>
        <div style={{ display: "grid", gap: "1rem", marginBottom: "1.25rem" }}>
          <label style={{ display: "flex", flexDirection: "column", gap: 6, fontWeight: 600 }}>
            Bill amount
            <input
              type="number"
              value={subtotal}
              onChange={(e) => setSubtotal(e.target.value)}
              placeholder="e.g. 45.00"
              step="0.01"
              style={{ width: "100%", padding: "0.9rem 1rem", borderRadius: 16, border: "1px solid #d1d5db", fontSize: "1rem" }}
            />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 6, fontWeight: 600 }}>
            Tip percentage
            <input
              type="number"
              value={tipPercent}
              onChange={(e) => setTipPercent(e.target.value)}
              placeholder="e.g. 18"
              step="0.1"
              style={{ width: "100%", padding: "0.9rem 1rem", borderRadius: 16, border: "1px solid #d1d5db", fontSize: "1rem" }}
            />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 6, fontWeight: 600 }}>
            Number of people
            <input
              type="number"
              value={people}
              onChange={(e) => setPeople(e.target.value)}
              placeholder="e.g. 1"
              min="1"
              style={{ width: "100%", padding: "0.9rem 1rem", borderRadius: 16, border: "1px solid #d1d5db", fontSize: "1rem" }}
            />
          </label>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginTop: "1rem" }}>
          <div style={{ background: "white", borderRadius: 16, padding: "1rem", boxShadow: "0 10px 25px rgba(0,0,0,0.05)" }}>
            <div style={{ color: "#4b5563", fontSize: "0.9rem", marginBottom: 6 }}>Tip amount</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>${values.tip}</div>
          </div>
          <div style={{ background: "white", borderRadius: 16, padding: "1rem", boxShadow: "0 10px 25px rgba(0,0,0,0.05)" }}>
            <div style={{ color: "#4b5563", fontSize: "0.9rem", marginBottom: 6 }}>Total amount</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>${values.total}</div>
          </div>
          <div style={{ background: "white", borderRadius: 16, padding: "1rem", boxShadow: "0 10px 25px rgba(0,0,0,0.05)" }}>
            <div style={{ color: "#4b5563", fontSize: "0.9rem", marginBottom: 6 }}>Per person</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>${values.perPerson}</div>
          </div>
        </div>
      </div>

      <BottomNav active="tools" onNavigate={(href) => router.push(href)} />
    </div>
  );
}
