import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { getExpectedMonitoringAdminSession, MONITORING_ADMIN_COOKIE } from "@/lib/monitoring-admin";

type MonitoringSummary = {
  storage: "memory" | "upstash";
  uniqueVisitors: number;
  recentVisits: Array<{ visitorId: string; path: string; lastSeenAt: string; visitCount: number }>;
  recentErrors: Array<{ visitorId: string; path: string; message: string; stack: string; createdAt: string }>;
};

async function loadMonitoringSummary(): Promise<MonitoringSummary> {
  const requestHeaders = await headers();
  const protocol = requestHeaders.get("x-forwarded-proto") || "http";
  const host = requestHeaders.get("x-forwarded-host") || requestHeaders.get("host") || "localhost:3000";
  const secret = process.env.MONITORING_API_KEY || "";
  const response = await fetch(`${protocol}://${host}/api/monitoring`, {
    headers: secret ? { "x-monitoring-key": secret } : undefined,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Unable to load monitoring summary");
  }

  return (await response.json()) as MonitoringSummary;
}

export const metadata = {
  title: "Monitoring Admin",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function MonitoringAdminPage() {
  const expectedSession = getExpectedMonitoringAdminSession();
  const sessionCookie = (await cookies()).get(MONITORING_ADMIN_COOKIE)?.value || "";

  if (!expectedSession || sessionCookie !== expectedSession) {
    redirect("/admin/login");
  }

  const summary = await loadMonitoringSummary();

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <section className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/20 backdrop-blur">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">Admin monitoring</p>
              <h1 className="text-3xl font-semibold">Public visitor activity</h1>
              <p className="max-w-3xl text-sm text-slate-300">
                This dashboard is restricted to authenticated admins and reads the live monitoring summary from /api/monitoring.
              </p>
            </div>
            <form action="/api/admin/logout" method="post">
              <button
                type="submit"
                className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-white/15"
              >
                Sign out
              </button>
            </form>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            { label: "Storage", value: summary.storage },
            { label: "Unique visitors", value: String(summary.uniqueVisitors) },
            { label: "Recent errors", value: String(summary.recentErrors.length) },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-white/10 bg-slate-900/80 p-5">
              <div className="text-xs uppercase tracking-[0.25em] text-slate-400">{item.label}</div>
              <div className="mt-2 text-2xl font-semibold">{item.value}</div>
            </div>
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5">
            <h2 className="text-lg font-semibold">Recent visitors</h2>
            <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-slate-300">
                  <tr>
                    <th className="px-4 py-3 font-medium">Visitor</th>
                    <th className="px-4 py-3 font-medium">Path</th>
                    <th className="px-4 py-3 font-medium">Visits</th>
                    <th className="px-4 py-3 font-medium">Last seen</th>
                  </tr>
                </thead>
                <tbody>
                  {summary.recentVisits.length > 0 ? (
                    summary.recentVisits.map((visit) => (
                      <tr key={`${visit.visitorId}-${visit.lastSeenAt}`} className="border-t border-white/5">
                        <td className="px-4 py-3 font-mono text-xs text-cyan-200">{visit.visitorId.slice(0, 10)}</td>
                        <td className="px-4 py-3 text-slate-200">{visit.path}</td>
                        <td className="px-4 py-3 text-slate-200">{visit.visitCount}</td>
                        <td className="px-4 py-3 text-slate-400">{new Date(visit.lastSeenAt).toLocaleString()}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="px-4 py-6 text-slate-400" colSpan={4}>
                        No visitors recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-5">
            <h2 className="text-lg font-semibold">Recent errors</h2>
            <div className="mt-4 space-y-3">
              {summary.recentErrors.length > 0 ? (
                summary.recentErrors.map((entry) => (
                  <div key={`${entry.createdAt}-${entry.path}`} className="rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <strong className="text-sm text-rose-100">{entry.message}</strong>
                      <span className="text-xs text-rose-200/80">{new Date(entry.createdAt).toLocaleString()}</span>
                    </div>
                    <div className="mt-2 text-sm text-slate-200">Path: {entry.path}</div>
                    <div className="mt-1 text-xs text-slate-400 font-mono break-words">{entry.stack || "No stack captured"}</div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-400">
                  No frontend errors recorded yet.
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}