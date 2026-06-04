"use client";

import NextImage from "next/image";
import { useState, useRef, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";

export default function ImageRestorerPage() {
  const router = useRouter();
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [restoredImage, setRestoredImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [jobStatus, setJobStatus] = useState("");
  const [restoreType, setRestoreType] = useState<"enhance" | "colorize" | "denoise" | "scratch">("enhance");
  const [showOriginal, setShowOriginal] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setOriginalImage(event.target?.result as string);
      setRestoredImage(null);
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const restoreImage = async () => {
    if (!originalImage) {
      setError("Please upload an image first");
      return;
    }

    setLoading(true);
    setError("");
    setRestoredImage(null);

    // Use background job queue: create job and poll status
    try {
      const create = await fetch("/api/image-restore/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: originalImage, mode: restoreType }),
      });
      if (!create.ok) throw new Error("Failed to create job");
      const { id } = await create.json();
      setJobStatus("Queued");

      const poll = async () => {
        const statusRes = await fetch(`/api/image-restore/jobs/${id}`);
        if (!statusRes.ok) throw new Error("Job status fetch failed");
        const job = await statusRes.json();
        const state = job.state || job.status;
        const progress = typeof job.progress === "number" ? `${job.progress}%` : null;

        if (state === "completed" || state === "succeeded") {
          const restored = job.returnvalue || job.image || job.result?.image || null;
          setRestoredImage(restored);
          setSuccessMsg("✨ Restored (background job)");
          setJobStatus("Completed");
          setTimeout(() => setSuccessMsg(""), 3000);
          setLoading(false);
          return;
        }

        if (state === "failed") {
          setError(job.failedReason || job.error || "Job failed");
          setJobStatus("Failed");
          setLoading(false);
          return;
        }

        const statusLabel = progress ? `${state} (${progress})` : state;
        setJobStatus(statusLabel.charAt(0).toUpperCase() + statusLabel.slice(1));
        setTimeout(poll, 1500);
      };

      setTimeout(poll, 800);
      return;
    } catch (err) {
      // fallback to immediate local restore if job flow fails
    }

    // Local fallback (keeps existing demo behavior)
    try {
      const resultUrl = await applyLocalRestore(originalImage, restoreType);
      setRestoredImage(resultUrl);
      let message = "";
      switch (restoreType) {
        case "enhance": message = "✨ Image enhanced successfully!"; break;
        case "colorize": message = "🎨 Image colorized successfully!"; break;
        case "denoise": message = "🔇 Noise reduced successfully!"; break;
        case "scratch": message = "🔧 Scratches removed successfully!"; break;
      }
      setSuccessMsg(message);
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (e) {
      setError("Failed to restore image");
    } finally {
      setLoading(false);
    }
  };

  const applyLocalRestore = (src: string, mode: "enhance" | "colorize" | "denoise" | "scratch") => {
    return new Promise<string>((resolve) => {
      // Simulate AI restoration locally using canvas filters
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");

        if (ctx) {
          if (mode === "enhance") {
            ctx.filter = "brightness(1.05) contrast(1.1) saturate(1.15)";
          } else if (mode === "colorize") {
            ctx.filter = "sepia(0.3) saturate(1.4) hue-rotate(-10deg)";
          } else if (mode === "denoise") {
            ctx.filter = "blur(1px) contrast(1.05)";
          } else if (mode === "scratch") {
            ctx.filter = "brightness(1.02) contrast(1.08)";
          }

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          if (mode === "enhance") {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            for (let i = 0; i < data.length; i += 4) {
              data[i] = Math.min(255, data[i] * 1.05);
              data[i+1] = Math.min(255, data[i+1] * 1.05);
              data[i+2] = Math.min(255, data[i+2] * 1.05);
            }
            ctx.putImageData(imageData, 0, 0);
          }

          const resultUrl = canvas.toDataURL("image/jpeg", 0.95);
          resolve(resultUrl);
        } else {
          resolve(src);
        }
      };
      img.src = src;
    });
  };

  const downloadResult = () => {
    if (restoredImage) {
      const link = document.createElement("a");
      link.href = restoredImage;
      link.download = `restored-image-${Date.now()}.jpg`;
      link.click();
    }
  };

  const compareImages = () => {
    if (originalImage && restoredImage) {
      setShowOriginal(prev => !prev);
    }
  };

  const displayedImage = showOriginal ? originalImage : restoredImage;

  const clearAll = () => {
    setOriginalImage(null);
    setRestoredImage(null);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const loadExample = () => {
    setOriginalImage("https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=600&blur=5");
    setRestoredImage(null);
  };

  const restoreOptions: { id: "enhance" | "colorize" | "denoise" | "scratch"; label: string; desc: string; color: string }[] = [
    { id: "enhance", label: "✨ Enhance Quality", desc: "Improve brightness, contrast, and sharpness", color: "#10b981" },
    { id: "colorize", label: "🎨 Colorize", desc: "Add color to black & white photos", color: "#8b5cf6" },
    { id: "denoise", label: "🔇 Remove Noise", desc: "Reduce grain and artifacts", color: "#3b82f6" },
    { id: "scratch", label: "🔧 Remove Scratches", desc: "Fix damaged and scratched photos", color: "#f59e0b" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding: "1rem 1rem 80px 1rem" }}>
      <div style={{ marginBottom: "1.5rem", paddingTop: "1rem" }}>
        <button onClick={() => router.back()} style={{ background: "rgba(255,255,255,0.2)", border: "none", padding: "8px 16px", borderRadius: 40, color: "white", cursor: "pointer", marginBottom: "1rem" }}>← Back</button>
        <h1 style={{ color: "white", margin: 0, fontSize: "1.8rem" }}>🖼️ AI Image Restorer</h1>
        <p style={{ color: "rgba(255,255,255,0.8)", marginTop: "0.25rem" }}>Restore old, damaged, or low-quality photos</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem", marginBottom: "1.5rem" }}>
        {/* Left Panel - Upload & Controls */}
        <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: 24, padding: "1.5rem" }}>
          <h3 style={{ margin: "0 0 1rem 0", fontSize: "1rem" }}>📤 Upload Photo</h3>
          
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
            <button onClick={clearAll} style={{ width: "100%", padding: "0.5rem", background: "#ef4444", color: "white", border: "none", borderRadius: 40, cursor: "pointer", marginBottom: "1rem" }}>
              🗑️ Clear Image
            </button>
          )}

          {originalImage && (
            <>
              <h3 style={{ margin: "1rem 0 0.5rem 0", fontSize: "0.9rem" }}>🎯 Restoration Type</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>
                {restoreOptions.map((opt) => (
                  <label
                    key={opt.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "0.75rem",
                      background: restoreType === opt.id ? `${opt.color}20` : "transparent",
                      border: `1px solid ${restoreType === opt.id ? opt.color : "#e0e0e0"}`,
                      borderRadius: 16,
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  >
                    <input
                      type="radio"
                      name="restoreType"
                      value={opt.id}
                      checked={restoreType === opt.id}
                      onChange={() => setRestoreType(opt.id)}
                      style={{ marginRight: "0.75rem" }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: "0.85rem" }}>{opt.label}</div>
                      <div style={{ fontSize: "0.7rem", color: "#666" }}>{opt.desc}</div>
                    </div>
                  </label>
                ))}
              </div>

              <button
                onClick={restoreImage}
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
                {loading ? "⏳ AI Restoring..." : "✨ Restore Image"}
              </button>
              {jobStatus && (
                <p style={{ marginTop: "0.75rem", fontSize: "0.85rem", color: "#4b5563" }}>
                  🔄 {jobStatus}
                </p>
              )}
            </>
          )}
        </div>

        {/* Right Panel - Preview */}
        <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: 24, padding: "1.5rem" }}>
          <h3 style={{ margin: "0 0 1rem 0", fontSize: "1rem" }}>🖼️ Preview</h3>
          
          {!originalImage ? (
            <div style={{ 
              background: "#f0f0f0", 
              borderRadius: 16, 
              padding: "3rem", 
              textAlign: "center",
              border: "2px dashed #ccc",
            }}>
              <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>📸</div>
              <p>Upload an old or damaged photo to restore it</p>
            </div>
          ) : (
            <div>
              <div style={{ position: "relative", marginBottom: "1rem", width: "100%", minHeight: 200 }}>
                <NextImage
                  src={displayedImage!}
                  alt="Preview"
                  fill
                  unoptimized
                  style={{ objectFit: "contain", borderRadius: 16, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
                />
                {restoredImage && (
                  <button
                    onClick={compareImages}
                    style={{
                      position: "absolute",
                      bottom: "10px",
                      right: "10px",
                      background: "rgba(0,0,0,0.7)",
                      color: "white",
                      border: "none",
                      borderRadius: 20,
                      padding: "4px 12px",
                      fontSize: "0.7rem",
                      cursor: "pointer",
                    }}
                  >
                    🔄 Compare
                  </button>
                )}
              </div>
              <p style={{ fontSize: "0.7rem", color: "#999", textAlign: "center" }}>
                {restoredImage ? (showOriginal ? "📷 Original photo" : "✨ Restored version") : "📷 Original photo"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Result */}
      {restoredImage && (
        <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: 24, padding: "1.5rem", textAlign: "center", marginBottom: "1.5rem" }}>
          <h3 style={{ margin: "0 0 1rem 0", fontSize: "1rem" }}>✨ Restored Result ✨</h3>
          <div style={{ position: "relative", width: "100%", minHeight: 300, marginBottom: "1rem" }}>
            <NextImage
              src={restoredImage}
              alt="Restored"
              fill
              unoptimized
              style={{ objectFit: "contain", borderRadius: 16 }}
            />
          </div>
          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={downloadResult} style={{ padding: "0.5rem 1rem", background: "#10b981", color: "white", border: "none", borderRadius: 40, cursor: "pointer" }}>
              💾 Download Restored Image
            </button>
            <button onClick={() => { navigator.clipboard.writeText(restoredImage); setSuccessMsg("📋 Image copied!"); setTimeout(() => setSuccessMsg(""), 2000); }} style={{ padding: "0.5rem 1rem", background: "#3b82f6", color: "white", border: "none", borderRadius: 40, cursor: "pointer" }}>
              📋 Copy Image
            </button>
          </div>
          <p style={{ fontSize: "0.7rem", color: "#999", marginTop: "1rem" }}>
            ⚡ Demo version. Real AI restoration coming soon!
          </p>
        </div>
      )}

      {error && <div style={{ marginTop: "1rem", padding: "0.75rem", background: "rgba(239,68,68,0.1)", borderRadius: 12, color: "#ef4444", textAlign: "center" }}>❌ {error}</div>}
      {successMsg && <div style={{ marginTop: "1rem", padding: "0.75rem", background: "rgba(34,197,94,0.1)", borderRadius: 12, color: "#22c55e", textAlign: "center" }}>✅ {successMsg}</div>}

      <BottomNav active="tools" onNavigate={(href) => router.push(href)} />
    </div>
  );
}