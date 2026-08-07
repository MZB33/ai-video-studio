import { NextResponse } from "next/server";
import { requireMinimumPlan } from "@/lib/billing-guard";
import { readBillingIdentity } from "@/lib/billing-auth";
import { getUserApiKeys } from "@/lib/user-api-keys";

import Replicate from "replicate";

type VideoPayload = {
  url: string;
  format: "gif" | "mp4";
  duration: number;
  size: string;
  source: "mock" | "replicate" | "fallback";
};

function toPayload(video: VideoPayload, mode: "mock" | "fallback" | "live", message: string) {
  return {
    video: video.url,
    videoMeta: video,
    mode,
    message,
  };
}

export async function POST(req: Request) {
  const planGuard = await requireMinimumPlan(req, "pro");
  if (planGuard) return planGuard;

  try {
    const { image, prompt } = await req.json();
    const identity = readBillingIdentity(req);
    const userKeys = identity.userId ? await getUserApiKeys(identity.userId) : null;
    const replicateToken = userKeys?.replicateApiToken || process.env.REPLICATE_API_TOKEN;
    const providerErrors: string[] = [];

    if (!image) {
      return NextResponse.json({ error: "Image is required" }, { status: 400 });
    }

    // 🟢 MOCK MODE - Return demo video for testing
    if (process.env.MODE === "mock") {
      console.log("🟢 [MOCK MODE] Video generation for:", prompt);

      return NextResponse.json(
        toPayload(
        {
          url: "https://media.giphy.com/media/26u41kyoUejjk6fJC/giphy.gif",
          format: "gif",
          duration: 5,
          size: "1024x576",
          source: "mock",
        },
        "mock",
        "Using mock video generation for demonstration"
      ));
    }

    // 🔵 REAL MODE - Try actual video generation services

    // Try Replicate first (if API token is available)
    if (replicateToken) {
      try {
        console.log("🎬 Attempting Replicate video generation...");
        
        const replicate = new Replicate({
          auth: replicateToken,
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

        const url = Array.isArray(output) ? String(output[0] || "") : String(output || "");
        if (!url) {
          throw new Error("Replicate returned an empty video URL");
        }

        return NextResponse.json(
          toPayload(
          {
            url,
            format: "mp4",
            duration: 6,
            size: "1024x576",
            source: "replicate",
          },
          "live",
          "Video generated successfully with Replicate"
        ));
      } catch (replicateError) {
        const errMsg = replicateError instanceof Error ? replicateError.message : String(replicateError);
        providerErrors.push(`replicate: ${errMsg}`);
        console.warn("⚠️ Replicate failed:", errMsg);
      }
    }

    // Fallback: Return a demo video with success status
    console.log("🎬 Using fallback video generation");
    
    return NextResponse.json({
      ...toPayload(
      {
        url: "https://media.giphy.com/media/26u41kyoUejjk6fJC/giphy.gif",
        format: "gif",
        duration: 5,
        size: "1024x576",
        source: "fallback",
      },
      "fallback",
      "Video generation demo (Configure REPLICATE_API_TOKEN for full features)"
      ),
      providerErrors,
      success: true,
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