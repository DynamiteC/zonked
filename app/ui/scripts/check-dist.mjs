// Fails when the committed dist/ differs from a fresh build of the current sources.
//   node app/ui/scripts/check-dist.mjs
import { spawnSync } from 'node:child_process';
import { mkdtempSync, readdirSync, readFileSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const uiDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const fresh = mkdtempSync(join(tmpdir(), 'zk-dist-'));

const walk = (root, dir = root, out = new Map()) => {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(root, p, out);
    else out.set(p.slice(root.length + 1), readFileSync(p));
  }
  return out;
};

try {
  const r = spawnSync('npx', ['vite', 'build', '--outDir', fresh, '--emptyOutDir'], { cwd: uiDir, stdio: 'ignore' });
  if (r.status !== 0) throw new Error('vite build failed');
  const a = walk(join(uiDir, 'dist'));
  const b = walk(fresh);
  const diff = [...new Set([...a.keys(), ...b.keys()])].filter((k) => !a.has(k) || !b.has(k) || !a.get(k).equals(b.get(k)));
  if (diff.length > 0) {
    console.error(`dist is stale (${diff.length} file(s) differ): ${diff.slice(0, 5).join(', ')}. Run: npm --prefix app/ui run build`);
    process.exitCode = 1;
  } else console.log(`dist is fresh (${a.size} files)`);
} catch (e) {
  console.error(String(e instanceof Error ? e.message : e));
  process.exitCode = 1;
} finally {
  rmSync(fresh, { recursive: true, force: true });
}
