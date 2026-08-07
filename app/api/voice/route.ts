// app/api/voice/route.ts
// Priority: VoiceRSS (supported langs only) → HuggingFace → ElevenLabs → OpenAI → Google
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import * as Sentry from "@sentry/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { requireMinimumPlan } from "@/lib/billing-guard";
import { readBillingIdentity } from "@/lib/billing-auth";
import { getUserApiKeys } from "@/lib/user-api-keys";

// ── VoiceRSS ONLY supports these languages — Urdu & Persian are NOT supported ──
const VR_LANG: Record<string, string> = {
  "English-American":"en-us","English-British":"en-gb","English-Australian":"en-au",
  "Hindi-Indian":"hi-in","Arabic-Saudi":"ar-sa","Arabic-Egyptian":"ar-eg",
  "French-Parisian":"fr-fr","German-Standard":"de-de","Russian-Moscow":"ru-ru",
  "Chinese-Mandarin":"zh-cn","Japanese-Tokyo":"ja-jp","Korean-Seoul":"ko-kr",
  "Dutch-Dutch":"nl-nl","Spanish-Castilian":"es-es","Spanish-Latin Am.":"es-mx",
  "Turkish-Istanbul":"tr-tr","Portuguese-Brazilian":"pt-br","Italian-Roman":"it-it",
};

const GOOGLE_LANG: Record<string, string> = {
  "English-American":"en-US","English-British":"en-GB","English-Australian":"en-AU",
  "Urdu-Pakistani":"ur-PK","Hindi-Indian":"hi-IN","Arabic-Saudi":"ar-XA",
  "Arabic-Egyptian":"ar-EG","Persian-Iranian":"fa-IR","French-Parisian":"fr-FR",
  "German-Standard":"de-DE","Russian-Moscow":"ru-RU","Chinese-Mandarin":"cmn-CN",
  "Japanese-Tokyo":"ja-JP","Korean-Seoul":"ko-KR","Dutch-Dutch":"nl-NL",
  "Spanish-Castilian":"es-ES","Turkish-Istanbul":"tr-TR","Portuguese-Brazilian":"pt-BR",
  "Italian-Roman":"it-IT",
};

const HF_LANG: Record<string, string> = {
  English:"eng",Urdu:"urd",Hindi:"hin",Arabic:"ara",Persian:"pes",
  French:"fra",German:"deu",Russian:"rus",Chinese:"zho",Japanese:"jpn",
  Korean:"kor",Dutch:"nld",Spanish:"spa",Turkish:"tur",Portuguese:"por",Italian:"ita",
};

const EL_VOICES: Record<string, string> = {
  "en-m-01":"ErXwobaYiN019PkySvjV","en-m-02":"VR6AewLTigWG4xSOukaG",
  "en-m-10":"pNInz6obpgDQGcFmaJgB","en-m-15":"nPczCjzI2devNBz1zQrb",
  "en-m-16":"TxGEqnHWrfWFTfGW9XjX","en-f-01":"EXAVITQu4vr4xnSDxMaL",
  "en-f-02":"AZnzlk1XvdvUeBnXmlld",
};

function clamp(v: number, min: number, max: number) { 
  return Math.min(max, Math.max(min, v)); 
}

function oaiVoice(gender: string, emotion: string): string {
  if (gender === "female" || gender === "girl") return emotion === "excited" ? "nova" : "shimmer";
  if (gender === "boy") return "nova";
  if (emotion === "serious" || emotion === "neutral") return "onyx";
  if (emotion === "calm" || emotion === "romantic") return "echo";
  return "alloy";
}

function buildSSML(text: string, speed: number, pitch: number, emotion: string): string {
  const rate   = `${Math.round(speed * 100)}%`;
  const pitchV = pitch >= 1 ? `+${Math.round((pitch-1)*20)}st` : `${Math.round((pitch-1)*20)}st`;
  const vol    = emotion === "loud" ? "+6dB" : emotion === "whisper" ? "-8dB" : "0dB";
  return `<speak><prosody rate="${rate}" pitch="${pitchV}" volume="${vol}">${text}</prosody></speak>`;
}

// ── fetch with timeout ──
async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs = 15000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

// ── Key validation ──
interface Keys {
  voicerss: string | null; 
  huggingface: string | null;
  elevenlabs: string | null; 
  openai: string | null; 
  google: string | null;
}

function getKeys(overrides?: Partial<Keys>): Keys {
  const raw = {
    voicerss:    (overrides?.voicerss ?? process.env.VOICERSS_API_KEY ?? "").trim(),
    huggingface: (overrides?.huggingface ?? process.env.HUGGINGFACE_API_KEY ?? "").trim(),
    elevenlabs:  (overrides?.elevenlabs ?? process.env.ELEVENLABS_API_KEY ?? "").trim(),
    openai:      (overrides?.openai ?? process.env.OPENAI_API_KEY ?? "").trim().replace(/^sk_/, "sk-"),
    google:      (overrides?.google ?? process.env.GOOGLE_TTS_KEY ?? "").trim(),
  };
  const invalid = (s: string) => !s || s.includes("your_") || s.includes("xxxxxxx") || s.includes("actual_") || s.includes("placeholder");
  return {
    voicerss:    !invalid(raw.voicerss)    && raw.voicerss.length > 5   ? raw.voicerss    : null,
    huggingface: !invalid(raw.huggingface) && raw.huggingface.startsWith("hf_") ? raw.huggingface : null,
    elevenlabs:  !invalid(raw.elevenlabs)  && raw.elevenlabs.length > 5 ? raw.elevenlabs  : null,
    openai:      raw.openai.startsWith("sk-") && raw.openai.length > 10 ? raw.openai      : null,
    google:      !invalid(raw.google)      && raw.google.length > 5     ? raw.google      : null,
  };
}

// ── Providers ──
async function tryVoiceRSS(text: string, language: string, accent: string, speed: number, key: string): Promise<Buffer> {
  const langKey = `${language}-${accent}`;
  const hl = VR_LANG[langKey] ?? VR_LANG[`${language}-`];
  if (!hl) throw new Error(`VoiceRSS does not support "${language}" — skipped`);

  const vrSpeed = clamp(Math.round((speed - 1) * 5), -10, 10);
  const params  = new URLSearchParams({ key, src: text.slice(0, 3000), hl, c: "MP3", f: "44khz_16bit_stereo", r: String(vrSpeed), b64: "true" });
  const res = await fetchWithTimeout("https://api.voicerss.org/", { 
    method: "POST", 
    headers: { "Content-Type": "application/x-www-form-urlencoded" }, 
    body: params.toString() 
  }, 10000);
  const txt = await res.text();
  if (txt.startsWith("ERROR")) throw new Error(`VoiceRSS: ${txt}`);
  return Buffer.from(txt.replace(/^data:audio\/[^;]+;base64,/, ""), "base64");
}

async function tryHuggingFace(text: string, language: string, key: string): Promise<Buffer> {
  const lang = HF_LANG[language] ?? "eng";
  let lastErr: unknown;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetchWithTimeout(
        `https://api-inference.huggingface.co/models/facebook/mms-tts-${lang}`,
        { method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" }, 
          body: JSON.stringify({ inputs: text }) },
        20000
      );
      if (!res.ok) {
        const errText = await res.text();
        if (res.status === 503 && attempt === 0) { await new Promise(r => setTimeout(r, 3000)); continue; }
        throw new Error(`HuggingFace ${res.status}: ${errText.slice(0, 200)}`);
      }
      return Buffer.from(await res.arrayBuffer());
    } catch (e) {
      lastErr = e;
      if (e instanceof Error && e.name === "AbortError") { lastErr = new Error("HuggingFace request timed out (20s)"); }
      if (attempt === 0) { await new Promise(r => setTimeout(r, 1000)); continue; }
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error("HuggingFace: unknown error");
}

async function tryElevenLabs(text: string, voiceId: string, speed: number, emotion: string, key: string): Promise<Buffer> {
  const elId = EL_VOICES[voiceId] ?? "ErXwobaYiN019PkySvjV";
  const elevenlabs = new ElevenLabsClient({
    apiKey: key,
    timeoutInSeconds: 15,
  });

  const audio = await elevenlabs.textToSpeech.convert(elId, {
    text,
    modelId: "eleven_multilingual_v2",
    outputFormat: "mp3_44100_128",
    voiceSettings: {
      stability: emotion === "calm" ? 0.85 : 0.55,
      similarityBoost: 0.8,
      style: emotion === "excited" ? 0.85 : emotion === "sad" ? 0.15 : 0.5,
      useSpeakerBoost: true,
      speed: clamp(speed, 0.7, 1.2),
    },
  });

  return Buffer.from(await new Response(audio).arrayBuffer());
}

async function tryOpenAI(text: string, voiceId: string, gender: string, emotion: string, speed: number, key: string): Promise<Buffer> {
  const res = await fetchWithTimeout("https://api.openai.com/v1/audio/speech",
    { method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "tts-1-hd", input: text, voice: oaiVoice(gender, emotion), 
        response_format: "mp3", speed: clamp(speed, 0.25, 4.0) }) }, 15000);
  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
  return Buffer.from(await res.arrayBuffer());
}

async function tryGoogle(text: string, language: string, accent: string, gender: string, speed: number, pitch: number, emotion: string, key: string): Promise<Buffer> {
  const langCode   = GOOGLE_LANG[`${language}-${accent}`] ?? "en-US";
  const ssmlGender = (gender === "female" || gender === "girl") ? "FEMALE" : "MALE";
  const res = await fetchWithTimeout(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${key}`,
    { method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ input: { ssml: buildSSML(text, speed, pitch, emotion) },
        voice: { languageCode: langCode, ssmlGender },
        audioConfig: { audioEncoding: "MP3", speakingRate: clamp(speed, 0.25, 4.0), 
          pitch: (pitch - 1) * 20, volumeGainDb: emotion === "loud" ? 6 : emotion === "whisper" ? -6 : 0 } }) }, 15000);
  const data = await res.json();
  if (!data.audioContent) throw new Error(`Google TTS: ${data.error?.message ?? "no audio"}`);
  return Buffer.from(data.audioContent, "base64");
}

// ── MAIN POST HANDLER (ONLY ONE) ──
export async function POST(req: NextRequest) {
  const planGuard = await requireMinimumPlan(req, "pro");
  if (planGuard) return planGuard;

  try {
    const body     = await req.json();
    const text     = String(body.text     ?? "").trim();
    const voiceId  = String(body.voiceId  ?? "en-m-01");
    const emotion  = String(body.emotion  ?? "neutral");
    const language = String(body.language ?? "English");
    const accent   = String(body.accent   ?? "American");
    const gender   = String(body.gender   ?? "male");
    const spd      = clamp(parseFloat(body.speed) || 1.0, 0.25, 4.0);
    const pit      = clamp(parseFloat(body.pitch) || 1.0, 0.25, 4.0);

    if (!text) return NextResponse.json({ error: "Text is empty" }, { status: 400 });
    if (text.length > 3000) return NextResponse.json({ error: "Text too long (max 3000)" }, { status: 400 });

    const identity = readBillingIdentity(req);
    const userKeys = identity.userId ? await getUserApiKeys(identity.userId) : null;

    const keys = getKeys({
      voicerss: userKeys?.voicerssApiKey,
      huggingface: userKeys?.huggingfaceApiKey,
      elevenlabs: userKeys?.elevenlabsApiKey,
      openai: userKeys?.openaiApiKey,
      google: userKeys?.googleTtsKey,
    });
    const errors: string[] = [];
    let   buffer: Buffer | null = null;
    let   provider = "none";

    const isVRSupported = !!(VR_LANG[`${language}-${accent}`] ?? VR_LANG[`${language}-`]);

    const attempts: Array<{ name: string; fn: () => Promise<Buffer> }> = [
      keys.voicerss && isVRSupported
                       ? { name:"voicerss",    fn: ()=>tryVoiceRSS(text, language, accent, spd, keys.voicerss!) } : null,
      keys.huggingface ? { name:"huggingface", fn: ()=>tryHuggingFace(text, language, keys.huggingface!) } : null,
      keys.elevenlabs  ? { name:"elevenlabs",  fn: ()=>tryElevenLabs(text, voiceId, spd, emotion, keys.elevenlabs!) } : null,
      keys.openai      ? { name:"openai",      fn: ()=>tryOpenAI(text, voiceId, gender, emotion, spd, keys.openai!)  } : null,
      keys.google      ? { name:"google",      fn: ()=>tryGoogle(text, language, accent, gender, spd, pit, emotion, keys.google!) } : null,
    ].filter(Boolean) as Array<{ name: string; fn: () => Promise<Buffer> }>;

    if (keys.voicerss && !isVRSupported) {
      errors.push(`voicerss: skipped — "${language}" is not supported by VoiceRSS`);
    }

    for (const attempt of attempts) {
      if (buffer) break;
      try { 
        buffer = await attempt.fn(); 
        provider = attempt.name; 
      } catch (e) { 
        errors.push(`${attempt.name}: ${e instanceof Error ? e.message : String(e)}`); 
      }
    }

    console.log("[Voice API] result:", { provider, success: !!buffer, errors });

    // ── If no audio generated ──
    if (!buffer) {
      const hasKeys = Object.values(keys).some(Boolean);
      
      if (hasKeys) {
        Sentry.captureMessage(`Voice API: all providers failed — ${errors.join(" | ")}`, "error");
        return NextResponse.json(
          { 
            error: "All TTS providers failed", 
            details: errors,
            provider: "none",
            success: false
          }, 
          { status: 500 }
        );
      }
      
      // No valid keys found - show setup guide
      const envStatus: Record<string, string> = {};
      for (const [k, v] of Object.entries(keys)) {
        const envKey = { 
          voicerss:"VOICERSS_API_KEY", 
          huggingface:"HUGGINGFACE_API_KEY", 
          elevenlabs:"ELEVENLABS_API_KEY", 
          openai:"OPENAI_API_KEY", 
          google:"GOOGLE_TTS_KEY" 
        }[k]!;
        envStatus[envKey] = process.env[envKey] ? (v ? "✅ valid" : "⚠️ set but invalid") : "❌ missing";
      }
      
      return NextResponse.json({
        audio: null, 
        demo: true, 
        provider: "none",
        message: "No valid TTS API key found. Add at least one to .env.local",
        envStatus,
        setupGuide: {
          voicerss:    { key:"VOICERSS_API_KEY",    url:"https://voicerss.org",                    note:"Free 350 req/day — NOT Urdu/Persian" },
          huggingface: { key:"HUGGINGFACE_API_KEY", url:"https://huggingface.co/settings/tokens", note:"Free — supports Urdu/Persian via MMS model" },
          elevenlabs:  { key:"ELEVENLABS_API_KEY",  url:"https://elevenlabs.io/app/developers",    note:"Free 10k chars/month — best English quality" },
          openai:      { key:"OPENAI_API_KEY",      url:"https://platform.openai.com/api-keys",    note:"Paid — must start with sk-" },
          google:      { key:"GOOGLE_TTS_KEY",      url:"https://console.cloud.google.com",        note:"Free 1M chars/month — best Urdu/Arabic" },
        },
      });
    }

    // ── Success — return audio ──
    return NextResponse.json({ 
      audio: `data:audio/mpeg;base64,${buffer.toString("base64")}`, 
      provider, 
      language, 
      voice: voiceId,
      success: true
    });

  } catch (err) {
    Sentry.captureException(err);
    console.error("Voice API unhandled:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" }, 
      { status: 500 }
    );
  }
}

// ── GET handler ──
export async function GET() {
  const keys = getKeys();
  return NextResponse.json({
    status: "ok",
    available: { 
      voicerss: !!keys.voicerss, 
      huggingface: !!keys.huggingface, 
      elevenlabs: !!keys.elevenlabs, 
      openai: !!keys.openai, 
      google: !!keys.google 
    },
    note: "VoiceRSS does not support Urdu/Persian — those languages route to HuggingFace/Google automatically",
  });
}