import type { ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Compass, Map, MessageCircle, Orbit, User } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/discover", label: "Discover", icon: Compass },
  { to: "/map", label: "Nearby", icon: Map },
  { to: "/universes", label: "Rooms", icon: Orbit },
  { to: "/matches", label: "Matches", icon: MessageCircle },
  { to: "/me", label: "Me", icon: User },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-lg flex-col bg-bg">
      <div className="flex-1 pb-20">{children}</div>
      <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-lg border-t border-border bg-bg/92 backdrop-blur-md">
        <ul className="grid grid-cols-5 px-1 pt-1 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
          {NAV.map((item) => {
            const active =
              pathname === item.to || pathname.startsWith(`${item.to}/`);
            const Icon = item.icon;
            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={cn(
                    "flex min-h-12 flex-col items-center justify-center gap-0.5 text-[11px] tracking-wide",
                    active ? "text-fg" : "text-subtle",
                  )}
                >
                  <Icon className="size-5" strokeWidth={active ? 1.9 : 1.6} />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
