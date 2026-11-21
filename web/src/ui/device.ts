import { useEffect, useState } from 'react';
import type { DeviceType } from '../catalog/types';

export type DetectedDevice = DeviceType | 'unknown';

interface DeviceInfoLike {
  readonly kind: string;
  readonly label: string;
}

const BT = /bluetooth|airpods|buds|wh-1000|wf-1000|beats|bose|jabra|galaxy buds/i;
const PHONES = /headphone|headset|earphone|earbud|earpod|usb audio|wired/i;
const SPEAKER = /speaker|built-in|macbook|display|hdmi|monitor|internal/i;

/** Classifies output device labels. Empty labels (no permission yet) give 'unknown'. Pure. */
export function classifyDevices(devices: readonly DeviceInfoLike[]): DetectedDevice {
  const labels = devices.filter((d) => d.kind === 'audiooutput' && d.label.trim() !== '').map((d) => d.label);
  if (labels.length === 0) return 'unknown';
  // The default entry usually mirrors the active output; prefer it.
  const first = labels.find((l) => /^default/i.test(l)) ?? labels[0] ?? '';
  if (BT.test(first)) return 'bluetooth';
  if (PHONES.test(first)) return 'headphones';
  if (SPEAKER.test(first)) return 'speaker';
  return 'unknown';
}

/** Read-only device detection. Never requests permission; labels only appear if already granted. */
export function useDetectedDevice(): DetectedDevice {
  const [kind, setKind] = useState<DetectedDevice>('unknown');
  useEffect(() => {
    const md = typeof navigator === 'undefined' ? undefined : navigator.mediaDevices;
    if (md === undefined || typeof md.enumerateDevices !== 'function') return undefined;
    let live = true;
    const scan = (): void => {
      md.enumerateDevices().then(
        (list) => live && setKind(classifyDevices(list)),
        () => live && setKind('unknown'),
      );
    };
    scan();
    md.addEventListener?.('devicechange', scan);
    return () => {
      live = false;
      md.removeEventListener?.('devicechange', scan);
    };
  }, []);
  return kind;
}

export function deviceLabel(d: DetectedDevice): string {
  switch (d) {
    case 'headphones': return 'Headphones';
    case 'bluetooth': return 'Bluetooth';
    case 'speaker': return 'Speaker';
    default: return 'unknown';
  }
}
