// Verifier for the gateway's signed proxy header (X-KiroCrew-Proxy-V2). Same algorithm as the
// reference verifier in the App Kit API reference, with a nonce cache so a replay is refused.
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

const MAX_SKEW_SECONDS = 60;
const NONCE_RE = /^[0-9a-f]{32}$/;
const TIMESTAMP_RE = /^[0-9]{1,12}$/;

export function createProxyV2Verifier(secret, { maxEntries = 4096 } = {}) {
  const seen = new Map();
  return function verify({ method, target, body, signature, nonce, now = Date.now() / 1000 }) {
    if (!secret || typeof signature !== 'string' || typeof nonce !== 'string' || !NONCE_RE.test(nonce)) return false;
    const sep = signature.indexOf(':');
    if (sep < 0) return false;
    const ts = signature.slice(0, sep);
    if (!TIMESTAMP_RE.test(ts) || Math.abs(now - Number(ts)) > MAX_SKEW_SECONDS) return false;
    const bodyHash = createHash('sha256').update(body ?? Buffer.alloc(0)).digest('hex');
    const expected = Buffer.from(createHmac('sha256', secret).update(`v2:${ts}:${nonce}:${method}:${target}:${bodyHash}`).digest('hex'), 'utf8');
    const given = Buffer.from(signature.slice(sep + 1), 'utf8');
    if (given.length !== expected.length || !timingSafeEqual(given, expected)) return false;
    for (const [key, expiry] of seen) if (expiry < now) seen.delete(key);
    if (seen.has(nonce) || seen.size >= maxEntries) return false;
    seen.set(nonce, Number(ts) + MAX_SKEW_SECONDS);
    return true;
  };
}
