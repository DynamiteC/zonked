// Builds crates/dsp-core to WASM and copies it to src/wasm/dsp_core.wasm.
// Set SKIP_WASM=1 to skip (the committed wasm file is then used as is).
import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const webDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const crate = resolve(webDir, '../crates/dsp-core');
const dest = resolve(webDir, 'src/wasm/dsp_core.wasm');

function fail(msg) {
  console.error(`build-wasm: ${msg}`);
  process.exit(1);
}

function run(cmd, args) {
  const r = spawnSync(cmd, args, { cwd: webDir, stdio: 'inherit' });
  return r.status === 0;
}

if (process.env.SKIP_WASM === '1') {
  if (!existsSync(dest)) fail('SKIP_WASM=1 but src/wasm/dsp_core.wasm does not exist');
  console.log(`build-wasm: skipped (SKIP_WASM=1), using ${statSync(dest).size} bytes`);
  process.exit(0);
}

const wasmPack = resolve(webDir, 'node_modules/.bin/wasm-pack');
let source = null;
if (existsSync(wasmPack) && run(wasmPack, ['build', crate, '--target', 'web', '--release'])) {
  source = resolve(crate, 'pkg/dsp_core_bg.wasm');
} else {
  console.warn('build-wasm: wasm-pack unavailable or failed, falling back to cargo');
  const manifest = resolve(crate, 'Cargo.toml');
  if (!run('cargo', ['build', '--manifest-path', manifest, '--target', 'wasm32-unknown-unknown', '--release'])) {
    fail('both wasm-pack and cargo builds failed');
  }
  source = resolve(crate, 'target/wasm32-unknown-unknown/release/dsp_core.wasm');
  if (!existsSync(source)) source = resolve(webDir, '../target/wasm32-unknown-unknown/release/dsp_core.wasm');
}
if (!existsSync(source)) fail(`wasm output not found at ${source}`);
mkdirSync(dirname(dest), { recursive: true });
copyFileSync(source, dest);
console.log(`build-wasm: wrote ${dest} (${statSync(dest).size} bytes)`);
