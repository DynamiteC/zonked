import type { Store } from '../../../storage/db';
import { clearAll } from './storage';
import type { StorageLike } from './types';

const KEY_PREFIX = 'zonked.';
const SAMPLE_CACHE = 'zonked-samples';

/**
 * Everything "Forget my data" removes on this device, beyond what the other parts already clear:
 * every `zonked.` key in localStorage, saved mixes, favorites, milestones, session logs, studio scripts,
 * and the cached nature loops. The app files stay, so the app still works offline afterwards.
 * Each step is separate: one refusing store never stops the others. Never throws.
 */
export async function forgetEverything(storage: StorageLike, store: Store, ls: Storage | undefined = safeLocal(), cacheApi: CacheStorage | undefined = safeCaches()): Promise<void> {
  clearAll(storage);
  if (ls !== undefined) {
    try {
      for (const k of Object.keys(ls)) if (k.startsWith(KEY_PREFIX)) ls.removeItem(k);
    } catch {
      /* shortcut: blocked storage keeps its keys, nothing more can be done here */
    }
  }
  await settle(store.clearSanctuary());
  await settle(
    store.listScripts().then((all) => Promise.all(all.map((x) => store.deleteScript(x.id)))),
  );
  if (cacheApi !== undefined) await settle(cacheApi.delete(SAMPLE_CACHE));
}

const settle = async (p: Promise<unknown>): Promise<void> => {
  try {
    await p;
  } catch {
    /* shortcut: a failed step is skipped so the rest still run */
  }
};

function safeLocal(): Storage | undefined {
  try {
    return typeof localStorage === 'undefined' ? undefined : localStorage;
  } catch {
    return undefined;
  }
}

function safeCaches(): CacheStorage | undefined {
  try {
    return typeof caches === 'undefined' ? undefined : caches;
  } catch {
    return undefined;
  }
}
