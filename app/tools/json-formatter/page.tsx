
"use client";

import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";

type Mode = "format" | "validate" | "minify";

const modeOptions = [
  { id: "format", label: "✨ Format & Beautify", color: "#10b981" },
  { id: "validate", label: "✅ Validate Only", color: "#3b82f6" },
  { id: "minify", label: "📦 Minify", color: "#f59e0b" },
] as const;

export default function JSONFormatterPage() {
  const router = useRouter();
  const [inputJSON, setInputJSON] = useState("");
  const [outputJSON, setOutputJSON] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [indentSize, setIndentSize] = useState(2);
  const [minify, setMinify] = useState(false);
  const [mode, setMode] = useState<Mode>("format");

  const formatJSON = () => {
    if (!inputJSON.trim()) {
      setError("Please enter JSON data");
      return;
    }

    try {
      const parsed = JSON.parse(inputJSON);
      const indent = minify ? 0 : indentSize;
      const formatted = JSON.stringify(parsed, null, indent);
      setOutputJSON(formatted);
      setIsValid(true);
      setError("");
      setSuccessMsg("✅ JSON formatted successfully!");
      setTimeout(() => setSuccessMsg(""), 2000);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setIsValid(false);
      setError(`Invalid JSON: ${message}`);
      setOutputJSON("");
    }
  };

  const validateJSON = () => {
    if (!inputJSON.trim()) {
      setError("Please enter JSON data");
      return;
    }

    try {
      const parsed = JSON.parse(inputJSON);
      setIsValid(true);
      setError("");
      setOutputJSON(JSON.stringify(parsed, null, 2));
      setSuccessMsg("✅ JSON is valid!");
      setTimeout(() => setSuccessMsg(""), 2000);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setIsValid(false);
      setError(`Invalid JSON: ${message}`);
      setOutputJSON("");
    }
  };

  const minifyJSON = () => {
    if (!inputJSON.trim()) {
      setError("Please enter JSON data");
      return;
    }

    try {
      const parsed = JSON.parse(inputJSON);
      const minified = JSON.stringify(parsed);
      setOutputJSON(minified);
      setIsValid(true);
      setError("");
      setSuccessMsg("✅ JSON minified successfully!");
      setTimeout(() => setSuccessMsg(""), 2000);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setIsValid(false);
      setError(`Invalid JSON: ${message}`);
      setOutputJSON("");
    }
  };

  const processJSON = () => {
    if (mode === "format") formatJSON();
    else if (mode === "validate") validateJSON();
    else if (mode === "minify") minifyJSON();
  };

  const copyOutput = () => {
    if (outputJSON) {
      navigator.clipboard.writeText(outputJSON);
      setSuccessMsg("📋 JSON copied to clipboard!");
      setTimeout(() => setSuccessMsg(""), 2000);
    }
  };

  const clearAll = () => {
    setInputJSON("");
    setOutputJSON("");
    setError("");
    setIsValid(null);
  };

  const loadExample = () => {
    const example = {
      name: "AI Video Studio",
      version: "1.0.0",
      features: ["Image Generation", "Video Creation", "Voice Studio", "Background Remover"],
      stats: {
        users: 10000,
        images: 50000,
        videos: 1000,
      },
      settings: {
        theme: "dark",
        language: "en",
        notifications: true,
      },
    };
    setInputJSON(JSON.stringify(example, null, 2));
    setOutputJSON("");
    setIsValid(null);
    setError("");
  };

  const loadMinifiedExample = () => {
    const example = { name: "AI Video Studio", version: "1.0.0", features: ["Image", "Video", "Voice"], active: true };
    setInputJSON(JSON.stringify(example));
    setOutputJSON("");
    setIsValid(null);
    setError("");
  };

  const getLineCount = (text: string) => {
    return text.split("\n").length;
  };

  const getCharCount = (text: string) => {
    return text.length;
  };

  return (
    <>
      <Head>
        <meta property="og:image" content="/thumbnails/json-formatter.jpg" />
      </Head>
      <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding: "1rem 1rem 80px 1rem" }}>
      <div style={{ marginBottom: "1.5rem", paddingTop: "1rem" }}>
        <button onClick={() => router.back()} style={{ background: "rgba(255,255,255,0.2)", border: "none", padding: "8px 16px", borderRadius: 40, color: "white", cursor: "pointer", marginBottom: "1rem" }}>← Back</button>
        <h1 style={{ color: "white", margin: 0, fontSize: "1.8rem" }}>📋 JSON Formatter & Validator</h1>
        <p style={{ color: "rgba(255,255,255,0.8)", marginTop: "0.25rem" }}>Format, validate, and beautify your JSON data</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(450px, 1fr))", gap: "1.5rem", marginBottom: "1.5rem" }}>
        {/* Left Panel - Input */}
        <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: 24, padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
            <h3 style={{ margin: 0, fontSize: "1rem" }}>📝 Input JSON</h3>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button onClick={loadExample} style={{ padding: "0.25rem 0.75rem", background: "#8b5cf6", color: "white", border: "none", borderRadius: 20, fontSize: "0.7rem", cursor: "pointer" }}>📖 Formatted Example</button>
              <button onClick={loadMinifiedExample} style={{ padding: "0.25rem 0.75rem", background: "#8b5cf6", color: "white", border: "none", borderRadius: 20, fontSize: "0.7rem", cursor: "pointer" }}>📦 Minified Example</button>
              <button onClick={clearAll} style={{ padding: "0.25rem 0.75rem", background: "#ef4444", color: "white", border: "none", borderRadius: 20, fontSize: "0.7rem", cursor: "pointer" }}>🗑️ Clear</button>
            </div>
          </div>
          
          <textarea
            value={inputJSON}
            onChange={(e) => setInputJSON(e.target.value)}
            placeholder='{"name": "AI Video Studio", "version": "1.0.0"}'
            rows={12}
            style={{
              width: "100%",
              padding: "1rem",
              fontSize: "0.8rem",
              fontFamily: "monospace",
              borderRadius: 16,
              border: `2px solid ${isValid === false ? "#ef4444" : "#e0e0e0"}`,
              resize: "vertical",
              background: isValid === false ? "#fee2e2" : "white",
            }}
          />
          
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem", fontSize: "0.7rem", color: "#666" }}>
            <span>Lines: {getLineCount(inputJSON)}</span>
            <span>Characters: {getCharCount(inputJSON)}</span>
            {isValid === true && <span style={{ color: "#22c55e" }}>✅ Valid JSON</span>}
            {isValid === false && <span style={{ color: "#ef4444" }}>❌ Invalid JSON</span>}
          </div>

          <div style={{ marginTop: "1rem" }}>
            <label style={{ fontWeight: 600, marginBottom: "0.5rem", display: "block" }}>⚙️ Mode</label>
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
              {modeOptions.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  style={{
                    flex: 1,
                    padding: "0.5rem",
                    borderRadius: 40,
                    background: mode === m.id ? m.color : "#f0f0f0",
                    color: mode === m.id ? "white" : "#333",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "0.75rem",
                    fontWeight: mode === m.id ? 600 : 400,
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {mode === "format" && (
            <div style={{ marginBottom: "1rem" }}>
              <label style={{ fontWeight: 600, marginBottom: "0.5rem", display: "block" }}>Indent Size: {indentSize} spaces</label>
              <input
                type="range"
                min="1"
                max="8"
                step="1"
                value={indentSize}
                onChange={(e) => setIndentSize(Number(e.target.value))}
                style={{ width: "100%" }}
              />
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.5rem" }}>
                <input type="checkbox" checked={minify} onChange={(e) => setMinify(e.target.checked)} />
                Minify instead of beautify
              </label>
            </div>
          )}

          <button
            onClick={processJSON}
            style={{
              width: "100%",
              padding: "0.875rem",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "none",
              borderRadius: 40,
              fontSize: "1rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            🚀 {mode === "format" ? "Format JSON" : mode === "validate" ? "Validate JSON" : "Minify JSON"}
          </button>
        </div>

        {/* Right Panel - Output */}
        <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: 24, padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
            <h3 style={{ margin: 0, fontSize: "1rem" }}>✨ Output</h3>
            {outputJSON && (
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button onClick={copyOutput} style={{ padding: "0.25rem 0.75rem", background: "#3b82f6", color: "white", border: "none", borderRadius: 20, fontSize: "0.7rem", cursor: "pointer" }}>📋 Copy</button>
              </div>
            )}
          </div>
          
          {!outputJSON && !error && (
            <div style={{ background: "#f5f5f5", borderRadius: 16, padding: "3rem", textAlign: "center", border: "2px dashed #ccc" }}>
              <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>📋</div>
              <p>Enter JSON and click the action button.</p>
            </div>
          )}
          
          {outputJSON && (
            <div style={{ background: "#f5f5f5", borderRadius: 16, padding: "1rem", maxHeight: 400, overflowY: "auto" }}>
              <pre style={{ whiteSpace: "pre-wrap", fontFamily: "monospace", fontSize: "0.75rem", margin: 0, lineHeight: 1.5 }}>
                {outputJSON}
              </pre>
            </div>
          )}
          
          {error && (
            <div style={{ background: "#fee2e2", borderRadius: 16, padding: "1rem", color: "#ef4444", fontSize: "0.8rem" }}>
              <strong>❌ Error:</strong> {error}
            </div>
          )}

          {/* JSON Stats */}
          {outputJSON && isValid && (
            <div style={{ marginTop: "1rem", padding: "0.75rem", background: "#d1fae5", borderRadius: 12 }}>
              <p style={{ margin: 0, fontSize: "0.7rem", color: "#166534" }}>
                📊 Size: {(outputJSON.length / 1024).toFixed(2)} KB | 
                Lines: {getLineCount(outputJSON)} | 
                Characters: {getCharCount(outputJSON)}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* JSON Tips */}
      <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: 24, padding: "1.5rem" }}>
        <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "0.9rem" }}>💡 JSON Tips</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "0.5rem", fontSize: "0.7rem", color: "#666" }}>
          <div>✓ Use double quotes for keys and strings</div>
          <div>✓ No trailing commas</div>
          <div>✓ Numbers do not need quotes</div>
          <div>✓ Booleans: true/false (lowercase)</div>
          <div>✓ Null is a valid value</div>
          <div>✓ Arrays use square brackets []</div>
          <div>✓ Objects use curly braces {}</div>
          <div>✓ Escape special characters with \</div>
        </div>
      </div>

      {error && !outputJSON && <div style={{ marginTop: "1rem", padding: "0.75rem", background: "rgba(239,68,68,0.1)", borderRadius: 12, color: "#ef4444", textAlign: "center" }}>❌ {error}</div>}
      {successMsg && <div style={{ marginTop: "1rem", padding: "0.75rem", background: "rgba(34,197,94,0.1)", borderRadius: 12, color: "#22c55e", textAlign: "center" }}>✅ {successMsg}</div>}

      <BottomNav active="tools" onNavigate={(href) => router.push(href)} />
    </div>
    </>
  );
}