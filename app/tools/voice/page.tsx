"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";

// Voice options
const voices = [
  { id: "en-us-1", name: "American English", nameUr: "امریکی انگریزی", code: "en-US" },
  { id: "en-uk-1", name: "British English", nameUr: "برطانوی انگریزی", code: "en-GB" },
  { id: "ur-pk-1", name: "Urdu (Pakistan)", nameUr: "اردو (پاکستان)", code: "ur-PK" },
  { id: "hi-in-1", name: "Hindi (India)", nameUr: "ہندی (بھارت)", code: "hi-IN" },
  { id: "ar-sa-1", name: "Arabic (Saudi)", nameUr: "عربی (سعودی)", code: "ar-SA" },
];

export default function VoiceStudioPage() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [selectedVoice, setSelectedVoice] = useState(voices[0]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Simple working speech synthesis
  const speak = () => {
    if (!text.trim()) {
      setError("Please enter some text");
      return;
    }

    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = selectedVoice.code;
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    utterance.onstart = () => {
      setIsSpeaking(true);
      setSuccessMsg(`🔊 Speaking in ${selectedVoice.name}...`);
      setTimeout(() => setSuccessMsg(""), 2000);
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
      setSuccessMsg(`✅ Done!`);
      setTimeout(() => setSuccessMsg(""), 1500);
    };
    
    utterance.onerror = () => {
      setIsSpeaking(false);
      setError("Speech failed. Try again.");
    };
    
    window.speechSynthesis.speak(utterance);
    setError("");
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setSuccessMsg("⏹️ Stopped");
    setTimeout(() => setSuccessMsg(""), 1000);
  };

  const loadExample = () => {
    setText("Welcome to AI Video Studio. This is your creative companion for all your media needs.");
  };

  const clearAll = () => {
    setText("");
    setError("");
    setSuccessMsg("");
    stop();
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding: "1rem 1rem 80px 1rem" }}>
      <div style={{ marginBottom: "1.5rem", paddingTop: "1rem" }}>
        <button onClick={() => router.back()} style={{ background: "rgba(255,255,255,0.2)", border: "none", padding: "8px 16px", borderRadius: 40, color: "white", cursor: "pointer", marginBottom: "1rem" }}>← Back</button>
        <h1 style={{ color: "white", margin: 0, fontSize: "1.8rem" }}>🎤 Voice Studio</h1>
        <p style={{ color: "rgba(255,255,255,0.8)", marginTop: "0.25rem" }}>Type text and click Speak — it works!</p>
      </div>

      <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: 24, padding: "1.5rem" }}>
        <label style={{ fontWeight: 600, marginBottom: "0.5rem", display: "block" }}>📝 Enter Text</label>
        <textarea 
          value={text} 
          onChange={(e) => setText(e.target.value)} 
          placeholder="Type something here..." 
          rows={4} 
          style={{ width: "100%", padding: "1rem", fontSize: "1rem", borderRadius: 16, border: "1px solid #e0e0e0", fontFamily: "inherit", resize: "vertical", marginBottom: "1rem" }} 
        />

        <label style={{ fontWeight: 600, marginBottom: "0.5rem", display: "block" }}>🎙️ Select Voice</label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1.5rem" }}>
          {voices.map((voice) => (
            <button
              key={voice.id}
              onClick={() => setSelectedVoice(voice)}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: 40,
                background: selectedVoice.id === voice.id ? "#667eea" : "#f0f0f0",
                color: selectedVoice.id === voice.id ? "white" : "#333",
                border: "none",
                cursor: "pointer",
              }}
            >
              {voice.name}
            </button>
          ))}
        </div>

        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginBottom: "1rem" }}>
          <button onClick={speak} disabled={isSpeaking || !text} style={{ flex: 1, padding: "0.75rem", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white", border: "none", borderRadius: 40, fontSize: "1rem", fontWeight: 600, cursor: isSpeaking || !text ? "not-allowed" : "pointer", opacity: isSpeaking || !text ? 0.6 : 1 }}>
            {isSpeaking ? "🔊 Speaking..." : "🔊 Speak"}
          </button>
          <button onClick={stop} disabled={!isSpeaking} style={{ flex: 1, padding: "0.75rem", background: "#ef4444", color: "white", border: "none", borderRadius: 40, fontSize: "1rem", fontWeight: 600, cursor: !isSpeaking ? "not-allowed" : "pointer", opacity: !isSpeaking ? 0.6 : 1 }}>
            ⏹️ Stop
          </button>
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button onClick={loadExample} style={{ flex: 1, padding: "0.5rem", background: "#8b5cf6", color: "white", border: "none", borderRadius: 40, cursor: "pointer" }}>📖 Example</button>
          <button onClick={clearAll} style={{ flex: 1, padding: "0.5rem", background: "#ef4444", color: "white", border: "none", borderRadius: 40, cursor: "pointer" }}>🗑️ Clear</button>
        </div>
      </div>

      {error && <div style={{ marginTop: "1rem", padding: "0.75rem", background: "rgba(239,68,68,0.1)", borderRadius: 12, color: "#ef4444", textAlign: "center" }}>❌ {error}</div>}
      {successMsg && <div style={{ marginTop: "1rem", padding: "0.75rem", background: "rgba(34,197,94,0.1)", borderRadius: 12, color: "#22c55e", textAlign: "center" }}>✅ {successMsg}</div>}

      <BottomNav active="tools" onNavigate={(href) => router.push(href)} />
    </div>
  );
}