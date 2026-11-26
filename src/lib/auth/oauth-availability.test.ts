import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { grokOAuthOnHost } from "./oauth-availability.ts";

describe("grokOAuthOnHost", () => {
  it("is on for Grok preview and app hosts", () => {
    assert.equal(grokOAuthOnHost("abc.grok-sandbox.com"), true);
    assert.equal(grokOAuthOnHost("grok.com"), true);
    assert.equal(grokOAuthOnHost("app.grok.com"), true);
  });

  it("is off for Zo and local hosts", () => {
    assert.equal(grokOAuthOnHost("localhost"), false);
    assert.equal(grokOAuthOnHost("127.0.0.1"), false);
    assert.equal(grokOAuthOnHost("vicinity-vibe-pacsco.zocomputer.io"), false);
    assert.equal(grokOAuthOnHost("pacsco.zo.computer"), false);
  });
});
