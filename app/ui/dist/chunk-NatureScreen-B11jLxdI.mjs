import { Suspense as e, lazy as t, useState as n } from "react";
import { r, t as i } from "./chunk-samples-4EZJclX4.mjs";
import { W as a } from "./chunk-crewLink-CH1NzHoN.mjs";
import { t as o } from "./chunk-icons-C-FdU5cO.mjs";
import { n as s } from "./chunk-MascotView-CeVF4lFc.mjs";
import { jsx as c, jsxs as l } from "react/jsx-runtime";
// ../../web/src/ui/calm/nature/groups.ts
var u = [
	"Water",
	"Rain",
	"Wind and birds",
	"Fire and bells",
	"Made in code"
], d = /* @__PURE__ */ new Set([
	"rain",
	"lightrain",
	"thunder",
	"veranda",
	"window",
	"storm"
]), f = /* @__PURE__ */ new Set([
	"forest",
	"birds",
	"breeze",
	"hum"
]), p = /* @__PURE__ */ new Set([
	"fire",
	"chimes",
	"koshi",
	"gong"
]);
function m(e) {
	return e.kind === "synth" ? "Made in code" : d.has(e.id) ? "Rain" : f.has(e.id) ? "Wind and birds" : p.has(e.id) ? "Fire and bells" : "Water";
}
// ../../web/src/ui/calm/nature/prefs.ts
var h = "zonked.nature.v1", g = .3, _ = .4, v = .85, y = {
	id: null,
	blend: g,
	level: _
}, b = (e, t, n, r) => typeof e == "number" && Number.isFinite(e) ? Math.min(n, Math.max(t, e)) : r;
function x(e) {
	if (e === null || e.length > 400) return y;
	try {
		let t = JSON.parse(e);
		return {
			id: typeof t.id == "string" && /^(own:)?[a-z0-9]{3,40}$/.test(t.id) ? t.id : null,
			blend: b(t.blend, 0, 1, g),
			level: b(t.level, 0, v, _)
		};
	} catch {
		return y;
	}
}
var S = () => {
	try {
		return typeof localStorage > "u" ? null : localStorage;
	} catch {
		return null;
	}
}, C = () => x(S()?.getItem("zonked.nature.v1") ?? null);
function w(e) {
	try {
		S()?.setItem(h, JSON.stringify(e));
	} catch {}
}
function T() {
	try {
		S()?.removeItem(h);
	} catch {}
}
// ../../web/src/ui/calm/nature/NatureScreen.tsx
var E = /* @__PURE__ */ r({ NatureScreen: () => P }), D = {
	wind: "breeze",
	waterfall: "rapids",
	flute: "wave"
}, O = t(() => import("./chunk-MySounds-CeJhiPxI.mjs").then((e) => ({ default: e.MySounds }))), k = t(() => import("./chunk-Credits-D_Dv2ZGx.mjs").then((e) => ({ default: e.Credits })));
function A({ id: e, label: t, value: n, max: r, onChange: i }) {
	return /* @__PURE__ */ l("div", {
		className: "c-slider",
		children: [/* @__PURE__ */ c("label", {
			htmlFor: e,
			children: t
		}), /* @__PURE__ */ c("input", {
			id: e,
			type: "range",
			min: 0,
			max: r,
			step: .05,
			value: n,
			"aria-valuetext": `${Math.round(n / r * 100)} percent`,
			onChange: (e) => i(Number(e.currentTarget.value))
		})]
	});
}
function j({ nature: e }) {
	return /* @__PURE__ */ l("div", {
		className: "c-nature-controls",
		children: [/* @__PURE__ */ c(A, {
			id: "c-blend",
			label: a.natureBlend,
			value: e.prefs.blend,
			max: 1,
			onChange: e.setBlend
		}), /* @__PURE__ */ c(A, {
			id: "c-nlevel",
			label: a.natureLevel,
			value: e.prefs.level,
			max: v,
			onChange: e.setLevel
		})]
	});
}
function M({ s: e, i: t, nature: n }) {
	return /* @__PURE__ */ c("li", { children: /* @__PURE__ */ l("button", {
		type: "button",
		className: `c-tile c-g${t % 6 + 1}`,
		"data-testid": `nature-${e.id}`,
		"aria-pressed": n.on === e.id,
		onClick: () => n.start(e.id),
		children: [
			/* @__PURE__ */ c(o, { name: D[e.id] ?? e.id }),
			/* @__PURE__ */ c("span", {
				className: "c-tile-name",
				children: e.label
			}),
			/* @__PURE__ */ c("span", {
				className: "c-tile-mood",
				children: e.note ?? (e.kind === "synth" ? a.natureMade : a.natureFree)
			}),
			n.on === e.id && /* @__PURE__ */ c("span", {
				className: "c-tile-count",
				children: a.natureOn
			})
		]
	}) });
}
function N({ samples: t }) {
	let [r, i] = n(""), o = t.find((e) => e.id === r);
	return /* @__PURE__ */ l("section", {
		className: "c-credits-foot",
		"aria-label": a.natureCredits,
		children: [
			/* @__PURE__ */ c("label", {
				htmlFor: "c-credit-pick",
				children: a.natureCredits
			}),
			/* @__PURE__ */ l("select", {
				id: "c-credit-pick",
				value: r,
				onChange: (e) => i(e.currentTarget.value),
				children: [/* @__PURE__ */ c("option", {
					value: "",
					children: a.natureCreditsPick
				}), t.map((e) => /* @__PURE__ */ c("option", {
					value: e.id,
					children: e.label
				}, e.id))]
			}),
			o !== void 0 && /* @__PURE__ */ c(e, {
				fallback: null,
				children: /* @__PURE__ */ c(k, {
					id: o.id,
					synth: o.kind === "synth"
				})
			})
		]
	});
}
function P({ nature: t, reduced: n, onBack: r }) {
	let o = i();
	return /* @__PURE__ */ l("div", {
		className: "c-nature",
		children: [
			/* @__PURE__ */ c(s, {
				title: a.natureHead,
				reduced: n
			}),
			/* @__PURE__ */ c("p", {
				className: "c-lead",
				children: a.natureIntro
			}),
			/* @__PURE__ */ l("div", {
				className: "c-sticky",
				"data-testid": "nature-sticky",
				children: [/* @__PURE__ */ c(j, { nature: t }), t.on !== null && /* @__PURE__ */ c("button", {
					type: "button",
					className: "c-btn c-wide",
					"data-testid": "nature-stop",
					onClick: t.stop,
					children: a.natureOff
				})]
			}),
			u.map((e) => {
				let n = o.filter((t) => m(t) === e);
				return n.length === 0 ? null : /* @__PURE__ */ l("section", {
					"aria-labelledby": `c-ng-${e.replaceAll(" ", "-")}`,
					children: [/* @__PURE__ */ c("h2", {
						className: "c-h3",
						id: `c-ng-${e.replaceAll(" ", "-")}`,
						children: e
					}), /* @__PURE__ */ c("ul", {
						className: "c-tiles c-nature-tiles",
						children: n.map((e) => /* @__PURE__ */ c(M, {
							s: e,
							i: o.indexOf(e),
							nature: t
						}, e.id))
					})]
				}, e);
			}),
			/* @__PURE__ */ c("p", {
				className: "c-status",
				role: "status",
				"data-testid": "nature-message",
				children: t.message
			}),
			/* @__PURE__ */ c("p", {
				className: "c-note",
				children: a.natureNote
			}),
			/* @__PURE__ */ c(N, { samples: o }),
			/* @__PURE__ */ c(e, {
				fallback: null,
				children: /* @__PURE__ */ c(O, { nature: t })
			}),
			/* @__PURE__ */ c("button", {
				type: "button",
				className: "c-btn c-link c-back",
				onClick: r,
				children: a.natureBack
			})
		]
	});
}
export { C as a, T as i, A as n, w as o, v as r, E as t };
