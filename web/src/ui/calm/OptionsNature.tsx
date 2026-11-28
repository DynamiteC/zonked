import { useState } from 'react';
import { listSamples } from '../../audio/samples';
import { CALM } from './copy';
import { UX } from './copy-ux';
import { Slider } from './nature/NatureScreen';
import { RangeField } from '../shared/RangeField';
import type { RangeTick } from '../shared/RangeField';
import { orderForDevice } from './data';
import type { Device } from './data';
import { NATURE_GROUPS, groupOf } from './nature/groups';
import { formatMixCode, parseMixCode, MIX_CODE_MAX } from './nature/mixCode';
import { MAX_NATURE_LEVEL } from './nature/prefs';
import type { Nature } from './nature/useNature';

const BLEND_TICKS: readonly RangeTick[] = [
  { value: 0, label: 'More beats' },
  { value: 0.5, label: 'Even' },
  { value: 1, label: 'More nature' },
];

function blendText(v: number): string {
  if (v < 0.4) return 'More beats';
  return v > 0.6 ? 'More nature' : 'Even';
}

/** Copy and paste one nature mix as a short text code. Input is untrusted and parsed strictly. */
function MixCode({ nature }: { readonly nature: Nature }): React.JSX.Element {
  const [text, setText] = useState('');
  const [note, setNote] = useState('');
  const [shown, setShown] = useState('');
  const copy = (): void => {
    if (nature.on === null || nature.on.startsWith('own:')) return setNote(UX.mix.none);
    const code = formatMixCode({ id: nature.on, blend: nature.prefs.blend, level: nature.prefs.level });
    const clip = typeof navigator === 'undefined' ? undefined : navigator.clipboard;
    if (clip === undefined) {
      setShown(code);
      return setNote(UX.mix.copyFailed);
    }
    clip.writeText(code).then(
      () => { setShown(''); setNote(UX.mix.copied); },
      () => { setShown(code); setNote(UX.mix.copyFailed); },
    );
  };
  const apply = (): void => {
    const r = parseMixCode(text, listSamples().map((s) => s.id));
    if (!r.ok) return setNote(r.error);
    nature.setBlend(r.mix.blend);
    nature.setLevel(r.mix.level);
    nature.start(r.mix.id);
    setText('');
    setNote(UX.mix.applied);
  };
  return (
    <div className="c-mix" data-testid="mix-code">
      <div className="c-chips c-left">
        <button type="button" className="c-tchip" data-testid="mix-copy" onClick={copy}>{UX.mix.copy}</button>
      </div>
      {shown !== '' && <p className="c-muted c-mixcode" data-testid="mix-shown">{shown}</p>}
      <label htmlFor="c-mix-in" className="c-o-sub">{UX.mix.pasteTitle}</label>
      <div className="c-mix-row">
        <input id="c-mix-in" className="c-mix-in" type="text" inputMode="text" autoComplete="off" autoCapitalize="characters" spellCheck={false} maxLength={MIX_CODE_MAX} placeholder={UX.mix.pasteHint} aria-label={UX.mix.pasteLabel} data-testid="mix-input" value={text} onChange={(e) => setText(e.currentTarget.value)} />
        <button type="button" className="c-tchip" data-testid="mix-apply" disabled={text.trim() === ''} onClick={apply}>{UX.mix.apply}</button>
      </div>
      <p className="c-muted" role="status" data-testid="mix-note">{note}</p>
    </div>
  );
}

/** The Nature part of the Options sheet: sounds in groups, blend, level and the mix code. */
export function OptionsNature({ nature, device }: { readonly nature: Nature; readonly device: Device }): React.JSX.Element {
  const samples = listSamples();
  return (
    <>
      <div className="c-nature-groups" role="group" aria-label={CALM.optNature}>
        <button type="button" className="c-tchip" aria-pressed={nature.on === null} data-testid="sheet-nature-none" onClick={nature.stop}>
          {CALM.natureNone}
        </button>
        {NATURE_GROUPS.map((g) => {
          const list = orderForDevice(samples.filter((s) => groupOf(s) === g), device);
          return list.length === 0 ? null : (
            <div key={g} role="group" aria-label={g} data-testid={`sheet-group-${g.replaceAll(' ', '-')}`}>
              <p className="c-o-sub">{g}</p>
              <div className="c-chips c-left c-nature-row">
                {list.map((s) => (
                  <button key={s.id} type="button" className="c-tchip" aria-pressed={nature.on === s.id} data-testid={`sheet-nature-${s.id}`} onClick={() => (nature.on === s.id ? nature.stop() : nature.start(s.id))}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <div className="c-slider c-blend">
        <label htmlFor="c-blend">{CALM.natureBlend}</label>
        <RangeField id="c-blend" min={0} max={1} step={0.05} value={nature.prefs.blend} valueText={blendText(nature.prefs.blend)} bubbleText={blendText(nature.prefs.blend)} ticks={BLEND_TICKS} onChange={nature.setBlend} />
      </div>
      {nature.on !== null && <Slider id="c-nlevel" label={CALM.natureLevel} value={nature.prefs.level} max={MAX_NATURE_LEVEL} onChange={nature.setLevel} />}
      <MixCode nature={nature} />
      <p className="c-status" role="status">{nature.message}</p>
    </>
  );
}
