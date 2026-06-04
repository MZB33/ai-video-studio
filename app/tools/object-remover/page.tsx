"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";

export default function ObjectRemoverPage() {
  const router = useRouter();
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [brushSize, setBrushSize] = useState(30);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const imgUrl = event.target?.result as string;
      setOriginalImage(imgUrl);
      setProcessedImage(null);
      setError("");
      
      // Load image on canvas
      const img = new Image();
      img.onload = () => {
        if (canvasRef.current && imgRef.current) {
          imgRef.current.src = imgUrl;
          const canvas = canvasRef.current;
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0);
        }
      };
      img.src = imgUrl;
    };
    reader.readAsDataURL(file);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    
    if (ctx) {
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const removeObject = async () => {
    if (!originalImage) {
      setError("Please upload an image first");
      return;
    }

    setLoading(true);
    setError("");
    setProcessedImage(null);

    // Simulate AI object removal (in production, use actual AI API)
    setTimeout(() => {
      // For demo, just show the canvas result
      if (canvasRef.current) {
        const resultUrl = canvasRef.current.toDataURL();
        setProcessedImage(resultUrl);
        setSuccessMsg("✨ Object removed successfully! (Demo version)");
        setTimeout(() => setSuccessMsg(""), 3000);
      }
      setLoading(false);
    }, 2000);
  };

  const downloadResult = () => {
    if (processedImage) {
      const link = document.createElement("a");
      link.href = processedImage;
      link.download = `object-removed-${Date.now()}.png`;
      link.click();
    }
  };

  const resetImage = () => {
    if (originalImage) {
      const img = new Image();
      img.onload = () => {
        if (canvasRef.current) {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d");
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);
        }
      };
      img.src = originalImage;
      setProcessedImage(null);
    }
  };

  const clearAll = () => {
    setOriginalImage(null);
    setProcessedImage(null);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const loadExample = () => {
    setOriginalImage("https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600");
    setProcessedImage(null);
    // Load example image on canvas
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0);
      }
    };
    img.src = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600";
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding: "1rem 1rem 80px 1rem" }}>
      <div style={{ marginBottom: "1.5rem", paddingTop: "1rem" }}>
        <button onClick={() => router.back()} style={{ background: "rgba(255,255,255,0.2)", border: "none", padding: "8px 16px", borderRadius: 40, color: "white", cursor: "pointer", marginBottom: "1rem" }}>← Back</button>
        <h1 style={{ color: "white", margin: 0, fontSize: "1.8rem" }}>🗑️ AI Object Remover</h1>
        <p style={{ color: "rgba(255,255,255,0.8)", marginTop: "0.25rem" }}>Remove unwanted objects from your images</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem", marginBottom: "1.5rem" }}>
        {/* Left Panel - Upload & Controls */}
        <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: 24, padding: "1.5rem" }}>
          <h3 style={{ margin: "0 0 1rem 0", fontSize: "1rem" }}>📤 Upload Image</h3>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
          />

          {!originalImage && (
            <button onClick={loadExample} style={{ width: "100%", padding: "0.5rem", background: "#8b5cf6", color: "white", border: "none", borderRadius: 40, cursor: "pointer", marginBottom: "1rem" }}>
              📖 Load Example Image
            </button>
          )}

          {originalImage && (
            <>
              <div style={{ marginBottom: "1rem" }}>
                <label style={{ fontWeight: 500, marginBottom: "0.25rem", display: "block" }}>Brush Size: {brushSize}px</label>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={brushSize}
                  onChange={(e) => setBrushSize(Number(e.target.value))}
                  style={{ width: "100%" }}
                />
              </div>

              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
                <button onClick={resetImage} style={{ flex: 1, padding: "0.5rem", background: "#3b82f6", color: "white", border: "none", borderRadius: 40, cursor: "pointer" }}>
                  🔄 Reset
                </button>
                <button onClick={clearAll} style={{ flex: 1, padding: "0.5rem", background: "#ef4444", color: "white", border: "none", borderRadius: 40, cursor: "pointer" }}>
                  🗑️ Clear
                </button>
              </div>

              <button
                onClick={removeObject}
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "0.75rem",
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
                {loading ? "⏳ AI Removing..." : "✨ Remove Marked Objects"}
              </button>
            </>
          )}
        </div>

        {/* Right Panel - Canvas for marking */}
        <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: 24, padding: "1.5rem" }}>
          <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1rem" }}>🖌️ Mark Objects to Remove</h3>
          <p style={{ fontSize: "0.7rem", color: "#666", marginBottom: "1rem" }}>
            Paint over the objects you want to remove
          </p>
          
          {!originalImage ? (
            <div style={{ 
              background: "#f0f0f0", 
              borderRadius: 16, 
              padding: "3rem", 
              textAlign: "center",
              border: "2px dashed #ccc",
            }}>
              <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>🖼️</div>
              <p>Upload an image to start</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto", textAlign: "center" }}>
              <canvas
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                style={{
                  maxWidth: "100%",
                  height: "auto",
                  borderRadius: 12,
                  cursor: "crosshair",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                }}
              />
              <p style={{ fontSize: "0.65rem", color: "#999", marginTop: "0.5rem" }}>
                ✏️ Draw over objects you want to remove
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Result */}
      {processedImage && (
        <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: 24, padding: "1.5rem", textAlign: "center", marginBottom: "1.5rem" }}>
          <h3 style={{ margin: "0 0 1rem 0", fontSize: "1rem" }}>✨ Result ✨</h3>
          <img src={processedImage} alt="Result" style={{ maxWidth: "100%", maxHeight: 300, borderRadius: 16, marginBottom: "1rem" }} />
          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={downloadResult} style={{ padding: "0.5rem 1rem", background: "#10b981", color: "white", border: "none", borderRadius: 40, cursor: "pointer" }}>
              💾 Download Result
            </button>
            <button onClick={() => { navigator.clipboard.writeText(processedImage); setSuccessMsg("📋 Image copied!"); setTimeout(() => setSuccessMsg(""), 2000); }} style={{ padding: "0.5rem 1rem", background: "#3b82f6", color: "white", border: "none", borderRadius: 40, cursor: "pointer" }}>
              📋 Copy Image
            </button>
          </div>
          <p style={{ fontSize: "0.7rem", color: "#999", marginTop: "1rem" }}>
            ⚡ Demo version. Real AI object removal coming soon!
          </p>
        </div>
      )}

      {error && <div style={{ marginTop: "1rem", padding: "0.75rem", background: "rgba(239,68,68,0.1)", borderRadius: 12, color: "#ef4444", textAlign: "center" }}>❌ {error}</div>}
      {successMsg && <div style={{ marginTop: "1rem", padding: "0.75rem", background: "rgba(34,197,94,0.1)", borderRadius: 12, color: "#22c55e", textAlign: "center" }}>✅ {successMsg}</div>}

      <BottomNav active="tools" onNavigate={(href) => router.push(href)} />
    </div>
  );
}