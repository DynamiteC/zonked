import { useEffect as e, useMemo as t, useState as n } from "react";
import { r, t as i } from "./chunk-favorites-CH3XBDrL.mjs";
import { a, t as o } from "./chunk-catalog-DUQ1JcEF.mjs";
import { t as s } from "./chunk-soundMenu-C52iaQfx.mjs";
import { Q as c, Y as l, Z as u } from "./chunk-crewLink-DfIjAvPP.mjs";
import { t as d } from "./chunk-icons-C-FdU5cO.mjs";
import { n as f } from "./chunk-MascotView-Cmnhlpu8.mjs";
import { Fragment as p, jsx as m, jsxs as h } from "react/jsx-runtime";
// ../../web/src/ui/calm/Library.tsx
var g = 10;
function _({ list: e, onPlay: t }) {
	return /* @__PURE__ */ m("ul", {
		className: "c-list",
		children: e.map((e) => /* @__PURE__ */ m("li", { children: /* @__PURE__ */ h("button", {
			type: "button",
			className: "c-row-card c-row-play",
			onClick: () => t(e),
			children: [/* @__PURE__ */ m("b", { children: e.name }), /* @__PURE__ */ m("small", { children: `${e.recommendedMinutes} min` })]
		}) }, e.id))
	});
}
var v = ({ text: e }) => /* @__PURE__ */ m("p", {
	className: "c-empty",
	children: e
});
function y({ onPlay: e }) {
	let [r, i] = n(null), [o, s] = n(0), u = t(() => {
		let e = {};
		for (let t of a()) for (let n of t.situations) e[n] = (e[n] ?? 0) + 1;
		return e;
	}, []), f = t(() => a().filter((e) => r !== null && e.situations.includes(r)), [r]);
	return /* @__PURE__ */ h(p, { children: [
		/* @__PURE__ */ m("ul", {
			className: "c-tiles",
			children: c.map((e) => /* @__PURE__ */ m("li", { children: /* @__PURE__ */ h("button", {
				type: "button",
				className: "c-tile",
				"aria-pressed": r === e.id,
				onClick: () => {
					i(e.id), s(0);
				},
				children: [
					/* @__PURE__ */ m(d, { name: e.icon }),
					/* @__PURE__ */ m("span", {
						className: "c-tile-name",
						children: e.label
					}),
					/* @__PURE__ */ m("span", {
						className: "c-tile-mood",
						children: e.mood
					}),
					/* @__PURE__ */ m("span", {
						className: "c-tile-count",
						children: l.sounds(u[e.id] ?? 0)
					})
				]
			}) }, e.id))
		}),
		r !== null && /* @__PURE__ */ m(_, {
			list: f.slice(o * g, o * g + g),
			onPlay: e
		}),
		r !== null && f.length > g && /* @__PURE__ */ h("div", {
			className: "c-actions c-row",
			children: [/* @__PURE__ */ m("button", {
				type: "button",
				className: "c-btn c-small",
				disabled: o === 0,
				onClick: () => s(o - 1),
				children: l.back
			}), /* @__PURE__ */ m("button", {
				type: "button",
				className: "c-btn c-small",
				disabled: (o + 1) * g >= f.length,
				onClick: () => s(o + 1),
				children: l.next
			})]
		})
	] });
}
function b({ onPlay: e, onBreathe: t }) {
	let n = a();
	return /* @__PURE__ */ h("ul", {
		className: "c-list",
		children: [t !== void 0 && /* @__PURE__ */ m("li", { children: /* @__PURE__ */ h("button", {
			type: "button",
			className: "c-row-card",
			"data-testid": "sounds-breathe",
			onClick: t,
			children: [/* @__PURE__ */ m("b", { children: l.breatheEntry }), /* @__PURE__ */ m("small", { children: l.breatheEntryHint })]
		}) }), s.map((t) => {
			let r = n.find((e) => e.id === t.templateId);
			return /* @__PURE__ */ m("li", { children: /* @__PURE__ */ h("button", {
				type: "button",
				className: "c-row-card c-row-play",
				disabled: r === void 0,
				onClick: () => r !== void 0 && e(r),
				children: [
					/* @__PURE__ */ m("b", { children: t.name }),
					/* @__PURE__ */ m("small", { children: t.blurb }),
					/* @__PURE__ */ m("small", { children: t.id === "violet" ? "Start very quiet." : u[t.evidence] })
				]
			}) }, t.id);
		})]
	});
}
function x(t) {
	let [a, o] = n(i), [s, c] = n([]);
	return e(() => {
		let e = !0;
		return t.getRecord("favorites").then((t) => e && o(r(t, Date.now()))).catch(() => void 0), t.listMixes().then((t) => e && c(t)).catch(() => void 0), () => {
			e = !1;
		};
	}, [t]), {
		favs: a,
		mixes: s
	};
}
function S({ store: e, logs: r, reduced: i = !1, onNature: s, onBreathe: c, onPlay: u, onPlayMix: d }) {
	let [g, S] = n(0), [C, w] = n(""), { favs: T, mixes: E } = x(e), D = C.trim().slice(0, 80), O = t(() => D === "" ? [] : o({ text: D }).slice(0, 20), [D]), k = t(() => a(), []), A = T.items.filter((e) => e.kind === "template").map((e) => k.find((t) => t.id === e.id)).filter((e) => e !== void 0), j = r.slice(0, 10);
	return /* @__PURE__ */ h("div", { children: [
		/* @__PURE__ */ m(f, {
			title: l.libraryTitle,
			reduced: i
		}),
		s !== void 0 && /* @__PURE__ */ h("button", {
			type: "button",
			className: "c-link-card c-nature-link",
			"data-testid": "open-nature",
			onClick: s,
			children: [/* @__PURE__ */ m("b", { children: l.natureTitle }), /* @__PURE__ */ m("span", {
				className: "c-muted",
				children: l.natureLine
			})]
		}),
		/* @__PURE__ */ h("div", {
			className: "c-search",
			children: [/* @__PURE__ */ m("label", {
				htmlFor: "c-search-in",
				className: "c-sr",
				children: l.searchLabel
			}), /* @__PURE__ */ m("input", {
				id: "c-search-in",
				type: "search",
				placeholder: l.searchLabel,
				value: C,
				maxLength: 80,
				onChange: (e) => w(e.target.value)
			})]
		}),
		D === "" ? /* @__PURE__ */ h(p, { children: [/* @__PURE__ */ m("div", {
			className: "c-tabs",
			role: "tablist",
			"aria-label": l.libraryTitle,
			children: l.tabs.map((e, t) => /* @__PURE__ */ m("button", {
				type: "button",
				role: "tab",
				id: `c-tab-${t}`,
				"aria-selected": g === t,
				"aria-controls": "c-tabpanel",
				className: "c-tab",
				onClick: () => S(t),
				children: e
			}, e))
		}), /* @__PURE__ */ h("div", {
			id: "c-tabpanel",
			role: "tabpanel",
			"aria-labelledby": `c-tab-${g}`,
			children: [
				g === 0 && /* @__PURE__ */ m(y, { onPlay: u }),
				g === 1 && /* @__PURE__ */ m(b, {
					onPlay: u,
					...c === void 0 ? {} : { onBreathe: c }
				}),
				g === 2 && (A.length === 0 ? /* @__PURE__ */ m(v, { text: l.emptyFavorites }) : /* @__PURE__ */ m(_, {
					list: A,
					onPlay: u
				})),
				g === 3 && (E.length === 0 ? /* @__PURE__ */ m(v, { text: l.emptyMixes }) : /* @__PURE__ */ m("ul", {
					className: "c-list",
					children: E.map((e) => /* @__PURE__ */ m("li", { children: /* @__PURE__ */ m("button", {
						type: "button",
						className: "c-row-card",
						onClick: () => d(e),
						children: /* @__PURE__ */ m("b", { children: e.name })
					}) }, e.id))
				})),
				g === 4 && (j.length === 0 ? /* @__PURE__ */ m(v, { text: l.emptyRecent }) : /* @__PURE__ */ m("ul", {
					className: "c-list",
					children: j.map((e) => /* @__PURE__ */ h("li", {
						className: "c-row-card",
						children: [/* @__PURE__ */ m("b", { children: new Date(e.startedAt).toLocaleDateString() }), /* @__PURE__ */ m("small", { children: `${Math.max(1, Math.round((e.endedAt - e.startedAt) / 6e4))} min` })]
					}, e.id))
				}))
			]
		})] }) : O.length === 0 ? /* @__PURE__ */ m(v, { text: l.searchEmpty }) : /* @__PURE__ */ m(_, {
			list: O,
			onPlay: u
		})
	] });
}
export { S as Library };
