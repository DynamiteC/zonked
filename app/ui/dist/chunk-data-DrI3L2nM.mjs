import { a as e, i as t, n, r } from "./chunk-catalog-DQXidRzG.mjs";
// ../../web/src/ui/calm/data/types.ts
var i = [
	"focus",
	"calm",
	"sleep",
	"study",
	"recover",
	"curious"
], a = [
	"morning",
	"afternoon",
	"evening",
	"night",
	"anytime"
], o = [
	"wired",
	"bluetooth",
	"speakers"
], s = {
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
}, c = Object.freeze({
	kind: "rest",
	family: "",
	variants: Object.freeze([])
});
function l(e) {
	let t = s[e] ?? 0, n = [];
	for (let r = 1; r <= t; r += 1) n.push(`${e}-${String(r).padStart(2, "0")}`);
	return Object.freeze(n);
}
function u(e) {
	return Object.freeze({
		kind: "session",
		family: e,
		variants: l(e)
	});
}
function d(...e) {
	return Object.freeze(e.map((e) => e === "rest" ? c : u(e)));
}
var f = (e, t) => Array.from({ length: t }, () => e), p = (e) => Object.freeze(e), m = Object.freeze([
	p({
		id: "calm-evenings",
		title: "7 Calm Evenings",
		blurb: "7 short evenings of slow sound. About 20 minutes each.",
		situation: "heal-stress",
		vibe: "calm",
		minutes: 20,
		days: d("healing-soothe-glide", "meditation-breath-pacer", "vibe-warm-glow", "rest", "meditation-alpha-sit", "recovery-lofi-unwind", "healing-soothe-glide")
	}),
	p({
		id: "focus-mornings",
		title: "5 Focus Mornings",
		blurb: "5 mornings of steady sound to start work. About 30 minutes each.",
		situation: "deep-work",
		vibe: "bright",
		minutes: 30,
		days: d("focus-alpha-beta", "focus-alpha-beta", "focus-sprint-pulse", "rest", "focus-deep-beta")
	}),
	p({
		id: "easier-sleep",
		title: "14 Nights of Wind-Down Sound",
		blurb: "14 nights of slow sound for winding down. Rest nights included. If sleep trouble lasts, talk to a doctor.",
		situation: "cant-sleep",
		vibe: "dreamy",
		minutes: 45,
		days: d(...f("sleep-drift-theta", 4), "rest", ...f("sleep-onset-delta", 4), "rest", ...f("sleep-deep-delta", 3), "sleep-onset-delta")
	}),
	p({
		id: "study-sprint",
		title: "Study Sprint Week",
		blurb: "A week of short study blocks with breaks. About 25 minutes each.",
		situation: "deep-work",
		vibe: "minimal",
		minutes: 25,
		days: d("focus-sprint-pulse", "focus-alpha-beta", "recovery-micro-break", "focus-sprint-pulse", "rest", "focus-alpha-beta", "meditation-alpha-sit")
	}),
	p({
		id: "after-work-reset",
		title: "After-Work Reset",
		blurb: "5 evenings to step out of work mode. About 20 minutes each.",
		situation: "ai-burnout",
		vibe: "warm",
		minutes: 20,
		days: d("recovery-post-sprint", "recovery-lofi-unwind", "recovery-micro-break", "rest", "recovery-lofi-unwind")
	}),
	p({
		id: "gentle-routine",
		title: "Gentle Routine",
		blurb: "Gentle routine for steady attention. About 25 minutes each.",
		situation: "adhd-focus",
		vibe: "grounded",
		minutes: 25,
		days: d("adhd-smr-steady", "recovery-micro-break", "adhd-smr-steady", "rest", "adhd-beta-anchor", "recovery-micro-break", "adhd-smr-steady")
	})
]);
function h(e) {
	return m.find((t) => t.id === e);
}
// ../../web/src/ui/calm/data/recommendation.ts
var g = {
	focus: {
		situation: "deep-work",
		vibe: "bright",
		minutes: 25
	},
	calm: {
		situation: "heal-stress",
		vibe: "calm",
		minutes: 15
	},
	sleep: {
		situation: "cant-sleep",
		vibe: "dreamy",
		minutes: 45
	},
	study: {
		situation: "deep-work",
		vibe: "minimal",
		minutes: 30
	},
	recover: {
		situation: "ai-burnout",
		vibe: "warm",
		minutes: 15
	},
	curious: {
		situation: "quick-reset",
		minutes: 10
	}
}, ee = {
	wired: "headphones",
	bluetooth: "bluetooth",
	speakers: "speaker"
};
function _(e) {
	return e < 12 ? "morning" : e >= 12 && e < 17 ? "afternoon" : e >= 17 && e < 21 ? "evening" : "night";
}
function v(e, t = /* @__PURE__ */ new Date()) {
	let n = g[e.goal], r = e.timeOfDay === "anytime" ? _(t.getHours()) : e.timeOfDay, i = {
		situation: n.situation,
		availableMinutes: n.minutes,
		timeOfDay: r,
		sensorySensitivity: e.extraGentle ? "high" : "medium",
		deviceType: ee[e.device]
	};
	return Object.freeze(n.vibe === void 0 ? i : {
		...i,
		vibe: n.vibe
	});
}
var y = 6, b = 12, te = 12, ne = 3, re = 6, ie = 24, ae = [
	"pad",
	"instrument",
	"chimes"
];
function oe(e) {
	let t = Math.min(b, e.layerTags.filter((e) => ae.includes(e)).length * y), n = e.stages.some((e) => e.noiseLevel > 0 && (e.noise === "white" || e.noise === "violet")), i = e.stages.some((e) => e.noiseLevel > 0 && e.noise === "pink");
	return t - (n ? te : 0) - (i ? ne : 0) - (r(e) ? re : 0);
}
function se(e, i, a, o) {
	let s = n(e, a, o);
	if (i !== "bluetooth") return s;
	let c = Math.max(0, ...s.map((e) => e.template.intensity)), l = e.sensorySensitivity === "high", u = n(e, Math.max(ie, a), o).filter((e) => e.template.intensity <= c && !(l && (t(e.template) || r(e.template)))).map((e, t) => {
		let n = oe(e.template), r = n > 0 ? [...e.reasons, "Clear and soft over Bluetooth."] : e.reasons;
		return {
			r: {
				...e,
				score: Math.max(0, Math.round((e.score + n) * 10) / 10),
				reasons: r
			},
			i: t
		};
	});
	u.sort((e, t) => t.r.score - e.r.score || e.i - t.i);
	let d = u.slice(0, a).map((e) => e.r);
	return d.length >= a ? d : s;
}
function ce(e, t) {
	return t === "bluetooth" ? [...e.filter((e) => e.btFriendly), ...e.filter((e) => !e.btFriendly)] : e;
}
// ../../web/src/ui/calm/data/resolve.ts
var le = 3, ue = Object.freeze([]);
function de(e, t) {
	let n = RegExp(`^${e.replace(/[^a-z0-9-]/g, "")}-\\d{2}$`);
	return t.filter((e) => n.test(e.id)).sort((e, t) => e.id < t.id ? -1 : +(e.id > t.id));
}
function fe(e, t, r) {
	let i = {
		...t,
		situation: e.situation,
		vibe: e.vibe,
		availableMinutes: e.minutes
	};
	return n(i, 1, r)[0]?.template.id;
}
function pe(e, t, n) {
	let r = e.length;
	for (let i = 0; i < r; i += 1) {
		let a = e[(t + i) % r];
		if (a !== void 0 && (!n || a.intensity <= le)) return a.id;
	}
}
function me(e, t, n, r, i) {
	return pe(de(e.family, i), t, r.extraGentle) ?? fe(n, v(r), i);
}
function he(t, n, r, i = e()) {
	let a = h(n);
	if (a === void 0) return ue;
	let o = [];
	for (let e of a.days) {
		if (e.kind === "rest") continue;
		let n = me(e, o.length, a, t, i);
		n !== void 0 && o.push(n);
	}
	return Object.freeze(o);
}
// ../../web/src/ui/calm/data/feel.ts
var x = "zonked.feel.v1", ge = [
	"calmer",
	"same",
	"not"
], _e = 1e7, S = /^[a-z0-9-]{1,80}$/, C = 4, w = 12, T = (e) => ge.some((t) => t === e);
function E(e) {
	if (typeof e != "object" || !e || Array.isArray(e)) return;
	let { id: t, a: n, day: r } = e;
	if (typeof t == "string" && S.test(t) && T(n) && !(typeof r != "number" || !Number.isInteger(r) || r < 0 || r > _e)) return {
		id: t,
		a: n,
		day: r
	};
}
function D(e) {
	if (!Array.isArray(e)) return [];
	let t = [];
	for (let n of e.slice(-500)) {
		let e = E(n);
		e !== void 0 && t.push(e);
	}
	return t;
}
function O(e) {
	try {
		let t = e.get(x);
		if (t === null || t.length > 65536) return [];
		let n = JSON.parse(t);
		if (typeof n != "object" || !n) return [];
		let r = n;
		return r.v === 1 ? D(r.entries) : [];
	} catch {
		return [];
	}
}
function k(e, t) {
	let n = D(t);
	try {
		let t = JSON.stringify({
			v: 1,
			entries: n
		});
		for (; t.length > 65536 && n.length > 0;) n = n.slice(Math.ceil(n.length / 10)), t = JSON.stringify({
			v: 1,
			entries: n
		});
		return e.set(x, t), !0;
	} catch {
		return !1;
	}
}
function A(e, t) {
	let n = E(t);
	return n === void 0 ? e : [...e, n].slice(-500);
}
function j(e) {
	try {
		e.remove(x);
	} catch {}
}
function M(e, t) {
	let n = 0;
	for (let r of e) r.id === t && (n += r.a === "calmer" ? C : r.a === "not" ? -4 : 0);
	return Math.max(-12, Math.min(w, n));
}
var N = (e) => e.reasons.some((e) => e.startsWith("Made for:")) && !e.reasons.some((e) => e.startsWith("Filters relaxed"));
function P(e, n, i) {
	if (i.length === 0) return e;
	let a = Math.max(0, ...e.map((e) => e.template.intensity)), o = e.some((e) => t(e.template)), s = e.some((e) => r(e.template)), c = new Set(e.map((e) => e.template.id)), l = n.filter((e) => c.has(e.template.id) || N(e) && e.template.intensity <= a && (o || !t(e.template)) && (s || !r(e.template))).map((e, t) => ({
		r: e,
		i: t,
		s: e.score + M(i, e.template.id)
	}));
	return l.sort((e, t) => t.s - e.s || e.i - t.i), l.slice(0, e.length).map((e) => e.r);
}
// ../../web/src/ui/calm/data/storage.ts
var F = "zonked.profile.v1", I = "zonked.journeys.v1", L = "zonked.last.v1", R = "zonked.device.v1", z = 1, ve = 1e7, ye = /^[a-z0-9-]{1,64}$/, B = Object.freeze({
	goal: "curious",
	timeOfDay: "anytime",
	device: "wired",
	extraGentle: !1,
	createdAt: 0
}), be = Object.freeze({}), V = (e) => typeof e == "object" && !!e && !Array.isArray(e), H = (e, t) => typeof e == "number" && Number.isInteger(e) && e >= 0 && e <= t, U = (e, t) => e.some((e) => e === t);
function W(e, t) {
	try {
		let n = e.get(t);
		if (n === null || n.length > 32768) return;
		let r = JSON.parse(n);
		return V(r) && r.v === z ? r : void 0;
	} catch {
		return;
	}
}
function G(e, t, n) {
	try {
		let r = JSON.stringify({
			v: z,
			...n
		});
		return r.length > 32768 ? !1 : (e.set(t, r), !0);
	} catch {
		return !1;
	}
}
function K(e) {
	return e === "headphones" || e === "unsure" ? "wired" : U(o, e) ? e : void 0;
}
function q(e) {
	let { goal: t, timeOfDay: n, extraGentle: r, createdAt: o } = e, s = K(e.device);
	if (U(i, t) && U(a, n) && s !== void 0 && typeof r == "boolean" && H(o, 2 ** 53 - 1)) return Object.freeze({
		goal: t,
		timeOfDay: n,
		device: s,
		extraGentle: r,
		createdAt: o
	});
}
function xe(e) {
	return K(W(e, R)?.device);
}
function J(e, t) {
	return U(o, t) && G(e, "zonked.device.v1", { device: t });
}
function Se(e) {
	let t = W(e, F), n = t && q(t), r = xe(e);
	return n ? r === void 0 ? (J(e, n.device), n) : r === n.device ? n : Object.freeze({
		...n,
		device: r
	}) : r === void 0 ? B : Object.freeze({
		...B,
		device: r
	});
}
function Ce(e, t) {
	let n = q({ ...t });
	return n !== void 0 && (J(e, n.device), G(e, F, { ...n }));
}
function Y(e, t) {
	let n = m.find((t) => t.id === e);
	if (n === void 0 || !V(t) || !H(t.startedAt, ve)) return;
	let { doneDays: r, pickedIds: i } = t;
	if (!Array.isArray(r) || !Array.isArray(i) || i.length > n.days.length) return;
	let a = r, o = i;
	if (!a.every((e) => H(e, n.days.length) && e >= 1) || !o.every((e) => typeof e == "string" && ye.test(e))) return;
	let s = [...new Set(a)].sort((e, t) => e - t);
	return Object.freeze({
		startedAt: t.startedAt,
		doneDays: Object.freeze(s),
		pickedIds: Object.freeze([...o])
	});
}
function we(e) {
	let t = W(e, I)?.journeys;
	if (!V(t)) return be;
	let n = {};
	for (let [e, r] of Object.entries(t)) {
		let t = Y(e, r);
		t !== void 0 && (n[e] = t);
	}
	return Object.freeze(n);
}
function Te(e, t) {
	let n = {};
	for (let [e, r] of Object.entries(t)) {
		let t = Y(e, r);
		t !== void 0 && (n[e] = t);
	}
	return G(e, I, { journeys: n });
}
function Ee(e) {
	for (let t of [
		F,
		I,
		L,
		x,
		R
	]) try {
		e.remove(t);
	} catch {}
}
function X() {
	let e = /* @__PURE__ */ new Map();
	return {
		get: (t) => e.get(t) ?? null,
		set: (t, n) => void e.set(t, n),
		remove: (t) => void e.delete(t)
	};
}
function De(e) {
	try {
		let t = e ?? globalThis.localStorage;
		if (t === void 0) return X();
		let n = "zonked.probe";
		return t.setItem(n, "1"), t.removeItem(n), {
			get: (e) => t.getItem(e),
			set: (e, n) => t.setItem(e, n),
			remove: (e) => t.removeItem(e)
		};
	} catch {
		return X();
	}
}
var Z = /^[a-z0-9-]{1,80}$/;
function Oe(e) {
	try {
		let t = e.get(L);
		return t !== null && Z.test(t) ? t : null;
	} catch {
		return null;
	}
}
function ke(e, t) {
	try {
		Z.test(t) && e.set(L, t);
	} catch {}
}
// ../../web/src/ui/calm/copy-ux.ts
var Q = {
	planTitle: {
		sprint: "Study sprint",
		winddown: "Wind down",
		focus: "Focus session",
		calm: "A calm break",
		reset: "10 minute calm start"
	},
	planEyebrow: {
		sprint: "Today: 25 minutes of focus, then 5 minutes of rest",
		winddown: "Today: a gentle wind down",
		focus: "Today: a focus session",
		calm: "Today: a short calm break",
		reset: "Today: a quick, quiet reset"
	},
	planStart: {
		sprint: "Start sprint",
		winddown: "Start",
		focus: "Start",
		calm: "Start",
		reset: "Start"
	},
	useCasesTitle: "Start with",
	useCases: {
		winddown: "Wind down",
		sleep: "Sleep",
		focus: "Focus"
	},
	minutes: (e) => `${e} min`,
	hearIntro: "You will hear",
	hearJoin: (e) => e.length < 2 ? e[0] ?? "soft sound" : `${e.slice(0, -1).join(", ")} and ${e[e.length - 1] ?? ""}`,
	hearParts: {
		binaural: "two soft tones",
		isochronic: "a slow pulse",
		monaural: "a gentle pulse",
		noise: "soft rushing hush",
		lofi: "warm lo-fi texture",
		instrument: "quiet notes",
		pad: "a warm pad",
		chimes: "light chimes",
		percussion: "a soft beat"
	},
	echo: {
		calmer: (e, t) => `${e} ${t} felt calmer. Play it again?`,
		same: (e, t) => `${e} ${t} felt about the same. Play it again if you like.`,
		when: (e) => e <= 0 ? "Earlier," : e === 1 ? "Yesterday" : "Last time",
		play: "Play it again"
	},
	untilStopHint: "Until I stop ends after 2 hours with a soft fade.",
	restLine: "Time for a rest.",
	privacyLink: "Privacy notice",
	privacyTitle: "Privacy",
	privacyBack: "Back to settings",
	privacyLines: [
		"Zonked has no account, no analytics and no tracking. It sends nothing anywhere.",
		"Your answers, favorites and your own sound files stay on this device.",
		"The app makes no network calls while you use it. Only the optional Crew link talks to your own computer.",
		"To remove it all, use Forget my data in Settings. It clears your answers, notes, saved mixes, your own sounds and the offline sound cache.",
		"Zonked is made for adults and is not meant for children under 13. It collects no data about anyone.",
		"Zonked is not a medical device. See the notice you saw before your first sound."
	],
	doneCard: { addHome: "You can add Zonked to your home screen from your browser menu." },
	helped: {
		title: "What helped",
		empty: "Your answers will show here after you tell Zonked how a sound felt. They stay on this device.",
		row: (e, t, n, r) => `${e}: ${t} calmer, ${n} same, ${r} not for me`
	},
	listened: {
		today: (e) => `About ${e} minutes of sound today.`,
		rest: "You have listened for a while. A short rest for your ears may feel good."
	},
	card: {
		save: "Save a calm card",
		making: "Making your card",
		ready: "Your card is ready. It was made on this device.",
		download: "Download card",
		share: "Share card",
		failed: "The card could not be made in this browser.",
		shared: "Shared."
	},
	mix: {
		copy: "Copy mix code",
		copied: "Copied. The code holds one nature sound, the blend and the level.",
		copyFailed: "Copy did not work here. Your code is shown below.",
		none: "Pick a nature sound first, then copy its code.",
		pasteTitle: "Paste a mix code",
		pasteLabel: "Mix code",
		pasteHint: "Example: ZK1-rain-60-30",
		apply: "Use this mix",
		applied: "Mix applied."
	}
}, Ae = ["evening", "night"];
function $(e, t) {
	let n = v(e, t), r = Ae.includes(n.timeOfDay), i = (e, t) => ({
		kind: e,
		minutes: t,
		fade: !1,
		ctx: {
			...n,
			situation: "heal-stress",
			vibe: "calm",
			availableMinutes: t
		}
	});
	switch (e.goal) {
		case "study": return {
			kind: "sprint",
			minutes: 25,
			fade: !1,
			ctx: {
				...n,
				availableMinutes: 25
			}
		};
		case "sleep": return {
			kind: "winddown",
			minutes: 30,
			fade: !0,
			ctx: {
				...n,
				availableMinutes: 30
			}
		};
		case "focus": return r ? i("winddown", 15) : {
			kind: "focus",
			minutes: 25,
			fade: !1,
			ctx: n
		};
		case "calm": return i(r ? "winddown" : "calm", 15);
		case "recover": return {
			kind: "calm",
			minutes: 15,
			fade: !1,
			ctx: n
		};
		default: return {
			kind: "reset",
			minutes: 10,
			fade: !1,
			ctx: n
		};
	}
}
var je = [
	"winddown",
	"sleep",
	"focus"
];
function Me(e, t, n) {
	let r = v(e, t);
	return n === "sleep" ? {
		kind: "winddown",
		minutes: 30,
		fade: !0,
		ctx: {
			...r,
			situation: "cant-sleep",
			vibe: "dreamy",
			availableMinutes: 30
		}
	} : n === "focus" ? {
		kind: "focus",
		minutes: 25,
		fade: !1,
		ctx: {
			...r,
			situation: "deep-work",
			vibe: "bright",
			availableMinutes: 25
		}
	} : {
		kind: "winddown",
		minutes: 15,
		fade: !1,
		ctx: {
			...r,
			situation: "heal-stress",
			vibe: "calm",
			availableMinutes: 15
		}
	};
}
function Ne(e) {
	let t = e.stages.some((e) => e.noiseLevel > 0 && e.noise !== "off"), n = [.../* @__PURE__ */ new Set([...e.layerTags.filter((e) => e !== "noise"), ...t ? ["noise"] : []])].slice(0, 3).map((e) => Q.hearParts[e]);
	return `${Q.hearIntro} ${Q.hearJoin(n)}.`;
}
function Pe(e, t) {
	let n = e[e.length - 1];
	if (n === void 0 || n.a === "not") return null;
	let r = t - n.day;
	return r < 0 || r > 7 ? null : {
		id: n.id,
		a: n.a,
		daysAgo: r
	};
}
function Fe(e, t) {
	let n = Q.echo.when(t.daysAgo);
	return t.a === "same" ? Q.echo.same(n, e) : Q.echo.calmer(n, e);
}
function Ie(e) {
	let t = /* @__PURE__ */ new Map();
	for (let n of e) {
		let e = t.get(n.id) ?? {
			id: n.id,
			calmer: 0,
			same: 0,
			not: 0
		};
		e[n.a] += 1, t.set(n.id, e);
	}
	return [...t.values()].sort((e, t) => t.calmer - e.calmer || t.calmer + t.same + t.not - (e.calmer + e.same + e.not));
}
export { o as A, k as C, se as D, v as E, a as M, m as O, D as S, ce as T, Te as _, Ne as a, O as b, Q as c, De as d, Oe as f, Ce as g, ke as h, Ie as i, i as j, h as k, B as l, we as m, Fe as n, $ as o, Se as p, Pe as r, Me as s, je as t, Ee as u, A as v, he as w, P as x, j as y };
