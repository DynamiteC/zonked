import type { JSX } from 'react';
import type { MascotMood } from './types';

/** Eye shapes. Each is one glance apart at 72 px. The marker is `data-eye` on the eye group. */
export type EyeKind = 'ring' | 'arc' | 'closed' | 'lid' | 'half' | 'narrow' | 'heavy' | 'up' | 'squint' | 'dial';

/** Left and right eye per mood. Only error uses two different eyes. */
export const EYES: Readonly<Record<MascotMood, readonly [EyeKind, EyeKind]>> = {
  idle: ['ring', 'ring'],
  listening: ['half', 'half'],
  happy: ['arc', 'arc'],
  sleepy: ['lid', 'lid'],
  breathing: ['ring', 'ring'],
  focus: ['narrow', 'narrow'],
  steering: ['ring', 'ring'],
  tired: ['heavy', 'heavy'],
  done: ['closed', 'closed'],
  offline: ['up', 'up'],
  error: ['ring', 'squint'],
  loading: ['dial', 'dial'],
};

const GOLD = '#FFDC1A';
const INK = '#3A2A2E';
const R = 40;
const CY = 150;

/** A cap of the eye disc cut by a chord at CY + d. `top` keeps the part above the chord. */
function cap(cx: number, d: number, top: boolean): string {
  const w = Math.sqrt(R * R - d * d);
  const y = CY + d;
  if (top) return `M${cx - w} ${y}A${R} ${R} 0 ${d > 0 ? 1 : 0} 1 ${cx + w} ${y}Z`;
  return `M${cx + w} ${y}A${R} ${R} 0 ${d < 0 ? 1 : 0} 1 ${cx - w} ${y}Z`;
}

function Lid({ cx, d, top = true, tilt = 0 }: { readonly cx: number; readonly d: number; readonly top?: boolean; readonly tilt?: number }): JSX.Element {
  return <path className="cm-lid" d={cap(cx, d, top)} fill={GOLD} stroke={INK} strokeWidth="4" strokeLinejoin="round" transform={tilt ? `rotate(${tilt} ${cx} ${CY})` : undefined} />;
}

function Open({ cx, lift = 0 }: { readonly cx: number; readonly lift?: number }): JSX.Element {
  return (
    <>
      <circle className="cm-ring cm-s-gold" cx={cx} cy={CY} r="24" fill="none" stroke="#FFD23A" strokeWidth="4" strokeOpacity="0.85" />
      <circle className="cm-pupil cm-f-gold" cx={cx} cy={CY + lift} r="8" fill="#FFD23A" />
      <circle cx={cx - 9} cy={CY - 10 + lift} r="4" fill="#FFF6DC" opacity="0.8" />
    </>
  );
}

function Face({ cx, kind, side }: { readonly cx: number; readonly kind: EyeKind; readonly side: 1 | -1 }): JSX.Element {
  switch (kind) {
    case 'arc':
      return <path className="cm-s-gold" d={`M${cx - 20} 160A20 20 0 0 1 ${cx + 20} 160`} fill="none" stroke="#FFD23A" strokeWidth="8" strokeLinecap="round" />;
    case 'closed':
      return <path className="cm-s-gold" d={`M${cx - 20} 142Q${cx} 170 ${cx + 20} 142`} fill="none" stroke="#FFD23A" strokeWidth="8" strokeLinecap="round" />;
    case 'up':
      return <Open cx={cx} lift={-10} />;
    case 'dial':
      return (
        <>
          <g className="cm-dial">
            <circle className="cm-ring cm-s-gold" cx={cx} cy={CY} r="24" fill="none" stroke="#FFD23A" strokeWidth="5" strokeDasharray="8 10" strokeLinecap="round" />
            <path d={`M${cx} ${CY - 34}V${CY - 28}M${cx + 34} ${CY}H${cx + 28}M${cx} ${CY + 34}V${CY + 28}M${cx - 34} ${CY}H${cx - 28}`} stroke="#FFD23A" strokeWidth="4" strokeLinecap="round" />
          </g>
          <circle className="cm-pupil cm-f-gold" cx={cx} cy={CY} r="5" fill="#FFD23A" />
        </>
      );
    case 'lid':
      return <><Open cx={cx} /><Lid cx={cx} d={20} /></>;
    case 'half':
      return <><Open cx={cx} /><Lid cx={cx} d={4} /></>;
    case 'narrow':
      return <><Open cx={cx} /><Lid cx={cx} d={-11} /><Lid cx={cx} d={11} top={false} /></>;
    case 'heavy':
      return <><Open cx={cx} /><Lid cx={cx} d={12} tilt={side * 14} /></>;
    case 'squint':
      return <><Open cx={cx} /><Lid cx={cx} d={-4} tilt={-side * 8} /><Lid cx={cx} d={13} top={false} /></>;
    default:
      return <Open cx={cx} />;
  }
}

export function Eye({ cx, kind, side }: { readonly cx: number; readonly kind: EyeKind; readonly side: 1 | -1 }): JSX.Element {
  return (
    <g className="cm-eye" data-eye={kind}>
      <circle className="cm-f-mask cm-s-ink" cx={cx} cy={CY} r={R} fill="#241F2B" strokeWidth="5" />
      <Face cx={cx} kind={kind} side={side} />
    </g>
  );
}
