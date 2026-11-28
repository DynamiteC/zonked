import { t as e } from "./chunk-MascotView-BrlUzit0.mjs";
import { Fragment as t, jsx as n, jsxs as r } from "react/jsx-runtime";
// ../../web/src/ui/calm/FormFrame.tsx
function i({ step: t, text: i, mood: a = "idle", reduced: o }) {
	return /* @__PURE__ */ r("div", {
		className: "c-fhead",
		"data-testid": "form-head",
		children: [/* @__PURE__ */ n(e, {
			size: 72,
			mood: a,
			reduced: o
		}), /* @__PURE__ */ r("div", {
			className: "c-fhead-text",
			children: [/* @__PURE__ */ n("p", {
				className: "c-step",
				children: i
			}), /* @__PURE__ */ n("div", {
				className: "c-bar",
				"aria-hidden": "true",
				children: [
					1,
					2,
					3
				].map((e) => /* @__PURE__ */ n("i", { "data-on": e <= t ? "true" : "false" }, e))
			})]
		})]
	});
}
function a({ left: e, next: t }) {
	return /* @__PURE__ */ r("div", {
		className: "c-foot",
		"data-testid": "form-foot",
		children: [e === null ? /* @__PURE__ */ n("span", {
			className: "c-foot-gap",
			"aria-hidden": "true"
		}) : /* @__PURE__ */ n("button", {
			type: "button",
			className: "c-btn c-ghost",
			"data-testid": e.testid,
			onClick: e.onClick,
			children: e.label
		}), /* @__PURE__ */ n("button", {
			type: "button",
			className: "c-btn c-primary c-next-btn",
			"data-testid": t.testid,
			disabled: t.disabled,
			onClick: t.onClick,
			children: t.label
		})]
	});
}
function o({ title: e, helper: i, children: a }) {
	return /* @__PURE__ */ r(t, { children: [
		/* @__PURE__ */ n("h1", {
			className: "c-h1 c-ftitle",
			children: e
		}),
		i !== void 0 && /* @__PURE__ */ n("p", {
			className: "c-helper",
			children: i
		}),
		a
	] });
}
export { a as n, i as r, o as t };
