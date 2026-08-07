import { NextResponse } from "next/server";
import {
  getMonitoringSummary,
  isMonitoringSummaryAuthorized,
  recordFrontendError,
  recordPublicVisit,
} from "@/lib/public-monitoring-store";

type MonitoringPayload = {
  type?: string;
  visitorId?: string;
  path?: string;
  referrer?: string;
  userAgent?: string;
  message?: string;
  stack?: string;
};

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as MonitoringPayload;

    if (payload.type === "visit" && payload.visitorId && payload.path) {
      await recordPublicVisit(request.headers, {
        visitorId: payload.visitorId,
        path: payload.path,
        referrer: payload.referrer,
        userAgent: payload.userAgent,
      });

      return NextResponse.json({ ok: true });
    }

    if (payload.type === "frontend-error" && payload.visitorId && payload.path && payload.message) {
      await recordFrontendError(request.headers, {
        visitorId: payload.visitorId,
        path: payload.path,
        message: payload.message,
        stack: payload.stack,
      });

      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Invalid monitoring payload" }, { status: 400 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Monitoring request failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  if (!isMonitoringSummaryAuthorized(request.headers)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const summary = await getMonitoringSummary();
  return NextResponse.json(summary);
}