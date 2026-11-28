#!/usr/bin/env node
// Runs every local gate in order, prints a timing table and stops on the first failure.
// Env VERIFY_ONLY=name1,name2 runs only those stages; VERIFY_SKIP=name1 skips stages.
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const WASM = join(ROOT, 'web', 'src', 'wasm', 'dsp_core.wasm');
const hashWasm = () => (existsSync(WASM) ? createHash('sha256').update(readFileSync(WASM)).digest('hex') : 'missing');

const PIN = join(ROOT, 'web', 'src', 'wasm', 'dsp_core.wasm.sha256');
const loud = (lines) => console.error(`\n${'!'.repeat(72)}\n${lines.join('\n')}\n${'!'.repeat(72)}`);
const git = (args) => spawnSync('git', args, { cwd: ROOT, encoding: 'utf8' });

/** A run only counts for the commit it ran on, so a dirty tree fails loudly. VERIFY_ALLOW_DIRTY=1 is for local work and is printed. */
function commitStamp() {
  const head = git(['rev-parse', 'HEAD']).stdout.trim();
  const dirty = git(['status', '--porcelain', '--untracked-files=normal']).stdout.trim();
  console.log(`commit under test: ${head || 'unknown'}`);
  if (dirty === '') return true;
  if (process.env.VERIFY_ALLOW_DIRTY === '1') {
    console.log('WARNING: VERIFY_ALLOW_DIRTY=1, the tree has uncommitted changes, this run does not prove the commit.');
    return true;
  }
  loud(['verify:all refused: the working tree has uncommitted changes, so a pass would not prove any commit.', 'Commit or stash first (VERIFY_ALLOW_DIRTY=1 only for local work).']);
  return false;
}

/** The built wasm must match the pinned hash. Update the pin only on purpose: node scripts/verify-all.mjs --write-wasm-hash */
function wasmPinned() {
  const got = hashWasm();
  const want = existsSync(PIN) ? readFileSync(PIN, 'utf8').trim() : 'missing';
  if (got === want) return true;
  loud([`web/src/wasm/dsp_core.wasm does not match web/src/wasm/dsp_core.wasm.sha256`, `built:  ${got}`, `pinned: ${want}`, 'Rebuild with the pinned toolchain (rust-toolchain.toml). If the DSP changed on purpose: node scripts/verify-all.mjs --write-wasm-hash']);
  return false;
}

/** Builds HEAD from a fresh clone with npm ci, so a stale node_modules or an uncommitted file cannot hide a broken build (the glob override included). */
function cleanCloneBuild() {
  const dir = mkdtempSync(join(tmpdir(), 'zk-clean-'));
  try {
    const run = (cmd, cwd) => spawnSync(cmd, { cwd, shell: true, stdio: 'inherit' }).status === 0;
    if (!run(`git clone --quiet --no-hardlinks "${ROOT}" "${dir}"`, ROOT)) return false;
    if (!run('npm ci', join(dir, 'web')) || !run('npm run build', join(dir, 'web'))) return false;
    const built = createHash('sha256').update(readFileSync(join(dir, 'web', 'src', 'wasm', 'dsp_core.wasm'))).digest('hex');
    const want = readFileSync(PIN, 'utf8').trim();
    if (built === want) return true;
    loud(['The clean-clone build produced a different wasm.', `built:  ${built}`, `pinned: ${want}`]);
    return false;
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

const ANSI = /\u001b\[[0-9;]*m/g;
/** Parsers read the real run output, so the numbers in the docs are never typed by hand. */
export const COUNTERS = {
  rust: (t) => [...t.matchAll(/test result: ok\. (\d+) passed/g)].reduce((n, m) => n + Number(m[1]), 0),
  vitest: (t) => ({ tests: Number(/Tests\s+(\d+) passed/.exec(t)?.[1] ?? NaN), files: Number(/Test Files\s+(\d+) passed/.exec(t)?.[1] ?? NaN) }),
  nodeTest: (t) => Number(/ℹ pass (\d+)/.exec(t)?.[1] ?? NaN),
  checks: (t) => ({ passed: Number(/(\d+)\/(\d+) checks passed/.exec(t)?.[1] ?? NaN), total: Number(/(\d+)\/(\d+) checks passed/.exec(t)?.[2] ?? NaN) }),
};
const counts = {};

/** Runs a shell command, echoes its output, and stores a count when a counter is given. */
const sh = (name, cmd, cwd = '.', counter = null, env = process.env) => ({
  name,
  run: () => {
    const r = spawnSync(cmd, { cwd: join(ROOT, cwd), shell: true, encoding: 'utf8', maxBuffer: 256 * 1024 * 1024, env });
    process.stdout.write(r.stdout ?? '');
    process.stderr.write(r.stderr ?? '');
    if (counter !== null) counts[name] = COUNTERS[counter](`${r.stdout ?? ''}${r.stderr ?? ''}`.replace(ANSI, ''));
    return r.status === 0;
  },
});
let wasmBefore = '';

export const STAGES = [
  { name: 'commit-stamp', run: commitStamp },
  { name: 'wasm-hash-before', run: () => ((wasmBefore = hashWasm()), true) },
  // npm ci installs exactly what the lockfiles say. Install scripts stay off (.npmrc ignore-scripts), see docs/BUILD.md.
  sh('install', 'npm ci --prefix web && npm ci --prefix crew-bridge && npm ci --prefix app/ui'),
  sh('cargo-test', 'cargo test --locked --manifest-path crates/dsp-core/Cargo.toml', '.', 'rust'),
  sh('clippy', 'cargo clippy --locked --manifest-path crates/dsp-core/Cargo.toml --all-targets -- -D warnings'),
  sh('no-buildrs', 'node scripts/check-no-buildrs.mjs'),
  sh('bridge-tests', 'npm --prefix crew-bridge test', '.', 'nodeTest'),
  sh('app-backend-tests', 'node --test app/backend/test', '.', 'nodeTest'),
  sh('web-build', 'npm --prefix web run build'),
  sh('typecheck', 'npm --prefix web run typecheck'),
  sh('vitest', 'npm --prefix web test', '.', 'vitest'),
  sh('check-bundle', 'npm --prefix web run check:bundle'),
  sh('audit-security', 'npm --prefix web run audit:security'),
  sh('check-privacy', 'npm --prefix web run check:privacy'),
  sh('check-chars', 'node scripts/check-chars.mjs'),
  sh('check-sizes', 'node scripts/check-sizes.mjs'),
  sh('check-samples', 'node scripts/check-samples.mjs'),
  sh('npm-audit', 'npm audit --prefix web --audit-level=low && npm audit --prefix crew-bridge --audit-level=low && npm audit --prefix app/ui --audit-level=low'),
  sh('web-script-tests', 'npm --prefix web run test:scripts', '.', 'nodeTest'),
  sh('root-script-tests', 'node --test scripts/', '.', 'nodeTest'),
  { name: 'wasm-pinned', run: wasmPinned },
  { name: 'clean-clone-build', run: cleanCloneBuild },
  sh('app-dist-fresh', 'npm --prefix app/ui run check:dist'),
  { name: 'wasm-drift', run: () => hashWasm() === wasmBefore || (console.error('web/src/wasm/dsp_core.wasm changed during the build: rebuild is not reproducible or the committed file is stale'), false) },
  // Real browser, real engine, on the commit stamped above: output peak while hot settings play, soft start, stop ramp, no off-origin request.
  // The Vitest suites stub the audio engine; only this stage reads the real output.
  // The build above is fresh, so the e2e run may reuse it.
  sh('verify-e2e', 'npm --prefix web run verify:e2e', '.', 'checks', { ...process.env, ZONKED_SKIP_BUILD: '1' }),
  // axe-core on every main screen, light and dark, phone and desktop, plus a keyboard pass. Automated only: see docs/ACCESSIBILITY.md.
  sh('a11y-check', 'npm --prefix web run check:a11y', '.', null, { ...process.env, ZONKED_SKIP_BUILD: '1' }),
  // Three engines, three viewports. It builds HEAD in its own worktree and writes .work/matrix/results.json.
  sh('browser-matrix', 'node web/scripts/browser-matrix.mjs'),
];

export function pick(stages, only, skip) {
  const o = only ? only.split(',') : null;
  const s = skip ? skip.split(',') : [];
  return stages.filter((st) => st.name === 'wasm-hash-before' || ((!o || o.includes(st.name)) && !s.includes(st.name)));
}

function main() {
  if (process.argv.includes('--write-wasm-hash')) {
    writeFileSync(PIN, `${hashWasm()}\n`);
    console.log(`wrote ${PIN}`);
    return;
  }
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
  if (!failed && !process.env.VERIFY_ONLY && !process.env.VERIFY_SKIP) {
    mkdirSync(join(ROOT, '.work'), { recursive: true });
    const head = git(['rev-parse', 'HEAD']).stdout.trim();
    writeFileSync(join(ROOT, '.work', 'verify-results.json'), `${JSON.stringify({ commit: head, date: new Date().toISOString(), counts, stages: rows.map((r) => r.name) }, null, 2)}\n`);
    console.log('wrote .work/verify-results.json, run: node scripts/update-counts.mjs');
  }
  process.exit(failed ? 1 : 0);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main();
