// Fails when tracked text files hold an em-dash (U+2014), a section sign (U+00A7) or an emoji.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BINARY = /\.(png|jpe?g|gif|webp|ico|mp4|webm|wasm|pptx|zip|woff2?|ttf)$/i;
const SKIP = /^(legacy\/|scripts\/check-chars\.test\.mjs$)|(^|\/)package-lock\.json$/;
const EMOJI = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B50}\u{2B55}\u{FE0F}\u{200D}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}]/u;

export function scanChars(text) {
  const hits = [];
  text.split('\n').forEach((line, i) => {
    if (line.includes('\u2014')) hits.push({ line: i + 1, what: 'em-dash' });
    if (line.includes('\u00A7')) hits.push({ line: i + 1, what: 'section sign' });
    if (EMOJI.test(line)) hits.push({ line: i + 1, what: 'emoji or symbol' });
  });
  return hits;
}

function main() {
  const files = execFileSync('git', ['ls-files'], { cwd: ROOT, encoding: 'utf8' }).split('\n').filter(Boolean);
  let bad = 0;
  for (const f of files) {
    const p = join(ROOT, f);
    if (SKIP.test(f) || BINARY.test(f) || !existsSync(p)) continue;
    let text;
    try { text = readFileSync(p, 'utf8'); } catch { continue; }
    if (text.includes('\u0000')) continue;
    for (const h of scanChars(text)) { bad++; console.error(`${f}:${h.line} ${h.what}`); }
  }
  if (bad) { console.error(`check:chars: ${bad} finding(s)`); process.exit(1); }
  console.log(`check:chars: clean (${files.length} tracked files)`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
