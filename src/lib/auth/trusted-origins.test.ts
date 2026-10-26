import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseTrustedOrigins } from "./trusted-origins.ts";

describe("parseTrustedOrigins", () => {
  it("defaults to none", () => {
    assert.deepEqual(parseTrustedOrigins(undefined), []);
    assert.deepEqual(parseTrustedOrigins(""), []);
    assert.deepEqual(parseTrustedOrigins(" , "), []);
  });

  it("accepts exact origins from a comma list", () => {
    assert.deepEqual(
      parseTrustedOrigins("https://vicinity-vibe-pacsco.zocomputer.io, https://pacsco.zo.computer/"),
      ["https://vicinity-vibe-pacsco.zocomputer.io", "https://pacsco.zo.computer"],
    );
  });

  it("rejects wildcards, bare hosts, and non-http schemes", () => {
    assert.deepEqual(
      parseTrustedOrigins("https://*.zo.computer,*.zocomputer.io,pacsco.zo.computer,ftp://x.io"),
      [],
    );
  });
});
