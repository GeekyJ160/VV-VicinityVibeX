export const MAX_MESSAGE_LENGTH = 1000;
export const POLL_INTERVAL_MS = 2500;

export type ChatLikeMessage = { id: string; createdAt: string };

export type MessageValidation = { ok: true; text: string } | { ok: false; error: string };

export function validateMessageText(raw: unknown): MessageValidation {
  if (typeof raw !== "string") return { ok: false, error: "Message must be text" };
  const text = raw.trim();
  if (!text) return { ok: false, error: "Message is empty" };
  if (text.length > MAX_MESSAGE_LENGTH) {
    return { ok: false, error: `Message is longer than ${MAX_MESSAGE_LENGTH} characters` };
  }
  return { ok: true, text };
}

/** Merge incoming messages into the current list: dedupe by id (incoming wins), sort by time. */
export function mergeMessages<T extends ChatLikeMessage>(current: T[], incoming: T[]): T[] {
  if (incoming.length === 0) return current;
  const byId = new Map<string, T>();
  for (const m of current) byId.set(m.id, m);
  for (const m of incoming) byId.set(m.id, m);
  return [...byId.values()].sort((a, b) =>
    a.createdAt === b.createdAt ? a.id.localeCompare(b.id) : a.createdAt < b.createdAt ? -1 : 1,
  );
}

/** Cursor for the next poll: newest server-confirmed createdAt (pending ones are skipped). */
export function latestCursor<T extends ChatLikeMessage>(
  messages: T[],
  isPending: (m: T) => boolean = () => false,
): string | null {
  let max: string | null = null;
  for (const m of messages) {
    if (isPending(m)) continue;
    if (max === null || m.createdAt > max) max = m.createdAt;
  }
  return max;
}
