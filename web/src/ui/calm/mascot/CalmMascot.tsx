import { useId, useRef, type CSSProperties, type JSX } from 'react';
import './mascot.css';
import { Defs, EarsLayer, EyesLayer, FaceLayer, MotesLayer, PlatesLayer, ShadowLayer } from './layers';
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

export function CalmMascot({ mood = 'idle', size = 220, reducedMotion, label = 'Zonked mascot', breathPhase, level, situation }: CalmMascotProps): JSX.Element {
  const id = `cm${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const stage = useRef<HTMLDivElement>(null);
  const still = reducedMotion ?? prefersReduced();
  useParallax(stage, !still);
  const px = Number.isFinite(size) ? Math.max(48, Math.min(640, size)) : 220;
  return (
    <div
      ref={stage}
      className={`cm-stage cm-${mood}${situation ? ` cm-s-${situation}` : ''}${still ? ' cm-still' : ''}${breathPhase !== undefined ? ' cm-driven' : ''}`}
      style={{ width: px, height: px, '--bp': unit(breathPhase), '--lv': level === undefined && mood === 'listening' ? 0.35 : unit(level) } as CSSProperties}
      role="img"
      aria-label={label}
      data-mood={mood}
      data-situation={situation}
    >
      <Defs id={id} />
      <div className="cm-body">
        <ShadowLayer />
        <BodyLayer id={id} />
        <div className="cm-sway">
          <div className="cm-head">
            <RippleLayer />
            <EarsLayer id={id} />
            <FaceLayer id={id} />
            <EyesLayer id={id} />
            <PlatesLayer id={id} mood={mood} />
            <BandLayer />
            <MotesLayer />
          </div>
        </div>
        <span className="cm-z" aria-hidden="true">z</span>
      </div>
    </div>
  );
}
