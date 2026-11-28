import { useCallback, useEffect, useRef, useState } from 'react';
import type { SampleResult } from '../../../audio/samples';
import { CALM } from '../copy';
import type { CalmSession } from '../useCalmSession';
import { activeNature, setActiveNature, stopNatureIfActive } from './active';
import { getOwnBytes, isOwnId } from './ownStore';
import { loadPrefs, savePrefs } from './prefs';
import type { NaturePrefs } from './prefs';

export interface Nature {
  readonly prefs: NaturePrefs;
  /** Id of the sound that is on now, or null. */
  readonly on: string | null;
  readonly message: string;
  /** Starts a sound. Waits for the safety notice first, like every other sound. */
  readonly start: (id: string) => void;
  readonly stop: () => void;
  readonly setBlend: (b: number) => void;
  readonly setLevel: (l: number) => void;
}

const lazySamples = (): Promise<typeof import('../../../audio/samples')> => import('../../../audio/samples');

async function begin(id: string, level: number): Promise<SampleResult> {
  const m = await lazySamples();
  if (!isOwnId(id)) return m.startSample(id, level);
  const bytes = await getOwnBytes(id);
  return bytes.ok ? m.startOwn(id, bytes.value, level) : { ok: false, error: bytes.error };
}

/** Nature and own sounds under any session. Every start goes through the safety gate. */
export function useNature(s: CalmSession): Nature {
  const [prefs, setPrefs] = useState<NaturePrefs>(loadPrefs);
  const [on, setOn] = useState<string | null>(activeNature);
  const [message, setMessage] = useState('');
  const ref = useRef(prefs);
  ref.current = prefs;
  const { player, guarded } = s;

  useEffect(() => {
    if (s.snap.playing) return;
    stopNatureIfActive();
    setOn(null);
  }, [s.snap.playing]);

  const run = useCallback(
    async (id: string): Promise<void> => {
      setMessage('');
      if (!player.snapshot().playing) await player.play();
      if (!player.snapshot().playing) return void setMessage(CALM.errorAudio);
      const m = await lazySamples();
      m.setBlend(ref.current.blend);
      const r = await begin(id, ref.current.level);
      if (!r.ok) return void setMessage(r.error);
      if (r.note !== undefined) setMessage(r.note);
      setActiveNature(id);
      setOn(id);
      const next = { ...ref.current, id };
      setPrefs(next);
      savePrefs(next);
    },
    [player],
  );

  const start = useCallback((id: string) => guarded(() => void run(id)), [guarded, run]);
  const stop = useCallback(() => {
    setActiveNature(null);
    setOn(null);
    void lazySamples().then((m) => m.stopSample());
  }, []);
  const update = useCallback((patch: Partial<NaturePrefs>, apply: (m: typeof import('../../../audio/samples')) => void) => {
    const next = { ...ref.current, ...patch };
    ref.current = next;
    setPrefs(next);
    savePrefs(next);
    if (activeNature() !== null) void lazySamples().then(apply);
  }, []);
  const setBlend = useCallback((b: number) => update({ blend: b }, (m) => m.setBlend(b)), [update]);
  const setLevel = useCallback((l: number) => update({ level: l }, (m) => m.setSampleLevel(l)), [update]);
  return { prefs, on, message, start, stop, setBlend, setLevel };
}
