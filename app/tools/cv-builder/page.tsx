"use client";

import { useRouter } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";
import ToolWorkbench from "@/components/shared/ToolWorkbench";

export default function CvBuilderPage() {
  const router = useRouter();

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding: "1rem 1rem 80px 1rem" }}>
      <div style={{ marginBottom: "1.5rem", paddingTop: "1rem" }}>
        <button onClick={() => router.back()} style={{ background: "rgba(255,255,255,0.2)", border: "none", padding: "8px 16px", borderRadius: 40, color: "white", cursor: "pointer", marginBottom: "1rem" }}>← Back</button>
        <h1 style={{ color: "white", margin: 0, fontSize: "1.8rem" }}>📄 CV Builder</h1>
        <p style={{ color: "rgba(255,255,255,0.8)", marginTop: "0.25rem" }}>Resume and career draft generator</p>
      </div>

      <ToolWorkbench
        primaryLabel="Target role"
        secondaryLabel="Skills, experience, achievements"
        primaryPlaceholder="Example: Frontend Engineer"
        secondaryPlaceholder="React, Next.js, 3 years, improved conversion by 18%"
        ctaLabel="Generate CV drafts"
        templates={[
          "CV Summary {index}: Results-focused candidate for {primary}. Core strengths: {secondary}.",
          "Experience bullets {index}: Use measurable outcomes, action verbs, and role-specific language for {primary}. Context: {secondary}.",
          "Cover-letter opener {index}: I am applying for {primary}. My background in {secondary} aligns with your goals.",
        ]}
      />

      <BottomNav active="tools" onNavigate={(href) => router.push(href)} />
    </div>
  );
}
