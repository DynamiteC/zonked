import { Suspense as e, lazy as t, useCallback as n, useEffect as r, useId as i, useMemo as a, useRef as o, useState as s, useSyncExternalStore as c } from "react";
import { B as l, H as u, I as d, R as f, U as p, V as m, W as h, a as g, ct as _, d as v, ft as y, h as b, i as x, it as S, nt as C, o as w, ot as T, p as E, r as D, s as ee, ut as O, v as k, x as A, y as j, z as te } from "./chunk-crewLink-TXTH-ttS.mjs";
import { a as M, l as ne, o as N, u as P } from "./chunk-catalog-CdNrcMzw.mjs";
import { r as F, t as I } from "./chunk-RangeField-D77jQUlk.mjs";
import { t as L } from "./chunk-icons-C-FdU5cO.mjs";
import { t as R } from "./chunk-MascotView-Cmnhlpu8.mjs";
import { Fragment as z, jsx as B, jsxs as V } from "react/jsx-runtime";
import { _ as re, a as ie, c as ae, d as oe, f as se, h as ce, i as le, l as ue, n as de, o as fe, p as pe, r as me, s as he, t as ge, u as _e, v as ve, y as ye } from "./chunk-data-B5J84IqW.mjs";
import { t as be } from "./chunk-SafetyNotice-Cf8oSBFS.mjs";
import { c as xe } from "./chunk-milestones-Dwormqum.mjs";
import { n as H } from "./chunk-FormFrame-DeBPfgdj.mjs";
import { r as Se, t as Ce } from "./chunk-samples-BWg4CeGQ.mjs";
import { a as we, i as Te, n as Ee, o as De } from "./chunk-NatureScreen-BOjsvGVc.mjs";
import { n as Oe } from "./chunk-useBreath-BZ3euK4B.mjs";
import { n as ke } from "./chunk-look-C_f0p27a.mjs";
import { a as Ae, n as je, r as Me } from "./chunk-ownStore-DzrxOebU.mjs";
import { a as Ne, n as Pe, r as Fe, t as Ie } from "./chunk-favorites-BbDg4vkc.mjs";
// ../../web/src/ui/calm/CalmChrome.tsx
var Le = [
	{
		view: "today",
		label: C.nav[0],
		icon: "today"
	},
	{
		view: "library",
		label: C.nav[1],
		icon: "library"
	},
	{
		view: "crew",
		label: C.nav[2],
		icon: "crew"
	},
	{
		view: "settings",
		label: C.nav[3],
		icon: "settings"
	}
];
function Re({ view: e, onGo: t, reduced: n = !1 }) {
	let r = e === "journey" || e === "journeys" ? "today" : e === "nature" ? "library" : e === "reset" || e === "breathe" ? "today" : e;
	return /* @__PURE__ */ V("nav", {
		className: "c-tabbar",
		"aria-label": "Main",
		children: [/* @__PURE__ */ V("div", {
			className: "c-rail-brand",
			"aria-hidden": "true",
			children: [/* @__PURE__ */ B(R, {
				size: 40,
				reduced: n
			}), /* @__PURE__ */ B("span", {
				className: "c-brand",
				children: C.brand
			})]
		}), Le.map((e) => /* @__PURE__ */ V("button", {
			type: "button",
			className: "c-nav",
			"aria-current": r === e.view ? "page" : void 0,
			onClick: () => t(e.view),
			children: [/* @__PURE__ */ B(L, { name: e.icon }), /* @__PURE__ */ B("span", { children: e.label })]
		}, e.view))]
	});
}
function ze(e, t = null) {
	if (e.templateName !== null) return e.templateName;
	let n = e.source === "crew", r = n ? t ?? e.presetId : e.presetId, i = y.find((e) => e.id === r)?.name;
	return i === void 0 ? C.brand : n ? `Crew: ${i}` : i;
}
function Be({ snap: e, crewPresetId: t = null, onOpen: n, onStop: r }) {
	if (!e.playing) return null;
	let i = e.timer.kind !== "none" && e.timer.running ? F(e.timer.remainingSec) : "";
	return /* @__PURE__ */ V("div", {
		className: "c-mini",
		role: "group",
		"aria-label": "Now playing",
		children: [/* @__PURE__ */ V("button", {
			type: "button",
			className: "c-btn c-link c-mini-open",
			onClick: n,
			children: [ze(e, t), i !== "" && /* @__PURE__ */ B("span", {
				className: "c-digits",
				children: ` ${i}`
			})]
		}), /* @__PURE__ */ B("button", {
			type: "button",
			className: "c-btn c-small",
			"data-testid": "mini-stop",
			onClick: r,
			children: C.stop
		})]
	});
}
var Ve = 864e5, He = 4;
function U(e) {
	if (!Number.isFinite(e)) return 0;
	let t = new Date(e).getTimezoneOffset() * 6e4;
	return Math.floor((e - t) / Ve);
}
var W = (e) => Number.isInteger(e) && e >= 0 && e < 1e7;
function Ue(e) {
	return Number.isFinite(e) ? Math.min(7, Math.max(1, Math.floor(e))) : He;
}
function We(e) {
	return e - (e + 3) % 7;
}
function Ge(e, t, n) {
	let r = /* @__PURE__ */ new Map();
	for (let i of e) {
		if (!W(i.day) || i.day < t || i.day > n) continue;
		let e = Number.isFinite(i.minutes) && i.minutes > 0 ? i.minutes : 0;
		r.set(i.day, (r.get(i.day) ?? 0) + e);
	}
	let i = /* @__PURE__ */ new Set();
	return r.forEach((e, t) => {
		e >= 3 && i.add(t);
	}), i;
}
function Ke(e, t, n) {
	return n.has(e) ? "listened" : e === t ? "today" : e > t ? "upcoming" : "rest";
}
function qe(e, t, n = He) {
	let r = Ue(n);
	if (!W(t)) {
		let e = Object.freeze(Array.from({ length: 7 }, () => "upcoming"));
		return Object.freeze({
			daysListened: 0,
			goalDays: r,
			goalMet: !1,
			quietWeek: !0,
			dots: e
		});
	}
	let i = We(t), a = Ge(e, i, t), o = Object.freeze(Array.from({ length: 7 }, (e, n) => Ke(i + n, t, a)));
	return Object.freeze({
		daysListened: a.size,
		goalDays: r,
		goalMet: a.size >= r,
		quietWeek: a.size === 0,
		dots: o
	});
}
var Je = 400;
function Ye(e, t, i = null) {
	let c = o(null), [l, u] = s(null);
	r(() => {
		if (e.playing) {
			u(null), c.current = e.templateId === null ? null : {
				id: i?.id ?? e.templateId,
				name: i?.name ?? e.templateName ?? C.brand,
				minutes: e.elapsedSec / 60
			};
			return;
		}
		let n = c.current;
		if (c.current = null, !t || n === null || n.minutes * 60 < 60) return;
		let r = window.setTimeout(() => u({
			...n,
			minutes: Math.round(n.minutes)
		}), Je);
		return () => window.clearTimeout(r);
	}, [
		e.playing,
		e.templateId,
		e.templateName,
		e.elapsedSec,
		t,
		i?.id,
		i?.name
	]);
	let d = n(() => u(null), []);
	return a(() => ({
		card: l,
		dismiss: d
	}), [l, d]);
}
var Xe = [
	["calmer", C.feelCalmer],
	["same", C.feelSame],
	["not", C.feelNot]
];
function Ze({ onFeel: e }) {
	let [t, n] = s(!1);
	return t ? /* @__PURE__ */ B("p", {
		className: "c-muted",
		role: "status",
		"data-testid": "feel-saved",
		children: C.feelSaved
	}) : /* @__PURE__ */ V("div", {
		role: "group",
		"aria-labelledby": "c-feel-q",
		className: "c-feel",
		"data-testid": "feel-row",
		children: [/* @__PURE__ */ B("p", {
			id: "c-feel-q",
			className: "c-muted",
			children: C.feelQuestion
		}), /* @__PURE__ */ B("div", {
			className: "c-chips",
			children: Xe.map(([t, r]) => /* @__PURE__ */ B("button", {
				type: "button",
				className: "c-tchip",
				"data-testid": `feel-${t}`,
				onClick: () => {
					e(t), n(!0);
				},
				children: r
			}, t))
		})]
	});
}
function Qe({ info: e, onAgain: t, onClose: n, firstRun: i = !1, onFeel: a }) {
	let s = o(null);
	return r(() => s.current?.focus(), []), /* @__PURE__ */ B("div", {
		className: "c-overlay",
		onKeyDown: (e) => e.key === "Escape" && n(),
		children: /* @__PURE__ */ V("div", {
			className: "c-dialog c-end",
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": "c-end-title",
			"data-testid": "end-card",
			children: [
				/* @__PURE__ */ B("h2", {
					id: "c-end-title",
					className: "c-h1",
					children: C.endTitle
				}),
				/* @__PURE__ */ B("p", { children: C.endLine(e.name, e.minutes) }),
				/* @__PURE__ */ B("p", {
					className: "c-muted",
					children: C.endNote
				}),
				a !== void 0 && /* @__PURE__ */ B(Ze, { onFeel: a }),
				i && /* @__PURE__ */ B("p", {
					className: "c-note",
					"data-testid": "first-run-note",
					children: C.studioNote
				}),
				/* @__PURE__ */ V("div", {
					className: "c-actions",
					children: [/* @__PURE__ */ B("button", {
						ref: s,
						type: "button",
						className: "c-btn c-primary",
						"data-testid": "end-again",
						onClick: t,
						children: C.playAgain
					}), /* @__PURE__ */ B("button", {
						type: "button",
						className: "c-btn",
						"data-testid": "end-close",
						onClick: n,
						children: C.close
					})]
				})
			]
		})
	});
}
function $e(e) {
	if (e.kind === "sleep-fade") return 4;
	if (e.kind === "pomodoro") return 5;
	if (e.kind !== "countdown") return 3;
	let t = Math.round(e.totalSec / 60);
	return t === 15 ? 0 : t === 30 ? 1 : t === 60 ? 2 : -1;
}
function et({ timer: e, player: t, onSprint: n, onSprintEnd: r }) {
	let i = (i) => {
		if (i === 5) return e.kind === "pomodoro" ? r?.() : n?.();
		r?.(), i <= 2 ? t.startTimer({
			kind: "countdown",
			minutes: [
				15,
				30,
				60
			][i] ?? 15
		}) : i === 3 ? t.stopTimer() : t.startTimer({
			kind: "sleep-fade",
			minutes: 20
		});
	}, a = $e(e);
	return /* @__PURE__ */ B("div", { children: /* @__PURE__ */ B("div", {
		className: "c-chips",
		role: "group",
		"aria-label": "Timer",
		children: C.timerChips.map((e, t) => t === 5 && n === void 0 ? null : /* @__PURE__ */ B("button", {
			type: "button",
			"aria-pressed": a === t,
			className: "c-tchip",
			onClick: () => i(t),
			children: e
		}, e))
	}) });
}
function tt({ timer: e }) {
	return e.kind === "none" || !e.running ? null : /* @__PURE__ */ V("p", {
		className: "c-time",
		"data-testid": "time-left",
		children: [e.kind === "pomodoro" ? `${e.phase === "break" ? C.sprintBreakLeft : C.sprintFocusLeft} ` : "", F(e.remainingSec)]
	});
}
// ../../web/src/ui/calm/useCalmData.ts
var nt = 200, G = (e = Date.now) => U(e());
function rt(e, t) {
	let i = a(() => me(), []), [o, c] = s(() => ie(i)), [l, u] = s(() => fe(i)), [d, f] = s([]), [p, m] = s(0);
	return r(() => {
		let t = !0;
		return e.listLogs(nt).then((e) => t && f(e)).catch(() => void 0), () => {
			t = !1;
		};
	}, [
		e,
		p,
		t
	]), {
		storage: i,
		profile: o,
		progress: l,
		week: a(() => qe(d.map((e) => ({
			day: U(e.startedAt),
			minutes: xe(e)
		})), G()), [d]),
		logs: d,
		setProfile: n((e) => {
			c(e), ae(i, e);
		}, [i]),
		setJourney: n((e, t) => {
			u((n) => {
				let { [e]: r, ...a } = n, o = t === null ? a : {
					...a,
					[e]: t
				};
				return ue(i, o), o;
			});
		}, [i]),
		refresh: n(() => m((e) => e + 1), [])
	};
}
// ../../web/src/app/demoFeed.ts
var K = 15e3, q = 6e4, J = [
	{
		score: 22,
		level: "focus",
		beatHz: 40,
		carrierHz: 200,
		gain: .45,
		transitionSec: 5,
		why: "Simulated: a fresh start. The pretend load is low, so the sound stays steady."
	},
	{
		score: 48,
		level: "flow",
		beatHz: 18,
		carrierHz: 220,
		gain: .4,
		transitionSec: 8,
		why: "Simulated: the pretend load is building. The beat eases down to 18 Hz."
	},
	{
		score: 70,
		level: "recovery",
		beatHz: 10,
		carrierHz: 200,
		gain: .32,
		transitionSec: 8,
		why: "Simulated: the pretend load is high. The beat slows to 10 Hz and the sound softens."
	},
	{
		score: 88,
		level: "decompress",
		beatHz: 6,
		carrierHz: 180,
		gain: .25,
		transitionSec: 8,
		why: "Simulated: burned out. The beat settles to 6 Hz and the sound goes quiet."
	}
];
function it(e, t) {
	let n = J[Math.min(Math.max(0, Math.trunc(e)), J.length - 1)];
	return n === void 0 ? null : {
		version: 1,
		at: t,
		burnout: {
			score: n.score,
			level: n.level
		},
		target: {
			presetId: "burnout-reset",
			beatHz: n.beatHz,
			carrierHz: n.carrierHz,
			gain: n.gain,
			transitionSec: n.transitionSec,
			breathe: n.score >= 60
		},
		sbg: null,
		why: n.why
	};
}
function at(e, t) {
	return d(JSON.parse(JSON.stringify(it(e, t))));
}
var ot = {
	now: () => Date.now(),
	setTimer: (e, t) => setTimeout(e, t),
	clearTimer: (e) => clearTimeout(e)
}, Y = [], st = ot;
function X() {
	for (let e of Y) st.clearTimer(e);
	Y = [];
}
function ct(e, t, n, r) {
	let i = r.now(), a = at(t, Math.trunc(i / 1e3));
	if (a === null) return;
	let o = t >= J.length - 1;
	u({
		state: a,
		source: "demo",
		changedAtMs: i,
		snoozeUntilMs: 0,
		demoNextAtMs: n + (o ? q : (t + 1) * K)
	}), e.applyCrew(a), e.followCrew();
}
function lt(e) {
	X(), u({
		state: null,
		source: "none",
		changedAtMs: 0,
		snoozeUntilMs: 0,
		demoNextAtMs: null
	}), e.crewLost();
}
function ut(e, t = ot) {
	X(), st = t;
	let n = t.now();
	ct(e, 0, n, t), e.snapshot().playing || e.play();
	for (let r = 1; r < J.length; r += 1) Y.push(t.setTimer(() => ct(e, r, n, t), r * K));
	Y.push(t.setTimer(() => lt(e), q));
}
// ../../web/src/ui/calm/WeekDots.tsx
var dt = [
	"Mon",
	"Tue",
	"Wed",
	"Thu",
	"Fri",
	"Sat",
	"Sun"
], ft = [
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
	"Sunday"
], pt = {
	listened: "listened",
	rest: "rest day",
	today: "today",
	upcoming: "coming up"
};
function mt(e, t = !0, n = !1) {
	return e.quietWeek && n && !t ? C.joinedLine : e.quietWeek ? t ? C.welcomeBack : C.firstWeek : `${C.weekOf(e.daysListened)}. ${C.restCount}`;
}
function ht({ week: e, hasHistory: t = !0, joinedToday: n = !1, compact: r = !1 }) {
	let i = n && !t && e.quietWeek;
	return /* @__PURE__ */ V("div", {
		className: r ? "c-week c-week-compact" : "c-week",
		children: [/* @__PURE__ */ B("ul", {
			className: "c-dots",
			"aria-label": "This week",
			children: e.dots.map((e, t) => {
				let n = i && e === "today";
				return /* @__PURE__ */ V("li", {
					className: `c-dot c-dot-${e}${n ? " c-dot-joined" : ""}`,
					"data-state": e,
					children: [
						/* @__PURE__ */ B("span", {
							className: "c-mark",
							"aria-hidden": "true",
							children: n || e === "listened" ? /* @__PURE__ */ B(L, {
								name: "check",
								size: 16
							}) : ""
						}),
						/* @__PURE__ */ B("span", {
							className: "c-dayname",
							"aria-hidden": "true",
							children: dt[t]
						}),
						/* @__PURE__ */ B("span", {
							className: "c-sr",
							children: `${ft[t]}, ${n ? C.joinedToday : pt[e]}`
						})
					]
				}, ft[t]);
			})
		}), /* @__PURE__ */ B("p", {
			className: "c-muted",
			"data-testid": r ? void 0 : "week-text",
			children: mt(e, t, i)
		})]
	});
}
// ../../web/src/ui/calm/Today.tsx
var gt = () => /* @__PURE__ */ new Date(), _t = [], vt = ["focus", "study"];
function yt({ profile: e, week: t, reduced: n, crewConnected: r, hasHistory: i = !0, joinedToday: o = !1, now: c = gt, last: l = null, feel: u = _t, onSprint: d, onPlay: f, onGo: p, onReset: m, onBreathe: h, onGuide: g }) {
	let [v, y] = s(0), b = a(() => {
		let t = ve(e, c());
		return pe(ye(t, e.device, 5), u.length === 0 ? [] : ye(t, e.device, 12), u);
	}, [
		e,
		c,
		u
	]), x = b[v % Math.max(1, b.length)];
	return /* @__PURE__ */ V("div", {
		className: "c-today",
		children: [
			/* @__PURE__ */ V("header", {
				className: "c-pagehead",
				children: [/* @__PURE__ */ B(R, {
					size: 72,
					reduced: n
				}), /* @__PURE__ */ B("h1", {
					className: "c-greet",
					"data-testid": "greeting",
					children: O(c().getHours())
				})]
			}),
			l !== null && l.id !== x?.template.id && /* @__PURE__ */ B("button", {
				type: "button",
				className: "c-btn c-wide c-again",
				"data-testid": "play-again",
				onClick: () => f(l),
				children: `${C.playAgain}: ${l.name}`
			}),
			x !== void 0 && /* @__PURE__ */ V("section", {
				className: "c-daily",
				"aria-labelledby": "c-daily-h",
				children: [
					/* @__PURE__ */ B("p", {
						className: "c-eyebrow",
						children: C.dailyEyebrow
					}),
					/* @__PURE__ */ B("h2", {
						id: "c-daily-h",
						children: x.template.name
					}),
					/* @__PURE__ */ B("p", {
						className: "c-muted",
						children: `${x.template.recommendedMinutes} min. ${_(x.reasons[0] ?? C.suggested)}`
					}),
					/* @__PURE__ */ B(H, {
						left: {
							label: C.notThisOne,
							onClick: () => y((e) => e + 1)
						},
						next: {
							label: C.start,
							onClick: () => f(x.template),
							testid: "today-play"
						}
					})
				]
			}),
			d !== void 0 && x !== void 0 && vt.includes(e.goal) && /* @__PURE__ */ V("button", {
				type: "button",
				className: "c-link-card c-sprint-entry",
				"data-testid": "today-sprint",
				onClick: () => d(x.template),
				children: [/* @__PURE__ */ B("b", { children: C.sprintTitle }), /* @__PURE__ */ B("small", { children: C.sprintLine })]
			}),
			/* @__PURE__ */ V("button", {
				type: "button",
				className: "c-link-card c-reset-entry",
				"data-testid": "today-reset",
				onClick: m,
				children: [/* @__PURE__ */ B("b", { children: C.resetEntry }), /* @__PURE__ */ B("small", { children: C.resetEntryHint })]
			}),
			h !== void 0 && e.goal === "calm" && /* @__PURE__ */ V("button", {
				type: "button",
				className: "c-link-card c-breathe-entry",
				"data-testid": "today-breathe",
				onClick: h,
				children: [/* @__PURE__ */ B("b", { children: C.breatheEntry }), /* @__PURE__ */ B("small", { children: C.breatheEntryHint })]
			}),
			/* @__PURE__ */ V("section", {
				"aria-labelledby": "c-goal-h",
				children: [/* @__PURE__ */ B("h2", {
					id: "c-goal-h",
					className: "c-h3",
					children: `Your goal: ${T[e.goal]}`
				}), /* @__PURE__ */ B(ht, {
					week: t,
					hasHistory: i,
					joinedToday: o
				})]
			}),
			/* @__PURE__ */ V("section", {
				"aria-labelledby": "c-for-h",
				children: [/* @__PURE__ */ B("h2", {
					id: "c-for-h",
					className: "c-h3",
					children: C.forYou
				}), /* @__PURE__ */ B("ul", {
					className: "c-rows",
					children: b.slice(0, 3).map((e) => /* @__PURE__ */ B("li", { children: /* @__PURE__ */ V("button", {
						type: "button",
						className: "c-mini-card",
						onClick: () => f(e.template),
						children: [
							/* @__PURE__ */ B("b", { children: e.template.name }),
							/* @__PURE__ */ B("small", { children: _(e.reasons[0] ?? C.suggested) }),
							/* @__PURE__ */ B("em", { children: `${e.template.recommendedMinutes} min` })
						]
					}) }, e.template.id))
				})]
			}),
			/* @__PURE__ */ B("button", {
				type: "button",
				className: "c-link-card",
				onClick: () => p("library"),
				children: /* @__PURE__ */ B("b", { children: "Browse all sounds" })
			}),
			/* @__PURE__ */ B("button", {
				type: "button",
				className: "c-link-card",
				onClick: () => p("journeys"),
				children: /* @__PURE__ */ B("b", { children: C.journeysTitle })
			}),
			g !== void 0 && /* @__PURE__ */ B("button", {
				type: "button",
				className: "c-btn c-ghost c-guide-link",
				"data-testid": "today-guide",
				onClick: g,
				children: C.guideLink
			}),
			r && /* @__PURE__ */ B("p", {
				className: "c-crew-chip",
				role: "status",
				children: "Crew connected: easing the sound"
			})
		]
	});
}
// ../../web/src/ui/calm/breathe.ts
var bt = "calm-breathe-5", Z = {
	atMin: 0,
	beatHz: .5,
	carrierHz: 20,
	gain: .32,
	mode: "binaural",
	noise: "pink",
	noiseLevel: .45,
	beatLevel: 0,
	ramp: !1
}, xt = {
	id: bt,
	name: "Breathe, 5 minutes",
	category: "meditation",
	vibe: "calm",
	tags: ["breathing", "no-beat"],
	layerTags: ne([Z]),
	situations: ["meditate", "quick-reset"],
	recommendedMinutes: 5,
	intensity: 1,
	adhdFriendly: P([Z], 1),
	stages: [Z],
	reasonTemplate: "Soft pink noise, paced 4 seconds in and 4 seconds out.",
	source: "original",
	breath: {
		inSec: 4,
		outSec: 4
	}
}, St = t(() => import("./chunk-advanced-C2eFfoNq.mjs").then((e) => ({ default: e.AdvancedPanels }))), Ct = [
	{
		value: 0,
		label: "More beats"
	},
	{
		value: .5,
		label: "Even"
	},
	{
		value: 1,
		label: "More nature"
	}
];
function wt(e) {
	return e < .4 ? "More beats" : e > .6 ? "More nature" : "Even";
}
function Tt({ player: t, snap: n, nature: i, favorite: a, evidence: c, onFavorite: l, onClose: u, sprint: d, engine: f, device: p = "wired", advancedOpen: m = !1 }) {
	let h = o(null), [g, _] = s(!1), [v, y] = s(m);
	r(() => h.current?.querySelector("button")?.focus(), []);
	let b = (e) => {
		if (e.key === "Escape") e.stopPropagation(), u();
		else if (e.key === "Tab") {
			let t = Array.from(h.current?.querySelectorAll("button:not([disabled]), input, select") ?? []), n = t[0], r = t[t.length - 1];
			e.shiftKey && document.activeElement === n ? (e.preventDefault(), r?.focus()) : !e.shiftKey && document.activeElement === r && (e.preventDefault(), n?.focus());
		}
	}, x = re(Ce(), p);
	return /* @__PURE__ */ B("div", {
		className: "c-overlay c-sheet-wrap",
		onClick: u,
		children: /* @__PURE__ */ V("div", {
			ref: h,
			className: "c-opts",
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": "c-opts-title",
			"data-testid": "options-sheet",
			onKeyDown: b,
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ V("div", {
					className: "c-opts-head",
					children: [/* @__PURE__ */ B("h2", {
						id: "c-opts-title",
						children: C.optionsTitle
					}), /* @__PURE__ */ B("button", {
						type: "button",
						className: "c-btn c-ghost",
						onClick: u,
						children: C.optionsClose
					})]
				}),
				/* @__PURE__ */ V("section", {
					"aria-labelledby": "c-o-timer",
					children: [/* @__PURE__ */ B("h3", {
						id: "c-o-timer",
						className: "c-o-h",
						children: C.optTimer
					}), /* @__PURE__ */ B(et, {
						timer: n.timer,
						player: t,
						...d === void 0 ? {} : {
							onSprint: d.onSprint,
							onSprintEnd: d.onSprintEnd
						}
					})]
				}),
				/* @__PURE__ */ V("section", {
					"aria-labelledby": "c-o-nature",
					children: [
						/* @__PURE__ */ B("h3", {
							id: "c-o-nature",
							className: "c-o-h",
							children: C.optNature
						}),
						/* @__PURE__ */ V("div", {
							className: "c-chips c-left c-nature-row",
							role: "group",
							"aria-label": C.optNature,
							children: [/* @__PURE__ */ B("button", {
								type: "button",
								className: "c-tchip",
								"aria-pressed": i.on === null,
								"data-testid": "sheet-nature-none",
								onClick: i.stop,
								children: C.natureNone
							}), x.map((e) => /* @__PURE__ */ B("button", {
								type: "button",
								className: "c-tchip",
								"aria-pressed": i.on === e.id,
								"data-testid": `sheet-nature-${e.id}`,
								onClick: () => i.on === e.id ? i.stop() : i.start(e.id),
								children: e.label
							}, e.id))]
						}),
						/* @__PURE__ */ V("div", {
							className: "c-slider c-blend",
							children: [/* @__PURE__ */ B("label", {
								htmlFor: "c-blend",
								children: C.natureBlend
							}), /* @__PURE__ */ B(I, {
								id: "c-blend",
								min: 0,
								max: 1,
								step: .05,
								value: i.prefs.blend,
								valueText: wt(i.prefs.blend),
								bubbleText: wt(i.prefs.blend),
								ticks: Ct,
								onChange: i.setBlend
							})]
						}),
						i.on !== null && /* @__PURE__ */ B(Ee, {
							id: "c-nlevel",
							label: C.natureLevel,
							value: i.prefs.level,
							max: .85,
							onChange: i.setLevel
						}),
						/* @__PURE__ */ B("p", {
							className: "c-status",
							role: "status",
							children: i.message
						})
					]
				}),
				/* @__PURE__ */ V("section", {
					"aria-labelledby": "c-o-more",
					children: [
						/* @__PURE__ */ B("h3", {
							id: "c-o-more",
							className: "c-o-h",
							children: C.optMore
						}),
						/* @__PURE__ */ V("div", {
							className: "c-chips c-left",
							children: [/* @__PURE__ */ B("button", {
								type: "button",
								className: "c-tchip",
								"aria-pressed": a,
								"data-testid": "sheet-favorite",
								onClick: l,
								children: a ? C.saved : C.favorite
							}), /* @__PURE__ */ B("button", {
								type: "button",
								className: "c-tchip",
								"aria-expanded": g,
								"aria-controls": "c-why-box",
								onClick: () => _((e) => !e),
								children: C.whyTitle
							})]
						}),
						/* @__PURE__ */ V("div", {
							id: "c-why-box",
							hidden: !g,
							children: [/* @__PURE__ */ B("p", { children: C.whyBody }), /* @__PURE__ */ B("p", { children: `Evidence: ${c}. ${S[c] ?? ""}` })]
						}),
						/* @__PURE__ */ B("p", {
							className: "c-muted",
							children: C.volumeCapped
						}),
						p === "bluetooth" && /* @__PURE__ */ B("p", {
							className: "c-muted",
							"data-testid": "bt-tip",
							children: C.btTip
						})
					]
				}),
				/* @__PURE__ */ V("section", {
					"aria-labelledby": "c-o-adv",
					children: [/* @__PURE__ */ B("h3", {
						id: "c-o-adv",
						className: "c-o-h",
						children: /* @__PURE__ */ B("button", {
							type: "button",
							className: "c-btn c-ghost c-adv-btn",
							"data-testid": "options-advanced",
							"aria-expanded": v,
							"aria-controls": "c-adv-box",
							onClick: () => y((e) => !e),
							children: C.optAdvanced
						})
					}), /* @__PURE__ */ B("div", {
						id: "c-adv-box",
						hidden: !v,
						children: v && /* @__PURE__ */ B(e, {
							fallback: /* @__PURE__ */ B("p", {
								className: "c-muted",
								role: "status",
								children: C.loading
							}),
							children: /* @__PURE__ */ B(St, {
								engine: f,
								player: t,
								onClose: () => y(!1)
							})
						})
					})]
				})
			]
		})
	});
}
// ../../web/src/ui/calm/BreathLive.tsx
var Et = {
	label: "Breathe in",
	count: 4
};
function Dt(e) {
	let [t, n] = s(0);
	if (r(() => {
		if (n(0), !e) return;
		let t = window.setInterval(() => n((e) => e + 1), 1e3);
		return () => window.clearInterval(t);
	}, [e]), !e) return Et;
	let i = t % 8;
	return {
		label: i < 4 ? "Breathe in" : "Breathe out",
		count: 4 - i % 4
	};
}
var Ot = (e) => e.label === "Breathe in" ? C.counterIn(e.count) : C.counterOut(e.count);
function kt({ label: e, on: t, announce: n }) {
	return /* @__PURE__ */ B("p", {
		className: "c-sr",
		role: "status",
		"aria-live": "polite",
		"data-testid": "breath-live",
		children: t && n ? e : ""
	});
}
// ../../web/src/ui/calm/playerScene.ts
var At = ["cant-sleep", "lucid-dream"], jt = [
	"adhd-focus",
	"deep-work",
	"ai-burnout"
];
function Mt(e, t) {
	if (t) return "nature";
	let n = (e === null ? void 0 : M().find((t) => t.id === e))?.situations ?? [];
	return n.some((e) => At.includes(e)) ? "sleep" : n.some((e) => jt.includes(e)) ? "focus" : "calm";
}
var Nt = 400;
function Pt(e, t) {
	let [n, i] = s(0);
	return r(() => {
		if (!t) {
			i(0);
			return;
		}
		let n = !0, r = window.setInterval(() => {
			e.getStats().then((e) => {
				let t = Number.isFinite(e.rms) ? Math.min(1, Math.max(0, e.rms * 4)) : 0;
				n && i((e) => e * .6 + t * .4);
			}).catch(() => void 0);
		}, Nt);
		return () => {
			n = !1, window.clearInterval(r);
		};
	}, [e, t]), n;
}
// ../../web/src/ui/calm/PlayerScreen.tsx
var Ft = /* @__PURE__ */ Se({ PlayerScreen: () => Bt }), It = t(() => import("./chunk-mascot-BpzGguPW.mjs").then((e) => ({ default: e.CalmMascot }))), Lt = t(() => import("./chunk-visuals-BqbfvuFC.mjs").then((e) => ({ default: e.SceneLoop }))), Rt = t(() => import("./chunk-mascot-BpzGguPW.mjs").then((e) => ({ default: e.BreathCue })));
function zt({ still: t, playing: n, situation: r, theme: i, level: a, announce: o = !0 }) {
	let s = Oe(n && !t), c = Dt(n && t), l = n && !t;
	return /* @__PURE__ */ V(z, { children: [/* @__PURE__ */ B("div", {
		className: "c-stage",
		"data-testid": "breath-ring",
		"data-still": t ? "true" : "false",
		"data-situation": r,
		children: /* @__PURE__ */ V(e, {
			fallback: null,
			children: [/* @__PURE__ */ B("div", {
				className: "c-stage-scene",
				children: /* @__PURE__ */ B(Lt, {
					situation: r,
					reducedMotion: t,
					theme: i
				})
			}), /* @__PURE__ */ B("div", {
				className: "c-stage-mascot",
				children: /* @__PURE__ */ B(It, {
					mood: n ? "breathing" : "idle",
					size: 190,
					reducedMotion: t,
					situation: r,
					breathPhase: l ? s.phase : void 0,
					level: n ? a : 0
				})
			})]
		})
	}), /* @__PURE__ */ V("div", {
		className: "c-cue",
		children: [l ? /* @__PURE__ */ B(e, {
			fallback: null,
			children: /* @__PURE__ */ B(Rt, {
				label: s.label,
				className: "c-cue-text",
				live: !1
			})
		}) : n ? /* @__PURE__ */ B("p", {
			className: "c-cue-text",
			"data-testid": "breath-counter",
			children: Ot(c)
		}) : /* @__PURE__ */ B("p", {
			className: "c-cue-text",
			children: C.breathe
		}), /* @__PURE__ */ B(kt, {
			label: l ? s.label : c.label,
			on: n,
			announce: o
		})]
	})] });
}
function Bt({ engine: e, device: t, theme: n, announce: i = !0, sprint: a, openAdvanced: c = !1, onAdvancedShown: l, player: u, snap: d, still: f, favorite: p, onToggle: m, onFavorite: h, nature: g }) {
	let [_, v] = s(c), [y, b] = s(c);
	r(() => {
		c && (v(!0), b(!0), l?.());
	}, [c, l]);
	let x = o(null), S = () => {
		v(!1), b(!1), x.current?.focus();
	}, w = Pt(e, d.playing), T = N.find((e) => e.templateId === d.templateId)?.evidence ?? "mixed", E = Mt(a?.focus?.id ?? d.templateId, g.on !== null), D = M().find((e) => e.id === (a?.focus?.id ?? d.templateId));
	return /* @__PURE__ */ V("div", {
		className: "c-player",
		children: [
			/* @__PURE__ */ B("h1", {
				className: "c-h1",
				children: d.templateName ?? C.brand
			}),
			/* @__PURE__ */ B(zt, {
				still: f,
				playing: d.playing,
				situation: E,
				theme: n,
				level: w,
				announce: i
			}),
			/* @__PURE__ */ B(tt, { timer: d.timer }),
			/* @__PURE__ */ B("div", {
				className: "c-controls",
				children: /* @__PURE__ */ B("button", {
					type: "button",
					className: "c-btn c-primary c-big c-round",
					"data-testid": "player-toggle",
					onClick: m,
					children: d.playing ? C.stop : C.play
				})
			}),
			/* @__PURE__ */ B("button", {
				ref: x,
				type: "button",
				className: "c-btn c-ghost c-options-btn",
				"data-testid": "player-options",
				"aria-haspopup": "dialog",
				onClick: () => v(!0),
				children: C.optionsBtn
			}),
			_ && /* @__PURE__ */ B(Tt, {
				player: u,
				snap: d,
				nature: g,
				favorite: p,
				evidence: T,
				onFavorite: h,
				onClose: S,
				engine: e,
				...t === void 0 ? {} : { device: t },
				advancedOpen: y,
				...a !== void 0 && D !== void 0 ? { sprint: {
					onSprint: () => a.start(D),
					onSprintEnd: a.cancel
				} } : {}
			})
		]
	});
}
var Vt = "android-wakeful-relax-5", Ht = {
	kind: "reset",
	seconds: 90,
	template: () => M().find((e) => e.id === Vt),
	title: C.resetTitle,
	intro: C.resetIntro,
	done: C.resetDoneLine,
	again: C.resetAgain,
	left: C.resetLeft
}, Ut = {
	kind: "breathe",
	seconds: 300,
	template: () => xt,
	title: C.breatheTitle,
	intro: C.breatheIntro,
	done: C.breatheDoneLine,
	again: C.breatheAgain,
	left: C.breatheLeft
};
function Wt(e, t = Ht) {
	let [i, a] = s("idle"), [c, l] = s(t.seconds), u = o(0), { player: d, guarded: f, playTemplate: p } = e, m = n(() => {
		let e = t.template();
		e !== void 0 && f(() => {
			u.current = Date.now() + t.seconds * 1e3, l(t.seconds), a("running"), p(e, null);
		});
	}, [
		f,
		p,
		t
	]), h = n(() => {
		a("idle"), d.stop();
	}, [d]);
	r(() => {
		if (i !== "running") return;
		let e = window.setInterval(() => {
			let t = Math.ceil((u.current - Date.now()) / 1e3);
			if (t > 0) return l(t);
			window.clearInterval(e), l(0), a("done"), d.stop();
		}, 1e3);
		return () => window.clearInterval(e);
	}, [i, d]);
	let g = o(!1), _ = e.snap.playing;
	r(() => {
		i === "running" ? _ ? g.current = !0 : g.current && a("idle") : g.current = !1;
	}, [i, _]);
	let v = o(i);
	return v.current = i, r(() => () => void (v.current === "running" && d.stop()), [d]), {
		phase: i,
		left: c,
		begin: m,
		stop: h
	};
}
function Gt({ s: e, still: t, theme: n, announce: r, onBack: i, plan: a = Ht }) {
	let o = Wt(e, a), s = Pt(e.engine, e.snap.playing), c = Mt(e.snap.templateId, !1);
	return o.phase === "done" ? /* @__PURE__ */ B(Kt, {
		plan: a,
		onAgain: o.begin,
		onBack: i
	}) : /* @__PURE__ */ V("div", {
		className: "c-player c-reset",
		"data-testid": "reset-screen",
		"data-kind": a.kind,
		"data-phase": o.phase,
		children: [
			/* @__PURE__ */ B("h1", {
				className: "c-h1",
				children: a.title
			}),
			o.phase === "idle" && /* @__PURE__ */ B("p", {
				className: "c-lead",
				children: a.intro
			}),
			/* @__PURE__ */ B(zt, {
				still: t,
				playing: o.phase === "running" && e.snap.playing,
				situation: c,
				theme: n,
				level: s,
				announce: r
			}),
			o.phase === "running" ? /* @__PURE__ */ V(z, { children: [/* @__PURE__ */ B("p", {
				className: "c-muted c-digits",
				"data-testid": "reset-left",
				"aria-hidden": "true",
				children: a.left(o.left)
			}), /* @__PURE__ */ B("div", {
				className: "c-controls",
				children: /* @__PURE__ */ B("button", {
					type: "button",
					className: "c-btn c-round c-big",
					"data-testid": "reset-stop",
					onClick: o.stop,
					children: C.stop
				})
			})] }) : /* @__PURE__ */ V("div", {
				className: "c-actions",
				children: [/* @__PURE__ */ B("button", {
					type: "button",
					className: "c-btn c-primary",
					"data-testid": "reset-begin",
					onClick: o.begin,
					children: C.resetStart
				}), /* @__PURE__ */ B("button", {
					type: "button",
					className: "c-btn c-link",
					onClick: i,
					children: C.resetBack
				})]
			}),
			/* @__PURE__ */ B("p", {
				className: "c-muted",
				children: C.volumeCapped
			})
		]
	});
}
function Kt({ plan: e, onAgain: t, onBack: n }) {
	let i = o(null);
	return r(() => i.current?.focus(), []), /* @__PURE__ */ V("div", {
		className: "c-end c-reset",
		"data-testid": "reset-end",
		children: [
			/* @__PURE__ */ B("h1", {
				className: "c-h1",
				children: C.endTitle
			}),
			/* @__PURE__ */ B("p", { children: e.done }),
			/* @__PURE__ */ B("p", {
				className: "c-muted",
				children: C.endNote
			}),
			/* @__PURE__ */ V("div", {
				className: "c-actions",
				children: [/* @__PURE__ */ B("button", {
					ref: i,
					type: "button",
					className: "c-btn c-primary",
					"data-testid": "reset-back",
					onClick: n,
					children: C.resetBack
				}), /* @__PURE__ */ B("button", {
					type: "button",
					className: "c-btn",
					"data-testid": "reset-again",
					onClick: t,
					children: e.again
				})]
			})
		]
	});
}
// ../../web/src/ui/calm/CalmScreens.tsx
var qt = t(() => import("./chunk-Journeys-CLSqniA0.mjs").then((e) => ({ default: e.JourneyList }))), Jt = t(() => import("./chunk-Journeys-CLSqniA0.mjs").then((e) => ({ default: e.JourneyDetail }))), Yt = t(() => import("./chunk-Library-BkTIQgr8.mjs").then((e) => ({ default: e.Library }))), Xt = t(() => Promise.resolve().then(() => Ft).then((e) => ({ default: e.PlayerScreen }))), Zt = t(() => import("./chunk-CrewScreen-B6cie4_r.mjs").then((e) => ({ default: e.CrewScreen }))), Qt = t(() => import("./chunk-NatureScreen-BOjsvGVc.mjs").then((e) => e.t).then((e) => ({ default: e.NatureScreen }))), $t = t(() => import("./chunk-SettingsScreen-Bu00vMz0.mjs").then((e) => ({ default: e.SettingsScreen })));
function en({ view: e, journeyId: t, s: n, data: r, crewInfo: i, nature: a, still: o, fav: s, last: c, look: l, prefs: u, onPrefs: d, feel: f, sprint: h, handlers: g }) {
	switch (e) {
		case "journeys": return /* @__PURE__ */ B(qt, {
			progress: r.progress,
			onOpen: g.openJourney,
			reduced: o
		});
		case "journey": return /* @__PURE__ */ B(Jt, {
			id: t ?? "",
			profile: r.profile,
			progress: r.progress,
			todayDay: G(),
			onBack: () => g.go("journeys"),
			onStartJourney: r.setJourney,
			onRestart: (e) => r.setJourney(e, null),
			onPlayDay: g.playDay
		});
		case "library": return /* @__PURE__ */ B(Yt, {
			store: n.store,
			logs: r.logs,
			reduced: o,
			onNature: () => g.go("nature"),
			onPlay: g.play,
			onPlayMix: g.onMix,
			onBreathe: () => g.go("breathe")
		});
		case "nature": return /* @__PURE__ */ B(Qt, {
			nature: a,
			device: r.profile.device,
			reduced: o,
			onBack: () => g.go("library")
		});
		case "player": return /* @__PURE__ */ B(Xt, {
			player: n.player,
			snap: n.snap,
			still: o,
			favorite: s.on,
			onToggle: n.toggle,
			onFavorite: s.toggle,
			nature: a,
			engine: n.engine,
			device: r.profile.device,
			theme: l.theme,
			announce: u.announce,
			sprint: h,
			openAdvanced: g.advancedPending,
			onAdvancedShown: g.advancedShown
		});
		case "reset": return /* @__PURE__ */ B(Gt, {
			s: n,
			still: o,
			theme: l.theme,
			announce: u.announce,
			onBack: () => g.go("today")
		});
		case "breathe": return /* @__PURE__ */ B(Gt, {
			s: n,
			still: o,
			theme: l.theme,
			announce: u.announce,
			onBack: () => g.go("today"),
			plan: Ut
		});
		case "crew": return /* @__PURE__ */ B(Zt, {
			crew: i,
			overridden: n.snap.overridden,
			onDemo: () => n.guarded(() => ut(n.player)),
			onStopDemo: () => lt(n.player),
			onNotNow: () => p(n.player),
			onResume: () => m(n.player),
			onFollow: () => n.player.followCrew()
		});
		case "settings": return /* @__PURE__ */ B($t, {
			gentle: r.profile.extraGentle,
			reduceMotion: n.userReduced,
			reduced: o,
			device: r.profile.device,
			onDevice: (e) => r.setProfile({
				...r.profile,
				device: e
			}),
			onGentle: (e) => r.setProfile({
				...r.profile,
				extraGentle: e
			}),
			onReduceMotion: n.setReduced,
			onStudio: g.onStudio,
			onForget: g.forget,
			prefs: u,
			onPrefs: d,
			onGuide: g.openGuide
		});
		default: return /* @__PURE__ */ B(yt, {
			profile: r.profile,
			week: r.week,
			progress: r.progress,
			reduced: o,
			hasHistory: r.logs.some((e) => U(e.startedAt) < G()),
			joinedToday: U(r.profile.createdAt) === G(),
			crewConnected: i.enabled && i.status === "connected",
			last: c,
			feel: f,
			onSprint: (e) => {
				h.start(e), g.go("player");
			},
			onPlay: g.play,
			onOpenJourney: g.openJourney,
			onGo: g.go,
			onReset: () => g.go("reset"),
			onBreathe: () => g.go("breathe"),
			onGuide: g.openGuide
		});
	}
}
// ../../web/src/ui/calm/nature/active.ts
var Q = null, tn = () => Q, nn = (e) => void (Q = e);
function rn() {
	Q !== null && (Q = null, import("./chunk-samples-BWg4CeGQ.mjs").then((e) => e.n).then((e) => e.stopSample()).catch(() => void 0));
}
// ../../web/src/ui/calm/nature/useNature.ts
var $ = () => import("./chunk-samples-BWg4CeGQ.mjs").then((e) => e.n);
async function an(e, t) {
	let n = await $();
	if (!Me(e)) return n.startSample(e, t);
	let r = await je(e);
	return r.ok ? n.startOwn(e, r.value, t) : {
		ok: !1,
		error: r.error
	};
}
function on(e) {
	let [t, i] = s(we), [a, c] = s(tn), [l, u] = s(""), d = o(t);
	d.current = t;
	let { player: f, guarded: p } = e;
	r(() => {
		e.snap.playing || (rn(), c(null));
	}, [e.snap.playing]);
	let m = n(async (e) => {
		if (u(""), f.snapshot().playing || await f.play(), !f.snapshot().playing) return void u(C.errorAudio);
		(await $()).setBlend(d.current.blend);
		let t = await an(e, d.current.level);
		if (!t.ok) return void u(t.error);
		t.note !== void 0 && u(t.note), nn(e), c(e);
		let n = {
			...d.current,
			id: e
		};
		i(n), De(n);
	}, [f]), h = n((e) => p(() => void m(e)), [p, m]), g = n(() => {
		nn(null), c(null), $().then((e) => e.stopSample());
	}, []), _ = n((e, t) => {
		let n = {
			...d.current,
			...e
		};
		i(n), De(n), tn() !== null && $().then(t);
	}, []);
	return {
		prefs: t,
		on: a,
		message: l,
		start: h,
		stop: g,
		setBlend: n((e) => _({ blend: e }, (t) => t.setBlend(e)), [_]),
		setLevel: n((e) => _({ level: e }, (t) => t.setSampleLevel(e)), [_])
	};
}
// ../../web/src/ui/calm/nature/forget.ts
async function sn() {
	Te(), await Ae();
}
// src/engine/useSession.ts
function cn() {
	let { player: e, store: t, engine: i } = v(), [a, c] = s(() => e.snapshot()), [l, u] = s(E), [d, f] = s(!1), [p, m, h] = k(), g = o(null), _ = o(l);
	r(() => (c(e.snapshot()), e.subscribe(c)), [e]);
	let y = n((e) => {
		_.current ? e() : (g.current = e, f(!0));
	}, []);
	return {
		engine: i,
		player: e,
		store: t,
		snap: a,
		accepted: l,
		gate: d,
		reduced: p,
		setReduced: m,
		userReduced: h,
		guarded: y,
		accept: n(() => {
			A(j, !0), _.current = !0, u(!0), f(!1);
			let e = g.current;
			g.current = null, e?.();
		}, []),
		cancelGate: n(() => {
			g.current = null, f(!1);
		}, []),
		playTemplate: n((t, n) => y(() => {
			e.setQueue([t]), e.playTemplate(t).then((t) => {
				t && n !== null && e.startTimer(typeof n == "number" ? {
					kind: "countdown",
					minutes: n
				} : n);
			});
		}), [e, y]),
		toggle: n(() => {
			e.snapshot().playing ? e.stop() : y(() => void e.play());
		}, [e, y])
	};
}
// ../../web/src/ui/calm/Guide.tsx
var ln = "zonked.guide.v1", un = (e) => {
	try {
		return e.get(ln) === "1";
	} catch {
		return !1;
	}
}, dn = (e) => {
	try {
		e.set(ln, "1");
	} catch {}
};
function fn({ reduced: e, onClose: t, onCrew: n }) {
	let [i, a] = s(0), c = o(null);
	r(() => c.current?.querySelector("h2")?.focus(), [i]);
	let l = C.guideCards[i] ?? C.guideCards[0], u = i === C.guideCards.length - 1;
	return /* @__PURE__ */ B("div", {
		className: "c-overlay",
		children: /* @__PURE__ */ V("div", {
			ref: c,
			className: "c-dialog c-guide",
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": "c-guide-title",
			"data-testid": "guide",
			onKeyDown: (e) => {
				if (e.key === "Escape") e.stopPropagation(), t();
				else if (e.key === "Tab") {
					let t = Array.from(c.current?.querySelectorAll("button") ?? []), n = document.activeElement;
					e.shiftKey && (n === t[0] || n === c.current?.querySelector("h2")) ? (e.preventDefault(), t[t.length - 1]?.focus()) : !e.shiftKey && n === t[t.length - 1] && (e.preventDefault(), t[0]?.focus());
				}
			},
			children: [
				/* @__PURE__ */ V("div", {
					className: "c-fhead",
					children: [/* @__PURE__ */ B(R, {
						size: 72,
						mood: "happy",
						reduced: e
					}), /* @__PURE__ */ V("div", {
						className: "c-fhead-text",
						children: [/* @__PURE__ */ B("p", {
							className: "c-step",
							children: C.guideStep(i + 1)
						}), /* @__PURE__ */ B("div", {
							className: "c-bar",
							"aria-hidden": "true",
							children: C.guideCards.map((e, t) => /* @__PURE__ */ B("i", { "data-on": t <= i ? "true" : "false" }, e.title))
						})]
					})]
				}),
				/* @__PURE__ */ B("h2", {
					id: "c-guide-title",
					className: "c-ftitle",
					tabIndex: -1,
					children: l?.title
				}),
				/* @__PURE__ */ B("p", {
					className: "c-helper",
					children: l?.body
				}),
				i === 2 && /* @__PURE__ */ B("button", {
					type: "button",
					className: "c-btn c-ghost c-guide-crew",
					onClick: n,
					children: C.guideCrewLink
				}),
				/* @__PURE__ */ B(H, {
					left: {
						label: C.guideSkip,
						onClick: t,
						testid: "guide-skip"
					},
					next: {
						label: u ? C.guideDone : C.next,
						onClick: u ? t : () => a(i + 1),
						testid: "guide-next"
					}
				}),
				!u && /* @__PURE__ */ B("p", {
					className: "c-guide-done",
					children: /* @__PURE__ */ B("button", {
						type: "button",
						className: "c-btn c-ghost",
						"data-testid": "guide-done",
						onClick: t,
						children: C.guideDone
					})
				})
			]
		})
	});
}
// ../../web/src/ui/calm/Painted.tsx
function pn(e) {
	let t = Number.isFinite(e) ? (Math.floor(e) % 24 + 24) % 24 : 12;
	return t >= 5 && t < 8 ? "dawn" : t >= 8 && t < 17 ? "day" : t >= 17 && t < 20 ? "dusk" : "night";
}
function mn({ hour: e = (/* @__PURE__ */ new Date()).getHours() }) {
	let t = `pt${i().replace(/[^a-zA-Z0-9]/g, "")}`, n = pn(e);
	return /* @__PURE__ */ V("svg", {
		className: "pt",
		"data-tod": n,
		viewBox: "0 0 1600 900",
		preserveAspectRatio: "xMidYMax slice",
		"aria-hidden": "true",
		focusable: "false",
		"data-testid": "painted",
		children: [
			/* @__PURE__ */ V("defs", { children: [
				/* @__PURE__ */ V("linearGradient", {
					id: `${t}-sky`,
					x1: "0",
					y1: "0",
					x2: "0",
					y2: "1",
					children: [
						/* @__PURE__ */ B("stop", {
							offset: "0",
							className: "pt-s1"
						}),
						/* @__PURE__ */ B("stop", {
							offset: "0.6",
							className: "pt-s2"
						}),
						/* @__PURE__ */ B("stop", {
							offset: "1",
							className: "pt-s3"
						})
					]
				}),
				/* @__PURE__ */ V("radialGradient", {
					id: `${t}-glow`,
					children: [/* @__PURE__ */ B("stop", {
						offset: "0",
						className: "pt-gl",
						stopOpacity: "0.9"
					}), /* @__PURE__ */ B("stop", {
						offset: "1",
						className: "pt-gl",
						stopOpacity: "0"
					})]
				}),
				/* @__PURE__ */ B("filter", {
					id: `${t}-soft`,
					x: "-2%",
					y: "-2%",
					width: "104%",
					height: "104%",
					children: /* @__PURE__ */ B("feGaussianBlur", { stdDeviation: "2.5" })
				}),
				/* @__PURE__ */ B("filter", {
					id: `${t}-cloud`,
					x: "-20%",
					y: "-50%",
					width: "140%",
					height: "200%",
					children: /* @__PURE__ */ B("feGaussianBlur", { stdDeviation: "9" })
				}),
				/* @__PURE__ */ V("filter", {
					id: `${t}-grain`,
					x: "0",
					y: "0",
					width: "100%",
					height: "100%",
					children: [/* @__PURE__ */ B("feTurbulence", {
						type: "fractalNoise",
						baseFrequency: "0.8",
						numOctaves: "2",
						seed: "11"
					}), /* @__PURE__ */ B("feColorMatrix", { values: "0 0 0 0 0.3  0 0 0 0 0.25  0 0 0 0 0.2  0 0 0 0.9 -0.25" })]
				})
			] }),
			/* @__PURE__ */ B("rect", {
				width: "1600",
				height: "900",
				fill: `url(#${t}-sky)`
			}),
			/* @__PURE__ */ B("circle", {
				className: "pt-orb",
				cx: "1180",
				cy: "250",
				r: "260",
				fill: `url(#${t}-glow)`
			}),
			/* @__PURE__ */ V("g", {
				className: "pt-clouds",
				filter: `url(#${t}-cloud)`,
				children: [
					/* @__PURE__ */ V("g", {
						className: "pt-cloud pt-c1",
						children: [/* @__PURE__ */ B("ellipse", {
							cx: "300",
							cy: "190",
							rx: "190",
							ry: "34"
						}), /* @__PURE__ */ B("ellipse", {
							cx: "400",
							cy: "168",
							rx: "120",
							ry: "30"
						})]
					}),
					/* @__PURE__ */ V("g", {
						className: "pt-cloud pt-c2",
						children: [/* @__PURE__ */ B("ellipse", {
							cx: "900",
							cy: "120",
							rx: "150",
							ry: "26"
						}), /* @__PURE__ */ B("ellipse", {
							cx: "970",
							cy: "104",
							rx: "90",
							ry: "22"
						})]
					}),
					/* @__PURE__ */ V("g", {
						className: "pt-cloud pt-c3",
						children: [/* @__PURE__ */ B("ellipse", {
							cx: "1380",
							cy: "300",
							rx: "170",
							ry: "28"
						}), /* @__PURE__ */ B("ellipse", {
							cx: "1300",
							cy: "284",
							rx: "100",
							ry: "24"
						})]
					})
				]
			}),
			/* @__PURE__ */ V("g", {
				filter: `url(#${t}-soft)`,
				children: [
					/* @__PURE__ */ B("path", {
						className: "pt-h1",
						d: "M-40 620C200 540 420 540 640 600C860 660 1080 560 1300 540C1440 528 1540 560 1640 590V900H-40Z"
					}),
					/* @__PURE__ */ B("path", {
						className: "pt-h2",
						d: "M-40 720C240 640 480 680 720 720C960 760 1200 660 1420 660C1500 660 1580 680 1640 700V900H-40Z"
					}),
					/* @__PURE__ */ B("path", {
						className: "pt-h3",
						d: "M-40 820C260 770 520 800 800 830C1060 858 1300 790 1640 800V900H-40Z"
					})
				]
			}),
			/* @__PURE__ */ B("rect", {
				className: "pt-grain",
				width: "1600",
				height: "900",
				filter: `url(#${t}-grain)`
			}),
			/* @__PURE__ */ B("rect", {
				className: "pt-veil",
				width: "1600",
				height: "900"
			})
		]
	});
}
// ../../web/src/ui/calm/useCrewBridge.ts
function hn(e, t) {
	let [n, i] = s("standalone"), [a, o] = s(() => w());
	return r(() => ee(o), []), r(() => {
		let n = !1, r = new g({
			...t === void 0 ? {} : { create: t },
			onStatus: (t) => {
				i(t), t === "standalone" && (f().source !== "demo" && e.crewLost(), n && l(), n = !1);
			},
			onState: (t) => {
				n = !0, te(e, t);
			}
		});
		return r.start(), () => r.stop();
	}, [e, t]), {
		enabled: a,
		status: n,
		view: c(h, f, f)
	};
}
// ../../web/src/ui/calm/useFeel.ts
function gn(e, t = Date.now) {
	let [r, i] = s(() => se(e)), o = n((n, r) => {
		i((i) => {
			let a = _e(i, {
				id: n,
				a: r,
				day: U(t())
			});
			return ce(e, a), a;
		});
	}, [e, t]), c = n(() => {
		oe(e), i([]);
	}, [e]);
	return a(() => ({
		entries: r,
		answer: o,
		clear: c
	}), [
		r,
		o,
		c
	]);
}
// ../../web/src/ui/calm/sprint.ts
var _n = {
	kind: "pomodoro",
	focusMin: 25,
	breakMin: 5
}, vn = ["starter-rain", "starter-deep"], yn = .8, bn = 6e3, xn = {
	chimeLevel: .25,
	chimeRatePerMin: 10
};
function Sn(e, t) {
	return t.kind === "pomodoro" ? e === "focus" && t.phase === "break" ? {
		phase: "break",
		action: "break"
	} : e === "break" && t.phase === "focus" ? {
		phase: "end",
		action: "finish"
	} : {
		phase: e,
		action: null
	} : {
		phase: "end",
		action: "cancel"
	};
}
function Cn(e, t) {
	let n = vn.find((t) => t !== e);
	return t.find((e) => e.id === n);
}
function wn(e, t) {
	return !Number.isFinite(e) || !Number.isFinite(t) ? 0 : Math.round(Math.min(0, e * yn - t) * 1e3) / 1e3;
}
async function Tn(e, t, n = (e, t) => window.setTimeout(e, t)) {
	let r = e.snapshot().voice.gain;
	e.setLayerOverride(xn), n(() => e.clearLayerOverrides(), bn), await e.playTemplate(t) && e.nudgeGain(wn(r, e.snapshot().voice.gain));
}
// ../../web/src/ui/calm/useSprint.ts
function En(e) {
	let [t, i] = s(null), c = o(!1), { player: l, guarded: u } = e, { playing: d, templateId: f, timer: p } = e.snap, m = n(() => {
		i(null), l.stopTimer();
	}, [l]), h = n((e) => u(() => {
		c.current = !1;
		let t = () => {
			l.startTimer(_n), i({
				focus: e,
				breakId: null,
				phase: "focus"
			});
		};
		if (l.snapshot().playing && l.snapshot().templateId === e.id) return t();
		l.setQueue([e]), l.playTemplate(e).then((e) => e && t());
	}), [l, u]);
	return r(() => {
		if (t === null) return;
		if (d) c.current = !0;
		else if (c.current) return m();
		let e = Sn(t.phase, p);
		if (e.action === "cancel") return i(null);
		if (e.action === null) d && f !== t.focus.id && f !== t.breakId && m();
		else if (e.action === "break") {
			let e = Cn(t.focus.id, M());
			i({
				...t,
				phase: "break",
				breakId: e?.id ?? null
			}), e !== void 0 && Tn(l, e);
		} else i(null), l.stopTimer(), l.stop();
	}, [
		t,
		d,
		f,
		p,
		l,
		m
	]), a(() => ({
		active: t !== null,
		phase: t?.phase ?? null,
		focus: t?.focus ?? null,
		start: h,
		cancel: m
	}), [
		t,
		h,
		m
	]);
}
// ../../web/src/ui/calm/useFavorite.ts
function Dn(e, t) {
	let [i, a] = s(Ie);
	r(() => {
		let t = !0;
		return e.getRecord("favorites").then((e) => t && a(Fe(e, Date.now()))).catch(() => void 0), () => {
			t = !1;
		};
	}, [e]);
	let o = n(() => {
		if (t === null) return;
		let n = Ne(i, "template", t, Date.now());
		a(n), e.setRecord("favorites", n).catch(() => void 0);
	}, [
		i,
		t,
		e
	]);
	return {
		on: t !== null && Pe(i, "template", t),
		toggle: o
	};
}
// ../../web/src/ui/calm/CalmApp.tsx
var On = t(() => import("./chunk-Onboarding-C1Hgaomr.mjs").then((e) => ({ default: e.Onboarding }))), kn = (e) => Math.max(180, e * 60 * .8);
function An({ engine: t, clock: i, store: a, bridgeCreate: c }) {
	let l = cn(t, i, a), u = rt(l.store, l.snap.playing), d = hn(l.player, c), f = on(l), [p, m] = s("today"), [h, g] = s(null), _ = o(null), v = Dn(l.store, l.snap.templateId), y = gn(u.storage), b = En(l), x = u.profile.createdAt === 0;
	r(() => t.setListening?.(u.profile.device), [t, u.profile.device]);
	let S = In(u.storage), w = Ye(l.snap, !x && p !== "reset" && p !== "breathe", b.focus === null ? null : {
		id: b.focus.id,
		name: C.sprintName
	}), T = l.reduced || u.profile.extraGentle, [E, D] = s(!1), [ee, O] = s(() => un(u.storage)), k = () => {
		dn(u.storage), O(!0), D(!1);
	}, { look: A, prefs: j, dim: te, setPrefs: M } = ke(), [ne, N] = s(!1), P = n(() => {
		N(!0), m("player");
	}, []), F = n(() => N(!1), []);
	Ln(P);
	let I = n((e) => m(e), []), { play: L, playDay: R, finish: z } = Nn({
		s: l,
		data: u,
		last: S,
		end: w,
		active: _,
		setView: m
	});
	return Bn(l.snap.playing, l.snap.elapsedSec, _, u.progress, u.setJourney), /* @__PURE__ */ V("div", {
		className: "c-app",
		"data-theme": A.theme,
		"data-contrast": A.highContrast ? "high" : "normal",
		"data-view": p,
		"data-dim": te ? "true" : "false",
		"data-motion": T ? "off" : "on",
		"data-playing": l.snap.playing ? "true" : "false",
		children: [
			/* @__PURE__ */ B(mn, {}),
			/* @__PURE__ */ B(zn, {}),
			/* @__PURE__ */ B(Rn, { engine: t }),
			d.view.source === "demo" && /* @__PURE__ */ B("p", {
				className: "c-badge-sim",
				role: "status",
				"data-testid": "demo-badge",
				children: C.crewDemoBadge
			}),
			/* @__PURE__ */ B("main", {
				id: "c-main",
				className: "c-main",
				tabIndex: -1,
				children: /* @__PURE__ */ B("div", {
					className: "c-sheet",
					children: /* @__PURE__ */ B(e, {
						fallback: /* @__PURE__ */ B("p", {
							className: "c-loading",
							role: "status",
							children: C.loading
						}),
						children: x ? /* @__PURE__ */ B(On, {
							playing: l.snap.playing,
							reduced: T,
							initial: u.profile,
							onAccept: l.accept,
							onPreview: (e) => l.playTemplate(e, null),
							onStop: () => void l.player.stop(),
							onFinish: z
						}) : /* @__PURE__ */ B(en, {
							view: p,
							journeyId: h,
							s: l,
							data: u,
							crewInfo: d,
							nature: f,
							still: T,
							fav: v,
							last: S.template,
							look: A,
							prefs: j,
							onPrefs: M,
							feel: y.entries,
							sprint: b,
							handlers: {
								go: I,
								play: L,
								playDay: R,
								openJourney: (e) => {
									g(e), m("journey");
								},
								forget: () => {
									de(u.storage), y.clear(), f.stop(), sn(), u.setProfile(ge), m("today");
								},
								onStudio: P,
								advancedPending: ne,
								advancedShown: F,
								onMix: (e) => l.guarded(() => l.player.playMix(e)),
								openGuide: () => D(!0)
							}
						})
					})
				})
			}),
			!x && p !== "player" && p !== "reset" && p !== "breathe" && p !== "crew" && /* @__PURE__ */ B(Be, {
				snap: l.snap,
				crewPresetId: d.view.state?.target.presetId ?? null,
				onOpen: () => I("player"),
				onStop: () => void l.player.stop()
			}),
			!x && /* @__PURE__ */ B(Re, {
				view: p,
				onGo: I,
				reduced: T
			}),
			/* @__PURE__ */ B("p", {
				className: "c-sr",
				role: "status",
				"data-testid": "play-status",
				children: l.snap.playing ? `Playing. ${C.volumeCapped}` : "Stopped."
			}),
			w.card !== null && !l.snap.playing && /* @__PURE__ */ B(jn, {
				card: w.card,
				play: L,
				dismiss: w.dismiss,
				feel: y,
				firstRun: U(u.profile.createdAt) === G()
			}),
			(E || !ee && !x && w.card !== null && !l.snap.playing) && /* @__PURE__ */ B(fn, {
				reduced: T,
				onClose: k,
				onCrew: () => {
					k(), I("crew");
				}
			}),
			l.gate && /* @__PURE__ */ B(be, {
				onAccept: l.accept,
				onCancel: l.cancelGate
			})
		]
	});
}
function jn({ card: e, play: t, dismiss: n, feel: r, firstRun: i }) {
	return /* @__PURE__ */ B(Qe, {
		info: e,
		onAgain: () => Fn(e.id, t),
		onClose: n,
		firstRun: i,
		onFeel: (t) => r.answer(e.id, t)
	});
}
function Mn(e, t) {
	return t === null ? null : e === "sleep" ? {
		kind: "sleep-fade",
		minutes: Math.max(20, t)
	} : {
		kind: "countdown",
		minutes: t
	};
}
function Nn({ s: e, data: t, last: r, end: i, active: a, setView: o }) {
	let s = n((n, s = n.recommendedMinutes, c = t.profile.goal) => {
		a.current = null, r.remember(n.id), i.dismiss(), e.playTemplate(n, Mn(c, s)), o("player");
	}, [
		e,
		r,
		i,
		a,
		o,
		t.profile.goal
	]);
	return {
		play: s,
		playDay: (e, t, n) => {
			s(n), a.current = {
				id: e,
				no: t,
				needSec: kn(n.recommendedMinutes)
			};
		},
		finish: (n, i) => {
			if (t.setProfile(n), !e.snap.playing || e.snap.templateId !== i.id) return s(i, i.recommendedMinutes, n.goal);
			r.remember(i.id), e.player.startTimer(Mn(n.goal, i.recommendedMinutes) ?? {
				kind: "countdown",
				minutes: i.recommendedMinutes
			}), o("player");
		}
	};
}
var Pn = (e) => e === null ? null : M().find((t) => t.id === e) ?? null;
function Fn(e, t) {
	let n = Pn(e);
	n !== null && t(n);
}
function In(e) {
	let [t, r] = s(() => le(e)), i = a(() => Pn(t), [t]), o = n((t) => {
		he(e, t), r(t);
	}, [e]);
	return a(() => ({
		template: i,
		remember: o
	}), [i, o]);
}
function Ln(e) {
	r(() => {
		let t = (t) => {
			t.altKey && t.shiftKey && t.code === "KeyS" && (t.preventDefault(), e());
		};
		return window.addEventListener("keydown", t), () => window.removeEventListener("keydown", t);
	}, [e]);
}
function Rn({ engine: e }) {
	let [t, n] = s(() => e.status.state === "error" ? e.status.error ?? "" : null);
	return r(() => e.onStatus((e) => n(e.state === "error" ? e.error ?? "" : null)), [e]), t === null ? null : /* @__PURE__ */ B("p", {
		className: "c-note",
		role: "status",
		"data-testid": "engine-notice",
		children: t === "audio-unsupported" ? C.unsupported : C.errorAudio
	});
}
function zn() {
	return /* @__PURE__ */ V(z, { children: [/* @__PURE__ */ B("a", {
		className: "c-skip",
		href: "#c-main",
		children: "Skip to content"
	}), /* @__PURE__ */ B("header", {
		className: "c-topbar",
		children: /* @__PURE__ */ B("span", {
			className: "c-brand",
			children: C.brand
		})
	})] });
}
function Bn(e, t, n, i, a) {
	r(() => {
		let r = n.current, o = r === null ? void 0 : i[r.id];
		!e || r === null || o === void 0 || t < r.needSec || (n.current = null, o.doneDays.includes(r.no) || a(r.id, {
			...o,
			doneDays: [...o.doneDays, r.no].sort((e, t) => e - t)
		}));
	}, [
		e,
		t,
		n,
		i,
		a
	]);
}
// src/App.tsx
var Vn = {
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
function Hn() {
	x(import.meta.url), D();
	let { engine: e, store: t } = v();
	r(() => (b(!0), () => b(!1)), []);
	let [n, i] = s(!1);
	return /* @__PURE__ */ V("div", {
		"data-testid": "zonked-app",
		style: {
			height: "100%",
			minHeight: 0,
			overflow: "hidden",
			position: "relative",
			transform: "translateZ(0)"
		},
		children: [/* @__PURE__ */ B("div", {
			style: {
				height: "100%",
				overflowY: "auto"
			},
			children: /* @__PURE__ */ B(An, {
				engine: e,
				store: t,
				onStudio: () => i(!0)
			})
		}), n && /* @__PURE__ */ B("p", {
			role: "status",
			style: Vn,
			"data-testid": "studio-note",
			onClick: () => i(!1),
			children: "Studio, the advanced mode, is not in the Kiro Crew app yet. Tap to close."
		})]
	});
}
export { Hn as default };
