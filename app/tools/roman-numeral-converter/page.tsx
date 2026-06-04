"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";

const romanMap: Array<[number, string]> = [
  [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
  [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
  [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
];

const toRoman = (value: number) => {
  if (value <= 0 || value >= 4000) throw new Error("Enter a number between 1 and 3999.");
  let num = value;
  let result = "";
  for (const [n, roman] of romanMap) {
    while (num >= n) {
      result += roman;
      num -= n;
    }
  }
  return result;
};

const fromRoman = (input: string) => {
  const roman = input.toUpperCase();
  const values: Record<string, number> = { I:1, V:5, X:10, L:50, C:100, D:500, M:1000 };
  let total = 0;
  for (let i = 0; i < roman.length; i++) {
    const current = values[roman[i]];
    const next = values[roman[i+1]];
    if (!current) throw new Error("Invalid Roman numeral.");
    if (next && next > current) {
      total += next - current;
      i++;
    } else {
      total += current;
    }
  }
  return total;
};

export default function RomanNumeralConverterPage() {
  const router = useRouter();
  const [numberValue, setNumberValue] = useState("1987");
  const [romanValue, setRomanValue] = useState("MCMLXXXVII");
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState("");

  const convertToRoman = () => {
    try {
      const roman = toRoman(Number(numberValue));
      setResult(roman);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid input");
      setResult("");
    }
  };

  const convertFromRoman = () => {
    try {
      const number = fromRoman(romanValue);
      setResult(String(number));
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid input");
      setResult("");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #111827 0%, #1f2937 100%)", padding: "1rem 1rem 80px 1rem" }}>
      <div style={{ marginBottom: "1.5rem", paddingTop: "1rem" }}>
        <button onClick={() => router.back()} style={{ background: "rgba(255,255,255,0.16)", border: "none", padding: "8px 16px", borderRadius: 40, color: "white", cursor: "pointer", marginBottom: "1rem" }}>← Back</button>
        <h1 style={{ color: "white", margin: 0, fontSize: "1.8rem" }}>📜 Roman Numeral Converter</h1>
        <p style={{ color: "rgba(255,255,255,0.75)", marginTop: "0.25rem" }}>Convert between integers and Roman numerals.</p>
      </div>

      <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: 24, padding: "1.5rem", maxWidth: 760, margin: "0 auto" }}>
        <div style={{ display: "grid", gap: "1rem", marginBottom: "1rem" }}>
          <label style={{ display: "flex", flexDirection: "column", gap: 6, fontWeight: 600 }}>
            Number
            <input value={numberValue} onChange={(e) => setNumberValue(e.target.value)} placeholder="1987" style={{ width: "100%", padding: "0.95rem 1rem", borderRadius: 16, border: "1px solid #d1d5db", fontFamily: "monospace" }} />
          </label>
          <button onClick={convertToRoman} style={{ width: "100%", padding: "1rem", background: "#2563eb", color: "white", border: "none", borderRadius: 40, fontWeight: 700, cursor: "pointer" }}>Convert to Roman</button>

          <label style={{ display: "flex", flexDirection: "column", gap: 6, fontWeight: 600 }}>
            Roman numeral
            <input value={romanValue} onChange={(e) => setRomanValue(e.target.value)} placeholder="MCMLXXXVII" style={{ width: "100%", padding: "0.95rem 1rem", borderRadius: 16, border: "1px solid #d1d5db", fontFamily: "monospace" }} />
          </label>
          <button onClick={convertFromRoman} style={{ width: "100%", padding: "1rem", background: "#047857", color: "white", border: "none", borderRadius: 40, fontWeight: 700, cursor: "pointer" }}>Convert to Number</button>
        </div>

        {error && <div style={{ marginTop: "1rem", padding: "1rem", borderRadius: 16, background: "#fee2e2", color: "#b91c1c" }}>{error}</div>}
        {result && !error && <div style={{ marginTop: "1rem", padding: "1rem", borderRadius: 16, background: "#ecfdf5", color: "#065f46", fontWeight: 700 }}>{result}</div>}
      </div>

      <BottomNav active="tools" onNavigate={(href) => router.push(href)} />
    </div>
  );
}
