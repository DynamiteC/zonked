import test from "node:test";
import assert from "node:assert/strict";
import { resolve } from "node:path";
import { parseArgs, UsageError, normalizeOrigin } from "../src/args.js";

test("defaults", () => {
  assert.deepEqual(parseArgs(["--state", "s.json"]), { statePath: resolve("s.json"), port: 43210, origins: [], minTransitionSec: 30 });
});

test("all flags, repeatable origin, equals form", () => {
  const o = parseArgs(["--state=a.json", "--signals", "b.json", "--port", "5000", "--origin", "https://x.example.dev/", "--origin=http://localhost:9999"]);
  assert.ok(o !== "help");
  assert.equal(o.signalsPath, resolve("b.json"));
  assert.equal(o.port, 5000);
  assert.deepEqual(o.origins, ["https://x.example.dev", "http://localhost:9999"]);
});

test("help", () => {
  assert.equal(parseArgs(["--help"]), "help");
  assert.equal(parseArgs(["-h"]), "help");
});

test("errors", () => {
  const bad: string[][] = [
    [],
    ["--port", "1"],
    ["--state"],
    ["--state", "--port"],
    ["--state", "s", "--port", "0"],
    ["--state", "s", "--port", "70000"],
    ["--state", "s", "--port", "abc"],
    ["--state", "s", "--port", "-5"],
    ["--state", "s", "--origin", "*"],
    ["--state", "s", "--origin", "null"],
    ["--state", "s", "--origin", "ftp://x"],
    ["--state", "s", "--bogus"],
    ["--state", "s", "positional"],
  ];
  for (const argv of bad) assert.throws(() => parseArgs(argv), UsageError, argv.join(" "));
});

test("normalizeOrigin strips path", () => {
  assert.equal(normalizeOrigin("https://a.b/c/d?x=1"), "https://a.b");
});

test("--min-transition: default 30, accepts 5-600, rejects the rest", () => {
  const o = parseArgs(["--state", "s", "--min-transition", "5"]);
  assert.ok(o !== "help");
  assert.equal(o.minTransitionSec, 5);
  for (const bad of ["4", "601", "abc", "-1", "1.5", ""]) {
    assert.throws(() => parseArgs(["--state", "s", "--min-transition", bad]), UsageError, bad);
  }
});
