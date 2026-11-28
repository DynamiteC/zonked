import { a as e } from "./chunk-catalog-DUQ1JcEF.mjs";
import { Y as t } from "./chunk-crewLink-DfIjAvPP.mjs";
import { n } from "./chunk-MascotView-Cmnhlpu8.mjs";
import { b as r, h as i, y as a } from "./chunk-data-Bhxfb-cT.mjs";
import { jsx as o, jsxs as s } from "react/jsx-runtime";
// ../../web/src/ui/calm/Journeys.tsx
var c = (e) => e.days.length;
function l({ progress: e, onOpen: r, reduced: i = !1 }) {
	return /* @__PURE__ */ s("div", { children: [
		/* @__PURE__ */ o(n, {
			title: t.journeysTitle,
			reduced: i
		}),
		/* @__PURE__ */ o("p", {
			className: "c-lead",
			children: t.journeysEmpty
		}),
		/* @__PURE__ */ o("ul", {
			className: "c-list",
			children: a.map((n) => {
				let i = e[n.id]?.doneDays.length ?? 0;
				return /* @__PURE__ */ o("li", { children: /* @__PURE__ */ s("button", {
					type: "button",
					className: "c-journey-card c-wide",
					onClick: () => r(n.id),
					children: [
						/* @__PURE__ */ o("b", { children: n.title }),
						/* @__PURE__ */ o("small", { children: n.blurb }),
						/* @__PURE__ */ o("em", { children: i === 0 ? t.dayZero(c(n)) : `${i} of ${c(n)} done` })
					]
				}) }, n.id);
			})
		})
	] });
}
function u(e, t) {
	let n = 0;
	return e.days.map((e, r) => {
		if (e.kind === "rest") return {
			no: r + 1,
			rest: !0,
			templateId: void 0
		};
		let i = t[n];
		return n += 1, {
			no: r + 1,
			rest: !1,
			templateId: i
		};
	});
}
function d(n) {
	let a = r(n.id);
	if (a === void 0) return /* @__PURE__ */ o("p", {
		className: "c-empty",
		children: t.journeysEmpty
	});
	let c = n.progress[n.id], l = e(), d = u(a, c?.pickedIds ?? []), f = d.find((e) => !e.rest && !(c?.doneDays.includes(e.no) ?? !1))?.no;
	return /* @__PURE__ */ s("div", { children: [
		/* @__PURE__ */ o("button", {
			type: "button",
			className: "c-btn c-link c-back",
			onClick: n.onBack,
			children: t.back
		}),
		/* @__PURE__ */ o("h1", {
			className: "c-h1",
			children: a.title
		}),
		/* @__PURE__ */ o("p", {
			className: "c-lead",
			children: a.blurb
		}),
		c === void 0 ? /* @__PURE__ */ o("button", {
			type: "button",
			className: "c-btn c-primary",
			"data-testid": "journey-start",
			onClick: () => n.onStartJourney(n.id, {
				startedAt: n.todayDay,
				doneDays: [],
				pickedIds: i(n.profile, n.id, n.todayDay)
			}),
			children: t.startJourney
		}) : /* @__PURE__ */ o("ol", {
			className: "c-days",
			children: d.map((e) => {
				let r = c.doneDays.includes(e.no), i = e.templateId === void 0 ? void 0 : l.find((t) => t.id === e.templateId), a = e.rest ? t.restDay : i?.name ?? "Session", u = e.rest ? "" : `${i?.recommendedMinutes ?? 0} min`;
				return /* @__PURE__ */ s("li", {
					className: `c-day${e.rest ? " c-rest" : ""}${r ? " c-done" : ""}${e.no === f ? " c-now" : ""}`,
					children: [
						/* @__PURE__ */ o("span", {
							className: "c-badge",
							"aria-hidden": "true",
							children: e.no
						}),
						/* @__PURE__ */ s("span", {
							className: "c-d-text",
							children: [/* @__PURE__ */ o("b", { children: `Day ${e.no}${r ? `, ${t.done}` : ""}` }), /* @__PURE__ */ o("small", { children: [a, u].filter((e) => e !== "").join(", ") })]
						}),
						!e.rest && i !== void 0 && /* @__PURE__ */ o("button", {
							type: "button",
							className: "c-btn c-small",
							"aria-label": `${t.play} day ${e.no}, ${i.name}`,
							onClick: () => n.onPlayDay(n.id, e.no, i),
							children: r ? t.play : t.start
						})
					]
				}, e.no);
			})
		}),
		c !== void 0 && /* @__PURE__ */ o("button", {
			type: "button",
			className: "c-btn c-link",
			onClick: () => n.onRestart(n.id),
			children: t.restart
		})
	] });
}
export { d as JourneyDetail, l as JourneyList };
