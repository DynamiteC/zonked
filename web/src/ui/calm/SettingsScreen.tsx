import { CALM } from './copy';
import type { Look } from './look';
import { PageHead } from './MascotView';

interface Props {
  readonly gentle: boolean;
  readonly reduceMotion: boolean;
  readonly reduced?: boolean;
  readonly onGentle: (v: boolean) => void;
  readonly onReduceMotion: (v: boolean) => void;
  readonly onStudio: () => void;
  readonly onForget: () => void;
  readonly look: Look;
  readonly onLook: (l: Look) => void;
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

export function SettingsScreen({ gentle, reduceMotion, reduced = false, onGentle, onReduceMotion, onStudio, onForget, look, onLook }: Props): React.JSX.Element {
  return (
    <div>
      <PageHead title={CALM.settingsTitle} reduced={reduced} />
      <Switch label={CALM.gentle} hint={CALM.gentleHint} checked={gentle} onChange={onGentle} testId="gentle-switch" />
      <Switch label={CALM.reduceMotion} checked={reduceMotion} onChange={onReduceMotion} testId="motion-switch" />
      <Switch label={CALM.themeLight} hint={CALM.themeLabel} checked={look.theme === 'light'} onChange={(v) => onLook({ ...look, theme: v ? 'light' : 'dark' })} testId="theme-switch" />
      <Switch label={CALM.contrast} hint={CALM.contrastHint} checked={look.highContrast} onChange={(v) => onLook({ ...look, highContrast: v })} testId="contrast-switch" />
      <div className="c-actions">
        <button type="button" className="c-btn c-link" data-testid="studio-switch" onClick={onStudio}>
          {CALM.studioLink}
        </button>
        <p className="c-muted">{CALM.studioHint}</p>
        <button type="button" className="c-btn c-link" onClick={onForget}>
          {CALM.forget}
        </button>
        <p className="c-muted">{CALM.forgetHint}</p>
      </div>
      <p className="c-muted">{CALM.offline}</p>
    </div>
  );
}
