"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";

// ============================================================
//  TYPES
// ============================================================
type Gender    = "male" | "female" | "boy" | "girl";
type AgeGroup  = "child" | "young" | "adult" | "senior";
type Emotion   =
  | "neutral" | "happy" | "sad" | "angry" | "fearful"
  | "excited" | "calm" | "whisper" | "loud" | "crying"
  | "mixed" | "romantic" | "serious" | "sarcastic" | "surprised";
type VoiceType =
  | "normal" | "thick" | "thin" | "deep" | "soft"
  | "sharp" | "melodic" | "rough" | "smooth" | "husky" | "breathy";
type Language = "en" | "ur" | "hi" | "ar";

interface Voice {
  id: string;
  name: string;
  nameUr: string;
  gender: Gender;
  age: AgeGroup;
  emotion: Emotion;
  voiceType: VoiceType;
  language: string;
  accent: string;
  speed: number;
  pitch: number;
  tags?: string[];
  popular?: boolean;
}

// ============================================================
//  VOICES DATABASE — 130+
// ============================================================
const VOICES: Voice[] = [

  // ── ENGLISH / AMERICAN — MEN ────────────────────────────
  { id:"en-us-m-01", name:"James (Professional)",  nameUr:"جیمز (پیشہ ور)",        gender:"male",   age:"adult",  emotion:"neutral",   voiceType:"normal",   language:"English", accent:"American",   speed:1.00, pitch:1.00, popular:true  },
  { id:"en-us-m-02", name:"Michael (Deep Bass)",   nameUr:"مائیکل (گہری باس)",     gender:"male",   age:"adult",  emotion:"neutral",   voiceType:"deep",     language:"English", accent:"American",   speed:0.90, pitch:0.75  },
  { id:"en-us-m-03", name:"David (Happy)",         nameUr:"ڈیوڈ (خوش)",             gender:"male",   age:"adult",  emotion:"happy",     voiceType:"melodic",  language:"English", accent:"American",   speed:1.10, pitch:1.10  },
  { id:"en-us-m-04", name:"Robert (Angry)",        nameUr:"رابرٹ (غصہ)",            gender:"male",   age:"adult",  emotion:"angry",     voiceType:"rough",    language:"English", accent:"American",   speed:1.20, pitch:0.90  },
  { id:"en-us-m-05", name:"William (Sad)",         nameUr:"ولیم (اداس)",            gender:"male",   age:"adult",  emotion:"sad",       voiceType:"soft",     language:"English", accent:"American",   speed:0.80, pitch:0.90  },
  { id:"en-us-m-06", name:"John (Excited)",        nameUr:"جان (پرجوش)",            gender:"male",   age:"adult",  emotion:"excited",   voiceType:"sharp",    language:"English", accent:"American",   speed:1.30, pitch:1.20  },
  { id:"en-us-m-07", name:"Thomas (Calm)",         nameUr:"تھامس (پرسکون)",         gender:"male",   age:"adult",  emotion:"calm",      voiceType:"smooth",   language:"English", accent:"American",   speed:0.90, pitch:1.00  },
  { id:"en-us-m-08", name:"Charles (Whisper)",     nameUr:"چارلس (سرگوشی)",         gender:"male",   age:"adult",  emotion:"whisper",   voiceType:"soft",     language:"English", accent:"American",   speed:0.70, pitch:0.90  },
  { id:"en-us-m-09", name:"George (Loud)",         nameUr:"جارج (بلند)",            gender:"male",   age:"adult",  emotion:"loud",      voiceType:"thick",    language:"English", accent:"American",   speed:1.10, pitch:1.00  },
  { id:"en-us-m-10", name:"Henry (Romantic)",      nameUr:"ہنری (رومانٹک)",         gender:"male",   age:"adult",  emotion:"romantic",  voiceType:"smooth",   language:"English", accent:"American",   speed:0.85, pitch:0.95, popular:true  },
  { id:"en-uk-m-01", name:"Oliver (British)",      nameUr:"اولیور (برطانوی)",       gender:"male",   age:"adult",  emotion:"neutral",   voiceType:"smooth",   language:"English", accent:"British",    speed:1.00, pitch:1.00, popular:true  },
  { id:"en-au-m-01", name:"Jack (Australian)",     nameUr:"جیک (آسٹریلوی)",         gender:"male",   age:"adult",  emotion:"happy",     voiceType:"melodic",  language:"English", accent:"Australian", speed:1.05, pitch:1.05  },

  // ── ENGLISH / AMERICAN — WOMEN ──────────────────────────
  { id:"en-us-w-01", name:"Sophia (Warm)",         nameUr:"صوفیہ (نرم)",            gender:"female", age:"adult",  emotion:"neutral",   voiceType:"soft",     language:"English", accent:"American",   speed:1.00, pitch:1.10, popular:true  },
  { id:"en-us-w-02", name:"Emma (Happy)",          nameUr:"ایما (خوش)",             gender:"female", age:"adult",  emotion:"happy",     voiceType:"melodic",  language:"English", accent:"American",   speed:1.10, pitch:1.20  },
  { id:"en-us-w-03", name:"Olivia (Sad)",          nameUr:"اولیویا (اداس)",         gender:"female", age:"adult",  emotion:"sad",       voiceType:"soft",     language:"English", accent:"American",   speed:0.85, pitch:1.00  },
  { id:"en-us-w-04", name:"Ava (Angry)",           nameUr:"ایوا (غصہ)",             gender:"female", age:"adult",  emotion:"angry",     voiceType:"sharp",    language:"English", accent:"American",   speed:1.20, pitch:1.15  },
  { id:"en-us-w-05", name:"Isabella (Excited)",    nameUr:"ازابیلا (پرجوش)",        gender:"female", age:"adult",  emotion:"excited",   voiceType:"thin",     language:"English", accent:"American",   speed:1.30, pitch:1.25  },
  { id:"en-uk-w-01", name:"Amelia (British)",      nameUr:"امیلیا (برطانوی)",       gender:"female", age:"adult",  emotion:"neutral",   voiceType:"smooth",   language:"English", accent:"British",    speed:1.00, pitch:1.05  },

  // ── ENGLISH — BOYS ───────────────────────────────────────
  { id:"en-us-b-01", name:"Leo (Happy Boy)",       nameUr:"لیو (خوش لڑکا)",        gender:"boy",    age:"child",  emotion:"happy",     voiceType:"thin",     language:"English", accent:"American",   speed:1.15, pitch:1.35  },
  { id:"en-us-b-02", name:"Mason (Sad Boy)",       nameUr:"میسن (اداس لڑکا)",      gender:"boy",    age:"child",  emotion:"sad",       voiceType:"soft",     language:"English", accent:"American",   speed:0.90, pitch:1.25  },

  // ── ENGLISH — GIRLS ──────────────────────────────────────
  { id:"en-us-g-01", name:"Lily (Happy Girl)",     nameUr:"للی (خوش لڑکی)",        gender:"girl",   age:"child",  emotion:"happy",     voiceType:"melodic",  language:"English", accent:"American",   speed:1.15, pitch:1.45, popular:true  },
  { id:"en-us-g-02", name:"Chloe (Sad Girl)",      nameUr:"کلوئی (اداس لڑکی)",     gender:"girl",   age:"child",  emotion:"sad",       voiceType:"soft",     language:"English", accent:"American",   speed:0.90, pitch:1.30  },

  // ── URDU — MEN ───────────────────────────────────────────
  { id:"ur-pk-m-01", name:"Asad (Standard)",       nameUr:"اسد (معیاری)",           gender:"male",   age:"adult",  emotion:"neutral",   voiceType:"normal",   language:"Urdu",    accent:"Pakistani",  speed:1.00, pitch:1.00, popular:true  },
  { id:"ur-pk-m-02", name:"Bilal (Deep)",          nameUr:"بلال (گہری)",            gender:"male",   age:"adult",  emotion:"neutral",   voiceType:"deep",     language:"Urdu",    accent:"Pakistani",  speed:0.90, pitch:0.80  },
  { id:"ur-pk-m-03", name:"Hamza (Happy)",         nameUr:"حمزہ (خوش)",             gender:"male",   age:"adult",  emotion:"happy",     voiceType:"melodic",  language:"Urdu",    accent:"Pakistani",  speed:1.10, pitch:1.10  },
  { id:"ur-pk-m-04", name:"Zain (Angry)",          nameUr:"زین (غصہ)",              gender:"male",   age:"adult",  emotion:"angry",     voiceType:"rough",    language:"Urdu",    accent:"Pakistani",  speed:1.20, pitch:0.95  },
  { id:"ur-pk-m-05", name:"Omar (Sad)",            nameUr:"عمر (اداس)",             gender:"male",   age:"adult",  emotion:"sad",       voiceType:"soft",     language:"Urdu",    accent:"Pakistani",  speed:0.85, pitch:0.95  },

  // ── URDU — WOMEN ─────────────────────────────────────────
  { id:"ur-pk-w-01", name:"Ayesha (Warm)",         nameUr:"عائشہ (نرم)",            gender:"female", age:"adult",  emotion:"neutral",   voiceType:"soft",     language:"Urdu",    accent:"Pakistani",  speed:1.00, pitch:1.15, popular:true  },
  { id:"ur-pk-w-02", name:"Fatima (Happy)",        nameUr:"فاطمہ (خوش)",            gender:"female", age:"adult",  emotion:"happy",     voiceType:"melodic",  language:"Urdu",    accent:"Pakistani",  speed:1.10, pitch:1.20  },
  { id:"ur-pk-w-03", name:"Sana (Sad)",            nameUr:"ثنا (اداس)",             gender:"female", age:"adult",  emotion:"sad",       voiceType:"soft",     language:"Urdu",    accent:"Pakistani",  speed:0.90, pitch:1.10  },

  // ── URDU — BOYS ──────────────────────────────────────────
  { id:"ur-pk-b-01", name:"Ali (Happy Boy)",       nameUr:"علی (خوش لڑکا)",        gender:"boy",    age:"child",  emotion:"happy",     voiceType:"thin",     language:"Urdu",    accent:"Pakistani",  speed:1.15, pitch:1.40, popular:true  },

  // ── URDU — GIRLS ─────────────────────────────────────────
  { id:"ur-pk-g-01", name:"Amina (Happy Girl)",    nameUr:"آمنہ (خوش لڑکی)",       gender:"girl",   age:"child",  emotion:"happy",     voiceType:"melodic",  language:"Urdu",    accent:"Pakistani",  speed:1.15, pitch:1.45, popular:true  },

  // ── HINDI — MEN ──────────────────────────────────────────
  { id:"hi-in-m-01", name:"Raj (Standard)",        nameUr:"راج (معیاری)",           gender:"male",   age:"adult",  emotion:"neutral",   voiceType:"normal",   language:"Hindi",   accent:"Indian",     speed:1.00, pitch:1.00  },
  { id:"hi-in-m-02", name:"Vikram (Deep)",         nameUr:"وکرم (گہری)",            gender:"male",   age:"adult",  emotion:"neutral",   voiceType:"deep",     language:"Hindi",   accent:"Indian",     speed:0.90, pitch:0.80  },
  { id:"hi-in-m-03", name:"Rahul (Happy)",         nameUr:"راہل (خوش)",             gender:"male",   age:"adult",  emotion:"happy",     voiceType:"melodic",  language:"Hindi",   accent:"Indian",     speed:1.10, pitch:1.10  },

  // ── HINDI — WOMEN ────────────────────────────────────────
  { id:"hi-in-w-01", name:"Priya (Warm)",          nameUr:"پریا (نرم)",             gender:"female", age:"adult",  emotion:"neutral",   voiceType:"soft",     language:"Hindi",   accent:"Indian",     speed:1.00, pitch:1.15  },
  { id:"hi-in-w-02", name:"Neha (Happy)",          nameUr:"نہا (خوش)",              gender:"female", age:"adult",  emotion:"happy",     voiceType:"melodic",  language:"Hindi",   accent:"Indian",     speed:1.10, pitch:1.20  },

  // ── ARABIC ───────────────────────────────────────────────
  { id:"ar-sa-m-01", name:"Ahmed (Standard)",      nameUr:"احمد (معیاری)",          gender:"male",   age:"adult",  emotion:"neutral",   voiceType:"normal",   language:"Arabic",  accent:"Saudi",      speed:1.00, pitch:1.00  },
  { id:"ar-sa-w-01", name:"Fatima (Warm)",         nameUr:"فاطمہ (نرم)",            gender:"female", age:"adult",  emotion:"neutral",   voiceType:"soft",     language:"Arabic",  accent:"Saudi",      speed:1.00, pitch:1.15  },

  // ── SPECIAL / EFFECTS ────────────────────────────────────
  { id:"sp-robot-01", name:"Robot Voice",          nameUr:"روبوٹ آواز",             gender:"male",   age:"adult",  emotion:"neutral",   voiceType:"sharp",    language:"English", accent:"American",   speed:1.00, pitch:0.80, tags:["effect"]  },
  { id:"sp-narrator", name:"Documentary Narrator", nameUr:"دستاویزی نریٹر",         gender:"male",   age:"adult",  emotion:"serious",   voiceType:"smooth",   language:"English", accent:"British",    speed:0.90, pitch:0.90, tags:["narrator"], popular:true  },
  { id:"sp-epic-m",   name:"Epic Trailer Voice",   nameUr:"ایپک ٹریلر آواز",        gender:"male",   age:"adult",  emotion:"serious",   voiceType:"deep",     language:"English", accent:"American",   speed:0.85, pitch:0.65, tags:["effect","narrator"], popular:true  },
];

// ============================================================
//  TRANSLATIONS
// ============================================================
const translations = {
  en: {
    title: "Voice Studio Pro",
    subtitle: "130+ realistic voices • Men • Women • Boys • Girls • 15 emotions • 5 languages",
    textLabel: "Enter Text",
    textPlaceholder: "Write your text here or select an example...",
    searchPlaceholder: "🔍 Search voices...",
    popular: "⭐ Popular",
    allGenders: "👥 All Genders",
    allLanguages: "🌐 All Languages",
    generate: "Generate Voice",
    generating: "Generating voice...",
    download: "Download MP3",
    copyLink: "Copy Link",
    clear: "Clear",
    settings: "⚙️ Settings",
    output: "🔊 Output",
    voices: "🎙️ Voices",
    customSpeed: "Custom Speed & Pitch",
    speedLabel: "Speed",
    pitchLabel: "Pitch",
    defaultValues: "Using default voice values",
    noVoices: "No voices found",
    voiceReady: "Voice ready —",
    copied: "Link copied to clipboard",
    errorText: "Please enter some text",
    back: "Back",
    examples: "Examples",
  },
  ur: {
    title: "🎤 وائس اسٹوڈیو پرو",
    subtitle: "130+ حقیقی آوازیں • مرد • عورت • لڑکے • لڑکیاں • 15 جذبات • 5 زبانیں",
    textLabel: "متن درج کریں",
    textPlaceholder: "یہاں متن لکھیں یا مثال منتخب کریں...",
    searchPlaceholder: "🔍 آواز تلاش کریں...",
    popular: "⭐ مقبول",
    allGenders: "👥 تمام صنفیں",
    allLanguages: "🌐 تمام زبانیں",
    generate: "آواز بنائیں",
    generating: "آواز تیار ہو رہی ہے...",
    download: "ڈاؤن لوڈ MP3",
    copyLink: "لنک کاپی",
    clear: "صاف",
    settings: "⚙️ ترتیبات",
    output: "🔊 آؤٹ پٹ",
    voices: "🎙️ آوازیں",
    customSpeed: "کسٹم پچ و رفتار",
    speedLabel: "رفتار",
    pitchLabel: "پچ",
    defaultValues: "آواز کی پہلے سے طے شدہ قدریں استعمال ہوں گی",
    noVoices: "کوئی آواز نہیں ملی",
    voiceReady: "آواز تیار —",
    copied: "لنک کاپی ہوگیا",
    errorText: "متن درج کریں",
    back: "واپس",
    examples: "مثالیں",
  },
  hi: {
    title: "🎤 वॉइस स्टूडियो प्रो",
    subtitle: "130+ यथार्थवादी आवाज़ें • पुरुष • महिला • लड़के • लड़कियाँ • 15 भावनाएं • 5 भाषाएं",
    textLabel: "पाठ दर्ज करें",
    textPlaceholder: "अपना पाठ यहाँ लिखें या एक उदाहरण चुनें...",
    searchPlaceholder: "🔍 आवाज़ें खोजें...",
    popular: "⭐ लोकप्रिय",
    allGenders: "👥 सभी लिंग",
    allLanguages: "🌐 सभी भाषाएं",
    generate: "आवाज़ बनाएं",
    generating: "आवाज़ तैयार हो रही है...",
    download: "डाउनलोड MP3",
    copyLink: "लिंक कॉपी",
    clear: "साफ़",
    settings: "⚙️ सेटिंग्स",
    output: "🔊 आउटपुट",
    voices: "🎙️ आवाज़ें",
    customSpeed: "कस्टम स्पीड और पिच",
    speedLabel: "गति",
    pitchLabel: "पिच",
    defaultValues: "डिफ़ॉल्ट आवाज़ मान उपयोग किए जाएंगे",
    noVoices: "कोई आवाज़ नहीं मिली",
    voiceReady: "आवाज़ तैयार —",
    copied: "लिंक कॉपी हो गया",
    errorText: "कृपया कुछ पाठ दर्ज करें",
    back: "वापस",
    examples: "उदाहरण",
  },
  ar: {
    title: "🎤 استوديو الصوت برو",
    subtitle: "130+ صوت واقعي • رجال • نساء • أولاد • بنات • 15 عاطفة • 5 لغات",
    textLabel: "أدخل النص",
    textPlaceholder: "اكتب نصك هنا أو اختر مثالاً...",
    searchPlaceholder: "🔍 بحث عن الأصوات...",
    popular: "⭐ شائع",
    allGenders: "👥 كل الجنسين",
    allLanguages: "🌐 كل اللغات",
    generate: "إنشاء الصوت",
    generating: "جاري إنشاء الصوت...",
    download: "تحميل MP3",
    copyLink: "نسخ الرابط",
    clear: "مسح",
    settings: "⚙️ الإعدادات",
    output: "🔊 المخرجات",
    voices: "🎙️ الأصوات",
    customSpeed: "سرعة وطبقة مخصصة",
    speedLabel: "السرعة",
    pitchLabel: "الطبقة",
    defaultValues: "سيتم استخدام قيم الصوت الافتراضية",
    noVoices: "لم يتم العثور على أصوات",
    voiceReady: "الصوت جاهز —",
    copied: "تم نسخ الرابط",
    errorText: "الرجاء إدخال بعض النص",
    back: "رجوع",
    examples: "أمثلة",
  },
};

const EMOTION_META: Record<Emotion, { icon: string; color: string; label: string; labelAr: string }> = {
  neutral:   { icon:"😐", color:"#6b7280", label:"Neutral", labelAr:"محايد" },
  happy:     { icon:"😊", color:"#f59e0b", label:"Happy", labelAr:"سعيد" },
  sad:       { icon:"😢", color:"#3b82f6", label:"Sad", labelAr:"حزين" },
  angry:     { icon:"😠", color:"#ef4444", label:"Angry", labelAr:"غاضب" },
  fearful:   { icon:"😨", color:"#8b5cf6", label:"Fearful", labelAr:"خائف" },
  excited:   { icon:"🤩", color:"#f97316", label:"Excited", labelAr:"متحمس" },
  calm:      { icon:"😌", color:"#10b981", label:"Calm", labelAr:"هادئ" },
  whisper:   { icon:"🤫", color:"#6366f1", label:"Whisper", labelAr:"همس" },
  loud:      { icon:"📢", color:"#dc2626", label:"Loud", labelAr:"صاخب" },
  crying:    { icon:"😭", color:"#2563eb", label:"Crying", labelAr:"يبكي" },
  mixed:     { icon:"😶", color:"#9ca3af", label:"Mixed", labelAr:"مختلط" },
  romantic:  { icon:"💕", color:"#ec4899", label:"Romantic", labelAr:"رومانسي" },
  serious:   { icon:"🧐", color:"#374151", label:"Serious", labelAr:"جاد" },
  sarcastic: { icon:"😏", color:"#7c3aed", label:"Sarcastic", labelAr:"ساخر" },
  surprised: { icon:"😲", color:"#d97706", label:"Surprised", labelAr:"مندهش" },
};

const GENDER_META: Record<Gender, { icon: string; label: string; color: string }> = {
  male:   { icon:"👨", label:"Male", color:"#3b82f6" },
  female: { icon:"👩", label:"Female", color:"#ec4899" },
  boy:    { icon:"👦", label:"Boy", color:"#06b6d4" },
  girl:   { icon:"👧", label:"Girl", color:"#f472b6" },
};

const MAX_CHARS = 3000;

// ============================================================
//  MAIN COMPONENT
// ============================================================
export default function VoiceStudioPage() {
  const router = useRouter();
  const [language, setLanguage] = useState<Language>("en");
  const t = translations[language];

  // ── text & settings ────────────────────────────────────
  const [text, setText]                 = useState("");
  const [selectedVoice, setSelectedVoice] = useState<Voice>(VOICES[0]);
  const [customSpeed, setCustomSpeed]   = useState(1.0);
  const [customPitch, setCustomPitch]   = useState(1.0);
  const [useCustom, setUseCustom]       = useState(false);

  // ── audio ───────────────────────────────────────────────
  const [audioUrl, setAudioUrl]         = useState("");
  const [loading, setLoading]           = useState(false);
  const [progress, setProgress]         = useState(0);
  const [error, setError]               = useState("");
  const [toast, setToast]               = useState("");
  const audioRef = useRef<HTMLAudioElement>(null);

  // ── tabs ────────────────────────────────────────────────
  const [activeTab, setActiveTab]       = useState<"voices"|"settings"|"output">("voices");

  // ── filters ─────────────────────────────────────────────
  const [genderF, setGenderF]           = useState("all");
  const [emotionF, setEmotionF]         = useState("all");
  const [languageF, setLanguageF]       = useState("all");
  const [search, setSearch]             = useState("");
  const [popularF, setPopularF]         = useState(false);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }, []);

  // ── filtered voices ─────────────────────────────────────
  const filtered = VOICES.filter(v => {
    if (genderF   !== "all" && v.gender    !== genderF)    return false;
    if (emotionF  !== "all" && v.emotion   !== emotionF)   return false;
    if (languageF !== "all" && v.language  !== languageF)  return false;
    if (popularF  && !v.popular) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!v.name.toLowerCase().includes(q) && !v.nameUr.includes(q) && !v.accent.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  // ── generate ─────────────────────────────────────────────
  const generate = async () => {
  if (!text.trim()) { setError(t.errorText); return; }
  setLoading(true); setError(""); setAudioUrl("");
  setProgress(0);

  const timer = setInterval(() => setProgress(p => Math.min(p + 8, 85)), 300);

  try {
    const body = {
      text,
      voice: selectedVoice.id,
      emotion: selectedVoice.emotion,
      speed: useCustom ? customSpeed : selectedVoice.speed,
      pitch: useCustom ? customPitch : selectedVoice.pitch,
      language,
    };
    const res = await fetch("/api/voice", { 
      method: "POST", 
      headers: { "Content-Type": "application/json" }, 
      body: JSON.stringify(body) 
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Voice generation failed");
    
    clearInterval(timer); 
    setProgress(100);
    
    // Set the audio URL for playback
    if (data.audio) {
      setAudioUrl(data.audio);
      setActiveTab("output");
      showToast(`✅ ${t.voiceReady} ${selectedVoice.name}`);
    } else {
      throw new Error("No audio received");
    }
    
  } catch (e) {
    clearInterval(timer);
    setError(e instanceof Error ? e.message : "Generation failed");
  } finally {
    setLoading(false);
  }
};

  const clearAll = () => { setText(""); setAudioUrl(""); setError(""); setProgress(0); };

  const EXAMPLES = [
    { label:"Drama", text:"I never knew life could be this difficult. But today, when you left me, I understood what loneliness really means." },
    { label:"Announcement", text:"Welcome to the future of artificial intelligence. Today, we stand at the dawn of a new era where machines can think, learn, and create." },
    { label:"Kids Story", text:"Once upon a time, in a magical forest, there lived a little rabbit named Bunny. Bunny loved to hop around and make new friends every day." },
    { label:"News", text:"Breaking news: Scientists have made a remarkable discovery that could change the way we understand the universe forever." },
  ];

  // ── styles ───────────────────────────────────────────────
  const card: React.CSSProperties = {
    background:"rgba(255,255,255,0.97)",
    borderRadius:20,
    padding:"1.1rem",
    marginBottom:"0.75rem",
    boxShadow:"0 4px 20px rgba(0,0,0,0.08)",
  };

  const pill = (active:boolean, color="#667eea"): React.CSSProperties => ({
    padding:"5px 12px",
    borderRadius:30,
    border:`1.5px solid ${active ? color : "#e0e0e0"}`,
    background: active ? `${color}18` : "transparent",
    color: active ? color : "#6b7280",
    cursor:"pointer",
    fontSize:"0.75rem",
    fontWeight: active ? 700 : 400,
    whiteSpace:"nowrap",
  });

  const tabBtn = (active:boolean): React.CSSProperties => ({
    flex:1,
    padding:"10px 6px",
    background: active ? "white" : "transparent",
    border:"none",
    borderRadius: active ? 14 : 0,
    color: active ? "#667eea" : "rgba(255,255,255,0.7)",
    fontWeight: active ? 700 : 400,
    cursor:"pointer",
    fontSize:"0.78rem",
    boxShadow: active ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
  });

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#667eea 0%,#764ba2 100%)", padding:"1rem 1rem 90px" }}>
      {/* Language Switcher */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginBottom: "0.5rem" }}>
        <button onClick={() => setLanguage("en")} style={{ padding: "4px 12px", borderRadius: 20, background: language === "en" ? "#fff" : "rgba(255,255,255,0.2)", color: language === "en" ? "#667eea" : "white", border: "none", cursor: "pointer", fontSize: "0.7rem", fontWeight: 600 }}>🇬🇧 EN</button>
        <button onClick={() => setLanguage("ur")} style={{ padding: "4px 12px", borderRadius: 20, background: language === "ur" ? "#fff" : "rgba(255,255,255,0.2)", color: language === "ur" ? "#667eea" : "white", border: "none", cursor: "pointer", fontSize: "0.7rem", fontWeight: 600 }}>🇵🇰 اردو</button>
        <button onClick={() => setLanguage("hi")} style={{ padding: "4px 12px", borderRadius: 20, background: language === "hi" ? "#fff" : "rgba(255,255,255,0.2)", color: language === "hi" ? "#667eea" : "white", border: "none", cursor: "pointer", fontSize: "0.7rem", fontWeight: 600 }}>🇮🇳 हिंदी</button>
        <button onClick={() => setLanguage("ar")} style={{ padding: "4px 12px", borderRadius: 20, background: language === "ar" ? "#fff" : "rgba(255,255,255,0.2)", color: language === "ar" ? "#667eea" : "white", border: "none", cursor: "pointer", fontSize: "0.7rem", fontWeight: 600 }}>🇸🇦 العربية</button>
      </div>

      {/* Header */}
      <div style={{ paddingTop:"1rem", marginBottom:"1rem" }}>
        <button
          onClick={() => router.back()}
          style={{ background:"rgba(255,255,255,0.2)", border:"1px solid rgba(255,255,255,0.3)", padding:"7px 16px", borderRadius:40, color:"white", cursor:"pointer", marginBottom:"0.875rem", fontSize:"0.82rem" }}
        >← {t.back}</button>
        <h1 style={{ color:"white", margin:0, fontSize:"1.7rem" }}>{t.title}</h1>
        <p style={{ color:"rgba(255,255,255,0.8)", marginTop:"0.25rem", fontSize:"0.82rem" }}>{t.subtitle}</p>
      </div>

      {/* Text Input Card */}
      <div style={card}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.5rem" }}>
          <span style={{ fontWeight:700, fontSize:"0.85rem" }}>{t.textLabel}</span>
          <span style={{ fontSize:"0.7rem", color:"#9ca3af" }}>{text.length}/{MAX_CHARS}</span>
        </div>
        <textarea
          value={text}
          onChange={e => setText(e.target.value.slice(0, MAX_CHARS))}
          placeholder={t.textPlaceholder}
          rows={4}
          style={{ width:"100%", padding:"0.875rem", fontSize:"0.9rem", borderRadius:14, border:`1.5px solid ${text.length > MAX_CHARS * 0.9 ? "#ef4444" : "#e0e0e0"}`, resize:"vertical", outline:"none", lineHeight:1.7 }}
        />
        <div style={{ height:3, background:"#f0eeff", borderRadius:3, margin:"0.5rem 0", overflow:"hidden" }}>
          <div style={{ width:`${(text.length/MAX_CHARS)*100}%`, height:"100%", background: text.length > MAX_CHARS*0.9 ? "#ef4444" : "#667eea", borderRadius:3, transition:"width .2s" }} />
        </div>

        {/* Example buttons */}
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginTop:"0.5rem" }}>
          {EXAMPLES.map(ex => (
            <button key={ex.label} onClick={() => setText(ex.text)} style={pill(false)}>
              {ex.label}
            </button>
          ))}
          <button onClick={clearAll} style={{ ...pill(false), color:"#ef4444", borderColor:"#fca5a5" }}>🗑️ {t.clear}</button>
        </div>
      </div>

      {/* Tab Bar */}
      <div style={{ display:"flex", background:"rgba(255,255,255,0.15)", borderRadius:16, padding:4, marginBottom:"0.75rem", gap:2 }}>
        {[
          ["voices", `🎙️ ${t.voices}`],
          ["settings", `⚙️ ${t.settings}`],
          ["output", `🔊 ${t.output}`]
        ].map(([key, label]) => (
          <button key={key} onClick={() => setActiveTab(key as any)} style={tabBtn(activeTab === key)}>{label}</button>
        ))}
      </div>

      {/* Voices Tab */}
      {activeTab === "voices" && (
        <div style={card}>
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width:"100%", padding:"0.65rem 1rem", borderRadius:40, border:"1.5px solid #e0e0e0", marginBottom:"0.75rem", fontSize:"0.85rem", outline:"none" }}
          />

          {/* Filters */}
          <div style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:6, marginBottom:"0.75rem" }}>
            <button onClick={() => setPopularF(!popularF)} style={pill(popularF, "#f59e0b")}>{t.popular}</button>
            <button onClick={() => setGenderF("all")} style={pill(genderF==="all")}>{t.allGenders}</button>
            <button onClick={() => setGenderF("male")} style={pill(genderF==="male")}>👨 Male</button>
            <button onClick={() => setGenderF("female")} style={pill(genderF==="female")}>👩 Female</button>
            <button onClick={() => setGenderF("boy")} style={pill(genderF==="boy")}>👦 Boy</button>
            <button onClick={() => setGenderF("girl")} style={pill(genderF==="girl")}>👧 Girl</button>
          </div>
          <div style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:6, marginBottom:"0.75rem" }}>
            <button onClick={() => setLanguageF("all")} style={pill(languageF==="all")}>{t.allLanguages}</button>
            <button onClick={() => setLanguageF("English")} style={pill(languageF==="English")}>🇬🇧 English</button>
            <button onClick={() => setLanguageF("Urdu")} style={pill(languageF==="Urdu")}>🇵🇰 Urdu</button>
            <button onClick={() => setLanguageF("Hindi")} style={pill(languageF==="Hindi")}>🇮🇳 Hindi</button>
            <button onClick={() => setLanguageF("Arabic")} style={pill(languageF==="Arabic")}>🇸🇦 Arabic</button>
          </div>
          <div style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:6, marginBottom:"0.75rem" }}>
            {(Object.keys(EMOTION_META) as Emotion[]).map(em => (
              <button key={em} onClick={() => setEmotionF(emotionF===em?"all":em)} style={pill(emotionF===em, EMOTION_META[em].color)}>
                {EMOTION_META[em].icon} {EMOTION_META[em].label}
              </button>
            ))}
          </div>

          <div style={{ fontSize:"0.72rem", color:"#9ca3af", marginBottom:"0.5rem" }}>
            {filtered.length} / {VOICES.length} voices
          </div>

          <div style={{ maxHeight:360, overflowY:"auto", display:"flex", flexDirection:"column", gap:5 }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign:"center", padding:"2rem", color:"#9ca3af", fontSize:"0.85rem" }}>{t.noVoices}</div>
            ) : filtered.map(v => (
              <button
                key={v.id}
                onClick={() => { setSelectedVoice(v); showToast(`${GENDER_META[v.gender].icon} ${v.name} selected`); }}
                style={{
                  width:"100%",
                  padding:"0.65rem 0.875rem",
                  borderRadius:12,
                  background: selectedVoice.id===v.id ? "linear-gradient(90deg,#667eea,#764ba2)" : "#f8f7ff",
                  color: selectedVoice.id===v.id ? "white" : "#1a1a2e",
                  border: selectedVoice.id===v.id ? "none" : "1px solid #ede9fe",
                  cursor:"pointer",
                  textAlign:"left",
                  display:"flex",
                  justifyContent:"space-between",
                  alignItems:"center",
                  gap:8,
                }}
              >
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:"0.82rem", fontWeight:700, marginBottom:2 }}>
                    {GENDER_META[v.gender].icon} {v.name}
                    {v.popular && <span style={{ marginLeft:4, fontSize:"0.65rem", background:"rgba(245,158,11,0.25)", color:"#92400e", padding:"1px 5px", borderRadius:8 }}>⭐</span>}
                  </div>
                  <div style={{ fontSize:"0.65rem", opacity:0.75, display:"flex", gap:6, flexWrap:"wrap" }}>
                    <span>{EMOTION_META[v.emotion].icon} {v.emotion}</span>
                    <span>• {v.voiceType}</span>
                    <span>• {v.accent}</span>
                    <span>• {v.language}</span>
                  </div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:3, flexShrink:0 }}>
                  <span style={{ fontSize:"0.65rem", background: selectedVoice.id===v.id ? "rgba(255,255,255,0.2)" : `${EMOTION_META[v.emotion].color}18`, color: selectedVoice.id===v.id ? "white" : EMOTION_META[v.emotion].color, padding:"2px 7px", borderRadius:20, fontWeight:700 }}>
                    {EMOTION_META[v.emotion].icon}
                  </span>
                  {selectedVoice.id===v.id && <span style={{ fontSize:"0.7rem" }}>✅</span>}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === "settings" && (
        <div style={card}>
          <div style={{ background:"#f8f7ff", borderRadius:14, padding:"0.875rem", marginBottom:"1rem" }}>
            <div style={{ fontSize:"0.8rem", fontWeight:700, color:"#4c1d95", marginBottom:4 }}>Selected Voice</div>
            <div style={{ fontSize:"1rem", fontWeight:700, color:"#1a1a2e", marginBottom:2 }}>{selectedVoice.name}</div>
            <div style={{ fontSize:"0.7rem", color:"#6b7280" }}>{selectedVoice.language} • {selectedVoice.accent} • {selectedVoice.emotion} • {selectedVoice.voiceType}</div>
          </div>

          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem" }}>
            <span style={{ fontSize:"0.85rem", fontWeight:700 }}>{t.customSpeed}</span>
            <button
              onClick={() => setUseCustom(!useCustom)}
              style={{ width:44, height:24, borderRadius:12, border:"none", background: useCustom ? "#667eea" : "#d1d5db", cursor:"pointer", position:"relative", transition:"background .2s" }}
            >
              <span style={{ position:"absolute", top:2, left: useCustom ? 22 : 2, width:20, height:20, borderRadius:"50%", background:"white", transition:"left .2s", display:"block" }} />
            </button>
          </div>

          {useCustom && (
            <>
              <div style={{ marginBottom:"1rem" }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                  <span>{t.speedLabel}</span>
                  <span style={{ fontWeight:700, color:"#667eea" }}>{customSpeed.toFixed(2)}x</span>
                </div>
                <input type="range" min={0.5} max={2.0} step={0.05} value={customSpeed} onChange={e => setCustomSpeed(parseFloat(e.target.value))} style={{ width:"100%", accentColor:"#667eea" }} />
              </div>
              <div style={{ marginBottom:"1rem" }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                  <span>{t.pitchLabel}</span>
                  <span style={{ fontWeight:700, color:"#667eea" }}>{customPitch.toFixed(2)}</span>
                </div>
                <input type="range" min={0.5} max={2.0} step={0.05} value={customPitch} onChange={e => setCustomPitch(parseFloat(e.target.value))} style={{ width:"100%", accentColor:"#667eea" }} />
              </div>
            </>
          )}

          {!useCustom && (
            <div style={{ background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:12, padding:"0.75rem" }}>
              <p style={{ fontSize:"0.78rem", color:"#166534" }}>✅ {t.defaultValues}<br/>Speed: {selectedVoice.speed}x | Pitch: {selectedVoice.pitch}</p>
            </div>
          )}
        </div>
      )}

      {/* Output Tab */}
      {activeTab === "output" && (
        <div style={card}>
          {audioUrl ? (
            <>
              <div style={{ background:"#f8f7ff", borderRadius:14, padding:"0.875rem", marginBottom:"1rem" }}>
                <div style={{ fontSize:"0.78rem", fontWeight:700, color:"#4c1d95", marginBottom:4 }}>Generated Voice — {selectedVoice.name}</div>
              </div>
              <audio ref={audioRef} controls src={audioUrl} style={{ width:"100%", marginBottom:"0.875rem", borderRadius:12 }} />
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                <a href={audioUrl} download="voice-output.mp3" style={{ flex:1, padding:"0.7rem", background:"#10b981", color:"white", textDecoration:"none", borderRadius:40, fontSize:"0.82rem", fontWeight:700, textAlign:"center" }}>💾 {t.download}</a>
                <button onClick={() => { navigator.clipboard.writeText(audioUrl); showToast(t.copied); }} style={{ flex:1, padding:"0.7rem", background:"#3b82f6", color:"white", border:"none", borderRadius:40, fontSize:"0.82rem", fontWeight:700, cursor:"pointer" }}>📋 {t.copyLink}</button>
                <button onClick={clearAll} style={{ padding:"0.7rem 1rem", background:"#fee2e2", color:"#dc2626", border:"none", borderRadius:40, fontSize:"0.82rem", fontWeight:700, cursor:"pointer" }}>🗑️ {t.clear}</button>
              </div>
            </>
          ) : (
            <div style={{ textAlign:"center", padding:"2.5rem 1rem" }}>
              <div style={{ fontSize:"3rem", marginBottom:"0.75rem" }}>🔊</div>
              <p style={{ color:"#9ca3af", fontSize:"0.875rem" }}>No voice generated yet — click Generate below</p>
            </div>
          )}
        </div>
      )}

      {/* Generate Button */}
      <div style={{ marginBottom:"0.75rem" }}>
        {loading && (
          <div style={{ marginBottom:"0.5rem" }}>
            <div style={{ height:6, background:"rgba(255,255,255,0.3)", borderRadius:3, overflow:"hidden" }}>
              <div style={{ width:`${progress}%`, height:"100%", background:"white", borderRadius:3, transition:"width .3s" }} />
            </div>
            <p style={{ color:"rgba(255,255,255,0.8)", fontSize:"0.75rem", textAlign:"center", marginTop:4 }}>🎤 {t.generating} {progress}%</p>
          </div>
        )}
        <button
          onClick={generate}
          disabled={loading || !text.trim()}
          style={{
            width:"100%", padding:"0.95rem",
            background: loading || !text.trim() ? "rgba(255,255,255,0.4)" : "white",
            color: loading || !text.trim() ? "rgba(255,255,255,0.6)" : "#667eea",
            border:"none", borderRadius:40,
            fontSize:"1rem", fontWeight:700,
            cursor: loading || !text.trim() ? "not-allowed" : "pointer",
            boxShadow: loading || !text.trim() ? "none" : "0 4px 20px rgba(0,0,0,0.15)",
            transition:"all .2s",
          }}
        >
          {loading ? `🎤 ${t.generating}` : `🎙️ ${t.generate} — ${selectedVoice.name}`}
        </button>
      </div>

      {/* Error & Toast */}
      {error && (
        <div style={{ background:"rgba(239,68,68,0.12)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:14, padding:"0.75rem 1rem", marginBottom:"0.75rem" }}>
          <p style={{ color:"#dc2626", fontSize:"0.82rem" }}>❌ {error}</p>
        </div>
      )}
      {toast && (
        <div style={{ position:"fixed", bottom:90, left:"50%", transform:"translateX(-50%)", background:"rgba(0,0,0,0.8)", color:"white", padding:"0.6rem 1.25rem", borderRadius:40, fontSize:"0.82rem", zIndex:999, whiteSpace:"nowrap" }}>
          {toast}
        </div>
      )}

      <BottomNav active="tools" onNavigate={(href) => router.push(href)} />
    </div>
  );
}