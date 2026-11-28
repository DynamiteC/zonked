// ../../web/src/catalog/soundMenu.ts
var e = [
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
], t = (e) => Number.isFinite(e) ? Math.min(1, Math.max(0, e)) : 0;
function n(e, n) {
	let r = t(n);
	switch (e) {
		case "lofi": return {
			noise: "off",
			noiseLevel: 0,
			layers: {
				lofiLevel: r,
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
				instLevel: r,
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
			noiseLevel: r,
			layers: {}
		};
		case "rain": return {
			noise: "pink",
			noiseLevel: r,
			layers: {}
		};
		case "deep": return {
			noise: "brown",
			noiseLevel: r,
			layers: {}
		};
		case "chimes": return {
			noise: "off",
			noiseLevel: 0,
			layers: {
				chimeLevel: r,
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
var r = [
	2.5,
	6,
	10,
	14,
	20
];
function i(e) {
	let n = t(e), i = Math.min(r.length - 1, Math.floor(n * r.length));
	return Math.min(40, Math.max(.5, r[i] ?? 2.5));
}
function a(e, n) {
	let r = t(e);
	return {
		breathDepth: t(n.breathDepth * (1 - .6 * r)),
		breathRateHz: Math.min(.2, Math.max(.05, .06 + .1 * r)),
		instBpm: Math.min(180, Math.max(30, Math.round(n.instBpm * (.8 + .6 * r)))),
		lofiWarmth: t(n.lofiWarmth * (1 - .4 * r))
	};
}
export { n as i, i as n, a as r, e as t };
