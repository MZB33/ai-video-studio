"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const VISITOR_STORAGE_KEY = "ai_video_public_visitor_id";

function getVisitorId() {
  if (typeof window === "undefined") {
    return "server";
  }

  const existing = window.localStorage.getItem(VISITOR_STORAGE_KEY);

  if (existing) {
    return existing;
  }

  const created = window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  window.localStorage.setItem(VISITOR_STORAGE_KEY, created);
  return created;
}

function sendMonitoringEvent(body: Record<string, unknown>) {
  const payload = JSON.stringify(body);

  if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
    const blob = new Blob([payload], { type: "application/json" });
    navigator.sendBeacon("/api/monitoring", blob);
    return;
  }

  void fetch("/api/monitoring", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  });
}

export default function PublicAppMonitor() {
  const pathname = usePathname();
  const lastVisitPathRef = useRef("");

  useEffect(() => {
    if (!pathname || lastVisitPathRef.current === pathname) {
      return;
    }

    lastVisitPathRef.current = pathname;

    sendMonitoringEvent({
      type: "visit",
      visitorId: getVisitorId(),
      path: pathname,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
    });
  }, [pathname]);

  useEffect(() => {
    const visitorId = getVisitorId();

    const handleError = (event: ErrorEvent) => {
      sendMonitoringEvent({
        type: "frontend-error",
        visitorId,
        path: window.location.pathname,
        message: event.message || "Unhandled browser error",
        stack: event.error instanceof Error ? event.error.stack : "",
      });
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const message = reason instanceof Error ? reason.message : typeof reason === "string" ? reason : "Unhandled promise rejection";
      const stack = reason instanceof Error ? reason.stack || "" : "";

      sendMonitoringEvent({
        type: "frontend-error",
        visitorId,
        path: window.location.pathname,
        message,
        stack,
      });
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);

  return null;
}