import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { listUniverses } from "@/lib/aura-api";
import type { Universe } from "@/lib/aura";

export const Route = createFileRoute("/_app/universes/")({ component: Universes });

function Universes() {
  const [items, setItems] = useState<Universe[] | null>(null);

  useEffect(() => {
    void listUniverses()
      .then(setItems)
      .catch(() => setItems([]));
  }, []);

  return (
    <div className="px-5 pt-6">
      <p className="text-xs uppercase tracking-[0.18em] text-muted">Universes</p>
      <h1 className="mt-1 font-display text-3xl font-medium">Rooms you can keep</h1>
      <p className="mt-2 max-w-sm text-sm text-muted">
        Communities with their own posts and nights out. Join the ones that already
        feel like yours.
      </p>
      <ul className="mt-6 flex flex-col gap-3">
        {items === null
          ? [0, 1, 2, 3].map((i) => (
              <li key={i} className="h-28 animate-pulse rounded-xl bg-elevated" />
            ))
          : items.map((u) => (
              <li key={u.id}>
                <Link
                  to="/universes/$universeId"
                  params={{ universeId: u.id }}
                  className="block rounded-xl border border-border bg-surface px-4 py-4"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <h2 className="font-display text-xl">{u.name}</h2>
                    <span className="text-xs tabular-nums text-subtle">
                      {u.memberCount} in · {u.activeNearby} nearby
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{u.description}</p>
                  {u.joined ? (
                    <p className="mt-3 text-xs uppercase tracking-[0.14em] text-fg/70">
                      Joined
                    </p>
                  ) : null}
                </Link>
              </li>
            ))}
      </ul>
    </div>
  );
}
