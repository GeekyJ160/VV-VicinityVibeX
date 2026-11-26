import { test } from "node:test";
import assert from "node:assert/strict";
import {
  MAX_MESSAGE_LENGTH,
  latestCursor,
  mergeMessages,
  validateMessageText,
} from "./live-chat.ts";

test("validateMessageText trims and rejects empty, non-string, and too-long text", () => {
  assert.deepEqual(validateMessageText("  hi  "), { ok: true, text: "hi" });
  assert.equal(validateMessageText("   ").ok, false);
  assert.equal(validateMessageText(42).ok, false);
  assert.equal(validateMessageText("a".repeat(MAX_MESSAGE_LENGTH)).ok, true);
  assert.equal(validateMessageText("a".repeat(MAX_MESSAGE_LENGTH + 1)).ok, false);
});

test("mergeMessages dedupes by id and keeps time order", () => {
  const a = { id: "a", createdAt: "2026-01-01T00:00:01.000Z", text: "old" };
  const b = { id: "b", createdAt: "2026-01-01T00:00:02.000Z", text: "b" };
  const a2 = { ...a, text: "new" };
  const merged = mergeMessages([b, a], [a2]);
  assert.deepEqual(
    merged.map((m) => m.id),
    ["a", "b"],
  );
  assert.equal(merged[0].text, "new");
  assert.equal(mergeMessages(merged, []), merged);
});

test("latestCursor ignores pending messages", () => {
  const list = [
    { id: "a", createdAt: "2026-01-01T00:00:01.000Z", pending: false },
    { id: "tmp", createdAt: "2026-01-01T00:00:09.000Z", pending: true },
  ];
  assert.equal(
    latestCursor(list, (m) => m.pending),
    "2026-01-01T00:00:01.000Z",
  );
  assert.equal(latestCursor([]), null);
});
