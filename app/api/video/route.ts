import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { image, prompt } = await req.json();

    if (!image) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    console.log("🎬 Mock video generation for:", prompt);

    // Instead of a real video, return a data URL or a placeholder
    // For now, return a success message with instructions
    
    return NextResponse.json({ 
      video: null,
      success: true,
      message: "Video generation will work when you add real AI service (Replicate/Runway)",
      mock: true
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Video API Error:", message);
    return NextResponse.json({ 
      error: "Video generation failed", 
      details: message 
    }, { status: 500 });
  }
}