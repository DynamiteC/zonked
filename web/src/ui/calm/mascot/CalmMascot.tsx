import { useId, useRef, type CSSProperties, type JSX } from 'react';
import './mascot.css';
import { Defs, HeadLayer, MotesLayer, ShadowLayer } from './layers';
import { BandLayer, BodyLayer, RippleLayer } from './layersExtra';
import type { CalmMascotProps } from './types';
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

export function CalmMascot({ mood = 'idle', size = 220, reducedMotion, label = 'Zonked mascot', breathPhase, level, situation }: CalmMascotProps): JSX.Element {
  const id = `cm${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const stage = useRef<HTMLDivElement>(null);
  const still = reducedMotion ?? prefersReduced();
  const px = Number.isFinite(size) ? Math.max(24, Math.min(640, size)) : 220;
  const compact = px <= COMPACT_MAX;
  useParallax(stage, !still && !compact);
  return (
    <div
      ref={stage}
      className={`cm-stage cm-${mood}${situation ? ` cm-s-${situation}` : ''}${still ? ' cm-still' : ''}${compact ? ' cm-compact' : ''}${breathPhase !== undefined ? ' cm-driven' : ''}`}
      style={{ width: px, height: px, '--bp': unit(breathPhase), '--lv': level === undefined && mood === 'listening' ? 0.35 : unit(level) } as CSSProperties}
      role="img"
      aria-label={label}
      data-mood={mood}
      data-situation={situation}
    >
      <Defs id={id} />
      <div className="cm-body">
        {!compact && <ShadowLayer />}
        {!compact && <BodyLayer id={id} />}
        <div className="cm-sway">
          <div className="cm-head">
            {!compact && <RippleLayer />}
            <HeadLayer id={id} mood={mood} plain={compact} />
            <BandLayer />
            {!compact && <MotesLayer />}
          </div>
        </div>
        {!compact && <span className="cm-z" aria-hidden="true">z</span>}
      </div>
    </div>
  );
}
