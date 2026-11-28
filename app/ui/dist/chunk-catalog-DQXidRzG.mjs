import "./chunk-crewLink-B-5l2pQt.mjs";
// ../../web/src/catalog/dsl.ts
function e(e) {
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
var t = (e, t) => e[(t % e.length + e.length) % e.length], n = [
	98,
	110,
	123.5,
	87.3,
	103.8,
	130.8
], r = [
	196,
	220,
	247,
	175,
	165,
	262
], i = {
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
}, a = (e) => [...e].reduce((e, t) => (e * 31 + t.charCodeAt(0)) % 9973, 7);
function o(e, o, s) {
	let c = a(e) + s;
	return {
		prog: t(i[o], c),
		key: t(n, c),
		pianoRoot: t(r, c >> 1)
	};
}
function s(e, n, r) {
	let i = e === "dreamy" || e === "ethereal" || e === "calm";
	return {
		breathDepth: t([
			.45,
			.4,
			.3,
			.2,
			.1
		], n - 1),
		breathRateHz: .06 + r % 5 * .02,
		stereoWidth: .3 + r % 4 * .1,
		panDepth: i ? .15 : 0,
		panRateHz: .03 + r % 4 * .01
	};
}
var c = {
	lofi: (e, n) => ({
		lofiLevel: .45,
		lofiWarmth: t([
			.5,
			.6,
			.7
		], e),
		lofiProgression: n.prog,
		tapeWow: t([
			.25,
			.35,
			.45
		], e),
		padRootHz: n.key
	}),
	piano: (e, n) => ({
		instLevel: .35,
		instKind: 3,
		instRootHz: n.pianoRoot,
		instScale: t([
			2,
			0,
			1,
			4,
			3
		], e),
		instBpm: t([
			40,
			46,
			52
		], e),
		pianoPedal: t([
			.4,
			.55,
			.7
		], e)
	}),
	crackle: () => ({ crackle: .12 }),
	drone: (e) => ({
		instLevel: .35,
		instKind: 1,
		instRootHz: t([
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
		instRootHz: t([
			196,
			220,
			247,
			262
		], e),
		instScale: t([
			0,
			2,
			4,
			1
		], e),
		instBpm: t([
			48,
			56,
			64,
			72
		], e)
	}),
	bell: (e) => ({
		instLevel: .28,
		instKind: 2,
		instRootHz: t([
			262,
			294,
			330,
			349
		], e),
		instScale: 4,
		instBpm: 40
	}),
	pad: (e, n) => ({
		padLevel: .4,
		padChord: t([
			0,
			2,
			4,
			6
		], e),
		padRootHz: n.key
	}),
	chimes: (e) => ({
		chimeLevel: .25,
		chimeRatePerMin: t([
			3,
			4,
			6,
			8
		], e)
	}),
	perc: (e) => ({
		percLevel: .2,
		percBpm: t([
			64,
			72,
			80,
			92
		], e),
		percPattern: t([
			0,
			3,
			4,
			7
		], e)
	})
};
function l(e, t, n = {
	prog: 0,
	key: 110,
	pianoRoot: 220
}) {
	return e.reduce((e, r) => ({
		...e,
		...c[r](t, n)
	}), {});
}
var u = (e) => Math.round(e * 1e3) / 1e3, d = (e) => Math.min(40, Math.max(.5, e));
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
function f(e, n, r, i, a) {
	let c = (n % 3 - 1) * e.jitter, f = d(e.to + c), p = t(e.noises, n >> 1), m = t(e.layers, n * 2 + (n >> 1)), h = t(e.vibes, n), g = l(m, n, o(e.slug, h, n)), _ = Object.keys(g).length > 0, v = _ ? {
		...g,
		...s(h, e.intensity, n)
	} : g;
	return ee(e.shape, r, d(e.from), f, e.ret).map((t) => ({
		atMin: u(t.t),
		beatHz: u(d(t.beat)),
		carrierHz: i,
		gain: e.gain,
		mode: a,
		noise: p[0],
		noiseLevel: p[1],
		..._ ? { layers: v } : {},
		ramp: t.ramp
	}));
}
function p(e) {
	let t = /* @__PURE__ */ new Set();
	for (let n of e) {
		t.add(n.mode);
		let e = n.layers;
		n.noise !== "off" && n.noiseLevel > 0 && t.add("noise"), e !== void 0 && (((e.lofiLevel ?? 0) > 0 || (e.crackle ?? 0) > 0) && t.add("lofi"), (e.instLevel ?? 0) > 0 && t.add("instrument"), (e.padLevel ?? 0) > 0 && t.add("pad"), (e.chimeLevel ?? 0) > 0 && t.add("chimes"), (e.percLevel ?? 0) > 0 && t.add("percussion"));
	}
	return [...t];
}
function m(e, t) {
	if (t > 3) return !1;
	let n = e.every((t, n) => n === 0 || Math.abs(t.beatHz - (e[n - 1]?.beatHz ?? t.beatHz)) <= 4), r = e.every((e) => e.mode === "isochronic" || e.beatHz >= 12 && e.beatHz <= 20), i = e.every((e) => (e.layers?.crackle ?? 0) === 0 && (e.layers?.percBpm ?? 0) <= 100);
	return n && r && i;
}
function h(e, n) {
	let r = e.adjectives.length, i = n * 7 % (r * e.nouns.length);
	return `${t(e.adjectives, i)} ${t(e.nouns, Math.floor(i / r))}`;
}
var g = (e) => String(e).padStart(2, "0"), _ = {
	binaural: "Binaural",
	monaural: "Monaural",
	isochronic: "Isochronic"
}, v = [
	"lofi",
	"instrument",
	"pad",
	"chimes",
	"percussion"
];
function y(e, t, n, r, i) {
	let a = i[0], o = [`${_[e]}, ${t} Hz carrier, ${n} minutes, ${r} mood`];
	a !== void 0 && a.noise !== "off" && a.noiseLevel > 0 && o.push(`${a.noise} noise`);
	let s = i[i.length - 1];
	a !== void 0 && s !== void 0 && a.beatHz !== s.beatHz && o.push(`beat ${a.beatHz} to ${s.beatHz} Hz`);
	let c = p(i).filter((e) => v.includes(e));
	return c.length > 0 && o.push(c.join(" and ")), `${o.join(", ")}.`;
}
function b(e, n, r, i) {
	let a = t(n.mins, r), o = t(n.carriers, r * 3 + 1), s = t(n.modes, r + (r >> 2)), c = f(n, r, a, o, s), l = n.to < 4 ? "delta" : n.to < 8 ? "theta" : n.to < 12 ? "alpha" : n.to < 30 ? "beta" : "gamma";
	return {
		id: `${e.prefix}-${n.slug}-${g(r + 1)}`,
		name: h(e, i),
		category: e.category,
		vibe: t(n.vibes, r),
		tags: [
			n.slug,
			l,
			s,
			...n.tags
		],
		layerTags: p(c),
		situations: n.situations,
		recommendedMinutes: a,
		intensity: n.intensity,
		adhdFriendly: m(c, n.intensity),
		stages: c,
		reasonTemplate: `${n.reason.replace("{tone}", _[s])} ${y(s, o, a, t(n.vibes, r), c)}`,
		source: "original",
		...n.breath === void 0 ? {} : { breath: n.breath }
	};
}
function x(e) {
	let t = 0;
	return te(e.archs.flatMap((n) => Array.from({ length: n.count }, (r, i) => b(e, n, i, t++))));
}
function te(e) {
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
var ne = {
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
		e({
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
		e({
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
		e({
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
		e({
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
		e({
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
		e({
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
}, S = {
	category: "focus",
	prefix: "focus",
	adjectives: [
		"Sharp",
		"Deep",
		"Clear",
		"Limpid",
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
		e({
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
		e({
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
		e({
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
		e({
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
		e({
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
		e({
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
}, re = {
	category: "healing",
	prefix: "healing",
	adjectives: [
		"Quiet",
		"Tender",
		"Mellow",
		"Kind",
		"Balmy",
		"Silken",
		"Fresh",
		"Warming",
		"Settled",
		"Easing",
		"Gentle",
		"Round"
	],
	nouns: [
		"Meadow",
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
		e({
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
		e({
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
		e({
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
		e({
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
		e({
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
		e({
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
}, ie = {
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
		e({
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
			reason: "Theta plateau with a light return, sized for a long, quiet night."
		}),
		e({
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
		e({
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
		e({
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
		e({
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
}, ae = {
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
		e({
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
		e({
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
		e({
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
		e({
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
		e({
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
		e({
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
}, C = {
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
		e({
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
		e({
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
		e({
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
		e({
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
		e({
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
		e({
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
}, w = {
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
		e({
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
		e({
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
		e({
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
		e({
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
		e({
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
		e({
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
}, T = {
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
		e({
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
		e({
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
		e({
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
		e({
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
		e({
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
		e({
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
}, E = " This is a long session. Take a break if you need one.", D = (e) => Math.round(e * 1e3) / 1e3, O = (e) => Math.min(40, Math.max(.5, e)), k = (e) => e.segs.reduce((e, t) => e + t[0], 0) * (e.scale ?? 1);
function A(e, t) {
	let n = e.carrier ?? 210;
	return e.carrierEnd === void 0 ? n : Math.round(n + (e.carrierEnd - n) * t / Math.max(k(e), 1));
}
function j(e) {
	let t = [], [n, r] = e.noise ?? ["off", 0], i = 0;
	return e.segs.forEach((a, o) => {
		let s = a[1] !== a[2], c = e.segs[o + 1];
		t.push({
			atMin: D(i / 60),
			beatHz: D(O(a[1])),
			carrierHz: A(e, i),
			gain: e.gain ?? .45,
			mode: e.mode ?? "binaural",
			noise: n,
			noiseLevel: r,
			ramp: s
		}), i += a[0] * (e.scale ?? 1), s && (c === void 0 || O(c[1]) !== O(a[2])) && t.push({
			...t[t.length - 1],
			atMin: D(i / 60),
			beatHz: D(O(a[2])),
			carrierHz: A(e, i),
			ramp: !1
		});
	}), t;
}
var M = (e, t) => e.replaceAll("{minutes}", String(t)).replaceAll("{duration}", `${t} minutes`);
function N(e) {
	let t = j(e), n = Math.max(1, Math.round(k(e) / 60));
	return {
		id: e.id,
		name: e.name,
		category: e.category,
		vibe: e.vibe,
		tags: [...e.tags, "original"],
		layerTags: p(t),
		situations: e.situations,
		recommendedMinutes: n,
		intensity: e.intensity,
		adhdFriendly: m(t, e.intensity),
		stages: t,
		reasonTemplate: M(e.reason, n) + (n > 60 ? E : ""),
		source: "original"
	};
}
var P = ["white", .3], F = ["pink", .3], I = ["brown", .3], L = (e, t, n, r) => Array.from({ length: e }, (e, i) => i % 2 == 0 ? [
	t,
	n,
	r
] : [
	t,
	r,
	n
]), R = (e) => e, z = [
	R({
		id: "seed-slow-settle",
		name: "Slow Settle",
		category: "meditation",
		vibe: "deep",
		situations: ["meditate"],
		intensity: 2,
		segs: [
			[
				480,
				10,
				6
			],
			[
				720,
				6,
				6
			],
			[
				240,
				6,
				9
			]
		],
		carrier: 210,
		noise: F,
		tags: ["alpha", "theta"],
		reason: "Eight minutes sliding from 10 to 6 Hz, twelve minutes steady, then a short lift."
	}),
	R({
		id: "seed-bright-run",
		name: "Bright Run",
		category: "focus",
		vibe: "energized",
		situations: ["deep-work"],
		intensity: 4,
		segs: [
			[
				180,
				14,
				20
			],
			[
				900,
				20,
				20
			],
			[
				180,
				20,
				14
			]
		],
		carrier: 240,
		noise: ["white", .2],
		tags: ["beta", "work"],
		reason: "A three minute climb to 20 Hz, a fifteen minute hold, then a three minute return."
	}),
	R({
		id: "seed-low-hour",
		name: "Low Hour",
		category: "meditation",
		vibe: "ethereal",
		situations: ["meditate", "cant-sleep"],
		intensity: 1,
		segs: [[
			900,
			5,
			3
		], [
			2700,
			3,
			2
		]],
		carrier: 190,
		noise: I,
		gain: .4,
		tags: ["delta", "long"],
		reason: "A slow slide to very low beats under brown noise, then a long quiet stretch."
	}),
	R({
		id: "seed-warm-hum",
		name: "Warm Hum",
		category: "healing",
		vibe: "warm",
		situations: ["heal-stress", "quick-reset"],
		intensity: 2,
		segs: [[
			600,
			9.5,
			9
		], [
			1200,
			9,
			8.5
		]],
		carrier: 200,
		noise: F,
		tags: ["alpha", "warm"],
		reason: "Half an hour of an almost still 9 Hz beat under pink noise."
	}),
	R({
		id: "seed-reading-room",
		name: "Reading Room",
		category: "focus",
		vibe: "bright",
		situations: ["deep-work"],
		intensity: 3,
		segs: [[
			300,
			12,
			16
		], [
			3300,
			16,
			16
		]],
		carrier: 230,
		tags: ["beta", "study"],
		reason: "A five minute lift to 16 Hz, then a steady hour for reading or writing."
	}),
	R({
		id: "seed-idea-drift",
		name: "Idea Drift",
		category: "vibes",
		vibe: "bright",
		situations: ["quick-reset", "deep-work"],
		intensity: 2,
		segs: L(6, 240, 9, 11.5),
		carrier: 220,
		noise: ["white", .25],
		tags: ["alpha", "wave"],
		reason: "A slow wave between 9 and 11.5 Hz, one swing every four minutes."
	}),
	R({
		id: "seed-gentle-landing",
		name: "Gentle Landing",
		category: "meditation",
		vibe: "calm",
		situations: ["meditate", "quick-reset"],
		intensity: 1,
		segs: [[
			180,
			11,
			9
		], [
			720,
			9,
			8
		]],
		carrier: 205,
		noise: P,
		tags: ["alpha", "short"],
		reason: "Three minutes settling from 11 Hz, then a calm stretch near 8 Hz."
	}),
	R({
		id: "seed-quiet-ground",
		name: "Quiet Ground",
		category: "healing",
		vibe: "grounded",
		situations: ["heal-stress", "meditate"],
		intensity: 2,
		segs: [
			[
				420,
				10,
				7
			],
			[
				600,
				7,
				7
			],
			[
				420,
				7,
				10
			]
		],
		carrier: 175,
		noise: I,
		tags: ["alpha", "theta"],
		reason: "Seven minutes down to 7 Hz, ten minutes steady, seven minutes back up."
	}),
	R({
		id: "seed-evening-slope",
		name: "Evening Slope",
		category: "lucid-dreams",
		vibe: "ethereal",
		situations: ["lucid-dream", "meditate"],
		intensity: 2,
		segs: [[
			900,
			12,
			8
		], [
			2400,
			8,
			6
		]],
		carrier: 195,
		noise: ["pink", .25],
		tags: ["alpha", "theta"],
		reason: "Fifteen minutes from 12 to 8 Hz, then a long slow slope toward 6 Hz."
	}),
	R({
		id: "seed-pace-steps",
		name: "Pace Steps",
		category: "focus",
		vibe: "energized",
		situations: ["deep-work"],
		intensity: 4,
		segs: [
			[
				180,
				14,
				22
			],
			...Array.from({ length: 5 }, () => [[
				150,
				22,
				22
			], [
				90,
				14,
				14
			]]).flat(),
			[
				180,
				22,
				12
			]
		],
		carrier: 235,
		tags: ["beta", "interval"],
		reason: "Five rounds of a brisk 22 Hz step and a short easy 14 Hz step, with a warm up and a cool down."
	}),
	R({
		id: "seed-soft-fade",
		name: "Soft Fade",
		category: "vibes",
		vibe: "ethereal",
		situations: ["quick-reset"],
		intensity: 2,
		segs: [[
			720,
			12,
			8
		]],
		carrier: 215,
		noise: ["white", .2],
		tags: ["alpha", "glide"],
		reason: "One {minutes} minute glide from 12 to 8 Hz."
	}),
	R({
		id: "seed-night-descent",
		name: "Night Descent",
		category: "sleep",
		vibe: "calm",
		situations: ["cant-sleep"],
		intensity: 1,
		segs: [
			[
				900,
				10,
				5
			],
			[
				1500,
				5,
				2.5
			],
			[
				1200,
				2.5,
				1.5
			]
		],
		carrier: 185,
		noise: I,
		gain: .42,
		tags: ["delta", "theta"],
		reason: "A long staircase from 10 Hz down to 1.5 Hz over {minutes} minutes."
	}),
	R({
		id: "seed-dream-hour",
		name: "Dream Hour",
		category: "lucid-dreams",
		vibe: "dreamy",
		situations: ["lucid-dream"],
		intensity: 2,
		segs: [
			[
				600,
				9,
				6
			],
			[
				1500,
				6,
				5.5
			],
			[
				60,
				5.5,
				7
			],
			[
				1500,
				5.5,
				5
			],
			[
				60,
				5,
				7
			],
			[
				900,
				5,
				4.5
			]
		],
		carrier: 200,
		noise: ["pink", .2],
		tags: ["theta"],
		reason: "A theta bed with two small lifts, about an hour in all."
	}),
	R({
		id: "seed-campfire-hush",
		name: "Campfire Hush",
		category: "meditation",
		vibe: "grounded",
		situations: ["meditate"],
		intensity: 2,
		segs: [
			[
				600,
				8,
				5.5
			],
			[
				1800,
				5.5,
				5
			],
			[
				600,
				5,
				8
			]
		],
		carrier: 170,
		noise: ["white", .35],
		tags: ["theta"],
		reason: "Ten minutes down to 5.5 Hz, half an hour of slow theta, ten minutes back."
	}),
	R({
		id: "seed-light-sleep-weave",
		name: "Light Sleep Weave",
		category: "sleep",
		vibe: "minimal",
		situations: ["cant-sleep"],
		intensity: 2,
		segs: [
			[
				600,
				7,
				4
			],
			[
				600,
				4,
				6
			],
			[
				600,
				6,
				3.5
			],
			[
				600,
				3.5,
				5
			],
			[
				600,
				5,
				2.5
			]
		],
		carrier: 195,
		tags: ["theta", "delta"],
		reason: "Five ten-minute weaves that each end a little lower than the last."
	}),
	R({
		id: "seed-long-night",
		name: "Long Night",
		category: "lucid-dreams",
		vibe: "deep",
		situations: ["lucid-dream", "cant-sleep"],
		intensity: 2,
		segs: [
			[
				900,
				8,
				4
			],
			[
				3600,
				4,
				3
			],
			[
				1800,
				3,
				2
			],
			[
				1800,
				2,
				3
			],
			[
				900,
				3,
				6
			]
		],
		carrier: 180,
		noise: F,
		gain: .4,
		tags: ["delta", "long"],
		reason: "A two hour night plan: a slow fall, a deep middle and a soft rise."
	}),
	R({
		id: "seed-steady-blocks",
		name: "Steady Blocks",
		category: "adhd-control",
		vibe: "energized",
		situations: ["adhd-focus", "deep-work"],
		intensity: 3,
		segs: [
			[
				240,
				14,
				16
			],
			[
				300,
				16,
				16
			],
			[
				300,
				13,
				13
			],
			[
				300,
				16,
				16
			],
			[
				300,
				13,
				13
			]
		],
		carrier: 225,
		noise: ["white", .25],
		tags: ["beta", "blocks"],
		reason: "Five minute blocks that alternate between 16 and 13 Hz."
	}),
	R({
		id: "seed-short-settle",
		name: "Short Settle",
		category: "meditation",
		vibe: "calm",
		situations: ["meditate", "quick-reset"],
		intensity: 2,
		segs: [
			[
				240,
				10,
				6
			],
			[
				240,
				6,
				6
			],
			[
				120,
				6,
				9
			]
		],
		carrier: 210,
		noise: P,
		tags: ["alpha", "short"],
		reason: "The slow settle shape in {minutes} minutes."
	}),
	R({
		id: "seed-pause-five",
		name: "Five Minute Pause",
		category: "work-recovery",
		vibe: "calm",
		situations: ["quick-reset", "ai-burnout"],
		intensity: 1,
		segs: [[
			100,
			11,
			8
		], [
			200,
			8,
			8
		]],
		carrier: 205,
		noise: ["white", .25],
		tags: ["alpha", "short"],
		reason: "A {minutes} minute pause between tasks."
	}),
	R({
		id: "seed-ground-reset",
		name: "Ground Reset",
		category: "healing",
		vibe: "grounded",
		situations: ["heal-stress", "quick-reset"],
		intensity: 2,
		segs: [[
			360,
			10,
			7
		], [
			240,
			7,
			7
		]],
		carrier: 175,
		noise: ["brown", .25],
		tags: ["alpha", "short"],
		reason: "A {minutes} minute version of a slow slide to 7 Hz."
	}),
	R({
		id: "seed-nap-window",
		name: "Nap Window",
		category: "lucid-dreams",
		vibe: "dreamy",
		situations: ["lucid-dream", "cant-sleep"],
		intensity: 2,
		segs: [
			[
				480,
				9,
				6
			],
			[
				1080,
				6,
				5
			],
			[
				60,
				5,
				7
			],
			[
				420,
				5,
				4.5
			]
		],
		carrier: 200,
		tags: ["theta", "short"],
		reason: "A theta bed sized for a short rest, with one small lift."
	})
], B = [
	R({
		id: "seed-midday-rest",
		name: "Midday Rest",
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
				240,
				10,
				6
			],
			[
				720,
				6,
				3.5
			],
			[
				360,
				3.5,
				3.5
			],
			[
				240,
				3.5,
				8
			]
		],
		carrier: 180,
		carrierEnd: 145,
		noise: F,
		tags: ["delta", "rest"],
		reason: "A short rest: settle, hold low, then a gentle rise at the end."
	}),
	R({
		id: "seed-long-trip",
		name: "Long Trip",
		category: "meditation",
		vibe: "calm",
		situations: ["meditate", "quick-reset"],
		intensity: 1,
		segs: [
			[
				300,
				10,
				7
			],
			[
				1500,
				7,
				5.5
			],
			[
				1500,
				5.5,
				4.5
			],
			[
				1500,
				4.5,
				6
			]
		],
		carrier: 250,
		carrierEnd: 160,
		noise: I,
		tags: ["theta", "long"],
		reason: "A tone that slowly lowers over theta beats, sized for a long sit or ride."
	}),
	R({
		id: "seed-morning-lift",
		name: "Morning Lift",
		category: "focus",
		vibe: "bright",
		situations: ["deep-work"],
		intensity: 3,
		segs: [
			[
				300,
				9,
				12
			],
			[
				600,
				12,
				15
			],
			[
				900,
				15,
				18
			],
			[
				300,
				18,
				12
			]
		],
		carrier: 220,
		tags: ["alpha", "beta"],
		reason: "Three steps up from 9 to 18 Hz over {minutes} minutes, then an easy return."
	})
];
function V() {
	return [...z, ...B].map(N);
}
// ../../web/src/catalog/soundMenu.ts
var H = [
	{
		id: "lofi",
		name: "Lo-fi",
		blurb: "Warm, slow chords with a tape and vinyl feel, like a quiet study radio.",
		mood: "warm",
		defaultLevel: .5,
		layerKeys: [
			"lofiLevel",
			"lofiProgression",
			"tapeWow",
			"crackle"
		],
		templateId: "starter-lofi",
		evidence: "preference"
	},
	{
		id: "piano",
		name: "Soft piano",
		blurb: "A soft piano playing gentle, slow phrases with long ringing notes.",
		mood: "calm",
		defaultLevel: .45,
		layerKeys: [
			"instLevel",
			"instKind",
			"pianoPedal"
		],
		templateId: "starter-piano",
		evidence: "preference"
	},
	{
		id: "violet",
		name: "Violet hiss",
		blurb: "A thin, bright hiss, like gentle static. Keep it quiet.",
		mood: "bright",
		defaultLevel: .3,
		layerKeys: [],
		templateId: "starter-violet",
		evidence: "limited"
	},
	{
		id: "rain",
		name: "Rain hush",
		blurb: "A steady rain-like hush, even across the pitches (pink noise).",
		mood: "calm",
		defaultLevel: .4,
		layerKeys: [],
		templateId: "starter-rain",
		evidence: "mixed"
	},
	{
		id: "deep",
		name: "Deep rumble",
		blurb: "A deep, low rumble like distant thunder or a big waterfall (brown noise).",
		mood: "deep",
		defaultLevel: .4,
		layerKeys: [],
		templateId: "starter-deep",
		evidence: "preference"
	},
	{
		id: "chimes",
		name: "Soft chimes",
		blurb: "Soft bells that ring now and then at uneven gaps.",
		mood: "dreamy",
		defaultLevel: .3,
		layerKeys: ["chimeLevel", "chimeRatePerMin"],
		templateId: "starter-chimes",
		evidence: "preference"
	},
	{
		id: "beats",
		name: "Beats only",
		blurb: "A soft pulse you hear as two slightly different tones, one per ear. Use headphones.",
		mood: "neutral",
		defaultLevel: 0,
		layerKeys: [],
		templateId: "starter-beats",
		evidence: "mixed"
	}
], U = (e) => Number.isFinite(e) ? Math.min(1, Math.max(0, e)) : 0;
function W(e, t) {
	let n = U(t);
	switch (e) {
		case "lofi": return {
			noise: "off",
			noiseLevel: 0,
			layers: {
				lofiLevel: n,
				lofiWarmth: .6,
				lofiProgression: 2,
				tapeWow: .35,
				crackle: .12,
				breathDepth: .4,
				breathRateHz: .08,
				stereoWidth: .5
			}
		};
		case "piano": return {
			noise: "off",
			noiseLevel: 0,
			layers: {
				instLevel: n,
				instKind: 3,
				instRootHz: 220,
				instScale: 2,
				instBpm: 46,
				pianoPedal: .5,
				breathDepth: .3,
				breathRateHz: .07,
				stereoWidth: .4
			}
		};
		case "violet": return {
			noise: "violet",
			noiseLevel: n,
			layers: {}
		};
		case "rain": return {
			noise: "pink",
			noiseLevel: n,
			layers: {}
		};
		case "deep": return {
			noise: "brown",
			noiseLevel: n,
			layers: {}
		};
		case "chimes": return {
			noise: "off",
			noiseLevel: 0,
			layers: {
				chimeLevel: n,
				chimeRatePerMin: 5,
				breathDepth: .2,
				breathRateHz: .06
			}
		};
		default: return {
			noise: "off",
			noiseLevel: 0,
			layers: {}
		};
	}
}
var G = [
	2.5,
	6,
	10,
	14,
	20
];
function oe(e) {
	let t = U(e), n = Math.min(G.length - 1, Math.floor(t * G.length));
	return Math.min(40, Math.max(.5, G[n] ?? 2.5));
}
function K(e, t) {
	let n = U(e);
	return {
		breathDepth: U(t.breathDepth * (1 - .6 * n)),
		breathRateHz: Math.min(.2, Math.max(.05, .06 + .1 * n)),
		instBpm: Math.min(180, Math.max(30, Math.round(t.instBpm * (.8 + .6 * n)))),
		lofiWarmth: U(t.lofiWarmth * (1 - .4 * n))
	};
}
// ../../web/src/catalog/starters.ts
var q = {
	warm: "warm",
	calm: "calm",
	bright: "bright",
	deep: "deep",
	dreamy: "dreamy",
	neutral: "minimal"
};
function se(e) {
	let t = W(e.id, e.defaultLevel), n = Object.keys(t.layers).length > 0, r = [{
		atMin: 0,
		beatHz: 8,
		carrierHz: 200,
		gain: .4,
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
		vibe: q[e.mood] ?? "calm",
		tags: [
			"starter",
			"sound-first",
			e.id
		],
		layerTags: p(r),
		situations: ["quick-reset", "heal-stress"],
		recommendedMinutes: 20,
		intensity: 1,
		adhdFriendly: m(r, 1),
		stages: r,
		reasonTemplate: e.blurb,
		source: "original"
	};
}
function ce() {
	return H.map(se);
}
// ../../web/src/catalog/build.ts
function le() {
	return [
		...ce(),
		...V(),
		...[
			w,
			re,
			ie,
			ae,
			C,
			ne,
			S,
			T
		].flatMap(x)
	];
}
// ../../web/src/catalog/registry.ts
var J;
function Y() {
	return J ??= le(), J;
}
new Proxy([], {
	get: (e, t) => Reflect.get(Y(), t),
	has: (e, t) => Reflect.has(Y(), t),
	ownKeys: () => Reflect.ownKeys(Y()),
	getOwnPropertyDescriptor: (e, t) => {
		let n = Reflect.getOwnPropertyDescriptor(Y(), t);
		return n === void 0 || t === "length" ? n : {
			...n,
			configurable: !0
		};
	}
});
// ../../web/src/catalog/features.ts
function X(e) {
	return e.stages.some((e) => (e.layers?.percLevel ?? 0) > 0);
}
function Z(e) {
	return e.stages.some((e) => (e.layers?.crackle ?? 0) > 0);
}
function Q(e) {
	return e.stages.some((e) => e.mode === "binaural");
}
// ../../web/src/catalog/recommend.ts
var ue = {
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
}, de = {
	morning: 0,
	afternoon: 1,
	evening: 2,
	night: 3
}, fe = (e) => Math.round(e * 10) / 10;
function $(e, t, n) {
	let r = Math.max(1, t);
	if (e <= r) return n.push(`Fits your ${r} minutes (${e} min).`), 15 * (.6 + e / r * .4);
	let i = (e - r) / r;
	return n.push(`Runs ${e} min, longer than your ${r}; you can stop any time.`), Math.max(0, 15 * (1 - i * 1.5)) - (i > .5 ? 5 : 0);
}
function pe(e, t, n) {
	return t.deviceType === "speaker" ? Q(e) ? (n.push("Warning: binaural beats need headphones. A speaker will not deliver the effect; pick an isochronic or monaural template if you can."), -8) : (n.push("Isochronic or monaural beats work over speakers."), 10) : (n.push(t.deviceType === "bluetooth" ? "Good over Bluetooth headphones." : "Headphones suit every beat type."), Q(e) ? 10 : 8);
}
function me(e, t, n) {
	let r = e.intensity > 3 || X(e) || Z(e), i = t.sensorySensitivity;
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
	r ? (i += 40, n.push(`Made for: ${t.situation}.`)) : n.push(`Related option: not built for ${t.situation}, but close in mood.`), t.vibe === void 0 ? i += 7 : t.vibe === e.vibe && (i += 15, n.push(`Matches your ${t.vibe} vibe.`)), i += $(e.recommendedMinutes, t.availableMinutes, n);
	let a = (ue[e.category][de[t.timeOfDay]] ?? 0) * 10;
	i += a, a >= 8 && n.push(`Suits the ${t.timeOfDay}.`), e.intensity >= 4 && t.timeOfDay === "night" && (i -= 5), i += pe(e, t, n);
	let o = me(e, t, n);
	return i += o.pts, {
		template: e,
		score: Math.max(0, fe(i)),
		reasons: n,
		sensitive: o.sensitive,
		onSituation: r
	};
}
var ge = (e, t) => t.score - e.score || (e.template.id < t.template.id ? -1 : +(e.template.id > t.template.id));
function _e(e, t = 5, n = Y()) {
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
function ve(e, t = Y()) {
	let n = (e.text ?? "").toLowerCase().split(/\s+/).filter((e) => e.length > 0), r = e.layerTags ?? [];
	return t.filter((t) => {
		if (e.category !== void 0 && t.category !== e.category || e.vibe !== void 0 && t.vibe !== e.vibe || e.adhdFriendly !== void 0 && t.adhdFriendly !== e.adhdFriendly || !r.every((e) => t.layerTags.includes(e))) return !1;
		let i = `${t.name} ${t.id} ${t.category} ${t.vibe} ${t.tags.join(" ")}`.toLowerCase();
		return n.every((e) => i.includes(e));
	});
}
export { Y as a, K as c, X as i, p as l, _e as n, H as o, Z as r, oe as s, ve as t, m as u };
