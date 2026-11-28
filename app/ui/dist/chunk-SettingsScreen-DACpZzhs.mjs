import { X as e, Y as t } from "./chunk-crewLink-DfIjAvPP.mjs";
import { x as n } from "./chunk-data-Bhxfb-cT.mjs";
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
function l({ value: e, onChange: n }) {
	return /* @__PURE__ */ o("fieldset", {
		className: "c-themes",
		"data-testid": "theme-picker",
		children: [/* @__PURE__ */ a("legend", { children: t.themeTitle }), c.map((r) => /* @__PURE__ */ o("label", {
			className: "c-theme-opt",
			children: [/* @__PURE__ */ a("input", {
				type: "radio",
				name: "c-theme",
				value: r,
				"data-testid": `theme-${r}`,
				checked: e === r,
				onChange: () => n(r)
			}), /* @__PURE__ */ a("span", { children: t.themeChoices[r] })]
		}, r))]
	});
}
function u({ device: c, onDevice: u, gentle: d, reduceMotion: f, reduced: p = !1, onGentle: m, onReduceMotion: h, onStudio: g, onForget: _, prefs: v, onPrefs: y, onGuide: b }) {
	return /* @__PURE__ */ o("div", { children: [
		/* @__PURE__ */ a(i, {
			title: t.settingsTitle,
			reduced: p
		}),
		c !== void 0 && u !== void 0 && /* @__PURE__ */ o("fieldset", {
			className: "c-themes",
			"data-testid": "device-picker",
			children: [
				/* @__PURE__ */ a("legend", { children: t.deviceTitle }),
				n.map((t) => /* @__PURE__ */ o("label", {
					className: "c-theme-opt",
					children: [/* @__PURE__ */ a("input", {
						type: "radio",
						name: "c-device",
						value: t,
						"data-testid": `device-${t}`,
						checked: c === t,
						onChange: () => u(t)
					}), /* @__PURE__ */ a("span", { children: e[t] })]
				}, t)),
				/* @__PURE__ */ a("small", {
					className: "c-muted",
					children: t.deviceHint
				})
			]
		}),
		/* @__PURE__ */ a(s, {
			label: t.gentle,
			hint: t.gentleHint,
			checked: d,
			onChange: m,
			testId: "gentle-switch"
		}),
		/* @__PURE__ */ a(s, {
			label: t.reduceMotion,
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
			label: t.dimLabel,
			hint: t.dimHint,
			checked: r(v),
			onChange: (e) => y({
				...v,
				dim: e
			}),
			testId: "dim-switch"
		}),
		/* @__PURE__ */ a(s, {
			label: t.announceLabel,
			hint: t.announceHint,
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
					children: t.guideLink
				}),
				/* @__PURE__ */ a("button", {
					type: "button",
					className: "c-btn c-link",
					"data-testid": "studio-switch",
					onClick: g,
					children: t.studioLink
				}),
				/* @__PURE__ */ a("p", {
					className: "c-muted",
					children: t.studioHint
				}),
				/* @__PURE__ */ a("button", {
					type: "button",
					className: "c-btn c-link",
					onClick: _,
					children: t.forget
				}),
				/* @__PURE__ */ a("p", {
					className: "c-muted",
					children: t.forgetHint
				})
			]
		}),
		/* @__PURE__ */ a("p", {
			className: "c-muted",
			children: t.offline
		})
	] });
}
export { u as SettingsScreen };
