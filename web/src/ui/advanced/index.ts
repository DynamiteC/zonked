/**
 * Pro options for the Calm Options sheet. Load lazily:
 *   const AdvancedPanels = lazy(() => import('./advanced').then((m) => ({ default: m.AdvancedPanels })));
 * Usage: <AdvancedPanels engine={engine} player={player} onClose={close} />
 */
export { AdvancedPanels } from './AdvancedPanels';
export type { AdvancedPanelsProps } from './AdvancedPanels';
