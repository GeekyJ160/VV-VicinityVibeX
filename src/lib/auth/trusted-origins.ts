/**
 * Parse a comma-separated list of extra trusted origins (e.g. the exact Zo
 * host this app is served from). Each entry must be a full http(s) origin;
 * anything else, including wildcards, is ignored. Empty/unset → none.
 */
export function parseTrustedOrigins(raw: string | undefined | null): string[] {
  if (!raw) return [];
  const out: string[] = [];
  for (const part of raw.split(",")) {
    const value = part.trim();
    if (!value || value.includes("*")) continue;
    try {
      const url = new URL(value);
      if (url.protocol !== "https:" && url.protocol !== "http:") continue;
      if (!out.includes(url.origin)) out.push(url.origin);
    } catch {
      // ignore malformed entries
    }
  }
  return out;
}
