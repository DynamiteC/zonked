/**
 * Zonked catalog: pure TypeScript, no DOM. Lazy-load this module (dynamic import) so the
 * template data stays out of the first-load bundle. Nothing is built at import time.
 */
export * from './types';
export { getTemplates, TEMPLATES } from './registry';
export { buildTemplates } from './build';
export { templateToEvents, resolveLayers } from './events';
export { recommendTemplates } from './recommend';
export { searchTemplates } from './search';
export { usesPercussion, usesCrackle, usesBinaural } from './features';
