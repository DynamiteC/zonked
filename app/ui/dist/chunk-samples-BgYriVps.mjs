import { C as e, D as t, E as n, M as r, N as i, S as a, T as o, b as s, k as c, w as l, x as u } from "./chunk-crewLink-DfIjAvPP.mjs";
import { n as d } from "./chunk-own-D62uDPlI.mjs";
// \0rolldown/runtime.js
var f = Object.defineProperty, p = (e, t) => {
	let n = Object.setPrototypeOf({}, null);
	for (var r in e) f(n, r, {
		get: e[r],
		enumerable: !0
	});
	return t & 1 || f(n, Symbol.toStringTag, { value: "Module" }), t & 2 ? n : Object.preventExtensions(n);
}, m = [
	{
		id: "rain",
		label: "Rain",
		kind: "loop",
		note: "Steady rain on leaves and ground.",
		hiss: .0851,
		btFriendly: !1,
		moods: [
			"focus",
			"calm",
			"sleep",
			"nature"
		]
	},
	{
		id: "stream",
		label: "Stream",
		kind: "loop",
		note: "Clear water running close by.",
		hiss: .0132,
		btFriendly: !0,
		moods: [
			"focus",
			"calm",
			"nature"
		]
	},
	{
		id: "ocean",
		label: "Ocean waves",
		kind: "loop",
		note: "Slow waves on a tropical beach.",
		hiss: .0106,
		btFriendly: !0,
		moods: [
			"calm",
			"sleep",
			"nature"
		]
	},
	{
		id: "rapids",
		label: "River rapids",
		kind: "loop",
		note: "A wide river over rocks, a steady wash.",
		hiss: .0121,
		btFriendly: !0,
		moods: ["focus", "nature"]
	},
	{
		id: "forest",
		label: "Forest",
		kind: "loop",
		note: "Quiet woods with a little air in the trees.",
		hiss: .0126,
		btFriendly: !0,
		moods: [
			"focus",
			"calm",
			"nature"
		]
	},
	{
		id: "birds",
		label: "Birds",
		kind: "loop",
		note: "Birds singing in a garden.",
		hiss: .4457,
		btFriendly: !1,
		moods: ["calm", "nature"]
	},
	{
		id: "breeze",
		label: "Breeze and birds",
		kind: "loop",
		note: "A soft breeze with birds far off.",
		hiss: 2e-4,
		btFriendly: !0,
		moods: ["calm", "nature"]
	},
	{
		id: "lightrain",
		label: "Light rain",
		kind: "loop",
		note: "Fine rain with a faint rumble far away.",
		hiss: .0469,
		btFriendly: !1,
		moods: [
			"focus",
			"calm",
			"sleep",
			"nature"
		]
	},
	{
		id: "thunder",
		label: "Far thunder",
		kind: "loop",
		note: "Light rain with slow thunder in the distance.",
		hiss: .0343,
		btFriendly: !0,
		moods: [
			"calm",
			"sleep",
			"nature"
		]
	},
	{
		id: "veranda",
		label: "Rain on a veranda",
		kind: "loop",
		note: "Rain on a covered porch.",
		hiss: .072,
		btFriendly: !1,
		moods: [
			"focus",
			"calm",
			"sleep",
			"nature"
		]
	},
	{
		id: "window",
		label: "Rain on a window",
		kind: "loop",
		note: "Rain tapping on glass.",
		hiss: .0047,
		btFriendly: !0,
		moods: [
			"focus",
			"calm",
			"sleep"
		]
	},
	{
		id: "storm",
		label: "Summer rain",
		kind: "loop",
		note: "A long, even summer shower.",
		hiss: .1452,
		btFriendly: !1,
		moods: [
			"focus",
			"sleep",
			"nature"
		]
	},
	{
		id: "waves",
		label: "Gentle waves",
		kind: "loop",
		note: "Water rolling in and out on a shore.",
		hiss: .0028,
		btFriendly: !0,
		moods: [
			"calm",
			"sleep",
			"nature"
		]
	},
	{
		id: "pebbles",
		label: "Waves on pebbles",
		kind: "loop",
		note: "Waves pulling back over small stones.",
		hiss: .0032,
		btFriendly: !0,
		moods: [
			"calm",
			"sleep",
			"nature"
		]
	},
	{
		id: "creek",
		label: "Forest creek",
		kind: "loop",
		note: "A small creek in a quiet wood.",
		hiss: .043,
		btFriendly: !1,
		moods: [
			"focus",
			"calm",
			"nature"
		]
	},
	{
		id: "trickle",
		label: "Water trickle",
		kind: "loop",
		note: "Thin water dripping and running.",
		hiss: .1378,
		btFriendly: !1,
		moods: ["focus", "calm"]
	},
	{
		id: "fountain",
		label: "Fountain",
		kind: "loop",
		note: "A town fountain, a bright steady wash.",
		hiss: .2373,
		btFriendly: !1,
		moods: ["focus", "calm"]
	},
	{
		id: "fire",
		label: "Fire crackle",
		kind: "loop",
		note: "Dry grass crackling in an open fireplace.",
		hiss: .3504,
		btFriendly: !1,
		moods: ["calm", "sleep"]
	},
	{
		id: "chimes",
		label: "Wind chimes",
		kind: "loop",
		note: "Chimes in a light wind, with soft gaps.",
		hiss: .0019,
		btFriendly: !0,
		moods: ["calm", "nature"]
	},
	{
		id: "koshi",
		label: "Koshi chimes",
		kind: "loop",
		note: "Slow, airy chimes that ring out and fade.",
		hiss: .0183,
		btFriendly: !0,
		moods: ["calm", "sleep"]
	},
	{
		id: "gong",
		label: "Temple gong",
		kind: "loop",
		note: "Deep gong strikes with long, slow fades.",
		hiss: 0,
		btFriendly: !0,
		moods: ["calm", "sleep"]
	},
	{
		id: "hum",
		label: "Fan hum",
		kind: "loop",
		note: "A smooth room hum, like a fan.",
		hiss: .007,
		btFriendly: !0,
		moods: ["focus", "sleep"]
	},
	{
		id: "wind",
		label: "Soft wind (synth)",
		kind: "synth",
		note: "Slow gusts of warm wind, made in code.",
		btFriendly: !0,
		moods: [
			"calm",
			"sleep",
			"nature"
		]
	},
	{
		id: "waterfall",
		label: "Waterfall (synth)",
		kind: "synth",
		note: "A steady, soft fall of water, made in code.",
		btFriendly: !0,
		moods: [
			"focus",
			"calm",
			"nature"
		]
	},
	{
		id: "flute",
		label: "Soft flute (synth)",
		kind: "synth",
		note: "Slow, quiet notes, made in code. Not a real flute.",
		btFriendly: !0,
		moods: ["calm", "sleep"]
	},
	{
		id: "rainroof",
		label: "Rain on a roof (synth)",
		kind: "synth",
		note: "Soft drops on a roof, made in code.",
		btFriendly: !1,
		moods: [
			"focus",
			"calm",
			"sleep"
		]
	},
	{
		id: "bowl",
		label: "Singing bowl (synth)",
		kind: "synth",
		note: "One slow strike every 8 to 14 s, made in code.",
		btFriendly: !0,
		moods: ["calm", "sleep"]
	},
	{
		id: "softchimes",
		label: "Soft chimes (synth)",
		kind: "synth",
		note: "A few high notes now and then, made in code.",
		btFriendly: !0,
		moods: ["calm", "sleep"]
	},
	{
		id: "crackle",
		label: "Campfire crackle (synth)",
		kind: "synth",
		note: "A low glow with small pops, made in code.",
		btFriendly: !1,
		moods: ["calm", "sleep"]
	},
	{
		id: "brown",
		label: "Brown noise (synth)",
		kind: "synth",
		note: "A deep, soft rumble that masks noise.",
		btFriendly: !0,
		moods: ["focus", "sleep"]
	},
	{
		id: "swell",
		label: "Ocean swell (synth)",
		kind: "synth",
		note: "Slow waves that rise and fall, made in code.",
		btFriendly: !0,
		moods: [
			"calm",
			"sleep",
			"nature"
		]
	},
	{
		id: "crickets",
		label: "Night crickets (synth)",
		kind: "synth",
		note: "Quiet crickets far off, made in code.",
		btFriendly: !1,
		moods: [
			"calm",
			"sleep",
			"nature"
		]
	}
], h = "decode timeout", g = {
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
function _(e, t, n) {
	return new Promise((r, i) => {
		let a = setTimeout(() => i(/* @__PURE__ */ Error(h)), n);
		e.decodeAudioData(t).then((e) => {
			clearTimeout(a), r(e);
		}, (e) => {
			clearTimeout(a), i(e instanceof Error ? e : Error(String(e)));
		});
	});
}
function v(e) {
	if (typeof e.getChannelData != "function" || !(e.length >= 2)) return;
	let t = e.getChannelData(0), n = 0;
	for (let e = 0; e < t.length; e += 64) n = Math.max(n, Math.abs(t[e] ?? 0));
	c(t[0] ?? 0, t[t.length - 1] ?? 0, n) && r.record(Date.now(), "seam");
}
var y = (e) => ({
	ok: !1,
	error: e
}), b = 20261128, x = /^[a-z]+$/;
function S(e) {
	let i = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map(), d = null, f = 0, p = null, S = 0, C = 0, w = () => d === null ? 0 : p ?? l(f);
	function T(e) {
		e.duck.gain.setTargetAtTime(t(w()), e.ctx.currentTime, s);
	}
	function E(t) {
		if (!x.test(t) || !m.some((e) => e.id === t)) return null;
		try {
			let n = new URL(`${e.baseUrl}samples/${t}.mp3.json`, e.origin);
			return n.origin === new URL(e.origin).origin ? n.href : null;
		} catch {
			return null;
		}
	}
	async function D(t, n) {
		if (i.has(n)) return { ok: !0 };
		let a = E(n);
		if (a === null) return y("unknown sample");
		try {
			let r = await e.fetchBytes(a), o = await _(t.ctx, r, e.decodeTimeoutMs ?? 8e3);
			return i.set(n, o), v(o), { ok: !0 };
		} catch (e) {
			return r.record(Date.now(), "decode"), e instanceof Error && e.message === h ? y(h) : y("sample unavailable: check the connection or reinstall the app files");
		}
	}
	function O(e, t) {
		let n = c.get(t);
		if (n !== void 0) return n;
		let r = D(e, t).finally(() => {
			c.delete(t);
		});
		return c.set(t, r), r;
	}
	function k(e, t) {
		let n = t.ctx.currentTime, r = e.gain.gain;
		r.cancelScheduledValues(n), r.setValueAtTime(r.value, n), r.linearRampToValueAtTime(0, n + u);
		try {
			e.src.stop(n + u + .05);
		} catch {}
		e.src.onended = () => {
			e.src.disconnect(), e.gain.disconnect();
		};
	}
	function A(e, t, r, i, a) {
		d !== null && k(d, e), f = n(i, f);
		let o = e.ctx.createBufferSource(), s = e.ctx.createGain();
		o.buffer = r, o.loop = a, s.gain.setValueAtTime(0, e.ctx.currentTime), s.gain.linearRampToValueAtTime(f, e.ctx.currentTime + 2), o.connect(s), s.connect(e.input);
		let c = {
			id: t,
			src: o,
			gain: s
		};
		return a || (o.onended = () => {
			o.disconnect(), s.disconnect(), d === c && (d = null, T(e));
		}), o.start(), d = c, T(e), { ok: !0 };
	}
	async function j(e, t, r, i) {
		let a;
		try {
			a = (await import("./chunk-graph-pvSx_qiJ.mjs")).buildSynth;
		} catch {
			return y("sample unavailable: reinstall the app files");
		}
		if (i !== S) return { ok: !0 };
		d !== null && k(d, e), f = n(r, f);
		let o = a(e.ctx, t, b + C++), s = e.ctx.createGain();
		return s.gain.setValueAtTime(0, e.ctx.currentTime), s.gain.linearRampToValueAtTime(f, e.ctx.currentTime + 2), o.connect(s), s.connect(e.input), d = {
			id: t,
			src: o,
			gain: s
		}, T(e), { ok: !0 };
	}
	return {
		list: () => m,
		async start(t, n) {
			let r = e.getBus();
			if (r === null) return y("start the sound first");
			let a = ++S;
			if (m.some((e) => e.id === t && e.kind === "synth")) return j(r, t, n, a);
			let o = await O(r, t), s = g[t];
			if (!o.ok && o.error === h && s !== void 0 && a === S) {
				let e = await j(r, s, n, a), t = (m.find((e) => e.id === s)?.label ?? s).replace(" (synth)", "").toLowerCase();
				return e.ok ? {
					ok: !0,
					note: `The recording could not load in this browser, so a made-in-code sound (${t}) plays instead.`
				} : e;
			}
			if (!o.ok) return o.error === h ? y("sample unavailable: this browser could not decode it") : o;
			let c = i.get(t);
			return c === void 0 || a !== S ? c === void 0 ? y("sample unavailable") : { ok: !0 } : A(r, t, c, n, !0);
		},
		startBuffer(t, n, r, i) {
			let a = e.getBus();
			return a === null ? y("start the sound first") : (S++, A(a, t, n, r, i));
		},
		setLevel(t) {
			f = n(t, f);
			let r = e.getBus();
			if (r === null || d === null) return;
			let i = d.gain.gain;
			i.cancelScheduledValues(r.ctx.currentTime), i.setTargetAtTime(f, r.ctx.currentTime, a), T(r);
		},
		setBlend(t) {
			p = o(t, p ?? 0);
			let n = e.getBus();
			n !== null && T(n);
		},
		stop() {
			S++;
			let t = e.getBus(), n = d;
			d = null, t !== null && n !== null && (k(n, t), T(t));
		},
		playing: () => d?.id ?? null
	};
}
// ../../web/src/audio/samples/index.ts
var C = /* @__PURE__ */ p({
	MAX_SAMPLE_LEVEL: () => e,
	duckGain: () => t,
	listSamples: () => E,
	playingSample: () => j,
	setBlend: () => A,
	setSampleLevel: () => O,
	startOwn: () => M,
	startSample: () => D,
	stopSample: () => k
});
async function w(e) {
	let t = await fetch(e, { credentials: "same-origin" });
	if (!t.ok) throw Error(`status ${t.status}`);
	return t.arrayBuffer();
}
var T = S({
	getBus: i,
	fetchBytes: w,
	baseUrl: "./",
	origin: typeof location > "u" ? "" : location.href
}), E = () => T.list(), D = (e, t) => T.start(e, t), O = (e) => T.setLevel(e), k = () => T.stop(), A = (e) => T.setBlend(e), j = () => T.playing();
async function M(e, t, n) {
	let r = i();
	if (r === null) return {
		ok: !1,
		error: "start the sound first"
	};
	try {
		let i = await r.ctx.decodeAudioData(t.slice(0)), a = Array.from({ length: i.numberOfChannels }, (e, t) => i.getChannelData(t)), o = d(a, i.sampleRate);
		if (!o.ok) return o;
		let s = r.ctx.createBuffer(1, o.data.length, i.sampleRate);
		return s.getChannelData(0).set(o.data), T.startBuffer(e, s, n, o.loop);
	} catch {
		return {
			ok: !1,
			error: "This file could not be played."
		};
	}
}
export { C as n, p as r, E as t };
