import { useEffect, useId, useMemo, useRef, useState, type CSSProperties, type JSX } from 'react';
import './mascot.css';
import { Defs, HeadLayer, MotesLayer, ShadowLayer } from './layers';
import { BandLayer, RippleLayer } from './layersExtra';
import { PropLayer } from './props';
import type { CalmMascotProps } from './types';
import { isLowPower, slowDeviceSeen, watchFrames } from './lowPower';
import { useLife } from './useLife';
import { useParallax } from './useParallax';

/** Reads the OS reduced-motion setting. Safe where matchMedia is missing. */
function prefersReduced(): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;
}

const unit = (v: number | undefined): number => (v !== undefined && Number.isFinite(v) ? Math.max(0, Math.min(1, v)) : 0);

/** Up to this pixel size only the head is drawn, cropped, with the paint filter off. */
const COMPACT_MAX = 96;
/** Below this size no filter, grain or shade is drawn: bold shapes only. */
const LITE_BELOW = 72;

export function CalmMascot({ mood = 'idle', size = 220, reducedMotion, label = 'Zonked mascot', breathPhase, level, situation }: CalmMascotProps): JSX.Element {
  const id = `cm${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const stage = useRef<HTMLDivElement>(null);
  const still = reducedMotion ?? prefersReduced();
  const px = Number.isFinite(size) ? Math.max(24, Math.min(640, size)) : 220;
  const compact = px <= COMPACT_MAX;
  const [slow, setSlow] = useState(slowDeviceSeen);
  const lowPower = useMemo(() => still || slow || isLowPower(), [still, slow]);
  // Times real frames for a moment. Over 20 ms on average turns the paint filter and parallax off for this visit.
  useEffect(() => (still || lowPower ? undefined : watchFrames(() => setSlow(true))), [still, lowPower]);
  const lite = px < LITE_BELOW || lowPower;
  // The head breathes: about 3 percent larger and a little higher on inhale. Still under reduced motion.
  const lift: CSSProperties | undefined = breathPhase !== undefined && !still ? { scale: String(1 + unit(breathPhase) * 0.03), translate: `0 ${(-unit(breathPhase) * 1.2).toFixed(2)}%` } : undefined;
  useParallax(stage, !lowPower && !compact);
  useLife(stage, mood, still);
  return (
    <div
      ref={stage}
      className={`cm-stage cm-${mood}${situation ? ` cm-s-${situation}` : ''}${still ? ' cm-still' : ''}${lowPower && !still ? ' cm-low' : ''}${compact ? ' cm-compact' : ''}${breathPhase !== undefined ? ' cm-driven' : ''}`}
      style={{ width: px, height: px, '--bp': unit(breathPhase), '--lv': level === undefined && mood === 'listening' ? 0.35 : unit(level) } as CSSProperties}
      role="img"
      aria-label={label}
      data-mood={mood}
      data-situation={situation}
    >
      <Defs id={id} lite={lite} />
      <div className="cm-body">
        {!compact && <ShadowLayer />}
        <div className="cm-sway" style={lift}>
          <div className="cm-head">
            {!compact && <RippleLayer marked={mood === 'listening'} />}
            <HeadLayer id={id} mood={mood} plain={lite} />
            <BandLayer />
            <PropLayer mood={mood} />
            {!compact && <MotesLayer />}
          </div>
        </div>
      </div>
    </div>
  );
}
