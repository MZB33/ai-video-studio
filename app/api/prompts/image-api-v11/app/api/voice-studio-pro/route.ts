import { NextResponse } from "next/server";
import {
  buildVoiceStudioPackage,
  getVoiceStudioCatalog,
  type PronunciationOverride,
  type VoiceRequest,
} from "@/lib/voice-studio-pro";
import { requireAuthenticatedUserId } from "@/lib/billing/identity";
import { listPronunciationEntries } from "@/lib/voice-studio-store";

function toVoiceRequest(body: Record<string, unknown>): VoiceRequest {
  return {
    text: typeof body.text === "string" ? body.text : "",
    characterId: typeof body.characterId === "string" ? body.characterId : "",
    languageCode: typeof body.languageCode === "string" ? body.languageCode : "",
    accent: typeof body.accent === "string" ? body.accent : "",
    behaviorId: typeof body.behaviorId === "string" ? body.behaviorId : "",
    useCaseId: typeof body.useCaseId === "string" ? body.useCaseId : "",
    speed: Number(body.speed ?? 1),
    pitch: Number(body.pitch ?? 1),
    energy: Number(body.energy ?? 1),
  };
}

export async function GET() {
  try {
    return NextResponse.json(getVoiceStudioCatalog());
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load voice catalog";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const appUserId = await requireAuthenticatedUserId();
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const payload = toVoiceRequest(body);
    const pronunciationOverrides: PronunciationOverride[] = listPronunciationEntries(appUserId).map((entry) => ({
      id: entry.id,
      languageCode: entry.languageCode,
      accent: entry.accent,
      term: entry.term,
      phoneme: entry.phoneme,
      replacement: entry.replacement,
      notes: entry.notes,
    }));

    return NextResponse.json({
      ...buildVoiceStudioPackage({
        ...payload,
        pronunciationOverrides,
      }),
      appUserId,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to build voice package";
    const status = /Unauthenticated/.test(message) ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
