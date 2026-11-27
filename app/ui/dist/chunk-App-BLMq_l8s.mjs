import { jsx as i, jsxs as y, Fragment as Ee } from "react/jsx-runtime";
import { lazy as z, Suspense as q, useRef as _, useState as A, useEffect as C, useCallback as T, useMemo as B, useSyncExternalStore as dn } from "react";
import { C as d, P as mn, s as mt, p as hn, g as pn, G as fn, L as gn, F as je, d as ht, D as yn, c as ue, a as $e, b as bn, e as vn, f as pt, E as wn, r as kn, h as Sn, i as ft, j as Mn, u as An, w as Nn, S as En, k as Tn, o as Ln, B as Cn, l as On, m as de, n as Rn, q as zn, t as Ge, v as Y, x as gt, y as Dn, z as _n, A as In, H as We, M as Pn } from "./chunk-crewLink-CU32qOP4.mjs";
function g(e) {
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
const E = (e, t) => e[(t % e.length + e.length) % e.length], Bn = [98, 110, 123.5, 87.3, 103.8, 130.8], Hn = [196, 220, 247, 175, 165, 262], Fn = {
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
}, xn = (e) => [...e].reduce((t, n) => (t * 31 + n.charCodeAt(0)) % 9973, 7);
function jn(e, t, n) {
  const a = xn(e) + n;
  return { prog: E(Fn[t], a), key: E(Bn, a), pianoRoot: E(Hn, a >> 1) };
}
function $n(e, t, n) {
  const a = e === "dreamy" || e === "ethereal" || e === "calm";
  return {
    breathDepth: E([0.45, 0.4, 0.3, 0.2, 0.1], t - 1),
    breathRateHz: 0.06 + 0.02 * (n % 5),
    stereoWidth: 0.3 + 0.1 * (n % 4),
    panDepth: a ? 0.15 : 0,
    panRateHz: 0.03 + 0.01 * (n % 4)
  };
}
const Gn = {
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
function Wn(e, t, n = { prog: 0, key: 110, pianoRoot: 220 }) {
  return e.reduce((a, o) => ({ ...a, ...Gn[o](t, n) }), {});
}
const qe = (e) => Math.round(e * 1e3) / 1e3, me = (e) => Math.min(40, Math.max(0.5, e));
function qn(e, t, n, a, o) {
  const s = Math.min(5, Math.max(1, t * 0.15));
  if (e === "plateau") {
    const l = [{ t: 0, beat: n, ramp: !0 }, { t: s, beat: a, ramp: o !== void 0 }];
    return o !== void 0 && l.push({ t: t - s, beat: a, ramp: !0 }, { t, beat: o, ramp: !1 }), l;
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
function Kn(e, t, n, a, o) {
  const s = (t % 3 - 1) * e.jitter, r = me(e.to + s), l = E(e.noises, t >> 1), c = E(e.layers, t * 2 + (t >> 1)), u = E(e.vibes, t), p = Wn(c, t, jn(e.slug, u, t)), k = Object.keys(p).length > 0, S = k ? { ...p, ...$n(u, e.intensity, t) } : p;
  return qn(e.shape, n, me(e.from), r, e.ret).map((M) => ({
    atMin: qe(M.t),
    beatHz: qe(me(M.beat)),
    carrierHz: a,
    gain: e.gain,
    mode: o,
    noise: l[0],
    noiseLevel: l[1],
    ...k ? { layers: S } : {},
    ramp: M.ramp
  }));
}
function J(e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e) {
    t.add(n.mode);
    const a = n.layers;
    n.noise !== "off" && n.noiseLevel > 0 && t.add("noise"), a !== void 0 && (((a.lofiLevel ?? 0) > 0 || (a.crackle ?? 0) > 0) && t.add("lofi"), (a.instLevel ?? 0) > 0 && t.add("instrument"), (a.padLevel ?? 0) > 0 && t.add("pad"), (a.chimeLevel ?? 0) > 0 && t.add("chimes"), (a.percLevel ?? 0) > 0 && t.add("percussion"));
  }
  return [...t];
}
function ie(e, t) {
  if (t > 3) return !1;
  const n = e.every((s, r) => {
    var l;
    return r === 0 || Math.abs(s.beatHz - (((l = e[r - 1]) == null ? void 0 : l.beatHz) ?? s.beatHz)) <= 4;
  }), a = e.every((s) => s.mode === "isochronic" || s.beatHz >= 12 && s.beatHz <= 20), o = e.every((s) => {
    var r, l;
    return (((r = s.layers) == null ? void 0 : r.crackle) ?? 0) === 0 && (((l = s.layers) == null ? void 0 : l.percBpm) ?? 0) <= 100;
  });
  return n && a && o;
}
function Yn(e, t) {
  const n = e.adjectives.length, a = t * 7 % (n * e.nouns.length);
  return `${E(e.adjectives, a)} ${E(e.nouns, Math.floor(a / n))}`;
}
const Un = (e) => String(e).padStart(2, "0"), Vn = { binaural: "Binaural", monaural: "Monaural", isochronic: "Isochronic" }, Jn = ["lofi", "instrument", "pad", "chimes", "percussion"];
function Xn(e, t, n, a, o) {
  const s = o[0], r = [`${Vn[e]}, ${t} Hz carrier, ${n} minutes, ${a} mood`];
  s !== void 0 && s.noise !== "off" && s.noiseLevel > 0 && r.push(`${s.noise} noise`);
  const l = o[o.length - 1];
  s !== void 0 && l !== void 0 && s.beatHz !== l.beatHz && r.push(`beat ${s.beatHz} to ${l.beatHz} Hz`);
  const c = J(o).filter((u) => Jn.includes(u));
  return c.length > 0 && r.push(c.join(" and ")), `${r.join(", ")}.`;
}
function Zn(e, t, n, a) {
  const o = E(t.mins, n), s = E(t.carriers, n * 3 + 1), r = E(t.modes, n + (n >> 2)), l = Kn(t, n, o, s, r), c = t.to < 4 ? "delta" : t.to < 8 ? "theta" : t.to < 12 ? "alpha" : t.to < 30 ? "beta" : "gamma";
  return {
    id: `${e.prefix}-${t.slug}-${Un(n + 1)}`,
    name: Yn(e, a),
    category: e.category,
    vibe: E(t.vibes, n),
    tags: [t.slug, c, r, ...t.tags],
    layerTags: J(l),
    situations: t.situations,
    recommendedMinutes: o,
    intensity: t.intensity,
    adhdFriendly: ie(l, t.intensity),
    stages: l,
    reasonTemplate: `${t.reason} ${Xn(r, s, o, E(t.vibes, n), l)}`,
    source: "original",
    ...t.breath !== void 0 ? { breath: t.breath } : {}
  };
}
function Qn(e) {
  let t = 0;
  const n = e.archs.flatMap((a) => Array.from({ length: a.count }, (o, s) => Zn(e, a, s, t++)));
  return ea(n);
}
function ea(e) {
  const t = /* @__PURE__ */ new Map();
  return e.map((n) => {
    const a = n.reasonTemplate.replaceAll("{minutes}", String(n.recommendedMinutes)), o = (t.get(a) ?? 0) + 1;
    return t.set(a, o), o === 1 ? n : { ...n, reasonTemplate: `${n.reasonTemplate} Alternate take ${o}.` };
  });
}
const ta = {
  category: "adhd-control",
  prefix: "adhd",
  adjectives: ["Steady", "Anchored", "Level", "Even", "Tidy", "Calm", "Focused", "Plain", "Settled", "Patient", "Smooth", "Constant"],
  nouns: ["Anchor", "Rail", "Tracks", "Rhythm", "Metronome", "Lane", "Thread", "Pulse", "Desk", "Checklist", "Runway", "Keel"],
  archs: [
    g({
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
    g({
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
    g({
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
    g({
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
    g({
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
    g({
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
}, na = {
  category: "focus",
  prefix: "focus",
  adjectives: ["Sharp", "Deep", "Clear", "Lucid", "Bright", "Keen", "Locked", "Precise", "Crisp", "Direct", "Tuned", "Honed"],
  nouns: ["Beam", "Signal", "Compass", "Engine", "Vector", "Prism", "Forge", "Spire", "Circuit", "Current", "Summit", "Scope"],
  archs: [
    g({
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
    g({
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
    g({
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
    g({
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
    g({
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
    g({
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
}, aa = {
  category: "healing",
  prefix: "healing",
  adjectives: ["Mending", "Tender", "Restoring", "Kind", "Balmy", "Soothing", "Renewing", "Warming", "Settled", "Easing", "Gentle", "Whole"],
  nouns: ["Balm", "Spring", "Embrace", "Garden", "Shelter", "Glow", "Rain", "Hearth", "Sunrise", "Quilt", "Oasis", "Haven"],
  archs: [
    g({
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
      reason: "Slides from beta down to alpha over {minutes} minutes."
    }),
    g({
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
    g({
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
    g({
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
    g({
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
    g({
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
}, sa = {
  category: "lucid-dreams",
  prefix: "lucid",
  adjectives: ["Waking", "Silver", "Nebula", "Astral", "Twilight", "Aware", "Hollow", "Starlit", "Liminal", "Vivid", "Opal", "Drifting"],
  nouns: ["Gate", "Compass", "Mirror", "Skyway", "Threshold", "Door", "Voyage", "Lens", "Bridge", "Beacon", "Garden", "Orbit"],
  archs: [
    g({
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
    g({
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
    g({
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
    g({
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
    g({
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
}, oa = {
  category: "meditation",
  prefix: "meditation",
  adjectives: ["Open", "Rooted", "Sacred", "Luminous", "Patient", "Clear", "Boundless", "Inner", "Mindful", "Sunlit", "Hallowed", "Silent"],
  nouns: ["Cushion", "Temple", "Breath", "Mountain", "Lotus", "Stillpoint", "Horizon", "Sanctuary", "River", "Candle", "Grove", "Bowl"],
  archs: [
    g({
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
    g({
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
    g({
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
    g({
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
    g({
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
    g({
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
}, ra = {
  category: "sleep",
  prefix: "sleep",
  adjectives: ["Quiet", "Slow", "Velvet", "Hushed", "Moonlit", "Soft", "Drowsy", "Still", "Dim", "Gentle", "Fading", "Lulled"],
  nouns: ["Harbor", "Tide", "Pillow", "Lantern", "Blanket", "Meadow", "Lullaby", "Cabin", "Drift", "Hearth", "Cove", "Evening"],
  archs: [
    g({
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
    g({
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
    g({
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
    g({
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
    g({
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
    g({
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
}, ia = {
  category: "vibes",
  prefix: "vibe",
  adjectives: ["Neon", "Cozy", "Mellow", "Golden", "Hazy", "Crisp", "Cloudy", "Dusty", "Amber", "Breezy", "Sleepy", "Plush"],
  nouns: ["Cafe", "Rooftop", "Cassette", "Window", "Terrace", "Playlist", "Sunday", "Skyline", "Studio", "Porch", "Alley", "Lounge"],
  archs: [
    g({
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
    g({
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
    g({
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
    g({
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
    g({
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
    g({
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
}, la = {
  category: "work-recovery",
  prefix: "recovery",
  adjectives: ["Unplugged", "Offline", "Cooled", "Rested", "Idle", "Paused", "Unwound", "Mellow", "Eased", "Reset", "Spare", "Soft"],
  nouns: ["Break", "Commit", "Cooldown", "Terminal", "Standup", "Branch", "Window", "Stretch", "Merge", "Buffer", "Release", "Cache"],
  archs: [
    g({
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
    g({
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
    g({
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
    g({
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
    g({
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
    g({
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
}, ee = (e) => Math.round(e * 1e3) / 1e3, te = (e) => Math.min(40, Math.max(0.5, e)), yt = (e) => e.segs.reduce((t, n) => t + n[0], 0) * (e.scale ?? 1);
function Ke(e, t) {
  const n = e.carrier ?? 200;
  return e.carrierEnd === void 0 ? n : Math.round(n + (e.carrierEnd - n) * t / Math.max(yt(e), 1));
}
function ca(e) {
  const t = [], [n, a] = e.noise ?? ["off", 0];
  let o = 0;
  return e.segs.forEach((s, r) => {
    const l = s[1] !== s[2], c = e.segs[r + 1];
    t.push({
      atMin: ee(o / 60),
      beatHz: ee(te(s[1])),
      carrierHz: Ke(e, o),
      gain: e.gain ?? 0.5,
      mode: e.mode ?? "binaural",
      noise: n,
      noiseLevel: a,
      ramp: l
    }), o += s[0] * (e.scale ?? 1), l && (c === void 0 || te(c[1]) !== te(s[2])) && t.push({ ...t[t.length - 1], atMin: ee(o / 60), beatHz: ee(te(s[2])), carrierHz: Ke(e, o), ramp: !1 });
  }), t;
}
const ua = (e, t) => e.replaceAll("{minutes}", String(t)).replaceAll("{duration}", `${t} minutes`);
function da(e) {
  const t = ca(e), n = Math.max(1, Math.round(yt(e) / 60));
  return {
    id: e.id,
    name: e.name,
    category: e.category,
    vibe: e.vibe,
    tags: [...e.tags, e.source],
    layerTags: J(t),
    situations: e.situations,
    recommendedMinutes: n,
    intensity: e.intensity,
    adhdFriendly: ie(t, e.intensity),
    stages: t,
    reasonTemplate: ua(e.reason, n),
    source: e.source
  };
}
const ne = ["white", 0.3], be = ["pink", 0.3], ve = ["brown", 0.3], Ye = [
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
], ma = [
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
], ha = [
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
], pa = [
  [333, 8, 8],
  [333, 8, 10],
  [333, 10, 12],
  [333, 12, 12],
  [333, 12, 10],
  [333, 10, 8],
  [333, 8, 10]
], fa = [
  [120, 20, 40],
  ...Array.from({ length: 8 }, () => [[20, 40, 40], [10, 8, 8]]).flat(),
  [120, 40, 10]
], L = (e) => ({ ...e, source: "android", carrier: 200 }), ga = [
  L({
    id: "android-self-hypnosis",
    name: "Mind Bridge",
    category: "meditation",
    vibe: "deep",
    situations: ["meditate", "heal-stress"],
    intensity: 2,
    segs: [[300, 12, 4], [600, 4, 4], [300, 4, 12]],
    noise: ne,
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
    noise: ne,
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
    noise: ve,
    gain: 0.45,
    tags: ["delta", "long"],
    reason: "A flat 3.7 Hz hour under brown noise, wide and quiet."
  }),
  L({
    id: "android-morphine",
    name: "Morphine Ease",
    category: "healing",
    vibe: "warm",
    situations: ["heal-stress"],
    intensity: 2,
    segs: [[3600, 10, 10]],
    noise: be,
    tags: ["alpha", "pain"],
    reason: "An hour at a steady 10 Hz under pink noise."
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
    segs: ha,
    noise: ["white", 0.4],
    tags: ["alpha", "theta", "creative"],
    reason: "{duration} that drift back and forth between 10 and 6 Hz."
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
    reason: "{duration} parked at 7.83 Hz with white noise."
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
    segs: fa,
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
    reason: "A single {minutes} minute slide from 15 to 10 Hz, soft and dreamy."
  }),
  L({
    id: "android-sleep-induction",
    name: "Drift Down",
    category: "sleep",
    vibe: "calm",
    situations: ["cant-sleep"],
    intensity: 1,
    segs: [[360, 9.7, 3.4], [1620, 3.4, 2.4], [1620, 2.4, 3.4]],
    noise: ve,
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
    segs: Ye,
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
    segs: pa,
    tags: ["alpha", "smr"],
    reason: "{duration} of beats crossing between alpha and the low SMR band."
  }),
  L({
    id: "android-lucid-dreams-2",
    name: "Long Lucid Night",
    category: "lucid-dreams",
    vibe: "deep",
    situations: ["lucid-dream", "cant-sleep"],
    intensity: 2,
    segs: [[600, 9.7, 3.4], [5400, 3.4, 2.4], ...ma],
    noise: be,
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
    noise: ne,
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
    noise: ne,
    scale: 0.5,
    tags: ["theta", "short"],
    reason: "The Mind Bridge shape squeezed into {duration}."
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
    reason: "A {minutes} minute Quiet Alert between tasks."
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
    reason: "A {minutes} minute version of the Earth Hum shape."
  }),
  L({
    id: "android-lucid-dreams-short",
    name: "Lucid Nap Cycle",
    category: "lucid-dreams",
    vibe: "dreamy",
    situations: ["lucid-dream", "cant-sleep"],
    intensity: 2,
    segs: Ye.slice(0, 12),
    gain: 0.5,
    tags: ["theta", "lucid", "short"],
    reason: "The opening stretch of the Lucid Dream Cycle, sized for naps."
  })
], he = (e) => ({ ...e, source: "gnaural" }), ya = [
  he({
    id: "gnaural-power-nap",
    name: "Midday Nap",
    category: "sleep",
    vibe: "warm",
    situations: ["quick-reset", "cant-sleep", "ai-burnout"],
    intensity: 1,
    segs: [[13, 11, 8.8], [17, 8.8, 7], [29, 7, 5.2], [38, 5.2, 4.4], [50, 4.4, 4.2], [68, 4.2, 4], [877, 4, 4], [37, 4, 4.2], [32, 4.2, 5.1], [20, 5.1, 6.8], [15, 6.8, 9.8], [4, 9.8, 9.8]],
    carrier: 164,
    carrierEnd: 110,
    noise: be,
    gain: 0.5,
    tags: ["delta", "nap", "schedule"],
    reason: "A fast fall to 4 Hz, a long hold, then a slow climb. {duration} in all."
  }),
  he({
    id: "gnaural-airplane-aid",
    name: "Long Haul Calm",
    category: "meditation",
    vibe: "calm",
    situations: ["meditate", "quick-reset", "heal-stress"],
    intensity: 1,
    segs: [[9, 0.5, 12], [45, 12, 8], [60, 8, 6], [120, 6, 5], [180, 5, 4.3], [180, 4.3, 4], [900, 4, 4], [900, 4, 4.2], [900, 4.2, 3.9], [900, 3.9, 3.9], [400, 3.9, 4.3]],
    carrier: 280,
    carrierEnd: 140,
    noise: ve,
    gain: 0.5,
    tags: ["theta", "travel", "schedule"],
    reason: "A falling carrier tone over theta beats, built for long seated trips."
  }),
  he({
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
    reason: "Five steps from alpha up to a 28.5 Hz middle, then back down, in {duration}."
  })
];
function ba() {
  return [...ga, ...ya].map(da);
}
const bt = [
  { id: "lofi", name: "Lo-fi", blurb: "Warm, slow chords with a tape and vinyl feel, like a quiet study radio.", mood: "warm", defaultLevel: 0.5, layerKeys: ["lofiLevel", "lofiProgression", "tapeWow", "crackle"], templateId: "starter-lofi", evidence: "preference" },
  { id: "piano", name: "Soft piano", blurb: "A soft piano playing gentle, slow phrases with long ringing notes.", mood: "calm", defaultLevel: 0.45, layerKeys: ["instLevel", "instKind", "pianoPedal"], templateId: "starter-piano", evidence: "preference" },
  { id: "violet", name: "Violet hiss", blurb: "A thin, bright hiss, like gentle static. Keep it quiet.", mood: "bright", defaultLevel: 0.3, layerKeys: [], templateId: "starter-violet", evidence: "limited" },
  { id: "rain", name: "Rain hush", blurb: "A steady rain-like hush, even across the pitches (pink noise).", mood: "calm", defaultLevel: 0.4, layerKeys: [], templateId: "starter-rain", evidence: "mixed" },
  { id: "deep", name: "Deep rumble", blurb: "A deep, low rumble like distant thunder or a big waterfall (brown noise).", mood: "deep", defaultLevel: 0.4, layerKeys: [], templateId: "starter-deep", evidence: "preference" },
  { id: "chimes", name: "Soft chimes", blurb: "Soft bells that ring now and then at uneven gaps.", mood: "dreamy", defaultLevel: 0.3, layerKeys: ["chimeLevel", "chimeRatePerMin"], templateId: "starter-chimes", evidence: "preference" },
  { id: "beats", name: "Beats only", blurb: "A soft pulse you hear as two slightly different tones, one per ear. Use headphones.", mood: "neutral", defaultLevel: 0, layerKeys: [], templateId: "starter-beats", evidence: "mixed" }
], va = (e) => Number.isFinite(e) ? Math.min(1, Math.max(0, e)) : 0;
function wa(e, t) {
  const n = va(t);
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
const ka = { warm: "warm", calm: "calm", bright: "bright", deep: "deep", dreamy: "dreamy", neutral: "minimal" };
function Sa(e) {
  const t = wa(e.id, e.defaultLevel), n = Object.keys(t.layers).length > 0, o = [{
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
    vibe: ka[e.mood] ?? "calm",
    tags: ["starter", "sound-first", e.id],
    layerTags: J(o),
    situations: ["quick-reset", "heal-stress"],
    recommendedMinutes: 20,
    intensity: 1,
    adhdFriendly: ie(o, 1),
    stages: o,
    reasonTemplate: e.blurb,
    source: "original"
  };
}
function Ma() {
  return bt.map(Sa);
}
function Aa() {
  return [
    ...Ma(),
    ...ba(),
    ...[ia, aa, sa, oa, ra, ta, na, la].flatMap(Qn)
  ];
}
let Ue;
function P() {
  return Ue ?? (Ue = Aa()), Ue;
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
function we(e) {
  return e.stages.some((t) => {
    var n;
    return (((n = t.layers) == null ? void 0 : n.percLevel) ?? 0) > 0;
  });
}
function ke(e) {
  return e.stages.some((t) => {
    var n;
    return (((n = t.layers) == null ? void 0 : n.crackle) ?? 0) > 0;
  });
}
function Ve(e) {
  return e.stages.some((t) => t.mode === "binaural");
}
const Na = {
  focus: [1, 1, 0.5, 0.1],
  "adhd-control": [1, 1, 0.5, 0.1],
  vibes: [0.5, 0.8, 1, 0.5],
  "work-recovery": [0.5, 1, 1, 0.4],
  healing: [0.6, 0.7, 1, 0.8],
  meditation: [1, 0.6, 1, 0.6],
  sleep: [0, 0.2, 0.7, 1],
  "lucid-dreams": [0, 0.1, 0.6, 1]
}, Ea = { morning: 0, afternoon: 1, evening: 2, night: 3 }, Ta = (e) => Math.round(e * 10) / 10;
function La(e, t, n) {
  const a = Math.max(1, t);
  if (e <= a)
    return n.push(`Fits your ${a} minutes (${e} min).`), 15 * (0.6 + 0.4 * (e / a));
  const o = (e - a) / a;
  return n.push(`Runs ${e} min, longer than your ${a}; you can stop any time.`), Math.max(0, 15 * (1 - o * 1.5)) - (o > 0.5 ? 5 : 0);
}
function Ca(e, t, n) {
  return t.deviceType === "speaker" ? Ve(e) ? (n.push("Warning: binaural beats need headphones. A speaker will not deliver the effect; pick an isochronic or monaural template if you can."), -8) : (n.push("Isochronic or monaural beats work over speakers."), 10) : (n.push(t.deviceType === "bluetooth" ? "Good over Bluetooth headphones." : "Headphones suit every beat type."), Ve(e) ? 10 : 8);
}
function Oa(e, t, n) {
  const a = e.intensity > 3 || we(e) || ke(e), o = t.sensorySensitivity;
  return o === "low" ? { pts: 10, sensitive: !1 } : o === "medium" ? { pts: e.intensity <= 3 ? a ? 7 : 10 : 4, sensitive: !1 } : a ? (n.push("Relaxed filter: this one is stronger or has percussion or crackle, shown because too few gentle matches exist."), { pts: 0, sensitive: !0 }) : (n.push("Gentle: low intensity, no percussion or crackle."), { pts: e.intensity <= 2 ? 10 : 7, sensitive: !1 });
}
function Ra(e, t) {
  const n = [e.reasonTemplate.replace("{minutes}", String(e.recommendedMinutes))], a = e.situations.includes(t.situation);
  let o = 0;
  a ? (o += 40, n.push(`Made for: ${t.situation}.`)) : n.push(`Related option: not built for ${t.situation}, but close in mood.`), t.vibe === void 0 ? o += 7 : t.vibe === e.vibe && (o += 15, n.push(`Matches your ${t.vibe} vibe.`)), o += La(e.recommendedMinutes, t.availableMinutes, n);
  const s = (Na[e.category][Ea[t.timeOfDay]] ?? 0) * 10;
  o += s, s >= 8 && n.push(`Suits the ${t.timeOfDay}.`), e.intensity >= 4 && t.timeOfDay === "night" && (o -= 5), o += Ca(e, t, n);
  const r = Oa(e, t, n);
  return o += r.pts, { template: e, score: Math.max(0, Ta(o)), reasons: n, sensitive: r.sensitive, onSituation: a };
}
const za = (e, t) => t.score - e.score || (e.template.id < t.template.id ? -1 : e.template.id > t.template.id ? 1 : 0);
function Je(e, t = 5, n = P()) {
  const a = Math.max(1, Math.floor(t)), o = n.map((c) => Ra(c, e)).sort(za), s = [
    o.filter((c) => c.onSituation && !c.sensitive),
    o.filter((c) => !c.sensitive),
    o
  ], r = s.find((c) => c.length >= a) ?? o, l = r.slice(0, a);
  return r !== s[0] && l.forEach((c) => {
    c.onSituation || c.reasons.push("Filters relaxed: too few exact matches, so close alternatives are included.");
  }), l.map((c) => ({ template: c.template, score: c.score, reasons: c.reasons }));
}
function vt(e) {
  const t = Math.max(0, Math.ceil(e)), n = Math.floor(t / 60), a = Math.floor(n / 60), o = (s) => String(s).padStart(2, "0");
  return a > 0 ? `${a}:${o(n % 60)}:${o(t % 60)}` : `${o(n)}:${o(t % 60)}`;
}
const Xe = {
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
function Te({ name: e, size: t = 22 }) {
  return /* @__PURE__ */ i("svg", { className: "c-icon", width: t, height: t, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", focusable: "false", children: /* @__PURE__ */ i("path", { d: Xe[e] ?? Xe.wave }) });
}
const Da = z(() => import("./chunk-mascot-B7ELnD3t.mjs").then((e) => ({ default: e.CalmMascot })));
function Le({ size: e, mood: t = "idle", reduced: n }) {
  return /* @__PURE__ */ i(q, { fallback: /* @__PURE__ */ i("span", { className: "c-mascot-gap", style: { width: e, height: e } }), children: /* @__PURE__ */ i(Da, { mood: t, size: e, reducedMotion: n }) });
}
function _a({ title: e, reduced: t }) {
  return /* @__PURE__ */ y("header", { className: "c-pagehead", children: [
    /* @__PURE__ */ i(Le, { size: 72, reduced: t }),
    /* @__PURE__ */ i("h1", { className: "c-h1", children: e })
  ] });
}
const Ia = [
  { view: "today", label: d.nav[0], icon: "today" },
  { view: "library", label: d.nav[1], icon: "library" },
  { view: "crew", label: d.nav[2], icon: "crew" },
  { view: "settings", label: d.nav[3], icon: "settings" }
];
function Pa({ view: e, onGo: t, reduced: n = !1 }) {
  const a = e === "journey" || e === "journeys" ? "today" : e === "nature" ? "library" : e === "reset" || e === "breathe" ? "today" : e;
  return /* @__PURE__ */ y("nav", { className: "c-tabbar", "aria-label": "Main", children: [
    /* @__PURE__ */ y("div", { className: "c-rail-brand", "aria-hidden": "true", children: [
      /* @__PURE__ */ i(Le, { size: 40, reduced: n }),
      /* @__PURE__ */ i("span", { className: "c-brand", children: d.brand })
    ] }),
    Ia.map((o) => /* @__PURE__ */ y("button", { type: "button", className: "c-nav", "aria-current": a === o.view ? "page" : void 0, onClick: () => t(o.view), children: [
      /* @__PURE__ */ i(Te, { name: o.icon }),
      /* @__PURE__ */ i("span", { children: o.label })
    ] }, o.view))
  ] });
}
function Ba(e, t = null) {
  var s;
  if (e.templateName !== null) return e.templateName;
  const n = e.source === "crew", a = n ? t ?? e.presetId : e.presetId, o = (s = mn.find((r) => r.id === a)) == null ? void 0 : s.name;
  return o === void 0 ? d.brand : n ? `Crew: ${o}` : o;
}
function Ha({ snap: e, crewPresetId: t = null, onOpen: n, onStop: a }) {
  if (!e.playing) return null;
  const o = e.timer.kind !== "none" && e.timer.running ? vt(e.timer.remainingSec) : "";
  return /* @__PURE__ */ y("div", { className: "c-mini", role: "group", "aria-label": "Now playing", children: [
    /* @__PURE__ */ y("button", { type: "button", className: "c-btn c-link c-mini-open", onClick: n, children: [
      Ba(e, t),
      o !== "" && /* @__PURE__ */ i("span", { className: "c-digits", children: ` ${o}` })
    ] }),
    /* @__PURE__ */ i("button", { type: "button", className: "c-btn c-small", "data-testid": "mini-stop", onClick: a, children: d.stop })
  ] });
}
const Fa = ["focus", "calm", "sleep", "study", "recover", "curious"], xa = ["morning", "afternoon", "evening", "night", "anytime"], ja = ["headphones", "speakers", "bluetooth", "unsure"], $a = {
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
}, Ga = Object.freeze({ kind: "rest", family: "", variants: Object.freeze([]) });
function Wa(e) {
  const t = $a[e] ?? 0, n = [];
  for (let a = 1; a <= t; a += 1) n.push(`${e}-${String(a).padStart(2, "0")}`);
  return Object.freeze(n);
}
function qa(e) {
  return Object.freeze({ kind: "session", family: e, variants: Wa(e) });
}
function x(...e) {
  return Object.freeze(e.map((t) => t === "rest" ? Ga : qa(t)));
}
const pe = (e, t) => Array.from({ length: t }, () => e), j = (e) => Object.freeze(e), wt = Object.freeze([
  j({
    id: "calm-evenings",
    title: "7 Calm Evenings",
    blurb: "7 short evenings of slow sound. About 20 minutes each.",
    situation: "heal-stress",
    vibe: "calm",
    minutes: 20,
    days: x(
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
    days: x("focus-alpha-beta", "focus-alpha-beta", "focus-sprint-pulse", "rest", "focus-deep-beta")
  }),
  j({
    id: "easier-sleep",
    title: "14 Nights of Wind-Down Sound",
    blurb: "14 nights of slow sound for winding down. Rest nights included.",
    situation: "cant-sleep",
    vibe: "dreamy",
    minutes: 45,
    days: x(
      ...pe("sleep-drift-theta", 4),
      "rest",
      ...pe("sleep-onset-delta", 4),
      "rest",
      ...pe("sleep-deep-delta", 3),
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
    days: x(
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
    days: x("recovery-post-sprint", "recovery-lofi-unwind", "recovery-micro-break", "rest", "recovery-lofi-unwind")
  }),
  j({
    id: "gentle-routine",
    title: "Gentle Routine",
    blurb: "Gentle routine for steady attention. About 25 minutes each.",
    situation: "adhd-focus",
    vibe: "grounded",
    minutes: 25,
    days: x(
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
function ai(e) {
  return wt.find((t) => t.id === e);
}
const Ka = {
  focus: { situation: "deep-work", vibe: "bright", minutes: 25 },
  calm: { situation: "heal-stress", vibe: "calm", minutes: 15 },
  sleep: { situation: "cant-sleep", vibe: "dreamy", minutes: 45 },
  study: { situation: "deep-work", vibe: "minimal", minutes: 30 },
  recover: { situation: "ai-burnout", vibe: "warm", minutes: 15 },
  curious: { situation: "quick-reset", minutes: 10 }
}, Ya = {
  headphones: "headphones",
  bluetooth: "bluetooth",
  speakers: "speaker",
  unsure: "headphones"
};
function Ua(e) {
  return e < 12 ? "morning" : e >= 12 && e < 17 ? "afternoon" : e >= 17 && e < 21 ? "evening" : "night";
}
function Va(e, t = /* @__PURE__ */ new Date()) {
  const n = Ka[e.goal], a = e.timeOfDay === "anytime" ? Ua(t.getHours()) : e.timeOfDay, o = {
    situation: n.situation,
    availableMinutes: n.minutes,
    timeOfDay: a,
    sensorySensitivity: e.extraGentle ? "high" : "medium",
    deviceType: Ya[e.device]
  };
  return Object.freeze(n.vibe === void 0 ? o : { ...o, vibe: n.vibe });
}
const Ja = 3, Xa = 864e5, kt = 4;
function K(e) {
  if (!Number.isFinite(e)) return 0;
  const t = new Date(e).getTimezoneOffset() * 6e4;
  return Math.floor((e - t) / Xa);
}
const St = (e) => Number.isInteger(e) && e >= 0 && e < 1e7;
function Za(e) {
  return Number.isFinite(e) ? Math.min(7, Math.max(1, Math.floor(e))) : kt;
}
function Qa(e) {
  return e - (e + 3) % 7;
}
function es(e, t, n) {
  const a = /* @__PURE__ */ new Map();
  for (const s of e) {
    if (!St(s.day) || s.day < t || s.day > n) continue;
    const r = Number.isFinite(s.minutes) && s.minutes > 0 ? s.minutes : 0;
    a.set(s.day, (a.get(s.day) ?? 0) + r);
  }
  const o = /* @__PURE__ */ new Set();
  return a.forEach((s, r) => {
    s >= Ja && o.add(r);
  }), o;
}
function ts(e, t, n) {
  return n.has(e) ? "listened" : e === t ? "today" : e > t ? "upcoming" : "rest";
}
function ns(e, t, n = kt) {
  const a = Za(n);
  if (!St(t)) {
    const l = Object.freeze(Array.from({ length: 7 }, () => "upcoming"));
    return Object.freeze({ daysListened: 0, goalDays: a, goalMet: !1, quietWeek: !0, dots: l });
  }
  const o = Qa(t), s = es(e, o, t), r = Object.freeze(Array.from({ length: 7 }, (l, c) => ts(o + c, t, s)));
  return Object.freeze({
    daysListened: s.size,
    goalDays: a,
    goalMet: s.size >= a,
    quietWeek: s.size === 0,
    dots: r
  });
}
const le = "zonked.feel.v1", as = ["calmer", "same", "not"], Mt = 64 * 1024, ss = 1e7, os = /^[a-z0-9-]{1,80}$/, Ze = 4, Qe = 12, rs = (e) => as.some((t) => t === e);
function At(e) {
  if (typeof e != "object" || e === null || Array.isArray(e)) return;
  const { id: t, a: n, day: a } = e;
  if (!(typeof t != "string" || !os.test(t) || !rs(n)) && !(typeof a != "number" || !Number.isInteger(a) || a < 0 || a > ss))
    return { id: t, a: n, day: a };
}
function Nt(e) {
  if (!Array.isArray(e)) return [];
  const t = [];
  for (const n of e.slice(-500)) {
    const a = At(n);
    a !== void 0 && t.push(a);
  }
  return t;
}
function is(e) {
  try {
    const t = e.get(le);
    if (t === null || t.length > Mt) return [];
    const n = JSON.parse(t);
    if (typeof n != "object" || n === null) return [];
    const a = n;
    return a.v === 1 ? Nt(a.entries) : [];
  } catch {
    return [];
  }
}
function ls(e, t) {
  let n = Nt(t);
  try {
    let a = JSON.stringify({ v: 1, entries: n });
    for (; a.length > Mt && n.length > 0; )
      n = n.slice(Math.ceil(n.length / 10)), a = JSON.stringify({ v: 1, entries: n });
    return e.set(le, a), !0;
  } catch {
    return !1;
  }
}
function cs(e, t) {
  const n = At(t);
  return n === void 0 ? e : [...e, n].slice(-500);
}
function us(e) {
  try {
    e.remove(le);
  } catch {
  }
}
function ds(e, t) {
  let n = 0;
  for (const a of e) a.id === t && (n += a.a === "calmer" ? Ze : a.a === "not" ? -Ze : 0);
  return Math.max(-Qe, Math.min(Qe, n));
}
const ms = (e) => e.reasons.some((t) => t.startsWith("Made for:")) && !e.reasons.some((t) => t.startsWith("Filters relaxed"));
function hs(e, t, n) {
  if (n.length === 0) return e;
  const a = Math.max(0, ...e.map((u) => u.template.intensity)), o = e.some((u) => we(u.template)), s = e.some((u) => ke(u.template)), r = new Set(e.map((u) => u.template.id)), c = t.filter(
    (u) => r.has(u.template.id) || ms(u) && u.template.intensity <= a && (o || !we(u.template)) && (s || !ke(u.template))
  ).map((u, p) => ({ r: u, i: p, s: u.score + ds(n, u.template.id) }));
  return c.sort((u, p) => p.s - u.s || u.i - p.i), c.slice(0, e.length).map((u) => u.r);
}
const Ce = "zonked.profile.v1", Oe = "zonked.journeys.v1", Re = "zonked.last.v1", Et = 32 * 1024, Tt = 1, ps = 1e7, fs = /^[a-z0-9-]{1,64}$/, Lt = Object.freeze({
  goal: "curious",
  timeOfDay: "anytime",
  device: "unsure",
  extraGentle: !1,
  createdAt: 0
}), gs = Object.freeze({}), ze = (e) => typeof e == "object" && e !== null && !Array.isArray(e), Se = (e, t) => typeof e == "number" && Number.isInteger(e) && e >= 0 && e <= t, fe = (e, t) => e.some((n) => n === t);
function Ct(e, t) {
  try {
    const n = e.get(t);
    if (n === null || n.length > Et) return;
    const a = JSON.parse(n);
    return ze(a) && a.v === Tt ? a : void 0;
  } catch {
    return;
  }
}
function Ot(e, t, n) {
  try {
    const a = JSON.stringify({ v: Tt, ...n });
    return a.length > Et ? !1 : (e.set(t, a), !0);
  } catch {
    return !1;
  }
}
function Rt(e) {
  const { goal: t, timeOfDay: n, device: a, extraGentle: o, createdAt: s } = e;
  if (!(!fe(Fa, t) || !fe(xa, n) || !fe(ja, a)) && !(typeof o != "boolean" || !Se(s, Number.MAX_SAFE_INTEGER)))
    return Object.freeze({ goal: t, timeOfDay: n, device: a, extraGentle: o, createdAt: s });
}
function ys(e) {
  const t = Ct(e, Ce);
  return (t && Rt(t)) ?? Lt;
}
function bs(e, t) {
  const n = Rt({ ...t });
  return n !== void 0 && Ot(e, Ce, { ...n });
}
function zt(e, t) {
  const n = wt.find((c) => c.id === e);
  if (n === void 0 || !ze(t) || !Se(t.startedAt, ps)) return;
  const { doneDays: a, pickedIds: o } = t;
  if (!Array.isArray(a) || !Array.isArray(o) || o.length > n.days.length) return;
  const s = a, r = o;
  if (!s.every((c) => Se(c, n.days.length) && c >= 1) || !r.every((c) => typeof c == "string" && fs.test(c))) return;
  const l = [...new Set(s)].sort((c, u) => c - u);
  return Object.freeze({
    startedAt: t.startedAt,
    doneDays: Object.freeze(l),
    pickedIds: Object.freeze([...r])
  });
}
function vs(e) {
  const t = Ct(e, Oe), n = t == null ? void 0 : t.journeys;
  if (!ze(n)) return gs;
  const a = {};
  for (const [o, s] of Object.entries(n)) {
    const r = zt(o, s);
    r !== void 0 && (a[o] = r);
  }
  return Object.freeze(a);
}
function ws(e, t) {
  const n = {};
  for (const [a, o] of Object.entries(t)) {
    const s = zt(a, o);
    s !== void 0 && (n[a] = s);
  }
  return Ot(e, Oe, { journeys: n });
}
function ks(e) {
  for (const t of [Ce, Oe, Re, le])
    try {
      e.remove(t);
    } catch {
    }
}
function et() {
  const e = /* @__PURE__ */ new Map();
  return {
    get: (t) => e.get(t) ?? null,
    set: (t, n) => void e.set(t, n),
    remove: (t) => void e.delete(t)
  };
}
function Ss(e) {
  try {
    const t = e ?? globalThis.localStorage;
    if (t === void 0) return et();
    const n = "zonked.probe";
    return t.setItem(n, "1"), t.removeItem(n), {
      get: (a) => t.getItem(a),
      set: (a, o) => t.setItem(a, o),
      remove: (a) => t.removeItem(a)
    };
  } catch {
    return et();
  }
}
const Dt = /^[a-z0-9-]{1,80}$/;
function Ms(e) {
  try {
    const t = e.get(Re);
    return t !== null && Dt.test(t) ? t : null;
  } catch {
    return null;
  }
}
function As(e, t) {
  try {
    Dt.test(t) && e.set(Re, t);
  } catch {
  }
}
const Ns = 60, Es = 400;
function Ts(e, t, n = null) {
  const a = _(null), [o, s] = A(null);
  C(() => {
    if (e.playing) {
      s(null), a.current = e.templateId === null ? null : { id: (n == null ? void 0 : n.id) ?? e.templateId, name: (n == null ? void 0 : n.name) ?? e.templateName ?? d.brand, minutes: e.elapsedSec / 60 };
      return;
    }
    const l = a.current;
    if (a.current = null, !t || l === null || l.minutes * 60 < Ns) return;
    const c = window.setTimeout(() => s({ ...l, minutes: Math.round(l.minutes) }), Es);
    return () => window.clearTimeout(c);
  }, [e.playing, e.templateId, e.templateName, e.elapsedSec, t, n == null ? void 0 : n.id, n == null ? void 0 : n.name]);
  const r = T(() => s(null), []);
  return B(() => ({ card: o, dismiss: r }), [o, r]);
}
const Ls = [
  ["calmer", d.feelCalmer],
  ["same", d.feelSame],
  ["not", d.feelNot]
];
function Cs({ onFeel: e }) {
  const [t, n] = A(!1);
  return t ? /* @__PURE__ */ i("p", { className: "c-muted", role: "status", "data-testid": "feel-saved", children: d.feelSaved }) : /* @__PURE__ */ y("div", { role: "group", "aria-labelledby": "c-feel-q", className: "c-feel", "data-testid": "feel-row", children: [
    /* @__PURE__ */ i("p", { id: "c-feel-q", className: "c-muted", children: d.feelQuestion }),
    /* @__PURE__ */ i("div", { className: "c-chips", children: Ls.map(([a, o]) => /* @__PURE__ */ i("button", { type: "button", className: "c-tchip", "data-testid": `feel-${a}`, onClick: () => {
      e(a), n(!0);
    }, children: o }, a)) })
  ] });
}
function Os({ info: e, onAgain: t, onClose: n, firstRun: a = !1, onFeel: o }) {
  const s = _(null);
  return C(() => {
    var r;
    return (r = s.current) == null ? void 0 : r.focus();
  }, []), /* @__PURE__ */ i("div", { className: "c-overlay", onKeyDown: (r) => r.key === "Escape" && n(), children: /* @__PURE__ */ y("div", { className: "c-dialog c-end", role: "dialog", "aria-modal": "true", "aria-labelledby": "c-end-title", "data-testid": "end-card", children: [
    /* @__PURE__ */ i("h2", { id: "c-end-title", className: "c-h1", children: d.endTitle }),
    /* @__PURE__ */ i("p", { children: d.endLine(e.name, e.minutes) }),
    /* @__PURE__ */ i("p", { className: "c-muted", children: d.endNote }),
    o !== void 0 && /* @__PURE__ */ i(Cs, { onFeel: o }),
    a && /* @__PURE__ */ i("p", { className: "c-note", "data-testid": "first-run-note", children: d.studioNote }),
    /* @__PURE__ */ y("div", { className: "c-actions", children: [
      /* @__PURE__ */ i("button", { ref: s, type: "button", className: "c-btn c-primary", "data-testid": "end-again", onClick: t, children: d.playAgain }),
      /* @__PURE__ */ i("button", { type: "button", className: "c-btn", "data-testid": "end-close", onClick: n, children: d.close })
    ] })
  ] }) });
}
const _t = 20;
function Rs(e) {
  if (e.kind === "sleep-fade") return 4;
  if (e.kind === "pomodoro") return 5;
  if (e.kind !== "countdown") return 3;
  const t = Math.round(e.totalSec / 60);
  return t === 15 ? 0 : t === 30 ? 1 : t === 60 ? 2 : -1;
}
function zs({ timer: e, player: t, onSprint: n, onSprintEnd: a }) {
  const o = (r) => {
    if (r === 5) return e.kind === "pomodoro" ? a == null ? void 0 : a() : n == null ? void 0 : n();
    a == null || a(), r <= 2 ? t.startTimer({ kind: "countdown", minutes: [15, 30, 60][r] ?? 15 }) : r === 3 ? t.stopTimer() : t.startTimer({ kind: "sleep-fade", minutes: _t });
  }, s = Rs(e);
  return /* @__PURE__ */ y("div", { children: [
    /* @__PURE__ */ i("div", { className: "c-chips", role: "radiogroup", "aria-label": "Timer", children: d.timerChips.map((r, l) => l === 5 && n === void 0 ? null : /* @__PURE__ */ i("button", { type: "button", role: "radio", "aria-checked": s === l, className: "c-tchip", onClick: () => o(l), children: r }, r)) }),
    e.kind !== "none" && e.running && /* @__PURE__ */ y("p", { className: "c-time", "data-testid": "time-left", children: [
      e.kind === "pomodoro" ? `${e.phase === "break" ? d.sprintBreakLeft : d.sprintFocusLeft} ` : "",
      vt(e.remainingSec)
    ] })
  ] });
}
function Ds({ onAccept: e, onCancel: t }) {
  const n = _(null), a = _(null);
  C(() => {
    var r;
    return (r = n.current) == null ? void 0 : r.focus();
  }, []);
  const s = /* @__PURE__ */ y("div", { className: "c-safety", onKeyDown: (r) => {
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
    /* @__PURE__ */ y("div", { className: "c-actions c-row", children: [
      t !== void 0 && /* @__PURE__ */ i("button", { ref: a, type: "button", className: "c-btn", onClick: t, children: d.back }),
      /* @__PURE__ */ i("button", { ref: n, type: "button", className: "c-btn c-primary", "data-testid": "calm-safety-accept", onClick: e, children: d.safetyAccept })
    ] })
  ] });
  return t === void 0 ? s : /* @__PURE__ */ i("div", { className: "c-overlay", children: /* @__PURE__ */ i("div", { className: "c-dialog", role: "dialog", "aria-modal": "true", "aria-labelledby": "c-safety-title", children: s }) });
}
const _s = 1, Is = 720;
function Ps(e) {
  const t = (e.endedAt - e.startedAt) / 6e4;
  return Number.isFinite(t) && t >= _s ? Math.min(Is, t) : 0;
}
const Bs = 200, U = (e = Date.now) => K(e());
function Hs(e, t) {
  const n = B(() => Ss(), []), [a, o] = A(() => ys(n)), [s, r] = A(() => vs(n)), [l, c] = A([]), [u, p] = A(0);
  C(() => {
    let w = !0;
    return e.listLogs(Bs).then((m) => w && c(m)).catch(() => {
    }), () => {
      w = !1;
    };
  }, [e, u, t]);
  const k = B(() => {
    const w = l.map((m) => ({ day: K(m.startedAt), minutes: Ps(m) }));
    return ns(w, U());
  }, [l]), S = T(
    (w) => {
      o(w), bs(n, w);
    },
    [n]
  ), M = T(
    (w, m) => {
      r((h) => {
        const { [w]: f, ...b } = h, N = m === null ? b : { ...b, [w]: m };
        return ws(n, N), N;
      });
    },
    [n]
  ), v = T(() => p((w) => w + 1), []);
  return { storage: n, profile: a, progress: s, week: k, logs: l, setProfile: S, setJourney: M, refresh: v };
}
const It = 15e3, Pt = 6e4, se = [
  { score: 22, level: "focus", beatHz: 40, carrierHz: 200, gain: 0.45, transitionSec: 5, why: "Simulated: a fresh start. The pretend load is low, so the sound stays steady." },
  { score: 48, level: "flow", beatHz: 18, carrierHz: 220, gain: 0.4, transitionSec: 8, why: "Simulated: the pretend load is building. The beat eases down to 18 Hz." },
  { score: 70, level: "recovery", beatHz: 10, carrierHz: 200, gain: 0.32, transitionSec: 8, why: "Simulated: the pretend load is high. The beat slows to 10 Hz and the sound softens." },
  { score: 88, level: "decompress", beatHz: 6, carrierHz: 180, gain: 0.25, transitionSec: 8, why: "Simulated: burned out. The beat settles to 6 Hz and the sound goes quiet." }
];
function Fs(e, t) {
  const n = se[Math.min(Math.max(0, Math.trunc(e)), se.length - 1)];
  return n === void 0 ? null : {
    version: 1,
    at: t,
    burnout: { score: n.score, level: n.level },
    target: { presetId: "burnout-reset", beatHz: n.beatHz, carrierHz: n.carrierHz, gain: n.gain, transitionSec: n.transitionSec, breathe: n.score >= 60 },
    sbg: null,
    why: n.why
  };
}
function xs(e, t) {
  return hn(JSON.parse(JSON.stringify(Fs(e, t))));
}
const Bt = {
  now: () => Date.now(),
  setTimer: (e, t) => setTimeout(e, t),
  clearTimer: (e) => clearTimeout(e)
};
let oe = [], Ht = Bt;
function Ft() {
  for (const e of oe) Ht.clearTimer(e);
  oe = [];
}
function tt(e, t, n, a) {
  const o = a.now(), s = xs(t, Math.trunc(o / 1e3));
  if (s === null) return;
  const r = t >= se.length - 1;
  mt({ state: s, source: "demo", changedAtMs: o, snoozeUntilMs: 0, demoNextAtMs: n + (r ? Pt : (t + 1) * It) }), e.applyCrew(s), e.followCrew();
}
function xt(e) {
  Ft(), mt({ state: null, source: "none", changedAtMs: 0, snoozeUntilMs: 0, demoNextAtMs: null }), e.crewLost();
}
function js(e, t = Bt) {
  Ft(), Ht = t;
  const n = t.now();
  tt(e, 0, n, t), e.snapshot().playing || e.play();
  for (let a = 1; a < se.length; a += 1) oe.push(t.setTimer(() => tt(e, a, n, t), a * It));
  oe.push(t.setTimer(() => xt(e), Pt));
}
const $s = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"], nt = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], Gs = { listened: "listened", rest: "rest day", today: "today", upcoming: "coming up" };
function Ws(e, t = !0, n = !1) {
  return e.quietWeek && n && !t ? d.joinedLine : e.quietWeek ? t ? d.welcomeBack : d.firstWeek : `${d.weekOf(e.daysListened)}. ${d.restCount}`;
}
function qs({ week: e, hasHistory: t = !0, joinedToday: n = !1, compact: a = !1 }) {
  const o = n && !t && e.quietWeek;
  return /* @__PURE__ */ y("div", { className: a ? "c-week c-week-compact" : "c-week", children: [
    /* @__PURE__ */ i("ul", { className: "c-dots", "aria-label": "This week", children: e.dots.map((s, r) => {
      const l = o && s === "today";
      return /* @__PURE__ */ y("li", { className: `c-dot c-dot-${s}${l ? " c-dot-joined" : ""}`, "data-state": s, children: [
        /* @__PURE__ */ i("span", { className: "c-mark", "aria-hidden": "true", children: l || s === "listened" ? /* @__PURE__ */ i(Te, { name: "check", size: 16 }) : "" }),
        /* @__PURE__ */ i("span", { className: "c-dayname", "aria-hidden": "true", children: $s[r] }),
        /* @__PURE__ */ i("span", { className: "c-sr", children: `${nt[r]}, ${l ? d.joinedToday : Gs[s]}` })
      ] }, nt[r]);
    }) }),
    /* @__PURE__ */ i("p", { className: "c-muted", "data-testid": a ? void 0 : "week-text", children: Ws(e, t, o) })
  ] });
}
const Ks = () => /* @__PURE__ */ new Date(), Ys = [], Us = ["focus", "study"];
function Vs({ profile: e, week: t, reduced: n, crewConnected: a, hasHistory: o = !0, joinedToday: s = !1, now: r = Ks, last: l = null, feel: c = Ys, onSprint: u, onPlay: p, onGo: k, onReset: S, onBreathe: M }) {
  const [v, w] = A(0), m = B(() => {
    const f = Va(e, r());
    return hs(Je(f, 5), c.length === 0 ? [] : Je(f, 12), c);
  }, [e, r, c]), h = m[v % Math.max(1, m.length)];
  return /* @__PURE__ */ y("div", { className: "c-today", children: [
    /* @__PURE__ */ y("header", { className: "c-pagehead", children: [
      /* @__PURE__ */ i(Le, { size: 72, reduced: n }),
      /* @__PURE__ */ i("h1", { className: "c-greet", "data-testid": "greeting", children: pn(r().getHours()) })
    ] }),
    l !== null && l.id !== (h == null ? void 0 : h.template.id) && /* @__PURE__ */ i("button", { type: "button", className: "c-btn c-wide c-again", "data-testid": "play-again", onClick: () => p(l), children: `${d.playAgain}: ${l.name}` }),
    h !== void 0 && /* @__PURE__ */ y("section", { className: "c-daily", "aria-labelledby": "c-daily-h", children: [
      /* @__PURE__ */ i("p", { className: "c-eyebrow", children: d.dailyEyebrow }),
      /* @__PURE__ */ i("h2", { id: "c-daily-h", children: h.template.name }),
      /* @__PURE__ */ i("p", { className: "c-muted", children: `${h.template.recommendedMinutes} min. ${h.reasons[0] ?? d.suggested}` }),
      /* @__PURE__ */ y("div", { className: "c-actions", children: [
        /* @__PURE__ */ i("button", { type: "button", className: "c-btn c-primary", "data-testid": "today-play", onClick: () => p(h.template), children: d.start }),
        /* @__PURE__ */ i("button", { type: "button", className: "c-btn c-link", onClick: () => w((f) => f + 1), children: d.notThisOne })
      ] })
    ] }),
    u !== void 0 && h !== void 0 && Us.includes(e.goal) && /* @__PURE__ */ y("button", { type: "button", className: "c-link-card c-sprint-entry", "data-testid": "today-sprint", onClick: () => u(h.template), children: [
      /* @__PURE__ */ i("b", { children: d.sprintTitle }),
      /* @__PURE__ */ i("small", { children: d.sprintLine })
    ] }),
    /* @__PURE__ */ y("button", { type: "button", className: "c-link-card c-reset-entry", "data-testid": "today-reset", onClick: S, children: [
      /* @__PURE__ */ i("b", { children: d.resetEntry }),
      /* @__PURE__ */ i("small", { children: d.resetEntryHint })
    ] }),
    M !== void 0 && e.goal === "calm" && /* @__PURE__ */ y("button", { type: "button", className: "c-link-card c-breathe-entry", "data-testid": "today-breathe", onClick: M, children: [
      /* @__PURE__ */ i("b", { children: d.breatheEntry }),
      /* @__PURE__ */ i("small", { children: d.breatheEntryHint })
    ] }),
    /* @__PURE__ */ y("section", { "aria-labelledby": "c-goal-h", children: [
      /* @__PURE__ */ i("h2", { id: "c-goal-h", className: "c-h3", children: `Your goal: ${fn[e.goal]}` }),
      /* @__PURE__ */ i(qs, { week: t, hasHistory: o, joinedToday: s })
    ] }),
    /* @__PURE__ */ y("section", { "aria-labelledby": "c-for-h", children: [
      /* @__PURE__ */ i("h2", { id: "c-for-h", className: "c-h3", children: d.forYou }),
      /* @__PURE__ */ i("ul", { className: "c-rows", children: m.slice(0, 3).map((f) => /* @__PURE__ */ i("li", { children: /* @__PURE__ */ y("button", { type: "button", className: "c-mini-card", onClick: () => p(f.template), children: [
        /* @__PURE__ */ i("b", { children: f.template.name }),
        /* @__PURE__ */ i("small", { children: f.reasons[0] ?? d.suggested }),
        /* @__PURE__ */ i("em", { children: `${f.template.recommendedMinutes} min` })
      ] }) }, f.template.id)) })
    ] }),
    /* @__PURE__ */ i("button", { type: "button", className: "c-link-card", onClick: () => k("library"), children: /* @__PURE__ */ i("b", { children: "Browse all sounds" }) }),
    /* @__PURE__ */ i("button", { type: "button", className: "c-link-card", onClick: () => k("journeys"), children: /* @__PURE__ */ i("b", { children: d.journeysTitle }) }),
    a && /* @__PURE__ */ i("p", { className: "c-crew-chip", role: "status", children: "Crew connected: easing the sound" })
  ] });
}
const Js = "calm-breathe-5", jt = 5, Xs = 0.5, Zs = 20, ge = {
  atMin: 0,
  beatHz: Xs,
  carrierHz: Zs,
  gain: 0.32,
  mode: "binaural",
  noise: "pink",
  noiseLevel: 0.45,
  ramp: !1
}, Qs = {
  id: Js,
  name: "Breathe, 5 minutes",
  category: "meditation",
  vibe: "calm",
  tags: ["breathing", "no-beat"],
  layerTags: J([ge]),
  situations: ["meditate", "quick-reset"],
  recommendedMinutes: jt,
  intensity: 1,
  adhdFriendly: ie([ge], 1),
  stages: [ge],
  reasonTemplate: "Soft pink noise, paced 4 seconds in and 4 seconds out.",
  source: "original",
  breath: { inSec: 4, outSec: 4 }
}, eo = { label: "Breathe in", count: 4 };
function to(e) {
  const [t, n] = A(0);
  if (C(() => {
    if (n(0), !e) return;
    const o = window.setInterval(() => n((s) => s + 1), 1e3);
    return () => window.clearInterval(o);
  }, [e]), !e) return eo;
  const a = t % 8;
  return { label: a < 4 ? "Breathe in" : "Breathe out", count: 4 - a % 4 };
}
const no = (e) => e.label === "Breathe in" ? d.counterIn(e.count) : d.counterOut(e.count);
function ao({ label: e, on: t, announce: n }) {
  return /* @__PURE__ */ i("p", { className: "c-sr", role: "status", "aria-live": "polite", "data-testid": "breath-live", children: t && n ? e : "" });
}
const so = 0.5, oo = 1.25, G = (e, t) => Number.isFinite(e) ? e : t, W = (e, t, n) => Math.max(t, Math.min(n, e)), at = (e) => (1 - Math.cos(Math.PI * W(e, 0, 1))) / 2;
function ro(e, t = 4, n = 4) {
  const a = W(G(t, 4), 0.5, 30), o = W(G(n, 4), 0.5, 30), s = a + o, l = (G(e, 0) % s + s) % s;
  if (l < a) return at(l / a);
  const c = Math.min(so, o / 4), u = W((l - a) / (o - c), 0, 1);
  return 1 - at(1 - Math.pow(1 - u, oo));
}
function io(e, t = 4, n = 4) {
  const a = W(G(t, 4), 0.5, 30), o = a + W(G(n, 4), 0.5, 30);
  return (G(e, 0) % o + o) % o < a ? "Breathe in" : "Breathe out";
}
const st = { phase: 0, label: "Breathe in" }, lo = 4e-3;
function co(e) {
  const [t, n] = A(st);
  return C(() => {
    if (!e || typeof requestAnimationFrame != "function") {
      n(st);
      return;
    }
    let a = 0;
    const o = performance.now(), s = (r) => {
      const l = (r - o) / 1e3, c = ro(l), u = io(l);
      n((p) => u === p.label && Math.abs(c - p.phase) < lo ? p : { phase: c, label: u }), a = requestAnimationFrame(s);
    };
    return a = requestAnimationFrame(s), () => {
      cancelAnimationFrame(a);
    };
  }, [e]), t;
}
function si({ label: e, className: t, live: n = !0 }) {
  return /* @__PURE__ */ i("p", { className: t ?? "cm-cue", ...n ? { "aria-live": "polite", role: "status" } : {}, children: e });
}
const $t = 8 * 1024 * 1024, Gt = 600, uo = 20, mo = 2, ho = 0.45, po = 1e-4;
function fo(e) {
  var o;
  const t = ((o = e[0]) == null ? void 0 : o.length) ?? 0, n = new Float32Array(t), a = Math.max(1, e.length);
  for (const s of e) {
    const r = Math.min(t, s.length);
    for (let l = 0; l < r; l++) {
      const c = s[l] ?? 0;
      n[l] = (n[l] ?? 0) + (Number.isFinite(c) ? c : 0) / a;
    }
  }
  return n;
}
function go(e, t) {
  const n = e.length - t, a = e.slice(0, n);
  for (let o = 0; o < t; o++) {
    const s = (o + 0.5) / t * (Math.PI / 2);
    a[o] = (e[o] ?? 0) * Math.sin(s) + (e[n + o] ?? 0) * Math.cos(s);
  }
  return a;
}
function Wt(e, t) {
  if (!Number.isFinite(t) || t <= 0 || e.length === 0) return { ok: !1, error: "This file has no sound in it." };
  const n = fo(e), a = n.length / t;
  if (a > Gt) return { ok: !1, error: "This file is longer than 10 minutes." };
  let o = 0;
  for (const l of n) o = Math.max(o, Math.abs(l));
  if (o < po) return { ok: !1, error: "This file is silent." };
  const s = ho / o;
  for (let l = 0; l < n.length; l++) n[l] = (n[l] ?? 0) * s;
  if (a < uo) return { ok: !0, data: n, loop: !1 };
  const r = Math.min(Math.round(mo * t), Math.floor(n.length / 4));
  return { ok: !0, data: go(n, r), loop: !0 };
}
const ye = [
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
], $ = (e) => ({ ok: !1, error: e }), yo = 20261128, bo = /^[a-z]+$/;
function vo(e) {
  const t = /* @__PURE__ */ new Map(), n = /* @__PURE__ */ new Map();
  let a = null, o = 0, s = null, r = 0, l = 0;
  const c = () => a === null ? 0 : s ?? bn(o);
  function u(m) {
    m.duck.gain.setTargetAtTime(ht(c()), m.ctx.currentTime, yn);
  }
  function p(m) {
    if (!bo.test(m) || !ye.some((h) => h.id === m)) return null;
    try {
      const h = new URL(`${e.baseUrl}samples/${m}.mp3.json`, e.origin);
      return h.origin === new URL(e.origin).origin ? h.href : null;
    } catch {
      return null;
    }
  }
  async function k(m, h) {
    if (t.has(h)) return { ok: !0 };
    const f = p(h);
    if (f === null) return $("unknown sample");
    try {
      const b = await e.fetchBytes(f), N = await m.ctx.decodeAudioData(b);
      return t.set(h, N), { ok: !0 };
    } catch {
      return $("sample unavailable: check the connection or reinstall the app files");
    }
  }
  function S(m, h) {
    const f = n.get(h);
    if (f !== void 0) return f;
    const b = k(m, h).finally(() => {
      n.delete(h);
    });
    return n.set(h, b), b;
  }
  function M(m, h) {
    const f = h.ctx.currentTime, b = m.gain.gain;
    b.cancelScheduledValues(f), b.setValueAtTime(b.value, f), b.linearRampToValueAtTime(0, f + je);
    try {
      m.src.stop(f + je + 0.05);
    } catch {
    }
    m.src.onended = () => {
      m.src.disconnect(), m.gain.disconnect();
    };
  }
  function v(m, h, f, b, N) {
    a !== null && M(a, m), o = ue(b, o);
    const O = m.ctx.createBufferSource(), R = m.ctx.createGain();
    O.buffer = f, O.loop = N, R.gain.setValueAtTime(0, m.ctx.currentTime), R.gain.linearRampToValueAtTime(o, m.ctx.currentTime + $e), O.connect(R), R.connect(m.input);
    const Q = { id: h, src: O, gain: R };
    return N || (O.onended = () => {
      O.disconnect(), R.disconnect(), a === Q && (a = null, u(m));
    }), O.start(), a = Q, u(m), { ok: !0 };
  }
  async function w(m, h, f, b) {
    let N;
    try {
      N = (await import("./chunk-graph-BSt4xAW7.mjs")).buildSynth;
    } catch {
      return $("sample unavailable: reinstall the app files");
    }
    if (b !== r) return { ok: !0 };
    a !== null && M(a, m), o = ue(f, o);
    const O = N(m.ctx, h, yo + l++), R = m.ctx.createGain();
    return R.gain.setValueAtTime(0, m.ctx.currentTime), R.gain.linearRampToValueAtTime(o, m.ctx.currentTime + $e), O.connect(R), R.connect(m.input), a = { id: h, src: O, gain: R }, u(m), { ok: !0 };
  }
  return {
    list: () => ye,
    async start(m, h) {
      const f = e.getBus();
      if (f === null) return $("start the sound first");
      const b = ++r;
      if (ye.some((R) => R.id === m && R.kind === "synth")) return w(f, m, h, b);
      const N = await S(f, m);
      if (!N.ok) return N;
      const O = t.get(m);
      return O === void 0 || b !== r ? O === void 0 ? $("sample unavailable") : { ok: !0 } : v(f, m, O, h, !0);
    },
    /** Plays a ready buffer (a person's own sound). Loops, or plays once when `loop` is false. */
    startBuffer(m, h, f, b) {
      const N = e.getBus();
      return N === null ? $("start the sound first") : (r++, v(N, m, h, f, b));
    },
    setLevel(m) {
      o = ue(m, o);
      const h = e.getBus();
      if (h === null || a === null) return;
      const f = a.gain.gain;
      f.cancelScheduledValues(h.ctx.currentTime), f.setTargetAtTime(o, h.ctx.currentTime, gn), u(h);
    },
    setBlend(m) {
      s = vn(m, s ?? 0);
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
async function wo(e) {
  const t = await fetch(e, { credentials: "same-origin" });
  if (!t.ok) throw new Error(`status ${t.status}`);
  return t.arrayBuffer();
}
const F = vo({
  getBus: pt,
  fetchBytes: wo,
  baseUrl: "./",
  origin: typeof location > "u" ? "" : location.href
}), qt = () => F.list(), ko = (e, t) => F.start(e, t), So = (e) => F.setLevel(e), Mo = () => F.stop(), Ao = (e) => F.setBlend(e), No = () => F.playing();
async function Eo(e, t, n) {
  const a = pt();
  if (a === null) return { ok: !1, error: "start the sound first" };
  try {
    const o = await a.ctx.decodeAudioData(t.slice(0)), s = Array.from({ length: o.numberOfChannels }, (c, u) => o.getChannelData(u)), r = Wt(s, o.sampleRate);
    if (!r.ok) return r;
    const l = a.ctx.createBuffer(1, r.data.length, o.sampleRate);
    return l.getChannelData(0).set(r.data), F.startBuffer(e, l, n, r.loop);
  } catch {
    return { ok: !1, error: "This file could not be played." };
  }
}
const Kt = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  MAX_SAMPLE_LEVEL: Pn,
  duckGain: ht,
  listSamples: qt,
  playingSample: No,
  setBlend: Ao,
  setSampleLevel: So,
  startOwn: Eo,
  startSample: ko,
  stopSample: Mo
}, Symbol.toStringTag, { value: "Module" })), De = "zonked.nature.v1", Yt = 0.3, Ut = 0.4, Vt = 0.85, ot = { id: null, blend: Yt, level: Ut }, rt = (e, t, n, a) => typeof e == "number" && Number.isFinite(e) ? Math.min(n, Math.max(t, e)) : a;
function To(e) {
  if (e === null || e.length > 400) return ot;
  try {
    const t = JSON.parse(e);
    return { id: typeof t.id == "string" && /^(own:)?[a-z0-9]{3,40}$/.test(t.id) ? t.id : null, blend: rt(t.blend, 0, 1, Yt), level: rt(t.level, 0, Vt, Ut) };
  } catch {
    return ot;
  }
}
const _e = () => {
  try {
    return typeof localStorage > "u" ? null : localStorage;
  } catch {
    return null;
  }
}, Jt = () => {
  var e;
  return To(((e = _e()) == null ? void 0 : e.getItem(De)) ?? null);
};
function it(e) {
  var t;
  try {
    (t = _e()) == null || t.setItem(De, JSON.stringify(e));
  } catch {
  }
}
function Lo() {
  var e;
  try {
    (e = _e()) == null || e.removeItem(De);
  } catch {
  }
}
const Co = { wind: "breeze", waterfall: "rapids", flute: "wave" }, Oo = z(() => import("./chunk-MySounds-zg3mS8VE.mjs").then((e) => ({ default: e.MySounds }))), Ro = z(() => import("./chunk-Credits-BloIq-5G.mjs").then((e) => ({ default: e.Credits })));
function Me({ id: e, label: t, value: n, max: a, onChange: o }) {
  return /* @__PURE__ */ y("div", { className: "c-slider", children: [
    /* @__PURE__ */ i("label", { htmlFor: e, children: t }),
    /* @__PURE__ */ i("input", { id: e, type: "range", min: 0, max: a, step: 0.05, value: n, "aria-valuetext": `${Math.round(n / a * 100)} percent`, onChange: (s) => o(Number(s.currentTarget.value)) })
  ] });
}
function Ie({ nature: e }) {
  return /* @__PURE__ */ y("div", { className: "c-nature-controls", children: [
    /* @__PURE__ */ i(Me, { id: "c-blend", label: d.natureBlend, value: e.prefs.blend, max: 1, onChange: e.setBlend }),
    /* @__PURE__ */ i(Me, { id: "c-nlevel", label: d.natureLevel, value: e.prefs.level, max: Vt, onChange: e.setLevel })
  ] });
}
function zo({ nature: e, reduced: t, onBack: n }) {
  const [a, o] = A(null);
  return /* @__PURE__ */ y("div", { className: "c-nature", children: [
    /* @__PURE__ */ i(_a, { title: d.natureHead, reduced: t }),
    /* @__PURE__ */ i("p", { className: "c-lead", children: d.natureIntro }),
    /* @__PURE__ */ i("ul", { className: "c-tiles c-nature-tiles", children: qt().map((s, r) => /* @__PURE__ */ y("li", { children: [
      /* @__PURE__ */ y("button", { type: "button", className: `c-tile c-g${r % 6 + 1}`, "data-testid": `nature-${s.id}`, "aria-pressed": e.on === s.id, onClick: () => e.start(s.id), children: [
        /* @__PURE__ */ i(Te, { name: Co[s.id] ?? s.id }),
        /* @__PURE__ */ i("span", { className: "c-tile-name", children: s.label }),
        /* @__PURE__ */ i("span", { className: "c-tile-mood", children: s.kind === "synth" ? s.note ?? d.natureMade : d.natureFree }),
        e.on === s.id && /* @__PURE__ */ i("span", { className: "c-tile-count", children: d.natureOn })
      ] }),
      /* @__PURE__ */ i("button", { type: "button", className: "c-btn c-link c-small", "aria-expanded": a === s.id, onClick: () => o(a === s.id ? null : s.id), children: `${d.natureCredits}: ${s.label}` }),
      a === s.id && /* @__PURE__ */ i(q, { fallback: null, children: /* @__PURE__ */ i(Ro, { id: s.id, synth: s.kind === "synth" }) })
    ] }, s.id)) }),
    /* @__PURE__ */ i(Ie, { nature: e }),
    e.on !== null && /* @__PURE__ */ i("button", { type: "button", className: "c-btn c-wide", "data-testid": "nature-stop", onClick: e.stop, children: d.natureOff }),
    /* @__PURE__ */ i("p", { className: "c-status", role: "status", "data-testid": "nature-message", children: e.message }),
    /* @__PURE__ */ i("p", { className: "c-note", children: d.natureNote }),
    /* @__PURE__ */ i(q, { fallback: null, children: /* @__PURE__ */ i(Oo, { nature: e }) }),
    /* @__PURE__ */ i("button", { type: "button", className: "c-btn c-link c-back", onClick: n, children: d.natureBack })
  ] });
}
const Do = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  NatureControls: Ie,
  NatureScreen: zo,
  Slider: Me
}, Symbol.toStringTag, { value: "Module" })), _o = ["cant-sleep", "lucid-dream"], Io = ["adhd-focus", "deep-work", "ai-burnout"];
function Xt(e, t) {
  if (t) return "nature";
  const n = e === null ? void 0 : P().find((o) => o.id === e), a = (n == null ? void 0 : n.situations) ?? [];
  return a.some((o) => _o.includes(o)) ? "sleep" : a.some((o) => Io.includes(o)) ? "focus" : "calm";
}
const Po = 400;
function Zt(e, t) {
  const [n, a] = A(0);
  return C(() => {
    if (!t) {
      a(0);
      return;
    }
    let o = !0;
    const s = window.setInterval(() => {
      e.getStats().then((r) => {
        const l = Number.isFinite(r.rms) ? Math.min(1, Math.max(0, r.rms * 4)) : 0;
        o && a((c) => c * 0.6 + l * 0.4);
      }).catch(() => {
      });
    }, Po);
    return () => {
      o = !1, window.clearInterval(s);
    };
  }, [e, t]), n;
}
const Bo = z(() => import("./chunk-mascot-B7ELnD3t.mjs").then((e) => ({ default: e.CalmMascot }))), Ho = z(() => import("./chunk-visuals-B0CqKfY2.mjs").then((e) => ({ default: e.SceneLoop }))), Fo = z(() => import("./chunk-mascot-B7ELnD3t.mjs").then((e) => ({ default: e.BreathCue })));
function Pe({ still: e, playing: t, situation: n, theme: a, level: o, announce: s = !0 }) {
  const r = co(t && !e), l = to(t && e), c = t && !e;
  return /* @__PURE__ */ y(Ee, { children: [
    /* @__PURE__ */ i("div", { className: "c-stage", "data-testid": "breath-ring", "data-still": e ? "true" : "false", "data-situation": n, children: /* @__PURE__ */ y(q, { fallback: null, children: [
      /* @__PURE__ */ i("div", { className: "c-stage-scene", children: /* @__PURE__ */ i(Ho, { situation: n, reducedMotion: e, theme: a }) }),
      /* @__PURE__ */ i("div", { className: "c-stage-mascot", children: /* @__PURE__ */ i(
        Bo,
        {
          mood: t ? "breathing" : "idle",
          size: 190,
          reducedMotion: e,
          situation: n,
          breathPhase: c ? r.phase : void 0,
          level: t ? o : 0
        }
      ) })
    ] }) }),
    /* @__PURE__ */ y("div", { className: "c-cue", children: [
      c ? /* @__PURE__ */ i(q, { fallback: null, children: /* @__PURE__ */ i(Fo, { label: r.label, className: "c-cue-text", live: !1 }) }) : t ? /* @__PURE__ */ i("p", { className: "c-cue-text", "data-testid": "breath-counter", children: no(l) }) : /* @__PURE__ */ i("p", { className: "c-cue-text", children: d.breathe }),
      /* @__PURE__ */ i(ao, { label: c ? r.label : l.label, on: t, announce: s })
    ] })
  ] });
}
function xo({ engine: e, theme: t, announce: n = !0, sprint: a, player: o, snap: s, still: r, favorite: l, onToggle: c, onFavorite: u, nature: p }) {
  var f;
  const [k, S] = A(!1), M = Zt(e, s.playing), v = bt.find((b) => b.templateId === s.templateId), w = (v == null ? void 0 : v.evidence) ?? "mixed", m = Xt(((f = a == null ? void 0 : a.focus) == null ? void 0 : f.id) ?? s.templateId, p.on !== null), h = P().find((b) => {
    var N;
    return b.id === (((N = a == null ? void 0 : a.focus) == null ? void 0 : N.id) ?? s.templateId);
  });
  return /* @__PURE__ */ y("div", { className: "c-player", children: [
    /* @__PURE__ */ i("h1", { className: "c-h1", children: s.templateName ?? d.brand }),
    /* @__PURE__ */ i(Pe, { still: r, playing: s.playing, situation: m, theme: t, level: M, announce: n }),
    /* @__PURE__ */ y("div", { className: "c-controls", children: [
      /* @__PURE__ */ i("button", { type: "button", className: "c-btn c-round c-big", "data-testid": "player-toggle", onClick: c, children: s.playing ? d.stop : d.play }),
      /* @__PURE__ */ i("button", { type: "button", className: "c-btn c-round", "aria-pressed": l, onClick: u, children: l ? d.saved : d.favorite })
    ] }),
    /* @__PURE__ */ i(
      zs,
      {
        timer: s.timer,
        player: o,
        ...a !== void 0 && h !== void 0 ? { onSprint: () => a.start(h), onSprintEnd: a.cancel } : {}
      }
    ),
    /* @__PURE__ */ i(jo, { nature: p }),
    /* @__PURE__ */ i("p", { className: "c-muted", children: d.volumeCapped }),
    /* @__PURE__ */ y("section", { className: "c-why", children: [
      /* @__PURE__ */ i("button", { type: "button", className: "c-btn c-link", "aria-expanded": k, "aria-controls": "c-why-box", onClick: () => S((b) => !b), children: d.whyTitle }),
      /* @__PURE__ */ y("div", { id: "c-why-box", hidden: !k, children: [
        /* @__PURE__ */ i("p", { children: d.whyBody }),
        /* @__PURE__ */ i("p", { children: `Evidence: ${w}. ${wn[w] ?? ""}` })
      ] })
    ] })
  ] });
}
function jo({ nature: e }) {
  const t = e.prefs.id ?? Jt().id ?? "rain";
  return /* @__PURE__ */ y("section", { className: "c-card c-nature-quick", "aria-label": d.natureHead, children: [
    /* @__PURE__ */ i("button", { type: "button", className: "c-btn", "data-testid": "player-nature", "aria-pressed": e.on !== null, onClick: () => e.on === null ? e.start(t) : e.stop(), children: e.on === null ? `${d.natureAdd}: ${t.startsWith("own:") ? d.mineTitle : t}` : d.natureOff }),
    e.on !== null && /* @__PURE__ */ i(Ie, { nature: e }),
    /* @__PURE__ */ i("p", { className: "c-status", role: "status", children: e.message })
  ] });
}
const $o = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  PlayerScreen: xo,
  Stage: Pe
}, Symbol.toStringTag, { value: "Module" })), Go = 90, Wo = "android-wakeful-relax-5", Qt = {
  kind: "reset",
  seconds: Go,
  template: () => P().find((e) => e.id === Wo),
  title: d.resetTitle,
  intro: d.resetIntro,
  done: d.resetDoneLine,
  again: d.resetAgain,
  left: d.resetLeft
}, qo = {
  kind: "breathe",
  seconds: jt * 60,
  template: () => Qs,
  title: d.breatheTitle,
  intro: d.breatheIntro,
  done: d.breatheDoneLine,
  again: d.breatheAgain,
  left: d.breatheLeft
};
function Ko(e, t = Qt) {
  const [n, a] = A("idle"), [o, s] = A(t.seconds), r = _(0), { player: l, guarded: c, playTemplate: u } = e, p = T(() => {
    const w = t.template();
    w !== void 0 && c(() => {
      r.current = Date.now() + t.seconds * 1e3, s(t.seconds), a("running"), u(w, null);
    });
  }, [c, u, t]), k = T(() => {
    a("idle"), l.stop();
  }, [l]);
  C(() => {
    if (n !== "running") return;
    const w = window.setInterval(() => {
      const m = Math.ceil((r.current - Date.now()) / 1e3);
      if (m > 0) return s(m);
      window.clearInterval(w), s(0), a("done"), l.stop();
    }, 1e3);
    return () => window.clearInterval(w);
  }, [n, l]);
  const S = _(!1), M = e.snap.playing;
  C(() => {
    n !== "running" ? S.current = !1 : M ? S.current = !0 : S.current && a("idle");
  }, [n, M]);
  const v = _(n);
  return v.current = n, C(() => () => void (v.current === "running" && l.stop()), [l]), { phase: n, left: o, begin: p, stop: k };
}
function lt({ s: e, still: t, theme: n, announce: a, onBack: o, plan: s = Qt }) {
  const r = Ko(e, s), l = Zt(e.engine, e.snap.playing), c = Xt(e.snap.templateId, !1);
  return r.phase === "done" ? /* @__PURE__ */ i(Yo, { plan: s, onAgain: r.begin, onBack: o }) : /* @__PURE__ */ y("div", { className: "c-player c-reset", "data-testid": "reset-screen", "data-kind": s.kind, "data-phase": r.phase, children: [
    /* @__PURE__ */ i("h1", { className: "c-h1", children: s.title }),
    r.phase === "idle" && /* @__PURE__ */ i("p", { className: "c-lead", children: s.intro }),
    /* @__PURE__ */ i(Pe, { still: t, playing: r.phase === "running" && e.snap.playing, situation: c, theme: n, level: l, announce: a }),
    r.phase === "running" ? /* @__PURE__ */ y(Ee, { children: [
      /* @__PURE__ */ i("p", { className: "c-muted c-digits", "data-testid": "reset-left", "aria-hidden": "true", children: s.left(r.left) }),
      /* @__PURE__ */ i("div", { className: "c-controls", children: /* @__PURE__ */ i("button", { type: "button", className: "c-btn c-round c-big", "data-testid": "reset-stop", onClick: r.stop, children: d.stop }) })
    ] }) : /* @__PURE__ */ y("div", { className: "c-actions", children: [
      /* @__PURE__ */ i("button", { type: "button", className: "c-btn c-primary", "data-testid": "reset-begin", onClick: r.begin, children: d.resetStart }),
      /* @__PURE__ */ i("button", { type: "button", className: "c-btn c-link", onClick: o, children: d.resetBack })
    ] }),
    /* @__PURE__ */ i("p", { className: "c-muted", children: d.volumeCapped })
  ] });
}
function Yo({ plan: e, onAgain: t, onBack: n }) {
  const a = _(null);
  return C(() => {
    var o;
    return (o = a.current) == null ? void 0 : o.focus();
  }, []), /* @__PURE__ */ y("div", { className: "c-end c-reset", "data-testid": "reset-end", children: [
    /* @__PURE__ */ i("h1", { className: "c-h1", children: d.endTitle }),
    /* @__PURE__ */ i("p", { children: e.done }),
    /* @__PURE__ */ i("p", { className: "c-muted", children: d.endNote }),
    /* @__PURE__ */ y("div", { className: "c-actions", children: [
      /* @__PURE__ */ i("button", { ref: a, type: "button", className: "c-btn c-primary", "data-testid": "reset-back", onClick: n, children: d.resetBack }),
      /* @__PURE__ */ i("button", { type: "button", className: "c-btn", "data-testid": "reset-again", onClick: t, children: e.again })
    ] })
  ] });
}
const Uo = z(() => import("./chunk-Journeys-DNvAvwWD.mjs").then((e) => ({ default: e.JourneyList }))), Vo = z(() => import("./chunk-Journeys-DNvAvwWD.mjs").then((e) => ({ default: e.JourneyDetail }))), Jo = z(() => import("./chunk-Library-Dn_L-Mf9.mjs").then((e) => ({ default: e.Library }))), Xo = z(() => Promise.resolve().then(() => $o).then((e) => ({ default: e.PlayerScreen }))), Zo = z(() => import("./chunk-CrewScreen-D9X6pQIN.mjs").then((e) => ({ default: e.CrewScreen }))), Qo = z(() => Promise.resolve().then(() => Do).then((e) => ({ default: e.NatureScreen }))), er = z(() => import("./chunk-SettingsScreen-DC15B3EM.mjs").then((e) => ({ default: e.SettingsScreen })));
function tr({ view: e, journeyId: t, s: n, data: a, crewInfo: o, nature: s, still: r, fav: l, last: c, look: u, prefs: p, onPrefs: k, feel: S, sprint: M, handlers: v }) {
  switch (e) {
    case "journeys":
      return /* @__PURE__ */ i(Uo, { progress: a.progress, onOpen: v.openJourney, reduced: r });
    case "journey":
      return /* @__PURE__ */ i(
        Vo,
        {
          id: t ?? "",
          profile: a.profile,
          progress: a.progress,
          todayDay: U(),
          onBack: () => v.go("journeys"),
          onStartJourney: a.setJourney,
          onRestart: (w) => a.setJourney(w, null),
          onPlayDay: v.playDay
        }
      );
    case "library":
      return /* @__PURE__ */ i(Jo, { store: n.store, logs: a.logs, reduced: r, onNature: () => v.go("nature"), onPlay: v.play, onPlayMix: v.onMix, onBreathe: () => v.go("breathe") });
    case "nature":
      return /* @__PURE__ */ i(Qo, { nature: s, reduced: r, onBack: () => v.go("library") });
    case "player":
      return /* @__PURE__ */ i(Xo, { player: n.player, snap: n.snap, still: r, favorite: l.on, onToggle: n.toggle, onFavorite: l.toggle, nature: s, engine: n.engine, theme: u.theme, announce: p.announce, sprint: M });
    case "reset":
      return /* @__PURE__ */ i(lt, { s: n, still: r, theme: u.theme, announce: p.announce, onBack: () => v.go("today") });
    case "breathe":
      return /* @__PURE__ */ i(lt, { s: n, still: r, theme: u.theme, announce: p.announce, onBack: () => v.go("today"), plan: qo });
    case "crew":
      return /* @__PURE__ */ i(
        Zo,
        {
          crew: o,
          overridden: n.snap.overridden,
          onDemo: () => n.guarded(() => js(n.player)),
          onStopDemo: () => xt(n.player),
          onNotNow: () => Sn(n.player),
          onResume: () => kn(n.player),
          onFollow: () => n.player.followCrew()
        }
      );
    case "settings":
      return /* @__PURE__ */ i(
        er,
        {
          gentle: a.profile.extraGentle,
          reduceMotion: n.userReduced,
          reduced: r,
          onGentle: (w) => a.setProfile({ ...a.profile, extraGentle: w }),
          onReduceMotion: n.setReduced,
          onStudio: v.onStudio,
          onForget: v.forget,
          prefs: p,
          onPrefs: k
        }
      );
    default:
      return /* @__PURE__ */ i(
        Vs,
        {
          profile: a.profile,
          week: a.week,
          progress: a.progress,
          reduced: r,
          hasHistory: a.logs.some((w) => K(w.startedAt) < U()),
          joinedToday: K(a.profile.createdAt) === U(),
          crewConnected: o.enabled && o.status === "connected",
          last: c,
          feel: S,
          onSprint: M.start,
          onPlay: v.play,
          onOpenJourney: v.openJourney,
          onGo: v.go,
          onReset: () => v.go("reset"),
          onBreathe: () => v.go("breathe")
        }
      );
  }
}
const nr = "zonked.look.v1", en = "zonked.theme.v2", V = { choice: "dark", dim: null, announce: !0 }, ar = ["system", "light", "dark", "contrast"], sr = (e) => typeof e == "string" && ar.includes(e);
function tn(e) {
  if (e === null) return null;
  try {
    const t = JSON.parse(e.slice(0, 400));
    return typeof t == "object" && t !== null ? t : null;
  } catch {
    return null;
  }
}
function or(e) {
  const t = tn(e);
  return t === null ? V : {
    choice: sr(t.choice) ? t.choice : V.choice,
    dim: typeof t.dim == "boolean" ? t.dim : null,
    announce: t.announce !== !1
  };
}
function rr(e) {
  const t = tn(e);
  if (t === null) return V;
  const n = t.highContrast === !0 ? "contrast" : t.theme === "light" ? "light" : "dark";
  return { ...V, choice: n };
}
const ir = (e) => e.getHours() >= 19 || e.getHours() < 7, lr = (e, t = /* @__PURE__ */ new Date()) => e.dim ?? ir(t), cr = () => typeof window.matchMedia == "function" && window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
function ur(e, t) {
  return e.choice === "contrast" ? { theme: t, highContrast: !0 } : { theme: e.choice === "system" ? t : e.choice, highContrast: !1 };
}
function dr() {
  try {
    const e = window.localStorage.getItem(en);
    return e !== null ? or(e) : rr(window.localStorage.getItem(nr));
  } catch {
    return V;
  }
}
function mr() {
  const [e, t] = A(dr), [n, a] = A(cr);
  C(() => {
    var l;
    if (typeof window.matchMedia != "function") return;
    const s = window.matchMedia("(prefers-color-scheme: light)"), r = () => a(s.matches ? "light" : "dark");
    return (l = s.addEventListener) == null || l.call(s, "change", r), () => {
      var c;
      return (c = s.removeEventListener) == null ? void 0 : c.call(s, "change", r);
    };
  }, []);
  const o = T((s) => {
    t(s);
    try {
      window.localStorage.setItem(en, JSON.stringify(s));
    } catch {
    }
  }, []);
  return { look: ur(e, n), prefs: e, dim: lr(e), setPrefs: o };
}
let re = null;
const ct = () => re, ut = (e) => void (re = e);
function hr() {
  re !== null && (re = null, Promise.resolve().then(() => Kt).then((e) => e.stopSample()).catch(() => {
  }));
}
const pr = "zonked.mysounds.v1", fr = 5, gr = 20 * 1024 * 1024, D = "sounds", yr = 60, I = (e) => ({ ok: !1, error: e }), br = "Your device could not store this sound. Remove one and try again.", nn = (e) => /^own:[a-z0-9]{6,40}$/.test(e);
function vr(e) {
  const t = e.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, yr);
  return t === "" ? "My sound" : t;
}
function wr(e) {
  return new Promise((t, n) => {
    const a = e.open(pr, 1);
    a.onupgradeneeded = () => void a.result.createObjectStore(D, { keyPath: "id" }), a.onsuccess = () => t(a.result), a.onerror = () => n(a.error ?? new Error("open failed")), a.onblocked = () => n(new Error("blocked"));
  });
}
function Be(e) {
  return new Promise((t, n) => {
    e.onsuccess = () => t(e.result), e.onerror = () => n(e.error ?? new Error("request failed"));
  });
}
function He(e) {
  return new Promise((t, n) => {
    e.oncomplete = () => t(), e.onerror = () => n(e.error ?? new Error("write failed")), e.onabort = () => n(e.error ?? new Error("write aborted"));
  });
}
const X = () => typeof indexedDB > "u" ? null : indexedDB;
async function Z(e, t, n) {
  if (e === null) return I("This browser cannot keep sounds on your device.");
  let a = null;
  try {
    return a = await wr(e), { ok: !0, value: await t(a) };
  } catch (o) {
    if (o instanceof RangeError) return I(o.message === "count" ? "You can keep 5 sounds. Remove one first." : "Your sounds would use more than 20 MB. Remove one first.");
    const s = o instanceof DOMException && o.name === "QuotaExceededError";
    return I(s ? br : n);
  } finally {
    a == null || a.close();
  }
}
async function oi(e = X()) {
  return Z(e, async (t) => (await Be(t.transaction(D).objectStore(D).getAll())).map((a) => ({ id: a.id, name: a.name, size: a.size })), "Your sounds could not be read.");
}
async function kr(e, t = X()) {
  if (!nn(e)) return I("Unknown sound.");
  const n = await Z(t, async (a) => await Be(a.transaction(D).objectStore(D).get(e)), "Your sound could not be read.");
  return n.ok ? n.value === void 0 ? I("That sound is gone.") : { ok: !0, value: n.value.bytes } : n;
}
async function ri(e, t, n = X()) {
  if (t.byteLength > $t) return I("This file is bigger than 8 MB.");
  const o = { id: `own:${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`, name: vr(e), size: t.byteLength, bytes: t };
  return Z(n, async (s) => {
    const r = await Be(s.transaction(D).objectStore(D).getAll());
    if (r.length >= fr) throw new RangeError("count");
    if (r.reduce((c, u) => c + u.size, 0) + o.size > gr) throw new RangeError("total");
    const l = s.transaction(D, "readwrite");
    return l.objectStore(D).put(o), await He(l), { id: o.id, name: o.name, size: o.size };
  }, "Your sound could not be saved.");
}
async function ii(e, t = X()) {
  return Z(t, async (n) => {
    const a = n.transaction(D, "readwrite");
    return a.objectStore(D).delete(e), await He(a), !0;
  }, "That sound could not be removed.");
}
async function Sr(e = X()) {
  return Z(e, async (t) => {
    const n = t.transaction(D, "readwrite");
    return n.objectStore(D).clear(), await He(n), !0;
  }, "Your sounds could not be removed.");
}
const Mr = async (e) => {
  const t = typeof OfflineAudioContext > "u" ? void 0 : OfflineAudioContext;
  if (t === void 0) throw new Error("no decoder");
  const n = await new t(1, 1, 44100).decodeAudioData(e.slice(0));
  return { channels: Array.from({ length: n.numberOfChannels }, (a, o) => n.getChannelData(o)), sampleRate: n.sampleRate };
};
async function li(e, t = Mr) {
  var s;
  if (e.byteLength > $t) return I("This file is bigger than 8 MB.");
  if (e.byteLength === 0) return I("This file is empty.");
  let n;
  try {
    n = await t(e);
  } catch {
    return I("This file is not a sound this browser can read.");
  }
  if ((((s = n.channels[0]) == null ? void 0 : s.length) ?? 0) / n.sampleRate > Gt) return I("This file is longer than 10 minutes.");
  const o = Wt(n.channels, n.sampleRate);
  return o.ok ? { ok: !0, value: !0 } : I(o.error);
}
const ae = () => Promise.resolve().then(() => Kt);
async function Ar(e, t) {
  const n = await ae();
  if (!nn(e)) return n.startSample(e, t);
  const a = await kr(e);
  return a.ok ? n.startOwn(e, a.value, t) : { ok: !1, error: a.error };
}
function Nr(e) {
  const [t, n] = A(Jt), [a, o] = A(ct), [s, r] = A(""), l = _(t);
  l.current = t;
  const { player: c, guarded: u } = e;
  C(() => {
    e.snap.playing || (hr(), o(null));
  }, [e.snap.playing]);
  const p = T(
    async (m) => {
      if (r(""), c.snapshot().playing || await c.play(), !c.snapshot().playing) return void r(d.errorAudio);
      (await ae()).setBlend(l.current.blend);
      const f = await Ar(m, l.current.level);
      if (!f.ok) return void r(f.error);
      ut(m), o(m);
      const b = { ...l.current, id: m };
      n(b), it(b);
    },
    [c]
  ), k = T((m) => u(() => void p(m)), [u, p]), S = T(() => {
    ut(null), o(null), ae().then((m) => m.stopSample());
  }, []), M = T((m, h) => {
    const f = { ...l.current, ...m };
    n(f), it(f), ct() !== null && ae().then(h);
  }, []), v = T((m) => M({ blend: m }, (h) => h.setBlend(m)), [M]), w = T((m) => M({ level: m }, (h) => h.setSampleLevel(m)), [M]);
  return { prefs: t, on: a, message: s, start: k, stop: S, setBlend: v, setLevel: w };
}
async function Er() {
  Lo(), await Sr();
}
function Tr() {
  const { player: e, store: t, engine: n } = ft(), [a, o] = A(() => e.snapshot()), [s, r] = A(Mn), [l, c] = A(!1), [u, p, k] = An(), S = _(null), M = _(s);
  C(() => (o(e.snapshot()), e.subscribe(o)), [e]);
  const v = T(
    (b) => {
      M.current ? b() : (S.current = b, c(!0));
    },
    []
  ), w = T(() => {
    Nn(En, !0), M.current = !0, r(!0), c(!1);
    const b = S.current;
    S.current = null, b == null || b();
  }, []), m = T(() => {
    S.current = null, c(!1);
  }, []), h = T(
    (b, N) => v(() => {
      e.setQueue([b]), e.playTemplate(b).then((O) => {
        O && N !== null && e.startTimer(typeof N == "number" ? { kind: "countdown", minutes: N } : N);
      });
    }),
    [e, v]
  ), f = T(() => {
    e.snapshot().playing ? e.stop() : v(() => void e.play());
  }, [e, v]);
  return { engine: n, player: e, store: t, snap: a, accepted: s, gate: l, reduced: u, setReduced: p, userReduced: k, guarded: v, accept: w, cancelGate: m, playTemplate: h, toggle: f };
}
function Lr(e, t) {
  const [n, a] = A("standalone"), [o, s] = A(() => Tn());
  C(() => Ln(s), []), C(() => {
    let l = !1;
    const c = new Cn({
      ...t !== void 0 ? { create: t } : {},
      onStatus: (u) => {
        a(u), u === "standalone" && (de().source !== "demo" && e.crewLost(), l && zn(), l = !1);
      },
      onState: (u) => {
        l = !0, Rn(e, u);
      }
    });
    return c.start(), () => c.stop();
  }, [e, t]);
  const r = dn(On, de, de);
  return { enabled: o, status: n, view: r };
}
function Cr(e, t = Date.now) {
  const [n, a] = A(() => is(e)), o = T(
    (r, l) => {
      a((c) => {
        const u = cs(c, { id: r, a: l, day: K(t()) });
        return ls(e, u), u;
      });
    },
    [e, t]
  ), s = T(() => {
    us(e), a([]);
  }, [e]);
  return B(() => ({ entries: n, answer: o, clear: s }), [n, o, s]);
}
const Or = { kind: "pomodoro", focusMin: 25, breakMin: 5 }, Rr = ["starter-rain", "starter-deep"], zr = 0.8, Dr = 6e3, _r = { chimeLevel: 0.25, chimeRatePerMin: 10 };
function Ir(e, t) {
  return t.kind !== "pomodoro" ? { phase: "end", action: "cancel" } : e === "focus" && t.phase === "break" ? { phase: "break", action: "break" } : e === "break" && t.phase === "focus" ? { phase: "end", action: "finish" } : { phase: e, action: null };
}
function Pr(e, t) {
  const n = Rr.find((a) => a !== e);
  return t.find((a) => a.id === n);
}
function Br(e, t) {
  return !Number.isFinite(e) || !Number.isFinite(t) ? 0 : Math.round(Math.min(0, e * zr - t) * 1e3) / 1e3;
}
async function Hr(e, t, n = (a, o) => window.setTimeout(a, o)) {
  const a = e.snapshot().voice.gain;
  e.setLayerOverride(_r), n(() => e.clearLayerOverrides(), Dr), await e.playTemplate(t) && e.nudgeGain(Br(a, e.snapshot().voice.gain));
}
function Fr(e) {
  const [t, n] = A(null), a = _(!1), { player: o, guarded: s } = e, { playing: r, templateId: l, timer: c } = e.snap, u = T(() => {
    n(null), o.stopTimer();
  }, [o]), p = T(
    (k) => s(() => {
      a.current = !1;
      const S = () => {
        o.startTimer(Or), n({ focus: k, breakId: null, phase: "focus" });
      };
      if (o.snapshot().playing && o.snapshot().templateId === k.id) return S();
      o.setQueue([k]), o.playTemplate(k).then((M) => M && S());
    }),
    [o, s]
  );
  return C(() => {
    if (t === null) return;
    if (r) a.current = !0;
    else if (a.current) return u();
    const k = Ir(t.phase, c);
    if (k.action === "cancel") return n(null);
    if (k.action === null) {
      r && l !== t.focus.id && l !== t.breakId && u();
      return;
    }
    if (k.action === "break") {
      const S = Pr(t.focus.id, P());
      n({ ...t, phase: "break", breakId: (S == null ? void 0 : S.id) ?? null }), S !== void 0 && Hr(o, S);
      return;
    }
    n(null), o.stopTimer(), o.stop();
  }, [t, r, l, c, o, u]), B(
    () => ({ active: t !== null, phase: (t == null ? void 0 : t.phase) ?? null, focus: (t == null ? void 0 : t.focus) ?? null, start: p, cancel: u }),
    [t, p, u]
  );
}
const Ae = 500, Ne = { v: 1, items: [] };
function xr(e, t) {
  if (!Ge(e) || Y(e, "v") !== 1) return Ne;
  const n = Y(e, "items");
  if (!Array.isArray(n)) return Ne;
  const a = [], o = /* @__PURE__ */ new Set();
  for (const s of n.slice(0, Ae * 2)) {
    if (!Ge(s)) continue;
    const r = Y(s, "kind"), l = gt(Y(s, "id"));
    if (r !== "template" && r !== "mix" || l === null) continue;
    const c = `${r}:${l}`;
    if (!o.has(c) && (o.add(c), a.push({ kind: r, id: l, at: Dn(Y(s, "at"), 0, t + 864e5, t) }), a.length >= Ae))
      break;
  }
  return { v: 1, items: a };
}
function an(e, t, n) {
  return e.items.some((a) => a.kind === t && a.id === n);
}
function jr(e, t, n, a) {
  return an(e, t, n) ? { v: 1, items: e.items.filter((o) => !(o.kind === t && o.id === n)) } : gt(n) === null || e.items.length >= Ae ? e : { v: 1, items: [{ kind: t, id: n, at: a }, ...e.items] };
}
function $r(e, t) {
  const [n, a] = A(Ne);
  C(() => {
    let s = !0;
    return e.getRecord("favorites").then((r) => s && a(xr(r, Date.now()))).catch(() => {
    }), () => {
      s = !1;
    };
  }, [e]);
  const o = T(() => {
    if (t === null) return;
    const s = jr(n, "template", t, Date.now());
    a(s), e.setRecord("favorites", s).catch(() => {
    });
  }, [n, t, e]);
  return { on: t !== null && an(n, "template", t), toggle: o };
}
const Gr = z(() => import("./chunk-Onboarding-DJkgwxA9.mjs").then((e) => ({ default: e.Onboarding }))), Wr = (e) => Math.max(180, e * 60 * 0.8);
function qr({ engine: e, clock: t, store: n, bridgeCreate: a, onStudio: o }) {
  var xe;
  const s = Tr(), r = Hs(s.store, s.snap.playing), l = Lr(s.player, a), c = Nr(s), [u, p] = A("today"), [k, S] = A(null), M = _(null), v = $r(s.store, s.snap.templateId), w = Cr(r.storage), m = Fr(s), h = r.profile.createdAt === 0, f = Vr(r.storage), b = Ts(s.snap, !h && u !== "reset" && u !== "breathe", m.focus === null ? null : { id: m.focus.id, name: d.sprintName }), N = s.reduced || r.profile.extraGentle, { look: O, prefs: R, dim: Q, setPrefs: on } = mr();
  Jr(o);
  const ce = T((H) => p(H), []), { play: Fe, playDay: rn, finish: ln } = Yr({ s, data: r, last: f, end: b, active: M, setView: p });
  Zr(s.snap.playing, s.snap.elapsedSec, M, r.progress, r.setJourney);
  const cn = (H) => {
    S(H), p("journey");
  }, un = () => {
    ks(r.storage), w.clear(), c.stop(), Er(), r.setProfile(Lt), p("today");
  };
  return /* @__PURE__ */ y("div", { className: "c-app", "data-theme": O.theme, "data-contrast": O.highContrast ? "high" : "normal", "data-view": u, "data-dim": Q ? "true" : "false", "data-motion": N ? "off" : "on", "data-playing": s.snap.playing ? "true" : "false", children: [
    /* @__PURE__ */ i(Xr, {}),
    l.view.source === "demo" && /* @__PURE__ */ i("p", { className: "c-badge-sim", role: "status", "data-testid": "demo-badge", children: d.crewDemoBadge }),
    /* @__PURE__ */ i("main", { id: "c-main", className: "c-main", tabIndex: -1, children: /* @__PURE__ */ i(q, { fallback: /* @__PURE__ */ i("p", { className: "c-loading", role: "status", children: d.loading }), children: h ? /* @__PURE__ */ i(
      Gr,
      {
        playing: s.snap.playing,
        reduced: N,
        initial: r.profile,
        onAccept: s.accept,
        onPreview: (H) => s.playTemplate(H, null),
        onStop: () => void s.player.stop(),
        onFinish: ln
      }
    ) : /* @__PURE__ */ i(
      tr,
      {
        view: u,
        journeyId: k,
        s,
        data: r,
        crewInfo: l,
        nature: c,
        still: N,
        fav: v,
        last: f.template,
        look: O,
        prefs: R,
        onPrefs: on,
        feel: w.entries,
        sprint: m,
        handlers: { go: ce, play: Fe, playDay: rn, openJourney: cn, forget: un, onStudio: o, onMix: (H) => s.guarded(() => s.player.playMix(H)) }
      }
    ) }) }),
    !h && u !== "player" && u !== "reset" && u !== "breathe" && /* @__PURE__ */ i(Ha, { snap: s.snap, crewPresetId: ((xe = l.view.state) == null ? void 0 : xe.target.presetId) ?? null, onOpen: () => ce("player"), onStop: () => void s.player.stop() }),
    !h && /* @__PURE__ */ i(Pa, { view: u, onGo: ce, reduced: N }),
    /* @__PURE__ */ i("p", { className: "c-sr", role: "status", "data-testid": "play-status", children: s.snap.playing ? `Playing. ${d.volumeCapped}` : "Stopped." }),
    b.card !== null && !s.snap.playing && /* @__PURE__ */ i(Kr, { card: b.card, play: Fe, dismiss: b.dismiss, feel: w, firstRun: K(r.profile.createdAt) === U() }),
    s.gate && /* @__PURE__ */ i(Ds, { onAccept: s.accept, onCancel: s.cancelGate })
  ] });
}
function Kr({ card: e, play: t, dismiss: n, feel: a, firstRun: o }) {
  return /* @__PURE__ */ i(Os, { info: e, onAgain: () => Ur(e.id, t), onClose: n, firstRun: o, onFeel: (s) => a.answer(e.id, s) });
}
function dt(e, t) {
  return t === null ? null : e === "sleep" ? { kind: "sleep-fade", minutes: Math.max(_t, t) } : { kind: "countdown", minutes: t };
}
function Yr({ s: e, data: t, last: n, end: a, active: o, setView: s }) {
  const r = T(
    (u, p = u.recommendedMinutes, k = t.profile.goal) => {
      o.current = null, n.remember(u.id), a.dismiss(), e.playTemplate(u, dt(k, p)), s("player");
    },
    [e, n, a, o, s, t.profile.goal]
  );
  return { play: r, playDay: (u, p, k) => {
    r(k), o.current = { id: u, no: p, needSec: Wr(k.recommendedMinutes) };
  }, finish: (u, p) => {
    if (t.setProfile(u), !e.snap.playing || e.snap.templateId !== p.id) return r(p, p.recommendedMinutes, u.goal);
    n.remember(p.id), e.player.startTimer(dt(u.goal, p.recommendedMinutes) ?? { kind: "countdown", minutes: p.recommendedMinutes }), s("player");
  } };
}
const sn = (e) => e === null ? null : P().find((t) => t.id === e) ?? null;
function Ur(e, t) {
  const n = sn(e);
  n !== null && t(n);
}
function Vr(e) {
  const [t, n] = A(() => Ms(e)), a = B(() => sn(t), [t]), o = T(
    (s) => {
      As(e, s), n(s);
    },
    [e]
  );
  return B(() => ({ template: a, remember: o }), [a, o]);
}
function Jr(e) {
  C(() => {
    const t = (n) => {
      n.altKey && n.shiftKey && n.code === "KeyS" && (n.preventDefault(), e());
    };
    return window.addEventListener("keydown", t), () => window.removeEventListener("keydown", t);
  }, [e]);
}
function Xr() {
  return /* @__PURE__ */ y(Ee, { children: [
    /* @__PURE__ */ i("a", { className: "c-skip", href: "#c-main", children: "Skip to content" }),
    /* @__PURE__ */ i("header", { className: "c-topbar", children: /* @__PURE__ */ i("span", { className: "c-brand", children: d.brand }) })
  ] });
}
function Zr(e, t, n, a, o) {
  C(() => {
    const s = n.current, r = s === null ? void 0 : a[s.id];
    !e || s === null || r === void 0 || t < s.needSec || (n.current = null, r.doneDays.includes(s.no) || o(s.id, { ...r, doneDays: [...r.doneDays, s.no].sort((l, c) => l - c) }));
  }, [e, t, n, a, o]);
}
const Qr = {
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
function ci() {
  _n(import.meta.url), In();
  const { engine: e, store: t } = ft();
  C(() => (We(!0), () => We(!1)), []);
  const [n, a] = A(!1);
  return /* @__PURE__ */ y("div", { "data-testid": "zonked-app", style: { height: "100%", minHeight: 0, overflow: "hidden", position: "relative", transform: "translateZ(0)" }, children: [
    /* @__PURE__ */ i("div", { style: { height: "100%", overflowY: "auto" }, children: /* @__PURE__ */ i(qr, { engine: e, store: t, onStudio: () => a(!0) }) }),
    n && /* @__PURE__ */ i("p", { role: "status", style: Qr, "data-testid": "studio-note", onClick: () => a(!1), children: "Studio, the advanced mode, is not in the Kiro Crew app yet. Tap to close." })
  ] });
}
export {
  si as B,
  Lt as D,
  Fa as G,
  Te as I,
  wt as J,
  $t as M,
  Ne as N,
  _a as P,
  Ds as S,
  xa as T,
  ci as Z,
  ja as a,
  P as b,
  xr as c,
  bt as d,
  lr as e,
  ro as f,
  ai as g,
  io as h,
  ri as i,
  ii as j,
  Sr as k,
  oi as l,
  Va as p,
  Je as r,
  co as u,
  li as v
};
