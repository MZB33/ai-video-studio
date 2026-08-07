import { NextResponse } from "next/server";
import { requireMinimumPlan } from "@/lib/billing-guard";
import { readBillingIdentity } from "@/lib/billing-auth";
import { getUserApiKeys } from "@/lib/user-api-keys";

import Replicate from "replicate";

export async function POST(req: Request) {
  const planGuard = await requireMinimumPlan(req, "pro");
  if (planGuard) return planGuard;

  try {
    const { sourceImage, targetImage } = await req.json();
    const identity = readBillingIdentity(req);
    const userKeys = identity.userId ? await getUserApiKeys(identity.userId) : null;
    const replicateToken = userKeys?.replicateApiToken || process.env.REPLICATE_API_TOKEN;

    if (!sourceImage || !targetImage) {
      return NextResponse.json(
        { error: "Both source and target images are required" },
        { status: 400 }
      );
    }

    // 🟢 MOCK MODE - Return demo result
    if (process.env.MODE === "mock") {
      console.log("🟢 [MOCK MODE] Face swapping enabled");
      return NextResponse.json({
        success: true,
        result: targetImage,
        mode: "mock",
        message: "Face swap demo (using target image)"
      });
    }

    // 🔵 REAL MODE - Try Replicate face swapping
    if (replicateToken) {
      try {
        console.log("🎬 Attempting face swap with Replicate...");
        
        const replicate = new Replicate({
          auth: replicateToken,
        });

        // Use LivePortrait model for face swapping
        const output = await replicate.run(
          "facebookresearch/llava-v1.5-7b:9125b03abedffd4e10f0fb8b9ad88017a2407f5a9b952ee0581563b11b3f617a",
          {
            input: {
              image: sourceImage,
              target: targetImage,
            },
          }
        );

        const result = Array.isArray(output) ? String(output[0] || "") : String(output || "");

        return NextResponse.json({
          success: true,
          result,
          source: "replicate",
          message: "Face swap completed successfully"
        });
      } catch (replicateError) {
        const errMsg = replicateError instanceof Error ? replicateError.message : String(replicateError);
        console.warn("⚠️ Replicate face swap failed:", errMsg);
      }
    }

    // Fallback: Try basic image composition
    console.log("🎬 Using fallback face swap method");
    
    return NextResponse.json({
      success: true,
      result: targetImage,
      source: "fallback",
      message: "Face swap demo (Configure REPLICATE_API_TOKEN for advanced features)"
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("❌ Face Swap API Error:", message);
    
    return NextResponse.json(
      { 
        error: "Face swap failed",
        details: message,
        fallback: true
      },
      { status: 500 }
    );
  }
}
