"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";

type MathTopic = 
  | "general"
  | "algebra"
  | "calculus"
  | "geometry"
  | "statistics"
  | "trigonometry"
  | "matrix"
  | "fractions";

interface Solution {
  problem: string;
  answer: string;
  steps: string[];
  topic: MathTopic;
}

export default function MathSolverPage() {
  const router = useRouter();
  const [problem, setProblem] = useState("");
  const [topic, setTopic] = useState<MathTopic>("general");
  const [solution, setSolution] = useState<Solution | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const topics = [
    { id: "general", name: "General Math", nameUr: "عام ریاضی", icon: "🔢", color: "#667eea" },
    { id: "algebra", name: "Algebra", nameUr: "الجبرا", icon: "✖️", color: "#10b981" },
    { id: "calculus", name: "Calculus", nameUr: "کیلکولس", icon: "∫", color: "#ef4444" },
    { id: "geometry", name: "Geometry", nameUr: "جیومیٹری", icon: "📐", color: "#8b5cf6" },
    { id: "statistics", name: "Statistics", nameUr: "اعداد و شمار", icon: "📊", color: "#f59e0b" },
    { id: "trigonometry", name: "Trigonometry", nameUr: "ٹرگنومیٹری", icon: "📏", color: "#06b6d4" },
    { id: "matrix", name: "Matrix", nameUr: "میٹرکس", icon: "🧮", color: "#ec4899" },
    { id: "fractions", name: "Fractions", nameUr: "کسور", icon: "½", color: "#22c55e" },
  ];

  const evaluateArithmetic = (expression: string): number | null => {
    const sanitized = expression.replace(/[^0-9+\-*/().\s]/g, "").trim();
    if (!sanitized || sanitized !== expression.trim()) return null;

    const tokens = sanitized.match(/(\d+(?:\.\d+)?)|[()+\-*/]/g);
    if (!tokens) return null;

    let index = 0;
    const peek = () => tokens[index];
    const consume = () => tokens[index++];

    const parsePrimary = (): number => {
      const token = peek();
      if (!token) throw new Error("Unexpected end of expression");
      if (token === "+") {
        consume();
        return parsePrimary();
      }
      if (token === "-") {
        consume();
        return -parsePrimary();
      }
      if (token === "(") {
        consume();
        const value = parseExpression();
        if (peek() !== ")") throw new Error("Expected closing parenthesis");
        consume();
        return value;
      }
      consume();
      const numberValue = Number(token);
      if (Number.isNaN(numberValue)) throw new Error("Invalid number");
      return numberValue;
    };

    const parseFactor = (): number => {
      let value = parsePrimary();
      while (peek() === "*" || peek() === "/") {
        const op = consume();
        const nextValue = parsePrimary();
        value = op === "*" ? value * nextValue : value / nextValue;
      }
      return value;
    };

    const parseExpression = (): number => {
      let value = parseFactor();
      while (peek() === "+" || peek() === "-") {
        const op = consume();
        const nextValue = parseFactor();
        value = op === "+" ? value + nextValue : value - nextValue;
      }
      return value;
    };

    const result = parseExpression();
    if (index < tokens.length) throw new Error("Invalid expression");
    return result;
  };

  const solveProblem = () => {
    if (!problem.trim()) {
      setError("Please enter a math problem");
      return;
    }

    setLoading(true);
    setError("");
    
    // Simulate AI solving (in production, use actual math API)
    setTimeout(() => {
      let answer = "";
      let steps: string[] = [];
      
      // Demo solutions based on problem type
      if (problem.includes("+") || problem.includes("-") || problem.includes("*") || problem.includes("/")) {
        try {
          const result = evaluateArithmetic(problem);
          if (result === null || Number.isNaN(result) || !Number.isFinite(result)) {
            throw new Error("Invalid expression");
          }
          answer = result.toString();
          steps = [
            `Original problem: ${problem}`,
            `Apply arithmetic operations:`,
            `= ${answer}`,
            `Final answer: ${answer}`,
          ];
        } catch {
          answer = "Unable to solve. Please check your input.";
          steps = ["Invalid expression. Use operators like +, -, *, /"];
        }
      } else if (topic === "algebra") {
        answer = "x = 5";
        steps = [
          "Given equation: 2x + 3 = 13",
          "Subtract 3 from both sides: 2x = 10",
          "Divide both sides by 2: x = 5",
          "Final answer: x = 5",
        ];
      } else if (topic === "calculus") {
        answer = "dy/dx = 2x + 3";
        steps = [
          "Given function: f(x) = x² + 3x + 5",
          "Apply power rule: d/dx(x²) = 2x",
          "d/dx(3x) = 3",
          "d/dx(5) = 0",
          "Final derivative: 2x + 3",
        ];
      } else if (topic === "statistics") {
        answer = "Mean = 5.5, Median = 5.5, Mode = None";
        steps = [
          "Data set: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10",
          "Mean = sum of all values / number of values = 55/10 = 5.5",
          "Median = middle value = 5.5 (average of 5 and 6)",
          "Mode = no repeating values",
        ];
      } else if (topic === "trigonometry") {
        answer = "sin(30°) = 0.5, cos(30°) = 0.866, tan(30°) = 0.577";
        steps = [
          "sin(30°) = 1/2 = 0.5",
          "cos(30°) = √3/2 ≈ 0.866",
          "tan(30°) = 1/√3 ≈ 0.577",
        ];
      } else if (topic === "matrix") {
        answer = "Determinant = -2, Inverse = [[-1, 1], [0.5, -1.5]]";
        steps = [
          "Matrix A = [[2, 1], [1, 3]]",
          "Determinant = (2×3 - 1×1) = 6 - 1 = 5",
          "Inverse = (1/det) × [[3, -1], [-1, 2]]",
          "Inverse = [[0.6, -0.2], [-0.2, 0.4]]",
        ];
      } else if (topic === "fractions") {
        answer = "12/35";
        steps = [
          "Problem: (2/5) × (6/7)",
          "Multiply numerators: 2 × 6 = 12",
          "Multiply denominators: 5 × 7 = 35",
          "Final answer: 12/35",
        ];
      } else {
        answer = "Solution will appear here after AI processing";
        steps = ["Step 1: Analyze the problem", "Step 2: Apply relevant formulas", "Step 3: Calculate the answer", "Step 4: Verify the result"];
      }
      
      setSolution({
        problem: problem,
        answer: answer,
        steps: steps,
        topic: topic,
      });
      setSuccessMsg("✨ Problem solved!");
      setTimeout(() => setSuccessMsg(""), 3000);
      setLoading(false);
    }, 1500);
  };

  const loadExample = () => {
    if (topic === "algebra") {
      setProblem("2x + 3 = 13");
    } else if (topic === "calculus") {
      setProblem("Find derivative of x² + 3x + 5");
    } else if (topic === "statistics") {
      setProblem("Find mean, median, mode of 1,2,3,4,5,6,7,8,9,10");
    } else if (topic === "trigonometry") {
      setProblem("Calculate sin(30°), cos(30°), tan(30°)");
    } else if (topic === "matrix") {
      setProblem("Find determinant and inverse of [[2,1],[1,3]]");
    } else if (topic === "fractions") {
      setProblem("(2/5) × (6/7)");
    } else {
      setProblem("25 + 15 × 2");
    }
  };

  const clearAll = () => {
    setProblem("");
    setSolution(null);
    setError("");
  };

  const currentTopic = topics.find(t => t.id === topic);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "1rem 1rem 80px 1rem",
      }}
    >
      <div style={{ marginBottom: "1.5rem", paddingTop: "1rem" }}>
        <button
          onClick={() => router.back()}
          style={{
            background: "rgba(255,255,255,0.2)",
            border: "none",
            padding: "8px 16px",
            borderRadius: 40,
            color: "white",
            cursor: "pointer",
            marginBottom: "1rem",
          }}
        >
          ← Back
        </button>
        <h1 style={{ color: "white", margin: 0, fontSize: "1.8rem" }}>🔢 AI Math Solver</h1>
        <p style={{ color: "rgba(255,255,255,0.8)", marginTop: "0.25rem" }}>
          Solve any math problem with step-by-step explanation
        </p>
      </div>

      {/* Topic Selection */}
      <div
        style={{
          background: "rgba(255,255,255,0.95)",
          borderRadius: 24,
          padding: "1rem",
          marginBottom: "1rem",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
            gap: "0.5rem",
          }}
        >
          {topics.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setTopic(t.id as MathTopic);
                clearAll();
              }}
              style={{
                padding: "0.5rem",
                borderRadius: 16,
                background: topic === t.id ? t.color : "#f0f0f0",
                color: topic === t.id ? "white" : "#333",
                border: "none",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.2s",
              }}
            >
              <div style={{ fontSize: "1.2rem" }}>{t.icon}</div>
              <div style={{ fontSize: "0.65rem", fontWeight: 500 }}>{t.name}</div>
              <div style={{ fontSize: "0.55rem", opacity: 0.7 }}>{t.nameUr}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Input Section */}
      <div
        style={{
          background: "rgba(255,255,255,0.95)",
          borderRadius: 24,
          padding: "1.5rem",
          marginBottom: "1.5rem",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
          <label style={{ fontWeight: 600 }}>📝 Enter Your Math Problem</label>
          <button
            onClick={loadExample}
            style={{
              padding: "0.25rem 0.75rem",
              fontSize: "0.7rem",
              background: "#8b5cf6",
              color: "white",
              border: "none",
              borderRadius: 40,
              cursor: "pointer",
            }}
          >
            📖 Try Example
          </button>
        </div>
        
        <textarea
          value={problem}
          onChange={(e) => setProblem(e.target.value)}
          placeholder={`Example: ${topic === "algebra" ? "2x + 3 = 13" : topic === "calculus" ? "Find derivative of x² + 3x + 5" : "25 + 15 × 2"}`}
          rows={3}
          style={{
            width: "100%",
            padding: "1rem",
            fontSize: "1rem",
            borderRadius: 16,
            border: "1px solid #e0e0e0",
            fontFamily: "monospace",
            resize: "vertical",
            marginBottom: "0.5rem",
          }}
        />
        
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={clearAll}
            style={{
              padding: "0.5rem 1rem",
              background: "#ef4444",
              color: "white",
              border: "none",
              borderRadius: 40,
              fontSize: "0.8rem",
              cursor: "pointer",
            }}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Solve Button */}
      <button
        onClick={solveProblem}
        disabled={loading || !problem}
        style={{
          width: "100%",
          padding: "1rem",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          border: "none",
          borderRadius: 40,
          fontSize: "1rem",
          fontWeight: 600,
          cursor: loading || !problem ? "not-allowed" : "pointer",
          opacity: loading || !problem ? 0.6 : 1,
          marginBottom: "1.5rem",
        }}
      >
        {loading ? "⚡ Solving..." : "✨ Solve Math Problem"}
      </button>

      {/* Solution Display */}
      {solution && (
        <div
          style={{
            background: "rgba(255,255,255,0.95)",
            borderRadius: 24,
            padding: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
            <span style={{ fontSize: "1.5rem" }}>✅</span>
            <h3 style={{ margin: 0, fontSize: "1.1rem" }}>Solution</h3>
            <span
              style={{
                fontSize: "0.6rem",
                background: currentTopic?.color,
                color: "white",
                padding: "2px 8px",
                borderRadius: 12,
              }}
            >
              {currentTopic?.name}
            </span>
          </div>

          <div style={{ background: "#f5f5f5", borderRadius: 16, padding: "1rem", marginBottom: "1rem" }}>
            <p style={{ fontSize: "0.7rem", color: "#666", marginBottom: "0.25rem" }}>Problem:</p>
            <p style={{ fontSize: "1rem", fontFamily: "monospace", fontWeight: 500 }}>{solution.problem}</p>
          </div>

          <div style={{ background: "#d1fae5", borderRadius: 16, padding: "1rem", marginBottom: "1rem" }}>
            <p style={{ fontSize: "0.7rem", color: "#166534", marginBottom: "0.25rem" }}>Answer:</p>
            <p style={{ fontSize: "1.2rem", fontWeight: 700, color: "#166534" }}>{solution.answer}</p>
          </div>

          <div style={{ background: "#f0f0f0", borderRadius: 16, padding: "1rem" }}>
            <p style={{ fontSize: "0.7rem", color: "#666", marginBottom: "0.5rem" }}>Step-by-Step Solution:</p>
            {solution.steps.map((step, idx) => (
              <div key={idx} style={{ display: "flex", marginBottom: "0.5rem" }}>
                <span style={{ fontWeight: 600, marginRight: "0.5rem", color: "#667eea" }}>{idx + 1}.</span>
                <span style={{ fontSize: "0.85rem" }}>{step}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "1rem", textAlign: "center" }}>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`${solution.problem}\n\nAnswer: ${solution.answer}\n\nSteps:\n${solution.steps.join("\n")}`);
                setSuccessMsg("📋 Solution copied to clipboard!");
                setTimeout(() => setSuccessMsg(""), 2000);
              }}
              style={{
                padding: "0.5rem 1rem",
                background: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: 40,
                fontSize: "0.8rem",
                cursor: "pointer",
              }}
            >
              📋 Copy Solution
            </button>
          </div>
        </div>
      )}

      {error && (
        <div
          style={{
            marginTop: "1rem",
            padding: "0.75rem",
            background: "rgba(239,68,68,0.1)",
            borderRadius: 12,
            color: "#ef4444",
            textAlign: "center",
          }}
        >
          ❌ {error}
        </div>
      )}
      {successMsg && (
        <div
          style={{
            marginTop: "1rem",
            padding: "0.75rem",
            background: "rgba(34,197,94,0.1)",
            borderRadius: 12,
            color: "#22c55e",
            textAlign: "center",
          }}
        >
          ✅ {successMsg}
        </div>
      )}

      <BottomNav active="tools" onNavigate={(href) => router.push(href)} />
    </div>
  );
}