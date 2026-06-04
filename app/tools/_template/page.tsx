"use client";

import { useRouter } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";

export default function ToolPage() {
  const router = useRouter();

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding: "1rem 1rem 80px 1rem" }}>
      <div style={{ marginBottom: "1.5rem", paddingTop: "1rem" }}>
        <button onClick={() => router.back()} style={{ background: "rgba(255,255,255,0.2)", border: "none", padding: "8px 16px", borderRadius: 40, color: "white", cursor: "pointer", marginBottom: "1rem" }}>← Back</button>
        <h1 style={{ color: "white", margin: 0, fontSize: "1.8rem" }}>🛠️ Tool Name</h1>
        <p style={{ color: "rgba(255,255,255,0.8)", marginTop: "0.25rem" }}>This tool is coming soon!</p>
      </div>

      <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: 24, padding: "3rem", textAlign: "center" }}>
        <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🚧</div>
        <h2 style={{ margin: 0, fontSize: "1.5rem" }}>Coming Soon</h2>
        <p style={{ color: "#666", marginTop: "0.5rem" }}>We are working hard to bring you this tool.</p>
        <p style={{ fontSize: "0.8rem", color: "#999", marginTop: "1rem" }}>Check back later!</p>
      </div>

      <BottomNav active="tools" onNavigate={(href) => router.push(href)} />
    </div>
  );
}