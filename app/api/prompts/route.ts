import { NextResponse } from "next/server";

// 🎬 FREE CINEMATIC SCENE ENGINE (NO AI REQUIRED)
export async function POST(req: Request) {
  try {
    const { story } = await req.json();

    if (!story || story.length < 10) {
      return NextResponse.json(
        { error: "Story is too short" },
        { status: 400 }
      );
    }

    // 🧠 Simple Scene Split Logic (cost-free)
    const sentences = story
      .split(".")
      .map((s: string) => s.trim())
      .filter(Boolean);

    const scenes: string[] = [];

    // 🎬 Scene 1: Introduction
    scenes.push(
      `${sentences[0] || story} — cinematic wide establishing shot, dramatic lighting, ultra realistic`
    );

    // 🎬 Scene 2: Journey / Conflict
    scenes.push(
      `${sentences[1] || sentences[0]} — adventure scene, tense atmosphere, film style`
    );

    // 🎬 Scene 3: Peak Emotion
    scenes.push(
      `${sentences[2] || sentences[0]} — emotional close-up, cinematic depth of field`
    );

    // 🎬 Scene 4: Climax / Mystery
    scenes.push(
      `${sentences[3] || sentences[0]} — dramatic cinematic climax, epic lighting, 4K`
    );

    return NextResponse.json({
      result: scenes,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("PROMPTS ERROR:", message);

    return NextResponse.json(
      { error: "Failed to generate scenes" },
      { status: 500 }
    );
  }
}