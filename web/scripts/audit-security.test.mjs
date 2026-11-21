// Run with: npm run test:scripts (node:test). Not part of `npm test` (vitest only).
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { scanText, scanHtml, checkHeaders, checkWrangler } from './audit-security.mjs';

const rules = (fs) => fs.map((f) => f.rule);

test('flags eval, new Function, document.write', () => {
  const r = rules(scanText('eval("x");\nnew Function("a");\ndocument.write("x");', { file: 'a.ts' }));
  assert.deepEqual(r, ['eval', 'new-function', 'document-write']);
});
test('flags html assignment but not comparison', () => {
  assert.equal(scanText('el.innerHTML = x;', { file: 'a' }).length, 1);
  assert.equal(scanText('if (el.innerHTML === x) {}', { file: 'a' }).length, 0);
});
test('flags dangerouslySetInnerHTML, javascript: and insertAdjacentHTML', () => {
  const r = rules(scanText('<a dangerouslySetInnerHTML/>\nh="javascript:void(0)"\nx.insertAdjacentHTML("a","b")', { file: 'a' }));
  assert.deepEqual(r, ['dangerously-set-inner-html', 'javascript-url', 'insert-adjacent-html']);
});
test('does not flag obj.eval-like names or comments', () => {
  assert.equal(scanText('retrieval(1);\n// eval(x)', { file: 'a' }).length, 0);
});
test('external urls: allowlist honored', () => {
  assert.equal(scanText('http://www.w3.org/2000/svg ws://localhost:43210', { file: 'a' }).length, 0);
  assert.equal(scanText('fetch("https://evil.example/x")', { file: 'a' })[0].rule, 'external-url');
});
test('html: inline script and handlers', () => {
  assert.equal(scanHtml('<script src="/a.js"></script>', 'i').length, 0);
  assert.equal(scanHtml('<script>alert(1)</script>', 'i')[0].rule, 'inline-script');
  assert.equal(scanHtml('<body onload="x()">', 'i')[0].rule, 'inline-event-handler');
});
test('shipped _headers and wrangler.toml pass', () => {
  const h = readFileSync(new URL('../public/_headers', import.meta.url), 'utf8');
  const w = readFileSync(new URL('../wrangler.toml', import.meta.url), 'utf8');
  assert.deepEqual(checkHeaders(h, 'h'), []);
  assert.deepEqual(checkWrangler(w, 'w'), []);
});
test('headers: weakened CSP and blocked autoplay are caught', () => {
  const h = readFileSync(new URL('../public/_headers', import.meta.url), 'utf8');
  assert.ok(checkHeaders(h.replace("'wasm-unsafe-eval'", "'unsafe-eval'"), 'h').length > 0);
  assert.ok(checkHeaders(h.replace('autoplay=(self)', 'autoplay=()'), 'h').length > 0);
  assert.ok(checkHeaders('', 'h').length > 0);
});
test('wrangler: missing field is caught', () => {
  assert.ok(checkWrangler('name = "zonked"\n', 'w').length > 0);
});
