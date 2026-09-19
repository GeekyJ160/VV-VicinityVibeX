/** Grok broker OAuth only works on Grok preview/app hosts. Zo uses email. */
export function grokOAuthOnHost(hostname: string): boolean {
  const host = hostname.trim().toLowerCase();
  return host === "grok.com" || host.endsWith(".grok.com") || host.endsWith(".grok-sandbox.com");
}
