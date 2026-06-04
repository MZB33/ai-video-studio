"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";

export default function FaceSwapperPage() {
  const router = useRouter();
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [targetImage, setTargetImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  
  const sourceInputRef = useRef<HTMLInputElement>(null);
  const targetInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: "source" | "target") => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (type === "source") {
        setSourceImage(event.target?.result as string);
      } else {
        setTargetImage(event.target?.result as string);
      }
    };
    reader.readAsDataURL(file);
    setResultImage(null);
    setError("");
  };

  const swapFaces = async () => {
    if (!sourceImage || !targetImage) {
      setError("Please upload both source and target images");
      return;
    }

    setLoading(true);
    setError("");
    setResultImage(null);

    // Simulate face swapping (in production, use actual AI API)
    setTimeout(() => {
      // For demo, we'll just show a preview effect
      // In production, replace with Replicate API call
      setResultImage(targetImage);
      setSuccessMsg("✨ Face swap completed! (Demo version)");
      setTimeout(() => setSuccessMsg(""), 3000);
      setLoading(false);
    }, 2000);
  };

  const downloadResult = () => {
    if (resultImage) {
      const link = document.createElement("a");
      link.href = resultImage;
      link.download = `face-swap-${Date.now()}.png`;
      link.click();
    }
  };

  const clearAll = () => {
    setSourceImage(null);
    setTargetImage(null);
    setResultImage(null);
    setError("");
    if (sourceInputRef.current) sourceInputRef.current.value = "";
    if (targetInputRef.current) targetInputRef.current.value = "";
  };

  const loadExample = () => {
    setSourceImage("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400");
    setTargetImage("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400");
    setResultImage(null);
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding: "1rem 1rem 80px 1rem" }}>
      <div style={{ marginBottom: "1.5rem", paddingTop: "1rem" }}>
        <button onClick={() => router.back()} style={{ background: "rgba(255,255,255,0.2)", border: "none", padding: "8px 16px", borderRadius: 40, color: "white", cursor: "pointer", marginBottom: "1rem" }}>← Back</button>
        <h1 style={{ color: "white", margin: 0, fontSize: "1.8rem" }}>🔄 AI Face Swapper</h1>
        <p style={{ color: "rgba(255,255,255,0.8)", marginTop: "0.25rem" }}>Swap faces between two images instantly</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem", marginBottom: "1.5rem" }}>
        {/* Source Face */}
        <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: 24, padding: "1.5rem", textAlign: "center" }}>
          <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1rem" }}>👤 Source Face</h3>
          <p style={{ fontSize: "0.7rem", color: "#666", marginBottom: "1rem" }}>The face to swap FROM</p>
          <div style={{ 
            width: "100%", 
            aspectRatio: "1/1", 
            background: "#f0f0f0", 
            borderRadius: 16, 
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            border: "2px dashed #ccc",
          }}>
            {sourceImage ? (
              <img src={sourceImage} alt="Source" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <span style={{ fontSize: "3rem", opacity: 0.5 }}>📷</span>
            )}
          </div>
          <input
            ref={sourceInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, "source")}
            style={{ display: "none" }}
            id="source-upload"
          />
          <label htmlFor="source-upload" style={{ display: "inline-block", padding: "0.5rem 1rem", background: "#667eea", color: "white", borderRadius: 40, fontSize: "0.8rem", cursor: "pointer" }}>
            📁 Upload Face
          </label>
        </div>

        {/* Target Face */}
        <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: 24, padding: "1.5rem", textAlign: "center" }}>
          <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1rem" }}>👥 Target Face</h3>
          <p style={{ fontSize: "0.7rem", color: "#666", marginBottom: "1rem" }}>The face to swap ONTO</p>
          <div style={{ 
            width: "100%", 
            aspectRatio: "1/1", 
            background: "#f0f0f0", 
            borderRadius: 16, 
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            border: "2px dashed #ccc",
          }}>
            {targetImage ? (
              <img src={targetImage} alt="Target" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <span style={{ fontSize: "3rem", opacity: 0.5 }}>📷</span>
            )}
          </div>
          <input
            ref={targetInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => handleImageUpload(e, "target")}
            style={{ display: "none" }}
            id="target-upload"
          />
          <label htmlFor="target-upload" style={{ display: "inline-block", padding: "0.5rem 1rem", background: "#667eea", color: "white", borderRadius: 40, fontSize: "0.8rem", cursor: "pointer" }}>
            📁 Upload Target
          </label>
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: "1rem", justifyContent: "center", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <button onClick={loadExample} style={{ padding: "0.5rem 1rem", background: "#8b5cf6", color: "white", border: "none", borderRadius: 40, cursor: "pointer" }}>
          📖 Load Example
        </button>
        <button onClick={clearAll} style={{ padding: "0.5rem 1rem", background: "#ef4444", color: "white", border: "none", borderRadius: 40, cursor: "pointer" }}>
          🗑️ Clear All
        </button>
      </div>

      {/* Swap Button */}
      <button
        onClick={swapFaces}
        disabled={loading || !sourceImage || !targetImage}
        style={{
          width: "100%",
          maxWidth: 300,
          display: "block",
          margin: "0 auto 1.5rem",
          padding: "1rem",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          border: "none",
          borderRadius: 60,
          fontSize: "1rem",
          fontWeight: 600,
          cursor: loading || !sourceImage || !targetImage ? "not-allowed" : "pointer",
          opacity: loading || !sourceImage || !targetImage ? 0.6 : 1,
        }}
      >
        {loading ? "⏳ Swapping Faces..." : "🔄 Swap Faces Now"}
      </button>

      {/* Result */}
      {resultImage && (
        <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: 24, padding: "1.5rem", textAlign: "center" }}>
          <h3 style={{ margin: "0 0 1rem 0", fontSize: "1rem" }}>✨ Result ✨</h3>
          <img src={resultImage} alt="Result" style={{ maxWidth: "100%", maxHeight: 300, borderRadius: 16, marginBottom: "1rem" }} />
          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={downloadResult} style={{ padding: "0.5rem 1rem", background: "#10b981", color: "white", border: "none", borderRadius: 40, cursor: "pointer" }}>
              💾 Download Result
            </button>
            <button onClick={() => { navigator.clipboard.writeText(resultImage); setSuccessMsg("📋 Image copied!"); setTimeout(() => setSuccessMsg(""), 2000); }} style={{ padding: "0.5rem 1rem", background: "#3b82f6", color: "white", border: "none", borderRadius: 40, cursor: "pointer" }}>
              📋 Copy Image
            </button>
          </div>
          <p style={{ fontSize: "0.7rem", color: "#999", marginTop: "1rem" }}>
            ⚡ Demo version. Real AI face swapping coming soon!
          </p>
        </div>
      )}

      {error && <div style={{ marginTop: "1rem", padding: "0.75rem", background: "rgba(239,68,68,0.1)", borderRadius: 12, color: "#ef4444", textAlign: "center" }}>❌ {error}</div>}
      {successMsg && <div style={{ marginTop: "1rem", padding: "0.75rem", background: "rgba(34,197,94,0.1)", borderRadius: 12, color: "#22c55e", textAlign: "center" }}>✅ {successMsg}</div>}

      <BottomNav active="tools" onNavigate={(href) => router.push(href)} />
    </div>
  );
}