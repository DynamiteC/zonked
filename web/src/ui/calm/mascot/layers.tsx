import type { JSX } from 'react';
import type { MascotMood } from './types';

const VB = '0 0 512 512';
const INK = '#3A2A2E';
const HEAD = { x: 256, y: 200, r: 150 } as const;

interface IdProps {
  readonly id: string;
}

/** A small mound of grass the character sits on. Soft edge, no outline. */
export function ShadowLayer(): JSX.Element {
  return (
    <svg className="cm-layer cm-shadow" viewBox={VB} aria-hidden="true" focusable="false">
      <path d="M-20 512C20 462 120 440 256 440C392 440 492 462 532 512Z" fill="#9DB07E" />
      <path d="M40 512C90 474 170 458 256 458C342 458 422 474 472 512Z" fill="#B3C28F" opacity="0.7" />
      <ellipse cx="256" cy="470" rx="120" ry="12" fill="#4F5F3C" opacity="0.28" />
    </svg>
  );
}

/** The round yellow head: flat watercolor fill, soft shade, warm rim light, hand drawn ink outline. */
export function FaceLayer({ id }: IdProps): JSX.Element {
  return (
    <svg className="cm-layer cm-face" viewBox={VB} aria-hidden="true" focusable="false">
      <g filter={`url(#${id}-paint)`}>
        <circle cx={HEAD.x} cy={HEAD.y} r={HEAD.r} fill="#F7C95A" />
        <circle cx={HEAD.x} cy={HEAD.y} r={HEAD.r} fill={`url(#${id}-shade)`} />
        <circle cx={HEAD.x} cy={HEAD.y} r="140" fill="none" stroke="#FFB45C" strokeOpacity="0.55" strokeWidth="9" strokeDasharray="250 1000" strokeLinecap="round" transform="rotate(10 256 200)" />
        <circle cx={HEAD.x} cy={HEAD.y} r={HEAD.r} fill="none" stroke={INK} strokeWidth="4" />
        <circle cx={HEAD.x} cy={HEAD.y} r={HEAD.r} fill="none" stroke={INK} strokeWidth="4" strokeDasharray="330 1000" strokeLinecap="round" transform="rotate(100 256 200)" />
      </g>
      <rect x="100" y="50" width="312" height="300" fill="#000" filter={`url(#${id}-grain)`} opacity="0.08" clipPath={`url(#${id}-disc)`} />
    </svg>
  );
}

/** Soft visor with the brow gem, and calm eyes inside. */
export function EyesLayer({ id }: IdProps): JSX.Element {
  const eye = (cx: number): JSX.Element => (
    <g className="cm-eye">
      <circle cx={cx} cy="188" r="25" fill="#FFF6DC" stroke={INK} strokeWidth="3" />
      <circle cx={cx} cy="190" r="14" fill={INK} />
      <circle cx={cx - 5} cy="184" r="4" fill="#FFF6DC" />
    </g>
  );
  return (
    <svg className="cm-layer cm-eyes" viewBox={VB} aria-hidden="true" focusable="false">
      <g filter={`url(#${id}-paint)`}>
        <path d="M128 186Q128 146 182 148L330 148Q384 146 384 186Q384 232 330 232L290 232Q272 220 256 220Q240 220 222 232L182 232Q128 232 128 186Z" fill="#8A5A3A" fillOpacity="0.92" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      </g>
      {eye(196)}
      {eye(316)}
      <polygon points="256,110 266,124 256,138 246,124" fill="#7FE0C4" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
    </svg>
  );
}

/** Rosy cheeks and a mouth that follows the mood. */
export function PlatesLayer({ id, mood }: IdProps & { readonly mood: MascotMood }): JSX.Element {
  const line = { fill: 'none', stroke: INK, strokeWidth: 5, strokeLinecap: 'round' } as const;
  return (
    <svg className="cm-layer cm-plates" viewBox={VB} aria-hidden="true" focusable="false">
      <circle cx="160" cy="258" r="30" fill={`url(#${id}-blush)`} />
      <circle cx="352" cy="258" r="30" fill={`url(#${id}-blush)`} />
      {mood === 'happy' && <path className="cm-mouth" d="M226 262Q256 294 286 262" {...line} />}
      {mood === 'sleepy' && <path className="cm-mouth" d="M240 272Q256 277 272 272" {...line} strokeWidth={4} />}
      {mood === 'breathing' && <ellipse className="cm-mouth" cx="256" cy="274" rx="9" ry="11" fill={INK} />}
      {(mood === 'idle' || mood === 'listening') && <path className="cm-mouth" d="M234 266Q256 282 278 266" {...line} />}
    </svg>
  );
}

/** Floating dust motes, drawn above everything. */
export function MotesLayer(): JSX.Element {
  const motes: ReadonlyArray<readonly [number, number, number]> = [
    [70, 110, 4], [440, 90, 3], [400, 430, 4], [90, 410, 3], [256, 30, 3], [470, 300, 2],
  ];
  return (
    <svg className="cm-layer cm-motes" viewBox={VB} aria-hidden="true" focusable="false">
      {motes.map(([x, y, r], i) => (
        <circle key={`${x}-${y}`} className="cm-mote" style={{ animationDelay: `${i * -1.3}s` }} cx={x} cy={y} r={r} fill="#FFF3C9" />
      ))}
    </svg>
  );
}

/** Shared paint: soft shade, blush, and the two filters. Ids are per instance. */
export function Defs({ id }: IdProps): JSX.Element {
  return (
    <svg className="cm-defs" width="0" height="0" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={`${id}-shade`} cx="0.35" cy="0.3" r="0.9">
          <stop offset="0.55" stopColor="#C9772A" stopOpacity="0" />
          <stop offset="1" stopColor="#C9772A" stopOpacity="0.3" />
        </radialGradient>
        <radialGradient id={`${id}-blush`}>
          <stop offset="0" stopColor="#EE7F8E" stopOpacity="0.55" />
          <stop offset="1" stopColor="#EE7F8E" stopOpacity="0" />
        </radialGradient>
        <filter id={`${id}-paint`} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="2" seed="3" result="t" />
          <feDisplacementMap in="SourceGraphic" in2="t" scale="4" xChannelSelector="R" yChannelSelector="G" />
        </filter>
        <clipPath id={`${id}-disc`}>
          <circle cx={HEAD.x} cy={HEAD.y} r={HEAD.r} />
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
