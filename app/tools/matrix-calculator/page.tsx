"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";

const parseMatrix = (text: string) => {
  return text.trim().split(/\n+/).map((row) => row.trim().split(/\s+/).map((value) => Number(value) || 0));
};

const matrixToString = (matrix: number[][]) => matrix.map((row) => row.map((v) => v.toFixed(2)).join(" ")).join("\n");

const multiplyMatrices = (a: number[][], b: number[][]) => {
  const result: number[][] = Array.from({ length: a.length }, () => Array(b[0].length).fill(0));
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b[0].length; j++) {
      for (let k = 0; k < b.length; k++) {
        result[i][j] += a[i][k] * b[k][j];
      }
    }
  }
  return result;
};

const transpose = (m: number[][]) => m[0].map((_, col) => m.map((row) => row[col]));

const determinant2x2 = (m: number[][]) => m[0][0] * m[1][1] - m[0][1] * m[1][0];

export default function MatrixCalculatorPage() {
  const router = useRouter();
  const [matrixA, setMatrixA] = useState("1 2\n3 4");
  const [matrixB, setMatrixB] = useState("5 6\n7 8");
  const [operation, setOperation] = useState<"add" | "subtract" | "multiply" | "transpose" | "determinant">("add");
  const [result, setResult] = useState<string>("");

  const compute = () => {
    const a = parseMatrix(matrixA);
    const b = parseMatrix(matrixB);
    if (operation === "add" || operation === "subtract") {
      if (a.length !== b.length || a[0].length !== b[0].length) {
        setResult("Matrices must have the same dimensions for add/subtract.");
        return;
      }
      const out = a.map((row, i) => row.map((value, j) => operation === "add" ? value + b[i][j] : value - b[i][j]));
      setResult(matrixToString(out));
      return;
    }
    if (operation === "multiply") {
      if (a[0].length !== b.length) {
        setResult("A's columns must match B's rows for multiplication.");
        return;
      }
      setResult(matrixToString(multiplyMatrices(a, b)));
      return;
    }
    if (operation === "transpose") {
      setResult(matrixToString(transpose(a)));
      return;
    }
    if (operation === "determinant") {
      if (a.length !== 2 || a[0].length !== 2) {
        setResult("Determinant calculation currently supports 2x2 matrices only.");
        return;
      }
      setResult(determinant2x2(a).toString());
      return;
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f172a 0%, #111827 100%)", padding: "1rem 1rem 80px 1rem" }}>
      <div style={{ marginBottom: "1.5rem", paddingTop: "1rem" }}>
        <button onClick={() => router.back()} style={{ background: "rgba(255,255,255,0.16)", border: "none", padding: "8px 16px", borderRadius: 40, color: "white", cursor: "pointer", marginBottom: "1rem" }}>← Back</button>
        <h1 style={{ color: "white", margin: 0, fontSize: "1.8rem" }}>🔢 Matrix Calculator</h1>
        <p style={{ color: "rgba(255,255,255,0.75)", marginTop: "0.25rem" }}>Perform matrix addition, subtraction, multiplication, transpose, and 2x2 determinant.</p>
      </div>

      <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: 24, padding: "1.5rem", maxWidth: 760, margin: "0 auto" }}>
        <div style={{ display: "grid", gap: "1rem", marginBottom: "1rem" }}>
          <label style={{ display: "flex", flexDirection: "column", gap: 6, fontWeight: 600 }}>
            Matrix A
            <textarea value={matrixA} onChange={(e) => setMatrixA(e.target.value)} rows={4} style={{ width: "100%", padding: "1rem", borderRadius: 16, border: "1px solid #d1d5db", fontFamily: "monospace" }} />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 6, fontWeight: 600 }}>
            Matrix B
            <textarea value={matrixB} onChange={(e) => setMatrixB(e.target.value)} rows={4} style={{ width: "100%", padding: "1rem", borderRadius: 16, border: "1px solid #d1d5db", fontFamily: "monospace" }} />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: 6, fontWeight: 600 }}>
            Operation
            <select
              value={operation}
              onChange={(e) => setOperation(e.target.value as "add" | "subtract" | "multiply" | "transpose" | "determinant")}
              style={{ width: "100%", padding: "0.95rem 1rem", borderRadius: 16, border: "1px solid #d1d5db", fontSize: "1rem" }}
            >
              <option value="add">Add</option>
              <option value="subtract">Subtract</option>
              <option value="multiply">Multiply</option>
              <option value="transpose">Transpose A</option>
              <option value="determinant">Determinant A (2x2)</option>
            </select>
          </label>
        </div>

        <button onClick={compute} style={{ width: "100%", padding: "1rem", background: "#2563eb", color: "white", border: "none", borderRadius: 40, fontWeight: 700, cursor: "pointer" }}>Compute</button>

        <div style={{ marginTop: "1.5rem", padding: "1.25rem", borderRadius: 20, background: "#f8fafc", border: "1px solid #e2e8f0", fontFamily: "monospace" }}>
          <div style={{ fontSize: "0.9rem", color: "#4b5563", marginBottom: 8 }}>Result</div>
          <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{result || "Press Compute to see the result"}</pre>
        </div>
      </div>

      <BottomNav active="tools" onNavigate={(href) => router.push(href)} />
    </div>
  );
}
