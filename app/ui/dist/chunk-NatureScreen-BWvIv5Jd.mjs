import { Suspense as e, lazy as t, useState as n } from "react";
import { r, t as i } from "./chunk-samples-BgYriVps.mjs";
import { Y as a } from "./chunk-crewLink-DfIjAvPP.mjs";
import { t as o } from "./chunk-icons-C-FdU5cO.mjs";
import { n as s } from "./chunk-MascotView-Cmnhlpu8.mjs";
import { g as c } from "./chunk-data-Bhxfb-cT.mjs";
import { jsx as l, jsxs as u } from "react/jsx-runtime";
// ../../web/src/ui/calm/nature/groups.ts
var d = [
	"Water",
	"Rain",
	"Wind and birds",
	"Fire and bells",
	"Made in code"
], f = /* @__PURE__ */ new Set([
	"rain",
	"lightrain",
	"thunder",
	"veranda",
	"window",
	"storm"
]), p = /* @__PURE__ */ new Set([
	"forest",
	"birds",
	"breeze",
	"hum"
]), m = /* @__PURE__ */ new Set([
	"fire",
	"chimes",
	"koshi",
	"gong"
]);
function h(e) {
	return e.kind === "synth" ? "Made in code" : f.has(e.id) ? "Rain" : p.has(e.id) ? "Wind and birds" : m.has(e.id) ? "Fire and bells" : "Water";
}
// ../../web/src/ui/calm/nature/prefs.ts
var g = "zonked.nature.v1", _ = .3, v = .4, y = .85, b = {
	id: null,
	blend: _,
	level: v
}, x = (e, t, n, r) => typeof e == "number" && Number.isFinite(e) ? Math.min(n, Math.max(t, e)) : r;
function S(e) {
	if (e === null || e.length > 400) return b;
	try {
		let t = JSON.parse(e);
		return {
			id: typeof t.id == "string" && /^(own:)?[a-z0-9]{3,40}$/.test(t.id) ? t.id : null,
			blend: x(t.blend, 0, 1, _),
			level: x(t.level, 0, y, v)
		};
	} catch {
		return b;
	}
}
var C = () => {
	try {
		return typeof localStorage > "u" ? null : localStorage;
	} catch {
		return null;
	}
}, w = () => S(C()?.getItem("zonked.nature.v1") ?? null);
function T(e) {
	try {
		C()?.setItem(g, JSON.stringify(e));
	} catch {}
}
function E() {
	try {
		C()?.removeItem(g);
	} catch {}
}
// ../../web/src/ui/calm/nature/NatureScreen.tsx
var D = /* @__PURE__ */ r({ NatureScreen: () => F }), O = {
	wind: "breeze",
	waterfall: "rapids",
	flute: "wave"
}, k = t(() => import("./chunk-MySounds-Dn4O_e5Q.mjs").then((e) => ({ default: e.MySounds }))), A = t(() => import("./chunk-Credits-Bhokne3A.mjs").then((e) => ({ default: e.Credits })));
function j({ id: e, label: t, value: n, max: r, onChange: i }) {
	return /* @__PURE__ */ u("div", {
		className: "c-slider",
		children: [/* @__PURE__ */ l("label", {
			htmlFor: e,
			children: t
		}), /* @__PURE__ */ l("input", {
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
function M({ nature: e }) {
	return /* @__PURE__ */ u("div", {
		className: "c-nature-controls",
		children: [/* @__PURE__ */ l(j, {
			id: "c-blend",
			label: a.natureBlend,
			value: e.prefs.blend,
			max: 1,
			onChange: e.setBlend
		}), /* @__PURE__ */ l(j, {
			id: "c-nlevel",
			label: a.natureLevel,
			value: e.prefs.level,
			max: y,
			onChange: e.setLevel
		})]
	});
}
function N({ s: e, i: t, nature: n }) {
	return /* @__PURE__ */ l("li", { children: /* @__PURE__ */ u("button", {
		type: "button",
		className: `c-tile c-g${t % 6 + 1}`,
		"data-testid": `nature-${e.id}`,
		"aria-pressed": n.on === e.id,
		onClick: () => n.start(e.id),
		children: [
			/* @__PURE__ */ l(o, { name: O[e.id] ?? e.id }),
			/* @__PURE__ */ l("span", {
				className: "c-tile-name",
				children: e.label
			}),
			/* @__PURE__ */ l("span", {
				className: "c-tile-mood",
				children: e.note ?? (e.kind === "synth" ? a.natureMade : a.natureFree)
			}),
			n.on === e.id && /* @__PURE__ */ l("span", {
				className: "c-tile-count",
				children: a.natureOn
			})
		]
	}) });
}
function P({ samples: t }) {
	let [r, i] = n(""), o = t.find((e) => e.id === r);
	return /* @__PURE__ */ u("section", {
		className: "c-credits-foot",
		"aria-label": a.natureCredits,
		children: [
			/* @__PURE__ */ l("label", {
				htmlFor: "c-credit-pick",
				children: a.natureCredits
			}),
			/* @__PURE__ */ u("select", {
				id: "c-credit-pick",
				value: r,
				onChange: (e) => i(e.currentTarget.value),
				children: [/* @__PURE__ */ l("option", {
					value: "",
					children: a.natureCreditsPick
				}), t.map((e) => /* @__PURE__ */ l("option", {
					value: e.id,
					children: e.label
				}, e.id))]
			}),
			o !== void 0 && /* @__PURE__ */ l(e, {
				fallback: null,
				children: /* @__PURE__ */ l(A, {
					id: o.id,
					synth: o.kind === "synth"
				})
			})
		]
	});
}
function F({ nature: t, reduced: n, onBack: r, device: o = "wired" }) {
	let f = i();
	return /* @__PURE__ */ u("div", {
		className: "c-nature",
		children: [
			/* @__PURE__ */ l(s, {
				title: a.natureHead,
				reduced: n
			}),
			/* @__PURE__ */ l("p", {
				className: "c-lead",
				children: a.natureIntro
			}),
			/* @__PURE__ */ u("div", {
				className: "c-sticky",
				"data-testid": "nature-sticky",
				children: [/* @__PURE__ */ l(M, { nature: t }), t.on !== null && /* @__PURE__ */ l("button", {
					type: "button",
					className: "c-btn c-wide",
					"data-testid": "nature-stop",
					onClick: t.stop,
					children: a.natureOff
				})]
			}),
			d.map((e) => {
				let n = c(f.filter((t) => h(t) === e), o);
				return n.length === 0 ? null : /* @__PURE__ */ u("section", {
					"aria-labelledby": `c-ng-${e.replaceAll(" ", "-")}`,
					children: [/* @__PURE__ */ l("h2", {
						className: "c-h3",
						id: `c-ng-${e.replaceAll(" ", "-")}`,
						children: e
					}), /* @__PURE__ */ l("ul", {
						className: "c-tiles c-nature-tiles",
						children: n.map((e) => /* @__PURE__ */ l(N, {
							s: e,
							i: f.indexOf(e),
							nature: t
						}, e.id))
					})]
				}, e);
			}),
			/* @__PURE__ */ l("p", {
				className: "c-status",
				role: "status",
				"data-testid": "nature-message",
				children: t.message
			}),
			/* @__PURE__ */ l("p", {
				className: "c-note",
				children: a.natureNote
			}),
			/* @__PURE__ */ l(P, { samples: f }),
			/* @__PURE__ */ l(e, {
				fallback: null,
				children: /* @__PURE__ */ l(k, { nature: t })
			}),
			/* @__PURE__ */ l("button", {
				type: "button",
				className: "c-btn c-link c-back",
				onClick: r,
				children: a.natureBack
			})
		]
	});
}
export { w as a, E as i, j as n, T as o, y as r, D as t };
