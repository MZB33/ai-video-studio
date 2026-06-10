import { NextResponse } from "next/server";

// Voice mapping for different voice IDs
const voiceMap: Record<string, { lang: string; voice?: string }> = {
  // English US
  "en-us-m-01": { lang: "en-US", voice: "en-US-Jenny" },
  "en-us-m-02": { lang: "en-US", voice: "en-US-Jenny" },
  "en-us-w-01": { lang: "en-US", voice: "en-US-Jenny" },
  "en-uk-m-01": { lang: "en-GB", voice: "en-GB-Sonia" },
  "en-au-m-01": { lang: "en-AU", voice: "en-AU-Natasha" },
  // Urdu
  "ur-pk-m-01": { lang: "ur-PK" },
  "ur-pk-w-01": { lang: "ur-PK" },
  "ur-pk-b-01": { lang: "ur-PK" },
  "ur-pk-g-01": { lang: "ur-PK" },
  // Hindi
  "hi-in-m-01": { lang: "hi-IN" },
  "hi-in-w-01": { lang: "hi-IN" },
  // Arabic
  "ar-sa-m-01": { lang: "ar-SA" },
  "ar-sa-w-01": { lang: "ar-SA" },
  // Default
  "sp-epic-m": { lang: "en-US" },
  "sp-narrator": { lang: "en-GB" },
};

export async function POST(req: Request) {
  try {
    const { text, voice, emotion, speed, pitch } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const voiceConfig = voiceMap[voice] || { lang: "en-US" };
    const finalSpeed = speed || 1.0;
    const finalPitch = pitch || 1.0;

    // For English voices, use browser speech synthesis
    if (voiceConfig.lang === "en-US" || voiceConfig.lang === "en-GB" || voiceConfig.lang === "en-AU") {
      // Return a marker that tells frontend to use browser speech
      return NextResponse.json({
        audio: null,
        useBrowserSpeech: true,
        lang: voiceConfig.lang,
        speed: finalSpeed,
        pitch: finalPitch,
      });
    }

    // For Urdu, Hindi, Arabic - use Google Translate TTS (free)
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${voiceConfig.lang}&client=tw-ob`;

    return NextResponse.json({
      audio: ttsUrl,
      useBrowserSpeech: false,
      lang: voiceConfig.lang,
    });

  } catch (error: any) {
    console.error("Voice API Error:", error.message);
    return NextResponse.json({ error: "Voice generation failed" }, { status: 500 });
  }
}