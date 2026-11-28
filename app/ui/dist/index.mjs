import { Suspense as e, lazy as t, useCallback as n, useEffect as r, useId as i, useMemo as a, useRef as o, useState as s, useSyncExternalStore as c } from "react";
import { F as l, I as u, J as d, K as f, L as p, M as m, N as h, P as g, Q as _, W as v, X as y, _ as b, a as x, d as S, et as C, h as w, i as T, j as E, k as ee, o as te, p as D, r as O, s as ne, v as k, y as A } from "./chunk-crewLink-CH1NzHoN.mjs";
import { a as j, n as M, o as N, s as re } from "./chunk-catalog-DjXCbOxc.mjs";
import { t as P } from "./chunk-recContext-DRk3qs8m.mjs";
import { t as F } from "./chunk-icons-C-FdU5cO.mjs";
import { t as I } from "./chunk-MascotView-CeVF4lFc.mjs";
import { Fragment as L, jsx as R, jsxs as z } from "react/jsx-runtime";
import { a as ie, c as ae, d as oe, f as se, g as ce, i as le, l as ue, m as de, n as fe, o as pe, p as me, r as he, s as ge, t as _e, u as ve } from "./chunk-data-CUBWt-Gc.mjs";
import { t as ye } from "./chunk-SafetyNotice-DNihttKl.mjs";
import { n as B } from "./chunk-FormFrame-BnLJENRx.mjs";
import { t as be } from "./chunk-soundMenu-C52iaQfx.mjs";
import { r as xe, t as Se } from "./chunk-samples-4EZJclX4.mjs";
import { a as Ce, i as we, n as V, o as H } from "./chunk-NatureScreen-B11jLxdI.mjs";
import { n as Te } from "./chunk-useBreath-BZ3euK4B.mjs";
import { n as Ee } from "./chunk-look-C_f0p27a.mjs";
import { a as De, n as Oe, r as ke } from "./chunk-ownStore-DzrxOebU.mjs";
import { i as Ae, n as je, r as Me, t as Ne } from "./chunk-favorites-DI7jvAxx.mjs";
// ../../web/src/ui/calm/CalmChrome.tsx
var Pe = [
	{
		view: "today",
		label: v.nav[0],
		icon: "today"
	},
	{
		view: "library",
		label: v.nav[1],
		icon: "library"
	},
	{
		view: "crew",
		label: v.nav[2],
		icon: "crew"
	},
	{
		view: "settings",
		label: v.nav[3],
		icon: "settings"
	}
];
function Fe({ view: e, onGo: t, reduced: n = !1 }) {
	let r = e === "journey" || e === "journeys" ? "today" : e === "nature" ? "library" : e === "reset" || e === "breathe" ? "today" : e;
	return /* @__PURE__ */ z("nav", {
		className: "c-tabbar",
		"aria-label": "Main",
		children: [/* @__PURE__ */ z("div", {
			className: "c-rail-brand",
			"aria-hidden": "true",
			children: [/* @__PURE__ */ R(I, {
				size: 40,
				reduced: n
			}), /* @__PURE__ */ R("span", {
				className: "c-brand",
				children: v.brand
			})]
		}), Pe.map((e) => /* @__PURE__ */ z("button", {
			type: "button",
			className: "c-nav",
			"aria-current": r === e.view ? "page" : void 0,
			onClick: () => t(e.view),
			children: [/* @__PURE__ */ R(F, { name: e.icon }), /* @__PURE__ */ R("span", { children: e.label })]
		}, e.view))]
	});
}
function Ie(e, t = null) {
	if (e.templateName !== null) return e.templateName;
	let n = e.source === "crew", r = n ? t ?? e.presetId : e.presetId, i = C.find((e) => e.id === r)?.name;
	return i === void 0 ? v.brand : n ? `Crew: ${i}` : i;
}
function Le({ snap: e, crewPresetId: t = null, onOpen: n, onStop: r }) {
	if (!e.playing) return null;
	let i = e.timer.kind !== "none" && e.timer.running ? P(e.timer.remainingSec) : "";
	return /* @__PURE__ */ z("div", {
		className: "c-mini",
		role: "group",
		"aria-label": "Now playing",
		children: [/* @__PURE__ */ z("button", {
			type: "button",
			className: "c-btn c-link c-mini-open",
			onClick: n,
			children: [Ie(e, t), i !== "" && /* @__PURE__ */ R("span", {
				className: "c-digits",
				children: ` ${i}`
			})]
		}), /* @__PURE__ */ R("button", {
			type: "button",
			className: "c-btn c-small",
			"data-testid": "mini-stop",
			onClick: r,
			children: v.stop
		})]
	});
}
var Re = 864e5, U = 4;
function W(e) {
	if (!Number.isFinite(e)) return 0;
	let t = new Date(e).getTimezoneOffset() * 6e4;
	return Math.floor((e - t) / Re);
}
var G = (e) => Number.isInteger(e) && e >= 0 && e < 1e7;
function ze(e) {
	return Number.isFinite(e) ? Math.min(7, Math.max(1, Math.floor(e))) : U;
}
function Be(e) {
	return e - (e + 3) % 7;
}
function Ve(e, t, n) {
	let r = /* @__PURE__ */ new Map();
	for (let i of e) {
		if (!G(i.day) || i.day < t || i.day > n) continue;
		let e = Number.isFinite(i.minutes) && i.minutes > 0 ? i.minutes : 0;
		r.set(i.day, (r.get(i.day) ?? 0) + e);
	}
	let i = /* @__PURE__ */ new Set();
	return r.forEach((e, t) => {
		e >= 3 && i.add(t);
	}), i;
}
function He(e, t, n) {
	return n.has(e) ? "listened" : e === t ? "today" : e > t ? "upcoming" : "rest";
}
function Ue(e, t, n = U) {
	let r = ze(n);
	if (!G(t)) {
		let e = Object.freeze(Array.from({ length: 7 }, () => "upcoming"));
		return Object.freeze({
			daysListened: 0,
			goalDays: r,
			goalMet: !1,
			quietWeek: !0,
			dots: e
		});
	}
	let i = Be(t), a = Ve(e, i, t), o = Object.freeze(Array.from({ length: 7 }, (e, n) => He(i + n, t, a)));
	return Object.freeze({
		daysListened: a.size,
		goalDays: r,
		goalMet: a.size >= r,
		quietWeek: a.size === 0,
		dots: o
	});
}
var We = 400;
function Ge(e, t, i = null) {
	let c = o(null), [l, u] = s(null);
	r(() => {
		if (e.playing) {
			u(null), c.current = e.templateId === null ? null : {
				id: i?.id ?? e.templateId,
				name: i?.name ?? e.templateName ?? v.brand,
				minutes: e.elapsedSec / 60
			};
			return;
		}
		let n = c.current;
		if (c.current = null, !t || n === null || n.minutes * 60 < 60) return;
		let r = window.setTimeout(() => u({
			...n,
			minutes: Math.round(n.minutes)
		}), We);
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
var Ke = [
	["calmer", v.feelCalmer],
	["same", v.feelSame],
	["not", v.feelNot]
];
function qe({ onFeel: e }) {
	let [t, n] = s(!1);
	return t ? /* @__PURE__ */ R("p", {
		className: "c-muted",
		role: "status",
		"data-testid": "feel-saved",
		children: v.feelSaved
	}) : /* @__PURE__ */ z("div", {
		role: "group",
		"aria-labelledby": "c-feel-q",
		className: "c-feel",
		"data-testid": "feel-row",
		children: [/* @__PURE__ */ R("p", {
			id: "c-feel-q",
			className: "c-muted",
			children: v.feelQuestion
		}), /* @__PURE__ */ R("div", {
			className: "c-chips",
			children: Ke.map(([t, r]) => /* @__PURE__ */ R("button", {
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
function Je({ info: e, onAgain: t, onClose: n, firstRun: i = !1, onFeel: a }) {
	let s = o(null);
	return r(() => s.current?.focus(), []), /* @__PURE__ */ R("div", {
		className: "c-overlay",
		onKeyDown: (e) => e.key === "Escape" && n(),
		children: /* @__PURE__ */ z("div", {
			className: "c-dialog c-end",
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": "c-end-title",
			"data-testid": "end-card",
			children: [
				/* @__PURE__ */ R("h2", {
					id: "c-end-title",
					className: "c-h1",
					children: v.endTitle
				}),
				/* @__PURE__ */ R("p", { children: v.endLine(e.name, e.minutes) }),
				/* @__PURE__ */ R("p", {
					className: "c-muted",
					children: v.endNote
				}),
				a !== void 0 && /* @__PURE__ */ R(qe, { onFeel: a }),
				i && /* @__PURE__ */ R("p", {
					className: "c-note",
					"data-testid": "first-run-note",
					children: v.studioNote
				}),
				/* @__PURE__ */ z("div", {
					className: "c-actions",
					children: [/* @__PURE__ */ R("button", {
						ref: s,
						type: "button",
						className: "c-btn c-primary",
						"data-testid": "end-again",
						onClick: t,
						children: v.playAgain
					}), /* @__PURE__ */ R("button", {
						type: "button",
						className: "c-btn",
						"data-testid": "end-close",
						onClick: n,
						children: v.close
					})]
				})
			]
		})
	});
}
function Ye(e) {
	if (e.kind === "sleep-fade") return 4;
	if (e.kind === "pomodoro") return 5;
	if (e.kind !== "countdown") return 3;
	let t = Math.round(e.totalSec / 60);
	return t === 15 ? 0 : t === 30 ? 1 : t === 60 ? 2 : -1;
}
function Xe({ timer: e, player: t, onSprint: n, onSprintEnd: r }) {
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
	}, a = Ye(e);
	return /* @__PURE__ */ R("div", { children: /* @__PURE__ */ R("div", {
		className: "c-chips",
		role: "group",
		"aria-label": "Timer",
		children: v.timerChips.map((e, t) => t === 5 && n === void 0 ? null : /* @__PURE__ */ R("button", {
			type: "button",
			"aria-pressed": a === t,
			className: "c-tchip",
			onClick: () => i(t),
			children: e
		}, e))
	}) });
}
function Ze({ timer: e }) {
	return e.kind === "none" || !e.running ? null : /* @__PURE__ */ z("p", {
		className: "c-time",
		"data-testid": "time-left",
		children: [e.kind === "pomodoro" ? `${e.phase === "break" ? v.sprintBreakLeft : v.sprintFocusLeft} ` : "", P(e.remainingSec)]
	});
}
function Qe(e) {
	let t = (e.endedAt - e.startedAt) / 6e4;
	return Number.isFinite(t) && t >= 1 ? Math.min(720, t) : 0;
}
// ../../web/src/ui/calm/useCalmData.ts
var $e = 200, K = (e = Date.now) => W(e());
function et(e, t) {
	let i = a(() => he(), []), [o, c] = s(() => ie(i)), [l, u] = s(() => pe(i)), [d, f] = s([]), [p, m] = s(0);
	return r(() => {
		let t = !0;
		return e.listLogs($e).then((e) => t && f(e)).catch(() => void 0), () => {
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
		week: a(() => Ue(d.map((e) => ({
			day: W(e.startedAt),
			minutes: Qe(e)
		})), K()), [d]),
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
var tt = 15e3, nt = 6e4, q = [
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
function rt(e, t) {
	let n = q[Math.min(Math.max(0, Math.trunc(e)), q.length - 1)];
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
function it(e, t) {
	return ee(JSON.parse(JSON.stringify(rt(e, t))));
}
var at = {
	now: () => Date.now(),
	setTimer: (e, t) => setTimeout(e, t),
	clearTimer: (e) => clearTimeout(e)
}, J = [], ot = at;
function st() {
	for (let e of J) ot.clearTimer(e);
	J = [];
}
function ct(e, t, n, r) {
	let i = r.now(), a = it(t, Math.trunc(i / 1e3));
	if (a === null) return;
	let o = t >= q.length - 1;
	l({
		state: a,
		source: "demo",
		changedAtMs: i,
		snoozeUntilMs: 0,
		demoNextAtMs: n + (o ? nt : (t + 1) * tt)
	}), e.applyCrew(a), e.followCrew();
}
function Y(e) {
	st(), l({
		state: null,
		source: "none",
		changedAtMs: 0,
		snoozeUntilMs: 0,
		demoNextAtMs: null
	}), e.crewLost();
}
function lt(e, t = at) {
	st(), ot = t;
	let n = t.now();
	ct(e, 0, n, t), e.snapshot().playing || e.play();
	for (let r = 1; r < q.length; r += 1) J.push(t.setTimer(() => ct(e, r, n, t), r * tt));
	J.push(t.setTimer(() => Y(e), nt));
}
// ../../web/src/ui/calm/WeekDots.tsx
var ut = [
	"Mon",
	"Tue",
	"Wed",
	"Thu",
	"Fri",
	"Sat",
	"Sun"
], dt = [
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
	"Sunday"
], ft = {
	listened: "listened",
	rest: "rest day",
	today: "today",
	upcoming: "coming up"
};
function pt(e, t = !0, n = !1) {
	return e.quietWeek && n && !t ? v.joinedLine : e.quietWeek ? t ? v.welcomeBack : v.firstWeek : `${v.weekOf(e.daysListened)}. ${v.restCount}`;
}
function mt({ week: e, hasHistory: t = !0, joinedToday: n = !1, compact: r = !1 }) {
	let i = n && !t && e.quietWeek;
	return /* @__PURE__ */ z("div", {
		className: r ? "c-week c-week-compact" : "c-week",
		children: [/* @__PURE__ */ R("ul", {
			className: "c-dots",
			"aria-label": "This week",
			children: e.dots.map((e, t) => {
				let n = i && e === "today";
				return /* @__PURE__ */ z("li", {
					className: `c-dot c-dot-${e}${n ? " c-dot-joined" : ""}`,
					"data-state": e,
					children: [
						/* @__PURE__ */ R("span", {
							className: "c-mark",
							"aria-hidden": "true",
							children: n || e === "listened" ? /* @__PURE__ */ R(F, {
								name: "check",
								size: 16
							}) : ""
						}),
						/* @__PURE__ */ R("span", {
							className: "c-dayname",
							"aria-hidden": "true",
							children: ut[t]
						}),
						/* @__PURE__ */ R("span", {
							className: "c-sr",
							children: `${dt[t]}, ${n ? v.joinedToday : ft[e]}`
						})
					]
				}, dt[t]);
			})
		}), /* @__PURE__ */ R("p", {
			className: "c-muted",
			"data-testid": r ? void 0 : "week-text",
			children: pt(e, t, i)
		})]
	});
}
// ../../web/src/ui/calm/Today.tsx
var ht = () => /* @__PURE__ */ new Date(), gt = [], _t = ["focus", "study"];
function vt({ profile: e, week: t, reduced: n, crewConnected: r, hasHistory: i = !0, joinedToday: o = !1, now: c = ht, last: l = null, feel: u = gt, onSprint: f, onPlay: p, onGo: m, onReset: h, onBreathe: g, onGuide: b }) {
	let [x, S] = s(0), C = a(() => {
		let t = ce(e, c());
		return me(M(t, 5), u.length === 0 ? [] : M(t, 12), u);
	}, [
		e,
		c,
		u
	]), w = C[x % Math.max(1, C.length)];
	return /* @__PURE__ */ z("div", {
		className: "c-today",
		children: [
			/* @__PURE__ */ z("header", {
				className: "c-pagehead",
				children: [/* @__PURE__ */ R(I, {
					size: 72,
					reduced: n
				}), /* @__PURE__ */ R("h1", {
					className: "c-greet",
					"data-testid": "greeting",
					children: _(c().getHours())
				})]
			}),
			l !== null && l.id !== w?.template.id && /* @__PURE__ */ R("button", {
				type: "button",
				className: "c-btn c-wide c-again",
				"data-testid": "play-again",
				onClick: () => p(l),
				children: `${v.playAgain}: ${l.name}`
			}),
			w !== void 0 && /* @__PURE__ */ z("section", {
				className: "c-daily",
				"aria-labelledby": "c-daily-h",
				children: [
					/* @__PURE__ */ R("p", {
						className: "c-eyebrow",
						children: v.dailyEyebrow
					}),
					/* @__PURE__ */ R("h2", {
						id: "c-daily-h",
						children: w.template.name
					}),
					/* @__PURE__ */ R("p", {
						className: "c-muted",
						children: `${w.template.recommendedMinutes} min. ${y(w.reasons[0] ?? v.suggested)}`
					}),
					/* @__PURE__ */ R(B, {
						left: {
							label: v.notThisOne,
							onClick: () => S((e) => e + 1)
						},
						next: {
							label: v.start,
							onClick: () => p(w.template),
							testid: "today-play"
						}
					})
				]
			}),
			f !== void 0 && w !== void 0 && _t.includes(e.goal) && /* @__PURE__ */ z("button", {
				type: "button",
				className: "c-link-card c-sprint-entry",
				"data-testid": "today-sprint",
				onClick: () => f(w.template),
				children: [/* @__PURE__ */ R("b", { children: v.sprintTitle }), /* @__PURE__ */ R("small", { children: v.sprintLine })]
			}),
			/* @__PURE__ */ z("button", {
				type: "button",
				className: "c-link-card c-reset-entry",
				"data-testid": "today-reset",
				onClick: h,
				children: [/* @__PURE__ */ R("b", { children: v.resetEntry }), /* @__PURE__ */ R("small", { children: v.resetEntryHint })]
			}),
			g !== void 0 && e.goal === "calm" && /* @__PURE__ */ z("button", {
				type: "button",
				className: "c-link-card c-breathe-entry",
				"data-testid": "today-breathe",
				onClick: g,
				children: [/* @__PURE__ */ R("b", { children: v.breatheEntry }), /* @__PURE__ */ R("small", { children: v.breatheEntryHint })]
			}),
			/* @__PURE__ */ z("section", {
				"aria-labelledby": "c-goal-h",
				children: [/* @__PURE__ */ R("h2", {
					id: "c-goal-h",
					className: "c-h3",
					children: `Your goal: ${d[e.goal]}`
				}), /* @__PURE__ */ R(mt, {
					week: t,
					hasHistory: i,
					joinedToday: o
				})]
			}),
			/* @__PURE__ */ z("section", {
				"aria-labelledby": "c-for-h",
				children: [/* @__PURE__ */ R("h2", {
					id: "c-for-h",
					className: "c-h3",
					children: v.forYou
				}), /* @__PURE__ */ R("ul", {
					className: "c-rows",
					children: C.slice(0, 3).map((e) => /* @__PURE__ */ R("li", { children: /* @__PURE__ */ z("button", {
						type: "button",
						className: "c-mini-card",
						onClick: () => p(e.template),
						children: [
							/* @__PURE__ */ R("b", { children: e.template.name }),
							/* @__PURE__ */ R("small", { children: y(e.reasons[0] ?? v.suggested) }),
							/* @__PURE__ */ R("em", { children: `${e.template.recommendedMinutes} min` })
						]
					}) }, e.template.id))
				})]
			}),
			/* @__PURE__ */ R("button", {
				type: "button",
				className: "c-link-card",
				onClick: () => m("library"),
				children: /* @__PURE__ */ R("b", { children: "Browse all sounds" })
			}),
			/* @__PURE__ */ R("button", {
				type: "button",
				className: "c-link-card",
				onClick: () => m("journeys"),
				children: /* @__PURE__ */ R("b", { children: v.journeysTitle })
			}),
			b !== void 0 && /* @__PURE__ */ R("button", {
				type: "button",
				className: "c-btn c-ghost c-guide-link",
				"data-testid": "today-guide",
				onClick: b,
				children: v.guideLink
			}),
			r && /* @__PURE__ */ R("p", {
				className: "c-crew-chip",
				role: "status",
				children: "Crew connected: easing the sound"
			})
		]
	});
}
// ../../web/src/ui/calm/breathe.ts
var yt = "calm-breathe-5", X = {
	atMin: 0,
	beatHz: .5,
	carrierHz: 20,
	gain: .32,
	mode: "binaural",
	noise: "pink",
	noiseLevel: .45,
	beatLevel: 0,
	ramp: !1
}, bt = {
	id: yt,
	name: "Breathe, 5 minutes",
	category: "meditation",
	vibe: "calm",
	tags: ["breathing", "no-beat"],
	layerTags: N([X]),
	situations: ["meditate", "quick-reset"],
	recommendedMinutes: 5,
	intensity: 1,
	adhdFriendly: re([X], 1),
	stages: [X],
	reasonTemplate: "Soft pink noise, paced 4 seconds in and 4 seconds out.",
	source: "original",
	breath: {
		inSec: 4,
		outSec: 4
	}
}, xt = t(() => import("./chunk-advanced-DDnfIdy6.mjs").then((e) => ({ default: e.AdvancedPanels })));
function St({ player: t, snap: n, nature: i, favorite: a, evidence: c, onFavorite: l, onClose: u, sprint: d, engine: p, advancedOpen: m = !1 }) {
	let h = o(null), [g, _] = s(!1), [y, b] = s(m);
	r(() => h.current?.querySelector("button")?.focus(), []);
	let x = (e) => {
		if (e.key === "Escape") e.stopPropagation(), u();
		else if (e.key === "Tab") {
			let t = Array.from(h.current?.querySelectorAll("button:not([disabled]), input, select") ?? []), n = t[0], r = t[t.length - 1];
			e.shiftKey && document.activeElement === n ? (e.preventDefault(), r?.focus()) : !e.shiftKey && document.activeElement === r && (e.preventDefault(), n?.focus());
		}
	}, S = Se();
	return /* @__PURE__ */ R("div", {
		className: "c-overlay c-sheet-wrap",
		onClick: u,
		children: /* @__PURE__ */ z("div", {
			ref: h,
			className: "c-opts",
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": "c-opts-title",
			"data-testid": "options-sheet",
			onKeyDown: x,
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ z("div", {
					className: "c-opts-head",
					children: [/* @__PURE__ */ R("h2", {
						id: "c-opts-title",
						children: v.optionsTitle
					}), /* @__PURE__ */ R("button", {
						type: "button",
						className: "c-btn c-ghost",
						onClick: u,
						children: v.optionsClose
					})]
				}),
				/* @__PURE__ */ z("section", {
					"aria-labelledby": "c-o-timer",
					children: [/* @__PURE__ */ R("h3", {
						id: "c-o-timer",
						className: "c-o-h",
						children: v.optTimer
					}), /* @__PURE__ */ R(Xe, {
						timer: n.timer,
						player: t,
						...d === void 0 ? {} : {
							onSprint: d.onSprint,
							onSprintEnd: d.onSprintEnd
						}
					})]
				}),
				/* @__PURE__ */ z("section", {
					"aria-labelledby": "c-o-nature",
					children: [
						/* @__PURE__ */ R("h3", {
							id: "c-o-nature",
							className: "c-o-h",
							children: v.optNature
						}),
						/* @__PURE__ */ z("div", {
							className: "c-chips c-left c-nature-row",
							role: "group",
							"aria-label": v.optNature,
							children: [/* @__PURE__ */ R("button", {
								type: "button",
								className: "c-tchip",
								"aria-pressed": i.on === null,
								"data-testid": "sheet-nature-none",
								onClick: i.stop,
								children: v.natureNone
							}), S.map((e) => /* @__PURE__ */ R("button", {
								type: "button",
								className: "c-tchip",
								"aria-pressed": i.on === e.id,
								"data-testid": `sheet-nature-${e.id}`,
								onClick: () => i.on === e.id ? i.stop() : i.start(e.id),
								children: e.label
							}, e.id))]
						}),
						/* @__PURE__ */ R(V, {
							id: "c-blend",
							label: v.natureBlend,
							value: i.prefs.blend,
							max: 1,
							onChange: i.setBlend
						}),
						i.on !== null && /* @__PURE__ */ R(V, {
							id: "c-nlevel",
							label: v.natureLevel,
							value: i.prefs.level,
							max: .85,
							onChange: i.setLevel
						}),
						/* @__PURE__ */ R("p", {
							className: "c-status",
							role: "status",
							children: i.message
						})
					]
				}),
				/* @__PURE__ */ z("section", {
					"aria-labelledby": "c-o-more",
					children: [
						/* @__PURE__ */ R("h3", {
							id: "c-o-more",
							className: "c-o-h",
							children: v.optMore
						}),
						/* @__PURE__ */ z("div", {
							className: "c-chips c-left",
							children: [/* @__PURE__ */ R("button", {
								type: "button",
								className: "c-tchip",
								"aria-pressed": a,
								"data-testid": "sheet-favorite",
								onClick: l,
								children: a ? v.saved : v.favorite
							}), /* @__PURE__ */ R("button", {
								type: "button",
								className: "c-tchip",
								"aria-expanded": g,
								"aria-controls": "c-why-box",
								onClick: () => _((e) => !e),
								children: v.whyTitle
							})]
						}),
						/* @__PURE__ */ z("div", {
							id: "c-why-box",
							hidden: !g,
							children: [/* @__PURE__ */ R("p", { children: v.whyBody }), /* @__PURE__ */ R("p", { children: `Evidence: ${c}. ${f[c] ?? ""}` })]
						}),
						/* @__PURE__ */ R("p", {
							className: "c-muted",
							children: v.volumeCapped
						})
					]
				}),
				/* @__PURE__ */ z("section", {
					"aria-labelledby": "c-o-adv",
					children: [/* @__PURE__ */ R("h3", {
						id: "c-o-adv",
						className: "c-o-h",
						children: /* @__PURE__ */ R("button", {
							type: "button",
							className: "c-btn c-ghost c-adv-btn",
							"data-testid": "options-advanced",
							"aria-expanded": y,
							"aria-controls": "c-adv-box",
							onClick: () => b((e) => !e),
							children: v.optAdvanced
						})
					}), /* @__PURE__ */ R("div", {
						id: "c-adv-box",
						hidden: !y,
						children: y && /* @__PURE__ */ R(e, {
							fallback: /* @__PURE__ */ R("p", {
								className: "c-muted",
								role: "status",
								children: v.loading
							}),
							children: /* @__PURE__ */ R(xt, {
								engine: p,
								player: t,
								onClose: () => b(!1)
							})
						})
					})]
				})
			]
		})
	});
}
// ../../web/src/ui/calm/BreathLive.tsx
var Ct = {
	label: "Breathe in",
	count: 4
};
function wt(e) {
	let [t, n] = s(0);
	if (r(() => {
		if (n(0), !e) return;
		let t = window.setInterval(() => n((e) => e + 1), 1e3);
		return () => window.clearInterval(t);
	}, [e]), !e) return Ct;
	let i = t % 8;
	return {
		label: i < 4 ? "Breathe in" : "Breathe out",
		count: 4 - i % 4
	};
}
var Tt = (e) => e.label === "Breathe in" ? v.counterIn(e.count) : v.counterOut(e.count);
function Et({ label: e, on: t, announce: n }) {
	return /* @__PURE__ */ R("p", {
		className: "c-sr",
		role: "status",
		"aria-live": "polite",
		"data-testid": "breath-live",
		children: t && n ? e : ""
	});
}
// ../../web/src/ui/calm/playerScene.ts
var Dt = ["cant-sleep", "lucid-dream"], Ot = [
	"adhd-focus",
	"deep-work",
	"ai-burnout"
];
function kt(e, t) {
	if (t) return "nature";
	let n = (e === null ? void 0 : j().find((t) => t.id === e))?.situations ?? [];
	return n.some((e) => Dt.includes(e)) ? "sleep" : n.some((e) => Ot.includes(e)) ? "focus" : "calm";
}
var At = 400;
function jt(e, t) {
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
		}, At);
		return () => {
			n = !1, window.clearInterval(r);
		};
	}, [e, t]), n;
}
// ../../web/src/ui/calm/PlayerScreen.tsx
var Mt = /* @__PURE__ */ xe({ PlayerScreen: () => Lt }), Nt = t(() => import("./chunk-mascot-ChTXuy_c.mjs").then((e) => ({ default: e.CalmMascot }))), Pt = t(() => import("./chunk-visuals-BqbfvuFC.mjs").then((e) => ({ default: e.SceneLoop }))), Ft = t(() => import("./chunk-mascot-ChTXuy_c.mjs").then((e) => ({ default: e.BreathCue })));
function It({ still: t, playing: n, situation: r, theme: i, level: a, announce: o = !0 }) {
	let s = Te(n && !t), c = wt(n && t), l = n && !t;
	return /* @__PURE__ */ z(L, { children: [/* @__PURE__ */ R("div", {
		className: "c-stage",
		"data-testid": "breath-ring",
		"data-still": t ? "true" : "false",
		"data-situation": r,
		children: /* @__PURE__ */ z(e, {
			fallback: null,
			children: [/* @__PURE__ */ R("div", {
				className: "c-stage-scene",
				children: /* @__PURE__ */ R(Pt, {
					situation: r,
					reducedMotion: t,
					theme: i
				})
			}), /* @__PURE__ */ R("div", {
				className: "c-stage-mascot",
				children: /* @__PURE__ */ R(Nt, {
					mood: n ? "breathing" : "idle",
					size: 190,
					reducedMotion: t,
					situation: r,
					breathPhase: l ? s.phase : void 0,
					level: n ? a : 0
				})
			})]
		})
	}), /* @__PURE__ */ z("div", {
		className: "c-cue",
		children: [l ? /* @__PURE__ */ R(e, {
			fallback: null,
			children: /* @__PURE__ */ R(Ft, {
				label: s.label,
				className: "c-cue-text",
				live: !1
			})
		}) : n ? /* @__PURE__ */ R("p", {
			className: "c-cue-text",
			"data-testid": "breath-counter",
			children: Tt(c)
		}) : /* @__PURE__ */ R("p", {
			className: "c-cue-text",
			children: v.breathe
		}), /* @__PURE__ */ R(Et, {
			label: l ? s.label : c.label,
			on: n,
			announce: o
		})]
	})] });
}
function Lt({ engine: e, theme: t, announce: n = !0, sprint: i, openAdvanced: a = !1, onAdvancedShown: c, player: l, snap: u, still: d, favorite: f, onToggle: p, onFavorite: m, nature: h }) {
	let [g, _] = s(a), [y, b] = s(a);
	r(() => {
		a && (_(!0), b(!0), c?.());
	}, [a, c]);
	let x = o(null), S = () => {
		_(!1), b(!1), x.current?.focus();
	}, C = jt(e, u.playing), w = be.find((e) => e.templateId === u.templateId)?.evidence ?? "mixed", T = kt(i?.focus?.id ?? u.templateId, h.on !== null), E = j().find((e) => e.id === (i?.focus?.id ?? u.templateId));
	return /* @__PURE__ */ z("div", {
		className: "c-player",
		children: [
			/* @__PURE__ */ R("h1", {
				className: "c-h1",
				children: u.templateName ?? v.brand
			}),
			/* @__PURE__ */ R(It, {
				still: d,
				playing: u.playing,
				situation: T,
				theme: t,
				level: C,
				announce: n
			}),
			/* @__PURE__ */ R(Ze, { timer: u.timer }),
			/* @__PURE__ */ R("div", {
				className: "c-controls",
				children: /* @__PURE__ */ R("button", {
					type: "button",
					className: "c-btn c-primary c-big c-round",
					"data-testid": "player-toggle",
					onClick: p,
					children: u.playing ? v.stop : v.play
				})
			}),
			/* @__PURE__ */ R("button", {
				ref: x,
				type: "button",
				className: "c-btn c-ghost c-options-btn",
				"data-testid": "player-options",
				"aria-haspopup": "dialog",
				onClick: () => _(!0),
				children: v.optionsBtn
			}),
			g && /* @__PURE__ */ R(St, {
				player: l,
				snap: u,
				nature: h,
				favorite: f,
				evidence: w,
				onFavorite: m,
				onClose: S,
				engine: e,
				advancedOpen: y,
				...i !== void 0 && E !== void 0 ? { sprint: {
					onSprint: () => i.start(E),
					onSprintEnd: i.cancel
				} } : {}
			})
		]
	});
}
var Rt = "android-wakeful-relax-5", zt = {
	kind: "reset",
	seconds: 90,
	template: () => j().find((e) => e.id === Rt),
	title: v.resetTitle,
	intro: v.resetIntro,
	done: v.resetDoneLine,
	again: v.resetAgain,
	left: v.resetLeft
}, Bt = {
	kind: "breathe",
	seconds: 300,
	template: () => bt,
	title: v.breatheTitle,
	intro: v.breatheIntro,
	done: v.breatheDoneLine,
	again: v.breatheAgain,
	left: v.breatheLeft
};
function Vt(e, t = zt) {
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
function Ht({ s: e, still: t, theme: n, announce: r, onBack: i, plan: a = zt }) {
	let o = Vt(e, a), s = jt(e.engine, e.snap.playing), c = kt(e.snap.templateId, !1);
	return o.phase === "done" ? /* @__PURE__ */ R(Ut, {
		plan: a,
		onAgain: o.begin,
		onBack: i
	}) : /* @__PURE__ */ z("div", {
		className: "c-player c-reset",
		"data-testid": "reset-screen",
		"data-kind": a.kind,
		"data-phase": o.phase,
		children: [
			/* @__PURE__ */ R("h1", {
				className: "c-h1",
				children: a.title
			}),
			o.phase === "idle" && /* @__PURE__ */ R("p", {
				className: "c-lead",
				children: a.intro
			}),
			/* @__PURE__ */ R(It, {
				still: t,
				playing: o.phase === "running" && e.snap.playing,
				situation: c,
				theme: n,
				level: s,
				announce: r
			}),
			o.phase === "running" ? /* @__PURE__ */ z(L, { children: [/* @__PURE__ */ R("p", {
				className: "c-muted c-digits",
				"data-testid": "reset-left",
				"aria-hidden": "true",
				children: a.left(o.left)
			}), /* @__PURE__ */ R("div", {
				className: "c-controls",
				children: /* @__PURE__ */ R("button", {
					type: "button",
					className: "c-btn c-round c-big",
					"data-testid": "reset-stop",
					onClick: o.stop,
					children: v.stop
				})
			})] }) : /* @__PURE__ */ z("div", {
				className: "c-actions",
				children: [/* @__PURE__ */ R("button", {
					type: "button",
					className: "c-btn c-primary",
					"data-testid": "reset-begin",
					onClick: o.begin,
					children: v.resetStart
				}), /* @__PURE__ */ R("button", {
					type: "button",
					className: "c-btn c-link",
					onClick: i,
					children: v.resetBack
				})]
			}),
			/* @__PURE__ */ R("p", {
				className: "c-muted",
				children: v.volumeCapped
			})
		]
	});
}
function Ut({ plan: e, onAgain: t, onBack: n }) {
	let i = o(null);
	return r(() => i.current?.focus(), []), /* @__PURE__ */ z("div", {
		className: "c-end c-reset",
		"data-testid": "reset-end",
		children: [
			/* @__PURE__ */ R("h1", {
				className: "c-h1",
				children: v.endTitle
			}),
			/* @__PURE__ */ R("p", { children: e.done }),
			/* @__PURE__ */ R("p", {
				className: "c-muted",
				children: v.endNote
			}),
			/* @__PURE__ */ z("div", {
				className: "c-actions",
				children: [/* @__PURE__ */ R("button", {
					ref: i,
					type: "button",
					className: "c-btn c-primary",
					"data-testid": "reset-back",
					onClick: n,
					children: v.resetBack
				}), /* @__PURE__ */ R("button", {
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
var Wt = t(() => import("./chunk-Journeys-BGtAlsJH.mjs").then((e) => ({ default: e.JourneyList }))), Gt = t(() => import("./chunk-Journeys-BGtAlsJH.mjs").then((e) => ({ default: e.JourneyDetail }))), Kt = t(() => import("./chunk-Library-C7xrhrdJ.mjs").then((e) => ({ default: e.Library }))), qt = t(() => Promise.resolve().then(() => Mt).then((e) => ({ default: e.PlayerScreen }))), Jt = t(() => import("./chunk-CrewScreen-BAA4NUia.mjs").then((e) => ({ default: e.CrewScreen }))), Yt = t(() => import("./chunk-NatureScreen-B11jLxdI.mjs").then((e) => e.t).then((e) => ({ default: e.NatureScreen }))), Xt = t(() => import("./chunk-SettingsScreen-DTUSyG5Y.mjs").then((e) => ({ default: e.SettingsScreen })));
function Zt({ view: e, journeyId: t, s: n, data: r, crewInfo: i, nature: a, still: o, fav: s, last: c, look: l, prefs: d, onPrefs: f, feel: p, sprint: m, handlers: h }) {
	switch (e) {
		case "journeys": return /* @__PURE__ */ R(Wt, {
			progress: r.progress,
			onOpen: h.openJourney,
			reduced: o
		});
		case "journey": return /* @__PURE__ */ R(Gt, {
			id: t ?? "",
			profile: r.profile,
			progress: r.progress,
			todayDay: K(),
			onBack: () => h.go("journeys"),
			onStartJourney: r.setJourney,
			onRestart: (e) => r.setJourney(e, null),
			onPlayDay: h.playDay
		});
		case "library": return /* @__PURE__ */ R(Kt, {
			store: n.store,
			logs: r.logs,
			reduced: o,
			onNature: () => h.go("nature"),
			onPlay: h.play,
			onPlayMix: h.onMix,
			onBreathe: () => h.go("breathe")
		});
		case "nature": return /* @__PURE__ */ R(Yt, {
			nature: a,
			reduced: o,
			onBack: () => h.go("library")
		});
		case "player": return /* @__PURE__ */ R(qt, {
			player: n.player,
			snap: n.snap,
			still: o,
			favorite: s.on,
			onToggle: n.toggle,
			onFavorite: s.toggle,
			nature: a,
			engine: n.engine,
			theme: l.theme,
			announce: d.announce,
			sprint: m,
			openAdvanced: h.advancedPending,
			onAdvancedShown: h.advancedShown
		});
		case "reset": return /* @__PURE__ */ R(Ht, {
			s: n,
			still: o,
			theme: l.theme,
			announce: d.announce,
			onBack: () => h.go("today")
		});
		case "breathe": return /* @__PURE__ */ R(Ht, {
			s: n,
			still: o,
			theme: l.theme,
			announce: d.announce,
			onBack: () => h.go("today"),
			plan: Bt
		});
		case "crew": return /* @__PURE__ */ R(Jt, {
			crew: i,
			overridden: n.snap.overridden,
			onDemo: () => n.guarded(() => lt(n.player)),
			onStopDemo: () => Y(n.player),
			onNotNow: () => u(n.player),
			onResume: () => g(n.player),
			onFollow: () => n.player.followCrew()
		});
		case "settings": return /* @__PURE__ */ R(Xt, {
			gentle: r.profile.extraGentle,
			reduceMotion: n.userReduced,
			reduced: o,
			onGentle: (e) => r.setProfile({
				...r.profile,
				extraGentle: e
			}),
			onReduceMotion: n.setReduced,
			onStudio: h.onStudio,
			onForget: h.forget,
			prefs: d,
			onPrefs: f,
			onGuide: h.openGuide
		});
		default: return /* @__PURE__ */ R(vt, {
			profile: r.profile,
			week: r.week,
			progress: r.progress,
			reduced: o,
			hasHistory: r.logs.some((e) => W(e.startedAt) < K()),
			joinedToday: W(r.profile.createdAt) === K(),
			crewConnected: i.enabled && i.status === "connected",
			last: c,
			feel: p,
			onSprint: (e) => {
				m.start(e), h.go("player");
			},
			onPlay: h.play,
			onOpenJourney: h.openJourney,
			onGo: h.go,
			onReset: () => h.go("reset"),
			onBreathe: () => h.go("breathe"),
			onGuide: h.openGuide
		});
	}
}
// ../../web/src/ui/calm/nature/active.ts
var Z = null, Qt = () => Z, $t = (e) => void (Z = e);
function en() {
	Z !== null && (Z = null, import("./chunk-samples-4EZJclX4.mjs").then((e) => e.n).then((e) => e.stopSample()).catch(() => void 0));
}
// ../../web/src/ui/calm/nature/useNature.ts
var Q = () => import("./chunk-samples-4EZJclX4.mjs").then((e) => e.n);
async function tn(e, t) {
	let n = await Q();
	if (!ke(e)) return n.startSample(e, t);
	let r = await Oe(e);
	return r.ok ? n.startOwn(e, r.value, t) : {
		ok: !1,
		error: r.error
	};
}
function nn(e) {
	let [t, i] = s(Ce), [a, c] = s(Qt), [l, u] = s(""), d = o(t);
	d.current = t;
	let { player: f, guarded: p } = e;
	r(() => {
		e.snap.playing || (en(), c(null));
	}, [e.snap.playing]);
	let m = n(async (e) => {
		if (u(""), f.snapshot().playing || await f.play(), !f.snapshot().playing) return void u(v.errorAudio);
		(await Q()).setBlend(d.current.blend);
		let t = await tn(e, d.current.level);
		if (!t.ok) return void u(t.error);
		t.note !== void 0 && u(t.note), $t(e), c(e);
		let n = {
			...d.current,
			id: e
		};
		i(n), H(n);
	}, [f]), h = n((e) => p(() => void m(e)), [p, m]), g = n(() => {
		$t(null), c(null), Q().then((e) => e.stopSample());
	}, []), _ = n((e, t) => {
		let n = {
			...d.current,
			...e
		};
		i(n), H(n), Qt() !== null && Q().then(t);
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
async function rn() {
	we(), await De();
}
// src/engine/useSession.ts
function an() {
	let { player: e, store: t, engine: i } = S(), [a, c] = s(() => e.snapshot()), [l, u] = s(D), [d, f] = s(!1), [p, m, h] = b(), g = o(null), _ = o(l);
	r(() => (c(e.snapshot()), e.subscribe(c)), [e]);
	let v = n((e) => {
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
		guarded: v,
		accept: n(() => {
			A(k, !0), _.current = !0, u(!0), f(!1);
			let e = g.current;
			g.current = null, e?.();
		}, []),
		cancelGate: n(() => {
			g.current = null, f(!1);
		}, []),
		playTemplate: n((t, n) => v(() => {
			e.setQueue([t]), e.playTemplate(t).then((t) => {
				t && n !== null && e.startTimer(typeof n == "number" ? {
					kind: "countdown",
					minutes: n
				} : n);
			});
		}), [e, v]),
		toggle: n(() => {
			e.snapshot().playing ? e.stop() : v(() => void e.play());
		}, [e, v])
	};
}
// ../../web/src/ui/calm/Guide.tsx
var on = "zonked.guide.v1", sn = (e) => {
	try {
		return e.get(on) === "1";
	} catch {
		return !1;
	}
}, cn = (e) => {
	try {
		e.set(on, "1");
	} catch {}
};
function ln({ reduced: e, onClose: t, onCrew: n }) {
	let [i, a] = s(0), c = o(null);
	r(() => c.current?.querySelector("h2")?.focus(), [i]);
	let l = v.guideCards[i] ?? v.guideCards[0], u = i === v.guideCards.length - 1;
	return /* @__PURE__ */ R("div", {
		className: "c-overlay",
		children: /* @__PURE__ */ z("div", {
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
				/* @__PURE__ */ z("div", {
					className: "c-fhead",
					children: [/* @__PURE__ */ R(I, {
						size: 72,
						mood: "happy",
						reduced: e
					}), /* @__PURE__ */ z("div", {
						className: "c-fhead-text",
						children: [/* @__PURE__ */ R("p", {
							className: "c-step",
							children: v.guideStep(i + 1)
						}), /* @__PURE__ */ R("div", {
							className: "c-bar",
							"aria-hidden": "true",
							children: v.guideCards.map((e, t) => /* @__PURE__ */ R("i", { "data-on": t <= i ? "true" : "false" }, e.title))
						})]
					})]
				}),
				/* @__PURE__ */ R("h2", {
					id: "c-guide-title",
					className: "c-ftitle",
					tabIndex: -1,
					children: l?.title
				}),
				/* @__PURE__ */ R("p", {
					className: "c-helper",
					children: l?.body
				}),
				i === 2 && /* @__PURE__ */ R("button", {
					type: "button",
					className: "c-btn c-ghost c-guide-crew",
					onClick: n,
					children: v.guideCrewLink
				}),
				/* @__PURE__ */ R(B, {
					left: {
						label: v.guideSkip,
						onClick: t,
						testid: "guide-skip"
					},
					next: {
						label: u ? v.guideDone : v.next,
						onClick: u ? t : () => a(i + 1),
						testid: "guide-next"
					}
				}),
				!u && /* @__PURE__ */ R("p", {
					className: "c-guide-done",
					children: /* @__PURE__ */ R("button", {
						type: "button",
						className: "c-btn c-ghost",
						"data-testid": "guide-done",
						onClick: t,
						children: v.guideDone
					})
				})
			]
		})
	});
}
// ../../web/src/ui/calm/Painted.tsx
function un(e) {
	let t = Number.isFinite(e) ? (Math.floor(e) % 24 + 24) % 24 : 12;
	return t >= 5 && t < 8 ? "dawn" : t >= 8 && t < 17 ? "day" : t >= 17 && t < 20 ? "dusk" : "night";
}
function dn({ hour: e = (/* @__PURE__ */ new Date()).getHours() }) {
	let t = `pt${i().replace(/[^a-zA-Z0-9]/g, "")}`, n = un(e);
	return /* @__PURE__ */ z("svg", {
		className: "pt",
		"data-tod": n,
		viewBox: "0 0 1600 900",
		preserveAspectRatio: "xMidYMax slice",
		"aria-hidden": "true",
		focusable: "false",
		"data-testid": "painted",
		children: [
			/* @__PURE__ */ z("defs", { children: [
				/* @__PURE__ */ z("linearGradient", {
					id: `${t}-sky`,
					x1: "0",
					y1: "0",
					x2: "0",
					y2: "1",
					children: [
						/* @__PURE__ */ R("stop", {
							offset: "0",
							className: "pt-s1"
						}),
						/* @__PURE__ */ R("stop", {
							offset: "0.6",
							className: "pt-s2"
						}),
						/* @__PURE__ */ R("stop", {
							offset: "1",
							className: "pt-s3"
						})
					]
				}),
				/* @__PURE__ */ z("radialGradient", {
					id: `${t}-glow`,
					children: [/* @__PURE__ */ R("stop", {
						offset: "0",
						className: "pt-gl",
						stopOpacity: "0.9"
					}), /* @__PURE__ */ R("stop", {
						offset: "1",
						className: "pt-gl",
						stopOpacity: "0"
					})]
				}),
				/* @__PURE__ */ R("filter", {
					id: `${t}-soft`,
					x: "-2%",
					y: "-2%",
					width: "104%",
					height: "104%",
					children: /* @__PURE__ */ R("feGaussianBlur", { stdDeviation: "2.5" })
				}),
				/* @__PURE__ */ R("filter", {
					id: `${t}-cloud`,
					x: "-20%",
					y: "-50%",
					width: "140%",
					height: "200%",
					children: /* @__PURE__ */ R("feGaussianBlur", { stdDeviation: "9" })
				}),
				/* @__PURE__ */ z("filter", {
					id: `${t}-grain`,
					x: "0",
					y: "0",
					width: "100%",
					height: "100%",
					children: [/* @__PURE__ */ R("feTurbulence", {
						type: "fractalNoise",
						baseFrequency: "0.8",
						numOctaves: "2",
						seed: "11"
					}), /* @__PURE__ */ R("feColorMatrix", { values: "0 0 0 0 0.3  0 0 0 0 0.25  0 0 0 0 0.2  0 0 0 0.9 -0.25" })]
				})
			] }),
			/* @__PURE__ */ R("rect", {
				width: "1600",
				height: "900",
				fill: `url(#${t}-sky)`
			}),
			/* @__PURE__ */ R("circle", {
				className: "pt-orb",
				cx: "1180",
				cy: "250",
				r: "260",
				fill: `url(#${t}-glow)`
			}),
			/* @__PURE__ */ z("g", {
				className: "pt-clouds",
				filter: `url(#${t}-cloud)`,
				children: [
					/* @__PURE__ */ z("g", {
						className: "pt-cloud pt-c1",
						children: [/* @__PURE__ */ R("ellipse", {
							cx: "300",
							cy: "190",
							rx: "190",
							ry: "34"
						}), /* @__PURE__ */ R("ellipse", {
							cx: "400",
							cy: "168",
							rx: "120",
							ry: "30"
						})]
					}),
					/* @__PURE__ */ z("g", {
						className: "pt-cloud pt-c2",
						children: [/* @__PURE__ */ R("ellipse", {
							cx: "900",
							cy: "120",
							rx: "150",
							ry: "26"
						}), /* @__PURE__ */ R("ellipse", {
							cx: "970",
							cy: "104",
							rx: "90",
							ry: "22"
						})]
					}),
					/* @__PURE__ */ z("g", {
						className: "pt-cloud pt-c3",
						children: [/* @__PURE__ */ R("ellipse", {
							cx: "1380",
							cy: "300",
							rx: "170",
							ry: "28"
						}), /* @__PURE__ */ R("ellipse", {
							cx: "1300",
							cy: "284",
							rx: "100",
							ry: "24"
						})]
					})
				]
			}),
			/* @__PURE__ */ z("g", {
				filter: `url(#${t}-soft)`,
				children: [
					/* @__PURE__ */ R("path", {
						className: "pt-h1",
						d: "M-40 620C200 540 420 540 640 600C860 660 1080 560 1300 540C1440 528 1540 560 1640 590V900H-40Z"
					}),
					/* @__PURE__ */ R("path", {
						className: "pt-h2",
						d: "M-40 720C240 640 480 680 720 720C960 760 1200 660 1420 660C1500 660 1580 680 1640 700V900H-40Z"
					}),
					/* @__PURE__ */ R("path", {
						className: "pt-h3",
						d: "M-40 820C260 770 520 800 800 830C1060 858 1300 790 1640 800V900H-40Z"
					})
				]
			}),
			/* @__PURE__ */ R("rect", {
				className: "pt-grain",
				width: "1600",
				height: "900",
				filter: `url(#${t}-grain)`
			}),
			/* @__PURE__ */ R("rect", {
				className: "pt-veil",
				width: "1600",
				height: "900"
			})
		]
	});
}
// ../../web/src/ui/calm/useCrewBridge.ts
function fn(e, t) {
	let [n, i] = s("standalone"), [a, o] = s(() => te());
	return r(() => ne(o), []), r(() => {
		let n = !1, r = new x({
			...t === void 0 ? {} : { create: t },
			onStatus: (t) => {
				i(t), t === "standalone" && (E().source !== "demo" && e.crewLost(), n && h(), n = !1);
			},
			onState: (t) => {
				n = !0, m(e, t);
			}
		});
		return r.start(), () => r.stop();
	}, [e, t]), {
		enabled: a,
		status: n,
		view: c(p, E, E)
	};
}
// ../../web/src/ui/calm/useFeel.ts
function pn(e, t = Date.now) {
	let [r, i] = s(() => se(e)), o = n((n, r) => {
		i((i) => {
			let a = ve(i, {
				id: n,
				a: r,
				day: W(t())
			});
			return de(e, a), a;
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
var mn = {
	kind: "pomodoro",
	focusMin: 25,
	breakMin: 5
}, hn = ["starter-rain", "starter-deep"], gn = .8, _n = 6e3, vn = {
	chimeLevel: .25,
	chimeRatePerMin: 10
};
function yn(e, t) {
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
function bn(e, t) {
	let n = hn.find((t) => t !== e);
	return t.find((e) => e.id === n);
}
function xn(e, t) {
	return !Number.isFinite(e) || !Number.isFinite(t) ? 0 : Math.round(Math.min(0, e * gn - t) * 1e3) / 1e3;
}
async function Sn(e, t, n = (e, t) => window.setTimeout(e, t)) {
	let r = e.snapshot().voice.gain;
	e.setLayerOverride(vn), n(() => e.clearLayerOverrides(), _n), await e.playTemplate(t) && e.nudgeGain(xn(r, e.snapshot().voice.gain));
}
// ../../web/src/ui/calm/useSprint.ts
function Cn(e) {
	let [t, i] = s(null), c = o(!1), { player: l, guarded: u } = e, { playing: d, templateId: f, timer: p } = e.snap, m = n(() => {
		i(null), l.stopTimer();
	}, [l]), h = n((e) => u(() => {
		c.current = !1;
		let t = () => {
			l.startTimer(mn), i({
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
		let e = yn(t.phase, p);
		if (e.action === "cancel") return i(null);
		if (e.action === null) d && f !== t.focus.id && f !== t.breakId && m();
		else if (e.action === "break") {
			let e = bn(t.focus.id, j());
			i({
				...t,
				phase: "break",
				breakId: e?.id ?? null
			}), e !== void 0 && Sn(l, e);
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
function wn(e, t) {
	let [i, a] = s(Ne);
	r(() => {
		let t = !0;
		return e.getRecord("favorites").then((e) => t && a(Me(e, Date.now()))).catch(() => void 0), () => {
			t = !1;
		};
	}, [e]);
	let o = n(() => {
		if (t === null) return;
		let n = Ae(i, "template", t, Date.now());
		a(n), e.setRecord("favorites", n).catch(() => void 0);
	}, [
		i,
		t,
		e
	]);
	return {
		on: t !== null && je(i, "template", t),
		toggle: o
	};
}
// ../../web/src/ui/calm/CalmApp.tsx
var Tn = t(() => import("./chunk-Onboarding-BBWLB4Yj.mjs").then((e) => ({ default: e.Onboarding }))), En = (e) => Math.max(180, e * 60 * .8);
function Dn({ engine: t, clock: r, store: i, bridgeCreate: a }) {
	let c = an(t, r, i), l = et(c.store, c.snap.playing), u = fn(c.player, a), d = nn(c), [f, p] = s("today"), [m, h] = s(null), g = o(null), _ = wn(c.store, c.snap.templateId), y = pn(l.storage), b = Cn(c), x = l.profile.createdAt === 0, S = Mn(l.storage), C = Ge(c.snap, !x && f !== "reset" && f !== "breathe", b.focus === null ? null : {
		id: b.focus.id,
		name: v.sprintName
	}), w = c.reduced || l.profile.extraGentle, [T, E] = s(!1), [ee, te] = s(() => sn(l.storage)), D = () => {
		cn(l.storage), te(!0), E(!1);
	}, { look: O, prefs: ne, dim: k, setPrefs: A } = Ee(), [j, M] = s(!1), N = n(() => {
		M(!0), p("player");
	}, []), re = n(() => M(!1), []);
	Nn(N);
	let P = n((e) => p(e), []), { play: F, playDay: I, finish: L } = An({
		s: c,
		data: l,
		last: S,
		end: C,
		active: g,
		setView: p
	});
	return In(c.snap.playing, c.snap.elapsedSec, g, l.progress, l.setJourney), /* @__PURE__ */ z("div", {
		className: "c-app",
		"data-theme": O.theme,
		"data-contrast": O.highContrast ? "high" : "normal",
		"data-view": f,
		"data-dim": k ? "true" : "false",
		"data-motion": w ? "off" : "on",
		"data-playing": c.snap.playing ? "true" : "false",
		children: [
			/* @__PURE__ */ R(dn, {}),
			/* @__PURE__ */ R(Fn, {}),
			/* @__PURE__ */ R(Pn, { engine: t }),
			u.view.source === "demo" && /* @__PURE__ */ R("p", {
				className: "c-badge-sim",
				role: "status",
				"data-testid": "demo-badge",
				children: v.crewDemoBadge
			}),
			/* @__PURE__ */ R("main", {
				id: "c-main",
				className: "c-main",
				tabIndex: -1,
				children: /* @__PURE__ */ R("div", {
					className: "c-sheet",
					children: /* @__PURE__ */ R(e, {
						fallback: /* @__PURE__ */ R("p", {
							className: "c-loading",
							role: "status",
							children: v.loading
						}),
						children: x ? /* @__PURE__ */ R(Tn, {
							playing: c.snap.playing,
							reduced: w,
							initial: l.profile,
							onAccept: c.accept,
							onPreview: (e) => c.playTemplate(e, null),
							onStop: () => void c.player.stop(),
							onFinish: L
						}) : /* @__PURE__ */ R(Zt, {
							view: f,
							journeyId: m,
							s: c,
							data: l,
							crewInfo: u,
							nature: d,
							still: w,
							fav: _,
							last: S.template,
							look: O,
							prefs: ne,
							onPrefs: A,
							feel: y.entries,
							sprint: b,
							handlers: {
								go: P,
								play: F,
								playDay: I,
								openJourney: (e) => {
									h(e), p("journey");
								},
								forget: () => {
									fe(l.storage), y.clear(), d.stop(), rn(), l.setProfile(_e), p("today");
								},
								onStudio: N,
								advancedPending: j,
								advancedShown: re,
								onMix: (e) => c.guarded(() => c.player.playMix(e)),
								openGuide: () => E(!0)
							}
						})
					})
				})
			}),
			!x && f !== "player" && f !== "reset" && f !== "breathe" && f !== "crew" && /* @__PURE__ */ R(Le, {
				snap: c.snap,
				crewPresetId: u.view.state?.target.presetId ?? null,
				onOpen: () => P("player"),
				onStop: () => void c.player.stop()
			}),
			!x && /* @__PURE__ */ R(Fe, {
				view: f,
				onGo: P,
				reduced: w
			}),
			/* @__PURE__ */ R("p", {
				className: "c-sr",
				role: "status",
				"data-testid": "play-status",
				children: c.snap.playing ? `Playing. ${v.volumeCapped}` : "Stopped."
			}),
			C.card !== null && !c.snap.playing && /* @__PURE__ */ R(On, {
				card: C.card,
				play: F,
				dismiss: C.dismiss,
				feel: y,
				firstRun: W(l.profile.createdAt) === K()
			}),
			(T || !ee && !x && C.card !== null && !c.snap.playing) && /* @__PURE__ */ R(ln, {
				reduced: w,
				onClose: D,
				onCrew: () => {
					D(), P("crew");
				}
			}),
			c.gate && /* @__PURE__ */ R(ye, {
				onAccept: c.accept,
				onCancel: c.cancelGate
			})
		]
	});
}
function On({ card: e, play: t, dismiss: n, feel: r, firstRun: i }) {
	return /* @__PURE__ */ R(Je, {
		info: e,
		onAgain: () => jn(e.id, t),
		onClose: n,
		firstRun: i,
		onFeel: (t) => r.answer(e.id, t)
	});
}
function kn(e, t) {
	return t === null ? null : e === "sleep" ? {
		kind: "sleep-fade",
		minutes: Math.max(20, t)
	} : {
		kind: "countdown",
		minutes: t
	};
}
function An({ s: e, data: t, last: r, end: i, active: a, setView: o }) {
	let s = n((n, s = n.recommendedMinutes, c = t.profile.goal) => {
		a.current = null, r.remember(n.id), i.dismiss(), e.playTemplate(n, kn(c, s)), o("player");
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
				needSec: En(n.recommendedMinutes)
			};
		},
		finish: (n, i) => {
			if (t.setProfile(n), !e.snap.playing || e.snap.templateId !== i.id) return s(i, i.recommendedMinutes, n.goal);
			r.remember(i.id), e.player.startTimer(kn(n.goal, i.recommendedMinutes) ?? {
				kind: "countdown",
				minutes: i.recommendedMinutes
			}), o("player");
		}
	};
}
var $ = (e) => e === null ? null : j().find((t) => t.id === e) ?? null;
function jn(e, t) {
	let n = $(e);
	n !== null && t(n);
}
function Mn(e) {
	let [t, r] = s(() => le(e)), i = a(() => $(t), [t]), o = n((t) => {
		ge(e, t), r(t);
	}, [e]);
	return a(() => ({
		template: i,
		remember: o
	}), [i, o]);
}
function Nn(e) {
	r(() => {
		let t = (t) => {
			t.altKey && t.shiftKey && t.code === "KeyS" && (t.preventDefault(), e());
		};
		return window.addEventListener("keydown", t), () => window.removeEventListener("keydown", t);
	}, [e]);
}
function Pn({ engine: e }) {
	let [t, n] = s(() => e.status.state === "error" ? e.status.error ?? "" : null);
	return r(() => e.onStatus((e) => n(e.state === "error" ? e.error ?? "" : null)), [e]), t === null ? null : /* @__PURE__ */ R("p", {
		className: "c-note",
		role: "status",
		"data-testid": "engine-notice",
		children: t === "audio-unsupported" ? v.unsupported : v.errorAudio
	});
}
function Fn() {
	return /* @__PURE__ */ z(L, { children: [/* @__PURE__ */ R("a", {
		className: "c-skip",
		href: "#c-main",
		children: "Skip to content"
	}), /* @__PURE__ */ R("header", {
		className: "c-topbar",
		children: /* @__PURE__ */ R("span", {
			className: "c-brand",
			children: v.brand
		})
	})] });
}
function In(e, t, n, i, a) {
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
var Ln = {
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
function Rn() {
	T(import.meta.url), O();
	let { engine: e, store: t } = S();
	r(() => (w(!0), () => w(!1)), []);
	let [n, i] = s(!1);
	return /* @__PURE__ */ z("div", {
		"data-testid": "zonked-app",
		style: {
			height: "100%",
			minHeight: 0,
			overflow: "hidden",
			position: "relative",
			transform: "translateZ(0)"
		},
		children: [/* @__PURE__ */ R("div", {
			style: {
				height: "100%",
				overflowY: "auto"
			},
			children: /* @__PURE__ */ R(Dn, {
				engine: e,
				store: t,
				onStudio: () => i(!0)
			})
		}), n && /* @__PURE__ */ R("p", {
			role: "status",
			style: Ln,
			"data-testid": "studio-note",
			onClick: () => i(!1),
			children: "Studio, the advanced mode, is not in the Kiro Crew app yet. Tap to close."
		})]
	});
}
export { Rn as default };
