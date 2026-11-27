import * as sdk from '@kirocrew/app-sdk';
import { useEffect } from 'react';
import { parseCrewState } from '@zonked-web/app/crew';
import { isCrewEnabled, onCrewChange } from '@zonked-web/ui/bridgeClient';
import { getSession } from './session';

/**
 * Reads the Zonked crew state from the app's own backend through the dashboard SDK
 * (permissions.api: /apps/zonked/api). It is opt-in (the same zonked.crew.v1 flag as the
 * website) and falls back to standalone on any failure: no backend, no host SDK, bad data.
 * The poller is a module singleton so it keeps running after the page unmounts.
 */
const STATE_PATH = '/apps/zonked/api/state';
const POLL_MS = 15_000;

export type CrewLinkStatus = 'standalone' | 'connected';
interface Api { get<T>(path: string): Promise<T> }

let api: Api | null = null;
let timer: ReturnType<typeof setInterval> | null = null;
let status: CrewLinkStatus = 'standalone';
let lastKey = '';
const listeners = new Set<(s: CrewLinkStatus) => void>();

export const getCrewLinkStatus = (): CrewLinkStatus => status;
export function onCrewLinkStatus(fn: (s: CrewLinkStatus) => void): () => void {
  listeners.add(fn);
  return () => void listeners.delete(fn);
}

function setStatus(next: CrewLinkStatus): void {
  if (next === status) return;
  status = next;
  for (const fn of [...listeners]) fn(next);
}

function drop(): void {
  if (status === 'connected') getSession().player.crewLost();
  lastKey = '';
  setStatus('standalone');
}

async function tick(): Promise<void> {
  if (api === null || !isCrewEnabled()) return drop();
  try {
    const body = await api.get<{ crew?: unknown }>(STATE_PATH);
    const state = parseCrewState(body.crew);
    if (state === null) return drop();
    setStatus('connected');
    const key = JSON.stringify([state.burnout, state.target]);
    if (key === lastKey) return;
    lastKey = key;
    getSession().player.applyCrew(state);
  } catch {
    drop();
  }
}

function start(client: Api): void {
  api = client;
  if (timer !== null) return;
  timer = setInterval(() => void tick(), POLL_MS);
  onCrewChange(() => void tick());
  void tick();
}

/** Mount once near the root of the page and of the panel. Does nothing when the host has no SDK. */
export function useCrewLink(): void {
  const useApi = (sdk as { useAppApi?: () => Api }).useAppApi;
  const client = useApi === undefined ? null : useApi();
  useEffect(() => {
    if (client !== null) start(client);
  }, [client]);
}
