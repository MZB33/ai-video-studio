"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";

// ============================================================
// VOICE DATABASE
// ============================================================

const voices = [
  // English Voices
  { id: "en-us-1", name: "James (American Male)", nameUr: "جیمز (امریکی مرد)", gender: "male", language: "English", flag: "🇺🇸" },
  { id: "en-us-2", name: "Sophia (American Female)", nameUr: "صوفیہ (امریکی خاتون)", gender: "female", language: "English", flag: "🇺🇸" },
  { id: "en-uk-1", name: "Oliver (British Male)", nameUr: "اولیور (برطانوی مرد)", gender: "male", language: "English", flag: "🇬🇧" },
  { id: "en-uk-2", name: "Amelia (British Female)", nameUr: "امیلیا (برطانوی خاتون)", gender: "female", language: "English", flag: "🇬🇧" },
  { id: "en-au-1", name: "Jack (Australian)", nameUr: "جیک (آسٹریلوی)", gender: "male", language: "English", flag: "🇦🇺" },
  
  // Urdu Voices (Using Google TTS)
  { id: "ur-pk-1", name: "Asad (Urdu Male)", nameUr: "اسد (اردو مرد)", gender: "male", language: "Urdu", flag: "🇵🇰", ttsCode: "ur" },
  { id: "ur-pk-2", name: "Ayesha (Urdu Female)", nameUr: "عائشہ (اردو خاتون)", gender: "female", language: "Urdu", flag: "🇵🇰", ttsCode: "ur" },
  
  // Hindi Voices
  { id: "hi-in-1", name: "Raj (Hindi Male)", nameUr: "راج (ہندی مرد)", gender: "male", language: "Hindi", flag: "🇮🇳", ttsCode: "hi" },
  { id: "hi-in-2", name: "Priya (Hindi Female)", nameUr: "پریا (ہندی خاتون)", gender: "female", language: "Hindi", flag: "🇮🇳", ttsCode: "hi" },
  
  // Arabic Voices
  { id: "ar-sa-1", name: "Ahmed (Arabic Male)", nameUr: "احمد (عربی مرد)", gender: "male", language: "Arabic", flag: "🇸🇦", ttsCode: "ar" },
  { id: "ar-sa-2", name: "Fatima (Arabic Female)", nameUr: "فاطمہ (عربی خاتون)", gender: "female", language: "Arabic", flag: "🇸🇦", ttsCode: "ar" },
];

export default function VoiceStudioPage() {
  const router = useRouter();
  const [text, setText] = useState("");
  const [selectedVoice, setSelectedVoice] = useState(voices[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");

  const filteredVoices = voices.filter(voice => {
    if (genderFilter !== "all" && voice.gender !== genderFilter) return false;
    if (languageFilter !== "all" && voice.language !== languageFilter) return false;
    if (searchQuery && !voice.name.toLowerCase().includes(searchQuery.toLowerCase()) && !voice.nameUr.includes(searchQuery)) return false;
    return true;
  });

  const generateVoice = async () => {
    if (!text.trim()) {
      setError("Please enter some text");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMsg("");
    setAudioUrl("");

    try {
      let ttsUrl = "";
      
      // For English, use browser speech synthesis
      if (selectedVoice.language === "English") {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "en-US";
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.onend = () => {
          setLoading(false);
          setSuccessMsg(`✅ Voice generated with ${selectedVoice.name}!`);
          setTimeout(() => setSuccessMsg(""), 2000);
        };
        utterance.onerror = () => {
          setError("Speech failed");
          setLoading(false);
        };
        window.speechSynthesis.speak(utterance);
        setSuccessMsg(`🔊 Speaking with ${selectedVoice.name}...`);
        setTimeout(() => setSuccessMsg(""), 2000);
        setLoading(false);
        return;
      }
      
      // For Urdu, Hindi, Arabic - use Google Translate TTS (free)
      const langCode = selectedVoice.language === "Urdu" ? "ur" : selectedVoice.language === "Hindi" ? "hi" : "ar";
      ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${langCode}&client=tw-ob`;
      
      setAudioUrl(ttsUrl);
      setSuccessMsg(`✅ Voice generated with ${selectedVoice.name}! Click play to listen.`);
      setTimeout(() => setSuccessMsg(""), 3000);
      
    } catch (err) {
      setError("Failed to generate voice. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const playAudio = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play().catch(err => {
        setError("Cannot play audio. Try downloading and playing.");
      });
    }
  };

  const loadExample = () => {
    if (selectedVoice.language === "Urdu") {
      setText("خوش آمدید اے آئی ویڈیو اسٹوڈیو میں۔ اپنے خیالات کو حقیقت میں بدلیں۔");
    } else if (selectedVoice.language === "Hindi") {
      setText("एआई वीडियो स्टूडियो में आपका स्वागत है। अपने विचारों को वास्तविकता में बदलें।");
    } else if (selectedVoice.language === "Arabic") {
      setText("مرحبًا بكم في استوديو فيديو الذكاء الاصطناعي. حول أفكارك إلى واقعية.");
    } else {
      setText("Welcome to AI Video Studio. Transform your ideas into reality with artificial intelligence.");
    }
  };

  const clearAll = () => {
    setText("");
    setAudioUrl("");
    setError("");
    setSuccessMsg("");
  };

  const getGenderIcon = (gender: string) => {
    if (gender === "male") return "👨";
    if (gender === "female") return "👩";
    return "🎭";
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding: "1rem 1rem 80px 1rem" }}>
      <div style={{ marginBottom: "1.5rem", paddingTop: "1rem" }}>
        <button onClick={() => router.back()} style={{ background: "rgba(255,255,255,0.2)", border: "none", padding: "8px 16px", borderRadius: 40, color: "white", cursor: "pointer", marginBottom: "1rem" }}>← Back</button>
        <h1 style={{ color: "white", margin: 0, fontSize: "1.8rem" }}>🎤 Voice Studio Pro</h1>
        <p style={{ color: "rgba(255,255,255,0.8)", marginTop: "0.25rem" }}>{voices.length}+ realistic voices • English • Urdu • Hindi • Arabic • Free</p>
      </div>

      <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: 24, padding: "1.5rem", marginBottom: "1.5rem" }}>
        <label style={{ fontWeight: 600, marginBottom: "0.5rem", display: "block" }}>📝 Text to Speak</label>
        <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Enter text to convert to speech..." rows={4} style={{ width: "100%", padding: "1rem", fontSize: "1rem", borderRadius: 16, border: "1px solid #e0e0e0", fontFamily: "inherit", resize: "vertical", marginBottom: "0.5rem" }} />
        
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem", flexWrap: "wrap", gap: "0.5rem" }}>
          <span style={{ fontSize: "0.7rem", color: "#999" }}>{text.length} characters</span>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button onClick={loadExample} style={{ padding: "0.25rem 0.75rem", fontSize: "0.7rem", background: "#8b5cf6", color: "white", border: "none", borderRadius: 40, cursor: "pointer" }}>📖 Example</button>
            <button onClick={clearAll} style={{ padding: "0.25rem 0.75rem", fontSize: "0.7rem", background: "#ef4444", color: "white", border: "none", borderRadius: 40, cursor: "pointer" }}>Clear</button>
          </div>
        </div>

        {/* Search */}
        <div style={{ marginBottom: "1rem" }}>
          <input type="text" placeholder="🔍 Search voices..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: "100%", padding: "0.5rem", borderRadius: 40, border: "1px solid #e0e0e0" }} />
        </div>

        {/* Filters */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "1rem" }}>
          <select value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)} style={{ padding: "0.25rem 0.5rem", borderRadius: 40, border: "1px solid #e0e0e0", fontSize: "0.7rem" }}>
            <option value="all">👥 All Genders</option>
            <option value="male">👨 Male</option>
            <option value="female">👩 Female</option>
          </select>

          <select value={languageFilter} onChange={(e) => setLanguageFilter(e.target.value)} style={{ padding: "0.25rem 0.5rem", borderRadius: 40, border: "1px solid #e0e0e0", fontSize: "0.7rem" }}>
            <option value="all">🌐 All Languages</option>
            <option value="English">🇬🇧 English</option>
            <option value="Urdu">🇵🇰 Urdu</option>
            <option value="Hindi">🇮🇳 Hindi</option>
            <option value="Arabic">🇸🇦 Arabic</option>
          </select>
        </div>

        {/* Voice List */}
        <div style={{ marginBottom: "1rem", maxHeight: 300, overflowY: "auto", border: "1px solid #e0e0e0", borderRadius: 16, padding: "0.5rem" }}>
          <div style={{ fontSize: "0.7rem", color: "#999", marginBottom: "0.5rem" }}>{filteredVoices.length} voices available</div>
          {filteredVoices.map((voice) => (
            <button key={voice.id} onClick={() => setSelectedVoice(voice)} style={{ width: "100%", padding: "0.5rem", marginBottom: "0.25rem", borderRadius: 12, background: selectedVoice.id === voice.id ? "#667eea" : "#f5f5f5", color: selectedVoice.id === voice.id ? "white" : "#333", border: "none", cursor: "pointer", textAlign: "left" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "0.75rem", fontWeight: 500 }}>{voice.flag} {getGenderIcon(voice.gender)} {voice.name}</div>
                  <div style={{ fontSize: "0.6rem", opacity: 0.7 }}>{voice.nameUr}</div>
                  <div style={{ fontSize: "0.55rem" }}>{voice.language}</div>
                </div>
                {selectedVoice.id === voice.id && <span style={{ fontSize: "1rem" }}>✅</span>}
              </div>
            </button>
          ))}
        </div>

        <button onClick={generateVoice} disabled={loading || !text} style={{ width: "100%", padding: "0.875rem", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", color: "white", border: "none", borderRadius: 40, fontSize: "1rem", fontWeight: 600, cursor: loading || !text ? "not-allowed" : "pointer", opacity: loading || !text ? 0.6 : 1 }}>
          {loading ? "🎤 Generating voice..." : `🎙️ Generate with ${selectedVoice.name}`}
        </button>
      </div>

      {/* Audio Player */}
      {audioUrl && (
        <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: 24, padding: "1.5rem", textAlign: "center" }}>
          <audio controls src={audioUrl} style={{ width: "100%", marginBottom: "1rem" }} />
          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={playAudio} style={{ padding: "0.5rem 1rem", background: "#10b981", color: "white", border: "none", borderRadius: 40, cursor: "pointer" }}>▶️ Play</button>
            <a href={audioUrl} download="voice.mp3" style={{ padding: "0.5rem 1rem", background: "#3b82f6", color: "white", textDecoration: "none", borderRadius: 40 }}>💾 Download</a>
          </div>
        </div>
      )}

      {error && <div style={{ marginTop: "1rem", padding: "0.75rem", background: "rgba(239,68,68,0.1)", borderRadius: 12, color: "#ef4444", textAlign: "center" }}>❌ {error}</div>}
      {successMsg && <div style={{ marginTop: "1rem", padding: "0.75rem", background: "rgba(34,197,94,0.1)", borderRadius: 12, color: "#22c55e", textAlign: "center" }}>✅ {successMsg}</div>}

      <BottomNav active="tools" onNavigate={(href) => router.push(href)} />
    </div>
  );
}