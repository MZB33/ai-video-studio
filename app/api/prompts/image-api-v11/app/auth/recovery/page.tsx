"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

type RecoveryMode = "request-reset" | "reset-password" | "request-verify" | "verify-email";

type ApiResult = {
  ok?: boolean;
  error?: string;
  token?: string;
  expiresAt?: string;
};

function getInitialMode(): RecoveryMode {
  if (typeof window === "undefined") {
    return "request-reset";
  }

  const search = new URLSearchParams(window.location.search);
  const modeParam = search.get("mode");
  if (modeParam === "verify-email") {
    return "verify-email";
  }
  if (modeParam === "reset-password") {
    return "reset-password";
  }
  return "request-reset";
}

function getInitialToken(): string {
  if (typeof window === "undefined") {
    return "";
  }

  const search = new URLSearchParams(window.location.search);
  return search.get("token") ?? "";
}

export default function RecoveryPage() {
  const [mode, setMode] = useState<RecoveryMode>(getInitialMode);
  const [email, setEmail] = useState("");
  const [token, setToken] = useState(getInitialToken);
  const [password, setPassword] = useState("");
  const [csrfToken, setCsrfToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [devToken, setDevToken] = useState("");

  async function loadCsrfToken(): Promise<string> {
    const response = await fetch("/api/auth/csrf", { cache: "no-store" });
    const data = (await response.json().catch(() => ({}))) as { csrfToken?: string };
    const nextToken = data.csrfToken ?? "";
    setCsrfToken(nextToken);
    return nextToken;
  }

  async function postJson(url: string, body: Record<string, string>): Promise<ApiResult> {
    let activeCsrfToken = csrfToken;
    if (!activeCsrfToken) {
      activeCsrfToken = await loadCsrfToken();
    }

    if (!activeCsrfToken) {
      throw new Error("Unable to initialize secure form session");
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-csrf-token": activeCsrfToken,
      },
      body: JSON.stringify(body),
    });

    const data = (await response.json().catch(() => ({}))) as ApiResult;
    if (!response.ok) {
      throw new Error(data.error || "Request failed");
    }
    return data;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    setDevToken("");

    try {
      if (mode === "request-reset") {
        const data = await postJson("/api/auth/request-password-reset", { email });
        setSuccess("Password reset token generated. Use it in the reset form.");
        if (data.token) {
          setDevToken(data.token);
          setToken(data.token);
        }
      }

      if (mode === "reset-password") {
        await postJson("/api/auth/reset-password", { token, password });
        setSuccess("Password updated. You are now signed in.");
        window.location.href = "/";
        return;
      }

      if (mode === "request-verify") {
        const data = await postJson("/api/auth/request-email-verification", { email });
        setSuccess("Verification token generated. Use it in the verify form.");
        if (data.token) {
          setDevToken(data.token);
          setToken(data.token);
        }
      }

      if (mode === "verify-email") {
        await postJson("/api/auth/verify-email", { token });
        setSuccess("Email verified. You are now signed in.");
        window.location.href = "/";
        return;
      }
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-16 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-md flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20 backdrop-blur">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">Account recovery</p>
          <h1 className="text-3xl font-semibold">Verify email or reset password</h1>
          <p className="text-sm text-slate-300">Use one-time secure tokens to recover your account access.</p>
        </div>

        <div className="grid grid-cols-2 gap-2 rounded-xl border border-white/10 bg-slate-900/70 p-1">
          <button
            type="button"
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${mode === "request-reset" || mode === "reset-password" ? "bg-cyan-500 text-slate-950" : "text-slate-300 hover:bg-slate-800"}`}
            onClick={() => setMode("request-reset")}
          >
            Password reset
          </button>
          <button
            type="button"
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${mode === "request-verify" || mode === "verify-email" ? "bg-cyan-500 text-slate-950" : "text-slate-300 hover:bg-slate-800"}`}
            onClick={() => setMode("request-verify")}
          >
            Verify email
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {(mode === "request-reset" || mode === "request-verify") && (
            <>
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
            </>
          )}

          {(mode === "reset-password" || mode === "verify-email") && (
            <>
              <label className="block text-sm font-medium text-slate-200" htmlFor="token">
                One-time token
              </label>
              <input
                id="token"
                value={token}
                onChange={(event) => setToken(event.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400"
                placeholder="Paste token"
                required
              />
            </>
          )}

          {mode === "reset-password" && (
            <>
              <label className="block text-sm font-medium text-slate-200" htmlFor="password">
                New password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400"
                placeholder="At least 12 characters"
                minLength={12}
                required
              />
            </>
          )}

          {error ? (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-sm text-rose-200">{error}</div>
          ) : null}

          {success ? (
            <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-200">{success}</div>
          ) : null}

          {devToken ? (
            <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-3 text-sm text-cyan-100">
              <p className="font-semibold">Development token</p>
              <p className="mt-1 break-all font-mono text-xs">{devToken}</p>
            </div>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
          >
            {loading
              ? "Please wait..."
              : mode === "request-reset"
                ? "Create reset token"
                : mode === "reset-password"
                  ? "Reset password"
                  : mode === "request-verify"
                    ? "Create verification token"
                    : "Verify email"}
          </button>
        </form>

        <div className="text-xs text-slate-400">
          <Link href="/auth" className="text-cyan-300 hover:text-cyan-200">Back to sign in</Link>
        </div>
      </div>
    </main>
  );
}
