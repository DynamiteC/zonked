import { useEffect as e, useId as t, useState as n } from "react";
import { Fragment as r, jsx as i, jsxs as a } from "react/jsx-runtime";
// ../../web/src/ui/calm/visuals/scenes.tsx
var o = "0 0 320 200", s = (e) => ({ "--dl": `${e}s` }), c = (e, t, n) => ({
	"--dl": `${e}s`,
	"--dx": t,
	"--dy": n
}), l = [
	[
		70,
		70,
		1.6,
		-.2
	],
	[
		118,
		112,
		1.2,
		-1.1
	],
	[
		150,
		56,
		1.4,
		-2.1
	],
	[
		196,
		98,
		1.8,
		-.7
	],
	[
		222,
		64,
		1.2,
		-1.6
	],
	[
		248,
		124,
		1.5,
		-2.5
	],
	[
		102,
		140,
		1.1,
		-.4
	],
	[
		176,
		134,
		1.3,
		-1.9
	]
];
function u({ id: e }) {
	return /* @__PURE__ */ a(r, { children: [
		/* @__PURE__ */ i("defs", { children: /* @__PURE__ */ a("radialGradient", {
			id: `${e}-g`,
			cx: "0.5",
			cy: "0.5",
			r: "0.5",
			children: [/* @__PURE__ */ i("stop", {
				offset: "0",
				stopColor: "var(--e)",
				stopOpacity: "0.8"
			}), /* @__PURE__ */ i("stop", {
				offset: "1",
				stopColor: "var(--e)",
				stopOpacity: "0"
			})]
		}) }),
		/* @__PURE__ */ i("rect", {
			width: "320",
			height: "200",
			className: "va"
		}),
		/* @__PURE__ */ i("rect", {
			y: "110",
			width: "320",
			height: "90",
			className: "vb"
		}),
		/* @__PURE__ */ a("g", {
			className: "vc",
			children: [
				/* @__PURE__ */ i("rect", {
					x: "26",
					y: "40",
					width: "96",
					height: "5"
				}),
				/* @__PURE__ */ i("rect", {
					x: "26",
					y: "78",
					width: "96",
					height: "5"
				}),
				/* @__PURE__ */ i("rect", {
					x: "32",
					y: "22",
					width: "9",
					height: "18"
				}),
				/* @__PURE__ */ i("rect", {
					x: "44",
					y: "26",
					width: "7",
					height: "14"
				}),
				/* @__PURE__ */ i("rect", {
					x: "54",
					y: "20",
					width: "10",
					height: "20"
				}),
				/* @__PURE__ */ i("rect", {
					x: "34",
					y: "60",
					width: "12",
					height: "18"
				}),
				/* @__PURE__ */ i("rect", {
					x: "50",
					y: "64",
					width: "8",
					height: "14"
				}),
				/* @__PURE__ */ i("rect", {
					x: "86",
					y: "58",
					width: "22",
					height: "20",
					rx: "3"
				})
			]
		}),
		/* @__PURE__ */ i("circle", {
			className: "vl-wglow",
			cx: "214",
			cy: "104",
			r: "86",
			fill: `url(#${e}-g)`
		}),
		/* @__PURE__ */ a("g", {
			className: "vd",
			children: [/* @__PURE__ */ i("rect", {
				x: "0",
				y: "152",
				width: "320",
				height: "48"
			}), /* @__PURE__ */ i("rect", {
				x: "190",
				y: "150",
				width: "46",
				height: "4",
				rx: "2",
				opacity: "0.6"
			})]
		}),
		/* @__PURE__ */ i("path", {
			className: "vc",
			d: "M213 150L215 114L209 114L207 150Z"
		}),
		/* @__PURE__ */ i("path", {
			className: "ve",
			d: "M196 114L204 90Q214 82 224 90L232 114Z"
		}),
		/* @__PURE__ */ i("rect", {
			className: "vd",
			x: "196",
			y: "148",
			width: "34",
			height: "5",
			rx: "2"
		}),
		l.map(([e, t, n, r]) => /* @__PURE__ */ i("circle", {
			className: "vf vl-drift",
			style: c(r, 4 + n, -6 - n),
			cx: e,
			cy: t,
			r: n
		}, `${e}-${t}`))
	] });
}
function d({ id: e }) {
	return /* @__PURE__ */ a(r, { children: [
		/* @__PURE__ */ a("defs", { children: [/* @__PURE__ */ a("radialGradient", {
			id: `${e}-cg`,
			cx: "0.5",
			cy: "0.5",
			r: "0.5",
			children: [/* @__PURE__ */ i("stop", {
				offset: "0",
				stopColor: "var(--e)",
				stopOpacity: "0.55"
			}), /* @__PURE__ */ i("stop", {
				offset: "1",
				stopColor: "var(--e)",
				stopOpacity: "0"
			})]
		}), /* @__PURE__ */ a("radialGradient", {
			id: `${e}-cd`,
			cx: "0.38",
			cy: "0.34",
			r: "0.8",
			children: [
				/* @__PURE__ */ i("stop", {
					offset: "0",
					stopColor: "#FFFFFF",
					stopOpacity: "0.9"
				}),
				/* @__PURE__ */ i("stop", {
					offset: "0.45",
					stopColor: "var(--e)"
				}),
				/* @__PURE__ */ i("stop", {
					offset: "1",
					stopColor: "var(--e)",
					stopOpacity: "0.7"
				})
			]
		})] }),
		/* @__PURE__ */ i("rect", {
			width: "320",
			height: "200",
			className: "va"
		}),
		/* @__PURE__ */ i("circle", {
			className: "vl-halo",
			cx: "238",
			cy: "62",
			r: "60",
			fill: `url(#${e}-cg)`
		}),
		/* @__PURE__ */ i("circle", {
			cx: "238",
			cy: "62",
			r: "22",
			fill: `url(#${e}-cd)`
		}),
		/* @__PURE__ */ a("g", {
			className: "vf vl-cloud",
			style: s(0),
			children: [/* @__PURE__ */ i("ellipse", {
				cx: "70",
				cy: "48",
				rx: "34",
				ry: "9",
				opacity: "0.7"
			}), /* @__PURE__ */ i("ellipse", {
				cx: "92",
				cy: "42",
				rx: "22",
				ry: "8",
				opacity: "0.7"
			})]
		}),
		/* @__PURE__ */ a("g", {
			className: "vf vl-cloud",
			style: s(-1.5),
			children: [/* @__PURE__ */ i("ellipse", {
				cx: "190",
				cy: "30",
				rx: "28",
				ry: "7",
				opacity: "0.6"
			}), /* @__PURE__ */ i("ellipse", {
				cx: "206",
				cy: "26",
				rx: "16",
				ry: "6",
				opacity: "0.6"
			})]
		}),
		/* @__PURE__ */ i("path", {
			className: "vb",
			d: "M0 132Q70 96 150 122T320 108V200H0Z"
		}),
		/* @__PURE__ */ i("path", {
			className: "vc",
			d: "M0 150Q90 116 180 146T320 134V200H0Z"
		}),
		/* @__PURE__ */ i("path", {
			className: "vd",
			d: "M0 176Q110 142 220 172T320 164V200H0Z"
		}),
		[
			20,
			52,
			84,
			116,
			148,
			180,
			212,
			244,
			276,
			300
		].map((e, t) => /* @__PURE__ */ i("path", {
			className: "vd vl-sway",
			style: s(-(t % 5) * .6),
			d: `M${e} 200Q${e - 2} 188 ${e + 3} 178`,
			fill: "none",
			stroke: "var(--d)",
			strokeWidth: "3",
			strokeLinecap: "round"
		}, e))
	] });
}
var f = [
	[
		40,
		30,
		1.4,
		0
	],
	[
		84,
		58,
		1,
		-1
	],
	[
		128,
		24,
		1.2,
		-2
	],
	[
		168,
		52,
		1,
		-.5
	],
	[
		206,
		20,
		1.3,
		-1.5
	],
	[
		284,
		40,
		1.2,
		-2.5
	],
	[
		60,
		96,
		1,
		-1.2
	],
	[
		150,
		88,
		1.2,
		-.3
	],
	[
		262,
		92,
		1,
		-2.2
	],
	[
		300,
		70,
		1,
		-.8
	]
];
function p({ id: e }) {
	return /* @__PURE__ */ a(r, { children: [
		/* @__PURE__ */ a("defs", { children: [/* @__PURE__ */ a("radialGradient", {
			id: `${e}-mg`,
			cx: "0.5",
			cy: "0.5",
			r: "0.5",
			children: [/* @__PURE__ */ i("stop", {
				offset: "0",
				stopColor: "var(--e)",
				stopOpacity: "0.55"
			}), /* @__PURE__ */ i("stop", {
				offset: "1",
				stopColor: "var(--e)",
				stopOpacity: "0"
			})]
		}), /* @__PURE__ */ a("radialGradient", {
			id: `${e}-md`,
			cx: "0.38",
			cy: "0.34",
			r: "0.8",
			children: [
				/* @__PURE__ */ i("stop", {
					offset: "0",
					stopColor: "#FFFFFF",
					stopOpacity: "0.9"
				}),
				/* @__PURE__ */ i("stop", {
					offset: "0.45",
					stopColor: "var(--e)"
				}),
				/* @__PURE__ */ i("stop", {
					offset: "1",
					stopColor: "var(--e)",
					stopOpacity: "0.7"
				})
			]
		})] }),
		/* @__PURE__ */ i("rect", {
			width: "320",
			height: "200",
			className: "va"
		}),
		/* @__PURE__ */ i("rect", {
			y: "90",
			width: "320",
			height: "110",
			className: "vb",
			opacity: "0.5"
		}),
		/* @__PURE__ */ i("circle", {
			className: "vl-halo",
			cx: "232",
			cy: "62",
			r: "56",
			fill: `url(#${e}-mg)`
		}),
		/* @__PURE__ */ i("circle", {
			cx: "232",
			cy: "62",
			r: "19",
			fill: `url(#${e}-md)`
		}),
		/* @__PURE__ */ a("g", {
			className: "va",
			opacity: "0.14",
			children: [
				/* @__PURE__ */ i("circle", {
					cx: "226",
					cy: "68",
					r: "4"
				}),
				/* @__PURE__ */ i("circle", {
					cx: "238",
					cy: "56",
					r: "3"
				}),
				/* @__PURE__ */ i("circle", {
					cx: "233",
					cy: "72",
					r: "2"
				})
			]
		}),
		f.map(([e, t, n, r], a) => /* @__PURE__ */ i("circle", {
			className: `vf ${a % 2 ? "vl-twinkle" : "vl-twinkle2"}`,
			style: s(r),
			cx: e,
			cy: t,
			r: n
		}, `${e}-${t}`)),
		/* @__PURE__ */ i("g", {
			className: "vf vl-cloud",
			style: s(-.8),
			children: /* @__PURE__ */ i("ellipse", {
				cx: "110",
				cy: "110",
				rx: "46",
				ry: "6",
				opacity: "0.18"
			})
		}),
		/* @__PURE__ */ i("path", {
			className: "vc",
			d: "M0 150Q60 118 130 140T250 130T320 144V200H0Z"
		}),
		/* @__PURE__ */ i("path", {
			className: "vd",
			d: "M0 176Q80 150 170 172T320 160V200H0Z"
		})
	] });
}
var m = [
	[
		44,
		20,
		0
	],
	[
		90,
		40,
		-1.1
	],
	[
		140,
		14,
		-2.2
	],
	[
		190,
		34,
		-.6
	],
	[
		236,
		18,
		-1.7
	],
	[
		282,
		44,
		-2.6
	]
], h = [
	[
		80,
		170,
		0
	],
	[
		150,
		182,
		-1
	],
	[
		226,
		168,
		-2
	],
	[
		270,
		186,
		-.5
	]
];
function g() {
	return /* @__PURE__ */ a(r, { children: [
		/* @__PURE__ */ i("rect", {
			width: "320",
			height: "200",
			className: "va"
		}),
		/* @__PURE__ */ i("rect", {
			y: "120",
			width: "320",
			height: "80",
			className: "vb"
		}),
		/* @__PURE__ */ a("g", {
			className: "vc",
			children: [/* @__PURE__ */ i("ellipse", {
				cx: "40",
				cy: "20",
				rx: "70",
				ry: "30"
			}), /* @__PURE__ */ i("ellipse", {
				cx: "250",
				cy: "10",
				rx: "90",
				ry: "34"
			})]
		}),
		/* @__PURE__ */ a("g", {
			className: "vd",
			children: [/* @__PURE__ */ i("g", {
				transform: "rotate(-16 52 76)",
				children: /* @__PURE__ */ i("ellipse", {
					className: "vl-sway",
					style: s(0),
					cx: "52",
					cy: "76",
					rx: "44",
					ry: "13"
				})
			}), /* @__PURE__ */ i("g", {
				transform: "rotate(14 262 64)",
				children: /* @__PURE__ */ i("ellipse", {
					className: "vl-sway",
					style: s(-1.2),
					cx: "262",
					cy: "64",
					rx: "48",
					ry: "14"
				})
			})]
		}),
		m.map(([e, t, n]) => /* @__PURE__ */ i("line", {
			className: "vf vl-fall",
			style: s(n),
			x1: e,
			y1: t,
			x2: e - 2,
			y2: t + 10,
			stroke: "var(--f)",
			strokeWidth: "1.4",
			strokeLinecap: "round"
		}, e)),
		[
			136,
			150,
			164,
			178
		].map((e, t) => /* @__PURE__ */ i("path", {
			className: "vl-shimmer",
			style: s(-t * .7),
			d: `M${30 + t * 20} ${e}Q${90 + t * 10} ${e - 6} ${150 + t * 14} ${e}T290 ${e}`,
			fill: "none",
			stroke: "var(--f)",
			strokeWidth: "1.6",
			strokeLinecap: "round"
		}, e)),
		h.map(([e, t, n]) => /* @__PURE__ */ i("ellipse", {
			className: "vl-ring",
			style: s(n),
			cx: e,
			cy: t,
			rx: "12",
			ry: "3",
			fill: "none",
			stroke: "var(--f)",
			strokeWidth: "1.2"
		}, e))
	] });
}
// ../../web/src/ui/calm/visuals/SceneLoop.tsx
var _ = () => typeof window < "u" && typeof window.matchMedia == "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
function v() {
	let [t, r] = n(typeof document < "u" && document.hidden);
	return e(() => {
		let e = () => r(document.hidden);
		return document.addEventListener("visibilitychange", e), () => {
			document.removeEventListener("visibilitychange", e);
		};
	}, []), t;
}
function y({ situation: e, reducedMotion: n, theme: r }) {
	let s = `sl${t().replace(/[^a-zA-Z0-9]/g, "")}`, c = v(), l = `vl vl-${e}${n ?? _() ? " vl-still" : ""}${c ? " vl-paused" : ""}`;
	return /* @__PURE__ */ a("svg", {
		className: l,
		"data-vl": r,
		"data-situation": e,
		viewBox: o,
		preserveAspectRatio: "xMidYMid slice",
		"aria-hidden": "true",
		focusable: "false",
		children: [
			e === "focus" && /* @__PURE__ */ i(u, { id: s }),
			e === "calm" && /* @__PURE__ */ i(d, { id: s }),
			e === "sleep" && /* @__PURE__ */ i(p, { id: s }),
			e === "nature" && /* @__PURE__ */ i(g, {})
		]
	});
}
export { y as SceneLoop };
