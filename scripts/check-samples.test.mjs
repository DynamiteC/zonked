import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ALLOWED, check, parseRows } from './check-samples.mjs';

const md = '| a.mp3.json | T | A | S | CC0 1.0 | L | D | seg | 1 | abc |\n| b.mp3.json | T | A | S | CC BY-SA 4.0 | L | D | seg | 1 | def |\nnot a row';
const rows = parseRows(md);
test('parses rows', () => assert.equal(rows.length, 2));
test('passes a clean file', () => assert.deepEqual(check(['a.mp3.json'], rows.slice(0, 1), () => 'abc'), []));
test('flags checksum, licence, unlisted and missing', () => {
  const e = check(['a.mp3.json', 'c.mp3.json'], rows, () => 'zzz');
  assert.equal(e.length, 3);
  assert.ok(e.some((x) => x.includes('allow list')) === false);
  assert.ok(e.some((x) => x.includes('not listed')));
  assert.ok(e.some((x) => x.includes('missing')));
});
test('rejects a share-alike licence', () => {
  const e = check(['b.mp3.json'], rows, () => 'def');
  assert.ok(e.some((x) => x.includes('allow list')));
});
test('allow list holds only CC0 and public domain', () => assert.ok(ALLOWED.every((l) => /^(CC0|Public domain)/.test(l))));
