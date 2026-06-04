"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";

type ConversionType = 
  | "length"
  | "weight"
  | "temperature"
  | "area"
  | "volume"
  | "speed"
  | "time"
  | "digital";

interface UnitOption {
  value: string;
  label: string;
  labelUr: string;
  toBase: (val: number) => number;
  fromBase: (val: number) => number;
}

const conversionTypes = [
  { id: "length", name: "Length", nameUr: "لمبائی", icon: "📏", color: "#667eea" },
  { id: "weight", name: "Weight", nameUr: "وزن", icon: "⚖️", color: "#10b981" },
  { id: "temperature", name: "Temperature", nameUr: "درجہ حرارت", icon: "🌡️", color: "#ef4444" },
  { id: "area", name: "Area", nameUr: "رقبہ", icon: "📐", color: "#8b5cf6" },
  { id: "volume", name: "Volume", nameUr: "حجم", icon: "🧪", color: "#f59e0b" },
  { id: "speed", name: "Speed", nameUr: "رفتار", icon: "🏃", color: "#06b6d4" },
  { id: "time", name: "Time", nameUr: "وقت", icon: "⏰", color: "#ec4899" },
  { id: "digital", name: "Digital Storage", nameUr: "ڈیجیٹل اسٹوریج", icon: "💾", color: "#22c55e" },
];

const unitConfigs: Record<ConversionType, UnitOption[]> = {
  length: [
    { value: "m", label: "Meter", labelUr: "میٹر", toBase: (v) => v, fromBase: (v) => v },
    { value: "km", label: "Kilometer", labelUr: "کلومیٹر", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
    { value: "cm", label: "Centimeter", labelUr: "سینٹی میٹر", toBase: (v) => v / 100, fromBase: (v) => v * 100 },
    { value: "mm", label: "Millimeter", labelUr: "ملی میٹر", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { value: "mile", label: "Mile", labelUr: "میل", toBase: (v) => v * 1609.34, fromBase: (v) => v / 1609.34 },
    { value: "yard", label: "Yard", labelUr: "یارڈ", toBase: (v) => v * 0.9144, fromBase: (v) => v / 0.9144 },
    { value: "foot", label: "Foot", labelUr: "فٹ", toBase: (v) => v * 0.3048, fromBase: (v) => v / 0.3048 },
    { value: "inch", label: "Inch", labelUr: "انچ", toBase: (v) => v * 0.0254, fromBase: (v) => v / 0.0254 },
  ],
  weight: [
    { value: "kg", label: "Kilogram", labelUr: "کلوگرام", toBase: (v) => v, fromBase: (v) => v },
    { value: "g", label: "Gram", labelUr: "گرام", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { value: "mg", label: "Milligram", labelUr: "ملی گرام", toBase: (v) => v / 1000000, fromBase: (v) => v * 1000000 },
    { value: "lb", label: "Pound", labelUr: "پاؤنڈ", toBase: (v) => v * 0.453592, fromBase: (v) => v / 0.453592 },
    { value: "oz", label: "Ounce", labelUr: "اونس", toBase: (v) => v * 0.0283495, fromBase: (v) => v / 0.0283495 },
    { value: "ton", label: "Metric Ton", labelUr: "میٹرک ٹن", toBase: (v) => v * 1000, fromBase: (v) => v / 1000 },
  ],
  temperature: [
    { value: "c", label: "Celsius", labelUr: "سیلسیس", toBase: (v) => v, fromBase: (v) => v },
    { value: "f", label: "Fahrenheit", labelUr: "فارن ہائیٹ", toBase: (v) => (v - 32) * 5/9, fromBase: (v) => (v * 9/5) + 32 },
    { value: "k", label: "Kelvin", labelUr: "کیلون", toBase: (v) => v - 273.15, fromBase: (v) => v + 273.15 },
  ],
  area: [
    { value: "sqm", label: "Square Meter", labelUr: "مربع میٹر", toBase: (v) => v, fromBase: (v) => v },
    { value: "sqkm", label: "Square Kilometer", labelUr: "مربع کلومیٹر", toBase: (v) => v * 1e6, fromBase: (v) => v / 1e6 },
    { value: "sqft", label: "Square Foot", labelUr: "مربع فٹ", toBase: (v) => v * 0.092903, fromBase: (v) => v / 0.092903 },
    { value: "acre", label: "Acre", labelUr: "ایکڑ", toBase: (v) => v * 4046.86, fromBase: (v) => v / 4046.86 },
    { value: "hectare", label: "Hectare", labelUr: "ہیکٹر", toBase: (v) => v * 10000, fromBase: (v) => v / 10000 },
  ],
  volume: [
    { value: "l", label: "Liter", labelUr: "لیٹر", toBase: (v) => v, fromBase: (v) => v },
    { value: "ml", label: "Milliliter", labelUr: "ملی لیٹر", toBase: (v) => v / 1000, fromBase: (v) => v * 1000 },
    { value: "gal", label: "Gallon", labelUr: "گیلن", toBase: (v) => v * 3.78541, fromBase: (v) => v / 3.78541 },
    { value: "qt", label: "Quart", labelUr: "کوارٹ", toBase: (v) => v * 0.946353, fromBase: (v) => v / 0.946353 },
    { value: "cup", label: "Cup", labelUr: "کپ", toBase: (v) => v * 0.236588, fromBase: (v) => v / 0.236588 },
  ],
  speed: [
    { value: "kmh", label: "km/h", labelUr: "کلومیٹر فی گھنٹہ", toBase: (v) => v, fromBase: (v) => v },
    { value: "mph", label: "mph", labelUr: "میل فی گھنٹہ", toBase: (v) => v * 1.60934, fromBase: (v) => v / 1.60934 },
    { value: "ms", label: "m/s", labelUr: "میٹر فی سیکنڈ", toBase: (v) => v * 3.6, fromBase: (v) => v / 3.6 },
    { value: "knot", label: "Knot", labelUr: "ناٹ", toBase: (v) => v * 1.852, fromBase: (v) => v / 1.852 },
  ],
  time: [
    { value: "s", label: "Second", labelUr: "سیکنڈ", toBase: (v) => v, fromBase: (v) => v },
    { value: "min", label: "Minute", labelUr: "منٹ", toBase: (v) => v * 60, fromBase: (v) => v / 60 },
    { value: "hr", label: "Hour", labelUr: "گھنٹہ", toBase: (v) => v * 3600, fromBase: (v) => v / 3600 },
    { value: "day", label: "Day", labelUr: "دن", toBase: (v) => v * 86400, fromBase: (v) => v / 86400 },
    { value: "week", label: "Week", labelUr: "ہفتہ", toBase: (v) => v * 604800, fromBase: (v) => v / 604800 },
    { value: "month", label: "Month", labelUr: "مہینہ", toBase: (v) => v * 2629746, fromBase: (v) => v / 2629746 },
    { value: "year", label: "Year", labelUr: "سال", toBase: (v) => v * 31556952, fromBase: (v) => v / 31556952 },
  ],
  digital: [
    { value: "b", label: "Byte", labelUr: "بائٹ", toBase: (v) => v, fromBase: (v) => v },
    { value: "kb", label: "Kilobyte", labelUr: "کلو بائٹ", toBase: (v) => v * 1024, fromBase: (v) => v / 1024 },
    { value: "mb", label: "Megabyte", labelUr: "میگا بائٹ", toBase: (v) => v * 1048576, fromBase: (v) => v / 1048576 },
    { value: "gb", label: "Gigabyte", labelUr: "گیگا بائٹ", toBase: (v) => v * 1073741824, fromBase: (v) => v / 1073741824 },
    { value: "tb", label: "Terabyte", labelUr: "ٹیرا بائٹ", toBase: (v) => v * 1099511627776, fromBase: (v) => v / 1099511627776 },
  ],
};

export default function UnitConverterPage() {
  const router = useRouter();
  const [conversionType, setConversionType] = useState<ConversionType>("length");
  const [fromUnit, setFromUnit] = useState("");
  const [toUnit, setToUnit] = useState("");
  const [fromValue, setFromValue] = useState("");
  const [toValue, setToValue] = useState("");
  const [error, setError] = useState("");

  const currentUnits = unitConfigs[conversionType];

  // Initialize units when type changes
  useState(() => {
    if (currentUnits.length >= 2) {
      setFromUnit(currentUnits[0].value);
      setToUnit(currentUnits[1].value);
    }
  });

  const convert = () => {
    if (!fromValue || isNaN(Number(fromValue))) {
      setError("Please enter a valid number");
      return;
    }

    const fromUnitObj = currentUnits.find(u => u.value === fromUnit);
    const toUnitObj = currentUnits.find(u => u.value === toUnit);

    if (!fromUnitObj || !toUnitObj) {
      setError("Invalid units selected");
      return;
    }

    const value = Number(fromValue);
    const inBase = fromUnitObj.toBase(value);
    const result = toUnitObj.fromBase(inBase);
    setToValue(result.toFixed(6));
    setError("");
  };

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
    setFromValue(toValue);
    setToValue(fromValue);
  };

  const currentType = conversionTypes.find(t => t.id === conversionType);

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
        <h1 style={{ color: "white", margin: 0, fontSize: "1.8rem" }}>📐 Unit Converter</h1>
        <p style={{ color: "rgba(255,255,255,0.8)", marginTop: "0.25rem" }}>
          Convert between different units of measurement
        </p>
      </div>

      {/* Conversion Type Selection */}
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
          {conversionTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => {
                setConversionType(type.id as ConversionType);
                setFromValue("");
                setToValue("");
                setError("");
                if (unitConfigs[type.id as ConversionType].length >= 2) {
                  setFromUnit(unitConfigs[type.id as ConversionType][0].value);
                  setToUnit(unitConfigs[type.id as ConversionType][1].value);
                }
              }}
              style={{
                padding: "0.5rem",
                borderRadius: 16,
                background: conversionType === type.id ? type.color : "#f0f0f0",
                color: conversionType === type.id ? "white" : "#333",
                border: "none",
                cursor: "pointer",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "1.2rem" }}>{type.icon}</div>
              <div style={{ fontSize: "0.65rem", fontWeight: 500 }}>{type.name}</div>
              <div style={{ fontSize: "0.55rem", opacity: 0.7 }}>{type.nameUr}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Converter */}
      <div
        style={{
          background: "rgba(255,255,255,0.95)",
          borderRadius: 24,
          padding: "1.5rem",
          marginBottom: "1.5rem",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <span
            style={{
              display: "inline-block",
              padding: "4px 12px",
              background: currentType?.color,
              color: "white",
              borderRadius: 20,
              fontSize: "0.7rem",
            }}
          >
            {currentType?.name} Converter
          </span>
        </div>

        {/* From Section */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ fontWeight: 500, marginBottom: "0.25rem", display: "block" }}>
            From:
          </label>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              style={{
                flex: 1,
                padding: "0.75rem",
                borderRadius: 16,
                border: "1px solid #e0e0e0",
                fontSize: "0.9rem",
              }}
            >
              {currentUnits.map((unit) => (
                <option key={unit.value} value={unit.value}>
                  {unit.label} ({unit.labelUr})
                </option>
              ))}
            </select>
            <input
              type="number"
              value={fromValue}
              onChange={(e) => {
                setFromValue(e.target.value);
                setError("");
              }}
              placeholder="Enter value"
              style={{
                flex: 1,
                padding: "0.75rem",
                borderRadius: 16,
                border: "1px solid #e0e0e0",
                fontSize: "0.9rem",
              }}
            />
          </div>
        </div>

        {/* Swap Button */}
        <div style={{ textAlign: "center", marginBottom: "1rem" }}>
          <button
            onClick={swapUnits}
            style={{
              background: "#667eea",
              color: "white",
              border: "none",
              borderRadius: 40,
              padding: "0.5rem 1rem",
              fontSize: "1rem",
              cursor: "pointer",
            }}
          >
            ⇅ Swap
          </button>
        </div>

        {/* To Section */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ fontWeight: 500, marginBottom: "0.25rem", display: "block" }}>
            To:
          </label>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              style={{
                flex: 1,
                padding: "0.75rem",
                borderRadius: 16,
                border: "1px solid #e0e0e0",
                fontSize: "0.9rem",
              }}
            >
              {currentUnits.map((unit) => (
                <option key={unit.value} value={unit.value}>
                  {unit.label} ({unit.labelUr})
                </option>
              ))}
            </select>
            <input
              type="text"
              value={toValue}
              readOnly
              placeholder="Result"
              style={{
                flex: 1,
                padding: "0.75rem",
                borderRadius: 16,
                border: "1px solid #e0e0e0",
                fontSize: "0.9rem",
                background: "#f5f5f5",
              }}
            />
          </div>
        </div>

        <button
          onClick={convert}
          style={{
            width: "100%",
            padding: "0.875rem",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            border: "none",
            borderRadius: 40,
            fontSize: "1rem",
            fontWeight: 600,
            cursor: "pointer",
            marginTop: "0.5rem",
          }}
        >
          ✨ Convert
        </button>
      </div>

      {/* Quick Reference Table */}
      <div
        style={{
          background: "rgba(255,255,255,0.95)",
          borderRadius: 24,
          padding: "1.5rem",
        }}
      >
        <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "0.9rem" }}>📖 Common Conversions</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "0.5rem",
            fontSize: "0.7rem",
          }}
        >
          {conversionType === "length" && (
            <>
              <div>1 inch = 2.54 cm</div>
              <div>1 foot = 0.3048 m</div>
              <div>1 mile = 1.609 km</div>
              <div>1 km = 0.621 miles</div>
            </>
          )}
          {conversionType === "weight" && (
            <>
              <div>1 kg = 2.205 lbs</div>
              <div>1 lb = 0.453 kg</div>
              <div>1 oz = 28.35 g</div>
              <div>1 ton = 1000 kg</div>
            </>
          )}
          {conversionType === "temperature" && (
            <>
              <div>0°C = 32°F = 273.15K</div>
              <div>100°C = 212°F = 373.15K</div>
              <div>°F = (°C × 9/5) + 32</div>
              <div>K = °C + 273.15</div>
            </>
          )}
          {conversionType === "digital" && (
            <>
              <div>1 KB = 1024 Bytes</div>
              <div>1 MB = 1024 KB</div>
              <div>1 GB = 1024 MB</div>
              <div>1 TB = 1024 GB</div>
            </>
          )}
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

      <BottomNav active="tools" onNavigate={(href) => router.push(href)} />
    </div>
  );
}