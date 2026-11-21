import test from "node:test";
import assert from "node:assert/strict";
import { mkdirSync, symlinkSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { FileWatcher, readCapped } from "../src/watch.js";
import { cleanup, sleep, tmpDir, until, writeAtomic } from "./helpers.js";

function make(path: string, pollMs = 2000) {
  const data: string[] = [];
  const problems: string[] = [];
  const w = new FileWatcher({
    path,
    cap: 1024,
    debounceMs: 30,
    pollMs,
    onData: (b) => data.push(b.toString("utf8")),
    onProblem: (m) => problems.push(m),
  });
  return { w, data, problems };
}

test("readCapped: missing, ok, oversized, directory", async () => {
  const dir = tmpDir();
  try {
    assert.deepEqual(await readCapped(join(dir, "nope"), 10), { kind: "missing" });
    writeFileSync(join(dir, "a"), "hello");
    assert.equal((await readCapped(join(dir, "a"), 10)).kind, "data");
    writeFileSync(join(dir, "b"), "x".repeat(50));
    assert.equal((await readCapped(join(dir, "b"), 10)).kind, "toolarge");
    mkdirSync(join(dir, "d"));
    assert.equal((await readCapped(join(dir, "d"), 10)).kind, "missing");
  } finally {
    cleanup(dir);
  }
});

test("reads an existing file on start and reports changes once", async () => {
  const dir = tmpDir();
  const path = join(dir, "s.json");
  writeFileSync(path, "one");
  const { w, data } = make(path);
  try {
    w.start();
    await until(() => data.length === 1);
    writeFileSync(path, "one");
    await sleep(200);
    assert.equal(data.length, 1);
    writeFileSync(path, "two");
    await until(() => data.length === 2);
    assert.equal(data[1], "two");
  } finally {
    w.stop();
    cleanup(dir);
  }
});

test("handles atomic rename replacement", async () => {
  const dir = tmpDir();
  const path = join(dir, "s.json");
  const { w, data } = make(path);
  try {
    w.start();
    await sleep(100);
    writeAtomic(path, "v1");
    await until(() => data.includes("v1"));
    writeAtomic(path, "v2");
    await until(() => data.includes("v2"));
    writeFileSync(join(dir, "other"), "v3");
    renameSync(join(dir, "other"), path);
    await until(() => data.includes("v3"));
  } finally {
    w.stop();
    cleanup(dir);
  }
});

test("debounces a burst of writes into the final content", async () => {
  const dir = tmpDir();
  const path = join(dir, "s.json");
  writeFileSync(path, "start");
  const { w, data } = make(path);
  try {
    w.start();
    await until(() => data.length === 1);
    for (let i = 0; i < 10; i += 1) writeFileSync(path, `burst-${i}`);
    await until(() => data.includes("burst-9"));
    assert.ok(data.length <= 4, `got ${data.length} events`);
  } finally {
    w.stop();
    cleanup(dir);
  }
});

test("reports missing, then recovers; reports oversize once", async () => {
  const dir = tmpDir();
  const path = join(dir, "s.json");
  const { w, data, problems } = make(path);
  try {
    w.start();
    await until(() => problems.includes("file not found"));
    writeFileSync(path, "x".repeat(2000));
    await until(() => problems.some((p) => p.includes("larger than")));
    const n = problems.length;
    await sleep(150);
    assert.equal(problems.length, n);
    writeFileSync(path, "fine");
    await until(() => data.includes("fine"));
    rmSync(path);
    await until(() => problems.filter((p) => p === "file not found").length === 2);
  } finally {
    w.stop();
    cleanup(dir);
  }
});

test("polling fallback notices changes when the watcher is gone", async () => {
  const dir = tmpDir();
  const path = join(dir, "s.json");
  writeFileSync(path, "a");
  const { w, data } = make(path, 60);
  try {
    w.start();
    await until(() => data.length === 1);
    (w as unknown as { closeWatcher(): void }).closeWatcher();
    writeFileSync(path, "b-polled");
    await until(() => data.includes("b-polled"));
  } finally {
    w.stop();
    cleanup(dir);
  }
});

test("stop prevents further callbacks", async () => {
  const dir = tmpDir();
  const path = join(dir, "s.json");
  writeFileSync(path, "a");
  const { w, data } = make(path);
  w.start();
  await until(() => data.length === 1);
  w.stop();
  writeFileSync(path, "b");
  await sleep(250);
  assert.equal(data.length, 1);
  cleanup(dir);
});

test("readCapped refuses symlinks (ELOOP) and the watcher reports a problem", async () => {
  const dir = tmpDir();
  try {
    writeFileSync(join(dir, "real"), "hello");
    symlinkSync(join(dir, "real"), join(dir, "link"));
    assert.deepEqual(await readCapped(join(dir, "link"), 100), { kind: "symlink" });
    const { w, data, problems } = make(join(dir, "link"));
    try {
      w.start();
      await until(() => problems.length === 1);
      assert.match(problems[0] ?? "", /symlink/);
      assert.equal(data.length, 0);
    } finally {
      w.stop();
    }
  } finally {
    cleanup(dir);
  }
});
