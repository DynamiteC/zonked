import type { EngineStatus } from '../audio/types';
import type { PlayerSnapshot } from '../app/player';
import { bandName, channelHz, formatElapsed } from '../app/neuro';
import { PRESETS } from '../sbg';
import type { BridgeStatus } from './bridgeClient';
import { COPY } from './copy';
import { Tip } from './Tip';

interface Props {
  snap: PlayerSnapshot;
  engine: EngineStatus;
  bridge: BridgeStatus;
}

export function Hud({ snap, engine, bridge }: Props): React.JSX.Element {
  const v = snap.voice;
  const hz = channelHz(v);
  const synced = bridge === 'connected';
  const score = synced ? snap.burnout : null;
  const preset =
    snap.source === 'custom' ? 'Custom script' : snap.source === 'template' ? (snap.templateName ?? 'Template') : snap.source === 'crew' ? 'Crew (automatic)' : (PRESETS.find((p) => p.id === snap.presetId)?.name ?? snap.presetId);
  return (
    <section className="hud" aria-label="Session readout">
      <dl>
        <div><dt><Tip text={COPY.tips.carrier}>{COPY.advanced.carrier}</Tip></dt><dd data-testid="hud-carrier">{v.carrierHz.toFixed(1)} Hz</dd></div>
        <div><dt><Tip text={COPY.tips.leftRight}>{COPY.advanced.left}</Tip></dt><dd data-testid="hz-left">{hz.l.toFixed(2)} Hz</dd></div>
        <div><dt><Tip text={COPY.tips.leftRight}>{COPY.advanced.right}</Tip></dt><dd data-testid="hz-right">{hz.r.toFixed(2)} Hz</dd></div>
        <div><dt><Tip text={COPY.tips.beat}>{COPY.advanced.beat}</Tip></dt><dd data-testid="hud-beat">{v.beatHz.toFixed(2)} Hz</dd></div>
        <div><dt><Tip text={COPY.tips.band}>{COPY.advanced.band}</Tip></dt><dd data-testid="hud-band">{bandName(v.beatHz)}</dd></div>
        <div><dt><Tip text={COPY.tips.elapsed}>{COPY.advanced.elapsed}</Tip></dt><dd data-testid="hud-elapsed">{formatElapsed(snap.elapsedSec)}</dd></div>
        <div><dt><Tip text={COPY.tips.sound}>{COPY.advanced.sound}</Tip></dt><dd data-testid="hud-preset">{preset}</dd></div>
        <div>
          <dt><Tip text={COPY.tips.engine}>{COPY.advanced.engine}</Tip></dt>
          <dd data-testid="engine-status" data-state={engine.state}>
            {engine.state}
            {engine.error !== undefined ? `: ${engine.error}` : ''}
          </dd>
        </div>
      </dl>
      <div className="crew-row">
        <Tip text={COPY.tips.crew}>
          <span className={`badge ${synced ? 'badge-synced' : 'badge-standalone'}`} data-testid="crew-badge">
            {synced ? 'Crew Synced' : 'Standalone'}
          </span>
        </Tip>
        <div className="burnout">
          <span id="burnout-label"><Tip text={synced ? COPY.tips.burnout : COPY.advanced.emptyBurnout}>{COPY.advanced.burnout}</Tip></span>
          <div
            className="meter"
            role="meter"
            aria-labelledby="burnout-label"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={score ?? 0}
            aria-valuetext={score === null ? 'No crew data' : `${Math.round(score)} of 100`}
            data-testid="burnout-meter"
            data-score={score === null ? '' : String(Math.round(score))}
          >
            <span className="meter-fill" style={{ width: `${score ?? 0}%` }} />
          </div>
          <span className="meter-value">{score === null ? '--' : Math.round(score)}</span>
        </div>
      </div>
    </section>
  );
}
