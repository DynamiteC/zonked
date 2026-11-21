import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { check } from "./check-no-buildrs.mjs";

function crate(files) {
  const d = mkdtempSync(join(tmpdir(), "nobuild-"));
  for (const [name, body] of Object.entries(files)) {
    mkdirSync(join(d, name, ".."), { recursive: true });
    writeFileSync(join(d, name), body);
  }
  return d;
}

test("clean crate passes", () => {
  const d = crate({ "Cargo.toml": '[package]\nname="x"\n[dependencies]\n', "src/lib.rs": "" });
  try { assert.deepEqual(check(d), []); } finally { rmSync(d, { recursive: true }); }
});
test("build.rs fails", () => {
  const d = crate({ "Cargo.toml": '[package]\nname="x"\n', "build.rs": "fn main(){}" });
  try { assert.equal(check(d).length, 1); } finally { rmSync(d, { recursive: true }); }
});
test("proc-macro dependency fails", () => {
  const d = crate({ "Cargo.toml": '[package]\nname="x"\n[dependencies]\nsyn = "2"\n' });
  try { assert.ok(check(d).some((p) => /proc-macro/.test(p))); } finally { rmSync(d, { recursive: true }); }
});
test("real dsp-core passes", () => {
  assert.deepEqual(check(new URL("../crates/dsp-core", import.meta.url).pathname), []);
});
