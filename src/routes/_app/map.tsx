import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Dices } from "lucide-react";
import { getNearby, spinRoulette } from "@/lib/aura-api";
import {
  HOOD_GEO,
  neighborhoodPoint,
  projectHood,
  type MapEvent,
  type MapPerson,
  type NearbyPost,
  type Profile,
  type RoulettePick,
} from "@/lib/aura";
import { Button } from "@/components/ui/button";
import { VibeOrb } from "@/components/vibe-orb";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/map")({ component: NearbyMap });

const CITY_MARKS = [
  { name: "Fort Worth", ...projectHood(32.755, -97.331) },
  { name: "Dallas", ...projectHood(32.777, -96.797) },
];

function NearbyMap() {
  const navigate = useNavigate();
  const [me, setMe] = useState<Profile | null>(null);
  const [people, setPeople] = useState<MapPerson[] | null>(null);
  const [events, setEvents] = useState<MapEvent[]>([]);
  const [posts, setPosts] = useState<NearbyPost[]>([]);
  const [selected, setSelected] = useState<MapPerson | MapEvent | null>(null);
  const [pick, setPick] = useState<RoulettePick | null>(null);
  const [spinning, setSpinning] = useState(false);

  useEffect(() => {
    void getNearby()
      .then((data) => {
        setMe(data.me);
        setPeople(data.people);
        setEvents(data.events);
        setPosts(data.posts);
      })
      .catch(() => setPeople([]));
  }, []);

  const you = useMemo(() => {
    if (!me) return null;
    return neighborhoodPoint(me.neighborhood, me.userId);
  }, [me]);

  const grouped = useMemo(() => {
    const fw: MapPerson[] = [];
    const dal: MapPerson[] = [];
    for (const person of people ?? []) {
      const city = HOOD_GEO[person.neighborhood]?.city ?? "Dallas";
      (city === "Fort Worth" ? fw : dal).push(person);
    }
    fw.sort((a, b) => b.compatibility - a.compatibility);
    dal.sort((a, b) => b.compatibility - a.compatibility);
    return { fw, dal };
  }, [people]);

  async function spin() {
    setSpinning(true);
    try {
      const next = await spinRoulette();
      setPick(next);
    } finally {
      setSpinning(false);
    }
  }

  return (
    <div className="flex flex-col">
      <header className="px-4 pt-4">
        <p className="text-xs uppercase tracking-[0.18em] text-muted">Nearby</p>
        <div className="mt-1 flex items-end justify-between gap-3">
          <h1 className="font-display text-3xl font-medium">The room, not the pin</h1>
          <Button size="sm" variant="outline" onClick={() => void spin()} disabled={spinning}>
            <Dices className="size-4" />
            {spinning ? "Listening" : "Bored"}
          </Button>
        </div>
        <p className="mt-2 max-w-sm text-sm text-muted">
          People sit in neighborhoods, never coordinates. If they can see you with
          their eyes, they can see you here.
        </p>
      </header>

      <div className="relative mx-4 mt-4 overflow-hidden rounded-xl border border-border bg-elevated">
        <img
          src="/map-dfw.jpg"
          alt=""
          className="absolute inset-0 size-full object-cover opacity-70"
        />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-bg/20 via-transparent to-bg/55" />
        <div className="relative h-[420px] w-full">
          {CITY_MARKS.map((city) => (
            <span
              key={city.name}
              className="pointer-events-none absolute -translate-x-1/2 font-display text-lg tracking-tight text-fg/35"
              style={{ left: `${city.x}%`, top: `${city.y}%` }}
            >
              {city.name}
            </span>
          ))}
          {events.map((event) => (
            <button
              key={event.id}
              type="button"
              className="absolute z-10 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-fg/80 shadow-[0_0_0_6px_rgb(243_239_232/0.08)]"
              style={{ left: `${event.x}%`, top: `${event.y}%` }}
              aria-label={event.title}
              onClick={() => setSelected(event)}
            />
          ))}
          {people?.map((person) => (
            <button
              key={person.userId}
              type="button"
              className="absolute z-20 size-11 -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${person.x}%`, top: `${person.y}%` }}
              onClick={() => setSelected(person)}
              aria-label={`${person.displayName}, ${person.neighborhood}`}
            >
              {person.photos[0] ? (
                <img
                  src={person.photos[0]}
                  alt=""
                  crossOrigin="anonymous"
                  className="size-9 rounded-full object-cover outline outline-1 -outline-offset-1 outline-fg/20"
                />
              ) : (
                <VibeOrb
                  primary={person.primary}
                  secondary={person.secondary}
                  saturation={person.saturation}
                  brightness={person.brightness}
                  size="sm"
                />
              )}
            </button>
          ))}
          {you ? (
            <span
              className="absolute z-30 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent bg-accent px-2 py-0.5 text-[10px] font-medium text-accent-fg"
              style={{ left: `${you.x}%`, top: `${Math.min(92, you.y + 7)}%` }}
            >
              You
            </span>
          ) : null}
          {people === null ? (
            <div className="absolute inset-0 animate-pulse bg-elevated" />
          ) : null}
        </div>
        <p className="relative border-t border-border bg-bg/70 px-3 py-2 text-[11px] text-subtle">
          Fort Worth west · Dallas east. Neighborhoods only. Never a pin.
        </p>
      </div>

      {selected && "userId" in selected ? (
        <div className="mx-4 mt-4 rounded-xl border border-border bg-surface px-4 py-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-subtle">{selected.neighborhood}</p>
              <h2 className="mt-1 font-display text-2xl">{selected.displayName}</h2>
              <p className="mt-1 text-sm text-muted">{selected.voiceIntro}</p>
            </div>
            <p className="font-display text-2xl tabular-nums">{selected.compatibility}</p>
          </div>
          <div className="mt-4 flex gap-2">
            <Button
              className="flex-1"
              onClick={() =>
                void navigate({ to: "/people/$userId", params: { userId: selected.userId } })
              }
            >
              Open profile
            </Button>
            <Button variant="ghost" onClick={() => setSelected(null)}>
              Close
            </Button>
          </div>
        </div>
      ) : selected ? (
        <div className="mx-4 mt-4 rounded-xl border border-border bg-surface px-4 py-4">
          <p className="text-xs uppercase tracking-[0.14em] text-subtle">{selected.universeName}</p>
          <h2 className="mt-1 font-display text-2xl">{selected.title}</h2>
          <p className="mt-1 text-sm text-muted">
            {selected.location} · {new Date(selected.startsAt).toLocaleString(undefined, {
              weekday: "short",
              month: "short",
              day: "numeric",
              hour: "numeric",
            })}
          </p>
          <p className="mt-2 text-sm text-fg/90">{selected.description}</p>
          <div className="mt-4 flex gap-2">
            <Button
              className="flex-1"
              onClick={() =>
                void navigate({
                  to: "/universes/$universeId",
                  params: { universeId: selected.universeId },
                })
              }
            >
              Open room
            </Button>
            <Button variant="ghost" onClick={() => setSelected(null)}>
              Close
            </Button>
          </div>
        </div>
      ) : null}

      {pick ? <RouletteCard pick={pick} onDismiss={() => setPick(null)} /> : null}

      <section className="px-4 pt-6">
        <CityList
          title="Fort Worth"
          people={grouped.fw}
          onOpen={(person) => setSelected(person)}
        />
        <CityList
          title="Dallas"
          people={grouped.dal}
          onOpen={(person) => setSelected(person)}
        />
      </section>

      <section className="px-4 pt-2 pb-8">
        <h2 className="text-xs uppercase tracking-[0.16em] text-subtle">Live nearby</h2>
        <ul className="mt-3 flex flex-col">
          {posts.map((post) => (
            <li key={post.id} className="border-t border-border py-3">
              <div className="flex items-baseline justify-between gap-3">
                <Link
                  to="/people/$userId"
                  params={{ userId: post.userId }}
                  className="text-sm font-medium"
                >
                  {post.displayName}
                </Link>
                <span className="text-xs text-subtle">
                  {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                </span>
              </div>
              <p className="mt-1 text-xs uppercase tracking-[0.12em] text-subtle">
                {post.universeName}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-fg/90">{post.body}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function CityList({
  title,
  people,
  onOpen,
}: {
  title: string;
  people: MapPerson[];
  onOpen: (person: MapPerson) => void;
}) {
  if (people.length === 0) return null;
  return (
    <div className="mb-6">
      <h2 className="text-xs uppercase tracking-[0.16em] text-subtle">{title}</h2>
      <ul className="mt-2 flex flex-col">
        {people.map((person) => (
          <li key={person.userId} className="border-t border-border">
            <button
              type="button"
              className="flex w-full items-center gap-3 py-3 text-left"
              onClick={() => onOpen(person)}
            >
              {person.photos[0] ? (
                <img
                  src={person.photos[0]}
                  alt=""
                  crossOrigin="anonymous"
                  className="size-11 rounded-full object-cover outline outline-1 -outline-offset-1 outline-fg/15"
                />
              ) : (
                <VibeOrb
                  primary={person.primary}
                  secondary={person.secondary}
                  saturation={person.saturation}
                  brightness={person.brightness}
                  size="sm"
                />
              )}
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">{person.displayName}</span>
                <span className="mt-0.5 block truncate text-xs text-muted">
                  {person.neighborhood}
                </span>
              </span>
              <span className="font-display text-lg tabular-nums text-fg/80">
                {person.compatibility}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RouletteCard({
  pick,
  onDismiss,
}: {
  pick: RoulettePick;
  onDismiss: () => void;
}) {
  return (
    <div className={cn("mx-4 mt-4 rounded-xl border border-border-strong bg-surface px-4 py-4")}>
      <p className="text-xs uppercase tracking-[0.16em] text-subtle">Boredom roulette</p>
      {pick.kind === "person" ? (
        <>
          <h2 className="mt-1 font-display text-2xl">{pick.person.displayName}</h2>
          <p className="mt-1 text-sm text-muted">{pick.person.voiceIntro}</p>
          <Button asChild className="mt-4">
            <Link to="/people/$userId" params={{ userId: pick.person.userId }}>
              Meet this frequency
            </Link>
          </Button>
        </>
      ) : pick.kind === "event" ? (
        <>
          <h2 className="mt-1 font-display text-2xl">{pick.event.title}</h2>
          <p className="mt-1 text-sm text-muted">
            {pick.event.location} · {pick.event.universeName}
          </p>
          <Button asChild className="mt-4">
            <Link to="/universes/$universeId" params={{ universeId: pick.event.universeId }}>
              Open the night
            </Link>
          </Button>
        </>
      ) : (
        <>
          <h2 className="mt-1 font-display text-2xl">{pick.post.displayName}</h2>
          <p className="mt-1 text-sm text-muted">{pick.post.body}</p>
          <Button asChild className="mt-4">
            <Link to="/universes/$universeId" params={{ universeId: pick.post.universeId }}>
              Join the board
            </Link>
          </Button>
        </>
      )}
      <button
        type="button"
        className="mt-3 text-sm text-muted underline-offset-4 hover:underline"
        onClick={onDismiss}
      >
        Another time
      </button>
    </div>
  );
}
