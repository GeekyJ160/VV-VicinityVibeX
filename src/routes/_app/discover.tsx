import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type PointerEvent } from "react";
import { X } from "lucide-react";
import { getDiscover, getMyProfile, swipe } from "@/lib/aura-api";
import type { DiscoverCard, Profile } from "@/lib/aura";
import { Button } from "@/components/ui/button";
import { ProfileView } from "@/components/profile-view";
import { VibeOrb } from "@/components/vibe-orb";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/discover")({ component: Discover });

function Discover() {
  const navigate = useNavigate();
  const [deck, setDeck] = useState<DiscoverCard[] | null>(null);
  const [busy, setBusy] = useState(false);
  const [fly, setFly] = useState<"left" | "right" | null>(null);
  const [match, setMatch] = useState<{
    other: Profile;
    chatId: string;
    compatibility: number;
  } | null>(null);
  const [drag, setDrag] = useState({ x: 0, active: false });
  const [ghost, setGhost] = useState(false);

  useEffect(() => {
    void getDiscover()
      .then(setDeck)
      .catch(() => setDeck([]));
    void getMyProfile().then((p) => setGhost(p?.visibility === "ghost"));
  }, []);

  const current = deck?.[0];

  async function act(action: "pass" | "spark") {
    if (!current || busy) return;
    setBusy(true);
    setFly(action === "spark" ? "right" : "left");
    try {
      const result = await swipe({ data: { toUserId: current.userId, action } });
      window.setTimeout(() => {
        setDeck((d) => (d ? d.slice(1) : d));
        setFly(null);
        setDrag({ x: 0, active: false });
        setBusy(false);
        if (result.matched) {
          setMatch({
            other: result.other,
            chatId: result.chatId,
            compatibility: result.compatibility,
          });
        }
      }, 220);
    } catch {
      setFly(null);
      setBusy(false);
    }
  }

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    setDrag({ x: 0, active: true });
  }
  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!drag.active) return;
    setDrag((d) => ({ ...d, x: d.x + e.movementX }));
  }
  function onPointerUp() {
    if (!drag.active) return;
    if (drag.x > 88) void act("spark");
    else if (drag.x < -88) void act("pass");
    else setDrag({ x: 0, active: false });
  }

  if (deck === null) {
    return <div className="min-h-[70dvh] animate-pulse bg-elevated" />;
  }

  if (!current) {
    return (
      <div className="flex min-h-[70dvh] flex-col items-center justify-center px-8 text-center">
        <p className="font-display text-3xl">The room is quiet</p>
        <p className="mt-3 max-w-xs text-sm text-muted">
          You have seen everyone nearby who is open right now. Check your matches
          or sit in a universe.
        </p>
        <Button className="mt-6" onClick={() => void navigate({ to: "/universes" })}>
          Open rooms
        </Button>
      </div>
    );
  }

  const shift = fly === "left" ? -140 : fly === "right" ? 140 : drag.x;

  return (
    <div className="px-4 pt-4">
      <header className="mb-3 flex items-end justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted">Discover</p>
          <h1 className="font-display text-2xl font-medium">Nearby frequencies</h1>
        </div>
        <p className="text-xs tabular-nums text-subtle">{deck.length} open</p>
      </header>

      {ghost ? (
        <p className="mb-3 rounded-lg border border-border bg-elevated px-3 py-2 text-sm text-muted">
          Ghost is on. You can still look, but nearby people cannot find you.
        </p>
      ) : null}

      <div
        className={cn(
          "touch-pan-y",
          fly && "pointer-events-none transition-transform duration-200 ease-out",
        )}
        style={{
          transform: `translateX(${shift}px) rotate(${shift / 28}deg)`,
          opacity: fly ? 0 : 1,
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <ProfileView person={current} />
      </div>

      <div className="sticky bottom-20 z-10 mt-4 flex items-center justify-center gap-3 pb-2">
        <Button
          variant="outline"
          size="icon"
          aria-label="Pass"
          disabled={busy}
          onClick={() => void act("pass")}
        >
          <X className="size-5" />
        </Button>
        <Button
          size="lg"
          className="min-w-36"
          disabled={busy}
          onClick={() => void act("spark")}
        >
          Spark
        </Button>
        <Button variant="ghost" disabled={busy} onClick={() => void navigate({ to: "/map" })}>
          Map
        </Button>
      </div>

      {match ? (
        <div className="fixed inset-0 z-40 grid place-items-center bg-bg/80 px-6 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-xl border border-border bg-surface p-6 text-center shadow-soft">
            <div className="mb-4 flex justify-center">
              <VibeOrb
                primary={match.other.primary}
                secondary={match.other.secondary}
                saturation={match.other.saturation}
                brightness={match.other.brightness}
                size="lg"
              />
            </div>
            <p className="text-xs uppercase tracking-[0.18em] text-muted">Same frequency</p>
            <h2 className="mt-2 font-display text-3xl">{match.other.displayName}</h2>
            <p className="mt-2 text-sm text-muted">
              {match.compatibility} — you both sparked.
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <Button onClick={() => void navigate({ to: "/chat/$chatId", params: { chatId: match.chatId } })}>
                Open chat
              </Button>
              <Button variant="ghost" onClick={() => setMatch(null)}>
                Keep looking
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
