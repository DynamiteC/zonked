import { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { AudioEngine } from '../audio/types';
import { templateToEvents } from '../catalog/events';
import type { RecContext, Recommendation, Template } from '../catalog/types';
import { PRESETS } from '../sbg';
import { createStore } from '../storage/db';
import type { Store } from '../storage/db';
import { SAFETY_KEY, readFlag, writeFlag } from '../storage/prefs';
import { BridgeClient } from '../ui/bridgeClient';
import type { BridgeDeps, BridgeStatus } from '../ui/bridgeClient';
import { loadCatalog } from '../ui/catalogLoader';
import { useDetectedDevice } from '../ui/device';
import { Advanced } from '../ui/Advanced';
import { COPY } from '../ui/copy';
import { Mascot } from '../ui/Mascot';
import { NowBar } from '../ui/NowBar';
import { Pacer } from '../ui/Pacer';
import { MoreMenu } from '../ui/MoreMenu';
import type { MoreItem } from '../ui/MoreMenu';
import { SanctuaryHost } from '../ui/SanctuaryHost';
import type { SanctuarySection } from '../ui/sanctuary/types';
import { useTimeTint } from '../ui/useTimeTint';
import { QuickStart, quickStartInitiallyOpen } from '../ui/QuickStart';
import { defaultRecContext } from '../ui/recContext';
import { SafetyGate } from '../ui/SafetyGate';
import { Scope } from '../ui/Scope';
import { MotionContext, Tip } from '../ui/Tip';
import { installE2E } from './e2e';
import { reportPlaying } from './swUpdate';
import { useReducedMotion, safeStorage } from './useReducedMotion';
import { useSessionPlumbing } from './useSessionPlumbing';
import { breathTimings, channelHz } from './neuro';
import { GAIN_STEP, Player, presetById, realClock } from './player';
import type { Clock, PlayerSnapshot } from './player';
import { SHORTCUTS, resolveShortcut, shortcutHelpRows } from './shortcuts';
import type { ActionId } from './shortcuts';
import { WakeLockController } from './wakeLock';

const Editor = lazy(() => import('../ui/Editor').then((m) => ({ default: m.Editor })));
const Recommender = lazy(() => import('../ui/Recommender').then((m) => ({ default: m.Recommender })));
const Catalog = lazy(() => import('../ui/Catalog').then((m) => ({ default: m.Catalog })));
const Mixer = lazy(() => import('../ui/Mixer').then((m) => ({ default: m.Mixer })));
const SoundPicker = lazy(() => import('../ui/SoundPicker').then((m) => ({ default: m.SoundPicker })));
const MixView = lazy(() => import('../ui/MixView').then((m) => ({ default: m.MixView })));
const Inspect = lazy(() => import('../ui/Inspect').then((m) => ({ default: m.Inspect })));
const TimerPanel = lazy(() => import('../ui/TimerPanel').then((m) => ({ default: m.TimerPanel })));

export interface AppProps {
  engine: AudioEngine;
  clock?: Clock;
  store?: Store;
  /** Test seam for the bridge connection. */
  bridgeCreate?: BridgeDeps['create'];
}

type DrawerId = 'editor' | 'recommender' | 'catalog' | 'mixer' | 'timer' | 'inspect';

const PRIMARY: readonly { id: DrawerId; label: string; tip: string; testId: string; panel: string }[] = [
  { id: 'recommender', label: COPY.toolbar.recommend, tip: COPY.tips.recommend, testId: 'recommender-toggle', panel: 'recommender-panel' },
  { id: 'timer', label: COPY.toolbar.timer, tip: COPY.tips.timer, testId: 'timer-toggle', panel: 'timer-panel' },
];
const SLEEPY: ReadonlySet<string> = new Set(['cant-sleep', 'lucid-dream']);

const toEvents = (t: { id: string }): ReturnType<typeof templateToEvents> => templateToEvents(t as Template);

export function App({ engine, clock = realClock, store: storeProp, bridgeCreate }: AppProps): React.JSX.Element {
  const store = useMemo(() => storeProp ?? createStore(), [storeProp]);
  const player = useMemo(
    () => new Player(engine, clock, (log) => void store.addLog(log).catch(() => undefined), { toEvents }),
    [engine, clock, store],
  );
  const wake = useMemo(() => new WakeLockController(undefined, safeStorage()), []);
  const [snap, setSnap] = useState<PlayerSnapshot>(() => player.snapshot());
  const [engineStatus, setEngineStatus] = useState(engine.status);
  const [bridge, setBridge] = useState<BridgeStatus>('standalone');
  const [accepted, setAccepted] = useState(() => readFlag(SAFETY_KEY));
  const [gate, setGate] = useState(false);
  const [drawer, setDrawer] = useState<DrawerId | null>(null);
  const [breathe, setBreathe] = useState(false);
  const [help, setHelp] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [suggest, setSuggest] = useState<readonly [string, string] | null>(null);
  const [sanc, setSanc] = useState<SanctuarySection | null>(null);
  const tint = useTimeTint();
  const [qs, setQs] = useState(quickStartInitiallyOpen);
  const [wakeOn, setWakeOn] = useState(() => wake.isEnabled);
  const [recCtx, setRecCtx] = useState<RecContext>(() => defaultRecContext());
  const [reduced, setUserReduced, userReduced] = useReducedMotion();
  const detected = useDetectedDevice();
  const snapRef = useRef(snap);
  snapRef.current = snap;
  const recCtxRef = useRef(recCtx);
  recCtxRef.current = recCtx;
  const pending = useRef<(() => void) | null>(null);
  const level = useRef(0);
  const getVoice = useCallback(() => player.snapshot().voice, [player]);
  const getLevel = useCallback(() => level.current, []);
  const onLevel = useCallback((rms: number) => {
    level.current = rms > 0 ? Math.min(1, rms * 2) : level.current * 0.96;
  }, []);

  useEffect(() => player.subscribe(setSnap), [player]);
  useEffect(() => engine.onStatus(setEngineStatus), [engine]);
  useEffect(() => reportPlaying(snap.playing), [snap.playing]);
  useEffect(() => {
    installE2E(window, engine, () => player.snapshot().presetId, player);
  }, [engine, player]);
  useEffect(() => {
    if (detected !== 'unknown') setRecCtx((c) => ({ ...c, deviceType: detected }));
  }, [detected]);

  useEffect(() => {
    const client = new BridgeClient({
      ...(bridgeCreate !== undefined ? { create: bridgeCreate } : {}),
      onStatus: (s) => {
        setBridge(s);
        if (s === 'standalone') player.crewLost();
      },
      onState: (state) => {
        player.applyCrew(state);
        if (state.target.breathe) setBreathe(true);
      },
    });
    client.start();
    return () => client.stop();
  }, [player, bridgeCreate]);

  /** Runs fn now when the safety notice was accepted, else after the user accepts it. */
  const guarded = useCallback(
    (fn: () => void) => {
      if (accepted) fn();
      else {
        pending.current = fn;
        setGate(true);
      }
    },
    [accepted],
  );

  const toggle = useCallback(() => {
    if (snapRef.current.playing) void player.stop();
    else guarded(() => void player.play());
  }, [player, guarded]);

  const accept = (): void => {
    writeFlag(SAFETY_KEY, true);
    setAccepted(true);
    setGate(false);
    const fn = pending.current ?? ((): void => void player.play());
    pending.current = null;
    fn();
  };

  const launch = useCallback(
    (recs: readonly Recommendation[], index: number) => {
      const t = recs[index]?.template;
      if (t === undefined) return;
      guarded(() => {
        player.setQueue(recs.map((r) => r.template));
        void player.playTemplate(t);
      });
    },
    [player, guarded],
  );

  /** Quick Start pick: same guarded() path as every other Play. The timer starts only after playback does. */
  const launchQuick = useCallback(
    (recs: readonly Recommendation[], index: number, minutes: number | null, situation: string) => {
      const t = recs[index]?.template;
      if (t === undefined) return;
      guarded(() => {
        setQs(false);
        player.setQueue(recs.map((r) => r.template));
        void player.playTemplate(t).then((ok) => {
          if (ok && minutes !== null) player.startTimer({ kind: SLEEPY.has(situation) ? 'sleep-fade' : 'countdown', minutes });
        });
      });
    },
    [player, guarded],
  );

  const launchTop = useCallback(
    (n: number) => {
      void loadCatalog().then((c) => launch(c.recommendTemplates(recCtxRef.current, 5), n));
    },
    [launch],
  );

  const step = useCallback(
    (dir: 1 | -1) => {
      if (snapRef.current.queueLength === 0) {
        launchTop(0);
        return;
      }
      guarded(() => void (dir === 1 ? player.nextTemplate() : player.prevTemplate()));
    },
    [player, guarded, launchTop],
  );

  const playFromCatalog = (queue: readonly Template[], t: Template): void =>
    guarded(() => {
      player.setQueue(queue);
      void player.playTemplate(t);
    });

  const openDrawer = (id: DrawerId): void => {
    setSanc(null);
    setDrawer((d) => (d === id ? null : id));
  };

  /** A sound card Play: same guarded() path, then the starter template of that sound. */
  const playSound = useCallback(
    (id: string) => {
      guarded(() => {
        void loadCatalog().then((c) => {
          const t = c.getTemplates().find((x) => x.id === `starter-${id}`);
          if (t === undefined) return;
          setQs(false);
          player.setQueue([t]);
          void player.playTemplate(t);
        });
      });
    },
    [player, guarded],
  );

  const moreItems: readonly MoreItem[] = [
    { id: 'catalog', label: COPY.toolbar.catalog, testId: 'catalog-toggle', onPick: () => openDrawer('catalog') },
    { id: 'mixer', label: COPY.toolbar.mixer, testId: 'mixer-toggle', onPick: () => openDrawer('mixer') },
    { id: 'editor', label: COPY.toolbar.editor, testId: 'editor-toggle', onPick: () => openDrawer('editor') },
    { id: 'qs', label: COPY.toolbar.helpMeChoose, testId: 'qs-open', onPick: () => setQs((v) => !v) },
    { id: 'inspect', label: COPY.toolbar.inspect, testId: 'inspect-toggle', onPick: () => openDrawer('inspect') },
    ...(['mission', 'guide', 'favorites', 'mixes', 'milestones', 'data'] as const).map((id) => ({
      id,
      label: COPY.more[id],
      testId: `more-${id}`,
      onPick: () => {
        setDrawer(null);
        setSanc(id);
      },
    })),
  ];

  const actions = useRef<Partial<Record<ActionId, () => void>>>({});
  actions.current = {
    'play-pause': toggle,
    next: () => step(1),
    prev: () => step(-1),
    'launch-1': () => launchTop(0),
    'launch-2': () => launchTop(1),
    'launch-3': () => launchTop(2),
    'launch-4': () => launchTop(3),
    'launch-5': () => launchTop(4),
    recommender: () => openDrawer('recommender'),
    'timer-cycle': () => void player.cycleTimer(),
    mute: () => player.toggleMute(),
    'gain-up': () => player.nudgeGain(GAIN_STEP),
    'gain-down': () => player.nudgeGain(-GAIN_STEP),
    help: () => setHelp((v) => !v),
    editor: () => openDrawer('editor'),
    breathe: () => setBreathe((v) => !v),
    escape: () => {
      setHelp(false);
      setDrawer(null);
    },
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent): void => {
      if (e.repeat || e.isComposing) return;
      const action = resolveShortcut(e);
      if (action === undefined || gate) return;
      const tag = (e.target as HTMLElement | null)?.tagName ?? '';
      if (action === 'play-pause') {
        if (tag === 'BUTTON' || tag === 'A' || tag === 'SUMMARY') return; // native activation handles Space
        e.preventDefault();
      }
      actions.current[action]?.();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [gate]);

  useSessionPlumbing({ player, engine, wake, snap, snapRef, actions });

  const select = snap.source === 'crew' ? 'crew' : snap.source === 'custom' ? 'custom' : snap.source === 'template' ? 'template' : snap.presetId;
  const timings = breathTimings(snap.source === 'preset' ? presetById(snap.presetId) : undefined);
  const synced = bridge === 'connected';
  const device = detected !== 'unknown' ? detected : recCtx.deviceType;
  const speakerWarning = device === 'speaker' && snap.voice.mode === 'binaural';
  const hz = channelHz(snap.voice);
  const beatNow = Math.abs(hz.r - hz.l);
  const loading = <p className="drawer drawer-loading" role="status">Loading</p>;

  return (
    <MotionContext.Provider value={reduced}>
    <div className={`${drawer === null && sanc === null ? 'app' : 'app has-drawer'}${reduced ? ' reduced' : ''}`} data-tint={tint} data-playing={snap.playing ? 'true' : 'false'}>
      <a className="skip" href="#main">
        Skip to controls
      </a>
      <header className="top">
        <h1>Zonked</h1>
        <p className="tag">{COPY.tagline}</p>
        <nav className="toolbar" aria-label="Panels">
          {PRIMARY.map((d) => (
            <Tip key={d.id} text={d.tip}>
              <button
                type="button"
                className="btn"
                data-testid={d.testId}
                aria-pressed={drawer === d.id}
                aria-controls={d.panel}
                onClick={() => openDrawer(d.id)}
              >
                {d.label}
              </button>
            </Tip>
          ))}
          <MoreMenu open={moreOpen} items={moreItems} onToggle={() => setMoreOpen((v) => !v)} onClose={() => setMoreOpen(false)} />
        </nav>
        <div className="help-wrap">
          <Tip text={COPY.tips.shortcuts}>
            <button type="button" className="btn" aria-expanded={help} aria-controls="help-pop" onClick={() => setHelp((v) => !v)}>
              Help
            </button>
          </Tip>
          {help && (
            <div id="help-pop" className="popover" role="region" aria-label="Keyboard shortcuts" data-count={SHORTCUTS.length}>
              <ul>
                {shortcutHelpRows().map((r) => (
                  <li key={r.keys + r.label}>
                    <kbd>{r.keys}</kbd> {r.label}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </header>
      <main id="main" className="main">
        <div className="col-left">
          <section className="stage" aria-label="Controls">
            <Mascot playing={snap.playing} synced={synced} reduced={reduced} getVoice={getVoice} getLevel={getLevel} onToggle={toggle} mood={snap.templateId?.replace(/^starter-/, '') ?? null} />
            <div className="controls">
              <Tip text={COPY.tips.play}>
                <button type="button" className="btn btn-primary" data-testid="play-button" onClick={toggle}>
                  {snap.playing ? 'Stop' : 'Play'}
                </button>
              </Tip>
              <span className="qs-status" role="status" data-testid="status-plain">
                {snap.playing ? COPY.playing : COPY.stopped}
              </span>
              <label htmlFor="preset" className="sr-only">
                Preset
              </label>
              <Tip text={`${COPY.tips.preset} ${COPY.helper.preset}`}>
              <select
                id="preset"
                data-testid="preset-select"
                value={select}
                onChange={(e) => {
                  if (e.target.value === 'crew') player.followCrew();
                  else if (e.target.value !== 'custom' && e.target.value !== 'template') player.selectPreset(e.target.value);
                }}
              >
                {snap.source === 'crew' && <option value="crew">Crew (automatic)</option>}
                {snap.source === 'custom' && <option value="custom">Custom script</option>}
                {snap.source === 'template' && <option value="template">{snap.templateName ?? 'Template'}</option>}
                {PRESETS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
              </Tip>
              {snap.overridden && synced && (
                <button type="button" className="btn" data-testid="follow-crew" onClick={() => player.followCrew()}>
                  Follow crew
                </button>
              )}
              <Tip text={COPY.tips.breathe}>
                <button type="button" className="btn" data-testid="breathe-toggle" aria-pressed={breathe} onClick={() => setBreathe((v) => !v)}>
                  Breathe
                </button>
              </Tip>
              <Tip text={COPY.tips.reduceMotion}>
                <label className="check">
                  <input type="checkbox" checked={userReduced} onChange={(e) => setUserReduced(e.target.checked)} />
                  Reduce motion
                </label>
              </Tip>
            </div>
          </section>
          {qs && <QuickStart ctx={recCtx} onCtx={setRecCtx} onPlay={launchQuick} onClose={() => setQs(false)} onSuggest={(sit) => setSuggest(COPY.suggest[sit] ?? null)} />}
          {breathe && <Pacer inSec={timings.inSec} outSec={timings.outSec} reduced={reduced} />}
        </div>
        <div className="col-right">
          <NowBar
            snap={snap}
            detected={detected}
            speakerWarning={speakerWarning}
            wakeSupported={wake.supported}
            wakeOn={wakeOn}
            onPrev={() => step(-1)}
            onNext={() => step(1)}
            onMute={() => player.toggleMute()}
            onWake={(on) => {
              setWakeOn(on);
              void wake.setEnabled(on);
            }}
          />
          <Suspense fallback={null}>
            <SoundPicker templateId={snap.templateId} playing={snap.playing} reduced={reduced} onPlay={playSound} suggest={suggest === null ? null : { id: suggest[0], reason: suggest[1] }} />
            <MixView snap={snap} player={player} />
          </Suspense>
          <Advanced snap={snap} engine={engineStatus} bridge={bridge} onOpen={openDrawer} player={player} />
          <section className="viz" aria-label="Signal display">
            <Scope telemetry={engine.telemetry} onLevel={onLevel} />
          </section>
        </div>
      </main>
      <Suspense fallback={loading}>
        {drawer === 'editor' && (
          <Editor
            store={store}
            onClose={() => setDrawer(null)}
            onPlay={(t) => guarded(() => void player.playCustom(t))}
          />
        )}
        {drawer === 'recommender' && (
          <Recommender ctx={recCtx} onCtx={setRecCtx} onPlay={launch} onClose={() => setDrawer(null)} />
        )}
        {drawer === 'catalog' && <Catalog currentId={snap.templateId} onPlay={playFromCatalog} onClose={() => setDrawer(null)} />}
        {drawer === 'mixer' && <Mixer snap={snap} player={player} onClose={() => setDrawer(null)} />}
        {drawer === 'inspect' && <Inspect beatHz={beatNow} onClose={() => setDrawer(null)} />}
        {drawer === 'timer' && <TimerPanel timer={snap.timer} player={player} onClose={() => setDrawer(null)} />}
      </Suspense>
      <footer className="foot">
        <p>Use stereo headphones. Zonked is not a medical device.</p>
        <p className="meta mission-line" data-testid="mission-line">
          {COPY.mission}
        </p>
      </footer>
      {sanc !== null && (
        <SanctuaryHost
          section={sanc}
          store={store}
          now={() => Date.now()}
          nowPlaying={
            snap.presetId.startsWith('mix:')
              ? { kind: 'mix', id: snap.presetId }
              : snap.templateId === null
                ? null
                : { kind: 'template', id: snap.templateId }
          }
          currentMix={() => player.getMixDraft()}
          onLoadMix={(m) => guarded(() => player.playMix(m))}
          onPlayTemplate={(id) => playSound(id.replace(/^starter-/, ''))}
          reducedMotion={reduced}
          onClose={() => setSanc(null)}
        />
      )}
      {gate && (
        <SafetyGate
          onAccept={accept}
          onCancel={() => {
            pending.current = null;
            setGate(false);
          }}
        />
      )}
    </div>
    </MotionContext.Provider>
  );
}
