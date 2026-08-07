"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Unable to authenticate");
      }

      router.replace("/admin/monitoring");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-16 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-lg flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20 backdrop-blur">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300">Secure admin</p>
          <h1 className="text-3xl font-semibold">Monitoring login</h1>
          <p className="text-sm text-slate-300">
            Enter the admin password to view visitor activity and recent frontend errors.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-white/10 bg-slate-900/80 p-5">
          <label className="block text-sm font-medium text-slate-200" htmlFor="password">
            Admin password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400"
            autoComplete="current-password"
          />
          <button
            type="submit"
            disabled={loading || password.trim().length < 6}
            className="rounded-full bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
          >
            {loading ? "Signing in..." : "Open monitoring"}
          </button>
        </form>

        {error ? (
          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">
            {error}
          </div>
        ) : null}
      </div>
    </main>
  );
}