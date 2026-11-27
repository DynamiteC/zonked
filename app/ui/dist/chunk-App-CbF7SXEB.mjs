import { jsx as i, jsxs as b, Fragment as Ce } from "react/jsx-runtime";
import { lazy as D, Suspense as U, useRef as _, useState as N, useEffect as L, useCallback as T, useMemo as F, useSyncExternalStore as fn } from "react";
import { C as d, P as pn, s as pt, p as gn, g as bn, b as We, G as yn, L as vn, F as Ge, d as gt, D as wn, c as fe, a as Ke, e as kn, f as Sn, h as bt, E as Mn, r as An, i as Nn, j as yt, k as En, u as Tn, w as Ln, S as Cn, l as On, o as Rn, B as Dn, m as zn, n as pe, q as _n, t as In, v as qe, x as J, y as vt, z as Pn, A as Bn, H as Fn, I as Hn, J as Ue, M as xn } from "./chunk-crewLink-uOIAoAgB.mjs";
function y(e) {
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
const E = (e, t) => e[(t % e.length + e.length) % e.length], jn = [98, 110, 123.5, 87.3, 103.8, 130.8], $n = [196, 220, 247, 175, 165, 262], Wn = {
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
}, Gn = (e) => [...e].reduce((t, n) => (t * 31 + n.charCodeAt(0)) % 9973, 7);
function Kn(e, t, n) {
  const a = Gn(e) + n;
  return { prog: E(Wn[t], a), key: E(jn, a), pianoRoot: E($n, a >> 1) };
}
function qn(e, t, n) {
  const a = e === "dreamy" || e === "ethereal" || e === "calm";
  return {
    breathDepth: E([0.45, 0.4, 0.3, 0.2, 0.1], t - 1),
    breathRateHz: 0.06 + 0.02 * (n % 5),
    stereoWidth: 0.3 + 0.1 * (n % 4),
    panDepth: a ? 0.15 : 0,
    panRateHz: 0.03 + 0.01 * (n % 4)
  };
}
const Un = {
  lofi: (e, t) => ({
    lofiLevel: 0.45,
    lofiWarmth: E([0.5, 0.6, 0.7], e),
    lofiProgression: t.prog,
    tapeWow: E([0.25, 0.35, 0.45], e),
    padRootHz: t.key
  }),
  piano: (e, t) => ({
    instLevel: 0.35,
    instKind: 3,
    instRootHz: t.pianoRoot,
    instScale: E([2, 0, 1, 4, 3], e),
    instBpm: E([40, 46, 52], e),
    pianoPedal: E([0.4, 0.55, 0.7], e)
  }),
  crackle: () => ({ crackle: 0.12 }),
  drone: (e) => ({ instLevel: 0.35, instKind: 1, instRootHz: E([55, 62, 73, 82], e), instScale: 7, instBpm: 40 }),
  pluck: (e) => ({
    instLevel: 0.3,
    instKind: 0,
    instRootHz: E([196, 220, 247, 262], e),
    instScale: E([0, 2, 4, 1], e),
    instBpm: E([48, 56, 64, 72], e)
  }),
  bell: (e) => ({
    instLevel: 0.28,
    instKind: 2,
    instRootHz: E([262, 294, 330, 349], e),
    instScale: 4,
    instBpm: 40
  }),
  pad: (e, t) => ({ padLevel: 0.4, padChord: E([0, 2, 4, 6], e), padRootHz: t.key }),
  chimes: (e) => ({ chimeLevel: 0.25, chimeRatePerMin: E([3, 4, 6, 8], e) }),
  perc: (e) => ({
    percLevel: 0.2,
    percBpm: E([64, 72, 80, 92], e),
    percPattern: E([0, 3, 4, 7], e)
  })
};
function Yn(e, t, n = { prog: 0, key: 110, pianoRoot: 220 }) {
  return e.reduce((a, s) => ({ ...a, ...Un[s](t, n) }), {});
}
const Ye = (e) => Math.round(e * 1e3) / 1e3, ge = (e) => Math.min(40, Math.max(0.5, e));
function Vn(e, t, n, a, s) {
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
    const u = n + (a - n) * c / 3;
    return c < 3 ? [{ t: c * r, beat: u, ramp: !1 }, { t: c * r + r * 0.75, beat: u, ramp: !0 }] : [{ t: c * r, beat: u, ramp: !1 }];
  }).flat();
}
function Jn(e, t, n, a, s) {
  const o = (t % 3 - 1) * e.jitter, r = ge(e.to + o), l = E(e.noises, t >> 1), c = E(e.layers, t * 2 + (t >> 1)), u = E(e.vibes, t), f = Yn(c, t, Kn(e.slug, u, t)), k = Object.keys(f).length > 0, S = k ? { ...f, ...qn(u, e.intensity, t) } : f;
  return Vn(e.shape, n, ge(e.from), r, e.ret).map((M) => ({
    atMin: Ye(M.t),
    beatHz: Ye(ge(M.beat)),
    carrierHz: a,
    gain: e.gain,
    mode: s,
    noise: l[0],
    noiseLevel: l[1],
    ...k ? { layers: S } : {},
    ramp: M.ramp
  }));
}
function ee(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e) {
    t.add(n.mode);
    const a = n.layers;
    n.noise !== "off" && n.noiseLevel > 0 && t.add("noise"), a !== void 0 && (((a.lofiLevel ?? 0) > 0 || (a.crackle ?? 0) > 0) && t.add("lofi"), (a.instLevel ?? 0) > 0 && t.add("instrument"), (a.padLevel ?? 0) > 0 && t.add("pad"), (a.chimeLevel ?? 0) > 0 && t.add("chimes"), (a.percLevel ?? 0) > 0 && t.add("percussion"));
  }
  return [...t];
}
function me(e, t) {
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
function Xn(e, t) {
  const n = e.adjectives.length, a = t * 7 % (n * e.nouns.length);
  return `${E(e.adjectives, a)} ${E(e.nouns, Math.floor(a / n))}`;
}
const Zn = (e) => String(e).padStart(2, "0"), wt = { binaural: "Binaural", monaural: "Monaural", isochronic: "Isochronic" }, Qn = ["lofi", "instrument", "pad", "chimes", "percussion"];
function ea(e, t, n, a, s) {
  const o = s[0], r = [`${wt[e]}, ${t} Hz carrier, ${n} minutes, ${a} mood`];
  o !== void 0 && o.noise !== "off" && o.noiseLevel > 0 && r.push(`${o.noise} noise`);
  const l = s[s.length - 1];
  o !== void 0 && l !== void 0 && o.beatHz !== l.beatHz && r.push(`beat ${o.beatHz} to ${l.beatHz} Hz`);
  const c = ee(s).filter((u) => Qn.includes(u));
  return c.length > 0 && r.push(c.join(" and ")), `${r.join(", ")}.`;
}
function ta(e, t, n, a) {
  const s = E(t.mins, n), o = E(t.carriers, n * 3 + 1), r = E(t.modes, n + (n >> 2)), l = Jn(t, n, s, o, r), c = t.to < 4 ? "delta" : t.to < 8 ? "theta" : t.to < 12 ? "alpha" : t.to < 30 ? "beta" : "gamma";
  return {
    id: `${e.prefix}-${t.slug}-${Zn(n + 1)}`,
    name: Xn(e, a),
    category: e.category,
    vibe: E(t.vibes, n),
    tags: [t.slug, c, r, ...t.tags],
    layerTags: ee(l),
    situations: t.situations,
    recommendedMinutes: s,
    intensity: t.intensity,
    adhdFriendly: me(l, t.intensity),
    stages: l,
    reasonTemplate: `${t.reason.replace("{tone}", wt[r])} ${ea(r, o, s, E(t.vibes, n), l)}`,
    source: "original",
    ...t.breath !== void 0 ? { breath: t.breath } : {}
  };
}
function na(e) {
  let t = 0;
  const n = e.archs.flatMap((a) => Array.from({ length: a.count }, (s, o) => ta(e, a, o, t++)));
  return aa(n);
}
function aa(e) {
  const t = /* @__PURE__ */ new Map();
  return e.map((n) => {
    const a = n.reasonTemplate.replaceAll("{minutes}", String(n.recommendedMinutes)), s = (t.get(a) ?? 0) + 1;
    return t.set(a, s), s === 1 ? n : { ...n, reasonTemplate: `${n.reasonTemplate} Alternate take ${s}.` };
  });
}
const sa = {
  category: "adhd-control",
  prefix: "adhd",
  adjectives: ["Steady", "Anchored", "Level", "Even", "Tidy", "Calm", "Focused", "Plain", "Settled", "Patient", "Smooth", "Constant"],
  nouns: ["Anchor", "Rail", "Tracks", "Rhythm", "Metronome", "Lane", "Thread", "Pulse", "Desk", "Checklist", "Runway", "Keel"],
  archs: [
    y({
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
      reason: "Steady SMR-range pulse with no changes to track, for {minutes} minutes."
    }),
    y({
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
      reason: "A constant low-beta pulse that never changes."
    }),
    y({
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
    y({
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
    y({
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
      reason: "A slow climb from 4 Hz with no sudden steps."
    }),
    y({
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
}, oa = {
  category: "focus",
  prefix: "focus",
  adjectives: ["Sharp", "Deep", "Clear", "Lucid", "Bright", "Keen", "Locked", "Precise", "Crisp", "Direct", "Tuned", "Honed"],
  nouns: ["Beam", "Signal", "Compass", "Engine", "Vector", "Prism", "Forge", "Spire", "Circuit", "Current", "Summit", "Scope"],
  archs: [
    y({
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
      reason: "A pulse on the alpha-beta border for {minutes} minutes."
    }),
    y({
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
      reason: "A steady beta-band pulse for long work blocks."
    }),
    y({
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
      reason: "A short climb to the high-beta and low-gamma edge."
    }),
    y({
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
      reason: "A slow glide from alpha into beta."
    }),
    y({
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
    y({
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
      reason: "Four rising steps with soft percussion."
    })
  ]
}, ra = {
  category: "healing",
  prefix: "healing",
  adjectives: ["Mending", "Tender", "Restoring", "Kind", "Balmy", "Soothing", "Renewing", "Warming", "Settled", "Easing", "Gentle", "Whole"],
  nouns: ["Balm", "Spring", "Embrace", "Garden", "Shelter", "Glow", "Rain", "Hearth", "Sunrise", "Quilt", "Oasis", "Haven"],
  archs: [
    y({
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
      reason: "Starts at a busier pace and slows to a relaxed one over {minutes} minutes."
    }),
    y({
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
      reason: "Steady theta with a soft drone."
    }),
    y({
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
      reason: "A slow rhythm of 6 breaths per minute to follow."
    }),
    y({
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
    y({
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
      reason: "A soft pad with a gliding beat."
    }),
    y({
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
      reason: "A gentle brightening ramp that stays soft."
    })
  ]
}, ia = {
  category: "lucid-dreams",
  prefix: "lucid",
  adjectives: ["Waking", "Silver", "Nebula", "Astral", "Twilight", "Aware", "Hollow", "Starlit", "Liminal", "Vivid", "Opal", "Drifting"],
  nouns: ["Gate", "Compass", "Mirror", "Skyway", "Threshold", "Door", "Voyage", "Lens", "Bridge", "Beacon", "Garden", "Orbit"],
  archs: [
    y({
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
    y({
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
      reason: "Steps down through theta in four stages."
    }),
    y({
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
      reason: "Slow swings between theta and alpha."
    }),
    y({
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
      reason: "A slow descent over {minutes} minutes."
    }),
    y({
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
      reason: "Relaxed theta with a slow instrument drone."
    })
  ]
}, la = {
  category: "meditation",
  prefix: "meditation",
  adjectives: ["Open", "Rooted", "Sacred", "Luminous", "Patient", "Clear", "Boundless", "Inner", "Mindful", "Sunlit", "Hallowed", "Silent"],
  nouns: ["Cushion", "Temple", "Breath", "Mountain", "Lotus", "Stillpoint", "Horizon", "Sanctuary", "River", "Candle", "Grove", "Bowl"],
  archs: [
    y({
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
      reason: "{tone} calm and wide awake for a {minutes} minute seated sit."
    }),
    y({
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
      reason: "Glides from alpha to theta."
    }),
    y({
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
    y({
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
    y({
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
    y({
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
      reason: "A long fall into delta."
    })
  ]
}, ca = {
  category: "sleep",
  prefix: "sleep",
  adjectives: ["Quiet", "Slow", "Velvet", "Hushed", "Moonlit", "Soft", "Drowsy", "Still", "Dim", "Gentle", "Fading", "Lulled"],
  nouns: ["Harbor", "Tide", "Pillow", "Lantern", "Blanket", "Meadow", "Lullaby", "Cabin", "Drift", "Hearth", "Cove", "Evening"],
  archs: [
    y({
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
      reason: "Glides from alpha to delta over {minutes} minutes."
    }),
    y({
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
      reason: "A slow theta drift with a soft pad."
    }),
    y({
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
      reason: "Holds steady delta."
    }),
    y({
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
      reason: "A short nap sound that sinks to theta and returns after {minutes} minutes."
    }),
    y({
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
    y({
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
      reason: "A soft noise bed with a faint low-end hum."
    })
  ]
}, ua = {
  category: "vibes",
  prefix: "vibe",
  adjectives: ["Neon", "Cozy", "Mellow", "Golden", "Hazy", "Crisp", "Cloudy", "Dusty", "Amber", "Breezy", "Sleepy", "Plush"],
  nouns: ["Cafe", "Rooftop", "Cassette", "Window", "Terrace", "Playlist", "Sunday", "Skyline", "Studio", "Porch", "Alley", "Lounge"],
  archs: [
    y({
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
    y({
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
    y({
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
    y({
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
    y({
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
    y({
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
      reason: "A light groove with soft percussion and a bright, steady feel."
    })
  ]
}, da = {
  category: "work-recovery",
  prefix: "recovery",
  adjectives: ["Unplugged", "Offline", "Cooled", "Rested", "Idle", "Paused", "Unwound", "Mellow", "Eased", "Reset", "Spare", "Soft"],
  nouns: ["Break", "Commit", "Cooldown", "Terminal", "Standup", "Branch", "Window", "Stretch", "Merge", "Buffer", "Release", "Cache"],
  archs: [
    y({
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
      reason: "Steps down from beta to alpha after a long review or generation run."
    }),
    y({
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
      reason: "A {minutes} minute reset between tasks."
    }),
    y({
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
    y({
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
    y({
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
    y({
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
}, se = (e) => Math.round(e * 1e3) / 1e3, oe = (e) => Math.min(40, Math.max(0.5, e)), kt = (e) => e.segs.reduce((t, n) => t + n[0], 0) * (e.scale ?? 1);
function Ve(e, t) {
  const n = e.carrier ?? 200;
  return e.carrierEnd === void 0 ? n : Math.round(n + (e.carrierEnd - n) * t / Math.max(kt(e), 1));
}
function ma(e) {
  const t = [], [n, a] = e.noise ?? ["off", 0];
  let s = 0;
  return e.segs.forEach((o, r) => {
    const l = o[1] !== o[2], c = e.segs[r + 1];
    t.push({
      atMin: se(s / 60),
      beatHz: se(oe(o[1])),
      carrierHz: Ve(e, s),
      gain: e.gain ?? 0.5,
      mode: e.mode ?? "binaural",
      noise: n,
      noiseLevel: a,
      ramp: l
    }), s += o[0] * (e.scale ?? 1), l && (c === void 0 || oe(c[1]) !== oe(o[2])) && t.push({ ...t[t.length - 1], atMin: se(s / 60), beatHz: se(oe(o[2])), carrierHz: Ve(e, s), ramp: !1 });
  }), t;
}
const ha = (e, t) => e.replaceAll("{minutes}", String(t)).replaceAll("{duration}", `${t} minutes`);
function fa(e) {
  const t = ma(e), n = Math.max(1, Math.round(kt(e) / 60));
  return {
    id: e.id,
    name: e.name,
    category: e.category,
    vibe: e.vibe,
    tags: [...e.tags, e.source],
    layerTags: ee(t),
    situations: e.situations,
    recommendedMinutes: n,
    intensity: e.intensity,
    adhdFriendly: me(t, e.intensity),
    stages: t,
    reasonTemplate: ha(e.reason, n),
    source: e.source
  };
}
const re = ["white", 0.3], ke = ["pink", 0.3], Se = ["brown", 0.3], Je = [
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
], pa = [
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
], ga = [
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
], ba = [
  [333, 8, 8],
  [333, 8, 10],
  [333, 10, 12],
  [333, 12, 12],
  [333, 12, 10],
  [333, 10, 8],
  [333, 8, 10]
], ya = [
  [120, 20, 40],
  ...Array.from({ length: 8 }, () => [[20, 40, 40], [10, 8, 8]]).flat(),
  [120, 40, 10]
], O = (e) => ({ ...e, source: "android", carrier: 200 }), va = [
  O({
    id: "android-self-hypnosis",
    name: "Mind Bridge",
    category: "meditation",
    vibe: "deep",
    situations: ["meditate", "heal-stress"],
    intensity: 2,
    segs: [[300, 12, 4], [600, 4, 4], [300, 4, 12]],
    noise: re,
    tags: ["theta", "hypnosis"],
    reason: "Five minutes down to 4 Hz, ten minutes holding there, five minutes back up."
  }),
  O({
    id: "android-highest-mental-activity",
    name: "Spark Burst",
    category: "focus",
    vibe: "energized",
    situations: ["deep-work"],
    intensity: 5,
    segs: [[120, 12, 40], [600, 40, 40], [120, 40, 12]],
    noise: re,
    tags: ["gamma", "boost"],
    reason: "Two minutes up to the 40 Hz ceiling, a ten minute hold, two minutes back to 12 Hz."
  }),
  O({
    id: "android-unity",
    name: "Unity Delta",
    category: "meditation",
    vibe: "ethereal",
    situations: ["meditate", "cant-sleep"],
    intensity: 1,
    segs: [[3600, 3.7, 3.7]],
    noise: Se,
    gain: 0.45,
    tags: ["delta", "long"],
    reason: "A flat 3.7 Hz hour under brown noise, wide and quiet."
  }),
  O({
    id: "android-morphine",
    name: "Morphine Ease",
    category: "healing",
    vibe: "warm",
    situations: ["heal-stress"],
    intensity: 2,
    segs: [[3600, 10, 10]],
    noise: ke,
    tags: ["alpha", "pain"],
    reason: "An hour at a steady 10 Hz under pink noise."
  }),
  O({
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
  O({
    id: "android-creativity",
    name: "Creative Waves",
    category: "vibes",
    vibe: "bright",
    situations: ["quick-reset", "deep-work"],
    intensity: 2,
    segs: ga,
    noise: ["white", 0.4],
    tags: ["alpha", "theta", "creative"],
    reason: "Drifts back and forth between 10 and 6 Hz."
  }),
  O({
    id: "android-wakeful-relax",
    name: "Quiet Alert",
    category: "meditation",
    vibe: "calm",
    situations: ["meditate", "quick-reset"],
    intensity: 1,
    segs: [[120, 12, 7.83], [780, 7.83, 7.83]],
    noise: ["white", 0.4],
    tags: ["alpha", "zen"],
    reason: "Parked at 7.83 Hz with white noise."
  }),
  O({
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
  O({
    id: "android-astral-relax",
    name: "Dream Gate Relax",
    category: "lucid-dreams",
    vibe: "ethereal",
    situations: ["lucid-dream", "meditate"],
    intensity: 2,
    segs: [[600, 15, 10], [4800, 10, 10]],
    noise: ["white", 0.4],
    tags: ["alpha", "astral"],
    reason: "A ten minute slide from 15 to 10 Hz, then a long steady, calm rest."
  }),
  O({
    id: "android-interval-pulse",
    name: "Interval Pulse",
    category: "focus",
    vibe: "energized",
    situations: ["deep-work"],
    intensity: 5,
    segs: ya,
    tags: ["beta", "gamma", "interval"],
    reason: "Eight short high and low rounds between a warm up and a cool down."
  }),
  O({
    id: "android-hallucination",
    name: "Hazy Visions",
    category: "vibes",
    vibe: "ethereal",
    situations: ["quick-reset"],
    intensity: 3,
    segs: [[600, 15, 10]],
    noise: ["white", 0.2],
    tags: ["alpha", "trippy"],
    reason: "A single {minutes} minute slide from 15 to 10 Hz, soft and dreamy."
  }),
  O({
    id: "android-sleep-induction",
    name: "Drift Down",
    category: "sleep",
    vibe: "calm",
    situations: ["cant-sleep"],
    intensity: 1,
    segs: [[360, 9.7, 3.4], [1620, 3.4, 2.4], [1620, 2.4, 3.4]],
    noise: Se,
    gain: 0.5,
    tags: ["delta", "induction"],
    reason: "A six minute fall to delta, then a long gentle rise and dip for the rest of the hour."
  }),
  O({
    id: "android-lucid-dreams",
    name: "Lucid Dream Cycle",
    category: "lucid-dreams",
    vibe: "dreamy",
    situations: ["lucid-dream"],
    intensity: 2,
    segs: Je,
    gain: 0.5,
    tags: ["theta", "lucid"],
    reason: "A theta bed with brief alpha lifts and a soft ending."
  }),
  O({
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
  O({
    id: "android-smr-sleep",
    name: "SMR Sleep Weave",
    category: "sleep",
    vibe: "minimal",
    situations: ["cant-sleep", "heal-stress"],
    intensity: 2,
    segs: ba,
    tags: ["alpha", "smr"],
    reason: "Beats crossing between a calm pace and the low SMR band."
  }),
  O({
    id: "android-lucid-dreams-2",
    name: "Long Lucid Night",
    category: "lucid-dreams",
    vibe: "deep",
    situations: ["lucid-dream", "cant-sleep"],
    intensity: 2,
    segs: [[600, 9.7, 3.4], [5400, 3.4, 2.4], ...pa],
    noise: ke,
    gain: 0.5,
    tags: ["delta", "theta", "lucid"],
    reason: "A delta fall followed by a long night plan with timed theta pulses."
  }),
  O({
    id: "android-adhd-cycle",
    name: "Focus Cycle",
    category: "adhd-control",
    vibe: "energized",
    situations: ["adhd-focus", "deep-work"],
    intensity: 3,
    segs: [[300, 40, 12], [300, 20, 20], [300, 12, 12], [300, 20, 20], [300, 12, 12], [300, 20, 20]],
    noise: re,
    tags: ["beta", "cycle"],
    reason: "Five minute blocks that swap between 12 and 20 Hz after a 40 Hz opener."
  }),
  // Shortened variants of existing Android programs.
  O({
    id: "android-self-hypnosis-short",
    name: "Quick Mind Bridge",
    category: "meditation",
    vibe: "calm",
    situations: ["meditate", "quick-reset"],
    intensity: 2,
    segs: [[300, 12, 4], [600, 4, 4], [300, 4, 12]],
    noise: re,
    scale: 0.5,
    tags: ["theta", "short"],
    reason: "The Mind Bridge shape made shorter."
  }),
  O({
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
    reason: "A {minutes} minute Quiet Alert between tasks."
  }),
  O({
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
    reason: "A {minutes} minute version of the Earth Hum shape."
  }),
  O({
    id: "android-lucid-dreams-short",
    name: "Lucid Nap Cycle",
    category: "lucid-dreams",
    vibe: "dreamy",
    situations: ["lucid-dream", "cant-sleep"],
    intensity: 2,
    segs: Je.slice(0, 12),
    gain: 0.5,
    tags: ["theta", "lucid", "short"],
    reason: "The opening stretch of the Lucid Dream Cycle, sized for naps."
  })
], be = (e) => ({ ...e, source: "gnaural" }), wa = [
  be({
    id: "gnaural-power-nap",
    name: "Midday Nap",
    category: "sleep",
    vibe: "warm",
    situations: ["quick-reset", "cant-sleep", "ai-burnout"],
    intensity: 1,
    segs: [[13, 11, 8.8], [17, 8.8, 7], [29, 7, 5.2], [38, 5.2, 4.4], [50, 4.4, 4.2], [68, 4.2, 4], [877, 4, 4], [37, 4, 4.2], [32, 4.2, 5.1], [20, 5.1, 6.8], [15, 6.8, 9.8], [4, 9.8, 9.8]],
    carrier: 164,
    carrierEnd: 110,
    noise: ke,
    gain: 0.5,
    tags: ["delta", "nap", "schedule"],
    reason: "A fast fall to 4 Hz, a long hold, then a slow climb."
  }),
  be({
    id: "gnaural-airplane-aid",
    name: "Long Haul Calm",
    category: "meditation",
    vibe: "calm",
    situations: ["meditate", "quick-reset", "heal-stress"],
    intensity: 1,
    segs: [[9, 0.5, 12], [45, 12, 8], [60, 8, 6], [120, 6, 5], [180, 5, 4.3], [180, 4.3, 4], [900, 4, 4], [900, 4, 4.2], [900, 4.2, 3.9], [900, 3.9, 3.9], [400, 3.9, 4.3]],
    carrier: 280,
    carrierEnd: 140,
    noise: Se,
    gain: 0.5,
    tags: ["theta", "travel", "schedule"],
    reason: "A falling carrier tone over theta beats, built for long seated trips."
  }),
  be({
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
    reason: "Five steps from alpha up to a 28.5 Hz middle, then back down."
  })
];
function ka() {
  return [...va, ...wa].map(fa);
}
const St = [
  { id: "lofi", name: "Lo-fi", blurb: "Warm, slow chords with a tape and vinyl feel, like a quiet study radio.", mood: "warm", defaultLevel: 0.5, layerKeys: ["lofiLevel", "lofiProgression", "tapeWow", "crackle"], templateId: "starter-lofi", evidence: "preference" },
  { id: "piano", name: "Soft piano", blurb: "A soft piano playing gentle, slow phrases with long ringing notes.", mood: "calm", defaultLevel: 0.45, layerKeys: ["instLevel", "instKind", "pianoPedal"], templateId: "starter-piano", evidence: "preference" },
  { id: "violet", name: "Violet hiss", blurb: "A thin, bright hiss, like gentle static. Keep it quiet.", mood: "bright", defaultLevel: 0.3, layerKeys: [], templateId: "starter-violet", evidence: "limited" },
  { id: "rain", name: "Rain hush", blurb: "A steady rain-like hush, even across the pitches (pink noise).", mood: "calm", defaultLevel: 0.4, layerKeys: [], templateId: "starter-rain", evidence: "mixed" },
  { id: "deep", name: "Deep rumble", blurb: "A deep, low rumble like distant thunder or a big waterfall (brown noise).", mood: "deep", defaultLevel: 0.4, layerKeys: [], templateId: "starter-deep", evidence: "preference" },
  { id: "chimes", name: "Soft chimes", blurb: "Soft bells that ring now and then at uneven gaps.", mood: "dreamy", defaultLevel: 0.3, layerKeys: ["chimeLevel", "chimeRatePerMin"], templateId: "starter-chimes", evidence: "preference" },
  { id: "beats", name: "Beats only", blurb: "A soft pulse you hear as two slightly different tones, one per ear. Use headphones.", mood: "neutral", defaultLevel: 0, layerKeys: [], templateId: "starter-beats", evidence: "mixed" }
], Sa = (e) => Number.isFinite(e) ? Math.min(1, Math.max(0, e)) : 0;
function Ma(e, t) {
  const n = Sa(t);
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
const Aa = { warm: "warm", calm: "calm", bright: "bright", deep: "deep", dreamy: "dreamy", neutral: "minimal" };
function Na(e) {
  const t = Ma(e.id, e.defaultLevel), n = Object.keys(t.layers).length > 0, s = [{
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
    vibe: Aa[e.mood] ?? "calm",
    tags: ["starter", "sound-first", e.id],
    layerTags: ee(s),
    situations: ["quick-reset", "heal-stress"],
    recommendedMinutes: 20,
    intensity: 1,
    adhdFriendly: me(s, 1),
    stages: s,
    reasonTemplate: e.blurb,
    source: "original"
  };
}
function Ea() {
  return St.map(Na);
}
function Ta() {
  return [
    ...Ea(),
    ...ka(),
    ...[ua, ra, ia, la, ca, sa, oa, da].flatMap(na)
  ];
}
let Xe;
function P() {
  return Xe ?? (Xe = Ta()), Xe;
}
new Proxy([], {
  get: (e, t) => Reflect.get(P(), t),
  has: (e, t) => Reflect.has(P(), t),
  ownKeys: () => Reflect.ownKeys(P()),
  getOwnPropertyDescriptor: (e, t) => {
    const n = Reflect.getOwnPropertyDescriptor(P(), t);
    return n === void 0 || t === "length" ? n : { ...n, configurable: !0 };
  }
});
function Me(e) {
  return e.stages.some((t) => {
    var n;
    return (((n = t.layers) == null ? void 0 : n.percLevel) ?? 0) > 0;
  });
}
function Ae(e) {
  return e.stages.some((t) => {
    var n;
    return (((n = t.layers) == null ? void 0 : n.crackle) ?? 0) > 0;
  });
}
function Ze(e) {
  return e.stages.some((t) => t.mode === "binaural");
}
const La = {
  focus: [1, 1, 0.5, 0.1],
  "adhd-control": [1, 1, 0.5, 0.1],
  vibes: [0.5, 0.8, 1, 0.5],
  "work-recovery": [0.5, 1, 1, 0.4],
  healing: [0.6, 0.7, 1, 0.8],
  meditation: [1, 0.6, 1, 0.6],
  sleep: [0, 0.2, 0.7, 1],
  "lucid-dreams": [0, 0.1, 0.6, 1]
}, Ca = { morning: 0, afternoon: 1, evening: 2, night: 3 }, Oa = (e) => Math.round(e * 10) / 10;
function Ra(e, t, n) {
  const a = Math.max(1, t);
  if (e <= a)
    return n.push(`Fits your ${a} minutes (${e} min).`), 15 * (0.6 + 0.4 * (e / a));
  const s = (e - a) / a;
  return n.push(`Runs ${e} min, longer than your ${a}; you can stop any time.`), Math.max(0, 15 * (1 - s * 1.5)) - (s > 0.5 ? 5 : 0);
}
function Da(e, t, n) {
  return t.deviceType === "speaker" ? Ze(e) ? (n.push("Warning: binaural beats need headphones. A speaker will not deliver the effect; pick an isochronic or monaural template if you can."), -8) : (n.push("Isochronic or monaural beats work over speakers."), 10) : (n.push(t.deviceType === "bluetooth" ? "Good over Bluetooth headphones." : "Headphones suit every beat type."), Ze(e) ? 10 : 8);
}
function za(e, t, n) {
  const a = e.intensity > 3 || Me(e) || Ae(e), s = t.sensorySensitivity;
  return s === "low" ? { pts: 10, sensitive: !1 } : s === "medium" ? { pts: e.intensity <= 3 ? a ? 7 : 10 : 4, sensitive: !1 } : a ? (n.push("Relaxed filter: this one is stronger or has percussion or crackle, shown because too few gentle matches exist."), { pts: 0, sensitive: !0 }) : (n.push("Gentle: low intensity, no percussion or crackle."), { pts: e.intensity <= 2 ? 10 : 7, sensitive: !1 });
}
function _a(e, t) {
  const n = [e.reasonTemplate.replace("{minutes}", String(e.recommendedMinutes))], a = e.situations.includes(t.situation);
  let s = 0;
  a ? (s += 40, n.push(`Made for: ${t.situation}.`)) : n.push(`Related option: not built for ${t.situation}, but close in mood.`), t.vibe === void 0 ? s += 7 : t.vibe === e.vibe && (s += 15, n.push(`Matches your ${t.vibe} vibe.`)), s += Ra(e.recommendedMinutes, t.availableMinutes, n);
  const o = (La[e.category][Ca[t.timeOfDay]] ?? 0) * 10;
  s += o, o >= 8 && n.push(`Suits the ${t.timeOfDay}.`), e.intensity >= 4 && t.timeOfDay === "night" && (s -= 5), s += Da(e, t, n);
  const r = za(e, t, n);
  return s += r.pts, { template: e, score: Math.max(0, Oa(s)), reasons: n, sensitive: r.sensitive, onSituation: a };
}
const Ia = (e, t) => t.score - e.score || (e.template.id < t.template.id ? -1 : e.template.id > t.template.id ? 1 : 0);
function Qe(e, t = 5, n = P()) {
  const a = Math.max(1, Math.floor(t)), s = n.map((c) => _a(c, e)).sort(Ia), o = [
    s.filter((c) => c.onSituation && !c.sensitive),
    s.filter((c) => !c.sensitive),
    s
  ], r = o.find((c) => c.length >= a) ?? s, l = r.slice(0, a);
  return r !== o[0] && l.forEach((c) => {
    c.onSituation || c.reasons.push("Filters relaxed: too few exact matches, so close alternatives are included.");
  }), l.map((c) => ({ template: c.template, score: c.score, reasons: c.reasons }));
}
function Mt(e) {
  const t = Math.max(0, Math.ceil(e)), n = Math.floor(t / 60), a = Math.floor(n / 60), s = (o) => String(o).padStart(2, "0");
  return a > 0 ? `${a}:${s(n % 60)}:${s(t % 60)}` : `${s(n)}:${s(t % 60)}`;
}
const et = {
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
function Oe({ name: e, size: t = 22 }) {
  return /* @__PURE__ */ i("svg", { className: "c-icon", width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", focusable: "false", children: /* @__PURE__ */ i("path", { d: et[e] ?? et.wave }) });
}
const Pa = D(() => import("./chunk-mascot-suXXzKOI.mjs").then((e) => ({ default: e.CalmMascot })));
function Re({ size: e, mood: t = "idle", reduced: n }) {
  return /* @__PURE__ */ i(U, { fallback: /* @__PURE__ */ i("span", { className: "c-mascot-gap", style: { width: e, height: e } }), children: /* @__PURE__ */ i(Pa, { mood: t, size: e, reducedMotion: n }) });
}
function Ba({ title: e, reduced: t }) {
  return /* @__PURE__ */ b("header", { className: "c-pagehead", children: [
    /* @__PURE__ */ i(Re, { size: 72, reduced: t }),
    /* @__PURE__ */ i("h1", { className: "c-h1", children: e })
  ] });
}
const Fa = [
  { view: "today", label: d.nav[0], icon: "today" },
  { view: "library", label: d.nav[1], icon: "library" },
  { view: "crew", label: d.nav[2], icon: "crew" },
  { view: "settings", label: d.nav[3], icon: "settings" }
];
function Ha({ view: e, onGo: t, reduced: n = !1 }) {
  const a = e === "journey" || e === "journeys" ? "today" : e === "nature" ? "library" : e === "reset" || e === "breathe" ? "today" : e;
  return /* @__PURE__ */ b("nav", { className: "c-tabbar", "aria-label": "Main", children: [
    /* @__PURE__ */ b("div", { className: "c-rail-brand", "aria-hidden": "true", children: [
      /* @__PURE__ */ i(Re, { size: 40, reduced: n }),
      /* @__PURE__ */ i("span", { className: "c-brand", children: d.brand })
    ] }),
    Fa.map((s) => /* @__PURE__ */ b("button", { type: "button", className: "c-nav", "aria-current": a === s.view ? "page" : void 0, onClick: () => t(s.view), children: [
      /* @__PURE__ */ i(Oe, { name: s.icon }),
      /* @__PURE__ */ i("span", { children: s.label })
    ] }, s.view))
  ] });
}
function xa(e, t = null) {
  var o;
  if (e.templateName !== null) return e.templateName;
  const n = e.source === "crew", a = n ? t ?? e.presetId : e.presetId, s = (o = pn.find((r) => r.id === a)) == null ? void 0 : o.name;
  return s === void 0 ? d.brand : n ? `Crew: ${s}` : s;
}
function ja({ snap: e, crewPresetId: t = null, onOpen: n, onStop: a }) {
  if (!e.playing) return null;
  const s = e.timer.kind !== "none" && e.timer.running ? Mt(e.timer.remainingSec) : "";
  return /* @__PURE__ */ b("div", { className: "c-mini", role: "group", "aria-label": "Now playing", children: [
    /* @__PURE__ */ b("button", { type: "button", className: "c-btn c-link c-mini-open", onClick: n, children: [
      xa(e, t),
      s !== "" && /* @__PURE__ */ i("span", { className: "c-digits", children: ` ${s}` })
    ] }),
    /* @__PURE__ */ i("button", { type: "button", className: "c-btn c-small", "data-testid": "mini-stop", onClick: a, children: d.stop })
  ] });
}
const $a = ["focus", "calm", "sleep", "study", "recover", "curious"], Wa = ["morning", "afternoon", "evening", "night", "anytime"], Ga = ["headphones", "speakers", "bluetooth", "unsure"], Ka = {
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
}, qa = Object.freeze({ kind: "rest", family: "", variants: Object.freeze([]) });
function Ua(e) {
  const t = Ka[e] ?? 0, n = [];
  for (let a = 1; a <= t; a += 1) n.push(`${e}-${String(a).padStart(2, "0")}`);
  return Object.freeze(n);
}
function Ya(e) {
  return Object.freeze({ kind: "session", family: e, variants: Ua(e) });
}
function W(...e) {
  return Object.freeze(e.map((t) => t === "rest" ? qa : Ya(t)));
}
const ye = (e, t) => Array.from({ length: t }, () => e), G = (e) => Object.freeze(e), At = Object.freeze([
  G({
    id: "calm-evenings",
    title: "7 Calm Evenings",
    blurb: "7 short evenings of slow sound. About 20 minutes each.",
    situation: "heal-stress",
    vibe: "calm",
    minutes: 20,
    days: W(
      "healing-soothe-glide",
      "meditation-breath-pacer",
      "vibe-warm-glow",
      "rest",
      "meditation-alpha-sit",
      "recovery-lofi-unwind",
      "healing-soothe-glide"
    )
  }),
  G({
    id: "focus-mornings",
    title: "5 Focus Mornings",
    blurb: "5 mornings of steady sound to start work. About 30 minutes each.",
    situation: "deep-work",
    vibe: "bright",
    minutes: 30,
    days: W("focus-alpha-beta", "focus-alpha-beta", "focus-sprint-pulse", "rest", "focus-deep-beta")
  }),
  G({
    id: "easier-sleep",
    title: "14 Nights of Wind-Down Sound",
    blurb: "14 nights of slow sound for winding down. Rest nights included.",
    situation: "cant-sleep",
    vibe: "dreamy",
    minutes: 45,
    days: W(
      ...ye("sleep-drift-theta", 4),
      "rest",
      ...ye("sleep-onset-delta", 4),
      "rest",
      ...ye("sleep-deep-delta", 3),
      "sleep-onset-delta"
    )
  }),
  G({
    id: "study-sprint",
    title: "Study Sprint Week",
    blurb: "A week of short study blocks with breaks. About 25 minutes each.",
    situation: "deep-work",
    vibe: "minimal",
    minutes: 25,
    days: W(
      "focus-sprint-pulse",
      "focus-alpha-beta",
      "recovery-micro-break",
      "focus-sprint-pulse",
      "rest",
      "focus-alpha-beta",
      "meditation-alpha-sit"
    )
  }),
  G({
    id: "after-work-reset",
    title: "After-Work Reset",
    blurb: "5 evenings to step out of work mode. About 20 minutes each.",
    situation: "ai-burnout",
    vibe: "warm",
    minutes: 20,
    days: W("recovery-post-sprint", "recovery-lofi-unwind", "recovery-micro-break", "rest", "recovery-lofi-unwind")
  }),
  G({
    id: "gentle-routine",
    title: "Gentle Routine",
    blurb: "Gentle routine for steady attention. About 25 minutes each.",
    situation: "adhd-focus",
    vibe: "grounded",
    minutes: 25,
    days: W(
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
function bi(e) {
  return At.find((t) => t.id === e);
}
const Va = {
  focus: { situation: "deep-work", vibe: "bright", minutes: 25 },
  calm: { situation: "heal-stress", vibe: "calm", minutes: 15 },
  sleep: { situation: "cant-sleep", vibe: "dreamy", minutes: 45 },
  study: { situation: "deep-work", vibe: "minimal", minutes: 30 },
  recover: { situation: "ai-burnout", vibe: "warm", minutes: 15 },
  curious: { situation: "quick-reset", minutes: 10 }
}, Ja = {
  headphones: "headphones",
  bluetooth: "bluetooth",
  speakers: "speaker",
  unsure: "headphones"
};
function Xa(e) {
  return e < 12 ? "morning" : e >= 12 && e < 17 ? "afternoon" : e >= 17 && e < 21 ? "evening" : "night";
}
function Za(e, t = /* @__PURE__ */ new Date()) {
  const n = Va[e.goal], a = e.timeOfDay === "anytime" ? Xa(t.getHours()) : e.timeOfDay, s = {
    situation: n.situation,
    availableMinutes: n.minutes,
    timeOfDay: a,
    sensorySensitivity: e.extraGentle ? "high" : "medium",
    deviceType: Ja[e.device]
  };
  return Object.freeze(n.vibe === void 0 ? s : { ...s, vibe: n.vibe });
}
const Qa = 3, es = 864e5, Nt = 4;
function Y(e) {
  if (!Number.isFinite(e)) return 0;
  const t = new Date(e).getTimezoneOffset() * 6e4;
  return Math.floor((e - t) / es);
}
const Et = (e) => Number.isInteger(e) && e >= 0 && e < 1e7;
function ts(e) {
  return Number.isFinite(e) ? Math.min(7, Math.max(1, Math.floor(e))) : Nt;
}
function ns(e) {
  return e - (e + 3) % 7;
}
function as(e, t, n) {
  const a = /* @__PURE__ */ new Map();
  for (const o of e) {
    if (!Et(o.day) || o.day < t || o.day > n) continue;
    const r = Number.isFinite(o.minutes) && o.minutes > 0 ? o.minutes : 0;
    a.set(o.day, (a.get(o.day) ?? 0) + r);
  }
  const s = /* @__PURE__ */ new Set();
  return a.forEach((o, r) => {
    o >= Qa && s.add(r);
  }), s;
}
function ss(e, t, n) {
  return n.has(e) ? "listened" : e === t ? "today" : e > t ? "upcoming" : "rest";
}
function os(e, t, n = Nt) {
  const a = ts(n);
  if (!Et(t)) {
    const l = Object.freeze(Array.from({ length: 7 }, () => "upcoming"));
    return Object.freeze({ daysListened: 0, goalDays: a, goalMet: !1, quietWeek: !0, dots: l });
  }
  const s = ns(t), o = as(e, s, t), r = Object.freeze(Array.from({ length: 7 }, (l, c) => ss(s + c, t, o)));
  return Object.freeze({
    daysListened: o.size,
    goalDays: a,
    goalMet: o.size >= a,
    quietWeek: o.size === 0,
    dots: r
  });
}
const he = "zonked.feel.v1", rs = ["calmer", "same", "not"], Tt = 64 * 1024, is = 1e7, ls = /^[a-z0-9-]{1,80}$/, tt = 4, nt = 12, cs = (e) => rs.some((t) => t === e);
function Lt(e) {
  if (typeof e != "object" || e === null || Array.isArray(e)) return;
  const { id: t, a: n, day: a } = e;
  if (!(typeof t != "string" || !ls.test(t) || !cs(n)) && !(typeof a != "number" || !Number.isInteger(a) || a < 0 || a > is))
    return { id: t, a: n, day: a };
}
function Ct(e) {
  if (!Array.isArray(e)) return [];
  const t = [];
  for (const n of e.slice(-500)) {
    const a = Lt(n);
    a !== void 0 && t.push(a);
  }
  return t;
}
function us(e) {
  try {
    const t = e.get(he);
    if (t === null || t.length > Tt) return [];
    const n = JSON.parse(t);
    if (typeof n != "object" || n === null) return [];
    const a = n;
    return a.v === 1 ? Ct(a.entries) : [];
  } catch {
    return [];
  }
}
function ds(e, t) {
  let n = Ct(t);
  try {
    let a = JSON.stringify({ v: 1, entries: n });
    for (; a.length > Tt && n.length > 0; )
      n = n.slice(Math.ceil(n.length / 10)), a = JSON.stringify({ v: 1, entries: n });
    return e.set(he, a), !0;
  } catch {
    return !1;
  }
}
function ms(e, t) {
  const n = Lt(t);
  return n === void 0 ? e : [...e, n].slice(-500);
}
function hs(e) {
  try {
    e.remove(he);
  } catch {
  }
}
function fs(e, t) {
  let n = 0;
  for (const a of e) a.id === t && (n += a.a === "calmer" ? tt : a.a === "not" ? -tt : 0);
  return Math.max(-nt, Math.min(nt, n));
}
const ps = (e) => e.reasons.some((t) => t.startsWith("Made for:")) && !e.reasons.some((t) => t.startsWith("Filters relaxed"));
function gs(e, t, n) {
  if (n.length === 0) return e;
  const a = Math.max(0, ...e.map((u) => u.template.intensity)), s = e.some((u) => Me(u.template)), o = e.some((u) => Ae(u.template)), r = new Set(e.map((u) => u.template.id)), c = t.filter(
    (u) => r.has(u.template.id) || ps(u) && u.template.intensity <= a && (s || !Me(u.template)) && (o || !Ae(u.template))
  ).map((u, f) => ({ r: u, i: f, s: u.score + fs(n, u.template.id) }));
  return c.sort((u, f) => f.s - u.s || u.i - f.i), c.slice(0, e.length).map((u) => u.r);
}
const De = "zonked.profile.v1", ze = "zonked.journeys.v1", _e = "zonked.last.v1", Ot = 32 * 1024, Rt = 1, bs = 1e7, ys = /^[a-z0-9-]{1,64}$/, Dt = Object.freeze({
  goal: "curious",
  timeOfDay: "anytime",
  device: "unsure",
  extraGentle: !1,
  createdAt: 0
}), vs = Object.freeze({}), Ie = (e) => typeof e == "object" && e !== null && !Array.isArray(e), Ne = (e, t) => typeof e == "number" && Number.isInteger(e) && e >= 0 && e <= t, ve = (e, t) => e.some((n) => n === t);
function zt(e, t) {
  try {
    const n = e.get(t);
    if (n === null || n.length > Ot) return;
    const a = JSON.parse(n);
    return Ie(a) && a.v === Rt ? a : void 0;
  } catch {
    return;
  }
}
function _t(e, t, n) {
  try {
    const a = JSON.stringify({ v: Rt, ...n });
    return a.length > Ot ? !1 : (e.set(t, a), !0);
  } catch {
    return !1;
  }
}
function It(e) {
  const { goal: t, timeOfDay: n, device: a, extraGentle: s, createdAt: o } = e;
  if (!(!ve($a, t) || !ve(Wa, n) || !ve(Ga, a)) && !(typeof s != "boolean" || !Ne(o, Number.MAX_SAFE_INTEGER)))
    return Object.freeze({ goal: t, timeOfDay: n, device: a, extraGentle: s, createdAt: o });
}
function ws(e) {
  const t = zt(e, De);
  return (t && It(t)) ?? Dt;
}
function ks(e, t) {
  const n = It({ ...t });
  return n !== void 0 && _t(e, De, { ...n });
}
function Pt(e, t) {
  const n = At.find((c) => c.id === e);
  if (n === void 0 || !Ie(t) || !Ne(t.startedAt, bs)) return;
  const { doneDays: a, pickedIds: s } = t;
  if (!Array.isArray(a) || !Array.isArray(s) || s.length > n.days.length) return;
  const o = a, r = s;
  if (!o.every((c) => Ne(c, n.days.length) && c >= 1) || !r.every((c) => typeof c == "string" && ys.test(c))) return;
  const l = [...new Set(o)].sort((c, u) => c - u);
  return Object.freeze({
    startedAt: t.startedAt,
    doneDays: Object.freeze(l),
    pickedIds: Object.freeze([...r])
  });
}
function Ss(e) {
  const t = zt(e, ze), n = t == null ? void 0 : t.journeys;
  if (!Ie(n)) return vs;
  const a = {};
  for (const [s, o] of Object.entries(n)) {
    const r = Pt(s, o);
    r !== void 0 && (a[s] = r);
  }
  return Object.freeze(a);
}
function Ms(e, t) {
  const n = {};
  for (const [a, s] of Object.entries(t)) {
    const o = Pt(a, s);
    o !== void 0 && (n[a] = o);
  }
  return _t(e, ze, { journeys: n });
}
function As(e) {
  for (const t of [De, ze, _e, he])
    try {
      e.remove(t);
    } catch {
    }
}
function at() {
  const e = /* @__PURE__ */ new Map();
  return {
    get: (t) => e.get(t) ?? null,
    set: (t, n) => void e.set(t, n),
    remove: (t) => void e.delete(t)
  };
}
function Ns(e) {
  try {
    const t = e ?? globalThis.localStorage;
    if (t === void 0) return at();
    const n = "zonked.probe";
    return t.setItem(n, "1"), t.removeItem(n), {
      get: (a) => t.getItem(a),
      set: (a, s) => t.setItem(a, s),
      remove: (a) => t.removeItem(a)
    };
  } catch {
    return at();
  }
}
const Bt = /^[a-z0-9-]{1,80}$/;
function Es(e) {
  try {
    const t = e.get(_e);
    return t !== null && Bt.test(t) ? t : null;
  } catch {
    return null;
  }
}
function Ts(e, t) {
  try {
    Bt.test(t) && e.set(_e, t);
  } catch {
  }
}
const Ls = 60, Cs = 400;
function Os(e, t, n = null) {
  const a = _(null), [s, o] = N(null);
  L(() => {
    if (e.playing) {
      o(null), a.current = e.templateId === null ? null : { id: (n == null ? void 0 : n.id) ?? e.templateId, name: (n == null ? void 0 : n.name) ?? e.templateName ?? d.brand, minutes: e.elapsedSec / 60 };
      return;
    }
    const l = a.current;
    if (a.current = null, !t || l === null || l.minutes * 60 < Ls) return;
    const c = window.setTimeout(() => o({ ...l, minutes: Math.round(l.minutes) }), Cs);
    return () => window.clearTimeout(c);
  }, [e.playing, e.templateId, e.templateName, e.elapsedSec, t, n == null ? void 0 : n.id, n == null ? void 0 : n.name]);
  const r = T(() => o(null), []);
  return F(() => ({ card: s, dismiss: r }), [s, r]);
}
const Rs = [
  ["calmer", d.feelCalmer],
  ["same", d.feelSame],
  ["not", d.feelNot]
];
function Ds({ onFeel: e }) {
  const [t, n] = N(!1);
  return t ? /* @__PURE__ */ i("p", { className: "c-muted", role: "status", "data-testid": "feel-saved", children: d.feelSaved }) : /* @__PURE__ */ b("div", { role: "group", "aria-labelledby": "c-feel-q", className: "c-feel", "data-testid": "feel-row", children: [
    /* @__PURE__ */ i("p", { id: "c-feel-q", className: "c-muted", children: d.feelQuestion }),
    /* @__PURE__ */ i("div", { className: "c-chips", children: Rs.map(([a, s]) => /* @__PURE__ */ i("button", { type: "button", className: "c-tchip", "data-testid": `feel-${a}`, onClick: () => {
      e(a), n(!0);
    }, children: s }, a)) })
  ] });
}
function zs({ info: e, onAgain: t, onClose: n, firstRun: a = !1, onFeel: s }) {
  const o = _(null);
  return L(() => {
    var r;
    return (r = o.current) == null ? void 0 : r.focus();
  }, []), /* @__PURE__ */ i("div", { className: "c-overlay", onKeyDown: (r) => r.key === "Escape" && n(), children: /* @__PURE__ */ b("div", { className: "c-dialog c-end", role: "dialog", "aria-modal": "true", "aria-labelledby": "c-end-title", "data-testid": "end-card", children: [
    /* @__PURE__ */ i("h2", { id: "c-end-title", className: "c-h1", children: d.endTitle }),
    /* @__PURE__ */ i("p", { children: d.endLine(e.name, e.minutes) }),
    /* @__PURE__ */ i("p", { className: "c-muted", children: d.endNote }),
    s !== void 0 && /* @__PURE__ */ i(Ds, { onFeel: s }),
    a && /* @__PURE__ */ i("p", { className: "c-note", "data-testid": "first-run-note", children: d.studioNote }),
    /* @__PURE__ */ b("div", { className: "c-actions", children: [
      /* @__PURE__ */ i("button", { ref: o, type: "button", className: "c-btn c-primary", "data-testid": "end-again", onClick: t, children: d.playAgain }),
      /* @__PURE__ */ i("button", { type: "button", className: "c-btn", "data-testid": "end-close", onClick: n, children: d.close })
    ] })
  ] }) });
}
const Ft = 20;
function _s(e) {
  if (e.kind === "sleep-fade") return 4;
  if (e.kind === "pomodoro") return 5;
  if (e.kind !== "countdown") return 3;
  const t = Math.round(e.totalSec / 60);
  return t === 15 ? 0 : t === 30 ? 1 : t === 60 ? 2 : -1;
}
function Is({ timer: e, player: t, onSprint: n, onSprintEnd: a }) {
  const s = (r) => {
    if (r === 5) return e.kind === "pomodoro" ? a == null ? void 0 : a() : n == null ? void 0 : n();
    a == null || a(), r <= 2 ? t.startTimer({ kind: "countdown", minutes: [15, 30, 60][r] ?? 15 }) : r === 3 ? t.stopTimer() : t.startTimer({ kind: "sleep-fade", minutes: Ft });
  }, o = _s(e);
  return /* @__PURE__ */ b("div", { children: [
    /* @__PURE__ */ i("div", { className: "c-chips", role: "group", "aria-label": "Timer", children: d.timerChips.map((r, l) => l === 5 && n === void 0 ? null : /* @__PURE__ */ i("button", { type: "button", "aria-pressed": o === l, className: "c-tchip", onClick: () => s(l), children: r }, r)) }),
    e.kind !== "none" && e.running && /* @__PURE__ */ b("p", { className: "c-time", "data-testid": "time-left", children: [
      e.kind === "pomodoro" ? `${e.phase === "break" ? d.sprintBreakLeft : d.sprintFocusLeft} ` : "",
      Mt(e.remainingSec)
    ] })
  ] });
}
function Ps({ onAccept: e, onCancel: t }) {
  const n = _(null), a = _(null);
  L(() => {
    var r;
    return (r = n.current) == null ? void 0 : r.focus();
  }, []);
  const o = /* @__PURE__ */ b("div", { className: "c-safety", onKeyDown: (r) => {
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
    /* @__PURE__ */ i("p", { className: "c-limits", "data-testid": "safety-limits", children: d.safetyLimits }),
    /* @__PURE__ */ b("div", { className: "c-actions c-row", children: [
      t !== void 0 && /* @__PURE__ */ i("button", { ref: a, type: "button", className: "c-btn", onClick: t, children: d.back }),
      /* @__PURE__ */ i("button", { ref: n, type: "button", className: "c-btn c-primary", "data-testid": "calm-safety-accept", onClick: e, children: d.safetyAccept })
    ] })
  ] });
  return t === void 0 ? o : /* @__PURE__ */ i("div", { className: "c-overlay", children: /* @__PURE__ */ i("div", { className: "c-dialog", role: "dialog", "aria-modal": "true", "aria-labelledby": "c-safety-title", children: o }) });
}
const Bs = 1, Fs = 720;
function Hs(e) {
  const t = (e.endedAt - e.startedAt) / 6e4;
  return Number.isFinite(t) && t >= Bs ? Math.min(Fs, t) : 0;
}
const xs = 200, Z = (e = Date.now) => Y(e());
function js(e, t) {
  const n = F(() => Ns(), []), [a, s] = N(() => ws(n)), [o, r] = N(() => Ss(n)), [l, c] = N([]), [u, f] = N(0);
  L(() => {
    let w = !0;
    return e.listLogs(xs).then((m) => w && c(m)).catch(() => {
    }), () => {
      w = !1;
    };
  }, [e, u, t]);
  const k = F(() => {
    const w = l.map((m) => ({ day: Y(m.startedAt), minutes: Hs(m) }));
    return os(w, Z());
  }, [l]), S = T(
    (w) => {
      s(w), ks(n, w);
    },
    [n]
  ), M = T(
    (w, m) => {
      r((h) => {
        const { [w]: p, ...g } = h, A = m === null ? g : { ...g, [w]: m };
        return Ms(n, A), A;
      });
    },
    [n]
  ), v = T(() => f((w) => w + 1), []);
  return { storage: n, profile: a, progress: o, week: k, logs: l, setProfile: S, setJourney: M, refresh: v };
}
const Ht = 15e3, xt = 6e4, ce = [
  { score: 22, level: "focus", beatHz: 40, carrierHz: 200, gain: 0.45, transitionSec: 5, why: "Simulated: a fresh start. The pretend load is low, so the sound stays steady." },
  { score: 48, level: "flow", beatHz: 18, carrierHz: 220, gain: 0.4, transitionSec: 8, why: "Simulated: the pretend load is building. The beat eases down to 18 Hz." },
  { score: 70, level: "recovery", beatHz: 10, carrierHz: 200, gain: 0.32, transitionSec: 8, why: "Simulated: the pretend load is high. The beat slows to 10 Hz and the sound softens." },
  { score: 88, level: "decompress", beatHz: 6, carrierHz: 180, gain: 0.25, transitionSec: 8, why: "Simulated: burned out. The beat settles to 6 Hz and the sound goes quiet." }
];
function $s(e, t) {
  const n = ce[Math.min(Math.max(0, Math.trunc(e)), ce.length - 1)];
  return n === void 0 ? null : {
    version: 1,
    at: t,
    burnout: { score: n.score, level: n.level },
    target: { presetId: "burnout-reset", beatHz: n.beatHz, carrierHz: n.carrierHz, gain: n.gain, transitionSec: n.transitionSec, breathe: n.score >= 60 },
    sbg: null,
    why: n.why
  };
}
function Ws(e, t) {
  return gn(JSON.parse(JSON.stringify($s(e, t))));
}
const jt = {
  now: () => Date.now(),
  setTimer: (e, t) => setTimeout(e, t),
  clearTimer: (e) => clearTimeout(e)
};
let ue = [], $t = jt;
function Wt() {
  for (const e of ue) $t.clearTimer(e);
  ue = [];
}
function st(e, t, n, a) {
  const s = a.now(), o = Ws(t, Math.trunc(s / 1e3));
  if (o === null) return;
  const r = t >= ce.length - 1;
  pt({ state: o, source: "demo", changedAtMs: s, snoozeUntilMs: 0, demoNextAtMs: n + (r ? xt : (t + 1) * Ht) }), e.applyCrew(o), e.followCrew();
}
function Gt(e) {
  Wt(), pt({ state: null, source: "none", changedAtMs: 0, snoozeUntilMs: 0, demoNextAtMs: null }), e.crewLost();
}
function Gs(e, t = jt) {
  Wt(), $t = t;
  const n = t.now();
  st(e, 0, n, t), e.snapshot().playing || e.play();
  for (let a = 1; a < ce.length; a += 1) ue.push(t.setTimer(() => st(e, a, n, t), a * Ht));
  ue.push(t.setTimer(() => Gt(e), xt));
}
const Ks = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], ot = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], qs = { listened: "listened", rest: "rest day", today: "today", upcoming: "coming up" };
function Us(e, t = !0, n = !1) {
  return e.quietWeek && n && !t ? d.joinedLine : e.quietWeek ? t ? d.welcomeBack : d.firstWeek : `${d.weekOf(e.daysListened)}. ${d.restCount}`;
}
function Ys({ week: e, hasHistory: t = !0, joinedToday: n = !1, compact: a = !1 }) {
  const s = n && !t && e.quietWeek;
  return /* @__PURE__ */ b("div", { className: a ? "c-week c-week-compact" : "c-week", children: [
    /* @__PURE__ */ i("ul", { className: "c-dots", "aria-label": "This week", children: e.dots.map((o, r) => {
      const l = s && o === "today";
      return /* @__PURE__ */ b("li", { className: `c-dot c-dot-${o}${l ? " c-dot-joined" : ""}`, "data-state": o, children: [
        /* @__PURE__ */ i("span", { className: "c-mark", "aria-hidden": "true", children: l || o === "listened" ? /* @__PURE__ */ i(Oe, { name: "check", size: 16 }) : "" }),
        /* @__PURE__ */ i("span", { className: "c-dayname", "aria-hidden": "true", children: Ks[r] }),
        /* @__PURE__ */ i("span", { className: "c-sr", children: `${ot[r]}, ${l ? d.joinedToday : qs[o]}` })
      ] }, ot[r]);
    }) }),
    /* @__PURE__ */ i("p", { className: "c-muted", "data-testid": a ? void 0 : "week-text", children: Us(e, t, s) })
  ] });
}
const Vs = () => /* @__PURE__ */ new Date(), Js = [], Xs = ["focus", "study"];
function Zs({ profile: e, week: t, reduced: n, crewConnected: a, hasHistory: s = !0, joinedToday: o = !1, now: r = Vs, last: l = null, feel: c = Js, onSprint: u, onPlay: f, onGo: k, onReset: S, onBreathe: M }) {
  const [v, w] = N(0), m = F(() => {
    const p = Za(e, r());
    return gs(Qe(p, 5), c.length === 0 ? [] : Qe(p, 12), c);
  }, [e, r, c]), h = m[v % Math.max(1, m.length)];
  return /* @__PURE__ */ b("div", { className: "c-today", children: [
    /* @__PURE__ */ b("header", { className: "c-pagehead", children: [
      /* @__PURE__ */ i(Re, { size: 72, reduced: n }),
      /* @__PURE__ */ i("h1", { className: "c-greet", "data-testid": "greeting", children: bn(r().getHours()) })
    ] }),
    l !== null && l.id !== (h == null ? void 0 : h.template.id) && /* @__PURE__ */ i("button", { type: "button", className: "c-btn c-wide c-again", "data-testid": "play-again", onClick: () => f(l), children: `${d.playAgain}: ${l.name}` }),
    h !== void 0 && /* @__PURE__ */ b("section", { className: "c-daily", "aria-labelledby": "c-daily-h", children: [
      /* @__PURE__ */ i("p", { className: "c-eyebrow", children: d.dailyEyebrow }),
      /* @__PURE__ */ i("h2", { id: "c-daily-h", children: h.template.name }),
      /* @__PURE__ */ i("p", { className: "c-muted", children: `${h.template.recommendedMinutes} min. ${We(h.reasons[0] ?? d.suggested)}` }),
      /* @__PURE__ */ b("div", { className: "c-actions", children: [
        /* @__PURE__ */ i("button", { type: "button", className: "c-btn c-primary", "data-testid": "today-play", onClick: () => f(h.template), children: d.start }),
        /* @__PURE__ */ i("button", { type: "button", className: "c-btn c-link", onClick: () => w((p) => p + 1), children: d.notThisOne })
      ] })
    ] }),
    u !== void 0 && h !== void 0 && Xs.includes(e.goal) && /* @__PURE__ */ b("button", { type: "button", className: "c-link-card c-sprint-entry", "data-testid": "today-sprint", onClick: () => u(h.template), children: [
      /* @__PURE__ */ i("b", { children: d.sprintTitle }),
      /* @__PURE__ */ i("small", { children: d.sprintLine })
    ] }),
    /* @__PURE__ */ b("button", { type: "button", className: "c-link-card c-reset-entry", "data-testid": "today-reset", onClick: S, children: [
      /* @__PURE__ */ i("b", { children: d.resetEntry }),
      /* @__PURE__ */ i("small", { children: d.resetEntryHint })
    ] }),
    M !== void 0 && e.goal === "calm" && /* @__PURE__ */ b("button", { type: "button", className: "c-link-card c-breathe-entry", "data-testid": "today-breathe", onClick: M, children: [
      /* @__PURE__ */ i("b", { children: d.breatheEntry }),
      /* @__PURE__ */ i("small", { children: d.breatheEntryHint })
    ] }),
    /* @__PURE__ */ b("section", { "aria-labelledby": "c-goal-h", children: [
      /* @__PURE__ */ i("h2", { id: "c-goal-h", className: "c-h3", children: `Your goal: ${yn[e.goal]}` }),
      /* @__PURE__ */ i(Ys, { week: t, hasHistory: s, joinedToday: o })
    ] }),
    /* @__PURE__ */ b("section", { "aria-labelledby": "c-for-h", children: [
      /* @__PURE__ */ i("h2", { id: "c-for-h", className: "c-h3", children: d.forYou }),
      /* @__PURE__ */ i("ul", { className: "c-rows", children: m.slice(0, 3).map((p) => /* @__PURE__ */ i("li", { children: /* @__PURE__ */ b("button", { type: "button", className: "c-mini-card", onClick: () => f(p.template), children: [
        /* @__PURE__ */ i("b", { children: p.template.name }),
        /* @__PURE__ */ i("small", { children: We(p.reasons[0] ?? d.suggested) }),
        /* @__PURE__ */ i("em", { children: `${p.template.recommendedMinutes} min` })
      ] }) }, p.template.id)) })
    ] }),
    /* @__PURE__ */ i("button", { type: "button", className: "c-link-card", onClick: () => k("library"), children: /* @__PURE__ */ i("b", { children: "Browse all sounds" }) }),
    /* @__PURE__ */ i("button", { type: "button", className: "c-link-card", onClick: () => k("journeys"), children: /* @__PURE__ */ i("b", { children: d.journeysTitle }) }),
    a && /* @__PURE__ */ i("p", { className: "c-crew-chip", role: "status", children: "Crew connected: easing the sound" })
  ] });
}
const Qs = "calm-breathe-5", Kt = 5, eo = 0.5, to = 20, we = {
  atMin: 0,
  beatHz: eo,
  carrierHz: to,
  gain: 0.32,
  mode: "binaural",
  noise: "pink",
  noiseLevel: 0.45,
  beatLevel: 0,
  ramp: !1
}, no = {
  id: Qs,
  name: "Breathe, 5 minutes",
  category: "meditation",
  vibe: "calm",
  tags: ["breathing", "no-beat"],
  layerTags: ee([we]),
  situations: ["meditate", "quick-reset"],
  recommendedMinutes: Kt,
  intensity: 1,
  adhdFriendly: me([we], 1),
  stages: [we],
  reasonTemplate: "Soft pink noise, paced 4 seconds in and 4 seconds out.",
  source: "original",
  breath: { inSec: 4, outSec: 4 }
}, ao = { label: "Breathe in", count: 4 };
function so(e) {
  const [t, n] = N(0);
  if (L(() => {
    if (n(0), !e) return;
    const s = window.setInterval(() => n((o) => o + 1), 1e3);
    return () => window.clearInterval(s);
  }, [e]), !e) return ao;
  const a = t % 8;
  return { label: a < 4 ? "Breathe in" : "Breathe out", count: 4 - a % 4 };
}
const oo = (e) => e.label === "Breathe in" ? d.counterIn(e.count) : d.counterOut(e.count);
function ro({ label: e, on: t, announce: n }) {
  return /* @__PURE__ */ i("p", { className: "c-sr", role: "status", "aria-live": "polite", "data-testid": "breath-live", children: t && n ? e : "" });
}
const io = 0.5, lo = 1.25, K = (e, t) => Number.isFinite(e) ? e : t, q = (e, t, n) => Math.max(t, Math.min(n, e)), rt = (e) => (1 - Math.cos(Math.PI * q(e, 0, 1))) / 2;
function co(e, t = 4, n = 4) {
  const a = q(K(t, 4), 0.5, 30), s = q(K(n, 4), 0.5, 30), o = a + s, l = (K(e, 0) % o + o) % o;
  if (l < a) return rt(l / a);
  const c = Math.min(io, s / 4), u = q((l - a) / (s - c), 0, 1);
  return 1 - rt(1 - Math.pow(1 - u, lo));
}
function uo(e, t = 4, n = 4) {
  const a = q(K(t, 4), 0.5, 30), s = a + q(K(n, 4), 0.5, 30);
  return (K(e, 0) % s + s) % s < a ? "Breathe in" : "Breathe out";
}
const it = { phase: 0, label: "Breathe in" }, mo = 4e-3;
function ho(e) {
  const [t, n] = N(it);
  return L(() => {
    if (!e || typeof requestAnimationFrame != "function") {
      n(it);
      return;
    }
    let a = 0;
    const s = performance.now(), o = (r) => {
      const l = (r - s) / 1e3, c = co(l), u = uo(l);
      n((f) => u === f.label && Math.abs(c - f.phase) < mo ? f : { phase: c, label: u }), a = requestAnimationFrame(o);
    };
    return a = requestAnimationFrame(o), () => {
      cancelAnimationFrame(a);
    };
  }, [e]), t;
}
function yi({ label: e, className: t, live: n = !0 }) {
  return /* @__PURE__ */ i("p", { className: t ?? "cm-cue", ...n ? { "aria-live": "polite", role: "status" } : {}, children: e });
}
const qt = 8 * 1024 * 1024, Ut = 600, fo = 20, po = 2, go = 0.45, bo = 1e-4;
function yo(e) {
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
function vo(e, t) {
  const n = e.length - t, a = e.slice(0, n);
  for (let s = 0; s < t; s++) {
    const o = (s + 0.5) / t * (Math.PI / 2);
    a[s] = (e[s] ?? 0) * Math.sin(o) + (e[n + s] ?? 0) * Math.cos(o);
  }
  return a;
}
function Yt(e, t) {
  if (!Number.isFinite(t) || t <= 0 || e.length === 0) return { ok: !1, error: "This file has no sound in it." };
  const n = yo(e), a = n.length / t;
  if (a > Ut) return { ok: !1, error: "This file is longer than 10 minutes." };
  let s = 0;
  for (const l of n) s = Math.max(s, Math.abs(l));
  if (s < bo) return { ok: !1, error: "This file is silent." };
  const o = go / s;
  for (let l = 0; l < n.length; l++) n[l] = (n[l] ?? 0) * o;
  if (a < fo) return { ok: !0, data: n, loop: !1 };
  const r = Math.min(Math.round(po * t), Math.floor(n.length / 4));
  return { ok: !0, data: vo(n, r), loop: !0 };
}
const ie = [
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
], wo = 8e3, X = "decode timeout", ko = {
  rain: "rainroof",
  lightrain: "rainroof",
  thunder: "rainroof",
  veranda: "rainroof",
  window: "rainroof",
  storm: "rainroof",
  fire: "rainroof",
  stream: "waterfall",
  ocean: "waterfall",
  rapids: "waterfall",
  waves: "waterfall",
  pebbles: "waterfall",
  creek: "waterfall",
  trickle: "waterfall",
  fountain: "waterfall",
  forest: "wind",
  birds: "wind",
  breeze: "wind",
  hum: "wind",
  chimes: "bowl",
  koshi: "bowl",
  gong: "bowl"
};
function So(e, t, n) {
  return new Promise((a, s) => {
    const o = setTimeout(() => s(new Error(X)), n);
    e.decodeAudioData(t).then(
      (r) => {
        clearTimeout(o), a(r);
      },
      (r) => {
        clearTimeout(o), s(r instanceof Error ? r : new Error(String(r)));
      }
    );
  });
}
const B = (e) => ({ ok: !1, error: e }), Mo = 20261128, Ao = /^[a-z]+$/;
function No(e) {
  const t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map();
  let a = null, s = 0, o = null, r = 0, l = 0;
  const c = () => a === null ? 0 : o ?? kn(s);
  function u(m) {
    m.duck.gain.setTargetAtTime(gt(c()), m.ctx.currentTime, wn);
  }
  function f(m) {
    if (!Ao.test(m) || !ie.some((h) => h.id === m)) return null;
    try {
      const h = new URL(`${e.baseUrl}samples/${m}.mp3.json`, e.origin);
      return h.origin === new URL(e.origin).origin ? h.href : null;
    } catch {
      return null;
    }
  }
  async function k(m, h) {
    if (t.has(h)) return { ok: !0 };
    const p = f(h);
    if (p === null) return B("unknown sample");
    try {
      const g = await e.fetchBytes(p), A = await So(m.ctx, g, e.decodeTimeoutMs ?? wo);
      return t.set(h, A), { ok: !0 };
    } catch (g) {
      return g instanceof Error && g.message === X ? B(X) : B("sample unavailable: check the connection or reinstall the app files");
    }
  }
  function S(m, h) {
    const p = n.get(h);
    if (p !== void 0) return p;
    const g = k(m, h).finally(() => {
      n.delete(h);
    });
    return n.set(h, g), g;
  }
  function M(m, h) {
    const p = h.ctx.currentTime, g = m.gain.gain;
    g.cancelScheduledValues(p), g.setValueAtTime(g.value, p), g.linearRampToValueAtTime(0, p + Ge);
    try {
      m.src.stop(p + Ge + 0.05);
    } catch {
    }
    m.src.onended = () => {
      m.src.disconnect(), m.gain.disconnect();
    };
  }
  function v(m, h, p, g, A) {
    a !== null && M(a, m), s = fe(g, s);
    const C = m.ctx.createBufferSource(), R = m.ctx.createGain();
    C.buffer = p, C.loop = A, R.gain.setValueAtTime(0, m.ctx.currentTime), R.gain.linearRampToValueAtTime(s, m.ctx.currentTime + Ke), C.connect(R), R.connect(m.input);
    const H = { id: h, src: C, gain: R };
    return A || (C.onended = () => {
      C.disconnect(), R.disconnect(), a === H && (a = null, u(m));
    }), C.start(), a = H, u(m), { ok: !0 };
  }
  async function w(m, h, p, g) {
    let A;
    try {
      A = (await import("./chunk-graph-BSt4xAW7.mjs")).buildSynth;
    } catch {
      return B("sample unavailable: reinstall the app files");
    }
    if (g !== r) return { ok: !0 };
    a !== null && M(a, m), s = fe(p, s);
    const C = A(m.ctx, h, Mo + l++), R = m.ctx.createGain();
    return R.gain.setValueAtTime(0, m.ctx.currentTime), R.gain.linearRampToValueAtTime(s, m.ctx.currentTime + Ke), C.connect(R), R.connect(m.input), a = { id: h, src: C, gain: R }, u(m), { ok: !0 };
  }
  return {
    list: () => ie,
    async start(m, h) {
      var H;
      const p = e.getBus();
      if (p === null) return B("start the sound first");
      const g = ++r;
      if (ie.some((x) => x.id === m && x.kind === "synth")) return w(p, m, h, g);
      const A = await S(p, m), C = ko[m];
      if (!A.ok && A.error === X && C !== void 0 && g === r) {
        const x = await w(p, C, h, g), V = (((H = ie.find((ae) => ae.id === C)) == null ? void 0 : H.label) ?? C).replace(" (synth)", "").toLowerCase();
        return x.ok ? { ok: !0, note: `The recording could not load in this browser, so a made-in-code sound (${V}) plays instead.` } : x;
      }
      if (!A.ok) return A.error === X ? B("sample unavailable: this browser could not decode it") : A;
      const R = t.get(m);
      return R === void 0 || g !== r ? R === void 0 ? B("sample unavailable") : { ok: !0 } : v(p, m, R, h, !0);
    },
    /** Plays a ready buffer (a person's own sound). Loops, or plays once when `loop` is false. */
    startBuffer(m, h, p, g) {
      const A = e.getBus();
      return A === null ? B("start the sound first") : (r++, v(A, m, h, p, g));
    },
    setLevel(m) {
      s = fe(m, s);
      const h = e.getBus();
      if (h === null || a === null) return;
      const p = a.gain.gain;
      p.cancelScheduledValues(h.ctx.currentTime), p.setTargetAtTime(s, h.ctx.currentTime, vn), u(h);
    },
    setBlend(m) {
      o = Sn(m, o ?? 0);
      const h = e.getBus();
      h !== null && u(h);
    },
    stop() {
      r++;
      const m = e.getBus(), h = a;
      a = null, !(m === null || h === null) && (M(h, m), u(m));
    },
    playing: () => (a == null ? void 0 : a.id) ?? null
  };
}
async function Eo(e) {
  const t = await fetch(e, { credentials: "same-origin" });
  if (!t.ok) throw new Error(`status ${t.status}`);
  return t.arrayBuffer();
}
const $ = No({
  getBus: bt,
  fetchBytes: Eo,
  baseUrl: "./",
  origin: typeof location > "u" ? "" : location.href
}), Vt = () => $.list(), To = (e, t) => $.start(e, t), Lo = (e) => $.setLevel(e), Co = () => $.stop(), Oo = (e) => $.setBlend(e), Ro = () => $.playing();
async function Do(e, t, n) {
  const a = bt();
  if (a === null) return { ok: !1, error: "start the sound first" };
  try {
    const s = await a.ctx.decodeAudioData(t.slice(0)), o = Array.from({ length: s.numberOfChannels }, (c, u) => s.getChannelData(u)), r = Yt(o, s.sampleRate);
    if (!r.ok) return r;
    const l = a.ctx.createBuffer(1, r.data.length, s.sampleRate);
    return l.getChannelData(0).set(r.data), $.startBuffer(e, l, n, r.loop);
  } catch {
    return { ok: !1, error: "This file could not be played." };
  }
}
const Jt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  MAX_SAMPLE_LEVEL: xn,
  duckGain: gt,
  listSamples: Vt,
  playingSample: Ro,
  setBlend: Oo,
  setSampleLevel: Lo,
  startOwn: Do,
  startSample: To,
  stopSample: Co
}, Symbol.toStringTag, { value: "Module" })), zo = ["Water", "Rain", "Wind and birds", "Fire and bells", "Made in code"], _o = /* @__PURE__ */ new Set(["rain", "lightrain", "thunder", "veranda", "window", "storm"]), Io = /* @__PURE__ */ new Set(["forest", "birds", "breeze", "hum"]), Po = /* @__PURE__ */ new Set(["fire", "chimes", "koshi", "gong"]);
function Bo(e) {
  return e.kind === "synth" ? "Made in code" : _o.has(e.id) ? "Rain" : Io.has(e.id) ? "Wind and birds" : Po.has(e.id) ? "Fire and bells" : "Water";
}
const Pe = "zonked.nature.v1", Xt = 0.3, Zt = 0.4, Qt = 0.85, lt = { id: null, blend: Xt, level: Zt }, ct = (e, t, n, a) => typeof e == "number" && Number.isFinite(e) ? Math.min(n, Math.max(t, e)) : a;
function Fo(e) {
  if (e === null || e.length > 400) return lt;
  try {
    const t = JSON.parse(e);
    return { id: typeof t.id == "string" && /^(own:)?[a-z0-9]{3,40}$/.test(t.id) ? t.id : null, blend: ct(t.blend, 0, 1, Xt), level: ct(t.level, 0, Qt, Zt) };
  } catch {
    return lt;
  }
}
const Be = () => {
  try {
    return typeof localStorage > "u" ? null : localStorage;
  } catch {
    return null;
  }
}, en = () => {
  var e;
  return Fo(((e = Be()) == null ? void 0 : e.getItem(Pe)) ?? null);
};
function ut(e) {
  var t;
  try {
    (t = Be()) == null || t.setItem(Pe, JSON.stringify(e));
  } catch {
  }
}
function Ho() {
  var e;
  try {
    (e = Be()) == null || e.removeItem(Pe);
  } catch {
  }
}
const xo = { wind: "breeze", waterfall: "rapids", flute: "wave" }, jo = D(() => import("./chunk-MySounds-HEuJLrdB.mjs").then((e) => ({ default: e.MySounds }))), $o = D(() => import("./chunk-Credits-D1b708mb.mjs").then((e) => ({ default: e.Credits })));
function Ee({ id: e, label: t, value: n, max: a, onChange: s }) {
  return /* @__PURE__ */ b("div", { className: "c-slider", children: [
    /* @__PURE__ */ i("label", { htmlFor: e, children: t }),
    /* @__PURE__ */ i("input", { id: e, type: "range", min: 0, max: a, step: 0.05, value: n, "aria-valuetext": `${Math.round(n / a * 100)} percent`, onChange: (o) => s(Number(o.currentTarget.value)) })
  ] });
}
function Fe({ nature: e }) {
  return /* @__PURE__ */ b("div", { className: "c-nature-controls", children: [
    /* @__PURE__ */ i(Ee, { id: "c-blend", label: d.natureBlend, value: e.prefs.blend, max: 1, onChange: e.setBlend }),
    /* @__PURE__ */ i(Ee, { id: "c-nlevel", label: d.natureLevel, value: e.prefs.level, max: Qt, onChange: e.setLevel })
  ] });
}
function Wo({ s: e, i: t, nature: n }) {
  return /* @__PURE__ */ i("li", { children: /* @__PURE__ */ b("button", { type: "button", className: `c-tile c-g${t % 6 + 1}`, "data-testid": `nature-${e.id}`, "aria-pressed": n.on === e.id, onClick: () => n.start(e.id), children: [
    /* @__PURE__ */ i(Oe, { name: xo[e.id] ?? e.id }),
    /* @__PURE__ */ i("span", { className: "c-tile-name", children: e.label }),
    /* @__PURE__ */ i("span", { className: "c-tile-mood", children: e.note ?? (e.kind === "synth" ? d.natureMade : d.natureFree) }),
    n.on === e.id && /* @__PURE__ */ i("span", { className: "c-tile-count", children: d.natureOn })
  ] }) });
}
function Go({ samples: e }) {
  const [t, n] = N(""), a = e.find((s) => s.id === t);
  return /* @__PURE__ */ b("section", { className: "c-credits-foot", "aria-label": d.natureCredits, children: [
    /* @__PURE__ */ i("label", { htmlFor: "c-credit-pick", children: d.natureCredits }),
    /* @__PURE__ */ b("select", { id: "c-credit-pick", value: t, onChange: (s) => n(s.currentTarget.value), children: [
      /* @__PURE__ */ i("option", { value: "", children: d.natureCreditsPick }),
      e.map((s) => /* @__PURE__ */ i("option", { value: s.id, children: s.label }, s.id))
    ] }),
    a !== void 0 && /* @__PURE__ */ i(U, { fallback: null, children: /* @__PURE__ */ i($o, { id: a.id, synth: a.kind === "synth" }) })
  ] });
}
function Ko({ nature: e, reduced: t, onBack: n }) {
  const a = Vt();
  return /* @__PURE__ */ b("div", { className: "c-nature", children: [
    /* @__PURE__ */ i(Ba, { title: d.natureHead, reduced: t }),
    /* @__PURE__ */ i("p", { className: "c-lead", children: d.natureIntro }),
    /* @__PURE__ */ b("div", { className: "c-sticky", "data-testid": "nature-sticky", children: [
      /* @__PURE__ */ i(Fe, { nature: e }),
      e.on !== null && /* @__PURE__ */ i("button", { type: "button", className: "c-btn c-wide", "data-testid": "nature-stop", onClick: e.stop, children: d.natureOff })
    ] }),
    zo.map((s) => {
      const o = a.filter((r) => Bo(r) === s);
      return o.length === 0 ? null : /* @__PURE__ */ b("section", { "aria-labelledby": `c-ng-${s.replaceAll(" ", "-")}`, children: [
        /* @__PURE__ */ i("h2", { className: "c-h3", id: `c-ng-${s.replaceAll(" ", "-")}`, children: s }),
        /* @__PURE__ */ i("ul", { className: "c-tiles c-nature-tiles", children: o.map((r) => /* @__PURE__ */ i(Wo, { s: r, i: a.indexOf(r), nature: e }, r.id)) })
      ] }, s);
    }),
    /* @__PURE__ */ i("p", { className: "c-status", role: "status", "data-testid": "nature-message", children: e.message }),
    /* @__PURE__ */ i("p", { className: "c-note", children: d.natureNote }),
    /* @__PURE__ */ i(Go, { samples: a }),
    /* @__PURE__ */ i(U, { fallback: null, children: /* @__PURE__ */ i(jo, { nature: e }) }),
    /* @__PURE__ */ i("button", { type: "button", className: "c-btn c-link c-back", onClick: n, children: d.natureBack })
  ] });
}
const qo = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  NatureControls: Fe,
  NatureScreen: Ko,
  Slider: Ee
}, Symbol.toStringTag, { value: "Module" })), Uo = ["cant-sleep", "lucid-dream"], Yo = ["adhd-focus", "deep-work", "ai-burnout"];
function tn(e, t) {
  if (t) return "nature";
  const n = e === null ? void 0 : P().find((s) => s.id === e), a = (n == null ? void 0 : n.situations) ?? [];
  return a.some((s) => Uo.includes(s)) ? "sleep" : a.some((s) => Yo.includes(s)) ? "focus" : "calm";
}
const Vo = 400;
function nn(e, t) {
  const [n, a] = N(0);
  return L(() => {
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
    }, Vo);
    return () => {
      s = !1, window.clearInterval(o);
    };
  }, [e, t]), n;
}
const Jo = D(() => import("./chunk-mascot-suXXzKOI.mjs").then((e) => ({ default: e.CalmMascot }))), Xo = D(() => import("./chunk-visuals-B0CqKfY2.mjs").then((e) => ({ default: e.SceneLoop }))), Zo = D(() => import("./chunk-mascot-suXXzKOI.mjs").then((e) => ({ default: e.BreathCue })));
function He({ still: e, playing: t, situation: n, theme: a, level: s, announce: o = !0 }) {
  const r = ho(t && !e), l = so(t && e), c = t && !e;
  return /* @__PURE__ */ b(Ce, { children: [
    /* @__PURE__ */ i("div", { className: "c-stage", "data-testid": "breath-ring", "data-still": e ? "true" : "false", "data-situation": n, children: /* @__PURE__ */ b(U, { fallback: null, children: [
      /* @__PURE__ */ i("div", { className: "c-stage-scene", children: /* @__PURE__ */ i(Xo, { situation: n, reducedMotion: e, theme: a }) }),
      /* @__PURE__ */ i("div", { className: "c-stage-mascot", children: /* @__PURE__ */ i(
        Jo,
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
    /* @__PURE__ */ b("div", { className: "c-cue", children: [
      c ? /* @__PURE__ */ i(U, { fallback: null, children: /* @__PURE__ */ i(Zo, { label: r.label, className: "c-cue-text", live: !1 }) }) : t ? /* @__PURE__ */ i("p", { className: "c-cue-text", "data-testid": "breath-counter", children: oo(l) }) : /* @__PURE__ */ i("p", { className: "c-cue-text", children: d.breathe }),
      /* @__PURE__ */ i(ro, { label: c ? r.label : l.label, on: t, announce: o })
    ] })
  ] });
}
function Qo({ engine: e, theme: t, announce: n = !0, sprint: a, player: s, snap: o, still: r, favorite: l, onToggle: c, onFavorite: u, nature: f }) {
  var p;
  const [k, S] = N(!1), M = nn(e, o.playing), v = St.find((g) => g.templateId === o.templateId), w = (v == null ? void 0 : v.evidence) ?? "mixed", m = tn(((p = a == null ? void 0 : a.focus) == null ? void 0 : p.id) ?? o.templateId, f.on !== null), h = P().find((g) => {
    var A;
    return g.id === (((A = a == null ? void 0 : a.focus) == null ? void 0 : A.id) ?? o.templateId);
  });
  return /* @__PURE__ */ b("div", { className: "c-player", children: [
    /* @__PURE__ */ i("h1", { className: "c-h1", children: o.templateName ?? d.brand }),
    /* @__PURE__ */ i(He, { still: r, playing: o.playing, situation: m, theme: t, level: M, announce: n }),
    /* @__PURE__ */ b("div", { className: "c-controls", children: [
      /* @__PURE__ */ i("button", { type: "button", className: "c-btn c-round c-big", "data-testid": "player-toggle", onClick: c, children: o.playing ? d.stop : d.play }),
      /* @__PURE__ */ i("button", { type: "button", className: "c-btn c-round", "aria-pressed": l, onClick: u, children: l ? d.saved : d.favorite })
    ] }),
    /* @__PURE__ */ i(
      Is,
      {
        timer: o.timer,
        player: s,
        ...a !== void 0 && h !== void 0 ? { onSprint: () => a.start(h), onSprintEnd: a.cancel } : {}
      }
    ),
    /* @__PURE__ */ i(er, { nature: f }),
    /* @__PURE__ */ i("p", { className: "c-muted", children: d.volumeCapped }),
    /* @__PURE__ */ b("section", { className: "c-why", children: [
      /* @__PURE__ */ i("button", { type: "button", className: "c-btn c-link", "aria-expanded": k, "aria-controls": "c-why-box", onClick: () => S((g) => !g), children: d.whyTitle }),
      /* @__PURE__ */ b("div", { id: "c-why-box", hidden: !k, children: [
        /* @__PURE__ */ i("p", { children: d.whyBody }),
        /* @__PURE__ */ i("p", { children: `Evidence: ${w}. ${Mn[w] ?? ""}` })
      ] })
    ] })
  ] });
}
function er({ nature: e }) {
  const t = e.prefs.id ?? en().id ?? "rain";
  return /* @__PURE__ */ b("section", { className: "c-card c-nature-quick", "aria-label": d.natureHead, children: [
    /* @__PURE__ */ i("button", { type: "button", className: "c-btn", "data-testid": "player-nature", "aria-pressed": e.on !== null, onClick: () => e.on === null ? e.start(t) : e.stop(), children: e.on === null ? `${d.natureAdd}: ${t.startsWith("own:") ? d.mineTitle : t}` : d.natureOff }),
    e.on !== null && /* @__PURE__ */ i(Fe, { nature: e }),
    /* @__PURE__ */ i("p", { className: "c-status", role: "status", children: e.message })
  ] });
}
const tr = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  PlayerScreen: Qo,
  Stage: He
}, Symbol.toStringTag, { value: "Module" })), nr = 90, ar = "android-wakeful-relax-5", an = {
  kind: "reset",
  seconds: nr,
  template: () => P().find((e) => e.id === ar),
  title: d.resetTitle,
  intro: d.resetIntro,
  done: d.resetDoneLine,
  again: d.resetAgain,
  left: d.resetLeft
}, sr = {
  kind: "breathe",
  seconds: Kt * 60,
  template: () => no,
  title: d.breatheTitle,
  intro: d.breatheIntro,
  done: d.breatheDoneLine,
  again: d.breatheAgain,
  left: d.breatheLeft
};
function or(e, t = an) {
  const [n, a] = N("idle"), [s, o] = N(t.seconds), r = _(0), { player: l, guarded: c, playTemplate: u } = e, f = T(() => {
    const w = t.template();
    w !== void 0 && c(() => {
      r.current = Date.now() + t.seconds * 1e3, o(t.seconds), a("running"), u(w, null);
    });
  }, [c, u, t]), k = T(() => {
    a("idle"), l.stop();
  }, [l]);
  L(() => {
    if (n !== "running") return;
    const w = window.setInterval(() => {
      const m = Math.ceil((r.current - Date.now()) / 1e3);
      if (m > 0) return o(m);
      window.clearInterval(w), o(0), a("done"), l.stop();
    }, 1e3);
    return () => window.clearInterval(w);
  }, [n, l]);
  const S = _(!1), M = e.snap.playing;
  L(() => {
    n !== "running" ? S.current = !1 : M ? S.current = !0 : S.current && a("idle");
  }, [n, M]);
  const v = _(n);
  return v.current = n, L(() => () => void (v.current === "running" && l.stop()), [l]), { phase: n, left: s, begin: f, stop: k };
}
function dt({ s: e, still: t, theme: n, announce: a, onBack: s, plan: o = an }) {
  const r = or(e, o), l = nn(e.engine, e.snap.playing), c = tn(e.snap.templateId, !1);
  return r.phase === "done" ? /* @__PURE__ */ i(rr, { plan: o, onAgain: r.begin, onBack: s }) : /* @__PURE__ */ b("div", { className: "c-player c-reset", "data-testid": "reset-screen", "data-kind": o.kind, "data-phase": r.phase, children: [
    /* @__PURE__ */ i("h1", { className: "c-h1", children: o.title }),
    r.phase === "idle" && /* @__PURE__ */ i("p", { className: "c-lead", children: o.intro }),
    /* @__PURE__ */ i(He, { still: t, playing: r.phase === "running" && e.snap.playing, situation: c, theme: n, level: l, announce: a }),
    r.phase === "running" ? /* @__PURE__ */ b(Ce, { children: [
      /* @__PURE__ */ i("p", { className: "c-muted c-digits", "data-testid": "reset-left", "aria-hidden": "true", children: o.left(r.left) }),
      /* @__PURE__ */ i("div", { className: "c-controls", children: /* @__PURE__ */ i("button", { type: "button", className: "c-btn c-round c-big", "data-testid": "reset-stop", onClick: r.stop, children: d.stop }) })
    ] }) : /* @__PURE__ */ b("div", { className: "c-actions", children: [
      /* @__PURE__ */ i("button", { type: "button", className: "c-btn c-primary", "data-testid": "reset-begin", onClick: r.begin, children: d.resetStart }),
      /* @__PURE__ */ i("button", { type: "button", className: "c-btn c-link", onClick: s, children: d.resetBack })
    ] }),
    /* @__PURE__ */ i("p", { className: "c-muted", children: d.volumeCapped })
  ] });
}
function rr({ plan: e, onAgain: t, onBack: n }) {
  const a = _(null);
  return L(() => {
    var s;
    return (s = a.current) == null ? void 0 : s.focus();
  }, []), /* @__PURE__ */ b("div", { className: "c-end c-reset", "data-testid": "reset-end", children: [
    /* @__PURE__ */ i("h1", { className: "c-h1", children: d.endTitle }),
    /* @__PURE__ */ i("p", { children: e.done }),
    /* @__PURE__ */ i("p", { className: "c-muted", children: d.endNote }),
    /* @__PURE__ */ b("div", { className: "c-actions", children: [
      /* @__PURE__ */ i("button", { ref: a, type: "button", className: "c-btn c-primary", "data-testid": "reset-back", onClick: n, children: d.resetBack }),
      /* @__PURE__ */ i("button", { type: "button", className: "c-btn", "data-testid": "reset-again", onClick: t, children: e.again })
    ] })
  ] });
}
const ir = D(() => import("./chunk-Journeys-BNvWU4Ow.mjs").then((e) => ({ default: e.JourneyList }))), lr = D(() => import("./chunk-Journeys-BNvWU4Ow.mjs").then((e) => ({ default: e.JourneyDetail }))), cr = D(() => import("./chunk-Library-SKl6bhXS.mjs").then((e) => ({ default: e.Library }))), ur = D(() => Promise.resolve().then(() => tr).then((e) => ({ default: e.PlayerScreen }))), dr = D(() => import("./chunk-CrewScreen-Ba4EAfv7.mjs").then((e) => ({ default: e.CrewScreen }))), mr = D(() => Promise.resolve().then(() => qo).then((e) => ({ default: e.NatureScreen }))), hr = D(() => import("./chunk-SettingsScreen-CSTE8EvG.mjs").then((e) => ({ default: e.SettingsScreen })));
function fr({ view: e, journeyId: t, s: n, data: a, crewInfo: s, nature: o, still: r, fav: l, last: c, look: u, prefs: f, onPrefs: k, feel: S, sprint: M, handlers: v }) {
  switch (e) {
    case "journeys":
      return /* @__PURE__ */ i(ir, { progress: a.progress, onOpen: v.openJourney, reduced: r });
    case "journey":
      return /* @__PURE__ */ i(
        lr,
        {
          id: t ?? "",
          profile: a.profile,
          progress: a.progress,
          todayDay: Z(),
          onBack: () => v.go("journeys"),
          onStartJourney: a.setJourney,
          onRestart: (w) => a.setJourney(w, null),
          onPlayDay: v.playDay
        }
      );
    case "library":
      return /* @__PURE__ */ i(cr, { store: n.store, logs: a.logs, reduced: r, onNature: () => v.go("nature"), onPlay: v.play, onPlayMix: v.onMix, onBreathe: () => v.go("breathe") });
    case "nature":
      return /* @__PURE__ */ i(mr, { nature: o, reduced: r, onBack: () => v.go("library") });
    case "player":
      return /* @__PURE__ */ i(ur, { player: n.player, snap: n.snap, still: r, favorite: l.on, onToggle: n.toggle, onFavorite: l.toggle, nature: o, engine: n.engine, theme: u.theme, announce: f.announce, sprint: M });
    case "reset":
      return /* @__PURE__ */ i(dt, { s: n, still: r, theme: u.theme, announce: f.announce, onBack: () => v.go("today") });
    case "breathe":
      return /* @__PURE__ */ i(dt, { s: n, still: r, theme: u.theme, announce: f.announce, onBack: () => v.go("today"), plan: sr });
    case "crew":
      return /* @__PURE__ */ i(
        dr,
        {
          crew: s,
          overridden: n.snap.overridden,
          onDemo: () => n.guarded(() => Gs(n.player)),
          onStopDemo: () => Gt(n.player),
          onNotNow: () => Nn(n.player),
          onResume: () => An(n.player),
          onFollow: () => n.player.followCrew()
        }
      );
    case "settings":
      return /* @__PURE__ */ i(
        hr,
        {
          gentle: a.profile.extraGentle,
          reduceMotion: n.userReduced,
          reduced: r,
          onGentle: (w) => a.setProfile({ ...a.profile, extraGentle: w }),
          onReduceMotion: n.setReduced,
          onStudio: v.onStudio,
          onForget: v.forget,
          prefs: f,
          onPrefs: k
        }
      );
    default:
      return /* @__PURE__ */ i(
        Zs,
        {
          profile: a.profile,
          week: a.week,
          progress: a.progress,
          reduced: r,
          hasHistory: a.logs.some((w) => Y(w.startedAt) < Z()),
          joinedToday: Y(a.profile.createdAt) === Z(),
          crewConnected: s.enabled && s.status === "connected",
          last: c,
          feel: S,
          onSprint: (w) => {
            M.start(w), v.go("player");
          },
          onPlay: v.play,
          onOpenJourney: v.openJourney,
          onGo: v.go,
          onReset: () => v.go("reset"),
          onBreathe: () => v.go("breathe")
        }
      );
  }
}
const pr = "zonked.look.v1", sn = "zonked.theme.v2", Q = { choice: "dark", dim: null, announce: !0 }, gr = ["system", "light", "dark", "contrast"], br = (e) => typeof e == "string" && gr.includes(e);
function on(e) {
  if (e === null) return null;
  try {
    const t = JSON.parse(e.slice(0, 400));
    return typeof t == "object" && t !== null ? t : null;
  } catch {
    return null;
  }
}
function yr(e) {
  const t = on(e);
  return t === null ? Q : {
    choice: br(t.choice) ? t.choice : Q.choice,
    dim: typeof t.dim == "boolean" ? t.dim : null,
    announce: t.announce !== !1
  };
}
function vr(e) {
  const t = on(e);
  if (t === null) return Q;
  const n = t.highContrast === !0 ? "contrast" : t.theme === "light" ? "light" : "dark";
  return { ...Q, choice: n };
}
const wr = (e) => e.getHours() >= 19 || e.getHours() < 7, kr = (e, t = /* @__PURE__ */ new Date()) => e.dim ?? wr(t), Sr = () => typeof window.matchMedia == "function" && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
function Mr(e, t) {
  return e.choice === "contrast" ? { theme: t, highContrast: !0 } : { theme: e.choice === "system" ? t : e.choice, highContrast: !1 };
}
function Ar() {
  try {
    const e = window.localStorage.getItem(sn);
    return e !== null ? yr(e) : vr(window.localStorage.getItem(pr));
  } catch {
    return Q;
  }
}
function Nr() {
  const [e, t] = N(Ar), [n, a] = N(Sr);
  L(() => {
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
      window.localStorage.setItem(sn, JSON.stringify(o));
    } catch {
    }
  }, []);
  return { look: Mr(e, n), prefs: e, dim: kr(e), setPrefs: s };
}
let de = null;
const mt = () => de, ht = (e) => void (de = e);
function Er() {
  de !== null && (de = null, Promise.resolve().then(() => Jt).then((e) => e.stopSample()).catch(() => {
  }));
}
const Tr = "zonked.mysounds.v1", Lr = 5, Cr = 20 * 1024 * 1024, z = "sounds", Or = 60, I = (e) => ({ ok: !1, error: e }), Rr = "Your device could not store this sound. Remove one and try again.", rn = (e) => /^own:[a-z0-9]{6,40}$/.test(e);
function Dr(e) {
  const t = e.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, Or);
  return t === "" ? "My sound" : t;
}
function zr(e) {
  return new Promise((t, n) => {
    const a = e.open(Tr, 1);
    a.onupgradeneeded = () => void a.result.createObjectStore(z, { keyPath: "id" }), a.onsuccess = () => t(a.result), a.onerror = () => n(a.error ?? new Error("open failed")), a.onblocked = () => n(new Error("blocked"));
  });
}
function xe(e) {
  return new Promise((t, n) => {
    e.onsuccess = () => t(e.result), e.onerror = () => n(e.error ?? new Error("request failed"));
  });
}
function je(e) {
  return new Promise((t, n) => {
    e.oncomplete = () => t(), e.onerror = () => n(e.error ?? new Error("write failed")), e.onabort = () => n(e.error ?? new Error("write aborted"));
  });
}
const te = () => typeof indexedDB > "u" ? null : indexedDB;
async function ne(e, t, n) {
  if (e === null) return I("This browser cannot keep sounds on your device.");
  let a = null;
  try {
    return a = await zr(e), { ok: !0, value: await t(a) };
  } catch (s) {
    if (s instanceof RangeError) return I(s.message === "count" ? "You can keep 5 sounds. Remove one first." : "Your sounds would use more than 20 MB. Remove one first.");
    const o = s instanceof DOMException && s.name === "QuotaExceededError";
    return I(o ? Rr : n);
  } finally {
    a == null || a.close();
  }
}
async function vi(e = te()) {
  return ne(e, async (t) => (await xe(t.transaction(z).objectStore(z).getAll())).map((a) => ({ id: a.id, name: a.name, size: a.size })), "Your sounds could not be read.");
}
async function _r(e, t = te()) {
  if (!rn(e)) return I("Unknown sound.");
  const n = await ne(t, async (a) => await xe(a.transaction(z).objectStore(z).get(e)), "Your sound could not be read.");
  return n.ok ? n.value === void 0 ? I("That sound is gone.") : { ok: !0, value: n.value.bytes } : n;
}
async function wi(e, t, n = te()) {
  if (t.byteLength > qt) return I("This file is bigger than 8 MB.");
  const s = { id: `own:${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`, name: Dr(e), size: t.byteLength, bytes: t };
  return ne(n, async (o) => {
    const r = await xe(o.transaction(z).objectStore(z).getAll());
    if (r.length >= Lr) throw new RangeError("count");
    if (r.reduce((c, u) => c + u.size, 0) + s.size > Cr) throw new RangeError("total");
    const l = o.transaction(z, "readwrite");
    return l.objectStore(z).put(s), await je(l), { id: s.id, name: s.name, size: s.size };
  }, "Your sound could not be saved.");
}
async function ki(e, t = te()) {
  return ne(t, async (n) => {
    const a = n.transaction(z, "readwrite");
    return a.objectStore(z).delete(e), await je(a), !0;
  }, "That sound could not be removed.");
}
async function Ir(e = te()) {
  return ne(e, async (t) => {
    const n = t.transaction(z, "readwrite");
    return n.objectStore(z).clear(), await je(n), !0;
  }, "Your sounds could not be removed.");
}
const Pr = async (e) => {
  const t = typeof OfflineAudioContext > "u" ? void 0 : OfflineAudioContext;
  if (t === void 0) throw new Error("no decoder");
  const n = await new t(1, 1, 44100).decodeAudioData(e.slice(0));
  return { channels: Array.from({ length: n.numberOfChannels }, (a, s) => n.getChannelData(s)), sampleRate: n.sampleRate };
};
async function Si(e, t = Pr) {
  var o;
  if (e.byteLength > qt) return I("This file is bigger than 8 MB.");
  if (e.byteLength === 0) return I("This file is empty.");
  let n;
  try {
    n = await t(e);
  } catch {
    return I("This file is not a sound this browser can read.");
  }
  if ((((o = n.channels[0]) == null ? void 0 : o.length) ?? 0) / n.sampleRate > Ut) return I("This file is longer than 10 minutes.");
  const s = Yt(n.channels, n.sampleRate);
  return s.ok ? { ok: !0, value: !0 } : I(s.error);
}
const le = () => Promise.resolve().then(() => Jt);
async function Br(e, t) {
  const n = await le();
  if (!rn(e)) return n.startSample(e, t);
  const a = await _r(e);
  return a.ok ? n.startOwn(e, a.value, t) : { ok: !1, error: a.error };
}
function Fr(e) {
  const [t, n] = N(en), [a, s] = N(mt), [o, r] = N(""), l = _(t);
  l.current = t;
  const { player: c, guarded: u } = e;
  L(() => {
    e.snap.playing || (Er(), s(null));
  }, [e.snap.playing]);
  const f = T(
    async (m) => {
      if (r(""), c.snapshot().playing || await c.play(), !c.snapshot().playing) return void r(d.errorAudio);
      (await le()).setBlend(l.current.blend);
      const p = await Br(m, l.current.level);
      if (!p.ok) return void r(p.error);
      p.note !== void 0 && r(p.note), ht(m), s(m);
      const g = { ...l.current, id: m };
      n(g), ut(g);
    },
    [c]
  ), k = T((m) => u(() => void f(m)), [u, f]), S = T(() => {
    ht(null), s(null), le().then((m) => m.stopSample());
  }, []), M = T((m, h) => {
    const p = { ...l.current, ...m };
    n(p), ut(p), mt() !== null && le().then(h);
  }, []), v = T((m) => M({ blend: m }, (h) => h.setBlend(m)), [M]), w = T((m) => M({ level: m }, (h) => h.setSampleLevel(m)), [M]);
  return { prefs: t, on: a, message: o, start: k, stop: S, setBlend: v, setLevel: w };
}
async function Hr() {
  Ho(), await Ir();
}
function xr() {
  const { player: e, store: t, engine: n } = yt(), [a, s] = N(() => e.snapshot()), [o, r] = N(En), [l, c] = N(!1), [u, f, k] = Tn(), S = _(null), M = _(o);
  L(() => (s(e.snapshot()), e.subscribe(s)), [e]);
  const v = T(
    (g) => {
      M.current ? g() : (S.current = g, c(!0));
    },
    []
  ), w = T(() => {
    Ln(Cn, !0), M.current = !0, r(!0), c(!1);
    const g = S.current;
    S.current = null, g == null || g();
  }, []), m = T(() => {
    S.current = null, c(!1);
  }, []), h = T(
    (g, A) => v(() => {
      e.setQueue([g]), e.playTemplate(g).then((C) => {
        C && A !== null && e.startTimer(typeof A == "number" ? { kind: "countdown", minutes: A } : A);
      });
    }),
    [e, v]
  ), p = T(() => {
    e.snapshot().playing ? e.stop() : v(() => void e.play());
  }, [e, v]);
  return { engine: n, player: e, store: t, snap: a, accepted: o, gate: l, reduced: u, setReduced: f, userReduced: k, guarded: v, accept: w, cancelGate: m, playTemplate: h, toggle: p };
}
function jr(e, t) {
  const [n, a] = N("standalone"), [s, o] = N(() => On());
  L(() => Rn(o), []), L(() => {
    let l = !1;
    const c = new Dn({
      ...t !== void 0 ? { create: t } : {},
      onStatus: (u) => {
        a(u), u === "standalone" && (pe().source !== "demo" && e.crewLost(), l && In(), l = !1);
      },
      onState: (u) => {
        l = !0, _n(e, u);
      }
    });
    return c.start(), () => c.stop();
  }, [e, t]);
  const r = fn(zn, pe, pe);
  return { enabled: s, status: n, view: r };
}
function $r(e, t = Date.now) {
  const [n, a] = N(() => us(e)), s = T(
    (r, l) => {
      a((c) => {
        const u = ms(c, { id: r, a: l, day: Y(t()) });
        return ds(e, u), u;
      });
    },
    [e, t]
  ), o = T(() => {
    hs(e), a([]);
  }, [e]);
  return F(() => ({ entries: n, answer: s, clear: o }), [n, s, o]);
}
const Wr = { kind: "pomodoro", focusMin: 25, breakMin: 5 }, Gr = ["starter-rain", "starter-deep"], Kr = 0.8, qr = 6e3, Ur = { chimeLevel: 0.25, chimeRatePerMin: 10 };
function Yr(e, t) {
  return t.kind !== "pomodoro" ? { phase: "end", action: "cancel" } : e === "focus" && t.phase === "break" ? { phase: "break", action: "break" } : e === "break" && t.phase === "focus" ? { phase: "end", action: "finish" } : { phase: e, action: null };
}
function Vr(e, t) {
  const n = Gr.find((a) => a !== e);
  return t.find((a) => a.id === n);
}
function Jr(e, t) {
  return !Number.isFinite(e) || !Number.isFinite(t) ? 0 : Math.round(Math.min(0, e * Kr - t) * 1e3) / 1e3;
}
async function Xr(e, t, n = (a, s) => window.setTimeout(a, s)) {
  const a = e.snapshot().voice.gain;
  e.setLayerOverride(Ur), n(() => e.clearLayerOverrides(), qr), await e.playTemplate(t) && e.nudgeGain(Jr(a, e.snapshot().voice.gain));
}
function Zr(e) {
  const [t, n] = N(null), a = _(!1), { player: s, guarded: o } = e, { playing: r, templateId: l, timer: c } = e.snap, u = T(() => {
    n(null), s.stopTimer();
  }, [s]), f = T(
    (k) => o(() => {
      a.current = !1;
      const S = () => {
        s.startTimer(Wr), n({ focus: k, breakId: null, phase: "focus" });
      };
      if (s.snapshot().playing && s.snapshot().templateId === k.id) return S();
      s.setQueue([k]), s.playTemplate(k).then((M) => M && S());
    }),
    [s, o]
  );
  return L(() => {
    if (t === null) return;
    if (r) a.current = !0;
    else if (a.current) return u();
    const k = Yr(t.phase, c);
    if (k.action === "cancel") return n(null);
    if (k.action === null) {
      r && l !== t.focus.id && l !== t.breakId && u();
      return;
    }
    if (k.action === "break") {
      const S = Vr(t.focus.id, P());
      n({ ...t, phase: "break", breakId: (S == null ? void 0 : S.id) ?? null }), S !== void 0 && Xr(s, S);
      return;
    }
    n(null), s.stopTimer(), s.stop();
  }, [t, r, l, c, s, u]), F(
    () => ({ active: t !== null, phase: (t == null ? void 0 : t.phase) ?? null, focus: (t == null ? void 0 : t.focus) ?? null, start: f, cancel: u }),
    [t, f, u]
  );
}
const Te = 500, Le = { v: 1, items: [] };
function Qr(e, t) {
  if (!qe(e) || J(e, "v") !== 1) return Le;
  const n = J(e, "items");
  if (!Array.isArray(n)) return Le;
  const a = [], s = /* @__PURE__ */ new Set();
  for (const o of n.slice(0, Te * 2)) {
    if (!qe(o)) continue;
    const r = J(o, "kind"), l = vt(J(o, "id"));
    if (r !== "template" && r !== "mix" || l === null) continue;
    const c = `${r}:${l}`;
    if (!s.has(c) && (s.add(c), a.push({ kind: r, id: l, at: Pn(J(o, "at"), 0, t + 864e5, t) }), a.length >= Te))
      break;
  }
  return { v: 1, items: a };
}
function ln(e, t, n) {
  return e.items.some((a) => a.kind === t && a.id === n);
}
function ei(e, t, n, a) {
  return ln(e, t, n) ? { v: 1, items: e.items.filter((s) => !(s.kind === t && s.id === n)) } : vt(n) === null || e.items.length >= Te ? e : { v: 1, items: [{ kind: t, id: n, at: a }, ...e.items] };
}
function ti(e, t) {
  const [n, a] = N(Le);
  L(() => {
    let o = !0;
    return e.getRecord("favorites").then((r) => o && a(Qr(r, Date.now()))).catch(() => {
    }), () => {
      o = !1;
    };
  }, [e]);
  const s = T(() => {
    if (t === null) return;
    const o = ei(n, "template", t, Date.now());
    a(o), e.setRecord("favorites", o).catch(() => {
    });
  }, [n, t, e]);
  return { on: t !== null && ln(n, "template", t), toggle: s };
}
const ni = D(() => import("./chunk-Onboarding-g0G-_gy-.mjs").then((e) => ({ default: e.Onboarding }))), ai = (e) => Math.max(180, e * 60 * 0.8);
function si({ engine: e, clock: t, store: n, bridgeCreate: a, onStudio: s }) {
  var $e;
  const o = xr(), r = js(o.store, o.snap.playing), l = jr(o.player, a), c = Fr(o), [u, f] = N("today"), [k, S] = N(null), M = _(null), v = ti(o.store, o.snap.templateId), w = $r(r.storage), m = Zr(o), h = r.profile.createdAt === 0, p = li(r.storage), g = Os(o.snap, !h && u !== "reset" && u !== "breathe", m.focus === null ? null : { id: m.focus.id, name: d.sprintName }), A = o.reduced || r.profile.extraGentle, { look: C, prefs: R, dim: H, setPrefs: x } = Nr();
  ci(s);
  const V = T((j) => f(j), []), { play: ae, playDay: un, finish: dn } = ri({ s: o, data: r, last: p, end: g, active: M, setView: f });
  mi(o.snap.playing, o.snap.elapsedSec, M, r.progress, r.setJourney);
  const mn = (j) => {
    S(j), f("journey");
  }, hn = () => {
    As(r.storage), w.clear(), c.stop(), Hr(), r.setProfile(Dt), f("today");
  };
  return /* @__PURE__ */ b("div", { className: "c-app", "data-theme": C.theme, "data-contrast": C.highContrast ? "high" : "normal", "data-view": u, "data-dim": H ? "true" : "false", "data-motion": A ? "off" : "on", "data-playing": o.snap.playing ? "true" : "false", children: [
    /* @__PURE__ */ i(di, {}),
    /* @__PURE__ */ i(ui, { engine: e }),
    l.view.source === "demo" && /* @__PURE__ */ i("p", { className: "c-badge-sim", role: "status", "data-testid": "demo-badge", children: d.crewDemoBadge }),
    /* @__PURE__ */ i("main", { id: "c-main", className: "c-main", tabIndex: -1, children: /* @__PURE__ */ i(U, { fallback: /* @__PURE__ */ i("p", { className: "c-loading", role: "status", children: d.loading }), children: h ? /* @__PURE__ */ i(
      ni,
      {
        playing: o.snap.playing,
        reduced: A,
        initial: r.profile,
        onAccept: o.accept,
        onPreview: (j) => o.playTemplate(j, null),
        onStop: () => void o.player.stop(),
        onFinish: dn
      }
    ) : /* @__PURE__ */ i(
      fr,
      {
        view: u,
        journeyId: k,
        s: o,
        data: r,
        crewInfo: l,
        nature: c,
        still: A,
        fav: v,
        last: p.template,
        look: C,
        prefs: R,
        onPrefs: x,
        feel: w.entries,
        sprint: m,
        handlers: { go: V, play: ae, playDay: un, openJourney: mn, forget: hn, onStudio: s, onMix: (j) => o.guarded(() => o.player.playMix(j)) }
      }
    ) }) }),
    !h && u !== "player" && u !== "reset" && u !== "breathe" && u !== "crew" && /* @__PURE__ */ i(ja, { snap: o.snap, crewPresetId: (($e = l.view.state) == null ? void 0 : $e.target.presetId) ?? null, onOpen: () => V("player"), onStop: () => void o.player.stop() }),
    !h && /* @__PURE__ */ i(Ha, { view: u, onGo: V, reduced: A }),
    /* @__PURE__ */ i("p", { className: "c-sr", role: "status", "data-testid": "play-status", children: o.snap.playing ? `Playing. ${d.volumeCapped}` : "Stopped." }),
    g.card !== null && !o.snap.playing && /* @__PURE__ */ i(oi, { card: g.card, play: ae, dismiss: g.dismiss, feel: w, firstRun: Y(r.profile.createdAt) === Z() }),
    o.gate && /* @__PURE__ */ i(Ps, { onAccept: o.accept, onCancel: o.cancelGate })
  ] });
}
function oi({ card: e, play: t, dismiss: n, feel: a, firstRun: s }) {
  return /* @__PURE__ */ i(zs, { info: e, onAgain: () => ii(e.id, t), onClose: n, firstRun: s, onFeel: (o) => a.answer(e.id, o) });
}
function ft(e, t) {
  return t === null ? null : e === "sleep" ? { kind: "sleep-fade", minutes: Math.max(Ft, t) } : { kind: "countdown", minutes: t };
}
function ri({ s: e, data: t, last: n, end: a, active: s, setView: o }) {
  const r = T(
    (u, f = u.recommendedMinutes, k = t.profile.goal) => {
      s.current = null, n.remember(u.id), a.dismiss(), e.playTemplate(u, ft(k, f)), o("player");
    },
    [e, n, a, s, o, t.profile.goal]
  );
  return { play: r, playDay: (u, f, k) => {
    r(k), s.current = { id: u, no: f, needSec: ai(k.recommendedMinutes) };
  }, finish: (u, f) => {
    if (t.setProfile(u), !e.snap.playing || e.snap.templateId !== f.id) return r(f, f.recommendedMinutes, u.goal);
    n.remember(f.id), e.player.startTimer(ft(u.goal, f.recommendedMinutes) ?? { kind: "countdown", minutes: f.recommendedMinutes }), o("player");
  } };
}
const cn = (e) => e === null ? null : P().find((t) => t.id === e) ?? null;
function ii(e, t) {
  const n = cn(e);
  n !== null && t(n);
}
function li(e) {
  const [t, n] = N(() => Es(e)), a = F(() => cn(t), [t]), s = T(
    (o) => {
      Ts(e, o), n(o);
    },
    [e]
  );
  return F(() => ({ template: a, remember: s }), [a, s]);
}
function ci(e) {
  L(() => {
    const t = (n) => {
      n.altKey && n.shiftKey && n.code === "KeyS" && (n.preventDefault(), e());
    };
    return window.addEventListener("keydown", t), () => window.removeEventListener("keydown", t);
  }, [e]);
}
function ui({ engine: e }) {
  const [t, n] = N(() => e.status.state === "error" ? e.status.error ?? "" : null);
  return L(() => e.onStatus((a) => n(a.state === "error" ? a.error ?? "" : null)), [e]), t === null ? null : /* @__PURE__ */ i("p", { className: "c-note", role: "status", "data-testid": "engine-notice", children: t === Bn ? d.unsupported : d.errorAudio });
}
function di() {
  return /* @__PURE__ */ b(Ce, { children: [
    /* @__PURE__ */ i("a", { className: "c-skip", href: "#c-main", children: "Skip to content" }),
    /* @__PURE__ */ i("header", { className: "c-topbar", children: /* @__PURE__ */ i("span", { className: "c-brand", children: d.brand }) })
  ] });
}
function mi(e, t, n, a, s) {
  L(() => {
    const o = n.current, r = o === null ? void 0 : a[o.id];
    !e || o === null || r === void 0 || t < o.needSec || (n.current = null, r.doneDays.includes(o.no) || s(o.id, { ...r, doneDays: [...r.doneDays, o.no].sort((l, c) => l - c) }));
  }, [e, t, n, a, s]);
}
const hi = {
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
function Mi() {
  Fn(import.meta.url), Hn();
  const { engine: e, store: t } = yt();
  L(() => (Ue(!0), () => Ue(!1)), []);
  const [n, a] = N(!1);
  return /* @__PURE__ */ b("div", { "data-testid": "zonked-app", style: { height: "100%", minHeight: 0, overflow: "hidden", position: "relative", transform: "translateZ(0)" }, children: [
    /* @__PURE__ */ i("div", { style: { height: "100%", overflowY: "auto" }, children: /* @__PURE__ */ i(si, { engine: e, store: t, onStudio: () => a(!0) }) }),
    n && /* @__PURE__ */ i("p", { role: "status", style: hi, "data-testid": "studio-note", onClick: () => a(!1), children: "Studio, the advanced mode, is not in the Kiro Crew app yet. Tap to close." })
  ] });
}
export {
  yi as B,
  Dt as D,
  $a as G,
  Oe as I,
  At as J,
  qt as M,
  Le as N,
  Ba as P,
  Ps as S,
  Wa as T,
  Mi as Z,
  Ga as a,
  P as b,
  Qr as c,
  St as d,
  kr as e,
  co as f,
  bi as g,
  uo as h,
  wi as i,
  ki as j,
  Ir as k,
  vi as l,
  Za as p,
  Qe as r,
  ho as u,
  Si as v
};
