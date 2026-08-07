"use client";

import { ChangeEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";

export default function ImageUpscalerPage() {
  const router = useRouter();
  const [src, setSrc] = useState("");
  const [scale, setScale] = useState(2);
  const [output, setOutput] = useState("");

  const info = useMemo(() => {
    if (!src) return "Upload an image to begin.";
    return `Ready to upscale ${scale}x`;
  }, [src, scale]);

  const onFile = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setSrc(String(reader.result || ""));
    reader.readAsDataURL(file);
  };

  const upscale = () => {
    if (!src) return;
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.width * scale;
      canvas.height = image.height * scale;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      setOutput(canvas.toDataURL("image/png"));
    };
    image.src = src;
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding: "1rem 1rem 80px 1rem" }}>
      <div style={{ marginBottom: "1.5rem", paddingTop: "1rem" }}>
        <button onClick={() => router.back()} style={{ background: "rgba(255,255,255,0.2)", border: "none", padding: "8px 16px", borderRadius: 40, color: "white", cursor: "pointer", marginBottom: "1rem" }}>← Back</button>
        <h1 style={{ color: "white", margin: 0, fontSize: "1.8rem" }}>🔍 Image Upscaler</h1>
        <p style={{ color: "rgba(255,255,255,0.8)", marginTop: "0.25rem" }}>Upscale images directly in your browser</p>
      </div>

      <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: 24, padding: "1.5rem", maxWidth: 980, margin: "0 auto" }}>
        <div style={{ display: "grid", gap: 10 }}>
          <input type="file" accept="image/*" onChange={onFile} />
          <label style={{ fontWeight: 700 }}>Scale: {scale}x</label>
          <input type="range" min={2} max={4} value={scale} onChange={(event) => setScale(Number(event.target.value))} style={{ accentColor: "#4f46e5" }} />
          <button onClick={upscale} disabled={!src} style={{ width: "fit-content", padding: "0.75rem 1rem", borderRadius: 999, border: "none", background: src ? "#4f46e5" : "#94a3b8", color: "white", fontWeight: 700, cursor: src ? "pointer" : "not-allowed" }}>
            Upscale now
          </button>
          <div style={{ color: "#475569", fontSize: "0.9rem" }}>{info}</div>
        </div>

        <div style={{ marginTop: "1rem", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 12 }}>
          <div style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: "0.6rem", background: "#f8fafc" }}>
            <div style={{ fontSize: "0.8rem", color: "#64748b", marginBottom: 6 }}>Original</div>
            {src ? <img src={src} alt="original" style={{ width: "100%", borderRadius: 10 }} /> : <div style={{ color: "#94a3b8", padding: "2rem 0", textAlign: "center" }}>No image selected</div>}
          </div>
          <div style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: "0.6rem", background: "#f8fafc" }}>
            <div style={{ fontSize: "0.8rem", color: "#64748b", marginBottom: 6 }}>Upscaled</div>
            {output ? <img src={output} alt="upscaled" style={{ width: "100%", borderRadius: 10 }} /> : <div style={{ color: "#94a3b8", padding: "2rem 0", textAlign: "center" }}>Run upscaling to preview</div>}
          </div>
        </div>
      </div>

      <BottomNav active="tools" onNavigate={(href) => router.push(href)} />
    </div>
  );
}
