import type { CSSProperties, JSX } from 'react';

/** Each scene is drawn in a 320 x 200 box. Colours come from CSS variables so light and dark share the shapes. */
export const VIEW = '0 0 320 200';

const d = (s: number): CSSProperties => ({ '--dl': `${s}s` }) as CSSProperties;
const at = (s: number, dx: number, dy: number): CSSProperties => ({ '--dl': `${s}s`, '--dx': dx, '--dy': dy }) as CSSProperties;

interface SceneProps {
  readonly id: string;
}

const DUST: ReadonlyArray<readonly [number, number, number, number]> = [
  [70, 70, 1.6, -0.2], [118, 112, 1.2, -1.1], [150, 56, 1.4, -2.1], [196, 98, 1.8, -0.7],
  [222, 64, 1.2, -1.6], [248, 124, 1.5, -2.5], [102, 140, 1.1, -0.4], [176, 134, 1.3, -1.9],
];

/** Quiet room at dusk: lamp glow, shelf, desk, drifting dust. */
export function FocusScene({ id }: SceneProps): JSX.Element {
  return (
    <>
      <defs>
        <radialGradient id={`${id}-g`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="var(--e)" stopOpacity="0.8" />
          <stop offset="1" stopColor="var(--e)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="320" height="200" className="va" />
      <rect y="110" width="320" height="90" className="vb" />
      <g className="vc">
        <rect x="26" y="40" width="96" height="5" /><rect x="26" y="78" width="96" height="5" />
        <rect x="32" y="22" width="9" height="18" /><rect x="44" y="26" width="7" height="14" /><rect x="54" y="20" width="10" height="20" />
        <rect x="34" y="60" width="12" height="18" /><rect x="50" y="64" width="8" height="14" /><rect x="86" y="58" width="22" height="20" rx="3" />
      </g>
      <circle className="vl-wglow" cx="214" cy="104" r="86" fill={`url(#${id}-g)`} />
      <g className="vd"><rect x="0" y="152" width="320" height="48" /><rect x="190" y="150" width="46" height="4" rx="2" opacity="0.6" /></g>
      <path className="vc" d="M213 150L215 114L209 114L207 150Z" />
      <path className="ve" d="M196 114L204 90Q214 82 224 90L232 114Z" />
      <rect className="vd" x="196" y="148" width="34" height="5" rx="2" />
      {DUST.map(([x, y, r, s]) => (
        <circle key={`${x}-${y}`} className="vf vl-drift" style={at(s, 4 + r, -6 - r)} cx={x} cy={y} r={r} />
      ))}
    </>
  );
}

/** Rolling hills, drifting clouds, swaying grass. */
export function CalmScene(): JSX.Element {
  const blades = [20, 52, 84, 116, 148, 180, 212, 244, 276, 300];
  return (
    <>
      <rect width="320" height="200" className="va" />
      <circle className="ve" cx="238" cy="62" r="26" opacity="0.7" />
      <g className="vf vl-cloud" style={d(0)}><ellipse cx="70" cy="48" rx="34" ry="9" opacity="0.7" /><ellipse cx="92" cy="42" rx="22" ry="8" opacity="0.7" /></g>
      <g className="vf vl-cloud" style={d(-1.5)}><ellipse cx="190" cy="30" rx="28" ry="7" opacity="0.6" /><ellipse cx="206" cy="26" rx="16" ry="6" opacity="0.6" /></g>
      <path className="vb" d="M0 132Q70 96 150 122T320 108V200H0Z" />
      <path className="vc" d="M0 150Q90 116 180 146T320 134V200H0Z" />
      <path className="vd" d="M0 176Q110 142 220 172T320 164V200H0Z" />
      {blades.map((x, i) => (
        <path key={x} className="vd vl-sway" style={d(-(i % 5) * 0.6)} d={`M${x} 200Q${x - 2} 188 ${x + 3} 178`} fill="none" stroke="var(--d)" strokeWidth="3" strokeLinecap="round" />
      ))}
    </>
  );
}

const STARS: ReadonlyArray<readonly [number, number, number, number]> = [
  [40, 30, 1.4, 0], [84, 58, 1, -1], [128, 24, 1.2, -2], [168, 52, 1, -0.5], [206, 20, 1.3, -1.5],
  [284, 40, 1.2, -2.5], [60, 96, 1, -1.2], [150, 88, 1.2, -0.3], [262, 92, 1, -2.2], [300, 70, 1, -0.8],
];

/** Night sky with slow stars, a moon with a faint halo and a dark ridge. */
export function SleepScene(): JSX.Element {
  return (
    <>
      <rect width="320" height="200" className="va" />
      <rect y="90" width="320" height="110" className="vb" opacity="0.5" />
      <circle className="ve vl-halo" cx="232" cy="62" r="38" opacity="0.12" />
      <circle className="ve" cx="232" cy="62" r="18" />
      <circle className="va" cx="239" cy="58" r="15" opacity="0.28" />
      {STARS.map(([x, y, r, s], i) => (
        <circle key={`${x}-${y}`} className={`vf ${i % 2 ? 'vl-twinkle' : 'vl-twinkle2'}`} style={d(s)} cx={x} cy={y} r={r} />
      ))}
      <g className="vf vl-cloud" style={d(-0.8)}><ellipse cx="110" cy="110" rx="46" ry="6" opacity="0.18" /></g>
      <path className="vc" d="M0 150Q60 118 130 140T250 130T320 144V200H0Z" />
      <path className="vd" d="M0 176Q80 150 170 172T320 160V200H0Z" />
    </>
  );
}

const DROPS: ReadonlyArray<readonly [number, number, number]> = [
  [44, 20, 0], [90, 40, -1.1], [140, 14, -2.2], [190, 34, -0.6], [236, 18, -1.7], [282, 44, -2.6],
];
const RINGS: ReadonlyArray<readonly [number, number, number]> = [[80, 170, 0], [150, 182, -1], [226, 168, -2], [270, 186, -0.5]];

/** Rain on leaves above a shimmering stream. */
export function NatureScene(): JSX.Element {
  return (
    <>
      <rect width="320" height="200" className="va" />
      <rect y="120" width="320" height="80" className="vb" />
      <g className="vc"><ellipse cx="40" cy="20" rx="70" ry="30" /><ellipse cx="250" cy="10" rx="90" ry="34" /></g>
      <g className="vd">
        <g transform="rotate(-16 52 76)"><ellipse className="vl-sway" style={d(0)} cx="52" cy="76" rx="44" ry="13" /></g>
        <g transform="rotate(14 262 64)"><ellipse className="vl-sway" style={d(-1.2)} cx="262" cy="64" rx="48" ry="14" /></g>
      </g>
      {DROPS.map(([x, y, s]) => (
        <line key={x} className="vf vl-fall" style={d(s)} x1={x} y1={y} x2={x - 2} y2={y + 10} stroke="var(--f)" strokeWidth="1.4" strokeLinecap="round" />
      ))}
      {[136, 150, 164, 178].map((y, i) => (
        <path key={y} className="vl-shimmer" style={d(-i * 0.7)} d={`M${30 + i * 20} ${y}Q${90 + i * 10} ${y - 6} ${150 + i * 14} ${y}T${290} ${y}`} fill="none" stroke="var(--f)" strokeWidth="1.6" strokeLinecap="round" />
      ))}
      {RINGS.map(([x, y, s]) => (
        <ellipse key={x} className="vl-ring" style={d(s)} cx={x} cy={y} rx="12" ry="3" fill="none" stroke="var(--f)" strokeWidth="1.2" />
      ))}
    </>
  );
}
