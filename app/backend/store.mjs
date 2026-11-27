// One small JSON file in the app data directory. The HTTP backend and the agent tool server
// both use it, so they see the same memory. Node built-ins only.
import { mkdirSync, readFileSync, renameSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { MAX_STORE_BYTES, advance, emptyMemory, parseMemory, toCrewState, toSuggestion, validateIntensity } from './core.mjs';

const FILE = 'crew-memory.json';

/** App data dir: an explicit path wins, else the `data` folder beside the app code. */
export function resolveDataDir(explicit) {
  if (typeof explicit === 'string' && explicit.length > 0) return resolve(explicit);
  return resolve(dirname(fileURLToPath(import.meta.url)), '..', 'data');
}

export function createStore(dataDir, clock = () => Math.floor(Date.now() / 1000)) {
  const file = join(dataDir, FILE);
  const read = () => {
    try {
      if (statSync(file).size > MAX_STORE_BYTES) return emptyMemory();
      return parseMemory(readFileSync(file));
    } catch {
      return emptyMemory();
    }
  };
  const write = (memory) => {
    mkdirSync(dataDir, { recursive: true });
    const tmp = `${file}.tmp`;
    writeFileSync(tmp, JSON.stringify(memory), { mode: 0o600 });
    renameSync(tmp, file);
  };
  return {
    state: () => toCrewState(read(), clock()),
    suggestion: () => toSuggestion(read(), clock()),
    /** Validate, advance, persist. Returns the same shape as validateIntensity plus `state`. */
    report(raw) {
      const v = validateIntensity(raw);
      if (!v.ok) return v;
      const next = advance(read(), v.value, clock());
      write(next);
      return { ok: true, warnings: v.warnings, state: toCrewState(next, clock()) };
    },
  };
}
