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
  { id:"en-us-m-11", name:"Daniel (Serious)",      nameUr:"ڈینیل (سنجیدہ)",         gender:"male",   age:"adult",  emotion:"serious",   voiceType:"normal",   language:"English", accent:"American",   speed:0.95, pitch:0.95  },
  { id:"en-us-m-12", name:"Nathan (Surprised)",    nameUr:"نیتھن (حیران)",          gender:"male",   age:"adult",  emotion:"surprised", voiceType:"sharp",    language:"English", accent:"American",   speed:1.10, pitch:1.15  },
  { id:"en-us-m-13", name:"Aaron (Husky)",         nameUr:"ایرن (بھاری گلا)",       gender:"male",   age:"adult",  emotion:"neutral",   voiceType:"husky",    language:"English", accent:"American",   speed:0.95, pitch:0.85  },
  { id:"en-us-m-14", name:"Bryan (Sarcastic)",     nameUr:"برائن (طنزیہ)",          gender:"male",   age:"adult",  emotion:"sarcastic", voiceType:"sharp",    language:"English", accent:"American",   speed:1.05, pitch:1.05  },
  { id:"en-us-m-15", name:"Elder John (Senior)",   nameUr:"بزرگ جان (سینئر)",       gender:"male",   age:"senior", emotion:"calm",      voiceType:"rough",    language:"English", accent:"American",   speed:0.85, pitch:0.80  },
  // UK
  { id:"en-uk-m-01", name:"Oliver (British)",      nameUr:"اولیور (برطانوی)",       gender:"male",   age:"adult",  emotion:"neutral",   voiceType:"smooth",   language:"English", accent:"British",    speed:1.00, pitch:1.00, popular:true  },
  { id:"en-uk-m-02", name:"Arthur (Posh)",         nameUr:"آرتھر (اعلیٰ طبقہ)",     gender:"male",   age:"adult",  emotion:"serious",   voiceType:"smooth",   language:"English", accent:"British",    speed:0.95, pitch:1.05  },
  // Australian
  { id:"en-au-m-01", name:"Jack (Australian)",     nameUr:"جیک (آسٹریلوی)",         gender:"male",   age:"adult",  emotion:"happy",     voiceType:"melodic",  language:"English", accent:"Australian", speed:1.05, pitch:1.05  },

  // ── ENGLISH / AMERICAN — WOMEN ──────────────────────────
  { id:"en-us-w-01", name:"Sophia (Warm)",         nameUr:"صوفیہ (نرم)",            gender:"female", age:"adult",  emotion:"neutral",   voiceType:"soft",     language:"English", accent:"American",   speed:1.00, pitch:1.10, popular:true  },
  { id:"en-us-w-02", name:"Emma (Happy)",          nameUr:"ایما (خوش)",             gender:"female", age:"adult",  emotion:"happy",     voiceType:"melodic",  language:"English", accent:"American",   speed:1.10, pitch:1.20  },
  { id:"en-us-w-03", name:"Olivia (Sad)",          nameUr:"اولیویا (اداس)",         gender:"female", age:"adult",  emotion:"sad",       voiceType:"soft",     language:"English", accent:"American",   speed:0.85, pitch:1.00  },
  { id:"en-us-w-04", name:"Ava (Angry)",           nameUr:"ایوا (غصہ)",             gender:"female", age:"adult",  emotion:"angry",     voiceType:"sharp",    language:"English", accent:"American",   speed:1.20, pitch:1.15  },
  { id:"en-us-w-05", name:"Isabella (Excited)",    nameUr:"ازابیلا (پرجوش)",        gender:"female", age:"adult",  emotion:"excited",   voiceType:"thin",     language:"English", accent:"American",   speed:1.30, pitch:1.25  },
  { id:"en-us-w-06", name:"Mia (Calm)",            nameUr:"میا (پرسکون)",           gender:"female", age:"adult",  emotion:"calm",      voiceType:"smooth",   language:"English", accent:"American",   speed:0.90, pitch:1.00  },
  { id:"en-us-w-07", name:"Charlotte (Whisper)",   nameUr:"شارلٹ (سرگوشی)",        gender:"female", age:"adult",  emotion:"whisper",   voiceType:"breathy",  language:"English", accent:"American",   speed:0.70, pitch:0.95  },
  { id:"en-us-w-08", name:"Harper (Romantic)",     nameUr:"ہارپر (رومانٹک)",        gender:"female", age:"adult",  emotion:"romantic",  voiceType:"smooth",   language:"English", accent:"American",   speed:0.85, pitch:1.05, popular:true  },
  { id:"en-us-w-09", name:"Luna (Crying)",         nameUr:"لونا (روتے ہوئے)",       gender:"female", age:"adult",  emotion:"crying",    voiceType:"soft",     language:"English", accent:"American",   speed:0.85, pitch:1.00  },
  { id:"en-us-w-10", name:"Stella (Surprised)",    nameUr:"اسٹیلا (حیران)",         gender:"female", age:"adult",  emotion:"surprised", voiceType:"thin",     language:"English", accent:"American",   speed:1.15, pitch:1.25  },
  { id:"en-us-w-11", name:"Grace (Husky)",         nameUr:"گریس (بھاری گلا)",       gender:"female", age:"adult",  emotion:"neutral",   voiceType:"husky",    language:"English", accent:"American",   speed:0.95, pitch:0.90  },
  { id:"en-us-w-12", name:"Diana (Serious)",       nameUr:"ڈیانا (سنجیدہ)",         gender:"female", age:"adult",  emotion:"serious",   voiceType:"normal",   language:"English", accent:"American",   speed:0.95, pitch:1.00  },
  { id:"en-us-w-13", name:"Nora (Fearful)",        nameUr:"نورا (خوفزدہ)",          gender:"female", age:"adult",  emotion:"fearful",   voiceType:"thin",     language:"English", accent:"American",   speed:1.15, pitch:1.20  },
  { id:"en-uk-w-01", name:"Amelia (British)",      nameUr:"امیلیا (برطانوی)",       gender:"female", age:"adult",  emotion:"neutral",   voiceType:"smooth",   language:"English", accent:"British",    speed:1.00, pitch:1.05  },

  // ── ENGLISH — BOYS ───────────────────────────────────────
  { id:"en-us-b-01", name:"Leo (Happy Boy)",       nameUr:"لیو (خوش لڑکا)",        gender:"boy",    age:"child",  emotion:"happy",     voiceType:"thin",     language:"English", accent:"American",   speed:1.15, pitch:1.35  },
  { id:"en-us-b-02", name:"Mason (Sad Boy)",       nameUr:"میسن (اداس لڑکا)",      gender:"boy",    age:"child",  emotion:"sad",       voiceType:"soft",     language:"English", accent:"American",   speed:0.90, pitch:1.25  },
  { id:"en-us-b-03", name:"Ethan (Excited Boy)",   nameUr:"ایتھن (پرجوش لڑکا)",    gender:"boy",    age:"child",  emotion:"excited",   voiceType:"sharp",    language:"English", accent:"American",   speed:1.30, pitch:1.40  },
  { id:"en-us-b-04", name:"Noah (Calm Boy)",       nameUr:"نوح (پرسکون لڑکا)",     gender:"boy",    age:"child",  emotion:"calm",      voiceType:"smooth",   language:"English", accent:"American",   speed:0.95, pitch:1.25  },
  { id:"en-us-b-05", name:"Liam (Crying Boy)",     nameUr:"لیام (روتا لڑکا)",      gender:"boy",    age:"child",  emotion:"crying",    voiceType:"thin",     language:"English", accent:"American",   speed:0.90, pitch:1.30  },
  { id:"en-us-b-06", name:"Aiden (Fearful Boy)",   nameUr:"ایڈن (خوفزدہ لڑکا)",   gender:"boy",    age:"child",  emotion:"fearful",   voiceType:"thin",     language:"English", accent:"American",   speed:1.20, pitch:1.35  },

  // ── ENGLISH — GIRLS ──────────────────────────────────────
  { id:"en-us-g-01", name:"Lily (Happy Girl)",     nameUr:"للی (خوش لڑکی)",        gender:"girl",   age:"child",  emotion:"happy",     voiceType:"melodic",  language:"English", accent:"American",   speed:1.15, pitch:1.45, popular:true  },
  { id:"en-us-g-02", name:"Chloe (Sad Girl)",      nameUr:"کلوئی (اداس لڑکی)",     gender:"girl",   age:"child",  emotion:"sad",       voiceType:"soft",     language:"English", accent:"American",   speed:0.90, pitch:1.30  },
  { id:"en-us-g-03", name:"Ella (Excited Girl)",   nameUr:"ایلا (پرجوش لڑکی)",     gender:"girl",   age:"child",  emotion:"excited",   voiceType:"melodic",  language:"English", accent:"American",   speed:1.35, pitch:1.45  },
  { id:"en-us-g-04", name:"Aria (Whisper Girl)",   nameUr:"آریا (سرگوشی لڑکی)",    gender:"girl",   age:"child",  emotion:"whisper",   voiceType:"breathy",  language:"English", accent:"American",   speed:0.75, pitch:1.35  },
  { id:"en-us-g-05", name:"Zoe (Crying Girl)",     nameUr:"زوئی (روتی لڑکی)",      gender:"girl",   age:"child",  emotion:"crying",    voiceType:"thin",     language:"English", accent:"American",   speed:0.85, pitch:1.35  },
  { id:"en-us-g-06", name:"Mila (Fearful Girl)",   nameUr:"ملا (خوفزدہ لڑکی)",     gender:"girl",   age:"child",  emotion:"fearful",   voiceType:"thin",     language:"English", accent:"American",   speed:1.20, pitch:1.40  },

  // ── URDU — MEN ───────────────────────────────────────────
  { id:"ur-pk-m-01", name:"Asad (Standard)",       nameUr:"اسد (معیاری)",           gender:"male",   age:"adult",  emotion:"neutral",   voiceType:"normal",   language:"Urdu",    accent:"Pakistani",  speed:1.00, pitch:1.00, popular:true  },
  { id:"ur-pk-m-02", name:"Bilal (Deep)",          nameUr:"بلال (گہری)",            gender:"male",   age:"adult",  emotion:"neutral",   voiceType:"deep",     language:"Urdu",    accent:"Pakistani",  speed:0.90, pitch:0.80  },
  { id:"ur-pk-m-03", name:"Hamza (Happy)",         nameUr:"حمزہ (خوش)",             gender:"male",   age:"adult",  emotion:"happy",     voiceType:"melodic",  language:"Urdu",    accent:"Pakistani",  speed:1.10, pitch:1.10  },
  { id:"ur-pk-m-04", name:"Zain (Angry)",          nameUr:"زین (غصہ)",              gender:"male",   age:"adult",  emotion:"angry",     voiceType:"rough",    language:"Urdu",    accent:"Pakistani",  speed:1.20, pitch:0.95  },
  { id:"ur-pk-m-05", name:"Omar (Sad)",            nameUr:"عمر (اداس)",             gender:"male",   age:"adult",  emotion:"sad",       voiceType:"soft",     language:"Urdu",    accent:"Pakistani",  speed:0.85, pitch:0.95  },
  { id:"ur-pk-m-06", name:"Tariq (Excited)",       nameUr:"طارق (پرجوش)",           gender:"male",   age:"adult",  emotion:"excited",   voiceType:"sharp",    language:"Urdu",    accent:"Pakistani",  speed:1.25, pitch:1.15  },
  { id:"ur-pk-m-07", name:"Kamran (Calm)",         nameUr:"کامران (پرسکون)",        gender:"male",   age:"adult",  emotion:"calm",      voiceType:"smooth",   language:"Urdu",    accent:"Pakistani",  speed:0.90, pitch:1.00  },
  { id:"ur-pk-m-08", name:"Adeel (Romantic)",      nameUr:"عدیل (رومانٹک)",         gender:"male",   age:"adult",  emotion:"romantic",  voiceType:"smooth",   language:"Urdu",    accent:"Pakistani",  speed:0.85, pitch:0.95, popular:true  },
  { id:"ur-pk-m-09", name:"Fahad (Serious)",       nameUr:"فہد (سنجیدہ)",           gender:"male",   age:"adult",  emotion:"serious",   voiceType:"normal",   language:"Urdu",    accent:"Pakistani",  speed:0.95, pitch:0.95  },
  { id:"ur-pk-m-10", name:"Baba Ji (Senior)",      nameUr:"بابا جی (بزرگ)",         gender:"male",   age:"senior", emotion:"calm",      voiceType:"rough",    language:"Urdu",    accent:"Pakistani",  speed:0.85, pitch:0.80  },
  // Punjabi accent
  { id:"pa-pk-m-01", name:"Javed (Punjabi)",       nameUr:"جاوید (پنجابی)",         gender:"male",   age:"adult",  emotion:"happy",     voiceType:"thick",    language:"Urdu",    accent:"Punjabi",    speed:1.05, pitch:1.00, popular:true  },
  { id:"pa-pk-m-02", name:"Chaudhry (Punjabi)",    nameUr:"چودھری (پنجابی)",        gender:"male",   age:"senior", emotion:"serious",   voiceType:"rough",    language:"Urdu",    accent:"Punjabi",    speed:0.90, pitch:0.85  },

  // ── URDU — WOMEN ─────────────────────────────────────────
  { id:"ur-pk-w-01", name:"Ayesha (Warm)",         nameUr:"عائشہ (نرم)",            gender:"female", age:"adult",  emotion:"neutral",   voiceType:"soft",     language:"Urdu",    accent:"Pakistani",  speed:1.00, pitch:1.15, popular:true  },
  { id:"ur-pk-w-02", name:"Fatima (Happy)",        nameUr:"فاطمہ (خوش)",            gender:"female", age:"adult",  emotion:"happy",     voiceType:"melodic",  language:"Urdu",    accent:"Pakistani",  speed:1.10, pitch:1.20  },
  { id:"ur-pk-w-03", name:"Sana (Sad)",            nameUr:"ثنا (اداس)",             gender:"female", age:"adult",  emotion:"sad",       voiceType:"soft",     language:"Urdu",    accent:"Pakistani",  speed:0.90, pitch:1.10  },
  { id:"ur-pk-w-04", name:"Zara (Excited)",        nameUr:"زارا (پرجوش)",           gender:"female", age:"adult",  emotion:"excited",   voiceType:"thin",     language:"Urdu",    accent:"Pakistani",  speed:1.25, pitch:1.25  },
  { id:"ur-pk-w-05", name:"Nadia (Romantic)",      nameUr:"نادیہ (رومانٹک)",        gender:"female", age:"adult",  emotion:"romantic",  voiceType:"breathy",  language:"Urdu",    accent:"Pakistani",  speed:0.85, pitch:1.10, popular:true  },
  { id:"ur-pk-w-06", name:"Huma (Crying)",         nameUr:"ہما (روتے ہوئے)",        gender:"female", age:"adult",  emotion:"crying",    voiceType:"soft",     language:"Urdu",    accent:"Pakistani",  speed:0.85, pitch:1.10  },
  { id:"ur-pk-w-07", name:"Ammi (Senior Lady)",    nameUr:"امی جان (بزرگ خاتون)",   gender:"female", age:"senior", emotion:"calm",      voiceType:"soft",     language:"Urdu",    accent:"Pakistani",  speed:0.85, pitch:1.00  },

  // ── URDU — BOYS ──────────────────────────────────────────
  { id:"ur-pk-b-01", name:"Ali (Happy Boy)",       nameUr:"علی (خوش لڑکا)",        gender:"boy",    age:"child",  emotion:"happy",     voiceType:"thin",     language:"Urdu",    accent:"Pakistani",  speed:1.15, pitch:1.40, popular:true  },
  { id:"ur-pk-b-02", name:"Hassan (Sad Boy)",      nameUr:"حسن (اداس لڑکا)",       gender:"boy",    age:"child",  emotion:"sad",       voiceType:"soft",     language:"Urdu",    accent:"Pakistani",  speed:0.95, pitch:1.30  },
  { id:"ur-pk-b-03", name:"Usman (Excited Boy)",   nameUr:"عثمان (پرجوش لڑکا)",    gender:"boy",    age:"child",  emotion:"excited",   voiceType:"sharp",    language:"Urdu",    accent:"Pakistani",  speed:1.30, pitch:1.40  },
  { id:"ur-pk-b-04", name:"Raza (Crying Boy)",     nameUr:"رضا (روتا لڑکا)",       gender:"boy",    age:"child",  emotion:"crying",    voiceType:"thin",     language:"Urdu",    accent:"Pakistani",  speed:0.90, pitch:1.35  },

  // ── URDU — GIRLS ─────────────────────────────────────────
  { id:"ur-pk-g-01", name:"Amina (Happy Girl)",    nameUr:"آمنہ (خوش لڑکی)",       gender:"girl",   age:"child",  emotion:"happy",     voiceType:"melodic",  language:"Urdu",    accent:"Pakistani",  speed:1.15, pitch:1.45, popular:true  },
  { id:"ur-pk-g-02", name:"Hira (Excited Girl)",   nameUr:"ہیرہ (پرجوش لڑکی)",     gender:"girl",   age:"child",  emotion:"excited",   voiceType:"melodic",  language:"Urdu",    accent:"Pakistani",  speed:1.30, pitch:1.50  },
  { id:"ur-pk-g-03", name:"Maryam (Sad Girl)",     nameUr:"مریم (اداس لڑکی)",       gender:"girl",   age:"child",  emotion:"sad",       voiceType:"soft",     language:"Urdu",    accent:"Pakistani",  speed:0.90, pitch:1.30  },
  { id:"ur-pk-g-04", name:"Sara (Crying Girl)",    nameUr:"سارہ (روتی لڑکی)",      gender:"girl",   age:"child",  emotion:"crying",    voiceType:"thin",     language:"Urdu",    accent:"Pakistani",  speed:0.85, pitch:1.35  },

  // ── HINDI — MEN ──────────────────────────────────────────
  { id:"hi-in-m-01", name:"Raj (Standard)",        nameUr:"راج (معیاری)",           gender:"male",   age:"adult",  emotion:"neutral",   voiceType:"normal",   language:"Hindi",   accent:"Indian",     speed:1.00, pitch:1.00  },
  { id:"hi-in-m-02", name:"Vikram (Deep)",         nameUr:"وکرم (گہری)",            gender:"male",   age:"adult",  emotion:"neutral",   voiceType:"deep",     language:"Hindi",   accent:"Indian",     speed:0.90, pitch:0.80  },
  { id:"hi-in-m-03", name:"Rahul (Happy)",         nameUr:"راہل (خوش)",             gender:"male",   age:"adult",  emotion:"happy",     voiceType:"melodic",  language:"Hindi",   accent:"Indian",     speed:1.10, pitch:1.10  },
  { id:"hi-in-m-04", name:"Arjun (Angry)",         nameUr:"ارجن (غصہ)",             gender:"male",   age:"adult",  emotion:"angry",     voiceType:"rough",    language:"Hindi",   accent:"Indian",     speed:1.20, pitch:0.95  },
  { id:"hi-in-m-05", name:"Suresh (Romantic)",     nameUr:"سریش (رومانٹک)",         gender:"male",   age:"adult",  emotion:"romantic",  voiceType:"smooth",   language:"Hindi",   accent:"Indian",     speed:0.85, pitch:0.95  },

  // ── HINDI — WOMEN ────────────────────────────────────────
  { id:"hi-in-w-01", name:"Priya (Warm)",          nameUr:"پریا (نرم)",             gender:"female", age:"adult",  emotion:"neutral",   voiceType:"soft",     language:"Hindi",   accent:"Indian",     speed:1.00, pitch:1.15  },
  { id:"hi-in-w-02", name:"Neha (Happy)",          nameUr:"نہا (خوش)",              gender:"female", age:"adult",  emotion:"happy",     voiceType:"melodic",  language:"Hindi",   accent:"Indian",     speed:1.10, pitch:1.20  },
  { id:"hi-in-w-03", name:"Kavya (Romantic)",      nameUr:"کاویا (رومانٹک)",        gender:"female", age:"adult",  emotion:"romantic",  voiceType:"breathy",  language:"Hindi",   accent:"Indian",     speed:0.85, pitch:1.10  },
  { id:"hi-in-w-04", name:"Ananya (Sad)",          nameUr:"اننیا (اداس)",           gender:"female", age:"adult",  emotion:"sad",       voiceType:"soft",     language:"Hindi",   accent:"Indian",     speed:0.90, pitch:1.10  },

  // ── HINDI — BOYS / GIRLS ─────────────────────────────────
  { id:"hi-in-b-01", name:"Rohan (Happy Boy)",     nameUr:"روہن (خوش لڑکا)",       gender:"boy",    age:"child",  emotion:"happy",     voiceType:"thin",     language:"Hindi",   accent:"Indian",     speed:1.15, pitch:1.35  },
  { id:"hi-in-g-01", name:"Aisha (Happy Girl)",    nameUr:"عائشہ (خوش لڑکی)",      gender:"girl",   age:"child",  emotion:"happy",     voiceType:"melodic",  language:"Hindi",   accent:"Indian",     speed:1.15, pitch:1.40  },

  // ── ARABIC ───────────────────────────────────────────────
  { id:"ar-sa-m-01", name:"Ahmed (Standard)",      nameUr:"احمد (معیاری)",          gender:"male",   age:"adult",  emotion:"neutral",   voiceType:"normal",   language:"Arabic",  accent:"Saudi",      speed:1.00, pitch:1.00  },
  { id:"ar-sa-m-02", name:"Khalid (Deep)",         nameUr:"خالد (گہری)",            gender:"male",   age:"adult",  emotion:"neutral",   voiceType:"deep",     language:"Arabic",  accent:"Saudi",      speed:0.90, pitch:0.80  },
  { id:"ar-sa-m-03", name:"Yusuf (Serious)",       nameUr:"یوسف (سنجیدہ)",          gender:"male",   age:"adult",  emotion:"serious",   voiceType:"smooth",   language:"Arabic",  accent:"Saudi",      speed:0.95, pitch:0.95  },
  { id:"ar-sa-w-01", name:"Fatima (Warm)",         nameUr:"فاطمہ (نرم)",            gender:"female", age:"adult",  emotion:"neutral",   voiceType:"soft",     language:"Arabic",  accent:"Saudi",      speed:1.00, pitch:1.15  },
  { id:"ar-eg-m-01", name:"Hassan (Egyptian)",     nameUr:"حسن (مصری)",             gender:"male",   age:"adult",  emotion:"neutral",   voiceType:"normal",   language:"Arabic",  accent:"Egyptian",   speed:1.00, pitch:1.00  },

  // ── SPECIAL / EFFECTS ────────────────────────────────────
  { id:"sp-robot-01", name:"Robot Voice",          nameUr:"روبوٹ آواز",             gender:"male",   age:"adult",  emotion:"neutral",   voiceType:"sharp",    language:"English", accent:"American",   speed:1.00, pitch:0.80, tags:["effect"]  },
  { id:"sp-narrator", name:"Documentary Narrator", nameUr:"دستاویزی نریٹر",         gender:"male",   age:"adult",  emotion:"serious",   voiceType:"smooth",   language:"English", accent:"British",    speed:0.90, pitch:0.90, tags:["narrator"], popular:true  },
  { id:"sp-news-m",   name:"News Anchor (Male)",   nameUr:"نیوز اینکر (مرد)",       gender:"male",   age:"adult",  emotion:"serious",   voiceType:"normal",   language:"English", accent:"American",   speed:1.00, pitch:1.00, tags:["news"]  },
  { id:"sp-news-w",   name:"News Anchor (Female)", nameUr:"نیوز اینکر (خاتون)",     gender:"female", age:"adult",  emotion:"serious",   voiceType:"normal",   language:"English", accent:"American",   speed:1.00, pitch:1.05, tags:["news"]  },
  { id:"sp-horror-m", name:"Horror Voice (Male)",  nameUr:"ڈراؤنی آواز (مرد)",      gender:"male",   age:"adult",  emotion:"fearful",   voiceType:"rough",    language:"English", accent:"American",   speed:0.80, pitch:0.70, tags:["effect"]  },
  { id:"sp-horror-w", name:"Horror Voice (Female)",nameUr:"ڈراؤنی آواز (عورت)",     gender:"female", age:"adult",  emotion:"fearful",   voiceType:"breathy",  language:"English", accent:"American",   speed:0.80, pitch:0.85, tags:["effect"]  },
  { id:"sp-epic-m",   name:"Epic Trailer Voice",   nameUr:"ایپک ٹریلر آواز",        gender:"male",   age:"adult",  emotion:"serious",   voiceType:"deep",     language:"English", accent:"American",   speed:0.85, pitch:0.65, tags:["effect","narrator"], popular:true  },
  { id:"sp-azan",     name:"Azan Style Voice",     nameUr:"اذان طرز کی آواز",       gender:"male",   age:"adult",  emotion:"calm",      voiceType:"melodic",  language:"Arabic",  accent:"Saudi",      speed:0.80, pitch:0.90, tags:["special"]  },
];

// ============================================================
//  CONSTANTS
// ============================================================
const EMOTION_META: Record<Emotion, { icon: string; color: string; label: string }> = {
  neutral:   { icon:"😐", color:"#6b7280", label:"غیر جانبدار" },
  happy:     { icon:"😊", color:"#f59e0b", label:"خوش"         },
  sad:       { icon:"😢", color:"#3b82f6", label:"اداس"         },
  angry:     { icon:"😠", color:"#ef4444", label:"غصہ"          },
  fearful:   { icon:"😨", color:"#8b5cf6", label:"خوف"          },
  excited:   { icon:"🤩", color:"#f97316", label:"پرجوش"        },
  calm:      { icon:"😌", color:"#10b981", label:"پرسکون"       },
  whisper:   { icon:"🤫", color:"#6366f1", label:"سرگوشی"       },
  loud:      { icon:"📢", color:"#dc2626", label:"بلند"         },
  crying:    { icon:"😭", color:"#2563eb", label:"رونا"          },
  mixed:     { icon:"😶", color:"#9ca3af", label:"ملے جلے"      },
  romantic:  { icon:"💕", color:"#ec4899", label:"رومانٹک"      },
  serious:   { icon:"🧐", color:"#374151", label:"سنجیدہ"       },
  sarcastic: { icon:"😏", color:"#7c3aed", label:"طنزیہ"        },
  surprised: { icon:"😲", color:"#d97706", label:"حیران"        },
};

const GENDER_META: Record<Gender, { icon: string; label: string; color: string }> = {
  male:   { icon:"👨", label:"مرد",      color:"#3b82f6" },
  female: { icon:"👩", label:"عورت",     color:"#ec4899" },
  boy:    { icon:"👦", label:"لڑکا",     color:"#06b6d4" },
  girl:   { icon:"👧", label:"لڑکی",     color:"#f472b6" },
};

const MAX_CHARS = 3000;

// ============================================================
//  HELPERS
// ============================================================
function groupByLanguage(list: Voice[]) {
  return list.reduce<Record<string, Voice[]>>((acc, v) => {
    (acc[v.language] ||= []).push(v);
    return acc;
  }, {});
}

// ============================================================
//  COMPONENT
// ============================================================
export default function VoiceStudioPage() {
  const router = useRouter();

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
  const [voiceTypeF, setVoiceTypeF]     = useState("all");
  const [ageF, setAgeF]                 = useState("all");
  const [popularF, setPopularF]         = useState(false);
  const [search, setSearch]             = useState("");

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }, []);

  // ── filtered voices ─────────────────────────────────────
  const filtered = VOICES.filter(v => {
    if (genderF   !== "all" && v.gender    !== genderF)    return false;
    if (emotionF  !== "all" && v.emotion   !== emotionF)   return false;
    if (languageF !== "all" && v.language  !== languageF)  return false;
    if (voiceTypeF!== "all" && v.voiceType !== voiceTypeF) return false;
    if (ageF      !== "all" && v.age       !== ageF)       return false;
    if (popularF  && !v.popular) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!v.name.toLowerCase().includes(q) && !v.nameUr.includes(q) && !v.accent.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  // ── generate ─────────────────────────────────────────────
  const generate = async () => {
    if (!text.trim()) { setError("متن درج کریں"); return; }
    setLoading(true); setError(""); setAudioUrl("");
    setProgress(0);

    // fake progress bar
    const timer = setInterval(() => setProgress(p => Math.min(p + 8, 85)), 300);

    try {
      const body = {
        text,
        voice: selectedVoice.id,
        emotion: selectedVoice.emotion,
        speed:  useCustom ? customSpeed : selectedVoice.speed,
        pitch:  useCustom ? customPitch : selectedVoice.pitch,
      };
      const res  = await fetch("/api/voice", { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Voice generation failed");
      clearInterval(timer); setProgress(100);
      setAudioUrl(data.audio);
      setActiveTab("output");
      showToast(`✅ آواز تیار — ${selectedVoice.nameUr}`);
    } catch (e) {
      clearInterval(timer);
      setError(e instanceof Error ? e.message : "خرابی پیش آئی");
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => { setText(""); setAudioUrl(""); setError(""); setProgress(0); };

  const EXAMPLES = [
    { label:"اردو ڈرامہ",   text:"میں نہیں جانتا تھا کہ زندگی اتنی مشکل ہو سکتی ہے۔ لیکن آج جب تم نے مجھے چھوڑ دیا تو سمجھ آیا کہ تنہائی کیا ہوتی ہے۔" },
    { label:"انگریزی بیان",  text:"Welcome to the future of artificial intelligence. Today, we stand at the dawn of a new era where machines can think, learn, and create." },
    { label:"بچوں کی کہانی", text:"Once upon a time, in a magical forest, there lived a little rabbit named Bunny. Bunny loved to hop around and make new friends every day." },
    { label:"خبریں",        text:"Breaking news: Scientists have made a remarkable discovery that could change the way we understand the universe forever." },
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
    fontFamily:"Tajawal, sans-serif",
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
    fontFamily:"Noto Nastaliq Urdu, serif",
    boxShadow: active ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
  });

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#667eea 0%,#764ba2 100%)", padding:"1rem 1rem 90px" }}>

      {/* ── HEADER ─────────────────────────────────────── */}
      <div style={{ paddingTop:"1rem", marginBottom:"1rem" }}>
        <button
          onClick={() => router.back()}
          style={{ background:"rgba(255,255,255,0.2)", border:"1px solid rgba(255,255,255,0.3)", padding:"7px 16px", borderRadius:40, color:"white", cursor:"pointer", marginBottom:"0.875rem", fontSize:"0.82rem" }}
        >← واپس</button>
        <h1 style={{ color:"white", margin:0, fontSize:"1.7rem", fontFamily:"Noto Nastaliq Urdu, serif" }}>🎤 Voice Studio Pro</h1>
        <p style={{ color:"rgba(255,255,255,0.8)", marginTop:"0.25rem", fontSize:"0.82rem", fontFamily:"Tajawal, sans-serif" }}>
          {VOICES.length}+ آوازیں • مرد • عورت • لڑکے • لڑکیاں • 15 جذبات • 5 زبانیں
        </p>
      </div>

      {/* ── TEXT INPUT ─────────────────────────────────── */}
      <div style={card}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.5rem" }}>
          <span style={{ fontWeight:700, fontSize:"0.85rem", fontFamily:"Noto Nastaliq Urdu, serif" }}>📝 متن درج کریں</span>
          <span style={{ fontSize:"0.7rem", color:"#9ca3af", fontFamily:"Tajawal, sans-serif" }}>{text.length}/{MAX_CHARS}</span>
        </div>
        <textarea
          value={text}
          onChange={e => setText(e.target.value.slice(0, MAX_CHARS))}
          placeholder="یہاں متن لکھیں یا مثال منتخب کریں..."
          rows={4}
          dir="auto"
          style={{ width:"100%", padding:"0.875rem", fontSize:"0.9rem", borderRadius:14, border:`1.5px solid ${text.length > MAX_CHARS * 0.9 ? "#ef4444" : "#e0e0e0"}`, fontFamily:"Noto Nastaliq Urdu, serif", resize:"vertical", outline:"none", lineHeight:1.7 }}
        />
        {/* progress bar */}
        <div style={{ height:3, background:"#f0eeff", borderRadius:3, margin:"0.5rem 0", overflow:"hidden" }}>
          <div style={{ width:`${(text.length/MAX_CHARS)*100}%`, height:"100%", background: text.length > MAX_CHARS*0.9 ? "#ef4444" : "#667eea", borderRadius:3, transition:"width .2s" }} />
        </div>

        {/* example buttons */}
        <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
          {EXAMPLES.map(ex => (
            <button key={ex.label} onClick={() => setText(ex.text)} style={pill(false)}>
              {ex.label}
            </button>
          ))}
          <button onClick={clearAll} style={{ ...pill(false), color:"#ef4444", borderColor:"#fca5a5" }}>🗑️ صاف</button>
        </div>
      </div>

      {/* ── TAB BAR ────────────────────────────────────── */}
      <div style={{ display:"flex", background:"rgba(255,255,255,0.15)", borderRadius:16, padding:4, marginBottom:"0.75rem", gap:2 }}>
        {([["voices","🎙️ آوازیں"],["settings","⚙️ سیٹنگ"],["output","🔊 آؤٹ پٹ"]] as [typeof activeTab, string][]).map(([key, label]) => (
          <button key={key} onClick={() => setActiveTab(key)} style={tabBtn(activeTab===key)}>{label}</button>
        ))}
      </div>

      {/* ── TAB: VOICES ────────────────────────────────── */}
      {activeTab === "voices" && (
        <div style={card}>
          {/* search */}
          <input
            type="text"
            placeholder="🔍 آواز تلاش کریں..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width:"100%", padding:"0.65rem 1rem", borderRadius:40, border:"1.5px solid #e0e0e0", marginBottom:"0.75rem", fontSize:"0.85rem", outline:"none", fontFamily:"Noto Nastaliq Urdu, serif" }}
          />

          {/* filter row */}
          <div style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:6, marginBottom:"0.75rem", scrollbarWidth:"none" }}>
            <button onClick={() => setPopularF(!popularF)} style={pill(popularF, "#f59e0b")}>⭐ مقبول</button>
            {(["all","male","female","boy","girl"] as const).map(g => (
              <button key={g} onClick={() => setGenderF(g)} style={pill(genderF===g)}>
                {g==="all" ? "👥 سب" : GENDER_META[g].icon+" "+GENDER_META[g].label}
              </button>
            ))}
          </div>
          <div style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:6, marginBottom:"0.75rem", scrollbarWidth:"none" }}>
            {(["all","English","Urdu","Hindi","Arabic"] as const).map(l => (
              <button key={l} onClick={() => setLanguageF(l)} style={pill(languageF===l)}>
                {l==="all"?"🌐 سب":l==="English"?"🇬🇧 Eng":l==="Urdu"?"🇵🇰 اردو":l==="Hindi"?"🇮🇳 Hindi":"🇸🇦 Arb"}
              </button>
            ))}
          </div>
          <div style={{ display:"flex", gap:6, overflowX:"auto", paddingBottom:6, marginBottom:"0.75rem", scrollbarWidth:"none" }}>
            {(Object.keys(EMOTION_META) as Emotion[]).map(em => (
              <button key={em} onClick={() => setEmotionF(emotionF===em?"all":em)} style={pill(emotionF===em, EMOTION_META[em].color)}>
                {EMOTION_META[em].icon} {EMOTION_META[em].label}
              </button>
            ))}
          </div>

          {/* voice count */}
          <div style={{ fontSize:"0.72rem", color:"#9ca3af", marginBottom:"0.5rem", fontFamily:"Tajawal, sans-serif" }}>
            {filtered.length} / {VOICES.length} آوازیں
          </div>

          {/* voice list */}
          <div style={{ maxHeight:360, overflowY:"auto", display:"flex", flexDirection:"column", gap:5 }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign:"center", padding:"2rem", color:"#9ca3af", fontSize:"0.85rem", fontFamily:"Noto Nastaliq Urdu, serif" }}>
                🔍 کوئی آواز نہیں ملی
              </div>
            ) : filtered.map(v => (
              <button
                key={v.id}
                onClick={() => { setSelectedVoice(v); showToast(`${GENDER_META[v.gender].icon} ${v.nameUr} منتخب`); }}
                style={{
                  width:"100%",
                  padding:"0.65rem 0.875rem",
                  borderRadius:12,
                  background: selectedVoice.id===v.id ? "linear-gradient(90deg,#667eea,#764ba2)" : "#f8f7ff",
                  color: selectedVoice.id===v.id ? "white" : "#1a1a2e",
                  border: selectedVoice.id===v.id ? "none" : "1px solid #ede9fe",
                  cursor:"pointer",
                  textAlign:"right",
                  direction:"rtl",
                  display:"flex",
                  justifyContent:"space-between",
                  alignItems:"center",
                  gap:8,
                }}
              >
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:"0.82rem", fontWeight:700, fontFamily:"Noto Nastaliq Urdu, serif", marginBottom:2 }}>
                    {GENDER_META[v.gender].icon} {v.nameUr}
                    {v.popular && <span style={{ marginRight:4, fontSize:"0.65rem", background:"rgba(245,158,11,0.25)", color:"#92400e", padding:"1px 5px", borderRadius:8, fontFamily:"Tajawal, sans-serif" }}>⭐</span>}
                  </div>
                  <div style={{ fontSize:"0.65rem", opacity:0.75, fontFamily:"Tajawal, sans-serif", display:"flex", gap:6, flexWrap:"wrap" }}>
                    <span>{EMOTION_META[v.emotion].icon} {v.emotion}</span>
                    <span>• {v.voiceType}</span>
                    <span>• {v.accent}</span>
                    <span>• {v.language}</span>
                  </div>
                </div>
                <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:3, flexShrink:0 }}>
                  <span style={{ fontSize:"0.65rem", background: selectedVoice.id===v.id ? "rgba(255,255,255,0.2)" : `${EMOTION_META[v.emotion].color}18`, color: selectedVoice.id===v.id ? "white" : EMOTION_META[v.emotion].color, padding:"2px 7px", borderRadius:20, fontFamily:"Tajawal, sans-serif", fontWeight:700 }}>
                    {EMOTION_META[v.emotion].icon}
                  </span>
                  {selectedVoice.id===v.id && <span style={{ fontSize:"0.7rem" }}>✅</span>}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB: SETTINGS ──────────────────────────────── */}
      {activeTab === "settings" && (
        <div style={card}>
          {/* selected voice info */}
          <div style={{ background:"#f8f7ff", borderRadius:14, padding:"0.875rem", marginBottom:"1rem", direction:"rtl" }}>
            <div style={{ fontSize:"0.8rem", fontWeight:700, color:"#4c1d95", marginBottom:4, fontFamily:"Noto Nastaliq Urdu, serif" }}>
              {GENDER_META[selectedVoice.gender].icon} منتخب آواز
            </div>
            <div style={{ fontSize:"1rem", fontWeight:700, color:"#1a1a2e", marginBottom:2, fontFamily:"Noto Nastaliq Urdu, serif" }}>{selectedVoice.nameUr}</div>
            <div style={{ fontSize:"0.7rem", color:"#6b7280", fontFamily:"Tajawal, sans-serif" }}>
              {selectedVoice.language} • {selectedVoice.accent} • {selectedVoice.emotion} • {selectedVoice.voiceType}
            </div>
          </div>

          {/* custom toggle */}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"1rem", direction:"rtl" }}>
            <span style={{ fontSize:"0.85rem", fontFamily:"Noto Nastaliq Urdu, serif", fontWeight:700 }}>⚙️ کسٹم پچ و رفتار</span>
            <button
              onClick={() => setUseCustom(!useCustom)}
              style={{ width:44, height:24, borderRadius:12, border:"none", background: useCustom ? "#667eea" : "#d1d5db", cursor:"pointer", position:"relative", transition:"background .2s" }}
            >
              <span style={{ position:"absolute", top:2, left: useCustom ? 22 : 2, width:20, height:20, borderRadius:"50%", background:"white", transition:"left .2s", display:"block" }} />
            </button>
          </div>

          {useCustom && (
            <>
              {[
                { label:"رفتار (Speed)", value:customSpeed, set:setCustomSpeed, min:0.5, max:2.0, step:0.05, fmt:(v:number)=>v.toFixed(2)+"x" },
                { label:"پچ (Pitch)",   value:customPitch, set:setCustomPitch, min:0.5, max:2.0, step:0.05, fmt:(v:number)=>v.toFixed(2)        },
              ].map(s => (
                <div key={s.label} style={{ marginBottom:"1rem", direction:"rtl" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:6 }}>
                    <span style={{ fontSize:"0.82rem", fontFamily:"Noto Nastaliq Urdu, serif" }}>{s.label}</span>
                    <span style={{ fontSize:"0.82rem", fontWeight:700, color:"#667eea", fontFamily:"Tajawal, sans-serif" }}>{s.fmt(s.value)}</span>
                  </div>
                  <input
                    type="range" min={s.min} max={s.max} step={s.step} value={s.value}
                    onChange={e => s.set(parseFloat(e.target.value))}
                    style={{ width:"100%", accentColor:"#667eea" }}
                  />
                  <div style={{ display:"flex", justifyContent:"space-between", fontSize:"0.6rem", color:"#9ca3af", fontFamily:"Tajawal, sans-serif" }}>
                    <span>🐢 سست {s.min}x</span><span>🐇 تیز {s.max}x</span>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* default values display */}
          {!useCustom && (
            <div style={{ background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:12, padding:"0.75rem", direction:"rtl" }}>
              <p style={{ fontSize:"0.78rem", color:"#166534", fontFamily:"Tajawal, sans-serif" }}>
                ✅ آواز کی پہلے سے طے شدہ قدریں استعمال ہوں گی<br/>
                Speed: {selectedVoice.speed}x &nbsp;|&nbsp; Pitch: {selectedVoice.pitch}
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── TAB: OUTPUT ────────────────────────────────── */}
      {activeTab === "output" && (
        <div style={card}>
          {audioUrl ? (
            <>
              <div style={{ background:"#f8f7ff", borderRadius:14, padding:"0.875rem", marginBottom:"1rem", direction:"rtl" }}>
                <div style={{ fontSize:"0.78rem", fontWeight:700, color:"#4c1d95", marginBottom:4, fontFamily:"Noto Nastaliq Urdu, serif" }}>
                  🎤 تیار شدہ آواز — {selectedVoice.nameUr}
                </div>
              </div>
              <audio ref={audioRef} controls src={audioUrl} style={{ width:"100%", marginBottom:"0.875rem", borderRadius:12 }} />
              <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
                <a
                  href={audioUrl} download="voice-output.mp3"
                  style={{ flex:1, padding:"0.7rem", background:"#10b981", color:"white", textDecoration:"none", borderRadius:40, fontSize:"0.82rem", fontWeight:700, textAlign:"center", fontFamily:"Tajawal, sans-serif" }}
                >💾 ڈاؤنلوڈ MP3</a>
                <button
                  onClick={() => { navigator.clipboard.writeText(audioUrl); showToast("📋 لنک کاپی ہوگیا"); }}
                  style={{ flex:1, padding:"0.7rem", background:"#3b82f6", color:"white", border:"none", borderRadius:40, fontSize:"0.82rem", fontWeight:700, cursor:"pointer", fontFamily:"Tajawal, sans-serif" }}
                >📋 لنک کاپی</button>
                <button
                  onClick={clearAll}
                  style={{ padding:"0.7rem 1rem", background:"#fee2e2", color:"#dc2626", border:"none", borderRadius:40, fontSize:"0.82rem", fontWeight:700, cursor:"pointer", fontFamily:"Tajawal, sans-serif" }}
                >🗑️ صاف</button>
              </div>
            </>
          ) : (
            <div style={{ textAlign:"center", padding:"2.5rem 1rem", direction:"rtl" }}>
              <div style={{ fontSize:"3rem", marginBottom:"0.75rem" }}>🔊</div>
              <p style={{ color:"#9ca3af", fontSize:"0.875rem", fontFamily:"Noto Nastaliq Urdu, serif" }}>
                آواز ابھی تیار نہیں — نیچے Generate بٹن دبائیں
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── GENERATE BUTTON ────────────────────────────── */}
      <div style={{ marginBottom:"0.75rem" }}>
        {loading && (
          <div style={{ marginBottom:"0.5rem" }}>
            <div style={{ height:6, background:"rgba(255,255,255,0.3)", borderRadius:3, overflow:"hidden" }}>
              <div style={{ width:`${progress}%`, height:"100%", background:"white", borderRadius:3, transition:"width .3s" }} />
            </div>
            <p style={{ color:"rgba(255,255,255,0.8)", fontSize:"0.75rem", textAlign:"center", marginTop:4, fontFamily:"Tajawal, sans-serif" }}>
              🎤 آواز تیار ہو رہی ہے... {progress}%
            </p>
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
            fontFamily:"Noto Nastaliq Urdu, serif",
            transition:"all .2s",
          }}
        >
          {loading ? "🎤 تیار ہو رہی ہے..." : `🎙️ آواز بنائیں — ${selectedVoice.nameUr}`}
        </button>
      </div>

      {/* ── ERRORS / TOAST ─────────────────────────────── */}
      {error && (
        <div style={{ background:"rgba(239,68,68,0.12)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:14, padding:"0.75rem 1rem", marginBottom:"0.75rem", direction:"rtl" }}>
          <p style={{ color:"#dc2626", fontSize:"0.82rem", fontFamily:"Noto Nastaliq Urdu, serif" }}>❌ {error}</p>
        </div>
      )}
      {toast && (
        <div style={{ position:"fixed", bottom:90, right:"50%", transform:"translateX(50%)", background:"rgba(0,0,0,0.8)", color:"white", padding:"0.6rem 1.25rem", borderRadius:40, fontSize:"0.82rem", zIndex:999, fontFamily:"Tajawal, sans-serif", whiteSpace:"nowrap" }}>
          {toast}
        </div>
      )}

      <BottomNav active="tools" onNavigate={(href) => router.push(href)} />
    </div>
  );
}