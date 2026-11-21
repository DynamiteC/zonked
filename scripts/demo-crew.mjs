#!/usr/bin/env node
// Local crew demo: bridge on 43210, fake crew writer, and the built web app on 4173. Stop with Ctrl+C.
import { spawn, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import net from 'node:net';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const BRIDGE = join(ROOT, 'crew-bridge');
const CLI = join(BRIDGE, 'dist', 'src', 'cli.js');
const kids = [];

const busy = (port) =>
  new Promise((res) => {
    const s = net.createServer();
    s.once('error', (e) => res(e.code === 'EADDRINUSE'));
    s.listen(port, '127.0.0.1', () => s.close(() => res(false)));
  });

function stopAll() {
  for (const k of kids) { try { k.kill('SIGTERM'); } catch { /* gone */ } }
}

function start(cmd, args, cwd) {
  const p = spawn(cmd, args, { cwd, stdio: 'inherit' });
  kids.push(p);
  p.once('exit', (code) => {
    if (code && code !== 143) { console.error(`${cmd} ${args[0] ?? ''} exited with code ${code}`); stopAll(); process.exit(1); }
  });
  return p;
}

async function main() {
  for (const port of [43210, 4173]) {
    if (await busy(port)) { console.error(`port ${port} is already in use: stop what runs there and try again`); process.exit(1); }
  }
  if (!existsSync(CLI)) {
    console.log('building crew-bridge');
    if (spawnSync('npm', ['run', 'build'], { cwd: BRIDGE, stdio: 'inherit' }).status !== 0) process.exit(1);
  }
  if (!existsSync(join(ROOT, 'web', 'dist', 'index.html'))) {
    console.log('building web');
    if (spawnSync('npm', ['--prefix', 'web', 'run', 'build'], { cwd: ROOT, stdio: 'inherit' }).status !== 0) process.exit(1);
  }
  const state = join(ROOT, '.zonked-state.json');
  const signals = join(ROOT, '.zonked-signals.json');
  start(process.execPath, [CLI, '--state', state, '--signals', signals, '--min-transition', '5', '--origin', 'http://localhost:4173'], ROOT);
  start(process.execPath, [join(BRIDGE, 'scripts', 'fake-crew.mjs'), '--state', state], ROOT);
  start('npm', ['--prefix', 'web', 'run', 'preview', '--', '--host', '127.0.0.1', '--port', '4173', '--strictPort'], ROOT);
  console.log('\n1. Open http://localhost:4173/?crew=1 in Chrome or Firefox.');
  console.log('2. Press Play. The badge shows Crew Synced and the sound follows the burnout score.');
  console.log('3. Press Ctrl+C here to stop everything.\n');
}

process.on('SIGINT', () => { stopAll(); process.exit(0); });
process.on('SIGTERM', () => { stopAll(); process.exit(0); });
main();
