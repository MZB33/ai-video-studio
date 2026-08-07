"use client";

import { useRouter } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";
import ToolWorkbench from "@/components/shared/ToolWorkbench";

export default function BusinessPage() {
  const router = useRouter();

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding: "1rem 1rem 80px 1rem" }}>
      <div style={{ marginBottom: "1.5rem", paddingTop: "1rem" }}>
        <button onClick={() => router.back()} style={{ background: "rgba(255,255,255,0.2)", border: "none", padding: "8px 16px", borderRadius: 40, color: "white", cursor: "pointer", marginBottom: "1rem" }}>← Back</button>
        <h1 style={{ color: "white", margin: 0, fontSize: "1.8rem" }}>📊 Business Suite</h1>
        <p style={{ color: "rgba(255,255,255,0.8)", marginTop: "0.25rem" }}>Business planning workspace</p>
      </div>

      <ToolWorkbench
        primaryLabel="Business idea or product"
        secondaryLabel="Target market and constraints"
        primaryPlaceholder="Example: Online Urdu learning platform for remote workers"
        secondaryPlaceholder="Audience, pricing range, channels, monthly budget..."
        ctaLabel="Generate business pack"
        templates={[
          "Plan {index}: Build {primary} for segment '{secondary}'. Focus on one measurable outcome per month and define acquisition channels before scaling.",
          "Offer {index}: Position {primary} as a clear value promise. Primary customer pain point: {secondary}. Include a low-risk trial and a premium tier.",
          "Execution {index}: Week 1 research, Week 2 prototype, Week 3 launch test, Week 4 review. Keep KPI dashboard tied to {primary} and context '{secondary}'.",
        ]}
      />

      <BottomNav active="tools" onNavigate={(href) => router.push(href)} />
    </div>
  );
}
