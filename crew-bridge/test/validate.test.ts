import test from "node:test";
import assert from "node:assert/strict";
import { validateState, parseStateBytes, MAX_STATE_BYTES } from "../src/validate.js";
import { checkSbg } from "../src/sbg.js";

const good = () => ({
  version: 1,
  at: 1790000000,
  burnout: { score: 66, level: "recovery" },
  target: { presetId: "burnout-reset", beatHz: 10, carrierHz: 200, gain: 0.5, transitionSec: 60, breathe: true },
  sbg: null,
});

test("accepts the documented shape unchanged", () => {
  const r = validateState(good());
  assert.ok(r.ok);
  assert.deepEqual(r.state, good());
  assert.deepEqual(r.warnings, []);
});

test("clamps out-of-range numbers and warns", () => {
  const s = good();
  s.target = { ...s.target, beatHz: 400, carrierHz: 5, gain: 3, transitionSec: 1 };
  s.burnout.score = 250;
  const r = validateState(s);
  assert.ok(r.ok);
  assert.equal(r.state.target.beatHz, 40);
  assert.equal(r.state.target.carrierHz, 20);
  assert.equal(r.state.target.gain, 0.85);
  assert.equal(r.state.target.transitionSec, 30);
  assert.equal(r.state.burnout.score, 100);
  assert.ok(r.warnings.length >= 5);
});

test("clamps lower bounds for beat, gain and transition", () => {
  const s = good();
  s.target = { ...s.target, beatHz: -1, carrierHz: 99999, gain: -2, transitionSec: 99999 };
  const r = validateState(s);
  assert.ok(r.ok);
  assert.equal(r.state.target.beatHz, 0.5);
  assert.equal(r.state.target.carrierHz, 1500);
  assert.equal(r.state.target.gain, 0);
  assert.equal(r.state.target.transitionSec, 600);
});

test("rejects unknown or missing version", () => {
  for (const v of [2, 0, "1", null, undefined, 1.5]) {
    assert.equal(validateState({ ...good(), version: v }).ok, false);
  }
  const { version: _v, ...rest } = good();
  assert.equal(validateState(rest).ok, false);
});

test("rejects non-finite and wrong typed numbers", () => {
  for (const bad of [NaN, Infinity, -Infinity, "10", null, {}, [], true]) {
    const s = good();
    (s.target as Record<string, unknown>).beatHz = bad;
    assert.equal(validateState(s).ok, false, `beatHz=${String(bad)}`);
  }
  const s = good();
  (s as Record<string, unknown>).at = NaN;
  assert.equal(validateState(s).ok, false);
  const t = good();
  t.burnout.score = NaN;
  assert.equal(validateState(t).ok, false);
});

test("rejects bad structure and level", () => {
  for (const raw of [null, undefined, 5, "x", [], [good()]]) assert.equal(validateState(raw).ok, false);
  assert.equal(validateState({ ...good(), burnout: null }).ok, false);
  assert.equal(validateState({ ...good(), target: [] }).ok, false);
  assert.equal(validateState({ ...good(), burnout: { score: 1, level: "chill" } }).ok, false);
  assert.equal(validateState({ ...good(), at: -1 }).ok, false);
  assert.equal(validateState({ ...good(), at: 1.5 }).ok, false);
  assert.equal(validateState({ ...good(), at: 2 ** 60 }).ok, false);
});

test("ignores prototype pollution keys and unknown fields", () => {
  const text = `{"version":1,"at":1,"__proto__":{"polluted":true},"constructor":{"prototype":{"x":1}},
    "burnout":{"score":5,"level":"focus","__proto__":{"y":1}},
    "target":{"beatHz":10,"carrierHz":200,"gain":0.5,"transitionSec":60,"breathe":false,"__proto__":{"z":1},"evil":1},
    "sbg":null,"extra":"x"}`;
  const r = parseStateBytes(Buffer.from(text));
  assert.ok(r.ok);
  const out = JSON.stringify(r.state);
  assert.ok(!out.includes("polluted") && !out.includes("evil") && !out.includes("extra") && !out.includes("__proto__"));
  assert.equal(({} as Record<string, unknown>)["polluted"], undefined);
  assert.equal(Object.getPrototypeOf(r.state), Object.prototype);
});

test("inherited properties are not read", () => {
  const proto = { version: 1, at: 1, burnout: { score: 1, level: "focus" } };
  assert.equal(validateState(Object.create(proto) as object).ok, false);
});

test("presetId must be a short slug, otherwise dropped", () => {
  for (const id of ["../../etc", "A B", "x".repeat(33), 5, "<script>"]) {
    const s = good();
    (s.target as Record<string, unknown>).presetId = id;
    const r = validateState(s);
    assert.ok(r.ok);
    assert.equal("presetId" in r.state.target, false);
    assert.ok(r.warnings.some((w) => w.includes("presetId")));
  }
});

test("defaults missing gain and transitionSec with warnings", () => {
  const s = good();
  delete (s.target as Record<string, unknown>).gain;
  delete (s.target as Record<string, unknown>).transitionSec;
  const r = validateState(s);
  assert.ok(r.ok);
  assert.equal(r.state.target.gain, 0.5);
  assert.equal(r.state.target.transitionSec, 60);
  assert.equal(r.warnings.length, 2);
});

test("sbg: valid kept; oversize, too many events, control chars dropped with warning", () => {
  const ok = "## t\nalpha: 200@10\n00:00:00 alpha\n00:05:00 alpha ->\n";
  let r = validateState({ ...good(), sbg: ok });
  assert.ok(r.ok);
  assert.equal(r.state.sbg, ok);

  r = validateState({ ...good(), sbg: "x".repeat(4097) });
  assert.ok(r.ok);
  assert.equal(r.state.sbg, null);
  assert.ok(r.warnings.some((w) => w.includes("sbg")));

  const many = Array.from({ length: 21 }, (_, i) => `00:00:${String(i).padStart(2, "0")} a`).join("\n");
  r = validateState({ ...good(), sbg: many });
  assert.ok(r.ok);
  assert.equal(r.state.sbg, null);

  r = validateState({ ...good(), sbg: "a\u0000b" });
  assert.ok(r.ok);
  assert.equal(r.state.sbg, null);

  assert.equal(validateState({ ...good(), sbg: 5 }).ok, false);
});

test("checkSbg counts only timed lines and caps line length", () => {
  const c = checkSbg("# 00:00:00 comment\nname: 200@10\n00:00:00 name\n\n  00:01:00 name");
  assert.deepEqual(c, { ok: true, events: 2 });
  assert.equal(checkSbg("a".repeat(513)).ok, false);
  const twenty = Array.from({ length: 20 }, () => "00:00:00 a").join("\n");
  assert.equal(checkSbg(twenty).ok, true);
});

test("size cap and malformed JSON are rejected", () => {
  assert.equal(parseStateBytes(Buffer.alloc(MAX_STATE_BYTES + 1, 0x20)).ok, false);
  assert.equal(parseStateBytes(Buffer.from("{nope")).ok, false);
  assert.equal(parseStateBytes(Buffer.from("")).ok, false);
  assert.equal(parseStateBytes(Buffer.from([0xff, 0xfe, 0x00])).ok, false);
});

test("deeply nested JSON does not crash", () => {
  const deep = "[".repeat(30000) + "]".repeat(30000);
  assert.equal(parseStateBytes(Buffer.from(deep)).ok, false);
});

test("huge numbers are clamped, not propagated", () => {
  const s = good();
  s.target = { ...s.target, beatHz: 1e308, carrierHz: -1e308 };
  const r = validateState(s);
  assert.ok(r.ok);
  assert.equal(r.state.target.beatHz, 40);
  assert.equal(r.state.target.carrierHz, 20);
});

test("minTransitionSec option lowers the floor, never below 5", () => {
  const s = good();
  s.target = { ...s.target, transitionSec: 2 };
  const r = validateState(s, { minTransitionSec: 5 });
  assert.ok(r.ok);
  assert.equal(r.state.target.transitionSec, 5);
  const low = validateState(s, { minTransitionSec: 0 });
  assert.ok(low.ok);
  assert.equal(low.state.target.transitionSec, 5);
  const keep = validateState({ ...good(), target: { ...good().target, transitionSec: 8 } }, { minTransitionSec: 5 });
  assert.ok(keep.ok);
  assert.equal(keep.state.target.transitionSec, 8);
});

test("level is derived from score, with a warning on disagreement", () => {
  const cases: Array<[number, string]> = [[0, "focus"], [39, "focus"], [40, "flow"], [59, "flow"], [60, "recovery"], [79, "recovery"], [80, "decompress"], [100, "decompress"]];
  for (const [score, level] of cases) {
    const s = good();
    s.burnout = { score, level: level === "focus" ? "decompress" : "focus" };
    const r = validateState(s);
    assert.ok(r.ok);
    assert.equal(r.state.burnout.level, level);
    assert.ok(r.warnings.some((w) => w.includes("does not match")));
  }
  const ok = validateState(good());
  assert.ok(ok.ok);
  assert.deepEqual(ok.warnings, []);
});
