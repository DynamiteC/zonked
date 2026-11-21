import test from 'node:test';
import assert from 'node:assert/strict';
import { scanChars } from './check-chars.mjs';

test('flags em-dash, section sign and emoji with line numbers', () => {
  assert.deepEqual(scanChars('ok\na \u2014 b'), [{ line: 2, what: 'em-dash' }]);
  assert.deepEqual(scanChars('\u00A7 3'), [{ line: 1, what: 'section sign' }]);
  assert.equal(scanChars('hi \u{1F600}')[0]?.what, 'emoji or symbol');
});
test('allows plain text, en-dash ranges and accents', () => {
  assert.deepEqual(scanChars('March\u2013June caf\u00e9 -- x'), []);
});
