import { Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { getMyProfile } from "@/lib/aura-api";
import { AppShell } from "@/components/app-shell";

export const Route = createFileRoute("/_app")({ component: AppLayout });

function AppLayout() {
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const [gate, setGate] = useState<"load" | "ok" | "onboard">("load");

  useEffect(() => {
    if (isPending) return;
    if (!user) {
      setGate("load");
      return;
    }
    let cancelled = false;
    void getMyProfile()
      .then((profile) => {
        if (cancelled) return;
        if (!profile) {
          setGate("onboard");
          void navigate({ to: "/onboard" });
          return;
        }
        setGate("ok");
      })
      .catch(() => {
        if (!cancelled) {
          setGate("onboard");
          void navigate({ to: "/onboard" });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [isPending, user, navigate]);

  if (isPending || (user && gate === "load")) {
    return (
      <div className="mx-auto flex min-h-dvh max-w-lg items-center justify-center bg-bg">
        <div className="size-10 animate-pulse rounded-full bg-elevated" />
      </div>
    );
  }
  if (!user) return <RedirectToSignIn />;
  if (gate !== "ok") return <div className="min-h-dvh bg-bg" />;

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
