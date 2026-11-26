import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";
import { grokOAuthOnHost } from "@/lib/auth/oauth-availability";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getMyProfile } from "@/lib/aura-api";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({ component: Landing });

function Landing() {
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const [showOAuth, setShowOAuth] = useState(false);

  useEffect(() => {
    setShowOAuth(grokOAuthOnHost(window.location.hostname));
  }, []);

  useEffect(() => {
    if (isPending || !user) return;
    let cancelled = false;
    void getMyProfile()
      .then((profile) => {
        if (cancelled) return;
        void navigate({ to: profile ? "/discover" : "/onboard" });
      })
      .catch(() => {
        if (!cancelled) void navigate({ to: "/onboard" });
      });
    return () => {
      cancelled = true;
    };
  }, [isPending, user, navigate]);

  return (
    <main className="relative mx-auto flex min-h-dvh max-w-lg flex-col overflow-hidden px-6 pb-10">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <span className="absolute top-[12%] left-[-10%] size-64 rounded-full bg-[hsl(18_40%_48%/0.22)] blur-3xl" />
        <span className="absolute top-[18%] right-[-16%] size-72 rounded-full bg-[hsl(208_28%_46%/0.2)] blur-3xl" />
      </div>

      <header className="relative pt-16">
        <p className="text-xs uppercase tracking-[0.22em] text-muted">Dallas–Fort Worth · nearby</p>
        <h1 className="mt-6 font-display text-6xl font-medium tracking-tight">Vicinity Vibe</h1>
        <p className="mt-3 max-w-[16ch] font-display text-2xl leading-snug text-fg/85">
          Match the frequency.
        </p>
        <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
          A culture-first way to find your people. Your Vibe DNA is a living color —
          built from the rooms you keep, the work you make, and how you want to be met.
          Visible only to people already near you. Never a pin. Never a trail.
        </p>
      </header>

      <div className="relative mt-auto flex flex-col gap-3 pt-16">
        {user ? (
          <p className="text-sm text-muted">Taking you in…</p>
        ) : authEnabled ? (
          <>
            <Button asChild size="lg" className="w-full">
              <Link to="/login">Continue with email</Link>
            </Button>
            {showOAuth
              ? GROK_PROVIDERS.map((p) => (
                  <Button
                    key={p.providerId}
                    size="lg"
                    variant="outline"
                    className="w-full"
                    onClick={() => void signIn(p.providerId, { callbackURL: "/" })}
                  >
                    Continue with {p.label}
                  </Button>
                ))
              : null}
            <Link
              to="/login"
              className="mt-1 text-center text-sm text-muted underline-offset-4 hover:text-fg hover:underline"
            >
              New here? Create an account
            </Link>
          </>
        ) : (
          <p className="text-sm text-muted">Sign-in is disabled.</p>
        )}
        <p className="pt-2 text-center text-xs leading-relaxed text-subtle">
          Location stays neighborhood-level. You choose who can find you. Ages 18+.
        </p>
        <p className="pt-3 text-center text-xs text-subtle">
          <Link to="/privacy" className="underline-offset-4 hover:underline">
            Privacy
          </Link>
          {" · "}
          <Link to="/terms" className="underline-offset-4 hover:underline">
            Terms
          </Link>
        </p>
      </div>
    </main>
  );
}
