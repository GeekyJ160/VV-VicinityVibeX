import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { createPost, getUniverse, rsvpEvent, toggleUniverse } from "@/lib/aura-api";
import type { Universe, UniverseEvent, UniversePost } from "@/lib/aura";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/_app/universes/$universeId")({
  component: UniversePage,
});

function UniversePage() {
  const { universeId } = Route.useParams();
  const [universe, setUniverse] = useState<Universe | null>(null);
  const [posts, setPosts] = useState<UniversePost[]>([]);
  const [events, setEvents] = useState<UniverseEvent[]>([]);
  const [draft, setDraft] = useState("");
  const [missing, setMissing] = useState(false);

  const reload = useCallback(async () => {
    const data = await getUniverse({ data: universeId });
    if (!data) {
      setMissing(true);
      return;
    }
    setUniverse(data.universe);
    setPosts(data.posts);
    setEvents(data.events);
  }, [universeId]);

  useEffect(() => {
    void reload().catch(() => setMissing(true));
  }, [reload]);

  if (missing) {
    return (
      <div className="px-5 pt-16 text-center">
        <p className="font-display text-2xl">This room closed</p>
        <Link to="/universes" className="mt-4 inline-block text-sm text-muted underline">
          All universes
        </Link>
      </div>
    );
  }

  if (!universe) {
    return <div className="m-5 h-48 animate-pulse rounded-xl bg-elevated" />;
  }

  return (
    <div className="px-5 pt-6 pb-8">
      <Link to="/universes" className="text-xs uppercase tracking-[0.16em] text-muted">
        Universes
      </Link>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-medium">{universe.name}</h1>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
            {universe.description}
          </p>
          <p className="mt-3 text-xs tabular-nums text-subtle">
            {universe.memberCount} members · {universe.activeNearby} nearby
          </p>
        </div>
        <Button
          variant={universe.joined ? "outline" : "primary"}
          size="sm"
          onClick={async () => {
            await toggleUniverse({ data: { universeId, join: !universe.joined } });
            await reload();
          }}
        >
          {universe.joined ? "Leave" : "Join"}
        </Button>
      </div>

      {events.length > 0 ? (
        <section className="mt-8">
          <h2 className="text-xs uppercase tracking-[0.16em] text-subtle">Upcoming</h2>
          <ul className="mt-3 flex flex-col gap-2">
            {events.map((event) => (
              <li key={event.id} className="rounded-lg border border-border bg-surface px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium">{event.title}</p>
                    <p className="mt-1 text-xs text-muted">
                      {event.location} ·{" "}
                      {new Date(event.startsAt).toLocaleString(undefined, {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </p>
                    <p className="mt-2 text-sm text-muted">{event.description}</p>
                    <p className="mt-2 text-xs tabular-nums text-subtle">
                      {event.goingCount} going
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant={event.going ? "outline" : "primary"}
                    onClick={async () => {
                      await rsvpEvent({ data: { eventId: event.id, going: !event.going } });
                      await reload();
                    }}
                  >
                    {event.going ? "In" : "I will be there"}
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-8">
        <h2 className="text-xs uppercase tracking-[0.16em] text-subtle">The board</h2>
        <form
          className="mt-3"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!draft.trim()) return;
            await createPost({ data: { universeId, body: draft } });
            setDraft("");
            await reload();
          }}
        >
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Leave something specific."
          />
          <Button type="submit" className="mt-2" disabled={!draft.trim()}>
            Post
          </Button>
        </form>
        <ul className="mt-5 flex flex-col gap-4">
          {posts.map((post) => (
            <li key={post.id} className="border-t border-border pt-4">
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
              <p className="mt-2 text-sm leading-relaxed text-fg/90">{post.body}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
