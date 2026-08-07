"use client";

import { FormEvent, Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BottomNav from "@/components/ui/BottomNav";

type BillingAccount = {
  userId: string;
  email: string;
  planId: string;
  billingCycle: string;
  subscriptionStatus: string;
  cancelAtPeriodEnd: boolean;
  currentPeriodEnd?: string;
  lastInvoiceDate?: string;
  stripeCustomerId?: string;
};

type BillingPayment = {
  eventId: string;
  invoiceId?: string;
  amountUsd: number;
  currency: string;
  status: string;
  planId: string;
  billingCycle: string;
  createdAt: string;
};

type ApiKeyStatusEntry = {
  present: boolean;
  preview: string;
};

type ApiKeyStatusMap = {
  replicateApiToken: ApiKeyStatusEntry;
  huggingfaceApiKey: ApiKeyStatusEntry;
  openaiApiKey: ApiKeyStatusEntry;
  elevenlabsApiKey: ApiKeyStatusEntry;
  voicerssApiKey: ApiKeyStatusEntry;
  googleTtsKey: ApiKeyStatusEntry;
};

type ApiKeyDraft = {
  replicateApiToken: string;
  huggingfaceApiKey: string;
  openaiApiKey: string;
  elevenlabsApiKey: string;
  voicerssApiKey: string;
  googleTtsKey: string;
};

const EMPTY_DRAFT: ApiKeyDraft = {
  replicateApiToken: "",
  huggingfaceApiKey: "",
  openaiApiKey: "",
  elevenlabsApiKey: "",
  voicerssApiKey: "",
  googleTtsKey: "",
};

function AccountBillingPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [account, setAccount] = useState<BillingAccount | null>(null);
  const [payments, setPayments] = useState<BillingPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [apiKeyStatus, setApiKeyStatus] = useState<ApiKeyStatusMap | null>(null);
  const [apiKeyDraft, setApiKeyDraft] = useState<ApiKeyDraft>(EMPTY_DRAFT);

  const checkoutState = searchParams.get("checkout") || "";

  const headline = useMemo(() => {
    if (checkoutState === "success") return "Payment received and recorded";
    if (checkoutState === "cancelled") return "Checkout was cancelled";
    return "Billing and subscription control";
  }, [checkoutState]);

  async function refreshBilling() {
    setLoading(true);
    setError("");

    try {
      const provision = await fetch("/api/account/provision", { method: "GET" });
      if (!provision.ok) {
        throw new Error("Unable to provision billing account");
      }

      const response = await fetch("/api/account/billing", { method: "GET" });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to load billing details");
      }

      const keyResponse = await fetch("/api/account/api-keys", { method: "GET" });
      const keyData = await keyResponse.json();
      if (keyResponse.ok) {
        setApiKeyStatus(keyData.keys || null);
      }

      setAccount(data.account || null);
      setPayments(data.payments || []);
      setEmail(data.account?.email || "");
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Failed to load billing details");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void refreshBilling();
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  async function saveEmail(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");

    const response = await fetch("/api/account/provision", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "Failed to save email");
      return;
    }

    setNotice("Account email saved");
    setAccount((prev) => (prev ? { ...prev, email: data.email || email } : prev));
    await refreshBilling();
  }

  async function updateSubscription(action: "cancel" | "renew") {
    setError("");
    setNotice("");

    const response = await fetch("/api/account/billing/manage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action }),
    });

    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "Unable to update subscription");
      return;
    }

    setNotice(action === "cancel" ? "Subscription set to cancel at period end" : "Auto-renew enabled");
    await refreshBilling();
  }

  async function saveApiKeys(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");

    const payload = {
      keys: Object.fromEntries(
        Object.entries(apiKeyDraft).filter(([, value]) => value.trim().length > 0)
      ),
    };

    if (Object.keys(payload.keys).length === 0) {
      setNotice("No new key values provided");
      return;
    }

    const response = await fetch("/api/account/api-keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok) {
      setError(data.error || "Failed to save API keys");
      return;
    }

    setApiKeyStatus(data.keys || null);
    setApiKeyDraft(EMPTY_DRAFT);
    setNotice("Provider API keys updated for this account");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #0f172a, #1e1b4b 48%, #0f766e)",
        color: "white",
        padding: "2rem 1rem 96px",
      }}
    >
      <div style={{ maxWidth: 980, margin: "0 auto", display: "grid", gap: "1rem" }}>
        <section
          style={{
            background: "rgba(15, 23, 42, 0.48)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 24,
            padding: "1.5rem",
          }}
        >
          <button
            onClick={() => router.back()}
            style={{
              background: "rgba(255,255,255,0.12)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: 999,
              padding: "0.5rem 0.9rem",
              cursor: "pointer",
            }}
          >
            ← Back
          </button>
          <h1 style={{ margin: "1rem 0 0" }}>Account Billing</h1>
          <p style={{ margin: "0.5rem 0 0", color: "rgba(255,255,255,0.82)", lineHeight: 1.6 }}>
            {headline}. Subscription status, invoice records, and renewal controls are managed here.
          </p>
        </section>

        {error ? (
          <div style={{ background: "rgba(239,68,68,0.18)", border: "1px solid rgba(239,68,68,0.35)", borderRadius: 16, padding: "0.8rem 1rem" }}>
            {error}
          </div>
        ) : null}

        {notice ? (
          <div style={{ background: "rgba(34,197,94,0.18)", border: "1px solid rgba(34,197,94,0.35)", borderRadius: 16, padding: "0.8rem 1rem" }}>
            {notice}
          </div>
        ) : null}

        <section
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 24,
            padding: "1.25rem",
          }}
        >
          <form onSubmit={saveEmail} style={{ display: "grid", gap: "0.6rem" }}>
            <label style={{ fontWeight: 700 }}>Billing email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              style={{
                borderRadius: 14,
                border: "1px solid rgba(255,255,255,0.25)",
                background: "rgba(15,23,42,0.45)",
                color: "white",
                padding: "0.7rem 0.85rem",
              }}
            />
            <button
              type="submit"
              style={{
                width: "fit-content",
                borderRadius: 999,
                border: "none",
                padding: "0.7rem 1rem",
                background: "#38bdf8",
                color: "#082f49",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Save email
            </button>
          </form>
        </section>

        <section
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 24,
            padding: "1.25rem",
            display: "grid",
            gap: "1rem",
          }}
        >
          <div>
            <h2 style={{ margin: 0 }}>Bring your own API keys</h2>
            <p style={{ margin: "0.4rem 0 0", color: "rgba(255,255,255,0.8)", lineHeight: 1.6 }}>
              Saved account keys are used for your paid generation requests before platform fallback keys.
            </p>
          </div>

          {apiKeyStatus ? (
            <div style={{ display: "grid", gap: "0.5rem", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
              {Object.entries(apiKeyStatus).map(([name, status]) => (
                <div key={name} style={{ background: "rgba(15,23,42,0.42)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 14, padding: "0.7rem" }}>
                  <div style={{ fontSize: "0.72rem", textTransform: "uppercase", color: "rgba(255,255,255,0.72)", letterSpacing: "0.07em" }}>{name}</div>
                  <div style={{ marginTop: "0.35rem", fontWeight: 700 }}>{status.present ? `Saved (${status.preview})` : "Not set"}</div>
                </div>
              ))}
            </div>
          ) : null}

          <form onSubmit={saveApiKeys} style={{ display: "grid", gap: "0.8rem" }}>
            <div style={{ display: "grid", gap: "0.8rem", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
              {[{
                key: "replicateApiToken",
                label: "Replicate",
                placeholder: "r8_...",
              }, {
                key: "huggingfaceApiKey",
                label: "Hugging Face",
                placeholder: "hf_...",
              }, {
                key: "openaiApiKey",
                label: "OpenAI",
                placeholder: "sk-...",
              }, {
                key: "elevenlabsApiKey",
                label: "ElevenLabs",
                placeholder: "Enter key",
              }, {
                key: "voicerssApiKey",
                label: "VoiceRSS",
                placeholder: "Enter key",
              }, {
                key: "googleTtsKey",
                label: "Google TTS",
                placeholder: "Enter key",
              }].map((entry) => (
                <label key={entry.key} style={{ display: "grid", gap: "0.35rem" }}>
                  <span style={{ fontSize: "0.82rem", color: "rgba(255,255,255,0.82)" }}>{entry.label}</span>
                  <input
                    type="password"
                    value={apiKeyDraft[entry.key as keyof ApiKeyDraft]}
                    onChange={(event) =>
                      setApiKeyDraft((prev) => ({
                        ...prev,
                        [entry.key]: event.target.value,
                      }))
                    }
                    placeholder={entry.placeholder}
                    style={{
                      borderRadius: 12,
                      border: "1px solid rgba(255,255,255,0.2)",
                      background: "rgba(15,23,42,0.45)",
                      color: "white",
                      padding: "0.65rem 0.75rem",
                    }}
                  />
                </label>
              ))}
            </div>

            <button
              type="submit"
              style={{
                width: "fit-content",
                borderRadius: 999,
                border: "none",
                padding: "0.72rem 1rem",
                background: "#22c55e",
                color: "#052e16",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              Save API keys
            </button>
          </form>
        </section>

        <section style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          {[{
            label: "Current plan",
            value: account?.planId ? account.planId.toUpperCase() : "-",
          }, {
            label: "Subscription status",
            value: account?.subscriptionStatus || "-",
          }, {
            label: "Billing cycle",
            value: account?.billingCycle || "-",
          }, {
            label: "Last invoice date",
            value: account?.lastInvoiceDate ? new Date(account.lastInvoiceDate).toLocaleString() : "No invoice yet",
          }].map((item) => (
            <div key={item.label} style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 18, padding: "1rem" }}>
              <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(255,255,255,0.72)" }}>{item.label}</div>
              <div style={{ marginTop: "0.4rem", fontWeight: 700 }}>{item.value}</div>
            </div>
          ))}
        </section>

        <section
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 24,
            padding: "1.25rem",
            display: "flex",
            gap: "0.75rem",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => router.push("/pricing")}
            style={{ borderRadius: 999, border: "none", padding: "0.75rem 1rem", fontWeight: 700, cursor: "pointer", background: "#a78bfa", color: "#1e1b4b" }}
          >
            Upgrade / Change plan
          </button>
          <button
            onClick={() => updateSubscription("cancel")}
            disabled={!account || loading}
            style={{ borderRadius: 999, border: "1px solid rgba(255,255,255,0.25)", padding: "0.75rem 1rem", fontWeight: 700, cursor: "pointer", background: "rgba(248,113,113,0.2)", color: "#fecaca" }}
          >
            Cancel at period end
          </button>
          <button
            onClick={() => updateSubscription("renew")}
            disabled={!account || loading}
            style={{ borderRadius: 999, border: "1px solid rgba(255,255,255,0.25)", padding: "0.75rem 1rem", fontWeight: 700, cursor: "pointer", background: "rgba(34,197,94,0.2)", color: "#bbf7d0" }}
          >
            Renew subscription
          </button>
        </section>

        <section
          style={{
            background: "rgba(15,23,42,0.45)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 24,
            padding: "1.25rem",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Payment records</h2>
          {loading ? (
            <p style={{ color: "rgba(255,255,255,0.75)" }}>Loading records...</p>
          ) : payments.length === 0 ? (
            <p style={{ color: "rgba(255,255,255,0.75)" }}>No payments recorded yet.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 660 }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: "0.6rem", borderBottom: "1px solid rgba(255,255,255,0.16)" }}>Date</th>
                    <th style={{ textAlign: "left", padding: "0.6rem", borderBottom: "1px solid rgba(255,255,255,0.16)" }}>Plan</th>
                    <th style={{ textAlign: "left", padding: "0.6rem", borderBottom: "1px solid rgba(255,255,255,0.16)" }}>Cycle</th>
                    <th style={{ textAlign: "left", padding: "0.6rem", borderBottom: "1px solid rgba(255,255,255,0.16)" }}>Amount</th>
                    <th style={{ textAlign: "left", padding: "0.6rem", borderBottom: "1px solid rgba(255,255,255,0.16)" }}>Status</th>
                    <th style={{ textAlign: "left", padding: "0.6rem", borderBottom: "1px solid rgba(255,255,255,0.16)" }}>Invoice</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.eventId}>
                      <td style={{ padding: "0.6rem", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>{new Date(payment.createdAt).toLocaleString()}</td>
                      <td style={{ padding: "0.6rem", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>{payment.planId.toUpperCase()}</td>
                      <td style={{ padding: "0.6rem", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>{payment.billingCycle}</td>
                      <td style={{ padding: "0.6rem", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>${payment.amountUsd.toFixed(2)} {payment.currency}</td>
                      <td style={{ padding: "0.6rem", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>{payment.status}</td>
                      <td style={{ padding: "0.6rem", borderBottom: "1px solid rgba(255,255,255,0.1)" }}>{payment.invoiceId || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      <BottomNav active="profile" onNavigate={(href) => router.push(href)} />
    </main>
  );
}

export default function AccountBillingPage() {
  return (
    <Suspense fallback={<main style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>Loading billing account...</main>}>
      <AccountBillingPageContent />
    </Suspense>
  );
}
