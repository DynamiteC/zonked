import { describe, expect, it } from 'vitest';
import { CALM } from '../copy';
import { HUMAN_REVIEW_ONLY, messagesFor, supportedLanguages } from './index';

describe('i18n structure', () => {
  it('serves English for every tag today', () => {
    expect(supportedLanguages()).toEqual(['en']);
    expect(messagesFor('de-AT')).toBe(messagesFor('en-US'));
  });
  it('lists only real copy keys as human review only', () => {
    for (const k of HUMAN_REVIEW_ONLY) expect(Object.keys(CALM)).toContain(k);
  });
});
