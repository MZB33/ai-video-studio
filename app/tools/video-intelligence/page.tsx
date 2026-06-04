"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";
import ComingSoonBlock from "@/components/shared/ComingSoonBlock";

const SUB_TOOLS = [
  {
    id: "transcribe",
    emoji: "📝",
    name: "ویڈیو ٹرانسکرائب",
    desc: "100% درست تحریر",
    free: true,
    soon: false,
    features: ["اردو + انگریزی سپورٹ", "ٹائم اسٹیمپ کے ساتھ", "اسپیکر شناخت", "SRT فائل ڈاؤنلوڈ"],
  },
  {
    id: "scene-story",
    emoji: "🎬",
    name: "سین بہ سین کہانی",
    desc: "ہر سین مکمل تفصیل",
    free: false,
    soon: true,
    features: ["ہر سین کا وقت", "مقام کی تفصیل", "کردار کے عمل", "ماحول کی وضاحت"],
  },
  {
    id: "characters",
    emoji: "👤",
    name: "کردار تجزیہ",
    desc: "ہر کردار کا مکمل تعارف",
    free: false,
    soon: true,
    features: ["کردار کی شخصیت", "تمام مکالمے", "کردار کا سفر", "دیگر کرداروں سے تعلق"],
  },
  {
    id: "story",
    emoji: "📖",
    name: "مکمل اسٹوری",
    desc: "ایک بار چلائیں — پوری کہانی",
    free: false,
    soon: true,
    features: ["آغاز، عروج، انجام", "مرکزی خیال", "ذیلی کہانیاں", "پیغام و نتیجہ"],
  },
  {
    id: "new-story",
    emoji: "✨",
    name: "نئی اسٹوری بنائیں",
    desc: "پرانی بنیاد — نئی تخلیق",
    free: false,
    soon: true,
    features: ["اصل کہانی بدلیں", "نئے کردار شامل کریں", "خاتمہ بدلیں", "انوکھا زاویہ"],
  },
  {
    id: "summary",
    emoji: "📋",
    name: "ویڈیو خلاصہ",
    desc: "مختصر نکات",
    free: true,
    soon: false,
    features: ["اہم نکات", "وقت کی بچت", "اردو خلاصہ", "بلٹ پوائنٹس"],
  },
  {
    id: "dialogues",
    emoji: "💬",
    name: "مکالمے نکالیں",
    desc: "ہر کردار الگ",
    free: true,
    soon: false,
    features: ["کردار کے مطابق", "وقت کے ساتھ", "جذبے کی نشاندہی", "CSV ڈاؤنلوڈ"],
  },
  {
    id: "to-script",
    emoji: "📄",
    name: "ویڈیو سے اسکرپٹ",
    desc: "مکمل لکھا اسکرپٹ",
    free: false,
    soon: true,
    features: ["اسکرین پلے فارمیٹ", "کردار کے نام", "سین ہیڈنگ", "PDF ڈاؤنلوڈ"],
  },
];

export default function VideoIntelligencePage() {
  const router = useRouter();
  const [active, setActive] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState("");

  const activeTool = SUB_TOOLS.find((t) => t.id === active);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1e3a5f 0%, #4c1d95 100%)",
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
        <h1 style={{ color: "white", margin: 0, fontSize: "1.8rem" }}>🧠 ویڈیو ذہانت</h1>
        <p style={{ color: "rgba(255,255,255,0.85)", marginTop: "0.3rem", fontSize: "0.9rem" }}>
          ویڈیو چلائیں — مکمل علم حاصل کریں
        </p>
      </div>

      {/* ویڈیو URL ان پٹ */}
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
            color: "#4c1d95",
            marginBottom: "0.6rem",
            direction: "rtl",
            fontFamily: "serif",
          }}
        >
          🎬 ویڈیو لنک یا فائل اپ لوڈ کریں
        </p>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="url"
            placeholder="YouTube یا ویڈیو URL یہاں پیسٹ کریں..."
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            style={{
              flex: 1,
              padding: "0.7rem 1rem",
              borderRadius: 14,
              border: "1.5px solid #e0e0e0",
              fontSize: "0.85rem",
              outline: "none",
              direction: "ltr",
              fontFamily: "monospace",
            }}
          />
          <button
            style={{
              padding: "0.7rem 1rem",
              background: "#4c1d95",
              color: "white",
              border: "none",
              borderRadius: 14,
              cursor: "pointer",
              fontSize: "0.8rem",
              fontWeight: 700,
              fontFamily: "Tajawal, sans-serif",
              whiteSpace: "nowrap",
            }}
          >
            📤 اپ لوڈ
          </button>
        </div>
        <div
          style={{
            background: "#fffbeb",
            border: "1px solid #fde68a",
            borderRadius: 10,
            padding: "6px 10px",
            marginTop: "0.6rem",
            direction: "rtl",
          }}
        >
          <p style={{ fontSize: "9px", color: "#92400e", fontFamily: "Tajawal, sans-serif" }}>
            ⚡ YouTube، Vimeo، MP4 سپورٹ — جلد آ رہا ہے
          </p>
        </div>
      </div>

      {/* ٹول سلیکشن گرڈ */}
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
              background: active === t.id ? "rgba(255,255,255,0.98)" : "rgba(255,255,255,0.1)",
              border: `1.5px solid ${active === t.id ? "rgba(76,29,149,0.4)" : "rgba(255,255,255,0.2)"}`,
              borderRadius: 14,
              padding: "10px 10px",
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
                  fontSize: "9px",
                  color: active === t.id ? "#6d28d9" : "rgba(255,255,255,0.65)",
                  fontFamily: "Tajawal, sans-serif",
                }}
              >
                {t.desc}
              </span>
              <span
                style={{
                  fontSize: "8px",
                  background: t.free
                    ? active === t.id ? "#d1fae5" : "rgba(16,185,129,0.25)"
                    : active === t.id ? "#ede9fe" : "rgba(109,40,217,0.3)",
                  color: t.free
                    ? active === t.id ? "#065f46" : "#d1fae5"
                    : active === t.id ? "#6d28d9" : "#c4b5fd",
                  padding: "2px 7px",
                  borderRadius: 20,
                  fontFamily: "Tajawal, sans-serif",
                  fontWeight: 700,
                }}
              >
                {t.free ? "مفت" : t.soon ? "جلد" : "پرو"}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* منتخب ٹول */}
      {activeTool && (
        activeTool.soon ? (
          <ComingSoonBlock
            emoji={activeTool.emoji}
            title={activeTool.name}
            subtitle="This powerful feature is under development."
            urduTitle={activeTool.name}
            urduSubtitle="یہ فیچر تیار کیا جا رہا ہے"
            accentColor="#4c1d95"
            features={activeTool.features}
          />
        ) : (
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
                color: "#4c1d95",
                marginBottom: "0.75rem",
                direction: "rtl",
                fontFamily: "serif",
              }}
            >
              {activeTool.emoji} {activeTool.name}
            </h3>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {activeTool.features.map((f, i) => (
                <li
                  key={i}
                  style={{
                    fontSize: "11px",
                    color: "#374151",
                    padding: "5px 0",
                    direction: "rtl",
                    fontFamily: "serif",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    borderBottom: i < activeTool.features.length - 1 ? "0.5px solid #f0eeff" : "none",
                  }}
                >
                  <span style={{ color: "#4c1d95" }}>◆</span> {f}
                </li>
              ))}
            </ul>
            <button
              style={{
                width: "100%",
                marginTop: "0.875rem",
                padding: "0.75rem",
                background: "linear-gradient(135deg, #1e3a5f 0%, #4c1d95 100%)",
                color: "white",
                border: "none",
                borderRadius: 40,
                fontSize: "0.9rem",
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "serif",
              }}
            >
              🚀 شروع کریں
            </button>
          </div>
        )
      )}

      <BottomNav active="tools" onNavigate={(href) => router.push(href)} />
    </div>
  );
}
