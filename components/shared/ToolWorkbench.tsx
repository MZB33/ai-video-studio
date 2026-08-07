"use client";

import { useMemo, useState } from "react";

interface ToolWorkbenchProps {
  primaryLabel: string;
  secondaryLabel: string;
  primaryPlaceholder: string;
  secondaryPlaceholder: string;
  ctaLabel: string;
  templates: string[];
  initialPrimary?: string;
  initialSecondary?: string;
}

function fillTemplate(template: string, primary: string, secondary: string, index: number) {
  return template
    .replaceAll("{primary}", primary)
    .replaceAll("{secondary}", secondary)
    .replaceAll("{index}", String(index + 1));
}

export default function ToolWorkbench({
  primaryLabel,
  secondaryLabel,
  primaryPlaceholder,
  secondaryPlaceholder,
  ctaLabel,
  templates,
  initialPrimary = "",
  initialSecondary = "",
}: ToolWorkbenchProps) {
  const [primary, setPrimary] = useState(initialPrimary);
  const [secondary, setSecondary] = useState(initialSecondary);
  const [count, setCount] = useState(3);
  const [output, setOutput] = useState<string[]>([]);
  const [error, setError] = useState("");

  const canGenerate = useMemo(() => primary.trim().length > 2, [primary]);

  const generate = () => {
    if (!canGenerate) {
      setError("Please add more detail in the first field.");
      return;
    }

    const rows = Array.from({ length: count }).map((_, index) => {
      const template = templates[index % templates.length];
      return fillTemplate(template, primary.trim(), secondary.trim() || "N/A", index);
    });

    setOutput(rows);
    setError("");
  };

  const copyAll = async () => {
    if (output.length === 0) {
      return;
    }
    await navigator.clipboard.writeText(output.join("\n\n"));
  };

  return (
    <div style={{ background: "rgba(255,255,255,0.96)", borderRadius: 24, padding: "1.5rem", maxWidth: 900, margin: "0 auto" }}>
      <div style={{ display: "grid", gap: "1rem" }}>
        <label style={{ display: "flex", flexDirection: "column", gap: 6, fontWeight: 700 }}>
          {primaryLabel}
          <input
            value={primary}
            onChange={(event) => setPrimary(event.target.value)}
            placeholder={primaryPlaceholder}
            style={{ width: "100%", padding: "0.95rem 1rem", borderRadius: 14, border: "1px solid #d1d5db", fontSize: "0.95rem" }}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: 6, fontWeight: 700 }}>
          {secondaryLabel}
          <textarea
            value={secondary}
            onChange={(event) => setSecondary(event.target.value)}
            placeholder={secondaryPlaceholder}
            rows={4}
            style={{ width: "100%", padding: "0.95rem 1rem", borderRadius: 14, border: "1px solid #d1d5db", fontSize: "0.95rem", resize: "vertical" }}
          />
        </label>

        <label style={{ display: "flex", flexDirection: "column", gap: 6, fontWeight: 700 }}>
          Number of outputs: {count}
          <input
            type="range"
            min={1}
            max={6}
            value={count}
            onChange={(event) => setCount(Number(event.target.value))}
            style={{ width: "100%", accentColor: "#4f46e5" }}
          />
        </label>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            onClick={generate}
            style={{ padding: "0.85rem 1.1rem", borderRadius: 999, border: "none", background: "#4f46e5", color: "white", fontWeight: 700, cursor: "pointer" }}
          >
            {ctaLabel}
          </button>
          <button
            onClick={copyAll}
            disabled={output.length === 0}
            style={{ padding: "0.85rem 1.1rem", borderRadius: 999, border: "1px solid #cbd5e1", background: "white", color: "#0f172a", fontWeight: 700, cursor: output.length ? "pointer" : "not-allowed" }}
          >
            Copy all
          </button>
        </div>
      </div>

      {error ? <div style={{ marginTop: "1rem", background: "#fee2e2", color: "#991b1b", borderRadius: 12, padding: "0.8rem" }}>{error}</div> : null}

      <div style={{ marginTop: "1.25rem", display: "grid", gap: 10 }}>
        {output.map((item, index) => (
          <div key={`${item}-${index}`} style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: "0.95rem", background: "#f8fafc", whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
            {item}
          </div>
        ))}
      </div>
    </div>
  )
}
