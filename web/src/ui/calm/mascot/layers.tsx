import type { JSX } from 'react';
import type { MascotMood } from './types';

const VB = '0 0 512 512';
const INK = '#2A2433';

interface IdProps {
  readonly id: string;
}

/** Soft ground shadow under the head. */
export function ShadowLayer(): JSX.Element {
  return (
    <svg className="cm-layer cm-shadow" viewBox={VB} aria-hidden="true" focusable="false">
      <ellipse cx="256" cy="476" rx="150" ry="22" fill="#6B3A12" opacity="0.2" filter="blur(6px)" />
    </svg>
  );
}

/** The round ochre body: painted gradient, soft watercolor edge, light rim, faint grain. */
export function FaceLayer({ id }: IdProps): JSX.Element {
  return (
    <svg className="cm-layer cm-face" viewBox={VB} aria-hidden="true" focusable="false">
      <g filter={`url(#${id}-paint)`}>
        <circle cx="256" cy="256" r="204" fill={`url(#${id}-gold)`} />
        <circle cx="256" cy="256" r="204" fill={`url(#${id}-shade)`} />
      </g>
      <path clipPath={`url(#${id}-disc)`} fillRule="evenodd" fill="#C8731F" opacity="0.26" d="M0 0H512V512H0ZM40 238a196 196 0 1 0 392 0a196 196 0 1 0 -392 0Z" />
      <rect x="52" y="52" width="408" height="408" fill="#000" filter={`url(#${id}-grain)`} opacity="0.1" clipPath={`url(#${id}-disc)`} />
      <circle cx="256" cy="256" r="198" fill="none" stroke="#FFF3D0" strokeOpacity="0.55" strokeWidth="5" strokeDasharray="280 1000" strokeLinecap="round" transform="rotate(-150 256 256)" />
    </svg>
  );
}

/** Dark visor wrapping the eyes, gem on the brow, and cream eyes inside. */
export function EyesLayer({ id }: IdProps): JSX.Element {
  const eye = (cx: number): JSX.Element => (
    <g className="cm-eye">
      <circle cx={cx} cy="172" r="34" fill="#FFF6DC" />
      <circle cx={cx} cy="174" r="21" fill={INK} />
      <circle cx={cx} cy="174" r="21" fill="none" stroke="#B4531A" strokeWidth="3" opacity="0.6" />
      <circle cx={cx - 8} cy="164" r="7" fill="#FFFFFF" opacity="0.9" />
      <circle cx={cx + 9} cy="184" r="3" fill="#FFFFFF" opacity="0.6" />
    </g>
  );
  return (
    <svg className="cm-layer cm-eyes" viewBox={VB} aria-hidden="true" focusable="false">
      <g filter={`url(#${id}-paint)`}>
        <path d="M92 170Q92 112 168 114L344 114Q420 112 420 170Q420 230 346 230L300 230Q276 214 256 214Q236 214 212 230L166 230Q92 230 92 170Z" fill={INK} stroke="#8A4A12" strokeWidth="4" strokeLinejoin="round" />
      </g>
      <path d="M118 126Q256 104 394 126" fill="none" stroke="#FFFFFF" strokeOpacity="0.14" strokeWidth="6" strokeLinecap="round" />
      {eye(178)}
      {eye(334)}
      <polygon points="256,142 268,158 256,174 244,158" fill="#00E5A8" stroke="#E8B04A" strokeWidth="4" strokeLinejoin="round" />
    </svg>
  );
}

/** Rosy cheeks and a mouth that follows the mood. */
export function PlatesLayer({ id, mood }: IdProps & { readonly mood: MascotMood }): JSX.Element {
  const line = { fill: 'none', stroke: INK, strokeWidth: 7, strokeLinecap: 'round' } as const;
  return (
    <svg className="cm-layer cm-plates" viewBox={VB} aria-hidden="true" focusable="false">
      <circle cx="132" cy="276" r="38" fill={`url(#${id}-blush)`} />
      <circle cx="380" cy="276" r="38" fill={`url(#${id}-blush)`} />
      {mood === 'happy' && <path className="cm-mouth" d="M214 292Q256 340 298 292" {...line} />}
      {mood === 'sleepy' && <path className="cm-mouth" d="M236 304Q256 310 276 304" {...line} strokeWidth={6} />}
      {mood === 'breathing' && <ellipse className="cm-mouth" cx="256" cy="308" rx="12" ry="15" fill={INK} />}
      {(mood === 'idle' || mood === 'listening') && <path className="cm-mouth" d="M228 296Q256 322 284 296" {...line} />}
    </svg>
  );
}

/** Floating dust motes, drawn above everything. */
export function MotesLayer(): JSX.Element {
  const motes: ReadonlyArray<readonly [number, number, number]> = [
    [70, 110, 4], [440, 90, 3], [400, 430, 4], [90, 410, 3], [256, 40, 3], [470, 300, 2],
  ];
  return (
    <svg className="cm-layer cm-motes" viewBox={VB} aria-hidden="true" focusable="false">
      {motes.map(([x, y, r], i) => (
        <circle key={`${x}-${y}`} className="cm-mote" style={{ animationDelay: `${i * -1.3}s` }} cx={x} cy={y} r={r} fill="#FFF3C9" />
      ))}
    </svg>
  );
}

/** Shared paint: gradients and grain filter. Ids are per instance. */
export function Defs({ id }: IdProps): JSX.Element {
  return (
    <svg className="cm-defs" width="0" height="0" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}-gold`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFE9A8" />
          <stop offset="0.5" stopColor="#F6C255" />
          <stop offset="1" stopColor="#DE9530" />
        </linearGradient>
        <radialGradient id={`${id}-shade`} cx="0.35" cy="0.3" r="0.85">
          <stop offset="0.5" stopColor="#B4531A" stopOpacity="0" />
          <stop offset="1" stopColor="#B4531A" stopOpacity="0.35" />
        </radialGradient>
        <radialGradient id={`${id}-blush`}>
          <stop offset="0" stopColor="#F0788A" stopOpacity="0.6" />
          <stop offset="1" stopColor="#F0788A" stopOpacity="0" />
        </radialGradient>
        <filter id={`${id}-paint`} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="3" result="t" />
          <feDisplacementMap in="SourceGraphic" in2="t" scale="5" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <clipPath id={`${id}-disc`}>
          <circle cx="256" cy="256" r="204" />
        </clipPath>
        <filter id={`${id}-grain`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" />
          <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1.2 -0.1" result="n" />
          <feComposite in="n" in2="SourceAlpha" operator="in" />
        </filter>
      </defs>
    </svg>
  );
}
