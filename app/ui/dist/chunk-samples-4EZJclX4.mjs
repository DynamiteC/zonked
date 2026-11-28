import { C as e, D as t, E as n, O as r, S as i, T as a, b as o, w as s, x as c } from "./chunk-crewLink-CH1NzHoN.mjs";
import { n as l } from "./chunk-own-D62uDPlI.mjs";
// \0rolldown/runtime.js
var u = Object.defineProperty, d = (e, t) => {
	let n = Object.setPrototypeOf({}, null);
	for (var r in e) u(n, r, {
		get: e[r],
		enumerable: !0
	});
	return t & 1 || u(n, Symbol.toStringTag, { value: "Module" }), t & 2 ? n : Object.preventExtensions(n);
}, f = [
	{
		id: "rain",
		label: "Rain",
		kind: "loop",
		note: "Steady rain on leaves and ground.",
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
		moods: ["focus", "nature"]
	},
	{
		id: "forest",
		label: "Forest",
		kind: "loop",
		note: "Quiet woods with a little air in the trees.",
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
		moods: ["calm", "nature"]
	},
	{
		id: "breeze",
		label: "Breeze and birds",
		kind: "loop",
		note: "A soft breeze with birds far off.",
		moods: ["calm", "nature"]
	},
	{
		id: "lightrain",
		label: "Light rain",
		kind: "loop",
		note: "Fine rain with a faint rumble far away.",
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
		moods: ["focus", "calm"]
	},
	{
		id: "fountain",
		label: "Fountain",
		kind: "loop",
		note: "A town fountain, a bright steady wash.",
		moods: ["focus", "calm"]
	},
	{
		id: "fire",
		label: "Fire crackle",
		kind: "loop",
		note: "Dry grass crackling in an open fireplace.",
		moods: ["calm", "sleep"]
	},
	{
		id: "chimes",
		label: "Wind chimes",
		kind: "loop",
		note: "Chimes in a light wind, with soft gaps.",
		moods: ["calm", "nature"]
	},
	{
		id: "koshi",
		label: "Koshi chimes",
		kind: "loop",
		note: "Slow, airy chimes that ring out and fade.",
		moods: ["calm", "sleep"]
	},
	{
		id: "gong",
		label: "Temple gong",
		kind: "loop",
		note: "Deep gong strikes with long, slow fades.",
		moods: ["calm", "sleep"]
	},
	{
		id: "hum",
		label: "Fan hum",
		kind: "loop",
		note: "A smooth room hum, like a fan.",
		moods: ["focus", "sleep"]
	},
	{
		id: "wind",
		label: "Soft wind (synth)",
		kind: "synth",
		note: "Slow gusts of warm wind, made in code.",
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
		moods: ["calm", "sleep"]
	},
	{
		id: "rainroof",
		label: "Rain on a roof (synth)",
		kind: "synth",
		note: "Soft drops on a roof, made in code.",
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
		moods: ["calm", "sleep"]
	},
	{
		id: "softchimes",
		label: "Soft chimes (synth)",
		kind: "synth",
		note: "A few high notes now and then, made in code.",
		moods: ["calm", "sleep"]
	},
	{
		id: "crackle",
		label: "Campfire crackle (synth)",
		kind: "synth",
		note: "A low glow with small pops, made in code.",
		moods: ["calm", "sleep"]
	},
	{
		id: "brown",
		label: "Brown noise (synth)",
		kind: "synth",
		note: "A deep, soft rumble that masks noise.",
		moods: ["focus", "sleep"]
	},
	{
		id: "swell",
		label: "Ocean swell (synth)",
		kind: "synth",
		note: "Slow waves that rise and fall, made in code.",
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
		moods: [
			"calm",
			"sleep",
			"nature"
		]
	}
], p = "decode timeout", m = {
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
function h(e, t, n) {
	return new Promise((r, i) => {
		let a = setTimeout(() => i(/* @__PURE__ */ Error(p)), n);
		e.decodeAudioData(t).then((e) => {
			clearTimeout(a), r(e);
		}, (e) => {
			clearTimeout(a), i(e instanceof Error ? e : Error(String(e)));
		});
	});
}
var g = (e) => ({
	ok: !1,
	error: e
}), _ = 20261128, v = /^[a-z]+$/;
function y(e) {
	let r = /* @__PURE__ */ new Map(), l = /* @__PURE__ */ new Map(), u = null, d = 0, y = null, b = 0, x = 0, S = () => u === null ? 0 : y ?? s(d);
	function C(e) {
		e.duck.gain.setTargetAtTime(t(S()), e.ctx.currentTime, o);
	}
	function w(t) {
		if (!v.test(t) || !f.some((e) => e.id === t)) return null;
		try {
			let n = new URL(`${e.baseUrl}samples/${t}.mp3.json`, e.origin);
			return n.origin === new URL(e.origin).origin ? n.href : null;
		} catch {
			return null;
		}
	}
	async function T(t, n) {
		if (r.has(n)) return { ok: !0 };
		let i = w(n);
		if (i === null) return g("unknown sample");
		try {
			let a = await e.fetchBytes(i), o = await h(t.ctx, a, e.decodeTimeoutMs ?? 8e3);
			return r.set(n, o), { ok: !0 };
		} catch (e) {
			return e instanceof Error && e.message === p ? g(p) : g("sample unavailable: check the connection or reinstall the app files");
		}
	}
	function E(e, t) {
		let n = l.get(t);
		if (n !== void 0) return n;
		let r = T(e, t).finally(() => {
			l.delete(t);
		});
		return l.set(t, r), r;
	}
	function D(e, t) {
		let n = t.ctx.currentTime, r = e.gain.gain;
		r.cancelScheduledValues(n), r.setValueAtTime(r.value, n), r.linearRampToValueAtTime(0, n + c);
		try {
			e.src.stop(n + c + .05);
		} catch {}
		e.src.onended = () => {
			e.src.disconnect(), e.gain.disconnect();
		};
	}
	function O(e, t, r, i, a) {
		u !== null && D(u, e), d = n(i, d);
		let o = e.ctx.createBufferSource(), s = e.ctx.createGain();
		o.buffer = r, o.loop = a, s.gain.setValueAtTime(0, e.ctx.currentTime), s.gain.linearRampToValueAtTime(d, e.ctx.currentTime + 2), o.connect(s), s.connect(e.input);
		let c = {
			id: t,
			src: o,
			gain: s
		};
		return a || (o.onended = () => {
			o.disconnect(), s.disconnect(), u === c && (u = null, C(e));
		}), o.start(), u = c, C(e), { ok: !0 };
	}
	async function k(e, t, r, i) {
		let a;
		try {
			a = (await import("./chunk-graph-pvSx_qiJ.mjs")).buildSynth;
		} catch {
			return g("sample unavailable: reinstall the app files");
		}
		if (i !== b) return { ok: !0 };
		u !== null && D(u, e), d = n(r, d);
		let o = a(e.ctx, t, _ + x++), s = e.ctx.createGain();
		return s.gain.setValueAtTime(0, e.ctx.currentTime), s.gain.linearRampToValueAtTime(d, e.ctx.currentTime + 2), o.connect(s), s.connect(e.input), u = {
			id: t,
			src: o,
			gain: s
		}, C(e), { ok: !0 };
	}
	return {
		list: () => f,
		async start(t, n) {
			let i = e.getBus();
			if (i === null) return g("start the sound first");
			let a = ++b;
			if (f.some((e) => e.id === t && e.kind === "synth")) return k(i, t, n, a);
			let o = await E(i, t), s = m[t];
			if (!o.ok && o.error === p && s !== void 0 && a === b) {
				let e = await k(i, s, n, a), t = (f.find((e) => e.id === s)?.label ?? s).replace(" (synth)", "").toLowerCase();
				return e.ok ? {
					ok: !0,
					note: `The recording could not load in this browser, so a made-in-code sound (${t}) plays instead.`
				} : e;
			}
			if (!o.ok) return o.error === p ? g("sample unavailable: this browser could not decode it") : o;
			let c = r.get(t);
			return c === void 0 || a !== b ? c === void 0 ? g("sample unavailable") : { ok: !0 } : O(i, t, c, n, !0);
		},
		startBuffer(t, n, r, i) {
			let a = e.getBus();
			return a === null ? g("start the sound first") : (b++, O(a, t, n, r, i));
		},
		setLevel(t) {
			d = n(t, d);
			let r = e.getBus();
			if (r === null || u === null) return;
			let a = u.gain.gain;
			a.cancelScheduledValues(r.ctx.currentTime), a.setTargetAtTime(d, r.ctx.currentTime, i), C(r);
		},
		setBlend(t) {
			y = a(t, y ?? 0);
			let n = e.getBus();
			n !== null && C(n);
		},
		stop() {
			b++;
			let t = e.getBus(), n = u;
			u = null, t !== null && n !== null && (D(n, t), C(t));
		},
		playing: () => u?.id ?? null
	};
}
// ../../web/src/audio/samples/index.ts
var b = /* @__PURE__ */ d({
	MAX_SAMPLE_LEVEL: () => e,
	duckGain: () => t,
	listSamples: () => C,
	playingSample: () => O,
	setBlend: () => D,
	setSampleLevel: () => T,
	startOwn: () => k,
	startSample: () => w,
	stopSample: () => E
});
async function x(e) {
	let t = await fetch(e, { credentials: "same-origin" });
	if (!t.ok) throw Error(`status ${t.status}`);
	return t.arrayBuffer();
}
var S = y({
	getBus: r,
	fetchBytes: x,
	baseUrl: "./",
	origin: typeof location > "u" ? "" : location.href
}), C = () => S.list(), w = (e, t) => S.start(e, t), T = (e) => S.setLevel(e), E = () => S.stop(), D = (e) => S.setBlend(e), O = () => S.playing();
async function k(e, t, n) {
	let i = r();
	if (i === null) return {
		ok: !1,
		error: "start the sound first"
	};
	try {
		let r = await i.ctx.decodeAudioData(t.slice(0)), a = Array.from({ length: r.numberOfChannels }, (e, t) => r.getChannelData(t)), o = l(a, r.sampleRate);
		if (!o.ok) return o;
		let s = i.ctx.createBuffer(1, o.data.length, r.sampleRate);
		return s.getChannelData(0).set(o.data), S.startBuffer(e, s, n, o.loop);
	} catch {
		return {
			ok: !1,
			error: "This file could not be played."
		};
	}
}
export { b as n, d as r, C as t };
