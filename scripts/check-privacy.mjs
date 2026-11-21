// Privacy scanner: fails when project files carry personal or account identifiers.
// Scans tracked and untracked (not ignored) files, file names, binary and media strings, and hosting words.
// Optional untracked file .privacy-terms (one term per line) adds exact, case-insensitive terms.
import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BINARY = /\.(png|jpe?g|gif|webp|ico|mp4|webm|wasm|pptx|zip|woff2?|ttf)$/i;
// Binary and media files get an in-process printable-strings pass (metadata, embedded text).
const STRINGS_SCANNED = /\.(png|jpe?g|mp4|webm|pptx|wasm)$/i;
const MIN_STRING = 6;
// The scanner's own test holds synthetic fixtures that match the rules on purpose.
const SELF_TEST = /^scripts\/check-privacy\.test\.mjs$/;
const ALLOWED_EMAIL = /@(users\.noreply\.github\.com|noreply\.[a-z.]+|example\.(invalid|com|org|net)|[a-z0-9.-]*\.invalid)$/i;
// Third-party attribution that must stay (GPL sources keep their original credit).
// Holds ONLY third-party strings that already appear in legacy/. A line that contains one of these
// exact strings may also contain a rule match that is part of that string.
export const THIRD_PARTY_STRINGS = [
  { path: /^legacy\/(android|screens)\//, strings: ['github.com/GiorgioRegni', 'github.com/articles', 'bbt@3i7.net'] },
  { path: /^scripts\/check-privacy\.mjs$/, strings: ['github.com/GiorgioRegni', 'github.com/articles', 'bbt@3i7.net', 'i@izs.me'] },
  { path: /^web\/package-lock\.json$/, strings: ['i@izs.me'] },
];
const thirdPartyFor = (f) => THIRD_PARTY_STRINGS.filter((e) => e.path.test(f)).flatMap((e) => e.strings);
// Lockfiles list third-party package funding and repository links.
const LOCKFILE = /(^|\/)package-lock\.json$/;
// Files where hosting words are legitimate: local dev server, the dev dependency, the demo scripts, the rule itself.
export const HOSTING_ALLOWED_FILES = new Set([
  'scripts/check-privacy.mjs',
  'web/wrangler.toml',
  'web/package.json',
  'web/package-lock.json',
  'web/.gitignore',
  'web/scripts/audit-security.mjs',
  'web/scripts/audit-security.test.mjs',
  'web/scripts/e2e-lib.mjs',
  'web/scripts/verify-e2e.mjs',
  'web/scripts/record-demo.mjs',
  'web/scripts/demo-lib.mjs',
]);

export const RULES = [
  { id: 'email', re: /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}\b/g, ok: (m, o) => ALLOWED_EMAIL.test(m) || (o?.binary && !/^[A-Za-z0-9._-]{3,}@/.test(m)) || /\.(png|jpe?g|svg|webp|css|js|mjs|ts|tsx|wasm)$/i.test(m) },
  { id: 'home-path', re: /(?:\/Users\/[A-Za-z0-9._-]+|\/home\/[A-Za-z0-9._-]+|[A-Za-z]:\\Users\\[A-Za-z0-9._-]+)/g, ok: (m) => /\/(you|user|name|username|runner|x)$/i.test(m) },
  { id: 'workers-dev', re: /[A-Za-z0-9.-]+\.workers\.dev\b/g, ok: () => false },
  { id: 'github-name', re: /github\.com[/:][A-Za-z0-9_-]+/g, ok: () => false },
  { id: 'remote-url', re: /git@[A-Za-z0-9.-]+:[A-Za-z0-9._/-]+/g, ok: () => false },
  { id: 'account-id', re: /account[^\n]{0,24}\b[0-9a-f]{32}\b|\b[0-9a-f]{32}\b[^\n]{0,24}account/gi, ok: () => false },
  { id: 'private-key', re: /-----BEGIN [A-Z ]*PRIVATE KEY-----/g, ok: () => false },
  { id: 'token', re: /\bAKIA[0-9A-Z]{16}\b|\bghp_[A-Za-z0-9]{20,}|\bgithub_pat_[A-Za-z0-9_]{20,}|\bsk-[A-Za-z0-9_-]{20,}|\bxox[bap]-[A-Za-z0-9-]{10,}|\beyJ[A-Za-z0-9_-]{8,}\.eyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}/g, ok: () => false },
  { id: 'hosting', re: /\b(?:wrangler|workers\.dev|cloudflare|deploy|deployed|deployment|route53|netlify|vercel)\b/gi, ok: () => false, fileAllowList: true },
];

/** opts.hostingOk skips the hosting rule; opts.thirdParty lists exact strings allowed on a line. */
export function scanText(text, terms = [], opts = {}) {
  const hits = [];
  const allow = opts.thirdParty ?? [];
  text.split('\n').forEach((line, i) => {
    for (const r of RULES) {
      if (r.fileAllowList && opts.hostingOk) continue;
      if (r.id === 'github-name' && opts.lockfile) continue;
      for (const m of line.matchAll(r.re)) {
        if (r.ok(m[0], opts) || allow.some((a) => a && line.includes(a) && a.includes(m[0]))) continue;
        hits.push({ line: i + 1, rule: r.id, text: m[0].slice(0, 60) });
      }
    }
    const low = line.toLowerCase();
    terms.forEach((t, k) => { if (low.includes(t)) hits.push({ line: i + 1, rule: 'term', text: `private term #${k + 1}` }); });
  });
  return hits;
}

export function loadTerms(file) {
  if (!existsSync(file)) return [];
  return readFileSync(file, 'utf8').split('\n').map((s) => s.trim().toLowerCase()).filter(Boolean);
}

/** Printable ASCII runs of at least MIN_STRING chars, one per line, like the strings tool. */
export function extractStrings(buf) {
  return buf.toString('latin1').match(new RegExp(`[\\x20-\\x7e]{${MIN_STRING},}`, 'g'))?.join('\n') ?? '';
}

function main() {
  const files = execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard'], { cwd: ROOT, encoding: 'utf8' }).split('\n').filter(Boolean);
  const terms = loadTerms(join(ROOT, '.privacy-terms'));
  let bad = 0;
  const report = (f, h) => { bad++; console.error(`${f}:${h.line} [${h.rule}] ${h.text}`); };
  for (const f of files) {
    if (SELF_TEST.test(f)) continue;
    const p = join(ROOT, f);
    if (!existsSync(p)) continue;
    const opts = { hostingOk: HOSTING_ALLOWED_FILES.has(f), thirdParty: thirdPartyFor(f), lockfile: LOCKFILE.test(f) };
    for (const h of scanText(f, terms, opts)) report(f, { ...h, line: 0 });
    if (BINARY.test(f)) {
      if (!STRINGS_SCANNED.test(f)) continue;
      for (const h of scanText(extractStrings(readFileSync(p)), terms, { ...opts, binary: true })) report(`${f} (strings)`, h);
      continue;
    }
    let text;
    try { text = readFileSync(p, 'utf8'); } catch { continue; }
    if (text.includes('\u0000')) continue;
    for (const h of scanText(text, terms, opts)) report(f, h);
  }
  if (bad) { console.error(`privacy scan: ${bad} finding(s)`); process.exit(1); }
  console.log(`privacy scan: clean (${files.length} files, ${terms.length} private terms)`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
