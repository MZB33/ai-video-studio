import { NextResponse } from "next/server";
import { processImage } from "./processor";
import { requireMinimumPlan } from "@/lib/billing-guard";

async function dataUrlToBuffer(dataUrl: string) {
  const matches = dataUrl.match(/^data:(.+);base64,(.*)$/);
  if (!matches) return null;
  const b64 = matches[2];
  return Buffer.from(b64, "base64");
}

async function urlToBuffer(url: string) {
  const resp = await fetch(url);
  if (!resp.ok) return null;
  const arrayBuffer = await resp.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

async function bufferToDataUrl(buf: Buffer, mime = "image/jpeg") {
  return `data:${mime};base64,${buf.toString("base64")}`;
}

export async function POST(request: Request) {
  const planGuard = await requireMinimumPlan(request, "pro");
  if (planGuard) return planGuard;

  try {
    const body = await request.json();
    const { image, mode } = body || {};
    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    // Use the shared processor which attempts external model, replicate, then sharp fallback
    try {
      const result = await processImage(image, mode);
      return NextResponse.json(result);
    } catch (err) {
      return NextResponse.json({ error: String(err) }, { status: 500 });
    }
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
