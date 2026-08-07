"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type BillingPlan = "pro" | "studio" | "business";
type BillingCycle = "monthly" | "yearly";

type GuardMetrics = {
  appUserId?: string;
  plan?: string;
  subscriptionStatus?: string;
  usage?: {
    monthKey?: string;
    requestCount?: number;
    remainingRequests?: number;
  };
};

type AuthUser = {
  userId: string;
  email: string;
};

type BillingActionResult = {
  message: string;
  url?: string;
  note?: string;
};

const PLAN_OPTIONS: Array<{ plan: BillingPlan; cycle: BillingCycle; label: string; price: string; highlight?: boolean; benefits: string[] }> = [
  { plan: "pro", cycle: "monthly", label: "Pro - Monthly", price: "$19", benefits: ["8 prompt packs/month", "Priority generation", "History & workspace sync"], highlight: false },
  { plan: "pro", cycle: "yearly", label: "Pro - Yearly", price: "$190", benefits: ["Best value for creators", "2 months free", "Unlimited history archive"], highlight: true },
  { plan: "studio", cycle: "monthly", label: "Studio - Monthly", price: "$49", benefits: ["20 prompt packs/month", "Advanced scene refinement", "Better collaboration controls"], highlight: false },
  { plan: "studio", cycle: "yearly", label: "Studio - Yearly", price: "$490", benefits: ["Save 17% annually", "Expanded generations", "Priority support"], highlight: false },
  { plan: "business", cycle: "monthly", label: "Business - Monthly", price: "$99", benefits: ["Unlimited team workflows", "Dedicated onboarding", "Enterprise-ready billing"], highlight: false },
  { plan: "business", cycle: "yearly", label: "Business - Yearly", price: "$990", benefits: ["Best for agencies", "Custom rollout support", "Premium service tier"], highlight: false },
];

export default function BillingPage() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [metrics, setMetrics] = useState<GuardMetrics | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<BillingActionResult | null>(null);

  async function loadMetrics() {
    try {
      const response = await fetch("/api/billing/guard-metrics");
      const data = (await response.json()) as GuardMetrics & { error?: string };
      if (!response.ok) {
        throw new Error(data.error || "Unable to load billing metrics");
      }
      setMetrics(data);
    } catch {
      setMetrics(null);
    }
  }

  async function loadAuthUser() {
    setAuthLoading(true);
    try {
      const response = await fetch("/api/auth/me", { cache: "no-store" });
      const data = (await response.json()) as { user?: AuthUser };
      if (!response.ok || !data.user) {
        window.location.href = "/auth";
        return;
      }

      setAuthUser(data.user);
      await loadMetrics();
    } catch {
      window.location.href = "/auth";
    } finally {
      setAuthLoading(false);
    }
  }

  async function signOut() {
    const csrfResponse = await fetch("/api/auth/csrf", { cache: "no-store" }).catch(() => undefined);
    const csrfData = await csrfResponse?.json().catch(() => ({})) as { csrfToken?: string } | undefined;
    const csrfToken = csrfData?.csrfToken;

    await fetch("/api/auth/signout", {
      method: "POST",
      headers: csrfToken ? { "x-csrf-token": csrfToken } : undefined,
    }).catch(() => undefined);
    window.location.href = "/auth";
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadAuthUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function createCheckoutSession(plan: BillingPlan, cycle: BillingCycle) {
    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch("/api/billing/checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan, cycle, email: authUser?.email }),
      });

      const data = (await response.json()) as { error?: string; url?: string; note?: string };
      if (!response.ok) {
        throw new Error(data.error || "Unable to create checkout session");
      }

      setStatus({
          message: `Checkout session ready for ${plan} - ${cycle}`,
        url: data.url,
        note: data.note,
      });
      await loadMetrics();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unexpected billing error";
      setStatus({ message });
    } finally {
      setLoading(false);
    }
  }

  async function openPortal() {
    setLoading(true);
    setStatus(null);

    try {
      const response = await fetch("/api/billing/portal-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ returnUrl: `${window.location.origin}/billing`, email: authUser?.email }),
      });

      const data = (await response.json()) as { error?: string; portalUrl?: string; note?: string };
      if (!response.ok) {
        throw new Error(data.error || "Unable to open billing portal");
      }

      setStatus({
        message: "Customer portal session ready",
        url: data.portalUrl,
        note: data.note,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unexpected billing error";
      setStatus({ message });
    } finally {
      setLoading(false);
    }
  }

  if (authLoading) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-16 text-slate-100 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-white/5 p-8 text-sm text-slate-300">
          Checking secure session...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-16 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20 backdrop-blur">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">Billing</p>
            <h1 className="text-3xl font-semibold sm:text-4xl">Manage your subscription and plan access</h1>
            <p className="max-w-2xl text-base text-slate-300">Move from idea to polished creative output faster with plans built for creators, studios, and teams that need reliable prompt generation.</p>
          </div>
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <Link href="/guide" className="transition hover:text-cyan-300">Help</Link>
            <span className="text-slate-600">�</span>
            <Link href="/" className="transition hover:text-cyan-300">Prompt studio</Link>
            <span className="text-slate-600">�</span>
            <button type="button" onClick={() => void signOut()} className="transition hover:text-cyan-300">Sign out</button>
          </div>
        </div>

        <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4 text-sm text-cyan-100">
          <p className="font-semibold">Signed in account</p>
          <p className="text-cyan-200/80">{authUser?.email}</p>
          <p className="text-cyan-200/60">{authUser?.userId}</p>

          {metrics ? (
            <div className="mt-3 grid gap-3 rounded-xl border border-white/10 bg-slate-950/60 p-3 text-sm text-slate-200 sm:grid-cols-3">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Plan</p>
                <p className="font-semibold capitalize">{metrics.plan ?? "pro"}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Usage</p>
                <p className="font-semibold">{metrics.usage?.requestCount ?? 0} / {metrics.usage?.remainingRequests ?? 0} remaining</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Status</p>
                <p className="font-semibold capitalize">{metrics.subscriptionStatus ?? "unknown"}</p>
              </div>
            </div>
          ) : null}
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">Plans</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {PLAN_OPTIONS.map((option) => (
                <div key={`${option.plan}-${option.cycle}`} className={`rounded-2xl border p-4 ${option.highlight ? "border-cyan-400/40 bg-cyan-500/10" : "border-white/10 bg-slate-900/70"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">{option.label}</p>
                      <p className="mt-2 text-sm text-slate-300">Unlock the {option.plan} tier with {option.cycle === "monthly" ? "monthly" : "annual"} billing.</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-semibold text-slate-100">{option.price}</p>
                      <p className="text-xs text-slate-400">/mo</p>
                    </div>
                  </div>
                  <ul className="mt-3 space-y-2 text-sm text-slate-300">
                    {option.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-start gap-2">
                        <span className="mt-1 text-cyan-300">�</span>
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  <button
                    onClick={() => void createCheckoutSession(option.plan, option.cycle)}
                    className={`mt-4 rounded-full px-4 py-2 text-sm font-semibold transition ${option.highlight ? "bg-cyan-500 text-slate-950 hover:bg-cyan-400" : "bg-slate-800 text-slate-100 hover:bg-slate-700"}`}
                    disabled={loading}
                  >
                    {loading ? "Working..." : option.highlight ? "Best value" : "Choose plan"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4 rounded-2xl border border-white/10 bg-slate-900/70 p-4">
            <div>
              <h2 className="text-lg font-semibold">Billing actions</h2>
              <p className="mt-1 text-sm text-slate-300">Use these controls to review your plan, update billing, or keep your workflow moving without interruption.</p>
            </div>
            <button onClick={() => void openPortal()} className="w-full rounded-full border border-cyan-400/30 bg-slate-950 px-4 py-2.5 text-sm font-semibold text-cyan-200 transition hover:border-cyan-300 hover:text-cyan-100" disabled={loading}>
              {loading ? "Working..." : "Open customer portal"}
            </button>

            {status ? (
              <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-3 text-sm text-slate-200">
                <p className="font-semibold text-slate-100">{status.message}</p>
                {status.note ? <p className="mt-2 text-slate-400">{status.note}</p> : null}
                {status.url ? (
                  <a href={status.url} className="mt-3 inline-flex text-cyan-300 hover:text-cyan-200" target="_blank" rel="noreferrer">Open link -&gt;</a>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}
