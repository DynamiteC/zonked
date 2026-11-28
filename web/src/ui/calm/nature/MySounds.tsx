import { useCallback, useEffect, useRef, useState } from 'react';
import { CALM } from '../copy';
import { Icon } from '../icons';
import { MAX_OWN_BYTES } from '../../../audio/samples/own';
import { addOwn, listOwn, removeAllOwn, removeOwn, validateOwn } from './ownStore';
import type { OwnSoundMeta } from './ownStore';
import type { Nature } from './useNature';

const mb = (n: number): string => `${(n / (1024 * 1024)).toFixed(1)} MB`;

/** Reads the picked file on this device. Returns bytes or a plain message. */
async function readFile(file: File): Promise<ArrayBuffer | string> {
  if (file.size > MAX_OWN_BYTES) return 'This file is bigger than 8 MB.';
  try {
    return await file.arrayBuffer();
  } catch {
    return 'This file could not be read.';
  }
}

function useOwnSounds(): {
  readonly items: readonly OwnSoundMeta[];
  readonly status: string;
  readonly add: (file: File) => Promise<void>;
  readonly remove: (id: string) => Promise<void>;
  readonly removeAll: () => Promise<void>;
} {
  const [items, setItems] = useState<readonly OwnSoundMeta[]>([]);
  const [status, setStatus] = useState('');
  const refresh = useCallback(async () => {
    const r = await listOwn();
    if (r.ok) setItems(r.value);
    else setStatus(r.error);
  }, []);
  useEffect(() => void refresh(), [refresh]);
  const add = useCallback(
    async (file: File) => {
      setStatus('');
      const bytes = await readFile(file);
      if (typeof bytes === 'string') return setStatus(bytes);
      const ok = await validateOwn(bytes);
      if (!ok.ok) return setStatus(ok.error);
      const saved = await addOwn(file.name, bytes);
      setStatus(saved.ok ? CALM.mineAdded : saved.error);
      await refresh();
    },
    [refresh],
  );
  const remove = useCallback(async (id: string) => {
    const r = await removeOwn(id);
    if (!r.ok) setStatus(r.error);
    await refresh();
  }, [refresh]);
  const removeAll = useCallback(async () => {
    const r = await removeAllOwn();
    if (!r.ok) setStatus(r.error);
    await refresh();
  }, [refresh]);
  return { items, status, add, remove, removeAll };
}

export function MySounds({ nature }: { readonly nature: Nature }): React.JSX.Element {
  const own = useOwnSounds();
  const input = useRef<HTMLInputElement>(null);
  const { remove: dropOne, removeAll: dropAll } = own;
  const remove = (id: string): void => {
    if (nature.on === id) nature.stop();
    void dropOne(id);
  };
  const removeAll = (): void => {
    nature.stop();
    void dropAll();
  };
  return (
    <section className="c-card c-mine" aria-labelledby="c-mine-h" data-testid="my-sounds">
      <h2 id="c-mine-h" className="c-h3">{CALM.mineTitle}</h2>
      <p className="c-eyebrow" data-testid="mine-stays">{CALM.mineStays}</p>
      <p className="c-muted">{CALM.mineNote}</p>
      <p className="c-muted">{CALM.mineLimits}</p>
      <input ref={input} className="c-sr" id="c-mine-file" type="file" accept="audio/*" data-testid="mine-file" tabIndex={-1} onChange={(e) => {
        const f = e.currentTarget.files?.[0];
        e.currentTarget.value = '';
        if (f !== undefined) void own.add(f);
      }} />
      <button type="button" className="c-btn" onClick={() => input.current?.click()}>{CALM.mineChoose}</button>
      <p className="c-status" role="status" data-testid="mine-status">{own.status}</p>
      {own.items.length === 0 ? (
        <p className="c-muted">{CALM.mineEmpty}</p>
      ) : (
        <ul className="c-list">
          {own.items.map((it) => (
            <li key={it.id} className="c-own-row">
              <button type="button" className="c-row-card" data-testid="mine-play" aria-pressed={nature.on === it.id} onClick={() => nature.start(it.id)}>
                <span><Icon name="file" /> <b>{it.name}</b></span>
                <small>{mb(it.size)}</small>
              </button>
              <button type="button" className="c-btn c-small" data-testid="mine-remove" aria-label={`${CALM.mineRemove} ${it.name}`} onClick={() => remove(it.id)}>{CALM.mineRemove}</button>
            </li>
          ))}
        </ul>
      )}
      {own.items.length > 0 && <button type="button" className="c-btn c-link" data-testid="mine-remove-all" onClick={removeAll}>{CALM.mineRemoveAll}</button>}
    </section>
  );
}
