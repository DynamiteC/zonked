import type { ComponentType } from 'react';
import type { AdvancedPanelsProps } from '../advanced/index';

/** The one place that names the Advanced panels module. Loaded only when the Advanced section opens. */
export const loadAdvanced = (): Promise<{ default: ComponentType<AdvancedPanelsProps> }> => import('../advanced/index').then((m) => ({ default: m.AdvancedPanels }));
