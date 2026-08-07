/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";

// ─── TYPES ────────────────────────────────────────────────────
type Style     = "cinematic" | "portrait" | "landscape" | "urban" | "abstract" | "fantasy" | "noir";
type Quality   = "standard" | "hd" | "ultra";
type Language  = "en" | "ur" | "hi" | "ar";
type Tab       = "story" | "scenes" | "gallery" | "tools";
type Provider  = "mock" | "huggingface" | "replicate";
type BgType    = "blur" | "white" | "green" | "remove" | "custom";
type Theme     = "dark" | "light" | "cinema";

interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  style: Style;
  quality: Quality;
  timestamp: number;
}

interface Scene {
  id: string;
  original: string;
  edited: string;
  isEditing: boolean;
  imageUrl?: string;
  isGenerating: boolean;
  videoUrl?: string;
  audioUrl?: string;
  isGeneratingVideo: boolean;
  isGeneratingAudio: boolean;
  processedImageUrl?: string;
  bgType?: BgType;
  liked: boolean;
}

// ─── TRANSLATIONS ────────────────────────────────────────────
const T = {
  en: {
    title: "🎬 Cinematic Studio",
    subtitle: "Transform your story into cinematic masterpieces",
    storyTab: "Story", scenesTab: "Scenes", galleryTab: "Gallery", toolsTab: "Tools",
    storyLabel: "Your Story", storyPlaceholder: "Write your story, describe your vision...",
    generate: "✨ Generate Cinematic Scenes",
    generating: "Crafting your scenes...",
    clear: "Clear", example: "Example Story",
    style: "Style", quality: "Quality", provider: "AI Provider",
    advanced: "Advanced Settings",
    genAllImages: "🎨 Generate All Images",
    genAllDone: "All done!",
    copyAll: "Copy All Prompts",
    exportJson: "Export JSON",
    scene: "Scene",
    edit: "Edit", save: "Save",
    genImage: "Generate Image",
    regen: "Regenerate",
    genVideo: "Make Video",
    genVoice: "Voiceover",
    download: "Download",
    copyUrl: "Copy URL",
    changeBg: "Change Background",
    applyBg: "Apply Effect",
    keepVersion: "Keep This",
    clearGallery: "Clear Gallery",
    noScenes: "No scenes yet. Write a story first!",
    noGallery: "No images yet. Generate some scenes!",
    chars: "characters",
    autoSaved: "Saved",
    copied: "Copied!",
    exported: "Exported!",
    errRequired: "Please write a story first",
    errShort: "Story needs at least 10 characters",
    videoReady: "Video ready! Opening...",
    voiceReady: "Voiceover ready!",
    bgChanged: "Background changed!",
    // Tools
    toolsTitle: "Quick Tools",
    bgRemover: "Background Remover",
    imageUpscale: "Image Upscaler",
    colorPalette: "Color Palette",
    fontPicker: "Font Picker",
    moodBoard: "Mood Board",
    scriptWriter: "Script Writer",
    voiceStudio: "Voice Studio",
    videoEditor: "Video Editor",
    youtubeScript: "YouTube Script",
    objectRemover: "Object Remover",
    imageRestorer: "Image Restorer",
    invoiceGenerator: "Invoice Generator",
    hashtagGenerator: "Hashtag Generator",
    jsonFormatter: "JSON Formatter",
    loanCalculator: "Loan Calculator",
    emiCalculator: "EMI Calculator",
    gpaCalculator: "GPA Calculator",
    tipCalculator: "Tip Calculator",
    nanoBananaProFree: "NANO BANANA PRO FREE",
    percentageCalculator: "Percentage Calculator",
    worldClock: "World Clock",
    scientificCalculator: "Scientific Calculator",
    graphingCalculator: "Graphing Calculator",
    statisticsCalculator: "Statistics Calculator",
    matrixCalculator: "Matrix Calculator",
    fractionCalculator: "Fraction Calculator",
    romanNumeralConverter: "Roman Numeral Converter",
    binaryConverter: "Binary Converter",
    asciiTable: "ASCII Table",
    regexTester: "Regex Tester",
    jwtDecoder: "JWT Decoder",
    urlEncoderDecoder: "URL Encoder/Decoder",
    base64EncoderDecoder: "Base64 Encoder/Decoder",
    pricing: "Pricing",
  },
  ur: {
    title: "🎬 سنیماٹک اسٹوڈیو",
    subtitle: "اپنی کہانی کو شاہکار بنائیں",
    storyTab: "کہانی", scenesTab: "مناظر", galleryTab: "گیلری", toolsTab: "ٹولز",
    storyLabel: "آپ کی کہانی", storyPlaceholder: "اپنی کہانی یہاں لکھیں...",
    generate: "✨ مناظر بنائیں",
    generating: "مناظر تیار ہو رہے ہیں...",
    clear: "صاف کریں", example: "مثال",
    style: "اسٹائل", quality: "کوالٹی", provider: "AI پرووائیڈر",
    advanced: "ایڈوانسڈ سیٹنگز",
    genAllImages: "🎨 تمام تصاویر",
    genAllDone: "مکمل!",
    copyAll: "سب کاپی",
    exportJson: "برآمد",
    scene: "منظر",
    edit: "ترمیم", save: "محفوظ",
    genImage: "تصویر بنائیں",
    regen: "دوبارہ",
    genVideo: "ویڈیو",
    genVoice: "آواز",
    download: "ڈاؤن لوڈ",
    copyUrl: "لنک کاپی",
    changeBg: "بیک گراؤنڈ",
    applyBg: "لگائیں",
    keepVersion: "رکھیں",
    clearGallery: "گیلری صاف",
    noScenes: "ابھی کوئی منظر نہیں",
    noGallery: "ابھی کوئی تصویر نہیں",
    chars: "حروف",
    autoSaved: "محفوظ",
    copied: "کاپی!",
    exported: "برآمد!",
    errRequired: "کہانی لکھیں",
    errShort: "کم از کم 10 حروف",
    videoReady: "ویڈیو تیار!",
    voiceReady: "آواز تیار!",
    bgChanged: "بیک گراؤنڈ بدل گیا!",
    toolsTitle: "فوری ٹولز",
    bgRemover: "بیک گراؤنڈ ہٹائیں",
    imageUpscale: "تصویر بڑی کریں",
    colorPalette: "رنگ منتخب کریں",
    fontPicker: "فونٹ منتخب کریں",
    moodBoard: "موڈ بورڈ",
    scriptWriter: "اسکرپٹ رائٹر",
    voiceStudio: "آواز اسٹوڈیو",
    videoEditor: "ویڈیو ایڈیٹر",
    youtubeScript: "YouTube Script",
    objectRemover: "Object Remover",
    imageRestorer: "Image Restorer",
    invoiceGenerator: "Invoice Generator",
    hashtagGenerator: "Hashtag Generator",
    jsonFormatter: "JSON Formatter",
    loanCalculator: "Loan Calculator",
    emiCalculator: "EMI Calculator",
    gpaCalculator: "GPA Calculator",
    tipCalculator: "Tip Calculator",
    nanoBananaProFree: "NANO BANANA PRO FREE",
    percentageCalculator: "Percentage Calculator",
    worldClock: "World Clock",
    scientificCalculator: "Scientific Calculator",
    graphingCalculator: "Graphing Calculator",
    statisticsCalculator: "Statistics Calculator",
    matrixCalculator: "Matrix Calculator",
    fractionCalculator: "Fraction Calculator",
    romanNumeralConverter: "Roman Numeral Converter",
    binaryConverter: "Binary Converter",
    asciiTable: "ASCII Table",
    regexTester: "Regex Tester",
    jwtDecoder: "JWT Decoder",
    urlEncoderDecoder: "URL Encoder/Decoder",
    base64EncoderDecoder: "Base64 Encoder/Decoder",
    pricing: "قیمتیں",
  },
  hi: {
    title: "🎬 सिनेमैटिक स्टूडियो",
    subtitle: "अपनी कहानी को मास्टरपीस बनाएं",
    storyTab: "कहानी", scenesTab: "दृश्य", galleryTab: "गैलरी", toolsTab: "टूल्स",
    storyLabel: "आपकी कहानी", storyPlaceholder: "अपनी कहानी लिखें...",
    generate: "✨ दृश्य बनाएं",
    generating: "दृश्य बन रहे हैं...",
    clear: "साफ़ करें", example: "उदाहरण",
    style: "शैली", quality: "गुणवत्ता", provider: "AI प्रदाता",
    advanced: "उन्नत सेटिंग्स",
    genAllImages: "🎨 सभी छवियाँ",
    genAllDone: "पूर्ण!",
    copyAll: "सब कॉपी करें",
    exportJson: "निर्यात",
    scene: "दृश्य",
    edit: "संपादित", save: "सहेजें",
    genImage: "छवि बनाएं",
    regen: "पुनः बनाएं",
    genVideo: "वीडियो",
    genVoice: "आवाज़",
    download: "डाउनलोड",
    copyUrl: "URL कॉपी",
    changeBg: "पृष्ठभूमि",
    applyBg: "लागू करें",
    keepVersion: "रखें",
    clearGallery: "गैलरी साफ़",
    noScenes: "अभी कोई दृश्य नहीं",
    noGallery: "अभी कोई छवि नहीं",
    chars: "अक्षर",
    autoSaved: "सहेजा",
    copied: "कॉपी!",
    exported: "निर्यात!",
    errRequired: "कहानी लिखें",
    errShort: "कम से कम 10 अक्षर",
    videoReady: "वीडियो तैयार!",
    voiceReady: "आवाज़ तैयार!",
    bgChanged: "पृष्ठभूमि बदली!",
    toolsTitle: "त्वरित टूल्स",
    bgRemover: "पृष्ठभूमि हटाएं",
    imageUpscale: "छवि बड़ी करें",
    colorPalette: "रंग चुनें",
    fontPicker: "फ़ॉन्ट चुनें",
    moodBoard: "मूड बोर्ड",
    scriptWriter: "स्क्रिप्ट लेखक",
    voiceStudio: "आवाज़ स्टूडियो",
    videoEditor: "वीडियो संपादक",
    youtubeScript: "YouTube Script",
    objectRemover: "Object Remover",
    imageRestorer: "Image Restorer",
    invoiceGenerator: "Invoice Generator",
    hashtagGenerator: "Hashtag Generator",
    jsonFormatter: "JSON Formatter",
    loanCalculator: "Loan Calculator",
    emiCalculator: "EMI Calculator",
    gpaCalculator: "GPA Calculator",
    tipCalculator: "Tip Calculator",
    nanoBananaProFree: "NANO BANANA PRO FREE",
    percentageCalculator: "Percentage Calculator",
    worldClock: "World Clock",
    scientificCalculator: "Scientific Calculator",
    graphingCalculator: "Graphing Calculator",
    statisticsCalculator: "Statistics Calculator",
    matrixCalculator: "Matrix Calculator",
    fractionCalculator: "Fraction Calculator",
    romanNumeralConverter: "Roman Numeral Converter",
    binaryConverter: "Binary Converter",
    asciiTable: "ASCII Table",
    regexTester: "Regex Tester",
    jwtDecoder: "JWT Decoder",
    urlEncoderDecoder: "URL Encoder/Decoder",
    base64EncoderDecoder: "Base64 Encoder/Decoder",
    pricing: "मूल्य",
  },
  ar: {
    title: "🎬 استوديو سينمائي",
    subtitle: "حوّل قصتك إلى تحفة فنية",
    storyTab: "القصة", scenesTab: "المشاهد", galleryTab: "المعرض", toolsTab: "الأدوات",
    storyLabel: "قصتك", storyPlaceholder: "اكتب قصتك هنا...",
    generate: "✨ إنشاء المشاهد",
    generating: "جاري الإنشاء...",
    clear: "مسح", example: "مثال",
    style: "النمط", quality: "الجودة", provider: "مزود الذكاء",
    advanced: "إعدادات متقدمة",
    genAllImages: "🎨 كل الصور",
    genAllDone: "اكتمل!",
    copyAll: "نسخ الكل",
    exportJson: "تصدير",
    scene: "مشهد",
    edit: "تحرير", save: "حفظ",
    genImage: "إنشاء صورة",
    regen: "إعادة",
    genVideo: "فيديو",
    genVoice: "صوت",
    download: "تحميل",
    copyUrl: "نسخ الرابط",
    changeBg: "الخلفية",
    applyBg: "تطبيق",
    keepVersion: "احتفظ",
    clearGallery: "مسح المعرض",
    noScenes: "لا مشاهد بعد",
    noGallery: "لا صور بعد",
    chars: "حرف",
    autoSaved: "محفوظ",
    copied: "تم النسخ!",
    exported: "تم التصدير!",
    errRequired: "اكتب قصة أولاً",
    errShort: "10 أحرف على الأقل",
    videoReady: "الفيديو جاهز!",
    voiceReady: "الصوت جاهز!",
    bgChanged: "تم تغيير الخلفية!",
    toolsTitle: "أدوات سريعة",
    bgRemover: "إزالة الخلفية",
    imageUpscale: "تكبير الصورة",
    colorPalette: "لوحة الألوان",
    fontPicker: "اختيار الخط",
    moodBoard: "لوحة المزاج",
    scriptWriter: "كاتب السيناريو",
    voiceStudio: "استوديو صوتي",
    videoEditor: "محرر فيديو",
    youtubeScript: "YouTube Script",
    objectRemover: "Object Remover",
    imageRestorer: "Image Restorer",
    invoiceGenerator: "Invoice Generator",
    hashtagGenerator: "Hashtag Generator",
    jsonFormatter: "JSON Formatter",
    loanCalculator: "Loan Calculator",
    emiCalculator: "EMI Calculator",
    gpaCalculator: "GPA Calculator",
    tipCalculator: "Tip Calculator",
    nanoBananaProFree: "NANO BANANA PRO FREE",
    percentageCalculator: "Percentage Calculator",
    worldClock: "World Clock",
    scientificCalculator: "Scientific Calculator",
    graphingCalculator: "Graphing Calculator",
    statisticsCalculator: "Statistics Calculator",
    matrixCalculator: "Matrix Calculator",
    fractionCalculator: "Fraction Calculator",
    romanNumeralConverter: "Roman Numeral Converter",
    binaryConverter: "Binary Converter",
    asciiTable: "ASCII Table",
    regexTester: "Regex Tester",
    jwtDecoder: "JWT Decoder",
    urlEncoderDecoder: "URL Encoder/Decoder",
    base64EncoderDecoder: "Base64 Encoder/Decoder",
    pricing: "الأسعار",
  },
};

type TranslationKey = keyof typeof T["en"];

const STYLES: { value: Style; label: string; icon: string; color: string }[] = [
  { value: "cinematic", label: "Cinematic",  icon: "🎬", color: "#667eea" },
  { value: "portrait",  label: "Portrait",   icon: "👤", color: "#f59e0b" },
  { value: "landscape", label: "Landscape",  icon: "🏔️", color: "#10b981" },
  { value: "urban",     label: "Urban",      icon: "🏙️", color: "#06b6d4" },
  { value: "abstract",  label: "Abstract",   icon: "🎨", color: "#8b5cf6" },
  { value: "fantasy",   label: "Fantasy",    icon: "🧙", color: "#ec4899" },
  { value: "noir",      label: "Noir",       icon: "🕵️", color: "#6b7280" },
];

const QUALITIES: { value: Quality; label: string; desc: string }[] = [
  { value: "standard", label: "Standard", desc: "Fast" },
  { value: "hd",       label: "HD",       desc: "Balanced" },
  { value: "ultra",    label: "Ultra",    desc: "Best" },
];

type QuickTool = {
  id: string;
  icon: string;
  key: TranslationKey;
  color: string;
  href: string;
};

const QUICK_TOOLS: QuickTool[] = [
  { id: "bg",      icon: "🖼️", key: "bgRemover",    color: "#06b6d4", href: "/tools/background" },
  { id: "upscale", icon: "🔍", key: "imageUpscale",  color: "#8b5cf6", href: "/tools/image-upscaler" },
  { id: "color",   icon: "🎨", key: "colorPalette",  color: "#f59e0b", href: "/tools/color-palette" },
  { id: "font",    icon: "🔤", key: "fontPicker",    color: "#10b981", href: "/tools/font-picker" },
  { id: "mood",    icon: "🎭", key: "moodBoard",     color: "#ec4899", href: "/tools/mood-board" },
  { id: "script",  icon: "📝", key: "scriptWriter",  color: "#ef4444", href: "/tools/script-writer" },
  { id: "voice",   icon: "🎤", key: "voiceStudio",   color: "#667eea", href: "/tools/voice" },
  { id: "video",   icon: "✂️", key: "videoEditor",   color: "#d97706", href: "/tools/video-editor" },
  { id: "youtube-script", icon: "📺", key: "youtubeScript", color: "#ef4444", href: "/tools/youtube-script" },
  { id: "object-remover", icon: "🗑️", key: "objectRemover", color: "#ef4444", href: "/tools/object-remover" },
  { id: "image-restorer", icon: "🖼️", key: "imageRestorer", color: "#10b981", href: "/tools/image-restorer" },
  { id: "invoice-generator", icon: "📄", key: "invoiceGenerator", color: "#10b981", href: "/tools/invoice-generator" },
  { id: "hashtag-generator", icon: "#️⃣", key: "hashtagGenerator", color: "#1da1f2", href: "/tools/hashtag-generator" },
  { id: "json-formatter", icon: "📋", key: "jsonFormatter", color: "#f59e0b", href: "/tools/json-formatter" },
  { id: "loan-calculator", icon: "💰", key: "loanCalculator", color: "#f97316", href: "/tools/loan-calculator" },
  { id: "emi-calculator", icon: "🏦", key: "emiCalculator", color: "#0284c7", href: "/tools/emi-calculator" },
  { id: "gpa-calculator", icon: "🎓", key: "gpaCalculator", color: "#8b5cf6", href: "/tools/gpa-calculator" },
  { id: "tip-calculator", icon: "💸", key: "tipCalculator", color: "#22c55e", href: "/tools/tip-calculator" },
  { id: "nano-banana-pro-free", icon: "🍌", key: "nanoBananaProFree", color: "#f59e0b", href: "/tools/nano-banana-pro-free" },
  { id: "percentage-calculator", icon: "%", key: "percentageCalculator", color: "#eab308", href: "/tools/percentage-calculator" },
  { id: "world-clock", icon: "🕒", key: "worldClock", color: "#0ea5e9", href: "/tools/world-clock" },
  { id: "scientific-calculator", icon: "🧮", key: "scientificCalculator", color: "#f97316", href: "/tools/scientific-calculator" },
  { id: "graphing-calculator", icon: "📈", key: "graphingCalculator", color: "#0284c7", href: "/tools/graphing-calculator" },
  { id: "statistics-calculator", icon: "📊", key: "statisticsCalculator", color: "#8b5cf6", href: "/tools/statistics-calculator" },
  { id: "matrix-calculator", icon: "🔢", key: "matrixCalculator", color: "#10b981", href: "/tools/matrix-calculator" },
  { id: "fraction-calculator", icon: "➗", key: "fractionCalculator", color: "#f59e0b", href: "/tools/fraction-calculator" },
  { id: "roman-numeral-converter", icon: "📜", key: "romanNumeralConverter", color: "#a855f7", href: "/tools/roman-numeral-converter" },
  { id: "binary-converter", icon: "💻", key: "binaryConverter", color: "#0ea5e9", href: "/tools/binary-converter" },
  { id: "ascii-table", icon: "🔤", key: "asciiTable", color: "#fbbf24", href: "/tools/ascii-table" },
  { id: "regex-tester", icon: "🔎", key: "regexTester", color: "#ef4444", href: "/tools/regex-tester" },
  { id: "jwt-decoder", icon: "🔐", key: "jwtDecoder", color: "#14b8a6", href: "/tools/jwt-decoder" },
  { id: "url-encoder-decoder", icon: "🔗", key: "urlEncoderDecoder", color: "#38bdf8", href: "/tools/url-encoder-decoder" },
  { id: "base64-encoder-decoder", icon: "🧾", key: "base64EncoderDecoder", color: "#f97316", href: "/tools/base64-encoder-decoder" },
];

// ─── CSS-IN-JS HELPERS ────────────────────────────────────────
const THEMES = {
  dark: {
    bg:        "#08070f",
    surface:   "#13111e",
    card:      "#1a1730",
    border:    "rgba(255,255,255,0.07)",
    text:      "#f0eeff",
    subtext:   "#7b78a0",
    accent:    "#7c5df6",
    accentGlow:"rgba(124,93,246,0.35)",
    input:     "#0f0d1a",
    glass:     "rgba(26,23,48,0.85)",
  },
  light: {
    bg:        "#f4f3ff",
    surface:   "#ffffff",
    card:      "#faf9ff",
    border:    "rgba(0,0,0,0.07)",
    text:      "#1a1a2e",
    subtext:   "#6b6880",
    accent:    "#5b3de8",
    accentGlow:"rgba(91,61,232,0.2)",
    input:     "#ffffff",
    glass:     "rgba(255,255,255,0.9)",
  },
  cinema: {
    bg:        "#0d0a00",
    surface:   "#1a1400",
    card:      "#211a00",
    border:    "rgba(255,200,0,0.1)",
    text:      "#fff8e0",
    subtext:   "#9a8a50",
    accent:    "#d4a017",
    accentGlow:"rgba(212,160,23,0.3)",
    input:     "#150f00",
    glass:     "rgba(33,26,0,0.9)",
  },
};

// ─── MAIN PAGE ─────────────────────────────────────────────────
export default function CinematicStudioPage() {
  const router = useRouter();
  const [story,      setStory]      = useState<string>("");
  const [scenes,     setScenes]     = useState<Scene[]>([]);
  const [gallery,    setGallery]    = useState<GeneratedImage[]>([]);
  const [loading,    setLoading]    = useState(false);
  const [genAll,     setGenAll]     = useState(false);
  const [progress,   setProgress]   = useState({ current: 0, total: 0 });
  const [error,      setError]      = useState("");
  const [success,    setSuccess]    = useState("");
  const [activeTab,  setActiveTab]  = useState<Tab>("story");
  const [lang,       setLang]       = useState<Language>("en");
  const [theme,      setTheme]      = useState<Theme>("dark");
  const [style,      setStyle]      = useState<Style>("cinematic");
  const [quality,    setQuality]    = useState<Quality>("hd");
  const [provider,   setProvider]   = useState<Provider>("mock");
  const [advanced,   setAdvanced]   = useState(false);
  const [preview,    setPreview]    = useState<string | null>(null);
  const [bgPanel,    setBgPanel]    = useState<string | null>(null);
  const [bgType,     setBgType]     = useState<BgType>("blur");
  const [bgUrl,      setBgUrl]      = useState("");
  const [autoSaved,  setAutoSaved]  = useState(false);
  const [copied,     setCopied]     = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [mounted, setMounted] = useState(false);
  // Setting `mounted` on client mount is intentional to avoid SSR/CSR mismatches.
  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(id);
  }, []);

  const t  = T[lang];
  const th = THEMES[theme];
  const isRtl = lang === "ur" || lang === "ar";

  // ── PERSIST ───────────────────────────────────────────────
  useEffect(() => { localStorage.setItem("cs_lang", lang); }, [lang]);
  useEffect(() => { localStorage.setItem("cs_theme", theme); }, [theme]);
  useEffect(() => {
    if (!story) return;
    const id = setTimeout(() => {
      localStorage.setItem("cs_story", story);
      setAutoSaved(true);
      setTimeout(() => setAutoSaved(false), 1500);
    }, 800);
    return () => clearTimeout(id);
  }, [story]);
  useEffect(() => {
    localStorage.setItem("cs_gallery", JSON.stringify(gallery.slice(0, 50)));
  }, [gallery]);

  // Restore client-only state after mount to avoid hydration mismatch.
  useEffect(() => {
    if (!mounted) return;
    const id = setTimeout(() => {
      try {
        const saved = localStorage.getItem("cs_story");
        if (saved) setStory(saved);
      } catch {}
      try {
        const g = localStorage.getItem("cs_gallery");
        if (g) setGallery(JSON.parse(g));
      } catch {}
      try {
        const l = localStorage.getItem("cs_lang") as Language | null;
        if (l) setLang(l);
      } catch {}
      try {
        const thm = localStorage.getItem("cs_theme") as Theme | null;
        if (thm) setTheme(thm);
      } catch {}
    }, 0);
    return () => clearTimeout(id);
  }, [mounted]);

  // ── NOTIFICATIONS ────────────────────────────────────────
  const showSuccess = (msg: string) => { setSuccess(msg); setError(""); setTimeout(() => setSuccess(""), 3000); };
  const showError   = (msg: string) => { setError(msg);   setSuccess(""); setTimeout(() => setError(""),   4000); };
  const showCopied  = () => { setCopied(true); setTimeout(() => setCopied(false), 2000); };

  // ── API CALLS ────────────────────────────────────────────
  const generateScenes = async () => {
    if (!story.trim())      { showError(t.errRequired); return; }
    if (story.length < 10)  { showError(t.errShort);    return; }
    setLoading(true); setError(""); setScenes([]); setActiveTab("scenes");
    try {
      const res  = await fetch("/api/prompts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ story }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      const list: Scene[] = (data.result || []).map((txt: string, i: number) => ({
        id: `scene-${Date.now()}-${i}`,
        original: txt, edited: txt, isEditing: false,
        isGenerating: false, isGeneratingVideo: false,
        isGeneratingAudio: false, liked: false,
      }));
      setScenes(list);
      showSuccess(`✨ ${list.length} scenes created!`);
    } catch (error) { const message = error instanceof Error ? error.message : String(error); showError(message); }
    finally { setLoading(false); }
  };

  const generateImage = useCallback(async (sceneId: string, prompt: string) => {
    setScenes(p => p.map(s => s.id === sceneId ? { ...s, isGenerating: true } : s));
    try {
      const res  = await fetch("/api/image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, style, quality, provider }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Image failed");
      const imgEntry: GeneratedImage = {
        id: `${Date.now()}`, url: data.image, prompt,
        style, quality, timestamp: Date.now(),
      };
      setGallery(p => [imgEntry, ...p]);
      setScenes(p => p.map(s => s.id === sceneId
        ? { ...s, imageUrl: data.image, isGenerating: false } : s));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      showError(message);
      setScenes(p => p.map(s => s.id === sceneId ? { ...s, isGenerating: false } : s));
    }
  }, [style, quality, provider]);

  const generateAllImages = async () => {
    setGenAll(true);
    const pending = scenes.filter(s => !s.imageUrl);
    setProgress({ current: 0, total: pending.length });
    for (let i = 0; i < pending.length; i++) {
      setProgress({ current: i + 1, total: pending.length });
      await generateImage(pending[i].id, pending[i].edited);
      await new Promise(r => setTimeout(r, 400));
    }
    setGenAll(false);
    showSuccess(`🎉 ${t.genAllDone}`);
  };

  const generateVideo = async (sceneId: string, imageUrl: string, prompt: string) => {
    setScenes(p => p.map(s => s.id === sceneId ? { ...s, isGeneratingVideo: true } : s));
    try {
      const res  = await fetch("/api/video", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageUrl, prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Video failed");
      setScenes(p => p.map(s => s.id === sceneId
        ? { ...s, videoUrl: data.video, isGeneratingVideo: false } : s));
      showSuccess(t.videoReady);
      if (data.video) window.open(data.video, "_blank");
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      showError(message);
      setScenes(p => p.map(s => s.id === sceneId ? { ...s, isGeneratingVideo: false } : s));
    }
  };

  const generateVoice = async (sceneId: string, text: string) => {
    setScenes(p => p.map(s => s.id === sceneId ? { ...s, isGeneratingAudio: true } : s));
    try {
      const res  = await fetch("/api/voice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voice: "en-US-Jenny" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Voice failed");
      setScenes(p => p.map(s => s.id === sceneId
        ? { ...s, audioUrl: data.audio, isGeneratingAudio: false } : s));
      showSuccess(t.voiceReady);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      showError(message);
      setScenes(p => p.map(s => s.id === sceneId ? { ...s, isGeneratingAudio: false } : s));
    }
  };

  const applyBackground = async (sceneId: string, imageUrl: string) => {
    try {
      const res  = await fetch("/api/background", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageUrl, backgroundType: bgType, customImageUrl: bgUrl }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "BG failed");
      setScenes(p => p.map(s => s.id === sceneId
        ? { ...s, processedImageUrl: data.processed } : s));
      showSuccess(t.bgChanged);
    } catch (error) { const message = error instanceof Error ? error.message : String(error); showError(message); }
  };

  const keepProcessed = (sceneId: string) => {
    setScenes(p => p.map(s => s.id === sceneId && s.processedImageUrl
      ? { ...s, imageUrl: s.processedImageUrl, processedImageUrl: undefined } : s));
    setBgPanel(null);
  };

  const copyAll = async () => {
    await navigator.clipboard.writeText(scenes.map((s, i) => `${i + 1}. ${s.edited}`).join("\n\n"));
    showCopied();
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify({ story, scenes: scenes.map(s => s.edited), gallery, settings: { style, quality, provider } }, null, 2)], { type: "application/json" });
    const a    = Object.assign(document.createElement("a"), { href: URL.createObjectURL(blob), download: `cinematic-${Date.now()}.json` });
    a.click(); URL.revokeObjectURL(a.href);
    showSuccess(t.exported);
  };

  // ─── RENDER HELPERS ─────────────────────────────────────

  // Btn styles
  const btn = (bg: string, small = false) => ({
    padding:      small ? "4px 12px" : "8px 18px",
    background:   bg,
    color:        "#fff",
    border:       "none",
    borderRadius: 40,
    fontSize:     small ? "0.65rem" : "0.75rem",
    fontWeight:   600,
    cursor:       "pointer",
    whiteSpace:   "nowrap" as const,
    display:      "inline-flex",
    alignItems:   "center",
    gap:          4,
    transition:   "opacity .15s",
  } as React.CSSProperties);

  const card = {
    background:   th.card,
    border:       `1px solid ${th.border}`,
    borderRadius: 20,
    padding:      "1.25rem",
  } as React.CSSProperties;

  // ─── SCENE CARD ──────────────────────────────────────────
  const SceneCard = ({ scene, index }: { scene: Scene; index: number }) => {
    const [localText, setLocalText] = useState(scene.edited);
    return (
      <div style={{ ...card, marginBottom: 12, overflow: "hidden", direction: isRtl ? "rtl" : "ltr" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <span style={{ background: th.accent, color: "#fff", padding: "3px 12px", borderRadius: 20, fontSize: "0.65rem", fontWeight: 700 }}>
            {t.scene} {index + 1}
          </span>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {/* Like */}
            <button
              onClick={() => setScenes(p => p.map(s => s.id === scene.id ? { ...s, liked: !s.liked } : s))}
              style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1rem", opacity: scene.liked ? 1 : 0.4 }}
            >❤️</button>
            {/* Edit / Save */}
            <button
              style={btn("#f59e0b", true)}
              onClick={() => {
                if (scene.isEditing) {
                  setScenes(p => p.map(s => s.id === scene.id ? { ...s, edited: localText, isEditing: false } : s));
                } else {
                  setScenes(p => p.map(s => s.id === scene.id ? { ...s, isEditing: true } : s));
                }
              }}
            >{scene.isEditing ? `💾 ${t.save}` : `✏️ ${t.edit}`}</button>
          </div>
        </div>

        {/* Prompt text */}
        {scene.isEditing ? (
          <textarea
            value={localText}
            onChange={e => setLocalText(e.target.value)}
            rows={3}
            style={{
              width: "100%", padding: "0.75rem", borderRadius: 12,
              background: th.input, color: th.text,
              border: `1px solid ${th.border}`, fontSize: "0.85rem",
              fontFamily: "inherit", resize: "vertical",
            }}
          />
        ) : (
          <p style={{ color: th.text, fontSize: "0.85rem", lineHeight: 1.7, margin: "0 0 12px" }}>
            {scene.edited}
          </p>
        )}

        {/* Action row */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
          <button style={btn(th.accent)} disabled={scene.isGenerating}
            onClick={() => generateImage(scene.id, scene.edited)}>
            {scene.isGenerating ? "⏳" : "🖼️"} {t.genImage}
          </button>
          {scene.imageUrl && <>
            <button style={btn("#10b981", true)} disabled={scene.isGenerating}
              onClick={() => generateImage(scene.id, scene.edited)}>
              🔄 {t.regen}
            </button>
            <button style={btn("#ef4444", true)} disabled={scene.isGeneratingVideo}
              onClick={() => generateVideo(scene.id, scene.imageUrl!, scene.edited)}>
              {scene.isGeneratingVideo ? "⏳" : "🎬"} {t.genVideo}
            </button>
            <button style={btn("#8b5cf6", true)} disabled={scene.isGeneratingAudio}
              onClick={() => generateVoice(scene.id, scene.edited)}>
              {scene.isGeneratingAudio ? "⏳" : "🎤"} {t.genVoice}
            </button>
            <button style={btn("#06b6d4", true)}
              onClick={() => setBgPanel(bgPanel === scene.id ? null : scene.id)}>
              🎨 {t.changeBg}
            </button>
          </>}
        </div>

        {/* Image display */}
        {scene.isGenerating && (
          <div style={{ height: 180, background: th.surface, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", color: th.subtext, fontSize: "0.8rem" }}>
            <span style={{ animation: "spin 1s linear infinite", display: "inline-block", marginRight: 8 }}>⏳</span>
            Generating...
          </div>
        )}
        {scene.imageUrl && !scene.isGenerating && (
          <div>
            <img
              src={scene.imageUrl}
              alt={`Scene ${index + 1}`}
              onClick={() => setPreview(scene.imageUrl!)}
              style={{ width: "100%", maxWidth: 480, borderRadius: 12, cursor: "zoom-in", display: "block" }}
            />
            {/* Image actions */}
            <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
              <a href={scene.imageUrl} download style={{ ...btn("#10b981", true), textDecoration: "none" }}>
                💾 {t.download}
              </a>
              <button style={btn("#3b82f6", true)}
                onClick={() => { navigator.clipboard.writeText(scene.imageUrl!); showCopied(); }}>
                📋 {t.copyUrl}
              </button>
            </div>
          </div>
        )}

        {/* Audio player */}
        {scene.audioUrl && (
          <div style={{ marginTop: 10 }}>
            <audio controls src={scene.audioUrl} style={{ width: "100%", maxWidth: 340, height: 36 }} />
          </div>
        )}

        {/* BG panel */}
        {bgPanel === scene.id && scene.imageUrl && (
          <div style={{ marginTop: 12, padding: "1rem", background: th.surface, borderRadius: 14, border: `1px solid ${th.border}` }}>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
              {(["blur","white","green","remove","custom"] as BgType[]).map(t2 => (
                <button key={t2} onClick={() => setBgType(t2)}
                  style={{ ...btn(bgType === t2 ? th.accent : th.border, true), color: bgType === t2 ? "#fff" : th.text }}>
                  {t2 === "blur" ? "🌫️ Blur" : t2 === "white" ? "⬜ White" : t2 === "green" ? "🟢 Green" : t2 === "remove" ? "✨ Remove" : "🖼️ Custom"}
                </button>
              ))}
            </div>
            {bgType === "custom" && (
              <input type="text" placeholder="Background image URL..."
                value={bgUrl} onChange={e => setBgUrl(e.target.value)}
                style={{ width: "100%", padding: "8px 12px", borderRadius: 10, background: th.input, color: th.text, border: `1px solid ${th.border}`, marginBottom: 8, fontSize: "0.8rem" }} />
            )}
            <button style={{ ...btn(th.accent), width: "100%", justifyContent: "center" }}
              onClick={() => applyBackground(scene.id, scene.imageUrl!)}>
              {t.applyBg}
            </button>
            {scene.processedImageUrl && (
              <div style={{ marginTop: 10 }}>
                <img src={scene.processedImageUrl} alt="Processed" style={{ width: "100%", borderRadius: 10, maxWidth: 480 }} />
                <button style={{ ...btn("#10b981"), marginTop: 8 }} onClick={() => keepProcessed(scene.id)}>
                  ✅ {t.keepVersion}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  // ─── MAIN RENDER ─────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: th.bg, color: th.text, fontFamily: "'Tajawal', 'Noto Nastaliq Urdu', system-ui, sans-serif", direction: isRtl ? "rtl" : "ltr", transition: "background .3s, color .3s" }}>

      {/* BG GLOW */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
        background: `radial-gradient(ellipse at 15% 40%, ${th.accentGlow} 0%, transparent 55%),
                     radial-gradient(ellipse at 85% 70%, ${th.accentGlow}80 0%, transparent 50%)` }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 900, margin: "0 auto", padding: "1.5rem 1rem 5rem" }}>

        {/* ── TOP BAR ─────────────────────────────────── */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 10, marginBottom: "1.5rem",
          background: th.glass, backdropFilter: "blur(14px)", borderRadius: 50,
          padding: "8px 16px", border: `1px solid ${th.border}` }}>

          {/* Lang pills */}
          <div style={{ display: "flex", gap: 4 }}>
            {(["en","ur","hi","ar"] as Language[]).map(l => (
              <button key={l} onClick={() => setLang(l)}
                style={{ padding: "4px 10px", borderRadius: 30, fontSize: "0.65rem", fontWeight: 700, cursor: "pointer", border: "none",
                  background: lang === l ? th.accent : "transparent", color: lang === l ? "#fff" : th.subtext }}>
                {l === "en" ? "🇬🇧" : l === "ur" ? "🇵🇰" : l === "hi" ? "🇮🇳" : "🇸🇦"} {l.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Theme + autosave */}
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            {autoSaved && <span style={{ fontSize: "0.6rem", color: "#22c55e" }}>💾 {t.autoSaved}</span>}
            {(["dark","light","cinema"] as Theme[]).map(th2 => (
              <button key={th2} onClick={() => setTheme(th2)}
                style={{ padding: "4px 10px", borderRadius: 30, fontSize: "0.65rem", cursor: "pointer", border: "none",
                  background: theme === th2 ? THEMES[th2].accent : "transparent",
                  color: theme === th2 ? "#fff" : th.subtext }}>
                {th2 === "dark" ? "🌙" : th2 === "light" ? "☀️" : "🎬"}
              </button>
            ))}
          </div>
        </div>

        {/* ── HERO ────────────────────────────────────── */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <h1 style={{ fontSize: "clamp(1.8rem,5vw,3rem)", fontWeight: 900, margin: "0 0 6px",
            background: `linear-gradient(135deg, ${th.accent}, #c084fc)`,
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            {t.title}
          </h1>
          <p style={{ color: th.subtext, fontSize: "0.9rem" }}>{t.subtitle}</p>
          <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap", marginTop: 14 }}>
            <button onClick={() => router.push("/pricing")}
              style={{ ...btn(th.accent), borderRadius: 999, fontSize: "0.75rem" }}>
              💳 {t.pricing}
            </button>
            <button onClick={() => router.push("/ai-tools")}
              style={{ ...btn(th.surface), color: th.text, border: `1px solid ${th.border}`, borderRadius: 999, fontSize: "0.75rem" }}>
              ✨ AI Tools
            </button>
          </div>
        </div>

        {/* ── TABS ────────────────────────────────────── */}
        <div style={{ display: "flex", gap: 2, marginBottom: "1.5rem", background: th.surface, borderRadius: 14, padding: 4, border: `1px solid ${th.border}` }}>
          {([
            { key: "story",   label: t.storyTab,   icon: "📖" },
            { key: "scenes",  label: t.scenesTab,  icon: "🎬", count: scenes.length },
            { key: "gallery", label: t.galleryTab, icon: "🖼️", count: gallery.length },
            { key: "tools",   label: t.toolsTab,   icon: "🛠️" },
          ] as { key: Tab; label: string; icon: string; count?: number }[]).map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              style={{ flex: 1, padding: "8px 4px", border: "none", borderRadius: 10, cursor: "pointer", fontSize: "0.75rem", fontWeight: 700, transition: "all .2s", display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                background: activeTab === tab.key ? th.accent : "transparent",
                color:      activeTab === tab.key ? "#fff" : th.subtext }}>
              {tab.icon} {tab.label}
              {mounted && tab.count ? <span style={{ background: activeTab === tab.key ? "rgba(255,255,255,0.25)" : th.accentGlow, color: activeTab === tab.key ? "#fff" : th.accent, borderRadius: 20, padding: "1px 7px", fontSize: "0.6rem" }}>{tab.count}</span> : null}
            </button>
          ))}
        </div>

        {/* ════════════════════════════════════════════
            TAB: STORY
        ════════════════════════════════════════════ */}
        {activeTab === "story" && (
          <div style={card}>
            <label style={{ fontWeight: 700, fontSize: "0.85rem", display: "block", marginBottom: 8, color: th.subtext }}>
              📖 {t.storyLabel}
            </label>
            <textarea
              ref={textareaRef}
              value={story}
              onChange={e => setStory(e.target.value.slice(0, 5000))}
              placeholder={t.storyPlaceholder}
              rows={8}
              style={{ width: "100%", padding: "1rem", borderRadius: 14, background: th.input, color: th.text,
                border: `1px solid ${th.border}`, fontSize: "0.9rem", fontFamily: "inherit",
                resize: "vertical", lineHeight: 1.7, outline: "none",
                direction: isRtl ? "rtl" : "ltr" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, flexWrap: "wrap", gap: 8 }}>
              <span style={{ fontSize: "0.7rem", color: th.subtext }}>{mounted ? `${story.length} / 5000 ${t.chars}` : `0 / 5000 ${t.chars}`}</span>
              <div style={{ display: "flex", gap: 6 }}>
                <button style={btn("#8b5cf6", true)} onClick={() => setStory("A poor woodcutter stands near a river, holding his axe. A goddess emerges from the water and offers him a golden axe, but he asks for his own. She rewards his honesty with both.")}>
                  📖 {t.example}
                </button>
                <button style={btn("#ef4444", true)} onClick={() => { setStory(""); setScenes([]); localStorage.removeItem("cs_story"); }}>
                  🗑️ {t.clear}
                </button>
              </div>
            </div>

            {/* Advanced toggle */}
            <div style={{ marginTop: 16, borderTop: `1px solid ${th.border}`, paddingTop: 14 }}>
              <button onClick={() => setAdvanced(p => !p)}
                style={{ background: "none", border: "none", color: th.subtext, cursor: "pointer", fontSize: "0.8rem", fontWeight: 600, display: "flex", alignItems: "center", gap: 6 }}>
                ⚙️ {t.advanced} {advanced ? "▲" : "▼"}
              </button>
              {advanced && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 12 }}>
                  {/* Style */}
                  <div>
                    <div style={{ fontSize: "0.7rem", color: th.subtext, marginBottom: 4 }}>{t.style}</div>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {STYLES.map(s => (
                        <button key={s.value} onClick={() => setStyle(s.value)}
                          style={{ padding: "4px 10px", borderRadius: 20, fontSize: "0.65rem", cursor: "pointer", border: `1.5px solid ${style === s.value ? s.color : th.border}`,
                            background: style === s.value ? s.color + "20" : "transparent",
                            color: style === s.value ? s.color : th.subtext, fontWeight: style === s.value ? 700 : 400 }}>
                          {s.icon} {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Quality */}
                  <div>
                    <div style={{ fontSize: "0.7rem", color: th.subtext, marginBottom: 4 }}>{t.quality}</div>
                    <div style={{ display: "flex", gap: 4 }}>
                      {QUALITIES.map(q => (
                        <button key={q.value} onClick={() => setQuality(q.value)}
                          style={{ padding: "4px 10px", borderRadius: 20, fontSize: "0.65rem", cursor: "pointer", border: `1.5px solid ${quality === q.value ? th.accent : th.border}`,
                            background: quality === q.value ? th.accent + "20" : "transparent",
                            color: quality === q.value ? th.accent : th.subtext, fontWeight: quality === q.value ? 700 : 400 }}>
                          {q.label} <span style={{ opacity: 0.6 }}>({q.desc})</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Provider */}
                  <div>
                    <div style={{ fontSize: "0.7rem", color: th.subtext, marginBottom: 4 }}>{t.provider}</div>
                    <select value={provider} onChange={e => setProvider(e.target.value as Provider)}
                      style={{ padding: "6px 12px", borderRadius: 10, background: th.input, color: th.text, border: `1px solid ${th.border}`, fontSize: "0.75rem" }}>
                      <option value="mock">🎭 Mock (Fast)</option>
                      <option value="huggingface">🤗 HuggingFace (Free)</option>
                      <option value="replicate">⚡ Replicate (Best)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Generate button */}
            <button onClick={generateScenes} disabled={loading}
              style={{ width: "100%", padding: "1rem", marginTop: 16, borderRadius: 50, border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.65 : 1, fontSize: "1rem", fontWeight: 800,
                background: `linear-gradient(135deg, ${th.accent} 0%, #c084fc 100%)`, color: "#fff",
                boxShadow: `0 6px 24px ${th.accentGlow}`, transition: "all .2s" }}>
              {loading ? `⏳ ${t.generating}` : t.generate}
            </button>
          </div>
        )}

        {/* ════════════════════════════════════════════
            TAB: SCENES
        ════════════════════════════════════════════ */}
        {activeTab === "scenes" && (
          <div>
            {scenes.length > 0 ? (
              <>
                {/* Toolbar */}
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 16, alignItems: "center" }}>
                  <button style={btn("#10b981")} onClick={generateAllImages} disabled={genAll}>
                    {genAll ? `⏳ ${progress.current}/${progress.total}` : t.genAllImages}
                  </button>
                  <button style={btn("#3b82f6")} onClick={copyAll}>{t.copyAll}</button>
                  <button style={btn("#8b5cf6")} onClick={exportJson}>{t.exportJson}</button>
                  {/* Progress bar */}
                  {genAll && (
                    <div style={{ flex: 1, minWidth: 120, height: 6, background: th.border, borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ width: `${(progress.current / progress.total) * 100}%`, height: "100%", background: `linear-gradient(90deg, ${th.accent}, #c084fc)`, transition: "width .3s" }} />
                    </div>
                  )}
                </div>
                {scenes.map((scene, i) => <SceneCard key={scene.id} scene={scene} index={i} />)}
              </>
            ) : (
              <div style={{ ...card, textAlign: "center", padding: "3rem" }}>
                <div style={{ fontSize: "3rem", marginBottom: 12 }}>🎬</div>
                <p style={{ color: th.subtext }}>{t.noScenes}</p>
                <button style={{ ...btn(th.accent), marginTop: 12 }} onClick={() => setActiveTab("story")}>
                  📖 {t.storyTab}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════════
            TAB: GALLERY
        ════════════════════════════════════════════ */}
        {activeTab === "gallery" && (
          <div>
            {gallery.length > 0 ? (
              <>
                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
                  <button style={btn("#ef4444", true)} onClick={() => { setGallery([]); localStorage.removeItem("cs_gallery"); showSuccess("Gallery cleared!"); }}>
                    🗑️ {t.clearGallery}
                  </button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
                  {gallery.map((img, i) => (
                    <div key={img.id} style={{ ...card, padding: 0, overflow: "hidden" }}>
                      <img src={img.url} alt={`Gallery ${i + 1}`} onClick={() => setPreview(img.url)}
                        style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", cursor: "zoom-in", display: "block" }} />
                      <div style={{ padding: "0.75rem" }}>
                        <div style={{ display: "flex", gap: 5, marginBottom: 6 }}>
                          <span style={{ fontSize: "0.6rem", background: th.accent + "20", color: th.accent, padding: "2px 8px", borderRadius: 20 }}>{img.style}</span>
                          <span style={{ fontSize: "0.6rem", background: "#8b5cf620", color: "#8b5cf6", padding: "2px 8px", borderRadius: 20 }}>{img.quality}</span>
                        </div>
                        <p style={{ fontSize: "0.65rem", color: th.subtext, margin: "0 0 8px", lineHeight: 1.5 }}>
                          {img.prompt.slice(0, 72)}…
                        </p>
                        <div style={{ display: "flex", gap: 6 }}>
                          <a href={img.url} download style={{ ...btn("#10b981", true), textDecoration: "none" }}>💾</a>
                          <button style={btn("#3b82f6", true)} onClick={() => { navigator.clipboard.writeText(img.url); showCopied(); }}>📋</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div style={{ ...card, textAlign: "center", padding: "3rem" }}>
                <div style={{ fontSize: "3rem", marginBottom: 12 }}>🖼️</div>
                <p style={{ color: th.subtext }}>{t.noGallery}</p>
                <button style={{ ...btn(th.accent), marginTop: 12 }} onClick={() => setActiveTab("scenes")}>
                  🎬 {t.scenesTab}
                </button>
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════════
            TAB: TOOLS
        ════════════════════════════════════════════ */}
        {activeTab === "tools" && (
          <div>
            <p style={{ color: th.subtext, fontSize: "0.8rem", marginBottom: 14 }}>🛠️ {t.toolsTitle}</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 10 }}>
              {QUICK_TOOLS.map(tool => (
                <a key={tool.id} href={tool.href}
                  style={{ ...card, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, padding: "1.25rem 0.75rem", textDecoration: "none", cursor: "pointer", transition: "transform .15s, box-shadow .15s", textAlign: "center" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)"; (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px ${tool.color}30`; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "none"; (e.currentTarget as HTMLElement).style.boxShadow = "none"; }}>
                  <div style={{ width: 44, height: 44, borderRadius: 14, background: tool.color + "20", border: `1.5px solid ${tool.color}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.4rem" }}>
                    {tool.icon}
                  </div>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: th.text, lineHeight: 1.4 }}>
                    {t[tool.key]}
                  </span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* ── NOTIFICATIONS ──────────────────────────── */}
        {error   && <div style={{ marginTop: 16, padding: "10px 16px", background: "#ef444418", borderLeft: "4px solid #ef4444", borderRadius: 10, color: "#ef4444", fontSize: "0.8rem" }}>❌ {error}</div>}
        {success && <div style={{ marginTop: 16, padding: "10px 16px", background: "#22c55e18", borderLeft: "4px solid #22c55e", borderRadius: 10, color: "#22c55e", fontSize: "0.8rem" }}>✅ {success}</div>}
        {copied  && <div style={{ position: "fixed", bottom: 80, left: "50%", transform: "translateX(-50%)", background: "#1a1730", color: "#a78bfa", border: "1px solid #7c5df640", padding: "8px 20px", borderRadius: 30, fontSize: "0.75rem", fontWeight: 700, zIndex: 999 }}>📋 {t.copied}</div>}

        {/* ── LOADING SKELETONS ───────────────────────── */}
        {loading && (
          <div style={{ marginTop: 20 }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ ...card, marginBottom: 10, opacity: 0.5 + i * 0.1 }}>
                <div style={{ height: 14, width: "60%", background: th.border, borderRadius: 8, marginBottom: 10, animation: "pulse 1.4s ease-in-out infinite" }} />
                <div style={{ height: 10, width: "90%", background: th.border, borderRadius: 8, marginBottom: 6,  animation: "pulse 1.4s ease-in-out infinite .1s" }} />
                <div style={{ height: 10, width: "75%", background: th.border, borderRadius: 8,                   animation: "pulse 1.4s ease-in-out infinite .2s" }} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── IMAGE PREVIEW MODAL ──────────────────────── */}
      {preview && (
        <div onClick={() => setPreview(null)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 1000,
            display: "flex", alignItems: "center", justifyContent: "center", cursor: "zoom-out" }}>
          <img src={preview} alt="Preview"
            style={{ maxWidth: "90vw", maxHeight: "90vh", borderRadius: 16, boxShadow: "0 0 60px rgba(0,0,0,0.8)" }} />
          <button onClick={() => setPreview(null)}
            style={{ position: "absolute", top: 20, right: 24, background: "white", border: "none",
              borderRadius: "50%", width: 36, height: 36, fontSize: "1.1rem", cursor: "pointer", lineHeight: 1 }}>×</button>
        </div>
      )}

      {/* ── GLOBAL STYLES ────────────────────────────── */}
      <style>{`
        @keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:1} }
        @keyframes spin   { to { transform: rotate(360deg); } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(124,93,246,.35); border-radius: 3px; }
        textarea:focus, input:focus, select:focus { outline: 2px solid rgba(124,93,246,.5) !important; }
        button:disabled { opacity: .5 !important; cursor: not-allowed !important; }
      `}</style>

      <BottomNav active="home" onNavigate={(href) => router.push(href)} />
    </div>
  );
}