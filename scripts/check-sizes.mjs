// Size gate for tracked ts, tsx, rs and mjs files outside legacy and lockfiles.
// Fails above 800 lines, warns above 400 and lists every offender.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const WARN = 400;
export const FAIL = 800;
const COUNTED = /\.(ts|tsx|rs|mjs)$/;

export const counts = (path) => (path.startsWith('legacy/') ? false : COUNTED.test(path));
export const level = (lines) => (lines > FAIL ? 'fail' : lines > WARN ? 'warn' : 'ok');
export const lineCount = (text) => (text === '' ? 0 : text.split('\n').length - (text.endsWith('\n') ? 1 : 0));

function main() {
  const files = execFileSync('git', ['ls-files'], { cwd: ROOT, encoding: 'utf8' }).split('\n').filter(counts);
  const rows = [];
  for (const f of files) {
    const p = join(ROOT, f);
    if (existsSync(p)) rows.push({ f, n: lineCount(readFileSync(p, 'utf8')) });
  }
  rows.sort((a, b) => b.n - a.n);
  let fail = 0;
  for (const { f, n } of rows) {
    const l = level(n);
    if (l === 'ok') break;
    if (l === 'fail') fail++;
    console.log(`${l === 'fail' ? 'FAIL' : 'warn'} ${n} ${f}`);
  }
  if (fail) { console.error(`check:sizes: ${fail} file(s) over ${FAIL} lines`); process.exit(1); }
  console.log(`check:sizes: ok (${rows.length} files, none over ${FAIL})`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
