import { useEffect as e, useState as t } from "react";
import { c as n, d as r, f as i, i as a, l as o, m as s, n as c, o as l, p as u, r as d, st as f, t as p, u as m } from "./chunk-crewLink-B-5l2pQt.mjs";
import { jsx as h, jsxs as g } from "react/jsx-runtime";
// src/Panel.tsx
function _(e) {
	let t = e.timer;
	return t.kind !== "countdown" || !t.running ? null : Math.ceil(t.remainingSec / 60);
}
function v(e) {
	let t = _(e);
	return e.playing ? t === null ? f.panelPlaying : `${f.panelPlaying} About ${String(t)} min left.` : u() ? e.templateId === null ? f.panelPickFirst : f.panelStopped : f.panelOpenFirst;
}
function y() {
	a(import.meta.url), d();
	let { player: o } = r(), [m, _] = t(l), [y, b] = t(p), [x, S] = t(i);
	e(() => c(b), []), e(() => s(S), []);
	let [C, w] = t(() => o.snapshot());
	e(() => (w(o.snapshot()), o.subscribe(w)), [o]);
	let T = u() && C.templateId !== null, E = m ? y === "connected" ? f.panelCrewOn : f.panelCrewLost : f.panelCrewOff;
	return /* @__PURE__ */ h("div", {
		className: "c-app c-panel",
		"data-testid": "zonked-panel",
		"data-theme": "auto",
		children: /* @__PURE__ */ g("div", {
			className: "c-card",
			children: [
				/* @__PURE__ */ h("strong", {
					"data-testid": "panel-title",
					children: C.templateName ?? f.brand
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
					onClick: () => void o.stop(),
					children: f.stop
				}) : /* @__PURE__ */ h("button", {
					type: "button",
					className: "c-btn c-small",
					"data-testid": "panel-play",
					disabled: !T,
					onClick: () => void o.play(),
					children: f.play
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
								_(e.target.checked), n(e.target.checked);
							}
						}),
						/* @__PURE__ */ h("span", {
							className: "c-track",
							"aria-hidden": "true"
						}),
						/* @__PURE__ */ h("span", { children: f.panelCrewLabel })
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
export { y as default, o as engineState, m as engineStats };
