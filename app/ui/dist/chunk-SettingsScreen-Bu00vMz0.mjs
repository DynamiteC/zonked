import { nt as e, rt as t } from "./chunk-crewLink-TXTH-ttS.mjs";
import { S as n } from "./chunk-data-B5J84IqW.mjs";
import { t as r } from "./chunk-look-C_f0p27a.mjs";
import { n as i } from "./chunk-MascotView-Cmnhlpu8.mjs";
import { jsx as a, jsxs as o } from "react/jsx-runtime";
// ../../web/src/ui/calm/SettingsScreen.tsx
function s({ label: e, hint: t, checked: n, onChange: r, testId: i }) {
	return /* @__PURE__ */ o("label", {
		className: "c-switch",
		children: [
			/* @__PURE__ */ a("input", {
				type: "checkbox",
				role: "switch",
				"data-testid": i,
				checked: n,
				onChange: (e) => r(e.currentTarget.checked)
			}),
			/* @__PURE__ */ a("span", {
				className: "c-track",
				"aria-hidden": "true"
			}),
			/* @__PURE__ */ o("span", { children: [e, t !== void 0 && /* @__PURE__ */ a("small", {
				className: "c-muted",
				children: t
			})] })
		]
	});
}
var c = [
	"system",
	"light",
	"dark",
	"contrast"
];
function l({ value: t, onChange: n }) {
	return /* @__PURE__ */ o("fieldset", {
		className: "c-themes",
		"data-testid": "theme-picker",
		children: [/* @__PURE__ */ a("legend", { children: e.themeTitle }), c.map((r) => /* @__PURE__ */ o("label", {
			className: "c-theme-opt",
			children: [/* @__PURE__ */ a("input", {
				type: "radio",
				name: "c-theme",
				value: r,
				"data-testid": `theme-${r}`,
				checked: t === r,
				onChange: () => n(r)
			}), /* @__PURE__ */ a("span", { children: e.themeChoices[r] })]
		}, r))]
	});
}
function u({ device: c, onDevice: u, gentle: d, reduceMotion: f, reduced: p = !1, onGentle: m, onReduceMotion: h, onStudio: g, onForget: _, prefs: v, onPrefs: y, onGuide: b }) {
	return /* @__PURE__ */ o("div", { children: [
		/* @__PURE__ */ a(i, {
			title: e.settingsTitle,
			reduced: p
		}),
		c !== void 0 && u !== void 0 && /* @__PURE__ */ o("fieldset", {
			className: "c-themes",
			"data-testid": "device-picker",
			children: [
				/* @__PURE__ */ a("legend", { children: e.deviceTitle }),
				n.map((e) => /* @__PURE__ */ o("label", {
					className: "c-theme-opt",
					children: [/* @__PURE__ */ a("input", {
						type: "radio",
						name: "c-device",
						value: e,
						"data-testid": `device-${e}`,
						checked: c === e,
						onChange: () => u(e)
					}), /* @__PURE__ */ a("span", { children: t[e] })]
				}, e)),
				/* @__PURE__ */ a("small", {
					className: "c-muted",
					children: e.deviceHint
				})
			]
		}),
		/* @__PURE__ */ a(s, {
			label: e.gentle,
			hint: e.gentleHint,
			checked: d,
			onChange: m,
			testId: "gentle-switch"
		}),
		/* @__PURE__ */ a(s, {
			label: e.reduceMotion,
			checked: f,
			onChange: h,
			testId: "motion-switch"
		}),
		/* @__PURE__ */ a(l, {
			value: v.choice,
			onChange: (e) => y({
				...v,
				choice: e
			})
		}),
		/* @__PURE__ */ a(s, {
			label: e.dimLabel,
			hint: e.dimHint,
			checked: r(v),
			onChange: (e) => y({
				...v,
				dim: e
			}),
			testId: "dim-switch"
		}),
		/* @__PURE__ */ a(s, {
			label: e.announceLabel,
			hint: e.announceHint,
			checked: v.announce,
			onChange: (e) => y({
				...v,
				announce: e
			}),
			testId: "announce-switch"
		}),
		/* @__PURE__ */ o("div", {
			className: "c-actions",
			children: [
				b !== void 0 && /* @__PURE__ */ a("button", {
					type: "button",
					className: "c-btn c-link",
					"data-testid": "settings-guide",
					onClick: b,
					children: e.guideLink
				}),
				/* @__PURE__ */ a("button", {
					type: "button",
					className: "c-btn c-link",
					"data-testid": "studio-switch",
					onClick: g,
					children: e.studioLink
				}),
				/* @__PURE__ */ a("p", {
					className: "c-muted",
					children: e.studioHint
				}),
				/* @__PURE__ */ a("button", {
					type: "button",
					className: "c-btn c-link",
					onClick: _,
					children: e.forget
				}),
				/* @__PURE__ */ a("p", {
					className: "c-muted",
					children: e.forgetHint
				})
			]
		}),
		/* @__PURE__ */ a("p", {
			className: "c-muted",
			children: e.offline
		})
	] });
}
export { u as SettingsScreen };
