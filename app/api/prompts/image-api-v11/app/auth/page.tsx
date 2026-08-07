"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

type Mode = "signin" | "signup";

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [csrfToken, setCsrfToken] = useState("");

  async function loadCsrfToken(): Promise<string> {
    const response = await fetch("/api/auth/csrf", { cache: "no-store" });
    const data = (await response.json().catch(() => ({}))) as { csrfToken?: string };
    const token = data.csrfToken ?? "";
    setCsrfToken(token);
    return token;
  }


  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      let activeCsrfToken = csrfToken;
      if (!activeCsrfToken) {
        activeCsrfToken = await loadCsrfToken();
      }

      if (!activeCsrfToken) {
        throw new Error("Unable to initialize secure form session");
      }

      const endpoint = mode === "signin" ? "/api/auth/signin" : "/api/auth/signup";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-csrf-token": activeCsrfToken,
        },
        body: JSON.stringify({ email, password }),
      });

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error ?? "Authentication failed");
      }

      window.location.href = "/";
    } catch (authError) {
      setError(authError instanceof Error ? authError.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-16 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-md flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20 backdrop-blur">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">Secure account</p>
          <h1 className="text-3xl font-semibold">Sign in or create account</h1>
          <p className="text-sm text-slate-300">
            Passwords are securely hashed and sessions are stored in HTTP-only cookies.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 rounded-xl border border-white/10 bg-slate-900/70 p-1">
          <button
            type="button"
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${mode === "signin" ? "bg-cyan-500 text-slate-950" : "text-slate-300 hover:bg-slate-800"}`}
            onClick={() => setMode("signin")}
          >
            Sign in
          </button>
          <button
            type="button"
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${mode === "signup" ? "bg-cyan-500 text-slate-950" : "text-slate-300 hover:bg-slate-800"}`}
            onClick={() => setMode("signup")}
          >
            Sign up
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-slate-200" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400"
            placeholder="you@example.com"
            required
          />

          <label className="block text-sm font-medium text-slate-200" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400"
            placeholder="At least 12 characters"
            minLength={12}
            required
          />

          {error ? (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
          >
            {loading ? "Please wait..." : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <p className="text-xs text-slate-400">
          Need account recovery? <Link href="/auth/recovery" className="text-cyan-300 hover:text-cyan-200">Verify email or reset password</Link>.
        </p>

        <p className="text-xs text-slate-400">
          Need app guidance? <Link href="/guide" className="text-cyan-300 hover:text-cyan-200">Open the guide</Link>.
        </p>
      </div>
    </main>
  );
}
