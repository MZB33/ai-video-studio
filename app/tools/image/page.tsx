"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";

type Style = "cinematic" | "portrait" | "landscape" | "urban" | "abstract";
type Quality = "standard" | "hd" | "ultra";
type Provider = "mock" | "huggingface" | "replicate";

export default function ImageGeneratorPage() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [selectedStyle, setSelectedStyle] = useState<Style>("cinematic");
  const [selectedQuality, setSelectedQuality] = useState<Quality>("hd");
  const [provider, setProvider] = useState<Provider>("mock");

  const generateImage = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    setLoading(true);
    setError("");
    setImageUrl("");

    try {
      const res = await fetch("/api/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          style: selectedStyle,
          quality: selectedQuality,
          provider,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate image");
      
      setImageUrl(data.image);
      setSuccessMsg("✨ Image generated successfully!");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const loadExample = () => {
    setPrompt("A majestic lion sitting on a rock at sunset, cinematic lighting, 4k");
  };

  const handleClear = () => {
    setPrompt("");
    setImageUrl("");
    setError("");
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
        <h1 style={{ color: "white", margin: 0, fontSize: "1.8rem" }}>🎨 AI Image Generator</h1>
        <p style={{ color: "rgba(255,255,255,0.8)", marginTop: "0.25rem" }}>
          Create stunning images from text
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
          📝 Your Prompt
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value.slice(0, 500))}
          placeholder="Describe the image you want to create..."
          rows={4}
          style={{
            width: "100%",
            padding: "1rem",
            fontSize: "1rem",
            borderRadius: 16,
            border: "1px solid #e0e0e0",
            fontFamily: "inherit",
            resize: "vertical",
          }}
        />
        
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem" }}>
          <span style={{ fontSize: "0.7rem", color: "#999" }}>
            {prompt.length} / 500 characters
          </span>
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

        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginTop: "1rem" }}>
          <select
            value={selectedStyle}
            onChange={(e) => setSelectedStyle(e.target.value as Style)}
            style={{ padding: "0.5rem 1rem", borderRadius: 40, border: "1px solid #e0e0e0" }}
          >
            <option value="cinematic">🎬 Cinematic</option>
            <option value="portrait">👤 Portrait</option>
            <option value="landscape">🏔️ Landscape</option>
            <option value="urban">🏙️ Urban</option>
            <option value="abstract">🎨 Abstract</option>
          </select>

          <select
            value={selectedQuality}
            onChange={(e) => setSelectedQuality(e.target.value as Quality)}
            style={{ padding: "0.5rem 1rem", borderRadius: 40, border: "1px solid #e0e0e0" }}
          >
            <option value="standard">Standard</option>
            <option value="hd">HD</option>
            <option value="ultra">Ultra</option>
          </select>

          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value as Provider)}
            style={{ padding: "0.5rem 1rem", borderRadius: 40, border: "1px solid #e0e0e0" }}
          >
            <option value="mock">🎭 Mock (Fast & Free)</option>
            <option value="huggingface">🤗 HuggingFace (Free AI)</option>
            <option value="replicate">⚡ Replicate (Premium)</option>
          </select>
        </div>

        <button
          onClick={generateImage}
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
          {loading ? "🎨 Generating..." : "✨ Generate Image"}
        </button>
      </div>

      {imageUrl && (
        <div
          style={{
            background: "rgba(255,255,255,0.95)",
            borderRadius: 24,
            padding: "1.5rem",
            textAlign: "center",
          }}
        >
          <img
            src={imageUrl}
            alt="Generated"
            style={{ width: "100%", maxWidth: 512, borderRadius: 16, marginBottom: "1rem" }}
          />
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
            <a
              href={imageUrl}
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
                navigator.clipboard.writeText(imageUrl);
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