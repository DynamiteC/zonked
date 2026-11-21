import { useEffect, useRef } from 'react';
import logoRaw from '../../public/logo.svg?raw';
import { channelHz, pulseAt, visibleHz } from '../app/neuro';
import type { Voice } from '../sbg';
import { PARALLAX_DEPTH, dragToSpin, initialPose, pointerOffset, stepPose } from './mascotMotion';
import type { MascotTarget } from './mascotMotion';
import { useFrame } from './useFrame';

interface Props {
  playing: boolean;
  synced: boolean;
  reduced: boolean;
  getVoice: () => Voice;
  onToggle: () => void;
  /** Output level 0..1 (RMS) for the subtle audio-reactive depth. */
  getLevel?: () => number;
  /** Sound id (lofi, piano, rain, ...) that tints the mascot. Cosmetic only. */
  mood?: string | null;
}

const DRAG_CLICK_GUARD_PX = 6;
/** A click this soon after a drag release is the drag's own click and is ignored. */
const CLICK_AFTER_DRAG_MS = 350;
const VARS = ['--rx', '--ry', '--px', '--py', '--hover'] as const;

/** Parses the bundled logo with DOMParser (static asset, never dynamic data). */
export function buildLogo(doc: Document = document): SVGElement | null {
  const parsed = new DOMParser().parseFromString(logoRaw, 'image/svg+xml');
  const root = parsed.documentElement;
  if (parsed.querySelector('parsererror') !== null || root.tagName.toLowerCase() !== 'svg') return null;
  const svg = doc.importNode(root, true) as unknown as SVGElement;
  svg.setAttribute('aria-hidden', 'true');
  svg.setAttribute('focusable', 'false');
  svg.removeAttribute('width');
  svg.removeAttribute('height');
  svg.setAttribute('class', 'mascot-svg');
  svg.querySelector('circle[r="200"]')?.setAttribute('id', 'ring');
  return svg;
}

const DEPTH_STYLE = {
  '--d-ring': PARALLAX_DEPTH.ring,
  '--d-plates': PARALLAX_DEPTH.plates,
  '--d-eyes': PARALLAX_DEPTH.eyes,
  '--d-diamond': PARALLAX_DEPTH.diamond,
} as React.CSSProperties;

export function Mascot({ playing, synced, reduced, getVoice, onToggle, getLevel, mood = null }: Props): React.JSX.Element {
  const host = useRef<HTMLSpanElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const phase = useRef({ l: 0, r: 0 });
  const pose = useRef(initialPose());
  const target = useRef<MascotTarget>({ nx: 0, ny: 0, hover: false, dragging: false, dragSpin: 0, level: 0 });
  const drag = useRef({ id: -1, startX: 0, moved: false });
  const dragEndedAt = useRef(-Infinity);
  const animate = playing && !reduced;

  useEffect(() => {
    const el = host.current;
    if (el === null) return;
    const svg = buildLogo();
    if (svg !== null) el.replaceChildren(svg);
  }, []);

  useEffect(() => {
    const b = btn.current;
    if (b === null) return;
    if (!animate) {
      b.style.setProperty('--pulse-l', '0');
      b.style.setProperty('--pulse-r', '0');
    }
    if (reduced) {
      for (const k of VARS) b.style.setProperty(k, '0');
      b.style.setProperty('--depth', '1');
      pose.current = initialPose();
    }
  }, [animate, reduced]);

  useFrame((dt) => {
    const b = btn.current;
    if (b === null) return;
    if (animate) {
      const hz = channelHz(getVoice());
      const p = phase.current;
      p.l = (p.l + visibleHz(hz.l) * dt) % 1;
      p.r = (p.r + visibleHz(hz.r) * dt) % 1;
      b.style.setProperty('--pulse-l', pulseAt(p.l).toFixed(3));
      b.style.setProperty('--pulse-r', pulseAt(p.r).toFixed(3));
    }
    const t = target.current;
    const raw = playing ? (getLevel?.() ?? 0) : 0;
    t.level = Number.isFinite(raw) ? raw : 0;
    if (!stepPose(pose.current, t, dt) && !playing) return;
    const p = pose.current;
    b.style.setProperty('--rx', `${p.rx.toFixed(2)}deg`);
    b.style.setProperty('--ry', `${(p.ry + p.spin).toFixed(2)}deg`);
    b.style.setProperty('--px', p.px.toFixed(3));
    b.style.setProperty('--py', p.py.toFixed(3));
    b.style.setProperty('--hover', p.hover.toFixed(3));
    b.style.setProperty('--depth', (1 + p.hover * 0.5 + p.audio).toFixed(3));
    b.style.setProperty('--glow', Math.min(1, p.audio * 2).toFixed(3));
  }, !reduced);

  const point = (e: React.PointerEvent<HTMLButtonElement>): void => {
    if (reduced || btn.current === null) return;
    const o = pointerOffset(e.clientX, e.clientY, btn.current.getBoundingClientRect());
    target.current.nx = o.nx;
    target.current.ny = o.ny;
    if (drag.current.id === e.pointerId) {
      const dx = e.clientX - drag.current.startX;
      if (Math.abs(dx) > DRAG_CLICK_GUARD_PX) drag.current.moved = true;
      if (drag.current.moved) target.current.dragSpin = dragToSpin(dx);
    }
  };

  const release = (): void => {
    drag.current.id = -1;
    target.current.dragging = false;
    target.current.dragSpin = 0;
  };

  /** Pointer left or the gesture was cancelled: return to the neutral pose. */
  const rest = (): void => {
    const t = target.current;
    t.hover = false;
    t.nx = 0;
    t.ny = 0;
    if (drag.current.id === -1) t.dragSpin = 0;
  };

  return (
    <button
      ref={btn}
      type="button"
      className="mascot"
      style={DEPTH_STYLE}
      data-testid="mascot"
      data-synced={synced ? 'true' : 'false'}
      data-motion={reduced ? 'frozen' : 'live'}
      data-mood={mood ?? 'idle'}
      aria-pressed={playing}
      aria-label={playing ? 'Stop session' : 'Start session'}
      onClick={(e) => {
        if (performance.now() - dragEndedAt.current < CLICK_AFTER_DRAG_MS) {
          dragEndedAt.current = -Infinity;
          e.preventDefault();
          return;
        }
        onToggle();
      }}
      onPointerEnter={(e) => {
        if (!reduced) target.current.hover = true;
        point(e);
      }}
      onPointerMove={point}
      onPointerLeave={rest}
      onPointerDown={(e) => {
        dragEndedAt.current = -Infinity;
        if (reduced) return;
        drag.current = { id: e.pointerId, startX: e.clientX, moved: false };
        target.current.dragging = true;
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch {
          /* capture is optional */
        }
        point(e);
      }}
      onPointerUp={() => {
        if (drag.current.moved) dragEndedAt.current = performance.now();
        release();
      }}
      onPointerCancel={() => {
        release();
        rest();
      }}
    >
      <span className="mascot-tilt">
        <span ref={host} className="mascot-host" />
      </span>
    </button>
  );
}
