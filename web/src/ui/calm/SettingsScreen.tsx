import { CALM, DEVICE_LABEL } from './copy';
import { DEVICES } from './data';
import type { Device, FeelEntry } from './data';
import { Helped, PrivacyNote } from './SettingsExtras';
import { dimOn } from './look';
import type { Prefs, ThemeChoice } from './look';
import { PageHead } from './MascotView';

interface Props {
  readonly gentle: boolean;
  readonly device?: Device;
  readonly onDevice?: (d: Device) => void;
  readonly reduceMotion: boolean;
  readonly reduced?: boolean;
  readonly onGentle: (v: boolean) => void;
  readonly onReduceMotion: (v: boolean) => void;
  readonly onStudio: () => void;
  readonly onForget: () => void;
  readonly prefs: Prefs;
  readonly onPrefs: (p: Prefs) => void;
  readonly onGuide?: () => void;
  readonly feel?: readonly FeelEntry[];
}

function Switch({ label, hint, checked, onChange, testId }: { readonly label: string; readonly hint?: string; readonly checked: boolean; readonly onChange: (v: boolean) => void; readonly testId: string }): React.JSX.Element {
  return (
    <label className="c-switch">
      <input type="checkbox" role="switch" data-testid={testId} checked={checked} onChange={(e) => onChange(e.currentTarget.checked)} />
      <span className="c-track" aria-hidden="true" />
      <span>
        {label}
        {hint !== undefined && <small className="c-muted">{hint}</small>}
      </span>
    </label>
  );
}

const CHOICES: readonly ThemeChoice[] = ['system', 'light', 'dark', 'contrast'];

function ThemePicker({ value, onChange }: { readonly value: ThemeChoice; readonly onChange: (c: ThemeChoice) => void }): React.JSX.Element {
  return (
    <fieldset className="c-themes" data-testid="theme-picker">
      <legend>{CALM.themeTitle}</legend>
      {CHOICES.map((c) => (
        <label key={c} className="c-theme-opt">
          <input type="radio" name="c-theme" value={c} data-testid={`theme-${c}`} checked={value === c} onChange={() => onChange(c)} />
          <span>{CALM.themeChoices[c]}</span>
        </label>
      ))}
      {value === 'contrast' && <p className="c-muted" data-testid="contrast-hint">{CALM.contrastHint}</p>}
    </fieldset>
  );
}

export function SettingsScreen({ device, onDevice, gentle, reduceMotion, reduced = false, onGentle, onReduceMotion, onStudio, onForget, prefs, onPrefs, onGuide, feel = [] }: Props): React.JSX.Element {
  return (
    <div>
      <PageHead title={CALM.settingsTitle} reduced={reduced} />
      {device !== undefined && onDevice !== undefined && (
        <fieldset className="c-themes" data-testid="device-picker">
          <legend>{CALM.deviceTitle}</legend>
          {DEVICES.map((d) => (
            <label key={d} className="c-theme-opt">
              <input type="radio" name="c-device" value={d} data-testid={`device-${d}`} checked={device === d} onChange={() => onDevice(d)} />
              <span>{DEVICE_LABEL[d]}</span>
            </label>
          ))}
          <small className="c-muted">{CALM.deviceHint}</small>
        </fieldset>
      )}
      <Switch label={CALM.gentle} hint={CALM.gentleHint} checked={gentle} onChange={onGentle} testId="gentle-switch" />
      <Switch label={CALM.reduceMotion} checked={reduceMotion} onChange={onReduceMotion} testId="motion-switch" />
      <ThemePicker value={prefs.choice} onChange={(choice) => onPrefs({ ...prefs, choice })} />
      <Switch label={CALM.dimLabel} hint={CALM.dimHint} checked={dimOn(prefs)} onChange={(dim) => onPrefs({ ...prefs, dim })} testId="dim-switch" />
      <Switch label={CALM.announceLabel} hint={CALM.announceHint} checked={prefs.announce} onChange={(announce) => onPrefs({ ...prefs, announce })} testId="announce-switch" />
      <div className="c-actions">
        {onGuide !== undefined && (
          <button type="button" className="c-btn c-link" data-testid="settings-guide" onClick={onGuide}>
            {CALM.guideLink}
          </button>
        )}
        <button type="button" className="c-btn c-link" data-testid="studio-switch" onClick={onStudio}>
          {CALM.studioLink}
        </button>
        <p className="c-muted">{CALM.studioHint}</p>
        <button type="button" className="c-btn c-link" onClick={onForget}>
          {CALM.forget}
        </button>
        <p className="c-muted">{CALM.forgetHint}</p>
        <PrivacyNote />
      </div>
      <Helped feel={feel} />
      <p className="c-muted">{CALM.offline}</p>
    </div>
  );
}
