"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";

interface MoodItem {
  id: string;
  title: string;
  note: string;
  color: string;
}

const COLORS = ["#fef3c7", "#fee2e2", "#dbeafe", "#dcfce7", "#ede9fe", "#f5f5f4"];

export default function MoodBoardPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [items, setItems] = useState<MoodItem[]>([]);

  const addCard = () => {
    if (!title.trim()) return;
    setItems((prev) => [
      {
        id: `${Date.now()}`,
        title: title.trim(),
        note: note.trim(),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      },
      ...prev,
    ]);
    setTitle("");
    setNote("");
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding: "1rem 1rem 80px 1rem" }}>
      <div style={{ marginBottom: "1.5rem", paddingTop: "1rem" }}>
        <button onClick={() => router.back()} style={{ background: "rgba(255,255,255,0.2)", border: "none", padding: "8px 16px", borderRadius: 40, color: "white", cursor: "pointer", marginBottom: "1rem" }}>← Back</button>
        <h1 style={{ color: "white", margin: 0, fontSize: "1.8rem" }}>🎨 Mood Board</h1>
        <p style={{ color: "rgba(255,255,255,0.8)", marginTop: "0.25rem" }}>Capture ideas, themes, and visual directions</p>
      </div>

      <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: 24, padding: "1.5rem", maxWidth: 980, margin: "0 auto" }}>
        <div style={{ display: "grid", gap: 10, marginBottom: "1rem" }}>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Card title (theme, emotion, concept)"
            style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: 12, padding: "0.8rem" }}
          />
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Details, references, or style notes"
            rows={3}
            style={{ width: "100%", border: "1px solid #d1d5db", borderRadius: 12, padding: "0.8rem", resize: "vertical" }}
          />
          <button onClick={addCard} style={{ width: "fit-content", padding: "0.75rem 1rem", borderRadius: 999, border: "none", background: "#4f46e5", color: "white", fontWeight: 700, cursor: "pointer" }}>
            Add mood card
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 12 }}>
          {items.map((item) => (
            <div key={item.id} style={{ background: item.color, borderRadius: 14, border: "1px solid #e2e8f0", padding: "0.9rem" }}>
              <div style={{ fontWeight: 800, color: "#0f172a", marginBottom: 6 }}>{item.title}</div>
              <div style={{ color: "#334155", whiteSpace: "pre-wrap", lineHeight: 1.5 }}>{item.note || "No notes"}</div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav active="tools" onNavigate={(href) => router.push(href)} />
    </div>
  );
}
