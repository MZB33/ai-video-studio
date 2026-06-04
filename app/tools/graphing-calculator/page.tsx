"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";

const allowedNames = new Set(["sin","cos","tan","asin","acos","atan","log","ln","sqrt","abs","pow","exp","PI","E","pi","e","floor","ceil","round","max","min"]);

const buildGraphFn = (input: string) => {
  const cleaned = input.replace(/\s+/g, "").replace(/\^/g, "**");
  const identifiers = [...cleaned.matchAll(/\b([a-zA-Z_][a-zA-Z0-9_]*)\b/g)].map(m => m[1]);
  for (const id of identifiers) {
    if (id === "x") continue;
    if (!allowedNames.has(id)) {
      throw new Error(`Invalid token: ${id}`);
    }
  }

  return new Function(
    "x", "sin", "cos", "tan", "asin", "acos", "atan", "log", "ln", "sqrt", "abs", "pow", "exp", "PI", "E", "floor", "ceil", "round", "max", "min",
    `return ${cleaned}`
  );
};

export default function GraphingCalculatorPage() {
  const router = useRouter();
  const [expression, setExpression] = useState("sin(x) * 10");
  const [error, setError] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = "#0f172a";
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = "#94a3b8";
    ctx.lineWidth = 1;

    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.moveTo(width / 2, 0);
    ctx.lineTo(width / 2, height);
    ctx.stroke();

    try {
      const fn = buildGraphFn(expression);
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2;
      ctx.beginPath();

      const xMin = -10;
      const xMax = 10;
      const yScale = 20;
      const xScale = width / (xMax - xMin);

      for (let i = 0; i <= width; i++) {
        const x = xMin + (i / width) * (xMax - xMin);
        const y = Number(fn(x, Math.sin, Math.cos, Math.tan, Math.asin, Math.acos, Math.atan, Math.log10, Math.log, Math.sqrt, Math.abs, Math.pow, Math.exp, Math.PI, Math.E, Math.floor, Math.ceil, Math.round, Math.max, Math.min));
        if (!Number.isFinite(y)) continue;
        const px = i;
        const py = height / 2 - y * yScale;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }

      ctx.stroke();
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid function");
    }
  }, [expression]);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f172a 0%, #111827 100%)", padding: "1rem 1rem 80px 1rem" }}>
      <div style={{ marginBottom: "1.5rem", paddingTop: "1rem" }}>
        <button onClick={() => router.back()} style={{ background: "rgba(255,255,255,0.16)", border: "none", padding: "8px 16px", borderRadius: 40, color: "white", cursor: "pointer", marginBottom: "1rem" }}>← Back</button>
        <h1 style={{ color: "white", margin: 0, fontSize: "1.8rem" }}>📈 Graphing Calculator</h1>
        <p style={{ color: "rgba(255,255,255,0.75)", marginTop: "0.25rem" }}>Plot expressions in x on a simple graph canvas.</p>
      </div>

      <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: 24, padding: "1.5rem", maxWidth: 760, margin: "0 auto" }}>
        <label style={{ display: "block", fontWeight: 600, marginBottom: "0.75rem" }}>y =</label>
        <input
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          placeholder="e.g. sin(x) * 10"
          style={{ width: "100%", padding: "1rem", borderRadius: 16, border: "1px solid #d1d5db", fontSize: "1rem", fontFamily: "monospace" }}
        />

        <div style={{ marginTop: "1.5rem", borderRadius: 20, overflow: "hidden", boxShadow: "0 15px 40px rgba(15,23,42,0.15)" }}>
          <canvas ref={canvasRef} width={760} height={360} style={{ width: "100%", display: "block" }} />
        </div>

        {error && <div style={{ marginTop: "1rem", padding: "1rem", borderRadius: 16, background: "#fee2e2", color: "#b91c1c" }}>{error}</div>}

        <div style={{ marginTop: "1rem", color: "#6b7280", fontSize: "0.9rem" }}>
          <div style={{ marginBottom: "0.25rem" }}><strong>Supported operators:</strong> +, -, *, /, ^</div>
          <div><strong>Supported functions:</strong> sin, cos, tan, log, ln, sqrt, abs, pow, exp</div>
        </div>
      </div>

      <BottomNav active="tools" onNavigate={(href) => router.push(href)} />
    </div>
  );
}
