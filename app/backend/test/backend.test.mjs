import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, readFileSync, existsSync, readdirSync } from 'node:fs';
import { createHash, createHmac } from 'node:crypto';
import http from 'node:http';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { advance, emptyMemory, levelForScore, parseMemory, targetFor, validateIntensity, MAX_BODY_BYTES } from '../core.mjs';
import { createStore } from '../store.mjs';
import { createHandler } from '../server.mjs';
import { handleMessage } from '../mcp.mjs';
import { runTool } from '../tools.mjs';
import { createProxyV2Verifier } from '../proxy-auth.mjs';

const rep = (over = {}) => ({ version: 1, at: 1790000000, score: 30, ...over });
const freshStore = (t0 = 1000) => {
  const clock = { t: t0 };
  const store = createStore(mkdtempSync(join(tmpdir(), 'zk-be-')), () => clock.t);
  return { store, clock };
};

test('validate: rejects bad shapes and versions', () => {
  for (const bad of [null, 5, [], 'x', {}, rep({ version: 2 }), rep({ version: undefined }), rep({ extra: 1 }), rep({ at: -1 }), rep({ at: 1.5 }), rep({ score: '5' }), rep({ degraded: 'yes' }), rep({ signals: [] }), rep({ signals: { bogus: 1 } }), rep({ signals: { dirtyFiles: 'x' } })]) {
    assert.equal(validateIntensity(bad).ok, false, JSON.stringify(bad));
  }
});

test('validate: NaN, Infinity and non-numbers are rejected', () => {
  for (const v of [NaN, Infinity, -Infinity]) {
    assert.equal(validateIntensity(rep({ score: v })).ok, false);
    assert.equal(validateIntensity(rep({ signals: { dirtyFiles: v } })).ok, false);
  }
});

test('validate: out-of-range numbers are clamped with a warning', () => {
  const r = validateIntensity(rep({ score: 999, signals: { commitsPerHour: 5000, sessionMinutes: -4 } }));
  assert.equal(r.ok, true);
  assert.equal(r.value.score, 100);
  assert.equal(r.value.signals.commitsPerHour, 120);
  assert.equal(r.value.signals.sessionMinutes, 0);
  assert.ok(r.warnings.length >= 3);
});

test('targets stay inside the hearing limits and the transition floor', () => {
  for (const level of ['focus', 'flow', 'recovery', 'decompress']) {
    const t = targetFor(level, 1);
    assert.ok(t.carrierHz >= 20 && t.carrierHz <= 1500);
    assert.ok(t.beatHz >= 0.5 && t.beatHz <= 40);
    assert.ok(t.gain <= 0.85);
    assert.ok(t.transitionSec >= 30);
  }
  assert.equal(targetFor('flow', 99999).transitionSec, 600);
});

test('advance: first report adopts, then needs 2 in a row and moves one band', () => {
  let m = advance(emptyMemory(), validateIntensity(rep({ score: 10 })).value, 1000);
  assert.equal(m.level, 'focus');
  const high = validateIntensity(rep({ score: 95 })).value;
  m = advance(m, high, 1100);
  assert.equal(m.level, 'focus');
  m = advance(m, high, 1200);
  assert.equal(m.level, 'flow');
  assert.equal(m.transitionSec, 120);
  m = advance(m, high, 1210);
  assert.equal(m.level, 'flow', 'held by the 30 s pause');
  m = advance(m, high, 1300);
  assert.equal(m.level, 'recovery');
  assert.equal(levelForScore(95), 'decompress');
});

test('advance: a single spike does not change the level', () => {
  let m = advance(emptyMemory(), validateIntensity(rep({ score: 10 })).value, 1000);
  m = advance(m, validateIntensity(rep({ score: 90 })).value, 1100);
  m = advance(m, validateIntensity(rep({ score: 10 })).value, 1200);
  assert.equal(m.level, 'focus');
  assert.equal(m.pendingCount, 0);
});

test('store: report persists, state and suggestion read it back', () => {
  const { store } = freshStore();
  assert.equal(store.state(), null);
  assert.equal(store.suggestion().ready, false);
  const r = store.report(rep({ score: 65 }));
  assert.equal(r.ok, true);
  assert.equal(store.state().burnout.level, 'recovery');
  assert.equal(store.suggestion().ready, true);
  assert.equal(store.report(rep({ version: 9 })).ok, false);
});

test('parseMemory: oversize, garbage and wrong version give a fresh memory', () => {
  assert.equal(parseMemory(Buffer.alloc(70 * 1024, 32)).level, null);
  assert.equal(parseMemory(Buffer.from('not json')).level, null);
  assert.equal(parseMemory(Buffer.from('{"version":2,"level":"focus"}')).level, null);
  assert.equal(parseMemory(Buffer.from('{"version":1,"level":"nope"}')).level, null);
});

test('store: a corrupt or oversize file on disk is ignored, not trusted', () => {
  const dir = mkdtempSync(join(tmpdir(), 'zk-be-'));
  writeFileSync(join(dir, 'crew-memory.json'), 'x'.repeat(70 * 1024));
  const store = createStore(dir, () => 5);
  assert.equal(store.state(), null);
  assert.equal(store.report(rep()).ok, true);
  assert.equal(existsSync(join(dir, 'crew-memory.json.tmp')), false);
  assert.ok(readFileSync(join(dir, 'crew-memory.json')).length < 2048);
});

test('tools: report and suggestion, unknown tool, bad args, non-object call', () => {
  const { store } = freshStore();
  assert.equal(runTool(store, { tool: 'zonked_report_intensity', arguments: { score: 70, at: 5, dirty_files: 3 } }).ok, true);
  assert.equal(runTool(store, { tool: 'zonked_get_suggestion' }).ready, true);
  assert.equal(runTool(store, { tool: 'rm_rf' }).ok, false);
  assert.equal(runTool(store, { tool: 'zonked_report_intensity', arguments: { score: NaN, at: 5 } }).ok, false);
  assert.equal(runTool(store, { tool: 'zonked_report_intensity', arguments: { at: 5 } }).ok, false);
  assert.equal(runTool(store, 'x').ok, false);
  assert.equal(runTool(store, null).ok, false);
});

test('mcp: initialize, list, call, and bad input', () => {
  const { store } = freshStore();
  assert.equal(handleMessage(store, { jsonrpc: '2.0', id: 1, method: 'initialize' }).result.serverInfo.name, 'zonked-crew');
  assert.equal(handleMessage(store, { jsonrpc: '2.0', id: 2, method: 'tools/list' }).result.tools.length, 2);
  assert.equal(handleMessage(store, { jsonrpc: '2.0', method: 'notifications/initialized' }), null);
  assert.equal(handleMessage(store, { jsonrpc: '2.0', id: 3, method: 'tools/call', params: { name: 'bad' } }).error.code, -32602);
  assert.equal(handleMessage(store, { jsonrpc: '2.0', id: 4, method: 'nope' }).error.code, -32601);
  assert.equal(handleMessage(store, 7).error.code, -32600);
  const call = handleMessage(store, { jsonrpc: '2.0', id: 5, method: 'tools/call', params: { name: 'zonked_report_intensity', arguments: { score: 12, at: 1 } } });
  assert.equal(call.result.isError, false);
});

function listen(handler) {
  const server = http.createServer((q, s) => void handler(q, s));
  return new Promise((r) => server.listen(0, '127.0.0.1', () => r(server)));
}
function call(server, method, path, body, headers = {}) {
  const raw = body === undefined ? undefined : typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body);
  return new Promise((resolve, reject) => {
    const req = http.request({ host: '127.0.0.1', port: server.address().port, method, path, headers: { Connection: 'close', ...(raw ? { 'Content-Length': Buffer.byteLength(raw) } : {}), ...headers } }, (res) => {
      const parts = [];
      res.on('data', (c) => parts.push(c));
      res.on('end', () => resolve({ status: res.statusCode, json: (() => { try { return JSON.parse(Buffer.concat(parts).toString()); } catch { return null; } })() }));
    });
    req.on('error', reject);
    req.end(raw);
  });
}

test('http: routes, bad json, oversize body, unknown path, unsigned refusal', async () => {
  const { store } = freshStore();
  const server = await listen(createHandler({ store, allowUnsigned: true }));
  try {
    assert.equal((await call(server, 'GET', '/health')).status, 200);
    assert.equal((await call(server, 'GET', '/api/state')).json.crew, null);
    assert.equal((await call(server, 'POST', '/api/intensity', rep({ score: 85 }))).status, 200);
    assert.equal((await call(server, 'GET', '/api/state')).json.crew.burnout.level, 'decompress');
    assert.equal((await call(server, 'GET', '/api/suggestion')).json.ready, true);
    assert.equal((await call(server, 'POST', '/api/intensity', rep({ version: 3 }))).status, 400);
    assert.equal((await call(server, 'POST', '/api/intensity', '{nope')).status, 400);
    assert.equal((await call(server, 'POST', '/api/intensity', '{"score":NaN}')).status, 400);
    assert.equal((await call(server, 'POST', '/api/intensity', Buffer.alloc(MAX_BODY_BYTES + 10, 97))).status, 413);
    assert.equal((await call(server, 'POST', '/api/agent-tools', { tool: 'zonked_get_suggestion', arguments: {} })).json.ok, true);
    assert.equal((await call(server, 'GET', '/api/nothing')).status, 405);
    assert.equal((await call(server, 'GET', '/elsewhere')).status, 404);
  } finally {
    server.close();
  }
  const closed = await listen(createHandler({ store }));
  try {
    assert.equal((await call(closed, 'GET', '/api/state')).status, 401, 'no secret means closed');
    assert.equal((await call(closed, 'GET', '/health')).status, 200);
  } finally {
    closed.close();
  }
});

test('http: signed requests pass, bad signature and replay fail', async () => {
  const secret = 'test-secret';
  const { store } = freshStore();
  const server = await listen(createHandler({ store, secret }));
  const sign = (method, target, body, nonce) => {
    const ts = String(Math.floor(Date.now() / 1000));
    const h = createHash('sha256').update(body).digest('hex');
    return { 'X-KiroCrew-Proxy-Nonce': nonce, 'X-KiroCrew-Proxy-V2': `${ts}:${createHmac('sha256', secret).update(`v2:${ts}:${nonce}:${method}:${target}:${h}`).digest('hex')}` };
  };
  try {
    const nonce = 'a'.repeat(32);
    const good = sign('GET', '/api/state', '', nonce);
    assert.equal((await call(server, 'GET', '/api/state', undefined, good)).status, 200);
    assert.equal((await call(server, 'GET', '/api/state', undefined, good)).status, 401, 'replay');
    assert.equal((await call(server, 'GET', '/api/state')).status, 401);
    const forged = { ...sign('GET', '/api/state', '', 'b'.repeat(32)), 'X-KiroCrew-Proxy-Nonce': 'c'.repeat(32) };
    assert.equal((await call(server, 'GET', '/api/state', undefined, forged)).status, 401);
  } finally {
    server.close();
  }
});

test('proxy verifier: empty secret and stale timestamp are refused', () => {
  const v = createProxyV2Verifier('');
  assert.equal(v({ method: 'GET', target: '/', body: Buffer.alloc(0), signature: '1:ab', nonce: 'a'.repeat(32) }), false);
  const w = createProxyV2Verifier('s');
  assert.equal(w({ method: 'GET', target: '/', body: Buffer.alloc(0), signature: '1:ab', nonce: 'a'.repeat(32), now: 1000 }), false);
});

test('first report starts from flow and moves one band only', () => {
  const next = advance(emptyMemory(), { at: 1, score: 95, signals: {}, degraded: false }, 100);
  assert.equal(next.level, 'recovery');
  assert.equal(advance(emptyMemory(), { at: 1, score: 10, signals: {}, degraded: false }, 100).level, 'focus');
});

test('targetFor: NaN transition falls back to the floor', () => {
  assert.equal(targetFor('flow', NaN).transitionSec, 30);
});

test('proxy verifier: a full nonce cache evicts the oldest instead of locking out', () => {
  const secret = 's';
  const v = createProxyV2Verifier(secret, { maxEntries: 2 });
  const now = 1000;
  const send = (n) => {
    const nonce = n.toString(16).padStart(32, '0');
    const bh = createHash('sha256').update(Buffer.alloc(0)).digest('hex');
    const sig = createHmac('sha256', secret).update(`v2:${now}:${nonce}:GET:/x:${bh}`).digest('hex');
    return v({ method: 'GET', target: '/x', body: Buffer.alloc(0), signature: `${now}:${sig}`, nonce, now });
  };
  assert.equal(send(1), true);
  assert.equal(send(2), true);
  assert.equal(send(3), true);
  assert.equal(send(3), false);
  assert.equal(send(1), true);
});

test('store: temp files get unique names and none are left behind', () => {
  const dir = mkdtempSync(join(tmpdir(), 'zk-be-'));
  const store = createStore(dir, () => 5);
  store.report(rep());
  store.report(rep());
  assert.deepEqual(readdirSync(dir), ['crew-memory.json']);
});
