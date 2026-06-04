"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";

interface VisualEffectsSubTool {
  id: string;
  name: string;
  nameUr: string;
  icon: string;
  href: string;
  badge?: string;
}

interface VisualEffectsCategory {
  name: string;
  nameUr: string;
  icon: string;
  description: string;
  descriptionUr: string;
  subTools: VisualEffectsSubTool[];
}

const visualEffectsCategory: VisualEffectsCategory = {
  name: "Visual Effects",
  nameUr: "ویژول ایفیکٹس",
  icon: "✨",
  description: "Apply cinematic filters, color grading, and stylistic enhancements",
  descriptionUr: "سنیماٹک فلٹرز، رنگین گریڈنگ، اور اسٹائلش ایفیکٹس لگائیں",
  subTools: [
    { id: "background-blur", name: "Background Blur", nameUr: "پس منظر دھندلاہٹ", icon: "🌫️", href: "/tools/visual-effects/background-blur", badge: "New" },
    { id: "glow", name: "Glow FX", nameUr: "گلو ایف ایکس", icon: "✨", href: "/tools/visual-effects/glow" },
    { id: "duotone", name: "Duotone", nameUr: "ڈیو ٹون", icon: "🎨", href: "/tools/visual-effects/duotone" },
    { id: "vintage", name: "Vintage Film", nameUr: "ونٹیج فلم", icon: "📽️", href: "/tools/visual-effects/vintage", badge: "Popular" },
  ],
};

interface EffectOption {
  id: string;
  name: string;
  nameUr: string;
  icon: string;
  filter: string;
  description: string;
}

const effects: EffectOption[] = [
  {
    id: "original",
    name: "Original",
    nameUr: "اصل",
    icon: "🖼️",
    filter: "",
    description: "No effect applied",
  },
  {
    id: "cinematic",
    name: "Cinematic",
    nameUr: "سنیماٹک",
    icon: "🎬",
    filter: "brightness(1.05) contrast(1.15) saturate(1.2)",
    description: "Movie-like color grading",
  },
  {
    id: "vintage",
    name: "Vintage",
    nameUr: "ونٹیج",
    icon: "📻",
    filter: "sepia(0.5) contrast(0.9) brightness(0.95)",
    description: "Old photo style",
  },
  {
    id: "black-white",
    name: "Black & White",
    nameUr: "سیاہ و سفید",
    icon: "⚫",
    filter: "grayscale(100%)",
    description: "Classic monochrome",
  },
  {
    id: "sepia",
    name: "Sepia",
    nameUr: "سیپیا",
    icon: "🟤",
    filter: "sepia(80%)",
    description: "Warm vintage tone",
  },
  {
    id: "blur",
    name: "Soft Blur",
    nameUr: "نرم دھندلاہٹ",
    icon: "🌫️",
    filter: "blur(2px)",
    description: "Gentle background blur",
  },
  {
    id: "sharpen",
    name: "Sharpen",
    nameUr: "تیز کریں",
    icon: "⚡",
    filter: "contrast(1.1) brightness(1.05)",
    description: "Enhance details",
  },
  {
    id: "neon",
    name: "Neon",
    nameUr: "نیون",
    icon: "💡",
    filter: "saturate(1.5) contrast(1.2) brightness(1.05) hue-rotate(-10deg)",
    description: "Cyberpunk neon style",
  },
  {
    id: "golden-hour",
    name: "Golden Hour",
    nameUr: "سنہری گھنٹہ",
    icon: "🌅",
    filter: "sepia(0.4) saturate(1.3) brightness(1.08) hue-rotate(-5deg)",
    description: "Sunset warm tones",
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    nameUr: "سائبرپنک",
    icon: "🤖",
    filter: "saturate(1.4) contrast(1.15) brightness(0.95) hue-rotate(-15deg)",
    description: "Neon futuristic style",
  },
  {
    id: "dreamy",
    name: "Dreamy",
    nameUr: "خوابیدہ",
    icon: "☁️",
    filter: "brightness(1.08) contrast(0.92) saturate(1.05) blur(0.3px)",
    description: "Soft ethereal look",
  },
  {
    id: "dramatic",
    name: "Dramatic",
    nameUr: "ڈرامائی",
    icon: "🎭",
    filter: "contrast(1.25) brightness(0.9) saturate(1.15)",
    description: "Intense mood",
  },
  {
    id: "pastel",
    name: "Pastel",
    nameUr: "پیسٹل",
    icon: "🌸",
    filter: "saturate(0.85) brightness(1.08) contrast(0.95)",
    description: "Soft pastel colors",
  },
];

export default function VisualEffectsPage() {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState("");
  const [selectedEffect, setSelectedEffect] = useState<string>("original");
  const [processedImage, setProcessedImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [blur, setBlur] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const selectedEffectData = effects.find(e => e.id === selectedEffect);

  const applyEffect = () => {
    if (!imageUrl) {
      setError("Please enter an image URL or drag & drop an image");
      return;
    }

    setLoading(true);
    setError("");

    const img = new Image();
    img.crossOrigin = "Anonymous";
    
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      
      if (ctx) {
        // Build filter string
        const filters = [];
        if (brightness !== 100) filters.push(`brightness(${brightness / 100})`);
        if (contrast !== 100) filters.push(`contrast(${contrast / 100})`);
        if (saturation !== 100) filters.push(`saturate(${saturation / 100})`);
        if (blur > 0) filters.push(`blur(${blur}px)`);
        
        // If a preset effect is selected and no custom adjustments, use preset
        if (selectedEffect !== "original" && brightness === 100 && contrast === 100 && saturation === 100 && blur === 0) {
          filters.push(selectedEffectData?.filter || "");
        }
        
        ctx.filter = filters.filter(Boolean).join(" ");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        
        // Add vignette effect if selected
        if (selectedEffect === "vintage" || selectedEffect === "dramatic") {
          const gradient = ctx.createRadialGradient(
            canvas.width / 2, canvas.height / 2, canvas.width / 3,
            canvas.width / 2, canvas.height / 2, canvas.width / 1.5
          );
          gradient.addColorStop(0, "rgba(0,0,0,0)");
          gradient.addColorStop(1, "rgba(0,0,0,0.4)");
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
        setProcessedImage(dataUrl);
        setSuccessMsg(`✨ ${selectedEffectData?.name} effect applied!`);
        setTimeout(() => setSuccessMsg(""), 3000);
      }
      setLoading(false);
    };
    
    img.onerror = () => {
      setError("Failed to load image. Please check the URL or try another image.");
      setLoading(false);
    };
    
    img.src = imageUrl;
  };

  const resetAll = () => {
    setProcessedImage("");
    setSelectedEffect("original");
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setBlur(0);
    setError("");
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      resetAll();
    } else {
      setError("Please drop an image file");
    }
  };

  const loadExample = () => {
    setImageUrl("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600");
    resetAll();
  };

  const handleClear = () => {
    setImageUrl("");
    setProcessedImage("");
    resetAll();
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
        <h1 style={{ color: "white", margin: 0, fontSize: "1.8rem" }}>
          {visualEffectsCategory?.icon} {visualEffectsCategory?.name}
        </h1>
        <p style={{ color: "rgba(255,255,255,0.8)", marginTop: "0.25rem" }}>
          {visualEffectsCategory?.description}
        </p>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.7rem", marginTop: "0.25rem" }}>
          {visualEffectsCategory?.descriptionUr}
        </p>
      </div>

      {/* Input Section */}
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
        
        {/* Drag & Drop Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            border: `2px dashed ${isDragging ? "#667eea" : "#ccc"}`,
            borderRadius: 16,
            padding: "1rem",
            textAlign: "center",
            marginBottom: "1rem",
            background: isDragging ? "rgba(102,126,234,0.1)" : "transparent",
            transition: "all 0.2s",
          }}
        >
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
          <p style={{ fontSize: "0.7rem", color: "#999", margin: 0 }}>
            Or drag & drop an image here
          </p>
        </div>
        
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

        {/* Effects Grid */}
        <div style={{ marginTop: "1.5rem" }}>
          <label style={{ fontWeight: 600, display: "block", marginBottom: "0.75rem" }}>
            🎨 Choose Effect
          </label>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
              gap: "0.75rem",
              maxHeight: "350px",
              overflowY: "auto",
              padding: "0.25rem",
            }}
          >
            {effects.map((effect) => (
              <button
                key={effect.id}
                onClick={() => setSelectedEffect(effect.id)}
                style={{
                  padding: "0.5rem",
                  borderRadius: 16,
                  background: selectedEffect === effect.id ? "#667eea" : "#f0f0f0",
                  color: selectedEffect === effect.id ? "white" : "#333",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "all 0.2s",
                }}
              >
                <div style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>
                  {effect.icon}
                </div>
                <div style={{ fontSize: "0.7rem", fontWeight: 500 }}>
                  {effect.name}
                </div>
                <div style={{ fontSize: "0.6rem", opacity: 0.7 }}>
                  {effect.nameUr}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Advanced Controls */}
        <div style={{ marginTop: "1rem" }}>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            style={{
              padding: "0.5rem 1rem",
              background: "transparent",
              border: `1px solid #667eea`,
              borderRadius: 40,
              color: "#667eea",
              cursor: "pointer",
              width: "100%",
              marginBottom: "0.5rem",
            }}
          >
            {showAdvanced ? "▲ Hide Advanced Controls" : "▼ Show Advanced Controls"}
          </button>

          {showAdvanced && (
            <div style={{ padding: "0.75rem", background: "#f5f5f5", borderRadius: 16 }}>
              <div style={{ marginBottom: "0.75rem" }}>
                <label style={{ fontSize: "0.8rem", fontWeight: 500 }}>
                  Brightness: {brightness}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                  style={{ width: "100%", marginTop: "0.25rem" }}
                />
              </div>
              <div style={{ marginBottom: "0.75rem" }}>
                <label style={{ fontSize: "0.8rem", fontWeight: 500 }}>
                  Contrast: {contrast}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={contrast}
                  onChange={(e) => setContrast(Number(e.target.value))}
                  style={{ width: "100%", marginTop: "0.25rem" }}
                />
              </div>
              <div style={{ marginBottom: "0.75rem" }}>
                <label style={{ fontSize: "0.8rem", fontWeight: 500 }}>
                  Saturation: {saturation}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={saturation}
                  onChange={(e) => setSaturation(Number(e.target.value))}
                  style={{ width: "100%", marginTop: "0.25rem" }}
                />
              </div>
              <div style={{ marginBottom: "0.75rem" }}>
                <label style={{ fontSize: "0.8rem", fontWeight: 500 }}>
                  Blur: {blur}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.5"
                  value={blur}
                  onChange={(e) => setBlur(Number(e.target.value))}
                  style={{ width: "100%", marginTop: "0.25rem" }}
                />
              </div>
            </div>
          )}
        </div>

        <button
          onClick={applyEffect}
          disabled={loading || !imageUrl}
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
            cursor: loading || !imageUrl ? "not-allowed" : "pointer",
            opacity: loading || !imageUrl ? 0.6 : 1,
          }}
        >
          {loading ? "🎨 Applying effect..." : "✨ Apply Effect"}
        </button>
      </div>

      {/* Preview Section */}
      {imageUrl && (
        <div
          style={{
            background: "rgba(255,255,255,0.95)",
            borderRadius: 24,
            padding: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.1rem" }}>🖼️ Preview</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1.5rem", justifyContent: "center" }}>
            {!processedImage && (
              <div style={{ textAlign: "center", flex: 1 }}>
                <p style={{ fontSize: "0.8rem", color: "#666", marginBottom: "0.5rem" }}>Original</p>
                <img
                  src={imageUrl}
                  alt="Original"
                  style={{
                    maxWidth: "100%",
                    maxHeight: 300,
                    borderRadius: 16,
                    objectFit: "contain",
                  }}
                  onError={() => setError("Failed to load image")}
                />
              </div>
            )}
            {processedImage && (
              <div style={{ textAlign: "center", flex: 1 }}>
                <p style={{ fontSize: "0.8rem", color: "#666", marginBottom: "0.5rem" }}>
                  ✨ {selectedEffectData?.name} Effect
                </p>
                <img
                  src={processedImage}
                  alt="Processed"
                  style={{
                    maxWidth: "100%",
                    maxHeight: 300,
                    borderRadius: 16,
                    objectFit: "contain",
                  }}
                />
                <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", marginTop: "0.5rem", flexWrap: "wrap" }}>
                  <a
                    href={processedImage}
                    download="edited-image.jpg"
                    style={{
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
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(processedImage);
                      setSuccessMsg("📋 Image copied to clipboard!");
                      setTimeout(() => setSuccessMsg(""), 2000);
                    }}
                    style={{
                      padding: "0.25rem 0.75rem",
                      background: "#3b82f6",
                      color: "white",
                      border: "none",
                      borderRadius: 20,
                      fontSize: "0.7rem",
                      cursor: "pointer",
                    }}
                  >
                    📋 Copy
                  </button>
                  <button
                    onClick={() => {
                      setProcessedImage("");
                      setSuccessMsg("Reset to original");
                      setTimeout(() => setSuccessMsg(""), 2000);
                    }}
                    style={{
                      padding: "0.25rem 0.75rem",
                      background: "#ef4444",
                      color: "white",
                      border: "none",
                      borderRadius: 20,
                      fontSize: "0.7rem",
                      cursor: "pointer",
                    }}
                  >
                    🔄 Reset
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sub-tools section from categories.ts */}
      {visualEffectsCategory?.subTools && visualEffectsCategory.subTools.length > 0 && (
        <div
          style={{
            background: "rgba(255,255,255,0.95)",
            borderRadius: 24,
            padding: "1.5rem",
            marginBottom: "1.5rem",
          }}
        >
          <h3 style={{ margin: "0 0 1rem 0", fontSize: "1rem" }}>
            🔧 More Visual Effects Tools
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
              gap: "0.75rem",
            }}
          >
            {visualEffectsCategory.subTools.map((tool: VisualEffectsSubTool) => (
              <button
                key={tool.id}
                onClick={() => router.push(tool.href)}
                style={{
                  padding: "0.75rem",
                  borderRadius: 16,
                  background: "#f5f5f5",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "center",
                  transition: "all 0.2s",
                }}
              >
                <div style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>
                  {tool.icon}
                </div>
                <div style={{ fontSize: "0.7rem", fontWeight: 500 }}>
                  {tool.name}
                </div>
                <div style={{ fontSize: "0.6rem", opacity: 0.7 }}>
                  {tool.nameUr}
                </div>
                {tool.badge && (
                  <span
                    style={{
                      display: "inline-block",
                      fontSize: "0.5rem",
                      background: "#22c55e",
                      color: "white",
                      padding: "2px 6px",
                      borderRadius: 10,
                      marginTop: "4px",
                    }}
                  >
                    {tool.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

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

      <BottomNav active="tools" onNavigate={(href) => router.push(href)} />
    </div>
  );
}