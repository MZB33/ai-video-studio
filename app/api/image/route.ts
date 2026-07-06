// app/api/image/route.ts
// ================================================================
//  Real AI image generation — replaces Unsplash stock-photo mock
//  Priority: Replicate (FLUX) → HuggingFace (Stable Diffusion XL)
// ================================================================
import { NextRequest, NextResponse } from "next/server";

// ── Style presets — modify the prompt to steer output ─────────
const STYLE_PROMPTS: Record<string, string> = {
  "realistic-portrait": "photorealistic, professional photography, sharp focus, natural lighting, 8k, high detail",
  "3d-art":             "3D render, octane render, cinema4d, highly detailed, studio lighting",
  "handmade-art":       "watercolor painting, traditional art, hand-painted texture, artistic brush strokes",
  "cartoon-art":        "cartoon style, anime, vibrant colors, clean lines, Studio Ghibli inspired",
  "historical":         "historical photograph style, period-accurate, documentary photography",
  "cinematic":          "cinematic lighting, movie still, dramatic composition, film grain, 35mm",
  "logo":               "minimalist logo design, vector art, clean, professional branding",
  "poster":             "poster design, bold typography space, graphic design, high contrast",
};

function clamp(v: number, min: number, max: number) { return Math.min(max, Math.max(min, v)); }

async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs = 45000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try { return await fetch(url, { ...options, signal: controller.signal }); }
  finally { clearTimeout(timer); }
}

function getKeys() {
  const replicate   = (process.env.REPLICATE_API_TOKEN  ?? "").trim();
  const huggingface = (process.env.HUGGINGFACE_API_KEY  ?? "").trim();
  const invalid = (s: string) => !s || s.includes("your_") || s.includes("xxxxxxx");
  return {
    replicate:   !invalid(replicate)   && replicate.startsWith("r8_")   ? replicate   : null,
    huggingface: !invalid(huggingface) && huggingface.startsWith("hf_") ? huggingface : null,
  };
}

// ================================================================
//  PROVIDER: Replicate — FLUX Schnell (fast, high quality)
// ================================================================
async function tryReplicate(prompt: string, aspectRatio: string, token: string): Promise<string> {
  // "Prefer: wait" makes Replicate hold the connection until done (or ~60s timeout),
  // avoiding the need to poll for most requests.
  const res = await fetchWithTimeout(
    "https://api.replicate.com/v1/models/black-forest-labs/flux-schnell/predictions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Prefer: "wait",
      },
      body: JSON.stringify({
        input: {
          prompt,
          aspect_ratio: aspectRatio,
          output_format: "jpg",
          num_outputs: 1,
        },
      }),
    },
    50000
  );

  const data = await res.json();

  if (!res.ok) throw new Error(`Replicate ${res.status}: ${JSON.stringify(data).slice(0, 300)}`);

  // If already succeeded (common with Prefer: wait for fast models)
  if (data.status === "succeeded" && data.output) {
    const url = Array.isArray(data.output) ? data.output[0] : data.output;
    if (url) return url;
  }

  // Otherwise poll the prediction until it finishes (max ~30s extra)
  if (data.urls?.get) {
    for (let i = 0; i < 15; i++) {
      await new Promise(r => setTimeout(r, 2000));
      const poll = await fetchWithTimeout(data.urls.get, { headers: { Authorization: `Bearer ${token}` } }, 10000);
      const pollData = await poll.json();
      if (pollData.status === "succeeded" && pollData.output) {
        const url = Array.isArray(pollData.output) ? pollData.output[0] : pollData.output;
        if (url) return url;
      }
      if (pollData.status === "failed" || pollData.status === "canceled") {
        throw new Error(`Replicate generation ${pollData.status}: ${pollData.error ?? "unknown"}`);
      }
    }
  }

  throw new Error("Replicate: generation timed out without a result");
}

// ================================================================
//  PROVIDER: HuggingFace — Stable Diffusion XL (free fallback)
// ================================================================
async function tryHuggingFace(prompt: string, key: string): Promise<Buffer> {
  let lastErr: unknown;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetchWithTimeout(
        "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
          body: JSON.stringify({ inputs: prompt }),
        },
        35000
      );
      if (!res.ok) {
        const errText = await res.text();
        if (res.status === 503 && attempt === 0) { await new Promise(r => setTimeout(r, 4000)); continue; }
        throw new Error(`HuggingFace ${res.status}: ${errText.slice(0, 200)}`);
      }
      return Buffer.from(await res.arrayBuffer());
    } catch (e) {
      lastErr = e;
      if (e instanceof Error && e.name === "AbortError") lastErr = new Error("HuggingFace request timed out (35s)");
      if (attempt === 0) { await new Promise(r => setTimeout(r, 1500)); continue; }
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error("HuggingFace: unknown error");
}

// ================================================================
//  MAIN HANDLER
// ================================================================
export async function POST(req: NextRequest) {
  try {
    const body   = await req.json();
    const prompt = String(body.prompt ?? "").trim();
    const style  = String(body.style  ?? body.type ?? "realistic-portrait");
    const width  = clamp(parseInt(body.width)  || 1024, 256, 1536);
    const height = clamp(parseInt(body.height) || 1024, 256, 1536);

    if (!prompt) return NextResponse.json({ error: "Prompt is empty" }, { status: 400 });
    if (prompt.length > 1000) return NextResponse.json({ error: "Prompt too long (max 1000 chars)" }, { status: 400 });

    // Build the real prompt: user's text + style modifiers
    const styleModifier = STYLE_PROMPTS[style] ?? "";
    const fullPrompt = styleModifier ? `${prompt}, ${styleModifier}` : prompt;

    // Convert width/height to Replicate's aspect_ratio format
    const ratio = width / height;
    const aspectRatio =
      Math.abs(ratio - 1)     < 0.05 ? "1:1"  :
      Math.abs(ratio - 4/3)   < 0.1  ? "4:3"  :
      Math.abs(ratio - 3/4)   < 0.1  ? "3:4"  :
      Math.abs(ratio - 16/9)  < 0.1  ? "16:9" :
      Math.abs(ratio - 9/16)  < 0.1  ? "9:16" : "1:1";

    const keys = getKeys();
    const errors: string[] = [];

    console.log(`🎨 Generating image — prompt: "${fullPrompt.slice(0,80)}..." style: ${style}`);

    // ── PRIORITY 1: Replicate (FLUX) — best quality, fast ──────
    if (keys.replicate) {
      try {
        const imageUrl = await tryReplicate(fullPrompt, aspectRatio, keys.replicate);
        console.log(`✅ Image generated via Replicate`);
        return NextResponse.json({ image: imageUrl, provider: "replicate", prompt: fullPrompt });
      } catch (e) {
        errors.push(`replicate: ${e instanceof Error ? e.message : String(e)}`);
        console.error("Replicate failed:", e);
      }
    }

    // ── PRIORITY 2: HuggingFace SDXL — free fallback ───────────
    if (keys.huggingface) {
      try {
        const buffer = await tryHuggingFace(fullPrompt, keys.huggingface);
        const dataUrl = `data:image/jpeg;base64,${buffer.toString("base64")}`;
        console.log(`✅ Image generated via HuggingFace`);
        return NextResponse.json({ image: dataUrl, provider: "huggingface", prompt: fullPrompt });
      } catch (e) {
        errors.push(`huggingface: ${e instanceof Error ? e.message : String(e)}`);
        console.error("HuggingFace failed:", e);
      }
    }

    // ── NO PROVIDER WORKED ──────────────────────────────────────
    const hasKeys = keys.replicate || keys.huggingface;
    if (hasKeys) {
      return NextResponse.json({ error: "All image providers failed", details: errors }, { status: 500 });
    }

    return NextResponse.json({
      image: null, demo: true,
      message: "No valid image API key found. Add REPLICATE_API_TOKEN or HUGGINGFACE_API_KEY to .env.local",
      setupGuide: {
        replicate:   { key: "REPLICATE_API_TOKEN",  url: "https://replicate.com/account/api-tokens",  note: "Pay per use (~$0.003/image) — best quality via FLUX" },
        huggingface: { key: "HUGGINGFACE_API_KEY",  url: "https://huggingface.co/settings/tokens",     note: "Free — Stable Diffusion XL, slower & lower quality" },
      },
    });

  } catch (err) {
    console.error("Image API unhandled:", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Internal error" }, { status: 500 });
  }
}

export async function GET() {
  const keys = getKeys();
  return NextResponse.json({
    status: "ok",
    available: { replicate: !!keys.replicate, huggingface: !!keys.huggingface },
    note: "This endpoint now generates real AI images from your prompt — no more Unsplash stock photos.",
  });
}