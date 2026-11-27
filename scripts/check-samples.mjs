#!/usr/bin/env node
// Licence gate for shipped nature samples.
// Every file in web/public/samples must have a row in docs/SAMPLES-LICENSES.md with an allowed
// licence and a matching SHA-256. Rows without a file also fail.
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
export const ALLOWED = ['CC0 1.0', 'Public domain (PD-author, dedicated by the author)'];
const COLS = { file: 0, licence: 4, sha: 9 };

export function parseRows(md) {
  return md.split('\n').filter((l) => /^\|\s*[a-z]+\.mp3\.json\s*\|/.test(l)).map((l) => {
    const c = l.split('|').slice(1, -1).map((s) => s.trim());
    return { file: c[COLS.file], licence: c[COLS.licence], sha: c[COLS.sha] };
  });
}

export function check(files, rows, hashOf, allowed = ALLOWED) {
  const errors = [];
  const byFile = new Map(rows.map((r) => [r.file, r]));
  for (const f of files) {
    const r = byFile.get(f);
    if (r === undefined) { errors.push(`${f}: not listed in docs/SAMPLES-LICENSES.md`); continue; }
    if (!allowed.includes(r.licence)) errors.push(`${f}: licence "${r.licence}" is not in the allow list`);
    if (r.sha !== hashOf(f)) errors.push(`${f}: checksum differs from the table`);
  }
  for (const r of rows) if (!files.includes(r.file)) errors.push(`${r.file}: listed but the file is missing`);
  return errors;
}

function main() {
  const dir = join(ROOT, 'web', 'public', 'samples');
  const doc = join(ROOT, 'docs', 'SAMPLES-LICENSES.md');
  if (!existsSync(doc)) { console.error('check:samples: docs/SAMPLES-LICENSES.md is missing'); process.exit(1); }
  const files = existsSync(dir) ? readdirSync(dir).filter((f) => !f.startsWith('.')) : [];
  const hashOf = (f) => createHash('sha256').update(readFileSync(join(dir, f))).digest('hex');
  const errors = check(files, parseRows(readFileSync(doc, 'utf8')), hashOf);
  for (const e of errors) console.error(`FAIL ${e}`);
  if (errors.length) process.exit(1);
  console.log(`check:samples: ok (${files.length} files, all listed, allowed licence, checksum match)`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
