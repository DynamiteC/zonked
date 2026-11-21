import type { Preset } from '../types';

const DEEP_FOCUS = `# Deep Focus: 40 Hz gamma binaural beat on a 200 Hz carrier.
mode: bin
focus: 200+40/0.4
00:00:00 focus
`;

const FLOW_STATE = `# Flow State: 18 Hz beta on a 220 Hz carrier.
mode: bin
flow: 220+18/0.4
00:00:00 flow
`;

const BURNOUT_RESET = `# AI Burnout Reset: 10 Hz alpha glides to 6 Hz theta over 20 minutes,
# with a soft pink noise bed. Gain stays low for tired ears.
mode: bin
alpha: 200+10/0.35 pink/15
theta: 200+6/0.35 pink/20
00:00:00 alpha ->
00:20:00 theta
`;

// The pacer rate is 5.5 breaths per minute (R4.5): one breath is 60 / 5.5 =
// 10.91 s, so inSec 5.45 + outSec 5.45 = 10.9 s. "6-breath pacer" (R3.11) is
// read as a guided cycle of 6 full breaths (about 65 s) shown by the pacer.
const BREATHWORK_SYNC = `# Breathwork Sync: 5.5 Hz theta, 5.5 breaths per minute.
mode: bin
breathe: 180+5.5/0.4
00:00:00 breathe
`;

const DEEP_REST = `# Deep Rest: 2.5 Hz delta on a low 150 Hz carrier.
mode: bin
rest: 150+2.5/0.35 brown/10
00:00:00 rest
`;

const CLASSIC_1998 = `# ts - SBaGen style demo sequence, 1998 vintage.
# Four tone-sets, ramps between them, about 15 minutes in all.
# Press play, close your eyes, and enjoy the ride.
mode: bin
base:  200+10/0.4 pink/10   # alpha entry
slide: 200+7/0.4 pink/10    # slide down to theta
deep:  200+4/0.4 pink/15    # theta/delta border
back:  200+9/0.4 pink/10    # coming back up
00:00:00 base ->
00:03:00 slide ->
00:08:00 deep ->
00:12:00 back ->
00:15:00 base
`;

export const PRESETS: readonly Preset[] = [
  {
    id: 'deep-focus',
    name: 'Deep Focus',
    description: '40 Hz gamma beat for concentrated work.',
    sbg: DEEP_FOCUS,
  },
  {
    id: 'flow-state',
    name: 'Flow State',
    description: '18 Hz beta beat for steady, engaged flow.',
    sbg: FLOW_STATE,
  },
  {
    id: 'burnout-reset',
    name: 'AI Burnout Reset',
    description: '10 Hz alpha gliding to 6 Hz theta over 20 minutes with soft pink noise.',
    sbg: BURNOUT_RESET,
  },
  {
    id: 'breathwork-sync',
    name: 'Breathwork Sync',
    description: '5.5 Hz theta with a 6-breath guided pacer at 5.5 breaths per minute.',
    sbg: BREATHWORK_SYNC,
    breath: { inSec: 5.45, outSec: 5.45 },
  },
  {
    id: 'deep-rest',
    name: 'Deep Rest',
    description: '2.5 Hz delta beat for deep rest.',
    sbg: DEEP_REST,
  },
  {
    id: 'classic-1998',
    name: 'Classic 1998 SBaGen Demo',
    description: 'A 15 minute SBaGen-style demo with timed ramps.',
    sbg: CLASSIC_1998,
  },
];
