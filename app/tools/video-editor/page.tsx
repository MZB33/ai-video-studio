"use client";

import { useRouter } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";
import ToolWorkbench from "@/components/shared/ToolWorkbench";

export default function VideoEditorPage() {
  const router = useRouter();

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding: "1rem 1rem 80px 1rem" }}>
      <div style={{ marginBottom: "1.5rem", paddingTop: "1rem" }}>
        <button onClick={() => router.back()} style={{ background: "rgba(255,255,255,0.2)", border: "none", padding: "8px 16px", borderRadius: 40, color: "white", cursor: "pointer", marginBottom: "1rem" }}>← Back</button>
        <h1 style={{ color: "white", margin: 0, fontSize: "1.8rem" }}>✂️ Video Editor</h1>
        <p style={{ color: "rgba(255,255,255,0.8)", marginTop: "0.25rem" }}>Editing planner and shot workflow</p>
      </div>

      <ToolWorkbench
        primaryLabel="Video objective"
        secondaryLabel="Current footage details"
        primaryPlaceholder="Example: 30-second product teaser"
        secondaryPlaceholder="3 clips, 1 interview, 1 B-roll sequence, target Instagram"
        ctaLabel="Generate edit workflow"
        templates={[
          "Edit plan {index}: Arrange footage for '{primary}' using hook, body, payoff. Source details: {secondary}.",
          "Cut list {index}: Keep pacing tight, remove pauses, add 2 pattern interrupts, and align transitions with {primary}.",
          "Export strategy {index}: Create vertical and horizontal versions for {primary}. Footage context: {secondary}.",
        ]}
      />

      <BottomNav active="tools" onNavigate={(href) => router.push(href)} />
    </div>
  );
}
