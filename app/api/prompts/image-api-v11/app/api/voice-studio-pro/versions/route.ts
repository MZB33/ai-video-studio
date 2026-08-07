import { NextResponse } from "next/server";
import { requireAuthenticatedUserId } from "@/lib/billing/identity";
import { buildAudioPackage } from "@/lib/voice-audio";
import {
  createVoiceVersion,
  listPronunciationEntries,
  listVoiceVersions,
} from "@/lib/voice-studio-store";
import { buildVoiceStudioPackage, type VoiceRequest } from "@/lib/voice-studio-pro";

function normalize(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function toRequest(body: Record<string, unknown>): VoiceRequest {
  return {
    text: normalize(body.text),
    characterId: normalize(body.characterId),
    languageCode: normalize(body.languageCode),
    accent: normalize(body.accent),
    behaviorId: normalize(body.behaviorId),
    useCaseId: normalize(body.useCaseId),
    speed: Number(body.speed ?? 1),
    pitch: Number(body.pitch ?? 1),
    energy: Number(body.energy ?? 1),
  };
}

export async function GET(req: Request) {
  try {
    const appUserId = await requireAuthenticatedUserId();
    const url = new URL(req.url);
    const characterId = normalize(url.searchParams.get("characterId"));
    const behaviorId = normalize(url.searchParams.get("behaviorId"));

    const versions = listVoiceVersions(appUserId).filter((item) => {
      if (characterId && item.characterId !== characterId) {
        return false;
      }
      if (behaviorId && item.behaviorId !== behaviorId) {
        return false;
      }
      return true;
    });

    return NextResponse.json({ versions });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load versions";
    const status = /Unauthenticated/.test(message) ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(req: Request) {
  try {
    const appUserId = await requireAuthenticatedUserId();
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const payload = toRequest(body);
    const labelRaw = normalize(body.label).toUpperCase();
    const label = labelRaw === "A" || labelRaw === "B" ? labelRaw : "Custom";

    const pronunciationOverrides = listPronunciationEntries(appUserId).map((entry) => ({
      id: entry.id,
      languageCode: entry.languageCode,
      accent: entry.accent,
      term: entry.term,
      phoneme: entry.phoneme,
      replacement: entry.replacement,
      notes: entry.notes,
    }));

    const packageResult = buildVoiceStudioPackage({
      ...payload,
      pronunciationOverrides,
    });
    const audioPackage = buildAudioPackage({
      text: packageResult.request.text,
      speed: packageResult.request.speed,
      pitch: packageResult.request.pitch,
      energy: packageResult.request.energy,
    });

    const version = createVoiceVersion({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      appUserId,
      createdAt: new Date().toISOString(),
      label,
      status: "candidate",
      text: packageResult.request.text,
      characterId: packageResult.request.characterId,
      languageCode: packageResult.request.languageCode,
      accent: packageResult.request.accent,
      behaviorId: packageResult.request.behaviorId,
      useCaseId: packageResult.request.useCaseId,
      speed: packageResult.request.speed,
      pitch: packageResult.request.pitch,
      energy: packageResult.request.energy,
      audioDataUrl: audioPackage.audioDataUrl,
      analytics: audioPackage.analytics,
      renderPrompt: packageResult.renderPrompt,
      approvalRole: "reviewer",
      approvalActor: "System",
      auditTrail: [
        {
          at: new Date().toISOString(),
          actorRole: "reviewer",
          actorName: "System",
          action: "created",
          status: "candidate",
          notes: "Version created for comparison.",
        },
      ],
    });

    return NextResponse.json({ version, qualityReview: packageResult.qualityReview });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create version";
    const status = /Unauthenticated/.test(message) ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
