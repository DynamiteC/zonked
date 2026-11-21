import { buildTemplates } from './build';
import type { Template } from './types';

let cache: readonly Template[] | undefined;

/** Memoized catalog. Built on first call, never at import time. */
export function getTemplates(): readonly Template[] {
  cache ??= buildTemplates();
  return cache;
}

/**
 * Lazy stand-in for contract constant TEMPLATES. It behaves like a read-only array but only
 * builds the catalog when first touched. Prefer getTemplates() in new code.
 */
export const TEMPLATES: readonly Template[] = new Proxy([] as Template[], {
  get: (_t, prop) => Reflect.get(getTemplates(), prop),
  has: (_t, prop) => Reflect.has(getTemplates(), prop),
  ownKeys: () => Reflect.ownKeys(getTemplates()),
  getOwnPropertyDescriptor: (_t, prop) => {
    const d = Reflect.getOwnPropertyDescriptor(getTemplates(), prop);
    return d === undefined || prop === 'length' ? d : { ...d, configurable: true };
  },
});
