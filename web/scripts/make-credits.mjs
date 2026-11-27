// Builds web/src/ui/calm/nature/credits.json from the shipped-files table in docs/SAMPLES-LICENSES.md.
// The app reads the JSON offline. It holds names as plain text only, never links.
// Run after the licence table changes: node web/scripts/make-credits.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const DOC = join(ROOT, 'docs', 'SAMPLES-LICENSES.md');
const OUT = join(ROOT, 'web', 'src', 'ui', 'calm', 'nature', 'credits.json');

export function fileName(page) {
  const last = page.split('/').pop() ?? '';
  try {
    return decodeURIComponent(last);
  } catch {
    return last;
  }
}

export function parseCredits(md) {
  const rows = md.split('\n').filter((l) => /^\| [a-z]+\.mp3\.json \|/.test(l));
  return rows.map((l) => {
    const c = l.split('|').map((x) => x.trim());
    return { id: c[1].replace('.mp3.json', ''), title: c[2], author: c[3], source: `Wikimedia Commons, ${fileName(c[4])}`, licence: c[5] };
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const credits = parseCredits(readFileSync(DOC, 'utf8'));
  writeFileSync(OUT, `${JSON.stringify(credits, null, 2)}\n`);
  console.log(`credits: ${credits.length} entries`);
}
