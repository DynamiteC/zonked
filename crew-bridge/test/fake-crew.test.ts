import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { cleanup, tmpDir } from "./helpers.js";
import { validateState } from "../src/validate.js";

// Compiled to dist/test/, so the script sits two levels up.
const script = fileURLToPath(new URL("../../scripts/fake-crew.mjs", import.meta.url));

test("fake-crew writes valid, atomic, mapped states", () => {
  const dir = tmpDir();
  try {
    const seen: string[] = [];
    for (let count = 1; count <= 4; count += 1) {
      const path = join(dir, `s${count}.json`);
      const args = [script, "--state", path, "--step-sec", "0.05", "--count", String(count)];
      const r = spawnSync(process.execPath, args, { encoding: "utf8" });
      assert.equal(r.status, 0, r.stderr);
      const v = validateState(JSON.parse(readFileSync(path, "utf8")));
      assert.ok(v.ok);
      assert.deepEqual(v.warnings, []);
      seen.push(`${v.state.burnout.level}:${v.state.target.beatHz}/${v.state.target.carrierHz}`);
    }
    assert.deepEqual(seen, ["focus:40/200", "flow:18/220", "recovery:10/200", "decompress:6/180"]);
    assert.ok(readdirSync(dir).every((f) => !f.endsWith(".tmp")));
  } finally {
    cleanup(dir);
  }
});

test("fake-crew rejects bad arguments", () => {
  assert.equal(spawnSync(process.execPath, [script, "--bogus"]).status, 2);
  assert.equal(spawnSync(process.execPath, [script, "--step-sec", "0"]).status, 2);
});

test("fake-crew --transition-sec reaches the state and needs the bridge flag below 30", () => {
  const dir = tmpDir();
  try {
    const path = join(dir, "s.json");
    const r = spawnSync(process.execPath, [script, "--state", path, "--count", "1", "--transition-sec", "5"], { encoding: "utf8" });
    assert.equal(r.status, 0, r.stderr);
    const raw: unknown = JSON.parse(readFileSync(path, "utf8"));
    const strict = validateState(raw);
    assert.ok(strict.ok);
    assert.equal(strict.state.target.transitionSec, 30);
    const demo = validateState(raw, { minTransitionSec: 5 });
    assert.ok(demo.ok);
    assert.equal(demo.state.target.transitionSec, 5);
  } finally {
    cleanup(dir);
  }
});
