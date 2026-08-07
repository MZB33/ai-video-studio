"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";

const STYLES = [
  { id: "cartoon",    emoji: "🎨", name: "کارٹون",       color: "#f97316" },
  { id: "anime",      emoji: "⚡", name: "اینیمے",       color: "#6d28d9" },
  { id: "2d",         emoji: "🖼️", name: "2D فلیٹ",     color: "#0284c7" },
  { id: "3d",         emoji: "🌐", name: "3D",           color: "#059669" },
  { id: "whiteboard", emoji: "📋", name: "وائٹ بورڈ",   color: "#be185d" },
  { id: "motion",     emoji: "✨", name: "موشن",         color: "#d97706" },
];

const SUB_TOOLS = [
  { id: "film-to-cartoon",  emoji: "🎬", name: "فلم سے کارٹون",       desc: "اصل فلم → مکمل کارٹون",       soon: false },
  { id: "photo-to-cartoon", emoji: "📷", name: "تصویر سے کارٹون",     desc: "اپنی تصویر کارٹون بنائیں",    soon: false },
  { id: "character-create", emoji: "👾", name: "کارٹون کردار بنائیں", desc: "اپنا منفرد کردار ڈیزائن کریں", soon: false },
  { id: "anime-style",      emoji: "⚡", name: "اینیمے اسٹائل",        desc: "جاپانی انداز میں تبدیلی",     soon: false },
  { id: "whiteboard",       emoji: "📋", name: "وائٹ بورڈ اینیمیشن",  desc: "تعلیمی ویڈیو بنائیں",          soon: false },
  { id: "motion-graphics",  emoji: "✨", name: "موشن گرافکس",          desc: "متحرک ٹیکسٹ و لوگو",          soon: false },
  { id: "2d-animation",     emoji: "🖼️", name: "2D اینیمیشن",         desc: "فلیٹ کارٹون اسٹائل",          soon: false },
  { id: "3d-animation",     emoji: "🌐", name: "3D اینیمیشن",          desc: "تھری ڈی کردار و منظر",        soon: false },
];

export default function AnimationPage() {
  const router = useRouter();
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<string | null>(null);

  const tool = SUB_TOOLS.find((t) => t.id === activeTool);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f59e0b 0%, #ef4444 50%, #6d28d9 100%)",
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
        <h1 style={{ color: "white", margin: 0, fontSize: "1.8rem" }}>🎨 انیمیشن و کارٹون اسٹوڈیو</h1>
        <p style={{ color: "rgba(255,255,255,0.85)", marginTop: "0.3rem", fontSize: "0.9rem" }}>
          اصل ویڈیو سے کارٹون — نئی دنیا بنائیں
        </p>
      </div>

      {/* اسٹائل سلیکٹر */}
      <div
        style={{
          background: "rgba(255,255,255,0.97)",
          borderRadius: 18,
          padding: "1rem",
          marginBottom: "1rem",
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
        }}
      >
        <p
          style={{
            fontSize: "11px",
            fontWeight: 700,
            color: "#374151",
            marginBottom: "0.6rem",
            direction: "rtl",
            fontFamily: "serif",
          }}
        >
          اینیمیشن اسٹائل منتخب کریں:
        </p>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {STYLES.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedStyle(selectedStyle === s.id ? null : s.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                padding: "6px 12px",
                borderRadius: 30,
                border: `1.5px solid ${selectedStyle === s.id ? s.color : "#e0e0e0"}`,
                background: selectedStyle === s.id ? `${s.color}18` : "transparent",
                cursor: "pointer",
                fontSize: "11px",
                color: selectedStyle === s.id ? s.color : "#6b7280",
                fontFamily: "serif",
                fontWeight: selectedStyle === s.id ? 700 : 400,
              }}
            >
              <span>{s.emoji}</span> {s.name}
            </button>
          ))}
        </div>
      </div>

      {/* ٹولز گرڈ */}
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
            onClick={() => setActiveTool(activeTool === t.id ? null : t.id)}
            style={{
              background: activeTool === t.id ? "rgba(255,255,255,0.98)" : "rgba(255,255,255,0.12)",
              border: `1.5px solid ${activeTool === t.id ? "rgba(245,158,11,0.5)" : "rgba(255,255,255,0.25)"}`,
              borderRadius: 14,
              padding: "11px 10px",
              cursor: "pointer",
              textAlign: "right",
              direction: "rtl",
              transition: "all 0.15s",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
              <span style={{ fontSize: "1.1rem" }}>{t.emoji}</span>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  color: activeTool === t.id ? "#92400e" : "white",
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
                  fontSize: "9px",
                  color: activeTool === t.id ? "#b45309" : "rgba(255,255,255,0.65)",
                  fontFamily: "Tajawal, sans-serif",
                }}
              >
                {t.desc}
              </span>
              {t.soon && (
                <span
                  style={{
                    fontSize: "8px",
                    background: activeTool === t.id ? "#fef3c7" : "rgba(255,255,255,0.2)",
                    color: activeTool === t.id ? "#92400e" : "white",
                    padding: "2px 6px",
                    borderRadius: 20,
                    fontFamily: "Tajawal, sans-serif",
                    fontWeight: 700,
                  }}
                >
                  جلد
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* منتخب ٹول */}
      {tool && (
          <div
            style={{
              background: "rgba(255,255,255,0.97)",
              borderRadius: 20,
              padding: "1.25rem",
              boxShadow: "0 4px 24px rgba(0,0,0,0.1)",
            }}
          >
            <h3
              style={{
                fontSize: "13px",
                fontWeight: 700,
                color: "#92400e",
                marginBottom: "0.75rem",
                direction: "rtl",
                fontFamily: "serif",
              }}
            >
              {tool.emoji} {tool.name}
            </h3>

            {/* تصویر اپ لوڈ */}
            <div
              style={{
                border: "2px dashed #fde68a",
                borderRadius: 14,
                padding: "2rem",
                textAlign: "center",
                marginBottom: "0.875rem",
                background: "#fffbeb",
                cursor: "pointer",
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: 6 }}>📸</div>
              <p style={{ fontSize: "12px", color: "#92400e", fontFamily: "serif", direction: "rtl" }}>
                تصویر یہاں ڈالیں یا کلک کریں
              </p>
              <p style={{ fontSize: "10px", color: "#b45309", fontFamily: "Tajawal, sans-serif", marginTop: 4 }}>
                JPG، PNG، WEBP — جلد آ رہا ہے
              </p>
            </div>

            <button
              style={{
                width: "100%",
                padding: "0.75rem",
                background: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
                color: "white",
                border: "none",
                borderRadius: 40,
                fontSize: "0.9rem",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "serif",
              }}
            >
              🎨 کارٹون بنائیں
            </button>
          </div>
      )}

      <BottomNav active="tools" onNavigate={(href) => router.push(href)} />
    </div>
  );
}
