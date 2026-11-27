import { useEffect, useState } from 'react';
import { createEngine } from '@zonked-web/audio';
import type { AudioEngine, EngineStats, EngineStatus } from '@zonked-web/audio';
import type { Voice } from '@zonked-web/sbg/types';
import { probeCapabilities } from './probe';

// Module-level singleton: the engine outlives the page component, so it keeps
// playing when the dashboard unmounts this page on navigation.
let engine: AudioEngine | null = null;
function getEngine(): AudioEngine {
  engine ??= createEngine();
  return engine;
}

// Binaural 200 Hz carrier with a 10 Hz beat, no noise. Gain 0.3 is well under the 0.85 cap.
const PROOF_VOICE: Voice = {
  carrierHz: 200, beatHz: 10, noise: 'off', noiseLevel: 0, mode: 'binaural', gain: 0.3,
};

const NOTICE = [
  'Use stereo headphones. Binaural beats do not work on speakers.',
  'Start with the volume low. Playback fades in over 2 seconds.',
  'Zonked is not a medical device and makes no health claims.',
  'Stop if you feel dizzy or unwell.',
];

const wrap = { padding: 24, maxWidth: 720, fontFamily: 'system-ui, sans-serif', overflowY: 'auto' } as const;
const mono = { fontFamily: 'ui-monospace, monospace', fontSize: 13 } as const;

export default function Zonked(): React.JSX.Element {
  const eng = getEngine();
  const [status, setStatus] = useState<EngineStatus>(eng.status);
  const [stats, setStats] = useState<EngineStats | null>(null);
  const [gate, setGate] = useState(false);
  const reduced = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const [caps, setCaps] = useState<Record<string, string>>({});

  useEffect(() => eng.onStatus(setStatus), [eng]);
  useEffect(() => { void probeCapabilities().then(setCaps); }, []);

  const start = async (): Promise<void> => {
    setGate(false);
    await eng.start(PROOF_VOICE);
  };
  const measure = async (): Promise<void> => setStats(await eng.getStats());
  const running = status.state === 'running';

  return (
    <div style={wrap} data-testid="zonked-app" data-reduced-motion={String(reduced)}>
      <h2>Zonked engine spike</h2>
      <p>Reduced motion: {reduced ? 'on, no animation is used' : 'off (this page has no animation anyway)'}</p>
      <div style={{ display: 'flex', gap: 8, margin: '12px 0' }}>
        <button type="button" data-testid="start" disabled={running} onClick={() => setGate(true)}>Start</button>
        <button type="button" data-testid="stop" disabled={!running} onClick={() => void eng.stop()}>Stop</button>
        <button type="button" data-testid="measure" onClick={() => void measure()}>Measure</button>
      </div>
      {gate && (
        <div role="dialog" aria-modal="true" aria-labelledby="zk-safe" data-testid="safety" style={{ border: '1px solid #888', padding: 12, margin: '8px 0' }}>
          <h3 id="zk-safe">Before you listen</h3>
          <ul>{NOTICE.map((t) => <li key={t}>{t}</li>)}</ul>
          <button type="button" onClick={() => setGate(false)}>Not now</button>{' '}
          <button type="button" data-testid="safety-accept" onClick={() => void start()}>I understand, start</button>
        </div>
      )}
      <pre style={mono} data-testid="status">{JSON.stringify(status, null, 2)}</pre>
      <pre style={mono} data-testid="stats">
        {stats ? `peak=${stats.peak.toFixed(4)} rms=${stats.rms.toFixed(4)} frames=${stats.frames} nonZero=${stats.nonZero}` : 'no stats yet'}
      </pre>
      <p style={mono}>Pass: peak above 0 and at most 0.95 after the 2 s ramp; nonZero close to 2 x frames. Measured over the worklet's whole run, so the ramp lowers rms.</p>
      <h3>Capabilities in this document</h3>
      <table style={mono} data-testid="caps">
        <tbody>
          {Object.entries(caps).map(([k, v]) => (
            <tr key={k}><td style={{ paddingRight: 16 }}>{k}</td><td>{v}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
