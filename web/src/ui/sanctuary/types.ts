import type { Mix, MixDraft } from '../../app/mixes';
import type { Store } from '../../storage/db';

export type SanctuarySection = 'mission' | 'guide' | 'favorites' | 'mixes' | 'milestones' | 'data';

export interface SanctuaryProps {
  readonly section: SanctuarySection;
  readonly store: Store;
  readonly now: () => number;
  readonly nowPlaying: { readonly kind: 'template' | 'preset' | 'custom' | 'mix'; readonly id: string } | null;
  readonly currentMix: () => MixDraft | null;
  readonly onLoadMix: (mix: Mix) => void;
  readonly onPlayTemplate: (id: string) => void;
  readonly reducedMotion: boolean;
  readonly onClose: () => void;
}
