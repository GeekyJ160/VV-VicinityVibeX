import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  getChat,
  getChatMessagesSince,
  reactToMessage,
  sendMessage,
  suggestOpeners,
  unmatch,
} from "@/lib/aura-api";
import {
  MAX_MESSAGE_LENGTH,
  POLL_INTERVAL_MS,
  latestCursor,
  mergeMessages,
  validateMessageText,
} from "@/lib/chat/live-chat";
import {
  DIMENSIONS,
  VIBE_REACTIONS,
  type ChatMessage,
  type DimensionKey,
  type Profile,
} from "@/lib/aura";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { VibeOrb } from "@/components/vibe-orb";
import { cn } from "@/lib/utils";

type LiveMessage = ChatMessage & { status?: "pending" | "failed" };

export const Route = createFileRoute("/_app/chat/$chatId")({ component: ChatPage });

function ChatPage() {
  const { chatId } = Route.useParams();
  const navigate = useNavigate();
  const me = useCurrentUser();
  const [other, setOther] = useState<Profile | null>(null);
  const [messages, setMessages] = useState<LiveMessage[]>([]);
  const [compat, setCompat] = useState(0);
  const [shared, setShared] = useState<DimensionKey[]>([]);
  const [matchId, setMatchId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [openers, setOpeners] = useState<string[] | null>(null);
  const [asking, setAsking] = useState(false);
  const [missing, setMissing] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<LiveMessage[]>([]);
  messagesRef.current = messages;

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

  // Near-real-time: short-poll for new messages with a since-cursor (works on serverless).
  useEffect(() => {
    if (!other || missing) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    async function poll() {
      if (cancelled) return;
      if (typeof document === "undefined" || document.visibilityState === "visible") {
        try {
          const since = latestCursor(messagesRef.current, (m) => Boolean(m.status));
          const res = await getChatMessagesSince({ data: { chatId, since } });
          if (cancelled) return;
          if (res.closed) {
            setMissing(true);
            return;
          }
          setMessages((cur) => mergeMessages(cur, res.messages));
        } catch {
          // transient network error: try again next tick
        }
      }
      timer = setTimeout(() => void poll(), POLL_INTERVAL_MS);
    }
    timer = setTimeout(() => void poll(), POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [chatId, other?.userId, missing]);

  const lastId = messages[messages.length - 1]?.id;
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, lastId]);

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

  async function send(text: string, retryId?: string) {
    const v = validateMessageText(text);
    if (!v.ok) {
      setSendError(v.error);
      return;
    }
    setSendError(null);
    setDraft("");
    setOpeners(null);
    const tempId = retryId ?? `tmp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const optimistic: LiveMessage = {
      id: tempId,
      chatId,
      userId: me?.id ?? "",
      text: v.text,
      vibeReaction: null,
      createdAt: new Date().toISOString(),
      status: "pending",
    };
    setMessages((cur) => [...cur.filter((m) => m.id !== tempId), optimistic]);
    try {
      const saved = await sendMessage({ data: { chatId, text: v.text } });
      if (!saved) {
        setMessages((cur) => cur.filter((m) => m.id !== tempId));
        setMissing(true);
        return;
      }
      setMessages((cur) =>
        mergeMessages(
          cur.filter((m) => m.id !== tempId),
          [saved],
        ),
      );
    } catch {
      setMessages((cur) =>
        cur.map((m) => (m.id === tempId ? { ...m, status: "failed" as const } : m)),
      );
      setSendError("Message didn't send. Tap it to retry.");
    }
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
              You overlap on{" "}
              {shared.length
                ? shared.map((key) => DIMENSIONS[key].label).join(", ")
                : "a quiet frequency"}
              . Ask Vicinity Vibe for a first line, or write your own.
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
                  "max-w-[82%] whitespace-pre-wrap break-words rounded-lg px-3.5 py-2 text-sm leading-relaxed",
                  mine ? "bg-accent text-accent-fg" : "bg-elevated text-fg",
                  msg.status === "pending" && "opacity-60",
                  msg.status === "failed" &&
                    "cursor-pointer opacity-60 outline outline-1 outline-red-500",
                )}
                onClick={msg.status === "failed" ? () => void send(msg.text, msg.id) : undefined}
              >
                {msg.text}
              </div>
              {msg.status ? (
                <p className="mt-1 text-[10px] uppercase tracking-wide text-subtle">
                  {msg.status === "pending" ? "Sending…" : "Not sent · tap to retry"}
                </p>
              ) : (
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
              )}
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
          maxLength={MAX_MESSAGE_LENGTH}
          aria-label="Message"
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Say something specific"
        />
        <Button type="submit" disabled={!draft.trim()}>
          Send
        </Button>
      </form>
      {sendError ? (
        <p role="alert" className="sticky bottom-16 bg-bg px-4 pb-2 text-xs text-red-500">
          {sendError}
        </p>
      ) : null}
    </div>
  );
}
