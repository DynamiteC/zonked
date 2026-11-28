import test from 'node:test';
import assert from 'node:assert/strict';
import { END, START, matrixCounts, renderBlock, splice } from './update-counts.mjs';

const rec = {
  commit: 'abcdef1234567890',
  date: '2026-01-02T03:04:05Z',
  counts: { 'cargo-test': 10, vitest: { tests: 20, files: 3 }, 'bridge-tests': 4, 'app-backend-tests': 5, 'web-script-tests': 6, 'root-script-tests': 7, 'verify-e2e': { passed: 30, total: 30 } },
};

test('the block holds the numbers of the run and nothing typed by hand', () => {
  const b = renderBlock(rec, { passed: 9, total: 9, combos: 3 });
  assert.match(b, /Rust DSP tests: 10/);
  assert.match(b, /20 in 3 files/);
  assert.match(b, /Script tests: 13/);
  assert.match(b, /30 of 30/);
  assert.match(b, /9 of 9 checks/);
});

test('splice replaces a marker block and a placeholder line, and leaves other text alone', () => {
  const b = `${START}\nnew\n${END}`;
  assert.equal(splice(`a\n${START}\nold\n${END}\nz`, b), `a\n${b}\nz`);
  assert.equal(splice('a\nPLACEHOLDER-FINAL-RUN here\nz', b), `a\n${b}\nz`);
  assert.equal(splice('plain', b), 'plain');
});

test('matrixCounts counts passed checks over every combination', () => {
  assert.deepEqual(matrixCounts([{ results: [{ ok: true }, { ok: false }] }, { results: [{ ok: true }] }]), { passed: 2, total: 3, combos: 2 });
  assert.equal(matrixCounts(null), null);
});
