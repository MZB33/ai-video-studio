"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";

const safeDecode = (value: string) => {
  try {
    const decoded = atob(value.replace(/-/g, "+").replace(/_/g, "/"));
    return decodeURIComponent(decoded.split("").map((c) => `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`).join(""));
  } catch {
    return null;
  }
};

export default function JwtDecoderPage() {
  const router = useRouter();
  const [token, setToken] = useState("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c");
  const [header, setHeader] = useState("");
  const [payload, setPayload] = useState("");
  const [signature, setSignature] = useState("");
  const [error, setError] = useState("");

  const decode = () => {
    const parts = token.trim().split(".");
    if (parts.length !== 3) {
      setError("JWT must have three parts separated by dots.");
      setHeader("");
      setPayload("");
      setSignature("");
      return;
    }

    const [rawHeader, rawPayload, rawSignature] = parts;
    const decodedHeader = safeDecode(rawHeader);
    const decodedPayload = safeDecode(rawPayload);
    if (!decodedHeader || !decodedPayload) {
      setError("Unable to decode JWT header or payload. Make sure the token is valid Base64URL.");
      setHeader("");
      setPayload("");
      setSignature(rawSignature);
      return;
    }

    setError("");
    setHeader(decodedHeader);
    setPayload(decodedPayload);
    setSignature(rawSignature);
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #111827 0%, #1f2937 100%)", padding: "1rem 1rem 80px 1rem" }}>
      <div style={{ marginBottom: "1.5rem", paddingTop: "1rem" }}>
        <button onClick={() => router.back()} style={{ background: "rgba(255,255,255,0.16)", border: "none", padding: "8px 16px", borderRadius: 40, color: "white", cursor: "pointer", marginBottom: "1rem" }}>← Back</button>
        <h1 style={{ color: "white", margin: 0, fontSize: "1.8rem" }}>🔐 JWT Decoder</h1>
        <p style={{ color: "rgba(255,255,255,0.75)", marginTop: "0.25rem" }}>Decode JWT header and payload without verifying the signature.</p>
      </div>

      <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: 24, padding: "1.5rem", maxWidth: 760, margin: "0 auto" }}>
        <label style={{ display: "flex", flexDirection: "column", gap: 6, fontWeight: 600, marginBottom: "1rem" }}>
          JWT Token
          <textarea value={token} onChange={(e) => setToken(e.target.value)} rows={4} style={{ width: "100%", padding: "1rem", borderRadius: 16, border: "1px solid #d1d5db", fontFamily: "monospace", resize: "vertical" }} />
        </label>

        <button onClick={decode} style={{ width: "100%", padding: "1rem", background: "#2563eb", color: "white", border: "none", borderRadius: 40, fontWeight: 700, cursor: "pointer" }}>Decode JWT</button>

        {error && <div style={{ marginTop: "1rem", padding: "1rem", borderRadius: 16, background: "#fee2e2", color: "#b91c1c" }}>{error}</div>}

        <div style={{ marginTop: "1.5rem", display: "grid", gap: "1rem" }}>
          <div style={{ padding: "1.25rem", borderRadius: 20, background: "#f8fafc", border: "1px solid #e2e8f0", fontFamily: "monospace" }}>
            <div style={{ fontSize: "0.9rem", color: "#4b5563", marginBottom: 6 }}>Header</div>
            <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{header || "Decoded header will appear here"}</pre>
          </div>
          <div style={{ padding: "1.25rem", borderRadius: 20, background: "#f8fafc", border: "1px solid #e2e8f0", fontFamily: "monospace" }}>
            <div style={{ fontSize: "0.9rem", color: "#4b5563", marginBottom: 6 }}>Payload</div>
            <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{payload || "Decoded payload will appear here"}</pre>
          </div>
          <div style={{ padding: "1.25rem", borderRadius: 20, background: "#f8fafc", border: "1px solid #e2e8f0", fontFamily: "monospace" }}>
            <div style={{ fontSize: "0.9rem", color: "#4b5563", marginBottom: 6 }}>Signature</div>
            <div>{signature || "Signature part will appear here"}</div>
          </div>
        </div>
      </div>

      <BottomNav active="tools" onNavigate={(href) => router.push(href)} />
    </div>
  );
}
