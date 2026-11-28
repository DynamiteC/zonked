import test from 'node:test';
import assert from 'node:assert/strict';
import { STAGES, pick } from './verify-all.mjs';

test('pick filters by only and skip and keeps the wasm baseline stage', () => {
  const names = (a) => a.map((s) => s.name);
  assert.deepEqual(names(pick(STAGES, 'clippy', '')), ['wasm-hash-before', 'clippy']);
  assert.ok(!names(pick(STAGES, '', 'verify-e2e')).includes('verify-e2e'));
  assert.equal(pick(STAGES, '', '').length, STAGES.length);
});

test('the trust stages exist and run in a sensible order', () => {
  const names = STAGES.map((s) => s.name);
  for (const n of ['commit-stamp', 'install', 'wasm-pinned', 'clean-clone-build', 'app-dist-fresh', 'npm-audit', 'verify-e2e']) assert.ok(names.includes(n), n);
  assert.ok(names.indexOf('commit-stamp') < names.indexOf('install'));
  assert.ok(names.indexOf('web-build') < names.indexOf('wasm-pinned'));
  assert.ok(names.indexOf('wasm-pinned') < names.indexOf('verify-e2e'));
});
