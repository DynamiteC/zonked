import { describe, expect, it } from 'vitest';
import { SHORTCUTS, resolveShortcut, shortcutHelpRows } from './shortcuts';
import type { ActionId } from './shortcuts';

const EXPECTED: ReadonlyArray<[string, ActionId]> = [
  [' ', 'play-pause'], ['ArrowRight', 'next'], ['n', 'next'], ['N', 'next'], ['ArrowLeft', 'prev'], ['p', 'prev'],
  ['1', 'launch-1'], ['2', 'launch-2'], ['3', 'launch-3'], ['4', 'launch-4'], ['5', 'launch-5'],
  ['r', 'recommender'], ['t', 'timer-cycle'], ['m', 'mute'], ['+', 'gain-up'], ['=', 'gain-up'],
  ['-', 'gain-down'], ['?', 'help'], ['e', 'editor'], ['b', 'breathe'], ['Escape', 'escape'], ['Spacebar', 'play-pause'],
];

describe('shortcuts', () => {
  it.each(EXPECTED)('resolves %s', (key, action) => {
    expect(resolveShortcut({ key })).toBe(action);
  });
  it('every table key resolves to its own action', () => {
    for (const s of SHORTCUTS) for (const k of s.keys) expect(resolveShortcut({ key: k })).toBe(s.action);
  });
  it('has unique keys across actions', () => {
    const all = SHORTCUTS.flatMap((s) => s.keys.map((k) => k.toLowerCase()));
    expect(new Set(all).size).toBe(all.length);
  });
  it('returns undefined for unknown keys and for ctrl, meta or alt', () => {
    expect(resolveShortcut({ key: 'x' })).toBeUndefined();
    expect(resolveShortcut({ key: 'm', ctrlKey: true })).toBeUndefined();
    expect(resolveShortcut({ key: 'm', metaKey: true })).toBeUndefined();
    expect(resolveShortcut({ key: 'm', altKey: true })).toBeUndefined();
  });
  it('ignores typing targets', () => {
    for (const tagName of ['INPUT', 'select', 'TEXTAREA']) expect(resolveShortcut({ key: ' ', target: { tagName } })).toBeUndefined();
    expect(resolveShortcut({ key: 'm', target: { tagName: 'DIV', isContentEditable: true } })).toBeUndefined();
    expect(resolveShortcut({ key: 'm', target: { tagName: 'DIV' } })).toBe('mute');
    expect(resolveShortcut({ key: 'm', target: null })).toBe('mute');
  });
  it('renders help rows from the table', () => {
    const rows = shortcutHelpRows();
    expect(rows.find((r) => r.label === 'Play or pause')?.keys).toBe('Space');
    expect(rows.filter((r) => r.keys === '1-5')).toHaveLength(1);
    expect(rows.some((r) => r.keys.includes('Right'))).toBe(true);
  });
});
