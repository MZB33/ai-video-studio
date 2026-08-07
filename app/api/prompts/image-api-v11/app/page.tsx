"use client";

import Image from "next/image";
import { type FormEvent, useEffect, useState } from "react";

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

type PromptHistoryItem = {
  id: string;
  story: string;
  createdAt: string;
  result: string[];
};

type AuthUser = {
  userId: string;
  email: string;
};

type ScriptStyle = "cinematic" | "trailer" | "documentary" | "ad" | "brand-story";

const SCRIPT_STYLE_OPTIONS: Array<{ value: ScriptStyle; label: string }> = [
  { value: "cinematic", label: "Cinematic" },
  { value: "trailer", label: "Trailer" },
  { value: "documentary", label: "Documentary" },
  { value: "ad", label: "Ad Film" },
  { value: "brand-story", label: "Brand Story" },
];

type QualityReport = {
  passed: boolean;
  selectedStyle: ScriptStyle;
  variantUsed: "primary" | "alternate";
  checks: {
    sceneCount: { passed: boolean; expected: number; actual: number };
    uniqueScenes: { passed: boolean; uniqueCount: number; totalCount: number };
    minKeywordsPerScene: { passed: boolean; minRequired: number; counts: number[] };
    overlapLimit: { passed: boolean; maxAllowed: number; maxFound: number };
  };
  reasons: string[];
};

type ScriptExportPayload = {
  exportedAt: string;
  story: string;
  style: ScriptStyle;
  sceneCount: number;
  scenes: string[];
  qualityReport: QualityReport | null;
  branding: {
    companyName: string;
    logoUrl: string;
    reviewerName: string;
  };
};

type SupportAdvice = {
  title: string;
  reason: string;
  steps: string[];
  tone: "info" | "warning" | "danger";
};

function getSupportAdvice({
  error,
  story,
  metrics,
  historyLength,
  loading,
  resultLength,
}: {
  error: string;
  story: string;
  metrics: GuardMetrics | null;
  historyLength: number;
  loading: boolean;
  resultLength: number;
}): SupportAdvice {
  const trimmedStory = story.trim();
  const remaining = metrics?.usage?.remainingRequests ?? 0;

  if (error) {
    if (/quota|limit|remaining|request/i.test(error)) {
      return {
        title: "You may have reached your current request limit",
        reason: "The app detected a quota-related issue while processing your request.",
        steps: [
          "Wait for the next reset window or switch to a higher plan if available.",
          "Try again with a shorter prompt after the limit refreshes.",
        ],
        tone: "warning",
      };
    }

    return {
      title: "The app needs a clearer input",
      reason: "The request did not complete, so the app is offering a safer next step.",
      steps: [
        "Keep your story short, specific, and focused on one clear idea.",
        "Make sure the content stays within the app's allowed use cases and restrictions.",
      ],
      tone: "danger",
    };
  }

  if (loading) {
    return {
      title: "Generating now",
      reason: "Your request is being processed and the app will surface the next step automatically.",
      steps: ["Please wait a moment for the prompt sequence to finish.", "If it stalls, try a shorter prompt and submit again."],
      tone: "info",
    };
  }

  if (trimmedStory.length > 0 && trimmedStory.length < 8) {
    return {
      title: "Add a little more detail",
      reason: "The story is very short, which can make the generated prompts less useful.",
      steps: ["Expand the story with one more sentence about mood, setting, or conflict.", "Try again once the idea feels clearer."],
      tone: "warning",
    };
  }

  if (remaining <= 0 && metrics) {
    return {
      title: "You are out of available requests",
      reason: "The current plan or usage window has no requests left.",
      steps: ["Wait for the reset window or upgrade to a plan with more quota.", "After that, submit the same story again to regenerate the prompts."],
      tone: "warning",
    };
  }

  if (resultLength > 0) {
    return {
      title: "Everything looks ready",
      reason: "Your prompts were generated successfully and are ready to review.",
      steps: ["Review the results, refine them if needed, and share them in your workflow.", "Use the history panel to revisit previous generations."],
      tone: "info",
    };
  }

  if (historyLength === 0) {
    return {
      title: "Start with a simple story",
      reason: "The app is ready, but there is no generated output yet.",
      steps: ["Enter a short story idea with a clear mood or setting.", "Click generate and the app will produce a prompt sequence automatically."],
      tone: "info",
    };
  }

  return {
    title: "Ready when you are",
    reason: "The app is waiting for your next request.",
    steps: ["Enter a new story idea and click generate.", "Use the support section if something does not look right."],
    tone: "info",
  };
}

function buildSceneImageDataUrl(prompt: string, story: string, index: number) {
  const palette = ["#22d3ee", "#8b5cf6", "#f59e0b", "#34d399"];
  const accent = palette[index % palette.length];
  const title = (story || "Story").slice(0, 48).replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const body = prompt.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="720" viewBox="0 0 1200 720">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#020617" />
          <stop offset="100%" stop-color="#111827" />
        </linearGradient>
      </defs>
      <rect width="1200" height="720" fill="url(#bg)" rx="36" />
      <circle cx="980" cy="180" r="180" fill="${accent}" opacity="0.22" />
      <rect x="90" y="110" width="1020" height="500" rx="28" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.18)" />
      <text x="130" y="190" fill="#e2e8f0" font-family="Segoe UI, Arial, sans-serif" font-size="38" font-weight="700">Scene ${index + 1}</text>
      <text x="130" y="252" fill="#94a3b8" font-family="Segoe UI, Arial, sans-serif" font-size="24">${title}</text>
      <rect x="130" y="292" width="940" height="220" rx="20" fill="rgba(2,6,23,0.72)" />
      <text x="160" y="348" fill="#f8fafc" font-family="Segoe UI, Arial, sans-serif" font-size="28" font-weight="600">${body.slice(0, 120)}</text>
      <text x="160" y="410" fill="#67e8f9" font-family="Segoe UI, Arial, sans-serif" font-size="24">Generated cinematic prompt preview</text>
      <text x="160" y="470" fill="#cbd5e1" font-family="Segoe UI, Arial, sans-serif" font-size="20">Ready for storyboards, ads, or concept boards</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function downloadJsonFile(filename: string, payload: ScriptExportPayload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function sanitizeLogoUrl(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) {
    return "";
  }

  if (/^data:image\//i.test(trimmed)) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed.toString();
    }
  } catch {
    return "";
  }

  return "";
}

function buildPrintSummaryHtml(payload: ScriptExportPayload): string {
  const quality = payload.qualityReport;
  const safeCompany = escapeHtml(payload.branding.companyName || "Creative Studio");
  const safeReviewer = escapeHtml(payload.branding.reviewerName || "Prepared by Script Team");
  const safeLogoUrl = sanitizeLogoUrl(payload.branding.logoUrl);
  const logoHtml = safeLogoUrl
    ? `<img src="${escapeHtml(safeLogoUrl)}" alt="Company logo" class="logo" />`
    : `<div class="logo-placeholder">${safeCompany}</div>`;
  const sceneItems = payload.scenes
    .map((scene, index) => `<li><strong>Scene ${index + 1}:</strong> ${escapeHtml(scene)}</li>`)
    .join("");

  const qualityRows = quality
    ? [
        `<li><strong>Status:</strong> ${quality.passed ? "Pass" : "Needs attention"}</li>`,
        `<li><strong>Style:</strong> ${escapeHtml(quality.selectedStyle)}</li>`,
        `<li><strong>Variant Used:</strong> ${escapeHtml(quality.variantUsed)}</li>`,
        `<li><strong>Scene Count:</strong> ${quality.checks.sceneCount.actual} / ${quality.checks.sceneCount.expected}</li>`,
        `<li><strong>Unique Scenes:</strong> ${quality.checks.uniqueScenes.uniqueCount} / ${quality.checks.uniqueScenes.totalCount}</li>`,
        `<li><strong>Keyword Depth:</strong> ${quality.checks.minKeywordsPerScene.counts.join(", ")}</li>`,
        `<li><strong>Max Overlap:</strong> ${quality.checks.overlapLimit.maxFound} (limit ${quality.checks.overlapLimit.maxAllowed})</li>`,
      ].join("")
    : "<li>No quality audit data available for this export.</li>";

  const qualityNotes = quality && quality.reasons.length > 0
    ? `<h3>Quality Notes</h3><ul>${quality.reasons.map((reason) => `<li>${escapeHtml(reason)}</li>`).join("")}</ul>`
    : "";

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Script QA Summary</title>
    <style>
      :root {
        --ink: #111827;
        --muted: #4b5563;
        --line: #d1d5db;
        --surface: #f8fafc;
        --brand: #0e7490;
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        background: var(--surface);
        color: var(--ink);
        font-family: "Segoe UI", Arial, sans-serif;
      }
      .page {
        max-width: 900px;
        margin: 24px auto;
        background: #fff;
        border: 1px solid var(--line);
        border-radius: 14px;
        padding: 28px;
      }
      h1 { margin: 0 0 8px; font-size: 28px; }
      h2 { margin: 24px 0 10px; font-size: 18px; color: var(--brand); }
      h3 { margin: 18px 0 8px; font-size: 15px; color: var(--brand); }
      p.meta { margin: 0; color: var(--muted); font-size: 13px; }
      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
      }
      .header-copy {
        flex: 1;
      }
      .logo {
        max-width: 140px;
        max-height: 56px;
        object-fit: contain;
      }
      .logo-placeholder {
        border: 1px solid var(--line);
        border-radius: 8px;
        padding: 10px 14px;
        font-size: 13px;
        color: var(--muted);
        text-align: center;
      }
      .block {
        border: 1px solid var(--line);
        border-radius: 10px;
        padding: 14px;
        background: #fff;
      }
      .signature {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 14px;
      }
      ul, ol { margin: 8px 0 0; padding-left: 20px; }
      li { margin: 8px 0; line-height: 1.45; }
      @media print {
        body { background: #fff; }
        .page {
          margin: 0;
          border: 0;
          border-radius: 0;
          max-width: 100%;
          padding: 0;
        }
      }
    </style>
  </head>
  <body>
    <article class="page">
      <header class="header">
        <div class="header-copy">
          <h1>Script Writer Professional Summary</h1>
          <p class="meta">${safeCompany}</p>
          <p class="meta">Generated: ${escapeHtml(payload.exportedAt)}</p>
          <p class="meta">Style: ${escapeHtml(payload.style)} | Scene Count: ${payload.sceneCount}</p>
        </div>
        <div>${logoHtml}</div>
      </header>

      <h2>Story Brief</h2>
      <section class="block">
        <p>${escapeHtml(payload.story || "No story text available.")}</p>
      </section>

      <h2>Generated Scene Script</h2>
      <section class="block">
        <ol>${sceneItems}</ol>
      </section>

      <h2>Quality Audit</h2>
      <section class="block">
        <ul>${qualityRows}</ul>
        ${qualityNotes}
      </section>

      <h2>Sign-Off</h2>
      <section class="block signature">
        <div>
          <p class="meta">Reviewer</p>
          <p><strong>${safeReviewer}</strong></p>
        </div>
        <div>
          <p class="meta">Date</p>
          <p><strong>${escapeHtml(new Date(payload.exportedAt).toLocaleDateString())}</strong></p>
        </div>
      </section>
    </article>
  </body>
</html>`;
}

export default function Home() {
  const [story, setStory] = useState("");
  const [style, setStyle] = useState<ScriptStyle>("cinematic");
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [result, setResult] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState<GuardMetrics | null>(null);
  const [history, setHistory] = useState<PromptHistoryItem[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [resumeNotice, setResumeNotice] = useState("");
  const [qualityReport, setQualityReport] = useState<QualityReport | null>(null);
  const [companyName, setCompanyName] = useState("Creative Studio");
  const [logoUrl, setLogoUrl] = useState("");
  const [reviewerName, setReviewerName] = useState("Prepared by Script Team");

  const supportAdvice = getSupportAdvice({
    error,
    story,
    metrics,
    historyLength: history.length,
    loading,
    resultLength: result.length,
  });

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

  async function loadHistory() {
    try {
      const response = await fetch("/api/prompts/history");
      const data = (await response.json()) as { history?: PromptHistoryItem[]; error?: string };
      if (!response.ok) {
        throw new Error(data.error || "Unable to load history");
      }
      setHistory(data.history ?? []);
    } catch {
      setHistory([]);
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
      await Promise.all([loadMetrics(), loadHistory()]);
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

    const savedDraft = window.localStorage.getItem("prompt-studio-draft");
    const savedResult = window.localStorage.getItem("prompt-studio-result");
    const savedStyle = window.localStorage.getItem("prompt-studio-style");
    const savedCompanyName = window.localStorage.getItem("prompt-studio-company-name");
    const savedLogoUrl = window.localStorage.getItem("prompt-studio-logo-url");
    const savedReviewerName = window.localStorage.getItem("prompt-studio-reviewer-name");

    if (savedDraft) {
      setStory(savedDraft);
      setResumeNotice("Your last draft was restored.");
    }

    if (savedStyle && SCRIPT_STYLE_OPTIONS.some((option) => option.value === savedStyle)) {
      setStyle(savedStyle as ScriptStyle);
    }

    if (savedCompanyName) {
      setCompanyName(savedCompanyName);
    }

    if (savedLogoUrl) {
      setLogoUrl(savedLogoUrl);
    }

    if (savedReviewerName) {
      setReviewerName(savedReviewerName);
    }

    if (savedResult) {
      try {
        const parsed = JSON.parse(savedResult) as string[];
        setResult(parsed);
        setImagePreviews(parsed.map((scene, index) => buildSceneImageDataUrl(scene, savedDraft ?? "", index)));
      } catch {
        setResult([]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.localStorage.setItem("prompt-studio-draft", story);
  }, [story]);

  useEffect(() => {
    window.localStorage.setItem("prompt-studio-style", style);
  }, [style]);

  useEffect(() => {
    window.localStorage.setItem("prompt-studio-company-name", companyName);
  }, [companyName]);

  useEffect(() => {
    window.localStorage.setItem("prompt-studio-logo-url", logoUrl);
  }, [logoUrl]);

  useEffect(() => {
    window.localStorage.setItem("prompt-studio-reviewer-name", reviewerName);
  }, [reviewerName]);

  useEffect(() => {
    window.localStorage.setItem("prompt-studio-result", JSON.stringify(result));
  }, [result]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult([]);
    setQualityReport(null);

    try {
      const response = await fetch("/api/prompts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ story, style }),
      });

      const data = (await response.json()) as { error?: string; result?: string[]; qualityReport?: QualityReport };

      if (!response.ok) {
        throw new Error(data.error || "Unable to generate prompts");
      }

      const nextResult = data.result || [];
      setResult(nextResult);
      setQualityReport(data.qualityReport ?? null);
      setImagePreviews(nextResult.map((scene, index) => buildSceneImageDataUrl(scene, story, index)));
      setResumeNotice("Your latest work has been saved and can be resumed later.");
      await Promise.all([loadMetrics(), loadHistory()]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected error");
      setImagePreviews([]);
    } finally {
      setLoading(false);
    }
  }

  function handleExportJson() {
    if (result.length === 0) {
      return;
    }

    const now = new Date();
    const safeDate = now.toISOString().replace(/[:.]/g, "-");
    const payload: ScriptExportPayload = {
      exportedAt: now.toISOString(),
      story: story.trim(),
      style,
      sceneCount: result.length,
      scenes: result,
      qualityReport,
      branding: {
        companyName: companyName.trim(),
        logoUrl: sanitizeLogoUrl(logoUrl),
        reviewerName: reviewerName.trim(),
      },
    };

    downloadJsonFile(`script-quality-report-${safeDate}.json`, payload);
  }

  function handleOpenPrintSummary() {
    if (result.length === 0) {
      return;
    }

    const payload: ScriptExportPayload = {
      exportedAt: new Date().toISOString(),
      story: story.trim(),
      style,
      sceneCount: result.length,
      scenes: result,
      qualityReport,
      branding: {
        companyName: companyName.trim(),
        logoUrl: sanitizeLogoUrl(logoUrl),
        reviewerName: reviewerName.trim(),
      },
    };

    const printWindow = window.open("", "_blank", "noopener,noreferrer");
    if (!printWindow) {
      return;
    }

    printWindow.document.open();
    printWindow.document.write(buildPrintSummaryHtml(payload));
    printWindow.document.close();
    printWindow.focus();
  }

  if (authLoading) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-16 text-slate-100 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/5 p-8 text-sm text-slate-300">
          Checking secure session...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-16 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-4xl flex-col gap-8 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20 backdrop-blur">
        <div className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">Public prompt studio</p>
          <h1 className="text-3xl font-semibold sm:text-4xl">Turn a story into cinematic scene prompts</h1>
          <p className="max-w-2xl text-base text-slate-300 sm:text-lg">
            Enter a short story or plot summary and the app will generate a ready-to-use four-scene prompt sequence for your media workflow.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2 text-sm text-slate-400">
            <a href="/guide" className="transition hover:text-cyan-300">
              Help
            </a>
            <span className="text-slate-600">�</span>
            <a href="/voice-studio-pro" className="transition hover:text-cyan-300">
              Voice Studio Pro
            </a>
            <span className="text-slate-600">�</span>
            <a href="/billing" className="transition hover:text-cyan-300">
              Billing
            </a>
            <span className="text-slate-600">�</span>
            <button type="button" onClick={() => void signOut()} className="transition hover:text-cyan-300">
              Sign out
            </button>
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

        {resumeNotice ? <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-100">{resumeNotice}</div> : null}

        <div className={`rounded-2xl border p-4 text-sm ${supportAdvice.tone === "danger" ? "border-rose-500/30 bg-rose-500/10 text-rose-100" : supportAdvice.tone === "warning" ? "border-amber-500/30 bg-amber-500/10 text-amber-100" : "border-cyan-500/20 bg-cyan-500/10 text-cyan-100"}`}>
          <p className="font-semibold">Automated support: {supportAdvice.title}</p>
          <p className="mt-1 text-sm opacity-90">{supportAdvice.reason}</p>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            {supportAdvice.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-white/10 bg-slate-900/80 p-5">
          <label className="block text-sm font-medium text-slate-200" htmlFor="story">
            Story or scene outline
          </label>
          <textarea
            id="story"
            value={story}
            onChange={(event) => setStory(event.target.value)}
            rows={6}
            placeholder="Example: A lone astronaut discovers a hidden garden beneath a frozen moon."
            className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400"
          />
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-200" htmlFor="script-style">
              Script style
            </label>
            <select
              id="script-style"
              value={style}
              onChange={(event) => setStyle(event.target.value as ScriptStyle)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400"
            >
              {SCRIPT_STYLE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-200" htmlFor="company-name">
                Company name
              </label>
              <input
                id="company-name"
                type="text"
                value={companyName}
                onChange={(event) => setCompanyName(event.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400"
                placeholder="Creative Studio"
              />
            </div>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-200" htmlFor="reviewer-name">
                Reviewer name
              </label>
              <input
                id="reviewer-name"
                type="text"
                value={reviewerName}
                onChange={(event) => setReviewerName(event.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400"
                placeholder="Prepared by Script Team"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-200" htmlFor="logo-url">
              Logo URL (optional)
            </label>
            <input
              id="logo-url"
              type="url"
              value={logoUrl}
              onChange={(event) => setLogoUrl(event.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400"
              placeholder="https://yourcompany.com/logo.png"
            />
          </div>
          <button
            type="submit"
            disabled={loading || story.trim().length < 8}
            className="rounded-full bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
          >
            {loading ? "Generating..." : "Generate prompts"}
          </button>
        </form>

        {error ? <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">{error}</div> : null}

        {qualityReport ? (
          <div className={`rounded-2xl border p-4 text-sm ${qualityReport.passed ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-100" : "border-amber-500/30 bg-amber-500/10 text-amber-100"}`}>
            <p className="font-semibold">Script quality review: {qualityReport.passed ? "Pass" : "Needs attention"}</p>
            <p className="mt-1 opacity-90">
              Style: {qualityReport.selectedStyle} | Variant: {qualityReport.variantUsed} | Max overlap: {qualityReport.checks.overlapLimit.maxFound}
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-5 opacity-95">
              <li>Scene count: {qualityReport.checks.sceneCount.actual} / {qualityReport.checks.sceneCount.expected}</li>
              <li>Unique scenes: {qualityReport.checks.uniqueScenes.uniqueCount} / {qualityReport.checks.uniqueScenes.totalCount}</li>
              <li>Keyword depth per scene: {qualityReport.checks.minKeywordsPerScene.counts.join(", ")}</li>
              <li>Overlap limit: {qualityReport.checks.overlapLimit.maxAllowed}</li>
            </ul>
            {qualityReport.reasons.length > 0 ? (
              <ul className="mt-3 list-disc space-y-1 pl-5">
                {qualityReport.reasons.map((reason) => (
                  <li key={reason}>{reason}</li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}

        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">Recent generations</h2>
            {history.length > 0 ? (
              <div className="space-y-3">
                {history.map((entry) => (
                  <div key={entry.id} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 text-sm text-slate-200">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <p className="font-semibold text-slate-100">{entry.story}</p>
                      <span className="text-xs text-slate-400">{new Date(entry.createdAt).toLocaleString()}</span>
                    </div>
                    <ul className="list-disc space-y-1 pl-5 text-slate-300">
                      {entry.result.slice(0, 2).map((scene) => (
                        <li key={`${entry.id}-${scene}`}>{scene}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-white/10 bg-slate-900/50 p-4 text-sm text-slate-400">
                Generate a few prompts to populate your recent history.
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
            <h2 className="text-lg font-semibold">Studio dashboard</h2>
            <div className="mt-3 space-y-3 text-sm text-slate-300">
              <div className="rounded-xl border border-white/10 bg-slate-950/70 p-3">
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Account</p>
                <p className="mt-1 font-semibold text-slate-100">{authUser?.email}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-slate-950/70 p-3">
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Plan</p>
                <p className="mt-1 font-semibold capitalize">{metrics?.plan ?? "pro"}</p>
              </div>
              <div className="rounded-xl border border-white/10 bg-slate-950/70 p-3">
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Remaining requests</p>
                <p className="mt-1 font-semibold">{metrics?.usage?.remainingRequests ?? 0}</p>
              </div>
            </div>
          </div>
        </div>

        {result.length > 0 ? (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-xl font-semibold">Generated scene prompts</h2>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleOpenPrintSummary}
                  className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-200 transition hover:border-emerald-300 hover:bg-emerald-500/20"
                >
                  Open print summary
                </button>
                <button
                  type="button"
                  onClick={handleExportJson}
                  className="rounded-full border border-cyan-400/40 bg-cyan-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200 transition hover:border-cyan-300 hover:bg-cyan-500/20"
                >
                  Export JSON report
                </button>
              </div>
            </div>
            <ol className="space-y-3">
              {result.map((scene, index) => (
                <li key={`${scene}-${index}`} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 text-sm text-slate-200">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">Scene {index + 1}</span>
                  {imagePreviews[index] ? (
                    <Image
                      src={imagePreviews[index]}
                      alt={`Generated preview for ${scene}`}
                      width={960}
                      height={384}
                      unoptimized
                      className="mb-3 h-48 w-full rounded-xl border border-white/10 object-cover"
                    />
                  ) : null}
                  {scene}
                </li>
              ))}
            </ol>
          </div>
        ) : null}
      </div>
    </main>
  );
}
