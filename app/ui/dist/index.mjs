import { Suspense as e, lazy as t, useCallback as n, useEffect as r, useId as i, useMemo as a, useRef as o, useState as s, useSyncExternalStore as c } from "react";
import { G as l, J as u, K as d, U as f, V as p, W as m, Y as h, _t as g, a as _, d as v, dt as y, h as b, ht as x, i as S, lt as C, o as w, p as T, q as E, r as D, s as O, st as k, v as ee, x as te, y as A } from "./chunk-crewLink-B-5l2pQt.mjs";
import { a as j, l as ne, o as re, u as ie } from "./chunk-catalog-DQXidRzG.mjs";
import { r as M, t as N } from "./chunk-RangeField-D77jQUlk.mjs";
import { t as P } from "./chunk-icons-C-FdU5cO.mjs";
import { t as F } from "./chunk-MascotView-BrlUzit0.mjs";
import { Fragment as I, jsx as L, jsxs as R } from "react/jsx-runtime";
import { C as z, D as B, T as ae, _ as oe, a as se, b as ce, c as V, d as le, f as ue, g as de, h as fe, l as pe, m as me, n as he, o as ge, p as _e, r as ve, s as ye, t as be, u as xe, v as Se, x as Ce, y as we } from "./chunk-data-DrI3L2nM.mjs";
import { t as H } from "./chunk-useEscape-DDjzYcK_.mjs";
import { t as Te } from "./chunk-SafetyNotice-CJuWch_-.mjs";
import { c as Ee } from "./chunk-milestones-Bmiu2MXR.mjs";
import { n as De } from "./chunk-FormFrame-BoSz-j25.mjs";
import { r as Oe, t as ke } from "./chunk-samples-_x0GtVlI.mjs";
import { a as Ae, c as je, i as Me, n as Ne, o as Pe, r as Fe, s as Ie } from "./chunk-NatureScreen-QpnFXjpL.mjs";
import { n as Le } from "./chunk-useBreath-BZ3euK4B.mjs";
import { n as Re } from "./chunk-look-C_f0p27a.mjs";
import { a as ze, n as Be, r as Ve } from "./chunk-ownStore-BhAw3wjz.mjs";
import { a as He, n as Ue, r as We, t as Ge } from "./chunk-favorites-D5uR-Ors.mjs";
// ../../web/src/ui/calm/CalmChrome.tsx
var Ke = [
	{
		view: "today",
		label: k.nav[0],
		icon: "today"
	},
	{
		view: "library",
		label: k.nav[1],
		icon: "library"
	},
	{
		view: "crew",
		label: k.nav[2],
		icon: "crew"
	},
	{
		view: "settings",
		label: k.nav[3],
		icon: "settings"
	}
];
function qe({ view: e, onGo: t, reduced: n = !1 }) {
	let r = e === "journey" || e === "journeys" ? "today" : e === "nature" ? "library" : e === "reset" || e === "breathe" ? "today" : e;
	return /* @__PURE__ */ R("nav", {
		className: "c-tabbar",
		"aria-label": "Main",
		children: [/* @__PURE__ */ R("div", {
			className: "c-rail-brand",
			"aria-hidden": "true",
			children: [/* @__PURE__ */ L(F, {
				size: 40,
				reduced: n
			}), /* @__PURE__ */ L("span", {
				className: "c-brand",
				children: k.brand
			})]
		}), Ke.map((e) => /* @__PURE__ */ R("button", {
			type: "button",
			className: "c-nav",
			"aria-current": r === e.view ? "page" : void 0,
			onClick: () => t(e.view),
			children: [/* @__PURE__ */ L(P, { name: e.icon }), /* @__PURE__ */ L("span", { children: e.label })]
		}, e.view))]
	});
}
function Je(e, t = null) {
	if (e.templateName !== null) return e.templateName;
	let n = e.source === "crew", r = n ? t ?? e.presetId : e.presetId, i = g.find((e) => e.id === r)?.name;
	return i === void 0 ? k.brand : n ? `Crew: ${i}` : i;
}
function Ye({ snap: e, crewPresetId: t = null, onOpen: n, onStop: r }) {
	if (!e.playing) return null;
	let i = e.timer.kind !== "none" && e.timer.running ? M(e.timer.remainingSec) : "";
	return /* @__PURE__ */ R("div", {
		className: "c-mini",
		role: "region",
		"aria-label": "Now playing",
		children: [/* @__PURE__ */ R("button", {
			type: "button",
			className: "c-btn c-link c-mini-open",
			onClick: n,
			children: [Je(e, t), i !== "" && /* @__PURE__ */ L("span", {
				className: "c-digits",
				children: ` ${i}`
			})]
		}), /* @__PURE__ */ L("button", {
			type: "button",
			className: "c-btn c-small",
			"data-testid": "mini-stop",
			onClick: r,
			children: k.stop
		})]
	});
}
var Xe = 864e5, Ze = 4;
function U(e) {
	if (!Number.isFinite(e)) return 0;
	let t = new Date(e).getTimezoneOffset() * 6e4;
	return Math.floor((e - t) / Xe);
}
var Qe = (e) => Number.isInteger(e) && e >= 0 && e < 1e7;
function $e(e) {
	return Number.isFinite(e) ? Math.min(7, Math.max(1, Math.floor(e))) : Ze;
}
function et(e) {
	return e - (e + 3) % 7;
}
function tt(e, t, n) {
	let r = /* @__PURE__ */ new Map();
	for (let i of e) {
		if (!Qe(i.day) || i.day < t || i.day > n) continue;
		let e = Number.isFinite(i.minutes) && i.minutes > 0 ? i.minutes : 0;
		r.set(i.day, (r.get(i.day) ?? 0) + e);
	}
	let i = /* @__PURE__ */ new Set();
	return r.forEach((e, t) => {
		e >= 3 && i.add(t);
	}), i;
}
function nt(e, t, n) {
	return n.has(e) ? "listened" : e === t ? "today" : e > t ? "upcoming" : "rest";
}
function rt(e, t, n = Ze) {
	let r = $e(n);
	if (!Qe(t)) {
		let e = Object.freeze(Array.from({ length: 7 }, () => "upcoming"));
		return Object.freeze({
			daysListened: 0,
			goalDays: r,
			goalMet: !1,
			quietWeek: !0,
			dots: e
		});
	}
	let i = et(t), a = tt(e, i, t), o = Object.freeze(Array.from({ length: 7 }, (e, n) => nt(i + n, t, a)));
	return Object.freeze({
		daysListened: a.size,
		goalDays: r,
		goalMet: a.size >= r,
		quietWeek: a.size === 0,
		dots: o
	});
}
// ../../web/src/ui/calm/data/forget.ts
var it = "zonked.", at = "zonked-samples";
async function ot(e, t, n = st(), r = ct()) {
	if (xe(e), n !== void 0) try {
		for (let e of Object.keys(n)) e.startsWith(it) && n.removeItem(e);
	} catch {}
	await W(t.clearSanctuary()), await W(t.listScripts().then((e) => Promise.all(e.map((e) => t.deleteScript(e.id))))), r !== void 0 && await W(r.delete(at));
}
var W = async (e) => {
	try {
		await e;
	} catch {}
};
function st() {
	try {
		return typeof localStorage > "u" ? void 0 : localStorage;
	} catch {
		return;
	}
}
function ct() {
	try {
		return typeof caches > "u" ? void 0 : caches;
	} catch {
		return;
	}
}
function lt(e) {
	if (e.kind === "sleep-fade") return e.totalSec >= 7200 ? 3 : 4;
	if (e.kind === "pomodoro") return 5;
	if (e.kind !== "countdown") return -1;
	let t = Math.round(e.totalSec / 60);
	return t === 15 ? 0 : t === 30 ? 1 : t === 60 ? 2 : -1;
}
function ut({ timer: e, player: t, onSprint: n, onSprintEnd: r, hideUntilStop: i = !1 }) {
	let a = (i) => {
		if (i === 5) return e.kind === "pomodoro" ? r?.() : n?.();
		r?.(), i <= 2 ? t.startTimer({
			kind: "countdown",
			minutes: [
				15,
				30,
				60
			][i] ?? 15
		}) : i === 3 ? t.startTimer({
			kind: "sleep-fade",
			minutes: 120
		}) : t.startTimer({
			kind: "sleep-fade",
			minutes: 20
		});
	}, o = lt(e);
	return /* @__PURE__ */ R("div", { children: [/* @__PURE__ */ L("div", {
		className: "c-chips",
		role: "group",
		"aria-label": "Timer",
		children: k.timerChips.map((e, t) => t === 5 && n === void 0 || t === 3 && i ? null : /* @__PURE__ */ L("button", {
			type: "button",
			"aria-pressed": o === t,
			className: "c-tchip",
			onClick: () => a(t),
			children: e
		}, e))
	}), !i && /* @__PURE__ */ L("p", {
		className: "c-muted",
		"data-testid": "until-stop-hint",
		children: V.untilStopHint
	})] });
}
function dt({ timer: e }) {
	return e.kind === "none" || !e.running ? null : /* @__PURE__ */ R("p", {
		className: "c-time",
		"data-testid": "time-left",
		children: [e.kind === "pomodoro" ? `${e.phase === "break" ? k.sprintBreakLeft : k.sprintFocusLeft} ` : "", M(e.remainingSec)]
	});
}
// ../../web/src/ui/calm/calmCard.ts
var G = 1080, ft = 40, K = [
	"A quiet moment, all yours.",
	"Soft sound, made on this device.",
	"Easy does it.",
	"Slow and gentle is fine."
];
function pt(e) {
	let t = 0;
	for (let n of e) t = t * 31 + n.charCodeAt(0) >>> 0;
	return K[t % K.length] ?? K[0] ?? "";
}
function mt(e) {
	let t = e.name.replace(/[\u0000-\u001f\u007f]/g, " ").trim().slice(0, ft) || k.brand, n = Number.isFinite(e.minutes) ? Math.max(0, Math.round(e.minutes)) : 0;
	return {
		name: t,
		time: n < 1 ? "under a minute" : n === 1 ? "1 minute" : `${n} minutes`,
		line: pt(t)
	};
}
function q(e, t, n, r, i) {
	let a = n;
	for (e.font = `${r} ${a}px system-ui, sans-serif`; a > 24 && e.measureText(t).width > i;) a -= 4, e.font = `${r} ${a}px system-ui, sans-serif`;
}
function ht(e, t, n, r) {
	let i = r / 200, a = (r) => {
		e.fillStyle = "#B8624A", e.beginPath(), e.ellipse(t + r * i, n, 34 * i, 60 * i, 0, 0, Math.PI * 2), e.fill();
	};
	a(-196), a(196);
	let o = e.createLinearGradient(t - r, n - r, t + r * .6, n + r);
	o.addColorStop(0, "#FBD84A"), o.addColorStop(1, "#E8A128"), e.fillStyle = o, e.strokeStyle = "#3A2A2E", e.lineWidth = 8 * i, e.beginPath(), e.arc(t, n, r, 0, Math.PI * 2), e.fill(), e.stroke(), e.fillStyle = "#3F3247";
	for (let r of [-1, 1]) e.beginPath(), e.ellipse(t + r * 78 * i, n + 56 * i, 70 * i, 52 * i, r * .2, 0, Math.PI * 2), e.fill();
	e.fillStyle = "#00E5A8", e.beginPath(), e.ellipse(t, n + 60 * i, 13 * i, 16 * i, 0, 0, Math.PI * 2), e.fill(), e.strokeStyle = "#FFE9A8", e.lineWidth = 9 * i, e.lineCap = "round";
	for (let r of [-1, 1]) e.beginPath(), e.arc(t + r * 78 * i, n + 52 * i, 26 * i, Math.PI * 1.15, Math.PI * 1.85), e.stroke();
	e.strokeStyle = "#3A2A2E", e.lineWidth = 11 * i, e.beginPath(), e.arc(t, n + 108 * i, 52 * i, Math.PI * .15, Math.PI * .85), e.stroke();
}
function gt(e, t, n = G) {
	let r = mt(t), i = e.createLinearGradient(0, 0, 0, n);
	i.addColorStop(0, "#FFF3D6"), i.addColorStop(1, "#F6D9E0"), e.fillStyle = i, e.fillRect(0, 0, n, n), ht(e, n / 2, n * .35, n * .2), e.textAlign = "center", e.textBaseline = "alphabetic", e.fillStyle = "#2B2233", q(e, r.name, 76, "700", n * .84), e.fillText(r.name, n / 2, n * .68), e.fillStyle = "#4C4256", q(e, r.time, 52, "400", n * .84), e.fillText(r.time, n / 2, n * .76), q(e, r.line, 46, "400", n * .84), e.fillText(r.line, n / 2, n * .84), e.fillStyle = "#6B6075", q(e, k.brand, 40, "600", n * .5), e.fillText(k.brand, n / 2, n * .94);
}
function _t(e, t = document) {
	return new Promise((n, r) => {
		let i = t.createElement("canvas");
		i.width = G, i.height = G;
		let a = i.getContext("2d");
		if (a === null) return r(/* @__PURE__ */ Error("no canvas"));
		gt(a, e), i.toBlob((e) => e === null ? r(/* @__PURE__ */ Error("no png")) : n(e), "image/png");
	});
}
var J = "zonked-calm-card.png";
function vt(e, t = document) {
	let n = URL.createObjectURL(e), r = t.createElement("a");
	r.href = n, r.download = J, t.body.appendChild(r), r.click(), r.remove(), window.setTimeout(() => URL.revokeObjectURL(n), 1e4);
}
function yt(e, t = navigator) {
	return typeof t.canShare != "function" || typeof t.share != "function" ? !1 : t.canShare({ files: [new File([e], J, { type: "image/png" })] });
}
async function bt(e, t = navigator) {
	try {
		return await t.share({ files: [new File([e], J, { type: "image/png" })] }), !0;
	} catch (e) {
		if (e instanceof DOMException && e.name === "AbortError") return !1;
		throw e;
	}
}
// ../../web/src/ui/calm/CalmCardAction.tsx
function xt({ info: e }) {
	let [t, n] = s("idle"), [r, i] = s(null), [a, o] = s(""), c = () => {
		n("making"), _t(e).then((e) => {
			i(e), n("ready");
		}, () => n("failed"));
	}, l = (e) => {
		bt(e).then((e) => o(e ? V.card.shared : ""), () => o(V.card.failed));
	};
	return /* @__PURE__ */ R("div", {
		className: "c-card-action",
		"data-testid": "calm-card",
		children: [
			t !== "ready" && /* @__PURE__ */ L("button", {
				type: "button",
				className: "c-btn c-link",
				"data-testid": "calm-card-make",
				disabled: t === "making",
				onClick: c,
				children: t === "making" ? V.card.making : V.card.save
			}),
			t === "ready" && r !== null && /* @__PURE__ */ R(I, { children: [/* @__PURE__ */ L("p", {
				className: "c-muted",
				role: "status",
				children: V.card.ready
			}), /* @__PURE__ */ R("div", {
				className: "c-chips",
				children: [/* @__PURE__ */ L("button", {
					type: "button",
					className: "c-tchip",
					"data-testid": "calm-card-download",
					onClick: () => vt(r),
					children: V.card.download
				}), yt(r) && /* @__PURE__ */ L("button", {
					type: "button",
					className: "c-tchip",
					"data-testid": "calm-card-share",
					onClick: () => l(r),
					children: V.card.share
				})]
			})] }),
			t === "failed" && /* @__PURE__ */ L("p", {
				className: "c-muted",
				role: "status",
				children: V.card.failed
			}),
			a !== "" && /* @__PURE__ */ L("p", {
				className: "c-muted",
				role: "status",
				children: a
			})
		]
	});
}
var St = 400;
function Ct(e, t, i = null) {
	let c = o(null), [l, u] = s(null);
	r(() => {
		if (e.playing) {
			u(null), c.current = e.templateId === null ? null : {
				id: i?.id ?? e.templateId,
				name: i?.name ?? e.templateName ?? k.brand,
				minutes: e.elapsedSec / 60
			};
			return;
		}
		let n = c.current;
		if (c.current = null, !t || n === null || n.minutes * 60 < 60) return;
		let r = window.setTimeout(() => u({
			...n,
			minutes: Math.round(n.minutes)
		}), St);
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
var wt = [
	["calmer", k.feelCalmer],
	["same", k.feelSame],
	["not", k.feelNot]
];
function Tt({ onFeel: e }) {
	let [t, n] = s(!1);
	return t ? /* @__PURE__ */ L("p", {
		className: "c-muted",
		role: "status",
		"data-testid": "feel-saved",
		children: k.feelSaved
	}) : /* @__PURE__ */ R("div", {
		role: "group",
		"aria-labelledby": "c-feel-q",
		className: "c-feel",
		"data-testid": "feel-row",
		children: [/* @__PURE__ */ L("p", {
			id: "c-feel-q",
			className: "c-muted",
			children: k.feelQuestion
		}), /* @__PURE__ */ L("div", {
			className: "c-chips",
			children: wt.map(([t, r]) => /* @__PURE__ */ L("button", {
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
function Et({ info: e, onAgain: t, onClose: n, firstRun: i = !1, onFeel: a }) {
	let s = o(null);
	return r(() => s.current?.focus(), []), H(n), /* @__PURE__ */ L("div", {
		className: "c-overlay",
		children: /* @__PURE__ */ R("div", {
			className: "c-dialog c-end",
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": "c-end-title",
			"data-testid": "end-card",
			children: [
				/* @__PURE__ */ L("h2", {
					id: "c-end-title",
					className: "c-h1",
					children: k.endTitle
				}),
				/* @__PURE__ */ L("p", { children: k.endLine(e.name, e.minutes) }),
				/* @__PURE__ */ L("p", {
					className: "c-muted",
					children: k.endNote
				}),
				e.minutes >= 115 && /* @__PURE__ */ L("p", {
					"data-testid": "rest-line",
					children: V.restLine
				}),
				a !== void 0 && /* @__PURE__ */ L(Tt, { onFeel: a }),
				i && /* @__PURE__ */ L("p", {
					className: "c-note",
					"data-testid": "first-run-note",
					children: k.studioNote
				}),
				i && /* @__PURE__ */ L("p", {
					className: "c-muted",
					"data-testid": "home-screen-line",
					children: V.doneCard.addHome
				}),
				/* @__PURE__ */ L(xt, { info: {
					name: e.name,
					minutes: e.minutes
				} }),
				/* @__PURE__ */ R("div", {
					className: "c-actions",
					children: [/* @__PURE__ */ L("button", {
						ref: s,
						type: "button",
						className: "c-btn c-primary",
						"data-testid": "end-again",
						onClick: t,
						children: k.playAgain
					}), /* @__PURE__ */ L("button", {
						type: "button",
						className: "c-btn",
						"data-testid": "end-close",
						onClick: n,
						children: k.close
					})]
				})
			]
		})
	});
}
// ../../web/src/ui/calm/useCalmData.ts
var Dt = 200, Y = (e = Date.now) => U(e());
function Ot(e, t) {
	let i = a(() => le(), []), [o, c] = s(() => _e(i)), [l, u] = s(() => me(i)), [d, f] = s([]), [p, m] = s(0);
	return r(() => {
		let t = !0;
		return e.listLogs(Dt).then((e) => t && f(e)).catch(() => void 0), () => {
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
		week: a(() => rt(d.map((e) => ({
			day: U(e.startedAt),
			minutes: Ee(e)
		})), Y()), [d]),
		logs: d,
		setProfile: n((e) => {
			c(e), de(i, e);
		}, [i]),
		setJourney: n((e, t) => {
			u((n) => {
				let { [e]: r, ...a } = n, o = t === null ? a : {
					...a,
					[e]: t
				};
				return oe(i, o), o;
			});
		}, [i]),
		refresh: n(() => m((e) => e + 1), [])
	};
}
// ../../web/src/app/demoFeed.ts
var kt = 15e3, At = 6e4, X = [
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
function jt(e, t) {
	let n = X[Math.min(Math.max(0, Math.trunc(e)), X.length - 1)];
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
function Mt(e, t) {
	return p(JSON.parse(JSON.stringify(jt(e, t))));
}
var Nt = {
	now: () => Date.now(),
	setTimer: (e, t) => setTimeout(e, t),
	clearTimer: (e) => clearTimeout(e)
}, Z = [], Pt = Nt;
function Ft() {
	for (let e of Z) Pt.clearTimer(e);
	Z = [];
}
function It(e, t, n, r) {
	let i = r.now(), a = Mt(t, Math.trunc(i / 1e3));
	if (a === null) return;
	let o = t >= X.length - 1;
	E({
		state: a,
		source: "demo",
		changedAtMs: i,
		snoozeUntilMs: 0,
		demoNextAtMs: n + (o ? At : (t + 1) * kt)
	}), e.applyCrew(a), e.followCrew();
}
function Lt(e) {
	Ft(), E({
		state: null,
		source: "none",
		changedAtMs: 0,
		snoozeUntilMs: 0,
		demoNextAtMs: null
	}), e.crewLost();
}
function Rt(e, t = Nt) {
	Ft(), Pt = t;
	let n = t.now();
	It(e, 0, n, t), e.snapshot().playing || e.play();
	for (let r = 1; r < X.length; r += 1) Z.push(t.setTimer(() => It(e, r, n, t), r * kt));
	Z.push(t.setTimer(() => Lt(e), At));
}
// ../../web/src/ui/calm/WeekDots.tsx
var zt = [
	"Mon",
	"Tue",
	"Wed",
	"Thu",
	"Fri",
	"Sat",
	"Sun"
], Bt = [
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
	"Sunday"
], Vt = {
	listened: "listened",
	rest: "rest day",
	today: "today",
	upcoming: "coming up"
};
function Ht(e, t = !0, n = !1) {
	return e.quietWeek && n && !t ? k.joinedLine : e.quietWeek ? t ? k.welcomeBack : k.firstWeek : `${k.weekOf(e.daysListened)}. ${k.restCount}`;
}
function Ut({ week: e, hasHistory: t = !0, joinedToday: n = !1, compact: r = !1 }) {
	let i = n && !t && e.quietWeek;
	return /* @__PURE__ */ R("div", {
		className: r ? "c-week c-week-compact" : "c-week",
		children: [/* @__PURE__ */ L("ul", {
			className: "c-dots",
			"aria-label": "This week",
			children: e.dots.map((e, t) => {
				let n = i && e === "today";
				return /* @__PURE__ */ R("li", {
					className: `c-dot c-dot-${e}${n ? " c-dot-joined" : ""}`,
					"data-state": e,
					children: [
						/* @__PURE__ */ L("span", {
							className: "c-mark",
							"aria-hidden": "true",
							children: n || e === "listened" ? /* @__PURE__ */ L(P, {
								name: "check",
								size: 16
							}) : ""
						}),
						/* @__PURE__ */ L("span", {
							className: "c-dayname",
							"aria-hidden": "true",
							children: zt[t]
						}),
						/* @__PURE__ */ L("span", {
							className: "c-sr",
							children: `${Bt[t]}, ${n ? k.joinedToday : Vt[e]}`
						})
					]
				}, Bt[t]);
			})
		}), /* @__PURE__ */ L("p", {
			className: "c-muted",
			"data-testid": r ? void 0 : "week-text",
			children: Ht(e, t, i)
		})]
	});
}
// ../../web/src/ui/calm/Today.tsx
var Wt = () => /* @__PURE__ */ new Date(), Gt = [], Kt = ["focus", "study"], qt = 120, Jt = [];
function Yt({ profile: e, week: t, reduced: n, crewConnected: r, hasHistory: i = !0, joinedToday: o = !1, todayMinutes: c = 0, now: l = Wt, last: u = null, feel: d = Gt, onSprint: f, onPlay: p, onGo: m, onReset: h, onBreathe: g, onGuide: _ }) {
	let [v, b] = s(0), S = a(() => ge(e, l()), [e, l]), C = a(() => {
		let t = B(S.ctx, e.device, 5);
		return Ce(t, d.length === 0 ? Jt : B(S.ctx, e.device, 12), d);
	}, [
		S,
		e.device,
		d
	]), w = C[v % Math.max(1, C.length)], T = a(() => ve(d, U(l().getTime())), [d, l]), E = T === null ? void 0 : j().find((e) => e.id === T.id), D = (t) => S.kind === "sprint" && f !== void 0 ? f(t) : p(t, S.minutes, S.fade ? "sleep" : e.goal), O = (t) => {
		let n = ye(e, l(), t), r = B(n.ctx, e.device, 1)[0];
		r !== void 0 && p(r.template, n.minutes, n.fade ? "sleep" : e.goal);
	};
	return /* @__PURE__ */ R("div", {
		className: "c-today",
		children: [
			/* @__PURE__ */ R("header", {
				className: "c-pagehead",
				children: [/* @__PURE__ */ L(F, {
					size: 72,
					reduced: n
				}), /* @__PURE__ */ L("h1", {
					className: "c-greet",
					"data-testid": "greeting",
					children: x(l().getHours())
				})]
			}),
			u !== null && u.id !== w?.template.id && /* @__PURE__ */ L("button", {
				type: "button",
				className: "c-btn c-wide c-again",
				"data-testid": "play-again",
				onClick: () => p(u),
				children: `${k.playAgain}: ${u.name}`
			}),
			T !== null && E !== void 0 && /* @__PURE__ */ R("p", {
				className: "c-echo",
				"data-testid": "feel-echo",
				children: [
					he(E.name, T),
					" ",
					/* @__PURE__ */ L("button", {
						type: "button",
						className: "c-btn c-link",
						"data-testid": "feel-echo-play",
						onClick: () => p(E),
						children: V.echo.play
					})
				]
			}),
			w !== void 0 && /* @__PURE__ */ R("section", {
				className: "c-daily",
				"aria-labelledby": "c-daily-h",
				"data-plan": S.kind,
				children: [
					/* @__PURE__ */ L("p", {
						className: "c-eyebrow",
						"data-testid": "plan-eyebrow",
						children: V.planEyebrow[S.kind]
					}),
					/* @__PURE__ */ L("h2", {
						id: "c-daily-h",
						children: `${V.planTitle[S.kind]}: ${w.template.name}`
					}),
					/* @__PURE__ */ L("p", {
						className: "c-muted",
						children: `${V.minutes(S.minutes)}. ${se(w.template)}`
					}),
					S.kind === "winddown" && /* @__PURE__ */ L("p", {
						className: "c-muted",
						"data-testid": "sleep-note",
						children: k.sleepNote
					}),
					/* @__PURE__ */ L(De, {
						left: {
							label: k.notThisOne,
							onClick: () => b((e) => e + 1)
						},
						next: {
							label: V.planStart[S.kind],
							onClick: () => D(w.template),
							testid: "today-play"
						}
					})
				]
			}),
			/* @__PURE__ */ R("section", {
				"aria-labelledby": "c-uses-h",
				children: [/* @__PURE__ */ L("h2", {
					id: "c-uses-h",
					className: "c-h3",
					children: V.useCasesTitle
				}), /* @__PURE__ */ L("div", {
					className: "c-chips",
					children: be.map((e) => /* @__PURE__ */ L("button", {
						type: "button",
						className: "c-tchip",
						"data-testid": `use-${e}`,
						onClick: () => O(e),
						children: V.useCases[e]
					}, e))
				})]
			}),
			f !== void 0 && w !== void 0 && S.kind !== "sprint" && Kt.includes(e.goal) && /* @__PURE__ */ R("button", {
				type: "button",
				className: "c-link-card c-sprint-entry",
				"data-testid": "today-sprint",
				onClick: () => f(w.template),
				children: [/* @__PURE__ */ L("b", { children: k.sprintTitle }), /* @__PURE__ */ L("small", { children: k.sprintLine })]
			}),
			/* @__PURE__ */ R("button", {
				type: "button",
				className: "c-link-card c-reset-entry",
				"data-testid": "today-reset",
				onClick: h,
				children: [/* @__PURE__ */ L("b", { children: k.resetEntry }), /* @__PURE__ */ L("small", { children: k.resetEntryHint })]
			}),
			g !== void 0 && e.goal === "calm" && /* @__PURE__ */ R("button", {
				type: "button",
				className: "c-link-card c-breathe-entry",
				"data-testid": "today-breathe",
				onClick: g,
				children: [/* @__PURE__ */ L("b", { children: k.breatheEntry }), /* @__PURE__ */ L("small", { children: k.breatheEntryHint })]
			}),
			/* @__PURE__ */ R("section", {
				"aria-labelledby": "c-goal-h",
				children: [/* @__PURE__ */ L("h2", {
					id: "c-goal-h",
					className: "c-h3",
					children: `Your goal: ${y[e.goal]}`
				}), /* @__PURE__ */ L(Ut, {
					week: t,
					hasHistory: i,
					joinedToday: o
				})]
			}),
			/* @__PURE__ */ R("section", {
				"aria-labelledby": "c-for-h",
				children: [/* @__PURE__ */ L("h2", {
					id: "c-for-h",
					className: "c-h3",
					children: k.forYou
				}), /* @__PURE__ */ L("ul", {
					className: "c-rows",
					children: C.slice(0, 3).map((e) => /* @__PURE__ */ L("li", { children: /* @__PURE__ */ R("button", {
						type: "button",
						className: "c-mini-card",
						onClick: () => p(e.template),
						children: [
							/* @__PURE__ */ L("b", { children: e.template.name }),
							/* @__PURE__ */ L("small", { children: se(e.template) }),
							/* @__PURE__ */ L("em", { children: `${e.template.recommendedMinutes} min` })
						]
					}) }, e.template.id))
				})]
			}),
			c >= qt && /* @__PURE__ */ L("p", {
				className: "c-muted",
				"data-testid": "rest-note",
				children: `${V.listened.today(Math.round(c))} ${V.listened.rest}`
			}),
			/* @__PURE__ */ L("button", {
				type: "button",
				className: "c-link-card",
				onClick: () => m("library"),
				children: /* @__PURE__ */ L("b", { children: "Browse all sounds" })
			}),
			/* @__PURE__ */ L("button", {
				type: "button",
				className: "c-link-card",
				onClick: () => m("journeys"),
				children: /* @__PURE__ */ L("b", { children: k.journeysTitle })
			}),
			_ !== void 0 && /* @__PURE__ */ L("button", {
				type: "button",
				className: "c-btn c-ghost c-guide-link",
				"data-testid": "today-guide",
				onClick: _,
				children: k.guideLink
			}),
			r && /* @__PURE__ */ L("p", {
				className: "c-crew-chip",
				role: "status",
				children: "Crew connected: easing the sound"
			})
		]
	});
}
// ../../web/src/ui/calm/breathe.ts
var Xt = "calm-breathe-5", Zt = {
	atMin: 0,
	beatHz: .5,
	carrierHz: 20,
	gain: .32,
	mode: "binaural",
	noise: "pink",
	noiseLevel: .45,
	beatLevel: 0,
	ramp: !1
}, Qt = {
	id: Xt,
	name: "Breathe, 5 minutes",
	category: "meditation",
	vibe: "calm",
	tags: ["breathing", "no-beat"],
	layerTags: ne([Zt]),
	situations: ["meditate", "quick-reset"],
	recommendedMinutes: 5,
	intensity: 1,
	adhdFriendly: ie([Zt], 1),
	stages: [Zt],
	reasonTemplate: "Soft pink noise, paced 4 seconds in and 4 seconds out.",
	source: "original",
	breath: {
		inSec: 4,
		outSec: 4
	}
}, $t = /^ZK1-([a-z0-9]{3,24})-(\d{1,3})-(\d{1,3})$/;
function en(e) {
	let t = (e, t) => Math.round(Math.min(t, Math.max(0, Number.isFinite(e) ? e : 0)) * 100);
	return `ZK1-${e.id}-${t(e.blend, 1)}-${t(e.level, Fe)}`;
}
function tn(e, t) {
	let n = e.trim();
	if (n.length === 0 || n.length > 64) return {
		ok: !1,
		error: "This is not a Zonked mix code."
	};
	if (/^ZK\d+-/.test(n) && !n.startsWith("ZK1-")) return {
		ok: !1,
		error: "This mix code is from a newer Zonked. Update the app to use it."
	};
	let r = $t.exec(n);
	if (r === null) return {
		ok: !1,
		error: "This is not a Zonked mix code."
	};
	let i = r[1] ?? "", a = Number(r[2]), o = Number(r[3]);
	return t.includes(i) ? a > 100 || o > 100 ? {
		ok: !1,
		error: "This mix code has a value out of range."
	} : {
		ok: !0,
		mix: {
			id: i,
			blend: a / 100,
			level: Math.min(Fe, o / 100)
		}
	} : {
		ok: !1,
		error: "This mix uses a sound that is not in this app."
	};
}
// ../../web/src/ui/calm/OptionsNature.tsx
var nn = [
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
function rn(e) {
	return e < .4 ? "More beats" : e > .6 ? "More nature" : "Even";
}
function an({ nature: e }) {
	let [t, n] = s(""), [r, i] = s(""), [a, o] = s("");
	return /* @__PURE__ */ R("div", {
		className: "c-mix",
		"data-testid": "mix-code",
		children: [
			/* @__PURE__ */ L("div", {
				className: "c-chips c-left",
				children: /* @__PURE__ */ L("button", {
					type: "button",
					className: "c-tchip",
					"data-testid": "mix-copy",
					onClick: () => {
						if (e.on === null || e.on.startsWith("own:")) return i(V.mix.none);
						let t = en({
							id: e.on,
							blend: e.prefs.blend,
							level: e.prefs.level
						}), n = typeof navigator > "u" ? void 0 : navigator.clipboard;
						if (n === void 0) return o(t), i(V.mix.copyFailed);
						n.writeText(t).then(() => {
							o(""), i(V.mix.copied);
						}, () => {
							o(t), i(V.mix.copyFailed);
						});
					},
					children: V.mix.copy
				})
			}),
			a !== "" && /* @__PURE__ */ L("p", {
				className: "c-muted c-mixcode",
				"data-testid": "mix-shown",
				children: a
			}),
			/* @__PURE__ */ L("label", {
				htmlFor: "c-mix-in",
				className: "c-o-sub",
				children: V.mix.pasteTitle
			}),
			/* @__PURE__ */ R("div", {
				className: "c-mix-row",
				children: [/* @__PURE__ */ L("input", {
					id: "c-mix-in",
					className: "c-mix-in",
					type: "text",
					inputMode: "text",
					autoComplete: "off",
					autoCapitalize: "characters",
					spellCheck: !1,
					maxLength: 64,
					placeholder: V.mix.pasteHint,
					"aria-label": V.mix.pasteLabel,
					"data-testid": "mix-input",
					value: t,
					onChange: (e) => n(e.currentTarget.value)
				}), /* @__PURE__ */ L("button", {
					type: "button",
					className: "c-tchip",
					"data-testid": "mix-apply",
					disabled: t.trim() === "",
					onClick: () => {
						let r = tn(t, ke().map((e) => e.id));
						if (!r.ok) return i(r.error);
						e.setBlend(r.mix.blend), e.setLevel(r.mix.level), e.start(r.mix.id), n(""), i(V.mix.applied);
					},
					children: V.mix.apply
				})]
			}),
			/* @__PURE__ */ L("p", {
				className: "c-muted",
				role: "status",
				"data-testid": "mix-note",
				children: r
			})
		]
	});
}
function on({ nature: e, device: t }) {
	let n = ke();
	return /* @__PURE__ */ R(I, { children: [
		/* @__PURE__ */ R("div", {
			className: "c-nature-groups",
			role: "group",
			"aria-label": k.optNature,
			children: [/* @__PURE__ */ L("button", {
				type: "button",
				className: "c-tchip",
				"aria-pressed": e.on === null,
				"data-testid": "sheet-nature-none",
				onClick: e.stop,
				children: k.natureNone
			}), Ie.map((r) => {
				let i = ae(n.filter((e) => je(e) === r), t);
				return i.length === 0 ? null : /* @__PURE__ */ R("div", {
					role: "group",
					"aria-label": r,
					"data-testid": `sheet-group-${r.replaceAll(" ", "-")}`,
					children: [/* @__PURE__ */ L("p", {
						className: "c-o-sub",
						children: r
					}), /* @__PURE__ */ L("div", {
						className: "c-chips c-left c-nature-row",
						children: i.map((t) => /* @__PURE__ */ L("button", {
							type: "button",
							className: "c-tchip",
							"aria-pressed": e.on === t.id,
							"data-testid": `sheet-nature-${t.id}`,
							onClick: () => e.on === t.id ? e.stop() : e.start(t.id),
							children: t.label
						}, t.id))
					})]
				}, r);
			})]
		}),
		/* @__PURE__ */ R("div", {
			className: "c-slider c-blend",
			children: [/* @__PURE__ */ L("label", {
				htmlFor: "c-blend",
				children: k.natureBlend
			}), /* @__PURE__ */ L(N, {
				id: "c-blend",
				min: 0,
				max: 1,
				step: .05,
				value: e.prefs.blend,
				valueText: rn(e.prefs.blend),
				bubbleText: rn(e.prefs.blend),
				ticks: nn,
				onChange: e.setBlend
			})]
		}),
		e.on !== null && /* @__PURE__ */ L(Ne, {
			id: "c-nlevel",
			label: k.natureLevel,
			value: e.prefs.level,
			max: .85,
			onChange: e.setLevel
		}),
		/* @__PURE__ */ L(an, { nature: e }),
		/* @__PURE__ */ L("p", {
			className: "c-status",
			role: "status",
			children: e.message
		})
	] });
}
// ../../web/src/ui/calm/OptionsSheet.tsx
var sn = t(() => import("./chunk-advanced-DcPhviGl.mjs").then((e) => ({ default: e.AdvancedPanels })));
function cn({ player: t, snap: n, nature: i, favorite: a, evidence: c, onFavorite: l, onClose: u, sprint: d, engine: f, device: p = "wired", goal: m, advancedOpen: h = !1 }) {
	let g = o(null), [_, v] = s(!1), [y, b] = s(h);
	return r(() => g.current?.querySelector("button")?.focus(), []), H(u), /* @__PURE__ */ L("div", {
		className: "c-overlay c-sheet-wrap",
		onClick: u,
		children: /* @__PURE__ */ R("div", {
			ref: g,
			className: "c-opts",
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": "c-opts-title",
			"data-testid": "options-sheet",
			onKeyDown: (e) => {
				if (e.key === "Tab") {
					let t = Array.from(g.current?.querySelectorAll("button:not([disabled]), input, select") ?? []), n = t[0], r = t[t.length - 1];
					e.shiftKey && document.activeElement === n ? (e.preventDefault(), r?.focus()) : !e.shiftKey && document.activeElement === r && (e.preventDefault(), n?.focus());
				}
			},
			onClick: (e) => e.stopPropagation(),
			children: [
				/* @__PURE__ */ R("div", {
					className: "c-opts-head",
					children: [/* @__PURE__ */ L("h2", {
						id: "c-opts-title",
						children: k.optionsTitle
					}), /* @__PURE__ */ L("button", {
						type: "button",
						className: "c-btn c-ghost",
						onClick: u,
						children: k.optionsClose
					})]
				}),
				/* @__PURE__ */ R("section", {
					"aria-labelledby": "c-o-timer",
					children: [/* @__PURE__ */ L("h3", {
						id: "c-o-timer",
						className: "c-o-h",
						children: k.optTimer
					}), /* @__PURE__ */ L(ut, {
						timer: n.timer,
						player: t,
						hideUntilStop: m === "sleep",
						...d === void 0 ? {} : {
							onSprint: d.onSprint,
							onSprintEnd: d.onSprintEnd
						}
					})]
				}),
				/* @__PURE__ */ R("section", {
					"aria-labelledby": "c-o-nature",
					children: [/* @__PURE__ */ L("h3", {
						id: "c-o-nature",
						className: "c-o-h",
						children: k.optNature
					}), /* @__PURE__ */ L(on, {
						nature: i,
						device: p
					})]
				}),
				/* @__PURE__ */ R("section", {
					"aria-labelledby": "c-o-more",
					children: [
						/* @__PURE__ */ L("h3", {
							id: "c-o-more",
							className: "c-o-h",
							children: k.optMore
						}),
						/* @__PURE__ */ R("div", {
							className: "c-chips c-left",
							children: [/* @__PURE__ */ L("button", {
								type: "button",
								className: "c-tchip",
								"aria-pressed": a,
								"data-testid": "sheet-favorite",
								onClick: l,
								children: a ? k.saved : k.favorite
							}), /* @__PURE__ */ L("button", {
								type: "button",
								className: "c-tchip",
								"aria-expanded": _,
								"aria-controls": "c-why-box",
								onClick: () => v((e) => !e),
								children: k.whyTitle
							})]
						}),
						/* @__PURE__ */ R("div", {
							id: "c-why-box",
							hidden: !_,
							children: [/* @__PURE__ */ L("p", { children: k.whyBody }), /* @__PURE__ */ L("p", { children: `Evidence: ${c}. ${C[c] ?? ""}` })]
						}),
						/* @__PURE__ */ L("p", {
							className: "c-muted",
							children: k.volumeCapped
						}),
						p === "bluetooth" && /* @__PURE__ */ L("p", {
							className: "c-muted",
							"data-testid": "bt-tip",
							children: k.btTip
						})
					]
				}),
				/* @__PURE__ */ R("section", {
					"aria-labelledby": "c-o-adv",
					children: [/* @__PURE__ */ L("h3", {
						id: "c-o-adv",
						className: "c-o-h",
						children: /* @__PURE__ */ L("button", {
							type: "button",
							className: "c-btn c-ghost c-adv-btn",
							"data-testid": "options-advanced",
							"aria-expanded": y,
							"aria-controls": "c-adv-box",
							onClick: () => b((e) => !e),
							children: k.optAdvanced
						})
					}), /* @__PURE__ */ L("div", {
						id: "c-adv-box",
						hidden: !y,
						children: y && /* @__PURE__ */ L(e, {
							fallback: /* @__PURE__ */ L("p", {
								className: "c-muted",
								role: "status",
								children: k.loading
							}),
							children: /* @__PURE__ */ L(sn, {
								engine: f,
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
var ln = {
	label: "Breathe in",
	count: 4
};
function un(e) {
	let [t, n] = s(0);
	if (r(() => {
		if (n(0), !e) return;
		let t = window.setInterval(() => n((e) => e + 1), 1e3);
		return () => window.clearInterval(t);
	}, [e]), !e) return ln;
	let i = t % 8;
	return {
		label: i < 4 ? "Breathe in" : "Breathe out",
		count: 4 - i % 4
	};
}
var dn = (e) => e.label === "Breathe in" ? k.counterIn(e.count) : k.counterOut(e.count);
function fn({ label: e, on: t, announce: n }) {
	return /* @__PURE__ */ L("p", {
		className: "c-sr",
		role: "status",
		"aria-live": "polite",
		"data-testid": "breath-live",
		children: t && n ? e : ""
	});
}
// ../../web/src/ui/calm/playerScene.ts
var pn = ["cant-sleep", "lucid-dream"], mn = [
	"adhd-focus",
	"deep-work",
	"ai-burnout"
];
function hn(e, t) {
	if (t) return "nature";
	let n = (e === null ? void 0 : j().find((t) => t.id === e))?.situations ?? [];
	return n.some((e) => pn.includes(e)) ? "sleep" : n.some((e) => mn.includes(e)) ? "focus" : "calm";
}
var gn = 400;
function _n(e, t) {
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
		}, gn);
		return () => {
			n = !1, window.clearInterval(r);
		};
	}, [e, t]), n;
}
// ../../web/src/ui/calm/PlayerScreen.tsx
var vn = /* @__PURE__ */ Oe({ PlayerScreen: () => Cn }), yn = t(() => import("./chunk-mascot-DOUK_zQE.mjs").then((e) => ({ default: e.CalmMascot }))), bn = t(() => import("./chunk-visuals-BqbfvuFC.mjs").then((e) => ({ default: e.SceneLoop }))), xn = t(() => import("./chunk-mascot-DOUK_zQE.mjs").then((e) => ({ default: e.BreathCue })));
function Sn({ still: t, playing: n, situation: r, theme: i, level: a, announce: o = !0 }) {
	let s = Le(n && !t), c = un(n && t), l = n && !t;
	return /* @__PURE__ */ R(I, { children: [/* @__PURE__ */ L("div", {
		className: "c-stage",
		"data-testid": "breath-ring",
		"data-still": t ? "true" : "false",
		"data-situation": r,
		children: /* @__PURE__ */ R(e, {
			fallback: null,
			children: [/* @__PURE__ */ L("div", {
				className: "c-stage-scene",
				children: /* @__PURE__ */ L(bn, {
					situation: r,
					reducedMotion: t,
					theme: i
				})
			}), /* @__PURE__ */ L("div", {
				className: "c-stage-mascot",
				children: /* @__PURE__ */ L(yn, {
					mood: n ? "breathing" : "idle",
					size: 190,
					reducedMotion: t,
					situation: r,
					breathPhase: l ? s.phase : void 0,
					level: n ? a : 0
				})
			})]
		})
	}), /* @__PURE__ */ R("div", {
		className: "c-cue",
		children: [l ? /* @__PURE__ */ L(e, {
			fallback: null,
			children: /* @__PURE__ */ L(xn, {
				label: s.label,
				className: "c-cue-text",
				live: !1
			})
		}) : n ? /* @__PURE__ */ L("p", {
			className: "c-cue-text",
			"data-testid": "breath-counter",
			children: dn(c)
		}) : /* @__PURE__ */ L("p", {
			className: "c-cue-text",
			children: k.breathe
		}), /* @__PURE__ */ L(fn, {
			label: l ? s.label : c.label,
			on: n,
			announce: o
		})]
	})] });
}
function Cn({ engine: e, device: t, goal: n, theme: i, announce: a = !0, sprint: c, openAdvanced: l = !1, onAdvancedShown: u, player: d, snap: f, still: p, favorite: m, onToggle: h, onFavorite: g, nature: _ }) {
	let [v, y] = s(l), [b, x] = s(l);
	r(() => {
		l && (y(!0), x(!0), u?.());
	}, [l, u]);
	let S = o(null), C = () => {
		y(!1), x(!1), S.current?.focus();
	}, w = _n(e, f.playing), T = re.find((e) => e.templateId === f.templateId)?.evidence ?? "mixed", E = hn(c?.focus?.id ?? f.templateId, _.on !== null), D = j().find((e) => e.id === (c?.focus?.id ?? f.templateId));
	return /* @__PURE__ */ R("div", {
		className: "c-player",
		children: [
			/* @__PURE__ */ L("h1", {
				className: "c-h1",
				children: f.templateName ?? k.brand
			}),
			/* @__PURE__ */ L(Sn, {
				still: p,
				playing: f.playing,
				situation: E,
				theme: i,
				level: w,
				announce: a
			}),
			/* @__PURE__ */ L(dt, { timer: f.timer }),
			/* @__PURE__ */ L("div", {
				className: "c-controls",
				children: /* @__PURE__ */ L("button", {
					type: "button",
					className: "c-btn c-primary c-big c-round",
					"data-testid": "player-toggle",
					onClick: h,
					children: f.playing ? k.stop : k.play
				})
			}),
			/* @__PURE__ */ L("button", {
				ref: S,
				type: "button",
				className: "c-btn c-ghost c-options-btn",
				"data-testid": "player-options",
				"aria-haspopup": "dialog",
				onClick: () => y(!0),
				children: k.optionsBtn
			}),
			v && /* @__PURE__ */ L(cn, {
				player: d,
				snap: f,
				nature: _,
				favorite: m,
				evidence: T,
				onFavorite: g,
				onClose: C,
				engine: e,
				...t === void 0 ? {} : { device: t },
				...n === void 0 ? {} : { goal: n },
				advancedOpen: b,
				...c !== void 0 && D !== void 0 ? { sprint: {
					onSprint: () => c.start(D),
					onSprintEnd: c.cancel
				} } : {}
			})
		]
	});
}
var wn = "seed-pause-five", Tn = {
	kind: "reset",
	seconds: 90,
	template: () => j().find((e) => e.id === wn),
	title: k.resetTitle,
	intro: k.resetIntro,
	done: k.resetDoneLine,
	again: k.resetAgain,
	left: k.resetLeft
}, En = {
	kind: "breathe",
	seconds: 300,
	template: () => Qt,
	title: k.breatheTitle,
	intro: k.breatheIntro,
	done: k.breatheDoneLine,
	again: k.breatheAgain,
	left: k.breatheLeft
};
function Dn(e, t = Tn) {
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
function On({ s: e, still: t, theme: n, announce: r, onBack: i, plan: a = Tn }) {
	let o = Dn(e, a), s = _n(e.engine, e.snap.playing), c = hn(e.snap.templateId, !1);
	return o.phase === "done" ? /* @__PURE__ */ L(kn, {
		plan: a,
		onAgain: o.begin,
		onBack: i
	}) : /* @__PURE__ */ R("div", {
		className: "c-player c-reset",
		"data-testid": "reset-screen",
		"data-kind": a.kind,
		"data-phase": o.phase,
		children: [
			/* @__PURE__ */ L("h1", {
				className: "c-h1",
				children: a.title
			}),
			o.phase === "idle" && /* @__PURE__ */ L("p", {
				className: "c-lead",
				children: a.intro
			}),
			/* @__PURE__ */ L(Sn, {
				still: t,
				playing: o.phase === "running" && e.snap.playing,
				situation: c,
				theme: n,
				level: s,
				announce: r
			}),
			o.phase === "running" ? /* @__PURE__ */ R(I, { children: [/* @__PURE__ */ L("p", {
				className: "c-muted c-digits",
				"data-testid": "reset-left",
				"aria-hidden": "true",
				children: a.left(o.left)
			}), /* @__PURE__ */ L("div", {
				className: "c-controls",
				children: /* @__PURE__ */ L("button", {
					type: "button",
					className: "c-btn c-round c-big",
					"data-testid": "reset-stop",
					onClick: o.stop,
					children: k.stop
				})
			})] }) : /* @__PURE__ */ R("div", {
				className: "c-actions",
				children: [/* @__PURE__ */ L("button", {
					type: "button",
					className: "c-btn c-primary",
					"data-testid": "reset-begin",
					onClick: o.begin,
					children: k.resetStart
				}), /* @__PURE__ */ L("button", {
					type: "button",
					className: "c-btn c-link",
					onClick: i,
					children: k.resetBack
				})]
			}),
			/* @__PURE__ */ L("p", {
				className: "c-muted",
				children: k.volumeCapped
			})
		]
	});
}
function kn({ plan: e, onAgain: t, onBack: n }) {
	let i = o(null);
	return r(() => i.current?.focus(), []), /* @__PURE__ */ R("div", {
		className: "c-end c-reset",
		"data-testid": "reset-end",
		children: [
			/* @__PURE__ */ L("h1", {
				className: "c-h1",
				children: k.endTitle
			}),
			/* @__PURE__ */ L("p", { children: e.done }),
			/* @__PURE__ */ L("p", {
				className: "c-muted",
				children: k.endNote
			}),
			/* @__PURE__ */ R("div", {
				className: "c-actions",
				children: [/* @__PURE__ */ L("button", {
					ref: i,
					type: "button",
					className: "c-btn c-primary",
					"data-testid": "reset-back",
					onClick: n,
					children: k.resetBack
				}), /* @__PURE__ */ L("button", {
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
var An = t(() => import("./chunk-Journeys-D_5fPE50.mjs").then((e) => ({ default: e.JourneyList }))), jn = t(() => import("./chunk-Journeys-D_5fPE50.mjs").then((e) => ({ default: e.JourneyDetail }))), Mn = t(() => import("./chunk-Library-CtlV2q_x.mjs").then((e) => ({ default: e.Library }))), Nn = t(() => Promise.resolve().then(() => vn).then((e) => ({ default: e.PlayerScreen }))), Pn = t(() => import("./chunk-CrewScreen-DYpfF6Xm.mjs").then((e) => ({ default: e.CrewScreen }))), Fn = t(() => import("./chunk-NatureScreen-QpnFXjpL.mjs").then((e) => e.t).then((e) => ({ default: e.NatureScreen }))), In = t(() => import("./chunk-SettingsScreen-CaVT2IU7.mjs").then((e) => ({ default: e.SettingsScreen })));
function Ln({ view: e, journeyId: t, s: n, data: r, crewInfo: i, nature: a, still: o, fav: s, last: c, look: l, prefs: f, onPrefs: p, feel: m, sprint: h, handlers: g }) {
	switch (e) {
		case "journeys": return /* @__PURE__ */ L(An, {
			progress: r.progress,
			onOpen: g.openJourney,
			reduced: o
		});
		case "journey": return /* @__PURE__ */ L(jn, {
			id: t ?? "",
			profile: r.profile,
			progress: r.progress,
			todayDay: Y(),
			onBack: () => g.go("journeys"),
			onStartJourney: r.setJourney,
			onRestart: (e) => r.setJourney(e, null),
			onPlayDay: g.playDay
		});
		case "library": return /* @__PURE__ */ L(Mn, {
			store: n.store,
			logs: r.logs,
			reduced: o,
			onNature: () => g.go("nature"),
			onPlay: g.play,
			onPlayMix: g.onMix,
			onBreathe: () => g.go("breathe")
		});
		case "nature": return /* @__PURE__ */ L(Fn, {
			nature: a,
			device: r.profile.device,
			reduced: o,
			onBack: () => g.go("library")
		});
		case "player": return /* @__PURE__ */ L(Nn, {
			player: n.player,
			snap: n.snap,
			still: o,
			favorite: s.on,
			onToggle: n.toggle,
			onFavorite: s.toggle,
			nature: a,
			engine: n.engine,
			device: r.profile.device,
			goal: r.profile.goal,
			theme: l.theme,
			announce: f.announce,
			sprint: h,
			openAdvanced: g.advancedPending,
			onAdvancedShown: g.advancedShown
		});
		case "reset": return /* @__PURE__ */ L(On, {
			s: n,
			still: o,
			theme: l.theme,
			announce: f.announce,
			onBack: () => g.go("today")
		});
		case "breathe": return /* @__PURE__ */ L(On, {
			s: n,
			still: o,
			theme: l.theme,
			announce: f.announce,
			onBack: () => g.go("today"),
			plan: En
		});
		case "crew": return /* @__PURE__ */ L(Pn, {
			crew: i,
			overridden: n.snap.overridden,
			onDemo: () => n.guarded(() => Rt(n.player)),
			onStopDemo: () => Lt(n.player),
			onNotNow: () => u(n.player),
			onResume: () => d(n.player),
			onFollow: () => n.player.followCrew()
		});
		case "settings": return /* @__PURE__ */ L(In, {
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
			prefs: f,
			onPrefs: p,
			onGuide: g.openGuide,
			feel: m
		});
		default: return /* @__PURE__ */ L(Yt, {
			profile: r.profile,
			week: r.week,
			progress: r.progress,
			reduced: o,
			hasHistory: r.logs.some((e) => U(e.startedAt) < Y()),
			joinedToday: U(r.profile.createdAt) === Y(),
			crewConnected: i.enabled && i.status === "connected",
			last: c,
			feel: m,
			todayMinutes: r.logs.filter((e) => U(e.startedAt) === Y()).reduce((e, t) => e + Ee(t), 0),
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
var Q = null, Rn = () => Q, zn = (e) => void (Q = e);
function Bn() {
	Q !== null && (Q = null, import("./chunk-samples-_x0GtVlI.mjs").then((e) => e.n).then((e) => e.stopSample()).catch(() => void 0));
}
// ../../web/src/ui/calm/nature/useNature.ts
var $ = () => import("./chunk-samples-_x0GtVlI.mjs").then((e) => e.n);
async function Vn(e, t) {
	let n = await $();
	if (!Ve(e)) return n.startSample(e, t);
	let r = await Be(e);
	return r.ok ? n.startOwn(e, r.value, t) : {
		ok: !1,
		error: r.error
	};
}
function Hn(e) {
	let [t, i] = s(Ae), [a, c] = s(Rn), [l, u] = s(""), d = o(t);
	d.current = t;
	let { player: f, guarded: p } = e;
	r(() => {
		e.snap.playing || (Bn(), c(null));
	}, [e.snap.playing]);
	let m = n(async (e) => {
		if (u(""), f.snapshot().playing || await f.play(), !f.snapshot().playing) return void u(k.errorAudio);
		(await $()).setBlend(d.current.blend);
		let t = await Vn(e, d.current.level);
		if (!t.ok) return void u(t.error);
		t.note !== void 0 && u(t.note), zn(e), c(e);
		let n = {
			...d.current,
			id: e
		};
		i(n), Pe(n);
	}, [f]), h = n((e) => p(() => void m(e)), [p, m]), g = n(() => {
		zn(null), c(null), $().then((e) => e.stopSample());
	}, []), _ = n((e, t) => {
		let n = {
			...d.current,
			...e
		};
		d.current = n, i(n), Pe(n), Rn() !== null && $().then(t);
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
async function Un() {
	Me(), await ze();
}
// src/engine/useSession.ts
function Wn() {
	let { player: e, store: t, engine: i } = v(), [a, c] = s(() => e.snapshot()), [l, u] = s(T), [d, f] = s(!1), [p, m, h] = ee(), g = o(null), _ = o(l);
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
			te(A, !0), _.current = !0, u(!0), f(!1);
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
var Gn = "zonked.guide.v1", Kn = (e) => {
	try {
		return e.get(Gn) === "1";
	} catch {
		return !1;
	}
}, qn = (e) => {
	try {
		e.set(Gn, "1");
	} catch {}
}, Jn = (e) => e.open || !e.seen && !e.onboarding && e.endClosed && !e.endCardShown && !e.playing;
function Yn({ reduced: e, onClose: t, onCrew: n }) {
	let [i, a] = s(0), c = o(null);
	r(() => c.current?.querySelector("h2")?.focus(), [i]);
	let l = k.guideCards[i] ?? k.guideCards[0], u = i === k.guideCards.length - 1;
	return H(t), /* @__PURE__ */ L("div", {
		className: "c-overlay",
		children: /* @__PURE__ */ R("div", {
			ref: c,
			className: "c-dialog c-guide",
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": "c-guide-title",
			"data-testid": "guide",
			onKeyDown: (e) => {
				if (e.key === "Tab") {
					let t = Array.from(c.current?.querySelectorAll("button") ?? []), n = document.activeElement;
					e.shiftKey && (n === t[0] || n === c.current?.querySelector("h2")) ? (e.preventDefault(), t[t.length - 1]?.focus()) : !e.shiftKey && n === t[t.length - 1] && (e.preventDefault(), t[0]?.focus());
				}
			},
			children: [
				/* @__PURE__ */ R("div", {
					className: "c-fhead",
					children: [/* @__PURE__ */ L(F, {
						size: 72,
						mood: "happy",
						reduced: e
					}), /* @__PURE__ */ R("div", {
						className: "c-fhead-text",
						children: [/* @__PURE__ */ L("p", {
							className: "c-step",
							children: k.guideStep(i + 1)
						}), /* @__PURE__ */ L("div", {
							className: "c-bar",
							"aria-hidden": "true",
							children: k.guideCards.map((e, t) => /* @__PURE__ */ L("i", { "data-on": t <= i ? "true" : "false" }, e.title))
						})]
					})]
				}),
				/* @__PURE__ */ L("h2", {
					id: "c-guide-title",
					className: "c-ftitle",
					tabIndex: -1,
					children: l?.title
				}),
				/* @__PURE__ */ L("p", {
					className: "c-helper",
					children: l?.body
				}),
				i === 2 && /* @__PURE__ */ L("button", {
					type: "button",
					className: "c-btn c-ghost c-guide-crew",
					onClick: n,
					children: k.guideCrewLink
				}),
				/* @__PURE__ */ L(De, {
					left: {
						label: k.guideSkip,
						onClick: t,
						testid: "guide-skip"
					},
					next: {
						label: u ? k.guideDone : k.next,
						onClick: u ? t : () => a(i + 1),
						testid: "guide-next"
					}
				}),
				!u && /* @__PURE__ */ L("p", {
					className: "c-guide-done",
					children: /* @__PURE__ */ L("button", {
						type: "button",
						className: "c-btn c-ghost",
						"data-testid": "guide-done",
						onClick: t,
						children: k.guideDone
					})
				})
			]
		})
	});
}
// ../../web/src/ui/calm/Painted.tsx
function Xn(e) {
	let t = Number.isFinite(e) ? (Math.floor(e) % 24 + 24) % 24 : 12;
	return t >= 5 && t < 8 ? "dawn" : t >= 8 && t < 17 ? "day" : t >= 17 && t < 20 ? "dusk" : "night";
}
function Zn({ hour: e = (/* @__PURE__ */ new Date()).getHours() }) {
	let t = `pt${i().replace(/[^a-zA-Z0-9]/g, "")}`, n = Xn(e);
	return /* @__PURE__ */ R("svg", {
		className: "pt",
		"data-tod": n,
		viewBox: "0 0 1600 900",
		preserveAspectRatio: "xMidYMax slice",
		"aria-hidden": "true",
		focusable: "false",
		"data-testid": "painted",
		children: [
			/* @__PURE__ */ R("defs", { children: [
				/* @__PURE__ */ R("linearGradient", {
					id: `${t}-sky`,
					x1: "0",
					y1: "0",
					x2: "0",
					y2: "1",
					children: [
						/* @__PURE__ */ L("stop", {
							offset: "0",
							className: "pt-s1"
						}),
						/* @__PURE__ */ L("stop", {
							offset: "0.6",
							className: "pt-s2"
						}),
						/* @__PURE__ */ L("stop", {
							offset: "1",
							className: "pt-s3"
						})
					]
				}),
				/* @__PURE__ */ R("radialGradient", {
					id: `${t}-glow`,
					children: [/* @__PURE__ */ L("stop", {
						offset: "0",
						className: "pt-gl",
						stopOpacity: "0.9"
					}), /* @__PURE__ */ L("stop", {
						offset: "1",
						className: "pt-gl",
						stopOpacity: "0"
					})]
				}),
				/* @__PURE__ */ L("filter", {
					id: `${t}-soft`,
					x: "-2%",
					y: "-2%",
					width: "104%",
					height: "104%",
					children: /* @__PURE__ */ L("feGaussianBlur", { stdDeviation: "2.5" })
				}),
				/* @__PURE__ */ L("filter", {
					id: `${t}-cloud`,
					x: "-20%",
					y: "-50%",
					width: "140%",
					height: "200%",
					children: /* @__PURE__ */ L("feGaussianBlur", { stdDeviation: "9" })
				}),
				/* @__PURE__ */ R("filter", {
					id: `${t}-grain`,
					x: "0",
					y: "0",
					width: "100%",
					height: "100%",
					children: [/* @__PURE__ */ L("feTurbulence", {
						type: "fractalNoise",
						baseFrequency: "0.8",
						numOctaves: "2",
						seed: "11"
					}), /* @__PURE__ */ L("feColorMatrix", { values: "0 0 0 0 0.3  0 0 0 0 0.25  0 0 0 0 0.2  0 0 0 0.9 -0.25" })]
				})
			] }),
			/* @__PURE__ */ L("rect", {
				width: "1600",
				height: "900",
				fill: `url(#${t}-sky)`
			}),
			/* @__PURE__ */ L("circle", {
				className: "pt-orb",
				cx: "1180",
				cy: "250",
				r: "260",
				fill: `url(#${t}-glow)`
			}),
			/* @__PURE__ */ R("g", {
				className: "pt-clouds",
				filter: `url(#${t}-cloud)`,
				children: [
					/* @__PURE__ */ R("g", {
						className: "pt-cloud pt-c1",
						children: [/* @__PURE__ */ L("ellipse", {
							cx: "300",
							cy: "190",
							rx: "190",
							ry: "34"
						}), /* @__PURE__ */ L("ellipse", {
							cx: "400",
							cy: "168",
							rx: "120",
							ry: "30"
						})]
					}),
					/* @__PURE__ */ R("g", {
						className: "pt-cloud pt-c2",
						children: [/* @__PURE__ */ L("ellipse", {
							cx: "900",
							cy: "120",
							rx: "150",
							ry: "26"
						}), /* @__PURE__ */ L("ellipse", {
							cx: "970",
							cy: "104",
							rx: "90",
							ry: "22"
						})]
					}),
					/* @__PURE__ */ R("g", {
						className: "pt-cloud pt-c3",
						children: [/* @__PURE__ */ L("ellipse", {
							cx: "1380",
							cy: "300",
							rx: "170",
							ry: "28"
						}), /* @__PURE__ */ L("ellipse", {
							cx: "1300",
							cy: "284",
							rx: "100",
							ry: "24"
						})]
					})
				]
			}),
			/* @__PURE__ */ R("g", {
				filter: `url(#${t}-soft)`,
				children: [
					/* @__PURE__ */ L("path", {
						className: "pt-h1",
						d: "M-40 620C200 540 420 540 640 600C860 660 1080 560 1300 540C1440 528 1540 560 1640 590V900H-40Z"
					}),
					/* @__PURE__ */ L("path", {
						className: "pt-h2",
						d: "M-40 720C240 640 480 680 720 720C960 760 1200 660 1420 660C1500 660 1580 680 1640 700V900H-40Z"
					}),
					/* @__PURE__ */ L("path", {
						className: "pt-h3",
						d: "M-40 820C260 770 520 800 800 830C1060 858 1300 790 1640 800V900H-40Z"
					})
				]
			}),
			/* @__PURE__ */ L("rect", {
				className: "pt-grain",
				width: "1600",
				height: "900",
				filter: `url(#${t}-grain)`
			}),
			/* @__PURE__ */ L("rect", {
				className: "pt-veil",
				width: "1600",
				height: "900"
			})
		]
	});
}
// ../../web/src/ui/calm/useCrewBridge.ts
function Qn(e, t) {
	let [n, i] = s("standalone"), [a, o] = s(() => w());
	return r(() => O(o), []), r(() => {
		let n = !1, r = new _({
			...t === void 0 ? {} : { create: t },
			onStatus: (t) => {
				i(t), t === "standalone" && (f().source !== "demo" && e.crewLost(), n && l(), n = !1);
			},
			onState: (t) => {
				n = !0, m(e, t);
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
function $n(e, t = Date.now) {
	let [r, i] = s(() => ce(e)), o = n((n, r) => {
		i((i) => {
			let a = Se(i, {
				id: n,
				a: r,
				day: U(t())
			});
			return z(e, a), a;
		});
	}, [e, t]), c = n(() => {
		we(e), i([]);
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
var er = {
	kind: "pomodoro",
	focusMin: 25,
	breakMin: 5
}, tr = ["starter-rain", "starter-deep"], nr = .8, rr = 6e3, ir = {
	chimeLevel: .25,
	chimeRatePerMin: 10
};
function ar(e, t) {
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
function or(e, t) {
	let n = tr.find((t) => t !== e);
	return t.find((e) => e.id === n);
}
function sr(e, t) {
	return !Number.isFinite(e) || !Number.isFinite(t) ? 0 : Math.round(Math.min(0, e * nr - t) * 1e3) / 1e3;
}
async function cr(e, t, n = (e, t) => window.setTimeout(e, t)) {
	let r = e.snapshot().voice.gain;
	e.setLayerOverride(ir), n(() => e.clearLayerOverrides(), rr), await e.playTemplate(t) && e.nudgeGain(sr(r, e.snapshot().voice.gain));
}
// ../../web/src/ui/calm/useSprint.ts
function lr(e) {
	let [t, i] = s(null), c = o(!1), { player: l, guarded: u } = e, { playing: d, templateId: f, timer: p } = e.snap, m = n(() => {
		i(null), l.stopTimer();
	}, [l]), h = n((e) => u(() => {
		c.current = !1;
		let t = () => {
			l.startTimer(er), i({
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
		let e = ar(t.phase, p);
		if (e.action === "cancel") return i(null);
		if (e.action === null) d && f !== t.focus.id && f !== t.breakId && m();
		else if (e.action === "break") {
			let e = or(t.focus.id, j());
			i({
				...t,
				phase: "break",
				breakId: e?.id ?? null
			}), e !== void 0 && cr(l, e);
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
function ur(e, t) {
	let [i, a] = s(Ge);
	r(() => {
		let t = !0;
		return e.getRecord("favorites").then((e) => t && a(We(e, Date.now()))).catch(() => void 0), () => {
			t = !1;
		};
	}, [e]);
	let o = n(() => {
		if (t === null) return;
		let n = He(i, "template", t, Date.now());
		a(n), e.setRecord("favorites", n).catch(() => void 0);
	}, [
		i,
		t,
		e
	]);
	return {
		on: t !== null && Ue(i, "template", t),
		toggle: o
	};
}
// ../../web/src/ui/calm/CalmApp.tsx
var dr = t(() => import("./chunk-Onboarding-BfgyB5QT.mjs").then((e) => ({ default: e.Onboarding }))), fr = (e) => Math.max(180, e * 60 * .8);
function pr({ engine: t, clock: i, store: a, bridgeCreate: c }) {
	let l = Wn(t, i, a), u = Ot(l.store, l.snap.playing), d = Qn(l.player, c), f = Hn(l), [p, m] = s("today"), [h, g] = s(null), _ = o(null), v = ur(l.store, l.snap.templateId), y = $n(u.storage), b = lr(l), x = u.profile.createdAt === 0;
	r(() => t.setListening?.(u.profile.device), [t, u.profile.device]);
	let S = yr(u.storage), C = Ct(l.snap, !x && p !== "reset" && p !== "breathe", b.focus === null ? null : {
		id: b.focus.id,
		name: k.sprintName
	}), w = l.reduced || u.profile.extraGentle, [T, E] = s(!1), [D, O] = s(() => Kn(u.storage)), [ee, te] = s(!1), A = () => {
		qn(u.storage), O(!0), E(!1);
	}, { look: j, prefs: ne, dim: re, setPrefs: ie } = Re(), [M, N] = s(!1), P = n(() => {
		N(!0), m("player");
	}, []), F = n(() => N(!1), []);
	br(P);
	let I = n((e) => m(e), []), { play: z, playDay: B, finish: ae } = gr({
		s: l,
		data: u,
		last: S,
		end: C,
		active: _,
		setView: m
	});
	return Cr(l.snap.playing, l.snap.elapsedSec, _, u.progress, u.setJourney), /* @__PURE__ */ R("div", {
		className: "c-app",
		"data-theme": j.theme,
		"data-contrast": j.highContrast ? "high" : "normal",
		"data-view": p,
		"data-dim": re ? "true" : "false",
		"data-motion": w ? "off" : "on",
		"data-playing": l.snap.playing ? "true" : "false",
		children: [
			/* @__PURE__ */ L(Zn, {}),
			/* @__PURE__ */ L(Sr, {}),
			/* @__PURE__ */ L(xr, { engine: t }),
			d.view.source === "demo" && /* @__PURE__ */ L("p", {
				className: "c-badge-sim",
				role: "status",
				"data-testid": "demo-badge",
				children: k.crewDemoBadge
			}),
			/* @__PURE__ */ L("main", {
				id: "c-main",
				className: "c-main",
				tabIndex: -1,
				children: /* @__PURE__ */ L("div", {
					className: "c-sheet",
					children: /* @__PURE__ */ L(e, {
						fallback: /* @__PURE__ */ L("p", {
							className: "c-loading",
							role: "status",
							children: k.loading
						}),
						children: x ? /* @__PURE__ */ L(dr, {
							playing: l.snap.playing,
							reduced: w,
							initial: u.profile,
							onAccept: l.accept,
							onPreview: (e) => l.playTemplate(e, null),
							onStop: () => void l.player.stop(),
							onFinish: ae
						}) : /* @__PURE__ */ L(Ln, {
							view: p,
							journeyId: h,
							s: l,
							data: u,
							crewInfo: d,
							nature: f,
							still: w,
							fav: v,
							last: S.template,
							look: j,
							prefs: ne,
							onPrefs: ie,
							feel: y.entries,
							sprint: b,
							handlers: {
								go: I,
								play: z,
								playDay: B,
								openJourney: (e) => {
									g(e), m("journey");
								},
								forget: () => {
									ot(u.storage, l.store), y.clear(), f.stop(), Un(), u.setProfile(pe), m("today");
								},
								onStudio: P,
								advancedPending: M,
								advancedShown: F,
								onMix: (e) => l.guarded(() => l.player.playMix(e)),
								openGuide: () => E(!0)
							}
						})
					})
				})
			}),
			!x && p !== "player" && p !== "reset" && p !== "breathe" && p !== "crew" && /* @__PURE__ */ L(Ye, {
				snap: l.snap,
				crewPresetId: d.view.state?.target.presetId ?? null,
				onOpen: () => I("player"),
				onStop: () => void l.player.stop()
			}),
			!x && /* @__PURE__ */ L(qe, {
				view: p,
				onGo: I,
				reduced: w
			}),
			/* @__PURE__ */ L("p", {
				className: "c-sr",
				role: "status",
				"data-testid": "play-status",
				children: l.snap.playing ? `Playing. ${k.volumeCapped}` : "Stopped."
			}),
			C.card !== null && !l.snap.playing && /* @__PURE__ */ L(mr, {
				card: C.card,
				play: z,
				dismiss: () => {
					C.dismiss(), te(!0);
				},
				feel: y,
				firstRun: U(u.profile.createdAt) === Y()
			}),
			Jn({
				open: T,
				seen: D,
				onboarding: x,
				endClosed: ee,
				endCardShown: C.card !== null,
				playing: l.snap.playing
			}) && /* @__PURE__ */ L(Yn, {
				reduced: w,
				onClose: A,
				onCrew: () => {
					A(), I("crew");
				}
			}),
			l.gate && /* @__PURE__ */ L(Te, {
				onAccept: l.accept,
				onCancel: l.cancelGate
			})
		]
	});
}
function mr({ card: e, play: t, dismiss: n, feel: r, firstRun: i }) {
	return /* @__PURE__ */ L(Et, {
		info: e,
		onAgain: () => vr(e.id, t),
		onClose: n,
		firstRun: i,
		onFeel: (t) => r.answer(e.id, t)
	});
}
function hr(e, t) {
	return t === null ? null : e === "sleep" ? {
		kind: "sleep-fade",
		minutes: Math.max(20, t)
	} : {
		kind: "countdown",
		minutes: t
	};
}
function gr({ s: e, data: t, last: r, end: i, active: a, setView: o }) {
	let s = n((n, s = n.recommendedMinutes, c = t.profile.goal) => {
		a.current = null, r.remember(n.id), i.dismiss(), e.playTemplate(n, hr(c, s)), o("player");
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
				needSec: fr(n.recommendedMinutes)
			};
		},
		finish: (n, i) => {
			if (t.setProfile(n), !e.snap.playing || e.snap.templateId !== i.id) return s(i, i.recommendedMinutes, n.goal);
			r.remember(i.id), e.player.startTimer(hr(n.goal, i.recommendedMinutes) ?? {
				kind: "countdown",
				minutes: i.recommendedMinutes
			}), o("player");
		}
	};
}
var _r = (e) => e === null ? null : j().find((t) => t.id === e) ?? null;
function vr(e, t) {
	let n = _r(e);
	n !== null && t(n);
}
function yr(e) {
	let [t, r] = s(() => ue(e)), i = a(() => _r(t), [t]), o = n((t) => {
		fe(e, t), r(t);
	}, [e]);
	return a(() => ({
		template: i,
		remember: o
	}), [i, o]);
}
function br(e) {
	r(() => {
		let t = (t) => {
			t.altKey && t.shiftKey && t.code === "KeyS" && (t.preventDefault(), e());
		};
		return window.addEventListener("keydown", t), () => window.removeEventListener("keydown", t);
	}, [e]);
}
function xr({ engine: e }) {
	let [t, n] = s(() => e.status.state === "error" ? e.status.error ?? "" : null);
	return r(() => e.onStatus((e) => n(e.state === "error" ? e.error ?? "" : null)), [e]), t === null ? null : /* @__PURE__ */ L("p", {
		className: "c-note",
		role: "status",
		"data-testid": "engine-notice",
		children: t === "audio-unsupported" ? k.unsupported : k.errorAudio
	});
}
function Sr() {
	return /* @__PURE__ */ R(I, { children: [/* @__PURE__ */ L("a", {
		className: "c-skip",
		href: "#c-main",
		children: "Skip to content"
	}), /* @__PURE__ */ L("header", {
		className: "c-topbar",
		children: /* @__PURE__ */ L("span", {
			className: "c-brand",
			children: k.brand
		})
	})] });
}
function Cr(e, t, n, i, a) {
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
var wr = {
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
function Tr() {
	S(import.meta.url), D();
	let { engine: e, store: t } = v();
	r(() => (b(!0), () => b(!1)), []);
	let [n, i] = s(!1);
	return /* @__PURE__ */ R("div", {
		"data-testid": "zonked-app",
		style: {
			height: "100%",
			minHeight: 0,
			overflow: "hidden",
			position: "relative",
			transform: "translateZ(0)"
		},
		children: [/* @__PURE__ */ L("div", {
			style: {
				height: "100%",
				overflowY: "auto"
			},
			children: /* @__PURE__ */ L(pr, {
				engine: e,
				store: t,
				onStudio: () => i(!0)
			})
		}), n && /* @__PURE__ */ L("p", {
			role: "status",
			style: wr,
			"data-testid": "studio-note",
			onClick: () => i(!1),
			children: "Studio, the advanced mode, is not in the Kiro Crew app yet. Tap to close."
		})]
	});
}
export { Tr as default };
