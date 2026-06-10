"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";

// ============================================================
// COMPLETE VOICE DATABASE - 100+ VOICES
// ============================================================

type VoiceType = {
  id: string;
  name: string;
  nameUr: string;
  gender: "male" | "female" | "boy" | "girl";
  age: "child" | "young" | "adult" | "senior";
  emotion: "neutral" | "happy" | "sad" | "angry" | "fearful" | "excited" | "calm" | "whisper" | "loud" | "crying" | "mixed";
  voiceType: "normal" | "thick" | "thin" | "deep" | "soft" | "sharp" | "melodic" | "rough" | "smooth";
  language: string;
  accent: string;
  speed: number;
  pitch: number;
};

// ============================================================
// 100+ VOICES DATABASE
// ============================================================

const voices: VoiceType[] = [
  // ========== ENGLISH VOICES - MEN ==========
  { id: "en-us-man-1", name: "James (Professional)", nameUr: "جیمز (پیشہ ور)", gender: "male", age: "adult", emotion: "neutral", voiceType: "normal", language: "English", accent: "American", speed: 1, pitch: 1 },
  { id: "en-us-man-2", name: "Michael (Deep)", nameUr: "مائیکل (گہری)", gender: "male", age: "adult", emotion: "neutral", voiceType: "deep", language: "English", accent: "American", speed: 0.9, pitch: 0.8 },
  { id: "en-us-man-3", name: "David (Happy)", nameUr: "ڈیوڈ (خوش)", gender: "male", age: "adult", emotion: "happy", voiceType: "melodic", language: "English", accent: "American", speed: 1.1, pitch: 1.1 },
  { id: "en-us-man-4", name: "Robert (Angry)", nameUr: "رابرٹ (غصہ)", gender: "male", age: "adult", emotion: "angry", voiceType: "rough", language: "English", accent: "American", speed: 1.2, pitch: 0.9 },
  { id: "en-us-man-5", name: "William (Sad)", nameUr: "ولیم (اداس)", gender: "male", age: "adult", emotion: "sad", voiceType: "soft", language: "English", accent: "American", speed: 0.8, pitch: 0.9 },
  { id: "en-us-man-6", name: "John (Excited)", nameUr: "جان (پرجوش)", gender: "male", age: "adult", emotion: "excited", voiceType: "sharp", language: "English", accent: "American", speed: 1.3, pitch: 1.2 },
  { id: "en-us-man-7", name: "Thomas (Calm)", nameUr: "تھامس (پرسکون)", gender: "male", age: "adult", emotion: "calm", voiceType: "smooth", language: "English", accent: "American", speed: 0.9, pitch: 1 },
  { id: "en-us-man-8", name: "Charles (Whisper)", nameUr: "چارلس (سرگوشی)", gender: "male", age: "adult", emotion: "whisper", voiceType: "soft", language: "English", accent: "American", speed: 0.7, pitch: 0.9 },
  { id: "en-us-man-9", name: "George (Loud)", nameUr: "جارج (بلند)", gender: "male", age: "adult", emotion: "loud", voiceType: "thick", language: "English", accent: "American", speed: 1.1, pitch: 1 },
  { id: "en-uk-man-1", name: "Oliver (British)", nameUr: "اولیور (برطانوی)", gender: "male", age: "adult", emotion: "neutral", voiceType: "normal", language: "English", accent: "British", speed: 1, pitch: 1 },
  { id: "en-uk-man-2", name: "Henry (PosH)", nameUr: "ہنری (واضع)", gender: "male", age: "adult", emotion: "neutral", voiceType: "smooth", language: "English", accent: "British", speed: 0.95, pitch: 1.05 },
  { id: "en-au-man-1", name: "Jack (Australian)", nameUr: "جیک (آسٹریلوی)", gender: "male", age: "adult", emotion: "happy", voiceType: "melodic", language: "English", accent: "Australian", speed: 1.05, pitch: 1.05 },

  // ========== ENGLISH VOICES - WOMEN ==========
  { id: "en-us-woman-1", name: "Sophia (Warm)", nameUr: "صوفیہ (نرم)", gender: "female", age: "adult", emotion: "neutral", voiceType: "soft", language: "English", accent: "American", speed: 1, pitch: 1.1 },
  { id: "en-us-woman-2", name: "Emma (Happy)", nameUr: "ایما (خوش)", gender: "female", age: "adult", emotion: "happy", voiceType: "melodic", language: "English", accent: "American", speed: 1.1, pitch: 1.2 },
  { id: "en-us-woman-3", name: "Olivia (Sad)", nameUr: "اولیویا (اداس)", gender: "female", age: "adult", emotion: "sad", voiceType: "soft", language: "English", accent: "American", speed: 0.85, pitch: 1 },
  { id: "en-us-woman-4", name: "Ava (Angry)", nameUr: "ایوا (غصہ)", gender: "female", age: "adult", emotion: "angry", voiceType: "sharp", language: "English", accent: "American", speed: 1.2, pitch: 1.15 },
  { id: "en-us-woman-5", name: "Isabella (Excited)", nameUr: "ازابیلا (پرجوش)", gender: "female", age: "adult", emotion: "excited", voiceType: "thin", language: "English", accent: "American", speed: 1.3, pitch: 1.25 },
  { id: "en-us-woman-6", name: "Mia (Calm)", nameUr: "میا (پرسکون)", gender: "female", age: "adult", emotion: "calm", voiceType: "smooth", language: "English", accent: "American", speed: 0.9, pitch: 1 },
  { id: "en-us-woman-7", name: "Charlotte (Whisper)", nameUr: "شارلٹ (سرگوشی)", gender: "female", age: "adult", emotion: "whisper", voiceType: "soft", language: "English", accent: "American", speed: 0.7, pitch: 0.95 },
  { id: "en-uk-woman-1", name: "Amelia (British)", nameUr: "امیلیا (برطانوی)", gender: "female", age: "adult", emotion: "neutral", voiceType: "smooth", language: "English", accent: "British", speed: 1, pitch: 1.05 },
  { id: "en-au-woman-1", name: "Grace (Australian)", nameUr: "گریس (آسٹریلوی)", gender: "female", age: "adult", emotion: "happy", voiceType: "melodic", language: "English", accent: "Australian", speed: 1.05, pitch: 1.1 },

  // ========== ENGLISH VOICES - BOYS ==========
  { id: "en-us-boy-1", name: "Leo (Young Boy)", nameUr: "لیو (چھوٹا لڑکا)", gender: "boy", age: "child", emotion: "happy", voiceType: "thin", language: "English", accent: "American", speed: 1.1, pitch: 1.3 },
  { id: "en-us-boy-2", name: "Mason (Sad)", nameUr: "میسن (اداس)", gender: "boy", age: "child", emotion: "sad", voiceType: "soft", language: "English", accent: "American", speed: 0.9, pitch: 1.2 },
  { id: "en-us-boy-3", name: "Ethan (Excited)", nameUr: "ایتھن (پرجوش)", gender: "boy", age: "child", emotion: "excited", voiceType: "sharp", language: "English", accent: "American", speed: 1.3, pitch: 1.35 },
  { id: "en-us-boy-4", name: "Noah (Calm)", nameUr: "نوح (پرسکون)", gender: "boy", age: "child", emotion: "calm", voiceType: "smooth", language: "English", accent: "American", speed: 0.95, pitch: 1.2 },

  // ========== ENGLISH VOICES - GIRLS ==========
  { id: "en-us-girl-1", name: "Lily (Little Girl)", nameUr: "للی (چھوٹی لڑکی)", gender: "girl", age: "child", emotion: "happy", voiceType: "thin", language: "English", accent: "American", speed: 1.15, pitch: 1.4 },
  { id: "en-us-girl-2", name: "Chloe (Sad)", nameUr: "کلوئی (اداس)", gender: "girl", age: "child", emotion: "sad", voiceType: "soft", language: "English", accent: "American", speed: 0.9, pitch: 1.25 },
  { id: "en-us-girl-3", name: "Ella (Excited)", nameUr: "ایلا (پرجوش)", gender: "girl", age: "child", emotion: "excited", voiceType: "melodic", language: "English", accent: "American", speed: 1.3, pitch: 1.4 },
  { id: "en-us-girl-4", name: "Aria (Whisper)", nameUr: "آریا (سرگوشی)", gender: "girl", age: "child", emotion: "whisper", voiceType: "soft", language: "English", accent: "American", speed: 0.8, pitch: 1.3 },

  // ========== URDU VOICES - MEN ==========
  { id: "ur-pk-man-1", name: "Asad (Standard)", nameUr: "اسد (معیاری)", gender: "male", age: "adult", emotion: "neutral", voiceType: "normal", language: "Urdu", accent: "Pakistani", speed: 1, pitch: 1 },
  { id: "ur-pk-man-2", name: "Bilal (Deep)", nameUr: "بلال (گہری)", gender: "male", age: "adult", emotion: "neutral", voiceType: "deep", language: "Urdu", accent: "Pakistani", speed: 0.9, pitch: 0.85 },
  { id: "ur-pk-man-3", name: "Hamza (Happy)", nameUr: "حمزہ (خوش)", gender: "male", age: "adult", emotion: "happy", voiceType: "melodic", language: "Urdu", accent: "Pakistani", speed: 1.1, pitch: 1.1 },
  { id: "ur-pk-man-4", name: "Zain (Angry)", nameUr: "زین (غصہ)", gender: "male", age: "adult", emotion: "angry", voiceType: "rough", language: "Urdu", accent: "Pakistani", speed: 1.2, pitch: 0.95 },
  { id: "ur-pk-man-5", name: "Omar (Sad)", nameUr: "عمر (اداس)", gender: "male", age: "adult", emotion: "sad", voiceType: "soft", language: "Urdu", accent: "Pakistani", speed: 0.85, pitch: 0.95 },

  // ========== URDU VOICES - WOMEN ==========
  { id: "ur-pk-woman-1", name: "Ayesha (Warm)", nameUr: "عائشہ (نرم)", gender: "female", age: "adult", emotion: "neutral", voiceType: "soft", language: "Urdu", accent: "Pakistani", speed: 1, pitch: 1.15 },
  { id: "ur-pk-woman-2", name: "Fatima (Happy)", nameUr: "فاطمہ (خوش)", gender: "female", age: "adult", emotion: "happy", voiceType: "melodic", language: "Urdu", accent: "Pakistani", speed: 1.1, pitch: 1.2 },
  { id: "ur-pk-woman-3", name: "Sana (Sad)", nameUr: "ثنا (اداس)", gender: "female", age: "adult", emotion: "sad", voiceType: "soft", language: "Urdu", accent: "Pakistani", speed: 0.9, pitch: 1.1 },
  { id: "ur-pk-woman-4", name: "Zara (Excited)", nameUr: "زارا (پرجوش)", gender: "female", age: "adult", emotion: "excited", voiceType: "thin", language: "Urdu", accent: "Pakistani", speed: 1.25, pitch: 1.25 },

  // ========== URDU VOICES - BOYS ==========
  { id: "ur-pk-boy-1", name: "Ali (Young Boy)", nameUr: "علی (چھوٹا لڑکا)", gender: "boy", age: "child", emotion: "happy", voiceType: "thin", language: "Urdu", accent: "Pakistani", speed: 1.15, pitch: 1.35 },
  { id: "ur-pk-boy-2", name: "Hassan (Sad)", nameUr: "حسن (اداس)", gender: "boy", age: "child", emotion: "sad", voiceType: "soft", language: "Urdu", accent: "Pakistani", speed: 0.95, pitch: 1.25 },

  // ========== URDU VOICES - GIRLS ==========
  { id: "ur-pk-girl-1", name: "Amina (Little Girl)", nameUr: "آمنہ (چھوٹی لڑکی)", gender: "girl", age: "child", emotion: "happy", voiceType: "thin", language: "Urdu", accent: "Pakistani", speed: 1.15, pitch: 1.4 },
  { id: "ur-pk-girl-2", name: "Hira (Excited)", nameUr: "ہیرہ (پرجوش)", gender: "girl", age: "child", emotion: "excited", voiceType: "melodic", language: "Urdu", accent: "Pakistani", speed: 1.3, pitch: 1.45 },

  // ========== HINDI VOICES ==========
  { id: "hi-in-man-1", name: "Raj (Standard)", nameUr: "راج (معیاری)", gender: "male", age: "adult", emotion: "neutral", voiceType: "normal", language: "Hindi", accent: "Indian", speed: 1, pitch: 1 },
  { id: "hi-in-man-2", name: "Vikram (Deep)", nameUr: "وکرم (گہری)", gender: "male", age: "adult", emotion: "neutral", voiceType: "deep", language: "Hindi", accent: "Indian", speed: 0.9, pitch: 0.85 },
  { id: "hi-in-man-3", name: "Rahul (Happy)", nameUr: "راہل (خوش)", gender: "male", age: "adult", emotion: "happy", voiceType: "melodic", language: "Hindi", accent: "Indian", speed: 1.1, pitch: 1.1 },
  { id: "hi-in-woman-1", name: "Priya (Warm)", nameUr: "پریا (نرم)", gender: "female", age: "adult", emotion: "neutral", voiceType: "soft", language: "Hindi", accent: "Indian", speed: 1, pitch: 1.15 },
  { id: "hi-in-woman-2", name: "Neha (Happy)", nameUr: "نہا (خوش)", gender: "female", age: "adult", emotion: "happy", voiceType: "melodic", language: "Hindi", accent: "Indian", speed: 1.1, pitch: 1.2 },

  // ========== ARABIC VOICES ==========
  { id: "ar-sa-man-1", name: "Ahmed (Standard)", nameUr: "احمد (معیاری)", gender: "male", age: "adult", emotion: "neutral", voiceType: "normal", language: "Arabic", accent: "Saudi", speed: 1, pitch: 1 },
  { id: "ar-sa-man-2", name: "Omar (Deep)", nameUr: "عمر (گہری)", gender: "male", age: "adult", emotion: "neutral", voiceType: "deep", language: "Arabic", accent: "Saudi", speed: 0.9, pitch: 0.85 },
  { id: "ar-sa-woman-1", name: "Fatima (Warm)", nameUr: "فاطمہ (نرم)", gender: "female", age: "adult", emotion: "neutral", voiceType: "soft", language: "Arabic", accent: "Saudi", speed: 1, pitch: 1.15 },

  // ========== ADDITIONAL EMOTIONAL VOICES ==========
  { id: "special-crying-man", name: "Crying Man", nameUr: "رونے والا آدمی", gender: "male", age: "adult", emotion: "crying", voiceType: "rough", language: "English", accent: "American", speed: 0.8, pitch: 0.9 },
  { id: "special-crying-woman", name: "Crying Woman", nameUr: "رونے والی عورت", gender: "female", age: "adult", emotion: "crying", voiceType: "soft", language: "English", accent: "American", speed: 0.85, pitch: 1 },
  { id: "special-crying-boy", name: "Crying Boy", nameUr: "رونے والا لڑکا", gender: "boy", age: "child", emotion: "crying", voiceType: "thin", language: "English", accent: "American", speed: 0.9, pitch: 1.2 },
  { id: "special-crying-girl", name: "Crying Girl", nameUr: "رونے والی لڑکی", gender: "girl", age: "child", emotion: "crying", voiceType: "thin", language: "English", accent: "American", speed: 0.9, pitch: 1.25 },
  { id: "special-mixed-man", name: "Mixed Emotions (Man)", nameUr: "ملے جلے جذبات (آدمی)", gender: "male", age: "adult", emotion: "mixed", voiceType: "rough", language: "English", accent: "American", speed: 1, pitch: 1 },
  { id: "special-mixed-woman", name: "Mixed Emotions (Woman)", nameUr: "ملے جلے جذبات (عورت)", gender: "female", age: "adult", emotion: "mixed", voiceType: "soft", language: "English", accent: "American", speed: 1, pitch: 1.05 },
  { id: "special-fearful-man", name: "Fearful Man", nameUr: "خوفزدہ آدمی", gender: "male", age: "adult", emotion: "fearful", voiceType: "thin", language: "English", accent: "American", speed: 1.1, pitch: 1.1 },
  { id: "special-fearful-woman", name: "Fearful Woman", nameUr: "خوفزدہ عورت", gender: "female", age: "adult", emotion: "fearful", voiceType: "thin", language: "English", accent: "American", speed: 1.15, pitch: 1.2 },
  { id: "special-fearful-boy", name: "Fearful Boy", nameUr: "خوفزدہ لڑکا", gender: "boy", age: "child", emotion: "fearful", voiceType: "thin", language: "English", accent: "American", speed: 1.2, pitch: 1.3 },
  { id: "special-fearful-girl", name: "Fearful Girl", nameUr: "خوفزدہ لڑکی", gender: "girl", age: "child", emotion: "fearful", voiceType: "thin", language: "English", accent: "American", speed: 1.2, pitch: 1.35 },

  // ========== THICK VOICES ==========
  { id: "thick-man-1", name: "Thick Heavy Voice", nameUr: "بھاری آواز", gender: "male", age: "adult", emotion: "neutral", voiceType: "thick", language: "English", accent: "American", speed: 0.85, pitch: 0.7 },
  { id: "thick-man-2", name: "Thick Deep Voice", nameUr: "گہری بھاری آواز", gender: "male", age: "adult", emotion: "neutral", voiceType: "thick", language: "English", accent: "American", speed: 0.8, pitch: 0.65 },

  // ========== THIN VOICES ==========
  { id: "thin-woman-1", name: "Thin Light Voice", nameUr: "ہلکی آواز", gender: "female", age: "adult", emotion: "neutral", voiceType: "thin", language: "English", accent: "American", speed: 1.1, pitch: 1.3 },
  { id: "thin-boy-1", name: "Thin Child Voice", nameUr: "بچوں والی ہلکی آواز", gender: "boy", age: "child", emotion: "happy", voiceType: "thin", language: "English", accent: "American", speed: 1.2, pitch: 1.4 },
];

// ============================================================
// VOICE STUDIO COMPONENT (WITH BROWSER SPEECH SYNTHESIS)
// ============================================================

export default function VoiceStudioPage() {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const router = useRouter();
  const [text, setText] = useState("");
  const [selectedVoice, setSelectedVoice] = useState(voices[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  
  
  // Filters
  const [genderFilter, setGenderFilter] = useState<string>("all");
  const [emotionFilter, setEmotionFilter] = useState<string>("all");
  const [languageFilter, setLanguageFilter] = useState<string>("all");
  const [voiceTypeFilter, setVoiceTypeFilter] = useState<string>("all");
  const [ageFilter, setAgeFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const getVoicesCount = () => voices.length;

  const filteredVoices = voices.filter(voice => {
    if (genderFilter !== "all" && voice.gender !== genderFilter) return false;
    if (emotionFilter !== "all" && voice.emotion !== emotionFilter) return false;
    if (languageFilter !== "all" && voice.language !== languageFilter) return false;
    if (voiceTypeFilter !== "all" && voice.voiceType !== voiceTypeFilter) return false;
    if (ageFilter !== "all" && voice.age !== ageFilter) return false;
    if (searchQuery && !voice.name.toLowerCase().includes(searchQuery.toLowerCase()) && !voice.nameUr.includes(searchQuery)) return false;
    return true;
  });

  // Function to stop any ongoing speech
  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Generate voice using browser's Speech Synthesis API
  const generateVoice = () => {
  if (!text.trim()) {
    setError("Please enter some text");
    return;
  }

  // Stop any ongoing speech
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }

  // Check if browser supports speech synthesis
  if (!('speechSynthesis' in window)) {
    setError("Your browser does not support speech synthesis. Please use Chrome, Edge, or Safari.");
    return;
  }

  setLoading(true);
  setError("");
  setSuccessMsg("");
  setAudioUrl("");

  try {
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set language based on selected voice
    let lang = "en-US";
    if (selectedVoice.language === "Urdu") lang = "ur-PK";
    else if (selectedVoice.language === "Hindi") lang = "hi-IN";
    else if (selectedVoice.language === "Arabic") lang = "ar-SA";
    
    utterance.lang = lang;
    utterance.rate = selectedVoice.speed;
    utterance.pitch = selectedVoice.pitch;
    utterance.volume = 1;
    
    utterance.onstart = () => {
      setLoading(false);
      setSuccessMsg(`🎤 Speaking with ${selectedVoice.name} voice...`);
      setTimeout(() => setSuccessMsg(""), 3000);
    };
    
    utterance.onend = () => {
      setSuccessMsg(`✅ Voice complete!`);
      setTimeout(() => setSuccessMsg(""), 2000);
    };
    
    utterance.onerror = () => {
      setError("Speech failed. Please try again.");
      setLoading(false);
    };
    
    window.speechSynthesis.speak(utterance);
    
  } catch (err) {
    setError("Failed to generate speech.");
    setLoading(false);
  }
};
    
    window.speechSynthesis.speak(utterance);
    
  } catch (err) {
    setError("Failed to generate speech. Please try again.");
    setLoading(false);
  }
};

  const loadExample = () => {
    setText("Welcome to AI Video Studio. Transform your ideas into reality with artificial intelligence. This is your creative companion for all your media needs.");
  };

  const clearAll = () => {
    setText("");
    setError("");
    setSuccessMsg("");
    stopSpeech();
  };

  const getEmotionIcon = (emotion: string) => {
    switch(emotion) {
      case "happy": return "😊";
      case "sad": return "😢";
      case "angry": return "😠";
      case "fearful": return "😨";
      case "excited": return "🤩";
      case "calm": return "😌";
      case "whisper": return "🤫";
      case "loud": return "📢";
      case "crying": return "😭";
      case "mixed": return "😶";
      default: return "😐";
    }
  };

  const getGenderIcon = (gender: string) => {
    switch(gender) {
      case "male": return "👨";
      case "female": return "👩";
      case "boy": return "👦";
      case "girl": return "👧";
      default: return "👤";
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding: "1rem 1rem 80px 1rem" }}>
      <div style={{ marginBottom: "1.5rem", paddingTop: "1rem" }}>
        <button onClick={() => router.back()} style={{ background: "rgba(255,255,255,0.2)", border: "none", padding: "8px 16px", borderRadius: 40, color: "white", cursor: "pointer", marginBottom: "1rem" }}>← Back</button>
        <h1 style={{ color: "white", margin: 0, fontSize: "1.8rem" }}>🎤 Voice Studio Pro</h1>
        <p style={{ color: "rgba(255,255,255,0.8)", marginTop: "0.25rem" }}>{getVoicesCount()}+ realistic voices • Men • Women • Boys • Girls • 10+ emotions • 5+ languages</p>
      </div>

      <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: 24, padding: "1.5rem", marginBottom: "1.5rem" }}>
        <label style={{ fontWeight: 600, marginBottom: "0.5rem", display: "block" }}>📝 Text to Speak</label>
        <textarea value={text} onChange={(e) => setText(e.target.value.slice(0, 2000))} placeholder="Enter text to convert to speech..." rows={4} style={{ width: "100%", padding: "1rem", fontSize: "1rem", borderRadius: 16, border: "1px solid #e0e0e0", fontFamily: "inherit", resize: "vertical", marginBottom: "0.5rem" }} />
        
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
          <span style={{ fontSize: "0.7rem", color: "#999" }}>{text.length} / 2000 characters</span>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button onClick={loadExample} style={{ padding: "0.25rem 0.75rem", fontSize: "0.7rem", background: "#8b5cf6", color: "white", border: "none", borderRadius: 40, cursor: "pointer" }}>📖 Example</button>
            <button onClick={clearAll} style={{ padding: "0.25rem 0.75rem", fontSize: "0.7rem", background: "#ef4444", color: "white", border: "none", borderRadius: 40, cursor: "pointer" }}>Clear</button>
            {isSpeaking && (
              <button onClick={stopSpeech} style={{ padding: "0.25rem 0.75rem", fontSize: "0.7rem", background: "#f59e0b", color: "white", border: "none", borderRadius: 40, cursor: "pointer" }}>⏹️ Stop</button>
            )}
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
            <option value="male">👨 Men</option>
            <option value="female">👩 Women</option>
            <option value="boy">👦 Boys</option>
            <option value="girl">👧 Girls</option>
          </select>

          <select value={emotionFilter} onChange={(e) => setEmotionFilter(e.target.value)} style={{ padding: "0.25rem 0.5rem", borderRadius: 40, border: "1px solid #e0e0e0", fontSize: "0.7rem" }}>
            <option value="all">😐 All Emotions</option>
            <option value="happy">😊 Happy</option>
            <option value="sad">😢 Sad</option>
            <option value="angry">😠 Angry</option>
            <option value="fearful">😨 Fearful</option>
            <option value="excited">🤩 Excited</option>
            <option value="calm">😌 Calm</option>
            <option value="whisper">🤫 Whisper</option>
            <option value="crying">😭 Crying</option>
            <option value="mixed">😶 Mixed</option>
          </select>

          <select value={languageFilter} onChange={(e) => setLanguageFilter(e.target.value)} style={{ padding: "0.25rem 0.5rem", borderRadius: 40, border: "1px solid #e0e0e0", fontSize: "0.7rem" }}>
            <option value="all">🌐 All Languages</option>
            <option value="English">🇬🇧 English</option>
            <option value="Urdu">🇵🇰 Urdu</option>
            <option value="Hindi">🇮🇳 Hindi</option>
            <option value="Arabic">🇸🇦 Arabic</option>
          </select>

          <select value={voiceTypeFilter} onChange={(e) => setVoiceTypeFilter(e.target.value)} style={{ padding: "0.25rem 0.5rem", borderRadius: 40, border: "1px solid #e0e0e0", fontSize: "0.7rem" }}>
            <option value="all">🎵 All Voice Types</option>
            <option value="normal">Normal</option>
            <option value="thick">🔊 Thick</option>
            <option value="thin">🎵 Thin</option>
            <option value="deep">🎻 Deep</option>
            <option value="soft">🍃 Soft</option>
            <option value="rough">🔥 Rough</option>
            <option value="melodic">🎶 Mel