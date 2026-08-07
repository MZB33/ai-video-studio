import { NextResponse } from "next/server";
import { buildPromptScenesWithQuality, normalizeStyle } from "./prompt-utils.mjs";
import { checkAndConsumeQuota } from "@/lib/billing/guard";
import { requireAuthenticatedUserId } from "@/lib/billing/identity";
import { savePromptHistoryEntry } from "@/lib/prompt-history";

function normalizeStory(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  const trimmed = value.trim();
  if (trimmed.length < 8) {
    throw new Error("Story must be at least 8 characters long.");
  }

  return trimmed;
}

export async function POST(req: Request) {
  try {
    const appUserId = await requireAuthenticatedUserId();
    const quota = checkAndConsumeQuota(appUserId);

    if (!quota.allowed) {
      return NextResponse.json(
        {
          error: "Monthly API quota reached for current plan",
          plan: quota.plan,
          requestCount: quota.requestCount,
          monthlyLimit: quota.monthlyLimit,
        },
        {
          status: 429,
          headers: {
            "x-api-plan": quota.plan,
            "x-api-remaining": String(quota.remainingRequests),
          },
        }
      );
    }

    const body = (await req.json().catch(() => ({}))) as { story?: string; style?: unknown };
    const story = normalizeStory(body.story);
    const style = normalizeStyle(body.style);
    const { scenes, qualityReport } = buildPromptScenesWithQuality(story, style);

    savePromptHistoryEntry({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      appUserId,
      story,
      createdAt: new Date().toISOString(),
      result: scenes,
    });

    return NextResponse.json(
      { result: scenes, style, qualityReport },
      {
        headers: {
          "x-api-plan": quota.plan,
          "x-api-remaining": String(quota.remainingRequests),
        },
      }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    const status = /Unauthenticated/.test(message) ? 401 : 400;
    return NextResponse.json({ error: message || "Failed to generate scenes" }, { status });
  }
}
