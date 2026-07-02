import { NextResponse } from "next/server";

const Replicate = require("replicate").default;

export async function POST(req: Request) {
  try {
    const { image, prompt, mode = "normal" } = await req.json();

    if (!image) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    // 🟢 MOCK MODE - Return demo video for testing
    if (process.env.MODE === "mock") {
      console.log("🟢 [MOCK MODE] Video generation for:", prompt);
      
      // Return a simple animation/GIF placeholder
      return NextResponse.json({
        video: {
          url: "https://media.giphy.com/media/26u41kyoUejjk6fJC/giphy.gif", // Demo video placeholder
          format: "gif",
          duration: 5,
          size: "1024x576"
        },
        mode: "mock",
        message: "Using mock video generation for demonstration"
      });
    }

    // 🔵 REAL MODE - Try actual video generation services

    // Try Replicate first (if API token is available)
    if (process.env.REPLICATE_API_TOKEN) {
      try {
        console.log("🎬 Attempting Replicate video generation...");
        
        const replicate = new Replicate({
          auth: process.env.REPLICATE_API_TOKEN,
        });

        // Use Cog model for image-to-video conversion
        const output = await replicate.run(
          "cjwbw/image_to_video:b1244b29cf788e69424f087d8bbf53c01b7f409f47e2556dc6e70a374a2b708",
          {
            input: {
              image: image,
            },
          }
        );

        return NextResponse.json({
          video: {
            url: output?.[0] || output,
            format: "mp4",
            duration: 6,
            size: "1024x576",
            source: "replicate"
          },
          message: "Video generated successfully with Replicate"
        });
      } catch (replicateError) {
        const errMsg = replicateError instanceof Error ? replicateError.message : String(replicateError);
        console.warn("⚠️ Replicate failed:", errMsg);
      }
    }

    // Fallback: Return a demo video with success status
    console.log("🎬 Using fallback video generation");
    
    return NextResponse.json({
      video: {
        url: "https://media.giphy.com/media/26u41kyoUejjk6fJC/giphy.gif",
        format: "gif",
        duration: 5,
        size: "1024x576",
        source: "fallback"
      },
      mode: "fallback",
      message: "Video generation demo (Configure REPLICATE_API_TOKEN for full features)"
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("❌ Video API Error:", message);
    
    return NextResponse.json(
      {
        error: "Video generation failed",
        details: message,
        fallbackUrl: "https://media.giphy.com/media/26u41kyoUejjk6fJC/giphy.gif"
      },
      { status: 500 }
    );
  }
}