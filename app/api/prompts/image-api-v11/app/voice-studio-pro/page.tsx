"use client";

import Link from "next/link";
import { type FormEvent, useEffect, useMemo, useState } from "react";

type VoiceCharacter = {
  id: string;
  name: string;
  archetype: string;
  vocalSignature: string;
  strengths: string[];
  recommendedUseCaseIds: string[];
  languageStrengths?: string[];
  accentStrengths?: string[];
};

type VoiceLanguage = {
  code: string;
  label: string;
  accents: string[];
};

type VoiceBehavior = {
  id: string;
  name: string;
  pacing: string;
  tone: string;
  emotionalWeight: string;
  guidance: string;
};

type VoiceUseCase = {
  id: string;
  name: string;
  description: string;
  minWords: number;
  maxWords: number;
  qualityPriorities: string[];
};

type VoiceCatalog = {
  characters: VoiceCharacter[];
  languages: VoiceLanguage[];
  behaviors: VoiceBehavior[];
  useCases: VoiceUseCase[];
  compatibility: {
    universalCharacterSupport: boolean;
    note: string;
  };
  starterTracks?: Array<{
    id: string;
    name: string;
    characterIds: string[];
    languageCodes: string[];
  }>;
};

type VoiceQualityReview = {
  passed: boolean;
  checks: {
    wordRange: { passed: boolean; words: number; min: number; max: number };
    repetitionControl: { passed: boolean; repeatedPairs: number; maxOverlap: number; threshold: number };
    sentenceVariation: { passed: boolean; sentenceCount: number; minimum: number };
    controlBalance: { passed: boolean; speed: number; pitch: number; energy: number; preferredRange: string };
  };
};

type VoiceGenerationResult = {
  request: {
    text: string;
    characterId: string;
    languageCode: string;
    accent: string;
    behaviorId: string;
    useCaseId: string;
    speed: number;
    pitch: number;
    energy: number;
  };
  profile: {
    character: VoiceCharacter;
    language: VoiceLanguage;
    accent: string;
    behavior: VoiceBehavior;
    useCase: VoiceUseCase;
    universalCompatibility: boolean;
  };
  deliveryBlueprint: {
    opening: string;
    body: string;
    close: string;
  };
  userNeedsAssessment: {
    priorities: string[];
    recommendations: string[];
  };
  pronunciationReview?: {
    appliedCount: number;
    entries: Array<{ id: string; term: string; replacement: string; phoneme: string }>;
    rawText: string;
    transformedText: string;
  };
  qualityReview: VoiceQualityReview;
  renderPrompt: string;
};

type PronunciationEntry = {
  id: string;
  appUserId: string;
  languageCode: string;
  accent: string;
  term: string;
  phoneme: string;
  replacement: string;
  notes?: string;
  updatedAt: string;
};

type VoiceVersion = {
  id: string;
  appUserId: string;
  createdAt: string;
  label: "A" | "B" | "Custom";
  status: "candidate" | "approved" | "rejected";
  text: string;
  characterId: string;
  languageCode: string;
  accent: string;
  behaviorId: string;
  useCaseId: string;
  speed: number;
  pitch: number;
  energy: number;
  audioDataUrl: string;
  analytics?: {
    durationSeconds: number;
    sampleRate: number;
    peakDbfs: number;
    rmsDbfs: number;
    estimatedLufs: number;
    crestFactorDb: number;
    waveformPoints: number[];
    recommendedRange: {
      peakDbfsMax: number;
      rmsDbfsMin: number;
      rmsDbfsMax: number;
      estimatedLufsMin: number;
      estimatedLufsMax: number;
    };
  };
  renderPrompt: string;
  approvalNotes?: string;
  approvalRole?: "reviewer" | "approver";
  approvalActor?: string;
  auditTrail?: Array<{
    at: string;
    actorRole: "reviewer" | "approver";
    actorName: string;
    action: "created" | "status_changed" | "note_updated";
    status: "candidate" | "approved" | "rejected";
    notes?: string;
  }>;
};

type SupportAdvice = {
  title: string;
  tone: "info" | "warning" | "danger";
  summary: string;
  steps: string[];
};

const DEFAULT_SCRIPT =
  "Today we unveil a faster and more reliable platform for global teams. From onboarding to daily execution, every workflow has been redesigned for clarity, speed, and confidence.";

function toneClass(tone: SupportAdvice["tone"]): string {
  if (tone === "danger") {
    return "border-rose-500/30 bg-rose-500/10 text-rose-100";
  }
  if (tone === "warning") {
    return "border-amber-500/30 bg-amber-500/10 text-amber-100";
  }
  return "border-cyan-500/30 bg-cyan-500/10 text-cyan-100";
}

function buildSupportAdvice(result: VoiceGenerationResult | null, script: string, loading: boolean, error: string): SupportAdvice {
  if (error) {
    return {
      title: "Input requires revision",
      tone: "danger",
      summary: "The request did not pass validation and needs adjustment before rendering.",
      steps: [
        "Ensure script text is clear and at least one full sentence.",
        "Keep controls within practical voice production ranges.",
      ],
    };
  }

  if (loading) {
    return {
      title: "Analyzing voice package",
      tone: "info",
      summary: "Voice Studio Pro is evaluating character, language, accent, behavior, and quality constraints.",
      steps: ["Wait for the render blueprint to appear.", "Do not change controls mid-analysis."],
    };
  }

  if (!script.trim()) {
    return {
      title: "Provide source script",
      tone: "warning",
      summary: "A clean script is required to derive delivery behavior and quality checks.",
      steps: ["Paste or type your narration script.", "Target 2-6 concise sentences for best results."],
    };
  }

  if (!result) {
    return {
      title: "Ready for generation",
      tone: "info",
      summary: "Configure character, language, accent, and behavior, then generate a professional package.",
      steps: ["Choose the closest use case.", "Keep speed, pitch, and energy near neutral before first pass."],
    };
  }

  if (!result.qualityReview.passed) {
    return {
      title: "Quality adjustments recommended",
      tone: "warning",
      summary: "The package was produced, but one or more quality checks indicate room for improvement.",
      steps: result.userNeedsAssessment.recommendations.slice(0, 3),
    };
  }

  return {
    title: "Production-ready voice package",
    tone: "info",
    summary: "The script, character profile, and vocal controls are aligned for professional delivery.",
    steps: ["Send the render brief to your TTS engine.", "A/B test one alternate behavior for optimization."],
  };
}

function formatLabel(id: string): string {
  return id
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function safeId(id: string): string {
  return id.replace(/[^a-z0-9-]/gi, "-").toLowerCase();
}

function inRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

function analyticsPass(version: VoiceVersion): boolean {
  const analytics = version.analytics;
  if (!analytics) {
    return false;
  }

  return analytics.peakDbfs <= analytics.recommendedRange.peakDbfsMax
    && inRange(analytics.rmsDbfs, analytics.recommendedRange.rmsDbfsMin, analytics.recommendedRange.rmsDbfsMax)
    && inRange(analytics.estimatedLufs, analytics.recommendedRange.estimatedLufsMin, analytics.recommendedRange.estimatedLufsMax);
}

export default function VoiceStudioProPage() {
  const [catalog, setCatalog] = useState<VoiceCatalog | null>(null);
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VoiceGenerationResult | null>(null);
  const [loadingAssets, setLoadingAssets] = useState(false);
  const [pronunciationEntries, setPronunciationEntries] = useState<PronunciationEntry[]>([]);
  const [voiceVersions, setVoiceVersions] = useState<VoiceVersion[]>([]);
  const [compareAId, setCompareAId] = useState("");
  const [compareBId, setCompareBId] = useState("");
  const [approvalNote, setApprovalNote] = useState("");

  const [script, setScript] = useState(DEFAULT_SCRIPT);
  const [characterId, setCharacterId] = useState("");
  const [languageCode, setLanguageCode] = useState("");
  const [accent, setAccent] = useState("");
  const [behaviorId, setBehaviorId] = useState("");
  const [useCaseId, setUseCaseId] = useState("");
  const [speed, setSpeed] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [energy, setEnergy] = useState(1);
  const [term, setTerm] = useState("");
  const [phoneme, setPhoneme] = useState("");
  const [replacement, setReplacement] = useState("");
  const [notes, setNotes] = useState("");

  const selectedLanguage = useMemo(() => {
    if (!catalog) {
      return null;
    }
    return catalog.languages.find((item) => item.code === languageCode) ?? catalog.languages[0] ?? null;
  }, [catalog, languageCode]);

  const selectedCharacter = useMemo(() => {
    if (!catalog) {
      return null;
    }
    return catalog.characters.find((item) => item.id === characterId) ?? catalog.characters[0] ?? null;
  }, [catalog, characterId]);

  const selectedUseCase = useMemo(() => {
    if (!catalog) {
      return null;
    }
    return catalog.useCases.find((item) => item.id === useCaseId) ?? catalog.useCases[0] ?? null;
  }, [catalog, useCaseId]);

  const compareA = useMemo(
    () => voiceVersions.find((entry) => entry.id === compareAId),
    [voiceVersions, compareAId]
  );

  const effectiveAccent = useMemo(() => {
    if (!selectedLanguage) {
      return accent;
    }

    if (selectedLanguage.accents.includes(accent)) {
      return accent;
    }

    return selectedLanguage.accents[0] ?? "";
  }, [accent, selectedLanguage]);

  const compareB = useMemo(
    () => voiceVersions.find((entry) => entry.id === compareBId),
    [voiceVersions, compareBId]
  );

  const supportAdvice = buildSupportAdvice(result, script, loading, error);

  async function loadPronunciation(nextLanguageCode = languageCode, nextAccent = effectiveAccent) {
    const response = await fetch(`/api/voice-studio-pro/pronunciation?languageCode=${encodeURIComponent(nextLanguageCode)}&accent=${encodeURIComponent(nextAccent)}`, {
      cache: "no-store",
    });
    const data = (await response.json()) as { entries?: PronunciationEntry[]; error?: string };
    if (!response.ok) {
      throw new Error(data.error || "Unable to load pronunciation entries");
    }
    setPronunciationEntries(data.entries ?? []);
  }

  async function loadVersions() {
    const response = await fetch(
      `/api/voice-studio-pro/versions?characterId=${encodeURIComponent(characterId)}&behaviorId=${encodeURIComponent(behaviorId)}`,
      { cache: "no-store" }
    );
    const data = (await response.json()) as { versions?: VoiceVersion[]; error?: string };
    if (!response.ok) {
      throw new Error(data.error || "Unable to load voice versions");
    }
    const versions = data.versions ?? [];
    setVoiceVersions(versions);
    if (!compareAId && versions[0]) {
      setCompareAId(versions[0].id);
    }
    if (!compareBId && versions[1]) {
      setCompareBId(versions[1].id);
    }
  }

  async function refreshAssets(nextLanguageCode = languageCode, nextAccent = effectiveAccent) {
    if (!nextLanguageCode || !nextAccent || !characterId || !behaviorId) {
      return;
    }

    setLoadingAssets(true);
    try {
      await Promise.all([loadPronunciation(nextLanguageCode, nextAccent), loadVersions()]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to refresh voice assets");
    } finally {
      setLoadingAssets(false);
    }
  }

  useEffect(() => {
    async function loadCatalog() {
      setLoadingCatalog(true);
      try {
        const response = await fetch("/api/voice-studio-pro", { cache: "no-store" });
        const data = (await response.json()) as VoiceCatalog & { error?: string };
        if (!response.ok) {
          throw new Error(data.error || "Failed to load Voice Studio Pro catalog");
        }

        setCatalog(data);
        setCharacterId(data.characters[0]?.id ?? "");
        setLanguageCode(data.languages[0]?.code ?? "");
        setAccent(data.languages[0]?.accents[0] ?? "");
        setBehaviorId(data.behaviors[0]?.id ?? "");
        setUseCaseId(data.useCases[0]?.id ?? "");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unexpected catalog error");
      } finally {
        setLoadingCatalog(false);
      }
    }

    void loadCatalog();
  }, []);

  useEffect(() => {
    // Defer refresh to avoid effect-body synchronous state writes flagged by eslint.
    const timer = setTimeout(() => {
      void refreshAssets();
    }, 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [languageCode, effectiveAccent, characterId, behaviorId]);

  async function handleGenerate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch("/api/voice-studio-pro", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: script,
          characterId,
          languageCode,
          accent: effectiveAccent,
          behaviorId,
          useCaseId,
          speed,
          pitch,
          energy,
        }),
      });

      const data = (await response.json()) as VoiceGenerationResult & { error?: string };
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate voice package");
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected generation error");
    } finally {
      setLoading(false);
    }
  }

  async function handleSavePronunciation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/voice-studio-pro/pronunciation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          languageCode,
          accent: effectiveAccent,
          term,
          phoneme,
          replacement,
          notes,
        }),
      });

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error || "Unable to save pronunciation entry");
      }

      setTerm("");
      setPhoneme("");
      setReplacement("");
      setNotes("");
      await loadPronunciation();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected pronunciation save error");
    }
  }

  async function handleDeletePronunciation(id: string) {
    setError("");
    try {
      const response = await fetch(`/api/voice-studio-pro/pronunciation?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error || "Unable to delete pronunciation entry");
      }

      await loadPronunciation();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected pronunciation delete error");
    }
  }

  async function handleCreateVersion(label: "A" | "B" | "Custom") {
    setError("");
    try {
      const response = await fetch("/api/voice-studio-pro/versions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: script,
          characterId,
          languageCode,
          accent: effectiveAccent,
          behaviorId,
          useCaseId,
          speed,
          pitch,
          energy,
          label,
        }),
      });

      const data = (await response.json()) as { version?: VoiceVersion; error?: string };
      if (!response.ok) {
        throw new Error(data.error || "Unable to create version");
      }

      await loadVersions();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected version create error");
    }
  }

  async function handleApprove(versionId: string, status: "approved" | "rejected" | "candidate") {
    setError("");
    try {
      const response = await fetch(`/api/voice-studio-pro/versions/${encodeURIComponent(versionId)}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          approvalNotes: approvalNote,
        }),
      });

      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error || "Unable to update version approval");
      }

      await loadVersions();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unexpected approval update error");
    }
  }

  async function copyRenderPrompt() {
    if (!result) {
      return;
    }

    await navigator.clipboard.writeText(result.renderPrompt).catch(() => undefined);
  }

  if (loadingCatalog) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-16 text-slate-100 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-white/5 p-8 text-sm text-slate-300">
          Initializing Voice Studio Pro...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-16 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20 backdrop-blur">
        <header className="space-y-3">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">Voice Studio Pro</p>
          <h1 className="text-3xl font-semibold sm:text-4xl">Professional multilingual character voice direction</h1>
          <p className="max-w-3xl text-slate-300">
            Build broadcast-grade voice packages with universal character support across languages, accents, and behavioral profiles.
            The system analyzes user needs, narrative quality, and delivery controls before render.
          </p>
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
            <Link href="/" className="transition hover:text-cyan-300">Prompt Studio</Link>
            <span className="text-slate-600">/</span>
            <Link href="/guide" className="transition hover:text-cyan-300">Guide</Link>
            <span className="text-slate-600">/</span>
            <Link href="/billing" className="transition hover:text-cyan-300">Billing</Link>
          </div>
        </header>

        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm text-emerald-100">
          <p className="font-semibold">Universal compatibility mode</p>
          <p className="mt-1 opacity-90">{catalog?.compatibility.note}</p>
        </div>

        {catalog?.starterTracks?.length ? (
          <div className="grid gap-3 sm:grid-cols-2">
            {catalog.starterTracks.map((track) => (
              <div key={track.id} className="rounded-2xl border border-white/10 bg-slate-900/70 p-4 text-sm text-slate-200">
                <p className="font-semibold text-cyan-200">Starter track: {track.name}</p>
                <p className="mt-1 text-xs text-slate-400">Characters: {track.characterIds.join(", ")}</p>
                <p className="mt-1 text-xs text-slate-400">Languages: {track.languageCodes.join(", ")}</p>
              </div>
            ))}
          </div>
        ) : null}

        <div className={`rounded-2xl border p-4 text-sm ${toneClass(supportAdvice.tone)}`}>
          <p className="font-semibold">Operational review: {supportAdvice.title}</p>
          <p className="mt-1 opacity-90">{supportAdvice.summary}</p>
          <ul className="mt-3 list-disc space-y-1 pl-5">
            {supportAdvice.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
        </div>

        <form onSubmit={handleGenerate} className="grid gap-4 rounded-2xl border border-white/10 bg-slate-900/80 p-5 lg:grid-cols-2">
          <div className="space-y-2 lg:col-span-2">
            <label htmlFor="voice-script" className="text-sm font-medium text-slate-200">Narration script</label>
            <textarea
              id="voice-script"
              value={script}
              onChange={(event) => setScript(event.target.value)}
              rows={6}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400"
              placeholder="Add the narration text that should be voiced."
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="character" className="text-sm font-medium text-slate-200">Character</label>
            <select id="character" value={characterId} onChange={(event) => setCharacterId(event.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400">
              {catalog?.characters.map((character) => (
                <option key={character.id} value={character.id}>{character.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="use-case" className="text-sm font-medium text-slate-200">Use case</label>
            <select id="use-case" value={useCaseId} onChange={(event) => setUseCaseId(event.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400">
              {catalog?.useCases.map((useCase) => (
                <option key={useCase.id} value={useCase.id}>{useCase.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="language" className="text-sm font-medium text-slate-200">Language</label>
            <select id="language" value={languageCode} onChange={(event) => setLanguageCode(event.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400">
              {catalog?.languages.map((language) => (
                <option key={language.code} value={language.code}>{language.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="accent" className="text-sm font-medium text-slate-200">Accent</label>
            <select id="accent" value={effectiveAccent} onChange={(event) => setAccent(event.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400">
              {selectedLanguage?.accents.map((entry) => (
                <option key={entry} value={entry}>{entry}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="behavior" className="text-sm font-medium text-slate-200">Behavior profile</label>
            <select id="behavior" value={behaviorId} onChange={(event) => setBehaviorId(event.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-cyan-400">
              {catalog?.behaviors.map((behavior) => (
                <option key={behavior.id} value={behavior.id}>{behavior.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="speed" className="text-sm font-medium text-slate-200">Speed: {speed.toFixed(2)}x</label>
            <input id="speed" type="range" min="0.6" max="1.4" step="0.05" value={speed} onChange={(event) => setSpeed(Number(event.target.value))} className="w-full accent-cyan-400" />
          </div>

          <div className="space-y-2">
            <label htmlFor="pitch" className="text-sm font-medium text-slate-200">Pitch: {pitch.toFixed(2)}x</label>
            <input id="pitch" type="range" min="0.75" max="1.25" step="0.05" value={pitch} onChange={(event) => setPitch(Number(event.target.value))} className="w-full accent-cyan-400" />
          </div>

          <div className="space-y-2">
            <label htmlFor="energy" className="text-sm font-medium text-slate-200">Energy: {energy.toFixed(2)}x</label>
            <input id="energy" type="range" min="0.5" max="1.5" step="0.05" value={energy} onChange={(event) => setEnergy(Number(event.target.value))} className="w-full accent-cyan-400" />
          </div>

          <div className="flex items-end">
            <button type="submit" disabled={loading} className="w-full rounded-full bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400">
              {loading ? "Building package..." : "Generate professional voice package"}
            </button>
          </div>
        </form>

        {error ? <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">{error}</div> : null}

        <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4 rounded-2xl border border-white/10 bg-slate-900/70 p-5">
            <h2 className="text-lg font-semibold">Character intelligence</h2>
            {selectedCharacter ? (
              <>
                <p className="text-sm text-slate-300"><span className="font-semibold text-slate-100">{selectedCharacter.name}</span> | {selectedCharacter.archetype}</p>
                <p className="text-sm text-slate-400">{selectedCharacter.vocalSignature}</p>
                <ul className="list-disc space-y-1 pl-5 text-sm text-slate-300">
                  {selectedCharacter.strengths.map((strength) => (
                    <li key={strength}>{strength}</li>
                  ))}
                </ul>
                {selectedCharacter.languageStrengths?.length ? (
                  <p className="text-xs text-slate-400">Language strengths: {selectedCharacter.languageStrengths.join(", ")}</p>
                ) : null}
                {selectedCharacter.accentStrengths?.length ? (
                  <p className="text-xs text-slate-400">Dialect strengths: {selectedCharacter.accentStrengths.join(", ")}</p>
                ) : null}
              </>
            ) : null}

            {selectedUseCase ? (
              <div className="rounded-xl border border-white/10 bg-slate-950/70 p-3 text-sm text-slate-300">
                <p className="font-semibold text-slate-100">Use case profile: {selectedUseCase.name}</p>
                <p className="mt-1 text-slate-400">{selectedUseCase.description}</p>
                <p className="mt-2 text-slate-300">Word target: {selectedUseCase.minWords}-{selectedUseCase.maxWords}</p>
                <p className="mt-1 text-slate-400">Priorities: {selectedUseCase.qualityPriorities.join(", ")}</p>
              </div>
            ) : null}
          </div>

          <div className="space-y-4 rounded-2xl border border-white/10 bg-slate-900/70 p-5">
            <h2 className="text-lg font-semibold">Behavior matrix</h2>
            {catalog?.behaviors.map((behavior) => (
              <div key={behavior.id} className={`rounded-xl border p-3 text-sm ${behavior.id === behaviorId ? "border-cyan-400/40 bg-cyan-500/10 text-cyan-100" : "border-white/10 bg-slate-950/60 text-slate-300"}`}>
                <p className="font-semibold">{behavior.name}</p>
                <p className="text-xs opacity-90">Tone: {behavior.tone} | Pacing: {behavior.pacing} | Weight: {behavior.emotionalWeight}</p>
                <p className="mt-1 text-xs opacity-80">{behavior.guidance}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg font-semibold">Pronunciation dictionary and phoneme overrides</h2>
              <span className="text-xs text-slate-400">{loadingAssets ? "Syncing..." : `${pronunciationEntries.length} active`}</span>
            </div>
            <form onSubmit={handleSavePronunciation} className="mt-4 space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  value={term}
                  onChange={(event) => setTerm(event.target.value)}
                  placeholder="Term"
                  className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-400"
                />
                <input
                  value={phoneme}
                  onChange={(event) => setPhoneme(event.target.value)}
                  placeholder="Phoneme (IPA or custom)"
                  className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-400"
                />
              </div>
              <input
                value={replacement}
                onChange={(event) => setReplacement(event.target.value)}
                placeholder="Replacement text used in render"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-400"
              />
              <input
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                placeholder="Notes"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-400"
              />
              <button
                type="submit"
                className="rounded-full border border-cyan-400/40 bg-cyan-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-200 transition hover:bg-cyan-500/20"
              >
                Save override
              </button>
            </form>

            <div className="mt-4 space-y-2">
              {pronunciationEntries.length > 0 ? pronunciationEntries.map((entry) => (
                <div key={entry.id} className="rounded-xl border border-white/10 bg-slate-950/60 p-3 text-xs text-slate-300">
                  <p><span className="font-semibold text-slate-100">{entry.term}</span> -&gt; {entry.replacement} ({entry.phoneme})</p>
                  <p className="mt-1 text-slate-400">Accent scope: {entry.accent === "*" ? "All dialects" : entry.accent}</p>
                  {entry.notes ? <p className="mt-1 text-slate-400">{entry.notes}</p> : null}
                  <button
                    type="button"
                    onClick={() => void handleDeletePronunciation(entry.id)}
                    className="mt-2 rounded-full border border-rose-400/30 bg-rose-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-200"
                  >
                    Remove
                  </button>
                </div>
              )) : (
                <div className="rounded-xl border border-dashed border-white/10 bg-slate-950/50 p-3 text-xs text-slate-400">
                  No overrides configured for this language and accent yet.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-lg font-semibold">A/B audio versions and approval workflow</h2>
              <span className="text-xs text-slate-400">{voiceVersions.length} versions</span>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={() => void handleCreateVersion("A")} className="rounded-full border border-cyan-400/40 bg-cyan-500/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-cyan-200">Create A</button>
              <button type="button" onClick={() => void handleCreateVersion("B")} className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-emerald-200">Create B</button>
              <button type="button" onClick={() => void handleCreateVersion("Custom")} className="rounded-full border border-slate-300/30 bg-slate-500/10 px-3 py-2 text-xs font-semibold uppercase tracking-[0.15em] text-slate-200">Create Custom</button>
            </div>

            <p className="mt-4 text-xs text-slate-400">
              Reviewer and approver identity is enforced from your authenticated account role.
            </p>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <select value={compareAId} onChange={(event) => setCompareAId(event.target.value)} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none focus:border-cyan-400">
                <option value="">Select Version A</option>
                {voiceVersions.map((version) => (
                  <option key={`a-${version.id}`} value={version.id}>{version.label} | {new Date(version.createdAt).toLocaleString()}</option>
                ))}
              </select>
              <select value={compareBId} onChange={(event) => setCompareBId(event.target.value)} className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none focus:border-cyan-400">
                <option value="">Select Version B</option>
                {voiceVersions.map((version) => (
                  <option key={`b-${version.id}`} value={version.id}>{version.label} | {new Date(version.createdAt).toLocaleString()}</option>
                ))}
              </select>
            </div>

            {compareA && compareB ? (
              <div className="mt-4 rounded-xl border border-white/10 bg-slate-950/60 p-3 text-xs text-slate-300">
                <p className="font-semibold text-slate-100">A/B comparison snapshot</p>
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  <li>Speed delta: {(compareA.speed - compareB.speed).toFixed(2)}</li>
                  <li>Pitch delta: {(compareA.pitch - compareB.pitch).toFixed(2)}</li>
                  <li>Energy delta: {(compareA.energy - compareB.energy).toFixed(2)}</li>
                  <li>Dialect match: {compareA.accent === compareB.accent ? "Same" : "Different"}</li>
                  <li>Behavior match: {compareA.behaviorId === compareB.behaviorId ? "Same" : "Different"}</li>
                  <li>
                    Loudness delta (LUFS): {compareA.analytics && compareB.analytics
                      ? (compareA.analytics.estimatedLufs - compareB.analytics.estimatedLufs).toFixed(2)
                      : "n/a"}
                  </li>
                  <li>
                    RMS delta (dBFS): {compareA.analytics && compareB.analytics
                      ? (compareA.analytics.rmsDbfs - compareB.analytics.rmsDbfs).toFixed(2)
                      : "n/a"}
                  </li>
                  <li>
                    Peak delta (dBFS): {compareA.analytics && compareB.analytics
                      ? (compareA.analytics.peakDbfs - compareB.analytics.peakDbfs).toFixed(2)
                      : "n/a"}
                  </li>
                </ul>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  {[compareA, compareB].map((version) => (
                    <div key={version.id} className="rounded-lg border border-white/10 bg-slate-900/70 p-2">
                      <p className="font-semibold text-slate-100">Version {version.label}</p>
                      <p className="text-[11px] text-slate-400">
                        LUFS {version.analytics?.estimatedLufs ?? "n/a"} | RMS {version.analytics?.rmsDbfs ?? "n/a"} | Peak {version.analytics?.peakDbfs ?? "n/a"}
                      </p>
                      {version.analytics?.waveformPoints?.length ? (
                        <div className="mt-2 flex h-12 items-end gap-[1px]">
                          {version.analytics.waveformPoints.map((point, index) => (
                            <span
                              key={`${version.id}-${index}`}
                              className="w-[2px] bg-cyan-300/80"
                              style={{ height: `${Math.max(8, point * 100)}%` }}
                            />
                          ))}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mt-4 space-y-2">
              {voiceVersions.length > 0 ? voiceVersions.map((version) => (
                <div key={version.id} className="rounded-xl border border-white/10 bg-slate-950/60 p-3 text-xs text-slate-300">
                  <p className="font-semibold text-slate-100">
                    {version.label} | {new Date(version.createdAt).toLocaleString()} | status: {version.status}
                  </p>
                  <p className="mt-1">{version.languageCode} / {version.accent} / {version.behaviorId}</p>
                  <p className="mt-1 text-[11px] text-slate-400">
                    QA: {analyticsPass(version) ? "pass" : "attention"} | LUFS {version.analytics?.estimatedLufs ?? "n/a"} | RMS {version.analytics?.rmsDbfs ?? "n/a"} | Peak {version.analytics?.peakDbfs ?? "n/a"}
                  </p>
                  <audio controls src={version.audioDataUrl} className="mt-2 w-full" />
                  <div className="mt-2 flex flex-wrap gap-2">
                    <a
                      href={version.audioDataUrl}
                      download={`voice-${safeId(version.label)}-${safeId(version.id)}.wav`}
                      className="rounded-full border border-cyan-400/40 bg-cyan-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-cyan-200"
                    >
                      Download
                    </a>
                    <button type="button" onClick={() => void handleApprove(version.id, "approved")} className="rounded-full border border-emerald-400/40 bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-200">Approve</button>
                    <button type="button" onClick={() => void handleApprove(version.id, "rejected")} className="rounded-full border border-rose-400/40 bg-rose-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-rose-200">Reject</button>
                    <button type="button" onClick={() => void handleApprove(version.id, "candidate")} className="rounded-full border border-slate-300/30 bg-slate-500/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-200">Reset</button>
                  </div>
                  <p className="mt-2 text-[11px] text-slate-400">
                    Last decision by: {version.approvalActor ?? "n/a"} ({version.approvalRole ?? "n/a"})
                  </p>
                  {version.approvalNotes ? <p className="mt-2 text-slate-400">Notes: {version.approvalNotes}</p> : null}
                  {version.auditTrail?.length ? (
                    <div className="mt-2 rounded-lg border border-white/10 bg-slate-900/70 p-2">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-cyan-200">Audit timeline</p>
                      <ul className="mt-1 space-y-1 text-[11px] text-slate-400">
                        {version.auditTrail.map((event, index) => (
                          <li key={`${version.id}-event-${index}`}>
                            {new Date(event.at).toLocaleString()} | {event.actorRole} {event.actorName} | {event.action} -&gt; {event.status}
                            {event.notes ? ` | ${event.notes}` : ""}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              )) : (
                <div className="rounded-xl border border-dashed border-white/10 bg-slate-950/50 p-3 text-xs text-slate-400">
                  No saved versions yet. Generate package and create A or B versions.
                </div>
              )}
            </div>

            <textarea
              value={approvalNote}
              onChange={(event) => setApprovalNote(event.target.value)}
              rows={2}
              className="mt-3 w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-100 outline-none focus:border-cyan-400"
              placeholder="Approval notes applied when you approve or reject a version"
            />
          </div>
        </section>

        {result ? (
          <section className="space-y-4 rounded-2xl border border-white/10 bg-slate-900/70 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">Render-ready professional package</h2>
              <button type="button" onClick={() => void copyRenderPrompt()} className="rounded-full border border-cyan-400/40 bg-cyan-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200 transition hover:border-cyan-300 hover:bg-cyan-500/20">
                Copy render brief
              </button>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-300">
                <p className="font-semibold text-slate-100">Delivery blueprint</p>
                <ul className="mt-3 list-disc space-y-2 pl-5">
                  <li>{result.deliveryBlueprint.opening}</li>
                  <li>{result.deliveryBlueprint.body}</li>
                  <li>{result.deliveryBlueprint.close}</li>
                </ul>
              </div>

              <div className="rounded-xl border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-300">
                <p className="font-semibold text-slate-100">User needs assessment</p>
                <p className="mt-2 text-slate-400">Priorities: {result.userNeedsAssessment.priorities.join(", ")}</p>
                <ul className="mt-3 list-disc space-y-2 pl-5">
                  {result.userNeedsAssessment.recommendations.map((recommendation) => (
                    <li key={recommendation}>{recommendation}</li>
                  ))}
                </ul>
              </div>
            </div>

            {result.pronunciationReview ? (
              <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 p-4 text-sm text-cyan-100">
                <p className="font-semibold">Pronunciation override audit</p>
                <p className="mt-1 opacity-90">Applied entries: {result.pronunciationReview.appliedCount}</p>
                {result.pronunciationReview.entries.length > 0 ? (
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
                    {result.pronunciationReview.entries.map((entry) => (
                      <li key={entry.id}>{entry.term} -&gt; {entry.replacement} ({entry.phoneme})</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ) : null}

            <div className={`rounded-xl border p-4 text-sm ${result.qualityReview.passed ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-100" : "border-amber-500/30 bg-amber-500/10 text-amber-100"}`}>
              <p className="font-semibold">Quality review: {result.qualityReview.passed ? "Pass" : "Needs refinement"}</p>
              <ul className="mt-3 list-disc space-y-1 pl-5">
                {Object.entries(result.qualityReview.checks).map(([key, check]) => (
                  <li key={key}>
                    {formatLabel(key)}: {check.passed ? "pass" : "attention"}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-white/10 bg-slate-950/70 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">Render brief</p>
              <pre className="mt-3 overflow-x-auto whitespace-pre-wrap text-xs text-slate-200">{result.renderPrompt}</pre>
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
