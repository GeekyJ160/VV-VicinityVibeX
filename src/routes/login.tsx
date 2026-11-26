import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { GROK_PROVIDERS, authClient, authEnabled, signIn } from "@/lib/auth/client";
import { grokOAuthOnHost } from "@/lib/auth/oauth-availability";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/login")({ component: Login });

type AuthMode = "sign-in" | "sign-up";

function errorMessage(error: unknown): string {
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String((error as { code?: string }).code)
      : "";
  const message =
    typeof error === "object" && error !== null && "message" in error
      ? String((error as { message?: string }).message)
      : "";

  if (code === "PASSWORD_TOO_SHORT") return "Use at least 8 characters for your password.";
  if (code === "PASSWORD_TOO_LONG") return "Use a password with 128 characters or fewer.";
  if (code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL") {
    return "That email is already in use. Try signing in instead.";
  }
  if (code === "INVALID_EMAIL") return "Enter a valid email address.";
  if (code === "INVALID_EMAIL_OR_PASSWORD") return "That email or password is not correct.";
  if (code === "EMAIL_PASSWORD_DISABLED") return "Email sign-in is not available right now.";
  return message || "Something went wrong. Please try again.";
}

function Login() {
  const navigate = useNavigate();
  const { user, isPending: sessionPending } = useCurrentUserState();
  const [mode, setMode] = useState<AuthMode>("sign-in");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showOAuth, setShowOAuth] = useState(false);

  useEffect(() => {
    setShowOAuth(grokOAuthOnHost(window.location.hostname));
  }, []);

  useEffect(() => {
    if (!sessionPending && user) void navigate({ to: "/" });
  }, [navigate, sessionPending, user]);

  if (sessionPending || user) {
    return (
      <div className="mx-auto flex min-h-dvh max-w-lg items-center justify-center px-6">
        <div className="size-10 animate-pulse rounded-full bg-elevated" />
      </div>
    );
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (mode === "sign-up" && !name.trim()) {
      setError("Tell us your name to create an account.");
      return;
    }
    if (mode === "sign-up" && password.length < 8) {
      setError("Use at least 8 characters for your password.");
      return;
    }

    setPending(true);
    try {
      const result =
        mode === "sign-up"
          ? await authClient.signUp.email({
              name: name.trim(),
              email: email.trim(),
              password,
            })
          : await authClient.signIn.email({ email: email.trim(), password });
      if (result.error) {
        setError(errorMessage(result.error));
        return;
      }
      window.location.assign("/");
    } catch (caught) {
      setError(errorMessage(caught));
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-6">
      <p className="text-xs uppercase tracking-[0.22em] text-muted">Vicinity Vibe</p>
      <h1 className="mt-3 font-display text-4xl font-medium">
        {mode === "sign-up" ? "Create your account" : "Sign in"}
      </h1>
      <p className="mt-2 max-w-sm text-sm text-muted">
        {mode === "sign-up"
          ? "A little context helps the right people find you."
          : "Same people. Same frequency. Pick up where you left off."}
      </p>
      {authEnabled ? (
        <>
          <form className="mt-8 flex flex-col gap-4" onSubmit={(event) => void submit(event)}>
            {mode === "sign-up" ? (
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  autoComplete="name"
                  placeholder="What should we call you?"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  disabled={pending}
                  required
                />
              </div>
            ) : null}
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                disabled={pending}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete={mode === "sign-up" ? "new-password" : "current-password"}
                placeholder="At least 8 characters"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={pending}
                required
              />
            </div>
            {error ? (
              <p
                className="rounded-md border border-danger/40 bg-danger/10 px-3 py-2 text-sm text-danger"
                role="alert"
              >
                {error}
              </p>
            ) : null}
            <Button type="submit" size="lg" className="w-full" disabled={pending}>
              {pending ? "One moment…" : mode === "sign-up" ? "Create account" : "Sign in"}
            </Button>
          </form>
          <button
            type="button"
            className="mt-4 text-center text-sm text-muted underline-offset-4 hover:text-fg hover:underline"
            onClick={() => {
              setMode(mode === "sign-up" ? "sign-in" : "sign-up");
              setError(null);
            }}
          >
            {mode === "sign-up" ? "Already have an account? Sign in" : "New here? Create an account"}
          </button>
          {showOAuth ? (
            <div className="mt-8 flex flex-col gap-3 border-t border-border pt-6">
              {GROK_PROVIDERS.map((provider) => (
                <Button
                  key={provider.providerId}
                  type="button"
                  size="lg"
                  variant="outline"
                  className="w-full"
                  onClick={() => void signIn(provider.providerId, { callbackURL: "/" })}
                  disabled={pending}
                >
                  Continue with {provider.label}
                </Button>
              ))}
            </div>
          ) : null}
        </>
      ) : (
        <p className="mt-8 text-sm text-muted">Sign-in is disabled.</p>
      )}
      <Link to="/" className="mt-8 text-sm text-muted underline-offset-4 hover:text-fg hover:underline">
        Back
      </Link>
    </main>
  );
}
