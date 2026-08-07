import { NextResponse } from "next/server";
import { requireAuthenticatedUserId } from "@/lib/billing/identity";
import {
  listPronunciationEntries,
  removePronunciationEntry,
  savePronunciationEntry,
} from "@/lib/voice-studio-store";

function normalize(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function GET(req: Request) {
  try {
    const appUserId = await requireAuthenticatedUserId();
    const url = new URL(req.url);
    const languageCode = normalize(url.searchParams.get("languageCode"));
    const accent = normalize(url.searchParams.get("accent"));

    const all = listPronunciationEntries(appUserId);
    const filtered = all.filter((entry) => {
      const languageMatch = !languageCode || entry.languageCode === languageCode;
      const accentMatch = !accent || entry.accent === "*" || entry.accent === accent;
      return languageMatch && accentMatch;
    });

    return NextResponse.json({ entries: filtered });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load pronunciation entries";
    const status = /Unauthenticated/.test(message) ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(req: Request) {
  try {
    const appUserId = await requireAuthenticatedUserId();
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;

    const languageCode = normalize(body.languageCode);
    const accent = normalize(body.accent) || "*";
    const term = normalize(body.term);
    const phoneme = normalize(body.phoneme);
    const replacement = normalize(body.replacement);
    const notes = normalize(body.notes);

    if (!languageCode || !term || !phoneme || !replacement) {
      throw new Error("languageCode, term, phoneme, and replacement are required.");
    }

    const id = normalize(body.id) || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const entry = savePronunciationEntry({
      id,
      appUserId,
      languageCode,
      accent,
      term,
      phoneme,
      replacement,
      notes,
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json({ entry });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save pronunciation entry";
    const status = /Unauthenticated/.test(message) ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(req: Request) {
  try {
    const appUserId = await requireAuthenticatedUserId();
    const url = new URL(req.url);
    const id = normalize(url.searchParams.get("id"));
    if (!id) {
      throw new Error("Pronunciation entry id is required.");
    }

    removePronunciationEntry(appUserId, id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete pronunciation entry";
    const status = /Unauthenticated/.test(message) ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
