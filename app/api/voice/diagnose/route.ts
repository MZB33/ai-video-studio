// app/api/voice/diagnose/route.ts
// ================================================================
//  Self-diagnostic endpoint — v2 (secured + free auth-checks)
//
//  Visit (with your secret key):
//  https://your-site.vercel.app/api/voice/diagnose?key=YOUR_DIAGNOSE_SECRET
//
//  IMPROVEMENTS OVER v1:
//  1. Protected by DIAGNOSE_SECRET — random visitors can no longer trigger it
//  2. ElevenLabs/OpenAI/Replicate now use FREE "check my key" endpoints
//     instead of generating real paid audio/images every time you check
//  3. Now also covers image providers (Replicate, HuggingFace image)
//  4. Short in-memory cache — avoids re-testing within 30s of the last run
// ================================================================
import { NextRequest, NextResponse } from "next/server";

const SAMPLE_TEXT = "Test";
const CACHE_TTL_MS = 30_000;

// ── simple in-memory cache (survives within a warm serverless instance) ──
let cachedResult: { data: unknown; expiresAt: number } | null = null;

interface DiagResult {
  provider: string;
  category: "voice" | "image";
  keyFound: boolean;
  status: "ok" | "failed" | "skipped";
  httpStatus?: number;
  message: string;
  timeMs?: number;
  costIncurred: boolean; // true only if this check spent real money
}

async function timeIt<T>(fn: () => Promise<T>): Promise<{ result: T; ms: number }> {
  const start = Date.now();
  const result = await fn();
  return { result, ms: Date.now() - start };
}

function invalidKey(s: string) {
  return !s || s.includes("your_") || s.includes("xxxxxxx") || s.includes("actual_") || s.includes("placeholder");
}

function getKeys() {
  const raw = {
    voicerss:    (process.env.VOICERSS_API_KEY    ?? "").trim(),
    huggingface: (process.env.HUGGINGFACE_API_KEY ?? "").trim(),
    elevenlabs:  (process.env.ELEVENLABS_API_KEY  ?? "").trim(),
    openai:      (process.env.OPENAI_API_KEY      ?? "").trim().replace(/^sk_/, "sk-"),
    google:      (process.env.GOOGLE_TTS_KEY      ?? "").trim(),
    replicate:   (process.env.REPLICATE_API_TOKEN ?? "").trim(),
  };
  return {
    voicerss:    !invalidKey(raw.voicerss)    && raw.voicerss.length > 5              ? raw.voicerss    : null,
    huggingface: !invalidKey(raw.huggingface) && raw.huggingface.startsWith("hf_")    ? raw.huggingface : null,
    elevenlabs:  !invalidKey(raw.elevenlabs)  && raw.elevenlabs.length > 5            ? raw.elevenlabs  : null,
    openai:      raw.openai.startsWith("sk-") && raw.openai.length > 10               ? raw.openai      : null,
    google:      !invalidKey(raw.google)      && raw.google.length > 5                ? raw.google      : null,
    replicate:   !invalidKey(raw.replicate)   && raw.replicate.startsWith("r8_")      ? raw.replicate   : null,
  };
}

// ================================================================
//  VOICE PROVIDER CHECKS
// ================================================================

// VoiceRSS has no free "check only" endpoint — this is a real tiny request,
// but VoiceRSS's free tier has no per-request cost, only a daily quota.
async function checkVoiceRSS(key: string): Promise<DiagResult> {
  try {
    const { result, ms } = await timeIt(async () => {
      const params = new URLSearchParams({ key, src: SAMPLE_TEXT, hl: "en-us", c: "MP3", b64: "true" });
      const res = await fetch("https://api.voicerss.org/", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: params.toString() });
      return { res, txt: await res.text() };
    });
    if (result.txt.startsWith("ERROR")) return { provider:"voicerss", category:"voice", keyFound:true, status:"failed", httpStatus:result.res.status, message:result.txt, timeMs:ms, costIncurred:false };
    return { provider:"voicerss", category:"voice", keyFound:true, status:"ok", httpStatus:result.res.status, message:"Key valid — counts against daily 350 req quota", timeMs:ms, costIncurred:false };
  } catch (e) {
    return { provider:"voicerss", category:"voice", keyFound:true, status:"failed", message:e instanceof Error?e.message:String(e), costIncurred:false };
  }
}

// HuggingFace free tier — no cost, but uses a real inference call
async function checkHuggingFaceVoice(key: string): Promise<DiagResult> {
  try {
    const { result, ms } = await timeIt(() =>
      fetch("https://api-inference.huggingface.co/models/facebook/mms-tts-eng", {
        method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({ inputs: SAMPLE_TEXT }),
      })
    );
    if (!result.ok) return { provider:"huggingface", category:"voice", keyFound:true, status:"failed", httpStatus:result.status, message:(await result.text()).slice(0,300), timeMs:ms, costIncurred:false };
    return { provider:"huggingface", category:"voice", keyFound:true, status:"ok", httpStatus:result.status, message:"Working correctly (free tier)", timeMs:ms, costIncurred:false };
  } catch (e) {
    return { provider:"huggingface", category:"voice", keyFound:true, status:"failed", message:e instanceof Error?e.message:String(e), costIncurred:false };
  }
}

// FREE — ElevenLabs /v1/user confirms key validity + shows remaining quota, no audio generated
async function checkElevenLabs(key: string): Promise<DiagResult> {
  try {
    const { result, ms } = await timeIt(() => fetch("https://api.elevenlabs.io/v1/user", { headers: { "xi-api-key": key } }));
    const data = await result.json().catch(() => ({}));
    if (!result.ok) return { provider:"elevenlabs", category:"voice", keyFound:true, status:"failed", httpStatus:result.status, message:JSON.stringify(data).slice(0,300), timeMs:ms, costIncurred:false };
    const charsLeft = data?.subscription?.character_limit - data?.subscription?.character_count;
    return { provider:"elevenlabs", category:"voice", keyFound:true, status:"ok", httpStatus:result.status, message:`Key valid — ${charsLeft ?? "?"} characters remaining this month`, timeMs:ms, costIncurred:false };
  } catch (e) {
    return { provider:"elevenlabs", category:"voice", keyFound:true, status:"failed", message:e instanceof Error?e.message:String(e), costIncurred:false };
  }
}

// FREE — OpenAI /v1/models confirms key validity without spending TTS credits
async function checkOpenAI(key: string): Promise<DiagResult> {
  try {
    const { result, ms } = await timeIt(() => fetch("https://api.openai.com/v1/models", { headers: { Authorization: `Bearer ${key}` } }));
    const data = await result.json().catch(() => ({}));
    if (!result.ok) return { provider:"openai", category:"voice", keyFound:true, status:"failed", httpStatus:result.status, message:JSON.stringify(data).slice(0,300), timeMs:ms, costIncurred:false };
    return { provider:"openai", category:"voice", keyFound:true, status:"ok", httpStatus:result.status, message:"Key valid (quota/billing not checked here — test a real request to confirm balance)", timeMs:ms, costIncurred:false };
  } catch (e) {
    return { provider:"openai", category:"voice", keyFound:true, status:"failed", message:e instanceof Error?e.message:String(e), costIncurred:false };
  }
}

// Google charges a fraction of a cent per char — practically free but not zero
async function checkGoogle(key: string): Promise<DiagResult> {
  try {
    const { result, ms } = await timeIt(() =>
      fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${key}`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: { text: "Hi" }, voice: { languageCode: "en-US", ssmlGender: "MALE" }, audioConfig: { audioEncoding: "MP3" } }),
      })
    );
    const data = await result.json().catch(() => ({}));
    if (!data.audioContent) return { provider:"google", category:"voice", keyFound:true, status:"failed", httpStatus:result.status, message:JSON.stringify(data.error??data).slice(0,300), timeMs:ms, costIncurred:true };
    return { provider:"google", category:"voice", keyFound:true, status:"ok", httpStatus:result.status, message:"Working correctly", timeMs:ms, costIncurred:true };
  } catch (e) {
    return { provider:"google", category:"voice", keyFound:true, status:"failed", message:e instanceof Error?e.message:String(e), costIncurred:false };
  }
}

// ================================================================
//  IMAGE PROVIDER CHECKS
// ================================================================

// FREE — Replicate /v1/account confirms key validity AND shows if billing is set up,
// without running any model (this is exactly what would have shown the credit problem early)
async function checkReplicate(key: string): Promise<DiagResult> {
  try {
    const { result, ms } = await timeIt(() => fetch("https://api.replicate.com/v1/account", { headers: { Authorization: `Bearer ${key}` } }));
    const data = await result.json().catch(() => ({}));
    if (!result.ok) return { provider:"replicate", category:"image", keyFound:true, status:"failed", httpStatus:result.status, message:JSON.stringify(data).slice(0,300), timeMs:ms, costIncurred:false };
    return { provider:"replicate", category:"image", keyFound:true, status:"ok", httpStatus:result.status, message:`Key valid — account: ${data.username ?? "unknown"} (this check does NOT confirm credit balance; a 402 can still occur on generation)`, timeMs:ms, costIncurred:false };
  } catch (e) {
    return { provider:"replicate", category:"image", keyFound:true, status:"failed", message:e instanceof Error?e.message:String(e), costIncurred:false };
  }
}

async function checkHuggingFaceImage(key: string): Promise<DiagResult> {
  try {
    const { result, ms } = await timeIt(() =>
      fetch("https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0", {
        method: "POST", headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
        body: JSON.stringify({ inputs: "test" }),
      })
    );
    if (!result.ok) return { provider:"huggingface", category:"image", keyFound:true, status:"failed", httpStatus:result.status, message:(await result.text()).slice(0,300), timeMs:ms, costIncurred:false };
    return { provider:"huggingface", category:"image", keyFound:true, status:"ok", httpStatus:result.status, message:"Working correctly (free tier, may be slow)", timeMs:ms, costIncurred:false };
  } catch (e) {
    return { provider:"huggingface", category:"image", keyFound:true, status:"failed", message:e instanceof Error?e.message:String(e), costIncurred:false };
  }
}

// ================================================================
//  MAIN HANDLER
// ================================================================
export async function GET(req: NextRequest) {
  // ── Security: require a matching secret ──────────────────────
  const secret = process.env.DIAGNOSE_SECRET;
  const provided = req.nextUrl.searchParams.get("key");

  if (!secret) {
    return NextResponse.json(
      {
        error: "DIAGNOSE_SECRET is not configured. Set it in environment variables to enable diagnostics.",
      },
      { status: 503 }
    );
  }

  if (provided !== secret) {
    return NextResponse.json({ error: "Unauthorized — add ?key=YOUR_DIAGNOSE_SECRET to the URL" }, { status: 401 });
  }

  // ── Cache check ────────────────────────────────────────────
  if (cachedResult && cachedResult.expiresAt > Date.now()) {
    return NextResponse.json({ ...(cachedResult.data as object), cached: true });
  }

  const keys = getKeys();

  const checks: Array<Promise<DiagResult> | DiagResult> = [
    keys.voicerss    ? checkVoiceRSS(keys.voicerss)             : skip("voicerss","voice","VOICERSS_API_KEY"),
    keys.huggingface ? checkHuggingFaceVoice(keys.huggingface)  : skip("huggingface","voice","HUGGINGFACE_API_KEY"),
    keys.elevenlabs  ? checkElevenLabs(keys.elevenlabs)         : skip("elevenlabs","voice","ELEVENLABS_API_KEY"),
    keys.openai      ? checkOpenAI(keys.openai)                 : skip("openai","voice","OPENAI_API_KEY"),
    keys.google      ? checkGoogle(keys.google)                 : skip("google","voice","GOOGLE_TTS_KEY"),
    keys.replicate   ? checkReplicate(keys.replicate)           : skip("replicate","image","REPLICATE_API_TOKEN"),
    keys.huggingface ? checkHuggingFaceImage(keys.huggingface)  : skip("huggingface","image","HUGGINGFACE_API_KEY"),
  ];

  const results = await Promise.all(checks);

  const voiceResults = results.filter(r => r.category === "voice");
  const imageResults = results.filter(r => r.category === "image");
  const workingVoice  = voiceResults.filter(r => r.status === "ok").length;
  const workingImage  = imageResults.filter(r => r.status === "ok").length;
  const costlyChecks  = results.filter(r => r.costIncurred);

  const payload = {
    summary: {
      voice: workingVoice > 0 ? `✅ ${workingVoice} voice provider(s) valid` : "❌ 0 voice providers valid",
      image: workingImage > 0 ? `✅ ${workingImage} image provider(s) valid` : "❌ 0 image providers valid",
    },
    note: "This checks that keys are VALID and reachable. It does NOT guarantee sufficient balance/credit — e.g. Replicate can pass this check but still return 402 on actual generation if credit is $0.",
    costWarning: costlyChecks.length > 0 ? `⚠️ ${costlyChecks.length} check(s) incurred tiny real cost (Google TTS)` : "✅ No real cost incurred by this diagnostic run",
    timestamp: new Date().toISOString(),
    results,
    secured: true,
    securityNote: "Protected by DIAGNOSE_SECRET ✅",
  };

  cachedResult = { data: payload, expiresAt: Date.now() + CACHE_TTL_MS };

  return NextResponse.json(payload);
}

function skip(provider: string, category: "voice"|"image", envName: string): DiagResult {
  return { provider, category, keyFound: false, status: "skipped", message: `No valid ${envName} found`, costIncurred: false };
}