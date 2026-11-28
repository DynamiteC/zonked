// Name of the runtime cache for recorded loops. Bump the number when a loop is removed or replaced in a way the
// URL version (see versions.ts) cannot cover. A new name starts an empty cache, and the old one is deleted on first use.
export const SAMPLE_CACHE_NAME = 'zonked-samples-v2';
/** Cache names used by earlier releases. They are deleted so removed files do not stay on a device. */
export const OLD_SAMPLE_CACHES: readonly string[] = ['zonked-samples'];

/** Deletes caches from earlier releases. Never throws and never blocks. */
export function dropOldSampleCaches(store: Pick<CacheStorage, 'delete'> | undefined = typeof caches === 'undefined' ? undefined : caches): void {
  if (store === undefined) return;
  for (const name of OLD_SAMPLE_CACHES) {
    try { void Promise.resolve(store.delete(name)).catch(() => undefined); } catch { /* storage blocked: nothing to clean */ }
  }
}
