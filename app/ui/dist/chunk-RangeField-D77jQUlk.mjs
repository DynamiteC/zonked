import { useState as e } from "react";
import { jsx as t, jsxs as n } from "react/jsx-runtime";
// ../../web/src/ui/recContext.ts
function r(e) {
	let t = Math.max(0, Math.ceil(e)), n = Math.floor(t / 60), r = Math.floor(n / 60), i = (e) => String(e).padStart(2, "0");
	return r > 0 ? `${r}:${i(n % 60)}:${i(t % 60)}` : `${i(n)}:${i(t % 60)}`;
}
// ../../web/src/ui/shared/RangeField.tsx
function i(e, t, n) {
	return !Number.isFinite(e) || n <= t ? 0 : Math.min(1, Math.max(0, (e - t) / (n - t)));
}
function a(e = 1) {
	return [...[
		{
			value: 0,
			label: "Off"
		},
		{
			value: .25,
			label: "25"
		},
		{
			value: .5,
			label: "50"
		},
		{
			value: .75,
			label: "75"
		}
	].filter((t) => t.value < e - .01), {
		value: e,
		label: "Max"
	}];
}
var o = (e) => ({ "--f": e });
function s(r) {
	let [a, s] = e(!1), [c, l] = e(!1), u = i(r.value, r.min, r.max), d = a || c;
	return /* @__PURE__ */ n("div", {
		className: "rf",
		style: o(u),
		"data-testid": r.testId ? `${r.testId}-field` : void 0,
		children: [
			/* @__PURE__ */ t("div", {
				className: "rf-top",
				children: d && /* @__PURE__ */ t("span", {
					className: "rf-bubble",
					"aria-hidden": "true",
					"data-testid": "rf-bubble",
					children: r.bubbleText ?? String(r.value)
				})
			}),
			/* @__PURE__ */ t("input", {
				id: r.id,
				"data-testid": r.testId,
				className: "rf-input",
				type: "range",
				min: r.min,
				max: r.max,
				step: r.step,
				value: r.value,
				disabled: r.disabled,
				"aria-valuetext": r.valueText,
				onChange: (e) => r.onChange(Number(e.target.value)),
				onFocus: () => s(!0),
				onBlur: () => {
					s(!1), l(!1);
				},
				onPointerDown: () => l(!0),
				onPointerUp: () => l(!1),
				onPointerCancel: () => l(!1)
			}),
			r.bands && r.bands.length > 0 && /* @__PURE__ */ t("div", {
				className: "rf-bands",
				"aria-hidden": "true",
				children: r.bands.map((e) => /* @__PURE__ */ t("span", {
					className: "rf-band",
					"data-active": e.active ? "true" : "false",
					"data-testid": "rf-band",
					style: {
						left: `${i(e.from, r.min, r.max) * 100}%`,
						width: `${(i(e.to, r.min, r.max) - i(e.from, r.min, r.max)) * 100}%`
					},
					children: e.label
				}, `${e.label}-${e.from}`))
			}),
			r.ticks && r.ticks.length > 0 && /* @__PURE__ */ t("div", {
				className: "rf-ticks",
				"aria-hidden": "true",
				children: r.ticks.map((e) => /* @__PURE__ */ n("span", {
					className: "rf-tick",
					"data-testid": "rf-tick",
					style: o(i(e.value, r.min, r.max)),
					children: [/* @__PURE__ */ t("i", {}), /* @__PURE__ */ t("b", { children: e.label })]
				}, `${e.value}-${e.label}`))
			})
		]
	});
}
export { a as n, r, s as t };
