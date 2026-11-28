import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const css = readFileSync(new URL('./form.css', import.meta.url), 'utf8');
/** The last rule for a selector wins, so read the last block. */
const last = (sel: string): string => {
  const hits = [...css.matchAll(new RegExp(`${sel.replaceAll('.', '\\.').replaceAll(' ', '\\s+')}\\s*\\{([^}]*)\\}`, 'g'))];
  return hits[hits.length - 1]?.[1] ?? '';
};

describe('Options sheet fit at 390 px (style rules; the pixel check is scripts/check-sheet-fit.mjs)', () => {
  it('the sheet never scrolls sideways', () => {
    expect(last('.c-opts')).toMatch(/overflow-x:\s*hidden/);
    expect(last('.c-opts')).toMatch(/box-sizing:\s*border-box/);
  });
  it('nature chips wrap and long labels wrap inside the chip', () => {
    expect(last('.c-opts .c-chips.c-nature-row')).toMatch(/flex-wrap:\s*wrap/);
    expect(last('.c-opts .c-nature-row .c-tchip')).toMatch(/white-space:\s*normal/);
    expect(last('.c-opts .c-nature-row .c-tchip')).toMatch(/max-width:\s*100%/);
  });
  it('the code field can shrink', () => {
    expect(last('.c-mix-in')).toMatch(/min-width:\s*0/);
  });
});
