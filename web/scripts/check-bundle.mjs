#!/usr/bin/env node
// First-load budget check. Follows dist/index.html scripts, modulepreloads and stylesheets only,
// gzips at level 9 and fails above BUDGET_KB (JS + CSS). Lazy chunks are listed for information.
import { readFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const DIST = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const BUDGET_KB = 110;

const html = readFileSync(join(DIST, 'index.html'), 'utf8');
const refs = new Set();
for (const m of html.matchAll(/<(script|link)\b[^>]*>/gi)) {
  const tag = m[0];
  const attrs = tag.toLowerCase();
  const href = /(?:src|href)=["']([^"']+)["']/i.exec(tag)?.[1];
  if (href === undefined || !href.startsWith('/assets/')) continue;
  const isScript = attrs.startsWith('<script');
  const rel = /rel=["']([^"']+)["']/i.exec(tag)?.[1]?.toLowerCase();
  if (isScript || rel === 'modulepreload' || rel === 'stylesheet') refs.add(href.slice(1));
}

const gz = (file) => gzipSync(readFileSync(join(DIST, file)), { level: 9 }).length;
const kb = (n) => (n / 1024).toFixed(2);

let js = 0;
let css = 0;
console.log('First load (index.html):');
console.log('file'.padEnd(44), 'raw KB'.padStart(9), 'gzip KB'.padStart(9));
for (const f of refs) {
  const raw = readFileSync(join(DIST, f)).length;
  const z = gz(f);
  if (f.endsWith('.css')) css += z;
  else if (f.endsWith('.js')) js += z;
  console.log(f.padEnd(44), kb(raw).padStart(9), kb(z).padStart(9));
}
const total = js + css;
console.log(`JS ${kb(js)} KB + CSS ${kb(css)} KB = ${kb(total)} KB gzip (budget ${BUDGET_KB} KB)`);

console.log('\nLazy chunks (not first load):');
for (const f of readdirSync(join(DIST, 'assets')).sort()) {
  const p = `assets/${f}`;
  if (refs.has(p) || !f.endsWith('.js')) continue;
  console.log(p.padEnd(44), kb(readFileSync(join(DIST, p)).length).padStart(9), kb(gz(p)).padStart(9));
}

if (refs.size === 0) {
  console.error('FAIL: no first-load assets found in dist/index.html');
  process.exit(1);
}
if (total > BUDGET_KB * 1024) {
  console.error(`FAIL: first load ${kb(total)} KB exceeds ${BUDGET_KB} KB`);
  process.exit(1);
}
console.log('PASS');
