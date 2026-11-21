import test from "node:test";
import assert from "node:assert/strict";
import { writeFileSync } from "node:fs";
import net from "node:net";
import { join } from "node:path";
import { Bridge } from "../src/server.js";
import { SseClient, cleanup, goodState, request, sleep, tmpDir, until, writeAtomic } from "./helpers.js";

interface Internals {
  latest: unknown;
  lastError: string | null;
  signals: unknown;
  clients: Set<unknown>;
  server: { address(): { address: string } };
}
const internals = (b: Bridge): Internals => b as unknown as Internals;

async function setup(extra: Partial<ConstructorParameters<typeof Bridge>[0]> = {}) {
  const dir = tmpDir();
  const statePath = join(dir, ".zonked-state.json");
  const bridge = new Bridge({ statePath, port: 0, debounceMs: 20, pollMs: 500, ...extra });
  const port = await bridge.start();
  const done = async (): Promise<void> => {
    await bridge.stop();
    cleanup(dir);
  };
  return { dir, statePath, bridge, port, done };
}

test("binds to loopback only", async () => {
  const t = await setup();
  try {
    assert.equal(internals(t.bridge).server.address().address, "127.0.0.1");
  } finally {
    await t.done();
  }
});

test("health and state before and after the first file", async () => {
  const t = await setup();
  try {
    const h0 = JSON.parse((await request(t.port, "/health")).body);
    assert.equal(h0.ok, true);
    assert.equal(h0.port, t.port);
    assert.match(h0.version, /^\d+\.\d+\.\d+/);
    assert.equal(h0.hasState, false);
    assert.deepEqual(h0.warnings, []);
    assert.equal(h0.clients, 0);
    assert.equal((await request(t.port, "/state")).status, 404);

    writeAtomic(t.statePath, goodState({}, 66));
    await until(() => internals(t.bridge).latest !== null);
    const h1 = JSON.parse((await request(t.port, "/health")).body);
    assert.equal(h1.hasState, true);
    assert.equal(h1.lastError, null);
    const st = await request(t.port, "/state");
    assert.equal(st.status, 200);
    assert.equal(JSON.parse(st.body).burnout.score, 66);
    assert.equal(st.headers["cache-control"], "no-store");
  } finally {
    await t.done();
  }
});

test("invalid files keep last good state and surface lastError", async () => {
  const t = await setup();
  try {
    const err = () => String(internals(t.bridge).lastError);
    writeAtomic(t.statePath, goodState({}, 30));
    await until(() => internals(t.bridge).latest !== null);
    writeAtomic(t.statePath, "{broken");
    await until(() => /JSON/.test(err()));
    const h = JSON.parse((await request(t.port, "/health")).body);
    assert.equal(h.hasState, true);
    assert.equal(JSON.parse((await request(t.port, "/state")).body).burnout.score, 30);

    writeAtomic(t.statePath, goodState({ version: 9 }));
    await until(() => /version/.test(err()));
    writeFileSync(t.statePath, "x".repeat(70_000));
    await until(() => /larger/.test(err()));

    const hostile = { beatHz: 900, carrierHz: 200, gain: 5, transitionSec: 60, breathe: false };
    writeAtomic(t.statePath, goodState({ target: hostile }, 50));
    await until(() => internals(t.bridge).lastError === null);
    const h2 = JSON.parse((await request(t.port, "/health")).body);
    assert.ok(h2.warnings.length >= 2);
    const s = JSON.parse((await request(t.port, "/state")).body);
    assert.equal(s.target.beatHz, 40);
    assert.equal(s.target.gain, 0.85);
  } finally {
    await t.done();
  }
});

test("Host allow-list: 403 for foreign and wrong-port hosts", async () => {
  const t = await setup();
  try {
    const bad = ["evil.com", `evil.com:${t.port}`, `localhost:${t.port + 1}`, "localhost", `127.0.0.1.evil.com:${t.port}`, `[::1]:${t.port}`];
    for (const host of bad) {
      for (const path of ["/health", "/state", "/events"]) {
        const r = await request(t.port, path, { Host: host });
        assert.equal(r.status, 403, `${host} ${path}`);
        assert.equal(r.headers["access-control-allow-origin"], undefined);
      }
    }
    for (const host of [`localhost:${t.port}`, `127.0.0.1:${t.port}`, `LOCALHOST:${t.port}`]) {
      assert.equal((await request(t.port, "/health", { Host: host })).status, 200, host);
    }
  } finally {
    await t.done();
  }
});

test("Origin allow-list and CORS headers", async () => {
  const t = await setup({ origins: ["https://zonked.example.invalid"] });
  try {
    const denied = ["http://evil.com", "null", "http://localhost:5174", "https://localhost:5173", "http://localhost:5173.evil.com", ""];
    for (const origin of denied) {
      const r = await request(t.port, "/health", { Origin: origin });
      assert.equal(r.status, 403, `origin=${origin}`);
      assert.equal(r.headers["access-control-allow-origin"], undefined);
    }
    const allowed = [
      "http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:4173",
      "http://127.0.0.1:4173", "http://localhost:8787", "http://127.0.0.1:8787",
      "https://zonked.example.invalid",
    ];
    for (const origin of allowed) {
      const r = await request(t.port, "/health", { Origin: origin });
      assert.equal(r.status, 200, origin);
      assert.equal(r.headers["access-control-allow-origin"], origin);
      assert.equal(r.headers["vary"], "Origin");
    }
    const none = await request(t.port, "/health");
    assert.equal(none.status, 200);
    assert.equal(none.headers["access-control-allow-origin"], undefined);
    const pre = await request(t.port, "/events", { Origin: "http://localhost:5173" }, "OPTIONS");
    assert.equal(pre.status, 204);
    assert.equal((await request(t.port, "/events", { Origin: "http://evil.com" }, "OPTIONS")).status, 403);
  } finally {
    await t.done();
  }
});

test("only GET, HEAD, OPTIONS; unknown paths 404", async () => {
  const t = await setup();
  try {
    assert.equal((await request(t.port, "/state", {}, "POST")).status, 405);
    assert.equal((await request(t.port, "/state", {}, "DELETE")).status, 405);
    assert.equal((await request(t.port, "/nope")).status, 404);
    assert.equal((await request(t.port, "/../etc/passwd")).status, 404);
  } finally {
    await t.done();
  }
});

test("SSE replays latest state on connect and delivers updates within 500 ms", async () => {
  const t = await setup();
  try {
    writeAtomic(t.statePath, goodState({}, 20));
    await until(() => internals(t.bridge).latest !== null);

    const a = await SseClient.open(t.port, { Origin: "http://localhost:5173" });
    assert.equal(a.status, 200);
    assert.match(String(a.headers["content-type"]), /text\/event-stream/);
    assert.equal(a.headers["access-control-allow-origin"], "http://localhost:5173");
    await until(() => a.states().length === 1);
    assert.equal(JSON.parse(a.states()[0]!.data).burnout.score, 20);

    const b = await SseClient.open(t.port);
    await until(() => b.states().length === 1);

    const t0 = Date.now();
    writeAtomic(t.statePath, goodState({}, 85));
    await until(() => a.states().length === 2 && b.states().length === 2, 1000);
    const latency = Math.max(a.states()[1]!.receivedAt, b.states()[1]!.receivedAt) - t0;
    assert.ok(latency < 500, `latency ${latency} ms`);
    assert.equal(JSON.parse(a.states()[1]!.data).burnout.score, 85);

    writeAtomic(t.statePath, goodState({}, 85));
    await sleep(250);
    assert.equal(a.states().length, 2, "identical content must not re-broadcast");

    writeAtomic(t.statePath, "nonsense");
    await sleep(250);
    assert.equal(a.states().length, 2, "invalid content must not broadcast");
    a.close();
    b.close();
  } finally {
    await t.done();
  }
});

test("SSE sends ping events on schedule", async () => {
  const t = await setup({ pingMs: 80 });
  try {
    const c = await SseClient.open(t.port);
    await until(() => c.events.filter((e) => e.event === "ping").length >= 2);
    c.close();
  } finally {
    await t.done();
  }
});

test("SSE client cap returns 503 and frees slots on disconnect", async () => {
  const t = await setup({ maxClients: 3 });
  try {
    const open: SseClient[] = [];
    for (let i = 0; i < 3; i += 1) open.push(await SseClient.open(t.port));
    await until(() => internals(t.bridge).clients.size === 3);
    assert.equal((await request(t.port, "/events")).status, 503);
    assert.equal(JSON.parse((await request(t.port, "/health")).body).clients, 3);
    open[0]!.close();
    await until(() => internals(t.bridge).clients.size === 2);
    const again = await SseClient.open(t.port);
    assert.equal(again.status, 200);
    again.close();
    for (const c of open) c.close();
  } finally {
    await t.done();
  }
});

test("default cap is 20 clients", async () => {
  const t = await setup();
  try {
    const open: SseClient[] = [];
    const origins = ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:4173", "http://127.0.0.1:4173", "http://localhost:8787"];
    for (let i = 0; i < 20; i += 1) open.push(await SseClient.open(t.port, { Origin: origins[i % 5]! }));
    await until(() => internals(t.bridge).clients.size === 20);
    assert.equal((await request(t.port, "/events", { Origin: "http://127.0.0.1:8787" })).status, 503);
    for (const c of open) c.close();
  } finally {
    await t.done();
  }
});

test("signals file is summarised on /health when configured", async () => {
  const dir = tmpDir();
  const signalsPath = join(dir, ".zonked-signals.json");
  writeAtomic(signalsPath, { version: 1, at: 1790000000, score: 54, signals: {} });
  const bridge = new Bridge({ statePath: join(dir, "s.json"), signalsPath, port: 0, debounceMs: 20, pollMs: 500 });
  const port = await bridge.start();
  try {
    await until(() => internals(bridge).signals !== null);
    const h = JSON.parse((await request(port, "/health")).body);
    assert.deepEqual(h.signals, { at: 1790000000, score: 54, degraded: false });
  } finally {
    await bridge.stop();
    cleanup(dir);
  }
});

test("malformed requests get 400 and do not wedge the server", async () => {
  const t = await setup();
  try {
    const sock = net.connect(t.port, "127.0.0.1");
    await new Promise<void>((r) => sock.once("connect", () => r()));
    sock.write("GARBAGE\r\n\r\n");
    const reply = await new Promise<string>((resolve) => {
      let s = "";
      sock.on("data", (d) => (s += d.toString()));
      sock.on("close", () => resolve(s));
    });
    assert.match(reply, /400/);
    assert.equal((await request(t.port, "/health")).status, 200);
  } finally {
    await t.done();
  }
});

test("stop closes SSE clients and the listener", async () => {
  const t = await setup();
  const c = await SseClient.open(t.port);
  await until(() => internals(t.bridge).clients.size === 1);
  await t.bridge.stop();
  await assert.rejects(request(t.port, "/health"));
  c.close();
  cleanup(t.dir);
});

test("/events rejects HEAD and POST with 405 and holds no SSE slot", async () => {
  const t = await setup();
  try {
    for (const m of ["HEAD", "POST"]) {
      const r = await request(t.port, "/events", {}, m);
      assert.equal(r.status, 405, m);
      assert.ok(String(r.headers["allow"]).includes("GET"));
    }
    assert.equal(internals(t.bridge).clients.size, 0);
  } finally {
    await t.done();
  }
});

test("per-Origin SSE cap of 4, freed when a client closes", async () => {
  const t = await setup();
  const origin = { Origin: "http://localhost:5173" };
  const open: SseClient[] = [];
  try {
    for (let i = 0; i < 4; i++) {
      const c = await SseClient.open(t.port, origin);
      assert.equal(c.status, 200);
      open.push(c);
    }
    const fifth = await SseClient.open(t.port, origin);
    assert.equal(fifth.status, 503);
    const other = await SseClient.open(t.port, { Origin: "http://127.0.0.1:5173" });
    assert.equal(other.status, 200);
    open.push(other);
    open[0]!.close();
    await until(() => internals(t.bridge).clients.size === 4);
    const again = await SseClient.open(t.port, origin);
    assert.equal(again.status, 200);
    open.push(again);
  } finally {
    for (const c of open) c.close();
    await t.done();
  }
});

test("minTransitionSec option lets short transitions through the server", async () => {
  const t = await setup({ minTransitionSec: 5 });
  try {
    writeAtomic(t.statePath, goodState({ target: { beatHz: 10, carrierHz: 200, gain: 0.5, transitionSec: 5, breathe: false } }, 66));
    await until(() => internals(t.bridge).latest !== null);
    assert.equal(JSON.parse((await request(t.port, "/state")).body).target.transitionSec, 5);
  } finally {
    await t.done();
  }
});
