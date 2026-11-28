import { forgetPrefs } from './prefs';
import { removeAllOwn } from './ownStore';

/** Part of "Forget my data": the nature choice and every sound the person added. */
export async function forgetNature(): Promise<void> {
  forgetPrefs();
  await removeAllOwn();
}
