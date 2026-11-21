/** Single source of truth for keyboard shortcuts and the help popover (contract C5). */

export type ActionId =
  | 'play-pause'
  | 'next'
  | 'prev'
  | 'launch-1'
  | 'launch-2'
  | 'launch-3'
  | 'launch-4'
  | 'launch-5'
  | 'recommender'
  | 'timer-cycle'
  | 'mute'
  | 'gain-up'
  | 'gain-down'
  | 'help'
  | 'editor'
  | 'breathe'
  | 'escape';

export interface Shortcut {
  /** Values of KeyboardEvent.key. Letters are matched case-insensitively. */
  readonly keys: readonly string[];
  readonly label: string;
  readonly action: ActionId;
}

export const SHORTCUTS: readonly Shortcut[] = [
  { keys: [' '], label: 'Play or pause', action: 'play-pause' },
  { keys: ['ArrowRight', 'n'], label: 'Next template', action: 'next' },
  { keys: ['ArrowLeft', 'p'], label: 'Previous template', action: 'prev' },
  { keys: ['1'], label: 'Launch recommendation 1', action: 'launch-1' },
  { keys: ['2'], label: 'Launch recommendation 2', action: 'launch-2' },
  { keys: ['3'], label: 'Launch recommendation 3', action: 'launch-3' },
  { keys: ['4'], label: 'Launch recommendation 4', action: 'launch-4' },
  { keys: ['5'], label: 'Launch recommendation 5', action: 'launch-5' },
  { keys: ['r'], label: 'Open the recommender', action: 'recommender' },
  { keys: ['t'], label: 'Cycle the timer', action: 'timer-cycle' },
  { keys: ['m'], label: 'Mute or unmute', action: 'mute' },
  { keys: ['+', '='], label: 'Volume up', action: 'gain-up' },
  { keys: ['-', '_'], label: 'Volume down', action: 'gain-down' },
  { keys: ['?'], label: 'Show shortcuts', action: 'help' },
  { keys: ['e'], label: 'Open the editor', action: 'editor' },
  { keys: ['b'], label: 'Toggle breathing pacer', action: 'breathe' },
  { keys: ['Escape'], label: 'Close drawers and popovers', action: 'escape' },
];

export interface KeyEventLike {
  readonly key: string;
  readonly ctrlKey?: boolean;
  readonly metaKey?: boolean;
  readonly altKey?: boolean;
  readonly target?: unknown;
}

const TYPING_TAGS: ReadonlySet<string> = new Set(['INPUT', 'SELECT', 'TEXTAREA']);

/** True when keyboard focus is in a field where keys mean text entry. */
export function isTypingTarget(target: unknown): boolean {
  if (typeof target !== 'object' || target === null) return false;
  const t = target as { tagName?: unknown; isContentEditable?: unknown };
  if (t.isContentEditable === true) return true;
  return typeof t.tagName === 'string' && TYPING_TAGS.has(t.tagName.toUpperCase());
}

const BY_KEY: ReadonlyMap<string, ActionId> = new Map(
  SHORTCUTS.flatMap((s) => s.keys.map((k) => [k.length === 1 ? k.toLowerCase() : k, s.action] as const)),
);

/** Maps a key event to an action. Shift is not checked, so '?' and '+' work on every layout. */
export function resolveShortcut(e: KeyEventLike): ActionId | undefined {
  if (e.ctrlKey === true || e.metaKey === true || e.altKey === true) return undefined;
  if (isTypingTarget(e.target)) return undefined;
  const key = e.key === 'Spacebar' ? ' ' : e.key.length === 1 ? e.key.toLowerCase() : e.key;
  return BY_KEY.get(key);
}

export interface ShortcutHelpRow {
  readonly keys: string;
  readonly label: string;
}

const KEY_NAMES: Readonly<Record<string, string>> = {
  ' ': 'Space',
  ArrowRight: 'Right',
  ArrowLeft: 'Left',
  Escape: 'Esc',
};

/** Rows for the help popover, rendered from SHORTCUTS. Launch 1 to 5 collapse into one row. */
export function shortcutHelpRows(): ShortcutHelpRow[] {
  const rows: ShortcutHelpRow[] = [];
  let launchAdded = false;
  for (const s of SHORTCUTS) {
    if (s.action.startsWith('launch-')) {
      if (!launchAdded) rows.push({ keys: '1-5', label: 'Launch top recommendation' });
      launchAdded = true;
      continue;
    }
    rows.push({ keys: s.keys.map((k) => KEY_NAMES[k] ?? k.toUpperCase()).join(' / '), label: s.label });
  }
  return rows;
}
