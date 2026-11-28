// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { parseCrewState } from '../../app/crew';
import type { CrewView } from '../../app/crewFeed';
import { getTemplates } from '../../catalog';
import { CrewScreen } from './CrewScreen';
import { DEFAULT_PROFILE } from './data';
import { sessionName } from './CalmChrome';
import { Today } from './Today';
import type { CrewInfo } from './useCrewBridge';

afterEach(cleanup);

const st = parseCrewState({
  version: 1, at: 1, burnout: { score: 70, level: 'recovery' },
  target: { beatHz: 10, carrierHz: 200, gain: 0.3, transitionSec: 60, breathe: true }, sbg: null,
});
const info = (view: Partial<CrewView>, enabled = true): CrewInfo => ({
  enabled, status: 'standalone',
  view: { state: null, source: 'none', changedAtMs: 0, snoozeUntilMs: 0, demoNextAtMs: null, ...view },
});
const noop = (): void => undefined;

describe('Crew screen', () => {
  it('idle: offers the demo button and calls it', () => {
    const onDemo = vi.fn();
    render(<CrewScreen crew={info({})} overridden={false} onDemo={onDemo} onStopDemo={noop} onNotNow={noop} onResume={noop} onFollow={noop} />);
    fireEvent.click(screen.getByTestId('crew-demo'));
    expect(onDemo).toHaveBeenCalled();
  });

  it('live: shows score, beat, next change, a built why sentence, the read list and Not now', () => {
    const onNotNow = vi.fn();
    render(<CrewScreen crew={info({ state: st, source: 'bridge', changedAtMs: Date.now() })} overridden={false} onDemo={noop} onStopDemo={noop} onNotNow={onNotNow} onResume={noop} onFollow={noop} />);
    expect(screen.getByTestId('crew-score').textContent).toBe('70');
    expect(screen.getByTestId('crew-beat').textContent).toBe('10 Hz');
    expect(screen.getByTestId('crew-next').textContent).toMatch(/Not before/);
    expect(screen.getByTestId('crew-why').textContent).toMatch(/score 70/);
    expect(screen.getByTestId('crew-reads').textContent).toMatch(/git log and git status/);
    fireEvent.click(screen.getByTestId('crew-not-now'));
    expect(onNotNow).toHaveBeenCalled();
  });

  it('paused: shows Follow again instead of Not now', () => {
    render(<CrewScreen crew={info({ state: st, source: 'bridge', snoozeUntilMs: Date.now() + 600000 })} overridden={false} onDemo={noop} onStopDemo={noop} onNotNow={noop} onResume={noop} onFollow={noop} />);
    expect(screen.queryByTestId('crew-not-now')).toBeNull();
    expect(screen.getByTestId('crew-resume')).toBeTruthy();
    expect(screen.getByTestId('crew-status').textContent).toMatch(/^Paused until/);
  });

  it('demo: shows the simulated badge and a countdown, and hides the start button', () => {
    render(<CrewScreen crew={info({ state: st, source: 'demo', demoNextAtMs: Date.now() + 9000 })} overridden={false} onDemo={noop} onStopDemo={noop} onNotNow={noop} onResume={noop} onFollow={noop} />);
    expect(screen.getByTestId('crew-status').textContent).toBe('Simulated session');
    expect(screen.getByTestId('crew-next').textContent).toMatch(/in \d+ s/);
    expect(screen.queryByTestId('crew-demo')).toBeNull();
    expect(screen.getByTestId('crew-demo-stop')).toBeTruthy();
  });

  it('demo: the Crew switch is disabled and says the demo steers the sound', () => {
    render(<CrewScreen crew={info({ state: st, source: 'demo', demoNextAtMs: Date.now() + 9000 }, false)} overridden={false} onDemo={noop} onStopDemo={noop} onNotNow={noop} onResume={noop} onFollow={noop} />);
    const sw = screen.getByTestId('calm-crew-toggle') as HTMLInputElement;
    expect(sw.disabled).toBe(true);
    expect(sw.checked).toBe(true);
    expect(screen.getByText('Demo is steering the sound')).toBeTruthy();
    expect(screen.getByTestId('crew-demo-note')).toBeTruthy();
  });

  it('after the demo ends it says it was pretend, and Why sits above the stage labels', () => {
    const demoView = info({ state: st, source: 'demo', demoNextAtMs: Date.now() + 9000 }, false);
    const view = render(<CrewScreen crew={demoView} overridden={false} onDemo={noop} onStopDemo={noop} onNotNow={noop} onResume={noop} onFollow={noop} />);
    const why = screen.getByTestId('crew-why');
    const meter = view.container.querySelector('.c-meter') as Element;
    expect(why.compareDocumentPosition(meter) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    view.rerender(<CrewScreen crew={info({}, false)} overridden={false} onDemo={noop} onStopDemo={noop} onNotNow={noop} onResume={noop} onFollow={noop} />);
    expect(screen.getByTestId('crew-status').textContent).toBe('That was pretend. Real mode reads git counts only.');
  });

  it('explains Beat now in one plain line', () => {
    render(<CrewScreen crew={info({ state: st, source: 'bridge', changedAtMs: Date.now() })} overridden={false} onDemo={noop} onStopDemo={noop} onNotNow={noop} onResume={noop} onFollow={noop} />);
    expect(screen.getByTestId('crew-beat-hint').textContent).toBe('Higher beats feel alert, lower beats feel calm.');
  });
});

describe('mini player name', () => {
  const snap = (o: object): never => ({ templateName: null, presetId: 'flow-state', source: 'preset', ...o }) as never;
  it('uses the template, the Crew preset or the Studio preset, never a bare brand', () => {
    expect(sessionName(snap({ templateName: 'Rain hush' }))).toBe('Rain hush');
    expect(sessionName(snap({ source: 'crew' }), 'burnout-reset')).toBe('Crew: AI Burnout Reset');
    expect(sessionName(snap({}))).toBe('Flow State');
    expect(sessionName(snap({ presetId: 'nope' }))).toBe('Zonked');
  });
});

describe('Today reset entry', () => {
  it('offers one secondary entry that opens the reset', () => {
    const onReset = vi.fn();
    render(<Today profile={DEFAULT_PROFILE} week={{ daysListened: 0, goalDays: 3, goalMet: false, quietWeek: true, dots: ['rest', 'rest', 'rest', 'rest', 'rest', 'rest', 'rest'] } as never} progress={{}} reduced crewConnected={false} onPlay={noop} onOpenJourney={noop} onGo={noop} onReset={onReset} />);
    const b = screen.getByTestId('today-reset');
    expect(b.textContent).toContain('A short pause, 90 seconds');
    expect(b.className).not.toContain('c-primary');
    expect(screen.queryByText('Journeys')).toBeTruthy();
    expect(document.querySelectorAll('.c-mini-card').length).toBe(3);
    fireEvent.click(b);
    expect(onReset).toHaveBeenCalled();
  });
});

describe('Today play again', () => {
  const props = { profile: DEFAULT_PROFILE, week: { daysListened: 0, goalDays: 3, goalMet: false, quietWeek: true, dots: ['rest','rest','rest','rest','rest','rest','rest'] } as never, progress: {}, reduced: true, crewConnected: false, onPlay: noop, onOpenJourney: noop, onGo: noop, onReset: noop };
  it('shows Play again only when the last session differs from the pick', () => {
    const { container } = render(<Today {...props} last={null} />);
    const name = container.querySelector('#c-daily-h')?.textContent?.split(': ').slice(1).join(': ');
    const same = getTemplates().find((t) => t.name === name) ?? null;
    const other = getTemplates().find((t) => t.name !== name) ?? null;
    expect(same).not.toBeNull();
    cleanup();
    render(<Today {...props} last={same} />);
    expect(screen.queryByTestId('play-again')).toBeNull();
    cleanup();
    render(<Today {...props} last={other} />);
    expect(screen.getByTestId('play-again')).toBeTruthy();
  });
});
