// app/api/voice/diagnose/route.ts
// ================================================================
//  Self-diagnostic endpoint — tests every TTS provider with a
//  tiny sample request and reports the EXACT error from each.
//
//  Visit this URL any time to see what's actually failing:
//  https://your-site.vercel.app/api/voice/diagnose
// ================================================================
import { NextResponse } from "next/server";

const SAMPLE_TEXT = "Test";

function clamp(v: number, min: number, max: number) { return Math.min(max, Math.max(min, v)); }

interface Keys {
  voicerss: string | null; huggingface: string | null;
  elevenlabs: string | null; openai: string | null; google: string | null;
}

function getKeys(): Keys {
  const raw = {
    voicerss:    (process.env.VOICERSS_API_KEY    ?? "").trim(),
    huggingface: (process.env.HUGGINGFACE_API_KEY ?? "").trim(),
    elevenlabs:  (process.env.ELEVENLABS_API_KEY  ?? "").trim(),
    openai:      (process.env.OPENAI_API_KEY      ?? "").trim().replace(/^sk_/, "sk-"),
    google:      (process.env.GOOGLE_TTS_KEY      ?? "").trim(),
  };
  const invalid = (s: string) => !s || s.includes("your_") || s.includes("xxxxxxx") || s.includes("actual_") || s.includes("placeholder");
  return {
    voicerss:    !invalid(raw.voicerss)    && raw.voicerss.length > 5     ? raw.voicerss    : null,
    huggingface: !invalid(raw.huggingface) && raw.huggingface.startsWith("hf_") ? raw.huggingface : null,
    elevenlabs:  !invalid(raw.elevenlabs)  && raw.elevenlabs.length > 5   ? raw.elevenlabs  : null,
    openai:      raw.openai.startsWith("sk-") && raw.openai.length > 10  ? raw.openai      : null,
    google:      !invalid(raw.google)      && raw.google.length > 5      ? raw.google      : null,
  };
}

interface DiagResult {
  provider: string;
  keyFound: boolean;
  status: "ok" | "failed" | "skipped";
  httpStatus?: number;
  message: string;
  audioBytes?: number;
  timeMs?: number;
}

async function timeIt<T>(fn: () => Promise<T>): Promise<{ result: T; ms: number }> {
  const start = Date.now();
  const result = await fn();
  return { result, ms: Date.now() - start };
}

// ── Individual provider tests ────────────────────────────────
async function testVoiceRSS(key: string): Promise<DiagResult> {
  try {
    const { result, ms } = await timeIt(async () => {
      const params = new URLSearchParams({ key, src: SAMPLE_TEXT, hl: "en-us", c: "MP3", f: "44khz_16bit_stereo", b64: "true" });
      const res = await fetch("https://api.voicerss.org/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: params.toString() });
      const txt = await res.text();
      return { res, txt };
    });
    if (result.txt.startsWith("ERROR")) {
      return { provider: "voicerss", keyFound: true, status: "failed", httpStatus: result.res.status, message: result.txt, timeMs: ms };
    }
    return { provider: "voicerss", keyFound: true, status: "ok", httpStatus: result.res.status, message: "Working correctly", audioBytes: result.txt.length, timeMs: ms };
  } catch (e) {
    return { provider: "voicerss", keyFound: true, status: "failed", message: e instanceof Error ? e.message : String(e) };
  }
}

async function testHuggingFace(key: string): Promise<DiagResult> {
  try {
    const { result, ms } = await timeIt(async () => {
      const res = await fetch("https://api-inference.huggingface.co/models/facebook/mms-tts-eng", {
        method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({ inputs: SAMPLE_TEXT }),
      });
      return res;
    });
    if (!result.ok) {
      const errText = await result.text();
      return { provider: "huggingface", keyFound: true, status: "failed", httpStatus: result.status, message: errText.slice(0, 300), timeMs: ms };
    }
    const buf = await result.arrayBuffer();
    return { provider: "huggingface", keyFound: true, status: "ok", httpStatus: result.status, message: "Working correctly", audioBytes: buf.byteLength, timeMs: ms };
  } catch (e) {
    return { provider: "huggingface", keyFound: true, status: "failed", message: e instanceof Error ? e.message : String(e) };
  }
}

async function testElevenLabs(key: string): Promise<DiagResult> {
  try {
    const { result, ms } = await timeIt(async () => {
      const res = await fetch("https://api.elevenlabs.io/v1/text-to-speech/ErXwobaYiN019PkySvjV", {
        method: "POST", headers: { "xi-api-key": key, "Content-Type": "application/json", Accept: "audio/mpeg" },
        body: JSON.stringify({ text: SAMPLE_TEXT, model_id: "eleven_multilingual_v2" }),
      });
      return res;
    });
    if (!result.ok) {
      const errText = await result.text();
      return { provider: "elevenlabs", keyFound: true, status: "failed", httpStatus: result.status, message: errText.slice(0, 300), timeMs: ms };
    }
    const buf = await result.arrayBuffer();
    return { provider: "elevenlabs", keyFound: true, status: "ok", httpStatus: result.status, message: "Working correctly", audioBytes: buf.byteLength, timeMs: ms };
  } catch (e) {
    return { provider: "elevenlabs", keyFound: true, status: "failed", message: e instanceof Error ? e.message : String(e) };
  }
}

async function testOpenAI(key: string): Promise<DiagResult> {
  try {
    const { result, ms } = await timeIt(async () => {
      const res = await fetch("https://api.openai.com/v1/audio/speech", {
        method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({ model: "tts-1", input: SAMPLE_TEXT, voice: "alloy", response_format: "mp3" }),
      });
      return res;
    });
    if (!result.ok) {
      const errText = await result.text();
      return { provider: "openai", keyFound: true, status: "failed", httpStatus: result.status, message: errText.slice(0, 300), timeMs: ms };
    }
    const buf = await result.arrayBuffer();
    return { provider: "openai", keyFound: true, status: "ok", httpStatus: result.status, message: "Working correctly", audioBytes: buf.byteLength, timeMs: ms };
  } catch (e) {
    return { provider: "openai", keyFound: true, status: "failed", message: e instanceof Error ? e.message : String(e) };
  }
}

async function testGoogle(key: string): Promise<DiagResult> {
  try {
    const { result, ms } = await timeIt(async () => {
      const res = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${key}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: { text: SAMPLE_TEXT }, voice: { languageCode: "en-US", ssmlGender: "MALE" }, audioConfig: { audioEncoding: "MP3" } }),
      });
      return res;
    });
    const data = await result.json();
    if (!data.audioContent) {
      return { provider: "google", keyFound: true, status: "failed", httpStatus: result.status, message: JSON.stringify(data.error ?? data).slice(0, 300), timeMs: ms };
    }
    return { provider: "google", keyFound: true, status: "ok", httpStatus: result.status, message: "Working correctly", audioBytes: data.audioContent.length, timeMs: ms };
  } catch (e) {
    return { provider: "google", keyFound: true, status: "failed", message: e instanceof Error ? e.message : String(e) };
  }
}

// ── Main handler ─────────────────────────────────────────────
export async function GET() {
  const keys = getKeys();
  const results: DiagResult[] = [];

  // Run tests only for keys that are present
  const tests: Array<Promise<DiagResult> | DiagResult> = [
    keys.voicerss    ? testVoiceRSS(keys.voicerss)       : { provider:"voicerss",    keyFound:false, status:"skipped", message:"No valid VOICERSS_API_KEY found" },
    keys.huggingface ? testHuggingFace(keys.huggingface) : { provider:"huggingface", keyFound:false, status:"skipped", message:"No valid HUGGINGFACE_API_KEY found" },
    keys.elevenlabs  ? testElevenLabs(keys.elevenlabs)   : { provider:"elevenlabs",  keyFound:false, status:"skipped", message:"No valid ELEVENLABS_API_KEY found" },
    keys.openai      ? testOpenAI(keys.openai)           : { provider:"openai",      keyFound:false, status:"skipped", message:"No valid OPENAI_API_KEY found" },
    keys.google      ? testGoogle(keys.google)           : { provider:"google",      keyFound:false, status:"skipped", message:"No valid GOOGLE_TTS_KEY found" },
  ];

  const settled = await Promise.all(tests);
  results.push(...settled);

  const workingCount = results.filter(r => r.status === "ok").length;
  const summary = workingCount > 0
    ? `✅ ${workingCount} provider(s) working — voice generation should succeed`
    : `❌ 0 providers working — this is why "All TTS providers failed" appears`;

  return NextResponse.json({
    summary,
    timestamp: new Date().toISOString(),
    results,
    nextSteps: workingCount === 0 ? [
      "Copy this entire JSON response",
      "Send it back for an exact fix — no guessing needed",
      "Each 'message' field below shows the real error from that provider",
    ] : [
      "Voice generation should work now",
      "If it still fails in the app, the issue is elsewhere (check /api/voice directly)",
    ],
  }, { status: 200 });
}
