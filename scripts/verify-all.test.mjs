import test from 'node:test';
import assert from 'node:assert/strict';
import { STAGES, pick } from './verify-all.mjs';

test('pick filters by only and skip and keeps the wasm baseline stage', () => {
  const names = (a) => a.map((s) => s.name);
  assert.deepEqual(names(pick(STAGES, 'clippy', '')), ['wasm-hash-before', 'clippy']);
  assert.ok(!names(pick(STAGES, '', 'verify-e2e')).includes('verify-e2e'));
  assert.equal(pick(STAGES, '', '').length, STAGES.length);
});
