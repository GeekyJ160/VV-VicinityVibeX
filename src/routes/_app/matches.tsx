import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { getMatches } from "@/lib/aura-api";
import type { MatchRow } from "@/lib/aura";
import { VibeOrb } from "@/components/vibe-orb";

export const Route = createFileRoute("/_app/matches")({ component: Matches });

function Matches() {
  const [rows, setRows] = useState<MatchRow[] | null>(null);

  useEffect(() => {
    void getMatches()
      .then(setRows)
      .catch(() => setRows([]));
  }, []);

  return (
    <div className="px-5 pt-6">
      <p className="text-xs uppercase tracking-[0.18em] text-muted">Matches</p>
      <h1 className="mt-1 font-display text-3xl font-medium">Same frequency</h1>

      {rows === null ? (
        <div className="mt-6 space-y-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-xl bg-elevated" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <p className="mt-10 max-w-xs text-sm text-muted">
          When someone sparks you back, they land here. Start in Discover.
        </p>
      ) : (
        <ul className="mt-6 flex flex-col">
          {rows.map((row) => (
            <li key={row.id} className="border-t border-border">
              <Link
                to="/chat/$chatId"
                params={{ chatId: row.chatId }}
                className="flex items-center gap-3 py-4"
              >
                {row.other.photos[0] ? (
                  <img
                    src={row.other.photos[0]}
                    alt=""
                    crossOrigin="anonymous"
                    className="size-14 rounded-full object-cover outline outline-1 -outline-offset-1 outline-fg/15"
                  />
                ) : (
                  <VibeOrb
                    primary={row.other.primary}
                    secondary={row.other.secondary}
                    saturation={row.other.saturation}
                    brightness={row.other.brightness}
                    size="sm"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="truncate font-medium">{row.other.displayName}</p>
                    <span className="shrink-0 text-xs tabular-nums text-subtle">
                      {row.compatibility}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-sm text-muted">
                    {row.lastMessage ?? "You are on the same frequency. Say something specific."}
                  </p>
                  {row.lastAt ? (
                    <p className="mt-1 text-xs text-subtle">
                      {formatDistanceToNow(new Date(row.lastAt), { addSuffix: true })}
                    </p>
                  ) : null}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
