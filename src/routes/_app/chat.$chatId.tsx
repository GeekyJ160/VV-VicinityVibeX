import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { getChat, reactToMessage, sendMessage, suggestOpeners, unmatch } from "@/lib/aura-api";
import { VIBE_REACTIONS, type ChatMessage, type DimensionKey, type Profile } from "@/lib/aura";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VibeOrb } from "@/components/vibe-orb";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/chat/$chatId")({ component: ChatPage });

function ChatPage() {
  const { chatId } = Route.useParams();
  const navigate = useNavigate();
  const me = useCurrentUser();
  const [other, setOther] = useState<Profile | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [compat, setCompat] = useState(0);
  const [shared, setShared] = useState<DimensionKey[]>([]);
  const [matchId, setMatchId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [openers, setOpeners] = useState<string[] | null>(null);
  const [asking, setAsking] = useState(false);
  const [missing, setMissing] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  async function reload() {
    const data = await getChat({ data: chatId });
    if (!data) {
      setMissing(true);
      return;
    }
    setOther(data.other);
    setMessages(data.messages);
    setCompat(data.compatibility);
    setShared(data.sharedDimensions);
    setMatchId(data.matchId);
  }

  useEffect(() => {
    void reload().catch(() => setMissing(true));
  }, [chatId]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  if (missing) {
    return (
      <div className="px-5 pt-16 text-center">
        <p className="font-display text-2xl">This thread closed</p>
        <Link to="/matches" className="mt-4 inline-block text-sm text-muted underline">
          Matches
        </Link>
      </div>
    );
  }

  if (!other) {
    return <div className="m-5 h-40 animate-pulse rounded-xl bg-elevated" />;
  }

  async function send(text: string) {
    const next = text.trim();
    if (!next) return;
    setDraft("");
    setOpeners(null);
    await sendMessage({ data: { chatId, text: next } });
    await reload();
  }

  return (
    <div className="flex min-h-[calc(100dvh-5rem)] flex-col">
      <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-border bg-bg/92 px-4 py-3 backdrop-blur-md">
        <Link to="/matches" className="text-xs text-muted">
          Back
        </Link>
        <Link
          to="/people/$userId"
          params={{ userId: other.userId }}
          className="flex min-w-0 flex-1 items-center gap-2"
        >
          {other.photos[0] ? (
            <img
              src={other.photos[0]}
              alt=""
              crossOrigin="anonymous"
              className="size-9 rounded-full object-cover outline outline-1 -outline-offset-1 outline-fg/15"
            />
          ) : (
            <VibeOrb
              primary={other.primary}
              secondary={other.secondary}
              saturation={other.saturation}
              brightness={other.brightness}
              size="sm"
            />
          )}
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{other.displayName}</p>
            <p className="text-xs tabular-nums text-subtle">{compat} freq</p>
          </div>
        </Link>
        {matchId ? (
          <button
            type="button"
            className="text-xs text-muted"
            onClick={async () => {
              await unmatch({ data: matchId });
              await navigate({ to: "/matches" });
            }}
          >
            Unmatch
          </button>
        ) : null}
      </header>

      <div className="flex-1 space-y-4 px-4 py-4">
        {messages.length === 0 ? (
          <div className="rounded-xl border border-border bg-surface px-4 py-5">
            <p className="font-display text-xl">Start specific</p>
            <p className="mt-2 text-sm text-muted">
              You overlap on {shared.length ? shared.join(", ") : "a quiet frequency"}.
              Ask Vicinity Vibe for a first line, or write your own.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              disabled={asking}
              onClick={async () => {
                setAsking(true);
                try {
                  const res = await suggestOpeners({ data: chatId });
                  setOpeners(res.openers);
                } finally {
                  setAsking(false);
                }
              }}
            >
              {asking ? "Listening…" : "Ask Vicinity Vibe"}
            </Button>
            {openers?.length ? (
              <ul className="mt-4 space-y-2">
                {openers.map((line) => (
                  <li key={line}>
                    <button
                      type="button"
                      className="w-full rounded-lg border border-border px-3 py-2 text-left text-sm text-fg/90"
                      onClick={() => void send(line)}
                    >
                      {line}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        ) : null}

        {messages.map((msg) => {
          const mine = msg.userId === me?.id;
          return (
            <div key={msg.id} className={cn("flex flex-col", mine ? "items-end" : "items-start")}>
              <div
                className={cn(
                  "max-w-[82%] rounded-lg px-3.5 py-2 text-sm leading-relaxed",
                  mine ? "bg-accent text-accent-fg" : "bg-elevated text-fg",
                )}
              >
                {msg.text}
              </div>
              <div className="mt-1 flex flex-wrap gap-1">
                {VIBE_REACTIONS.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] uppercase tracking-wide",
                      msg.vibeReaction === r.id
                        ? "bg-elevated text-fg"
                        : "text-subtle hover:text-muted",
                    )}
                    onClick={() =>
                      void reactToMessage({
                        data: {
                          messageId: msg.id,
                          reaction: msg.vibeReaction === r.id ? null : r.id,
                        },
                      }).then(() => reload())
                    }
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      <form
        className="sticky bottom-20 flex gap-2 border-t border-border bg-bg px-4 py-3"
        onSubmit={(e) => {
          e.preventDefault();
          void send(draft);
        }}
      >
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Say something specific"
        />
        <Button type="submit" disabled={!draft.trim()}>
          Send
        </Button>
      </form>
    </div>
  );
}
