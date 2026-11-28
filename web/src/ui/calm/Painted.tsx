import { useId } from 'react';
import './painted.css';

export type TimeOfDay4 = 'dawn' | 'day' | 'dusk' | 'night';

/** Sky for the hour: 05-08 dawn, 08-17 day, 17-20 dusk, else night. */
export function skyFor(hour: number): TimeOfDay4 {
  const h = Number.isFinite(hour) ? ((Math.floor(hour) % 24) + 24) % 24 : 12;
  if (h >= 5 && h < 8) return 'dawn';
  if (h >= 8 && h < 17) return 'day';
  if (h >= 17 && h < 20) return 'dusk';
  return 'night';
}

interface Props {
  readonly hour?: number;
}

/** The painted scene behind every screen: sky wash, glow, drifting clouds, three soft hills and paper grain. Decorative. */
export function Painted({ hour = new Date().getHours() }: Props): React.JSX.Element {
  const id = `pt${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
  const tod = skyFor(hour);
  return (
    <svg className="pt" data-tod={tod} viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false" data-testid="painted">
      <defs>
        <linearGradient id={`${id}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" className="pt-s1" />
          <stop offset="0.6" className="pt-s2" />
          <stop offset="1" className="pt-s3" />
        </linearGradient>
        <radialGradient id={`${id}-glow`}>
          <stop offset="0" className="pt-gl" stopOpacity="0.9" />
          <stop offset="1" className="pt-gl" stopOpacity="0" />
        </radialGradient>
        <filter id={`${id}-soft`} x="-2%" y="-2%" width="104%" height="104%">
          <feGaussianBlur stdDeviation="2.5" />
        </filter>
        <filter id={`${id}-cloud`} x="-20%" y="-50%" width="140%" height="200%">
          <feGaussianBlur stdDeviation="9" />
        </filter>
        <filter id={`${id}-grain`} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" seed="11" />
          <feColorMatrix values="0 0 0 0 0.3  0 0 0 0 0.25  0 0 0 0 0.2  0 0 0 0.9 -0.25" />
        </filter>
      </defs>
      <rect width="1600" height="900" fill={`url(#${id}-sky)`} />
      <circle className="pt-orb" cx="1180" cy="250" r="260" fill={`url(#${id}-glow)`} />
      <g className="pt-clouds" filter={`url(#${id}-cloud)`}>
        <g className="pt-cloud pt-c1"><ellipse cx="300" cy="190" rx="190" ry="34" /><ellipse cx="400" cy="168" rx="120" ry="30" /></g>
        <g className="pt-cloud pt-c2"><ellipse cx="900" cy="120" rx="150" ry="26" /><ellipse cx="970" cy="104" rx="90" ry="22" /></g>
        <g className="pt-cloud pt-c3"><ellipse cx="1380" cy="300" rx="170" ry="28" /><ellipse cx="1300" cy="284" rx="100" ry="24" /></g>
      </g>
      <g filter={`url(#${id}-soft)`}>
        <path className="pt-h1" d="M-40 620C200 540 420 540 640 600C860 660 1080 560 1300 540C1440 528 1540 560 1640 590V900H-40Z" />
        <path className="pt-h2" d="M-40 720C240 640 480 680 720 720C960 760 1200 660 1420 660C1500 660 1580 680 1640 700V900H-40Z" />
        <path className="pt-h3" d="M-40 820C260 770 520 800 800 830C1060 858 1300 790 1640 800V900H-40Z" />
      </g>
      <rect className="pt-grain" width="1600" height="900" filter={`url(#${id}-grain)`} />
      <rect className="pt-veil" width="1600" height="900" />
    </svg>
  );
}
