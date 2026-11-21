import { usesBinaural, usesCrackle, usesPercussion } from './features';
import { getTemplates } from './registry';
import type { Category, RecContext, Recommendation, Template, TimeOfDay } from './types';

/** Time of day affinity per category: morning, afternoon, evening, night (0..1). */
const TOD: Record<Category, readonly [number, number, number, number]> = {
  focus: [1, 1, 0.5, 0.1],
  'adhd-control': [1, 1, 0.5, 0.1],
  vibes: [0.5, 0.8, 1, 0.5],
  'work-recovery': [0.5, 1, 1, 0.4],
  healing: [0.6, 0.7, 1, 0.8],
  meditation: [1, 0.6, 1, 0.6],
  sleep: [0, 0.2, 0.7, 1],
  'lucid-dreams': [0, 0.1, 0.6, 1],
};
const TOD_INDEX: Record<TimeOfDay, number> = { morning: 0, afternoon: 1, evening: 2, night: 3 };

interface Scored {
  readonly template: Template;
  readonly score: number;
  readonly reasons: string[];
  readonly sensitive: boolean;
  readonly onSituation: boolean;
}

const round1 = (n: number): number => Math.round(n * 10) / 10;

function durationFit(rec: number, avail: number, reasons: string[]): number {
  const a = Math.max(1, avail);
  if (rec <= a) {
    reasons.push(`Fits your ${a} minutes (${rec} min).`);
    return 15 * (0.6 + 0.4 * (rec / a));
  }
  const over = (rec - a) / a;
  reasons.push(`Runs ${rec} min, longer than your ${a}; you can stop any time.`);
  return Math.max(0, 15 * (1 - over * 1.5)) - (over > 0.5 ? 5 : 0);
}

function deviceFit(t: Template, ctx: RecContext, reasons: string[]): number {
  if (ctx.deviceType === 'speaker') {
    if (!usesBinaural(t)) {
      reasons.push('Isochronic or monaural beats work over speakers.');
      return 10;
    }
    reasons.push('Warning: binaural beats need headphones. A speaker will not deliver the effect; pick an isochronic or monaural template if you can.');
    return -8;
  }
  reasons.push(ctx.deviceType === 'bluetooth' ? 'Good over Bluetooth headphones.' : 'Headphones suit every beat type.');
  return usesBinaural(t) ? 10 : 8;
}

function sensitivityFit(t: Template, ctx: RecContext, reasons: string[]): { pts: number; sensitive: boolean } {
  const sensitive = t.intensity > 3 || usesPercussion(t) || usesCrackle(t);
  const s = ctx.sensorySensitivity;
  if (s === 'low') return { pts: 10, sensitive: false };
  if (s === 'medium') return { pts: t.intensity <= 3 ? (sensitive ? 7 : 10) : 4, sensitive: false };
  if (!sensitive) {
    reasons.push('Gentle: low intensity, no percussion or crackle.');
    return { pts: t.intensity <= 2 ? 10 : 7, sensitive: false };
  }
  reasons.push('Relaxed filter: this one is stronger or has percussion or crackle, shown because too few gentle matches exist.');
  return { pts: 0, sensitive: true };
}

function scoreOne(t: Template, ctx: RecContext): Scored {
  const reasons: string[] = [t.reasonTemplate.replace('{minutes}', String(t.recommendedMinutes))];
  const onSituation = t.situations.includes(ctx.situation);
  let score = 0;
  if (onSituation) {
    score += 40;
    reasons.push(`Made for: ${ctx.situation}.`);
  } else reasons.push(`Related option: not built for ${ctx.situation}, but close in mood.`);
  if (ctx.vibe === undefined) score += 7;
  else if (ctx.vibe === t.vibe) {
    score += 15;
    reasons.push(`Matches your ${ctx.vibe} vibe.`);
  }
  score += durationFit(t.recommendedMinutes, ctx.availableMinutes, reasons);
  const tod = (TOD[t.category][TOD_INDEX[ctx.timeOfDay]] ?? 0) * 10;
  score += tod;
  if (tod >= 8) reasons.push(`Suits the ${ctx.timeOfDay}.`);
  if (t.intensity >= 4 && ctx.timeOfDay === 'night') score -= 5;
  score += deviceFit(t, ctx, reasons);
  const sens = sensitivityFit(t, ctx, reasons);
  score += sens.pts;
  return { template: t, score: Math.max(0, round1(score)), reasons, sensitive: sens.sensitive, onSituation };
}

const byScore = (a: Scored, b: Scored): number =>
  b.score - a.score || (a.template.id < b.template.id ? -1 : a.template.id > b.template.id ? 1 : 0);

/**
 * Pure, deterministic recommender. Always returns at least `limit` (default 5) distinct templates.
 * Filters (situation match, sensitivity exclusions) are relaxed in tiers when too few remain,
 * and relaxed picks say so in their reasons.
 */
export function recommendTemplates(ctx: RecContext, limit = 5, pool: readonly Template[] = getTemplates()): Recommendation[] {
  const n = Math.max(1, Math.floor(limit));
  const all = pool.map((t) => scoreOne(t, ctx)).sort(byScore);
  const tiers = [
    all.filter((s) => s.onSituation && !s.sensitive),
    all.filter((s) => !s.sensitive),
    all,
  ];
  const chosen = tiers.find((tier) => tier.length >= n) ?? all;
  const picked = chosen.slice(0, n);
  if (chosen !== tiers[0]) {
    picked.forEach((p) => {
      if (!p.onSituation) p.reasons.push('Filters relaxed: too few exact matches, so close alternatives are included.');
    });
  }
  return picked.map((p) => ({ template: p.template, score: p.score, reasons: p.reasons }));
}
