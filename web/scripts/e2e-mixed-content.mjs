// Informational probe: a hosted https page against the loopback bridge. Skipped unless ZONKED_LIVE_URL is set.
import { startBridge } from './e2e-lib.mjs';
import { nav, newSession } from './e2e-helpers.mjs';

/** Hosted https page (URL from ZONKED_LIVE_URL) against the loopback bridge. Informational only. */
export async function runMixedContent(h) {
  const { info } = h;
  const site = process.env.ZONKED_LIVE_URL;
  if (!site) {
    info.push('mixed content: ZONKED_LIVE_URL not set; skipped');
    return;
  }
  let bridge;
  try {
    const res = await fetch(`${site}/`, { method: 'HEAD', signal: AbortSignal.timeout(15000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
  } catch (e) {
    info.push(`mixed content: ${site} not reachable from this machine (${e.cause?.code ?? e.message}); not tested`);
    return;
  }
  try {
    h.writeState(40, 'flow', 'flow-state', 18, 220, false);
    bridge = await startBridge(h.statePath, site);
    const s = await newSession(h, { crew: true });
    try {
      try {
        await s.context.grantPermissions(['local-network-access'], { origin: site });
      } catch {
        /* permission name unknown to this Chromium build */
      }
      await s.page.goto(site, { timeout: 30000 });
      await s.page.getByRole('button', { name: 'Skip, just play' }).click();
      await s.page.getByTestId('player-toggle').waitFor({ timeout: 15000 });
      await nav(s.page, 'Crew').click();
      let badge = 'not synced';
      try {
        await s.page.getByTestId('crew-score').waitFor({ timeout: 15000 });
        badge = 'Crew Synced';
      } catch {
        badge = await s.page.getByTestId('crew-status').innerText().catch(() => 'no status');
      }
      const blocked = s.errors.filter((e) => /43210/.test(e)).slice(0, 2).join(' | ');
      info.push(
        `mixed content (Chromium, ${site} -> http://localhost:43210): badge "${badge}"${badge === 'Crew Synced' ? ', loopback allowed from https' : `, not synced${blocked ? ` (${blocked})` : ''}`}`,
      );
    } finally {
      await s.context.close();
    }
    info.push('mixed content (Firefox): not installed in the Playwright cache, skipped; Safari blocks loopback from https by design');
  } catch (e) {
    info.push(`mixed content test could not complete: ${e instanceof Error ? e.message.split('\n')[0] : e}`);
  } finally {
    if (bridge) await bridge.stop().catch(() => {});
  }
}
