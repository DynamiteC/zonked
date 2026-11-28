import { Suspense as e, lazy as t } from "react";
import { jsx as n, jsxs as r } from "react/jsx-runtime";
// ../../web/src/ui/calm/MascotView.tsx
var i = t(() => import("./chunk-mascot-BpzGguPW.mjs").then((e) => ({ default: e.CalmMascot })));
function a({ size: t, mood: r = "idle", reduced: a }) {
	return /* @__PURE__ */ n(e, {
		fallback: /* @__PURE__ */ n("span", {
			className: "c-mascot-gap",
			style: {
				width: t,
				height: t
			}
		}),
		children: /* @__PURE__ */ n(i, {
			mood: r,
			size: t,
			reducedMotion: a
		})
	});
}
function o({ title: e, reduced: t }) {
	return /* @__PURE__ */ r("header", {
		className: "c-pagehead",
		children: [/* @__PURE__ */ n(a, {
			size: 72,
			reduced: t
		}), /* @__PURE__ */ n("h1", {
			className: "c-h1",
			children: e
		})]
	});
}
export { o as n, a as t };
