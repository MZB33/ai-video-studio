"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";

type UnitSystem = "metric" | "imperial";

export default function BMICalculatorPage() {
  const router = useRouter();
  const [unitSystem, setUnitSystem] = useState<UnitSystem>("metric");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState<number | null>(null);
  const [category, setCategory] = useState("");
  const [idealWeight, setIdealWeight] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const calculateBMI = () => {
    if (!height || !weight) {
      setError("Please enter both height and weight");
      return;
    }

    const heightNum = parseFloat(height);
    const weightNum = parseFloat(weight);

    if (isNaN(heightNum) || isNaN(weightNum) || heightNum <= 0 || weightNum <= 0) {
      setError("Please enter valid positive numbers");
      return;
    }

    setLoading(true);
    setError("");

    let bmiValue: number;
    let idealMin: number;
    let idealMax: number;

    if (unitSystem === "metric") {
      // Height in meters, weight in kg
      const heightInMeters = heightNum / 100;
      bmiValue = weightNum / (heightInMeters * heightInMeters);
      idealMin = 18.5 * (heightInMeters * heightInMeters);
      idealMax = 24.9 * (heightInMeters * heightInMeters);
    } else {
      // Height in inches, weight in lbs
      bmiValue = (weightNum / (heightNum * heightNum)) * 703;
      const heightInMeters = heightNum * 0.0254;
      idealMin = 18.5 * (heightInMeters * heightInMeters);
      idealMax = 24.9 * (heightInMeters * heightInMeters);
      idealMin = idealMin * 2.20462; // Convert to lbs
      idealMax = idealMax * 2.20462;
    }

    setBmi(bmiValue);

    // Determine category
    let bmiCategory = "";
    let color = "";
    if (bmiValue < 18.5) {
      bmiCategory = "Underweight";
      color = "#f59e0b";
    } else if (bmiValue >= 18.5 && bmiValue < 25) {
      bmiCategory = "Normal weight";
      color = "#22c55e";
    } else if (bmiValue >= 25 && bmiValue < 30) {
      bmiCategory = "Overweight";
      color = "#f97316";
    } else {
      bmiCategory = "Obese";
      color = "#ef4444";
    }
    setCategory(bmiCategory);
    setIdealWeight(`${idealMin.toFixed(1)} - ${idealMax.toFixed(1)} ${unitSystem === "metric" ? "kg" : "lbs"}`);

    setLoading(false);
    setSuccessMsg("✅ BMI calculated successfully!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const loadExample = () => {
    if (unitSystem === "metric") {
      setHeight("170");
      setWeight("70");
    } else {
      setHeight("67");
      setWeight("154");
    }
  };

  const clearAll = () => {
    setHeight("");
    setWeight("");
    setBmi(null);
    setCategory("");
    setIdealWeight("");
    setError("");
  };

  const getBMIColor = () => {
    if (!bmi) return "#667eea";
    if (bmi < 18.5) return "#f59e0b";
    if (bmi < 25) return "#22c55e";
    if (bmi < 30) return "#f97316";
    return "#ef4444";
  };

  const getRecommendation = () => {
    if (!bmi) return "";
    if (bmi < 18.5) return "Consider increasing calorie intake and building muscle mass. Consult a nutritionist.";
    if (bmi < 25) return "Great! Maintain a balanced diet and regular exercise.";
    if (bmi < 30) return "Focus on portion control and increase physical activity.";
    return "Consult a doctor for a personalized weight management plan.";
  };

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
        <h1 style={{ color: "white", margin: 0, fontSize: "1.8rem" }}>⚖️ BMI Calculator</h1>
        <p style={{ color: "rgba(255,255,255,0.8)", marginTop: "0.25rem" }}>
          Calculate your Body Mass Index and get health recommendations
        </p>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.7rem", marginTop: "0.25rem" }}>
          باڈی ماس انڈیکس کیلکولیٹر — صحت کے مشورے کے ساتھ
        </p>
      </div>

      <div
        style={{
          background: "rgba(255,255,255,0.95)",
          borderRadius: 24,
          padding: "1.5rem",
          marginBottom: "1.5rem",
        }}
      >
        {/* Unit System Toggle */}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
          <button
            onClick={() => {
              setUnitSystem("metric");
              clearAll();
            }}
            style={{
              flex: 1,
              padding: "0.5rem",
              borderRadius: 40,
              background: unitSystem === "metric" ? "#667eea" : "#f0f0f0",
              color: unitSystem === "metric" ? "white" : "#333",
              border: "none",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            📏 Metric (cm/kg)
          </button>
          <button
            onClick={() => {
              setUnitSystem("imperial");
              clearAll();
            }}
            style={{
              flex: 1,
              padding: "0.5rem",
              borderRadius: 40,
              background: unitSystem === "imperial" ? "#667eea" : "#f0f0f0",
              color: unitSystem === "imperial" ? "white" : "#333",
              border: "none",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            📐 Imperial (in/lbs)
          </button>
        </div>

        {/* Height Input */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ fontWeight: 500, marginBottom: "0.25rem", display: "block" }}>
            Height ({unitSystem === "metric" ? "cm" : "inches"})
          </label>
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            placeholder={unitSystem === "metric" ? "e.g., 170" : "e.g., 67"}
            style={{
              width: "100%",
              padding: "0.875rem",
              fontSize: "1rem",
              borderRadius: 16,
              border: "1px solid #e0e0e0",
            }}
          />
        </div>

        {/* Weight Input */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ fontWeight: 500, marginBottom: "0.25rem", display: "block" }}>
            Weight ({unitSystem === "metric" ? "kg" : "lbs"})
          </label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            placeholder={unitSystem === "metric" ? "e.g., 70" : "e.g., 154"}
            style={{
              width: "100%",
              padding: "0.875rem",
              fontSize: "1rem",
              borderRadius: 16,
              border: "1px solid #e0e0e0",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
          <button
            onClick={loadExample}
            style={{
              padding: "0.5rem 1rem",
              background: "#8b5cf6",
              color: "white",
              border: "none",
              borderRadius: 40,
              fontSize: "0.8rem",
              cursor: "pointer",
            }}
          >
            📖 Example
          </button>
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

        <button
          onClick={calculateBMI}
          disabled={loading}
          style={{
            width: "100%",
            padding: "0.875rem",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            border: "none",
            borderRadius: 40,
            fontSize: "1rem",
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "⏳ Calculating..." : "✨ Calculate BMI"}
        </button>
      </div>

      {/* Results */}
      {bmi && (
        <div
          style={{
            background: "rgba(255,255,255,0.95)",
            borderRadius: 24,
            padding: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <div
              style={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                background: `conic-gradient(${getBMIColor()} 0deg ${(bmi / 40) * 360}deg, #e0e0e0 ${(bmi / 40) * 360}deg 360deg)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto",
              }}
            >
              <div
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  background: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <span style={{ fontSize: "1.8rem", fontWeight: 700, color: getBMIColor() }}>
                  {bmi.toFixed(1)}
                </span>
                <span style={{ fontSize: "0.6rem", color: "#666" }}>BMI</span>
              </div>
            </div>
          </div>

          <div style={{ textAlign: "center", marginBottom: "1rem" }}>
            <span
              style={{
                display: "inline-block",
                padding: "4px 16px",
                background: getBMIColor(),
                color: "white",
                borderRadius: 40,
                fontSize: "0.8rem",
                fontWeight: 600,
              }}
            >
              {category}
            </span>
          </div>

          <div
            style={{
              background: "#f5f5f5",
              borderRadius: 16,
              padding: "1rem",
              marginBottom: "1rem",
            }}
          >
            <p style={{ fontSize: "0.7rem", color: "#666", marginBottom: "0.25rem" }}>
              Ideal weight range:
            </p>
            <p style={{ fontSize: "1rem", fontWeight: 600, margin: 0 }}>{idealWeight}</p>
          </div>

          <div
            style={{
              background: "#d1fae5",
              borderRadius: 16,
              padding: "1rem",
            }}
          >
            <p style={{ fontSize: "0.7rem", color: "#166534", marginBottom: "0.25rem" }}>
              💡 Recommendation:
            </p>
            <p style={{ fontSize: "0.8rem", margin: 0 }}>{getRecommendation()}</p>
          </div>
        </div>
      )}

      {/* BMI Categories */}
      <div
        style={{
          background: "rgba(255,255,255,0.95)",
          borderRadius: 24,
          padding: "1.5rem",
        }}
      >
        <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "0.9rem" }}>📊 BMI Categories</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{ width: 20, height: 20, background: "#f59e0b", borderRadius: 4 }} />
            <span style={{ fontSize: "0.7rem" }}>Underweight: &lt; 18.5</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{ width: 20, height: 20, background: "#22c55e", borderRadius: 4 }} />
            <span style={{ fontSize: "0.7rem" }}>Normal weight: 18.5 – 24.9</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{ width: 20, height: 20, background: "#f97316", borderRadius: 4 }} />
            <span style={{ fontSize: "0.7rem" }}>Overweight: 25 – 29.9</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{ width: 20, height: 20, background: "#ef4444", borderRadius: 4 }} />
            <span style={{ fontSize: "0.7rem" }}>Obese: ≥ 30</span>
          </div>
        </div>
      </div>

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