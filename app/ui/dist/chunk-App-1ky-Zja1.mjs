import { jsx as i, jsxs as f, Fragment as we } from "react/jsx-runtime";
import { lazy as D, Suspense as q, useRef as _, useState as S, useEffect as C, useCallback as T, useMemo as K, useSyncExternalStore as Yt } from "react";
import { C as d, P as Vt, s as st, p as Jt, g as Zt, G as Xt, L as Qt, F as xe, d as ot, D as en, c as re, a as Fe, b as tn, e as nn, f as rt, E as an, r as sn, h as on, i as it, j as rn, u as ln, w as cn, S as un, k as dn, o as mn, B as hn, l as pn, m as ie, n as fn, q as gn, t as He, v as U, x as lt, y as yn, z as bn, A as vn, H as je, M as wn } from "./chunk-crewLink-CGwtdNl8.mjs";
function p(e) {
  return {
    modes: ["binaural"],
    noises: [["off", 0]],
    layers: [[]],
    intensity: 2,
    gain: 0.45,
    jitter: 0.3,
    tags: [],
    ...e
  };
}
const M = (e, t) => e[(t % e.length + e.length) % e.length], kn = [98, 110, 123.5, 87.3, 103.8, 130.8], Sn = [196, 220, 247, 175, 165, 262], Mn = {
  calm: [4, 3],
  warm: [6, 2],
  dreamy: [4, 3],
  bright: [2, 5],
  deep: [7, 5],
  energized: [2, 3],
  grounded: [6, 1],
  ethereal: [4, 3],
  lofi: [1, 2, 5],
  minimal: [7, 4]
}, Nn = (e) => [...e].reduce((t, n) => (t * 31 + n.charCodeAt(0)) % 9973, 7);
function An(e, t, n) {
  const a = Nn(e) + n;
  return { prog: M(Mn[t], a), key: M(kn, a), pianoRoot: M(Sn, a >> 1) };
}
function Tn(e, t, n) {
  const a = e === "dreamy" || e === "ethereal" || e === "calm";
  return {
    breathDepth: M([0.45, 0.4, 0.3, 0.2, 0.1], t - 1),
    breathRateHz: 0.06 + 0.02 * (n % 5),
    stereoWidth: 0.3 + 0.1 * (n % 4),
    panDepth: a ? 0.15 : 0,
    panRateHz: 0.03 + 0.01 * (n % 4)
  };
}
const En = {
  lofi: (e, t) => ({
    lofiLevel: 0.45,
    lofiWarmth: M([0.5, 0.6, 0.7], e),
    lofiProgression: t.prog,
    tapeWow: M([0.25, 0.35, 0.45], e),
    padRootHz: t.key
  }),
  piano: (e, t) => ({
    instLevel: 0.35,
    instKind: 3,
    instRootHz: t.pianoRoot,
    instScale: M([2, 0, 1, 4, 3], e),
    instBpm: M([40, 46, 52], e),
    pianoPedal: M([0.4, 0.55, 0.7], e)
  }),
  crackle: () => ({ crackle: 0.12 }),
  drone: (e) => ({ instLevel: 0.35, instKind: 1, instRootHz: M([55, 62, 73, 82], e), instScale: 7, instBpm: 40 }),
  pluck: (e) => ({
    instLevel: 0.3,
    instKind: 0,
    instRootHz: M([196, 220, 247, 262], e),
    instScale: M([0, 2, 4, 1], e),
    instBpm: M([48, 56, 64, 72], e)
  }),
  bell: (e) => ({
    instLevel: 0.28,
    instKind: 2,
    instRootHz: M([262, 294, 330, 349], e),
    instScale: 4,
    instBpm: 40
  }),
  pad: (e, t) => ({ padLevel: 0.4, padChord: M([0, 2, 4, 6], e), padRootHz: t.key }),
  chimes: (e) => ({ chimeLevel: 0.25, chimeRatePerMin: M([3, 4, 6, 8], e) }),
  perc: (e) => ({
    percLevel: 0.2,
    percBpm: M([64, 72, 80, 92], e),
    percPattern: M([0, 3, 4, 7], e)
  })
};
function Ln(e, t, n = { prog: 0, key: 110, pianoRoot: 220 }) {
  return e.reduce((a, s) => ({ ...a, ...En[s](t, n) }), {});
}
const $e = (e) => Math.round(e * 1e3) / 1e3, le = (e) => Math.min(40, Math.max(0.5, e));
function Cn(e, t, n, a, s) {
  const o = Math.min(5, Math.max(1, t * 0.15));
  if (e === "plateau") {
    const l = [{ t: 0, beat: n, ramp: !0 }, { t: o, beat: a, ramp: s !== void 0 }];
    return s !== void 0 && l.push({ t: t - o, beat: a, ramp: !0 }, { t, beat: s, ramp: !1 }), l;
  }
  if (e === "ramp-down" || e === "ramp-up")
    return [{ t: 0, beat: n, ramp: !0 }, { t: t * 0.7, beat: a, ramp: !1 }];
  if (e === "wave")
    return Array.from({ length: 7 }, (l, c) => ({ t: t * c / 6, beat: c % 2 === 0 ? n : a, ramp: c < 6 }));
  const r = t / 4;
  return Array.from({ length: 4 }, (l, c) => {
    const h = n + (a - n) * c / 3;
    return c < 3 ? [{ t: c * r, beat: h, ramp: !1 }, { t: c * r + r * 0.75, beat: h, ramp: !0 }] : [{ t: c * r, beat: h, ramp: !1 }];
  }).flat();
}
function On(e, t, n, a, s) {
  const o = (t % 3 - 1) * e.jitter, r = le(e.to + o), l = M(e.noises, t >> 1), c = M(e.layers, t * 2 + (t >> 1)), h = M(e.vibes, t), g = Ln(c, t, An(e.slug, h, t)), N = Object.keys(g).length > 0, v = N ? { ...g, ...Tn(h, e.intensity, t) } : g;
  return Cn(e.shape, n, le(e.from), r, e.ret).map((w) => ({
    atMin: $e(w.t),
    beatHz: $e(le(w.beat)),
    carrierHz: a,
    gain: e.gain,
    mode: s,
    noise: l[0],
    noiseLevel: l[1],
    ...N ? { layers: v } : {},
    ramp: w.ramp
  }));
}
function ke(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e) {
    t.add(n.mode);
    const a = n.layers;
    n.noise !== "off" && n.noiseLevel > 0 && t.add("noise"), a !== void 0 && (((a.lofiLevel ?? 0) > 0 || (a.crackle ?? 0) > 0) && t.add("lofi"), (a.instLevel ?? 0) > 0 && t.add("instrument"), (a.padLevel ?? 0) > 0 && t.add("pad"), (a.chimeLevel ?? 0) > 0 && t.add("chimes"), (a.percLevel ?? 0) > 0 && t.add("percussion"));
  }
  return [...t];
}
function Se(e, t) {
  if (t > 3) return !1;
  const n = e.every((o, r) => {
    var l;
    return r === 0 || Math.abs(o.beatHz - (((l = e[r - 1]) == null ? void 0 : l.beatHz) ?? o.beatHz)) <= 4;
  }), a = e.every((o) => o.mode === "isochronic" || o.beatHz >= 12 && o.beatHz <= 20), s = e.every((o) => {
    var r, l;
    return (((r = o.layers) == null ? void 0 : r.crackle) ?? 0) === 0 && (((l = o.layers) == null ? void 0 : l.percBpm) ?? 0) <= 100;
  });
  return n && a && s;
}
function zn(e, t) {
  const n = e.adjectives.length, a = t * 7 % (n * e.nouns.length);
  return `${M(e.adjectives, a)} ${M(e.nouns, Math.floor(a / n))}`;
}
const Dn = (e) => String(e).padStart(2, "0");
function Rn(e, t, n, a) {
  const s = M(t.mins, n), o = M(t.carriers, n * 3 + 1), r = M(t.modes, n + (n >> 2)), l = On(t, n, s, o, r), c = t.to < 4 ? "delta" : t.to < 8 ? "theta" : t.to < 12 ? "alpha" : t.to < 30 ? "beta" : "gamma";
  return {
    id: `${e.prefix}-${t.slug}-${Dn(n + 1)}`,
    name: zn(e, a),
    category: e.category,
    vibe: M(t.vibes, n),
    tags: [t.slug, c, r, ...t.tags],
    layerTags: ke(l),
    situations: t.situations,
    recommendedMinutes: s,
    intensity: t.intensity,
    adhdFriendly: Se(l, t.intensity),
    stages: l,
    reasonTemplate: t.reason,
    source: "original",
    ...t.breath !== void 0 ? { breath: t.breath } : {}
  };
}
function _n(e) {
  let t = 0;
  return e.archs.flatMap((n) => Array.from({ length: n.count }, (a, s) => Rn(e, n, s, t++)));
}
const In = {
  category: "adhd-control",
  prefix: "adhd",
  adjectives: ["Steady", "Anchored", "Level", "Even", "Tidy", "Calm", "Focused", "Plain", "Settled", "Patient", "Smooth", "Constant"],
  nouns: ["Anchor", "Rail", "Tracks", "Rhythm", "Metronome", "Lane", "Thread", "Pulse", "Desk", "Checklist", "Runway", "Keel"],
  archs: [
    p({
      slug: "smr-steady",
      shape: "plateau",
      from: 12,
      to: 13.5,
      mins: [20, 30, 45],
      carriers: [200, 220, 240],
      modes: ["isochronic", "isochronic", "monaural"],
      noises: [["pink", 0.18], ["brown", 0.2]],
      layers: [[], ["lofi"]],
      vibes: ["minimal", "grounded"],
      situations: ["adhd-focus", "deep-work"],
      intensity: 2,
      gain: 0.42,
      count: 5,
      jitter: 0.4,
      reason: "Steady SMR-range pulse with no changes to track, for {minutes} minutes of low-surprise focus."
    }),
    p({
      slug: "beta-anchor",
      shape: "plateau",
      from: 14,
      to: 16,
      mins: [25, 30, 45, 50],
      carriers: [210, 230, 250],
      modes: ["isochronic", "monaural"],
      noises: [["pink", 0.15], ["off", 0]],
      layers: [[], ["lofi"]],
      vibes: ["grounded", "bright", "minimal"],
      situations: ["adhd-focus", "deep-work"],
      intensity: 3,
      gain: 0.42,
      count: 5,
      jitter: 0.5,
      reason: "A constant low-beta pulse to anchor attention."
    }),
    p({
      slug: "cadence-pulse",
      shape: "plateau",
      from: 14,
      to: 15,
      mins: [20, 25, 30],
      carriers: [200, 220],
      modes: ["isochronic"],
      noises: [["pink", 0.12]],
      layers: [["perc"], ["perc", "lofi"]],
      vibes: ["energized", "grounded"],
      situations: ["adhd-focus", "deep-work"],
      intensity: 3,
      gain: 0.4,
      count: 4,
      reason: "Gentle soft percussion at a fixed 60 to 100 bpm cadence keeps tempo without surprises."
    }),
    p({
      slug: "quiet-bed",
      shape: "plateau",
      from: 13,
      to: 13,
      mins: [30, 45, 60],
      carriers: [190, 210],
      modes: ["isochronic", "monaural"],
      noises: [["brown", 0.3], ["pink", 0.25]],
      layers: [["lofi"], ["lofi", "piano"]],
      vibes: ["lofi", "minimal", "warm"],
      situations: ["adhd-focus", "deep-work"],
      intensity: 2,
      gain: 0.4,
      count: 4,
      jitter: 0,
      reason: "A fixed warm bed with nothing that changes, so it fades into the background."
    }),
    p({
      slug: "start-ramp",
      shape: "ramp-up",
      from: 11,
      to: 15,
      mins: [15, 20, 25],
      carriers: [200, 220],
      modes: ["isochronic", "monaural"],
      noises: [["pink", 0.15]],
      layers: [[], ["pluck"]],
      vibes: ["bright", "energized"],
      situations: ["adhd-focus", "quick-reset"],
      intensity: 2,
      gain: 0.42,
      count: 4,
      jitter: 0.2,
      reason: "A slow 4 Hz climb to help you get started without a jolt."
    }),
    p({
      slug: "sprint-steps",
      shape: "ladder",
      from: 13,
      to: 16,
      mins: [20, 25, 30],
      carriers: [210, 230],
      modes: ["isochronic"],
      noises: [["off", 0], ["pink", 0.12]],
      layers: [["perc"], []],
      vibes: ["energized", "grounded"],
      situations: ["adhd-focus", "deep-work"],
      intensity: 3,
      gain: 0.4,
      count: 4,
      jitter: 0.2,
      reason: "Four small, announced steps through the beta band for a structured work block."
    })
  ]
}, Pn = {
  category: "focus",
  prefix: "focus",
  adjectives: ["Sharp", "Deep", "Clear", "Lucid", "Bright", "Keen", "Locked", "Precise", "Crisp", "Direct", "Tuned", "Honed"],
  nouns: ["Beam", "Signal", "Compass", "Engine", "Vector", "Prism", "Forge", "Spire", "Circuit", "Current", "Summit", "Scope"],
  archs: [
    p({
      slug: "alpha-beta",
      shape: "plateau",
      from: 11,
      to: 14,
      mins: [25, 45, 60],
      carriers: [200, 220, 240],
      modes: ["binaural", "isochronic", "monaural"],
      noises: [["pink", 0.15]],
      layers: [[], ["lofi"], ["pluck"]],
      vibes: ["bright", "minimal", "grounded"],
      situations: ["deep-work", "adhd-focus"],
      intensity: 2,
      gain: 0.42,
      count: 5,
      reason: "Relaxed focus on the alpha-beta border for {minutes} minutes."
    }),
    p({
      slug: "deep-beta",
      shape: "plateau",
      from: 15,
      to: 18,
      mins: [30, 45, 60, 90],
      carriers: [220, 240, 260],
      modes: ["binaural", "isochronic"],
      noises: [["pink", 0.15], ["off", 0]],
      layers: [[], ["perc"]],
      vibes: ["energized", "bright"],
      situations: ["deep-work"],
      intensity: 3,
      gain: 0.42,
      count: 5,
      reason: "Beta band for sustained analytical work."
    }),
    p({
      slug: "gamma-edge",
      shape: "ramp-up",
      from: 18,
      to: 35,
      mins: [10, 15, 20],
      carriers: [240, 260, 280],
      modes: ["isochronic", "binaural"],
      noises: [["off", 0]],
      layers: [[]],
      vibes: ["energized", "bright"],
      situations: ["deep-work"],
      intensity: 4,
      gain: 0.4,
      count: 4,
      reason: "A short climb to a high-beta and low-gamma edge for a quick push."
    }),
    p({
      slug: "flow-ramp",
      shape: "ramp-up",
      from: 10,
      to: 16,
      mins: [30, 45, 60],
      carriers: [210, 230],
      modes: ["binaural", "monaural"],
      noises: [["pink", 0.12]],
      layers: [["pluck"], ["lofi", "pluck"]],
      vibes: ["warm", "bright", "lofi"],
      situations: ["deep-work", "adhd-focus"],
      intensity: 2,
      gain: 0.42,
      count: 4,
      reason: "Eases from alpha into beta so you drift into flow."
    }),
    p({
      slug: "reading-calm",
      shape: "plateau",
      from: 10,
      to: 12,
      mins: [30, 45, 60],
      carriers: [190, 210],
      modes: ["binaural", "monaural"],
      noises: [["brown", 0.2]],
      layers: [["piano"], []],
      vibes: ["calm", "deep", "warm"],
      situations: ["deep-work", "meditate"],
      intensity: 1,
      gain: 0.4,
      count: 4,
      reason: "Gentle alpha for reading and study."
    }),
    p({
      slug: "sprint-pulse",
      shape: "ladder",
      from: 12,
      to: 20,
      mins: [20, 25, 30],
      carriers: [220, 240],
      modes: ["isochronic", "binaural"],
      noises: [["off", 0]],
      layers: [["perc"], ["perc", "pluck"]],
      vibes: ["energized", "bright"],
      situations: ["deep-work", "adhd-focus"],
      intensity: 3,
      gain: 0.4,
      count: 4,
      reason: "Four rising steps with soft percussion for a focused sprint."
    })
  ]
}, Bn = {
  category: "healing",
  prefix: "healing",
  adjectives: ["Mending", "Tender", "Restoring", "Kind", "Balmy", "Soothing", "Renewing", "Warming", "Settled", "Easing", "Gentle", "Whole"],
  nouns: ["Balm", "Spring", "Embrace", "Garden", "Shelter", "Glow", "Rain", "Hearth", "Sunrise", "Quilt", "Oasis", "Haven"],
  archs: [
    p({
      slug: "tension-release",
      shape: "ramp-down",
      from: 14,
      to: 8,
      mins: [15, 20, 30],
      carriers: [180, 200, 220],
      modes: ["binaural", "isochronic", "monaural"],
      noises: [["pink", 0.2]],
      layers: [["piano", "pad"], ["pluck"], ["pad", "chimes"]],
      vibes: ["warm", "calm"],
      situations: ["heal-stress", "ai-burnout", "quick-reset"],
      intensity: 2,
      gain: 0.42,
      count: 5,
      reason: "Eases beta tension down to alpha over {minutes} minutes."
    }),
    p({
      slug: "restore-theta",
      shape: "plateau",
      from: 9,
      to: 6,
      mins: [20, 30, 45],
      carriers: [160, 180],
      modes: ["binaural", "monaural"],
      noises: [["brown", 0.2]],
      layers: [["drone"], ["pad"], ["bell"]],
      vibes: ["deep", "warm", "ethereal"],
      situations: ["heal-stress", "meditate"],
      intensity: 2,
      gain: 0.4,
      count: 5,
      reason: "Steady theta with a soft drone for emotional recovery."
    }),
    p({
      slug: "heart-calm",
      shape: "plateau",
      from: 10,
      to: 7.5,
      ret: 10,
      mins: [10, 15, 20],
      carriers: [190, 210],
      modes: ["binaural", "isochronic"],
      noises: [["off", 0], ["pink", 0.15]],
      layers: [["pad", "pluck"], ["pad"]],
      vibes: ["warm", "grounded"],
      situations: ["heal-stress", "quick-reset", "ai-burnout"],
      intensity: 2,
      gain: 0.42,
      count: 4,
      breath: { inSec: 5, outSec: 5 },
      reason: "A slow 6 breaths per minute rhythm to settle heart and mind."
    }),
    p({
      slug: "ache-ease",
      shape: "wave",
      from: 10,
      to: 7,
      mins: [30, 45, 60],
      carriers: [150, 170],
      modes: ["monaural", "binaural"],
      noises: [["brown", 0.3]],
      layers: [["pad"], []],
      vibes: ["calm", "warm"],
      situations: ["heal-stress"],
      intensity: 1,
      gain: 0.38,
      count: 4,
      reason: "Slow alpha-theta swells that feel like a rocking tide."
    }),
    p({
      slug: "soothe-glide",
      shape: "ramp-down",
      from: 12,
      to: 6,
      mins: [20, 30],
      carriers: [170, 190],
      modes: ["binaural", "monaural"],
      noises: [["pink", 0.25]],
      layers: [["pad", "chimes"], ["bell"]],
      vibes: ["ethereal", "calm"],
      situations: ["heal-stress", "meditate"],
      intensity: 2,
      gain: 0.4,
      count: 4,
      reason: "A soft pad and a gliding beat for gentle emotional unwinding."
    }),
    p({
      slug: "sunrise-lift",
      shape: "ramp-up",
      from: 7,
      to: 11,
      mins: [15, 20, 30],
      carriers: [190, 210, 230],
      modes: ["binaural", "isochronic"],
      noises: [["off", 0]],
      layers: [["pluck", "pad"], ["bell"]],
      vibes: ["bright", "warm"],
      situations: ["heal-stress", "quick-reset"],
      intensity: 2,
      gain: 0.42,
      count: 4,
      reason: "A brightening ramp that lifts mood without pushing alertness."
    })
  ]
}, xn = {
  category: "lucid-dreams",
  prefix: "lucid",
  adjectives: ["Waking", "Silver", "Nebula", "Astral", "Twilight", "Aware", "Hollow", "Starlit", "Liminal", "Vivid", "Opal", "Drifting"],
  nouns: ["Gate", "Compass", "Mirror", "Skyway", "Threshold", "Door", "Voyage", "Lens", "Bridge", "Beacon", "Garden", "Orbit"],
  archs: [
    p({
      slug: "wbtb-theta",
      shape: "plateau",
      from: 9,
      to: 5,
      ret: 8,
      mins: [90, 120, 180],
      carriers: [160, 180, 200],
      modes: ["binaural", "monaural"],
      noises: [["pink", 0.15]],
      layers: [["piano", "pad"], ["pad", "chimes"]],
      vibes: ["dreamy", "ethereal", "deep"],
      situations: ["lucid-dream", "cant-sleep"],
      intensity: 2,
      gain: 0.4,
      count: 6,
      reason: "Theta plateau with a light return, built for wake-back-to-bed lucid practice."
    }),
    p({
      slug: "rem-ladder",
      shape: "ladder",
      from: 8,
      to: 4,
      mins: [60, 90, 120],
      carriers: [150, 170],
      modes: ["binaural", "isochronic"],
      noises: [["brown", 0.2]],
      layers: [["pad"], ["drone"]],
      vibes: ["deep", "dreamy"],
      situations: ["lucid-dream"],
      intensity: 2,
      gain: 0.4,
      count: 5,
      reason: "Steps down through theta in four stages to meet REM gently."
    }),
    p({
      slug: "aware-wave",
      shape: "wave",
      from: 5,
      to: 8,
      mins: [60, 90],
      carriers: [160, 190],
      modes: ["binaural", "monaural"],
      noises: [["pink", 0.15]],
      layers: [["pad", "chimes"], ["bell"]],
      vibes: ["ethereal", "dreamy"],
      situations: ["lucid-dream"],
      intensity: 2,
      gain: 0.4,
      count: 5,
      reason: "Slow swings between theta and alpha keep a thread of awareness while the body sleeps."
    }),
    p({
      slug: "dream-drift",
      shape: "ramp-down",
      from: 10,
      to: 4.5,
      mins: [30, 45, 60],
      carriers: [140, 160, 180],
      modes: ["binaural", "isochronic", "monaural"],
      noises: [["brown", 0.2], ["pink", 0.2]],
      layers: [["pad"], []],
      vibes: ["dreamy", "calm", "ethereal"],
      situations: ["lucid-dream", "cant-sleep"],
      intensity: 1,
      gain: 0.4,
      count: 5,
      reason: "A slow descent into dream sleep over {minutes} minutes."
    }),
    p({
      slug: "astral-calm",
      shape: "plateau",
      from: 10,
      to: 6,
      mins: [30, 45, 60],
      carriers: [170, 200],
      modes: ["binaural", "monaural"],
      noises: [["pink", 0.2]],
      layers: [["drone"], ["bell"]],
      vibes: ["ethereal", "deep"],
      situations: ["lucid-dream", "meditate"],
      intensity: 2,
      gain: 0.4,
      count: 5,
      reason: "Relaxed theta with a slow instrument drone, a calm body-aware launch pad."
    })
  ]
}, Fn = {
  category: "meditation",
  prefix: "meditation",
  adjectives: ["Open", "Rooted", "Sacred", "Luminous", "Patient", "Clear", "Boundless", "Inner", "Mindful", "Sunlit", "Hallowed", "Silent"],
  nouns: ["Cushion", "Temple", "Breath", "Mountain", "Lotus", "Stillpoint", "Horizon", "Sanctuary", "River", "Candle", "Grove", "Bowl"],
  archs: [
    p({
      slug: "alpha-sit",
      shape: "plateau",
      from: 12,
      to: 9.5,
      ret: 11,
      mins: [10, 15, 20, 30],
      carriers: [180, 200, 220],
      modes: ["binaural", "monaural", "isochronic"],
      noises: [["pink", 0.15], ["off", 0]],
      layers: [["chimes"], ["bell"], []],
      vibes: ["calm", "grounded", "warm"],
      situations: ["meditate", "quick-reset", "heal-stress"],
      intensity: 2,
      gain: 0.42,
      count: 5,
      reason: "Wakeful alpha for a {minutes} minute seated sit."
    }),
    p({
      slug: "theta-descent",
      shape: "ramp-down",
      from: 10,
      to: 5,
      mins: [20, 30, 45],
      carriers: [160, 180],
      modes: ["binaural", "monaural"],
      noises: [["brown", 0.2]],
      layers: [["drone"], ["drone", "chimes"]],
      vibes: ["deep", "ethereal"],
      situations: ["meditate"],
      intensity: 2,
      gain: 0.4,
      count: 5,
      reason: "Glides from alpha to theta for deeper inward attention."
    }),
    p({
      slug: "schumann-hold",
      shape: "plateau",
      from: 12,
      to: 7.83,
      ret: 12,
      mins: [20, 30],
      carriers: [180, 200],
      modes: ["binaural", "monaural"],
      noises: [["pink", 0.15]],
      layers: [["piano"], ["bell"]],
      vibes: ["grounded", "deep"],
      situations: ["meditate", "heal-stress"],
      intensity: 2,
      gain: 0.42,
      count: 4,
      jitter: 0,
      reason: "Rests on the 7.83 Hz Schumann resonance, then returns to wakefulness."
    }),
    p({
      slug: "breath-pacer",
      shape: "plateau",
      from: 9,
      to: 6.5,
      mins: [10, 15, 20],
      carriers: [170, 190],
      modes: ["isochronic", "monaural"],
      noises: [["off", 0]],
      layers: [["chimes"], ["pad"]],
      vibes: ["calm", "minimal"],
      situations: ["meditate", "quick-reset"],
      intensity: 2,
      gain: 0.4,
      count: 4,
      breath: { inSec: 5.45, outSec: 5.45 },
      reason: "Pair the 5.5 breaths per minute pacer with a slow theta pulse."
    }),
    p({
      slug: "bell-silence",
      shape: "plateau",
      from: 10,
      to: 8,
      mins: [15, 20, 30],
      carriers: [190, 210],
      modes: ["binaural", "monaural"],
      noises: [["off", 0]],
      layers: [["chimes"], ["bell"], ["pluck", "chimes"]],
      vibes: ["ethereal", "bright", "calm"],
      situations: ["meditate", "heal-stress"],
      intensity: 1,
      gain: 0.4,
      count: 4,
      reason: "Sparse chimes over a quiet alpha-theta border."
    }),
    p({
      slug: "delta-glide",
      shape: "ramp-down",
      from: 6,
      to: 3,
      mins: [30, 45, 60],
      carriers: [130, 150],
      modes: ["binaural", "monaural"],
      noises: [["brown", 0.25]],
      layers: [["drone"]],
      vibes: ["deep", "minimal"],
      situations: ["meditate", "heal-stress"],
      intensity: 2,
      gain: 0.38,
      count: 4,
      reason: "A long fall into delta for dissolving, open awareness."
    })
  ]
}, Hn = {
  category: "sleep",
  prefix: "sleep",
  adjectives: ["Quiet", "Slow", "Velvet", "Hushed", "Moonlit", "Soft", "Drowsy", "Still", "Dim", "Gentle", "Fading", "Lulled"],
  nouns: ["Harbor", "Tide", "Pillow", "Lantern", "Blanket", "Meadow", "Lullaby", "Cabin", "Drift", "Hearth", "Cove", "Evening"],
  archs: [
    p({
      slug: "onset-delta",
      shape: "ramp-down",
      from: 9,
      to: 2.5,
      mins: [30, 45, 60, 90],
      carriers: [120, 140, 150, 160, 180],
      modes: ["binaural", "monaural", "binaural", "isochronic"],
      noises: [["brown", 0.25], ["pink", 0.2]],
      layers: [[], ["pad"], ["drone"]],
      vibes: ["calm", "deep", "dreamy"],
      situations: ["cant-sleep", "heal-stress"],
      intensity: 1,
      gain: 0.4,
      count: 6,
      reason: "Glides from alpha to delta over {minutes} minutes to ease sleep onset."
    }),
    p({
      slug: "drift-theta",
      shape: "ramp-down",
      from: 8,
      to: 4.5,
      mins: [20, 30, 45],
      carriers: [130, 150, 170],
      modes: ["binaural", "monaural"],
      noises: [["pink", 0.2], ["brown", 0.3]],
      layers: [["piano", "pad"], ["pad", "chimes"], []],
      vibes: ["dreamy", "calm", "ethereal"],
      situations: ["cant-sleep", "lucid-dream"],
      intensity: 1,
      gain: 0.4,
      count: 5,
      reason: "A slow theta drift with a soft pad to quiet racing thoughts."
    }),
    p({
      slug: "deep-delta",
      shape: "plateau",
      from: 6,
      to: 2.5,
      mins: [60, 90, 120],
      carriers: [110, 130, 150],
      modes: ["monaural", "binaural", "isochronic"],
      noises: [["brown", 0.3]],
      layers: [["drone"], []],
      vibes: ["deep", "calm"],
      situations: ["cant-sleep"],
      intensity: 1,
      gain: 0.38,
      count: 5,
      jitter: 0.2,
      reason: "Holds steady delta for deep, unbroken rest."
    }),
    p({
      slug: "nap-reset",
      shape: "plateau",
      from: 10,
      to: 5,
      ret: 12,
      mins: [15, 20, 25],
      carriers: [150, 170],
      modes: ["binaural", "isochronic"],
      noises: [["pink", 0.2]],
      layers: [["pad"]],
      vibes: ["warm", "calm"],
      situations: ["cant-sleep", "quick-reset", "ai-burnout"],
      intensity: 2,
      gain: 0.42,
      count: 4,
      reason: "A short nap that sinks to theta and wakes you gently after {minutes} minutes."
    }),
    p({
      slug: "breath-down",
      shape: "ramp-down",
      from: 7,
      to: 3,
      mins: [20, 30],
      carriers: [140, 160],
      modes: ["isochronic", "monaural"],
      noises: [["brown", 0.2]],
      layers: [["pad", "chimes"]],
      vibes: ["calm", "dreamy"],
      situations: ["cant-sleep", "heal-stress"],
      intensity: 1,
      gain: 0.4,
      count: 3,
      breath: { inSec: 4, outSec: 6 },
      reason: "Pair slow 4-in, 6-out breathing with a falling beat."
    }),
    p({
      slug: "rain-bed",
      shape: "plateau",
      from: 5,
      to: 3,
      mins: [45, 60, 90],
      carriers: [120, 140],
      modes: ["isochronic", "binaural"],
      noises: [["brown", 0.5], ["pink", 0.45]],
      layers: [["lofi"], []],
      vibes: ["lofi", "warm", "calm"],
      situations: ["cant-sleep", "heal-stress"],
      intensity: 1,
      gain: 0.35,
      count: 3,
      reason: "A soft noise bed with a faint low-end hum, easy to sleep under."
    })
  ]
}, jn = {
  category: "vibes",
  prefix: "vibe",
  adjectives: ["Neon", "Cozy", "Mellow", "Golden", "Hazy", "Crisp", "Cloudy", "Dusty", "Amber", "Breezy", "Sleepy", "Plush"],
  nouns: ["Cafe", "Rooftop", "Cassette", "Window", "Terrace", "Playlist", "Sunday", "Skyline", "Studio", "Porch", "Alley", "Lounge"],
  archs: [
    p({
      slug: "lofi-study",
      shape: "plateau",
      from: 12,
      to: 10,
      mins: [25, 45, 60],
      carriers: [180, 200, 220],
      modes: ["isochronic", "monaural", "binaural"],
      noises: [["pink", 0.1]],
      layers: [["lofi", "crackle", "pluck"], ["lofi", "pluck"], ["lofi", "pad"]],
      vibes: ["lofi", "warm"],
      situations: ["deep-work", "ai-burnout", "quick-reset"],
      intensity: 2,
      gain: 0.42,
      count: 6,
      reason: "Warm lo-fi bed with a soft pluck for easy, steady company."
    }),
    p({
      slug: "warm-glow",
      shape: "plateau",
      from: 11,
      to: 9,
      mins: [20, 30, 45],
      carriers: [170, 190],
      modes: ["binaural", "monaural"],
      noises: [["pink", 0.12], ["off", 0]],
      layers: [["pad", "lofi"], ["pad"]],
      vibes: ["warm", "calm"],
      situations: ["quick-reset", "ai-burnout"],
      intensity: 1,
      gain: 0.4,
      count: 4,
      reason: "A warm pad and a gentle alpha pulse for a soft landing."
    }),
    p({
      slug: "bright-air",
      shape: "plateau",
      from: 13,
      to: 12,
      mins: [20, 30],
      carriers: [210, 240],
      modes: ["isochronic", "binaural"],
      noises: [["off", 0]],
      layers: [["chimes", "pluck"], ["bell"]],
      vibes: ["bright", "energized"],
      situations: ["deep-work", "quick-reset"],
      intensity: 3,
      gain: 0.42,
      count: 4,
      reason: "Airy bells over a light alpha-beta border."
    }),
    p({
      slug: "ether-float",
      shape: "wave",
      from: 10,
      to: 6,
      mins: [20, 30, 45],
      carriers: [160, 190],
      modes: ["binaural", "monaural"],
      noises: [["pink", 0.15]],
      layers: [["pad", "chimes"], ["bell", "pad"]],
      vibes: ["ethereal", "dreamy", "deep"],
      situations: ["quick-reset", "heal-stress"],
      intensity: 2,
      gain: 0.4,
      count: 4,
      reason: "Slow swells with chimes for a floating, spacious mood."
    }),
    p({
      slug: "minimal-hum",
      shape: "plateau",
      from: 10,
      to: 10,
      mins: [15, 30, 60],
      carriers: [200, 220],
      modes: ["isochronic", "monaural"],
      noises: [["pink", 0.3], ["brown", 0.3]],
      layers: [[]],
      vibes: ["minimal", "grounded"],
      situations: ["deep-work", "ai-burnout"],
      intensity: 1,
      gain: 0.4,
      count: 4,
      jitter: 0,
      reason: "Just a pulse and a noise bed, nothing to attend to."
    }),
    p({
      slug: "spark-groove",
      shape: "plateau",
      from: 14,
      to: 16,
      mins: [20, 25, 30],
      carriers: [220, 240, 260],
      modes: ["isochronic", "binaural"],
      noises: [["off", 0]],
      layers: [["perc", "pluck"], ["perc", "lofi"]],
      vibes: ["energized", "bright"],
      situations: ["deep-work", "quick-reset"],
      intensity: 3,
      gain: 0.42,
      count: 4,
      reason: "A light groove with soft percussion for a bright, steady lift."
    })
  ]
}, $n = {
  category: "work-recovery",
  prefix: "recovery",
  adjectives: ["Unplugged", "Offline", "Cooled", "Rested", "Idle", "Paused", "Unwound", "Mellow", "Eased", "Reset", "Spare", "Soft"],
  nouns: ["Break", "Commit", "Cooldown", "Terminal", "Standup", "Branch", "Window", "Stretch", "Merge", "Buffer", "Release", "Cache"],
  archs: [
    p({
      slug: "screen-down",
      shape: "ramp-down",
      from: 18,
      to: 8,
      mins: [10, 15, 20],
      carriers: [200, 220],
      modes: ["binaural", "monaural", "isochronic"],
      noises: [["pink", 0.2]],
      layers: [["lofi", "pad"], ["pad"], ["lofi"]],
      vibes: ["calm", "lofi", "warm"],
      situations: ["ai-burnout", "quick-reset"],
      intensity: 2,
      gain: 0.42,
      count: 5,
      reason: "Steps your brain down from beta to alpha after a long review or generation run."
    }),
    p({
      slug: "micro-break",
      shape: "plateau",
      from: 11,
      to: 8.5,
      ret: 11,
      mins: [5, 8, 10],
      carriers: [190, 210],
      modes: ["isochronic", "binaural"],
      noises: [["off", 0], ["pink", 0.15]],
      layers: [["chimes"], ["pad", "chimes"]],
      vibes: ["bright", "calm"],
      situations: ["quick-reset", "ai-burnout"],
      intensity: 2,
      gain: 0.4,
      count: 4,
      reason: "A {minutes} minute reset that lowers tension and brings you back alert."
    }),
    p({
      slug: "post-sprint",
      shape: "ramp-down",
      from: 20,
      to: 6,
      mins: [15, 20, 30],
      carriers: [200, 220],
      modes: ["binaural", "monaural"],
      noises: [["brown", 0.25]],
      layers: [["pad"], ["drone", "chimes"]],
      vibes: ["deep", "grounded"],
      situations: ["ai-burnout", "heal-stress"],
      intensity: 2,
      gain: 0.4,
      count: 4,
      reason: "A long fall from high beta to theta after an intense push."
    }),
    p({
      slug: "eye-rest",
      shape: "plateau",
      from: 10,
      to: 8,
      mins: [5, 10, 15],
      carriers: [180, 200],
      modes: ["monaural", "isochronic"],
      noises: [["pink", 0.2]],
      layers: [["pad"], ["chimes"]],
      vibes: ["calm", "minimal"],
      situations: ["ai-burnout", "quick-reset"],
      intensity: 1,
      gain: 0.38,
      count: 4,
      breath: { inSec: 4, outSec: 6 },
      reason: "Close your eyes and follow a slow 4-in, 6-out breath."
    }),
    p({
      slug: "lofi-unwind",
      shape: "plateau",
      from: 10,
      to: 9,
      mins: [15, 25, 40],
      carriers: [180, 200, 220],
      modes: ["isochronic", "binaural", "monaural"],
      noises: [["pink", 0.1]],
      layers: [["lofi", "crackle", "pluck"], ["lofi", "pad"]],
      vibes: ["lofi", "warm"],
      situations: ["ai-burnout", "heal-stress", "quick-reset"],
      intensity: 1,
      gain: 0.4,
      count: 5,
      reason: "Slow lo-fi bed to decompress while you do something light."
    }),
    p({
      slug: "commute-decompress",
      shape: "ramp-down",
      from: 14,
      to: 9,
      mins: [15, 20, 30],
      carriers: [200, 230],
      modes: ["isochronic", "monaural"],
      noises: [["pink", 0.15]],
      layers: [["pluck"], ["lofi", "pluck"]],
      vibes: ["grounded", "warm", "minimal"],
      situations: ["ai-burnout", "quick-reset", "heal-stress"],
      intensity: 2,
      gain: 0.42,
      count: 4,
      reason: "Closes the work day with a calm descent that works over speakers."
    })
  ]
}, Q = (e) => Math.round(e * 1e3) / 1e3, ee = (e) => Math.min(40, Math.max(0.5, e)), ct = (e) => e.segs.reduce((t, n) => t + n[0], 0) * (e.scale ?? 1);
function Ge(e, t) {
  const n = e.carrier ?? 200;
  return e.carrierEnd === void 0 ? n : Math.round(n + (e.carrierEnd - n) * t / Math.max(ct(e), 1));
}
function Gn(e) {
  const t = [], [n, a] = e.noise ?? ["off", 0];
  let s = 0;
  return e.segs.forEach((o, r) => {
    const l = o[1] !== o[2], c = e.segs[r + 1];
    t.push({
      atMin: Q(s / 60),
      beatHz: Q(ee(o[1])),
      carrierHz: Ge(e, s),
      gain: e.gain ?? 0.5,
      mode: e.mode ?? "binaural",
      noise: n,
      noiseLevel: a,
      ramp: l
    }), s += o[0] * (e.scale ?? 1), l && (c === void 0 || ee(c[1]) !== ee(o[2])) && t.push({ ...t[t.length - 1], atMin: Q(s / 60), beatHz: Q(ee(o[2])), carrierHz: Ge(e, s), ramp: !1 });
  }), t;
}
function Wn(e) {
  const t = Gn(e);
  return {
    id: e.id,
    name: e.name,
    category: e.category,
    vibe: e.vibe,
    tags: [...e.tags, e.source],
    layerTags: ke(t),
    situations: e.situations,
    recommendedMinutes: Math.max(1, Math.round(ct(e) / 60)),
    intensity: e.intensity,
    adhdFriendly: Se(t, e.intensity),
    stages: t,
    reasonTemplate: e.reason,
    source: e.source
  };
}
const te = ["white", 0.3], pe = ["pink", 0.3], fe = ["brown", 0.3], We = [
  [60, 10, 8],
  [60, 8, 8],
  [60, 8, 6],
  [60, 6, 6],
  [120, 6, 5],
  [360, 5, 5],
  [10, 5, 8],
  [10, 8, 5],
  [180, 5, 5],
  [10, 5, 8],
  [10, 8, 5],
  [90, 5, 5],
  [10, 5, 8],
  [10, 8, 5],
  [240, 5, 5],
  [10, 5, 8],
  [10, 8, 5],
  [480, 5, 5],
  [10, 5, 8],
  [10, 8, 5],
  [360, 5, 5],
  [480, 5, 12]
], qn = [
  [120, 10, 8],
  [120, 8, 8],
  [120, 8, 6],
  [240, 6, 6],
  [240, 6, 5],
  [420, 5, 5],
  [20, 5, 8],
  [20, 8, 5],
  [360, 5, 5],
  [20, 5, 8],
  [20, 8, 5],
  [180, 5, 5],
  [900, 5, 5],
  [900, 5, 5],
  [360, 5, 5],
  [360, 5, 12]
], Kn = [
  [15, 10, 8],
  [240, 8, 8],
  [15, 8, 6],
  [240, 6, 6],
  [15, 6, 8],
  [555, 8, 8],
  [15, 8, 6],
  [75, 6, 6],
  [15, 6, 8],
  [45, 8, 8]
], Un = [
  [333, 8, 8],
  [333, 8, 10],
  [333, 10, 12],
  [333, 12, 12],
  [333, 12, 10],
  [333, 10, 8],
  [333, 8, 10]
], Yn = [
  [120, 20, 40],
  ...Array.from({ length: 8 }, () => [[20, 40, 40], [10, 8, 8]]).flat(),
  [120, 40, 10]
], L = (e) => ({ ...e, source: "android", carrier: 200 }), Vn = [
  L({
    id: "android-self-hypnosis",
    name: "Mind Bridge",
    category: "meditation",
    vibe: "deep",
    situations: ["meditate", "heal-stress"],
    intensity: 2,
    segs: [[300, 12, 4], [600, 4, 4], [300, 4, 12]],
    noise: te,
    tags: ["theta", "hypnosis"],
    reason: "Five minutes down to 4 Hz, ten minutes holding there, five minutes back up."
  }),
  L({
    id: "android-highest-mental-activity",
    name: "Spark Burst",
    category: "focus",
    vibe: "energized",
    situations: ["deep-work"],
    intensity: 5,
    segs: [[120, 12, 40], [600, 40, 40], [120, 40, 12]],
    noise: te,
    tags: ["gamma", "boost"],
    reason: "Two minutes up to the 40 Hz ceiling, a ten minute hold, two minutes back to 12 Hz."
  }),
  L({
    id: "android-unity",
    name: "Unity Delta",
    category: "meditation",
    vibe: "ethereal",
    situations: ["meditate", "cant-sleep"],
    intensity: 1,
    segs: [[3600, 3.7, 3.7]],
    noise: fe,
    gain: 0.45,
    tags: ["delta", "long"],
    reason: "A flat 3.7 Hz hour under brown noise for a wide, quiet mind."
  }),
  L({
    id: "android-morphine",
    name: "Morphine Ease",
    category: "healing",
    vibe: "warm",
    situations: ["heal-stress"],
    intensity: 2,
    segs: [[3600, 10, 10]],
    noise: pe,
    tags: ["alpha", "pain"],
    reason: "An hour at a steady 10 Hz under pink noise to loosen the body."
  }),
  L({
    id: "android-learning",
    name: "Long Study Bed",
    category: "focus",
    vibe: "bright",
    situations: ["deep-work"],
    intensity: 3,
    segs: [[120, 40, 14], [7080, 14, 14]],
    gain: 0.5,
    tags: ["beta", "study"],
    reason: "A two minute lift, then two hours at 14 Hz for long reading blocks."
  }),
  L({
    id: "android-creativity",
    name: "Creative Waves",
    category: "vibes",
    vibe: "bright",
    situations: ["quick-reset", "deep-work"],
    intensity: 2,
    segs: Kn,
    noise: ["white", 0.4],
    tags: ["alpha", "theta", "creative"],
    reason: "Twenty minutes that drift back and forth between 10 and 6 Hz for loose ideas."
  }),
  L({
    id: "android-wakeful-relax",
    name: "Quiet Alert",
    category: "meditation",
    vibe: "calm",
    situations: ["meditate", "quick-reset"],
    intensity: 1,
    segs: [[120, 12, 7.83], [780, 7.83, 7.83]],
    noise: ["white", 0.4],
    tags: ["alpha", "zen"],
    reason: "Fifteen minutes parked at 7.83 Hz with white noise, calm but awake."
  }),
  L({
    id: "android-schumann",
    name: "Earth Hum",
    category: "healing",
    vibe: "grounded",
    situations: ["heal-stress", "meditate"],
    intensity: 2,
    segs: [[300, 12, 7.83], [600, 7.83, 7.83], [300, 7.83, 12]],
    noise: ["white", 0.4],
    tags: ["alpha", "earth"],
    reason: "Ramps to 7.83 Hz, holds there ten minutes, then climbs back to 12 Hz."
  }),
  L({
    id: "android-astral-relax",
    name: "Dream Gate Relax",
    category: "lucid-dreams",
    vibe: "ethereal",
    situations: ["lucid-dream", "meditate"],
    intensity: 2,
    segs: [[600, 15, 10], [4800, 10, 10]],
    noise: ["white", 0.4],
    tags: ["alpha", "astral"],
    reason: "A ten minute slide from 15 to 10 Hz, then a long steady alpha rest."
  }),
  L({
    id: "android-interval-pulse",
    name: "Interval Pulse",
    category: "focus",
    vibe: "energized",
    situations: ["deep-work"],
    intensity: 5,
    segs: Yn,
    tags: ["beta", "gamma", "interval"],
    reason: "Eight short high and low rounds between a warm up and a cool down."
  }),
  L({
    id: "android-hallucination",
    name: "Hazy Visions",
    category: "vibes",
    vibe: "ethereal",
    situations: ["quick-reset"],
    intensity: 3,
    segs: [[600, 15, 10]],
    noise: ["white", 0.2],
    tags: ["alpha", "trippy"],
    reason: "A single ten minute slide from 15 to 10 Hz for a soft, dreamy mood."
  }),
  L({
    id: "android-sleep-induction",
    name: "Drift Down",
    category: "sleep",
    vibe: "calm",
    situations: ["cant-sleep"],
    intensity: 1,
    segs: [[360, 9.7, 3.4], [1620, 3.4, 2.4], [1620, 2.4, 3.4]],
    noise: fe,
    gain: 0.5,
    tags: ["delta", "induction"],
    reason: "A six minute fall to delta, then a long gentle rise and dip for the rest of the hour."
  }),
  L({
    id: "android-lucid-dreams",
    name: "Lucid Dream Cycle",
    category: "lucid-dreams",
    vibe: "dreamy",
    situations: ["lucid-dream"],
    intensity: 2,
    segs: We,
    gain: 0.5,
    tags: ["theta", "lucid"],
    reason: "A theta bed with brief alpha lifts and a soft ending."
  }),
  L({
    id: "android-shamanic-rhythm",
    name: "Ember Circle",
    category: "meditation",
    vibe: "grounded",
    situations: ["meditate", "heal-stress"],
    intensity: 2,
    segs: [[300, 9, 4.5], [3e3, 4.5, 4.5], [300, 4.5, 9]],
    noise: ["white", 0.4],
    tags: ["theta", "journey"],
    reason: "Five minutes down to 4.5 Hz, fifty minutes of hold, five minutes back up."
  }),
  L({
    id: "android-smr-sleep",
    name: "SMR Sleep Weave",
    category: "sleep",
    vibe: "minimal",
    situations: ["cant-sleep", "heal-stress"],
    intensity: 2,
    segs: Un,
    tags: ["alpha", "smr"],
    reason: "Forty minutes of beats crossing between alpha and the low SMR band."
  }),
  L({
    id: "android-lucid-dreams-2",
    name: "Long Lucid Night",
    category: "lucid-dreams",
    vibe: "deep",
    situations: ["lucid-dream", "cant-sleep"],
    intensity: 2,
    segs: [[600, 9.7, 3.4], [5400, 3.4, 2.4], ...qn],
    noise: pe,
    gain: 0.5,
    tags: ["delta", "theta", "lucid"],
    reason: "A delta fall followed by a long night plan with timed theta pulses."
  }),
  L({
    id: "android-adhd-cycle",
    name: "Focus Cycle",
    category: "adhd-control",
    vibe: "energized",
    situations: ["adhd-focus", "deep-work"],
    intensity: 3,
    segs: [[300, 40, 12], [300, 20, 20], [300, 12, 12], [300, 20, 20], [300, 12, 12], [300, 20, 20]],
    noise: te,
    tags: ["beta", "cycle"],
    reason: "Five minute blocks that swap between 12 and 20 Hz after a 40 Hz opener."
  }),
  // Shortened variants of existing Android programs.
  L({
    id: "android-self-hypnosis-short",
    name: "Quick Mind Bridge",
    category: "meditation",
    vibe: "calm",
    situations: ["meditate", "quick-reset"],
    intensity: 2,
    segs: [[300, 12, 4], [600, 4, 4], [300, 4, 12]],
    noise: te,
    scale: 0.5,
    tags: ["theta", "short"],
    reason: "The Mind Bridge shape squeezed into ten minutes."
  }),
  L({
    id: "android-wakeful-relax-5",
    name: "Five Minute Calm",
    category: "work-recovery",
    vibe: "calm",
    situations: ["quick-reset", "ai-burnout"],
    intensity: 1,
    segs: [[120, 12, 7.83], [780, 7.83, 7.83]],
    noise: ["white", 0.3],
    scale: 1 / 3,
    tags: ["alpha", "short"],
    reason: "A five minute Quiet Alert between tasks."
  }),
  L({
    id: "android-schumann-short",
    name: "Earth Reset",
    category: "healing",
    vibe: "grounded",
    situations: ["heal-stress", "quick-reset"],
    intensity: 2,
    segs: [[300, 12, 7.83], [600, 7.83, 7.83], [300, 7.83, 12]],
    noise: ["white", 0.3],
    scale: 0.5,
    tags: ["alpha", "short"],
    reason: "A ten minute version of the Earth Hum shape."
  }),
  L({
    id: "android-lucid-dreams-short",
    name: "Lucid Nap Cycle",
    category: "lucid-dreams",
    vibe: "dreamy",
    situations: ["lucid-dream", "cant-sleep"],
    intensity: 2,
    segs: We.slice(0, 12),
    gain: 0.5,
    tags: ["theta", "lucid", "short"],
    reason: "The opening stretch of the Lucid Dream Cycle, sized for naps."
  })
], ce = (e) => ({ ...e, source: "gnaural" }), Jn = [
  ce({
    id: "gnaural-power-nap",
    name: "Midday Nap",
    category: "sleep",
    vibe: "warm",
    situations: ["quick-reset", "cant-sleep", "ai-burnout"],
    intensity: 1,
    segs: [[13, 11, 8.8], [17, 8.8, 7], [29, 7, 5.2], [38, 5.2, 4.4], [50, 4.4, 4.2], [68, 4.2, 4], [877, 4, 4], [37, 4, 4.2], [32, 4.2, 5.1], [20, 5.1, 6.8], [15, 6.8, 9.8], [4, 9.8, 9.8]],
    carrier: 164,
    carrierEnd: 110,
    noise: pe,
    gain: 0.5,
    tags: ["delta", "nap", "schedule"],
    reason: "A fast fall to 4 Hz, a long hold, then a slow climb. Twenty minutes in all."
  }),
  ce({
    id: "gnaural-airplane-aid",
    name: "Long Haul Calm",
    category: "meditation",
    vibe: "calm",
    situations: ["meditate", "quick-reset", "heal-stress"],
    intensity: 1,
    segs: [[9, 0.5, 12], [45, 12, 8], [60, 8, 6], [120, 6, 5], [180, 5, 4.3], [180, 4.3, 4], [900, 4, 4], [900, 4, 4.2], [900, 4.2, 3.9], [900, 3.9, 3.9], [400, 3.9, 4.3]],
    carrier: 280,
    carrierEnd: 140,
    noise: fe,
    gain: 0.5,
    tags: ["theta", "travel", "schedule"],
    reason: "A falling carrier tone over theta beats, built for long seated trips."
  }),
  ce({
    id: "gnaural-arrive-sharp",
    name: "Arrive Sharp",
    category: "focus",
    vibe: "bright",
    situations: ["deep-work"],
    intensity: 4,
    segs: [[236, 10.1, 10.1], [132, 12.1, 12.1], [661, 28.5, 28.5], [209, 5.4, 5.4], [73, 7.3, 7.3]],
    carrier: 200,
    gain: 0.5,
    tags: ["beta", "gamma", "schedule"],
    reason: "Five steps from alpha up to a 28.5 Hz middle, then back down, in twenty two minutes."
  })
];
function Zn() {
  return [...Vn, ...Jn].map(Wn);
}
const ut = [
  { id: "lofi", name: "Lo-fi", blurb: "Warm, slow chords with a tape and vinyl feel, like a quiet study radio.", mood: "warm", defaultLevel: 0.5, layerKeys: ["lofiLevel", "lofiProgression", "tapeWow", "crackle"], templateId: "starter-lofi", evidence: "preference" },
  { id: "piano", name: "Soft piano", blurb: "A soft piano playing gentle, slow phrases with long ringing notes.", mood: "calm", defaultLevel: 0.45, layerKeys: ["instLevel", "instKind", "pianoPedal"], templateId: "starter-piano", evidence: "preference" },
  { id: "violet", name: "Violet hiss", blurb: "A thin, bright hiss, like gentle static. Keep it quiet.", mood: "bright", defaultLevel: 0.3, layerKeys: [], templateId: "starter-violet", evidence: "limited" },
  { id: "rain", name: "Rain hush", blurb: "A steady rain-like hush, even across the pitches (pink noise).", mood: "calm", defaultLevel: 0.4, layerKeys: [], templateId: "starter-rain", evidence: "mixed" },
  { id: "deep", name: "Deep rumble", blurb: "A deep, low rumble like distant thunder or a big waterfall (brown noise).", mood: "deep", defaultLevel: 0.4, layerKeys: [], templateId: "starter-deep", evidence: "preference" },
  { id: "chimes", name: "Soft chimes", blurb: "Soft bells that ring now and then at uneven gaps.", mood: "dreamy", defaultLevel: 0.3, layerKeys: ["chimeLevel", "chimeRatePerMin"], templateId: "starter-chimes", evidence: "preference" },
  { id: "beats", name: "Beats only", blurb: "A soft pulse you hear as two slightly different tones, one per ear. Use headphones.", mood: "neutral", defaultLevel: 0, layerKeys: [], templateId: "starter-beats", evidence: "mixed" }
], Xn = (e) => Number.isFinite(e) ? Math.min(1, Math.max(0, e)) : 0;
function Qn(e, t) {
  const n = Xn(t);
  switch (e) {
    case "lofi":
      return { noise: "off", noiseLevel: 0, layers: { lofiLevel: n, lofiWarmth: 0.6, lofiProgression: 2, tapeWow: 0.35, crackle: 0.12, breathDepth: 0.4, breathRateHz: 0.08, stereoWidth: 0.5 } };
    case "piano":
      return { noise: "off", noiseLevel: 0, layers: { instLevel: n, instKind: 3, instRootHz: 220, instScale: 2, instBpm: 46, pianoPedal: 0.5, breathDepth: 0.3, breathRateHz: 0.07, stereoWidth: 0.4 } };
    case "violet":
      return { noise: "violet", noiseLevel: n, layers: {} };
    case "rain":
      return { noise: "pink", noiseLevel: n, layers: {} };
    case "deep":
      return { noise: "brown", noiseLevel: n, layers: {} };
    case "chimes":
      return { noise: "off", noiseLevel: 0, layers: { chimeLevel: n, chimeRatePerMin: 5, breathDepth: 0.2, breathRateHz: 0.06 } };
    default:
      return { noise: "off", noiseLevel: 0, layers: {} };
  }
}
const ea = { warm: "warm", calm: "calm", bright: "bright", deep: "deep", dreamy: "dreamy", neutral: "minimal" };
function ta(e) {
  const t = Qn(e.id, e.defaultLevel), n = Object.keys(t.layers).length > 0, s = [{
    atMin: 0,
    beatHz: 8,
    carrierHz: 200,
    gain: 0.4,
    mode: "binaural",
    noise: t.noise,
    noiseLevel: t.noiseLevel,
    ...n ? { layers: t.layers } : {},
    ramp: !1
  }];
  return {
    id: e.templateId,
    name: e.name,
    category: "vibes",
    vibe: ea[e.mood] ?? "calm",
    tags: ["starter", "sound-first", e.id],
    layerTags: ke(s),
    situations: ["quick-reset", "heal-stress"],
    recommendedMinutes: 20,
    intensity: 1,
    adhdFriendly: Se(s, 1),
    stages: s,
    reasonTemplate: e.blurb,
    source: "original"
  };
}
function na() {
  return ut.map(ta);
}
function aa() {
  return [
    ...na(),
    ...Zn(),
    ...[jn, Bn, xn, Fn, Hn, In, Pn, $n].flatMap(_n)
  ];
}
let qe;
function B() {
  return qe ?? (qe = aa()), qe;
}
new Proxy([], {
  get: (e, t) => Reflect.get(B(), t),
  has: (e, t) => Reflect.has(B(), t),
  ownKeys: () => Reflect.ownKeys(B()),
  getOwnPropertyDescriptor: (e, t) => {
    const n = Reflect.getOwnPropertyDescriptor(B(), t);
    return n === void 0 || t === "length" ? n : { ...n, configurable: !0 };
  }
});
function sa(e) {
  return e.stages.some((t) => {
    var n;
    return (((n = t.layers) == null ? void 0 : n.percLevel) ?? 0) > 0;
  });
}
function oa(e) {
  return e.stages.some((t) => {
    var n;
    return (((n = t.layers) == null ? void 0 : n.crackle) ?? 0) > 0;
  });
}
function Ke(e) {
  return e.stages.some((t) => t.mode === "binaural");
}
const ra = {
  focus: [1, 1, 0.5, 0.1],
  "adhd-control": [1, 1, 0.5, 0.1],
  vibes: [0.5, 0.8, 1, 0.5],
  "work-recovery": [0.5, 1, 1, 0.4],
  healing: [0.6, 0.7, 1, 0.8],
  meditation: [1, 0.6, 1, 0.6],
  sleep: [0, 0.2, 0.7, 1],
  "lucid-dreams": [0, 0.1, 0.6, 1]
}, ia = { morning: 0, afternoon: 1, evening: 2, night: 3 }, la = (e) => Math.round(e * 10) / 10;
function ca(e, t, n) {
  const a = Math.max(1, t);
  if (e <= a)
    return n.push(`Fits your ${a} minutes (${e} min).`), 15 * (0.6 + 0.4 * (e / a));
  const s = (e - a) / a;
  return n.push(`Runs ${e} min, longer than your ${a}; you can stop any time.`), Math.max(0, 15 * (1 - s * 1.5)) - (s > 0.5 ? 5 : 0);
}
function ua(e, t, n) {
  return t.deviceType === "speaker" ? Ke(e) ? (n.push("Warning: binaural beats need headphones. A speaker will not deliver the effect; pick an isochronic or monaural template if you can."), -8) : (n.push("Isochronic or monaural beats work over speakers."), 10) : (n.push(t.deviceType === "bluetooth" ? "Good over Bluetooth headphones." : "Headphones suit every beat type."), Ke(e) ? 10 : 8);
}
function da(e, t, n) {
  const a = e.intensity > 3 || sa(e) || oa(e), s = t.sensorySensitivity;
  return s === "low" ? { pts: 10, sensitive: !1 } : s === "medium" ? { pts: e.intensity <= 3 ? a ? 7 : 10 : 4, sensitive: !1 } : a ? (n.push("Relaxed filter: this one is stronger or has percussion or crackle, shown because too few gentle matches exist."), { pts: 0, sensitive: !0 }) : (n.push("Gentle: low intensity, no percussion or crackle."), { pts: e.intensity <= 2 ? 10 : 7, sensitive: !1 });
}
function ma(e, t) {
  const n = [e.reasonTemplate.replace("{minutes}", String(e.recommendedMinutes))], a = e.situations.includes(t.situation);
  let s = 0;
  a ? (s += 40, n.push(`Made for: ${t.situation}.`)) : n.push(`Related option: not built for ${t.situation}, but close in mood.`), t.vibe === void 0 ? s += 7 : t.vibe === e.vibe && (s += 15, n.push(`Matches your ${t.vibe} vibe.`)), s += ca(e.recommendedMinutes, t.availableMinutes, n);
  const o = (ra[e.category][ia[t.timeOfDay]] ?? 0) * 10;
  s += o, o >= 8 && n.push(`Suits the ${t.timeOfDay}.`), e.intensity >= 4 && t.timeOfDay === "night" && (s -= 5), s += ua(e, t, n);
  const r = da(e, t, n);
  return s += r.pts, { template: e, score: Math.max(0, la(s)), reasons: n, sensitive: r.sensitive, onSituation: a };
}
const ha = (e, t) => t.score - e.score || (e.template.id < t.template.id ? -1 : e.template.id > t.template.id ? 1 : 0);
function pa(e, t = 5, n = B()) {
  const a = Math.max(1, Math.floor(t)), s = n.map((c) => ma(c, e)).sort(ha), o = [
    s.filter((c) => c.onSituation && !c.sensitive),
    s.filter((c) => !c.sensitive),
    s
  ], r = o.find((c) => c.length >= a) ?? s, l = r.slice(0, a);
  return r !== o[0] && l.forEach((c) => {
    c.onSituation || c.reasons.push("Filters relaxed: too few exact matches, so close alternatives are included.");
  }), l.map((c) => ({ template: c.template, score: c.score, reasons: c.reasons }));
}
function dt(e) {
  const t = Math.max(0, Math.ceil(e)), n = Math.floor(t / 60), a = Math.floor(n / 60), s = (o) => String(o).padStart(2, "0");
  return a > 0 ? `${a}:${s(n % 60)}:${s(t % 60)}` : `${s(n)}:${s(t % 60)}`;
}
const Ue = {
  today: "M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6 7 7M17 17l1.4 1.4M5.6 18.4 7 17M17 7l1.4-1.4M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z",
  journeys: "M5 19c0-6 14-4 14-14M5 19a1.5 1.5 0 1 0 0-.01M19 5a1.5 1.5 0 1 0 0-.01",
  library: "M5 4h4v16H5zM11 4h4v16h-4zM17 6l3 .8-3.6 13.2-3-.8",
  crew: "M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3 19c0-3 3-5 6-5s6 2 6 5M16 11a2.5 2.5 0 1 0 0-5M17 14c2 .3 4 1.6 4 5",
  settings: "M4 7h9M17 7h3M4 17h3M11 17h9M15 5v4M9 15v4",
  target: "M12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16ZM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z",
  wave: "M3 12c3-6 6-6 9 0s6 6 9 0",
  leaf: "M5 19c0-9 5-14 15-14 0 10-5 15-14 15M5 19c3-4 6-7 10-9",
  heart: "M12 20S4 15 4 9.5A4 4 0 0 1 12 8a4 4 0 0 1 8 1.5C20 15 12 20 12 20Z",
  moon: "M20 14A8 8 0 1 1 10 4a6.5 6.5 0 0 0 10 10Z",
  cloud: "M7 18a4 4 0 0 1-.5-8A5.5 5.5 0 0 1 17 9a4.5 4.5 0 0 1 0 9Z",
  lotus: "M12 5c3 3 3 9 0 13-3-4-3-10 0-13ZM4 10c4 0 7 3 8 8M20 10c-4 0-7 3-8 8",
  bolt: "M13 3 5 13h6l-1 8 8-10h-6Z",
  rain: "M7 14a4 4 0 0 1-.5-8A5.5 5.5 0 0 1 17 5a4.5 4.5 0 0 1 0 9ZM8 17v3M12 17v3M16 17v3",
  stream: "M3 8c3-3 6 3 9 0s6 3 9 0M3 14c3-3 6 3 9 0s6 3 9 0",
  ocean: "M3 16c3-5 6-5 9 0 3-5 6-5 9 0M3 20h18M12 6v3",
  rapids: "M4 7c4-2 6 2 10 0M4 12c4-2 6 2 10 0M4 17c4-2 6 2 10 0M18 6l2 2-2 2",
  forest: "M12 3 6 12h4l-4 6h12l-4-6h4ZM12 18v3",
  birds: "M3 11c3-3 6-3 9 1 3-4 6-4 9-1M8 16l2 3M16 16l-2 3",
  breeze: "M3 9h10a3 3 0 1 0-3-3M3 14h14a3 3 0 1 1-3 3M3 19h6",
  check: "M5 12.5l4.5 4.5L19 7",
  file: "M6 3h8l4 4v14H6zM14 3v4h4M9 14l2 2 4-4"
};
function Me({ name: e, size: t = 22 }) {
  return /* @__PURE__ */ i("svg", { className: "c-icon", width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", focusable: "false", children: /* @__PURE__ */ i("path", { d: Ue[e] ?? Ue.wave }) });
}
const fa = D(() => import("./chunk-mascot-CjKHJelf.mjs").then((e) => ({ default: e.CalmMascot })));
function Ne({ size: e, mood: t = "idle", reduced: n }) {
  return /* @__PURE__ */ i(q, { fallback: /* @__PURE__ */ i("span", { className: "c-mascot-gap", style: { width: e, height: e } }), children: /* @__PURE__ */ i(fa, { mood: t, size: e, reducedMotion: n }) });
}
function ga({ title: e, reduced: t }) {
  return /* @__PURE__ */ f("header", { className: "c-pagehead", children: [
    /* @__PURE__ */ i(Ne, { size: 72, reduced: t }),
    /* @__PURE__ */ i("h1", { className: "c-h1", children: e })
  ] });
}
const ya = [
  { view: "today", label: d.nav[0], icon: "today" },
  { view: "library", label: d.nav[1], icon: "library" },
  { view: "crew", label: d.nav[2], icon: "crew" },
  { view: "settings", label: d.nav[3], icon: "settings" }
];
function ba({ view: e, onGo: t, reduced: n = !1 }) {
  const a = e === "journey" || e === "journeys" ? "today" : e === "nature" ? "library" : e === "reset" ? "today" : e;
  return /* @__PURE__ */ f("nav", { className: "c-tabbar", "aria-label": "Main", children: [
    /* @__PURE__ */ f("div", { className: "c-rail-brand", "aria-hidden": "true", children: [
      /* @__PURE__ */ i(Ne, { size: 40, reduced: n }),
      /* @__PURE__ */ i("span", { className: "c-brand", children: d.brand })
    ] }),
    ya.map((s) => /* @__PURE__ */ f("button", { type: "button", className: "c-nav", "aria-current": a === s.view ? "page" : void 0, onClick: () => t(s.view), children: [
      /* @__PURE__ */ i(Me, { name: s.icon }),
      /* @__PURE__ */ i("span", { children: s.label })
    ] }, s.view))
  ] });
}
function va(e, t = null) {
  var o;
  if (e.templateName !== null) return e.templateName;
  const n = e.source === "crew", a = n ? t ?? e.presetId : e.presetId, s = (o = Vt.find((r) => r.id === a)) == null ? void 0 : o.name;
  return s === void 0 ? d.brand : n ? `Crew: ${s}` : s;
}
function wa({ snap: e, crewPresetId: t = null, onOpen: n, onStop: a }) {
  if (!e.playing) return null;
  const s = e.timer.kind !== "none" && e.timer.running ? dt(e.timer.remainingSec) : "";
  return /* @__PURE__ */ f("div", { className: "c-mini", role: "group", "aria-label": "Now playing", children: [
    /* @__PURE__ */ f("button", { type: "button", className: "c-btn c-link c-mini-open", onClick: n, children: [
      va(e, t),
      s !== "" && /* @__PURE__ */ i("span", { className: "c-digits", children: ` ${s}` })
    ] }),
    /* @__PURE__ */ i("button", { type: "button", className: "c-btn c-small", "data-testid": "mini-stop", onClick: a, children: d.stop })
  ] });
}
const ka = ["focus", "calm", "sleep", "study", "recover", "curious"], Sa = ["morning", "afternoon", "evening", "night", "anytime"], Ma = ["headphones", "speakers", "bluetooth", "unsure"], Na = {
  "sleep-onset-delta": 6,
  "sleep-drift-theta": 5,
  "sleep-deep-delta": 5,
  "recovery-lofi-unwind": 5,
  "recovery-post-sprint": 4,
  "recovery-micro-break": 4,
  "focus-alpha-beta": 5,
  "focus-sprint-pulse": 4,
  "focus-deep-beta": 5,
  "adhd-smr-steady": 5,
  "adhd-beta-anchor": 5,
  "vibe-warm-glow": 4,
  "healing-soothe-glide": 4,
  "meditation-alpha-sit": 5,
  "meditation-breath-pacer": 4
}, Aa = Object.freeze({ kind: "rest", family: "", variants: Object.freeze([]) });
function Ta(e) {
  const t = Na[e] ?? 0, n = [];
  for (let a = 1; a <= t; a += 1) n.push(`${e}-${String(a).padStart(2, "0")}`);
  return Object.freeze(n);
}
function Ea(e) {
  return Object.freeze({ kind: "session", family: e, variants: Ta(e) });
}
function H(...e) {
  return Object.freeze(e.map((t) => t === "rest" ? Aa : Ea(t)));
}
const ue = (e, t) => Array.from({ length: t }, () => e), j = (e) => Object.freeze(e), Ae = Object.freeze([
  j({
    id: "calm-evenings",
    title: "7 Calm Evenings",
    blurb: "7 short evenings of slow sound. About 20 minutes each.",
    situation: "heal-stress",
    vibe: "calm",
    minutes: 20,
    days: H(
      "healing-soothe-glide",
      "meditation-breath-pacer",
      "vibe-warm-glow",
      "rest",
      "meditation-alpha-sit",
      "recovery-lofi-unwind",
      "healing-soothe-glide"
    )
  }),
  j({
    id: "focus-mornings",
    title: "5 Focus Mornings",
    blurb: "5 mornings of steady sound to start work. About 30 minutes each.",
    situation: "deep-work",
    vibe: "bright",
    minutes: 30,
    days: H("focus-alpha-beta", "focus-alpha-beta", "focus-sprint-pulse", "rest", "focus-deep-beta")
  }),
  j({
    id: "easier-sleep",
    title: "14 Nights of Wind-Down Sound",
    blurb: "14 nights of slow sound for winding down. Rest nights included.",
    situation: "cant-sleep",
    vibe: "dreamy",
    minutes: 45,
    days: H(
      ...ue("sleep-drift-theta", 4),
      "rest",
      ...ue("sleep-onset-delta", 4),
      "rest",
      ...ue("sleep-deep-delta", 3),
      "sleep-onset-delta"
    )
  }),
  j({
    id: "study-sprint",
    title: "Study Sprint Week",
    blurb: "A week of short study blocks with breaks. About 25 minutes each.",
    situation: "deep-work",
    vibe: "minimal",
    minutes: 25,
    days: H(
      "focus-sprint-pulse",
      "focus-alpha-beta",
      "recovery-micro-break",
      "focus-sprint-pulse",
      "rest",
      "focus-alpha-beta",
      "meditation-alpha-sit"
    )
  }),
  j({
    id: "after-work-reset",
    title: "After-Work Reset",
    blurb: "5 evenings to step out of work mode. About 20 minutes each.",
    situation: "ai-burnout",
    vibe: "warm",
    minutes: 20,
    days: H("recovery-post-sprint", "recovery-lofi-unwind", "recovery-micro-break", "rest", "recovery-lofi-unwind")
  }),
  j({
    id: "gentle-routine",
    title: "Gentle Routine",
    blurb: "Gentle routine for steady attention. About 25 minutes each.",
    situation: "adhd-focus",
    vibe: "grounded",
    minutes: 25,
    days: H(
      "adhd-smr-steady",
      "recovery-micro-break",
      "adhd-smr-steady",
      "rest",
      "adhd-beta-anchor",
      "recovery-micro-break",
      "adhd-smr-steady"
    )
  })
]);
function cr(e) {
  return Ae.find((t) => t.id === e);
}
const La = {
  focus: { situation: "deep-work", vibe: "bright", minutes: 25 },
  calm: { situation: "heal-stress", vibe: "calm", minutes: 15 },
  sleep: { situation: "cant-sleep", vibe: "dreamy", minutes: 45 },
  study: { situation: "deep-work", vibe: "minimal", minutes: 30 },
  recover: { situation: "ai-burnout", vibe: "warm", minutes: 15 },
  curious: { situation: "quick-reset", minutes: 10 }
}, Ca = {
  headphones: "headphones",
  bluetooth: "bluetooth",
  speakers: "speaker",
  unsure: "headphones"
};
function Oa(e) {
  return e < 12 ? "morning" : e >= 12 && e < 17 ? "afternoon" : e >= 17 && e < 21 ? "evening" : "night";
}
function za(e, t = /* @__PURE__ */ new Date()) {
  const n = La[e.goal], a = e.timeOfDay === "anytime" ? Oa(t.getHours()) : e.timeOfDay, s = {
    situation: n.situation,
    availableMinutes: n.minutes,
    timeOfDay: a,
    sensorySensitivity: e.extraGentle ? "high" : "medium",
    deviceType: Ca[e.device]
  };
  return Object.freeze(n.vibe === void 0 ? s : { ...s, vibe: n.vibe });
}
const Da = 3, Ra = 864e5, mt = 4;
function V(e) {
  if (!Number.isFinite(e)) return 0;
  const t = new Date(e).getTimezoneOffset() * 6e4;
  return Math.floor((e - t) / Ra);
}
const ht = (e) => Number.isInteger(e) && e >= 0 && e < 1e7;
function _a(e) {
  return Number.isFinite(e) ? Math.min(7, Math.max(1, Math.floor(e))) : mt;
}
function Ia(e) {
  return e - (e + 3) % 7;
}
function Pa(e, t, n) {
  const a = /* @__PURE__ */ new Map();
  for (const o of e) {
    if (!ht(o.day) || o.day < t || o.day > n) continue;
    const r = Number.isFinite(o.minutes) && o.minutes > 0 ? o.minutes : 0;
    a.set(o.day, (a.get(o.day) ?? 0) + r);
  }
  const s = /* @__PURE__ */ new Set();
  return a.forEach((o, r) => {
    o >= Da && s.add(r);
  }), s;
}
function Ba(e, t, n) {
  return n.has(e) ? "listened" : e === t ? "today" : e > t ? "upcoming" : "rest";
}
function xa(e, t, n = mt) {
  const a = _a(n);
  if (!ht(t)) {
    const l = Object.freeze(Array.from({ length: 7 }, () => "upcoming"));
    return Object.freeze({ daysListened: 0, goalDays: a, goalMet: !1, quietWeek: !0, dots: l });
  }
  const s = Ia(t), o = Pa(e, s, t), r = Object.freeze(Array.from({ length: 7 }, (l, c) => Ba(s + c, t, o)));
  return Object.freeze({
    daysListened: o.size,
    goalDays: a,
    goalMet: o.size >= a,
    quietWeek: o.size === 0,
    dots: r
  });
}
const Te = "zonked.profile.v1", Ee = "zonked.journeys.v1", Le = "zonked.last.v1", pt = 32 * 1024, ft = 1, Fa = 1e7, Ha = /^[a-z0-9-]{1,64}$/, gt = Object.freeze({
  goal: "curious",
  timeOfDay: "anytime",
  device: "unsure",
  extraGentle: !1,
  createdAt: 0
}), ja = Object.freeze({}), Ce = (e) => typeof e == "object" && e !== null && !Array.isArray(e), ge = (e, t) => typeof e == "number" && Number.isInteger(e) && e >= 0 && e <= t, de = (e, t) => e.some((n) => n === t);
function yt(e, t) {
  try {
    const n = e.get(t);
    if (n === null || n.length > pt) return;
    const a = JSON.parse(n);
    return Ce(a) && a.v === ft ? a : void 0;
  } catch {
    return;
  }
}
function bt(e, t, n) {
  try {
    const a = JSON.stringify({ v: ft, ...n });
    return a.length > pt ? !1 : (e.set(t, a), !0);
  } catch {
    return !1;
  }
}
function vt(e) {
  const { goal: t, timeOfDay: n, device: a, extraGentle: s, createdAt: o } = e;
  if (!(!de(ka, t) || !de(Sa, n) || !de(Ma, a)) && !(typeof s != "boolean" || !ge(o, Number.MAX_SAFE_INTEGER)))
    return Object.freeze({ goal: t, timeOfDay: n, device: a, extraGentle: s, createdAt: o });
}
function $a(e) {
  const t = yt(e, Te);
  return (t && vt(t)) ?? gt;
}
function Ga(e, t) {
  const n = vt({ ...t });
  return n !== void 0 && bt(e, Te, { ...n });
}
function wt(e, t) {
  const n = Ae.find((c) => c.id === e);
  if (n === void 0 || !Ce(t) || !ge(t.startedAt, Fa)) return;
  const { doneDays: a, pickedIds: s } = t;
  if (!Array.isArray(a) || !Array.isArray(s) || s.length > n.days.length) return;
  const o = a, r = s;
  if (!o.every((c) => ge(c, n.days.length) && c >= 1) || !r.every((c) => typeof c == "string" && Ha.test(c))) return;
  const l = [...new Set(o)].sort((c, h) => c - h);
  return Object.freeze({
    startedAt: t.startedAt,
    doneDays: Object.freeze(l),
    pickedIds: Object.freeze([...r])
  });
}
function Wa(e) {
  const t = yt(e, Ee), n = t == null ? void 0 : t.journeys;
  if (!Ce(n)) return ja;
  const a = {};
  for (const [s, o] of Object.entries(n)) {
    const r = wt(s, o);
    r !== void 0 && (a[s] = r);
  }
  return Object.freeze(a);
}
function qa(e, t) {
  const n = {};
  for (const [a, s] of Object.entries(t)) {
    const o = wt(a, s);
    o !== void 0 && (n[a] = o);
  }
  return bt(e, Ee, { journeys: n });
}
function Ka(e) {
  for (const t of [Te, Ee, Le])
    try {
      e.remove(t);
    } catch {
    }
}
function Ye() {
  const e = /* @__PURE__ */ new Map();
  return {
    get: (t) => e.get(t) ?? null,
    set: (t, n) => void e.set(t, n),
    remove: (t) => void e.delete(t)
  };
}
function Ua(e) {
  try {
    const t = e ?? globalThis.localStorage;
    if (t === void 0) return Ye();
    const n = "zonked.probe";
    return t.setItem(n, "1"), t.removeItem(n), {
      get: (a) => t.getItem(a),
      set: (a, s) => t.setItem(a, s),
      remove: (a) => t.removeItem(a)
    };
  } catch {
    return Ye();
  }
}
const kt = /^[a-z0-9-]{1,80}$/;
function Ya(e) {
  try {
    const t = e.get(Le);
    return t !== null && kt.test(t) ? t : null;
  } catch {
    return null;
  }
}
function Va(e, t) {
  try {
    kt.test(t) && e.set(Le, t);
  } catch {
  }
}
const Ja = 60, Za = 400;
function Xa(e, t) {
  const n = _(null), [a, s] = S(null);
  C(() => {
    if (e.playing) {
      s(null), n.current = e.templateId === null ? null : { id: e.templateId, name: e.templateName ?? d.brand, minutes: e.elapsedSec / 60 };
      return;
    }
    const r = n.current;
    if (n.current = null, !t || r === null || r.minutes * 60 < Ja) return;
    const l = window.setTimeout(() => s({ ...r, minutes: Math.round(r.minutes) }), Za);
    return () => window.clearTimeout(l);
  }, [e.playing, e.templateId, e.templateName, e.elapsedSec, t]);
  const o = T(() => s(null), []);
  return K(() => ({ card: a, dismiss: o }), [a, o]);
}
function Qa({ info: e, onAgain: t, onClose: n, firstRun: a = !1 }) {
  const s = _(null);
  return C(() => {
    var o;
    return (o = s.current) == null ? void 0 : o.focus();
  }, []), /* @__PURE__ */ i("div", { className: "c-overlay", onKeyDown: (o) => o.key === "Escape" && n(), children: /* @__PURE__ */ f("div", { className: "c-dialog c-end", role: "dialog", "aria-modal": "true", "aria-labelledby": "c-end-title", "data-testid": "end-card", children: [
    /* @__PURE__ */ i("h2", { id: "c-end-title", className: "c-h1", children: d.endTitle }),
    /* @__PURE__ */ i("p", { children: d.endLine(e.name, e.minutes) }),
    /* @__PURE__ */ i("p", { className: "c-muted", children: d.endNote }),
    a && /* @__PURE__ */ i("p", { className: "c-note", "data-testid": "first-run-note", children: d.studioNote }),
    /* @__PURE__ */ f("div", { className: "c-actions", children: [
      /* @__PURE__ */ i("button", { ref: s, type: "button", className: "c-btn c-primary", "data-testid": "end-again", onClick: t, children: d.playAgain }),
      /* @__PURE__ */ i("button", { type: "button", className: "c-btn", "data-testid": "end-close", onClick: n, children: d.close })
    ] })
  ] }) });
}
function es({ onAccept: e, onCancel: t }) {
  const n = _(null), a = _(null);
  C(() => {
    var r;
    return (r = n.current) == null ? void 0 : r.focus();
  }, []);
  const o = /* @__PURE__ */ f("div", { className: "c-safety", onKeyDown: (r) => {
    var l;
    if (t !== void 0) {
      if (r.key === "Escape")
        r.stopPropagation(), t();
      else if (r.key === "Tab") {
        const c = r.shiftKey ? a.current : n.current;
        document.activeElement === c && (r.preventDefault(), (l = r.shiftKey ? n.current : a.current) == null || l.focus());
      }
    }
  }, children: [
    /* @__PURE__ */ i("h2", { id: "c-safety-title", children: d.safetyTitle }),
    /* @__PURE__ */ i("ul", { className: "c-safe-list", children: d.safetyLines.map((r) => /* @__PURE__ */ i("li", { children: r }, r)) }),
    /* @__PURE__ */ f("div", { className: "c-actions c-row", children: [
      t !== void 0 && /* @__PURE__ */ i("button", { ref: a, type: "button", className: "c-btn", onClick: t, children: d.back }),
      /* @__PURE__ */ i("button", { ref: n, type: "button", className: "c-btn c-primary", "data-testid": "calm-safety-accept", onClick: e, children: d.safetyAccept })
    ] })
  ] });
  return t === void 0 ? o : /* @__PURE__ */ i("div", { className: "c-overlay", children: /* @__PURE__ */ i("div", { className: "c-dialog", role: "dialog", "aria-modal": "true", "aria-labelledby": "c-safety-title", children: o }) });
}
const ts = 1, ns = 720;
function as(e) {
  const t = (e.endedAt - e.startedAt) / 6e4;
  return Number.isFinite(t) && t >= ts ? Math.min(ns, t) : 0;
}
const ss = 200, Y = (e = Date.now) => V(e());
function os(e, t) {
  const n = K(() => Ua(), []), [a, s] = S(() => $a(n)), [o, r] = S(() => Wa(n)), [l, c] = S([]), [h, g] = S(0);
  C(() => {
    let k = !0;
    return e.listLogs(ss).then((u) => k && c(u)).catch(() => {
    }), () => {
      k = !1;
    };
  }, [e, h, t]);
  const N = K(() => {
    const k = l.map((u) => ({ day: V(u.startedAt), minutes: as(u) }));
    return xa(k, Y());
  }, [l]), v = T(
    (k) => {
      s(k), Ga(n, k);
    },
    [n]
  ), w = T(
    (k, u) => {
      r((m) => {
        const { [k]: y, ...b } = m, E = u === null ? b : { ...b, [k]: u };
        return qa(n, E), E;
      });
    },
    [n]
  ), A = T(() => g((k) => k + 1), []);
  return { storage: n, profile: a, progress: o, week: N, logs: l, setProfile: v, setJourney: w, refresh: A };
}
const St = 15e3, Mt = 6e4, ae = [
  { score: 22, level: "focus", beatHz: 40, carrierHz: 200, gain: 0.45, transitionSec: 5, why: "Simulated: a fresh start. The pretend load is low, so the sound stays steady." },
  { score: 48, level: "flow", beatHz: 18, carrierHz: 220, gain: 0.4, transitionSec: 8, why: "Simulated: the pretend load is building. The beat eases down to 18 Hz." },
  { score: 70, level: "recovery", beatHz: 10, carrierHz: 200, gain: 0.32, transitionSec: 8, why: "Simulated: the pretend load is high. The beat slows to 10 Hz and the sound softens." },
  { score: 88, level: "decompress", beatHz: 6, carrierHz: 180, gain: 0.25, transitionSec: 8, why: "Simulated: burned out. The beat settles to 6 Hz and the sound goes quiet." }
];
function rs(e, t) {
  const n = ae[Math.min(Math.max(0, Math.trunc(e)), ae.length - 1)];
  return n === void 0 ? null : {
    version: 1,
    at: t,
    burnout: { score: n.score, level: n.level },
    target: { presetId: "burnout-reset", beatHz: n.beatHz, carrierHz: n.carrierHz, gain: n.gain, transitionSec: n.transitionSec, breathe: n.score >= 60 },
    sbg: null,
    why: n.why
  };
}
function is(e, t) {
  return Jt(JSON.parse(JSON.stringify(rs(e, t))));
}
const Nt = {
  now: () => Date.now(),
  setTimer: (e, t) => setTimeout(e, t),
  clearTimer: (e) => clearTimeout(e)
};
let se = [], At = Nt;
function Tt() {
  for (const e of se) At.clearTimer(e);
  se = [];
}
function Ve(e, t, n, a) {
  const s = a.now(), o = is(t, Math.trunc(s / 1e3));
  if (o === null) return;
  const r = t >= ae.length - 1;
  st({ state: o, source: "demo", changedAtMs: s, snoozeUntilMs: 0, demoNextAtMs: n + (r ? Mt : (t + 1) * St) }), e.applyCrew(o), e.followCrew();
}
function Et(e) {
  Tt(), st({ state: null, source: "none", changedAtMs: 0, snoozeUntilMs: 0, demoNextAtMs: null }), e.crewLost();
}
function ls(e, t = Nt) {
  Tt(), At = t;
  const n = t.now();
  Ve(e, 0, n, t), e.snapshot().playing || e.play();
  for (let a = 1; a < ae.length; a += 1) se.push(t.setTimer(() => Ve(e, a, n, t), a * St));
  se.push(t.setTimer(() => Et(e), Mt));
}
const cs = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], Je = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], us = { listened: "listened", rest: "rest day", today: "today", upcoming: "coming up" };
function ds(e, t = !0, n = !1) {
  return e.quietWeek && n && !t ? d.joinedLine : e.quietWeek ? t ? d.welcomeBack : d.firstWeek : `${d.weekOf(e.daysListened)}. ${d.restCount}`;
}
function ms({ week: e, hasHistory: t = !0, joinedToday: n = !1, compact: a = !1 }) {
  const s = n && !t && e.quietWeek;
  return /* @__PURE__ */ f("div", { className: a ? "c-week c-week-compact" : "c-week", children: [
    /* @__PURE__ */ i("ul", { className: "c-dots", "aria-label": "This week", children: e.dots.map((o, r) => {
      const l = s && o === "today";
      return /* @__PURE__ */ f("li", { className: `c-dot c-dot-${o}${l ? " c-dot-joined" : ""}`, "data-state": o, children: [
        /* @__PURE__ */ i("span", { className: "c-mark", "aria-hidden": "true", children: l || o === "listened" ? /* @__PURE__ */ i(Me, { name: "check", size: 16 }) : "" }),
        /* @__PURE__ */ i("span", { className: "c-dayname", "aria-hidden": "true", children: cs[r] }),
        /* @__PURE__ */ i("span", { className: "c-sr", children: `${Je[r]}, ${l ? d.joinedToday : us[o]}` })
      ] }, Je[r]);
    }) }),
    /* @__PURE__ */ i("p", { className: "c-muted", "data-testid": a ? void 0 : "week-text", children: ds(e, t, s) })
  ] });
}
const hs = () => /* @__PURE__ */ new Date();
function ps(e, t, n) {
  var s;
  const a = ((s = e[t]) == null ? void 0 : s.doneDays.length) ?? 0;
  return a === 0 ? d.dayZero(n) : `Day ${Math.min(n, a + 1)} of ${n}`;
}
function fs({ profile: e, week: t, progress: n, reduced: a, crewConnected: s, hasHistory: o = !0, joinedToday: r = !1, now: l = hs, last: c = null, onPlay: h, onOpenJourney: g, onGo: N, onReset: v }) {
  const [w, A] = S(0), k = K(() => pa(za(e, l()), 5), [e, l]), u = k[w % Math.max(1, k.length)];
  return /* @__PURE__ */ f("div", { className: "c-today", children: [
    /* @__PURE__ */ f("header", { className: "c-pagehead", children: [
      /* @__PURE__ */ i(Ne, { size: 72, reduced: a }),
      /* @__PURE__ */ i("h1", { className: "c-greet", "data-testid": "greeting", children: Zt(l().getHours()) })
    ] }),
    c !== null && c.id !== (u == null ? void 0 : u.template.id) && /* @__PURE__ */ i("button", { type: "button", className: "c-btn c-wide c-again", "data-testid": "play-again", onClick: () => h(c), children: `${d.playAgain}: ${c.name}` }),
    u !== void 0 && /* @__PURE__ */ f("section", { className: "c-daily", "aria-labelledby": "c-daily-h", children: [
      /* @__PURE__ */ i("p", { className: "c-eyebrow", children: d.dailyEyebrow }),
      /* @__PURE__ */ i("h2", { id: "c-daily-h", children: u.template.name }),
      /* @__PURE__ */ i("p", { className: "c-muted", children: `${u.template.recommendedMinutes} min. ${u.reasons[0] ?? d.suggested}` }),
      /* @__PURE__ */ f("div", { className: "c-actions", children: [
        /* @__PURE__ */ i("button", { type: "button", className: "c-btn c-primary", "data-testid": "today-play", onClick: () => h(u.template), children: d.start }),
        /* @__PURE__ */ i("button", { type: "button", className: "c-btn c-link", onClick: () => A((m) => m + 1), children: d.notThisOne })
      ] })
    ] }),
    /* @__PURE__ */ f("button", { type: "button", className: "c-link-card c-reset-entry", "data-testid": "today-reset", onClick: v, children: [
      /* @__PURE__ */ i("b", { children: d.resetEntry }),
      /* @__PURE__ */ i("small", { children: d.resetEntryHint })
    ] }),
    /* @__PURE__ */ f("section", { "aria-labelledby": "c-goal-h", children: [
      /* @__PURE__ */ i("h2", { id: "c-goal-h", className: "c-h3", children: `Your goal: ${Xt[e.goal]}` }),
      /* @__PURE__ */ i(ms, { week: t, hasHistory: o, joinedToday: r })
    ] }),
    /* @__PURE__ */ f("section", { "aria-labelledby": "c-for-h", children: [
      /* @__PURE__ */ i("h2", { id: "c-for-h", className: "c-h3", children: d.forYou }),
      /* @__PURE__ */ i("ul", { className: "c-rows", children: k.map((m) => /* @__PURE__ */ i("li", { children: /* @__PURE__ */ f("button", { type: "button", className: "c-mini-card", onClick: () => h(m.template), children: [
        /* @__PURE__ */ i("b", { children: m.template.name }),
        /* @__PURE__ */ i("small", { children: m.reasons[0] ?? d.suggested }),
        /* @__PURE__ */ i("em", { children: `${m.template.recommendedMinutes} min` })
      ] }) }, m.template.id)) })
    ] }),
    /* @__PURE__ */ f("section", { "aria-labelledby": "c-jr-h", children: [
      /* @__PURE__ */ i("h2", { id: "c-jr-h", className: "c-h3", children: d.journeysTitle }),
      /* @__PURE__ */ i("ul", { className: "c-rows", children: Ae.map((m) => /* @__PURE__ */ i("li", { children: /* @__PURE__ */ f("button", { type: "button", className: "c-journey-card", onClick: () => g(m.id), children: [
        /* @__PURE__ */ i("b", { children: m.title }),
        /* @__PURE__ */ i("small", { children: m.blurb }),
        /* @__PURE__ */ i("em", { children: ps(n, m.id, m.days.length) })
      ] }) }, m.id)) })
    ] }),
    /* @__PURE__ */ i("button", { type: "button", className: "c-link-card", onClick: () => N("library"), children: /* @__PURE__ */ i("b", { children: "Browse all sounds" }) }),
    s && /* @__PURE__ */ i("p", { className: "c-crew-chip", role: "status", children: "Crew connected: easing the sound" })
  ] });
}
const gs = { label: "Breathe in", count: 4 };
function ys(e) {
  const [t, n] = S(0);
  if (C(() => {
    if (n(0), !e) return;
    const s = window.setInterval(() => n((o) => o + 1), 1e3);
    return () => window.clearInterval(s);
  }, [e]), !e) return gs;
  const a = t % 8;
  return { label: a < 4 ? "Breathe in" : "Breathe out", count: 4 - a % 4 };
}
const bs = (e) => e.label === "Breathe in" ? d.counterIn(e.count) : d.counterOut(e.count);
function vs({ label: e, on: t, announce: n }) {
  return /* @__PURE__ */ i("p", { className: "c-sr", role: "status", "aria-live": "polite", "data-testid": "breath-live", children: t && n ? e : "" });
}
const ws = 0.5, ks = 1.25, G = (e, t) => Number.isFinite(e) ? e : t, W = (e, t, n) => Math.max(t, Math.min(n, e)), Ze = (e) => (1 - Math.cos(Math.PI * W(e, 0, 1))) / 2;
function Ss(e, t = 4, n = 4) {
  const a = W(G(t, 4), 0.5, 30), s = W(G(n, 4), 0.5, 30), o = a + s, l = (G(e, 0) % o + o) % o;
  if (l < a) return Ze(l / a);
  const c = Math.min(ws, s / 4), h = W((l - a) / (s - c), 0, 1);
  return 1 - Ze(1 - Math.pow(1 - h, ks));
}
function Ms(e, t = 4, n = 4) {
  const a = W(G(t, 4), 0.5, 30), s = a + W(G(n, 4), 0.5, 30);
  return (G(e, 0) % s + s) % s < a ? "Breathe in" : "Breathe out";
}
const Xe = { phase: 0, label: "Breathe in" }, Ns = 4e-3;
function As(e) {
  const [t, n] = S(Xe);
  return C(() => {
    if (!e || typeof requestAnimationFrame != "function") {
      n(Xe);
      return;
    }
    let a = 0;
    const s = performance.now(), o = (r) => {
      const l = (r - s) / 1e3, c = Ss(l), h = Ms(l);
      n((g) => h === g.label && Math.abs(c - g.phase) < Ns ? g : { phase: c, label: h }), a = requestAnimationFrame(o);
    };
    return a = requestAnimationFrame(o), () => {
      cancelAnimationFrame(a);
    };
  }, [e]), t;
}
function ur({ label: e, className: t, live: n = !0 }) {
  return /* @__PURE__ */ i("p", { className: t ?? "cm-cue", ...n ? { "aria-live": "polite", role: "status" } : {}, children: e });
}
const Ts = 20;
function Es(e) {
  if (e.kind === "sleep-fade") return 4;
  if (e.kind !== "countdown") return 3;
  const t = Math.round(e.totalSec / 60);
  return t === 15 ? 0 : t === 30 ? 1 : t === 60 ? 2 : -1;
}
function Ls({ timer: e, player: t }) {
  const n = (s) => {
    s <= 2 ? t.startTimer({ kind: "countdown", minutes: [15, 30, 60][s] ?? 15 }) : s === 3 ? t.stopTimer() : t.startTimer({ kind: "sleep-fade", minutes: Ts });
  }, a = Es(e);
  return /* @__PURE__ */ f("div", { children: [
    /* @__PURE__ */ i("div", { className: "c-chips", role: "radiogroup", "aria-label": "Timer", children: d.timerChips.map((s, o) => /* @__PURE__ */ i("button", { type: "button", role: "radio", "aria-checked": a === o, className: "c-tchip", onClick: () => n(o), children: s }, s)) }),
    e.kind !== "none" && e.running && /* @__PURE__ */ i("p", { className: "c-time", "data-testid": "time-left", children: dt(e.remainingSec) })
  ] });
}
const Lt = 8 * 1024 * 1024, Ct = 600, Cs = 20, Os = 2, zs = 0.45, Ds = 1e-4;
function Rs(e) {
  var s;
  const t = ((s = e[0]) == null ? void 0 : s.length) ?? 0, n = new Float32Array(t), a = Math.max(1, e.length);
  for (const o of e) {
    const r = Math.min(t, o.length);
    for (let l = 0; l < r; l++) {
      const c = o[l] ?? 0;
      n[l] = (n[l] ?? 0) + (Number.isFinite(c) ? c : 0) / a;
    }
  }
  return n;
}
function _s(e, t) {
  const n = e.length - t, a = e.slice(0, n);
  for (let s = 0; s < t; s++) {
    const o = (s + 0.5) / t * (Math.PI / 2);
    a[s] = (e[s] ?? 0) * Math.sin(o) + (e[n + s] ?? 0) * Math.cos(o);
  }
  return a;
}
function Ot(e, t) {
  if (!Number.isFinite(t) || t <= 0 || e.length === 0) return { ok: !1, error: "This file has no sound in it." };
  const n = Rs(e), a = n.length / t;
  if (a > Ct) return { ok: !1, error: "This file is longer than 10 minutes." };
  let s = 0;
  for (const l of n) s = Math.max(s, Math.abs(l));
  if (s < Ds) return { ok: !1, error: "This file is silent." };
  const o = zs / s;
  for (let l = 0; l < n.length; l++) n[l] = (n[l] ?? 0) * o;
  if (a < Cs) return { ok: !0, data: n, loop: !1 };
  const r = Math.min(Math.round(Os * t), Math.floor(n.length / 4));
  return { ok: !0, data: _s(n, r), loop: !0 };
}
const me = [
  { id: "rain", label: "Rain", kind: "loop", note: "Steady rain on leaves and ground.", moods: ["focus", "calm", "sleep", "nature"] },
  { id: "stream", label: "Stream", kind: "loop", note: "Clear water running close by.", moods: ["focus", "calm", "nature"] },
  { id: "ocean", label: "Ocean waves", kind: "loop", note: "Slow waves on a tropical beach.", moods: ["calm", "sleep", "nature"] },
  { id: "rapids", label: "River rapids", kind: "loop", note: "A wide river over rocks, a steady wash.", moods: ["focus", "nature"] },
  { id: "forest", label: "Forest", kind: "loop", note: "Quiet woods with a little air in the trees.", moods: ["focus", "calm", "nature"] },
  { id: "birds", label: "Birds", kind: "loop", note: "Birds singing in a garden.", moods: ["calm", "nature"] },
  { id: "breeze", label: "Breeze and birds", kind: "loop", note: "A soft breeze with birds far off.", moods: ["calm", "nature"] },
  { id: "lightrain", label: "Light rain", kind: "loop", note: "Fine rain with a faint rumble far away.", moods: ["focus", "calm", "sleep", "nature"] },
  { id: "thunder", label: "Far thunder", kind: "loop", note: "Light rain with slow thunder in the distance.", moods: ["calm", "sleep", "nature"] },
  { id: "veranda", label: "Rain on a veranda", kind: "loop", note: "Rain on a covered porch.", moods: ["focus", "calm", "sleep", "nature"] },
  { id: "window", label: "Rain on a window", kind: "loop", note: "Rain tapping on glass.", moods: ["focus", "calm", "sleep"] },
  { id: "storm", label: "Summer rain", kind: "loop", note: "A long, even summer shower.", moods: ["focus", "sleep", "nature"] },
  { id: "waves", label: "Gentle waves", kind: "loop", note: "Water rolling in and out on a shore.", moods: ["calm", "sleep", "nature"] },
  { id: "pebbles", label: "Waves on pebbles", kind: "loop", note: "Waves pulling back over small stones.", moods: ["calm", "sleep", "nature"] },
  { id: "creek", label: "Forest creek", kind: "loop", note: "A small creek in a quiet wood.", moods: ["focus", "calm", "nature"] },
  { id: "trickle", label: "Water trickle", kind: "loop", note: "Thin water dripping and running.", moods: ["focus", "calm"] },
  { id: "fountain", label: "Fountain", kind: "loop", note: "A town fountain, a bright steady wash.", moods: ["focus", "calm"] },
  { id: "fire", label: "Fire crackle", kind: "loop", note: "Dry grass crackling in an open fireplace.", moods: ["calm", "sleep"] },
  { id: "chimes", label: "Wind chimes", kind: "loop", note: "Chimes in a light wind, with soft gaps.", moods: ["calm", "nature"] },
  { id: "koshi", label: "Koshi chimes", kind: "loop", note: "Slow, airy chimes that ring out and fade.", moods: ["calm", "sleep"] },
  { id: "gong", label: "Temple gong", kind: "loop", note: "Deep gong strikes with long, slow fades.", moods: ["calm", "sleep"] },
  { id: "hum", label: "Fan hum", kind: "loop", note: "A smooth room hum, like a fan.", moods: ["focus", "sleep"] },
  { id: "wind", label: "Soft wind (synth)", kind: "synth", note: "Slow gusts of warm wind, made in code.", moods: ["calm", "sleep", "nature"] },
  { id: "waterfall", label: "Waterfall (synth)", kind: "synth", note: "A steady, soft fall of water, made in code.", moods: ["focus", "calm", "nature"] },
  { id: "flute", label: "Soft flute (synth)", kind: "synth", note: "Slow, quiet notes, made in code. Not a real flute.", moods: ["calm", "sleep"] },
  { id: "rainroof", label: "Rain on a roof (synth)", kind: "synth", note: "Soft drops on a roof, made in code.", moods: ["focus", "calm", "sleep"] },
  { id: "bowl", label: "Singing bowl (synth)", kind: "synth", note: "One slow strike every 8 to 14 s, made in code.", moods: ["calm", "sleep"] },
  { id: "softchimes", label: "Soft chimes (synth)", kind: "synth", note: "A few high notes now and then, made in code.", moods: ["calm", "sleep"] },
  { id: "crackle", label: "Campfire crackle (synth)", kind: "synth", note: "A low glow with small pops, made in code.", moods: ["calm", "sleep"] },
  { id: "brown", label: "Brown noise (synth)", kind: "synth", note: "A deep, soft rumble that masks noise.", moods: ["focus", "sleep"] },
  { id: "swell", label: "Ocean swell (synth)", kind: "synth", note: "Slow waves that rise and fall, made in code.", moods: ["calm", "sleep", "nature"] },
  { id: "crickets", label: "Night crickets (synth)", kind: "synth", note: "Quiet crickets far off, made in code.", moods: ["calm", "sleep", "nature"] }
], $ = (e) => ({ ok: !1, error: e }), Is = 20261128, Ps = /^[a-z]+$/;
function Bs(e) {
  const t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map();
  let a = null, s = 0, o = null, r = 0, l = 0;
  const c = () => a === null ? 0 : o ?? tn(s);
  function h(u) {
    u.duck.gain.setTargetAtTime(ot(c()), u.ctx.currentTime, en);
  }
  function g(u) {
    if (!Ps.test(u) || !me.some((m) => m.id === u)) return null;
    try {
      const m = new URL(`${e.baseUrl}samples/${u}.mp3.json`, e.origin);
      return m.origin === new URL(e.origin).origin ? m.href : null;
    } catch {
      return null;
    }
  }
  async function N(u, m) {
    if (t.has(m)) return { ok: !0 };
    const y = g(m);
    if (y === null) return $("unknown sample");
    try {
      const b = await e.fetchBytes(y), E = await u.ctx.decodeAudioData(b);
      return t.set(m, E), { ok: !0 };
    } catch {
      return $("sample unavailable: check the connection or reinstall the app files");
    }
  }
  function v(u, m) {
    const y = n.get(m);
    if (y !== void 0) return y;
    const b = N(u, m).finally(() => {
      n.delete(m);
    });
    return n.set(m, b), b;
  }
  function w(u, m) {
    const y = m.ctx.currentTime, b = u.gain.gain;
    b.cancelScheduledValues(y), b.setValueAtTime(b.value, y), b.linearRampToValueAtTime(0, y + xe);
    try {
      u.src.stop(y + xe + 0.05);
    } catch {
    }
    u.src.onended = () => {
      u.src.disconnect(), u.gain.disconnect();
    };
  }
  function A(u, m, y, b, E) {
    a !== null && w(a, u), s = re(b, s);
    const O = u.ctx.createBufferSource(), z = u.ctx.createGain();
    O.buffer = y, O.loop = E, z.gain.setValueAtTime(0, u.ctx.currentTime), z.gain.linearRampToValueAtTime(s, u.ctx.currentTime + Fe), O.connect(z), z.connect(u.input);
    const F = { id: m, src: O, gain: z };
    return E || (O.onended = () => {
      O.disconnect(), z.disconnect(), a === F && (a = null, h(u));
    }), O.start(), a = F, h(u), { ok: !0 };
  }
  async function k(u, m, y, b) {
    let E;
    try {
      E = (await import("./chunk-graph-BSt4xAW7.mjs")).buildSynth;
    } catch {
      return $("sample unavailable: reinstall the app files");
    }
    if (b !== r) return { ok: !0 };
    a !== null && w(a, u), s = re(y, s);
    const O = E(u.ctx, m, Is + l++), z = u.ctx.createGain();
    return z.gain.setValueAtTime(0, u.ctx.currentTime), z.gain.linearRampToValueAtTime(s, u.ctx.currentTime + Fe), O.connect(z), z.connect(u.input), a = { id: m, src: O, gain: z }, h(u), { ok: !0 };
  }
  return {
    list: () => me,
    async start(u, m) {
      const y = e.getBus();
      if (y === null) return $("start the sound first");
      const b = ++r;
      if (me.some((z) => z.id === u && z.kind === "synth")) return k(y, u, m, b);
      const E = await v(y, u);
      if (!E.ok) return E;
      const O = t.get(u);
      return O === void 0 || b !== r ? O === void 0 ? $("sample unavailable") : { ok: !0 } : A(y, u, O, m, !0);
    },
    /** Plays a ready buffer (a person's own sound). Loops, or plays once when `loop` is false. */
    startBuffer(u, m, y, b) {
      const E = e.getBus();
      return E === null ? $("start the sound first") : (r++, A(E, u, m, y, b));
    },
    setLevel(u) {
      s = re(u, s);
      const m = e.getBus();
      if (m === null || a === null) return;
      const y = a.gain.gain;
      y.cancelScheduledValues(m.ctx.currentTime), y.setTargetAtTime(s, m.ctx.currentTime, Qt), h(m);
    },
    setBlend(u) {
      o = nn(u, o ?? 0);
      const m = e.getBus();
      m !== null && h(m);
    },
    stop() {
      r++;
      const u = e.getBus(), m = a;
      a = null, !(u === null || m === null) && (w(m, u), h(u));
    },
    playing: () => (a == null ? void 0 : a.id) ?? null
  };
}
async function xs(e) {
  const t = await fetch(e, { credentials: "same-origin" });
  if (!t.ok) throw new Error(`status ${t.status}`);
  return t.arrayBuffer();
}
const x = Bs({
  getBus: rt,
  fetchBytes: xs,
  baseUrl: "./",
  origin: typeof location > "u" ? "" : location.href
}), zt = () => x.list(), Fs = (e, t) => x.start(e, t), Hs = (e) => x.setLevel(e), js = () => x.stop(), $s = (e) => x.setBlend(e), Gs = () => x.playing();
async function Ws(e, t, n) {
  const a = rt();
  if (a === null) return { ok: !1, error: "start the sound first" };
  try {
    const s = await a.ctx.decodeAudioData(t.slice(0)), o = Array.from({ length: s.numberOfChannels }, (c, h) => s.getChannelData(h)), r = Ot(o, s.sampleRate);
    if (!r.ok) return r;
    const l = a.ctx.createBuffer(1, r.data.length, s.sampleRate);
    return l.getChannelData(0).set(r.data), x.startBuffer(e, l, n, r.loop);
  } catch {
    return { ok: !1, error: "This file could not be played." };
  }
}
const Dt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  MAX_SAMPLE_LEVEL: wn,
  duckGain: ot,
  listSamples: zt,
  playingSample: Gs,
  setBlend: $s,
  setSampleLevel: Hs,
  startOwn: Ws,
  startSample: Fs,
  stopSample: js
}, Symbol.toStringTag, { value: "Module" })), Oe = "zonked.nature.v1", Rt = 0.3, _t = 0.4, It = 0.85, Qe = { id: null, blend: Rt, level: _t }, et = (e, t, n, a) => typeof e == "number" && Number.isFinite(e) ? Math.min(n, Math.max(t, e)) : a;
function qs(e) {
  if (e === null || e.length > 400) return Qe;
  try {
    const t = JSON.parse(e);
    return { id: typeof t.id == "string" && /^(own:)?[a-z0-9]{3,40}$/.test(t.id) ? t.id : null, blend: et(t.blend, 0, 1, Rt), level: et(t.level, 0, It, _t) };
  } catch {
    return Qe;
  }
}
const ze = () => {
  try {
    return typeof localStorage > "u" ? null : localStorage;
  } catch {
    return null;
  }
}, Pt = () => {
  var e;
  return qs(((e = ze()) == null ? void 0 : e.getItem(Oe)) ?? null);
};
function tt(e) {
  var t;
  try {
    (t = ze()) == null || t.setItem(Oe, JSON.stringify(e));
  } catch {
  }
}
function Ks() {
  var e;
  try {
    (e = ze()) == null || e.removeItem(Oe);
  } catch {
  }
}
const Us = { wind: "breeze", waterfall: "rapids", flute: "wave" }, Ys = D(() => import("./chunk-MySounds-C28kRjA9.mjs").then((e) => ({ default: e.MySounds }))), Vs = D(() => import("./chunk-Credits-DTDPYRpG.mjs").then((e) => ({ default: e.Credits })));
function ye({ id: e, label: t, value: n, max: a, onChange: s }) {
  return /* @__PURE__ */ f("div", { className: "c-slider", children: [
    /* @__PURE__ */ i("label", { htmlFor: e, children: t }),
    /* @__PURE__ */ i("input", { id: e, type: "range", min: 0, max: a, step: 0.05, value: n, "aria-valuetext": `${Math.round(n / a * 100)} percent`, onChange: (o) => s(Number(o.currentTarget.value)) })
  ] });
}
function De({ nature: e }) {
  return /* @__PURE__ */ f("div", { className: "c-nature-controls", children: [
    /* @__PURE__ */ i(ye, { id: "c-blend", label: d.natureBlend, value: e.prefs.blend, max: 1, onChange: e.setBlend }),
    /* @__PURE__ */ i(ye, { id: "c-nlevel", label: d.natureLevel, value: e.prefs.level, max: It, onChange: e.setLevel })
  ] });
}
function Js({ nature: e, reduced: t, onBack: n }) {
  const [a, s] = S(null);
  return /* @__PURE__ */ f("div", { className: "c-nature", children: [
    /* @__PURE__ */ i(ga, { title: d.natureHead, reduced: t }),
    /* @__PURE__ */ i("p", { className: "c-lead", children: d.natureIntro }),
    /* @__PURE__ */ i("ul", { className: "c-tiles c-nature-tiles", children: zt().map((o, r) => /* @__PURE__ */ f("li", { children: [
      /* @__PURE__ */ f("button", { type: "button", className: `c-tile c-g${r % 6 + 1}`, "data-testid": `nature-${o.id}`, "aria-pressed": e.on === o.id, onClick: () => e.start(o.id), children: [
        /* @__PURE__ */ i(Me, { name: Us[o.id] ?? o.id }),
        /* @__PURE__ */ i("span", { className: "c-tile-name", children: o.label }),
        /* @__PURE__ */ i("span", { className: "c-tile-mood", children: o.kind === "synth" ? o.note ?? d.natureMade : d.natureFree }),
        e.on === o.id && /* @__PURE__ */ i("span", { className: "c-tile-count", children: d.natureOn })
      ] }),
      /* @__PURE__ */ i("button", { type: "button", className: "c-btn c-link c-small", "aria-expanded": a === o.id, onClick: () => s(a === o.id ? null : o.id), children: `${d.natureCredits}: ${o.label}` }),
      a === o.id && /* @__PURE__ */ i(q, { fallback: null, children: /* @__PURE__ */ i(Vs, { id: o.id, synth: o.kind === "synth" }) })
    ] }, o.id)) }),
    /* @__PURE__ */ i(De, { nature: e }),
    e.on !== null && /* @__PURE__ */ i("button", { type: "button", className: "c-btn c-wide", "data-testid": "nature-stop", onClick: e.stop, children: d.natureOff }),
    /* @__PURE__ */ i("p", { className: "c-status", role: "status", "data-testid": "nature-message", children: e.message }),
    /* @__PURE__ */ i("p", { className: "c-note", children: d.natureNote }),
    /* @__PURE__ */ i(q, { fallback: null, children: /* @__PURE__ */ i(Ys, { nature: e }) }),
    /* @__PURE__ */ i("button", { type: "button", className: "c-btn c-link c-back", onClick: n, children: d.natureBack })
  ] });
}
const Zs = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  NatureControls: De,
  NatureScreen: Js,
  Slider: ye
}, Symbol.toStringTag, { value: "Module" })), Xs = ["cant-sleep", "lucid-dream"], Qs = ["adhd-focus", "deep-work", "ai-burnout"];
function Bt(e, t) {
  if (t) return "nature";
  const n = e === null ? void 0 : B().find((s) => s.id === e), a = (n == null ? void 0 : n.situations) ?? [];
  return a.some((s) => Xs.includes(s)) ? "sleep" : a.some((s) => Qs.includes(s)) ? "focus" : "calm";
}
const eo = 400;
function xt(e, t) {
  const [n, a] = S(0);
  return C(() => {
    if (!t) {
      a(0);
      return;
    }
    let s = !0;
    const o = window.setInterval(() => {
      e.getStats().then((r) => {
        const l = Number.isFinite(r.rms) ? Math.min(1, Math.max(0, r.rms * 4)) : 0;
        s && a((c) => c * 0.6 + l * 0.4);
      }).catch(() => {
      });
    }, eo);
    return () => {
      s = !1, window.clearInterval(o);
    };
  }, [e, t]), n;
}
const to = D(() => import("./chunk-mascot-CjKHJelf.mjs").then((e) => ({ default: e.CalmMascot }))), no = D(() => import("./chunk-visuals-B0CqKfY2.mjs").then((e) => ({ default: e.SceneLoop }))), ao = D(() => import("./chunk-mascot-CjKHJelf.mjs").then((e) => ({ default: e.BreathCue })));
function Re({ still: e, playing: t, situation: n, theme: a, level: s, announce: o = !0 }) {
  const r = As(t && !e), l = ys(t && e), c = t && !e;
  return /* @__PURE__ */ f(we, { children: [
    /* @__PURE__ */ i("div", { className: "c-stage", "data-testid": "breath-ring", "data-still": e ? "true" : "false", "data-situation": n, children: /* @__PURE__ */ f(q, { fallback: null, children: [
      /* @__PURE__ */ i("div", { className: "c-stage-scene", children: /* @__PURE__ */ i(no, { situation: n, reducedMotion: e, theme: a }) }),
      /* @__PURE__ */ i("div", { className: "c-stage-mascot", children: /* @__PURE__ */ i(
        to,
        {
          mood: t ? "breathing" : "idle",
          size: 190,
          reducedMotion: e,
          situation: n,
          breathPhase: c ? r.phase : void 0,
          level: t ? s : 0
        }
      ) })
    ] }) }),
    /* @__PURE__ */ f("div", { className: "c-cue", children: [
      c ? /* @__PURE__ */ i(q, { fallback: null, children: /* @__PURE__ */ i(ao, { label: r.label, className: "c-cue-text", live: !1 }) }) : t ? /* @__PURE__ */ i("p", { className: "c-cue-text", "data-testid": "breath-counter", children: bs(l) }) : /* @__PURE__ */ i("p", { className: "c-cue-text", children: d.breathe }),
      /* @__PURE__ */ i(vs, { label: c ? r.label : l.label, on: t, announce: o })
    ] })
  ] });
}
function so({ engine: e, theme: t, announce: n = !0, player: a, snap: s, still: o, favorite: r, onToggle: l, onFavorite: c, nature: h }) {
  const [g, N] = S(!1), v = xt(e, s.playing), w = ut.find((u) => u.templateId === s.templateId), A = (w == null ? void 0 : w.evidence) ?? "mixed", k = Bt(s.templateId, h.on !== null);
  return /* @__PURE__ */ f("div", { className: "c-player", children: [
    /* @__PURE__ */ i("h1", { className: "c-h1", children: s.templateName ?? d.brand }),
    /* @__PURE__ */ i(Re, { still: o, playing: s.playing, situation: k, theme: t, level: v, announce: n }),
    /* @__PURE__ */ f("div", { className: "c-controls", children: [
      /* @__PURE__ */ i("button", { type: "button", className: "c-btn c-round c-big", "data-testid": "player-toggle", onClick: l, children: s.playing ? d.stop : d.play }),
      /* @__PURE__ */ i("button", { type: "button", className: "c-btn c-round", "aria-pressed": r, onClick: c, children: r ? d.saved : d.favorite })
    ] }),
    /* @__PURE__ */ i(Ls, { timer: s.timer, player: a }),
    /* @__PURE__ */ i(oo, { nature: h }),
    /* @__PURE__ */ i("p", { className: "c-muted", children: d.volumeCapped }),
    /* @__PURE__ */ f("section", { className: "c-why", children: [
      /* @__PURE__ */ i("button", { type: "button", className: "c-btn c-link", "aria-expanded": g, "aria-controls": "c-why-box", onClick: () => N((u) => !u), children: d.whyTitle }),
      /* @__PURE__ */ f("div", { id: "c-why-box", hidden: !g, children: [
        /* @__PURE__ */ i("p", { children: d.whyBody }),
        /* @__PURE__ */ i("p", { children: `Evidence: ${A}. ${an[A] ?? ""}` })
      ] })
    ] })
  ] });
}
function oo({ nature: e }) {
  const t = e.prefs.id ?? Pt().id ?? "rain";
  return /* @__PURE__ */ f("section", { className: "c-card c-nature-quick", "aria-label": d.natureHead, children: [
    /* @__PURE__ */ i("button", { type: "button", className: "c-btn", "data-testid": "player-nature", "aria-pressed": e.on !== null, onClick: () => e.on === null ? e.start(t) : e.stop(), children: e.on === null ? `${d.natureAdd}: ${t.startsWith("own:") ? d.mineTitle : t}` : d.natureOff }),
    e.on !== null && /* @__PURE__ */ i(De, { nature: e }),
    /* @__PURE__ */ i("p", { className: "c-status", role: "status", children: e.message })
  ] });
}
const ro = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  PlayerScreen: so,
  Stage: Re
}, Symbol.toStringTag, { value: "Module" })), he = 90, io = "android-wakeful-relax-5";
function lo(e) {
  const [t, n] = S("idle"), [a, s] = S(he), o = _(0), { player: r, guarded: l, playTemplate: c } = e, h = T(() => {
    const A = B().find((k) => k.id === io);
    A !== void 0 && l(() => {
      o.current = Date.now() + he * 1e3, s(he), n("running"), c(A, null);
    });
  }, [l, c]), g = T(() => {
    n("idle"), r.stop();
  }, [r]);
  C(() => {
    if (t !== "running") return;
    const A = window.setInterval(() => {
      const k = Math.ceil((o.current - Date.now()) / 1e3);
      if (k > 0) return s(k);
      window.clearInterval(A), s(0), n("done"), r.stop();
    }, 1e3);
    return () => window.clearInterval(A);
  }, [t, r]);
  const N = _(!1), v = e.snap.playing;
  C(() => {
    t !== "running" ? N.current = !1 : v ? N.current = !0 : N.current && n("idle");
  }, [t, v]);
  const w = _(t);
  return w.current = t, C(() => () => void (w.current === "running" && r.stop()), [r]), { phase: t, left: a, begin: h, stop: g };
}
function co({ s: e, still: t, theme: n, announce: a, onBack: s }) {
  const o = lo(e), r = xt(e.engine, e.snap.playing), l = Bt(e.snap.templateId, !1);
  return o.phase === "done" ? /* @__PURE__ */ i(uo, { onAgain: o.begin, onBack: s }) : /* @__PURE__ */ f("div", { className: "c-player c-reset", "data-testid": "reset-screen", "data-phase": o.phase, children: [
    /* @__PURE__ */ i("h1", { className: "c-h1", children: d.resetTitle }),
    o.phase === "idle" && /* @__PURE__ */ i("p", { className: "c-lead", children: d.resetIntro }),
    /* @__PURE__ */ i(Re, { still: t, playing: o.phase === "running" && e.snap.playing, situation: l, theme: n, level: r, announce: a }),
    o.phase === "running" ? /* @__PURE__ */ f(we, { children: [
      /* @__PURE__ */ i("p", { className: "c-muted c-digits", "data-testid": "reset-left", "aria-hidden": "true", children: d.resetLeft(o.left) }),
      /* @__PURE__ */ i("div", { className: "c-controls", children: /* @__PURE__ */ i("button", { type: "button", className: "c-btn c-round c-big", "data-testid": "reset-stop", onClick: o.stop, children: d.stop }) })
    ] }) : /* @__PURE__ */ f("div", { className: "c-actions", children: [
      /* @__PURE__ */ i("button", { type: "button", className: "c-btn c-primary", "data-testid": "reset-begin", onClick: o.begin, children: d.resetStart }),
      /* @__PURE__ */ i("button", { type: "button", className: "c-btn c-link", onClick: s, children: d.resetBack })
    ] }),
    /* @__PURE__ */ i("p", { className: "c-muted", children: d.volumeCapped })
  ] });
}
function uo({ onAgain: e, onBack: t }) {
  const n = _(null);
  return C(() => {
    var a;
    return (a = n.current) == null ? void 0 : a.focus();
  }, []), /* @__PURE__ */ f("div", { className: "c-end c-reset", "data-testid": "reset-end", children: [
    /* @__PURE__ */ i("h1", { className: "c-h1", children: d.endTitle }),
    /* @__PURE__ */ i("p", { children: d.resetDoneLine }),
    /* @__PURE__ */ i("p", { className: "c-muted", children: d.endNote }),
    /* @__PURE__ */ f("div", { className: "c-actions", children: [
      /* @__PURE__ */ i("button", { ref: n, type: "button", className: "c-btn c-primary", "data-testid": "reset-back", onClick: t, children: d.resetBack }),
      /* @__PURE__ */ i("button", { type: "button", className: "c-btn", "data-testid": "reset-again", onClick: e, children: d.resetAgain })
    ] })
  ] });
}
const mo = D(() => import("./chunk-Journeys-BeQhJUEU.mjs").then((e) => ({ default: e.JourneyList }))), ho = D(() => import("./chunk-Journeys-BeQhJUEU.mjs").then((e) => ({ default: e.JourneyDetail }))), po = D(() => import("./chunk-Library-Cr8d5CS7.mjs").then((e) => ({ default: e.Library }))), fo = D(() => Promise.resolve().then(() => ro).then((e) => ({ default: e.PlayerScreen }))), go = D(() => import("./chunk-CrewScreen-DfIi1Rhs.mjs").then((e) => ({ default: e.CrewScreen }))), yo = D(() => Promise.resolve().then(() => Zs).then((e) => ({ default: e.NatureScreen }))), bo = D(() => import("./chunk-SettingsScreen-DT6aDFsf.mjs").then((e) => ({ default: e.SettingsScreen })));
function vo({ view: e, journeyId: t, s: n, data: a, crewInfo: s, nature: o, still: r, fav: l, last: c, look: h, prefs: g, onPrefs: N, handlers: v }) {
  switch (e) {
    case "journeys":
      return /* @__PURE__ */ i(mo, { progress: a.progress, onOpen: v.openJourney, reduced: r });
    case "journey":
      return /* @__PURE__ */ i(
        ho,
        {
          id: t ?? "",
          profile: a.profile,
          progress: a.progress,
          todayDay: Y(),
          onBack: () => v.go("journeys"),
          onStartJourney: a.setJourney,
          onRestart: (w) => a.setJourney(w, null),
          onPlayDay: v.playDay
        }
      );
    case "library":
      return /* @__PURE__ */ i(po, { store: n.store, logs: a.logs, reduced: r, onNature: () => v.go("nature"), onPlay: v.play, onPlayMix: v.onMix });
    case "nature":
      return /* @__PURE__ */ i(yo, { nature: o, reduced: r, onBack: () => v.go("library") });
    case "player":
      return /* @__PURE__ */ i(fo, { player: n.player, snap: n.snap, still: r, favorite: l.on, onToggle: n.toggle, onFavorite: l.toggle, nature: o, engine: n.engine, theme: h.theme, announce: g.announce });
    case "reset":
      return /* @__PURE__ */ i(co, { s: n, still: r, theme: h.theme, announce: g.announce, onBack: () => v.go("today") });
    case "crew":
      return /* @__PURE__ */ i(
        go,
        {
          crew: s,
          overridden: n.snap.overridden,
          onDemo: () => n.guarded(() => ls(n.player)),
          onStopDemo: () => Et(n.player),
          onNotNow: () => on(n.player),
          onResume: () => sn(n.player),
          onFollow: () => n.player.followCrew()
        }
      );
    case "settings":
      return /* @__PURE__ */ i(
        bo,
        {
          gentle: a.profile.extraGentle,
          reduceMotion: n.userReduced,
          reduced: r,
          onGentle: (w) => a.setProfile({ ...a.profile, extraGentle: w }),
          onReduceMotion: n.setReduced,
          onStudio: v.onStudio,
          onForget: v.forget,
          prefs: g,
          onPrefs: N
        }
      );
    default:
      return /* @__PURE__ */ i(
        fs,
        {
          profile: a.profile,
          week: a.week,
          progress: a.progress,
          reduced: r,
          hasHistory: a.logs.some((w) => V(w.startedAt) < Y()),
          joinedToday: V(a.profile.createdAt) === Y(),
          crewConnected: s.enabled && s.status === "connected",
          last: c,
          onPlay: v.play,
          onOpenJourney: v.openJourney,
          onGo: v.go,
          onReset: () => v.go("reset")
        }
      );
  }
}
const wo = "zonked.look.v1", Ft = "zonked.theme.v2", J = { choice: "dark", dim: null, announce: !0 }, ko = ["system", "light", "dark", "contrast"], So = (e) => typeof e == "string" && ko.includes(e);
function Ht(e) {
  if (e === null) return null;
  try {
    const t = JSON.parse(e.slice(0, 400));
    return typeof t == "object" && t !== null ? t : null;
  } catch {
    return null;
  }
}
function Mo(e) {
  const t = Ht(e);
  return t === null ? J : {
    choice: So(t.choice) ? t.choice : J.choice,
    dim: typeof t.dim == "boolean" ? t.dim : null,
    announce: t.announce !== !1
  };
}
function No(e) {
  const t = Ht(e);
  if (t === null) return J;
  const n = t.highContrast === !0 ? "contrast" : t.theme === "light" ? "light" : "dark";
  return { ...J, choice: n };
}
const Ao = (e) => e.getHours() >= 19 || e.getHours() < 7, To = (e, t = /* @__PURE__ */ new Date()) => e.dim ?? Ao(t), Eo = () => typeof window.matchMedia == "function" && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
function Lo(e, t) {
  return e.choice === "contrast" ? { theme: t, highContrast: !0 } : { theme: e.choice === "system" ? t : e.choice, highContrast: !1 };
}
function Co() {
  try {
    const e = window.localStorage.getItem(Ft);
    return e !== null ? Mo(e) : No(window.localStorage.getItem(wo));
  } catch {
    return J;
  }
}
function Oo() {
  const [e, t] = S(Co), [n, a] = S(Eo);
  C(() => {
    var l;
    if (typeof window.matchMedia != "function") return;
    const o = window.matchMedia("(prefers-color-scheme: light)"), r = () => a(o.matches ? "light" : "dark");
    return (l = o.addEventListener) == null || l.call(o, "change", r), () => {
      var c;
      return (c = o.removeEventListener) == null ? void 0 : c.call(o, "change", r);
    };
  }, []);
  const s = T((o) => {
    t(o);
    try {
      window.localStorage.setItem(Ft, JSON.stringify(o));
    } catch {
    }
  }, []);
  return { look: Lo(e, n), prefs: e, dim: To(e), setPrefs: s };
}
let oe = null;
const nt = () => oe, at = (e) => void (oe = e);
function zo() {
  oe !== null && (oe = null, Promise.resolve().then(() => Dt).then((e) => e.stopSample()).catch(() => {
  }));
}
const Do = "zonked.mysounds.v1", Ro = 5, _o = 20 * 1024 * 1024, R = "sounds", Io = 60, I = (e) => ({ ok: !1, error: e }), Po = "Your device could not store this sound. Remove one and try again.", jt = (e) => /^own:[a-z0-9]{6,40}$/.test(e);
function Bo(e) {
  const t = e.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, Io);
  return t === "" ? "My sound" : t;
}
function xo(e) {
  return new Promise((t, n) => {
    const a = e.open(Do, 1);
    a.onupgradeneeded = () => void a.result.createObjectStore(R, { keyPath: "id" }), a.onsuccess = () => t(a.result), a.onerror = () => n(a.error ?? new Error("open failed")), a.onblocked = () => n(new Error("blocked"));
  });
}
function _e(e) {
  return new Promise((t, n) => {
    e.onsuccess = () => t(e.result), e.onerror = () => n(e.error ?? new Error("request failed"));
  });
}
function Ie(e) {
  return new Promise((t, n) => {
    e.oncomplete = () => t(), e.onerror = () => n(e.error ?? new Error("write failed")), e.onabort = () => n(e.error ?? new Error("write aborted"));
  });
}
const Z = () => typeof indexedDB > "u" ? null : indexedDB;
async function X(e, t, n) {
  if (e === null) return I("This browser cannot keep sounds on your device.");
  let a = null;
  try {
    return a = await xo(e), { ok: !0, value: await t(a) };
  } catch (s) {
    if (s instanceof RangeError) return I(s.message === "count" ? "You can keep 5 sounds. Remove one first." : "Your sounds would use more than 20 MB. Remove one first.");
    const o = s instanceof DOMException && s.name === "QuotaExceededError";
    return I(o ? Po : n);
  } finally {
    a == null || a.close();
  }
}
async function dr(e = Z()) {
  return X(e, async (t) => (await _e(t.transaction(R).objectStore(R).getAll())).map((a) => ({ id: a.id, name: a.name, size: a.size })), "Your sounds could not be read.");
}
async function Fo(e, t = Z()) {
  if (!jt(e)) return I("Unknown sound.");
  const n = await X(t, async (a) => await _e(a.transaction(R).objectStore(R).get(e)), "Your sound could not be read.");
  return n.ok ? n.value === void 0 ? I("That sound is gone.") : { ok: !0, value: n.value.bytes } : n;
}
async function mr(e, t, n = Z()) {
  if (t.byteLength > Lt) return I("This file is bigger than 8 MB.");
  const s = { id: `own:${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`, name: Bo(e), size: t.byteLength, bytes: t };
  return X(n, async (o) => {
    const r = await _e(o.transaction(R).objectStore(R).getAll());
    if (r.length >= Ro) throw new RangeError("count");
    if (r.reduce((c, h) => c + h.size, 0) + s.size > _o) throw new RangeError("total");
    const l = o.transaction(R, "readwrite");
    return l.objectStore(R).put(s), await Ie(l), { id: s.id, name: s.name, size: s.size };
  }, "Your sound could not be saved.");
}
async function hr(e, t = Z()) {
  return X(t, async (n) => {
    const a = n.transaction(R, "readwrite");
    return a.objectStore(R).delete(e), await Ie(a), !0;
  }, "That sound could not be removed.");
}
async function Ho(e = Z()) {
  return X(e, async (t) => {
    const n = t.transaction(R, "readwrite");
    return n.objectStore(R).clear(), await Ie(n), !0;
  }, "Your sounds could not be removed.");
}
const jo = async (e) => {
  const t = typeof OfflineAudioContext > "u" ? void 0 : OfflineAudioContext;
  if (t === void 0) throw new Error("no decoder");
  const n = await new t(1, 1, 44100).decodeAudioData(e.slice(0));
  return { channels: Array.from({ length: n.numberOfChannels }, (a, s) => n.getChannelData(s)), sampleRate: n.sampleRate };
};
async function pr(e, t = jo) {
  var o;
  if (e.byteLength > Lt) return I("This file is bigger than 8 MB.");
  if (e.byteLength === 0) return I("This file is empty.");
  let n;
  try {
    n = await t(e);
  } catch {
    return I("This file is not a sound this browser can read.");
  }
  if ((((o = n.channels[0]) == null ? void 0 : o.length) ?? 0) / n.sampleRate > Ct) return I("This file is longer than 10 minutes.");
  const s = Ot(n.channels, n.sampleRate);
  return s.ok ? { ok: !0, value: !0 } : I(s.error);
}
const ne = () => Promise.resolve().then(() => Dt);
async function $o(e, t) {
  const n = await ne();
  if (!jt(e)) return n.startSample(e, t);
  const a = await Fo(e);
  return a.ok ? n.startOwn(e, a.value, t) : { ok: !1, error: a.error };
}
function Go(e) {
  const [t, n] = S(Pt), [a, s] = S(nt), [o, r] = S(""), l = _(t);
  l.current = t;
  const { player: c, guarded: h } = e;
  C(() => {
    e.snap.playing || (zo(), s(null));
  }, [e.snap.playing]);
  const g = T(
    async (u) => {
      if (r(""), c.snapshot().playing || await c.play(), !c.snapshot().playing) return void r(d.errorAudio);
      (await ne()).setBlend(l.current.blend);
      const y = await $o(u, l.current.level);
      if (!y.ok) return void r(y.error);
      at(u), s(u);
      const b = { ...l.current, id: u };
      n(b), tt(b);
    },
    [c]
  ), N = T((u) => h(() => void g(u)), [h, g]), v = T(() => {
    at(null), s(null), ne().then((u) => u.stopSample());
  }, []), w = T((u, m) => {
    const y = { ...l.current, ...u };
    n(y), tt(y), nt() !== null && ne().then(m);
  }, []), A = T((u) => w({ blend: u }, (m) => m.setBlend(u)), [w]), k = T((u) => w({ level: u }, (m) => m.setSampleLevel(u)), [w]);
  return { prefs: t, on: a, message: o, start: N, stop: v, setBlend: A, setLevel: k };
}
async function Wo() {
  Ks(), await Ho();
}
function qo() {
  const { player: e, store: t, engine: n } = it(), [a, s] = S(() => e.snapshot()), [o, r] = S(rn), [l, c] = S(!1), [h, g, N] = ln(), v = _(null), w = _(o);
  C(() => (s(e.snapshot()), e.subscribe(s)), [e]);
  const A = T(
    (b) => {
      w.current ? b() : (v.current = b, c(!0));
    },
    []
  ), k = T(() => {
    cn(un, !0), w.current = !0, r(!0), c(!1);
    const b = v.current;
    v.current = null, b == null || b();
  }, []), u = T(() => {
    v.current = null, c(!1);
  }, []), m = T(
    (b, E) => A(() => {
      e.setQueue([b]), e.playTemplate(b).then((O) => {
        O && E !== null && e.startTimer({ kind: "countdown", minutes: E });
      });
    }),
    [e, A]
  ), y = T(() => {
    e.snapshot().playing ? e.stop() : A(() => void e.play());
  }, [e, A]);
  return { engine: n, player: e, store: t, snap: a, accepted: o, gate: l, reduced: h, setReduced: g, userReduced: N, guarded: A, accept: k, cancelGate: u, playTemplate: m, toggle: y };
}
function Ko(e, t) {
  const [n, a] = S("standalone"), [s, o] = S(() => dn());
  C(() => mn(o), []), C(() => {
    let l = !1;
    const c = new hn({
      ...t !== void 0 ? { create: t } : {},
      onStatus: (h) => {
        a(h), h === "standalone" && (ie().source !== "demo" && e.crewLost(), l && gn(), l = !1);
      },
      onState: (h) => {
        l = !0, fn(e, h);
      }
    });
    return c.start(), () => c.stop();
  }, [e, t]);
  const r = Yt(pn, ie, ie);
  return { enabled: s, status: n, view: r };
}
const be = 500, ve = { v: 1, items: [] };
function Uo(e, t) {
  if (!He(e) || U(e, "v") !== 1) return ve;
  const n = U(e, "items");
  if (!Array.isArray(n)) return ve;
  const a = [], s = /* @__PURE__ */ new Set();
  for (const o of n.slice(0, be * 2)) {
    if (!He(o)) continue;
    const r = U(o, "kind"), l = lt(U(o, "id"));
    if (r !== "template" && r !== "mix" || l === null) continue;
    const c = `${r}:${l}`;
    if (!s.has(c) && (s.add(c), a.push({ kind: r, id: l, at: yn(U(o, "at"), 0, t + 864e5, t) }), a.length >= be))
      break;
  }
  return { v: 1, items: a };
}
function $t(e, t, n) {
  return e.items.some((a) => a.kind === t && a.id === n);
}
function Yo(e, t, n, a) {
  return $t(e, t, n) ? { v: 1, items: e.items.filter((s) => !(s.kind === t && s.id === n)) } : lt(n) === null || e.items.length >= be ? e : { v: 1, items: [{ kind: t, id: n, at: a }, ...e.items] };
}
function Vo(e, t) {
  const [n, a] = S(ve);
  C(() => {
    let o = !0;
    return e.getRecord("favorites").then((r) => o && a(Uo(r, Date.now()))).catch(() => {
    }), () => {
      o = !1;
    };
  }, [e]);
  const s = T(() => {
    if (t === null) return;
    const o = Yo(n, "template", t, Date.now());
    a(o), e.setRecord("favorites", o).catch(() => {
    });
  }, [n, t, e]);
  return { on: t !== null && $t(n, "template", t), toggle: s };
}
const Jo = D(() => import("./chunk-Onboarding-S3PT8EUY.mjs").then((e) => ({ default: e.Onboarding }))), Zo = (e) => Math.max(180, e * 60 * 0.8);
function Xo({ engine: e, clock: t, store: n, bridgeCreate: a, onStudio: s }) {
  var Be;
  const o = qo(), r = os(o.store, o.snap.playing), l = Ko(o.player, a), c = Go(o), [h, g] = S("today"), [N, v] = S(null), w = _(null), A = Vo(o.store, o.snap.templateId), k = r.profile.createdAt === 0, u = tr(r.storage), m = Xa(o.snap, !k && h !== "reset"), y = o.reduced || r.profile.extraGentle, { look: b, prefs: E, dim: O, setPrefs: z } = Oo();
  nr(s);
  const F = T((P) => g(P), []), { play: Pe, playDay: Wt, finish: qt } = Qo({ s: o, data: r, last: u, end: m, active: w, setView: g });
  sr(o.snap.playing, o.snap.elapsedSec, w, r.progress, r.setJourney);
  const Kt = (P) => {
    v(P), g("journey");
  }, Ut = () => {
    Ka(r.storage), c.stop(), Wo(), r.setProfile(gt), g("today");
  };
  return /* @__PURE__ */ f("div", { className: "c-app", "data-theme": b.theme, "data-contrast": b.highContrast ? "high" : "normal", "data-view": h, "data-dim": O ? "true" : "false", "data-motion": y ? "off" : "on", "data-playing": o.snap.playing ? "true" : "false", children: [
    /* @__PURE__ */ i(ar, {}),
    l.view.source === "demo" && /* @__PURE__ */ i("p", { className: "c-badge-sim", role: "status", "data-testid": "demo-badge", children: d.crewDemoBadge }),
    /* @__PURE__ */ i("main", { id: "c-main", className: "c-main", tabIndex: -1, children: /* @__PURE__ */ i(q, { fallback: /* @__PURE__ */ i("p", { className: "c-loading", role: "status", children: d.loading }), children: k ? /* @__PURE__ */ i(
      Jo,
      {
        playing: o.snap.playing,
        reduced: y,
        initial: r.profile,
        onAccept: o.accept,
        onPreview: (P) => o.playTemplate(P, null),
        onStop: () => void o.player.stop(),
        onFinish: qt
      }
    ) : /* @__PURE__ */ i(
      vo,
      {
        view: h,
        journeyId: N,
        s: o,
        data: r,
        crewInfo: l,
        nature: c,
        still: y,
        fav: A,
        last: u.template,
        look: b,
        prefs: E,
        onPrefs: z,
        handlers: { go: F, play: Pe, playDay: Wt, openJourney: Kt, forget: Ut, onStudio: s, onMix: (P) => o.guarded(() => o.player.playMix(P)) }
      }
    ) }) }),
    !k && h !== "player" && h !== "reset" && /* @__PURE__ */ i(wa, { snap: o.snap, crewPresetId: ((Be = l.view.state) == null ? void 0 : Be.target.presetId) ?? null, onOpen: () => F("player"), onStop: () => void o.player.stop() }),
    !k && /* @__PURE__ */ i(ba, { view: h, onGo: F, reduced: y }),
    /* @__PURE__ */ i("p", { className: "c-sr", role: "status", "data-testid": "play-status", children: o.snap.playing ? `Playing. ${d.volumeCapped}` : "Stopped." }),
    m.card !== null && !o.snap.playing && /* @__PURE__ */ i(Qa, { info: m.card, onAgain: () => {
      var P;
      return er(((P = m.card) == null ? void 0 : P.id) ?? null, Pe);
    }, onClose: m.dismiss, firstRun: V(r.profile.createdAt) === Y() }),
    o.gate && /* @__PURE__ */ i(es, { onAccept: o.accept, onCancel: o.cancelGate })
  ] });
}
function Qo({ s: e, data: t, last: n, end: a, active: s, setView: o }) {
  const r = T(
    (h, g = h.recommendedMinutes) => {
      s.current = null, n.remember(h.id), a.dismiss(), e.playTemplate(h, g), o("player");
    },
    [e, n, a, s, o]
  );
  return { play: r, playDay: (h, g, N) => {
    r(N), s.current = { id: h, no: g, needSec: Zo(N.recommendedMinutes) };
  }, finish: (h, g) => {
    if (t.setProfile(h), !e.snap.playing || e.snap.templateId !== g.id) return r(g);
    n.remember(g.id), e.player.startTimer({ kind: "countdown", minutes: g.recommendedMinutes }), o("player");
  } };
}
const Gt = (e) => e === null ? null : B().find((t) => t.id === e) ?? null;
function er(e, t) {
  const n = Gt(e);
  n !== null && t(n);
}
function tr(e) {
  const [t, n] = S(() => Ya(e)), a = K(() => Gt(t), [t]), s = T(
    (o) => {
      Va(e, o), n(o);
    },
    [e]
  );
  return K(() => ({ template: a, remember: s }), [a, s]);
}
function nr(e) {
  C(() => {
    const t = (n) => {
      n.altKey && n.shiftKey && n.code === "KeyS" && (n.preventDefault(), e());
    };
    return window.addEventListener("keydown", t), () => window.removeEventListener("keydown", t);
  }, [e]);
}
function ar() {
  return /* @__PURE__ */ f(we, { children: [
    /* @__PURE__ */ i("a", { className: "c-skip", href: "#c-main", children: "Skip to content" }),
    /* @__PURE__ */ i("header", { className: "c-topbar", children: /* @__PURE__ */ i("span", { className: "c-brand", children: d.brand }) })
  ] });
}
function sr(e, t, n, a, s) {
  C(() => {
    const o = n.current, r = o === null ? void 0 : a[o.id];
    !e || o === null || r === void 0 || t < o.needSec || (n.current = null, r.doneDays.includes(o.no) || s(o.id, { ...r, doneDays: [...r.doneDays, o.no].sort((l, c) => l - c) }));
  }, [e, t, n, a, s]);
}
const or = {
  position: "fixed",
  left: 12,
  right: 12,
  bottom: 84,
  zIndex: 70,
  padding: "10px 14px",
  borderRadius: 12,
  background: "rgba(30,30,40,0.92)",
  color: "#fff",
  fontSize: 14,
  textAlign: "center"
};
function fr() {
  bn(import.meta.url), vn();
  const { engine: e, store: t } = it();
  C(() => (je(!0), () => je(!1)), []);
  const [n, a] = S(!1);
  return /* @__PURE__ */ f("div", { "data-testid": "zonked-app", style: { height: "100%", minHeight: 0, overflow: "hidden", position: "relative", transform: "translateZ(0)" }, children: [
    /* @__PURE__ */ i("div", { style: { height: "100%", overflowY: "auto" }, children: /* @__PURE__ */ i(Xo, { engine: e, store: t, onStudio: () => a(!0) }) }),
    n && /* @__PURE__ */ i("p", { role: "status", style: or, "data-testid": "studio-note", onClick: () => a(!1), children: "Studio, the advanced mode, is not in the Kiro Crew app yet. Tap to close." })
  ] });
}
export {
  ur as B,
  gt as D,
  ka as G,
  Me as I,
  Ae as J,
  Lt as M,
  ve as N,
  ga as P,
  es as S,
  Sa as T,
  fr as Z,
  Ma as a,
  B as b,
  Uo as c,
  ut as d,
  To as e,
  Ss as f,
  cr as g,
  Ms as h,
  mr as i,
  hr as j,
  Ho as k,
  dr as l,
  za as p,
  pa as r,
  As as u,
  pr as v
};
