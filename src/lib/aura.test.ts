import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  MATCH_THRESHOLD,
  compatibilityScore,
  computeDna,
  emptyDimensions,
  sharedDimensions,
  universeName,
} from "./aura.ts";
import { SEED_PHOTOS } from "./seed-photos.ts";

describe("Vibe DNA", () => {
  it("boosts rooms and Friday answers into a ranked pair", () => {
    const dna = computeDna(["anime", "music-makers"], { friday: "a", loud: "a" });
    assert.equal(dna.primary, "fandom");
    assert.ok(dna.dimensions.fandom > dna.dimensions.cozy);
    assert.ok(dna.saturation > 0.28);
  });

  it("scores nearby overlap above the seed match threshold", () => {
    const a = emptyDimensions(70);
    const b = emptyDimensions(68);
    const score = compatibilityScore(a, b, 2, true);
    assert.ok(score >= MATCH_THRESHOLD);
    assert.deepEqual(sharedDimensions(a, b).length, 8);
  });

  it("keeps seed portraits mapped one-to-one", () => {
    assert.equal(Object.keys(SEED_PHOTOS).length, 12);
    assert.equal(SEED_PHOTOS["seed-ren"], "/people/ren.jpg");
    assert.equal(universeName("food-lab"), "Food Lab");
  });
});
