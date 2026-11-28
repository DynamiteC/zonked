import { useEffect as e, useState as t } from "react";
import { Y as n, c as r, d as i, f as a, i as o, l as s, m as c, n as l, o as u, p as d, r as f, t as p, u as m } from "./chunk-crewLink-DfIjAvPP.mjs";
import { jsx as h, jsxs as g } from "react/jsx-runtime";
// src/Panel.tsx
function _(e) {
	let t = e.timer;
	return t.kind !== "countdown" || !t.running ? null : Math.ceil(t.remainingSec / 60);
}
function v(e) {
	let t = _(e);
	return e.playing ? t === null ? n.panelPlaying : `${n.panelPlaying} About ${String(t)} min left.` : d() ? e.templateId === null ? n.panelPickFirst : n.panelStopped : n.panelOpenFirst;
}
function y() {
	o(import.meta.url), f();
	let { player: s } = i(), [m, _] = t(u), [y, b] = t(p), [x, S] = t(a);
	e(() => l(b), []), e(() => c(S), []);
	let [C, w] = t(() => s.snapshot());
	e(() => (w(s.snapshot()), s.subscribe(w)), [s]);
	let T = d() && C.templateId !== null, E = m ? y === "connected" ? n.panelCrewOn : n.panelCrewLost : n.panelCrewOff;
	return /* @__PURE__ */ h("div", {
		className: "c-app c-panel",
		"data-testid": "zonked-panel",
		"data-theme": "auto",
		children: /* @__PURE__ */ g("div", {
			className: "c-card",
			children: [
				/* @__PURE__ */ h("strong", {
					"data-testid": "panel-title",
					children: C.templateName ?? n.brand
				}),
				/* @__PURE__ */ h("p", {
					className: "c-muted",
					"data-testid": "panel-hint",
					role: "status",
					children: v(C)
				}),
				x ? null : C.playing ? /* @__PURE__ */ h("button", {
					type: "button",
					className: "c-btn c-small",
					"data-testid": "panel-stop",
					onClick: () => void s.stop(),
					children: n.stop
				}) : /* @__PURE__ */ h("button", {
					type: "button",
					className: "c-btn c-small",
					"data-testid": "panel-play",
					disabled: !T,
					onClick: () => void s.play(),
					children: n.play
				}),
				/* @__PURE__ */ g("label", {
					className: "c-switch",
					children: [
						/* @__PURE__ */ h("input", {
							type: "checkbox",
							role: "switch",
							"data-testid": "panel-crew",
							checked: m,
							onChange: (e) => {
								_(e.target.checked), r(e.target.checked);
							}
						}),
						/* @__PURE__ */ h("span", {
							className: "c-track",
							"aria-hidden": "true"
						}),
						/* @__PURE__ */ h("span", { children: n.panelCrewLabel })
					]
				}),
				/* @__PURE__ */ h("p", {
					className: "c-muted",
					"data-testid": "panel-crew-status",
					role: "status",
					children: E
				})
			]
		})
	});
}
export { y as default, s as engineState, m as engineStats };
