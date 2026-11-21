// Shared helpers for verify-e2e.mjs and record-demo.mjs: build, static server, bridge.
import { spawn, spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import net from 'node:net';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const WEB = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export const ROOT = resolve(WEB, '..');
export const BRIDGE_CLI = join(ROOT, 'crew-bridge', 'dist', 'src', 'cli.js');
export const FAKE_CREW = join(ROOT, 'crew-bridge', 'scripts', 'fake-crew.mjs');

export function freePort() {
  return new Promise((res, rej) => {
    const s = net.createServer();
    s.listen(0, '127.0.0.1', () => {
      const { port } = s.address();
      s.close(() => res(port));
    });
    s.on('error', rej);
  });
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export const BRIDGE_PORT = 43210;

/** Always builds fresh. Set ZONKED_SKIP_BUILD=1 to reuse an existing dist on purpose. */
export function ensureBuilt() {
  if (process.env.ZONKED_SKIP_BUILD === '1') {
    if (!existsSync(join(WEB, 'dist', 'index.html'))) throw new Error('ZONKED_SKIP_BUILD=1 but dist is missing');
    console.log('ZONKED_SKIP_BUILD=1: reusing existing dist');
    return;
  }
  console.log('building: npm run build');
  const r = spawnSync('npm', ['run', 'build'], { cwd: WEB, stdio: 'inherit' });
  if (r.status !== 0) throw new Error('build failed');
}

/** True when something already listens on the port. */
export function portInUse(port, host = '127.0.0.1') {
  return new Promise((res) => {
    const s = net.createServer();
    s.once('error', (e) => res(e.code === 'EADDRINUSE'));
    s.listen(port, host, () => s.close(() => res(false)));
  });
}

/** Fails fast with a clear message when the loopback bridge port is taken. */
export async function assertBridgePortFree() {
  if (await portInUse(BRIDGE_PORT)) {
    throw new Error(`port ${BRIDGE_PORT} is already in use: stop the running bridge first, so the tests cannot hit the wrong one`);
  }
}

async function waitHttp(url, ms, proc) {
  const end = Date.now() + ms;
  while (Date.now() < end) {
    if (proc.exitCode !== null) throw new Error('server exited early');
    try {
      const r = await fetch(url);
      if (r.ok) return;
    } catch {
      /* not up yet */
    }
    await sleep(250);
  }
  throw new Error('server did not become ready');
}

/** Starts wrangler dev (assets mode); falls back to vite preview. Returns { origin, kind, stop }. */
export async function startServer() {
  const wrangler = join(WEB, 'node_modules', '.bin', 'wrangler');
  const attempts = [
    ['wrangler dev', (p) => [wrangler, ['dev', '--ip', '127.0.0.1', '--port', String(p), '--show-interactive-dev-session=false']]],
    ['vite preview', (p) => [join(WEB, 'node_modules', '.bin', 'vite'), ['preview', '--host', '127.0.0.1', '--port', String(p), '--strictPort']]],
  ];
  for (const [kind, mk] of attempts) {
    const port = await freePort();
    const [cmd, args] = mk(port);
    const proc = spawn(cmd, args, {
      cwd: WEB,
      stdio: 'ignore',
      detached: true,
      env: { ...process.env, WRANGLER_SEND_METRICS: 'false', CI: '1' },
    });
    const stop = () => {
      try {
        process.kill(-proc.pid, 'SIGTERM');
      } catch {
        /* already gone */
      }
    };
    try {
      const origin = `http://127.0.0.1:${port}`;
      await waitHttp(`${origin}/`, 60000, proc);
      return { origin, kind, stop };
    } catch (e) {
      stop();
      console.log(`${kind} unavailable: ${e.message}`);
    }
  }
  throw new Error('no server could start');
}

/** Spawns the crew bridge CLI. Resolves when /health answers; throws with its output if it exits or never answers. */
export async function startBridge(statePath, origin) {
  await assertBridgePortFree();
  const args = [BRIDGE_CLI, '--state', statePath, '--origin', origin, '--min-transition', '5'];
  const proc = spawn(process.execPath, args, { stdio: ['ignore', 'pipe', 'pipe'] });
  let log = '';
  proc.stdout.on('data', (d) => (log += d));
  proc.stderr.on('data', (d) => (log += d));
  const stop = () =>
    new Promise((res) => {
      if (proc.exitCode !== null || proc.signalCode !== null) return res();
      proc.once('exit', () => res());
      proc.kill('SIGTERM');
    });
  const end = Date.now() + 10000;
  let up = false;
  while (Date.now() < end) {
    if (proc.exitCode !== null) throw new Error(`bridge exited with code ${proc.exitCode}: ${log.trim().slice(-400)}`);
    try {
      const r = await fetch(`http://127.0.0.1:${BRIDGE_PORT}/health`);
      if (r.ok) {
        up = true;
        break;
      }
    } catch {
      /* wait */
    }
    await sleep(100);
  }
  if (!up) {
    await stop();
    throw new Error(`bridge /health did not answer in 10 s: ${log.trim().slice(-400)}`);
  }
  return { proc, log: () => log, stop };
}
