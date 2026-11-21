#!/usr/bin/env node
// Runs every local gate in order, prints a timing table and stops on the first failure.
// Env VERIFY_ONLY=name1,name2 runs only those stages; VERIFY_SKIP=name1 skips stages.
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const WASM = join(ROOT, 'web', 'src', 'wasm', 'dsp_core.wasm');
const hashWasm = () => (existsSync(WASM) ? createHash('sha256').update(readFileSync(WASM)).digest('hex') : 'missing');

const sh = (name, cmd, cwd = '.') => ({ name, run: () => spawnSync(cmd, { cwd: join(ROOT, cwd), shell: true, stdio: 'inherit' }).status === 0 });
let wasmBefore = '';

export const STAGES = [
  { name: 'wasm-hash-before', run: () => ((wasmBefore = hashWasm()), true) },
  sh('cargo-test', 'cargo test --manifest-path crates/dsp-core/Cargo.toml'),
  sh('clippy', 'cargo clippy --manifest-path crates/dsp-core/Cargo.toml --all-targets -- -D warnings'),
  sh('no-buildrs', 'node scripts/check-no-buildrs.mjs'),
  sh('bridge-tests', 'npm --prefix crew-bridge test'),
  sh('web-build', 'npm --prefix web run build'),
  sh('typecheck', 'npm --prefix web run typecheck'),
  sh('vitest', 'npm --prefix web test'),
  sh('check-bundle', 'npm --prefix web run check:bundle'),
  sh('audit-security', 'npm --prefix web run audit:security'),
  sh('check-privacy', 'npm --prefix web run check:privacy'),
  sh('check-chars', 'node scripts/check-chars.mjs'),
  sh('check-sizes', 'node scripts/check-sizes.mjs'),
  sh('web-script-tests', 'npm --prefix web run test:scripts'),
  sh('root-script-tests', 'node --test scripts/'),
  { name: 'wasm-drift', run: () => hashWasm() === wasmBefore || (console.error('web/src/wasm/dsp_core.wasm changed during the build: rebuild is not reproducible or the committed file is stale'), false) },
  // The build above is fresh, so the e2e run may reuse it.
  { name: 'verify-e2e', run: () => spawnSync('npm --prefix web run verify:e2e', { cwd: ROOT, shell: true, stdio: 'inherit', env: { ...process.env, ZONKED_SKIP_BUILD: '1' } }).status === 0 },
];

export function pick(stages, only, skip) {
  const o = only ? only.split(',') : null;
  const s = skip ? skip.split(',') : [];
  return stages.filter((st) => st.name === 'wasm-hash-before' || ((!o || o.includes(st.name)) && !s.includes(st.name)));
}

function main() {
  const rows = [];
  let failed = false;
  for (const st of pick(STAGES, process.env.VERIFY_ONLY, process.env.VERIFY_SKIP)) {
    console.log(`\n=== ${st.name} ===`);
    const t = Date.now();
    const ok = st.run();
    rows.push({ name: st.name, ok, sec: ((Date.now() - t) / 1000).toFixed(1) });
    if (!ok) { failed = true; break; }
  }
  console.log('\nstage'.padEnd(22) + 'result  seconds');
  for (const r of rows) console.log(r.name.padEnd(21) + (r.ok ? 'pass    ' : 'FAIL    ') + r.sec);
  console.log(failed ? '\nverify:all FAILED' : '\nverify:all passed');
  process.exit(failed ? 1 : 0);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
