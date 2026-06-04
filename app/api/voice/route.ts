import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { text, voice = "en-US-Jenny" } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    console.log(`🎤 Voiceover for: ${text.substring(0, 50)}...`);

    // Mock audio files (replace with real TTS API later)
    const mockAudio = [
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    ];
    
    const randomAudio = mockAudio[Math.floor(Math.random() * mockAudio.length)];
    const audioUrl = `${randomAudio}?t=${Date.now()}`;

    return NextResponse.json({ 
      audio: audioUrl,
      duration: text.length / 15,
      provider: "mock",
      success: true 
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Voice API Error:", message);
    return NextResponse.json({ error: "Voice generation failed" }, { status: 500 });
  }
}