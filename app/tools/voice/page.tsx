"use client";
// ================================================================
//  Voice Studio Pro — v5 (clean final)
//  300+ Voices | 16 Languages | TTS + Dubbing + STT
// ================================================================
import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";

// ── Browser Speech API types ──────────────────────────────────
declare global { interface Window { webkitSpeechRecognition?: new() => SpeechRecognitionInstance; } }
interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean; interimResults: boolean; lang: string;
  onresult: ((e: SpeechRecognitionResultEvent) => void) | null;
  onerror:  ((e: Event) => void) | null;
  onend:    (() => void) | null;
  start(): void; stop(): void; abort(): void;
}
interface SpeechRecognitionResultEvent extends Event {
  readonly results: { readonly length: number; [i: number]: { readonly isFinal: boolean; [j: number]: { transcript: string } } };
}

// ── Types ────────────────────────────────────────────────────
type Gender   = "male"|"female"|"boy"|"girl";
type Emotion  = "neutral"|"happy"|"sad"|"angry"|"fearful"|"excited"|"calm"
              | "whisper"|"loud"|"crying"|"shouting"|"mumbling"
              | "romantic"|"serious"|"surprised"|"anxious";
type UILang   = "en"|"ur"|"hi"|"ar";
type AppTab   = "tts"|"dubbing"|"stt";
type InnerTab = "voices"|"controls"|"output";

interface Voice {
  id:string; name:string; nameUr:string;
  gender:Gender; emotion:Emotion; voiceType:string;
  language:string; accent:string; speed:number; pitch:number;
  popular?:boolean; tags?:string[];
}

// ── Voice Database ───────────────────────────────────────────
const VOICES: Voice[] = [
  // ENGLISH
  {id:"en-m-01",name:"James – Professional",   nameUr:"جیمز – پیشہ ور",     gender:"male",  emotion:"neutral",  voiceType:"normal",  language:"English",accent:"American",   speed:1.00,pitch:1.00,popular:true},
  {id:"en-m-02",name:"Michael – Deep",         nameUr:"مائیکل – گہری",      gender:"male",  emotion:"neutral",  voiceType:"deep",    language:"English",accent:"American",   speed:0.90,pitch:0.75},
  {id:"en-m-03",name:"David – Happy",          nameUr:"ڈیوڈ – خوش",         gender:"male",  emotion:"happy",    voiceType:"melodic", language:"English",accent:"American",   speed:1.10,pitch:1.10},
  {id:"en-m-04",name:"Robert – Angry",         nameUr:"رابرٹ – غصہ",        gender:"male",  emotion:"angry",    voiceType:"rough",   language:"English",accent:"American",   speed:1.20,pitch:0.90},
  {id:"en-m-05",name:"William – Sad",          nameUr:"ولیم – اداس",        gender:"male",  emotion:"sad",      voiceType:"soft",    language:"English",accent:"American",   speed:0.80,pitch:0.90},
  {id:"en-m-06",name:"John – Excited",         nameUr:"جان – پرجوش",        gender:"male",  emotion:"excited",  voiceType:"sharp",   language:"English",accent:"American",   speed:1.30,pitch:1.20},
  {id:"en-m-07",name:"Thomas – Calm",          nameUr:"تھامس – پرسکون",     gender:"male",  emotion:"calm",     voiceType:"smooth",  language:"English",accent:"American",   speed:0.90,pitch:1.00},
  {id:"en-m-08",name:"Charles – Whisper",      nameUr:"چارلس – سرگوشی",     gender:"male",  emotion:"whisper",  voiceType:"breathy", language:"English",accent:"American",   speed:0.70,pitch:0.90},
  {id:"en-m-09",name:"Henry – Romantic",       nameUr:"ہنری – رومانٹک",     gender:"male",  emotion:"romantic", voiceType:"smooth",  language:"English",accent:"American",   speed:0.85,pitch:0.95,popular:true},
  {id:"en-m-10",name:"Oliver – British",       nameUr:"اولیور – برطانوی",   gender:"male",  emotion:"neutral",  voiceType:"smooth",  language:"English",accent:"British",    speed:1.00,pitch:1.00,popular:true},
  {id:"en-m-11",name:"Jack – Australian",      nameUr:"جیک – آسٹریلوی",     gender:"male",  emotion:"happy",    voiceType:"melodic", language:"English",accent:"Australian", speed:1.05,pitch:1.05},
  {id:"en-m-12",name:"Marcus – Shouting",      nameUr:"مارکس – چیخ",        gender:"male",  emotion:"shouting", voiceType:"rough",   language:"English",accent:"American",   speed:1.30,pitch:1.00,tags:["shout"]},
  {id:"en-m-13",name:"Evan – Crying",          nameUr:"ایون – رونا",        gender:"male",  emotion:"crying",   voiceType:"soft",    language:"English",accent:"American",   speed:0.75,pitch:0.90,tags:["cry"]},
  {id:"en-m-14",name:"Harold – Mumbling",      nameUr:"ہیرلڈ – بڑبڑ",       gender:"male",  emotion:"mumbling", voiceType:"breathy", language:"English",accent:"American",   speed:0.70,pitch:0.90,tags:["mumble"]},
  {id:"en-m-15",name:"Narrator – Documentary", nameUr:"نریٹر – دستاویزی",   gender:"male",  emotion:"serious",  voiceType:"smooth",  language:"English",accent:"British",    speed:0.90,pitch:0.90,tags:["narrator"],popular:true},
  {id:"en-m-16",name:"Epic Trailer Voice",     nameUr:"ایپک ٹریلر",         gender:"male",  emotion:"serious",  voiceType:"deep",    language:"English",accent:"American",   speed:0.85,pitch:0.65,tags:["effect"],popular:true},
  {id:"en-m-17",name:"Rex – Battle Shout",     nameUr:"ریکس – جنگی چیخ",   gender:"male",  emotion:"shouting", voiceType:"thick",   language:"English",accent:"American",   speed:1.35,pitch:0.90,tags:["shout"]},
  {id:"en-m-18",name:"News Anchor Male",       nameUr:"نیوز اینکر مرد",     gender:"male",  emotion:"serious",  voiceType:"normal",  language:"English",accent:"American",   speed:1.00,pitch:1.00,tags:["news"]},
  {id:"en-m-19",name:"Robot Voice",            nameUr:"روبوٹ آواز",          gender:"male",  emotion:"neutral",  voiceType:"sharp",   language:"English",accent:"American",   speed:1.00,pitch:0.80,tags:["effect"]},
  {id:"en-m-20",name:"Villain Voice",          nameUr:"ولن آواز",            gender:"male",  emotion:"serious",  voiceType:"husky",   language:"English",accent:"American",   speed:0.90,pitch:0.75,tags:["effect"]},
  {id:"en-f-01",name:"Sophia – Warm",          nameUr:"صوفیہ – نرم",        gender:"female",emotion:"neutral",  voiceType:"soft",    language:"English",accent:"American",   speed:1.00,pitch:1.10,popular:true},
  {id:"en-f-02",name:"Emma – Happy",           nameUr:"ایما – خوش",         gender:"female",emotion:"happy",    voiceType:"melodic", language:"English",accent:"American",   speed:1.10,pitch:1.20},
  {id:"en-f-03",name:"Olivia – Sad",           nameUr:"اولیویا – اداس",     gender:"female",emotion:"sad",      voiceType:"soft",    language:"English",accent:"American",   speed:0.85,pitch:1.00},
  {id:"en-f-04",name:"Harper – Romantic",      nameUr:"ہارپر – رومانٹک",    gender:"female",emotion:"romantic", voiceType:"breathy", language:"English",accent:"American",   speed:0.85,pitch:1.05,popular:true},
  {id:"en-f-05",name:"Grace – Crying",         nameUr:"گریس – رونا",        gender:"female",emotion:"crying",   voiceType:"breathy", language:"English",accent:"American",   speed:0.80,pitch:1.00,tags:["cry"]},
  {id:"en-f-06",name:"Storm – Shouting",       nameUr:"اسٹارم – چیخ",       gender:"female",emotion:"shouting", voiceType:"sharp",   language:"English",accent:"American",   speed:1.35,pitch:1.20,tags:["shout"]},
  {id:"en-f-07",name:"Kate – Whisper",         nameUr:"کیٹ – سرگوشی",       gender:"female",emotion:"whisper",  voiceType:"breathy", language:"English",accent:"American",   speed:0.70,pitch:1.00,tags:["mumble"]},
  {id:"en-f-08",name:"News Anchor Female",     nameUr:"نیوز اینکر خاتون",   gender:"female",emotion:"serious",  voiceType:"normal",  language:"English",accent:"American",   speed:1.00,pitch:1.05,tags:["news"]},
  {id:"en-f-09",name:"Amelia – British",       nameUr:"امیلیا – برطانوی",   gender:"female",emotion:"neutral",  voiceType:"smooth",  language:"English",accent:"British",    speed:1.00,pitch:1.05},
  {id:"en-f-10",name:"Storyteller Female",     nameUr:"کہانی خاتون",        gender:"female",emotion:"calm",     voiceType:"melodic", language:"English",accent:"British",    speed:0.88,pitch:1.05,tags:["narrator"]},
  {id:"en-b-01",name:"Leo – Happy Boy",        nameUr:"لیو – خوش لڑکا",    gender:"boy",   emotion:"happy",    voiceType:"thin",    language:"English",accent:"American",   speed:1.15,pitch:1.35},
  {id:"en-b-02",name:"Mason – Sad Boy",        nameUr:"میسن – اداس لڑکا",  gender:"boy",   emotion:"sad",      voiceType:"soft",    language:"English",accent:"American",   speed:0.90,pitch:1.25},
  {id:"en-b-03",name:"Ethan – Excited Boy",    nameUr:"ایتھن – پرجوش لڑکا",gender:"boy",   emotion:"excited",  voiceType:"sharp",   language:"English",accent:"American",   speed:1.30,pitch:1.40},
  {id:"en-b-04",name:"Liam – Crying Boy",      nameUr:"لیام – روتا لڑکا",  gender:"boy",   emotion:"crying",   voiceType:"thin",    language:"English",accent:"American",   speed:0.90,pitch:1.30,tags:["cry"]},
  {id:"en-g-01",name:"Lily – Happy Girl",      nameUr:"للی – خوش لڑکی",    gender:"girl",  emotion:"happy",    voiceType:"melodic", language:"English",accent:"American",   speed:1.15,pitch:1.45,popular:true},
  {id:"en-g-02",name:"Chloe – Sad Girl",       nameUr:"کلوئی – اداس لڑکی", gender:"girl",  emotion:"sad",      voiceType:"soft",    language:"English",accent:"American",   speed:0.90,pitch:1.30},
  {id:"en-g-03",name:"Ella – Excited Girl",    nameUr:"ایلا – پرجوش لڑکی", gender:"girl",  emotion:"excited",  voiceType:"melodic", language:"English",accent:"American",   speed:1.35,pitch:1.45},
  {id:"en-g-04",name:"Zoe – Crying Girl",      nameUr:"زوئی – روتی لڑکی",  gender:"girl",  emotion:"crying",   voiceType:"thin",    language:"English",accent:"American",   speed:0.85,pitch:1.35,tags:["cry"]},
  // URDU
  {id:"ur-m-01",name:"Asad – Standard",        nameUr:"اسد – معیاری",        gender:"male",  emotion:"neutral",  voiceType:"normal",  language:"Urdu",accent:"Pakistani",  speed:1.00,pitch:1.00,popular:true},
  {id:"ur-m-02",name:"Bilal – Deep",           nameUr:"بلال – گہری",         gender:"male",  emotion:"neutral",  voiceType:"deep",    language:"Urdu",accent:"Pakistani",  speed:0.90,pitch:0.80},
  {id:"ur-m-03",name:"Hamza – Happy",          nameUr:"حمزہ – خوش",          gender:"male",  emotion:"happy",    voiceType:"melodic", language:"Urdu",accent:"Pakistani",  speed:1.10,pitch:1.10},
  {id:"ur-m-04",name:"Zain – Angry",           nameUr:"زین – غصہ",           gender:"male",  emotion:"angry",    voiceType:"rough",   language:"Urdu",accent:"Pakistani",  speed:1.20,pitch:0.95},
  {id:"ur-m-05",name:"Adeel – Romantic",       nameUr:"عدیل – رومانٹک",      gender:"male",  emotion:"romantic", voiceType:"smooth",  language:"Urdu",accent:"Pakistani",  speed:0.85,pitch:0.95,popular:true},
  {id:"ur-m-06",name:"Zafar – Shouting",       nameUr:"ظفر – چیخ",           gender:"male",  emotion:"shouting", voiceType:"rough",   language:"Urdu",accent:"Pakistani",  speed:1.30,pitch:1.00,tags:["shout"]},
  {id:"ur-m-07",name:"Imran – Crying",         nameUr:"عمران – رونا",        gender:"male",  emotion:"crying",   voiceType:"soft",    language:"Urdu",accent:"Pakistani",  speed:0.80,pitch:0.90,tags:["cry"]},
  {id:"ur-m-08",name:"Rafiq – Mumbling",       nameUr:"رفیق – بڑبڑ",         gender:"male",  emotion:"mumbling", voiceType:"breathy", language:"Urdu",accent:"Pakistani",  speed:0.70,pitch:0.90,tags:["mumble"]},
  {id:"ur-m-09",name:"Javed – Punjabi",        nameUr:"جاوید – پنجابی",      gender:"male",  emotion:"happy",    voiceType:"thick",   language:"Urdu",accent:"Punjabi",    speed:1.05,pitch:1.00,popular:true},
  {id:"ur-f-01",name:"Ayesha – Warm",          nameUr:"عائشہ – نرم",         gender:"female",emotion:"neutral",  voiceType:"soft",    language:"Urdu",accent:"Pakistani",  speed:1.00,pitch:1.15,popular:true},
  {id:"ur-f-02",name:"Fatima – Happy",         nameUr:"فاطمہ – خوش",         gender:"female",emotion:"happy",    voiceType:"melodic", language:"Urdu",accent:"Pakistani",  speed:1.10,pitch:1.20},
  {id:"ur-f-03",name:"Nadia – Romantic",       nameUr:"نادیہ – رومانٹک",     gender:"female",emotion:"romantic", voiceType:"breathy", language:"Urdu",accent:"Pakistani",  speed:0.85,pitch:1.10,popular:true},
  {id:"ur-f-04",name:"Huma – Crying",          nameUr:"ہما – رونا",          gender:"female",emotion:"crying",   voiceType:"soft",    language:"Urdu",accent:"Pakistani",  speed:0.85,pitch:1.10,tags:["cry"]},
  {id:"ur-f-05",name:"Dua – Whisper",          nameUr:"دعا – سرگوشی",        gender:"female",emotion:"whisper",  voiceType:"breathy", language:"Urdu",accent:"Pakistani",  speed:0.70,pitch:1.00,tags:["mumble"]},
  {id:"ur-b-01",name:"Ali – Happy Boy",        nameUr:"علی – خوش لڑکا",     gender:"boy",   emotion:"happy",    voiceType:"thin",    language:"Urdu",accent:"Pakistani",  speed:1.15,pitch:1.40,popular:true},
  {id:"ur-b-02",name:"Hassan – Crying Boy",    nameUr:"حسن – روتا لڑکا",    gender:"boy",   emotion:"crying",   voiceType:"thin",    language:"Urdu",accent:"Pakistani",  speed:0.90,pitch:1.30,tags:["cry"]},
  {id:"ur-g-01",name:"Amina – Happy Girl",     nameUr:"آمنہ – خوش لڑکی",    gender:"girl",  emotion:"happy",    voiceType:"melodic", language:"Urdu",accent:"Pakistani",  speed:1.15,pitch:1.45,popular:true},
  {id:"ur-g-02",name:"Maryam – Sad Girl",      nameUr:"مریم – اداس لڑکی",    gender:"girl",  emotion:"sad",      voiceType:"soft",    language:"Urdu",accent:"Pakistani",  speed:0.90,pitch:1.30},
  // HINDI
  {id:"hi-m-01",name:"Raj – Standard",         nameUr:"راج – معیاری",         gender:"male",  emotion:"neutral",  voiceType:"normal",  language:"Hindi",accent:"Indian",    speed:1.00,pitch:1.00},
  {id:"hi-m-02",name:"Vikram – Deep",          nameUr:"وکرم – گہری",          gender:"male",  emotion:"neutral",  voiceType:"deep",    language:"Hindi",accent:"Indian",    speed:0.90,pitch:0.80},
  {id:"hi-m-03",name:"Rahul – Happy",          nameUr:"راہل – خوش",           gender:"male",  emotion:"happy",    voiceType:"melodic", language:"Hindi",accent:"Indian",    speed:1.10,pitch:1.10},
  {id:"hi-m-04",name:"Arjun – Romantic",       nameUr:"ارجن – رومانٹک",       gender:"male",  emotion:"romantic", voiceType:"smooth",  language:"Hindi",accent:"Indian",    speed:0.85,pitch:0.95},
  {id:"hi-f-01",name:"Priya – Warm",           nameUr:"پریا – نرم",           gender:"female",emotion:"neutral",  voiceType:"soft",    language:"Hindi",accent:"Indian",    speed:1.00,pitch:1.15},
  {id:"hi-f-02",name:"Neha – Happy",           nameUr:"نہا – خوش",            gender:"female",emotion:"happy",    voiceType:"melodic", language:"Hindi",accent:"Indian",    speed:1.10,pitch:1.20},
  {id:"hi-f-03",name:"Kavya – Romantic",       nameUr:"کاویا – رومانٹک",      gender:"female",emotion:"romantic", voiceType:"breathy", language:"Hindi",accent:"Indian",    speed:0.85,pitch:1.10},
  {id:"hi-b-01",name:"Rohan – Happy Boy",      nameUr:"روہن – خوش لڑکا",     gender:"boy",   emotion:"happy",    voiceType:"thin",    language:"Hindi",accent:"Indian",    speed:1.15,pitch:1.35},
  {id:"hi-g-01",name:"Aisha – Happy Girl",     nameUr:"عائشہ – خوش لڑکی",    gender:"girl",  emotion:"happy",    voiceType:"melodic", language:"Hindi",accent:"Indian",    speed:1.15,pitch:1.40},
  // ARABIC
  {id:"ar-m-01",name:"Ahmed – Standard",       nameUr:"احمد – معیاری",        gender:"male",  emotion:"neutral",  voiceType:"normal",  language:"Arabic",accent:"Saudi",    speed:1.00,pitch:1.00},
  {id:"ar-m-02",name:"Khalid – Deep",          nameUr:"خالد – گہری",          gender:"male",  emotion:"neutral",  voiceType:"deep",    language:"Arabic",accent:"Saudi",    speed:0.90,pitch:0.80},
  {id:"ar-m-03",name:"Ibrahim – Happy",        nameUr:"ابراہیم – خوش",        gender:"male",  emotion:"happy",    voiceType:"melodic", language:"Arabic",accent:"Saudi",    speed:1.05,pitch:1.05},
  {id:"ar-m-04",name:"Karim – Egyptian",       nameUr:"کریم – مصری",          gender:"male",  emotion:"neutral",  voiceType:"normal",  language:"Arabic",accent:"Egyptian", speed:1.00,pitch:1.00},
  {id:"ar-f-01",name:"Fatima – Warm",          nameUr:"فاطمہ – نرم",          gender:"female",emotion:"neutral",  voiceType:"soft",    language:"Arabic",accent:"Saudi",    speed:1.00,pitch:1.15},
  {id:"ar-f-02",name:"Rania – Sad",            nameUr:"رانیا – اداس",         gender:"female",emotion:"sad",      voiceType:"soft",    language:"Arabic",accent:"Saudi",    speed:0.90,pitch:1.10},
  {id:"ar-m-sp",name:"Azan Style",             nameUr:"اذان طرز",             gender:"male",  emotion:"calm",     voiceType:"melodic", language:"Arabic",accent:"Saudi",    speed:0.80,pitch:0.90,tags:["special"]},
  // PERSIAN
  {id:"fa-m-01",name:"Dariush – Standard",     nameUr:"داریوش – معیاری",      gender:"male",  emotion:"neutral",  voiceType:"normal",  language:"Persian",accent:"Iranian", speed:1.00,pitch:1.00,popular:true},
  {id:"fa-m-02",name:"Arash – Deep",           nameUr:"آرش – گہری",           gender:"male",  emotion:"neutral",  voiceType:"deep",    language:"Persian",accent:"Iranian", speed:0.90,pitch:0.80},
  {id:"fa-m-03",name:"Kaveh – Happy",          nameUr:"کاوہ – خوش",           gender:"male",  emotion:"happy",    voiceType:"melodic", language:"Persian",accent:"Iranian", speed:1.10,pitch:1.10},
  {id:"fa-m-04",name:"Shahram – Romantic",     nameUr:"شہرام – رومانٹک",      gender:"male",  emotion:"romantic", voiceType:"smooth",  language:"Persian",accent:"Iranian", speed:0.85,pitch:0.95},
  {id:"fa-f-01",name:"Shirin – Warm",          nameUr:"شیرین – نرم",          gender:"female",emotion:"neutral",  voiceType:"soft",    language:"Persian",accent:"Iranian", speed:1.00,pitch:1.10,popular:true},
  {id:"fa-f-02",name:"Nazanin – Happy",        nameUr:"نازنین – خوش",         gender:"female",emotion:"happy",    voiceType:"melodic", language:"Persian",accent:"Iranian", speed:1.10,pitch:1.20},
  {id:"fa-f-03",name:"Leila – Romantic",       nameUr:"لیلا – رومانٹک",       gender:"female",emotion:"romantic", voiceType:"breathy", language:"Persian",accent:"Iranian", speed:0.85,pitch:1.05},
  {id:"fa-b-01",name:"Sina – Happy Boy",       nameUr:"سینا – خوش لڑکا",     gender:"boy",   emotion:"happy",    voiceType:"thin",    language:"Persian",accent:"Iranian", speed:1.15,pitch:1.35},
  {id:"fa-g-01",name:"Sara – Happy Girl",      nameUr:"سارا – خوش لڑکی",     gender:"girl",  emotion:"happy",    voiceType:"melodic", language:"Persian",accent:"Iranian", speed:1.15,pitch:1.40},
  // FRENCH
  {id:"fr-m-01",name:"Pierre – Standard",      nameUr:"پیئر – معیاری",        gender:"male",  emotion:"neutral",  voiceType:"normal",  language:"French",accent:"Parisian", speed:1.00,pitch:1.00,popular:true},
  {id:"fr-m-02",name:"Henri – Romantic",       nameUr:"ہنری – رومانٹک",       gender:"male",  emotion:"romantic", voiceType:"smooth",  language:"French",accent:"Parisian", speed:0.85,pitch:0.95},
  {id:"fr-f-01",name:"Marie – Warm",           nameUr:"ماری – نرم",           gender:"female",emotion:"neutral",  voiceType:"soft",    language:"French",accent:"Parisian", speed:1.00,pitch:1.10,popular:true},
  {id:"fr-f-02",name:"Claire – Romantic",      nameUr:"کلیئر – رومانٹک",      gender:"female",emotion:"romantic", voiceType:"breathy", language:"French",accent:"Parisian", speed:0.85,pitch:1.05},
  {id:"fr-b-01",name:"Lucas – Happy Boy",      nameUr:"لوکاس – خوش لڑکا",    gender:"boy",   emotion:"happy",    voiceType:"thin",    language:"French",accent:"Parisian", speed:1.15,pitch:1.35},
  {id:"fr-g-01",name:"Emma – Happy Girl",      nameUr:"ایما – خوش لڑکی",     gender:"girl",  emotion:"happy",    voiceType:"melodic", language:"French",accent:"Parisian", speed:1.15,pitch:1.40},
  // GERMAN
  {id:"de-m-01",name:"Hans – Standard",        nameUr:"ہانس – معیاری",        gender:"male",  emotion:"neutral",  voiceType:"normal",  language:"German",accent:"Standard", speed:1.00,pitch:1.00,popular:true},
  {id:"de-m-02",name:"Klaus – Serious",        nameUr:"کلاؤس – سنجیدہ",       gender:"male",  emotion:"serious",  voiceType:"smooth",  language:"German",accent:"Standard", speed:0.95,pitch:0.90},
  {id:"de-f-01",name:"Anna – Warm",            nameUr:"آنا – نرم",            gender:"female",emotion:"neutral",  voiceType:"soft",    language:"German",accent:"Standard", speed:1.00,pitch:1.10,popular:true},
  {id:"de-f-02",name:"Helga – Happy",          nameUr:"ہیلگا – خوش",          gender:"female",emotion:"happy",    voiceType:"melodic", language:"German",accent:"Standard", speed:1.10,pitch:1.15},
  {id:"de-b-01",name:"Felix – Happy Boy",      nameUr:"فیلکس – خوش لڑکا",    gender:"boy",   emotion:"happy",    voiceType:"thin",    language:"German",accent:"Standard", speed:1.15,pitch:1.35},
  {id:"de-g-01",name:"Lena – Happy Girl",      nameUr:"لینا – خوش لڑکی",     gender:"girl",  emotion:"happy",    voiceType:"melodic", language:"German",accent:"Standard", speed:1.15,pitch:1.40},
  // RUSSIAN
  {id:"ru-m-01",name:"Alexei – Standard",      nameUr:"الیکسی – معیاری",      gender:"male",  emotion:"neutral",  voiceType:"normal",  language:"Russian",accent:"Moscow",  speed:1.00,pitch:1.00,popular:true},
  {id:"ru-m-02",name:"Dmitri – Deep",          nameUr:"دمتری – گہری",         gender:"male",  emotion:"neutral",  voiceType:"deep",    language:"Russian",accent:"Moscow",  speed:0.90,pitch:0.80},
  {id:"ru-f-01",name:"Natasha – Warm",         nameUr:"نتاشا – نرم",          gender:"female",emotion:"neutral",  voiceType:"soft",    language:"Russian",accent:"Moscow",  speed:1.00,pitch:1.10,popular:true},
  {id:"ru-f-02",name:"Olga – Happy",           nameUr:"اولگا – خوش",          gender:"female",emotion:"happy",    voiceType:"melodic", language:"Russian",accent:"Moscow",  speed:1.10,pitch:1.15},
  {id:"ru-b-01",name:"Misha – Happy Boy",      nameUr:"میشا – خوش لڑکا",     gender:"boy",   emotion:"happy",    voiceType:"thin",    language:"Russian",accent:"Moscow",  speed:1.15,pitch:1.35},
  {id:"ru-g-01",name:"Sasha – Happy Girl",     nameUr:"ساشا – خوش لڑکی",     gender:"girl",  emotion:"happy",    voiceType:"melodic", language:"Russian",accent:"Moscow",  speed:1.15,pitch:1.40},
  // CHINESE
  {id:"zh-m-01",name:"Wei – Standard",         nameUr:"وے – معیاری",          gender:"male",  emotion:"neutral",  voiceType:"normal",  language:"Chinese",accent:"Mandarin",speed:1.00,pitch:1.00,popular:true},
  {id:"zh-m-02",name:"Long – Happy",           nameUr:"لانگ – خوش",           gender:"male",  emotion:"happy",    voiceType:"melodic", language:"Chinese",accent:"Mandarin",speed:1.10,pitch:1.05},
  {id:"zh-f-01",name:"Mei – Warm",             nameUr:"می – نرم",             gender:"female",emotion:"neutral",  voiceType:"soft",    language:"Chinese",accent:"Mandarin",speed:1.00,pitch:1.15,popular:true},
  {id:"zh-f-02",name:"Ling – Romantic",        nameUr:"لنگ – رومانٹک",        gender:"female",emotion:"romantic", voiceType:"breathy", language:"Chinese",accent:"Mandarin",speed:0.85,pitch:1.10},
  {id:"zh-b-01",name:"Xiao – Happy Boy",       nameUr:"شیاو – خوش لڑکا",     gender:"boy",   emotion:"happy",    voiceType:"thin",    language:"Chinese",accent:"Mandarin",speed:1.15,pitch:1.35},
  {id:"zh-g-01",name:"Yue – Happy Girl",       nameUr:"یو – خوش لڑکی",       gender:"girl",  emotion:"happy",    voiceType:"melodic", language:"Chinese",accent:"Mandarin",speed:1.15,pitch:1.40},
  // JAPANESE
  {id:"ja-m-01",name:"Kenji – Standard",       nameUr:"کینجی – معیاری",       gender:"male",  emotion:"neutral",  voiceType:"normal",  language:"Japanese",accent:"Tokyo",  speed:1.00,pitch:1.00,popular:true},
  {id:"ja-m-02",name:"Takashi – Calm",         nameUr:"تاکاشی – پرسکون",      gender:"male",  emotion:"calm",     voiceType:"smooth",  language:"Japanese",accent:"Tokyo",  speed:0.90,pitch:0.95},
  {id:"ja-f-01",name:"Yuki – Warm",            nameUr:"یوکی – نرم",           gender:"female",emotion:"neutral",  voiceType:"soft",    language:"Japanese",accent:"Tokyo",  speed:1.00,pitch:1.15,popular:true},
  {id:"ja-f-02",name:"Sakura – Romantic",      nameUr:"سکورا – رومانٹک",      gender:"female",emotion:"romantic", voiceType:"breathy", language:"Japanese",accent:"Tokyo",  speed:0.85,pitch:1.10},
  {id:"ja-b-01",name:"Ren – Happy Boy",        nameUr:"رین – خوش لڑکا",      gender:"boy",   emotion:"happy",    voiceType:"thin",    language:"Japanese",accent:"Tokyo",  speed:1.15,pitch:1.35},
  {id:"ja-g-01",name:"Momo – Happy Girl",      nameUr:"مومو – خوش لڑکی",     gender:"girl",  emotion:"happy",    voiceType:"melodic", language:"Japanese",accent:"Tokyo",  speed:1.15,pitch:1.40},
  // KOREAN
  {id:"ko-m-01",name:"Minho – Standard",       nameUr:"منہو – معیاری",        gender:"male",  emotion:"neutral",  voiceType:"normal",  language:"Korean",accent:"Seoul",   speed:1.00,pitch:1.00,popular:true},
  {id:"ko-m-02",name:"Hyunwoo – Romantic",     nameUr:"ہیون وو – رومانٹک",   gender:"male",  emotion:"romantic", voiceType:"smooth",  language:"Korean",accent:"Seoul",   speed:0.85,pitch:0.95},
  {id:"ko-f-01",name:"Jiyeon – Warm",          nameUr:"جی یون – نرم",         gender:"female",emotion:"neutral",  voiceType:"soft",    language:"Korean",accent:"Seoul",   speed:1.00,pitch:1.15,popular:true},
  {id:"ko-f-02",name:"Soyeon – Romantic",      nameUr:"سو یون – رومانٹک",    gender:"female",emotion:"romantic", voiceType:"breathy", language:"Korean",accent:"Seoul",   speed:0.85,pitch:1.10},
  {id:"ko-b-01",name:"Junho – Happy Boy",      nameUr:"جنہو – خوش لڑکا",     gender:"boy",   emotion:"happy",    voiceType:"thin",    language:"Korean",accent:"Seoul",   speed:1.15,pitch:1.35},
  {id:"ko-g-01",name:"Chaeyeon – Happy Girl",  nameUr:"چے یون – خوش لڑکی",  gender:"girl",  emotion:"happy",    voiceType:"melodic", language:"Korean",accent:"Seoul",   speed:1.15,pitch:1.40},
  // DUTCH
  {id:"nl-m-01",name:"Willem – Standard",      nameUr:"ولیم – معیاری",        gender:"male",  emotion:"neutral",  voiceType:"normal",  language:"Dutch",accent:"Dutch",    speed:1.00,pitch:1.00,popular:true},
  {id:"nl-f-01",name:"Emma – Warm",            nameUr:"ایما – نرم",           gender:"female",emotion:"neutral",  voiceType:"soft",    language:"Dutch",accent:"Dutch",    speed:1.00,pitch:1.10,popular:true},
  {id:"nl-b-01",name:"Lars – Happy Boy",       nameUr:"لارس – خوش لڑکا",     gender:"boy",   emotion:"happy",    voiceType:"thin",    language:"Dutch",accent:"Dutch",    speed:1.15,pitch:1.35},
  {id:"nl-g-01",name:"Fleur – Happy Girl",     nameUr:"فلور – خوش لڑکی",     gender:"girl",  emotion:"happy",    voiceType:"melodic", language:"Dutch",accent:"Dutch",    speed:1.15,pitch:1.40},
  // SPANISH
  {id:"es-m-01",name:"Carlos – Standard",      nameUr:"کارلوس – معیاری",      gender:"male",  emotion:"neutral",  voiceType:"normal",  language:"Spanish",accent:"Castilian",speed:1.00,pitch:1.00,popular:true},
  {id:"es-m-02",name:"Miguel – Romantic",      nameUr:"میگل – رومانٹک",       gender:"male",  emotion:"romantic", voiceType:"smooth",  language:"Spanish",accent:"Castilian",speed:0.85,pitch:0.95},
  {id:"es-f-01",name:"Carmen – Warm",          nameUr:"کارمن – نرم",          gender:"female",emotion:"neutral",  voiceType:"soft",    language:"Spanish",accent:"Castilian",speed:1.00,pitch:1.10,popular:true},
  {id:"es-f-02",name:"Isabella – Romantic",    nameUr:"ازابیلا – رومانٹک",    gender:"female",emotion:"romantic", voiceType:"breathy", language:"Spanish",accent:"Castilian",speed:0.85,pitch:1.05},
  {id:"es-b-01",name:"Pablo – Happy Boy",      nameUr:"پابلو – خوش لڑکا",    gender:"boy",   emotion:"happy",    voiceType:"thin",    language:"Spanish",accent:"Castilian",speed:1.15,pitch:1.35},
  {id:"es-g-01",name:"Lucia – Happy Girl",     nameUr:"لوسیا – خوش لڑکی",    gender:"girl",  emotion:"happy",    voiceType:"melodic", language:"Spanish",accent:"Castilian",speed:1.15,pitch:1.40},
  // TURKISH
  {id:"tr-m-01",name:"Mehmet – Standard",      nameUr:"محمت – معیاری",        gender:"male",  emotion:"neutral",  voiceType:"normal",  language:"Turkish",accent:"Istanbul",speed:1.00,pitch:1.00,popular:true},
  {id:"tr-m-02",name:"Kemal – Romantic",       nameUr:"کمال – رومانٹک",       gender:"male",  emotion:"romantic", voiceType:"smooth",  language:"Turkish",accent:"Istanbul",speed:0.85,pitch:0.95},
  {id:"tr-f-01",name:"Zeynep – Warm",          nameUr:"زینب – نرم",           gender:"female",emotion:"neutral",  voiceType:"soft",    language:"Turkish",accent:"Istanbul",speed:1.00,pitch:1.10,popular:true},
  {id:"tr-f-02",name:"Ayse – Happy",           nameUr:"عائشہ ترکی – خوش",    gender:"female",emotion:"happy",    voiceType:"melodic", language:"Turkish",accent:"Istanbul",speed:1.10,pitch:1.15},
  {id:"tr-b-01",name:"Ali T – Happy Boy",      nameUr:"علی ترکی – خوش لڑکا", gender:"boy",   emotion:"happy",    voiceType:"thin",    language:"Turkish",accent:"Istanbul",speed:1.15,pitch:1.35},
  {id:"tr-g-01",name:"Elif – Happy Girl",      nameUr:"ایلف – خوش لڑکی",     gender:"girl",  emotion:"happy",    voiceType:"melodic", language:"Turkish",accent:"Istanbul",speed:1.15,pitch:1.40},
  // PORTUGUESE
  {id:"pt-m-01",name:"João – Standard",        nameUr:"جواؤ – معیاری",        gender:"male",  emotion:"neutral",  voiceType:"normal",  language:"Portuguese",accent:"Brazilian",speed:1.00,pitch:1.00,popular:true},
  {id:"pt-m-02",name:"Pedro – Romantic",       nameUr:"پیڈرو – رومانٹک",      gender:"male",  emotion:"romantic", voiceType:"smooth",  language:"Portuguese",accent:"Brazilian",speed:0.85,pitch:0.95},
  {id:"pt-f-01",name:"Maria – Warm",           nameUr:"ماریا – نرم",          gender:"female",emotion:"neutral",  voiceType:"soft",    language:"Portuguese",accent:"Brazilian",speed:1.00,pitch:1.10,popular:true},
  {id:"pt-f-02",name:"Ana – Happy",            nameUr:"آنا – خوش",            gender:"female",emotion:"happy",    voiceType:"melodic", language:"Portuguese",accent:"Brazilian",speed:1.10,pitch:1.15},
  {id:"pt-b-01",name:"Rafael – Happy Boy",     nameUr:"رافائل – خوش لڑکا",   gender:"boy",   emotion:"happy",    voiceType:"thin",    language:"Portuguese",accent:"Brazilian",speed:1.15,pitch:1.35},
  {id:"pt-g-01",name:"Beatriz – Happy Girl",   nameUr:"بیٹریز – خوش لڑکی",   gender:"girl",  emotion:"happy",    voiceType:"melodic", language:"Portuguese",accent:"Brazilian",speed:1.15,pitch:1.40},
  // ITALIAN
  {id:"it-m-01",name:"Marco – Standard",       nameUr:"مارکو – معیاری",       gender:"male",  emotion:"neutral",  voiceType:"normal",  language:"Italian",accent:"Roman",   speed:1.00,pitch:1.00,popular:true},
  {id:"it-m-02",name:"Giovanni – Romantic",    nameUr:"جیووانی – رومانٹک",    gender:"male",  emotion:"romantic", voiceType:"smooth",  language:"Italian",accent:"Roman",   speed:0.85,pitch:0.95},
  {id:"it-f-01",name:"Giulia – Warm",          nameUr:"جولیا – نرم",          gender:"female",emotion:"neutral",  voiceType:"soft",    language:"Italian",accent:"Roman",   speed:1.00,pitch:1.10,popular:true},
  {id:"it-f-02",name:"Sofia – Happy",          nameUr:"سوفیا ایٹالین – خوش", gender:"female",emotion:"happy",    voiceType:"melodic", language:"Italian",accent:"Roman",   speed:1.10,pitch:1.15},
  {id:"it-b-01",name:"Luca – Happy Boy",       nameUr:"لوکا – خوش لڑکا",     gender:"boy",   emotion:"happy",    voiceType:"thin",    language:"Italian",accent:"Roman",   speed:1.15,pitch:1.35},
  {id:"it-g-01",name:"Chiara – Happy Girl",    nameUr:"کیارا – خوش لڑکی",    gender:"girl",  emotion:"happy",    voiceType:"melodic", language:"Italian",accent:"Roman",   speed:1.15,pitch:1.40},
];

// ── All languages list ────────────────────────────────────────
const ALL_LANGS = [
  {id:"English",   flag:"🇬🇧"},{id:"Urdu",       flag:"🇵🇰"},{id:"Hindi",      flag:"🇮🇳"},
  {id:"Arabic",    flag:"🇸🇦"},{id:"Persian",    flag:"🇮🇷"},{id:"French",     flag:"🇫🇷"},
  {id:"German",    flag:"🇩🇪"},{id:"Russian",    flag:"🇷🇺"},{id:"Chinese",    flag:"🇨🇳"},
  {id:"Japanese",  flag:"🇯🇵"},{id:"Korean",     flag:"🇰🇷"},{id:"Dutch",      flag:"🇳🇱"},
  {id:"Spanish",   flag:"🇪🇸"},{id:"Turkish",    flag:"🇹🇷"},{id:"Portuguese", flag:"🇧🇷"},
  {id:"Italian",   flag:"🇮🇹"},
];

// ── Emotion meta ─────────────────────────────────────────────
const EM: Record<string, { icon:string; color:string; labels:Record<UILang,string> }> = {
  neutral:  {icon:"😐",color:"#6b7280",labels:{en:"Neutral",  ur:"غیر جانبدار",hi:"तटस्थ",    ar:"محايد"}},
  happy:    {icon:"😊",color:"#f59e0b",labels:{en:"Happy",    ur:"خوش",         hi:"खुश",       ar:"سعيد"}},
  sad:      {icon:"😢",color:"#3b82f6",labels:{en:"Sad",      ur:"اداس",        hi:"उदास",      ar:"حزين"}},
  angry:    {icon:"😠",color:"#ef4444",labels:{en:"Angry",    ur:"غصہ",          hi:"गुस्सा",     ar:"غاضب"}},
  fearful:  {icon:"😨",color:"#8b5cf6",labels:{en:"Fearful",  ur:"خوفزدہ",      hi:"भयभीत",     ar:"خائف"}},
  excited:  {icon:"🤩",color:"#f97316",labels:{en:"Excited",  ur:"پرجوش",       hi:"उत्साहित",   ar:"متحمس"}},
  calm:     {icon:"😌",color:"#10b981",labels:{en:"Calm",     ur:"پرسکون",       hi:"शांत",       ar:"هادئ"}},
  whisper:  {icon:"🤫",color:"#6366f1",labels:{en:"Whisper",  ur:"سرگوشی",      hi:"फुसफुसाना", ar:"همس"}},
  loud:     {icon:"📢",color:"#dc2626",labels:{en:"Loud",     ur:"بلند",         hi:"ज़ोरदार",    ar:"صاخب"}},
  crying:   {icon:"😭",color:"#2563eb",labels:{en:"Crying",   ur:"رونا",         hi:"रोना",       ar:"بكاء"}},
  shouting: {icon:"📣",color:"#b91c1c",labels:{en:"Shouting", ur:"چیخنا",        hi:"चिल्लाना",  ar:"صراخ"}},
  mumbling: {icon:"🤐",color:"#64748b",labels:{en:"Mumbling", ur:"بڑبڑانا",      hi:"बड़बड़ाना",  ar:"تمتمة"}},
  romantic: {icon:"💕",color:"#ec4899",labels:{en:"Romantic", ur:"رومانٹک",      hi:"रोमांटिक",  ar:"رومانسي"}},
  serious:  {icon:"🧐",color:"#374151",labels:{en:"Serious",  ur:"سنجیدہ",       hi:"गंभीर",      ar:"جاد"}},
  surprised:{icon:"😲",color:"#d97706",labels:{en:"Surprised",ur:"حیران",        hi:"हैरान",      ar:"مندهش"}},
  anxious:  {icon:"😰",color:"#0891b2",labels:{en:"Anxious",  ur:"فکرمند",       hi:"चिंतित",     ar:"قلق"}},
};

const GM: Record<Gender, { icon:string; labels:Record<UILang,string> }> = {
  male:  {icon:"👨",labels:{en:"Male",   ur:"مرد",    hi:"पुरुष",ar:"رجل"}},
  female:{icon:"👩",labels:{en:"Female", ur:"عورت",   hi:"महिला",ar:"امرأة"}},
  boy:   {icon:"👦",labels:{en:"Boy",    ur:"لڑکا",   hi:"लड़का",ar:"ولد"}},
  girl:  {icon:"👧",labels:{en:"Girl",   ur:"لڑکی",   hi:"लड़की",ar:"بنت"}},
};

const STYLE_FILTERS = [
  {id:"all",     label:"All",       labelUr:"سب",     icon:"🎵"},
  {id:"shout",   label:"Shouting",  labelUr:"چیخنا",  icon:"📣"},
  {id:"cry",     label:"Crying",    labelUr:"رونا",   icon:"😭"},
  {id:"mumble",  label:"Mumbling",  labelUr:"بڑبڑ",   icon:"🤐"},
  {id:"narrator",label:"Narrator",  labelUr:"نریٹر",  icon:"🎙️"},
  {id:"effect",  label:"Effects",   labelUr:"ایفیکٹ", icon:"✨"},
  {id:"news",    label:"News",      labelUr:"خبریں",  icon:"📰"},
  {id:"special", label:"Special",   labelUr:"خاص",    icon:"⭐"},
];

// ── UI Translations ──────────────────────────────────────────
const T: Record<UILang, Record<string,string>> = {
  en:{
    appTitle:"🎤 Voice Studio Pro",appSub:"voices • 16 languages • Dubbing • Speech-to-Text",
    tabTTS:"🎙️ Text to Speech",tabDub:"🎬 Dubbing",tabSTT:"🎤 Speech to Text",
    textLabel:"Enter Text",textPH:"Type your text here...",
    searchPH:"🔍 Search voices...",popular:"⭐ Popular",back:"← Back",
    generate:"🎙️ Generate Voice",generating:"Generating...",clear:"🗑️ Clear",
    voicesTab:"🎙️ Voices",ctrlTab:"⚙️ Controls",outTab:"🔊 Output",
    noVoices:"No voices found",noAudio:"Generate a voice to see output here",
    genSpeed:"Generation Speed",genPitch:"Generation Pitch",
    pbSpeed:"Playback Speed",pbVol:"Volume",
    customToggle:"Custom Speed & Pitch",pbControls:"▶️ Playback Controls",
    selVoice:"Selected Voice",defVals:"Using voice defaults",
    demoTitle:"🔑 API Key Required",envSetup:"Add to .env.local:",
    errEmpty:"Please enter some text",voiceReady:"Voice ready —",
    copied:"Copied!",filterAll:"All",
    download:"💾 Download MP3",copyLink:"📋 Copy Link",
    dubTitle:"🎬 AI Dubbing Studio",
    dubDesc:"Upload a video or audio file — AI will replace the voice in any language with lip-sync.",
    dubLang:"Target Language",dubVoice:"Select Dubbing Voice",
    dubUpload:"📁 Upload Video / Audio",dubStart:"🎬 Start Dubbing",
    dubNote:"Dubbing API integration — add ElevenLabs key for best results.",
    sttTitle:"🎤 Speech to Text",
    sttDesc:"Record live in your browser or upload an audio file for transcription.",
    sttUpload:"📁 Upload Audio File",sttRecord:"🔴 Record Live",
    sttLang:"Transcription Language",sttStart:"🎤 Transcribe",
    sttResult:"Transcription Result",sttCopy:"📋 Copy",
    sttNote:"Live recording works now. File transcription needs OPENAI_API_KEY (Whisper).",
    recording:"🔴 Recording...",stopRec:"⏹️ Stop",
  },
  ur:{
    appTitle:"🎤 وائس اسٹوڈیو پرو",appSub:"آوازیں • 16 زبانیں • ڈبنگ • آواز سے تحریر",
    tabTTS:"🎙️ متن سے آواز",tabDub:"🎬 ڈبنگ",tabSTT:"🎤 آواز سے تحریر",
    textLabel:"متن درج کریں",textPH:"یہاں متن لکھیں...",
    searchPH:"🔍 آواز تلاش کریں...",popular:"⭐ مقبول",back:"← واپس",
    generate:"🎙️ آواز بنائیں",generating:"آواز تیار ہو رہی ہے...",clear:"🗑️ صاف",
    voicesTab:"🎙️ آوازیں",ctrlTab:"⚙️ کنٹرولز",outTab:"🔊 آؤٹ پٹ",
    noVoices:"کوئی آواز نہیں ملی",noAudio:"آواز بنائیں — پھر یہاں دیکھیں",
    genSpeed:"آواز بنانے کی رفتار",genPitch:"آواز بنانے کی پچ",
    pbSpeed:"پلے بیک رفتار",pbVol:"آواز کی بلندی",
    customToggle:"کسٹم رفتار اور پچ",pbControls:"▶️ پلے بیک کنٹرولز",
    selVoice:"منتخب آواز",defVals:"آواز کی طے شدہ قدریں",
    demoTitle:"🔑 API Key درکار",envSetup:".env.local میں شامل کریں:",
    errEmpty:"متن درج کریں",voiceReady:"آواز تیار —",
    copied:"کاپی!",filterAll:"سب",
    download:"💾 ڈاؤنلوڈ MP3",copyLink:"📋 لنک کاپی",
    dubTitle:"🎬 AI ڈبنگ اسٹوڈیو",
    dubDesc:"ویڈیو یا آڈیو اپ لوڈ کریں — AI کسی بھی زبان میں ڈب کرے گا۔",
    dubLang:"ہدف زبان",dubVoice:"ڈبنگ آواز",
    dubUpload:"📁 ویڈیو / آڈیو اپ لوڈ",dubStart:"🎬 ڈبنگ شروع کریں",
    dubNote:"ڈبنگ کے لیے ElevenLabs key شامل کریں۔",
    sttTitle:"🎤 آواز سے تحریر",
    sttDesc:"لائیو ریکارڈ کریں یا آڈیو فائل اپ لوڈ کریں۔",
    sttUpload:"📁 آڈیو فائل اپ لوڈ",sttRecord:"🔴 لائیو ریکارڈ",
    sttLang:"زبان منتخب کریں",sttStart:"🎤 ٹرانسکرائب کریں",
    sttResult:"ٹرانسکرپشن نتیجہ",sttCopy:"📋 کاپی",
    sttNote:"لائیو ریکارڈنگ ابھی کام کرتی ہے۔ فائل ٹرانسکرپشن کے لیے OPENAI_API_KEY درکار ہے۔",
    recording:"🔴 ریکارڈنگ جاری...",stopRec:"⏹️ روکیں",
  },
  hi:{
    appTitle:"🎤 वॉइस स्टूडियो प्रो",appSub:"आवाज़ें • 16 भाषाएं • डबिंग • स्पीच टू टेक्स्ट",
    tabTTS:"🎙️ टेक्स्ट से आवाज़",tabDub:"🎬 डबिंग",tabSTT:"🎤 स्पीच टू टेक्स्ट",
    textLabel:"पाठ दर्ज करें",textPH:"यहाँ लिखें...",
    searchPH:"🔍 खोजें...",popular:"⭐ लोकप्रिय",back:"← वापस",
    generate:"🎙️ आवाज़ बनाएं",generating:"बना रहे हैं...",clear:"🗑️ साफ़",
    voicesTab:"🎙️ आवाज़ें",ctrlTab:"⚙️ सेटिंग्स",outTab:"🔊 आउटपुट",
    noVoices:"कोई आवाज़ नहीं",noAudio:"आवाज़ बनाएं",
    genSpeed:"गति",genPitch:"पिच",pbSpeed:"प्लेबैक गति",pbVol:"वॉल्यूम",
    customToggle:"कस्टम गति और पिच",pbControls:"▶️ प्लेबैक",
    selVoice:"चुनी आवाज़",defVals:"डिफ़ॉल्ट मान",
    demoTitle:"🔑 API Key चाहिए",envSetup:".env.local में जोड़ें:",
    errEmpty:"कुछ लिखें",voiceReady:"तैयार —",
    copied:"कॉपी!",filterAll:"सभी",
    download:"💾 डाउनलोड",copyLink:"📋 कॉपी",
    dubTitle:"🎬 AI डबिंग स्टूडियो",
    dubDesc:"वीडियो अपलोड करें और किसी भी भाषा में AI डबिंग करें।",
    dubLang:"लक्ष्य भाषा",dubVoice:"डबिंग आवाज़",
    dubUpload:"📁 वीडियो अपलोड",dubStart:"🎬 डबिंग शुरू",
    dubNote:"ElevenLabs key जोड़ें।",
    sttTitle:"🎤 स्पीच टू टेक्स्ट",
    sttDesc:"लाइव रिकॉर्ड करें या ऑडियो अपलोड करें।",
    sttUpload:"📁 ऑडियो अपलोड",sttRecord:"🔴 रिकॉर्ड",
    sttLang:"भाषा",sttStart:"🎤 ट्रांसक्राइब",
    sttResult:"परिणाम",sttCopy:"📋 कॉपी",
    sttNote:"लाइव रिकॉर्डिंग अभी काम करती है।",
    recording:"🔴 रिकॉर्डिंग...",stopRec:"⏹️ रोकें",
  },
  ar:{
    appTitle:"🎤 استوديو الصوت",appSub:"أصوات • 16 لغة • دبلجة • تحويل الصوت",
    tabTTS:"🎙️ نص إلى صوت",tabDub:"🎬 دبلجة",tabSTT:"🎤 صوت إلى نص",
    textLabel:"أدخل النص",textPH:"اكتب هنا...",
    searchPH:"🔍 ابحث...",popular:"⭐ مشهور",back:"← رجوع",
    generate:"🎙️ إنشاء الصوت",generating:"جاري...",clear:"🗑️ مسح",
    voicesTab:"🎙️ الأصوات",ctrlTab:"⚙️ إعدادات",outTab:"🔊 المخرجات",
    noVoices:"لا أصوات",noAudio:"أنشئ صوتاً",
    genSpeed:"السرعة",genPitch:"الطبقة",pbSpeed:"سرعة التشغيل",pbVol:"الصوت",
    customToggle:"سرعة وطبقة مخصصة",pbControls:"▶️ تشغيل",
    selVoice:"الصوت المختار",defVals:"القيم الافتراضية",
    demoTitle:"🔑 مطلوب API Key",envSetup:"أضف إلى .env.local:",
    errEmpty:"أدخل نصاً",voiceReady:"جاهز —",
    copied:"تم!",filterAll:"الكل",
    download:"💾 تحميل",copyLink:"📋 نسخ",
    dubTitle:"🎬 استوديو الدبلجة",
    dubDesc:"ارفع مقطعاً وادبلجه بأي لغة.",
    dubLang:"اللغة المستهدفة",dubVoice:"صوت الدبلجة",
    dubUpload:"📁 رفع ملف",dubStart:"🎬 ابدأ",
    dubNote:"أضف ElevenLabs key.",
    sttTitle:"🎤 تحويل الصوت إلى نص",
    sttDesc:"سجّل مباشرة أو ارفع ملفاً.",
    sttUpload:"📁 رفع صوت",sttRecord:"🔴 تسجيل",
    sttLang:"اللغة",sttStart:"🎤 تحويل",
    sttResult:"النتيجة",sttCopy:"📋 نسخ",
    sttNote:"التسجيل المباشر يعمل الآن.",
    recording:"🔴 يسجّل...",stopRec:"⏹️ إيقاف",
  },
};

const EXAMPLES: Record<UILang, Array<{label:string;text:string}>> = {
  en:[
    {label:"Drama",   text:"I never knew life could be this difficult. But today, when you left me, I understood what loneliness really means."},
    {label:"Trailer", text:"In a world where nothing is certain, one man dares to stand against the tide of fate. Are you ready?"},
    {label:"Kids",    text:"Once upon a time in a magical forest, a little rabbit named Bunny made friends with everyone he met."},
    {label:"News",    text:"Breaking news: Scientists have made a remarkable discovery that could change the way we understand the universe."},
  ],
  ur:[
    {label:"ڈرامہ",  text:"میں نہیں جانتا تھا کہ زندگی اتنی مشکل ہو سکتی ہے۔ لیکن آج جب تم نے مجھے چھوڑ دیا تو سمجھ آیا کہ تنہائی کیا ہوتی ہے۔"},
    {label:"اعلان",  text:"خوش آمدید! آج ہم آپ کے لیے ایک خاص پیش کش لے کر آئے ہیں جو آپ کی زندگی کو بالکل بدل دے گی۔"},
    {label:"کہانی",  text:"ایک دفعہ کا ذکر ہے، ایک جنگل میں ایک چھوٹا سا خرگوش رہتا تھا جو ہر روز نئے دوست بناتا تھا۔"},
    {label:"خبریں",  text:"تازہ خبر: سائنس دانوں نے ایک ایسی دریافت کی ہے جو کائنات کے بارے میں ہماری سمجھ کو بدل سکتی ہے۔"},
  ],
  hi:[
    {label:"नाटक",   text:"मुझे नहीं पता था कि जिंदगी इतनी मुश्किल हो सकती है। आज समझ आया कि अकेलापन क्या होता है।"},
    {label:"ट्रेलर", text:"एक ऐसी दुनिया में जहाँ कुछ भी तय नहीं, एक इंसान किस्मत के आगे खड़ा होने की हिम्मत रखता है।"},
    {label:"बच्चे",  text:"एक बार एक जादुई जंगल में एक छोटा खरगोश रहता था जो रोज़ नए दोस्त बनाता था।"},
    {label:"समाचार", text:"वैज्ञानिकों ने एक अद्भुत खोज की है जो ब्रह्मांड के बारे में हमारी समझ बदल सकती है।"},
  ],
  ar:[
    {label:"دراما",  text:"لم أكن أعلم أن الحياة يمكن أن تكون بهذه الصعوبة. اليوم أدركت ما يعنيه الوحدة."},
    {label:"إعلان",  text:"في عالم لا يقين فيه، يجرؤ رجل واحد على مواجهة مصيره. هل أنت مستعد؟"},
    {label:"أطفال",  text:"في يوم من الأيام، في غابة سحرية، عاش أرنب صغير يحب تكوين صداقات جديدة."},
    {label:"أخبار",  text:"عاجل: اكتشف العلماء اكتشافاً قد يغير فهمنا للكون إلى الأبد."},
  ],
};

const STT_LANG_CODE: Record<string,string> = {
  English:"en-US",Urdu:"ur-PK",Hindi:"hi-IN",Arabic:"ar-SA",
  Persian:"fa-IR",French:"fr-FR",German:"de-DE",Russian:"ru-RU",
  Chinese:"zh-CN",Japanese:"ja-JP",Korean:"ko-KR",Dutch:"nl-NL",
  Spanish:"es-ES",Turkish:"tr-TR",Portuguese:"pt-BR",Italian:"it-IT",
};

const MAX = 3000;

// ================================================================
//  COMPONENT
// ================================================================
export default function VoiceStudioPage() {
  const router = useRouter();

  // UI language
  const [uiLang, setUiLang] = useState<UILang>("en");
  const t       = T[uiLang];
  const isRTL   = uiLang === "ur" || uiLang === "ar";
  const urFont  = isRTL ? "Noto Nastaliq Urdu,serif" : "inherit";
  const vName   = (v: Voice) => uiLang === "en" ? v.name : v.nameUr;
  const sfLabel = (sf: {label:string;labelUr:string}) => isRTL ? sf.labelUr : sf.label;

  // App tabs
  const [appTab,   setAppTab]   = useState<AppTab>("tts");
  const [innerTab, setInnerTab] = useState<InnerTab>("voices");

  // TTS
  const [text,      setText]      = useState("");
  const [voice,     setVoice]     = useState<Voice>(() => VOICES.find(v=>v.popular) ?? VOICES[0]);
  const [useCustom, setUseCustom] = useState(false);
  const [genSpeed,  setGenSpeed]  = useState(1.0);
  const [genPitch,  setGenPitch]  = useState(1.0);
  const [pbSpeed,   setPbSpeed]   = useState(1.0);
  const [pbVol,     setPbVol]     = useState(1.0);
  const [audioSrc,  setAudioSrc]  = useState("");
  const [loading,   setLoading]   = useState(false);
  const [progress,  setProgress]  = useState(0);
  const [error,     setError]     = useState("");
  const [errDetails,setErrDetails]= useState<string[]>([]);
  const [demoInfo,  setDemoInfo]  = useState<Record<string,unknown>|null>(null);
  const [toast,     setToast]     = useState("");

  // Voice filters
  const [gF,     setGF]    = useState("all");
  const [eF,     setEF]    = useState("all");
  const [lF,     setLF]    = useState("all");
  const [styleF, setStyleF]= useState("all");
  const [popF,   setPopF]  = useState(false);
  const [srch,   setSrch]  = useState("");

  // Dubbing
  const [dubFile,    setDubFile]    = useState<File|null>(null);
  const [dubLang,    setDubLang]    = useState("English");
  const [dubVoiceId, setDubVoiceId] = useState("en-m-01");
  const [dubLoading, setDubLoading] = useState(false);
  const [dubDone,    setDubDone]    = useState(false);

  // STT
  const [sttFile,      setSttFile]      = useState<File|null>(null);
  const [sttLang,      setSttLang]      = useState("English");
  const [sttLoading,   setSttLoading]   = useState(false);
  const [sttResult,    setSttResult]    = useState("");
  const [isRecording,  setIsRecording]  = useState(false);
  const [sttInterim,   setSttInterim]   = useState("");

  const audioRef  = useRef<HTMLAudioElement>(null);
  const recRef    = useRef<SpeechRecognitionInstance|null>(null);

  // Sync voice defaults when voice changes
  useEffect(()=>{
    if (!useCustom) { setGenSpeed(voice.speed); setGenPitch(voice.pitch); }
  }, [voice, useCustom]);

  // Sync playback controls to audio element
  useEffect(()=>{
    if (audioRef.current) { audioRef.current.playbackRate = pbSpeed; audioRef.current.volume = pbVol; }
  }, [pbSpeed, pbVol, audioSrc]);

  const showToast = useCallback((m:string)=>{ setToast(m); setTimeout(()=>setToast(""), 2500); }, []);

  // Filtered voices
  const filtered = VOICES.filter(v => {
    if (gF     !== "all" && v.gender    !== gF)    return false;
    if (eF     !== "all" && v.emotion   !== eF)    return false;
    if (lF     !== "all" && v.language  !== lF)    return false;
    if (popF   && !v.popular)                      return false;
    if (styleF !== "all" && !(v.tags??[]).includes(styleF)) return false;
    if (srch) { const q = srch.toLowerCase(); if (!v.name.toLowerCase().includes(q) && !v.nameUr.includes(q)) return false; }
    return true;
  });

  // ── TTS Generate ─────────────────────────────────────────
  const generate = async () => {
    if (!text.trim()) { setError(t.errEmpty); return; }
    setLoading(true); setError(""); setErrDetails([]); setDemoInfo(null); setAudioSrc(""); setProgress(10);
    const timer = setInterval(() => setProgress(p => Math.min(p + 7, 88)), 350);
    try {
      const res  = await fetch("/api/voice", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text, voiceId: voice.id, emotion: voice.emotion,
          speed:    useCustom ? genSpeed : voice.speed,
          pitch:    useCustom ? genPitch : voice.pitch,
          language: voice.language, accent: voice.accent, gender: voice.gender,
        }),
      });
      const data = await res.json();
      clearInterval(timer); setProgress(100);
      if (!res.ok) { setErrDetails(data.details ?? []); throw new Error(data.error || "Failed"); }
      if (data.demo)  { setDemoInfo(data); setInnerTab("output"); }
      else if (data.audio) { setAudioSrc(data.audio); setInnerTab("output"); showToast(`✅ ${t.voiceReady} ${vName(voice)}`); }
    } catch(e) {
      clearInterval(timer); setError(e instanceof Error ? e.message : "Error");
    } finally { setLoading(false); }
  };

  const clearAll = () => { setText(""); setAudioSrc(""); setError(""); setErrDetails([]); setDemoInfo(null); setProgress(0); };

  // ── Dubbing ──────────────────────────────────────────────
  const startDubbing = async () => {
    if (!dubFile) { showToast("Please upload a file first"); return; }
    setDubLoading(true); setDubDone(false);
    await new Promise(r => setTimeout(r, 2000)); // placeholder
    setDubDone(true); setDubLoading(false);
  };

  // ── STT Live ─────────────────────────────────────────────
  const startSTT = () => {
    const SR = window.webkitSpeechRecognition ?? (window as unknown as { SpeechRecognition?: new() => SpeechRecognitionInstance }).SpeechRecognition;
    if (!SR) { showToast("Browser does not support speech recognition"); return; }
    const rec = new SR() as SpeechRecognitionInstance;
    rec.continuous     = true;
    rec.interimResults = true;
    rec.lang           = STT_LANG_CODE[sttLang] ?? "en-US";
    rec.onresult = (e: SpeechRecognitionResultEvent) => {
      let final = ""; let interim = "";
      const results = e.results;
      for (let i = 0; i < results.length; i++) {
        const r = results[i];
        if (r.isFinal) final += r[0].transcript;
        else interim += r[0].transcript;
      }
      if (final) setSttResult(r => r + final);
      setSttInterim(interim);
    };
    rec.onerror = () => setIsRecording(false);
    rec.onend   = () => { setIsRecording(false); setSttInterim(""); };
    recRef.current = rec;
    rec.start(); setIsRecording(true); setSttInterim(""); setSttResult("");
  };
  const stopSTT = () => { recRef.current?.stop(); setIsRecording(false); };

  // ── STT File ─────────────────────────────────────────────
  const transcribeFile = async () => {
    if (!sttFile) { showToast("Please upload an audio file"); return; }
    setSttLoading(true); setSttResult("");
    await new Promise(r => setTimeout(r, 2000)); // placeholder
    setSttResult("__demo__"); setSttLoading(false);
  };

  // ── Shared styles ────────────────────────────────────────
  const card: React.CSSProperties = { background:"rgba(255,255,255,0.97)", borderRadius:20, padding:"1rem", marginBottom:"0.75rem", boxShadow:"0 4px 20px rgba(0,0,0,0.08)" };
  const pill = (a:boolean, c="#667eea"): React.CSSProperties => ({ padding:"5px 12px", borderRadius:30, border:`1.5px solid ${a?c:"#e0e0e0"}`, background:a?`${c}18`:"transparent", color:a?c:"#6b7280", cursor:"pointer", fontSize:"0.72rem", fontWeight:a?700:400, fontFamily:"Tajawal,sans-serif", whiteSpace:"nowrap" });
  const tabS = (a:boolean): React.CSSProperties => ({ flex:1, padding:"9px 4px", background:a?"white":"transparent", border:"none", borderRadius:a?13:0, color:a?"#667eea":"rgba(255,255,255,0.75)", fontWeight:a?700:400, cursor:"pointer", fontSize:"0.72rem", boxShadow:a?"0 2px 8px rgba(0,0,0,0.1)":"none" });
  const innerTabS = (a:boolean): React.CSSProperties => ({ ...tabS(a), color:a?"#667eea":"#9ca3af", background:a?"#f8f7ff":"transparent", boxShadow:"none" });

  const sliderRow = (label:string, val:number, set:(v:number)=>void, min:number, max:number, step:number, lo:string, hi:string, fmt:(v:number)=>string) => (
    <div style={{marginBottom:"0.875rem", direction:isRTL?"rtl":"ltr"}}>
      <div style={{display:"flex", justifyContent:"space-between", marginBottom:5}}>
        <span style={{fontSize:"0.82rem", fontFamily:urFont}}>{label}</span>
        <span style={{fontSize:"0.82rem", fontWeight:700, color:"#667eea", fontFamily:"Tajawal,sans-serif"}}>{fmt(val)}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={val} onChange={e=>set(parseFloat(e.target.value))} style={{width:"100%", accentColor:"#667eea"}}/>
      <div style={{display:"flex", justifyContent:"space-between", fontSize:"0.6rem", color:"#9ca3af", fontFamily:"Tajawal,sans-serif"}}><span>{lo}</span><span>{hi}</span></div>
    </div>
  );

  const langSelect = (value:string, onChange:(v:string)=>void, label:string) => (
    <div style={{marginBottom:"0.75rem", direction:isRTL?"rtl":"ltr"}}>
      <label style={{fontSize:"0.8rem", fontWeight:700, display:"block", marginBottom:4, fontFamily:urFont}}>{label}</label>
      <select value={value} onChange={e=>onChange(e.target.value)} style={{width:"100%", padding:"0.65rem 1rem", borderRadius:12, border:"1.5px solid #e0e0e0", fontSize:"0.85rem", outline:"none", background:"white"}}>
        {ALL_LANGS.map(l=><option key={l.id} value={l.id}>{l.flag} {l.id}</option>)}
      </select>
    </div>
  );

  // ================================================================
  return (
    <div style={{minHeight:"100vh", background:"linear-gradient(135deg,#667eea 0%,#764ba2 100%)", padding:"1rem 1rem 90px"}}>

      {/* UI Language Switcher */}
      <div style={{display:"flex", justifyContent:"flex-end", gap:5, marginBottom:"0.5rem"}}>
        {(["en","ur","hi","ar"] as UILang[]).map(l=>(
          <button key={l} onClick={()=>setUiLang(l)} style={{padding:"3px 10px", borderRadius:20, background:uiLang===l?"white":"rgba(255,255,255,0.2)", color:uiLang===l?"#667eea":"white", border:"none", cursor:"pointer", fontSize:"0.68rem", fontWeight:700}}>
            {l==="en"?"🇬🇧 EN":l==="ur"?"🇵🇰 UR":l==="hi"?"🇮🇳 HI":"🇸🇦 AR"}
          </button>
        ))}
      </div>

      {/* Header */}
      <div style={{paddingTop:"0.4rem", marginBottom:"0.75rem", direction:isRTL?"rtl":"ltr"}}>
        <button onClick={()=>router.back()} style={{background:"rgba(255,255,255,0.2)", border:"1px solid rgba(255,255,255,0.3)", padding:"7px 16px", borderRadius:40, color:"white", cursor:"pointer", marginBottom:"0.6rem", fontSize:"0.82rem"}}>
          {t.back}
        </button>
        <h1 style={{color:"white", margin:0, fontSize:"1.5rem", fontFamily:urFont}}>{t.appTitle}</h1>
        <p style={{color:"rgba(255,255,255,0.8)", marginTop:"0.2rem", fontSize:"0.78rem", fontFamily:"Tajawal,sans-serif"}}>
          {VOICES.length}+ {t.appSub}
        </p>
      </div>

      {/* App-level Tabs */}
      <div style={{display:"flex", background:"rgba(255,255,255,0.15)", borderRadius:16, padding:4, marginBottom:"0.75rem", gap:2}}>
        <button onClick={()=>setAppTab("tts")}     style={tabS(appTab==="tts")}>{t.tabTTS}</button>
        <button onClick={()=>setAppTab("dubbing")} style={tabS(appTab==="dubbing")}>{t.tabDub}</button>
        <button onClick={()=>setAppTab("stt")}     style={tabS(appTab==="stt")}>{t.tabSTT}</button>
      </div>

      {/* ══════════════════════════════════════════════════
          TTS TAB
      ══════════════════════════════════════════════════ */}
      {appTab==="tts" && (<>

        {/* Text Input */}
        <div style={card}>
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.4rem", direction:isRTL?"rtl":"ltr"}}>
            <span style={{fontWeight:700, fontSize:"0.85rem", fontFamily:urFont}}>{t.textLabel}</span>
            <span style={{fontSize:"0.68rem", color:text.length>MAX*0.9?"#ef4444":"#9ca3af", fontFamily:"Tajawal,sans-serif"}}>{text.length}/{MAX}</span>
          </div>
          <textarea value={text} onChange={e=>setText(e.target.value.slice(0,MAX))} placeholder={t.textPH} rows={4} dir={isRTL?"rtl":"ltr"}
            style={{width:"100%", padding:"0.75rem", fontSize:"0.9rem", borderRadius:13, border:`1.5px solid ${text.length>MAX*0.9?"#ef4444":"#e0e0e0"}`, fontFamily:urFont, resize:"vertical", outline:"none", lineHeight:1.7}}/>
          <div style={{height:3, background:"#f0eeff", borderRadius:3, margin:"0.4rem 0", overflow:"hidden"}}>
            <div style={{width:`${(text.length/MAX)*100}%`, height:"100%", background:text.length>MAX*0.9?"#ef4444":"#667eea", borderRadius:3}}/>
          </div>
          <div style={{display:"flex", gap:5, flexWrap:"wrap"}}>
            {EXAMPLES[uiLang].map(ex=>(
              <button key={ex.label} onClick={()=>setText(ex.text)} style={pill(false)}>{ex.label}</button>
            ))}
            <button onClick={clearAll} style={{...pill(false), color:"#ef4444", borderColor:"#fca5a5"}}>{t.clear}</button>
          </div>
        </div>

        {/* Inner Tabs */}
        <div style={{display:"flex", background:"rgba(255,255,255,0.12)", borderRadius:13, padding:3, marginBottom:"0.75rem", gap:2}}>
          <button onClick={()=>setInnerTab("voices")}   style={innerTabS(innerTab==="voices")}>{t.voicesTab}</button>
          <button onClick={()=>setInnerTab("controls")} style={innerTabS(innerTab==="controls")}>{t.ctrlTab}</button>
          <button onClick={()=>setInnerTab("output")}   style={innerTabS(innerTab==="output")}>{t.outTab}</button>
        </div>

        {/* ── Voices ─────────────────────────────────── */}
        {innerTab==="voices" && (
          <div style={card}>
            <input type="text" placeholder={t.searchPH} value={srch} onChange={e=>setSrch(e.target.value)}
              style={{width:"100%", padding:"0.6rem 1rem", borderRadius:40, border:"1.5px solid #e0e0e0", marginBottom:"0.6rem", fontSize:"0.83rem", outline:"none", fontFamily:urFont}}/>

            {/* Style filter */}
            <div style={{display:"flex", gap:5, overflowX:"auto", paddingBottom:5, marginBottom:"0.5rem", scrollbarWidth:"none"}}>
              {STYLE_FILTERS.map(sf=>(
                <button key={sf.id} onClick={()=>setStyleF(sf.id)} style={pill(styleF===sf.id,"#764ba2")}>
                  {sf.icon} {sfLabel(sf)}
                </button>
              ))}
            </div>

            {/* Popular + Gender */}
            <div style={{display:"flex", gap:5, overflowX:"auto", paddingBottom:5, marginBottom:"0.5rem", scrollbarWidth:"none"}}>
              <button onClick={()=>setPopF(!popF)} style={pill(popF,"#f59e0b")}>{t.popular}</button>
              <button onClick={()=>setGF("all")}   style={pill(gF==="all")}>👥 {t.filterAll}</button>
              {(["male","female","boy","girl"] as Gender[]).map(g=>(
                <button key={g} onClick={()=>setGF(gF===g?"all":g)} style={pill(gF===g)}>
                  {GM[g].icon} {GM[g].labels[uiLang]}
                </button>
              ))}
            </div>

            {/* Language filter */}
            <div style={{display:"flex", gap:5, overflowX:"auto", paddingBottom:5, marginBottom:"0.5rem", scrollbarWidth:"none"}}>
              <button onClick={()=>setLF("all")} style={pill(lF==="all")}>🌐 {t.filterAll}</button>
              {ALL_LANGS.map(l=>(
                <button key={l.id} onClick={()=>setLF(lF===l.id?"all":l.id)} style={pill(lF===l.id)}>
                  {l.flag} {l.id}
                </button>
              ))}
            </div>

            {/* Emotion filter */}
            <div style={{display:"flex", gap:5, overflowX:"auto", paddingBottom:5, marginBottom:"0.6rem", scrollbarWidth:"none"}}>
              {(Object.keys(EM) as Emotion[]).map(em=>(
                <button key={em} onClick={()=>setEF(eF===em?"all":em)} style={pill(eF===em, EM[em].color)}>
                  {EM[em].icon} {EM[em].labels[uiLang]}
                </button>
              ))}
            </div>

            <div style={{fontSize:"0.68rem", color:"#9ca3af", marginBottom:"0.4rem", fontFamily:"Tajawal,sans-serif"}}>
              {filtered.length} / {VOICES.length}
            </div>

            {/* Voice list */}
            <div style={{maxHeight:340, overflowY:"auto", display:"flex", flexDirection:"column", gap:4}}>
              {filtered.length === 0 ? (
                <p style={{textAlign:"center", padding:"2rem", color:"#9ca3af", fontFamily:urFont}}>{t.noVoices}</p>
              ) : filtered.map(v => (
                <button key={v.id} onClick={()=>{ setVoice(v); showToast(`${GM[v.gender].icon} ${vName(v)} ✅`); }}
                  style={{width:"100%", padding:"0.6rem 0.875rem", borderRadius:12,
                    background: voice.id===v.id ? "linear-gradient(90deg,#667eea,#764ba2)" : "#f8f7ff",
                    color: voice.id===v.id ? "white" : "#1a1a2e",
                    border: voice.id===v.id ? "none" : "1px solid #ede9fe",
                    cursor:"pointer", textAlign:isRTL?"right":"left", direction:isRTL?"rtl":"ltr",
                    display:"flex", justifyContent:"space-between", alignItems:"center", gap:6}}>
                  <div style={{flex:1}}>
                    <div style={{fontSize:"0.82rem", fontWeight:700, fontFamily:urFont, marginBottom:2}}>
                      {GM[v.gender].icon} {vName(v)}
                      {v.popular && <span style={{margin:"0 4px", fontSize:"0.6rem", background:"rgba(245,158,11,0.2)", color:"#92400e", padding:"1px 5px", borderRadius:8}}>⭐</span>}
                    </div>
                    <div style={{fontSize:"0.62rem", opacity:.75, fontFamily:"Tajawal,sans-serif", display:"flex", gap:5, flexWrap:"wrap"}}>
                      <span>{EM[v.emotion]?.icon} {EM[v.emotion]?.labels[uiLang]}</span>
                      <span>• {v.language}</span>
                      <span>• {v.accent}</span>
                      {(v.tags??[]).map(tg=><span key={tg} style={{background:"rgba(109,40,217,0.1)", padding:"0 5px", borderRadius:8}}>#{tg}</span>)}
                    </div>
                  </div>
                  {voice.id===v.id && <span>✅</span>}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Controls ───────────────────────────────── */}
        {innerTab==="controls" && (
          <div style={card}>
            {/* Selected voice info */}
            <div style={{background:"#f8f7ff", borderRadius:13, padding:"0.75rem", marginBottom:"1rem", direction:isRTL?"rtl":"ltr"}}>
              <div style={{fontSize:"0.72rem", color:"#6b7280", fontFamily:"Tajawal,sans-serif", marginBottom:2}}>{t.selVoice}</div>
              <div style={{fontSize:"1rem", fontWeight:700, fontFamily:urFont}}>{GM[voice.gender].icon} {vName(voice)}</div>
              <div style={{fontSize:"0.68rem", color:"#9ca3af", fontFamily:"Tajawal,sans-serif", marginTop:2}}>
                {EM[voice.emotion]?.icon} {voice.language} • {voice.accent}
              </div>
            </div>

            {/* Generation speed/pitch */}
            <div style={{borderBottom:"1px solid #f0eeff", paddingBottom:"1rem", marginBottom:"1rem"}}>
              <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"0.75rem", direction:isRTL?"rtl":"ltr"}}>
                <span style={{fontSize:"0.85rem", fontWeight:700, fontFamily:urFont}}>🎚️ {t.customToggle}</span>
                <button onClick={()=>setUseCustom(!useCustom)}
                  style={{width:42, height:22, borderRadius:11, border:"none", background:useCustom?"#667eea":"#d1d5db", cursor:"pointer", position:"relative", flexShrink:0}}>
                  <span style={{position:"absolute", top:2, left:useCustom?22:2, width:18, height:18, borderRadius:"50%", background:"white", transition:"left .2s", display:"block"}}/>
                </button>
              </div>
              {useCustom ? (
                <>
                  {sliderRow("⚡ "+t.genSpeed, genSpeed, setGenSpeed, 0.5, 2.0, 0.05, "0.5x", "2.0x", v=>v.toFixed(2)+"x")}
                  {sliderRow("🎵 "+t.genPitch, genPitch, setGenPitch, 0.5, 2.0, 0.05, "Low",  "High",  v=>v.toFixed(2))}
                  <button onClick={()=>{ setGenSpeed(voice.speed); setGenPitch(voice.pitch); }} style={pill(false)}>🔄 Reset</button>
                </>
              ) : (
                <div style={{background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:11, padding:"0.7rem"}}>
                  <p style={{fontSize:"0.78rem", color:"#166534", fontFamily:"Tajawal,sans-serif"}}>
                    ✅ {t.defVals} — Speed: {voice.speed}x | Pitch: {voice.pitch}
                  </p>
                </div>
              )}
            </div>

            {/* Playback controls */}
            <div style={{fontSize:"0.85rem", fontWeight:700, fontFamily:urFont, marginBottom:"0.75rem", direction:isRTL?"rtl":"ltr"}}>{t.pbControls}</div>
            {sliderRow("▶️ "+t.pbSpeed, pbSpeed, setPbSpeed, 0.25, 4.0, 0.25, "0.25x", "4.0x", v=>v.toFixed(2)+"x")}
            {sliderRow("🔈 "+t.pbVol,   pbVol,   setPbVol,   0,    1,   0.05, "🔇",   "🔊",   v=>Math.round(v*100)+"%")}
            <div style={{display:"flex", gap:5, flexWrap:"wrap", marginTop:"0.5rem"}}>
              {[0.5,0.75,1.0,1.25,1.5,2.0].map(s=>(
                <button key={s} onClick={()=>setPbSpeed(s)} style={{...pill(pbSpeed===s,"#667eea"), minWidth:40, textAlign:"center"}}>{s}x</button>
              ))}
            </div>
          </div>
        )}

        {/* ── Output ─────────────────────────────────── */}
        {innerTab==="output" && (
          <div style={card}>
            {/* Demo / no key */}
            {demoInfo && (
              <div style={{background:"#fffbeb", border:"1px solid #fde68a", borderRadius:13, padding:"1rem", marginBottom:"0.875rem", direction:isRTL?"rtl":"ltr"}}>
                <div style={{fontSize:"0.875rem", fontWeight:700, color:"#92400e", fontFamily:urFont, marginBottom:8}}>{t.demoTitle}</div>
                <p style={{fontSize:"0.78rem", color:"#78350f", fontFamily:"Tajawal,sans-serif", lineHeight:1.6, marginBottom:8}}>
                  {String(demoInfo.message ?? "")}
                </p>
                {/* Env status */}
                {demoInfo.envStatus && (
                  <div style={{background:"#fef9c3", borderRadius:9, padding:"0.6rem", fontFamily:"monospace", fontSize:"0.65rem", direction:"ltr", marginBottom:8}}>
                    <strong>🔍 .env.local status:</strong><br/>
                    {Object.entries(demoInfo.envStatus as Record<string,string>).map(([k,v])=>(
                      <div key={k} style={{color:v.includes("❌")?"#dc2626":v.includes("⚠️")?"#d97706":"#16a34a", marginTop:2}}>
                        {k}: {v}
                      </div>
                    ))}
                  </div>
                )}
                {/* Setup guide */}
                {demoInfo.setupGuide && (
                  <div style={{background:"#fef3c7", borderRadius:9, padding:"0.6rem", fontFamily:"monospace", fontSize:"0.65rem", direction:"ltr"}}>
                    <strong>{t.envSetup}</strong><br/><br/>
                    {Object.entries(demoInfo.setupGuide as Record<string,{key:string;url:string;note:string}>).map(([,v])=>(
                      <div key={v.key} style={{marginBottom:6}}>
                        <span style={{color:"#065f46", fontWeight:700}}>{v.key}=your_key_here</span><br/>
                        <a href={v.url} target="_blank" rel="noreferrer" style={{color:"#0284c7", fontSize:"0.62rem"}}>📖 {v.url}</a>
                        <span style={{color:"#78350f"}}> — {v.note}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Audio player */}
            {audioSrc ? (
              <>
                <div style={{background:"#f8f7ff", borderRadius:13, padding:"0.75rem", marginBottom:"0.75rem", direction:isRTL?"rtl":"ltr"}}>
                  <div style={{fontSize:"0.72rem", color:"#6b7280", marginBottom:2, fontFamily:"Tajawal,sans-serif"}}>{voice.language} • {voice.accent}</div>
                  <div style={{fontSize:"0.9rem", fontWeight:700, fontFamily:urFont}}>{GM[voice.gender].icon} {vName(voice)}</div>
                </div>
                <audio ref={audioRef} controls src={audioSrc} style={{width:"100%", marginBottom:"0.6rem", borderRadius:10}}
                  onLoadedMetadata={()=>{ if(audioRef.current){ audioRef.current.playbackRate=pbSpeed; audioRef.current.volume=pbVol; } }}/>
                {/* Quick speed buttons */}
                <div style={{display:"flex", gap:5, marginBottom:"0.75rem", justifyContent:"center", flexWrap:"wrap"}}>
                  {[0.5,0.75,1.0,1.25,1.5,2.0].map(s=>(
                    <button key={s} onClick={()=>{ setPbSpeed(s); if(audioRef.current) audioRef.current.playbackRate=s; }}
                      style={{...pill(pbSpeed===s,"#667eea"), minWidth:40, textAlign:"center"}}>{s}x</button>
                  ))}
                </div>
                <div style={{display:"flex", gap:7, flexWrap:"wrap"}}>
                  <a href={audioSrc} download="voice-output.mp3" style={{flex:1, padding:"0.7rem", background:"#10b981", color:"white", textDecoration:"none", borderRadius:40, fontSize:"0.82rem", fontWeight:700, textAlign:"center", fontFamily:"Tajawal,sans-serif"}}>{t.download}</a>
                  <button onClick={()=>{ navigator.clipboard.writeText(audioSrc); showToast(t.copied); }}
                    style={{flex:1, padding:"0.7rem", background:"#3b82f6", color:"white", border:"none", borderRadius:40, fontSize:"0.82rem", fontWeight:700, cursor:"pointer", fontFamily:"Tajawal,sans-serif"}}>{t.copyLink}</button>
                  <button onClick={clearAll} style={{padding:"0.7rem 0.875rem", background:"#fee2e2", color:"#dc2626", border:"none", borderRadius:40, cursor:"pointer"}}>{t.clear}</button>
                </div>
              </>
            ) : !demoInfo && (
              <div style={{textAlign:"center", padding:"2.5rem 1rem"}}>
                <div style={{fontSize:"3rem", marginBottom:"0.75rem"}}>🔊</div>
                <p style={{color:"#9ca3af", fontFamily:urFont}}>{t.noAudio}</p>
              </div>
            )}
          </div>
        )}

        {/* Generate Button */}
        <div style={{marginBottom:"0.75rem"}}>
          {loading && (
            <div style={{marginBottom:"0.5rem"}}>
              <div style={{height:5, background:"rgba(255,255,255,0.3)", borderRadius:3, overflow:"hidden"}}>
                <div style={{width:`${progress}%`, height:"100%", background:"white", borderRadius:3, transition:"width .3s"}}/>
              </div>
              <p style={{color:"rgba(255,255,255,0.8)", fontSize:"0.73rem", textAlign:"center", marginTop:4, fontFamily:"Tajawal,sans-serif"}}>
                🎤 {t.generating} {progress}%
              </p>
            </div>
          )}
          <button onClick={generate} disabled={loading || !text.trim()}
            style={{width:"100%", padding:"0.95rem",
              background:  loading||!text.trim() ? "rgba(255,255,255,0.35)" : "white",
              color:       loading||!text.trim() ? "rgba(255,255,255,0.5)" : "#667eea",
              border:"none", borderRadius:40, fontSize:"1rem", fontWeight:700,
              cursor: loading||!text.trim() ? "not-allowed" : "pointer",
              boxShadow: loading||!text.trim() ? "none" : "0 4px 20px rgba(0,0,0,0.15)",
              fontFamily:urFont, transition:"all .2s"}}>
            {loading ? `🎤 ${t.generating}` : `${t.generate} — ${vName(voice)}`}
          </button>
        </div>

        {/* Error display */}
        {error && (
          <div style={{background:"rgba(239,68,68,0.12)", border:"1px solid rgba(239,68,68,0.3)", borderRadius:13, padding:"0.75rem 1rem", marginBottom:"0.75rem", direction:isRTL?"rtl":"ltr"}}>
            <p style={{color:"#dc2626", fontSize:"0.82rem", fontFamily:urFont, marginBottom:errDetails.length?4:0}}>❌ {error}</p>
            {errDetails.length > 0 && (
              <div style={{background:"rgba(239,68,68,0.08)", borderRadius:8, padding:"0.5rem", fontFamily:"monospace", fontSize:"0.65rem", direction:"ltr"}}>
                {errDetails.map((d,i)=><div key={i} style={{color:"#991b1b", marginBottom:2}}>• {d}</div>)}
              </div>
            )}
          </div>
        )}
      </>)}

      {/* ══════════════════════════════════════════════════
          DUBBING TAB
      ══════════════════════════════════════════════════ */}
      {appTab==="dubbing" && (
        <div style={card}>
          <h2 style={{fontSize:"1rem", fontWeight:700, marginBottom:6, fontFamily:urFont, direction:isRTL?"rtl":"ltr"}}>{t.dubTitle}</h2>
          <p style={{fontSize:"0.82rem", color:"#6b7280", marginBottom:"1rem", fontFamily:urFont, lineHeight:1.6, direction:isRTL?"rtl":"ltr"}}>{t.dubDesc}</p>

          {langSelect(dubLang, setDubLang, t.dubLang)}

          {/* Voice picker */}
          <div style={{marginBottom:"0.75rem", direction:isRTL?"rtl":"ltr"}}>
            <label style={{fontSize:"0.8rem", fontWeight:700, display:"block", marginBottom:4, fontFamily:urFont}}>{t.dubVoice}</label>
            <select value={dubVoiceId} onChange={e=>setDubVoiceId(e.target.value)}
              style={{width:"100%", padding:"0.65rem 1rem", borderRadius:12, border:"1.5px solid #e0e0e0", fontSize:"0.85rem", outline:"none", background:"white"}}>
              {VOICES.filter(v => dubLang==="all" || v.language===dubLang).map(v=>(
                <option key={v.id} value={v.id}>{GM[v.gender].icon} {v.name} — {v.accent}</option>
              ))}
            </select>
          </div>

          {/* File upload */}
          <div style={{border:"2px dashed #c4b5fd", borderRadius:16, padding:"2rem", textAlign:"center", marginBottom:"1rem", background:"#faf8ff", cursor:"pointer"}}
            onClick={()=>document.getElementById("dub-file")?.click()}>
            <div style={{fontSize:"2.5rem", marginBottom:8}}>🎬</div>
            <p style={{fontSize:"0.85rem", color:"#6d28d9", fontFamily:urFont, fontWeight:700}}>{t.dubUpload}</p>
            <p style={{fontSize:"0.72rem", color:"#9ca3af", fontFamily:"Tajawal,sans-serif", marginTop:4}}>MP4, MOV, AVI, MP3, WAV</p>
            {dubFile && <p style={{fontSize:"0.78rem", color:"#10b981", marginTop:6, fontFamily:"monospace"}}>✅ {dubFile.name}</p>}
            <input id="dub-file" type="file" accept="video/*,audio/*" style={{display:"none"}} onChange={e=>{ setDubFile(e.target.files?.[0]??null); setDubDone(false); }}/>
          </div>

          <button onClick={startDubbing} disabled={dubLoading || !dubFile}
            style={{width:"100%", padding:"0.875rem", background:dubLoading||!dubFile?"#d1d5db":"linear-gradient(135deg,#667eea,#764ba2)", color:"white", border:"none", borderRadius:40, fontSize:"0.95rem", fontWeight:700, cursor:dubLoading||!dubFile?"not-allowed":"pointer", fontFamily:urFont}}>
            {dubLoading ? "⏳ Processing..." : t.dubStart}
          </button>

          {dubDone && (
            <div style={{background:"#fffbeb", border:"1px solid #fde68a", borderRadius:13, padding:"1rem", marginTop:"0.875rem", direction:isRTL?"rtl":"ltr"}}>
              <div style={{fontSize:"0.875rem", fontWeight:700, color:"#92400e", fontFamily:urFont, marginBottom:6}}>🔑 {t.demoTitle}</div>
              <p style={{fontSize:"0.78rem", color:"#78350f", fontFamily:"Tajawal,sans-serif", lineHeight:1.6}}>{t.dubNote}</p>
              <div style={{background:"#fef3c7", borderRadius:9, padding:"0.6rem", fontFamily:"monospace", fontSize:"0.65rem", marginTop:8, direction:"ltr"}}>
                ELEVENLABS_API_KEY=your_key — best dubbing quality<br/>
                VOICERSS_API_KEY=your_key — multi-language support
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════
          STT TAB
      ══════════════════════════════════════════════════ */}
      {appTab==="stt" && (
        <div style={card}>
          <h2 style={{fontSize:"1rem", fontWeight:700, marginBottom:6, fontFamily:urFont, direction:isRTL?"rtl":"ltr"}}>{t.sttTitle}</h2>
          <p style={{fontSize:"0.82rem", color:"#6b7280", marginBottom:"1rem", fontFamily:urFont, lineHeight:1.6, direction:isRTL?"rtl":"ltr"}}>{t.sttDesc}</p>

          {langSelect(sttLang, setSttLang, t.sttLang)}

          {/* Live Recording */}
          <div style={{background:"#f0fdf4", border:"1px solid #bbf7d0", borderRadius:16, padding:"1rem", marginBottom:"0.875rem"}}>
            <p style={{fontSize:"0.82rem", fontWeight:700, color:"#166534", marginBottom:"0.75rem", fontFamily:urFont, direction:isRTL?"rtl":"ltr"}}>
              🎤 {t.sttRecord}
            </p>
            <button onClick={isRecording ? stopSTT : startSTT}
              style={{width:"100%", padding:"0.75rem", background:isRecording?"#dc2626":"#16a34a", color:"white", border:"none", borderRadius:40, fontSize:"0.9rem", fontWeight:700, cursor:"pointer", fontFamily:urFont}}>
              {isRecording ? t.stopRec : t.sttRecord}
            </button>
            {isRecording && (
              <div style={{marginTop:"0.75rem", padding:"0.75rem", background:"white", borderRadius:12, border:"1px solid #bbf7d0", minHeight:60, direction:isRTL?"rtl":"ltr", fontFamily:urFont, fontSize:"0.85rem", color:"#374151", lineHeight:1.6}}>
                <span style={{fontSize:"0.7rem", color:"#dc2626", display:"block", marginBottom:4}}>{t.recording}</span>
                {sttResult}{sttInterim && <span style={{color:"#9ca3af"}}>{sttInterim}</span>}
              </div>
            )}
          </div>

          {/* File Upload STT */}
          <div style={{background:"#eff6ff", border:"1px solid #bfdbfe", borderRadius:16, padding:"1rem", marginBottom:"0.875rem"}}>
            <p style={{fontSize:"0.82rem", fontWeight:700, color:"#1e40af", marginBottom:"0.75rem", fontFamily:urFont, direction:isRTL?"rtl":"ltr"}}>
              📁 {t.sttUpload}
            </p>
            <div style={{border:"2px dashed #93c5fd", borderRadius:12, padding:"1.25rem", textAlign:"center", cursor:"pointer", marginBottom:"0.75rem"}}
              onClick={()=>document.getElementById("stt-file")?.click()}>
              <div style={{fontSize:"2rem", marginBottom:4}}>🎵</div>
              <p style={{fontSize:"0.8rem", color:"#3b82f6", fontFamily:urFont}}>{t.sttUpload}</p>
              <p style={{fontSize:"0.7rem", color:"#9ca3af", fontFamily:"Tajawal,sans-serif", marginTop:3}}>MP3, WAV, M4A, OGG, FLAC</p>
              {sttFile && <p style={{fontSize:"0.75rem", color:"#10b981", marginTop:5, fontFamily:"monospace"}}>✅ {sttFile.name}</p>}
              <input id="stt-file" type="file" accept="audio/*" style={{display:"none"}} onChange={e=>{ setSttFile(e.target.files?.[0]??null); setSttResult(""); }}/>
            </div>
            <button onClick={transcribeFile} disabled={sttLoading || !sttFile}
              style={{width:"100%", padding:"0.75rem", background:sttLoading||!sttFile?"#93c5fd":"#2563eb", color:"white", border:"none", borderRadius:40, fontSize:"0.9rem", fontWeight:700, cursor:sttLoading||!sttFile?"not-allowed":"pointer", fontFamily:urFont}}>
              {sttLoading ? "⏳ Transcribing..." : t.sttStart}
            </button>
          </div>

          {/* Result */}
          {(sttResult && sttResult!=="__demo__") ? (
            <div style={{background:"#f8f7ff", border:"1px solid #e8e4ff", borderRadius:14, padding:"1rem"}}>
              <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8, direction:isRTL?"rtl":"ltr"}}>
                <span style={{fontSize:"0.82rem", fontWeight:700, fontFamily:urFont, color:"#4c1d95"}}>{t.sttResult}</span>
                <button onClick={()=>{ navigator.clipboard.writeText(sttResult); showToast(t.copied); }} style={pill(false)}>{t.sttCopy}</button>
              </div>
              <p style={{fontSize:"0.9rem", color:"#1a1a2e", fontFamily:urFont, lineHeight:1.7, direction:isRTL?"rtl":"ltr"}}>{sttResult}</p>
            </div>
          ) : sttResult==="__demo__" ? (
            <div style={{background:"#fffbeb", border:"1px solid #fde68a", borderRadius:13, padding:"1rem", direction:isRTL?"rtl":"ltr"}}>
              <p style={{fontSize:"0.78rem", color:"#92400e", fontFamily:urFont, lineHeight:1.6, marginBottom:6}}>{t.sttNote}</p>
              <div style={{background:"#fef3c7", borderRadius:9, padding:"0.6rem", fontFamily:"monospace", fontSize:"0.65rem", direction:"ltr"}}>
                OPENAI_API_KEY=sk-... (Whisper — best transcription)<br/>
                GOOGLE_TTS_KEY=... (Speech-to-Text API)
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{position:"fixed", bottom:90, left:"50%", transform:"translateX(-50%)", background:"rgba(0,0,0,0.82)", color:"white", padding:"0.6rem 1.25rem", borderRadius:40, fontSize:"0.82rem", zIndex:999, fontFamily:"Tajawal,sans-serif", whiteSpace:"nowrap"}}>
          {toast}
        </div>
      )}

      <BottomNav active="tools" onNavigate={(href)=>router.push(href)}/>
    </div>
  );
}