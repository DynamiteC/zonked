import { useEffect as e, useRef as t } from "react";
import { Y as n } from "./chunk-crewLink-DfIjAvPP.mjs";
import { n as r } from "./chunk-FormFrame-DeBPfgdj.mjs";
import { jsx as i, jsxs as a } from "react/jsx-runtime";
// ../../web/src/ui/calm/SafetyNotice.tsx
function o({ onAccept: o, onCancel: s, onBack: c }) {
	let l = t(null);
	e(() => l.current?.querySelector("[data-testid=\"calm-safety-accept\"]")?.focus(), []);
	let u = (e) => {
		if (s !== void 0) {
			if (e.key === "Escape") e.stopPropagation(), s();
			else if (e.key === "Tab") {
				let t = l.current?.querySelectorAll("button") ?? [], n = t[0], r = t[t.length - 1], i = e.shiftKey ? n : r;
				document.activeElement === i && (e.preventDefault(), (e.shiftKey ? r : n)?.focus());
			}
		}
	}, d = s ?? c, f = /* @__PURE__ */ a("div", {
		className: "c-safety",
		ref: l,
		onKeyDown: u,
		children: [
			/* @__PURE__ */ i("h2", {
				id: "c-safety-title",
				children: n.safetyTitle
			}),
			/* @__PURE__ */ i("ul", {
				className: "c-safe-list",
				children: n.safetyLines.map((e) => /* @__PURE__ */ i("li", { children: e }, e))
			}),
			/* @__PURE__ */ i("p", {
				className: "c-limits",
				"data-testid": "safety-limits",
				children: n.safetyLimits
			}),
			/* @__PURE__ */ i(r, {
				left: d === void 0 ? null : {
					label: n.back,
					onClick: d
				},
				next: {
					label: n.safetyAccept,
					onClick: o,
					testid: "calm-safety-accept"
				}
			})
		]
	});
	return s === void 0 ? f : /* @__PURE__ */ i("div", {
		className: "c-overlay",
		children: /* @__PURE__ */ i("div", {
			className: "c-dialog",
			role: "dialog",
			"aria-modal": "true",
			"aria-labelledby": "c-safety-title",
			children: f
		})
	});
}
export { o as t };
