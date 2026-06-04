"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";

type Style = "cinematic" | "portrait" | "landscape" | "urban" | "abstract";
type Quality = "standard" | "hd" | "ultra";
type Provider = "mock" | "huggingface" | "replicate";

interface CinematicPrompt {
  original: string;
  edited: string;
  isEditing: boolean;
  imageUrl?: string;
  isGenerating: boolean;
}

export default function CinematicStudioPage() {
  const router = useRouter();
  const [story, setStory] = useState("");
  const [cinematicPrompts, setCinematicPrompts] = useState<CinematicPrompt[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [selectedStyle, setSelectedStyle] = useState<Style>("cinematic");
  const [selectedQuality, setSelectedQuality] = useState<Quality>("hd");
  const [provider, setProvider] = useState<Provider>("mock");
  const [generatingImage, setGeneratingImage] = useState<number | null>(null);

  const generatePrompts = async () => {
    if (!story.trim()) {
      setError("Please write a story");
      return;
    }
    if (story.length < 10) {
      setError("Story must be at least 10 characters");
      return;
    }

    setLoading(true);
    setError("");
    setCinematicPrompts([]);

    try {
      const res = await fetch("/api/prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ story }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate prompts");
      
      const prompts = (data.result || []).map((text: string) => ({
        original: text,
        edited: text,
        isEditing: false,
        isGenerating: false,
      }));
      setCinematicPrompts(prompts);
      setSuccessMsg(`✨ ${prompts.length} cinematic prompts generated!`);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const generateImage = async (promptText: string, index: number) => {
    setGeneratingImage(index);
    try {
      const res = await fetch("/api/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptText,
          style: selectedStyle,
          quality: selectedQuality,
          provider,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate image");
      
      setCinematicPrompts(prev =>
        prev.map((p, i) =>
          i === index ? { ...p, imageUrl: data.image, isGenerating: false } : p
        )
      );
      setSuccessMsg(`🎨 Scene ${index + 1} image generated!`);
      setTimeout(() => setSuccessMsg(""), 2000);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setError(message);
      setCinematicPrompts(prev =>
        prev.map((p, i) =>
          i === index ? { ...p, isGenerating: false } : p
        )
      );
    } finally {
      setGeneratingImage(null);
    }
  };

  const loadExample = () => {
    setStory("A poor woodcutter stands near a river, holding his axe with tears in his eyes. Suddenly, a goddess emerges from the water and offers him a golden axe. The woodcutter refuses and asks for his old axe. The goddess rewards his honesty.");
  };

  const handleClear = () => {
    setStory("");
    setCinematicPrompts([]);
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
      {/* Header */}
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
        <h1 style={{ color: "white", margin: 0, fontSize: "1.8rem" }}>🎬 Cinematic Studio</h1>
        <p style={{ color: "rgba(255,255,255,0.8)", marginTop: "0.25rem" }}>
          Turn your story into cinematic scenes
        </p>
      </div>

      {/* Story Input Card */}
      <div
        style={{
          background: "rgba(255,255,255,0.95)",
          borderRadius: 24,
          padding: "1.5rem",
          marginBottom: "1.5rem",
        }}
      >
        <label style={{ fontWeight: 600, display: "block", marginBottom: "0.5rem" }}>
          📖 Your Story
        </label>
        <textarea
          value={story}
          onChange={(e) => setStory(e.target.value.slice(0, 5000))}
          placeholder="Write your story here..."
          rows={6}
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
            {story.length} / 5000 characters
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

        {/* Settings */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", marginTop: "1rem" }}>
          <select
            value={selectedStyle}
            onChange={(e) => setSelectedStyle(e.target.value as Style)}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: 40,
              border: "1px solid #e0e0e0",
              background: "white",
            }}
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
            style={{
              padding: "0.5rem 1rem",
              borderRadius: 40,
              border: "1px solid #e0e0e0",
              background: "white",
            }}
          >
            <option value="standard">Standard</option>
            <option value="hd">HD</option>
            <option value="ultra">Ultra</option>
          </select>

          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value as Provider)}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: 40,
              border: "1px solid #e0e0e0",
              background: "white",
            }}
          >
            <option value="mock">🎭 Mock (Fast & Free)</option>
            <option value="huggingface">🤗 HuggingFace (Free AI)</option>
            <option value="replicate">⚡ Replicate (Premium)</option>
          </select>
        </div>

        <button
          onClick={generatePrompts}
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
          {loading ? "🎬 Creating cinematic scenes..." : "🎥 Generate Cinematic Prompts"}
        </button>
      </div>

      {/* Prompts & Images */}
      {cinematicPrompts.length > 0 && (
        <div style={{ marginTop: "1.5rem" }}>
          <h2 style={{ color: "white", fontSize: "1.2rem", marginBottom: "1rem" }}>
            🎬 Cinematic Scenes
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {cinematicPrompts.map((prompt, idx) => (
              <div
                key={idx}
                style={{
                  background: "rgba(255,255,255,0.95)",
                  borderRadius: 20,
                  padding: "1.25rem",
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                    padding: "2px 10px",
                    borderRadius: 20,
                    fontSize: "0.7rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  Scene {idx + 1}
                </div>
                <p style={{ fontSize: "0.85rem", color: "#333", lineHeight: 1.5 }}>
                  {prompt.edited}
                </p>
                <button
                  onClick={() => generateImage(prompt.edited, idx)}
                  disabled={generatingImage === idx}
                  style={{
                    padding: "0.5rem 1rem",
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: 40,
                    fontSize: "0.8rem",
                    cursor: generatingImage === idx ? "not-allowed" : "pointer",
                    opacity: generatingImage === idx ? 0.6 : 1,
                  }}
                >
                  {generatingImage === idx ? "🎨 Generating..." : "🖼️ Generate Image"}
                </button>
                {prompt.imageUrl && (
                  <div style={{ marginTop: "1rem" }}>
                    <img
                      src={prompt.imageUrl}
                      alt={`Scene ${idx + 1}`}
                      style={{ width: "100%", maxWidth: 400, borderRadius: 16 }}
                    />
                    <a
                      href={prompt.imageUrl}
                      download
                      style={{
                        display: "inline-block",
                        marginTop: "0.5rem",
                        padding: "0.25rem 0.75rem",
                        background: "#10b981",
                        color: "white",
                        textDecoration: "none",
                        borderRadius: 20,
                        fontSize: "0.7rem",
                      }}
                    >
                      💾 Download
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error/Success Messages */}
      {error && (
        <div
          style={{
            marginTop: "1rem",
            padding: "0.75rem",
            background: "rgba(239,68,68,0.1)",
            borderRadius: 12,
            color: "#ef4444",
            textAlign: "center",
          }}
        >
          ❌ {error}
        </div>
      )}
      {successMsg && (
        <div
          style={{
            marginTop: "1rem",
            padding: "0.75rem",
            background: "rgba(34,197,94,0.1)",
            borderRadius: 12,
            color: "#22c55e",
            textAlign: "center",
          }}
        >
          ✅ {successMsg}
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNav active="tools" onNavigate={(href) => router.push(href)} />
    </div>
  );
}