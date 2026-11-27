// Zonked crew backend. Started by the Kiro Crew gateway (backend.type "node"), which sets PORT and
// KIROCREW_PROXY_SECRET. Binds 127.0.0.1 only. No shell, no outbound network, no dependencies.
//
// The gateway proxy maps /apps/zonked/api/<path> to /api/<path> on this process.
import http from 'node:http';
import { pathToFileURL } from 'node:url';
import { MAX_BODY_BYTES, VERSION } from './core.mjs';
import { createProxyV2Verifier } from './proxy-auth.mjs';
import { createStore, resolveDataDir } from './store.mjs';
import { runTool } from './tools.mjs';

const JSON_HEADERS = { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' };

function send(res, status, body) {
  res.writeHead(status, JSON_HEADERS);
  res.end(JSON.stringify(body));
}

/** Reads at most MAX_BODY_BYTES. Resolves null (and answers 413) when the body is larger. */
function readBody(req, res) {
  return new Promise((resolve) => {
    const declared = Number(req.headers['content-length'] ?? 0);
    if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) {
      send(res, 413, { error: 'body too large' });
      req.destroy();
      resolve(null);
      return;
    }
    const chunks = [];
    let size = 0;
    req.on('data', (c) => {
      size += c.length;
      if (size > MAX_BODY_BYTES) {
        send(res, 413, { error: 'body too large' });
        req.destroy();
        resolve(null);
      } else chunks.push(c);
    });
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', () => resolve(null));
  });
}

function parseJson(bytes) {
  try {
    return { ok: true, value: JSON.parse(bytes.toString('utf8')) };
  } catch {
    return { ok: false };
  }
}

function replyReport(res, result) {
  if (!result.ok) return send(res, 400, { error: result.error });
  return send(res, 200, { version: VERSION, crew: result.state, warnings: result.warnings });
}

export function createHandler({ store, secret = '', allowUnsigned = false }) {
  const verify = createProxyV2Verifier(secret);
  const authorized = (req, body) => {
    if (secret === '') return allowUnsigned;
    const target = req.url ?? '';
    return verify({
      method: req.method, target, body,
      signature: req.headers['x-kirocrew-proxy-v2'], nonce: req.headers['x-kirocrew-proxy-nonce'],
    });
  };
  const routes = {
    'GET /api/state': () => ({ status: 200, body: { version: VERSION, crew: store.state() } }),
    'GET /api/suggestion': () => ({ status: 200, body: store.suggestion() }),
  };
  return async function handle(req, res) {
    const path = (req.url ?? '').split('?')[0];
    if (req.method === 'GET' && path === '/health') return send(res, 200, { ok: true, version: VERSION });
    const key = `${req.method} ${path}`;
    const isPost = key === 'POST /api/intensity' || key === 'POST /api/agent-tools';
    if (!isPost && routes[key] === undefined) return send(res, path.startsWith('/api/') ? 405 : 404, { error: 'not found' });
    const body = isPost ? await readBody(req, res) : Buffer.alloc(0);
    if (body === null) return undefined;
    if (!authorized(req, body)) return send(res, 401, { error: 'unauthorized' });
    if (!isPost) {
      const r = routes[key]();
      return send(res, r.status, r.body);
    }
    const parsed = parseJson(body);
    if (!parsed.ok) return send(res, 400, { error: 'body is not valid JSON' });
    if (key === 'POST /api/intensity') return replyReport(res, store.report(parsed.value));
    return send(res, 200, runTool(store, parsed.value));
  };
}

export function start(env = process.env) {
  const port = Number(env.PORT);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT must be set by the gateway');
  const store = createStore(resolveDataDir(env.ZONKED_DATA));
  const handle = createHandler({ store, secret: env.KIROCREW_PROXY_SECRET ?? '' });
  const server = http.createServer((req, res) => {
    handle(req, res).catch(() => send(res, 500, { error: 'internal error' }));
  });
  server.headersTimeout = 10_000;
  server.requestTimeout = 10_000;
  server.listen(port, '127.0.0.1');
  return server;
}

if (process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href) start();
