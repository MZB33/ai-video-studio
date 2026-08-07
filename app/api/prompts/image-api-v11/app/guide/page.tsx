import Link from "next/link";

export default function GuidePage() {
  return (
    <main className="min-h-screen bg-slate-950 px-4 py-16 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-black/20 backdrop-blur">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-cyan-300">Help guide</p>
            <h1 className="text-3xl font-semibold sm:text-4xl">How to use the app from start to finish</h1>
            <p className="max-w-2xl text-base text-slate-300">
              This in-app guide gives you a simple path from first launch to secure sign-in, prompt generation, and billing management.
            </p>
          </div>
          <Link href="/" className="text-sm font-medium text-cyan-300 hover:text-cyan-200">
            &larr; Back to prompt studio
          </Link>
        </div>

        <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/10 p-4 text-sm text-cyan-100">
          <p className="font-semibold">Quick start</p>
          <p className="mt-2 text-cyan-100/90">Create an account, sign in with a strong password, generate prompts, review history, and manage your plan from billing.</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
            <h2 className="text-lg font-semibold">1. Create an account</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
              <li>Open the sign-in page and switch to Sign up.</li>
              <li>Use a strong password with at least 12 characters.</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
            <h2 className="text-lg font-semibold">2. Sign in securely</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
              <li>Sign in with your email and password.</li>
              <li>The app uses a secure HTTP-only session cookie.</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
            <h2 className="text-lg font-semibold">3. Generate your first prompt pack</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
              <li>Write a short story idea with mood, setting, or conflict.</li>
              <li>Click Generate prompts.</li>
              <li>Review the scenes that appear below the form.</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
            <h2 className="text-lg font-semibold">4. Review and reuse results</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
              <li>Use the recent generations panel to revisit older work.</li>
              <li>Your history stays linked to your signed-in account.</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
            <h2 className="text-lg font-semibold">5. Manage billing and plans</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
              <li>Open the billing page to review plans.</li>
              <li>Start checkout or open the customer portal when needed.</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
            <h2 className="text-lg font-semibold">6. Resolve common problems</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
              <li>If generation fails, make the story clearer and shorter.</li>
              <li>If requests are exhausted, wait for the reset window or upgrade.</li>
              <li>If history is missing, confirm you are signed into the correct account.</li>
            </ul>
          </section>

          <section className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
            <h2 className="text-lg font-semibold">7. Use Voice Studio Pro</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
              <li>Open Voice Studio Pro from the home page navigation.</li>
              <li>Select a character, language, accent, and behavior profile.</li>
              <li>Choose the matching use case and tune speed, pitch, and energy.</li>
              <li>Generate the package and review user-needs and quality diagnostics before final render.</li>
              <li>Create Version A and Version B to run direct audio comparison and pick a winner.</li>
              <li>Use waveform, LUFS, RMS, and peak analytics to make objective quality decisions.</li>
              <li>Approve or reject versions with notes to maintain a clear production decision trail.</li>
              <li>Set reviewer or approver role before taking actions so each decision is logged in timeline history.</li>
              <li>Add pronunciation dictionary and phoneme overrides per language and dialect before final output.</li>
            </ul>
          </section>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 text-sm text-slate-300">
          <p className="font-semibold text-slate-100">Best practices</p>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Use a unique password for this app.</li>
            <li>Sign out on shared devices.</li>
            <li>Review outputs before sharing them publicly or in client work.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
