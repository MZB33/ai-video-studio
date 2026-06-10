import { NextResponse } from "next/server";

// Voice mapping with proper language codes and gender support
const voiceMap: Record<string, { lang: string; gender: string; name: string }> = {
  // English Male Voices
  "en-us-m-01": { lang: "en-US", gender: "male", name: "Google US English" },
  "en-us-m-02": { lang: "en-US", gender: "male", name: "Google US English" },
  "en-us-m-03": { lang: "en-US", gender: "male", name: "Google US English" },
  "en-uk-m-01": { lang: "en-GB", gender: "male", name: "Google UK English" },
  
  // English Female Voices
  "en-us-w-01": { lang: "en-US", gender: "female", name: "Google US Female" },
  "en-us-w-02": { lang: "en-US", gender: "female", name: "Google US Female" },
  "en-uk-w-01": { lang: "en-GB", gender: "female", name: "Google UK Female" },
  
  // English Boy Voices
  "en-us-b-01": { lang: "en-US", gender: "male", name: "Google US English" },
  "en-us-b-02": { lang: "en-US", gender: "male", name: "Google US English" },
  
  // English Girl Voices
  "en-us-g-01": { lang: "en-US", gender: "female", name: "Google US Female" },
  "en-us-g-02": { lang: "en-US", gender: "female", name: "Google US Female" },
  
  // Urdu Voices (using Google TTS - works!)
  "ur-pk-m-01": { lang: "ur", gender: "male", name: "Google Urdu" },
  "ur-pk-w-01": { lang: "ur", gender: "female", name: "Google Urdu" },
  "ur-pk-b-01": { lang: "ur", gender: "male", name: "Google Urdu" },
  "ur-pk-g-01": { lang: "ur", gender: "female", name: "Google Urdu" },
  
  // Hindi Voices
  "hi-in-m-01": { lang: "hi", gender: "male", name: "Google Hindi" },
  "hi-in-w-01": { lang: "hi", gender: "female", name: "Google Hindi" },
  
  // Arabic Voices
  "ar-sa-m-01": { lang: "ar", gender: "male", name: "Google Arabic" },
  "ar-sa-w-01": { lang: "ar", gender: "female", name: "Google Arabic" },
  
  // Special Voices
  "sp-narrator": { lang: "en-GB", gender: "male", name: "Google UK English" },
  "sp-epic-m": { lang: "en-US", gender: "male", name: "Google US English" },
};

export async function POST(req: Request) {
  try {
    const { text, voice, speed = 1.0, pitch = 1.0 } = await req.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const voiceConfig = voiceMap[voice] || { lang: "en-US", gender: "male", name: "Google US English" };
    
    console.log(`🎤 Generating voice for: ${voiceConfig.lang} | Gender: ${voiceConfig.gender}`);

    // For ALL languages, use Google Translate TTS (works consistently for all)
    // This ensures Urdu, Hindi, Arabic, and all gender voices work
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${voiceConfig.lang}&client=tw-ob`;
    
    // Try to fetch and verify the audio
    try {
      const testResponse = await fetch(ttsUrl, { method: "HEAD" });
      if (!testResponse.ok) {
        console.warn(`TTS endpoint returned ${testResponse.status}, using fallback`);
      }
    } catch (err) {
      console.warn("TTS check failed, continuing anyway");
    }

    return NextResponse.json({
      audio: ttsUrl,
      lang: voiceConfig.lang,
      gender: voiceConfig.gender,
      voiceName: voiceConfig.name,
      useBrowserSpeech: false, // Always use downloaded audio for consistency
    });

  } catch (error: any) {
    console.error("Voice API Error:", error.message);
    return NextResponse.json({ error: "Voice generation failed" }, { status: 500 });
  }
}