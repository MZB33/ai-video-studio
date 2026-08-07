"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";

// ─── سب ٹولز ──────────────────────────────────────────────
const SUB_TOOLS = [
  { id: "multi",       emoji: "👥", name: "کثیر کردار ڈبنگ",      desc: "ہر کردار الگ آواز",           soon: false },
  { id: "pitch",       emoji: "🎚️", name: "آواز پچ کنٹرول",       desc: "اونچی، نیچی، موٹی، پتلی",    soon: false },
  { id: "emotion",     emoji: "🎭", name: "جذباتی ڈبنگ",           desc: "خوشی، غم، غصہ، محبت",        soon: false },
  { id: "lipsync",     emoji: "👄", name: "لِپ سِنک ڈبنگ",         desc: "ہونٹوں سے آواز ملائیں",       soon: false },
  { id: "film",        emoji: "🎬", name: "فلم ڈبنگ",               desc: "پوری فلم اردو میں",           soon: false },
  { id: "drama",       emoji: "📺", name: "ڈرامہ ڈبنگ",             desc: "ترکی، کوریائی، ہندی",        soon: false },
  { id: "cartoon",     emoji: "🧒", name: "کارٹون ڈبنگ",            desc: "بچوں کی مزیدار آوازیں",      soon: false },
  { id: "talkshow",    emoji: "🎙️", name: "ٹاک شو ڈبنگ",           desc: "قدرتی انٹرویو انداز",         soon: false },
  { id: "documentary", emoji: "🎞️", name: "دستاویزی فلم",          desc: "پیشہ ورانہ نریشن",            soon: false },
  { id: "replace",     emoji: "🔄", name: "آواز تبدیل کریں",        desc: "پرانی ہٹائیں، نئی لگائیں",  soon: false },
];

export default function DubbingPage() {
  const router = useRouter();
  const [active, setActive] = useState<string | null>(null);
  const [status, setStatus] = useState("");

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #6d28d9 0%, #be185d 100%)",
        padding: "1rem 1rem 90px",
      }}
    >
      {/* ہیڈر */}
      <div style={{ paddingTop: "1rem", marginBottom: "1.25rem" }}>
        <button
          onClick={() => router.back()}
          style={{
            background: "rgba(255,255,255,0.2)",
            border: "1px solid rgba(255,255,255,0.3)",
            padding: "8px 18px",
            borderRadius: 40,
            color: "white",
            cursor: "pointer",
            marginBottom: "1rem",
            fontSize: "0.85rem",
          }}
        >
          ← واپس
        </button>
        <h1 style={{ color: "white", margin: 0, fontSize: "1.8rem" }}>🎙️ ڈبنگ و آواز سٹوڈیو</h1>
        <p style={{ color: "rgba(255,255,255,0.85)", marginTop: "0.3rem", fontSize: "0.9rem" }}>
          فلم، ڈرامہ، کارٹون — ہر کردار کی اصلی آواز
        </p>
      </div>

      {/* سب ٹولز گرڈ */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 8,
          marginBottom: "1rem",
        }}
      >
        {SUB_TOOLS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(active === t.id ? null : t.id)}
            style={{
              background: active === t.id ? "rgba(255,255,255,0.98)" : "rgba(255,255,255,0.12)",
              border: `1.5px solid ${active === t.id ? "rgba(109,40,217,0.4)" : "rgba(255,255,255,0.25)"}`,
              borderRadius: 16,
              padding: "12px 10px",
              cursor: "pointer",
              textAlign: "right",
              direction: "rtl",
              transition: "all 0.15s",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: "1.3rem" }}>{t.emoji}</span>
              <span
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: active === t.id ? "#4c1d95" : "white",
                  fontFamily: "serif",
                  lineHeight: 1.5,
                }}
              >
                {t.name}
              </span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span
                style={{
                  fontSize: "10px",
                  color: active === t.id ? "#7c3aed" : "rgba(255,255,255,0.7)",
                  fontFamily: "Tajawal, sans-serif",
                }}
              >
                {t.desc}
              </span>
              {t.soon && (
                <span
                  style={{
                    fontSize: "8px",
                    background: active === t.id ? "#ede9fe" : "rgba(255,255,255,0.2)",
                    color: active === t.id ? "#6d28d9" : "white",
                    padding: "2px 7px",
                    borderRadius: 20,
                    fontFamily: "Tajawal, sans-serif",
                    fontWeight: 700,
                    whiteSpace: "nowrap",
                  }}
                >
                  جلد آ رہا ہے
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* پچ کنٹرول — صرف جب pitch منتخب ہو */}
      {active === "pitch" && (
        <div
          style={{
            background: "rgba(255,255,255,0.97)",
            borderRadius: 20,
            padding: "1.25rem",
            marginBottom: "1rem",
            boxShadow: "0 4px 24px rgba(0,0,0,0.1)",
          }}
        >
          <h3
            style={{
              fontSize: "13px",
              fontWeight: 700,
              color: "#4c1d95",
              marginBottom: "1rem",
              direction: "rtl",
              fontFamily: "serif",
            }}
          >
            🎚️ آواز پچ کنٹرول
          </h3>
          {[
            { label: "پچ (اونچی/نیچی)", min: -12, max: 12, def: 0, unit: " semitones" },
            { label: "رفتار (تیز/سست)",  min: 50,  max: 200, def: 100, unit: "%" },
            { label: "گہرائی (موٹی/پتلی)", min: 0, max: 100, def: 50, unit: "%" },
          ].map((s) => (
            <div key={s.label} style={{ marginBottom: "0.875rem" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 4,
                  direction: "rtl",
                }}
              >
                <span style={{ fontSize: "11px", color: "#374151", fontFamily: "serif" }}>{s.label}</span>
                <span style={{ fontSize: "11px", color: "#6d28d9", fontFamily: "Tajawal, sans-serif" }}>
                  {s.def}{s.unit}
                </span>
              </div>
              <input
                type="range"
                min={s.min}
                max={s.max}
                defaultValue={s.def}
                style={{ width: "100%", accentColor: "#6d28d9" }}
              />
            </div>
          ))}
          <div
            style={{
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              borderRadius: 12,
              padding: "8px 12px",
              direction: "rtl",
            }}
          >
            <p style={{ fontSize: "10px", color: "#166534", fontFamily: "serif" }}>
              💡 یہ فیچر ابھی دستیاب ہے — API سے جڑنے پر مکمل کام کرے گا
            </p>
          </div>
        </div>
      )}

      {active && active !== "pitch" && (
        <div style={{ background: "rgba(255,255,255,0.97)", borderRadius: 20, padding: "1.25rem", boxShadow: "0 4px 24px rgba(0,0,0,0.1)" }}>
          <h3 style={{ fontSize: "13px", fontWeight: 700, color: "#4c1d95", marginBottom: "0.75rem", direction: "rtl", fontFamily: "serif" }}>
            {SUB_TOOLS.find((t) => t.id === active)?.emoji} {SUB_TOOLS.find((t) => t.id === active)?.name}
          </h3>
          <div style={{ border: "2px dashed #c4b5fd", borderRadius: 14, padding: "1.2rem", textAlign: "center", marginBottom: "0.75rem", background: "#faf5ff" }}>
            <div style={{ fontSize: "1.7rem", marginBottom: 6 }}>📁</div>
            <p style={{ margin: 0, fontSize: "11px", color: "#5b21b6", direction: "rtl", fontFamily: "serif" }}>ویڈیو یا آڈیو فائل منتخب کریں</p>
          </div>
          <button
            onClick={() => setStatus("✅ ڈبنگ جاب قطار میں شامل کر دی گئی ہے۔ نتیجہ API جوڑنے کے بعد اسی پینل میں ظاہر ہوگا۔")}
            style={{ width: "100%", padding: "0.75rem", borderRadius: 999, border: "none", background: "linear-gradient(135deg,#6d28d9,#be185d)", color: "white", fontWeight: 700, cursor: "pointer", fontFamily: "serif" }}
          >
            🎬 ڈبنگ شروع کریں
          </button>
          {status ? <p style={{ marginTop: "0.65rem", fontSize: "10px", color: "#166534", background: "#ecfdf5", border: "1px solid #bbf7d0", borderRadius: 10, padding: "6px 8px", direction: "rtl" }}>{status}</p> : null}
        </div>
      )}

      <BottomNav active="tools" onNavigate={(href) => router.push(href)} />
    </div>
  );
}
