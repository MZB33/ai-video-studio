"use client";

import { useRouter } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";
import ToolWorkbench from "@/components/shared/ToolWorkbench";

export default function ScriptWriterPage() {
  const router = useRouter();

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding: "1rem 1rem 80px 1rem" }}>
      <div style={{ marginBottom: "1.5rem", paddingTop: "1rem" }}>
        <button onClick={() => router.back()} style={{ background: "rgba(255,255,255,0.2)", border: "none", padding: "8px 16px", borderRadius: 40, color: "white", cursor: "pointer", marginBottom: "1rem" }}>← Back</button>
        <h1 style={{ color: "white", margin: 0, fontSize: "1.8rem" }}>📝 Script Writer</h1>
        <p style={{ color: "rgba(255,255,255,0.8)", marginTop: "0.25rem" }}>Scene and dialogue generator</p>
      </div>

      <ToolWorkbench
        primaryLabel="Story concept"
        secondaryLabel="Genre and target platform"
        primaryPlaceholder="Example: A detective who can hear memories"
        secondaryPlaceholder="Thriller, YouTube short, 2 minutes"
        ctaLabel="Generate script set"
        templates={[
          "Script {index} - Hook: Introduce {primary} in 1 line. Build tension quickly for {secondary}.",
          "Script {index} - Scene flow: Scene 1 setup, Scene 2 conflict, Scene 3 twist, Scene 4 payoff. Keep dialogue aligned with '{primary}'.",
          "Script {index} - Dialogue pass: Each line should either reveal character or move plot. Tone guide: {secondary}.",
        ]}
      />

      <BottomNav active="tools" onNavigate={(href) => router.push(href)} />
    </div>
  );
}
