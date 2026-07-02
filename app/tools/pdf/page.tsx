"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";

type PDFTool = "merge" | "split" | "compress" | "extract" | "convert";

export default function PDFToolsPage() {
  const router = useRouter();
  const [activeTool, setActiveTool] = useState<PDFTool>("merge");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const tools = [
    { id: "merge", name: "PDF Merger", nameUr: "PDF ضم کریں", icon: "📑", description: "Combine multiple PDFs into one" },
    { id: "split", name: "PDF Splitter", nameUr: "PDF تقسیم کریں", icon: "✂️", description: "Split PDF into multiple files" },
    { id: "compress", name: "PDF Compressor", nameUr: "PDF سکیڑیں", icon: "🗜️", description: "Reduce PDF file size" },
    { id: "extract", name: "Text Extractor", nameUr: "متن نکالیں", icon: "📝", description: "Extract text from PDF" },
    { id: "convert", name: "PDF to Images", nameUr: "PDF سے تصویر", icon: "🖼️", description: "Convert PDF pages to images" },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setFiles(prev => [...prev, ...selectedFiles]);
    setError("");
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const processPDF = async () => {
    if (files.length === 0) {
      setError("Please select at least one PDF file");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("tool", activeTool);
      files.forEach((file) => formData.append("files", file));

      const response = await fetch("/api/pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "PDF processing failed");
      }

      const data = await response.json();

      if (data.success) {
        setResult(data.result?.url || "https://example.com/result.pdf");
        setSuccessMsg(data.result?.message || `${tools.find(t => t.id === activeTool)?.name} completed!`);
        setTimeout(() => setSuccessMsg(""), 4000);
      } else {
        throw new Error("Invalid response from PDF API");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(`Error: ${message}`);
      console.error("PDF processing error:", err);
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setFiles([]);
    setResult(null);
    setError("");
  };

  const currentTool = tools.find(t => t.id === activeTool);

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
        <h1 style={{ color: "white", margin: 0, fontSize: "1.8rem" }}>📄 PDF Tools Suite</h1>
        <p style={{ color: "rgba(255,255,255,0.8)", marginTop: "0.25rem" }}>
          Merge, split, compress, and convert PDFs — all in one place
        </p>
      </div>

      {/* Tool Selection */}
      <div
        style={{
          background: "rgba(255,255,255,0.95)",
          borderRadius: 24,
          padding: "1.5rem",
          marginBottom: "1.5rem",
        }}
      >
        <label style={{ fontWeight: 600, display: "block", marginBottom: "0.75rem" }}>
          🛠️ Select PDF Tool
        </label>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: "0.75rem",
          }}
        >
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => {
                setActiveTool(tool.id as PDFTool);
                clearAll();
              }}
              style={{
                padding: "0.75rem",
                borderRadius: 16,
                background: activeTool === tool.id ? "#667eea" : "#f0f0f0",
                color: activeTool === tool.id ? "white" : "#333",
                border: "none",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.2s",
              }}
            >
              <div style={{ fontSize: "1.5rem", marginBottom: "0.25rem" }}>
                {tool.icon}
              </div>
              <div style={{ fontSize: "0.75rem", fontWeight: 500 }}>{tool.name}</div>
              <div style={{ fontSize: "0.65rem", opacity: 0.7 }}>{tool.nameUr}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Tool Description */}
      <div
        style={{
          background: "rgba(255,255,255,0.95)",
          borderRadius: 24,
          padding: "1.5rem",
          marginBottom: "1.5rem",
        }}
      >
        <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.2rem" }}>
          {currentTool?.icon} {currentTool?.name}
        </h3>
        <p style={{ color: "#666", marginBottom: "1rem" }}>{currentTool?.description}</p>

        {/* File Upload */}
        <div
          style={{
            border: "2px dashed #ccc",
            borderRadius: 16,
            padding: "1.5rem",
            textAlign: "center",
            marginBottom: "1rem",
          }}
        >
          <input
            type="file"
            accept=".pdf"
            multiple={activeTool === "merge"}
            onChange={handleFileUpload}
            style={{ marginBottom: "0.5rem" }}
          />
          <p style={{ fontSize: "0.7rem", color: "#999", margin: 0 }}>
            {activeTool === "merge" 
              ? "Select multiple PDF files to merge" 
              : "Select a PDF file to process"}
          </p>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div style={{ marginBottom: "1rem" }}>
            <label style={{ fontWeight: 600, fontSize: "0.8rem" }}>Selected Files:</label>
            <div style={{ marginTop: "0.5rem", maxHeight: 150, overflowY: "auto" }}>
              {files.map((file, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.5rem",
                    background: "#f5f5f5",
                    borderRadius: 8,
                    marginBottom: "0.25rem",
                  }}
                >
                  <span style={{ fontSize: "0.75rem" }}>
                    📄 {file.name} ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                  <button
                    onClick={() => removeFile(idx)}
                    style={{
                      background: "#ef4444",
                      color: "white",
                      border: "none",
                      borderRadius: 20,
                      padding: "2px 8px",
                      fontSize: "0.6rem",
                      cursor: "pointer",
                    }}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={processPDF}
          disabled={loading || files.length === 0}
          style={{
            width: "100%",
            padding: "0.875rem",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            border: "none",
            borderRadius: 40,
            fontSize: "1rem",
            fontWeight: 600,
            cursor: loading || files.length === 0 ? "not-allowed" : "pointer",
            opacity: loading || files.length === 0 ? 0.6 : 1,
          }}
        >
          {loading ? "⏳ Processing..." : `✨ ${currentTool?.name}`}
        </button>

        {result && (
          <div style={{ marginTop: "1rem", textAlign: "center" }}>
            <p style={{ color: "#22c55e", fontSize: "0.8rem" }}>✅ Processing complete!</p>
            <a
              href={result}
              download
              style={{
                padding: "0.5rem 1rem",
                background: "#10b981",
                color: "white",
                textDecoration: "none",
                borderRadius: 40,
                fontSize: "0.8rem",
                display: "inline-block",
              }}
            >
              💾 Download Result
            </a>
          </div>
        )}
      </div>

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