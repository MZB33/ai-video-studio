"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";

const allowedNames = new Set(["sin","cos","tan","asin","acos","atan","log","ln","sqrt","abs","pow","exp","PI","E","pi","e","floor","ceil","round","max","min"]);

const buildCalculator = (input: string) => {
  const cleaned = input.replace(/\s+/g, "").replace(/\^/g, "**");
  const identifiers = [...cleaned.matchAll(/\b([a-zA-Z_][a-zA-Z0-9_]*)\b/g)].map(m => m[1]);
  for (const id of identifiers) {
    if (!allowedNames.has(id)) {
      throw new Error(`Invalid token: ${id}`);
    }
  }

  const fn = new Function(
    "sin", "cos", "tan", "asin", "acos", "atan", "log", "ln", "sqrt", "abs", "pow", "exp", "PI", "E", "floor", "ceil", "round", "max", "min",
    `return ${cleaned}`
  );

  return fn(Math.sin, Math.cos, Math.tan, Math.asin, Math.acos, Math.atan, Math.log10, Math.log, Math.sqrt, Math.abs, Math.pow, Math.exp, Math.PI, Math.E, Math.floor, Math.ceil, Math.round, Math.max, Math.min);
};

export default function ScientificCalculatorPage() {
  const router = useRouter();
  const [expression, setExpression] = useState("2 + 2 * 3");
  const [output, setOutput] = useState<string | null>(null);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const calculate = () => {
    try {
      const result = buildCalculator(expression);
      if (typeof result === "number" && !Number.isFinite(result)) {
        throw new Error("Result is not finite");
      }
      setOutput(String(result));
      setError("");
    } catch (err) {
      setOutput(null);
      setError(err instanceof Error ? err.message : "Invalid expression");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #111827 0%, #1f2937 100%)", padding: "1rem 1rem 80px 1rem" }}>
      <div style={{ marginBottom: "1.5rem", paddingTop: "1rem" }}>
        <button onClick={() => router.back()} style={{ background: "rgba(255,255,255,0.16)", border: "none", padding: "8px 16px", borderRadius: 40, color: "white", cursor: "pointer", marginBottom: "1rem" }}>← Back</button>
        <h1 style={{ color: "white", margin: 0, fontSize: "1.8rem" }}>🧮 Scientific Calculator</h1>
        <p style={{ color: "rgba(255,255,255,0.75)", marginTop: "0.25rem" }}>Evaluate advanced math expressions with functions like sin, cos, log, and power.</p>
      </div>

      <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: 24, padding: "1.5rem", maxWidth: 760, margin: "0 auto" }}>
        <label style={{ display: "block", fontWeight: 600, marginBottom: "0.75rem" }}>Expression</label>
        <textarea
          ref={inputRef}
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          rows={4}
          placeholder="e.g. 3*sin(pi/4) + sqrt(16)"
          style={{ width: "100%", padding: "1rem", borderRadius: 16, border: "1px solid #d1d5db", fontSize: "1rem", fontFamily: "monospace", resize: "vertical" }}
        />

        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "1rem" }}>
          <button onClick={calculate} style={{ flex: 1, minWidth: 140, padding: "0.95rem 1rem", background: "#2563eb", color: "white", border: "none", borderRadius: 40, fontWeight: 700, cursor: "pointer" }}>Calculate</button>
          <button onClick={() => { setExpression(""); setOutput(null); setError(""); }} style={{ flex: 1, minWidth: 140, padding: "0.95rem 1rem", background: "#111827", color: "white", border: "none", borderRadius: 40, fontWeight: 700, cursor: "pointer" }}>Clear</button>
        </div>

        <div style={{ marginTop: "1.5rem", padding: "1.25rem", borderRadius: 20, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: "0.9rem", color: "#4b5563", marginBottom: 8 }}>Result</div>
          {error ? (
            <div style={{ color: "#b91c1c", fontWeight: 700 }}>{error}</div>
          ) : (
            <div style={{ fontSize: "1.75rem", fontWeight: 700 }}>{output ?? "Enter an expression and press Calculate"}</div>
          )}
        </div>

        <div style={{ marginTop: "1.5rem", color: "#6b7280", fontSize: "0.9rem" }}>
          <div style={{ marginBottom: "0.5rem" }}><strong>Supported functions:</strong> sin, cos, tan, asin, acos, atan, log, ln, sqrt, abs, pow, exp, floor, ceil, round, max, min</div>
          <div><strong>Constants:</strong> pi, e</div>
        </div>
      </div>

      <BottomNav active="tools" onNavigate={(href) => router.push(href)} />
    </div>
  );
}
