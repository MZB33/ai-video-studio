"use client";

import { useRouter } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";
import ToolWorkbench from "@/components/shared/ToolWorkbench";

export default function WritingPage() {
  const router = useRouter();

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding: "1rem 1rem 80px 1rem" }}>
      <div style={{ marginBottom: "1.5rem", paddingTop: "1rem" }}>
        <button onClick={() => router.back()} style={{ background: "rgba(255,255,255,0.2)", border: "none", padding: "8px 16px", borderRadius: 40, color: "white", cursor: "pointer", marginBottom: "1rem" }}>← Back</button>
        <h1 style={{ color: "white", margin: 0, fontSize: "1.8rem" }}>✍️ Writing Hub</h1>
        <p style={{ color: "rgba(255,255,255,0.8)", marginTop: "0.25rem" }}>Write drafts instantly</p>
      </div>

      <ToolWorkbench
        primaryLabel="Topic"
        secondaryLabel="Audience + tone"
        primaryPlaceholder="Example: Why digital privacy matters"
        secondaryPlaceholder="Students, formal tone, 300-500 words"
        ctaLabel="Generate writing drafts"
        templates={[
          "Draft {index}: '{primary}' for {secondary}. Open with a clear hook, establish context, and end with a practical takeaway.",
          "Outline {index}: Intro for {primary}; 3 body sections tailored to {secondary}; concise conclusion with one action step.",
          "Polished version {index}: Keep sentences short, remove repetition, and ensure each paragraph reinforces {primary} for {secondary}.",
        ]}
      />

      <BottomNav active="tools" onNavigate={(href) => router.push(href)} />
    </div>
  );
}
