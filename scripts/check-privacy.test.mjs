import test from 'node:test';
import assert from 'node:assert/strict';
import { scanText } from './check-privacy.mjs';

const rules = (s, t) => scanText(s, t).map((h) => h.rule);
test('flags a real email, allows noreply and example.invalid', () => {
  assert.deepEqual(rules('a@gmail.com'), ['email']);
  assert.deepEqual(rules('x@users.noreply.github.com y@example.invalid'), []);
});
test('flags home paths', () => {
  assert.ok(rules('/Users/bob/x').includes('home-path'));
  assert.ok(rules('/home/bob/x').includes('home-path'));
  assert.ok(rules('C:\\Users\\bob\\x').includes('home-path'));
});
test('flags workers.dev, github urls, ssh remotes', () => {
  assert.deepEqual(rules('https://a.b.workers.dev'), ['workers-dev', 'hosting']);
  assert.ok(rules('https://github.com/bob/repo').includes('github-name'));
  assert.ok(rules('git@github.com:bob/repo.git').includes('remote-url'));
});
test('flags account id and private keys', () => {
  assert.deepEqual(rules('account id ' + 'a'.repeat(32)), ['account-id']);
  assert.deepEqual(rules('-----BEGIN RSA PRIVATE KEY-----'), ['private-key']);
});
test('private terms match case-insensitively and are not echoed', () => {
  const h = scanText('Hello ZED', ['zed']);
  assert.equal(h[0].rule, 'term');
  assert.ok(!h[0].text.includes('ZED'));
});

import { extractStrings, HOSTING_ALLOWED_FILES } from './check-privacy.mjs';
test('hosting words are flagged unless the file is allow-listed', () => {
  assert.deepEqual(rules('run wrangler now'), ['hosting']);
  assert.deepEqual(rules('Deployed to Vercel'), ['hosting', 'hosting']);
  assert.deepEqual(scanText('run wrangler now', [], { hostingOk: true }), []);
  assert.deepEqual(rules('the word undeployable is fine'), []);
  assert.ok(HOSTING_ALLOWED_FILES.has('web/wrangler.toml'));
});
test('token shapes are flagged', () => {
  const fx = ['AKIA' + 'A'.repeat(16), 'ghp_' + 'a'.repeat(24), 'github_pat_' + 'b'.repeat(24), 'sk-' + 'c'.repeat(24), 'xoxb-' + '1'.repeat(12), 'eyJ' + 'a'.repeat(10) + '.eyJ' + 'b'.repeat(10) + '.' + 'c'.repeat(10)];
  for (const t of fx) assert.deepEqual(rules(`k ${t}`), ['token'], t);
  assert.deepEqual(rules('sk-short and AKIA123'), []);
});
test('github.com with one path segment is flagged', () => {
  assert.deepEqual(rules('https://github.com/bob'), ['github-name']);
  assert.deepEqual(scanText('github.com/sponsors/x', [], { lockfile: true }), []);
});
test('third-party strings are allowed only when listed exactly', () => {
  const o = { thirdParty: ['bbt@3i7.net'] };
  assert.deepEqual(scanText('by bbt@3i7.net', [], o), []);
  assert.deepEqual(scanText('by other@3i7.net', [], o).map((h) => h.rule), ['email']);
});
test('binary strings: printable runs of 6 or more, noisy emails ignored', () => {
  assert.equal(extractStrings(Buffer.from([0, 1, 65, 66, 67, 0, 104, 101, 108, 108, 111, 33, 0])), 'hello!');
  assert.deepEqual(scanText('2+@F.Hu', [], { binary: true }), []);
  assert.deepEqual(scanText('bob@gmail.com', [], { binary: true }).map((h) => h.rule), ['email']);
});
test('file names are scanned as text', () => {
  assert.deepEqual(rules('docs/bob@gmail.com.txt'), ['email']);
});

import { THIRD_PARTY_STRINGS } from './check-privacy.mjs';
test('third-party allow-list is path scoped to legacy/android, legacy/screens, the web lockfile and the scanner itself', () => {
  assert.ok(THIRD_PARTY_STRINGS.every((e) => e.path.test('legacy/android/x') || e.path.test('legacy/screens/x') || e.path.test('web/package-lock.json') || e.path.test('scripts/check-privacy.mjs')));
  assert.ok(!THIRD_PARTY_STRINGS.some((e) => e.path.test('README.md') || e.path.test('docs/a.md')));
});
