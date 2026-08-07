import { NextResponse } from "next/server";
import { getPromptHistory } from "@/lib/prompt-history";
import { requireAuthenticatedUserId } from "@/lib/billing/identity";

export async function GET() {
  try {
    const appUserId = await requireAuthenticatedUserId();
    return NextResponse.json({ history: getPromptHistory(appUserId) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load prompt history";
    const status = /Unauthenticated/.test(message) ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
