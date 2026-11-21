// Static security audit for the Zonked web app.
// Usage: node scripts/audit-security.mjs   (exit 1 on any finding)
//
// Allowlist (documented here, enforced below):
//  - External URLs: only hosts in ALLOWED_HOSTS (w3.org for XML namespaces,
//    localhost:43210 for the loopback bridge).
//  - Test files (*.test.ts, *.test.tsx) are skipped for source pattern rules,
//    because tests may assert on forbidden strings.
//  - Comment-only lines are skipped for source pattern rules.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ALLOWED_HOSTS = ['www.w3.org', 'w3.org', 'localhost:43210'];
// Documentation links embedded as strings in vendor bundles (React error
// messages, Workbox warnings). They are never fetched; the CSP would block them.
export const VENDOR_DOC_HOSTS = ['react.dev', 'bit.ly'];

export const REQUIRED_HEADERS = [
  ["Content-Security-Policy", "default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; worker-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self' ws://localhost:43210 http://localhost:43210; object-src 'none'; base-uri 'none'; frame-ancestors 'none'"],
  ['Cross-Origin-Opener-Policy', 'same-origin'],
  ['Cross-Origin-Embedder-Policy', 'require-corp'],
  ['Cross-Origin-Resource-Policy', 'same-origin'],
  ['X-Content-Type-Options', 'nosniff'],
  ['Referrer-Policy', 'no-referrer'],
  ['X-Frame-Options', 'DENY'],
];
const REQUIRED_CACHE = [
  ['/assets/*', 'public, max-age=31536000, immutable'],
  ['/index.html', 'no-cache'],
  ['/sw.js', 'no-cache'],
  ['/registerSW.js', 'no-cache'],
  ['/manifest.webmanifest', 'no-cache'],
];
const REQUIRED_WRANGLER = [
  /^name\s*=\s*"zonked"\s*$/m,
  /^compatibility_date\s*=\s*"2026-11-01"\s*$/m,
  /^\[assets\]\s*$/m,
  /^directory\s*=\s*"\.\/dist"\s*$/m,
  /^not_found_handling\s*=\s*"single-page-application"\s*$/m,
];

// Source rules: [id, regex]. Applied to each line.
export const SOURCE_RULES = [
  ['eval', /(^|[^\w.$])eval\s*\(/],
  ['new-function', /\bnew\s+Function\b/],
  ['document-write', /document\s*\.\s*write(ln)?\s*\(/],
  ['html-assignment', /\.\s*(innerHTML|outerHTML)\s*(\+?=)(?!=)/],
  ['insert-adjacent-html', /insertAdjacentHTML\s*\(/],
  ['dangerously-set-inner-html', /dangerouslySetInnerHTML/],
  ['javascript-url', /javascript\s*:/i],
  ['string-timer', /\bset(Timeout|Interval)\s*\(\s*['"`]/],
];

const URL_RE = /\b(?:https?|wss?):\/\/([A-Za-z0-9.-]+(?::\d+)?)/g;

export function scanText(text, { file, sourceRules = true, extraHosts = [] } = {}) {
  const findings = [];
  const lines = text.split(/\r?\n/);
  lines.forEach((line, i) => {
    const trimmed = line.trim();
    const isComment = /^(\/\/|\*|\/\*|<!--)/.test(trimmed);
    if (sourceRules && !isComment) {
      for (const [id, re] of SOURCE_RULES) {
        if (re.test(line)) findings.push({ file, line: i + 1, rule: id, text: trimmed.slice(0, 120) });
      }
    }
    for (const m of line.matchAll(URL_RE)) {
      if (!ALLOWED_HOSTS.includes(m[1]) && !extraHosts.includes(m[1])) {
        findings.push({ file, line: i + 1, rule: 'external-url', text: m[0] });
      }
    }
  });
  return findings;
}

export function scanHtml(text, file) {
  const findings = [];
  const scriptRe = /<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi;
  for (const m of text.matchAll(scriptRe)) {
    if (!/\bsrc\s*=/.test(m[1]) || m[2].trim() !== '') {
      findings.push({ file, line: lineOf(text, m.index), rule: 'inline-script', text: m[0].slice(0, 80) });
    }
  }
  for (const m of text.matchAll(/<[^>]+\s(on[a-z]+)\s*=/gi)) {
    findings.push({ file, line: lineOf(text, m.index), rule: 'inline-event-handler', text: m[1] });
  }
  return findings;
}

function lineOf(text, idx) {
  return text.slice(0, idx).split('\n').length;
}

export function parseHeaders(text) {
  const blocks = new Map();
  let current = null;
  for (const raw of text.split(/\r?\n/)) {
    if (raw.trim() === '' || raw.trim().startsWith('#')) continue;
    if (!/^\s/.test(raw)) {
      current = raw.trim();
      if (!blocks.has(current)) blocks.set(current, new Map());
    } else if (current) {
      const idx = raw.indexOf(':');
      if (idx > 0) blocks.get(current).set(raw.slice(0, idx).trim().toLowerCase(), raw.slice(idx + 1).trim());
    }
  }
  return blocks;
}

export function checkHeaders(text, file) {
  const findings = [];
  const blocks = parseHeaders(text);
  const all = blocks.get('/*');
  if (!all) return [{ file, line: 0, rule: 'headers-missing-block', text: '/*' }];
  for (const [name, value] of REQUIRED_HEADERS) {
    if (all.get(name.toLowerCase()) !== value) {
      findings.push({ file, line: 0, rule: 'headers-value', text: `${name} missing or wrong` });
    }
  }
  const perm = all.get('permissions-policy') ?? '';
  for (const feat of ['camera=()', 'microphone=()', 'geolocation=()']) {
    if (!perm.includes(feat)) findings.push({ file, line: 0, rule: 'headers-permissions', text: `Permissions-Policy lacks ${feat}` });
  }
  if (/autoplay\s*=\s*\(\s*\)/.test(perm)) {
    findings.push({ file, line: 0, rule: 'headers-permissions', text: 'Permissions-Policy blocks autoplay (breaks audio)' });
  }
  for (const [path, value] of REQUIRED_CACHE) {
    if (blocks.get(path)?.get('cache-control') !== value) {
      findings.push({ file, line: 0, rule: 'headers-cache', text: `${path} Cache-Control must be "${value}"` });
    }
  }
  return findings;
}

export function checkWrangler(text, file) {
  return REQUIRED_WRANGLER.filter((re) => !re.test(text)).map((re) => ({
    file, line: 0, rule: 'wrangler-field', text: `missing ${re.source}`,
  }));
}

function walk(dir, out = []) {
  if (!existsSync(dir)) return out;
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const TEXT_EXT = /\.(ts|tsx|js|mjs|html|css|svg|webmanifest|json)$/;
const isTest = (f) => /\.test\.(ts|tsx)$/.test(f);

export function runAudit(webDir) {
  const findings = [];
  const rel = (f) => relative(webDir, f);
  const read = (f) => readFileSync(f, 'utf8');

  for (const f of walk(join(webDir, 'src'))) {
    if (!TEXT_EXT.test(f) || isTest(f)) continue;
    findings.push(...scanText(read(f), { file: rel(f) }));
  }
  const indexHtml = join(webDir, 'index.html');
  if (existsSync(indexHtml)) {
    findings.push(...scanHtml(read(indexHtml), 'index.html'), ...scanText(read(indexHtml), { file: 'index.html' }));
  } else {
    findings.push({ file: 'index.html', line: 0, rule: 'missing-file', text: 'index.html not found' });
  }
  const dist = join(webDir, 'dist');
  if (!existsSync(dist)) {
    findings.push({ file: 'dist', line: 0, rule: 'missing-file', text: 'dist not found, run npm run build first' });
  } else {
    for (const f of walk(dist)) {
      if (!TEXT_EXT.test(f)) continue;
      const text = read(f);
      const sw = /(^|\/)(sw|workbox-[\w-]+)\.js$/.test(f);
      // Bundled vendor code (React) legitimately contains some patterns; dist is
      // scanned for external URLs, inline scripts, and javascript: URLs only.
      findings.push(...scanText(text, { file: rel(f), sourceRules: false, extraHosts: VENDOR_DOC_HOSTS }));
      if (f.endsWith('.html')) findings.push(...scanHtml(text, rel(f)));
      if (!sw && /\.js$/.test(f) && /\bnew\s+Function\s*\(/.test(text) && !/node_modules/.test(f)) {
        findings.push({ file: rel(f), line: 0, rule: 'new-function', text: 'new Function( in built bundle' });
      }
      if (/\bdata:[a-z]+\/[a-z0-9.+-]+[;,]/i.test(text) && /\.(html|css)$/.test(f)) {
        findings.push({ file: rel(f), line: 0, rule: 'data-uri', text: 'data: URI in html/css' });
      }
    }
    if (!existsSync(join(dist, '_headers'))) {
      findings.push({ file: 'dist/_headers', line: 0, rule: 'missing-file', text: 'dist/_headers not present' });
    } else {
      findings.push(...checkHeaders(read(join(dist, '_headers')), 'dist/_headers'));
    }
  }
  const pubHeaders = join(webDir, 'public/_headers');
  if (existsSync(pubHeaders)) findings.push(...checkHeaders(read(pubHeaders), 'public/_headers'));
  else findings.push({ file: 'public/_headers', line: 0, rule: 'missing-file', text: 'not found' });

  const wr = join(webDir, 'wrangler.toml');
  if (existsSync(wr)) findings.push(...checkWrangler(read(wr), 'wrangler.toml'));
  else findings.push({ file: 'wrangler.toml', line: 0, rule: 'missing-file', text: 'not found' });
  return findings;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const webDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
  const findings = runAudit(webDir);
  for (const f of findings) console.error(`${f.file}:${f.line} [${f.rule}] ${f.text}`);
  console.log(`audit:security ${findings.length === 0 ? 'passed' : `FAILED with ${findings.length} finding(s)`}`);
  process.exit(findings.length === 0 ? 0 : 1);
}
