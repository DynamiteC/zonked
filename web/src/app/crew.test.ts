import { describe, expect, it } from 'vitest';
import { MAX_TRANSITION_SEC, MIN_TRANSITION_SEC, parseCrewState } from './crew';

const make = (score: number, level: string, transitionSec = 60) => ({
  version: 1,
  at: 1,
  burnout: { score, level },
  target: { beatHz: 10, carrierHz: 200, gain: 0.4, transitionSec, breathe: false },
  sbg: null,
});

describe('parseCrewState', () => {
  it.each([
    [0, 'focus'],
    [39, 'focus'],
    [40, 'flow'],
    [59, 'flow'],
    [60, 'recovery'],
    [79, 'recovery'],
    [80, 'decompress'],
    [100, 'decompress'],
  ])('derives level from score %i -> %s even when the sent level disagrees', (score, level) => {
    expect(parseCrewState(make(score, 'focus' === level ? 'decompress' : 'focus'))?.burnout.level).toBe(level);
  });

  it('keeps a hard transition floor of 5 s and a ceiling of 600 s', () => {
    expect(MIN_TRANSITION_SEC).toBe(5);
    expect(parseCrewState(make(10, 'focus', 0))?.target.transitionSec).toBe(5);
    expect(parseCrewState(make(10, 'focus', 99999))?.target.transitionSec).toBe(MAX_TRANSITION_SEC);
    expect(parseCrewState(make(10, 'focus', 30))?.target.transitionSec).toBe(30);
  });
});
