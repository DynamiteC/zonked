// Where translated text will live. Today only English ships.
// To add a language: copy copy-ux.ts into i18n/<code>.ts with the same keys, register it in BUNDLES,
// and have a native speaker review it. Hearing-safety and not-a-medical-device text must be
// written or reviewed by a person, never machine translated: it is listed in HUMAN_REVIEW_ONLY and
// stays English until a reviewed bundle exists for that language.
import { UX } from '../copy-ux';

export type UxMessages = typeof UX;

const BUNDLES: Readonly<Record<string, UxMessages>> = { en: UX };

/** Keys of copy.ts that carry safety meaning. A language may use them only after human review. */
export const HUMAN_REVIEW_ONLY: readonly string[] = ['safetyTitle', 'safetyLines', 'safetyLimits', 'safetyAccept', 'notMedical', 'volumeCapped'];

/** The bundle for a language tag such as "de-AT". Falls back to English. */
export function messagesFor(tag: string): UxMessages {
  const base = tag.toLowerCase().split('-')[0] ?? 'en';
  return BUNDLES[base] ?? UX;
}

export const supportedLanguages = (): readonly string[] => Object.keys(BUNDLES);
