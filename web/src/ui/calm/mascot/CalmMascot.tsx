import { useId, useRef, type JSX } from 'react';
import './mascot.css';
import { Defs, EarsLayer, EyesLayer, FaceLayer, MotesLayer, PlatesLayer, ShadowLayer } from './layers';
import type { CalmMascotProps } from './types';
import { useParallax } from './useParallax';

/** Reads the OS reduced-motion setting. Safe where matchMedia is missing. */
function prefersReduced(): boolean {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;
}

export function CalmMascot({ mood = 'idle', size = 220, reducedMotion, label = 'Zonked mascot' }: CalmMascotProps): JSX.Element {
  const id = `cm${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const stage = useRef<HTMLDivElement>(null);
  const still = reducedMotion ?? prefersReduced();
  useParallax(stage, !still);
  const px = Number.isFinite(size) ? Math.max(48, Math.min(640, size)) : 220;
  return (
    <div
      ref={stage}
      className={`cm-stage cm-${mood}${still ? ' cm-still' : ''}`}
      style={{ width: px, height: px }}
      role="img"
      aria-label={label}
      data-mood={mood}
    >
      <Defs id={id} />
      <div className="cm-body">
        <div className="cm-head">
          <ShadowLayer />
          <EarsLayer id={id} />
          <FaceLayer id={id} />
          <EyesLayer id={id} />
          <PlatesLayer id={id} mood={mood} />
          <MotesLayer />
        </div>
        <span className="cm-z" aria-hidden="true">z</span>
      </div>
    </div>
  );
}
