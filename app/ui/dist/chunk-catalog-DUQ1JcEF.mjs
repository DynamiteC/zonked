import { i as e, t } from "./chunk-soundMenu-C52iaQfx.mjs";
import "./chunk-crewLink-DfIjAvPP.mjs";
// ../../web/src/catalog/dsl.ts
function n(e) {
	return {
		modes: ["binaural"],
		noises: [["off", 0]],
		layers: [[]],
		intensity: 2,
		gain: .45,
		jitter: .3,
		tags: [],
		...e
	};
}
var r = (e, t) => e[(t % e.length + e.length) % e.length], i = [
	98,
	110,
	123.5,
	87.3,
	103.8,
	130.8
], a = [
	196,
	220,
	247,
	175,
	165,
	262
], o = {
	calm: [4, 3],
	warm: [6, 2],
	dreamy: [4, 3],
	bright: [2, 5],
	deep: [7, 5],
	energized: [2, 3],
	grounded: [6, 1],
	ethereal: [4, 3],
	lofi: [
		1,
		2,
		5
	],
	minimal: [7, 4]
}, s = (e) => [...e].reduce((e, t) => (e * 31 + t.charCodeAt(0)) % 9973, 7);
function c(e, t, n) {
	let c = s(e) + n;
	return {
		prog: r(o[t], c),
		key: r(i, c),
		pianoRoot: r(a, c >> 1)
	};
}
function l(e, t, n) {
	let i = e === "dreamy" || e === "ethereal" || e === "calm";
	return {
		breathDepth: r([
			.45,
			.4,
			.3,
			.2,
			.1
		], t - 1),
		breathRateHz: .06 + n % 5 * .02,
		stereoWidth: .3 + n % 4 * .1,
		panDepth: i ? .15 : 0,
		panRateHz: .03 + n % 4 * .01
	};
}
var u = {
	lofi: (e, t) => ({
		lofiLevel: .45,
		lofiWarmth: r([
			.5,
			.6,
			.7
		], e),
		lofiProgression: t.prog,
		tapeWow: r([
			.25,
			.35,
			.45
		], e),
		padRootHz: t.key
	}),
	piano: (e, t) => ({
		instLevel: .35,
		instKind: 3,
		instRootHz: t.pianoRoot,
		instScale: r([
			2,
			0,
			1,
			4,
			3
		], e),
		instBpm: r([
			40,
			46,
			52
		], e),
		pianoPedal: r([
			.4,
			.55,
			.7
		], e)
	}),
	crackle: () => ({ crackle: .12 }),
	drone: (e) => ({
		instLevel: .35,
		instKind: 1,
		instRootHz: r([
			55,
			62,
			73,
			82
		], e),
		instScale: 7,
		instBpm: 40
	}),
	pluck: (e) => ({
		instLevel: .3,
		instKind: 0,
		instRootHz: r([
			196,
			220,
			247,
			262
		], e),
		instScale: r([
			0,
			2,
			4,
			1
		], e),
		instBpm: r([
			48,
			56,
			64,
			72
		], e)
	}),
	bell: (e) => ({
		instLevel: .28,
		instKind: 2,
		instRootHz: r([
			262,
			294,
			330,
			349
		], e),
		instScale: 4,
		instBpm: 40
	}),
	pad: (e, t) => ({
		padLevel: .4,
		padChord: r([
			0,
			2,
			4,
			6
		], e),
		padRootHz: t.key
	}),
	chimes: (e) => ({
		chimeLevel: .25,
		chimeRatePerMin: r([
			3,
			4,
			6,
			8
		], e)
	}),
	perc: (e) => ({
		percLevel: .2,
		percBpm: r([
			64,
			72,
			80,
			92
		], e),
		percPattern: r([
			0,
			3,
			4,
			7
		], e)
	})
};
function d(e, t, n = {
	prog: 0,
	key: 110,
	pianoRoot: 220
}) {
	return e.reduce((e, r) => ({
		...e,
		...u[r](t, n)
	}), {});
}
var f = (e) => Math.round(e * 1e3) / 1e3, p = (e) => Math.min(40, Math.max(.5, e));
function ee(e, t, n, r, i) {
	let a = Math.min(5, Math.max(1, t * .15));
	if (e === "plateau") {
		let e = [{
			t: 0,
			beat: n,
			ramp: !0
		}, {
			t: a,
			beat: r,
			ramp: i !== void 0
		}];
		return i !== void 0 && e.push({
			t: t - a,
			beat: r,
			ramp: !0
		}, {
			t,
			beat: i,
			ramp: !1
		}), e;
	}
	if (e === "ramp-down" || e === "ramp-up") return [{
		t: 0,
		beat: n,
		ramp: !0
	}, {
		t: t * .7,
		beat: r,
		ramp: !1
	}];
	if (e === "wave") return Array.from({ length: 7 }, (e, i) => ({
		t: t * i / 6,
		beat: i % 2 == 0 ? n : r,
		ramp: i < 6
	}));
	let o = t / 4;
	return Array.from({ length: 4 }, (e, t) => {
		let i = n + (r - n) * t / 3;
		return t < 3 ? [{
			t: t * o,
			beat: i,
			ramp: !1
		}, {
			t: t * o + o * .75,
			beat: i,
			ramp: !0
		}] : [{
			t: t * o,
			beat: i,
			ramp: !1
		}];
	}).flat();
}
function m(e, t, n, i, a) {
	let o = (t % 3 - 1) * e.jitter, s = p(e.to + o), u = r(e.noises, t >> 1), m = r(e.layers, t * 2 + (t >> 1)), h = r(e.vibes, t), g = d(m, t, c(e.slug, h, t)), _ = Object.keys(g).length > 0, v = _ ? {
		...g,
		...l(h, e.intensity, t)
	} : g;
	return ee(e.shape, n, p(e.from), s, e.ret).map((t) => ({
		atMin: f(t.t),
		beatHz: f(p(t.beat)),
		carrierHz: i,
		gain: e.gain,
		mode: a,
		noise: u[0],
		noiseLevel: u[1],
		..._ ? { layers: v } : {},
		ramp: t.ramp
	}));
}
function h(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e) {
		t.add(n.mode);
		let e = n.layers;
		n.noise !== "off" && n.noiseLevel > 0 && t.add("noise"), e !== void 0 && (((e.lofiLevel ?? 0) > 0 || (e.crackle ?? 0) > 0) && t.add("lofi"), (e.instLevel ?? 0) > 0 && t.add("instrument"), (e.padLevel ?? 0) > 0 && t.add("pad"), (e.chimeLevel ?? 0) > 0 && t.add("chimes"), (e.percLevel ?? 0) > 0 && t.add("percussion"));
	}
	return [...t];
}
function g(e, t) {
	if (t > 3) return !1;
	let n = e.every((t, n) => n === 0 || Math.abs(t.beatHz - (e[n - 1]?.beatHz ?? t.beatHz)) <= 4), r = e.every((e) => e.mode === "isochronic" || e.beatHz >= 12 && e.beatHz <= 20), i = e.every((e) => (e.layers?.crackle ?? 0) === 0 && (e.layers?.percBpm ?? 0) <= 100);
	return n && r && i;
}
function _(e, t) {
	let n = e.adjectives.length, i = t * 7 % (n * e.nouns.length);
	return `${r(e.adjectives, i)} ${r(e.nouns, Math.floor(i / n))}`;
}
var v = (e) => String(e).padStart(2, "0"), y = {
	binaural: "Binaural",
	monaural: "Monaural",
	isochronic: "Isochronic"
}, te = [
	"lofi",
	"instrument",
	"pad",
	"chimes",
	"percussion"
];
function ne(e, t, n, r, i) {
	let a = i[0], o = [`${y[e]}, ${t} Hz carrier, ${n} minutes, ${r} mood`];
	a !== void 0 && a.noise !== "off" && a.noiseLevel > 0 && o.push(`${a.noise} noise`);
	let s = i[i.length - 1];
	a !== void 0 && s !== void 0 && a.beatHz !== s.beatHz && o.push(`beat ${a.beatHz} to ${s.beatHz} Hz`);
	let c = h(i).filter((e) => te.includes(e));
	return c.length > 0 && o.push(c.join(" and ")), `${o.join(", ")}.`;
}
function b(e, t, n, i) {
	let a = r(t.mins, n), o = r(t.carriers, n * 3 + 1), s = r(t.modes, n + (n >> 2)), c = m(t, n, a, o, s), l = t.to < 4 ? "delta" : t.to < 8 ? "theta" : t.to < 12 ? "alpha" : t.to < 30 ? "beta" : "gamma";
	return {
		id: `${e.prefix}-${t.slug}-${v(n + 1)}`,
		name: _(e, i),
		category: e.category,
		vibe: r(t.vibes, n),
		tags: [
			t.slug,
			l,
			s,
			...t.tags
		],
		layerTags: h(c),
		situations: t.situations,
		recommendedMinutes: a,
		intensity: t.intensity,
		adhdFriendly: g(c, t.intensity),
		stages: c,
		reasonTemplate: `${t.reason.replace("{tone}", y[s])} ${ne(s, o, a, r(t.vibes, n), c)}`,
		source: "original",
		...t.breath === void 0 ? {} : { breath: t.breath }
	};
}
function x(e) {
	let t = 0;
	return re(e.archs.flatMap((n) => Array.from({ length: n.count }, (r, i) => b(e, n, i, t++))));
}
function re(e) {
	let t = /* @__PURE__ */ new Map();
	return e.map((e) => {
		let n = e.reasonTemplate.replaceAll("{minutes}", String(e.recommendedMinutes)), r = (t.get(n) ?? 0) + 1;
		return t.set(n, r), r === 1 ? e : {
			...e,
			reasonTemplate: `${e.reasonTemplate} Alternate take ${r}.`
		};
	});
}
// ../../web/src/catalog/archetypes/adhd-control.ts
var S = {
	category: "adhd-control",
	prefix: "adhd",
	adjectives: [
		"Steady",
		"Anchored",
		"Level",
		"Even",
		"Tidy",
		"Calm",
		"Focused",
		"Plain",
		"Settled",
		"Patient",
		"Smooth",
		"Constant"
	],
	nouns: [
		"Anchor",
		"Rail",
		"Tracks",
		"Rhythm",
		"Metronome",
		"Lane",
		"Thread",
		"Pulse",
		"Desk",
		"Checklist",
		"Runway",
		"Keel"
	],
	archs: [
		n({
			slug: "smr-steady",
			shape: "plateau",
			from: 12,
			to: 13.5,
			mins: [
				20,
				30,
				45
			],
			carriers: [
				200,
				220,
				240
			],
			modes: [
				"isochronic",
				"isochronic",
				"monaural"
			],
			noises: [["pink", .18], ["brown", .2]],
			layers: [[], ["lofi"]],
			vibes: ["minimal", "grounded"],
			situations: ["adhd-focus", "deep-work"],
			intensity: 2,
			gain: .42,
			count: 5,
			jitter: .4,
			reason: "Steady SMR-range pulse with no changes to track, for {minutes} minutes."
		}),
		n({
			slug: "beta-anchor",
			shape: "plateau",
			from: 14,
			to: 16,
			mins: [
				25,
				30,
				45,
				50
			],
			carriers: [
				210,
				230,
				250
			],
			modes: ["isochronic", "monaural"],
			noises: [["pink", .15], ["off", 0]],
			layers: [[], ["lofi"]],
			vibes: [
				"grounded",
				"bright",
				"minimal"
			],
			situations: ["adhd-focus", "deep-work"],
			intensity: 3,
			gain: .42,
			count: 5,
			jitter: .5,
			reason: "A constant low-beta pulse that never changes."
		}),
		n({
			slug: "cadence-pulse",
			shape: "plateau",
			from: 14,
			to: 15,
			mins: [
				20,
				25,
				30
			],
			carriers: [200, 220],
			modes: ["isochronic"],
			noises: [["pink", .12]],
			layers: [["perc"], ["perc", "lofi"]],
			vibes: ["energized", "grounded"],
			situations: ["adhd-focus", "deep-work"],
			intensity: 3,
			gain: .4,
			count: 4,
			reason: "Gentle soft percussion at a fixed 60 to 100 bpm cadence keeps tempo without surprises."
		}),
		n({
			slug: "quiet-bed",
			shape: "plateau",
			from: 13,
			to: 13,
			mins: [
				30,
				45,
				60
			],
			carriers: [190, 210],
			modes: ["isochronic", "monaural"],
			noises: [["brown", .3], ["pink", .25]],
			layers: [["lofi"], ["lofi", "piano"]],
			vibes: [
				"lofi",
				"minimal",
				"warm"
			],
			situations: ["adhd-focus", "deep-work"],
			intensity: 2,
			gain: .4,
			count: 4,
			jitter: 0,
			reason: "A fixed warm bed with nothing that changes, so it fades into the background."
		}),
		n({
			slug: "start-ramp",
			shape: "ramp-up",
			from: 11,
			to: 15,
			mins: [
				15,
				20,
				25
			],
			carriers: [200, 220],
			modes: ["isochronic", "monaural"],
			noises: [["pink", .15]],
			layers: [[], ["pluck"]],
			vibes: ["bright", "energized"],
			situations: ["adhd-focus", "quick-reset"],
			intensity: 2,
			gain: .42,
			count: 4,
			jitter: .2,
			reason: "A slow climb from 4 Hz with no sudden steps."
		}),
		n({
			slug: "sprint-steps",
			shape: "ladder",
			from: 13,
			to: 16,
			mins: [
				20,
				25,
				30
			],
			carriers: [210, 230],
			modes: ["isochronic"],
			noises: [["off", 0], ["pink", .12]],
			layers: [["perc"], []],
			vibes: ["energized", "grounded"],
			situations: ["adhd-focus", "deep-work"],
			intensity: 3,
			gain: .4,
			count: 4,
			jitter: .2,
			reason: "Four small, announced steps through the beta band for a structured work block."
		})
	]
}, C = {
	category: "focus",
	prefix: "focus",
	adjectives: [
		"Sharp",
		"Deep",
		"Clear",
		"Lucid",
		"Bright",
		"Keen",
		"Locked",
		"Precise",
		"Crisp",
		"Direct",
		"Tuned",
		"Honed"
	],
	nouns: [
		"Beam",
		"Signal",
		"Compass",
		"Engine",
		"Vector",
		"Prism",
		"Forge",
		"Spire",
		"Circuit",
		"Current",
		"Summit",
		"Scope"
	],
	archs: [
		n({
			slug: "alpha-beta",
			shape: "plateau",
			from: 11,
			to: 14,
			mins: [
				25,
				45,
				60
			],
			carriers: [
				200,
				220,
				240
			],
			modes: [
				"binaural",
				"isochronic",
				"monaural"
			],
			noises: [["pink", .15]],
			layers: [
				[],
				["lofi"],
				["pluck"]
			],
			vibes: [
				"bright",
				"minimal",
				"grounded"
			],
			situations: ["deep-work", "adhd-focus"],
			intensity: 2,
			gain: .42,
			count: 5,
			reason: "A pulse on the alpha-beta border for {minutes} minutes."
		}),
		n({
			slug: "deep-beta",
			shape: "plateau",
			from: 15,
			to: 18,
			mins: [
				30,
				45,
				60,
				90
			],
			carriers: [
				220,
				240,
				260
			],
			modes: ["binaural", "isochronic"],
			noises: [["pink", .15], ["off", 0]],
			layers: [[], ["perc"]],
			vibes: ["energized", "bright"],
			situations: ["deep-work"],
			intensity: 3,
			gain: .42,
			count: 5,
			reason: "A steady beta-band pulse for long work blocks."
		}),
		n({
			slug: "gamma-edge",
			shape: "ramp-up",
			from: 18,
			to: 35,
			mins: [
				10,
				15,
				20
			],
			carriers: [
				240,
				260,
				280
			],
			modes: ["isochronic", "binaural"],
			noises: [["off", 0]],
			layers: [[]],
			vibes: ["energized", "bright"],
			situations: ["deep-work"],
			intensity: 4,
			gain: .4,
			count: 4,
			reason: "A short climb to the high-beta and low-gamma edge."
		}),
		n({
			slug: "flow-ramp",
			shape: "ramp-up",
			from: 10,
			to: 16,
			mins: [
				30,
				45,
				60
			],
			carriers: [210, 230],
			modes: ["binaural", "monaural"],
			noises: [["pink", .12]],
			layers: [["pluck"], ["lofi", "pluck"]],
			vibes: [
				"warm",
				"bright",
				"lofi"
			],
			situations: ["deep-work", "adhd-focus"],
			intensity: 2,
			gain: .42,
			count: 4,
			reason: "A slow glide from alpha into beta."
		}),
		n({
			slug: "reading-calm",
			shape: "plateau",
			from: 10,
			to: 12,
			mins: [
				30,
				45,
				60
			],
			carriers: [190, 210],
			modes: ["binaural", "monaural"],
			noises: [["brown", .2]],
			layers: [["piano"], []],
			vibes: [
				"calm",
				"deep",
				"warm"
			],
			situations: ["deep-work", "meditate"],
			intensity: 1,
			gain: .4,
			count: 4,
			reason: "Gentle alpha for reading and study."
		}),
		n({
			slug: "sprint-pulse",
			shape: "ladder",
			from: 12,
			to: 20,
			mins: [
				20,
				25,
				30
			],
			carriers: [220, 240],
			modes: ["isochronic", "binaural"],
			noises: [["off", 0]],
			layers: [["perc"], ["perc", "pluck"]],
			vibes: ["energized", "bright"],
			situations: ["deep-work", "adhd-focus"],
			intensity: 3,
			gain: .4,
			count: 4,
			reason: "Four rising steps with soft percussion."
		})
	]
}, w = {
	category: "healing",
	prefix: "healing",
	adjectives: [
		"Mending",
		"Tender",
		"Restoring",
		"Kind",
		"Balmy",
		"Soothing",
		"Renewing",
		"Warming",
		"Settled",
		"Easing",
		"Gentle",
		"Whole"
	],
	nouns: [
		"Balm",
		"Spring",
		"Embrace",
		"Garden",
		"Shelter",
		"Glow",
		"Rain",
		"Hearth",
		"Sunrise",
		"Quilt",
		"Oasis",
		"Haven"
	],
	archs: [
		n({
			slug: "tension-release",
			shape: "ramp-down",
			from: 14,
			to: 8,
			mins: [
				15,
				20,
				30
			],
			carriers: [
				180,
				200,
				220
			],
			modes: [
				"binaural",
				"isochronic",
				"monaural"
			],
			noises: [["pink", .2]],
			layers: [
				["piano", "pad"],
				["pluck"],
				["pad", "chimes"]
			],
			vibes: ["warm", "calm"],
			situations: [
				"heal-stress",
				"ai-burnout",
				"quick-reset"
			],
			intensity: 2,
			gain: .42,
			count: 5,
			reason: "Starts at a busier pace and slows to a relaxed one over {minutes} minutes."
		}),
		n({
			slug: "restore-theta",
			shape: "plateau",
			from: 9,
			to: 6,
			mins: [
				20,
				30,
				45
			],
			carriers: [160, 180],
			modes: ["binaural", "monaural"],
			noises: [["brown", .2]],
			layers: [
				["drone"],
				["pad"],
				["bell"]
			],
			vibes: [
				"deep",
				"warm",
				"ethereal"
			],
			situations: ["heal-stress", "meditate"],
			intensity: 2,
			gain: .4,
			count: 5,
			reason: "Steady theta with a soft drone."
		}),
		n({
			slug: "heart-calm",
			shape: "plateau",
			from: 10,
			to: 7.5,
			ret: 10,
			mins: [
				10,
				15,
				20
			],
			carriers: [190, 210],
			modes: ["binaural", "isochronic"],
			noises: [["off", 0], ["pink", .15]],
			layers: [["pad", "pluck"], ["pad"]],
			vibes: ["warm", "grounded"],
			situations: [
				"heal-stress",
				"quick-reset",
				"ai-burnout"
			],
			intensity: 2,
			gain: .42,
			count: 4,
			breath: {
				inSec: 5,
				outSec: 5
			},
			reason: "A slow rhythm of 6 breaths per minute to follow."
		}),
		n({
			slug: "ache-ease",
			shape: "wave",
			from: 10,
			to: 7,
			mins: [
				30,
				45,
				60
			],
			carriers: [150, 170],
			modes: ["monaural", "binaural"],
			noises: [["brown", .3]],
			layers: [["pad"], []],
			vibes: ["calm", "warm"],
			situations: ["heal-stress"],
			intensity: 1,
			gain: .38,
			count: 4,
			reason: "Slow alpha-theta swells that feel like a rocking tide."
		}),
		n({
			slug: "soothe-glide",
			shape: "ramp-down",
			from: 12,
			to: 6,
			mins: [20, 30],
			carriers: [170, 190],
			modes: ["binaural", "monaural"],
			noises: [["pink", .25]],
			layers: [["pad", "chimes"], ["bell"]],
			vibes: ["ethereal", "calm"],
			situations: ["heal-stress", "meditate"],
			intensity: 2,
			gain: .4,
			count: 4,
			reason: "A soft pad with a gliding beat."
		}),
		n({
			slug: "sunrise-lift",
			shape: "ramp-up",
			from: 7,
			to: 11,
			mins: [
				15,
				20,
				30
			],
			carriers: [
				190,
				210,
				230
			],
			modes: ["binaural", "isochronic"],
			noises: [["off", 0]],
			layers: [["pluck", "pad"], ["bell"]],
			vibes: ["bright", "warm"],
			situations: ["heal-stress", "quick-reset"],
			intensity: 2,
			gain: .42,
			count: 4,
			reason: "A gentle brightening ramp that stays soft."
		})
	]
}, T = {
	category: "lucid-dreams",
	prefix: "lucid",
	adjectives: [
		"Waking",
		"Silver",
		"Nebula",
		"Astral",
		"Twilight",
		"Aware",
		"Hollow",
		"Starlit",
		"Liminal",
		"Vivid",
		"Opal",
		"Drifting"
	],
	nouns: [
		"Gate",
		"Compass",
		"Mirror",
		"Skyway",
		"Threshold",
		"Door",
		"Voyage",
		"Lens",
		"Bridge",
		"Beacon",
		"Garden",
		"Orbit"
	],
	archs: [
		n({
			slug: "wbtb-theta",
			shape: "plateau",
			from: 9,
			to: 5,
			ret: 8,
			mins: [
				90,
				120,
				180
			],
			carriers: [
				160,
				180,
				200
			],
			modes: ["binaural", "monaural"],
			noises: [["pink", .15]],
			layers: [["piano", "pad"], ["pad", "chimes"]],
			vibes: [
				"dreamy",
				"ethereal",
				"deep"
			],
			situations: ["lucid-dream", "cant-sleep"],
			intensity: 2,
			gain: .4,
			count: 6,
			reason: "Theta plateau with a light return, built for wake-back-to-bed lucid practice."
		}),
		n({
			slug: "rem-ladder",
			shape: "ladder",
			from: 8,
			to: 4,
			mins: [
				60,
				90,
				120
			],
			carriers: [150, 170],
			modes: ["binaural", "isochronic"],
			noises: [["brown", .2]],
			layers: [["pad"], ["drone"]],
			vibes: ["deep", "dreamy"],
			situations: ["lucid-dream"],
			intensity: 2,
			gain: .4,
			count: 5,
			reason: "Steps down through theta in four stages."
		}),
		n({
			slug: "aware-wave",
			shape: "wave",
			from: 5,
			to: 8,
			mins: [60, 90],
			carriers: [160, 190],
			modes: ["binaural", "monaural"],
			noises: [["pink", .15]],
			layers: [["pad", "chimes"], ["bell"]],
			vibes: ["ethereal", "dreamy"],
			situations: ["lucid-dream"],
			intensity: 2,
			gain: .4,
			count: 5,
			reason: "Slow swings between theta and alpha."
		}),
		n({
			slug: "dream-drift",
			shape: "ramp-down",
			from: 10,
			to: 4.5,
			mins: [
				30,
				45,
				60
			],
			carriers: [
				140,
				160,
				180
			],
			modes: [
				"binaural",
				"isochronic",
				"monaural"
			],
			noises: [["brown", .2], ["pink", .2]],
			layers: [["pad"], []],
			vibes: [
				"dreamy",
				"calm",
				"ethereal"
			],
			situations: ["lucid-dream", "cant-sleep"],
			intensity: 1,
			gain: .4,
			count: 5,
			reason: "A slow descent over {minutes} minutes."
		}),
		n({
			slug: "astral-calm",
			shape: "plateau",
			from: 10,
			to: 6,
			mins: [
				30,
				45,
				60
			],
			carriers: [170, 200],
			modes: ["binaural", "monaural"],
			noises: [["pink", .2]],
			layers: [["drone"], ["bell"]],
			vibes: ["ethereal", "deep"],
			situations: ["lucid-dream", "meditate"],
			intensity: 2,
			gain: .4,
			count: 5,
			reason: "Relaxed theta with a slow instrument drone."
		})
	]
}, E = {
	category: "meditation",
	prefix: "meditation",
	adjectives: [
		"Open",
		"Rooted",
		"Sacred",
		"Luminous",
		"Patient",
		"Clear",
		"Boundless",
		"Inner",
		"Mindful",
		"Sunlit",
		"Hallowed",
		"Silent"
	],
	nouns: [
		"Cushion",
		"Temple",
		"Breath",
		"Mountain",
		"Lotus",
		"Stillpoint",
		"Horizon",
		"Sanctuary",
		"River",
		"Candle",
		"Grove",
		"Bowl"
	],
	archs: [
		n({
			slug: "alpha-sit",
			shape: "plateau",
			from: 12,
			to: 9.5,
			ret: 11,
			mins: [
				10,
				15,
				20,
				30
			],
			carriers: [
				180,
				200,
				220
			],
			modes: [
				"binaural",
				"monaural",
				"isochronic"
			],
			noises: [["pink", .15], ["off", 0]],
			layers: [
				["chimes"],
				["bell"],
				[]
			],
			vibes: [
				"calm",
				"grounded",
				"warm"
			],
			situations: [
				"meditate",
				"quick-reset",
				"heal-stress"
			],
			intensity: 2,
			gain: .42,
			count: 5,
			reason: "{tone} calm and wide awake for a {minutes} minute seated sit."
		}),
		n({
			slug: "theta-descent",
			shape: "ramp-down",
			from: 10,
			to: 5,
			mins: [
				20,
				30,
				45
			],
			carriers: [160, 180],
			modes: ["binaural", "monaural"],
			noises: [["brown", .2]],
			layers: [["drone"], ["drone", "chimes"]],
			vibes: ["deep", "ethereal"],
			situations: ["meditate"],
			intensity: 2,
			gain: .4,
			count: 5,
			reason: "Glides from alpha to theta."
		}),
		n({
			slug: "schumann-hold",
			shape: "plateau",
			from: 12,
			to: 7.83,
			ret: 12,
			mins: [20, 30],
			carriers: [180, 200],
			modes: ["binaural", "monaural"],
			noises: [["pink", .15]],
			layers: [["piano"], ["bell"]],
			vibes: ["grounded", "deep"],
			situations: ["meditate", "heal-stress"],
			intensity: 2,
			gain: .42,
			count: 4,
			jitter: 0,
			reason: "Rests on the 7.83 Hz Schumann resonance, then returns to wakefulness."
		}),
		n({
			slug: "breath-pacer",
			shape: "plateau",
			from: 9,
			to: 6.5,
			mins: [
				10,
				15,
				20
			],
			carriers: [170, 190],
			modes: ["isochronic", "monaural"],
			noises: [["off", 0]],
			layers: [["chimes"], ["pad"]],
			vibes: ["calm", "minimal"],
			situations: ["meditate", "quick-reset"],
			intensity: 2,
			gain: .4,
			count: 4,
			breath: {
				inSec: 5.45,
				outSec: 5.45
			},
			reason: "Pair the 5.5 breaths per minute pacer with a slow theta pulse."
		}),
		n({
			slug: "bell-silence",
			shape: "plateau",
			from: 10,
			to: 8,
			mins: [
				15,
				20,
				30
			],
			carriers: [190, 210],
			modes: ["binaural", "monaural"],
			noises: [["off", 0]],
			layers: [
				["chimes"],
				["bell"],
				["pluck", "chimes"]
			],
			vibes: [
				"ethereal",
				"bright",
				"calm"
			],
			situations: ["meditate", "heal-stress"],
			intensity: 1,
			gain: .4,
			count: 4,
			reason: "Sparse chimes over a quiet alpha-theta border."
		}),
		n({
			slug: "delta-glide",
			shape: "ramp-down",
			from: 6,
			to: 3,
			mins: [
				30,
				45,
				60
			],
			carriers: [130, 150],
			modes: ["binaural", "monaural"],
			noises: [["brown", .25]],
			layers: [["drone"]],
			vibes: ["deep", "minimal"],
			situations: ["meditate", "heal-stress"],
			intensity: 2,
			gain: .38,
			count: 4,
			reason: "A long fall into delta."
		})
	]
}, D = {
	category: "sleep",
	prefix: "sleep",
	adjectives: [
		"Quiet",
		"Slow",
		"Velvet",
		"Hushed",
		"Moonlit",
		"Soft",
		"Drowsy",
		"Still",
		"Dim",
		"Gentle",
		"Fading",
		"Lulled"
	],
	nouns: [
		"Harbor",
		"Tide",
		"Pillow",
		"Lantern",
		"Blanket",
		"Meadow",
		"Lullaby",
		"Cabin",
		"Drift",
		"Hearth",
		"Cove",
		"Evening"
	],
	archs: [
		n({
			slug: "onset-delta",
			shape: "ramp-down",
			from: 9,
			to: 2.5,
			mins: [
				30,
				45,
				60,
				90
			],
			carriers: [
				120,
				140,
				150,
				160,
				180
			],
			modes: [
				"binaural",
				"monaural",
				"binaural",
				"isochronic"
			],
			noises: [["brown", .25], ["pink", .2]],
			layers: [
				[],
				["pad"],
				["drone"]
			],
			vibes: [
				"calm",
				"deep",
				"dreamy"
			],
			situations: ["cant-sleep", "heal-stress"],
			intensity: 1,
			gain: .4,
			count: 6,
			reason: "Glides from alpha to delta over {minutes} minutes."
		}),
		n({
			slug: "drift-theta",
			shape: "ramp-down",
			from: 8,
			to: 4.5,
			mins: [
				20,
				30,
				45
			],
			carriers: [
				130,
				150,
				170
			],
			modes: ["binaural", "monaural"],
			noises: [["pink", .2], ["brown", .3]],
			layers: [
				["piano", "pad"],
				["pad", "chimes"],
				[]
			],
			vibes: [
				"dreamy",
				"calm",
				"ethereal"
			],
			situations: ["cant-sleep", "lucid-dream"],
			intensity: 1,
			gain: .4,
			count: 5,
			reason: "A slow theta drift with a soft pad."
		}),
		n({
			slug: "deep-delta",
			shape: "plateau",
			from: 6,
			to: 2.5,
			mins: [
				60,
				90,
				120
			],
			carriers: [
				110,
				130,
				150
			],
			modes: [
				"monaural",
				"binaural",
				"isochronic"
			],
			noises: [["brown", .3]],
			layers: [["drone"], []],
			vibes: ["deep", "calm"],
			situations: ["cant-sleep"],
			intensity: 1,
			gain: .38,
			count: 5,
			jitter: .2,
			reason: "Holds steady delta."
		}),
		n({
			slug: "nap-reset",
			shape: "plateau",
			from: 10,
			to: 5,
			ret: 12,
			mins: [
				15,
				20,
				25
			],
			carriers: [150, 170],
			modes: ["binaural", "isochronic"],
			noises: [["pink", .2]],
			layers: [["pad"]],
			vibes: ["warm", "calm"],
			situations: [
				"cant-sleep",
				"quick-reset",
				"ai-burnout"
			],
			intensity: 2,
			gain: .42,
			count: 4,
			reason: "A short nap sound that sinks to theta and returns after {minutes} minutes."
		}),
		n({
			slug: "breath-down",
			shape: "ramp-down",
			from: 7,
			to: 3,
			mins: [20, 30],
			carriers: [140, 160],
			modes: ["isochronic", "monaural"],
			noises: [["brown", .2]],
			layers: [["pad", "chimes"]],
			vibes: ["calm", "dreamy"],
			situations: ["cant-sleep", "heal-stress"],
			intensity: 1,
			gain: .4,
			count: 3,
			breath: {
				inSec: 4,
				outSec: 6
			},
			reason: "Pair slow 4-in, 6-out breathing with a falling beat."
		}),
		n({
			slug: "rain-bed",
			shape: "plateau",
			from: 5,
			to: 3,
			mins: [
				45,
				60,
				90
			],
			carriers: [120, 140],
			modes: ["isochronic", "binaural"],
			noises: [["brown", .5], ["pink", .45]],
			layers: [["lofi"], []],
			vibes: [
				"lofi",
				"warm",
				"calm"
			],
			situations: ["cant-sleep", "heal-stress"],
			intensity: 1,
			gain: .35,
			count: 3,
			reason: "A soft noise bed with a faint low-end hum."
		})
	]
}, ie = {
	category: "vibes",
	prefix: "vibe",
	adjectives: [
		"Neon",
		"Cozy",
		"Mellow",
		"Golden",
		"Hazy",
		"Crisp",
		"Cloudy",
		"Dusty",
		"Amber",
		"Breezy",
		"Sleepy",
		"Plush"
	],
	nouns: [
		"Cafe",
		"Rooftop",
		"Cassette",
		"Window",
		"Terrace",
		"Playlist",
		"Sunday",
		"Skyline",
		"Studio",
		"Porch",
		"Alley",
		"Lounge"
	],
	archs: [
		n({
			slug: "lofi-study",
			shape: "plateau",
			from: 12,
			to: 10,
			mins: [
				25,
				45,
				60
			],
			carriers: [
				180,
				200,
				220
			],
			modes: [
				"isochronic",
				"monaural",
				"binaural"
			],
			noises: [["pink", .1]],
			layers: [
				[
					"lofi",
					"crackle",
					"pluck"
				],
				["lofi", "pluck"],
				["lofi", "pad"]
			],
			vibes: ["lofi", "warm"],
			situations: [
				"deep-work",
				"ai-burnout",
				"quick-reset"
			],
			intensity: 2,
			gain: .42,
			count: 6,
			reason: "Warm lo-fi bed with a soft pluck for easy, steady company."
		}),
		n({
			slug: "warm-glow",
			shape: "plateau",
			from: 11,
			to: 9,
			mins: [
				20,
				30,
				45
			],
			carriers: [170, 190],
			modes: ["binaural", "monaural"],
			noises: [["pink", .12], ["off", 0]],
			layers: [["pad", "lofi"], ["pad"]],
			vibes: ["warm", "calm"],
			situations: ["quick-reset", "ai-burnout"],
			intensity: 1,
			gain: .4,
			count: 4,
			reason: "A warm pad and a gentle alpha pulse for a soft landing."
		}),
		n({
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
			gain: .42,
			count: 4,
			reason: "Airy bells over a light alpha-beta border."
		}),
		n({
			slug: "ether-float",
			shape: "wave",
			from: 10,
			to: 6,
			mins: [
				20,
				30,
				45
			],
			carriers: [160, 190],
			modes: ["binaural", "monaural"],
			noises: [["pink", .15]],
			layers: [["pad", "chimes"], ["bell", "pad"]],
			vibes: [
				"ethereal",
				"dreamy",
				"deep"
			],
			situations: ["quick-reset", "heal-stress"],
			intensity: 2,
			gain: .4,
			count: 4,
			reason: "Slow swells with chimes for a floating, spacious mood."
		}),
		n({
			slug: "minimal-hum",
			shape: "plateau",
			from: 10,
			to: 10,
			mins: [
				15,
				30,
				60
			],
			carriers: [200, 220],
			modes: ["isochronic", "monaural"],
			noises: [["pink", .3], ["brown", .3]],
			layers: [[]],
			vibes: ["minimal", "grounded"],
			situations: ["deep-work", "ai-burnout"],
			intensity: 1,
			gain: .4,
			count: 4,
			jitter: 0,
			reason: "Just a pulse and a noise bed, nothing to attend to."
		}),
		n({
			slug: "spark-groove",
			shape: "plateau",
			from: 14,
			to: 16,
			mins: [
				20,
				25,
				30
			],
			carriers: [
				220,
				240,
				260
			],
			modes: ["isochronic", "binaural"],
			noises: [["off", 0]],
			layers: [["perc", "pluck"], ["perc", "lofi"]],
			vibes: ["energized", "bright"],
			situations: ["deep-work", "quick-reset"],
			intensity: 3,
			gain: .42,
			count: 4,
			reason: "A light groove with soft percussion and a bright, steady feel."
		})
	]
}, ae = {
	category: "work-recovery",
	prefix: "recovery",
	adjectives: [
		"Unplugged",
		"Offline",
		"Cooled",
		"Rested",
		"Idle",
		"Paused",
		"Unwound",
		"Mellow",
		"Eased",
		"Reset",
		"Spare",
		"Soft"
	],
	nouns: [
		"Break",
		"Commit",
		"Cooldown",
		"Terminal",
		"Standup",
		"Branch",
		"Window",
		"Stretch",
		"Merge",
		"Buffer",
		"Release",
		"Cache"
	],
	archs: [
		n({
			slug: "screen-down",
			shape: "ramp-down",
			from: 18,
			to: 8,
			mins: [
				10,
				15,
				20
			],
			carriers: [200, 220],
			modes: [
				"binaural",
				"monaural",
				"isochronic"
			],
			noises: [["pink", .2]],
			layers: [
				["lofi", "pad"],
				["pad"],
				["lofi"]
			],
			vibes: [
				"calm",
				"lofi",
				"warm"
			],
			situations: ["ai-burnout", "quick-reset"],
			intensity: 2,
			gain: .42,
			count: 5,
			reason: "Steps down from beta to alpha after a long review or generation run."
		}),
		n({
			slug: "micro-break",
			shape: "plateau",
			from: 11,
			to: 8.5,
			ret: 11,
			mins: [
				5,
				8,
				10
			],
			carriers: [190, 210],
			modes: ["isochronic", "binaural"],
			noises: [["off", 0], ["pink", .15]],
			layers: [["chimes"], ["pad", "chimes"]],
			vibes: ["bright", "calm"],
			situations: ["quick-reset", "ai-burnout"],
			intensity: 2,
			gain: .4,
			count: 4,
			reason: "A {minutes} minute reset between tasks."
		}),
		n({
			slug: "post-sprint",
			shape: "ramp-down",
			from: 20,
			to: 6,
			mins: [
				15,
				20,
				30
			],
			carriers: [200, 220],
			modes: ["binaural", "monaural"],
			noises: [["brown", .25]],
			layers: [["pad"], ["drone", "chimes"]],
			vibes: ["deep", "grounded"],
			situations: ["ai-burnout", "heal-stress"],
			intensity: 2,
			gain: .4,
			count: 4,
			reason: "A long fall from high beta to theta after an intense push."
		}),
		n({
			slug: "eye-rest",
			shape: "plateau",
			from: 10,
			to: 8,
			mins: [
				5,
				10,
				15
			],
			carriers: [180, 200],
			modes: ["monaural", "isochronic"],
			noises: [["pink", .2]],
			layers: [["pad"], ["chimes"]],
			vibes: ["calm", "minimal"],
			situations: ["ai-burnout", "quick-reset"],
			intensity: 1,
			gain: .38,
			count: 4,
			breath: {
				inSec: 4,
				outSec: 6
			},
			reason: "Close your eyes and follow a slow 4-in, 6-out breath."
		}),
		n({
			slug: "lofi-unwind",
			shape: "plateau",
			from: 10,
			to: 9,
			mins: [
				15,
				25,
				40
			],
			carriers: [
				180,
				200,
				220
			],
			modes: [
				"isochronic",
				"binaural",
				"monaural"
			],
			noises: [["pink", .1]],
			layers: [[
				"lofi",
				"crackle",
				"pluck"
			], ["lofi", "pad"]],
			vibes: ["lofi", "warm"],
			situations: [
				"ai-burnout",
				"heal-stress",
				"quick-reset"
			],
			intensity: 1,
			gain: .4,
			count: 5,
			reason: "Slow lo-fi bed to decompress while you do something light."
		}),
		n({
			slug: "commute-decompress",
			shape: "ramp-down",
			from: 14,
			to: 9,
			mins: [
				15,
				20,
				30
			],
			carriers: [200, 230],
			modes: ["isochronic", "monaural"],
			noises: [["pink", .15]],
			layers: [["pluck"], ["lofi", "pluck"]],
			vibes: [
				"grounded",
				"warm",
				"minimal"
			],
			situations: [
				"ai-burnout",
				"quick-reset",
				"heal-stress"
			],
			intensity: 2,
			gain: .42,
			count: 4,
			reason: "Closes the work day with a calm descent that works over speakers."
		})
	]
}, O = (e) => Math.round(e * 1e3) / 1e3, k = (e) => Math.min(40, Math.max(.5, e)), A = (e) => e.segs.reduce((e, t) => e + t[0], 0) * (e.scale ?? 1);
function j(e, t) {
	let n = e.carrier ?? 200;
	return e.carrierEnd === void 0 ? n : Math.round(n + (e.carrierEnd - n) * t / Math.max(A(e), 1));
}
function M(e) {
	let t = [], [n, r] = e.noise ?? ["off", 0], i = 0;
	return e.segs.forEach((a, o) => {
		let s = a[1] !== a[2], c = e.segs[o + 1];
		t.push({
			atMin: O(i / 60),
			beatHz: O(k(a[1])),
			carrierHz: j(e, i),
			gain: e.gain ?? .5,
			mode: e.mode ?? "binaural",
			noise: n,
			noiseLevel: r,
			ramp: s
		}), i += a[0] * (e.scale ?? 1), s && (c === void 0 || k(c[1]) !== k(a[2])) && t.push({
			...t[t.length - 1],
			atMin: O(i / 60),
			beatHz: O(k(a[2])),
			carrierHz: j(e, i),
			ramp: !1
		});
	}), t;
}
var N = (e, t) => e.replaceAll("{minutes}", String(t)).replaceAll("{duration}", `${t} minutes`);
function P(e) {
	let t = M(e), n = Math.max(1, Math.round(A(e) / 60));
	return {
		id: e.id,
		name: e.name,
		category: e.category,
		vibe: e.vibe,
		tags: [...e.tags, e.source],
		layerTags: h(t),
		situations: e.situations,
		recommendedMinutes: n,
		intensity: e.intensity,
		adhdFriendly: g(t, e.intensity),
		stages: t,
		reasonTemplate: N(e.reason, n),
		source: e.source
	};
}
var F = ["white", .3], I = ["pink", .3], L = ["brown", .3], R = [
	[
		60,
		10,
		8
	],
	[
		60,
		8,
		8
	],
	[
		60,
		8,
		6
	],
	[
		60,
		6,
		6
	],
	[
		120,
		6,
		5
	],
	[
		360,
		5,
		5
	],
	[
		10,
		5,
		8
	],
	[
		10,
		8,
		5
	],
	[
		180,
		5,
		5
	],
	[
		10,
		5,
		8
	],
	[
		10,
		8,
		5
	],
	[
		90,
		5,
		5
	],
	[
		10,
		5,
		8
	],
	[
		10,
		8,
		5
	],
	[
		240,
		5,
		5
	],
	[
		10,
		5,
		8
	],
	[
		10,
		8,
		5
	],
	[
		480,
		5,
		5
	],
	[
		10,
		5,
		8
	],
	[
		10,
		8,
		5
	],
	[
		360,
		5,
		5
	],
	[
		480,
		5,
		12
	]
], z = [
	[
		120,
		10,
		8
	],
	[
		120,
		8,
		8
	],
	[
		120,
		8,
		6
	],
	[
		240,
		6,
		6
	],
	[
		240,
		6,
		5
	],
	[
		420,
		5,
		5
	],
	[
		20,
		5,
		8
	],
	[
		20,
		8,
		5
	],
	[
		360,
		5,
		5
	],
	[
		20,
		5,
		8
	],
	[
		20,
		8,
		5
	],
	[
		180,
		5,
		5
	],
	[
		900,
		5,
		5
	],
	[
		900,
		5,
		5
	],
	[
		360,
		5,
		5
	],
	[
		360,
		5,
		12
	]
], B = [
	[
		15,
		10,
		8
	],
	[
		240,
		8,
		8
	],
	[
		15,
		8,
		6
	],
	[
		240,
		6,
		6
	],
	[
		15,
		6,
		8
	],
	[
		555,
		8,
		8
	],
	[
		15,
		8,
		6
	],
	[
		75,
		6,
		6
	],
	[
		15,
		6,
		8
	],
	[
		45,
		8,
		8
	]
], V = [
	[
		333,
		8,
		8
	],
	[
		333,
		8,
		10
	],
	[
		333,
		10,
		12
	],
	[
		333,
		12,
		12
	],
	[
		333,
		12,
		10
	],
	[
		333,
		10,
		8
	],
	[
		333,
		8,
		10
	]
], H = [
	[
		120,
		20,
		40
	],
	...Array.from({ length: 8 }, () => [[
		20,
		40,
		40
	], [
		10,
		8,
		8
	]]).flat(),
	[
		120,
		40,
		10
	]
], U = (e) => ({
	...e,
	source: "android",
	carrier: 200
}), W = [
	U({
		id: "android-self-hypnosis",
		name: "Mind Bridge",
		category: "meditation",
		vibe: "deep",
		situations: ["meditate", "heal-stress"],
		intensity: 2,
		segs: [
			[
				300,
				12,
				4
			],
			[
				600,
				4,
				4
			],
			[
				300,
				4,
				12
			]
		],
		noise: F,
		tags: ["theta", "hypnosis"],
		reason: "Five minutes down to 4 Hz, ten minutes holding there, five minutes back up."
	}),
	U({
		id: "android-highest-mental-activity",
		name: "Spark Burst",
		category: "focus",
		vibe: "energized",
		situations: ["deep-work"],
		intensity: 5,
		segs: [
			[
				120,
				12,
				40
			],
			[
				600,
				40,
				40
			],
			[
				120,
				40,
				12
			]
		],
		noise: F,
		tags: ["gamma", "boost"],
		reason: "Two minutes up to the 40 Hz ceiling, a ten minute hold, two minutes back to 12 Hz."
	}),
	U({
		id: "android-unity",
		name: "Unity Delta",
		category: "meditation",
		vibe: "ethereal",
		situations: ["meditate", "cant-sleep"],
		intensity: 1,
		segs: [[
			3600,
			3.7,
			3.7
		]],
		noise: L,
		gain: .45,
		tags: ["delta", "long"],
		reason: "A flat 3.7 Hz hour under brown noise, wide and quiet."
	}),
	U({
		id: "android-morphine",
		name: "Morphine Ease",
		category: "healing",
		vibe: "warm",
		situations: ["heal-stress"],
		intensity: 2,
		segs: [[
			3600,
			10,
			10
		]],
		noise: I,
		tags: ["alpha", "pain"],
		reason: "An hour at a steady 10 Hz under pink noise."
	}),
	U({
		id: "android-learning",
		name: "Long Study Bed",
		category: "focus",
		vibe: "bright",
		situations: ["deep-work"],
		intensity: 3,
		segs: [[
			120,
			40,
			14
		], [
			7080,
			14,
			14
		]],
		gain: .5,
		tags: ["beta", "study"],
		reason: "A two minute lift, then two hours at 14 Hz for long reading blocks."
	}),
	U({
		id: "android-creativity",
		name: "Creative Waves",
		category: "vibes",
		vibe: "bright",
		situations: ["quick-reset", "deep-work"],
		intensity: 2,
		segs: B,
		noise: ["white", .4],
		tags: [
			"alpha",
			"theta",
			"creative"
		],
		reason: "Drifts back and forth between 10 and 6 Hz."
	}),
	U({
		id: "android-wakeful-relax",
		name: "Quiet Alert",
		category: "meditation",
		vibe: "calm",
		situations: ["meditate", "quick-reset"],
		intensity: 1,
		segs: [[
			120,
			12,
			7.83
		], [
			780,
			7.83,
			7.83
		]],
		noise: ["white", .4],
		tags: ["alpha", "zen"],
		reason: "Parked at 7.83 Hz with white noise."
	}),
	U({
		id: "android-schumann",
		name: "Earth Hum",
		category: "healing",
		vibe: "grounded",
		situations: ["heal-stress", "meditate"],
		intensity: 2,
		segs: [
			[
				300,
				12,
				7.83
			],
			[
				600,
				7.83,
				7.83
			],
			[
				300,
				7.83,
				12
			]
		],
		noise: ["white", .4],
		tags: ["alpha", "earth"],
		reason: "Ramps to 7.83 Hz, holds there ten minutes, then climbs back to 12 Hz."
	}),
	U({
		id: "android-astral-relax",
		name: "Dream Gate Relax",
		category: "lucid-dreams",
		vibe: "ethereal",
		situations: ["lucid-dream", "meditate"],
		intensity: 2,
		segs: [[
			600,
			15,
			10
		], [
			4800,
			10,
			10
		]],
		noise: ["white", .4],
		tags: ["alpha", "astral"],
		reason: "A ten minute slide from 15 to 10 Hz, then a long steady, calm rest."
	}),
	U({
		id: "android-interval-pulse",
		name: "Interval Pulse",
		category: "focus",
		vibe: "energized",
		situations: ["deep-work"],
		intensity: 5,
		segs: H,
		tags: [
			"beta",
			"gamma",
			"interval"
		],
		reason: "Eight short high and low rounds between a warm up and a cool down."
	}),
	U({
		id: "android-hallucination",
		name: "Hazy Visions",
		category: "vibes",
		vibe: "ethereal",
		situations: ["quick-reset"],
		intensity: 3,
		segs: [[
			600,
			15,
			10
		]],
		noise: ["white", .2],
		tags: ["alpha", "trippy"],
		reason: "A single {minutes} minute slide from 15 to 10 Hz, soft and dreamy."
	}),
	U({
		id: "android-sleep-induction",
		name: "Drift Down",
		category: "sleep",
		vibe: "calm",
		situations: ["cant-sleep"],
		intensity: 1,
		segs: [
			[
				360,
				9.7,
				3.4
			],
			[
				1620,
				3.4,
				2.4
			],
			[
				1620,
				2.4,
				3.4
			]
		],
		noise: L,
		gain: .5,
		tags: ["delta", "induction"],
		reason: "A six minute fall to delta, then a long gentle rise and dip for the rest of the hour."
	}),
	U({
		id: "android-lucid-dreams",
		name: "Lucid Dream Cycle",
		category: "lucid-dreams",
		vibe: "dreamy",
		situations: ["lucid-dream"],
		intensity: 2,
		segs: R,
		gain: .5,
		tags: ["theta", "lucid"],
		reason: "A theta bed with brief alpha lifts and a soft ending."
	}),
	U({
		id: "android-shamanic-rhythm",
		name: "Ember Circle",
		category: "meditation",
		vibe: "grounded",
		situations: ["meditate", "heal-stress"],
		intensity: 2,
		segs: [
			[
				300,
				9,
				4.5
			],
			[
				3e3,
				4.5,
				4.5
			],
			[
				300,
				4.5,
				9
			]
		],
		noise: ["white", .4],
		tags: ["theta", "journey"],
		reason: "Five minutes down to 4.5 Hz, fifty minutes of hold, five minutes back up."
	}),
	U({
		id: "android-smr-sleep",
		name: "SMR Sleep Weave",
		category: "sleep",
		vibe: "minimal",
		situations: ["cant-sleep", "heal-stress"],
		intensity: 2,
		segs: V,
		tags: ["alpha", "smr"],
		reason: "Beats crossing between a calm pace and the low SMR band."
	}),
	U({
		id: "android-lucid-dreams-2",
		name: "Long Lucid Night",
		category: "lucid-dreams",
		vibe: "deep",
		situations: ["lucid-dream", "cant-sleep"],
		intensity: 2,
		segs: [
			[
				600,
				9.7,
				3.4
			],
			[
				5400,
				3.4,
				2.4
			],
			...z
		],
		noise: I,
		gain: .5,
		tags: [
			"delta",
			"theta",
			"lucid"
		],
		reason: "A delta fall followed by a long night plan with timed theta pulses."
	}),
	U({
		id: "android-adhd-cycle",
		name: "Focus Cycle",
		category: "adhd-control",
		vibe: "energized",
		situations: ["adhd-focus", "deep-work"],
		intensity: 3,
		segs: [
			[
				300,
				40,
				12
			],
			[
				300,
				20,
				20
			],
			[
				300,
				12,
				12
			],
			[
				300,
				20,
				20
			],
			[
				300,
				12,
				12
			],
			[
				300,
				20,
				20
			]
		],
		noise: F,
		tags: ["beta", "cycle"],
		reason: "Five minute blocks that swap between 12 and 20 Hz after a 40 Hz opener."
	}),
	U({
		id: "android-self-hypnosis-short",
		name: "Quick Mind Bridge",
		category: "meditation",
		vibe: "calm",
		situations: ["meditate", "quick-reset"],
		intensity: 2,
		segs: [
			[
				300,
				12,
				4
			],
			[
				600,
				4,
				4
			],
			[
				300,
				4,
				12
			]
		],
		noise: F,
		scale: .5,
		tags: ["theta", "short"],
		reason: "The Mind Bridge shape made shorter."
	}),
	U({
		id: "android-wakeful-relax-5",
		name: "Five Minute Calm",
		category: "work-recovery",
		vibe: "calm",
		situations: ["quick-reset", "ai-burnout"],
		intensity: 1,
		segs: [[
			120,
			12,
			7.83
		], [
			780,
			7.83,
			7.83
		]],
		noise: ["white", .3],
		scale: 1 / 3,
		tags: ["alpha", "short"],
		reason: "A {minutes} minute Quiet Alert between tasks."
	}),
	U({
		id: "android-schumann-short",
		name: "Earth Reset",
		category: "healing",
		vibe: "grounded",
		situations: ["heal-stress", "quick-reset"],
		intensity: 2,
		segs: [
			[
				300,
				12,
				7.83
			],
			[
				600,
				7.83,
				7.83
			],
			[
				300,
				7.83,
				12
			]
		],
		noise: ["white", .3],
		scale: .5,
		tags: ["alpha", "short"],
		reason: "A {minutes} minute version of the Earth Hum shape."
	}),
	U({
		id: "android-lucid-dreams-short",
		name: "Lucid Nap Cycle",
		category: "lucid-dreams",
		vibe: "dreamy",
		situations: ["lucid-dream", "cant-sleep"],
		intensity: 2,
		segs: R.slice(0, 12),
		gain: .5,
		tags: [
			"theta",
			"lucid",
			"short"
		],
		reason: "The opening stretch of the Lucid Dream Cycle, sized for naps."
	})
], G = (e) => ({
	...e,
	source: "gnaural"
}), K = [
	G({
		id: "gnaural-power-nap",
		name: "Midday Nap",
		category: "sleep",
		vibe: "warm",
		situations: [
			"quick-reset",
			"cant-sleep",
			"ai-burnout"
		],
		intensity: 1,
		segs: [
			[
				13,
				11,
				8.8
			],
			[
				17,
				8.8,
				7
			],
			[
				29,
				7,
				5.2
			],
			[
				38,
				5.2,
				4.4
			],
			[
				50,
				4.4,
				4.2
			],
			[
				68,
				4.2,
				4
			],
			[
				877,
				4,
				4
			],
			[
				37,
				4,
				4.2
			],
			[
				32,
				4.2,
				5.1
			],
			[
				20,
				5.1,
				6.8
			],
			[
				15,
				6.8,
				9.8
			],
			[
				4,
				9.8,
				9.8
			]
		],
		carrier: 164,
		carrierEnd: 110,
		noise: I,
		gain: .5,
		tags: [
			"delta",
			"nap",
			"schedule"
		],
		reason: "A fast fall to 4 Hz, a long hold, then a slow climb."
	}),
	G({
		id: "gnaural-airplane-aid",
		name: "Long Haul Calm",
		category: "meditation",
		vibe: "calm",
		situations: [
			"meditate",
			"quick-reset",
			"heal-stress"
		],
		intensity: 1,
		segs: [
			[
				9,
				.5,
				12
			],
			[
				45,
				12,
				8
			],
			[
				60,
				8,
				6
			],
			[
				120,
				6,
				5
			],
			[
				180,
				5,
				4.3
			],
			[
				180,
				4.3,
				4
			],
			[
				900,
				4,
				4
			],
			[
				900,
				4,
				4.2
			],
			[
				900,
				4.2,
				3.9
			],
			[
				900,
				3.9,
				3.9
			],
			[
				400,
				3.9,
				4.3
			]
		],
		carrier: 280,
		carrierEnd: 140,
		noise: L,
		gain: .5,
		tags: [
			"theta",
			"travel",
			"schedule"
		],
		reason: "A falling carrier tone over theta beats, built for long seated trips."
	}),
	G({
		id: "gnaural-arrive-sharp",
		name: "Arrive Sharp",
		category: "focus",
		vibe: "bright",
		situations: ["deep-work"],
		intensity: 4,
		segs: [
			[
				236,
				10.1,
				10.1
			],
			[
				132,
				12.1,
				12.1
			],
			[
				661,
				28.5,
				28.5
			],
			[
				209,
				5.4,
				5.4
			],
			[
				73,
				7.3,
				7.3
			]
		],
		carrier: 200,
		gain: .5,
		tags: [
			"beta",
			"gamma",
			"schedule"
		],
		reason: "Five steps from alpha up to a 28.5 Hz middle, then back down."
	})
];
function q() {
	return [...W, ...K].map(P);
}
// ../../web/src/catalog/starters.ts
var J = {
	warm: "warm",
	calm: "calm",
	bright: "bright",
	deep: "deep",
	dreamy: "dreamy",
	neutral: "minimal"
};
function oe(t) {
	let n = e(t.id, t.defaultLevel), r = Object.keys(n.layers).length > 0, i = [{
		atMin: 0,
		beatHz: 8,
		carrierHz: 200,
		gain: .4,
		mode: "binaural",
		noise: n.noise,
		noiseLevel: n.noiseLevel,
		...r ? { layers: n.layers } : {},
		ramp: !1
	}];
	return {
		id: t.templateId,
		name: t.name,
		category: "vibes",
		vibe: J[t.mood] ?? "calm",
		tags: [
			"starter",
			"sound-first",
			t.id
		],
		layerTags: h(i),
		situations: ["quick-reset", "heal-stress"],
		recommendedMinutes: 20,
		intensity: 1,
		adhdFriendly: g(i, 1),
		stages: i,
		reasonTemplate: t.blurb,
		source: "original"
	};
}
function se() {
	return t.map(oe);
}
// ../../web/src/catalog/build.ts
function ce() {
	return [
		...se(),
		...q(),
		...[
			ie,
			w,
			T,
			E,
			D,
			S,
			C,
			ae
		].flatMap(x)
	];
}
// ../../web/src/catalog/registry.ts
var Y;
function X() {
	return Y ??= ce(), Y;
}
new Proxy([], {
	get: (e, t) => Reflect.get(X(), t),
	has: (e, t) => Reflect.has(X(), t),
	ownKeys: () => Reflect.ownKeys(X()),
	getOwnPropertyDescriptor: (e, t) => {
		let n = Reflect.getOwnPropertyDescriptor(X(), t);
		return n === void 0 || t === "length" ? n : {
			...n,
			configurable: !0
		};
	}
});
// ../../web/src/catalog/features.ts
function Z(e) {
	return e.stages.some((e) => (e.layers?.percLevel ?? 0) > 0);
}
function Q(e) {
	return e.stages.some((e) => (e.layers?.crackle ?? 0) > 0);
}
function $(e) {
	return e.stages.some((e) => e.mode === "binaural");
}
// ../../web/src/catalog/recommend.ts
var le = {
	focus: [
		1,
		1,
		.5,
		.1
	],
	"adhd-control": [
		1,
		1,
		.5,
		.1
	],
	vibes: [
		.5,
		.8,
		1,
		.5
	],
	"work-recovery": [
		.5,
		1,
		1,
		.4
	],
	healing: [
		.6,
		.7,
		1,
		.8
	],
	meditation: [
		1,
		.6,
		1,
		.6
	],
	sleep: [
		0,
		.2,
		.7,
		1
	],
	"lucid-dreams": [
		0,
		.1,
		.6,
		1
	]
}, ue = {
	morning: 0,
	afternoon: 1,
	evening: 2,
	night: 3
}, de = (e) => Math.round(e * 10) / 10;
function fe(e, t, n) {
	let r = Math.max(1, t);
	if (e <= r) return n.push(`Fits your ${r} minutes (${e} min).`), 15 * (.6 + e / r * .4);
	let i = (e - r) / r;
	return n.push(`Runs ${e} min, longer than your ${r}; you can stop any time.`), Math.max(0, 15 * (1 - i * 1.5)) - (i > .5 ? 5 : 0);
}
function pe(e, t, n) {
	return t.deviceType === "speaker" ? $(e) ? (n.push("Warning: binaural beats need headphones. A speaker will not deliver the effect; pick an isochronic or monaural template if you can."), -8) : (n.push("Isochronic or monaural beats work over speakers."), 10) : (n.push(t.deviceType === "bluetooth" ? "Good over Bluetooth headphones." : "Headphones suit every beat type."), $(e) ? 10 : 8);
}
function me(e, t, n) {
	let r = e.intensity > 3 || Z(e) || Q(e), i = t.sensorySensitivity;
	return i === "low" ? {
		pts: 10,
		sensitive: !1
	} : i === "medium" ? {
		pts: e.intensity <= 3 ? r ? 7 : 10 : 4,
		sensitive: !1
	} : r ? (n.push("Relaxed filter: this one is stronger or has percussion or crackle, shown because too few gentle matches exist."), {
		pts: 0,
		sensitive: !0
	}) : (n.push("Gentle: low intensity, no percussion or crackle."), {
		pts: e.intensity <= 2 ? 10 : 7,
		sensitive: !1
	});
}
function he(e, t) {
	let n = [e.reasonTemplate.replace("{minutes}", String(e.recommendedMinutes))], r = e.situations.includes(t.situation), i = 0;
	r ? (i += 40, n.push(`Made for: ${t.situation}.`)) : n.push(`Related option: not built for ${t.situation}, but close in mood.`), t.vibe === void 0 ? i += 7 : t.vibe === e.vibe && (i += 15, n.push(`Matches your ${t.vibe} vibe.`)), i += fe(e.recommendedMinutes, t.availableMinutes, n);
	let a = (le[e.category][ue[t.timeOfDay]] ?? 0) * 10;
	i += a, a >= 8 && n.push(`Suits the ${t.timeOfDay}.`), e.intensity >= 4 && t.timeOfDay === "night" && (i -= 5), i += pe(e, t, n);
	let o = me(e, t, n);
	return i += o.pts, {
		template: e,
		score: Math.max(0, de(i)),
		reasons: n,
		sensitive: o.sensitive,
		onSituation: r
	};
}
var ge = (e, t) => t.score - e.score || (e.template.id < t.template.id ? -1 : +(e.template.id > t.template.id));
function _e(e, t = 5, n = X()) {
	let r = Math.max(1, Math.floor(t)), i = n.map((t) => he(t, e)).sort(ge), a = [
		i.filter((e) => e.onSituation && !e.sensitive),
		i.filter((e) => !e.sensitive),
		i
	], o = a.find((e) => e.length >= r) ?? i, s = o.slice(0, r);
	return o !== a[0] && s.forEach((e) => {
		e.onSituation || e.reasons.push("Filters relaxed: too few exact matches, so close alternatives are included.");
	}), s.map((e) => ({
		template: e.template,
		score: e.score,
		reasons: e.reasons
	}));
}
// ../../web/src/catalog/search.ts
function ve(e, t = X()) {
	let n = (e.text ?? "").toLowerCase().split(/\s+/).filter((e) => e.length > 0), r = e.layerTags ?? [];
	return t.filter((t) => {
		if (e.category !== void 0 && t.category !== e.category || e.vibe !== void 0 && t.vibe !== e.vibe || e.adhdFriendly !== void 0 && t.adhdFriendly !== e.adhdFriendly || !r.every((e) => t.layerTags.includes(e))) return !1;
		let i = `${t.name} ${t.id} ${t.category} ${t.vibe} ${t.tags.join(" ")}`.toLowerCase();
		return n.every((e) => i.includes(e));
	});
}
export { X as a, Z as i, _e as n, h as o, Q as r, g as s, ve as t };
