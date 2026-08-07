"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";

const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));

const parseFraction = (text: string) => {
  const parts = text.split("/").map((part) => Number(part.trim()));
  if (parts.length !== 2 || Number.isNaN(parts[0]) || Number.isNaN(parts[1]) || parts[1] === 0) {
    throw new Error("Invalid fraction format. Use a/b.");
  }
  return { num: parts[0], den: parts[1] };
};

const simplify = ({ num, den }: { num: number; den: number }) => {
  const sign = den < 0 ? -1 : 1;
  const divisor = gcd(Math.abs(num), Math.abs(den));
  return { num: (num / divisor) * sign, den: Math.abs(den / divisor) };
};

export default function FractionCalculatorPage() {
  const router = useRouter();
  const [fracA, setFracA] = useState("2/5");
  const [fracB, setFracB] = useState("3/7");
  const [operation, setOperation] = useState<"add" | "subtract" | "multiply" | "divide" | "simplify">("add");
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState("");

  const calculate = () => {
    try {
      const a = parseFraction(fracA);
      let output = "";
      if (operation === "simplify") {
        output = `${simplify(a).num}/${simplify(a).den}`;
      } else {
        const b = parseFraction(fracB);
        let num = 0;
        let den = 1;
        if (operation === "add") {
          num = a.num * b.den + b.num * a.den;
          den = a.den * b.den;
        } else if (operation === "subtract") {
          num = a.num * b.den - b.num * a.den;
          den = a.den * b.den;
        } else if (operation === "multiply") {
          num = a.num * b.num;
          den = a.den * b.den;
        } else if (operation === "divide") {
          num = a.num * b.den;
          den = a.den * b.num;
        }
        output = `${simplify({ num, den }).num}/${simplify({ num, den }).den}`;
      }
      setResult(output);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid fraction");
      setResult("");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #111827 0%, #1f2937 100%)", padding: "1rem 1rem 80px 1rem" }}>
      <div style={{ marginBottom: "1.5rem", paddingTop: "1rem" }}>
        <button onClick={() => router.back()} style={{ background: "rgba(255,255,255,0.16)", border: "none", padding: "8px 16px", borderRadius: 40, color: "white", cursor: "pointer", marginBottom: "1rem" }}>← Back</button>
        <h1 style={{ color: "white", margin: 0, fontSize: "1.8rem" }}>➗ Fraction Calculator</h1>
        <p style={{ color: "rgba(255,255,255,0.75)", marginTop: "0.25rem" }}>Add, subtract, multiply, divide, or simplify fractions quickly.</p>
      </div>

      <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: 24, padding: "1.5rem", maxWidth: 760, margin: "0 auto" }}>
        <div style={{ display: "grid", gap: "1rem", marginBottom: "1rem" }}>
          <label style={{ display: "flex", flexDirection: "column", gap: 6, fontWeight: 600 }}>
            Fraction A
            <input value={fracA} onChange={(e) => setFracA(e.target.value)} placeholder="2/5" style={{ width: "100%", padding: "0.95rem 1rem", borderRadius: 16, border: "1px solid #d1d5db", fontFamily: "monospace" }} />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 6, fontWeight: 600 }}>
            Fraction B
            <input value={fracB} onChange={(e) => setFracB(e.target.value)} placeholder="3/7" style={{ width: "100%", padding: "0.95rem 1rem", borderRadius: 16, border: "1px solid #d1d5db", fontFamily: "monospace" }} />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 6, fontWeight: 600 }}>
            Operation
            <select
              value={operation}
              onChange={(e) => setOperation(e.target.value as "add" | "subtract" | "multiply" | "divide" | "simplify")}
              style={{ width: "100%", padding: "0.95rem 1rem", borderRadius: 16, border: "1px solid #d1d5db", fontSize: "1rem" }}
            >
              <option value="add">Add</option>
              <option value="subtract">Subtract</option>
              <option value="multiply">Multiply</option>
              <option value="divide">Divide</option>
              <option value="simplify">Simplify A</option>
            </select>
          </label>
        </div>

        <button onClick={calculate} style={{ width: "100%", padding: "1rem", background: "#2563eb", color: "white", border: "none", borderRadius: 40, fontWeight: 700, cursor: "pointer" }}>Calculate</button>

        {error && <div style={{ marginTop: "1rem", padding: "1rem", borderRadius: 16, background: "#fee2e2", color: "#b91c1c" }}>{error}</div>}

        <div style={{ marginTop: "1.5rem", padding: "1.25rem", borderRadius: 20, background: "#f8fafc", border: "1px solid #e2e8f0", fontFamily: "monospace" }}>
          <div style={{ fontSize: "0.9rem", color: "#4b5563", marginBottom: 8 }}>Result</div>
          <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>{result || "Press Calculate to view the result"}</div>
        </div>
      </div>

      <BottomNav active="tools" onNavigate={(href) => router.push(href)} />
    </div>
  );
}
