"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";
import { allCategories } from "@/lib/categories";
import {
  formatUsd,
  getAnnualMonthlyEquivalent,
  getAnnualSavingsPercent,
  getPlanCtaLabel,
  getPlanCycleLabel,
  getPlanCyclePrice,
  type BillingCycle,
  pricingPlans,
  publicFeatureSteps,
} from "@/lib/pricing";

const serviceStack = [
  "Hugging Face for free AI inference",
  "Replicate for premium image and video workflows",
  "OpenAI for text and productivity features",
  "VoiceRSS and ElevenLabs for voice generation",
  "Redis / Upstash for job queueing and monitoring",
];

export default function PricingPage() {
  const router = useRouter();
  const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");

  const bestAnnualSaving = useMemo(
    () => Math.max(...pricingPlans.map((plan) => getAnnualSavingsPercent(plan))),
    []
  );

  return (
    <main style={{ minHeight: "100vh", background: "#08070f", color: "#f8fafc", padding: "24px 16px 96px" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto" }}>
        <section style={{ display: "flex", flexDirection: "column", gap: 18, marginBottom: 28 }}>
          <button
            onClick={() => router.back()}
            style={{ alignSelf: "flex-start", background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.08)", padding: "8px 14px", borderRadius: 999, cursor: "pointer" }}
          >
            ← Back
          </button>
          <div style={{ maxWidth: 760 }}>
            <p style={{ letterSpacing: "0.35em", textTransform: "uppercase", color: "#7dd3fc", fontSize: 12, margin: 0 }}>
              Public pricing
            </p>
            <h1 style={{ fontSize: "clamp(2.2rem, 5vw, 4.5rem)", lineHeight: 1.05, margin: "12px 0", fontWeight: 900 }}>
              Simple pricing for a public AI video studio.
            </h1>
            <p style={{ color: "#cbd5e1", fontSize: "1.05rem", lineHeight: 1.8, margin: 0 }}>
              The app ships with a free public experience and a paid Pro tier. Tool access is driven by the catalog status in the app, and the paid checkout can be redirected to your configured payment link.
            </p>
            <div style={{ marginTop: 16, display: "inline-flex", gap: 8, padding: 6, borderRadius: 999, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)" }}>
              {([
                { id: "monthly" as BillingCycle, label: "Monthly" },
                { id: "annual" as BillingCycle, label: `Annual · save up to ${bestAnnualSaving}%` },
              ]).map((item) => (
                <button
                  key={item.id}
                  onClick={() => setBillingCycle(item.id)}
                  style={{
                    border: "none",
                    borderRadius: 999,
                    padding: "8px 14px",
                    cursor: "pointer",
                    background: billingCycle === item.id ? "#7c5df6" : "transparent",
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: 13,
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", marginBottom: 36 }}>
          {pricingPlans.map((plan) => (
            <article
              key={plan.id}
              style={{
                background: plan.id === "pro" ? "linear-gradient(180deg, rgba(124,93,246,0.22), rgba(19,17,30,0.98))" : "rgba(255,255,255,0.05)",
                border: `1px solid ${plan.id === "pro" ? "rgba(124,93,246,0.35)" : "rgba(255,255,255,0.08)"}`,
                borderRadius: 28,
                padding: 24,
                boxShadow: "0 24px 60px rgba(0,0,0,0.25)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
                <div>
                  <p style={{ margin: 0, color: "#cbd5e1", fontSize: 14 }}>{plan.name}</p>
                  <h2 style={{ margin: "6px 0 0", fontSize: "2rem" }}>
                    {formatUsd(getPlanCyclePrice(plan, billingCycle))}
                  </h2>
                </div>
                <span style={{ color: plan.accent, fontSize: 12, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase" }}>
                  {getPlanCycleLabel(billingCycle)}
                </span>
              </div>
              <p style={{ margin: "6px 0 0", color: "#94a3b8", fontSize: "0.82rem" }}>
                {plan.targetUser}
              </p>
              {billingCycle === "annual" && plan.monthlyPriceUsd > 0 ? (
                <p style={{ margin: "8px 0 0", color: "#e2e8f0", fontSize: "0.86rem" }}>
                  {formatUsd(getAnnualMonthlyEquivalent(plan))}/mo equivalent, billed annually · save {getAnnualSavingsPercent(plan)}%
                </p>
              ) : null}
              {plan.isMostPopular ? (
                <span style={{ display: "inline-block", marginTop: 10, fontSize: 11, fontWeight: 800, letterSpacing: "0.2em", textTransform: "uppercase", color: "#fff", background: "rgba(124,93,246,0.35)", borderRadius: 999, padding: "6px 10px" }}>
                  Most Popular
                </span>
              ) : null}
              <p style={{ color: "#cbd5e1", lineHeight: 1.7 }}>{plan.description}</p>
              <ul style={{ margin: "18px 0", paddingLeft: 18, color: "#e2e8f0", lineHeight: 1.8 }}>
                {plan.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <button
                onClick={() => router.push(plan.ctaByCycle[billingCycle])}
                style={{ width: "100%", padding: "0.9rem 1rem", borderRadius: 999, border: "none", cursor: "pointer", fontWeight: 800, background: plan.id === "pro" ? plan.accent : "#0ea5e9", color: "#fff" }}
              >
                {getPlanCtaLabel(plan, billingCycle)}
              </button>
            </article>
          ))}
        </section>

        <section style={{ marginBottom: 36 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 16 }}>
            <div>
              <p style={{ margin: 0, color: "#7dd3fc", letterSpacing: "0.28em", textTransform: "uppercase", fontSize: 12 }}>Step by step</p>
              <h2 style={{ margin: "8px 0 0", fontSize: "1.8rem" }}>What the app gives users</h2>
            </div>
            <button onClick={() => router.push("/")} style={{ padding: "0.8rem 1rem", borderRadius: 999, background: "rgba(255,255,255,0.08)", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer" }}>
              Open the app
            </button>
          </div>

          <div style={{ display: "grid", gap: 14 }}>
            {publicFeatureSteps.map(({ step, category, access }) => (
              <article key={category.id} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 22, padding: 18 }}>
                <div style={{ display: "flex", gap: 14, alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap" }}>
                  <div style={{ minWidth: 240, flex: 1 }}>
                    <p style={{ margin: 0, color: "#94a3b8", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.22em" }}>Step {step}</p>
                    <h3 style={{ margin: "6px 0 4px", fontSize: "1.15rem" }}>{category.nameEn}</h3>
                    <p style={{ margin: 0, color: "#cbd5e1", lineHeight: 1.7 }}>{category.description}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 800, color: "#f8fafc" }}>{access.label}</div>
                    <div style={{ color: "#94a3b8", fontSize: 13 }}>{access.detail}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 }}>
                  {category.tools.slice(0, 6).map((tool) => (
                    <span key={tool.id} style={{ padding: "6px 10px", borderRadius: 999, background: tool.status === "pro" ? "rgba(124,93,246,0.18)" : "rgba(14,165,233,0.18)", color: "#e2e8f0", fontSize: 12 }}>
                      {tool.nameEn} · {tool.status.toUpperCase()}
                    </span>
                  ))}
                  {category.tools.length > 6 ? (
                    <span style={{ padding: "6px 10px", borderRadius: 999, background: "rgba(255,255,255,0.08)", color: "#e2e8f0", fontSize: 12 }}>
                      +{category.tools.length - 6} more tools
                    </span>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          <article style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: 22 }}>
            <h2 style={{ marginTop: 0 }}>Powered by configured services</h2>
            <ul style={{ color: "#cbd5e1", lineHeight: 1.8, paddingLeft: 18 }}>
              {serviceStack.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
          <article style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: 22 }}>
            <h2 style={{ marginTop: 0 }}>How monetization works</h2>
            <p style={{ color: "#cbd5e1", lineHeight: 1.8 }}>
              Free tools remain accessible publicly. Paid tools are labeled in the catalog and paid plan buttons route through a checkout redirect endpoint so you can connect Stripe, a payment link, or another billing flow through deployment configuration.
            </p>
            <p style={{ color: "#94a3b8", lineHeight: 1.8, marginBottom: 0 }}>
              The app does not expose API keys to users; provider credentials stay on the server and are only needed to power premium services. Annual plans are intentionally discounted to increase retention and revenue predictability.
            </p>
          </article>
        </section>

        <section style={{ marginTop: 36, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: 22 }}>
          <h2 style={{ marginTop: 0 }}>Feature coverage</h2>
          <p style={{ color: "#cbd5e1", lineHeight: 1.8 }}>
            The catalog currently exposes {allCategories.length} public feature groups, including storytelling, image generation, video, voice, dubbing, animation, career, freelancing, daily life, education, business, social media, legal, and personal assistant tools.
          </p>
          <p style={{ color: "#94a3b8", marginBottom: 0 }}>
            Every group above is driven from the same shared catalog, so the pricing page, AI tools page, and in-app tool labels stay in sync.
          </p>
        </section>
      </div>

      <BottomNav active="pricing" onNavigate={(href) => router.push(href)} />
    </main>
  );
}
