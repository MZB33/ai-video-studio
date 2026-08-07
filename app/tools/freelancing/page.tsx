"use client";

import { useRouter } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";
import ToolWorkbench from "@/components/shared/ToolWorkbench";

export default function FreelancingPage() {
  const router = useRouter();

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding: "1rem 1rem 80px 1rem" }}>
      <div style={{ marginBottom: "1.5rem", paddingTop: "1rem" }}>
        <button onClick={() => router.back()} style={{ background: "rgba(255,255,255,0.2)", border: "none", padding: "8px 16px", borderRadius: 40, color: "white", cursor: "pointer", marginBottom: "1rem" }}>← Back</button>
        <h1 style={{ color: "white", margin: 0, fontSize: "1.8rem" }}>💼 Freelancing Hub</h1>
        <p style={{ color: "rgba(255,255,255,0.8)", marginTop: "0.25rem" }}>Proposal and client copy toolkit</p>
      </div>

      <ToolWorkbench
        primaryLabel="Service you offer"
        secondaryLabel="Client need / project brief"
        primaryPlaceholder="Example: Landing page design + conversion copy"
        secondaryPlaceholder="SaaS startup needs high-converting homepage in 10 days"
        ctaLabel="Generate freelancer kit"
        templates={[
          "Proposal {index}: I can deliver {primary} for '{secondary}' with milestones, revisions, and clear communication windows.",
          "Client reply {index}: Thanks for the brief. I suggest a phased plan for {primary} tied to your objective: {secondary}.",
          "Invoice note {index}: Project scope completed for {primary}. Deliverables aligned with {secondary}. Payment due within agreed cycle.",
        ]}
      />

      <BottomNav active="tools" onNavigate={(href) => router.push(href)} />
    </div>
  );
}
