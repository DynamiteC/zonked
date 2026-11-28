import type { PlayerSnapshot } from '../app/player';
import { PRESETS } from '../sbg';
import { deviceLabel } from './device';
import type { DetectedDevice } from './device';
import { COPY } from './copy';
import { announceText, formatClock } from './recContext';
import { Tip } from './Tip';

interface Props {
  snap: PlayerSnapshot;
  detected: DetectedDevice;
  speakerWarning: boolean;
  wakeSupported: boolean;
  wakeOn: boolean;
  onPrev: () => void;
  onNext: () => void;
  onMute: () => void;
  onWake: (on: boolean) => void;
}

function nowPlaying(snap: PlayerSnapshot): string {
  if (snap.templateName !== null) return snap.templateName;
  if (snap.source === 'custom') return 'Custom script';
  if (snap.source === 'crew') return 'Crew (automatic)';
  return PRESETS.find((p) => p.id === snap.presetId)?.name ?? snap.presetId;
}

export function NowBar({ snap, detected, speakerWarning, wakeSupported, wakeOn, onPrev, onNext, onMute, onWake }: Props): React.JSX.Element {
  const t = snap.timer;
  const remaining = t.kind === 'none' ? '--:--' : formatClock(t.remainingSec);
  return (
    <section className="nowbar" aria-label="Now playing">
      <button type="button" className="btn" data-testid="prev-button" aria-label="Previous template" onClick={onPrev}>
        Prev
      </button>
      <div className="now-text">
        <p className="now-title" data-testid="now-playing">
          {nowPlaying(snap)}
        </p>
        {snap.queueLength > 0 && snap.queueIndex >= 0 && (
          <p className="meta">
            {snap.queueIndex + 1} of {snap.queueLength}
          </p>
        )}
      </div>
      <button type="button" className="btn" data-testid="next-button" aria-label="Next template" onClick={onNext}>
        Next
      </button>
      <div className="now-meta">
        <span className="pill" data-testid="timer-remaining" data-kind={t.kind}>
          {t.kind === 'pomodoro' && t.phase !== undefined ? `${t.phase} ` : ''}
          {remaining}
        </span>
        <span className="sr-only" role="status" aria-live="polite" data-testid="timer-live">
          {announceText(t.kind, t.remainingSec, t.phase, t.finalFade)}
        </span>
        {detected !== 'unknown' && (
          <Tip text={`${COPY.tips.device} ${COPY.headphoneNote}`}>
            <span className="pill" data-testid="device-status" data-device={detected}>
              Output: {deviceLabel(detected)}
            </span>
          </Tip>
        )}
        <Tip text={COPY.tips.mute}>
          <button type="button" className="btn" data-testid="mute-button" aria-pressed={snap.muted} onClick={onMute}>
            {snap.muted ? 'Unmute' : 'Mute'}
          </button>
        </Tip>
        <Tip text={COPY.tips.wake}>
        <button
          type="button"
          className="btn"
          data-testid="wakelock-toggle"
          aria-pressed={wakeOn}
          disabled={!wakeSupported}
          title={wakeSupported ? 'Keep the screen awake while playing' : 'Not supported in this browser'}
          onClick={() => onWake(!wakeOn)}
        >
          Keep awake
        </button>
        </Tip>
      </div>
      {speakerWarning && (
        <p className="warn" role="status" data-testid="device-warning">
          Binaural beats need stereo headphones. Over a speaker the effect is lost; pick an isochronic or monaural template.
        </p>
      )}
    </section>
  );
}
