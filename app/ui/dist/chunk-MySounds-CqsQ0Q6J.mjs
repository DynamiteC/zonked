import { useCallback as e, useEffect as t, useRef as n, useState as r } from "react";
import { st as i } from "./chunk-crewLink-B-5l2pQt.mjs";
import { t as a } from "./chunk-icons-C-FdU5cO.mjs";
import "./chunk-own-D62uDPlI.mjs";
import { a as o, i as s, o as c, s as l, t as u } from "./chunk-ownStore-BhAw3wjz.mjs";
import { jsx as d, jsxs as f } from "react/jsx-runtime";
// ../../web/src/ui/calm/nature/MySounds.tsx
var p = (e) => `${(e / 1048576).toFixed(1)} MB`;
async function m(e) {
	if (e.size > 8388608) return "This file is bigger than 8 MB.";
	try {
		return await e.arrayBuffer();
	} catch {
		return "This file could not be read.";
	}
}
function h() {
	let [n, a] = r([]), [d, f] = r(""), p = e(async () => {
		let e = await s();
		e.ok ? a(e.value) : f(e.error);
	}, []);
	return t(() => void p(), [p]), {
		items: n,
		status: d,
		add: e(async (e) => {
			f("");
			let t = await m(e);
			if (typeof t == "string") return f(t);
			let n = await l(t);
			if (!n.ok) return f(n.error);
			let r = await u(e.name, t);
			f(r.ok ? i.mineAdded : r.error), await p();
		}, [p]),
		remove: e(async (e) => {
			let t = await c(e);
			t.ok || f(t.error), await p();
		}, [p]),
		removeAll: e(async () => {
			let e = await o();
			e.ok || f(e.error), await p();
		}, [p])
	};
}
function g({ nature: e }) {
	let t = h(), r = n(null), { remove: o, removeAll: s } = t, c = (t) => {
		e.on === t && e.stop(), o(t);
	};
	return /* @__PURE__ */ f("section", {
		className: "c-card c-mine",
		"aria-labelledby": "c-mine-h",
		"data-testid": "my-sounds",
		children: [
			/* @__PURE__ */ d("h2", {
				id: "c-mine-h",
				className: "c-h3",
				children: i.mineTitle
			}),
			/* @__PURE__ */ d("p", {
				className: "c-eyebrow",
				"data-testid": "mine-stays",
				children: i.mineStays
			}),
			/* @__PURE__ */ d("p", {
				className: "c-muted",
				children: i.mineNote
			}),
			/* @__PURE__ */ d("p", {
				className: "c-muted",
				children: i.mineLimits
			}),
			/* @__PURE__ */ d("input", {
				ref: r,
				className: "c-sr",
				id: "c-mine-file",
				type: "file",
				accept: "audio/*",
				"data-testid": "mine-file",
				tabIndex: -1,
				onChange: (e) => {
					let n = e.currentTarget.files?.[0];
					e.currentTarget.value = "", n !== void 0 && t.add(n);
				}
			}),
			/* @__PURE__ */ d("button", {
				type: "button",
				className: "c-btn",
				onClick: () => r.current?.click(),
				children: i.mineChoose
			}),
			/* @__PURE__ */ d("p", {
				className: "c-status",
				role: "status",
				"data-testid": "mine-status",
				children: t.status
			}),
			t.items.length === 0 ? /* @__PURE__ */ d("p", {
				className: "c-muted",
				children: i.mineEmpty
			}) : /* @__PURE__ */ d("ul", {
				className: "c-list",
				children: t.items.map((t) => /* @__PURE__ */ f("li", {
					className: "c-own-row",
					children: [/* @__PURE__ */ f("button", {
						type: "button",
						className: "c-row-card",
						"data-testid": "mine-play",
						"aria-pressed": e.on === t.id,
						onClick: () => e.start(t.id),
						children: [/* @__PURE__ */ f("span", { children: [
							/* @__PURE__ */ d(a, { name: "file" }),
							" ",
							/* @__PURE__ */ d("b", { children: t.name })
						] }), /* @__PURE__ */ d("small", { children: p(t.size) })]
					}), /* @__PURE__ */ d("button", {
						type: "button",
						className: "c-btn c-small",
						"data-testid": "mine-remove",
						"aria-label": `${i.mineRemove} ${t.name}`,
						onClick: () => c(t.id),
						children: i.mineRemove
					})]
				}, t.id))
			}),
			t.items.length > 0 && /* @__PURE__ */ d("button", {
				type: "button",
				className: "c-btn c-link",
				"data-testid": "mine-remove-all",
				onClick: () => {
					e.stop(), s();
				},
				children: i.mineRemoveAll
			})
		]
	});
}
export { g as MySounds };
