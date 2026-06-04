"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";

export default function BackgroundRemoverPage() {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState("");
  const [processedImage, setProcessedImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [backgroundType, setBackgroundType] = useState<"blur" | "white" | "green" | "remove" | "custom">("remove");
  const [customBackgroundUrl, setCustomBackgroundUrl] = useState("");

  const processBackground = async () => {
    if (!imageUrl.trim()) {
      setError("Please enter an image URL");
      return;
    }

    setLoading(true);
    setError("");
    setProcessedImage("");

    try {
      const res = await fetch("/api/background", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageUrl,
          backgroundType,
          customImageUrl: customBackgroundUrl,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to process background");
      
      setProcessedImage(data.processed);
      setSuccessMsg(`✨ Background ${backgroundType === "remove" ? "removed" : "changed"} successfully!`);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const loadExample = () => {
    setImageUrl("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600");
  };

  const handleClear = () => {
    setImageUrl("");
    setProcessedImage("");
    setError("");
    setCustomBackgroundUrl("");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "1rem 1rem 80px 1rem",
      }}
    >
      <div style={{ marginBottom: "1.5rem", paddingTop: "1rem" }}>
        <button
          onClick={() => router.back()}
          style={{
            background: "rgba(255,255,255,0.2)",
            border: "none",
            padding: "8px 16px",
            borderRadius: 40,
            color: "white",
            cursor: "pointer",
            marginBottom: "1rem",
          }}
        >
          ← Back
        </button>
        <h1 style={{ color: "white", margin: 0, fontSize: "1.8rem" }}>🖼️ Background Remover</h1>
        <p style={{ color: "rgba(255,255,255,0.8)", marginTop: "0.25rem" }}>
          Remove or change image backgrounds
        </p>
      </div>

      <div
        style={{
          background: "rgba(255,255,255,0.95)",
          borderRadius: 24,
          padding: "1.5rem",
          marginBottom: "1.5rem",
        }}
      >
        <label style={{ fontWeight: 600, display: "block", marginBottom: "0.5rem" }}>
          🖼️ Image URL
        </label>
        <input
          type="text"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://example.com/image.jpg"
          style={{
            width: "100%",
            padding: "0.875rem",
            fontSize: "1rem",
            borderRadius: 16,
            border: "1px solid #e0e0e0",
            marginBottom: "0.5rem",
          }}
        />
        
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem" }}>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={loadExample}
              style={{
                padding: "0.25rem 0.75rem",
                fontSize: "0.7rem",
                background: "#8b5cf6",
                color: "white",
                border: "none",
                borderRadius: 40,
                cursor: "pointer",
              }}
            >
              📖 Example
            </button>
            <button
              onClick={handleClear}
              style={{
                padding: "0.25rem 0.75rem",
                fontSize: "0.7rem",
                background: "#ef4444",
                color: "white",
                border: "none",
                borderRadius: 40,
                cursor: "pointer",
              }}
            >
              Clear
            </button>
          </div>
        </div>

        <div style={{ marginTop: "1rem" }}>
          <label style={{ fontWeight: 600, display: "block", marginBottom: "0.5rem" }}>
            🎨 Background Effect
          </label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            <button
              onClick={() => setBackgroundType("remove")}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: 40,
                background: backgroundType === "remove" ? "#667eea" : "#f0f0f0",
                color: backgroundType === "remove" ? "white" : "#333",
                border: "none",
                cursor: "pointer",
              }}
            >
              ✨ Remove Background
            </button>
            <button
              onClick={() => setBackgroundType("blur")}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: 40,
                background: backgroundType === "blur" ? "#667eea" : "#f0f0f0",
                color: backgroundType === "blur" ? "white" : "#333",
                border: "none",
                cursor: "pointer",
              }}
            >
              🌫️ Blur Background
            </button>
            <button
              onClick={() => setBackgroundType("white")}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: 40,
                background: backgroundType === "white" ? "#667eea" : "#f0f0f0",
                color: backgroundType === "white" ? "white" : "#333",
                border: "none",
                cursor: "pointer",
              }}
            >
              ⬜ White Background
            </button>
            <button
              onClick={() => setBackgroundType("green")}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: 40,
                background: backgroundType === "green" ? "#667eea" : "#f0f0f0",
                color: backgroundType === "green" ? "white" : "#333",
                border: "none",
                cursor: "pointer",
              }}
            >
              🟢 Green Screen
            </button>
            <button
              onClick={() => setBackgroundType("custom")}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: 40,
                background: backgroundType === "custom" ? "#667eea" : "#f0f0f0",
                color: backgroundType === "custom" ? "white" : "#333",
                border: "none",
                cursor: "pointer",
              }}
            >
              🖼️ Custom
            </button>
          </div>
        </div>

        {backgroundType === "custom" && (
          <div style={{ marginTop: "1rem" }}>
            <label style={{ fontWeight: 600, display: "block", marginBottom: "0.5rem" }}>
              🖼️ Custom Background URL
            </label>
            <input
              type="text"
              value={customBackgroundUrl}
              onChange={(e) => setCustomBackgroundUrl(e.target.value)}
              placeholder="https://example.com/background.jpg"
              style={{
                width: "100%",
                padding: "0.875rem",
                fontSize: "1rem",
                borderRadius: 16,
                border: "1px solid #e0e0e0",
              }}
            />
          </div>
        )}

        <button
          onClick={processBackground}
          disabled={loading}
          style={{
            width: "100%",
            marginTop: "1rem",
            padding: "0.875rem",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            border: "none",
            borderRadius: 40,
            fontSize: "1rem",
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {loading ? "🎨 Processing..." : "✨ Apply Background Effect"}
        </button>
      </div>

      {processedImage && (
        <div
          style={{
            background: "rgba(255,255,255,0.95)",
            borderRadius: 24,
            padding: "1.5rem",
            textAlign: "center",
          }}
        >
          <img
            src={processedImage}
            alt="Processed"
            style={{ width: "100%", maxWidth: 512, borderRadius: 16, marginBottom: "1rem" }}
          />
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <a
              href={processedImage}
              download
              style={{
                padding: "0.5rem 1rem",
                background: "#10b981",
                color: "white",
                textDecoration: "none",
                borderRadius: 40,
                fontSize: "0.8rem",
              }}
            >
              💾 Download
            </a>
            <button
              onClick={() => {
                navigator.clipboard.writeText(processedImage);
                setSuccessMsg("📋 URL copied!");
                setTimeout(() => setSuccessMsg(""), 2000);
              }}
              style={{
                padding: "0.5rem 1rem",
                background: "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: 40,
                fontSize: "0.8rem",
                cursor: "pointer",
              }}
            >
              📋 Copy URL
            </button>
          </div>
        </div>
      )}

      {error && (
        <div style={{ marginTop: "1rem", padding: "0.75rem", background: "rgba(239,68,68,0.1)", borderRadius: 12, color: "#ef4444", textAlign: "center" }}>
          ❌ {error}
        </div>
      )}
      {successMsg && (
        <div style={{ marginTop: "1rem", padding: "0.75rem", background: "rgba(34,197,94,0.1)", borderRadius: 12, color: "#22c55e", textAlign: "center" }}>
          ✅ {successMsg}
        </div>
      )}

      <BottomNav active="tools" onNavigate={(href) => router.push(href)} />
    </div>
  );
}