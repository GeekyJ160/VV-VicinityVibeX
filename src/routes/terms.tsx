import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({ component: Terms });

function Terms() {
  return (
    <main className="mx-auto min-h-screen max-w-2xl px-6 py-10">
      <p className="font-display text-sm tracking-wide text-muted uppercase">
        Vicinity Vibe
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
        Terms of Use
      </h1>
      <p className="mt-2 text-sm text-muted">Last updated: September 5, 2026</p>

      <div className="mt-8 space-y-4 text-sm leading-relaxed text-fg/90">
        <p>
          By using Vicinity Vibe—including the website and Android app—you agree
          to these placeholder terms. Final counsel-reviewed terms will replace
          this copy before store launch.
        </p>
        <h2 className="font-display text-lg font-semibold pt-2">The service</h2>
        <p>
          Vicinity Vibe provides culture-first social matching: profiles,
          neighborhood-level discovery, community &quot;universes,&quot; and chat.
          Features may change as the product evolves. The service is intended for
          adults 18+.
        </p>
        <h2 className="font-display text-lg font-semibold pt-2">Your content</h2>
        <p>
          You retain rights to content you create. You are responsible for what
          you post in profiles and messages. Do not share illegal, harassing, or
          non-consensual content. Other users may see content you choose to make
          visible.
        </p>
        <h2 className="font-display text-lg font-semibold pt-2">Acceptable use</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>Be 18 or older to use the service.</li>
          <li>Do not abuse, spam, or attempt unauthorized access.</li>
          <li>Respect other users; do not harass or impersonate.</li>
          <li>Do not use the app for unlawful activity.</li>
        </ul>
        <h2 className="font-display text-lg font-semibold pt-2">Safety</h2>
        <p>
          Meetups and in-person contact are at your own risk. Use visibility and
          trusted-contact settings thoughtfully. Block/report and account deletion
          flows are planned for store compliance and may not be fully shipped yet.
        </p>
        <h2 className="font-display text-lg font-semibold pt-2">Disclaimer</h2>
        <p>
          The app is provided &quot;as is&quot; without warranties of uninterrupted
          availability or fitness for a particular purpose.
        </p>
        <h2 className="font-display text-lg font-semibold pt-2">Changes</h2>
        <p>
          We may update these terms. Continued use after changes constitutes
          acceptance. The Play Store listing will link to the current Privacy
          Policy and Terms.
        </p>
      </div>

      <p className="mt-10 flex gap-4 text-sm text-muted">
        <Link to="/" className="hover:text-fg">
          ← Back
        </Link>
        <Link to="/privacy" className="hover:text-fg">
          Privacy
        </Link>
      </p>
    </main>
  );
}
