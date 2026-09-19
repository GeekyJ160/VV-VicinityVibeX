import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({ component: Privacy });

function Privacy() {
  return (
    <main className="mx-auto min-h-screen max-w-2xl px-6 py-10">
      <p className="font-display text-sm tracking-wide text-muted uppercase">
        Vicinity Vibe
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-muted">Last updated: September 5, 2026</p>

      <div className="mt-8 space-y-4 text-sm leading-relaxed text-fg/90">
        <p>
          Vicinity Vibe is a culture-first social matching app for adults (18+).
          This placeholder policy describes how information is handled in the
          current product (web and Android Capacitor wrapper). It is not legal
          advice and will be replaced with final counsel-reviewed copy before
          store launch.
        </p>
        <h2 className="font-display text-lg font-semibold pt-2">What the app does</h2>
        <p>
          You create a profile with neighborhood-level location (not GPS pins),
          cultural interests, and preferences. The app helps you discover people
          and communities nearby, match, and chat. User-generated content includes
          profile text and messages.
        </p>
        <h2 className="font-display text-lg font-semibold pt-2">Data we process</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Account:</strong> If you sign in, we store basic account
            identifiers (such as email) needed for authentication and your
            profile.
          </li>
          <li>
            <strong>Profile &amp; matching:</strong> Display name, bio, vibe
            preferences, neighborhood, visibility settings, and related matching
            signals you provide.
          </li>
          <li>
            <strong>Chat / UGC:</strong> Messages and other content you send to
            other users.
          </li>
          <li>
            <strong>Safety settings:</strong> Visibility mode and optional trusted
            contact text you enter.
          </li>
          <li>
            <strong>Diagnostics:</strong> Standard app/runtime logs may be
            collected to keep the service reliable.
          </li>
        </ul>
        <h2 className="font-display text-lg font-semibold pt-2">What we do not do (today)</h2>
        <ul className="list-disc space-y-2 pl-5">
          <li>We do not use continuous GPS tracking; location is neighborhood-level text you choose.</li>
          <li>We do not process payments in the current app.</li>
          <li>We do not sell your personal information.</li>
        </ul>
        <h2 className="font-display text-lg font-semibold pt-2">Age</h2>
        <p>
          Vicinity Vibe is intended for users 18 years of age and older.
        </p>
        <h2 className="font-display text-lg font-semibold pt-2">Contact</h2>
        <p>
          For privacy questions, contact the publisher listed on the Google Play
          listing for this app.
        </p>
      </div>

      <p className="mt-10 flex gap-4 text-sm text-muted">
        <Link to="/" className="hover:text-fg">
          ← Back
        </Link>
        <Link to="/terms" className="hover:text-fg">
          Terms
        </Link>
      </p>
    </main>
  );
}
