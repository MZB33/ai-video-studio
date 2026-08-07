// ============================================================
//  categories.ts  —  ہمدم AI پلیٹ فارم
//  تمام ٹولز کی مکمل فہرست
//  آخری اپڈیٹ: 2025
// ============================================================

export type ToolStatus = "free" | "pro" | "soon";
export type SenseType = "talk" | "see" | "write" | "hear" | "touch" | "think";

export interface SubTool {
  id: string;
  name: string;           // اردو نام
  nameEn: string;         // English name
  description: string;    // اردو وضاحت
  icon: string;           // Tabler icon name
  status: ToolStatus;
  route?: string;         // /api/... route
  comingSoon?: boolean;
}

export interface Category {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  icon: string;
  color: string;
  textColor: string;
  borderColor: string;
  sense: SenseType[];
  forWhom: string[];
  tools: SubTool[];
  featured?: boolean;
  isNew?: boolean;
  isHot?: boolean;
}

// ============================================================
//  1. تحریر و بیان
// ============================================================
export const writingCategory: Category = {
  id: "writing",
  name: "تحریر و بیان",
  nameEn: "Writing & Expression",
  description: "ہر قسم کی تحریر — درخواست سے ناول تک",
  icon: "ti-pencil",
  color: "bg-violet-50",
  textColor: "text-violet-800",
  borderColor: "border-violet-200",
  sense: ["write", "talk"],
  forWhom: ["student", "professional", "business", "creator", "elderly"],
  featured: true,
  tools: [
    { id: "application-letter", name: "درخواست نویسی",    nameEn: "Application Letter",   description: "نوکری، تعلیم، سرکاری درخواستیں",        icon: "ti-mail",          status: "free", route: "/api/prompts/application" },
    { id: "cv-builder",         name: "CV بنائیں",         nameEn: "CV Builder",            description: "پیشہ ورانہ CV اور Resume",               icon: "ti-file-cv",       status: "free", route: "/api/cv-builder" },
    { id: "essay-writer",       name: "مضمون نویسی",       nameEn: "Essay Writer",          description: "تعلیمی، ادبی، رائے مضامین",             icon: "ti-news",          status: "free", route: "/api/prompts/essay" },
    { id: "story-writer",       name: "کہانی نویسی",       nameEn: "Story Writer",          description: "مختصر کہانی، ناول، اسکرپٹ",             icon: "ti-book",          status: "free", route: "/api/prompts/story" },
    { id: "poetry",             name: "شاعری",             nameEn: "Poetry Generator",      description: "غزل، نظم، ماہیا، گیت",                  icon: "ti-heart",         status: "free", route: "/api/prompts/poetry" },
    { id: "complaint-letter",   name: "شکایتی خط",         nameEn: "Complaint Letter",      description: "صارف، قانونی، دفتری شکایات",            icon: "ti-alert-circle",  status: "free", route: "/api/prompts/complaint" },
    { id: "business-letter",    name: "کاروباری خط",       nameEn: "Business Letter",       description: "آفر، معاہدہ، پارٹنرشپ خطوط",            icon: "ti-briefcase",     status: "free", route: "/api/prompts/business-letter" },
    { id: "social-media-post",  name: "سوشل میڈیا پوسٹ",  nameEn: "Social Media Post",     description: "Facebook، Instagram، Twitter کیپشن",    icon: "ti-brand-instagram",status:"free", route: "/api/prompts/social" },
    { id: "email-writer",       name: "ای میل رائٹر",      nameEn: "Email Writer",          description: "پیشہ ورانہ، ذاتی، مارکیٹنگ ای میل",    icon: "ti-mail-forward",  status: "free", route: "/api/prompts/email" },
    { id: "report-writer",      name: "رپورٹ رائٹر",       nameEn: "Report Writer",         description: "سالانہ، تحقیقی، دفتری رپورٹ",           icon: "ti-report",        status: "free", route: "/api/prompts/report" },
    { id: "agreement-draft",    name: "معاہدہ مسودہ",      nameEn: "Agreement Draft",       description: "کاروباری، ملازمت، کرایہ معاہدے",        icon: "ti-signature",     status: "free", route: "/api/prompts/agreement" },
    { id: "translation",        name: "ترجمہ",             nameEn: "Translation",           description: "اردو ↔ انگریزی ↔ 50+ زبانیں",           icon: "ti-language",      status: "free", route: "/api/prompts/translate" },
    { id: "summarizer",         name: "خلاصہ نویسی",       nameEn: "Text Summarizer",       description: "طویل متن کا مختصر خلاصہ",               icon: "ti-text-resize",   status: "free", route: "/api/prompts/summarize" },
    { id: "proofreader",        name: "غلطی درستگی",       nameEn: "Proofreader",           description: "املا، گرامر، اسلوب کی اصلاح",           icon: "ti-check-list",    status: "free", route: "/api/prompts/proofread" },
  ],
};

// ============================================================
//  2. اسکرپٹ رائٹر
// ============================================================
export const scriptCategory: Category = {
  id: "script",
  name: "اسکرپٹ رائٹر",
  nameEn: "Script Writer",
  description: "انسانی انداز کا اسکرپٹ — یوٹیوب سے ڈرامہ تک",
  icon: "ti-script",
  color: "bg-teal-50",
  textColor: "text-teal-800",
  borderColor: "border-teal-200",
  sense: ["write", "see", "hear"],
  forWhom: ["creator", "professional", "student"],
  isHot: true,
  tools: [
    { id: "youtube-script",     name: "یوٹیوب اسکرپٹ",    nameEn: "YouTube Script",        description: "Hook، Body، Call-to-Action کے ساتھ",    icon: "ti-brand-youtube", status: "free", route: "/api/prompts/youtube-script" },
    { id: "reels-script",       name: "ریلز اسکرپٹ",       nameEn: "Reels Script",          description: "30، 60، 90 سیکنڈ کی ریلز",              icon: "ti-device-mobile", status: "free", route: "/api/prompts/reels-script" },
    { id: "ad-script",          name: "اشتہاری اسکرپٹ",    nameEn: "Ad Script",             description: "پروڈکٹ، سروس، برانڈ اشتہار",            icon: "ti-ad-2",          status: "free", route: "/api/prompts/ad-script" },
    { id: "drama-script",       name: "ڈرامہ اسکرپٹ",      nameEn: "Drama Script",          description: "مکالمے، منظر، کردار",                   icon: "ti-theater",       status: "free", route: "/api/prompts/drama" },
    { id: "podcast-script",     name: "پوڈکاسٹ اسکرپٹ",    nameEn: "Podcast Script",        description: "انٹرویو، موضوعاتی، بیانیہ",             icon: "ti-microphone-2",  status: "free", route: "/api/prompts/podcast" },
    { id: "speech-writer",      name: "تقریر نویسی",       nameEn: "Speech Writer",         description: "شادی، دفتر، سیاسی، تعلیمی تقریر",      icon: "ti-speakerphone",  status: "free", route: "/api/prompts/speech" },
    { id: "documentary-script", name: "دستاویزی اسکرپٹ",   nameEn: "Documentary Script",    description: "نریشن، انٹرویو سوالات",                 icon: "ti-movie",         status: "pro",  route: "/api/prompts/documentary" },
  ],
};

// ============================================================
//  3. تصویر و ڈیزائن
// ============================================================
export const imageCategory: Category = {
  id: "image",
  name: "تصویر و ڈیزائن",
  nameEn: "Image & Design",
  description: "AI سے ہر قسم کی تصویر اور ڈیزائن",
  icon: "ti-photo",
  color: "bg-blue-50",
  textColor: "text-blue-800",
  borderColor: "border-blue-200",
  sense: ["see"],
  forWhom: ["creator", "business", "student", "artist"],
  isNew: true,
  tools: [
    { id: "realistic-portrait", name: "اصلی انسانی تصویر", nameEn: "Realistic Portrait",    description: "Photorealistic human face generation",   icon: "ti-user-circle",   status: "free", route: "/api/image/portrait" },
    { id: "3d-art",             name: "3D آرٹ",             nameEn: "3D Art",                description: "تھری ڈی کریکٹر، آبجیکٹ، سین",          icon: "ti-cube-3d-sphere",status: "free", route: "/api/image/3d" },
    { id: "handmade-art",       name: "ہینڈ میڈ آرٹ",      nameEn: "Handmade Art",          description: "واٹر کلر، سکیچ، آئل پینٹنگ",           icon: "ti-brush",         status: "free", route: "/api/image/handmade" },
    { id: "cartoon-art",        name: "کارٹون آرٹ",         nameEn: "Cartoon Art",           description: "Anime، Chibi، Comic style",              icon: "ti-mood-smile",    status: "free", route: "/api/image/cartoon" },
    { id: "prompt-to-image",    name: "پرامپٹ سے تصویر",   nameEn: "Text to Image",         description: "لکھیں اور تصویر پائیں",                 icon: "ti-wand",          status: "free", route: "/api/image/generate" },
    { id: "nano-banana-pro-free", name: "نانو بنانا پرو فری", nameEn: "NANO BANANA PRO FREE", description: "AI image shortcut opened from the app", icon: "ti-banana", status: "free", route: "/tools/nano-banana-pro-free" },
    { id: "background-remover", name: "بیک گراؤنڈ ریموور", nameEn: "Background Remover",    description: "ایک کلک میں پس منظر ہٹائیں",           icon: "ti-scissors",      status: "free", route: "/api/background" },
    { id: "logo-designer",      name: "لوگو ڈیزائنر",      nameEn: "Logo Designer",         description: "برانڈ، بزنس، پرسنل لوگو",               icon: "ti-color-picker",  status: "free", route: "/api/image/logo" },
    { id: "poster-banner",      name: "پوسٹر و بینر",      nameEn: "Poster & Banner",       description: "سوشل میڈیا، پرنٹ، ڈیجیٹل",             icon: "ti-layout",        status: "free", route: "/api/image/poster" },
    { id: "business-card",      name: "بزنس کارڈ",         nameEn: "Business Card",         description: "پیشہ ورانہ وزٹنگ کارڈ",                icon: "ti-id-badge",      status: "free", route: "/api/image/business-card" },
    { id: "thumbnail-maker",    name: "تھمب نیل میکر",     nameEn: "Thumbnail Maker",       description: "یوٹیوب، بلاگ، پوڈکاسٹ",                icon: "ti-photo-cog",     status: "free", route: "/api/image/thumbnail" },
    { id: "image-enhancer",     name: "تصویر بہتری",        nameEn: "Image Enhancer",       description: "پرانی تصویر کو نیا بنائیں",             icon: "ti-sparkles",      status: "pro",  route: "/api/image/enhance" },
    { id: "certificate-maker",  name: "سند ساز",            nameEn: "Certificate Maker",     description: "تعلیمی، پیشہ ورانہ سرٹیفکیٹ",          icon: "ti-certificate",   status: "free", route: "/api/image/certificate" },
  ],
};

// ============================================================
//  4. ویڈیو فیکٹری
// ============================================================
export const videoCategory: Category = {
  id: "video",
  name: "ویڈیو فیکٹری",
  nameEn: "Video Factory",
  description: "آئیڈیا سے تیار ویڈیو — ایک ہی جگہ",
  icon: "ti-movie",
  color: "bg-red-50",
  textColor: "text-red-800",
  borderColor: "border-red-200",
  sense: ["see", "hear"],
  forWhom: ["creator", "business", "student"],
  isHot: true,
  tools: [
    { id: "prompt-to-video",     name: "پرامپٹ سے ویڈیو",  nameEn: "Text to Video",         description: "لکھیں، ویڈیو تیار",                    icon: "ti-player-play",   status: "pro",  route: "/api/video/generate" },
    { id: "image-to-video",      name: "تصویر سے ویڈیو",   nameEn: "Image to Video",        description: "تصویر میں جان ڈالیں",                   icon: "ti-photo-video",   status: "pro",  route: "/api/video/image-to-video" },
    { id: "consistent-character",name: "مستقل کردار",       nameEn: "Consistent Character",  description: "ایک کردار، کئی ویڈیوز",                 icon: "ti-users",         status: "pro",  route: "/api/video/character" },
    { id: "video-editor",        name: "ویڈیو ایڈیٹر",     nameEn: "Video Editor",          description: "کاٹیں، جوڑیں، سٹائل دیں",              icon: "ti-cut",           status: "free", route: "/api/video/edit" },
    { id: "subtitle-generator",  name: "سب ٹائٹل میکر",    nameEn: "Subtitle Generator",    description: "خودکار اردو / انگریزی سب ٹائٹل",       icon: "ti-subtask",       status: "free", route: "/api/video/subtitle" },
    { id: "shorts-maker",        name: "شارٹس میکر",        nameEn: "Shorts Maker",          description: "لمبی ویڈیو سے ریلز بنائیں",            icon: "ti-scissors",      status: "pro",  route: "/api/video/shorts" },
    { id: "avatar-video",        name: "اواٹار ویڈیو",      nameEn: "Avatar Video",          description: "AI اواٹار سے پریزنٹیشن",               icon: "ti-robot",         status: "pro",  route: "/api/video/avatar", comingSoon: true },
  ],
};

// ============================================================
//  5. آواز و موسیقی
// ============================================================
export const audioCategory: Category = {
  id: "audio",
  name: "آواز و موسیقی",
  nameEn: "Audio & Music",
  description: "اردو، پنجابی، انگریزی — قدرتی آوازیں",
  icon: "ti-microphone-2",
  color: "bg-amber-50",
  textColor: "text-amber-800",
  borderColor: "border-amber-200",
  sense: ["hear"],
  forWhom: ["creator", "business", "artist", "student"],
  tools: [
    { id: "urdu-voiceover",    name: "اردو وائس اوور",    nameEn: "Urdu Voice Over",       description: "قدرتی اردو آواز میں تبدیل کریں",       icon: "ti-microphone",    status: "free", route: "/api/voice/urdu" },
    { id: "punjabi-voiceover", name: "پنجابی وائس اوور",  nameEn: "Punjabi Voice Over",    description: "پنجابی لہجے میں آواز",                  icon: "ti-microphone",    status: "free", route: "/api/voice/punjabi" },
    { id: "english-voiceover", name: "انگریزی وائس اوور", nameEn: "English Voice Over",    description: "برٹش / امریکن / نیوٹرل",                icon: "ti-microphone",    status: "free", route: "/api/voice/english" },
    { id: "ai-music",          name: "AI موسیقی",          nameEn: "AI Music Generator",    description: "غزل، پاپ، ناشید، بیک گراؤنڈ",          icon: "ti-music",         status: "free", route: "/api/voice/music" },
    { id: "lyrics-writer",     name: "لیریکس رائٹر",      nameEn: "Lyrics Writer",         description: "گانے کے بول — اردو، پنجابی",            icon: "ti-writing",       status: "free", route: "/api/prompts/lyrics" },
    { id: "sound-effects",     name: "ساؤنڈ ایفیکٹس",     nameEn: "Sound Effects",         description: "100+ مفت ساؤنڈ ایفیکٹس",               icon: "ti-wave-sine",     status: "free", route: "/api/voice/sfx" },
    { id: "background-music",  name: "بیک گراؤنڈ میوزک",  nameEn: "Background Music",      description: "ویڈیو کے لیے موضوعاتی موسیقی",         icon: "ti-player-track-next", status: "free", route: "/api/voice/background-music" },
    { id: "voice-clone",       name: "آواز کلون",          nameEn: "Voice Clone",           description: "اپنی آواز میں AI وائس اوور",            icon: "ti-copy",          status: "pro",  route: "/api/voice/clone", comingSoon: true },
    { id: "speech-to-text",    name: "آواز سے تحریر",      nameEn: "Speech to Text",        description: "بولیں، تحریر تیار",                     icon: "ti-ear",           status: "free", route: "/api/voice/stt" },
  ],
};

// ============================================================
//  6. CV اور ملازمت
// ============================================================
export const cvCategory: Category = {
  id: "cv-builder",
  name: "CV اور ملازمت",
  nameEn: "CV & Career",
  description: "پیشہ ورانہ CV سے انٹرویو تک",
  icon: "ti-file-cv",
  color: "bg-green-50",
  textColor: "text-green-800",
  borderColor: "border-green-200",
  sense: ["write", "think"],
  forWhom: ["student", "professional", "elderly"],
  tools: [
    { id: "cv-maker",           name: "CV میکر",            nameEn: "CV Maker",              description: "10+ پیشہ ورانہ ٹیمپلیٹس",              icon: "ti-file-cv",       status: "free", route: "/api/cv-builder/create" },
    { id: "resume-analyzer",    name: "CV تجزیہ",           nameEn: "Resume Analyzer",       description: "کمزوریاں اور بہتری کی تجاویز",          icon: "ti-analyze",       status: "free", route: "/api/cv-builder/analyze" },
    { id: "cover-letter",       name: "کور لیٹر",           nameEn: "Cover Letter",          description: "نوکری کے مطابق کور لیٹر",               icon: "ti-file-text",     status: "free", route: "/api/cv-builder/cover-letter" },
    { id: "linkedin-optimizer", name: "LinkedIn پروفائل",   nameEn: "LinkedIn Optimizer",    description: "LinkedIn بائیو اور ہیڈ لائن",           icon: "ti-brand-linkedin",status: "free", route: "/api/cv-builder/linkedin" },
    { id: "interview-prep",     name: "انٹرویو تیاری",      nameEn: "Interview Prep",        description: "عام سوالات اور بہترین جوابات",          icon: "ti-messages",      status: "free", route: "/api/cv-builder/interview" },
    { id: "salary-negotiation", name: "تنخواہ مذاکرات",     nameEn: "Salary Negotiation",    description: "تنخواہ طے کرنے کی حکمت عملی",          icon: "ti-coin",          status: "free", route: "/api/cv-builder/salary" },
    { id: "job-description",    name: "جاب ڈسکرپشن",        nameEn: "Job Description",       description: "آجروں کے لیے جاب پوسٹنگ",             icon: "ti-clipboard-list",status: "free", route: "/api/cv-builder/jd" },
  ],
};

// ============================================================
//  7. فری لانسنگ ٹولز
// ============================================================
export const freelancingCategory: Category = {
  id: "freelancing",
  name: "فری لانسنگ ٹولز",
  nameEn: "Freelancing Tools",
  description: "گھر بیٹھ کمائیں — Fiverr, Upwork, Freelancer",
  icon: "ti-briefcase",
  color: "bg-orange-50",
  textColor: "text-orange-800",
  borderColor: "border-orange-200",
  sense: ["write", "think"],
  forWhom: ["student", "professional", "creator", "elderly"],
  isNew: true,
  tools: [
    { id: "gig-title-generator", name: "Gig ٹائٹل میکر",    nameEn: "Gig Title Generator",   description: "Fiverr / Upwork کے لیے بہترین ٹائٹل",  icon: "ti-tag",           status: "free", route: "/api/freelancing/gig-title" },
    { id: "gig-description",     name: "Gig تفصیل",          nameEn: "Gig Description",       description: "کلائنٹ کو متاثر کرنے والی تفصیل",     icon: "ti-file-description", status: "free", route: "/api/freelancing/gig-description" },
    { id: "proposal-writer",     name: "پروپوزل رائٹر",      nameEn: "Proposal Writer",       description: "جیتنے والا کلائنٹ پروپوزل",            icon: "ti-send",          status: "free", route: "/api/freelancing/proposal" },
    { id: "client-message",      name: "کلائنٹ میسج",        nameEn: "Client Message",        description: "پیشہ ورانہ جواب اور فالو اپ",          icon: "ti-message",       status: "free", route: "/api/freelancing/client-message" },
    { id: "invoice-maker",       name: "انوائس میکر",         nameEn: "Invoice Maker",         description: "پیشہ ورانہ بل، کوٹیشن، ریسیپٹ",       icon: "ti-receipt",       status: "free", route: "/api/freelancing/invoice" },
    { id: "contract-template",   name: "معاہدہ ٹیمپلیٹ",     nameEn: "Contract Template",     description: "فری لانس کام کا قانونی معاہدہ",        icon: "ti-signature",     status: "free", route: "/api/freelancing/contract" },
    { id: "portfolio-bio",       name: "پورٹ فولیو بائیو",   nameEn: "Portfolio Bio",         description: "اپنا تعارف — پروفیشنل انداز میں",      icon: "ti-user-check",    status: "free", route: "/api/freelancing/bio" },
    { id: "pricing-calculator",  name: "قیمت کیلکولیٹر",     nameEn: "Pricing Calculator",    description: "کام کی مناسب قیمت معلوم کریں",         icon: "ti-calculator",    status: "free", route: "/api/freelancing/pricing" },
    { id: "niche-finder",        name: "نِش فائنڈر",          nameEn: "Niche Finder",          description: "اپنے لیے بہترین فری لانس فیلڈ",       icon: "ti-target",        status: "free", route: "/api/freelancing/niche" },
    { id: "upwork-profile",      name: "Upwork پروفائل",      nameEn: "Upwork Profile",        description: "Upwork پروفائل بہترین بنائیں",         icon: "ti-brand-upwork",  status: "free", route: "/api/freelancing/upwork-profile" },
    { id: "review-response",     name: "ریویو کا جواب",       nameEn: "Review Response",       description: "مثبت / منفی ریویو کا پیشہ ورانہ جواب",icon: "ti-star",          status: "free", route: "/api/freelancing/review-response" },
    { id: "skill-roadmap",       name: "مہارت روڈ میپ",       nameEn: "Skill Roadmap",         description: "آپ کی مہارت کو کمائی میں بدلیں",       icon: "ti-route",         status: "free", route: "/api/freelancing/skill-roadmap" },
  ],
};

// ============================================================
//  8. روزمرہ زندگی
// ============================================================
export const dailyLifeCategory: Category = {
  id: "daily-tools",
  name: "روزمرہ زندگی",
  nameEn: "Daily Life Tools",
  description: "صبح سے شام تک — ہر کام آسان",
  icon: "ti-home",
  color: "bg-pink-50",
  textColor: "text-pink-800",
  borderColor: "border-pink-200",
  sense: ["talk", "write", "think"],
  forWhom: ["child", "student", "housewife", "professional", "elderly"],
  isNew: true,
  tools: [
    { id: "recipe-generator",  name: "ترکیبِ کھانا",      nameEn: "Recipe Generator",      description: "موجود اجزاء سے ترکیب بنائیں",          icon: "ti-tools-kitchen-2", status: "free", route: "/api/daily-tools/recipe" },
    { id: "meal-planner",      name: "کھانے کا پلان",     nameEn: "Meal Planner",          description: "ہفتہ وار صحت مند کھانے کا منصوبہ",    icon: "ti-calendar",      status: "free", route: "/api/daily-tools/meal-plan" },
    { id: "grocery-list",      name: "گروسری لسٹ",         nameEn: "Grocery List",          description: "ترکیب سے خودکار خریداری فہرست",       icon: "ti-shopping-cart", status: "free", route: "/api/daily-tools/grocery" },
    { id: "budget-planner",    name: "بجٹ پلانر",          nameEn: "Budget Planner",        description: "ماہانہ آمدن و اخراجات کا حساب",       icon: "ti-wallet",        status: "free", route: "/api/daily-tools/budget" },
    { id: "health-advisor",    name: "صحت مشیر",           nameEn: "Health Advisor",        description: "علامات کا ابتدائی تجزیہ (ڈاکٹر نہیں)",icon: "ti-stethoscope",   status: "free", route: "/api/daily-tools/health" },
    { id: "exercise-planner",  name: "ورزش پلان",          nameEn: "Exercise Planner",      description: "عمر، وزن کے مطابق ورزش",               icon: "ti-run",           status: "free", route: "/api/daily-tools/exercise" },
    { id: "mental-wellness",   name: "ذہنی سکون",          nameEn: "Mental Wellness",       description: "ٹینشن، اضطراب کم کرنے کی تجاویز",     icon: "ti-brain",         status: "free", route: "/api/daily-tools/mental" },
    { id: "medicine-reminder", name: "دوا یاددہانی",       nameEn: "Medicine Schedule",     description: "دوائیں یاد رکھنے کا شیڈول",            icon: "ti-pill",          status: "free", route: "/api/daily-tools/medicine" },
    { id: "homework-helper",   name: "ہوم ورک مددگار",     nameEn: "Homework Helper",       description: "ہر مضمون — آسان اردو میں",              icon: "ti-school",        status: "free", route: "/api/daily-tools/homework" },
    { id: "story-for-kids",    name: "بچوں کی کہانی",      nameEn: "Kids Story",            description: "سبق آموز، دلچسپ اردو کہانیاں",        icon: "ti-baby-carriage", status: "free", route: "/api/daily-tools/kids-story" },
    { id: "parenting-tips",    name: "پرورش کی تجاویز",    nameEn: "Parenting Tips",         description: "بچے کی عمر کے مطابق رہنمائی",          icon: "ti-heart-handshake", status: "free", route: "/api/daily-tools/parenting" },
    { id: "kids-quiz",         name: "بچوں کا کوئز",         nameEn: "Kids Quiz",             description: "کھیل کھیل میں سیکھنا",                 icon: "ti-device-gamepad",status: "free", route: "/api/daily-tools/quiz" },
    { id: "travel-planner",    name: "سفر پلانر",          nameEn: "Travel Planner",        description: "پاکستان / بیرون ملک سفر منصوبہ",      icon: "ti-plane",         status: "free", route: "/api/daily-tools/travel" },
    { id: "event-planner",     name: "تقریب پلانر",        nameEn: "Event Planner",         description: "شادی، سالگرہ، دعوت منصوبہ",            icon: "ti-confetti",      status: "free", route: "/api/daily-tools/event" },
    { id: "gift-ideas",        name: "تحفہ آئیڈیاز",       nameEn: "Gift Ideas",            description: "عمر، موقع کے مطابق تحفے",              icon: "ti-gift",          status: "free", route: "/api/daily-tools/gifts" },
    { id: "dua-finder",        name: "دعا تلاش",           nameEn: "Dua Finder",            description: "موقع کے مطابق دعا اور ترجمہ",          icon: "ti-moon",          status: "free", route: "/api/daily-tools/dua" },
    { id: "prayer-times",      name: "نماز اوقات",          nameEn: "Prayer Times",          description: "شہر کے مطابق نماز کا وقت",             icon: "ti-clock",         status: "free", route: "/api/daily-tools/prayer" },
    { id: "islamic-calendar",  name: "اسلامی کیلنڈر",      nameEn: "Islamic Calendar",      description: "اہم اسلامی تاریخیں اور واقعات",         icon: "ti-calendar-event",status: "free", route: "/api/daily-tools/islamic-calendar" },
  ],
};

// ============================================================
//  9. تعلیم و سیکھنا
// ============================================================
export const educationCategory: Category = {
  id: "education",
  name: "تعلیم و سیکھنا",
  nameEn: "Education & Learning",
  description: "بچے سے بزرگ تک — ہر سطح کے لیے",
  icon: "ti-school",
  color: "bg-emerald-50",
  textColor: "text-emerald-800",
  borderColor: "border-emerald-200",
  sense: ["see", "hear", "write", "talk", "touch"],
  forWhom: ["child", "student", "professional", "elderly"],
  tools: [
    { id: "exam-prep",          name: "امتحانی تیاری",     nameEn: "Exam Preparation",      description: "میٹرک، انٹر، یونیورسٹی",               icon: "ti-clipboard-check",status: "free", route: "/api/daily-tools/exam" },
    { id: "concept-explainer",  name: "تصور وضاحت",        nameEn: "Concept Explainer",     description: "مشکل موضوع آسان اردو میں",              icon: "ti-bulb",          status: "free", route: "/api/daily-tools/explain" },
    { id: "quiz-generator",     name: "کوئز بنائیں",       nameEn: "Quiz Generator",        description: "کسی بھی موضوع پر خودکار کوئز",         icon: "ti-question-mark", status: "free", route: "/api/daily-tools/quiz-gen" },
    { id: "language-learner",   name: "زبان سیکھیں",       nameEn: "Language Learner",      description: "انگریزی، عربی، پنجابی سیکھیں",         icon: "ti-language",      status: "free", route: "/api/daily-tools/language" },
    { id: "math-solver",        name: "ریاضی حل",           nameEn: "Math Solver",           description: "مرحلہ وار حل — اردو میں",               icon: "ti-math",          status: "free", route: "/api/daily-tools/math" },
    { id: "science-lab",        name: "سائنس لیب",          nameEn: "Science Lab",          description: "تجربات کی وضاحت، مشق",                 icon: "ti-flask",         status: "free", route: "/api/daily-tools/science" },
    { id: "notes-maker",        name: "نوٹس میکر",          nameEn: "Smart Notes",           description: "پڑھے ہوئے کا خودکار خلاصہ",            icon: "ti-notes",         status: "free", route: "/api/daily-tools/notes" },
    { id: "certificate-courses",name: "سرٹیفکیٹ کورس",     nameEn: "Certificate Courses",   description: "مفت سرٹیفکیٹ — اردو میں",               icon: "ti-certificate",   status: "free", route: "/api/daily-tools/courses" },
  ],
};

// ============================================================
//  10. کاروبار و بزنس
// ============================================================
export const businessCategory: Category = {
  id: "business",
  name: "کاروبار و بزنس",
  nameEn: "Business Tools",
  description: "چھوٹے سے بڑے کاروبار تک — سب کچھ",
  icon: "ti-building-store",
  color: "bg-sky-50",
  textColor: "text-sky-800",
  borderColor: "border-sky-200",
  sense: ["write", "think"],
  forWhom: ["business", "professional"],
  tools: [
    { id: "business-plan",      name: "بزنس پلان",          nameEn: "Business Plan",         description: "مکمل کاروباری منصوبہ",                 icon: "ti-chart-bar",     status: "free", route: "/api/prompts/business-plan" },
    { id: "marketing-strategy", name: "مارکیٹنگ حکمت عملی", nameEn: "Marketing Strategy",    description: "ڈیجیٹل، مقامی، سوشل میڈیا",           icon: "ti-speakerphone",  status: "free", route: "/api/prompts/marketing" },
    { id: "invoice-generator",  name: "انوائس جنریٹر",      nameEn: "Invoice Generator",     description: "پیشہ ورانہ بل اور ریسیپٹ",             icon: "ti-receipt",       status: "free", route: "/api/freelancing/invoice" },
    { id: "product-description",name: "پروڈکٹ تفصیل",       nameEn: "Product Description",   description: "فروخت بڑھانے والی تفصیل",              icon: "ti-package",       status: "free", route: "/api/prompts/product-desc" },
    { id: "swot-analysis",      name: "SWOT تجزیہ",          nameEn: "SWOT Analysis",         description: "طاقت، کمزوری، مواقع، خطرات",           icon: "ti-chart-dots",    status: "free", route: "/api/prompts/swot" },
    { id: "customer-service",   name: "کسٹمر سروس",          nameEn: "Customer Service",      description: "شکایت، جواب، فالو اپ اسکرپٹ",         icon: "ti-headset",       status: "free", route: "/api/prompts/customer-service" },
    { id: "pricing-strategy",   name: "قیمت گزاری",          nameEn: "Pricing Strategy",      description: "مناسب قیمت رکھنے کی رہنمائی",          icon: "ti-coin",          status: "free", route: "/api/prompts/pricing" },
    { id: "email-marketing",    name: "ای میل مارکیٹنگ",    nameEn: "Email Marketing",       description: "مہم، نیوزلیٹر، ٹیمپلیٹ",               icon: "ti-mail-forward",  status: "free", route: "/api/prompts/email-marketing" },
  ],
};

// ============================================================
//  11. قانونی و سرکاری
// ============================================================
export const legalCategory: Category = {
  id: "legal",
  name: "قانونی و سرکاری",
  nameEn: "Legal & Government",
  description: "حق کی آواز — آسان اردو میں",
  icon: "ti-scale",
  color: "bg-slate-50",
  textColor: "text-slate-800",
  borderColor: "border-slate-200",
  sense: ["write", "think"],
  forWhom: ["professional", "business", "elderly", "student"],
  tools: [
    { id: "govt-application",  name: "سرکاری درخواست",    nameEn: "Government Application", description: "NADRA، پاسپورٹ، سرکاری خطوط",           icon: "ti-building",      status: "free", route: "/api/prompts/govt-application" },
    { id: "legal-notice",      name: "قانونی نوٹس",        nameEn: "Legal Notice",          description: "قانونی خط و کتابت",                     icon: "ti-gavel",         status: "free", route: "/api/prompts/legal-notice" },
    { id: "tenancy-agreement", name: "کرایہ نامہ",          nameEn: "Tenancy Agreement",     description: "کرایہ دار اور مالک کا معاہدہ",          icon: "ti-home",          status: "free", route: "/api/prompts/tenancy" },
    { id: "consumer-complaint",name: "صارف شکایت",          nameEn: "Consumer Complaint",    description: "کمپنی / پروڈکٹ شکایت",                 icon: "ti-alert-triangle",status: "free", route: "/api/prompts/consumer" },
    { id: "form-filler",       name: "فارم بھرنا",          nameEn: "Form Filler Guide",     description: "کوئی بھی فارم آسانی سے بھریں",         icon: "ti-forms",         status: "free", route: "/api/prompts/form-guide" },
    { id: "rights-explainer",  name: "حقوق کی وضاحت",      nameEn: "Rights Explainer",      description: "آپ کے قانونی حقوق — سادہ زبان میں",    icon: "ti-shield-check",  status: "free", route: "/api/prompts/rights" },
  ],
};

// ============================================================
//  12. سوشل میڈیا مینجر
// ============================================================
export const socialMediaCategory: Category = {
  id: "social-media",
  name: "سوشل میڈیا مینجر",
  nameEn: "Social Media Manager",
  description: "پوسٹ، بائیو، کیپشن — سب خودکار",
  icon: "ti-brand-instagram",
  color: "bg-fuchsia-50",
  textColor: "text-fuchsia-800",
  borderColor: "border-fuchsia-200",
  sense: ["write", "see"],
  forWhom: ["creator", "business", "student"],
  tools: [
    { id: "caption-generator",  name: "کیپشن جنریٹر",      nameEn: "Caption Generator",     description: "Instagram، Facebook، TikTok",           icon: "ti-quote",         status: "free", route: "/api/prompts/caption" },
    { id: "hashtag-generator",  name: "ہیش ٹیگ میکر",      nameEn: "Hashtag Generator",     description: "موضوع کے مطابق بہترین ہیش ٹیگ",       icon: "ti-hash",          status: "free", route: "/api/prompts/hashtags" },
    { id: "bio-writer",         name: "بائیو رائٹر",        nameEn: "Bio Writer",            description: "Instagram، TikTok، Twitter بائیو",     icon: "ti-user",          status: "free", route: "/api/prompts/bio" },
    { id: "content-calendar",   name: "مواد کیلنڈر",        nameEn: "Content Calendar",      description: "ہفتہ وار پوسٹنگ پلان",                 icon: "ti-calendar-event",status: "free", route: "/api/prompts/content-calendar" },
    { id: "viral-hook",         name: "وائرل ہک",           nameEn: "Viral Hook Generator",  description: "توجہ کھینچنے والا پہلا جملہ",           icon: "ti-flame",         status: "free", route: "/api/prompts/viral-hook" },
    { id: "reply-generator",    name: "جواب جنریٹر",        nameEn: "Reply Generator",       description: "تبصروں کا پیشہ ورانہ جواب",            icon: "ti-message-reply", status: "free", route: "/api/prompts/reply" },
    { id: "youtube-seo",        name: "YouTube SEO",         nameEn: "YouTube SEO",           description: "ٹائٹل، تفصیل، ٹیگز بہترین بنائیں",   icon: "ti-brand-youtube", status: "free", route: "/api/prompts/yt-seo" },
  ],
};

// ============================================================
//  13. AI ذاتی مددگار
// ============================================================
export const personalAssistantCategory: Category = {
  id: "personal-assistant",
  name: "AI ذاتی مددگار",
  nameEn: "Personal AI Assistant",
  description: "آپ کا ذاتی AI دوست — ہمیشہ ساتھ",
  icon: "ti-robot",
  color: "bg-indigo-50",
  textColor: "text-indigo-800",
  borderColor: "border-indigo-200",
  sense: ["talk", "think"],
  forWhom: ["child", "student", "professional", "elderly", "housewife"],
  tools: [
    { id: "ai-chat",         name: "AI گفتگو",           nameEn: "AI Chat",               description: "کسی بھی موضوع پر بات چیت",             icon: "ti-message-chatbot", status: "free", route: "/api/prompts/chat" },
    { id: "advice-giver",    name: "مشورہ دہندہ",        nameEn: "Life Advisor",          description: "زندگی کے مسائل پر رہنمائی",            icon: "ti-heart-handshake", status: "free", route: "/api/prompts/advice" },
    { id: "idea-generator",  name: "آئیڈیا جنریٹر",     nameEn: "Idea Generator",        description: "کاروبار، تخلیق، پروجیکٹ آئیڈیاز",    icon: "ti-bulb",          status: "free", route: "/api/prompts/ideas" },
    { id: "decision-helper", name: "فیصلہ مددگار",       nameEn: "Decision Helper",       description: "مشکل فیصلوں میں مدد",                  icon: "ti-arrows-split",  status: "free", route: "/api/prompts/decision" },
    { id: "motivator",       name: "حوصلہ افزا",          nameEn: "Motivator",             description: "ہمت بڑھانے والے پیغامات",              icon: "ti-flame",         status: "free", route: "/api/prompts/motivate" },
    { id: "daily-planner",   name: "روزانہ پلانر",       nameEn: "Daily Planner",         description: "دن کا بہترین منصوبہ",                   icon: "ti-list-check",    status: "free", route: "/api/daily-tools/planner" },
  ],
};

// ============================================================
//  14. ڈبنگ و آواز سٹوڈیو  ←  نیا
// ============================================================
export const dubbingCategory: Category = {
  id: "dubbing",
  name: "ڈبنگ و آواز سٹوڈیو",
  nameEn: "Dubbing & Voice Studio",
  description: "فلم، ڈرامہ، کارٹون — ہر کردار کی اصلی آواز",
  icon: "ti-microphone-2",
  color: "bg-purple-50",
  textColor: "text-purple-800",
  borderColor: "border-purple-200",
  sense: ["hear", "see"],
  forWhom: ["creator", "professional", "artist", "student"],
  isNew: true,
  isHot: true,
  tools: [
    {
      id: "multi-character-dubbing",
      name: "کثیر کردار ڈبنگ",
      nameEn: "Multi Character Dubbing",
      description: "ہر کردار الگ آواز — فلم، ڈرامہ، کارٹون",
      icon: "ti-users-group",
      status: "pro",
      route: "/api/dubbing/multi-character",
    },
    {
      id: "voice-pitch-control",
      name: "آواز پچ کنٹرول",
      nameEn: "Voice Pitch Control",
      description: "آواز اونچی، نیچی، موٹی، پتلی — سلائیڈر سے",
      icon: "ti-adjustments-horizontal",
      status: "free",
      route: "/api/dubbing/pitch",
    },
    {
      id: "emotion-dubbing",
      name: "جذباتی ڈبنگ",
      nameEn: "Emotion Dubbing",
      description: "خوشی، غم، غصہ، محبت — جذبے کے ساتھ آواز",
      icon: "ti-mood-smile",
      status: "pro",
      route: "/api/dubbing/emotion",
    },
    {
      id: "lip-sync-dubbing",
      name: "لِپ سِنک ڈبنگ",
      nameEn: "Lip Sync Dubbing",
      description: "ہونٹوں کے ساتھ آواز بالکل ملائی جائے",
      icon: "ti-mouth",
      status: "pro",
      route: "/api/dubbing/lip-sync",
    },
    {
      id: "film-dubbing",
      name: "فلم / مووی ڈبنگ",
      nameEn: "Film Dubbing",
      description: "پوری فلم اردو، پنجابی میں ڈب کریں",
      icon: "ti-movie",
      status: "pro",
      route: "/api/dubbing/film",
    },
    {
      id: "drama-dubbing",
      name: "ڈرامہ ڈبنگ",
      nameEn: "Drama Dubbing",
      description: "ترکی، کوریائی، ہندی ڈرامے اردو میں",
      icon: "ti-theater",
      status: "pro",
      route: "/api/dubbing/drama",
    },
    {
      id: "cartoon-dubbing",
      name: "کارٹون / اینیمیشن ڈبنگ",
      nameEn: "Cartoon Dubbing",
      description: "بچوں کے کارٹون اردو میں — مزیدار آوازیں",
      icon: "ti-mood-kid",
      status: "pro",
      route: "/api/dubbing/cartoon",
    },
    {
      id: "talkshow-dubbing",
      name: "ٹاک شو ڈبنگ",
      nameEn: "Talk Show Dubbing",
      description: "انٹرویو، ٹاک شو — قدرتی انداز میں",
      icon: "ti-microphone",
      status: "pro",
      route: "/api/dubbing/talkshow",
    },
    {
      id: "documentary-dubbing",
      name: "دستاویزی فلم ڈبنگ",
      nameEn: "Documentary Dubbing",
      description: "نریشن آواز — پیشہ ورانہ انداز",
      icon: "ti-device-tv",
      status: "pro",
      route: "/api/dubbing/documentary",
    },
    {
      id: "voice-replacement",
      name: "آواز تبدیل کریں",
      nameEn: "Voice Replacement",
      description: "پرانی آواز ہٹائیں — نئی آواز لگائیں",
      icon: "ti-replace",
      status: "pro",
      route: "/api/dubbing/replace",
    },
  ],
};

// ============================================================
//  15. ویڈیو ذہانت  ←  نیا
// ============================================================
export const videoIntelligenceCategory: Category = {
  id: "video-intelligence",
  name: "ویڈیو ذہانت",
  nameEn: "Video Intelligence",
  description: "ویڈیو چلائیں — مکمل علم حاصل کریں",
  icon: "ti-brain",
  color: "bg-indigo-50",
  textColor: "text-indigo-800",
  borderColor: "border-indigo-200",
  sense: ["see", "hear", "think"],
  forWhom: ["creator", "professional", "student", "business"],
  isNew: true,
  tools: [
    {
      id: "video-transcribe",
      name: "ویڈیو ٹرانسکرائب",
      nameEn: "Video Transcription",
      description: "ویڈیو کی آواز مکمل تحریر میں — 100% درست",
      icon: "ti-file-text",
      status: "free",
      route: "/api/video-intelligence/transcribe",
    },
    {
      id: "scene-by-scene-story",
      name: "سین بہ سین کہانی",
      nameEn: "Scene by Scene Story",
      description: "ہر سین، ہر کردار — مکمل کہانی نکالیں",
      icon: "ti-list-details",
      status: "pro",
      route: "/api/video-intelligence/scene-story",
    },
    {
      id: "character-analysis",
      name: "کردار تجزیہ",
      nameEn: "Character Analysis",
      description: "ہر کردار کا مکمل تعارف، مکالمے، کردار",
      icon: "ti-user-search",
      status: "pro",
      route: "/api/video-intelligence/characters",
    },
    {
      id: "story-extraction",
      name: "مکمل اسٹوری نکالیں",
      nameEn: "Full Story Extraction",
      description: "ایک بار چلائیں — مکمل کہانی تیار",
      icon: "ti-book-download",
      status: "pro",
      route: "/api/video-intelligence/story",
    },
    {
      id: "new-story-generator",
      name: "نئی اسٹوری بنائیں",
      nameEn: "New Story Generator",
      description: "پرانی کہانی بنیاد — نئی اصل کہانی",
      icon: "ti-wand",
      status: "pro",
      route: "/api/video-intelligence/new-story",
    },
    {
      id: "video-summary",
      name: "ویڈیو خلاصہ",
      nameEn: "Video Summary",
      description: "لمبی ویڈیو کا مختصر خلاصہ — نکات کے ساتھ",
      icon: "ti-text-resize",
      status: "free",
      route: "/api/video-intelligence/summary",
    },
    {
      id: "dialogue-extractor",
      name: "مکالمے نکالیں",
      nameEn: "Dialogue Extractor",
      description: "ہر کردار کے مکالمے الگ الگ",
      icon: "ti-messages",
      status: "free",
      route: "/api/video-intelligence/dialogues",
    },
    {
      id: "video-to-script",
      name: "ویڈیو سے اسکرپٹ",
      nameEn: "Video to Script",
      description: "ویڈیو سے مکمل لکھا ہوا اسکرپٹ",
      icon: "ti-script",
      status: "pro",
      route: "/api/video-intelligence/to-script",
    },
    {
      id: "emotion-timeline",
      name: "جذبات ٹائم لائن",
      nameEn: "Emotion Timeline",
      description: "کس وقت کون سا جذبہ — ٹائم اسٹیمپ کے ساتھ",
      icon: "ti-heart-rate-monitor",
      status: "pro",
      route: "/api/video-intelligence/emotions",
    },
  ],
};

// ============================================================
//  16. انیمیشن و کارٹون اسٹوڈیو  ←  نیا
// ============================================================
export const animationCategory: Category = {
  id: "animation",
  name: "انیمیشن و کارٹون اسٹوڈیو",
  nameEn: "Animation & Cartoon Studio",
  description: "اصل ویڈیو سے کارٹون — نئی دنیا بنائیں",
  icon: "ti-movie",
  color: "bg-yellow-50",
  textColor: "text-yellow-800",
  borderColor: "border-yellow-200",
  sense: ["see", "hear"],
  forWhom: ["creator", "artist", "student", "child"],
  isNew: true,
  tools: [
    {
      id: "film-to-cartoon",
      name: "فلم سے کارٹون",
      nameEn: "Film to Cartoon",
      description: "اصل فلم → کارٹون اینیمیشن — مکمل تبدیلی",
      icon: "ti-mood-smile",
      status: "pro",
      route: "/api/animation/film-to-cartoon",
    },
    {
      id: "anime-style",
      name: "اینیمے اسٹائل",
      nameEn: "Anime Style Conversion",
      description: "جاپانی اینیمے انداز میں تبدیل کریں",
      icon: "ti-sparkles",
      status: "pro",
      route: "/api/animation/anime",
    },
    {
      id: "2d-animation",
      name: "2D اینیمیشن",
      nameEn: "2D Animation",
      description: "فلیٹ کارٹون، کامک اسٹائل",
      icon: "ti-square",
      status: "pro",
      route: "/api/animation/2d",
    },
    {
      id: "3d-animation",
      name: "3D اینیمیشن",
      nameEn: "3D Animation",
      description: "تھری ڈی کارٹون کردار و منظر",
      icon: "ti-cube-3d-sphere",
      status: "pro",
      route: "/api/animation/3d",
      comingSoon: true,
    },
    {
      id: "cartoon-character-create",
      name: "کارٹون کردار بنائیں",
      nameEn: "Cartoon Character Creator",
      description: "اپنا کارٹون کردار ڈیزائن کریں",
      icon: "ti-user-circle",
      status: "free",
      route: "/api/animation/character",
    },
    {
      id: "whiteboard-animation",
      name: "وائٹ بورڈ اینیمیشن",
      nameEn: "Whiteboard Animation",
      description: "تعلیمی وائٹ بورڈ ویڈیو بنائیں",
      icon: "ti-presentation",
      status: "pro",
      route: "/api/animation/whiteboard",
    },
    {
      id: "photo-to-cartoon",
      name: "تصویر سے کارٹون",
      nameEn: "Photo to Cartoon",
      description: "اپنی تصویر کو کارٹون بنائیں",
      icon: "ti-photo",
      status: "free",
      route: "/api/animation/photo-cartoon",
    },
    {
      id: "motion-graphics",
      name: "موشن گرافکس",
      nameEn: "Motion Graphics",
      description: "متحرک ٹیکسٹ، لوگو، اینیمیشن",
      icon: "ti-chart-arrows",
      status: "pro",
      route: "/api/animation/motion",
    },
  ],
};

// ============================================================
//  تمام کیٹیگریز
// ============================================================
export const allCategories: Category[] = [
  personalAssistantCategory,
  writingCategory,
  scriptCategory,
  imageCategory,
  videoCategory,
  audioCategory,
  dubbingCategory,           // نیا
  videoIntelligenceCategory, // نیا
  animationCategory,         // نیا
  cvCategory,
  freelancingCategory,
  dailyLifeCategory,
  educationCategory,
  businessCategory,
  socialMediaCategory,
  legalCategory,
];

// ============================================================
//  سامعین
// ============================================================
export const audienceTypes = {
  child:        { label: "چھوٹے بچے",    icon: "ti-baby-carriage" },
  student:      { label: "طالب علم",     icon: "ti-school" },
  professional: { label: "ملازم پیشہ",   icon: "ti-briefcase" },
  business:     { label: "کاروباری",      icon: "ti-building-store" },
  creator:      { label: "کریئیٹر",       icon: "ti-device-mobile" },
  housewife:    { label: "گھریلو خاتون", icon: "ti-home" },
  elderly:      { label: "بزرگ",          icon: "ti-walk" },
  artist:       { label: "فنکار",         icon: "ti-palette" },
} as const;

// ============================================================
//  حواس
// ============================================================
export const senseTypes = {
  talk:  { label: "بات کر کے", icon: "ti-message-circle", color: "violet" },
  see:   { label: "دیکھ کر",   icon: "ti-eye",            color: "blue"   },
  write: { label: "لکھ کر",    icon: "ti-pencil",         color: "teal"   },
  hear:  { label: "سن کر",     icon: "ti-ear",            color: "amber"  },
  touch: { label: "کر کے",     icon: "ti-hand-finger",    color: "red"    },
  think: { label: "سوچ کر",    icon: "ti-brain",          color: "pink"   },
} as const;

// ============================================================
//  ہیلپر فنکشنز
// ============================================================
export function getCategoryById(id: string): Category | undefined {
  return allCategories.find((c) => c.id === id);
}

export function getToolById(toolId: string): SubTool | undefined {
  for (const cat of allCategories) {
    const tool = cat.tools.find((t) => t.id === toolId);
    if (tool) return tool;
  }
  return undefined;
}

export function getCategoriesForAudience(audience: keyof typeof audienceTypes): Category[] {
  return allCategories.filter((c) => c.forWhom.includes(audience));
}

export function getCategoriesBySense(sense: SenseType): Category[] {
  return allCategories.filter((c) => c.sense.includes(sense));
}

export function countFreeTools(): number {
  return allCategories.reduce(
    (sum, cat) => sum + cat.tools.filter((t) => t.status === "free").length, 0
  );
}

export function countAllTools(): number {
  return allCategories.reduce((sum, cat) => sum + cat.tools.length, 0);
}

export function searchTools(query: string): SubTool[] {
  const q = query.toLowerCase();
  const results: SubTool[] = [];
  for (const cat of allCategories) {
    for (const tool of cat.tools) {
      if (
        tool.name.includes(q) ||
        tool.nameEn.toLowerCase().includes(q) ||
        tool.description.includes(q)
      ) {
        results.push(tool);
      }
    }
  }
  return results;
}

// ============================================================
//  پلیٹ فارم اعداد و شمار
// ============================================================
export const platformStats = {
  totalCategories: allCategories.length,
  totalTools:      countAllTools(),
  freeTools:       countFreeTools(),
  languages:       ["اردو", "پنجابی", "English"],
  devices:         ["موبائل", "لیپ ٹاپ", "ٹیبلٹ", "TV"],
};
