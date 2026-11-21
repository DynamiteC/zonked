// Orchestrates library-era checks 10 to 20 for verify-e2e.mjs.
import { checksA } from './e2e-checks-a.mjs';
import { bundleCheck, checksB, runMixedContent, timersCheck } from './e2e-checks-b.mjs';
import { newSession, openAdvanced } from './e2e-helpers.mjs';

export async function runLibraryChecks(h) {
  const lib = await newSession(h);
  const reqs = [];
  const audioTypes = [];
  lib.context.on('request', (r) => reqs.push(r.url()));
  lib.context.on('response', (r) => {
    const ct = r.headers()['content-type'] ?? '';
    if (/^(audio|video)\//i.test(ct) || /ogg/i.test(ct)) audioTypes.push(`${r.url()} ${ct}`);
  });
  try {
    await lib.page.goto(`${h.origin}/?e2e=1`);
    await lib.page.getByTestId('play-button').waitFor();
    await openAdvanced(lib.page);
    await checksA(h, lib.page);
    await checksB(h, lib, reqs, audioTypes);
  } finally {
    await lib.context.close().catch(() => {});
  }
  await timersCheck(h);
  await bundleCheck(h);
}

export { runMixedContent };
