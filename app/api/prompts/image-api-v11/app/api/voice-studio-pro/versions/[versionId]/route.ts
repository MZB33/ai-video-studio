import { NextResponse } from "next/server";
import { requireAuthenticatedSessionUser } from "@/lib/billing/identity";
import { listVoiceVersions, updateVoiceVersion } from "@/lib/voice-studio-store";

type RouteParams = {
  params: Promise<{ versionId: string }>;
};

function normalize(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function PATCH(req: Request, context: RouteParams) {
  try {
    const authUser = await requireAuthenticatedSessionUser();
    const appUserId = authUser.userId;
    const { versionId } = await context.params;
    const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
    const status = normalize(body.status);
    const actorRole = authUser.role;
    const actorName = authUser.email;

    if (status !== "approved" && status !== "rejected" && status !== "candidate") {
      throw new Error("status must be approved, rejected, or candidate.");
    }

    if (status === "approved" && actorRole !== "approver") {
      throw new Error("Only approver role can approve a version.");
    }

    if (status === "rejected" && actorRole !== "reviewer" && actorRole !== "approver") {
      throw new Error("Only reviewer or approver can reject a version.");
    }

    const approvalNotes = normalize(body.approvalNotes);
    const existingVersion = listVoiceVersions(appUserId).find((entry) => entry.id === versionId);
    if (!existingVersion) {
      return NextResponse.json({ error: "Version not found" }, { status: 404 });
    }

    const existingAuditTrail = Array.isArray(existingVersion.auditTrail) ? existingVersion.auditTrail : [];

    const action = approvalNotes ? "note_updated" : "status_changed";
    const auditEvent = {
      at: new Date().toISOString(),
      actorRole: actorRole as "reviewer" | "approver",
      actorName,
      action: action as "status_changed" | "note_updated",
      status: status as "candidate" | "approved" | "rejected",
      notes: approvalNotes || undefined,
    };

    const updated = updateVoiceVersion(appUserId, versionId, {
      status,
      approvalNotes,
      approvalRole: actorRole as "reviewer" | "approver",
      approvalActor: actorName,
      auditTrail: [...existingAuditTrail, auditEvent],
    });

    if (!updated) {
      return NextResponse.json({ error: "Version not found" }, { status: 404 });
    }

    return NextResponse.json({ version: updated });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update version";
    const status = /Unauthenticated/.test(message) ? 401 : 400;
    return NextResponse.json({ error: message }, { status });
  }
}
