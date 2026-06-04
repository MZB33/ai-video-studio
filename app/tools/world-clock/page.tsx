"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";

const TIMEZONES = [
  { label: "Local", zone: Intl.DateTimeFormat().resolvedOptions().timeZone },
  { label: "UTC", zone: "UTC" },
  { label: "New York", zone: "America/New_York" },
  { label: "London", zone: "Europe/London" },
  { label: "Tokyo", zone: "Asia/Tokyo" },
  { label: "Dubai", zone: "Asia/Dubai" },
  { label: "Sydney", zone: "Australia/Sydney" },
];

const formatTime = (zone: string, date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: zone,
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  }).format(date);
};

const formatDate = (zone: string, date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: zone,
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

export default function WorldClockPage() {
  const router = useRouter();
  const [now, setNow] = useState(new Date());
  const [selectedZone, setSelectedZone] = useState(TIMEZONES[0].zone);

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f172a 0%, #111827 100%)", padding: "1rem 1rem 80px 1rem" }}>
      <div style={{ marginBottom: "1.5rem", paddingTop: "1rem" }}>
        <button onClick={() => router.back()} style={{ background: "rgba(255,255,255,0.12)", border: "none", padding: "8px 16px", borderRadius: 40, color: "white", cursor: "pointer", marginBottom: "1rem" }}>
          ← Back
        </button>
        <h1 style={{ color: "white", margin: 0, fontSize: "1.8rem" }}>🕒 World Clock</h1>
        <p style={{ color: "rgba(255,255,255,0.75)", marginTop: "0.25rem" }}>View the current time across major cities and time zones.</p>
      </div>

      <div style={{ background: "rgba(255,255,255,0.95)", borderRadius: 24, padding: "1.5rem", maxWidth: 760, margin: "0 auto" }}>
        <div style={{ display: "grid", gap: "1rem", marginBottom: "1.5rem" }}>
          <label style={{ display: "flex", flexDirection: "column", gap: 6, fontWeight: 600 }}>
            Choose time zone
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              style={{ width: "100%", padding: "0.9rem 1rem", borderRadius: 16, border: "1px solid #d1d5db", fontSize: "1rem" }}
            >
              {TIMEZONES.map((zone) => (
                <option key={zone.zone} value={zone.zone}>
                  {zone.label} ({zone.zone})
                </option>
              ))}
            </select>
          </label>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
          {TIMEZONES.map((zone) => (
            <div key={zone.zone} style={{ background: "white", borderRadius: 20, padding: "1.25rem", boxShadow: "0 10px 25px rgba(0,0,0,0.05)" }}>
              <div style={{ fontSize: "0.95rem", color: "#4b5563", marginBottom: 6 }}>{zone.label}</div>
              <div style={{ fontSize: "1.8rem", fontWeight: 700 }}>{formatTime(zone.zone, now)}</div>
              <div style={{ color: "#6b7280", marginTop: 4 }}>{formatDate(zone.zone, now)}</div>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "1.5rem", padding: "1.25rem", borderRadius: 20, background: "#f8fafc", border: "1px solid #e2e8f0" }}>
          <div style={{ fontSize: "0.95rem", color: "#4b5563", marginBottom: 8 }}>Selected zone</div>
          <div style={{ fontSize: "1.6rem", fontWeight: 700 }}>{formatTime(selectedZone, now)}</div>
          <div style={{ color: "#6b7280", marginTop: 4 }}>{formatDate(selectedZone, now)}</div>
        </div>
      </div>

      <BottomNav active="tools" onNavigate={(href) => router.push(href)} />
    </div>
  );
}
