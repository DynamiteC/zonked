import { t as e } from "./chunk-useEscape-DDjzYcK_.mjs";
import { useEffect as t, useRef as n } from "react";
import { st as r } from "./chunk-crewLink-B-5l2pQt.mjs";
import { n as i } from "./chunk-FormFrame-BoSz-j25.mjs";
import { jsx as a, jsxs as o } from "react/jsx-runtime";
// ../../web/src/ui/calm/SafetyNotice.tsx
function s({ onAccept: s, onCancel: c, onBack: l }) {
	let u = n(null);
	t(() => u.current?.querySelector("[data-testid=\"calm-safety-accept\"]")?.focus(), []), e(() => c?.(), c !== void 0);
	let d = (e) => {
		if (c !== void 0 && e.key === "Tab") {
			let t = u.current?.querySelectorAll("button") ?? [], n = t[0], r = t[t.length - 1], i = e.shiftKey ? n : r;
			document.activeElement === i && (e.preventDefault(), (e.shiftKey ? r : n)?.focus());
		}
	}, f = c ?? l, p = /* @__PURE__ */ o("div", {
		className: "c-safety",
		ref: u,
		onKeyDown: d,
		children: [
			a(c === void 0 ? "h1" : "h2", {
				id: "c-safety-title",
				children: r.safetyTitle
			}),
			/* @__PURE__ */ a("ul", {
				className: "c-safe-list",
				children: r.safetyLines.map((e) => /* @__PURE__ */ a("li", { children: e }, e))
			}),
			/* @__PURE__ */ a("p", {
				className: "c-limits",
				"data-testid": "safety-limits",
				children: r.safetyLimits
			}),
			/* @__PURE__ */ a(i, {
				left: f === void 0 ? null : {
					label: r.back,
					onClick: f
				},
				next: {
					label: r.safetyAccept,
					onClick: s,
					testid: "calm-safety-accept"
				}
			})
		]
	});
	return c === void 0 ? p : /* @__PURE__ */ a("div", {
		className: "c-overlay",
		children: /* @__PURE__ */ a("div", {
			className: "c-dialog",
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": "c-safety-title",
			children: p
		})
	});
}
export { s as t };
