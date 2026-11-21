/** Hard input limits and hearing-safety bounds. Safety bounds mirror the steering file. */
export const LIMITS = {
  maxBytes: 262144,
  maxEvents: 500,
  maxLineLength: 512,
} as const;

export const BOUNDS = {
  carrierMin: 20,
  carrierMax: 1500,
  beatMin: 0.5,
  beatMax: 40,
  gainMin: 0,
  gainMax: 0.85,
  noiseMin: 0,
  noiseMax: 1,
  maxTimeSec: 86400,
  maxDiagnostics: 1000,
} as const;

export const DEFAULT_CARRIER_HZ = 200;
export const DEFAULT_BEAT_HZ = 10;
export const DEFAULT_GAIN = 0.5;
export const DEFAULT_NOISE_LEVEL = 0.3;
