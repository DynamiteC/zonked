import test from 'node:test';
import assert from 'node:assert/strict';
import { counts, level, lineCount } from './check-sizes.mjs';

test('level thresholds', () => {
  assert.equal(level(400), 'ok');
  assert.equal(level(401), 'warn');
  assert.equal(level(800), 'warn');
  assert.equal(level(801), 'fail');
});
test('counts only source files outside legacy', () => {
  assert.ok(counts('web/src/a.tsx') && counts('crates/x/src/lib.rs') && counts('scripts/a.mjs'));
  assert.ok(!counts('app/ui/dist/chunk-a.mjs') && !counts('web/dist/a.mjs') && counts('app/ui/src/a.tsx'));
  assert.ok(!counts('legacy/x/a.ts') && !counts('web/package-lock.json') && !counts('README.md'));
});
test('lineCount ignores one trailing newline', () => {
  assert.equal(lineCount('a\nb\n'), 2);
  assert.equal(lineCount('a\nb'), 2);
  assert.equal(lineCount(''), 0);
});
