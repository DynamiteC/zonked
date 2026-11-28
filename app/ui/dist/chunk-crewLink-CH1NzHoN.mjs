import { useEffect as e, useState as t } from "react";
import * as n from "@kirocrew/app-sdk";
// ../../web/src/sbg/layers.ts
var r = {
	level: {
		min: 0,
		max: 1
	},
	instRootHz: {
		min: 55,
		max: 880
	},
	padRootHz: {
		min: 55,
		max: 440
	},
	bpm: {
		min: 30,
		max: 180
	},
	chimeRatePerMin: {
		min: 1,
		max: 30
	},
	breathRateHz: {
		min: .05,
		max: .2
	},
	panRateHz: {
		min: .02,
		max: .2
	},
	enumMax: 7,
	instKindMax: 3
}, i = Object.freeze({
	lofiLevel: 0,
	lofiWarmth: .5,
	crackle: 0,
	instLevel: 0,
	instKind: 0,
	instRootHz: 220,
	instScale: 0,
	instBpm: 60,
	padLevel: 0,
	padChord: 0,
	padRootHz: 110,
	chimeLevel: 0,
	chimeRatePerMin: 6,
	percLevel: 0,
	percBpm: 70,
	percPattern: 0,
	lofiProgression: 0,
	tapeWow: 0,
	pianoPedal: 0,
	breathDepth: 0,
	breathRateHz: .1,
	stereoWidth: 0,
	panDepth: 0,
	panRateHz: .05
}), a = {
	maxBytes: 262144,
	maxEvents: 500,
	maxLineLength: 512
}, o = {
	carrierMin: 20,
	carrierMax: 1500,
	beatMin: .5,
	beatMax: 40,
	gainMin: 0,
	gainMax: .85,
	noiseMin: 0,
	noiseMax: 1,
	maxTimeSec: 86400,
	maxDiagnostics: 1e3
}, s = .3, c = (e, t, n) => Number.isFinite(e) ? Math.min(n, Math.max(t, e)) : t, l = (e) => c(e, r.level.min, r.level.max), u = (e, t) => Math.round(c(e, 0, t));
function d(e) {
	let t = {
		...i,
		...e
	}, n = r;
	return {
		lofiLevel: l(t.lofiLevel),
		lofiWarmth: l(t.lofiWarmth),
		crackle: l(t.crackle),
		instLevel: l(t.instLevel),
		instKind: u(t.instKind, n.instKindMax),
		instRootHz: c(t.instRootHz, n.instRootHz.min, n.instRootHz.max),
		instScale: u(t.instScale, n.enumMax),
		instBpm: c(t.instBpm, n.bpm.min, n.bpm.max),
		padLevel: l(t.padLevel),
		padChord: u(t.padChord, n.enumMax),
		padRootHz: c(t.padRootHz, n.padRootHz.min, n.padRootHz.max),
		chimeLevel: l(t.chimeLevel),
		chimeRatePerMin: c(t.chimeRatePerMin, n.chimeRatePerMin.min, n.chimeRatePerMin.max),
		percLevel: l(t.percLevel),
		percBpm: c(t.percBpm, n.bpm.min, n.bpm.max),
		percPattern: u(t.percPattern, n.enumMax),
		lofiProgression: u(t.lofiProgression, n.enumMax),
		tapeWow: l(t.tapeWow),
		pianoPedal: l(t.pianoPedal),
		breathDepth: l(t.breathDepth),
		breathRateHz: c(t.breathRateHz, n.breathRateHz.min, n.breathRateHz.max),
		stereoWidth: l(t.stereoWidth),
		panDepth: l(t.panDepth),
		panRateHz: c(t.panRateHz, n.panRateHz.min, n.panRateHz.max)
	};
}
function f(e, t, n) {
	return {
		tSec: t,
		voice: {
			carrierHz: c(e.carrierHz, o.carrierMin, o.carrierMax),
			beatHz: c(e.beatHz, o.beatMin, o.beatMax),
			noise: e.noise,
			noiseLevel: c(e.noiseLevel, o.noiseMin, o.noiseMax),
			mode: e.mode,
			gain: c(e.gain, o.gainMin, o.gainMax),
			...e.beatLevel === void 0 ? {} : { beatLevel: c(e.beatLevel, 0, 1) },
			layers: d(e.layers)
		},
		ramp: e.ramp,
		line: n
	};
}
function p(e) {
	let t = 0, n = e.stages.slice(0, 499).map((e, n) => {
		let r = Number.isFinite(e.atMin) ? e.atMin * 60 : 0;
		return t = c(Math.max(t, r), 0, o.maxTimeSec), f(e, t, n + 1);
	}), r = e.stages[Math.min(e.stages.length, 499) - 1];
	if (r === void 0) return n;
	let i = c(Math.max(t, e.recommendedMinutes * 60), 0, o.maxTimeSec);
	return n.push(f({
		...r,
		ramp: !1
	}, i, n.length + 1)), n;
}
// ../../web/src/sbg/lexer.ts
function m(e) {
	let t = 0;
	for (let n = 0; n < e.length; n++) {
		let r = e.charCodeAt(n);
		if (r < 128) t += 1;
		else if (r < 2048) t += 2;
		else if (r >= 55296 && r <= 56319 && n + 1 < e.length) {
			let r = e.charCodeAt(n + 1);
			r >= 56320 && r <= 57343 ? (t += 4, n++) : t += 3;
		} else t += 3;
	}
	return t;
}
function ee(e) {
	return e === 32 || e === 9 || e === 11 || e === 12 || e === 160;
}
function te(e) {
	let t = [], n = -1;
	for (let r = 0; r < e.length; r++) {
		let i = e.charCodeAt(r);
		if (i === 35) return n >= 0 && t.push(e.slice(n, r)), t;
		ee(i) ? (n >= 0 && t.push(e.slice(n, r)), n = -1) : n < 0 && (n = r);
	}
	return n >= 0 && t.push(e.slice(n)), t;
}
function ne(e) {
	let t = [], n = +(e.charCodeAt(0) === 65279), r = 1, i = n, o = (n) => {
		let o = n - i;
		if (o > a.maxLineLength) t.push({
			line: r,
			tokens: [],
			tooLong: !0
		});
		else if (o > 0) {
			let a = te(e.slice(i, n));
			a.length > 0 && t.push({
				line: r,
				tokens: a,
				tooLong: !1
			});
		}
	};
	for (; n < e.length; n++) {
		let t = e.charCodeAt(n);
		(t === 10 || t === 13) && (o(n), t === 13 && e.charCodeAt(n + 1) === 10 && n++, r++, i = n + 1);
	}
	return o(e.length), t;
}
// ../../web/src/sbg/sequencer.ts
var re = {
	carrierHz: 200,
	beatHz: 10,
	noise: "off",
	noiseLevel: 0,
	mode: "binaural",
	gain: 0
};
function h(e, t, n) {
	return e < t ? t : e > n ? n : e;
}
function ie(e, t) {
	let n = Number.isFinite(t) ? t : 0, r = 0, i = e.length - 1, a = -1;
	for (; r <= i;) {
		let t = r + i >> 1, o = e[t];
		o !== void 0 && o.tSec <= n ? (a = t, r = t + 1) : i = t - 1;
	}
	return a;
}
function ae(e) {
	let t = e[e.length - 1];
	return t === void 0 ? 0 : t.tSec;
}
function g(e, t, n) {
	return e + (t - e) * n;
}
var oe = /* @__PURE__ */ new Set([
	"instKind",
	"instScale",
	"padChord",
	"percPattern",
	"lofiProgression"
]);
function se(e, t, n) {
	if (e === void 0 && t === void 0) return;
	let r = e ?? i, a = t ?? i, o = {};
	for (let e of Object.keys(i)) o[e] = oe.has(e) ? n >= 1 ? a[e] : r[e] : g(r[e], a[e], n);
	return o;
}
function ce(e, t, n) {
	let r = se(e.layers, t.layers, n);
	return {
		carrierHz: h(g(e.carrierHz, t.carrierHz, n), o.carrierMin, o.carrierMax),
		beatHz: h(g(e.beatHz, t.beatHz, n), o.beatMin, o.beatMax),
		noise: e.noise === "off" ? t.noise : e.noise,
		noiseLevel: h(g(e.noiseLevel, t.noiseLevel, n), o.noiseMin, o.noiseMax),
		mode: e.mode,
		gain: h(g(e.gain, t.gain, n), o.gainMin, o.gainMax),
		...e.beatLevel !== void 0 || t.beatLevel !== void 0 ? { beatLevel: h(g(e.beatLevel ?? 1, t.beatLevel ?? 1, n), 0, 1) } : {},
		...r === void 0 ? {} : { layers: r }
	};
}
function le(e, t) {
	let n = ie(e, t), r = e[Math.max(0, n)];
	if (r === void 0) return re;
	let i = e[n + 1];
	if (n < 0 || !r.ramp || i === void 0) return r.voice;
	let a = Number.isFinite(t) ? t : 0, o = i.tSec - r.tSec;
	return o > 0 ? ce(r.voice, i.voice, h((a - r.tSec) / o, 0, 1)) : i.voice;
}
// ../../web/src/sbg/parser.ts
var ue = /^[+-]?[0-9]{1,15}(?:\.[0-9]{1,15})?$/, de = /^[0-9]{1,2}:[0-9]{1,2}(?::[0-9]{1,2})?$/, fe = /^[A-Za-z_][A-Za-z0-9_-]{0,31}$/, pe = 24;
function _(e) {
	return e.length > pe ? `${e.slice(0, pe)}...` : e;
}
function v(e, t, n, r) {
	n === "error" && e.errors++, e.diags.length < o.maxDiagnostics ? e.diags.push({
		line: t,
		severity: n,
		message: r
	}) : e.diags.length === o.maxDiagnostics && e.diags.push({
		line: t,
		severity: "warning",
		message: "Too many diagnostics, further messages dropped"
	});
}
function y(e) {
	if (!ue.test(e)) return null;
	let t = Number(e);
	return Number.isFinite(t) ? t : null;
}
function b(e, t, n, r, i, a) {
	if (r >= i && r <= a) return r;
	let o = r < i ? i : a;
	return v(e, t, "warning", `${n} ${r} out of range, clamped to ${o}`), o;
}
function me(e) {
	switch (e.toLowerCase()) {
		case "iso":
		case "isochronic": return "isochronic";
		case "mono":
		case "monaural": return "monaural";
		case "bin":
		case "binaural": return "binaural";
		default: return null;
	}
}
function he(e) {
	let t = e.toLowerCase();
	return t === "pink" || t === "white" || t === "brown" || t === "violet" ? t : null;
}
function ge(e, t, n, r) {
	let i = n.indexOf("/"), a = i < 0 ? n : n.slice(0, i), s = -1;
	for (let e = 0; e < a.length && s < 0; e++) {
		let t = a[e];
		(t === "@" || t === "+" && e > 0) && (s = e);
	}
	let c = s < 0 ? a : a.slice(0, s), l = s < 0 ? "" : a.slice(s + 1), u = c === "" ? null : y(c), d = l === "" ? null : y(l), f = i < 0 ? null : y(n.slice(i + 1));
	return c !== "" && u === null || s >= 0 && d === null || i >= 0 && f === null || a === "" ? !1 : (u !== null && (r.carrier = b(e, t, "carrier", u, o.carrierMin, o.carrierMax)), d !== null && (r.beat = b(e, t, "beat", d, o.beatMin, o.beatMax)), f !== null && (r.gain = b(e, t, "gain", f, o.gainMin, o.gainMax)), !0);
}
function _e(e, t, n, r) {
	let i = n.indexOf("/"), a = he(i < 0 ? n : n.slice(0, i));
	if (a === null) return !1;
	let c = s;
	if (i >= 0) {
		let r = y(n.slice(i + 1));
		if (r === null) return !1;
		c = b(e, t, "noise level", r / 100, o.noiseMin, o.noiseMax);
	}
	return r.noise = a, r.noiseLevel = c, !0;
}
function ve(e, t, n, r) {
	let i = me(n);
	if (i !== null) r.mode = i;
	else if (_e(e, t, n, r)) return;
	else ge(e, t, n, r) || v(e, t, "warning", `Unknown token "${_(n)}" skipped`);
}
function ye(e, t) {
	let n = t.carrier === void 0 && t.beat === void 0 && t.gain === void 0 && t.noise !== void 0;
	return {
		carrierHz: t.carrier ?? 200,
		beatHz: t.beat ?? 10,
		noise: t.noise ?? "off",
		noiseLevel: t.noiseLevel ?? 0,
		mode: t.mode ?? e.mode,
		gain: n ? 0 : t.gain ?? .5
	};
}
function be(e, t) {
	let n = t.tokens[0] ?? "", r = n.indexOf(":"), i = n.slice(0, r), a = t.tokens.slice(1);
	if (r < n.length - 1 && a.unshift(n.slice(r + 1)), i.toLowerCase() === "mode") {
		let n = a[0] === void 0 ? null : me(a[0]);
		n === null ? v(e, t.line, "warning", "mode expects iso, mono or bin; ignored") : e.mode = n;
		return;
	}
	if (!fe.test(i)) {
		v(e, t.line, "warning", `Invalid tone-set name "${_(i)}", line skipped`);
		return;
	}
	let o = {};
	for (let n of a) ve(e, t.line, n, o);
	a.length === 0 && v(e, t.line, "warning", `Tone-set "${i}" has no parameters, defaults used`), e.defs.set(i, ye(e, o));
}
function xe(e) {
	if (e === "NOW") return 0;
	if (!de.test(e)) return null;
	let t = e.split(":").map(Number), [n = 0, r = 0, i = 0] = t.length === 2 ? [
		t[0],
		t[1],
		0
	] : t;
	return r > 59 || i > 59 ? null : n * 3600 + r * 60 + i;
}
function Se(e, t) {
	let [n = "", r, ...i] = t.tokens, s = xe(n);
	if (s === null) return v(e, t.line, "error", `Invalid time "${_(n)}", expected HH:MM:SS`);
	if (s > o.maxTimeSec) return v(e, t.line, "error", "Time exceeds 24 hours");
	if (s < e.lastT) return v(e, t.line, "error", "Times must not decrease");
	if (r === void 0) return v(e, t.line, "warning", "Sequence line has no tone-set name, skipped");
	let c = r, l = !1;
	c.endsWith("->") && (l = !0, c = c.slice(0, -2));
	for (let n of i) n === "->" && !l ? l = !0 : v(e, t.line, "warning", `Unknown token "${_(n)}" skipped`);
	let u = e.defs.get(c);
	if (u === void 0) return v(e, t.line, "warning", `Unknown tone-set "${_(c)}", line skipped`);
	if (e.events.length >= a.maxEvents) return e.stop = !0, v(e, t.line, "error", `More than ${a.maxEvents} events, parsing stopped`);
	e.lastT = s, e.events.push({
		tSec: s,
		voice: u,
		ramp: l,
		line: t.line
	});
}
function Ce(e) {
	return e === "NOW" || e.charCodeAt(0) >= 48 && e.charCodeAt(0) <= 57 && e.includes(":");
}
function we(e, t) {
	let n = t.tokens[0] ?? "";
	Ce(n) ? Se(e, t) : n.includes(":") ? be(e, t) : v(e, t.line, "warning", `Unknown token "${_(n)}", line skipped`);
}
function Te(e) {
	return {
		events: e.events,
		durationSec: ae(e.events),
		diagnostics: e.diags,
		ok: e.errors === 0
	};
}
function Ee() {
	return {
		diags: [],
		errors: 0,
		defs: /* @__PURE__ */ new Map(),
		mode: "binaural",
		events: [],
		lastT: 0,
		stop: !1
	};
}
function x(e) {
	let t = Ee();
	try {
		if (typeof e != "string") return v(t, 1, "error", "Input must be a string"), Te(t);
		if (e.length > a.maxBytes || m(e) > a.maxBytes) return v(t, 1, "error", `Input exceeds ${a.maxBytes} bytes, not parsed`), Te(t);
		for (let n of ne(e)) if (n.tooLong ? v(t, n.line, "error", `Line longer than ${a.maxLineLength} characters`) : we(t, n), t.stop) break;
		t.events.length === 0 && t.errors === 0 && v(t, 1, "warning", "No sequence events found");
	} catch (e) {
		v(t, 1, "error", `Internal parser error: ${e instanceof Error ? e.message : "unknown"}`);
	}
	return Te(t);
}
var S = [
	{
		id: "deep-focus",
		name: "Deep Focus",
		description: "40 Hz gamma beat for concentrated work.",
		sbg: "# Deep Focus: 40 Hz gamma binaural beat on a 200 Hz carrier.\nmode: bin\nfocus: 200+40/0.4\n00:00:00 focus\n"
	},
	{
		id: "flow-state",
		name: "Flow State",
		description: "18 Hz beta beat for steady, engaged flow.",
		sbg: "# Flow State: 18 Hz beta on a 220 Hz carrier.\nmode: bin\nflow: 220+18/0.4\n00:00:00 flow\n"
	},
	{
		id: "burnout-reset",
		name: "AI Burnout Reset",
		description: "10 Hz alpha gliding to 6 Hz theta over 20 minutes with soft pink noise.",
		sbg: "# AI Burnout Reset: 10 Hz alpha glides to 6 Hz theta over 20 minutes,\n# with a soft pink noise bed. Gain stays low for tired ears.\nmode: bin\nalpha: 200+10/0.35 pink/15\ntheta: 200+6/0.35 pink/20\n00:00:00 alpha ->\n00:20:00 theta\n"
	},
	{
		id: "breathwork-sync",
		name: "Breathwork Sync",
		description: "5.5 Hz theta with a 6-breath guided pacer at 5.5 breaths per minute.",
		sbg: "# Breathwork Sync: 5.5 Hz theta, 5.5 breaths per minute.\nmode: bin\nbreathe: 180+5.5/0.4\n00:00:00 breathe\n",
		breath: {
			inSec: 5.45,
			outSec: 5.45
		}
	},
	{
		id: "deep-rest",
		name: "Deep Rest",
		description: "2.5 Hz delta beat for deep rest.",
		sbg: "# Deep Rest: 2.5 Hz delta on a low 150 Hz carrier.\nmode: bin\nrest: 150+2.5/0.35 brown/10\n00:00:00 rest\n"
	},
	{
		id: "classic-1998",
		name: "Classic 1998 SBaGen Demo",
		description: "A 15 minute SBaGen-style demo with timed ramps.",
		sbg: "# ts - SBaGen style demo sequence, 1998 vintage.\n# Four tone-sets, ramps between them, about 15 minutes in all.\n# Press play, close your eyes, and enjoy the ride.\nmode: bin\nbase:  200+10/0.4 pink/10   # alpha entry\nslide: 200+7/0.4 pink/10    # slide down to theta\ndeep:  200+4/0.4 pink/15    # theta/delta border\nback:  200+9/0.4 pink/10    # coming back up\n00:00:00 base ->\n00:03:00 slide ->\n00:08:00 deep ->\n00:12:00 back ->\n00:15:00 base\n"
	}
], De = {
	brand: "Zonked",
	promise: "Free. Private. No account.",
	welcomeTitle: "Calm sound, made for you.",
	welcomeBody: "A few quick questions. Then your first sound.",
	skip: "Skip, just play",
	back: "Back",
	next: "Next",
	start: "Start",
	stop: "Stop",
	pause: "Pause",
	play: "Play",
	done: "Done",
	notThisOne: "Not this one",
	goalTitle: "What brings you here?",
	whenTitle: "When do you need it most?",
	listenTitle: "How do you listen?",
	listenNote: "Headphones suit two-tone beats best, and speakers suit gentle pulses and noise.",
	whenHelper: "It helps us pick your first sound.",
	lastStep: "Almost ready",
	stepOf: (e) => `${e} of 3`,
	selected: "Selected",
	playAgain: "Play again",
	close: "Close",
	endTitle: "Done for now.",
	endLine: (e, t) => `${e} played for ${t < 1 ? "under a minute" : t === 1 ? "1 minute" : `${t} minutes`}.`,
	endNote: "Go at your own pace.",
	feelQuestion: "How was that?",
	feelCalmer: "Calmer",
	feelSame: "Same",
	feelNot: "Not for me",
	feelSaved: "Noted. This stays on this device.",
	starterTitle: "Pick a starter sound",
	preview: "Hear 10 s",
	previewing: "Playing a short preview",
	safetyTitle: "Before you start",
	safetyLines: [
		"Use stereo headphones for the best effect.",
		"Keep the volume low.",
		"Zonked fades in slowly.",
		"Zonked is not a medical device.",
		"Stop any time.",
		"Stop if anything feels uncomfortable."
	],
	safetyLimits: "Built-in limits: carrier tone 20 to 1500 Hz, beat at most 40 Hz, volume always capped.",
	safetyAccept: "I understand, start",
	notMedical: "Zonked is not a medical device.",
	dailyEyebrow: "Your session for today",
	suggested: "Suggested for you",
	forYou: "For you",
	journeysTitle: "Journeys",
	journeysEmpty: "Pick a journey to begin. Go at your own pace.",
	restDay: "Rest day",
	restart: "Restart journey",
	startJourney: "Start this journey",
	libraryTitle: "Sounds",
	searchLabel: "Search sounds",
	searchEmpty: "Nothing matched. Try fewer words.",
	tabs: [
		"Feeling",
		"Sound",
		"Favorites",
		"My mixes",
		"Recent"
	],
	emptyFavorites: "Tap the heart on any sound to keep it here.",
	emptyMixes: "Make a mix in the player, then save it here.",
	emptyRecent: "Your recent sessions show up here.",
	welcomeBack: "Welcome back. Pick up where you like.",
	firstWeek: "Your week starts here. Rest days count too.",
	natureTitle: "Nature sounds and my sounds",
	natureLine: "Add rain, streams or birds under your session, or your own file.",
	joinedToday: "You joined today",
	joinedLine: "You joined today. Your week starts here. Rest days count too.",
	dayZero: (e) => `Day 0 of ${e}, you are ready`,
	infoTitle: "Today",
	panelOpenFirst: "Open Zonked once to read the headphone note.",
	panelPickFirst: "Open Zonked and pick a sound first.",
	panelCrewLabel: "Let the Crew steer my sound",
	panelCrewOff: "Crew is off.",
	panelCrewOn: "Crew is steering.",
	panelCrewLost: "Crew backend not reachable. Playing on your own.",
	panelPlaying: "Playing.",
	panelStopped: "Stopped.",
	panelOpenPage: "Zonked is open on the page. Use Stop there.",
	restCount: "Rest days count too.",
	timerChips: [
		"15 min",
		"30 min",
		"60 min",
		"Until I stop",
		"Sleep fade",
		"Focus sprint"
	],
	sprintName: "Focus sprint",
	sprintTitle: "Focus sprint",
	sprintLine: "25 minutes of sound, a soft chime, then a 5 minute break on a calmer sound.",
	sprintStart: "Start a sprint",
	sprintFocusLeft: "Focus",
	sprintBreakLeft: "Break",
	sprintWhy: "The timed break is the likely help here, more than the beat.",
	breathe: "Breathe in, breathe out",
	breatheIn: "Breathe in",
	breatheOut: "Breathe out",
	whyTitle: "What the research says",
	whyBody: "Some small studies suggest slow beats may help people relax. Results vary and may not happen for you. Zonked is not a medical device.",
	volumeCapped: "Volume is capped for your safety.",
	favorite: "Favorite",
	guideLink: "How it works",
	guideStep: (e) => `${e} of 3`,
	guideSkip: "Skip",
	guideDone: "Done",
	guideCrewLink: "Open Crew and try the demo",
	guideCards: [
		{
			title: "Press Start, and the sound fades in slowly",
			body: "Pick a sound or press Start on Today. The sound rises softly over a few seconds, and you can stop whenever you like."
		},
		{
			title: "Options holds the extras",
			body: "Open Options on the player for the timer, a nature sound and your favorite. Everything else stays out of the way."
		},
		{
			title: "Crew can ease the sound while you code",
			body: "When Crew is on, it can soften the sound as your session gets busy. You can try the demo first, with no setup."
		}
	],
	optionsBtn: "Options",
	optionsTitle: "Options",
	optionsClose: "Close",
	optTimer: "Timer",
	optNature: "Nature sound",
	optMore: "More",
	optAdvanced: "Advanced",
	natureNone: "None",
	saved: "Saved",
	studio: "Studio mode",
	studioLink: "Open Studio mode",
	studioHint: "For advanced controls. Shortcut: Alt+Shift+S.",
	studioNote: "Advanced controls live in Settings, or press Alt+Shift+S for Studio mode.",
	backToCalm: "Back to Calm",
	crewTitle: "Crew",
	crewIntro: "Your coding session can watch itself and ease the sound. When you have been working hard, Zonked slowly moves toward calmer sound. You stay in control.",
	crewSwitch: "Let Crew ease the sound",
	crewOff: "Not connected",
	crewWhyOff: "Crew is not connected because the local feed is not running, or the Crew switch on this page is off. Zonked works fully without it.",
	crewStep1: "Start the local feed on your computer: run the crew bridge in your project folder.",
	crewStep2: "Turn on the Crew switch on this page.",
	crewDisabled: "The switch is on, but no feed answers yet. Crew stays off until step 1 is done.",
	crewOn: "Connected",
	crewBreak: "Time for a break",
	crewPrivacy: "Nothing leaves your computer.",
	crewOptional: "Crew is optional. Zonked works fully without it.",
	crewScore: "Load score",
	crewBeat: "Beat now",
	crewNext: "Next change",
	crewWhyTitle: "Why",
	crewReads: "Reads only git log and git status counts. Never file names, messages or paths.",
	crewNotNow: "Not now",
	crewFollowAgain: "Follow again",
	crewPaused: (e) => `Paused until ${e}`,
	crewFollowing: "Following the Crew",
	crewOverridden: "You picked a sound yourself, so the Crew is not steering it.",
	crewFollowNow: "Let the Crew steer",
	crewNextReal: (e) => `Not before ${e}, and only if your load moves to another band.`,
	crewNextWait: "Waiting for the first change.",
	crewNextDemo: (e) => `in ${e} s`,
	crewNextDemoLast: (e) => `none, the demo ends in ${e} s`,
	crewDemo: "Watch the crew work",
	crewDemoHint: "A 60 second pretend session. Nothing is read from your computer.",
	crewDemoEnd: "That was pretend. Real mode reads git counts only.",
	crewDemoStop: "Stop the demo",
	crewDemoBadge: "Simulated session",
	settingsTitle: "Settings",
	gentle: "Keep sounds extra gentle",
	gentleHint: "Picks softer sounds and keeps the screen still.",
	reduceMotion: "Reduce motion",
	themeTitle: "Look",
	themeChoices: {
		system: "System",
		light: "Light",
		dark: "Dark",
		contrast: "High contrast"
	},
	dimLabel: "Dim screen while playing",
	dimHint: "On by default from 19:00 to 07:00.",
	announceLabel: "Say Breathe in and Breathe out to screen readers",
	announceHint: "Speaks only when the phase changes.",
	resetEntry: "A short pause, 90 seconds",
	resetEntryHint: "Slow breathing with soft sound.",
	resetTitle: "A short pause",
	resetIntro: "Ninety seconds of slow breathing with a soft sound. Stop any time.",
	breatheEntry: "Breathe, 5 minutes",
	breatheEntryHint: "Many people find slow breathing calming.",
	breatheTitle: "Breathe, 5 minutes",
	breatheIntro: "Many people find slow breathing calming. Soft noise, nothing to follow. Stop any time.",
	breatheDoneLine: "That was 5 minutes of slow breathing.",
	breatheAgain: "Breathe again",
	breatheLeft: (e) => `${Math.floor(e / 60)}:${String(e % 60).padStart(2, "0")} left`,
	resetStart: "Begin",
	resetLeft: (e) => `${e} s left`,
	resetDoneLine: "That was 90 seconds of slow breathing.",
	resetAgain: "Pause again",
	resetBack: "Back to Today",
	counterIn: (e) => `Breathe in, ${e}`,
	counterOut: (e) => `Breathe out, ${e}`,
	demoSteering: "Demo is steering the sound",
	demoSteeringHint: "The simulated session controls the sound until you stop the demo, so this switch waits.",
	crewBeatHint: "Higher beats feel alert, lower beats feel calm.",
	weekOf: (e) => `${e} of 7 days`,
	forget: "Forget my data",
	forgetHint: "Removes your answers, how-it-felt notes, nature choice and your own sounds from this device.",
	natureHead: "Nature sounds",
	natureIntro: "Add a recording of nature under your session. Pick one, then use the slider to set the mix.",
	natureFree: "Free to use, public domain",
	natureMade: "Made by Zonked in code. No recording is used.",
	natureCredits: "Credits",
	natureCreditsPick: "Pick a sound",
	natureBlend: "Nature or beats",
	natureLevel: "Nature volume",
	natureAdd: "Add nature sound",
	natureOff: "Stop nature sound",
	natureOn: "Playing now",
	natureNote: "Nature sounds can feel calming for many people. Zonked makes no health claims and is not a medical device.",
	natureBack: "Back to Library",
	natureQuick: "Nature",
	mineTitle: "My sounds",
	mineStays: "Stays on this device",
	mineNote: "Pick an audio file from your own device. It stays in this browser, is never uploaded and uses no network. Only add files you own or have the right to use.",
	mineChoose: "Choose an audio file",
	mineLimits: "Up to 5 sounds, 8 MB each, 20 MB in all, 10 minutes long. Files under 20 seconds play once.",
	mineEmpty: "No sounds added yet.",
	mineRemove: "Remove",
	mineRemoveAll: "Remove all my sounds",
	mineAdded: "Added. It stays on this device.",
	offline: "Zonked works offline. Nothing to do.",
	unsupported: "This browser cannot play Zonked sound. Try a recent Chrome, Edge, Firefox or Safari.",
	errorAudio: "Sound could not start. Tap Play to try again.",
	errorStorage: "We could not save this on your device. Your session still works.",
	loading: "Loading",
	nav: [
		"Today",
		"Sounds",
		"Crew",
		"You"
	],
	sounds: (e) => `${e} ${e === 1 ? "sound" : "sounds"}`
}, Oe = {
	focus: "Focus",
	calm: "Calm down",
	sleep: "Sleep",
	study: "Study",
	recover: "Recover after work",
	curious: "Just curious"
}, ke = {
	morning: "Morning",
	afternoon: "Afternoon",
	evening: "Evening",
	night: "Night",
	anytime: "Anytime"
}, Ae = {
	headphones: "Headphones",
	speakers: "Speakers",
	bluetooth: "Bluetooth",
	unsure: "Not sure"
}, je = [
	{
		id: "deep-work",
		label: "Focus",
		mood: "Steady and quiet",
		icon: "target"
	},
	{
		id: "adhd-focus",
		label: "Steady attention",
		mood: "Even and plain",
		icon: "wave"
	},
	{
		id: "ai-burnout",
		label: "Recover",
		mood: "Slow and soft",
		icon: "leaf"
	},
	{
		id: "heal-stress",
		label: "Calm down",
		mood: "Warm and gentle",
		icon: "heart"
	},
	{
		id: "cant-sleep",
		label: "Sleep",
		mood: "Dim and slow",
		icon: "moon"
	},
	{
		id: "lucid-dream",
		label: "Dream",
		mood: "Drifting",
		icon: "cloud"
	},
	{
		id: "meditate",
		label: "Meditate",
		mood: "Open and still",
		icon: "lotus"
	},
	{
		id: "quick-reset",
		label: "Quick reset",
		mood: "Short and light",
		icon: "bolt"
	}
], Me = {
	strong: "Several studies exist.",
	mixed: "Studies disagree.",
	preliminary: "Early, small studies.",
	limited: "Very little research.",
	preference: "People simply like it."
};
function Ne(e) {
	return e >= 5 && e < 12 ? "Good morning." : e >= 12 && e < 17 ? "Good afternoon." : e >= 17 && e < 21 ? "Good evening." : "Hello, night owl.";
}
var Pe = {
	focus: "Your load looks light",
	flow: "Your load is building",
	recovery: "Your load is high",
	decompress: "Your load is very high"
}, Fe = (e) => Number.isInteger(e) ? String(e) : e.toFixed(1);
function Ie(e) {
	if (e.why !== void 0) return e.why;
	let { level: t, score: n } = e.burnout, { beatHz: r, transitionSec: i } = e.target, a = i < 90 ? `${Math.round(i)} s` : `${Math.round(i / 60)} min`, o = t === "focus" ? `holds a steady ${Fe(r)} Hz beat` : `eases the beat to ${Fe(r)} Hz over about ${a}`;
	return `${Pe[t]} (score ${Math.round(n)}), so the sound ${o}.`;
}
var Le = (e) => {
	let t = e.indexOf(". ");
	return t < 0 ? e : e.slice(0, t + 1);
}, Re = "zonked.timer.v1", ze = 2.5, Be = .1, C = {
	countdownMin: 30,
	sleepMin: 30,
	focusMin: 25,
	breakMin: 5
}, Ve = 1, He = 720, Ue = 500, We = [
	"none",
	"countdown",
	"sleep-fade",
	"pomodoro"
], Ge = {
	kind: "none",
	running: !1,
	remainingSec: 0,
	totalSec: 0
}, w = (e, t) => typeof e == "number" && Number.isFinite(e) ? Math.min(He, Math.max(Ve, e)) : t, Ke = class {
	clock;
	storage;
	listeners = /* @__PURE__ */ new Set();
	spec = null;
	running = !1;
	elapsedMs = 0;
	lastMs = 0;
	phase = "focus";
	cycle = 1;
	poll = null;
	lastKey = "";
	onEnd = null;
	constructor(e, t = null) {
		this.clock = e, this.storage = t, this.restore();
	}
	subscribe(e) {
		return this.listeners.add(e), () => this.listeners.delete(e);
	}
	state() {
		return this.advance(), this.build();
	}
	start(e) {
		return this.spec = this.normalize(e), this.elapsedMs = 0, this.phase = "focus", this.cycle = 1, this.run(), this.changed();
	}
	stop() {
		return this.spec = null, this.running = !1, this.elapsedMs = 0, this.stopPoll(), this.changed();
	}
	pause() {
		return this.advance(), this.spec !== null && this.running && (this.running = !1, this.stopPoll()), this.changed();
	}
	resume() {
		return this.spec !== null && !this.running && this.run(), this.changed();
	}
	cycleNext() {
		let e = this.spec?.kind ?? "none", t = We[(We.indexOf(e) + 1) % We.length] ?? "none";
		return t === "none" ? this.stop() : t === "countdown" ? this.start({
			kind: "countdown",
			minutes: C.countdownMin
		}) : t === "sleep-fade" ? this.start({
			kind: "sleep-fade",
			minutes: C.sleepMin
		}) : this.start({ kind: "pomodoro" });
	}
	seekBy(e) {
		if (this.advance(), this.spec === null || !Number.isFinite(e)) return this.build();
		let t = this.segmentMs();
		return this.elapsedMs = Math.min(Math.max(0, this.elapsedMs + e * 1e3), Math.max(0, t - 1)), this.changed();
	}
	effects() {
		this.advance();
		let e = this.spec;
		if (e === null || e.kind !== "sleep-fade") return {
			gainScale: 1,
			beatMix: 0
		};
		let t = this.segmentMs(), n = Math.min(1, this.elapsedMs / t);
		return this.elapsedMs <= t ? {
			gainScale: 1 - .9 * n,
			beatMix: n
		} : {
			gainScale: Be * (1 - Math.min(1, (this.elapsedMs - t) / 6e3)),
			beatMix: 1
		};
	}
	normalize(e) {
		if (e.kind === "pomodoro") {
			let t = e.longEvery !== void 0 && Number.isFinite(e.longEvery) ? Math.max(2, Math.floor(e.longEvery)) : void 0;
			return {
				kind: "pomodoro",
				focusMin: w(e.focusMin, C.focusMin),
				breakMin: w(e.breakMin, C.breakMin),
				...e.longBreakMin !== void 0 && t !== void 0 ? {
					longBreakMin: w(e.longBreakMin, 15),
					longEvery: t
				} : {}
			};
		}
		return {
			kind: e.kind,
			minutes: w(e.minutes, e.kind === "countdown" ? C.countdownMin : C.sleepMin)
		};
	}
	segmentMs() {
		let e = this.spec;
		return e === null ? 0 : e.kind === "pomodoro" ? this.phase === "focus" ? (e.focusMin ?? C.focusMin) * 6e4 : (e.longBreakMin !== void 0 && e.longEvery !== void 0 && this.cycle % e.longEvery === 0 ? e.longBreakMin ?? 0 : e.breakMin ?? C.breakMin) * 6e4 : e.minutes * 6e4;
	}
	run() {
		this.running = !0, this.lastMs = this.clock.now(), this.startPoll();
	}
	startPoll() {
		this.poll === null && (this.poll = this.clock.setInterval(() => void this.changed(), Ue));
	}
	stopPoll() {
		this.poll !== null && this.clock.clearInterval(this.poll), this.poll = null;
	}
	advance() {
		if (!this.running || this.spec === null) return;
		let e = this.clock.now(), t = Math.max(0, e - this.lastMs);
		this.lastMs = e, this.elapsedMs += t;
		let n = this.spec;
		n.kind === "pomodoro" ? this.rollPomodoro() : n.kind === "countdown" && this.elapsedMs >= this.segmentMs() ? this.finish("countdown") : n.kind === "sleep-fade" && this.elapsedMs >= this.segmentMs() + 6e3 && this.finish("sleep-fade");
	}
	rollPomodoro() {
		for (let e = 0; e < 1e3; e++) {
			let e = this.segmentMs();
			if (this.elapsedMs < e) return;
			this.elapsedMs -= e, this.phase === "focus" ? this.phase = "break" : (this.phase = "focus", this.cycle += 1);
		}
		this.elapsedMs = 0;
	}
	finish(e) {
		this.spec = null, this.running = !1, this.elapsedMs = 0, this.stopPoll(), this.persist(), this.notify(this.build()), this.onEnd?.(e);
	}
	build() {
		let e = this.spec;
		if (e === null) return Ge;
		let t = this.segmentMs() / 1e3, n = Math.max(0, Math.ceil(t - this.elapsedMs / 1e3));
		if (e.kind === "pomodoro") return {
			kind: "pomodoro",
			running: this.running,
			remainingSec: n,
			totalSec: t,
			phase: this.phase,
			cycle: this.cycle,
			focusMin: e.focusMin,
			breakMin: e.breakMin
		};
		let r = {
			kind: e.kind,
			running: this.running,
			remainingSec: n,
			totalSec: t
		};
		return e.kind === "sleep-fade" && this.elapsedMs > this.segmentMs() ? {
			...r,
			finalFade: !0
		} : r;
	}
	changed() {
		this.advance();
		let e = this.build(), t = `${e.kind}|${e.running}|${e.remainingSec}|${e.phase ?? ""}|${e.cycle ?? 0}|${e.finalFade === !0}`;
		return t !== this.lastKey && (this.lastKey = t, this.persist(), this.notify(e)), e;
	}
	notify(e) {
		for (let t of this.listeners) t(e);
	}
	persist() {
		if (this.storage !== null) try {
			if (this.spec === null) {
				this.storage.removeItem(Re);
				return;
			}
			let e = {
				v: 1,
				spec: this.spec,
				elapsedMs: this.elapsedMs,
				phase: this.phase,
				cycle: this.cycle
			};
			this.storage.setItem(Re, JSON.stringify(e));
		} catch {}
	}
	restore() {
		if (this.storage !== null) try {
			let e = this.storage.getItem(Re);
			if (e === null) return;
			let t = JSON.parse(e);
			if (t.v !== 1 || t.spec === void 0 || t.spec === null || typeof t.spec != "object" || ![
				"countdown",
				"sleep-fade",
				"pomodoro"
			].includes(t.spec.kind)) return;
			this.spec = this.normalize(t.spec), this.phase = t.phase === "break" ? "break" : "focus", this.cycle = typeof t.cycle == "number" && Number.isFinite(t.cycle) ? Math.max(1, Math.floor(t.cycle)) : 1;
			let n = typeof t.elapsedMs == "number" && Number.isFinite(t.elapsedMs) ? t.elapsedMs : 0;
			this.elapsedMs = Math.min(Math.max(0, n), Math.max(0, this.segmentMs() - 1)), this.running = !1;
		} catch {
			this.spec = null;
		}
	}
}, qe = {
	now: () => Date.now(),
	setInterval: (e, t) => window.setInterval(e, t),
	clearInterval: (e) => window.clearInterval(e)
}, Je = [
	"off",
	"white",
	"pink",
	"brown",
	"violet"
], T = .85, Ye = 3;
function Xe(e, t) {
	let n = Number.isFinite(t) ? t : i[e], a = r;
	switch (e) {
		case "instRootHz": return E(n, a.instRootHz.min, a.instRootHz.max);
		case "padRootHz": return E(n, a.padRootHz.min, a.padRootHz.max);
		case "instBpm":
		case "percBpm": return E(n, a.bpm.min, a.bpm.max);
		case "chimeRatePerMin": return E(n, a.chimeRatePerMin.min, a.chimeRatePerMin.max);
		case "breathRateHz": return E(n, a.breathRateHz.min, a.breathRateHz.max);
		case "panRateHz": return E(n, a.panRateHz.min, a.panRateHz.max);
		case "instKind": return Math.round(E(n, 0, a.instKindMax));
		case "instScale":
		case "padChord":
		case "lofiProgression":
		case "percPattern": return Math.round(E(n, 0, a.enumMax));
		default: return E(n, a.level.min, a.level.max);
	}
}
var Ze = .25, Qe = 3, $e = .02, et = (e, t, n) => e + (t - e) * n, E = (e, t, n) => e < t ? t : e > n ? n : e, D = (e, t) => Number.isFinite(e) ? e : t;
function tt() {
	try {
		return typeof localStorage > "u" ? null : localStorage;
	} catch {
		return null;
	}
}
function nt(e, t, n) {
	return {
		...t,
		carrierHz: et(e.carrierHz, t.carrierHz, n),
		beatHz: et(e.beatHz, t.beatHz, n),
		gain: et(e.gain, t.gain, n)
	};
}
function rt(e) {
	return S.find((t) => t.id === e) ?? S[0];
}
var it = class {
	engine;
	clock;
	onSession;
	listeners = /* @__PURE__ */ new Set();
	mode;
	base;
	current;
	template = null;
	queue = [];
	queueIndex = -1;
	muted = !1;
	gainTrim = 0;
	userCeiling = 0;
	crewLevel = 0;
	heardRaw = 0;
	wantPlaying = !1;
	opTail = Promise.resolve();
	opCount = 0;
	layerOverrides = {};
	gainScale = 1;
	beatOverride = null;
	noiseOverride = null;
	breakMix = 0;
	lastTickMs = 0;
	toEvents;
	timers;
	presetId;
	source = "preset";
	overridden = !1;
	latestCrew = null;
	burnout = null;
	breathe = !1;
	peak = 0;
	endKind = "manual";
	breakCount = 0;
	lastPhase;
	playing = !1;
	startedAt = 0;
	timer = null;
	constructor(e, t, n, r = {}) {
		this.engine = e, this.clock = t, this.onSession = n, this.toEvents = r.toEvents, this.timers = new Ke(t, r.storage === void 0 ? tt() : r.storage), this.timers.subscribe(() => {
			let e = this.timers.state().phase;
			this.playing && e === "break" && this.lastPhase !== "break" && (this.breakCount += 1), this.lastPhase = e, this.emit();
		}), this.timers.onEnd = (e) => {
			this.endKind = e, this.stop();
		};
		let i = rt(S[0]?.id ?? "");
		this.presetId = i.id;
		let a = x(i.sbg).events;
		this.base = le(a, 0), this.current = this.base, this.userCeiling = E(this.base.gain, 0, T), this.crewLevel = this.userCeiling, this.heardRaw = this.userCeiling, this.mode = {
			kind: "script",
			events: a,
			startMs: t.now()
		};
	}
	subscribe(e) {
		return this.listeners.add(e), () => this.listeners.delete(e);
	}
	snapshot() {
		return {
			playing: this.playing,
			source: this.source,
			presetId: this.presetId,
			overridden: this.overridden,
			voice: this.current,
			elapsedSec: this.playing ? (this.clock.now() - this.startedAt) / 1e3 : 0,
			burnout: this.burnout,
			breathe: this.breathe,
			templateId: this.template?.id ?? null,
			templateName: this.template?.name ?? null,
			templateCategory: this.template?.category ?? null,
			queueIndex: this.queueIndex,
			queueLength: this.queue.length,
			muted: this.muted,
			gainScale: this.gainScale,
			gainTrim: this.gainTrim,
			timer: this.timers.state(),
			layerOverrides: this.layerOverrides,
			beatOverride: this.beatOverride,
			noiseOverride: this.noiseOverride
		};
	}
	setQueue(e) {
		this.queue = [...e];
		let t = this.template?.id;
		this.queueIndex = t === void 0 ? -1 : this.queue.findIndex((e) => e.id === t), this.emit();
	}
	async playTemplate(e) {
		let t = this.queue.findIndex((t) => t.id === e.id);
		return this.playAt(e, t);
	}
	async nextTemplate() {
		return this.step(1);
	}
	async prevTemplate() {
		return this.step(-1);
	}
	async step(e) {
		let t = this.queue.length;
		if (t === 0) return !1;
		let n = ((this.queueIndex < 0 ? e === 1 ? -1 : 0 : this.queueIndex) + e + t) % t, r = this.queue[n];
		return r !== void 0 && this.playAt(r, n);
	}
	async playAt(e, t) {
		let n = this.toEvents?.(e) ?? [];
		return n.length !== 0 && (this.overridden = !0, this.source = "template", this.template = e, this.queueIndex = t, this.gainTrim = 0, this.clearVoiceOverrides(), this.startScript(n), this.playing || await this.play(), !0);
	}
	setMuted(e) {
		e && !this.muted && this.captureUserLevel(0), this.muted = e, this.applyNow();
	}
	toggleMute() {
		this.setMuted(!this.muted);
	}
	nudgeGain(e) {
		if (!Number.isFinite(e)) return;
		let t = this.base.gain, n = Math.round((this.gainTrim + e) * 1e3) / 1e3, r = this.gainTrim;
		this.gainTrim = E(n, -t, Math.max(0, T - t)), this.captureUserLevel(this.gainTrim - r), this.applyNow();
	}
	captureUserLevel(e) {
		let t = E(this.heardRaw + e, 0, T);
		this.userCeiling = t, this.crewLevel = t;
	}
	captureFromBase() {
		let e = E(this.base.gain + this.gainTrim, 0, T);
		this.userCeiling = e, this.crewLevel = e, this.heardRaw = e;
	}
	setLayerOverride(e) {
		let t = { ...this.layerOverrides };
		for (let [n, r] of Object.entries(e)) Object.hasOwn(i, n) && typeof r == "number" && (t[n] = Xe(n, r));
		this.layerOverrides = t, this.applyNow();
	}
	setBeatOverride(e) {
		if (e === null) this.beatOverride = null;
		else if (Number.isFinite(e)) this.beatOverride = E(e, .5, 40);
		else return;
		this.applyNow();
	}
	setNoiseOverride(e) {
		if (e === null) this.noiseOverride = null;
		else {
			let t = typeof e.noise == "string" && Je.includes(e.noise) ? e.noise : void 0, n = typeof e.noiseLevel == "number" && Number.isFinite(e.noiseLevel) ? E(e.noiseLevel, 0, 1) : void 0;
			if (t === void 0 && n === void 0) return;
			this.noiseOverride = {
				...t === void 0 ? {} : { noise: t },
				...n === void 0 ? {} : { noiseLevel: n }
			};
		}
		this.applyNow();
	}
	clearVoiceOverrides() {
		this.beatOverride = null, this.noiseOverride = null;
	}
	clearLayerOverrides() {
		this.layerOverrides = {}, this.applyNow();
	}
	getMixDraft() {
		let e = this.base, t = this.timers.state(), n = this.source === "template" && this.template !== null ? {
			kind: "template",
			id: this.template.id
		} : this.source === "preset" ? {
			kind: "preset",
			id: this.presetId
		} : {
			kind: "custom",
			id: "custom"
		}, r = t.kind === "countdown" || t.kind === "sleep-fade" ? {
			kind: t.kind,
			minutes: Math.max(1, Math.round(t.totalSec / 60))
		} : t.kind === "pomodoro" ? {
			kind: "pomodoro",
			focusMin: t.focusMin ?? 25,
			breakMin: t.breakMin ?? 5
		} : { kind: "none" };
		return {
			source: n,
			voice: {
				carrierHz: e.carrierHz,
				beatHz: e.beatHz,
				mode: e.mode,
				noise: e.noise,
				noiseLevel: e.noiseLevel,
				gain: E(e.gain + this.gainTrim, 0, T)
			},
			layers: {
				...e.layers ?? {},
				...this.layerOverrides
			},
			timer: r,
			...this.beatOverride === null ? {} : { beatOverride: this.beatOverride },
			...this.noiseOverride === null ? {} : { noiseOverride: this.noiseOverride }
		};
	}
	playMix(e) {
		let t = e.voice, n = {
			carrierHz: E(t.carrierHz, 20, 1500),
			beatHz: E(t.beatHz, .5, 40),
			mode: t.mode,
			noise: t.noise,
			noiseLevel: E(t.noiseLevel, 0, 1),
			gain: E(t.gain, 0, T),
			layers: {
				...i,
				...e.layers
			}
		};
		this.overridden = !0, this.source = "custom", this.presetId = `mix:${e.id}`.slice(0, 80), this.template = null, this.queueIndex = -1, this.gainTrim = 0, this.clearVoiceOverrides(), this.layerOverrides = {}, e.beatOverride !== void 0 && (this.beatOverride = E(e.beatOverride, .5, 40));
		let r = e.noiseOverride;
		if (r !== void 0) {
			let e = r.noise !== void 0 && Je.includes(r.noise) ? r.noise : void 0, t = r.noiseLevel !== void 0 && Number.isFinite(r.noiseLevel) ? E(r.noiseLevel, 0, 1) : void 0;
			this.noiseOverride = {
				...e === void 0 ? {} : { noise: e },
				...t === void 0 ? {} : { noiseLevel: t }
			};
		}
		this.startScript([{
			tSec: 0,
			voice: n,
			ramp: !1,
			line: 0
		}]);
		let a = e.timer;
		a.kind === "countdown" || a.kind === "sleep-fade" ? this.startTimer({
			kind: a.kind,
			minutes: a.minutes ?? 30
		}) : a.kind === "pomodoro" ? this.startTimer({
			kind: "pomodoro",
			focusMin: a.focusMin ?? 25,
			breakMin: a.breakMin ?? 5
		}) : this.stopTimer(), this.play();
	}
	startTimer(e) {
		let t = this.timers.start(e);
		return this.playing || this.timers.pause(), this.emit(), t;
	}
	stopTimer() {
		this.timers.stop(), this.gainScale = 1, this.applyNow();
	}
	cycleTimer() {
		let e = this.timers.cycleNext();
		return this.playing || this.timers.pause(), this.applyNow(), e;
	}
	positionState() {
		let e = this.timers.state();
		if (e.kind !== "none") {
			let t = e.totalSec;
			return {
				durationSec: t,
				positionSec: e.finalFade === !0 ? t : Math.max(0, t - e.remainingSec)
			};
		}
		let t = this.mode;
		if (this.template === null || t.kind !== "script") return null;
		let n = this.scriptDuration(t.events);
		return {
			durationSec: n,
			positionSec: E(this.playing ? (this.clock.now() - t.startMs) / 1e3 : 0, 0, n)
		};
	}
	seekBy(e) {
		if (Number.isFinite(e)) {
			if (this.timers.state().kind !== "none") this.timers.seekBy(e);
			else if (this.mode.kind === "script" && this.template !== null) {
				let t = this.mode, n = this.scriptDuration(t.events), r = E((this.clock.now() - t.startMs) / 1e3 + e, 0, n);
				this.mode = {
					...t,
					startMs: this.clock.now() - r * 1e3
				};
			}
			this.applyNow();
		}
	}
	scriptDuration(e) {
		let t = ae(e);
		return t > 0 ? t : Math.max(60, (this.template?.recommendedMinutes ?? 1) * 60);
	}
	applyNow() {
		this.current = this.effective(this.base), this.playing && this.engine.setVoice(this.current, Ze), this.emit();
	}
	effective(e) {
		let t = this.timers.effects();
		this.gainScale = t.gainScale;
		let n = e.beatHz + (ze - e.beatHz) * t.beatMix, r = E(n + (Math.min(n, 8) - n) * this.breakMix, .5, 40), a = this.beatOverride ?? r, o = this.noiseOverride, s = E(e.gain + this.gainTrim, 0, T), c = this.source === "crew" ? Math.min(s, this.crewLevel, this.userCeiling) : s;
		this.heardRaw = c;
		let l = this.muted ? 0 : c, u = Object.keys(this.layerOverrides).length > 0 ? {
			...e.layers ?? i,
			...this.layerOverrides
		} : e.layers;
		return {
			...e,
			beatHz: a,
			...o?.noise === void 0 ? {} : { noise: o.noise },
			...o?.noiseLevel === void 0 ? {} : { noiseLevel: o.noiseLevel },
			gain: D(Math.min(T, l * t.gainScale), 0),
			...u === void 0 ? {} : { layers: u }
		};
	}
	slewBreak(e) {
		let t = Math.max(0, e - this.lastTickMs);
		if (this.lastTickMs = e, this.source === "crew") {
			let e = Math.min(E(this.base.gain + this.gainTrim, 0, T), this.userCeiling);
			this.crewLevel = e > this.crewLevel ? Math.min(e, this.crewLevel + $e * t / 1e3) : e;
		}
		let n = +(this.timers.state().phase === "break"), r = t / (Ye * 1e3);
		this.breakMix = n > this.breakMix ? Math.min(n, this.breakMix + r) : Math.max(n, this.breakMix - r);
	}
	selectPreset(e) {
		let t = rt(e);
		this.overridden = !0, this.presetId = t.id, this.source = "preset", this.template = null, this.queueIndex = -1, this.gainTrim = 0, this.clearVoiceOverrides(), this.startScript(x(t.sbg).events);
	}
	async playCustom(e) {
		let t = x(e);
		return !t.ok || t.events.length === 0 || (this.overridden = !0, this.source = "custom", this.template = null, this.queueIndex = -1, this.gainTrim = 0, this.clearVoiceOverrides(), this.startScript(t.events), this.playing || await this.play()), t.diagnostics;
	}
	followCrew() {
		this.overridden = !1, this.latestCrew === null ? this.emit() : this.enterCrew(this.latestCrew);
	}
	applyCrew(e) {
		this.latestCrew = e, this.burnout = e.burnout.score, this.breathe = e.target.breathe, this.peak = Math.max(this.peak, e.burnout.score), this.overridden ? this.emit() : this.enterCrew(e);
	}
	crewLost() {
		this.burnout = null, this.emit();
	}
	enqueue(e) {
		let t = this.opCount === 0 ? e() : this.opTail.then(e);
		return this.opCount += 1, this.opTail = t.then(() => void --this.opCount, () => void --this.opCount), t;
	}
	play() {
		return this.wantPlaying = !0, this.enqueue(() => this.doPlay());
	}
	stop() {
		return this.wantPlaying = !1, this.enqueue(() => this.doStop());
	}
	async doPlay() {
		if (this.playing || !this.wantPlaying) return;
		let e = this.clock.now();
		this.restartModeClock(e), this.lastTickMs = e, this.captureFromBase(), this.current = this.effective(this.base);
		try {
			await this.engine.start(this.current);
		} catch {
			this.emit();
			return;
		}
		let t = this.engine.status?.state;
		t !== void 0 && t !== "running" || (this.playing = !0, this.startedAt = e, this.peak = this.burnout ?? 0, this.endKind = "manual", this.breakCount = 0, this.lastPhase = this.timers.state().phase, this.timer = this.clock.setInterval(() => this.tick(), 100), this.timers.resume()), this.emit();
	}
	async doStop() {
		if (this.playing) {
			this.playing = !1, this.timers.pause(), this.timer !== null && this.clock.clearInterval(this.timer), this.timer = null, this.onSession?.({
				startedAt: this.startedAt,
				endedAt: this.clock.now(),
				peakScore: this.peak,
				presetId: this.source === "crew" ? this.latestCrew?.target.presetId ?? this.presetId : this.presetId,
				endKind: this.endKind,
				breaks: this.breakCount
			}), this.emit();
			try {
				await this.engine.stop();
			} catch {}
		}
	}
	tick() {
		if (!this.playing) return;
		let e = this.clock.now();
		this.base = this.voiceNow(e), this.slewBreak(e), this.current = this.effective(this.base), this.playing && (this.engine.setVoice(this.current, Ze), this.emit());
	}
	voiceNow(e) {
		let t = this.mode;
		if (t.kind === "hold") return t.voice;
		if (t.kind === "script") return le(t.events, (e - t.startMs) / 1e3);
		let n = Math.min(1, Math.max(0, (e - t.startMs) / t.durMs));
		return n >= 1 ? (this.mode = {
			kind: "hold",
			voice: t.to
		}, t.to) : nt(t.from, t.to, n);
	}
	restartModeClock(e) {
		let t = this.mode;
		t.kind !== "hold" && (this.mode = {
			...t,
			startMs: e
		});
	}
	startScript(e) {
		this.mode = {
			kind: "script",
			events: e,
			startMs: this.clock.now()
		}, this.base = le(e, 0), this.captureFromBase(), this.current = this.effective(this.base), this.playing && this.engine.setVoice(this.current, Qe), this.emit();
	}
	enterCrew(e) {
		let t = this.clock.now();
		this.source = "crew", this.template = null, this.queueIndex = -1, this.gainTrim = 0, this.clearVoiceOverrides(), this.crewLevel = Math.min(this.heardRaw, this.userCeiling);
		let n = e.sbg === null ? null : x(e.sbg);
		if (n !== null && n.ok && n.events.length > 0) this.mode = {
			kind: "script",
			events: n.events,
			startMs: t
		};
		else {
			let n = e.target, r = {
				...this.base,
				carrierHz: E(D(n.carrierHz, this.base.carrierHz), 20, 1500),
				beatHz: E(D(n.beatHz, this.base.beatHz), .5, 40),
				gain: E(D(n.gain, 0), 0, T)
			};
			this.mode = {
				kind: "transition",
				from: this.base,
				to: r,
				startMs: t,
				durMs: E(D(n.transitionSec, 5), .1, 600) * 1e3
			};
		}
		this.emit();
	}
	emit() {
		let e = this.snapshot();
		for (let t of this.listeners) t(e);
	}
}, at = [
	"off",
	"white",
	"pink",
	"brown",
	"violet"
], ot = [
	"binaural",
	"monaural",
	"isochronic"
], st = [
	"template",
	"preset",
	"custom",
	"mix"
], ct = [
	"none",
	"countdown",
	"sleep-fade",
	"pomodoro"
], lt = (e, t, n) => e < t ? t : e > n ? n : e;
function O(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function k(e, t) {
	return Object.hasOwn(e, t) ? e[t] : void 0;
}
function A(e, t, n, r) {
	return typeof e == "number" && Number.isFinite(e) ? lt(e, t, n) : r;
}
function ut(e, t) {
	if (typeof e != "string") return t;
	let n = e.replace(/[\u0000-\u001f\u007f]/g, " ").replace(/\s+/g, " ").trim().slice(0, 60);
	return n.length > 0 ? n : t;
}
function dt(e) {
	return typeof e == "string" && /^[A-Za-z0-9_.:-]{1,64}$/.test(e) ? e : null;
}
function j(e, t, n) {
	return typeof e == "string" && t.includes(e) ? e : n;
}
function ft(e) {
	return O(e) ? {
		carrierHz: A(k(e, "carrierHz"), o.carrierMin, o.carrierMax, 200),
		beatHz: A(k(e, "beatHz"), o.beatMin, o.beatMax, 10),
		mode: j(k(e, "mode"), ot, "binaural"),
		noise: j(k(e, "noise"), at, "off"),
		noiseLevel: A(k(e, "noiseLevel"), o.noiseMin, o.noiseMax, 0),
		gain: A(k(e, "gain"), o.gainMin, o.gainMax, .3)
	} : null;
}
function pt(e) {
	let t = {};
	if (!O(e)) return t;
	for (let n of Object.keys(i)) {
		let r = k(e, n);
		typeof r == "number" && Number.isFinite(r) && (t[n] = Xe(n, r));
	}
	return t;
}
function mt(e) {
	if (!O(e)) return { kind: "none" };
	let t = j(k(e, "kind"), ct, "none");
	return t === "countdown" || t === "sleep-fade" ? {
		kind: t,
		minutes: Math.round(A(k(e, "minutes"), 1, 240, 30))
	} : t === "pomodoro" ? {
		kind: t,
		focusMin: Math.round(A(k(e, "focusMin"), 1, 240, 25)),
		breakMin: Math.round(A(k(e, "breakMin"), 1, 240, 5))
	} : { kind: "none" };
}
function ht(e) {
	return O(e) ? {
		kind: j(k(e, "kind"), st, "custom"),
		id: dt(k(e, "id")) ?? "custom"
	} : {
		kind: "custom",
		id: "custom"
	};
}
function gt(e) {
	if (!O(e)) return null;
	let t = ft(k(e, "voice"));
	if (t === null) return null;
	let n = k(e, "beatOverride"), r = k(e, "noiseOverride"), i = O(r) ? k(r, "noise") : void 0, a = O(r) ? k(r, "noiseLevel") : void 0, s = {
		...typeof i == "string" && at.includes(i) ? { noise: i } : {},
		...typeof a == "number" && Number.isFinite(a) ? { noiseLevel: lt(a, o.noiseMin, o.noiseMax) } : {}
	};
	return {
		source: ht(k(e, "source")),
		voice: t,
		layers: pt(k(e, "layers")),
		timer: mt(k(e, "timer")),
		...typeof n == "number" && Number.isFinite(n) ? { beatOverride: lt(n, o.beatMin, o.beatMax) } : {},
		...Object.keys(s).length > 0 ? { noiseOverride: s } : {}
	};
}
function _t(e, t) {
	if (!O(e) || k(e, "v") !== 1) return null;
	let n = dt(k(e, "id")), r = gt(e);
	if (n === null || r === null) return null;
	let i = A(k(e, "createdAt"), 0, t + 864e5, t), a = A(k(e, "updatedAt"), 0, t + 864e5, i);
	return {
		...r,
		v: 1,
		id: n,
		name: ut(k(e, "name"), "My mix"),
		createdAt: i,
		updatedAt: a
	};
}
// ../../web/src/app/crewFeed.ts
var vt = 3e4, yt = 18e5, M = {
	state: null,
	source: "none",
	changedAtMs: 0,
	snoozeUntilMs: 0,
	demoNextAtMs: null
}, N = null, bt = /* @__PURE__ */ new Set(), xt = () => M;
function St(e) {
	return bt.add(e), () => void bt.delete(e);
}
function P(e) {
	M = e;
	for (let e of [...bt]) e();
}
var Ct = (e, t) => e !== null && e.target.beatHz === t.target.beatHz && e.target.carrierHz === t.target.carrierHz && e.target.gain === t.target.gain;
function wt(e, t, n = Date.now()) {
	if (M.source === "demo") return;
	let r = !Ct(M.state, t);
	P({
		...M,
		state: t,
		source: "bridge",
		changedAtMs: r ? n : M.changedAtMs
	}), n >= M.snoozeUntilMs && e.applyCrew(t);
}
function Tt() {
	M.source === "bridge" && P({
		...M,
		state: null,
		source: "none",
		changedAtMs: 0
	});
}
function Et(e, t = Date.now(), n = yt) {
	N !== null && clearTimeout(N), P({
		...M,
		snoozeUntilMs: t + n
	}), N = setTimeout(() => Dt(e), n);
}
function Dt(e) {
	N !== null && clearTimeout(N), N = null, P({
		...M,
		snoozeUntilMs: 0
	}), M.source === "bridge" && M.state !== null && e.applyCrew(M.state);
}
function Ot(e) {
	if (typeof e != "string") return null;
	let t = e.slice(0, 4096).replace(/[\p{Cc}\u2028\u2029\u202A-\u202E\u2066-\u2069\u200B-\u200F\uFEFF]/gu, " ").replace(/\s+/g, " ").trim(), n = Array.from(t).slice(0, 160).join("").trim();
	return n.length > 0 ? n : null;
}
function F(e, t, n) {
	return Math.min(n, Math.max(t, e));
}
function kt(e) {
	return typeof e == "object" && !!e && !Array.isArray(e);
}
function At(e) {
	return e < 40 ? "focus" : e < 60 ? "flow" : e < 80 ? "recovery" : "decompress";
}
function jt(e) {
	if (!kt(e) || e.version !== 1) return null;
	let t = e.burnout, n = e.target;
	if (!kt(t) || !kt(n)) return null;
	let r = t.score, i = n.beatHz, s = n.carrierHz, c = n.gain, l = n.transitionSec;
	if (![
		r,
		i,
		s,
		c,
		l
	].every((e) => typeof e == "number" && Number.isFinite(e))) return null;
	let u = F(r, 0, 100), d = At(u), f = n.presetId, p = e.sbg, m = e.at, ee = Ot(e.why);
	return {
		version: 1,
		at: typeof m == "number" && Number.isFinite(m) ? Math.trunc(m) : 0,
		burnout: {
			score: u,
			level: d
		},
		target: {
			...typeof f == "string" && f.length > 0 && f.length <= 64 ? { presetId: f } : {},
			beatHz: F(i, o.beatMin, o.beatMax),
			carrierHz: F(s, o.carrierMin, o.carrierMax),
			gain: F(c, o.gainMin, o.gainMax),
			transitionSec: F(l, 5, 600),
			breathe: n.breathe === !0
		},
		sbg: typeof p == "string" && p.length <= a.maxBytes ? p : null,
		...ee === null ? {} : { why: ee }
	};
}
// ../../web/src/audio/samples/bus.ts
var Mt = null;
function Nt(e) {
	Mt = e;
}
function Pt() {
	return Mt;
}
// ../../web/src/audio/samples/math.ts
var Ft = .85, It = .3, Lt = .15, Rt = .4, zt = .6, Bt = .95, Vt = (e, t, n) => e < t ? t : e > n ? n : e;
function Ht(e, t = 0) {
	return Vt(Number.isFinite(e) ? e : Number.isFinite(t) ? t : 0, 0, Ft);
}
function Ut(e, t = 0) {
	return Vt(Number.isFinite(e) ? e : Number.isFinite(t) ? t : 0, 0, 1);
}
function Wt(e) {
	return 1 - zt * Ut(e);
}
function Gt(e) {
	return Ht(e) / Ft;
}
function Kt(e = 2049) {
	let t = Math.max(3, e | 0), n = new Float32Array(t);
	for (let e = 0; e < t; e++) n[e] = Vt(e / (t - 1) * 2 - 1, -.95, Bt);
	return n;
}
// ../../web/src/storage/prefs.ts
var qt = "zonked.safety.v1", Jt = "zonked.reduceMotion";
function Yt(e, t = Xt()) {
	try {
		return t?.getItem(e) === "1";
	} catch {
		return !1;
	}
}
function I(e, t, n = Xt()) {
	try {
		n?.setItem(e, t ? "1" : "0");
	} catch {}
}
function Xt() {
	try {
		return typeof localStorage > "u" ? void 0 : localStorage;
	} catch {
		return;
	}
}
// ../../web/src/app/useReducedMotion.ts
function Zt() {
	try {
		return typeof localStorage > "u" ? null : localStorage;
	} catch {
		return null;
	}
}
function Qt() {
	let [n, r] = t(() => Yt(Jt)), [i, a] = t(() => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? !1);
	return e(() => {
		let e = window.matchMedia?.("(prefers-reduced-motion: reduce)");
		if (e === void 0) return;
		let t = () => a(e.matches);
		return e.addEventListener("change", t), () => e.removeEventListener("change", t);
	}, []), [
		n || i,
		(e) => {
			I(Jt, e), r(e);
		},
		n
	];
}
// ../../web/src/audio/worklet.ts?worker&url
var $t = new URL("assets/worklet-h2SQeqeH.js", import.meta.url).href, en = new URL(new URL("assets/dsp_core.wasm.json", import.meta.url).href).href, tn = "audio-unsupported", L = {
	carrierHz: {
		min: 20,
		max: 1500,
		def: 200
	},
	beatHz: {
		min: .5,
		max: 40,
		def: 10
	},
	gain: {
		min: 0,
		max: .85,
		def: 0
	},
	noiseLevel: {
		min: 0,
		max: 1,
		def: 0
	},
	beatLevel: {
		min: 0,
		max: 1,
		def: 1
	},
	rampSec: {
		min: .05,
		max: 30,
		def: .05
	}
}, R = {
	carrierHz: 0,
	beatHz: 1,
	gain: 2,
	mode: 3,
	noiseKind: 4,
	noiseLevel: 5,
	rampSec: 6,
	beatLevel: 7,
	lofiLevel: 8,
	lofiWarmth: 9,
	crackle: 10,
	instLevel: 11,
	instKind: 12,
	instRootHz: 13,
	instScale: 14,
	instBpm: 15,
	padLevel: 16,
	padChord: 17,
	padRootHz: 18,
	chimeLevel: 19,
	chimeRatePerMin: 20,
	percLevel: 21,
	percBpm: 22,
	percPattern: 23,
	lofiProgression: 24,
	tapeWow: 25,
	pianoPedal: 26,
	breathDepth: 27,
	breathRateHz: 28,
	stereoWidth: 29,
	panDepth: 30,
	panRateHz: 31
};
function z(e, t, n, r) {
	return typeof e != "number" || !Number.isFinite(e) ? r : e < t ? t : e > n ? n : e;
}
var nn = (e, t = L.carrierHz.def) => z(e, L.carrierHz.min, L.carrierHz.max, t), rn = (e, t = L.beatHz.def) => z(e, L.beatHz.min, L.beatHz.max, t), an = (e, t = 0) => z(e, L.gain.min, L.gain.max, t), on = (e, t = 0) => z(e, L.noiseLevel.min, L.noiseLevel.max, t), sn = (e, t = L.beatLevel.def) => e === void 0 ? t : z(e, L.beatLevel.min, L.beatLevel.max, t), cn = (e, t = L.rampSec.def) => z(e, L.rampSec.min, L.rampSec.max, t), B = r, V = (e, t) => z(e, B.level.min, B.level.max, t), H = (e, t = 0) => z(typeof e == "number" ? Math.round(e) : e, 0, B.enumMax, t), ln = (e, t) => z(e, B.bpm.min, B.bpm.max, t);
function un(e) {
	let t = i, n = e ?? t;
	return {
		lofiLevel: V(n.lofiLevel, t.lofiLevel),
		lofiWarmth: V(n.lofiWarmth, t.lofiWarmth),
		crackle: V(n.crackle, t.crackle),
		instLevel: V(n.instLevel, t.instLevel),
		instKind: z(typeof n.instKind == "number" ? Math.round(n.instKind) : n.instKind, 0, B.instKindMax, t.instKind),
		instRootHz: z(n.instRootHz, B.instRootHz.min, B.instRootHz.max, t.instRootHz),
		instScale: H(n.instScale, t.instScale),
		instBpm: ln(n.instBpm, t.instBpm),
		padLevel: V(n.padLevel, t.padLevel),
		padChord: H(n.padChord, t.padChord),
		padRootHz: z(n.padRootHz, B.padRootHz.min, B.padRootHz.max, t.padRootHz),
		chimeLevel: V(n.chimeLevel, t.chimeLevel),
		chimeRatePerMin: z(n.chimeRatePerMin, B.chimeRatePerMin.min, B.chimeRatePerMin.max, t.chimeRatePerMin),
		percLevel: V(n.percLevel, t.percLevel),
		percBpm: ln(n.percBpm, t.percBpm),
		percPattern: H(n.percPattern, t.percPattern),
		lofiProgression: H(n.lofiProgression, t.lofiProgression),
		tapeWow: V(n.tapeWow, t.tapeWow),
		pianoPedal: V(n.pianoPedal, t.pianoPedal),
		breathDepth: V(n.breathDepth, t.breathDepth),
		breathRateHz: z(n.breathRateHz, B.breathRateHz.min, B.breathRateHz.max, t.breathRateHz),
		stereoWidth: V(n.stereoWidth, t.stereoWidth),
		panDepth: V(n.panDepth, t.panDepth),
		panRateHz: z(n.panRateHz, B.panRateHz.min, B.panRateHz.max, t.panRateHz)
	};
}
var dn = {
	binaural: 0,
	monaural: 1,
	isochronic: 2
}, fn = {
	off: 0,
	white: 1,
	pink: 2,
	brown: 3,
	violet: 4
};
function pn(e, t) {
	t[R.lofiLevel] = e.lofiLevel, t[R.lofiWarmth] = e.lofiWarmth, t[R.crackle] = e.crackle, t[R.instLevel] = e.instLevel, t[R.instKind] = e.instKind, t[R.instRootHz] = e.instRootHz, t[R.instScale] = e.instScale, t[R.instBpm] = e.instBpm, t[R.padLevel] = e.padLevel, t[R.padChord] = e.padChord, t[R.padRootHz] = e.padRootHz, t[R.chimeLevel] = e.chimeLevel, t[R.chimeRatePerMin] = e.chimeRatePerMin, t[R.percLevel] = e.percLevel, t[R.percBpm] = e.percBpm, t[R.percPattern] = e.percPattern, t[R.lofiProgression] = e.lofiProgression, t[R.tapeWow] = e.tapeWow, t[R.pianoPedal] = e.pianoPedal, t[R.breathDepth] = e.breathDepth, t[R.breathRateHz] = e.breathRateHz, t[R.stereoWidth] = e.stereoWidth, t[R.panDepth] = e.panDepth, t[R.panRateHz] = e.panRateHz;
}
function mn(e, t, n) {
	return n[R.carrierHz] = nn(e.carrierHz), n[R.beatHz] = rn(e.beatHz), n[R.gain] = an(e.gain), n[R.mode] = dn[e.mode] ?? 0, n[R.noiseKind] = fn[e.noise] ?? 0, n[R.noiseLevel] = on(e.noiseLevel), n[R.rampSec] = cn(t), n[R.beatLevel] = sn(e.beatLevel), pn(un(e.layers), n), n;
}
function hn(e, t) {
	return {
		carrierHz: nn(e.carrierHz, t?.carrierHz),
		beatHz: rn(e.beatHz, t?.beatHz),
		noise: e.noise in fn ? e.noise : t?.noise ?? "off",
		noiseLevel: on(e.noiseLevel, t?.noiseLevel),
		mode: e.mode in dn ? e.mode : t?.mode ?? "binaural",
		gain: an(e.gain, t?.gain),
		...e.beatLevel === void 0 ? {} : { beatLevel: sn(e.beatLevel, t?.beatLevel) },
		...e.layers === void 0 ? {} : { layers: un(e.layers) }
	};
}
var gn = class {
	seq;
	data;
	constructor(e) {
		this.seq = new Int32Array(e, 0, 1), this.data = new Float32Array(e, 4, 32);
	}
	write(e) {
		Atomics.add(this.seq, 0, 1);
		for (let t = 0; t < 32; t++) this.data[t] = e[t] ?? 0;
		Atomics.add(this.seq, 0, 1);
	}
}, _n = 8192, vn = 8191, yn = 8, bn = 65544;
function xn(e) {
	return e ? new SharedArrayBuffer(bn) : new ArrayBuffer(bn);
}
var Sn = class {
	idx;
	ring;
	constructor(e) {
		this.idx = new Int32Array(e, 0, 2), this.ring = new Float32Array(e, yn, _n * 2);
	}
	read(e) {
		let t = Atomics.load(this.idx, 0), n = t - Atomics.load(this.idx, 1) | 0;
		if (n <= 0) return 0;
		n > 8192 && (n = _n);
		let r = Math.min(n, e.length >> 1), i = t - r | 0;
		for (let t = 0; t < r; t++) {
			let n = (i & vn) * 2;
			e[t * 2] = this.ring[n] ?? 0, e[t * 2 + 1] = this.ring[n + 1] ?? 0, i = i + 1 | 0;
		}
		return Atomics.store(this.idx, 1, t), r;
	}
}, Cn = { read: () => 0 }, wn = 2, Tn = .3, En = 1e3, Dn = class {
	_status;
	listeners = /* @__PURE__ */ new Set();
	ctx = null;
	node = null;
	master = null;
	writer = null;
	tele = Cn;
	voice = null;
	startedAt = 0;
	statsId = 0;
	pending = /* @__PURE__ */ new Map();
	pendingStart = null;
	pendingStop = null;
	block = /* @__PURE__ */ new Float32Array(32);
	constructor() {
		this._status = {
			state: "idle",
			sampleRate: 0,
			usesSharedMemory: !1,
			crossOriginIsolated: typeof crossOriginIsolated == "boolean" && crossOriginIsolated
		};
	}
	get status() {
		return this._status;
	}
	get telemetry() {
		return this.tele;
	}
	onStatus(e) {
		return this.listeners.add(e), () => {
			this.listeners.delete(e);
		};
	}
	setStatus(e) {
		this._status = {
			...this._status,
			...e
		};
		for (let e of this.listeners) e(this._status);
	}
	async start(e) {
		if (this.pendingStop !== null && await this.pendingStop, this._status.state === "running") return;
		if (this.pendingStart !== null) return this.pendingStart;
		let t = this.doStart(e);
		return this.pendingStart = t.finally(() => {
			this.pendingStart = null;
		}), this.pendingStart;
	}
	async doStart(e) {
		this.setStatus({
			state: "starting",
			error: void 0
		});
		try {
			this.ctx === null && await this.build();
			let t = this.ctx;
			if (t === null || this.master === null) throw Error("audio graph missing");
			this.voice = hn(e), this.pushVoice(this.voice, wn), this.startedAt = t.currentTime;
			let n = this.master.gain;
			n.cancelScheduledValues(t.currentTime), n.setValueAtTime(0, t.currentTime), n.linearRampToValueAtTime(1, t.currentTime + wn), await t.resume(), this.setStatus({ state: "running" });
		} catch (e) {
			this.setStatus({
				state: "error",
				error: e instanceof Error ? e.message : String(e)
			});
		}
	}
	async build() {
		let e = new AudioContext({ latencyHint: "interactive" });
		if (this.ctx = e, typeof AudioWorkletNode > "u" || e.audioWorklet === void 0) throw Error(tn);
		await e.audioWorklet.addModule($t);
		let t = await fetch(en);
		if (!t.ok) throw Error(`wasm fetch failed: ${t.status}`);
		let n = await t.arrayBuffer(), r = typeof SharedArrayBuffer < "u" && this._status.crossOriginIsolated, i = r ? new SharedArrayBuffer(132) : void 0, a = r ? xn(!0) : void 0, o = new AudioWorkletNode(e, "zonked-dsp", {
			numberOfInputs: 0,
			outputChannelCount: [2]
		}), s = new Promise((e, t) => {
			o.port.onmessage = (n) => {
				let r = n.data;
				r.type === "ready" ? e() : r.type === "error" ? t(Error(r.message ?? "worklet init failed")) : this.onWorkletMessage(n.data);
			};
		});
		o.port.postMessage({
			type: "init",
			wasm: n,
			sab: i,
			tele: a,
			sampleRate: e.sampleRate
		}), await s, o.port.onmessage = (e) => this.onWorkletMessage(e.data);
		let c = e.createGain();
		c.gain.value = 0;
		let l = e.createGain(), u = e.createWaveShaper();
		u.curve = Kt(), o.connect(l).connect(c).connect(u).connect(e.destination), Nt({
			ctx: e,
			input: c,
			duck: l
		}), this.node = o, this.master = c, this.writer = i ? new gn(i) : null, this.tele = a ? new Sn(a) : Cn, this.setStatus({
			sampleRate: e.sampleRate,
			usesSharedMemory: r
		});
	}
	onWorkletMessage(e) {
		if (e.type === "stats") {
			let t = e.id, n = this.pending.get(t);
			if (!n) return;
			clearTimeout(n.timer), this.pending.delete(t), n.resolve({
				peak: Number(e.peak),
				rms: Number(e.rms),
				frames: Number(e.frames),
				nonZero: Number(e.nonZero)
			});
		} else e.type === "error" && this.setStatus({
			state: "error",
			error: String(e.message)
		});
	}
	pushVoice(e, t) {
		mn(e, t, this.block), this.writer === null ? this.node?.port.postMessage({
			type: "params",
			p: new Float32Array(this.block)
		}) : this.writer.write(this.block);
	}
	setVoice(e, t) {
		this.voice = hn(e, this.voice ?? void 0);
		let n = cn(t ?? .05);
		this.ctx !== null && this.ctx.currentTime - this.startedAt < 4 && (n = Math.max(n, wn)), this.pushVoice(this.voice, n);
	}
	stop() {
		if (this.pendingStop !== null) return this.pendingStop;
		if (this.pendingStart !== null) {
			let e = this.pendingStart;
			return this.pendingStop = e.then(() => this.doStop()).finally(() => {
				this.pendingStop = null;
			}), this.pendingStop;
		}
		return this.ctx === null || this._status.state !== "running" ? Promise.resolve() : (this.pendingStop = this.doStop().finally(() => {
			this.pendingStop = null;
		}), this.pendingStop);
	}
	async doStop() {
		let e = this.ctx;
		if (e === null || this._status.state !== "running") return;
		this.setStatus({ state: "stopping" }), this.voice !== null && this.pushVoice({
			...this.voice,
			gain: 0
		}, .1);
		let t = this.master?.gain;
		t && (t.cancelScheduledValues(e.currentTime), t.setValueAtTime(t.value, e.currentTime), t.linearRampToValueAtTime(0, e.currentTime + Tn)), await new Promise((e) => setTimeout(e, 350));
		try {
			await e.suspend(), this.setStatus({ state: "stopped" });
		} catch (e) {
			this.setStatus({
				state: "error",
				error: e instanceof Error ? e.message : String(e)
			});
		}
	}
	contextState() {
		return this.ctx === null ? "none" : this.ctx.state;
	}
	async resume() {
		let e = this.ctx;
		if (e === null || this._status.state !== "running") return !1;
		if (e.state === "running") return !0;
		try {
			await e.resume();
		} catch {
			return !1;
		}
		return e.state === "running";
	}
	getStats() {
		let e = {
			peak: 0,
			rms: 0,
			frames: 0,
			nonZero: 0
		}, t = this.node;
		return t === null ? Promise.resolve(e) : new Promise((n) => {
			let r = ++this.statsId, i = setTimeout(() => {
				this.pending.delete(r), n(e);
			}, En);
			this.pending.set(r, {
				resolve: n,
				timer: i
			}), t.port.postMessage({
				type: "stats-request",
				id: r
			});
		});
	}
};
// ../../web/src/audio/index.ts
function On() {
	return new Dn();
}
var U = (e) => e.mediaSession ?? void 0, kn = [{
	src: "/pwa-512x512.png",
	sizes: "512x512",
	type: "image/png"
}, {
	src: "/pwa-192x192.png",
	sizes: "192x192",
	type: "image/png"
}], An = [
	"play",
	"pause",
	"stop",
	"nexttrack",
	"previoustrack",
	"seekforward",
	"seekbackward"
];
function jn(e, t) {
	switch (e) {
		case "play": return () => t.play();
		case "pause": return () => t.pause();
		case "stop": return () => t.stop();
		case "nexttrack": return t.next ? () => t.next?.() : null;
		case "previoustrack": return t.prev ? () => t.prev?.() : null;
		case "seekforward": return t.seekBy ? () => t.seekBy?.(15) : null;
		case "seekbackward": return t.seekBy ? () => t.seekBy?.(-15) : null;
		default: return null;
	}
}
function Mn(e, t = navigator) {
	let n = U(t);
	if (n !== void 0 && typeof MediaMetadata < "u") try {
		n.metadata = new MediaMetadata({
			title: e?.name ?? "Zonked",
			artist: "Zonked",
			album: e?.category ?? "Acoustic recovery",
			artwork: kn
		});
	} catch {}
}
function Nn(e, t, n = navigator) {
	let r = U(n);
	if (r !== void 0 && typeof r.setPositionState == "function") try {
		if (!Number.isFinite(e) || e <= 0 || !Number.isFinite(t)) {
			r.setPositionState();
			return;
		}
		let n = Math.min(Math.max(0, t), e);
		r.setPositionState({
			duration: e,
			position: n,
			playbackRate: 1
		});
	} catch {}
}
function Pn(e, t = navigator) {
	let n = U(t);
	if (n === void 0) return () => void 0;
	Mn(null, t);
	for (let t of An) try {
		n.setActionHandler(t, jn(t, e));
	} catch {}
	return () => {
		for (let e of An) try {
			n.setActionHandler(e, null);
		} catch {}
		try {
			n.metadata = null, n.setPositionState?.();
		} catch {}
	};
}
function Fn(e, t = navigator) {
	let n = U(t);
	n !== void 0 && (n.playbackState = e ? "playing" : "paused");
}
// ../../web/src/app/visibility.ts
async function In(e) {
	if (!e.isPlaying()) return !1;
	let t = e.engine.contextState?.();
	if (t !== "suspended" && t !== "interrupted" || e.engine.resume === void 0) return !1;
	try {
		await e.engine.resume();
	} catch {}
	return !0;
}
function Ln(e) {
	let t = e.doc ?? (typeof document > "u" ? void 0 : document), n = e.win ?? (typeof window > "u" ? void 0 : window), r = () => {
		let n = t?.hidden === !0;
		e.onVisibility?.(n), In(e);
	}, i = () => void In(e);
	return t?.addEventListener("visibilitychange", r), n?.addEventListener("pageshow", i), n?.addEventListener("pointerdown", i), n?.addEventListener("keydown", i), () => {
		t?.removeEventListener("visibilitychange", r), n?.removeEventListener("pageshow", i), n?.removeEventListener("pointerdown", i), n?.removeEventListener("keydown", i);
	};
}
// ../../web/src/app/wakeLock.ts
var Rn = "zonked.wakeLock", zn = class {
	nav;
	storage;
	sentinel = null;
	enabled;
	playing = !1;
	hidden = !1;
	pendingRequest = !1;
	constructor(e = typeof navigator > "u" ? {} : navigator, t = null) {
		this.nav = e, this.storage = t, this.enabled = this.readPref();
	}
	get supported() {
		return this.nav.wakeLock !== void 0 && this.nav.wakeLock !== null;
	}
	get isEnabled() {
		return this.enabled;
	}
	get held() {
		return this.sentinel !== null;
	}
	async setEnabled(e) {
		this.enabled = e;
		try {
			this.storage?.setItem(Rn, e ? "1" : "0");
		} catch {}
		await this.sync();
	}
	async setPlaying(e) {
		this.playing = e, await this.sync();
	}
	async setHidden(e) {
		this.hidden = e, await this.sync();
	}
	async dispose() {
		this.playing = !1, await this.sync();
	}
	wanted() {
		return this.enabled && this.playing && !this.hidden && this.supported;
	}
	async sync() {
		if (!this.wanted()) await this.release();
		else if (!(this.sentinel !== null || this.pendingRequest)) {
			this.pendingRequest = !0;
			try {
				let e = await this.nav.wakeLock.request("screen");
				this.wanted() ? (this.sentinel = e, e.addEventListener?.("release", () => {
					this.sentinel === e && (this.sentinel = null);
				})) : await e.release().catch(() => void 0);
			} catch {} finally {
				this.pendingRequest = !1;
			}
		}
	}
	async release() {
		let e = this.sentinel;
		if (this.sentinel = null, e !== null) try {
			await e.release();
		} catch {}
	}
	readPref() {
		try {
			return this.storage?.getItem(Rn) === "1";
		} catch {
			return !1;
		}
	}
}, Bn = ["favorites", "milestones"], Vn = "zonked", W = "scripts", G = "logs", K = "mixes", q = "records", Hn = 2, Un = 80, J = (e) => typeof e == "number" && Number.isFinite(e);
function Wn(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	return J(t.id) && typeof t.name == "string" && t.name.length >= 1 && t.name.length <= Un && typeof t.text == "string" && t.text.length <= a.maxBytes && J(t.updatedAt);
}
function Gn(e) {
	if (typeof e != "object" || !e) return !1;
	let t = e;
	return J(t.id) && J(t.startedAt) && J(t.endedAt) && J(t.peakScore) && typeof t.presetId == "string" && t.presetId.length <= Un;
}
function Kn(e) {
	let t = {
		id: e.id,
		startedAt: e.startedAt,
		endedAt: e.endedAt,
		peakScore: e.peakScore,
		presetId: e.presetId
	}, n = e, r = n.endKind, i = n.breaks;
	return {
		...t,
		...r === "manual" || r === "countdown" || r === "sleep-fade" ? { endKind: r } : {},
		...J(i) && i >= 0 && i <= 1e3 ? { breaks: Math.floor(i) } : {}
	};
}
function Y(e) {
	return new Promise((t, n) => {
		e.onsuccess = () => t(e.result), e.onerror = () => n(e.error ?? /* @__PURE__ */ Error("IndexedDB request failed"));
	});
}
function X(e) {
	return new Promise((t, n) => {
		e.oncomplete = () => t(), e.onerror = () => n(e.error ?? /* @__PURE__ */ Error("IndexedDB transaction failed")), e.onabort = () => n(e.error ?? /* @__PURE__ */ Error("IndexedDB transaction aborted"));
	});
}
function qn(e) {
	return new Promise((t, n) => {
		let r = e.open(Vn, Hn);
		r.onupgradeneeded = () => {
			let e = r.result, t = (t) => e.objectStoreNames.contains(t);
			t(W) || e.createObjectStore(W, {
				keyPath: "id",
				autoIncrement: !0
			}), t(G) || e.createObjectStore(G, {
				keyPath: "id",
				autoIncrement: !0
			}), t(K) || e.createObjectStore(K, { keyPath: "id" }), t(q) || e.createObjectStore(q);
		}, r.onsuccess = () => t(r.result), r.onerror = () => n(r.error ?? /* @__PURE__ */ Error("IndexedDB open failed")), r.onblocked = () => n(/* @__PURE__ */ Error("IndexedDB open blocked"));
	});
}
function Jn(e, t) {
	if (t.length > a.maxBytes) throw RangeError("Script exceeds 256 KB");
	let n = e.trim().slice(0, Un);
	return n.length > 0 ? n : "Untitled";
}
function Yn() {
	let e = 1, t = [], n = [], r = /* @__PURE__ */ new Map(), i = /* @__PURE__ */ new Map();
	return {
		persistent: () => Promise.resolve(!1),
		saveScript(n, r) {
			let i = Jn(n, r), a = {
				id: t.find((e) => e.name === i)?.id ?? e++,
				name: i,
				text: r,
				updatedAt: Date.now()
			}, o = t.findIndex((e) => e.id === a.id);
			return o >= 0 ? t[o] = a : t.push(a), Promise.resolve(a);
		},
		listScripts: () => Promise.resolve([...t].sort((e, t) => t.updatedAt - e.updatedAt)),
		deleteScript(e) {
			let n = t.findIndex((t) => t.id === e);
			return n >= 0 && t.splice(n, 1), Promise.resolve();
		},
		addLog(t) {
			return n.push({
				...t,
				id: e++
			}), Promise.resolve();
		},
		listLogs: (e = 50) => Promise.resolve([...n].sort((e, t) => t.startedAt - e.startedAt).slice(0, e)),
		listMixes: () => Promise.resolve([...r.values()].sort((e, t) => t.updatedAt - e.updatedAt)),
		putMix(e) {
			return r.size >= 200 && !r.has(e.id) ? Promise.reject(/* @__PURE__ */ RangeError("Too many mixes")) : (r.set(e.id, e), Promise.resolve());
		},
		deleteMix(e) {
			return r.delete(e), Promise.resolve();
		},
		getRecord: (e) => Promise.resolve(i.get(e)),
		setRecord(e, t) {
			return i.set(e, t), Promise.resolve();
		},
		clearSanctuary() {
			return r.clear(), i.clear(), n.length = 0, Promise.resolve();
		}
	};
}
function Xn(e = globalThis.indexedDB) {
	let t = Yn();
	if (e === void 0) return t;
	let n = null, r = () => (n ??= qn(e).catch(() => null), n);
	return {
		persistent: async () => await r() !== null,
		async saveScript(e, n) {
			let i = await r();
			if (i === null) return t.saveScript(e, n);
			let a = Jn(e, n), o = i.transaction(W, "readwrite"), s = o.objectStore(W), c = (await Y(s.getAll())).filter(Wn).find((e) => e.name === a), l = {
				name: a,
				text: n,
				updatedAt: Date.now()
			}, u = await Y(s.put(c ? {
				...l,
				id: c.id
			} : l));
			return await X(o), {
				...l,
				id: Number(u)
			};
		},
		async listScripts() {
			let e = await r();
			return e === null ? t.listScripts() : (await Y(e.transaction(W).objectStore(W).getAll())).filter(Wn).sort((e, t) => t.updatedAt - e.updatedAt);
		},
		async deleteScript(e) {
			let n = await r();
			if (n === null) return t.deleteScript(e);
			let i = n.transaction(W, "readwrite");
			i.objectStore(W).delete(e), await X(i);
		},
		async addLog(e) {
			let n = await r();
			if (n === null) return t.addLog(e);
			let i = n.transaction(G, "readwrite");
			i.objectStore(G).add({ ...e }), await X(i);
		},
		async listLogs(e = 50) {
			let n = await r();
			return n === null ? t.listLogs(e) : (await Y(n.transaction(G).objectStore(G).getAll())).filter(Gn).map(Kn).sort((e, t) => t.startedAt - e.startedAt).slice(0, e);
		},
		async listMixes() {
			let e = await r();
			if (e === null) return t.listMixes();
			let n = await Y(e.transaction(K).objectStore(K).getAll()), i = Date.now();
			return n.map((e) => _t(e, i)).filter((e) => e !== null).sort((e, t) => t.updatedAt - e.updatedAt).slice(0, 200);
		},
		async putMix(e) {
			let n = await r();
			if (n === null) return t.putMix(e);
			let i = n.transaction(K, "readwrite"), a = i.objectStore(K), o = await Y(a.count()), s = await Y(a.getKey(e.id)) !== void 0;
			if (o >= 200 && !s) throw i.abort(), RangeError("Too many mixes");
			a.put(e), await X(i);
		},
		async deleteMix(e) {
			let n = await r();
			if (n === null) return t.deleteMix(e);
			let i = n.transaction(K, "readwrite");
			i.objectStore(K).delete(e), await X(i);
		},
		async getRecord(e) {
			let n = await r();
			return n === null || !Bn.includes(e) ? t.getRecord(e) : await Y(n.transaction(q).objectStore(q).get(e));
		},
		async setRecord(e, n) {
			let i = await r();
			if (i === null) return t.setRecord(e, n);
			let a = i.transaction(q, "readwrite");
			a.objectStore(q).put(n, e), await X(a);
		},
		async clearSanctuary() {
			let e = await r();
			if (e === null) return t.clearSanctuary();
			let n = e.transaction([
				K,
				q,
				G
			], "readwrite");
			n.objectStore(K).clear(), n.objectStore(q).clear(), n.objectStore(G).clear(), await X(n);
		}
	};
}
// src/engine/session.ts
var Zn = 5, Qn = (e) => p(e), Z = null, $n = () => Yt(qt);
function er(e, t, n) {
	Pn({
		play: () => {
			$n() && !e.snapshot().playing && e.play();
		},
		pause: () => void e.stop(),
		stop: () => void e.stop(),
		seekBy: (t) => e.seekBy(t)
	}), Ln({
		engine: t,
		isPlaying: () => e.snapshot().playing,
		onVisibility: (e) => void n.setHidden(e)
	});
	let r = "";
	e.subscribe((t) => {
		let i = Math.floor(t.elapsedSec / Zn), a = `${String(t.playing)}|${t.templateId ?? ""}|${t.timer.kind}|${t.timer.phase}|${String(i)}`;
		if (a === r) return;
		r = a, Fn(t.playing), Mn(t.templateName === null ? null : {
			name: t.templateName,
			category: t.templateCategory ?? ""
		});
		let o = e.positionState();
		o === null ? Nn(0, 0) : Nn(o.durationSec, o.positionSec), n.setPlaying(t.playing);
	});
}
function Q() {
	if (Z !== null) return Z;
	let e = On(), t = Xn(), n = new it(e, qe, (e) => void t.addLog(e).catch(() => void 0), { toEvents: Qn });
	return er(n, e, new zn(void 0, Zt())), Z = {
		engine: e,
		player: n,
		store: t
	}, Z;
}
var $ = 0, tr = /* @__PURE__ */ new Set(), nr = () => $ > 0;
function rr(e) {
	return tr.add(e), () => void tr.delete(e);
}
function ir(e) {
	$ = Math.max(0, $ + (e ? 1 : -1));
	for (let e of tr) e($ > 0);
}
var ar = () => Q().engine.getStats(), or = () => Q().engine.status.state, sr = 1e3, cr = 3e4, lr = "zonked.crew.v1", ur = /* @__PURE__ */ new Set();
function dr() {
	try {
		if (typeof location < "u" && new URLSearchParams(location.search).get("crew") === "1") return I(lr, !0), !0;
	} catch {}
	return Yt(lr);
}
function fr(e) {
	I(lr, e);
	for (let t of [...ur]) try {
		t(e);
	} catch {}
}
function pr(e) {
	return ur.add(e), () => {
		ur.delete(e);
	};
}
function mr(e) {
	return Math.min(cr, sr * 2 ** Math.min(Number.isFinite(e) ? Math.max(0, Math.floor(e)) : 0, 10));
}
function hr(e) {
	return typeof EventSource > "u" ? null : new EventSource(e);
}
var gr = class {
	deps;
	es = null;
	timer = null;
	attempt = 0;
	stopped = !0;
	wanted = !1;
	unsub = null;
	status = "standalone";
	constructor(e) {
		this.deps = e;
	}
	getStatus() {
		return this.status;
	}
	start() {
		this.wanted || (this.wanted = !0, this.unsub = pr(() => this.sync()), this.sync());
	}
	stop() {
		this.wanted = !1, this.unsub?.(), this.unsub = null, this.sync();
	}
	isEnabled() {
		return this.deps.enabled ? this.deps.enabled() : this.deps.create !== void 0 || dr();
	}
	sync() {
		let e = this.wanted && this.isEnabled();
		e && this.stopped ? (this.stopped = !1, this.attempt = 0, this.connect()) : !e && !this.stopped && (this.stopped = !0, this.clearTimer(), this.closeSource(), this.setStatus("standalone"));
	}
	connect() {
		if (this.stopped) return;
		let e = this.deps.create ?? hr, t = null;
		try {
			t = e(this.deps.url ?? "http://localhost:43210/events");
		} catch {
			t = null;
		}
		t === null ? this.scheduleRetry() : (this.es = t, t.addEventListener("open", () => {
			this.es === t && (this.attempt = 0, this.setStatus("connected"));
		}), t.addEventListener("state", (e) => {
			this.es === t && this.handleState(e.data);
		}), t.addEventListener("error", () => {
			this.es === t && (this.closeSource(), this.setStatus("standalone"), this.scheduleRetry());
		}));
	}
	handleState(e) {
		if (typeof e != "string" || e.length > 7e4) return;
		let t;
		try {
			t = JSON.parse(e);
		} catch {
			return;
		}
		let n = jt(t);
		if (n !== null) try {
			this.deps.onState(n);
		} catch {}
	}
	scheduleRetry() {
		if (this.stopped) return;
		let e = mr(this.attempt);
		this.attempt += 1;
		let t = this.deps.setTimer ?? ((e, t) => setTimeout(e, t));
		this.timer = t(() => {
			this.timer = null, this.connect();
		}, e);
	}
	clearTimer() {
		this.timer !== null && ((this.deps.clearTimer ?? ((e) => clearTimeout(e)))(this.timer), this.timer = null);
	}
	closeSource() {
		let e = this.es;
		this.es = null;
		try {
			e?.close();
		} catch {}
	}
	setStatus(e) {
		if (this.status !== e) {
			this.status = e;
			try {
				this.deps.onStatus(e);
			} catch {}
		}
	}
}, _r = "zonked.css";
function vr(e) {
	let t = new URL(_r, e).href;
	if ([...document.querySelectorAll("link[data-zonked-css]")].some((e) => e.getAttribute("href") === t)) return;
	let n = document.createElement("link");
	n.rel = "stylesheet", n.href = t, n.setAttribute("data-zonked-css", "1"), document.head.appendChild(n);
}
// src/engine/crewLink.ts
var yr = "/apps/zonked/api/state", br = 15e3, xr = null, Sr = null, Cr = "standalone", wr = "", Tr = /* @__PURE__ */ new Set(), Er = () => Cr;
function Dr(e) {
	return Tr.add(e), () => void Tr.delete(e);
}
function Or(e) {
	if (e !== Cr) {
		Cr = e;
		for (let t of [...Tr]) t(e);
	}
}
function kr() {
	Cr === "connected" && Q().player.crewLost(), Tt(), wr = "", Or("standalone");
}
async function Ar() {
	if (xr === null || !dr()) return kr();
	try {
		let e = jt((await xr.get(yr)).crew);
		if (e === null) return kr();
		Or("connected");
		let t = JSON.stringify([
			e.burnout,
			e.target,
			e.why ?? ""
		]);
		if (t === wr) return;
		wr = t, wt(Q().player, e);
	} catch {
		kr();
	}
}
function jr(e) {
	xr = e, Sr === null && (Sr = setInterval(() => void Ar(), br), pr(() => void Ar()), Ar());
}
function Mr() {
	let t = n.useAppApi, r = t === void 0 ? null : t();
	e(() => {
		r !== null && jr(r);
	}, [r]);
}
export { Fe as $, vt as A, O as B, Ft as C, Wt as D, Ht as E, P as F, Ae as G, it as H, Et as I, Oe as J, Me as K, St as L, wt as M, Tt as N, Pt as O, Dt as P, Ne as Q, dt as R, Lt as S, Ut as T, qe as U, A as V, De as W, Le as X, ke as Y, Ie as Z, Qt as _, gr as a, Rt as b, fr as c, Q as d, S as et, nr as f, tn as g, ir as h, vr as i, xt as j, jt as k, or as l, rr as m, Dr as n, a as nt, dr as o, $n as p, je as q, Mr as r, i as rt, pr as s, Er as t, x as tt, ar as u, qt as v, Gt as w, It as x, I as y, k as z };
