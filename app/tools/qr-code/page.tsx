"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";

export default function QRCodePage() {
  const router = useRouter();
  const [inputText, setInputText] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [qrSize, setQrSize] = useState(250);
  const [foregroundColor, setForegroundColor] = useState("#000000");
  const [backgroundColor, setBackgroundColor] = useState("#ffffff");
  const [includeMargin, setIncludeMargin] = useState(true);
  
  const qrRef = useRef<HTMLDivElement>(null);

  const generateQRCode = async () => {
    if (!inputText.trim()) {
      setError("Please enter text or a URL");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMsg("");

    // QR code generation using Google Charts API (free, no API key)
    const margin = includeMargin ? 4 : 0;
    const url = `https://chart.googleapis.com/chart?cht=qr&chl=${encodeURIComponent(
      inputText
    )}&chs=${qrSize}x${qrSize}&choe=UTF-8&chld=L|${margin}&chco=${foregroundColor.replace(
      "#",
      ""
    )}`;

    setQrCodeUrl(url);
    setLoading(false);
    setSuccessMsg("✨ QR Code generated successfully!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const downloadQRCode = () => {
    if (!qrCodeUrl) return;
    const link = document.createElement("a");
    link.href = qrCodeUrl;
    link.download = `qrcode-${Date.now()}.png`;
    link.click();
    setSuccessMsg("📥 QR Code downloaded!");
    setTimeout(() => setSuccessMsg(""), 2000);
  };

  const shareQRCode = async () => {
    if (!qrCodeUrl) return;
    try {
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const file = new File([blob], "qrcode.png", { type: "image/png" });
      await navigator.share({
        title: "QR Code",
        text: inputText,
        files: [file],
      });
    } catch (err) {
      // Fallback: copy the URL
      await navigator.clipboard.writeText(qrCodeUrl);
      setSuccessMsg("📋 QR Code URL copied!");
      setTimeout(() => setSuccessMsg(""), 2000);
    }
  };

  const loadExample = () => {
    setInputText("https://hamdam-ai.com");
    setForegroundColor("#000000");
    setBackgroundColor("#ffffff");
    setQrSize(250);
    setIncludeMargin(true);
  };

  const clearAll = () => {
    setInputText("");
    setQrCodeUrl("");
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
        <h1 style={{ color: "white", margin: 0, fontSize: "1.8rem" }}>📱 QR Code Generator</h1>
        <p style={{ color: "rgba(255,255,255,0.8)", marginTop: "0.25rem" }}>
          Create custom QR codes for URLs, text, and more
        </p>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.7rem", marginTop: "0.25rem" }}>
          QR کوڈ بنائیں — لنکس اور ٹیکسٹ کے لیے
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
        <label style={{ fontWeight: 600, marginBottom: "0.5rem", display: "block" }}>
          📝 Enter Text or URL
        </label>
        <textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter URL, text, or any information..."
          rows={3}
          style={{
            width: "100%",
            padding: "1rem",
            fontSize: "1rem",
            borderRadius: 16,
            border: "1px solid #e0e0e0",
            fontFamily: "inherit",
            resize: "vertical",
            marginBottom: "0.5rem",
          }}
        />
        
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem" }}>
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
            onClick={clearAll}
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

        {/* QR Code Settings */}
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ fontWeight: 500, marginBottom: "0.25rem", display: "block" }}>
            Size: {qrSize}px
          </label>
          <input
            type="range"
            min="150"
            max="500"
            step="10"
            value={qrSize}
            onChange={(e) => setQrSize(Number(e.target.value))}
            style={{ width: "100%" }}
          />
        </div>

        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem", flexWrap: "wrap" }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: "0.7rem", marginBottom: "0.25rem", display: "block" }}>
              Foreground Color
            </label>
            <input
              type="color"
              value={foregroundColor}
              onChange={(e) => setForegroundColor(e.target.value)}
              style={{ width: "100%", height: 40, borderRadius: 8, border: "1px solid #e0e0e0" }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: "0.7rem", marginBottom: "0.25rem", display: "block" }}>
              Background Color
            </label>
            <input
              type="color"
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              style={{ width: "100%", height: 40, borderRadius: 8, border: "1px solid #e0e0e0" }}
            />
          </div>
        </div>

        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
          <input
            type="checkbox"
            checked={includeMargin}
            onChange={(e) => setIncludeMargin(e.target.checked)}
          />
          <span style={{ fontSize: "0.8rem" }}>Include margin around QR code</span>
        </label>

        <button
          onClick={generateQRCode}
          disabled={loading || !inputText}
          style={{
            width: "100%",
            padding: "0.875rem",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            border: "none",
            borderRadius: 40,
            fontSize: "1rem",
            fontWeight: 600,
            cursor: loading || !inputText ? "not-allowed" : "pointer",
            opacity: loading || !inputText ? 0.6 : 1,
          }}
        >
          {loading ? "⏳ Generating..." : "✨ Generate QR Code"}
        </button>
      </div>

      {/* QR Code Display */}
      {qrCodeUrl && (
        <div
          ref={qrRef}
          style={{
            background: "rgba(255,255,255,0.95)",
            borderRadius: 24,
            padding: "1.5rem",
            textAlign: "center",
            marginBottom: "1.5rem",
          }}
        >
          <div
            style={{
              background: backgroundColor,
              padding: "1rem",
              borderRadius: 16,
              display: "inline-block",
            }}
          >
            <img
              src={qrCodeUrl}
              alt="QR Code"
              style={{
                width: qrSize,
                height: qrSize,
                display: "block",
              }}
            />
          </div>
          
          <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={downloadQRCode}
              style={{
                padding: "0.5rem 1rem",
                background: "#10b981",
                color: "white",
                border: "none",
                borderRadius: 40,
                fontSize: "0.8rem",
                cursor: "pointer",
              }}
            >
              💾 Download PNG
            </button>
            <button
              onClick={shareQRCode}
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
              📤 Share
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(qrCodeUrl);
                setSuccessMsg("📋 QR Code URL copied!");
                setTimeout(() => setSuccessMsg(""), 2000);
              }}
              style={{
                padding: "0.5rem 1rem",
                background: "#8b5cf6",
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
          
          <div style={{ marginTop: "1rem", padding: "0.5rem", background: "#f5f5f5", borderRadius: 12 }}>
            <p style={{ fontSize: "0.7rem", color: "#666", wordBreak: "break-all", margin: 0 }}>
              {inputText.length > 100 ? inputText.substring(0, 100) + "..." : inputText}
            </p>
          </div>
        </div>
      )}

      {/* QR Code Uses */}
      <div
        style={{
          background: "rgba(255,255,255,0.95)",
          borderRadius: 24,
          padding: "1.5rem",
        }}
      >
        <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "0.9rem" }}>💡 QR Code Uses</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: "0.5rem", fontSize: "0.7rem" }}>
          <div>🔗 Website URLs</div>
          <div>📞 Contact Info (vCard)</div>
          <div>📧 Email Address</div>
          <div>📱 App Downloads</div>
          <div>📶 WiFi Login</div>
          <div>💳 Payment Links</div>
          <div>🎟️ Event Tickets</div>
          <div>📦 Product Labels</div>
          <div>🍽️ Restaurant Menus</div>
          <div>🏢 Business Cards</div>
        </div>
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