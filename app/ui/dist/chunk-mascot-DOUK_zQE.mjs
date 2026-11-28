import { useEffect as e, useId as t, useMemo as n, useRef as r, useState as i } from "react";
import { Fragment as a, jsx as o, jsxs as s } from "react/jsx-runtime";
import { t as c } from "./chunk-useBreath-BZ3euK4B.mjs";
// ../../web/src/ui/calm/mascot/eyes.tsx
var l = {
	idle: ["ring", "ring"],
	listening: ["half", "half"],
	happy: ["arc", "arc"],
	sleepy: ["lid", "lid"],
	breathing: ["ring", "ring"],
	focus: ["narrow", "narrow"],
	steering: ["ring", "ring"],
	tired: ["heavy", "heavy"],
	done: ["closed", "closed"],
	offline: ["up", "up"],
	error: ["ring", "squint"],
	loading: ["dial", "dial"]
}, u = "#FFDC1A", d = "#3A2A2E", f = 40, p = 150;
function m(e, t, n) {
	let r = Math.sqrt(1600 - t * t), i = p + t;
	return n ? `M${e - r} ${i}A${f} ${f} 0 ${+(t > 0)} 1 ${e + r} ${i}Z` : `M${e + r} ${i}A${f} ${f} 0 ${+(t < 0)} 1 ${e - r} ${i}Z`;
}
function h({ cx: e, d: t, top: n = !0, tilt: r = 0 }) {
	return /* @__PURE__ */ o("path", {
		className: "cm-lid",
		d: m(e, t, n),
		fill: u,
		stroke: d,
		strokeWidth: "4",
		strokeLinejoin: "round",
		transform: r ? `rotate(${r} ${e} ${p})` : void 0
	});
}
function g({ cx: e, lift: t = 0 }) {
	return /* @__PURE__ */ s(a, { children: [
		/* @__PURE__ */ o("circle", {
			className: "cm-ring cm-s-gold",
			cx: e,
			cy: p,
			r: "24",
			fill: "none",
			stroke: "#FFD23A",
			strokeWidth: "4",
			strokeOpacity: "0.85"
		}),
		/* @__PURE__ */ o("circle", {
			className: "cm-pupil cm-f-gold",
			cx: e,
			cy: p + t,
			r: "8",
			fill: "#FFD23A"
		}),
		/* @__PURE__ */ o("circle", {
			cx: e - 9,
			cy: 140 + t,
			r: "4",
			fill: "#FFF6DC",
			opacity: "0.8"
		})
	] });
}
function _({ cx: e, kind: t, side: n }) {
	switch (t) {
		case "arc": return /* @__PURE__ */ o("path", {
			className: "cm-s-gold",
			d: `M${e - 20} 160A20 20 0 0 1 ${e + 20} 160`,
			fill: "none",
			stroke: "#FFD23A",
			strokeWidth: "8",
			strokeLinecap: "round"
		});
		case "closed": return /* @__PURE__ */ o("path", {
			className: "cm-s-gold",
			d: `M${e - 20} 142Q${e} 170 ${e + 20} 142`,
			fill: "none",
			stroke: "#FFD23A",
			strokeWidth: "8",
			strokeLinecap: "round"
		});
		case "up": return /* @__PURE__ */ o(g, {
			cx: e,
			lift: -10
		});
		case "dial": return /* @__PURE__ */ s(a, { children: [/* @__PURE__ */ s("g", {
			className: "cm-dial",
			children: [/* @__PURE__ */ o("circle", {
				className: "cm-ring cm-s-gold",
				cx: e,
				cy: p,
				r: "24",
				fill: "none",
				stroke: "#FFD23A",
				strokeWidth: "5",
				strokeDasharray: "8 10",
				strokeLinecap: "round"
			}), /* @__PURE__ */ o("path", {
				d: `M${e} 116V122M${e + 34} ${p}H${e + 28}M${e} 184V178M${e - 34} ${p}H${e - 28}`,
				stroke: "#FFD23A",
				strokeWidth: "4",
				strokeLinecap: "round"
			})]
		}), /* @__PURE__ */ o("circle", {
			className: "cm-pupil cm-f-gold",
			cx: e,
			cy: p,
			r: "5",
			fill: "#FFD23A"
		})] });
		case "lid": return /* @__PURE__ */ s(a, { children: [/* @__PURE__ */ o(g, { cx: e }), /* @__PURE__ */ o(h, {
			cx: e,
			d: 20
		})] });
		case "half": return /* @__PURE__ */ s(a, { children: [/* @__PURE__ */ o(g, { cx: e }), /* @__PURE__ */ o(h, {
			cx: e,
			d: 4
		})] });
		case "narrow": return /* @__PURE__ */ s(a, { children: [
			/* @__PURE__ */ o(g, { cx: e }),
			/* @__PURE__ */ o(h, {
				cx: e,
				d: -11
			}),
			/* @__PURE__ */ o(h, {
				cx: e,
				d: 11,
				top: !1
			})
		] });
		case "heavy": return /* @__PURE__ */ s(a, { children: [/* @__PURE__ */ o(g, { cx: e }), /* @__PURE__ */ o(h, {
			cx: e,
			d: 12,
			tilt: n * 14
		})] });
		case "squint": return /* @__PURE__ */ s(a, { children: [
			/* @__PURE__ */ o(g, { cx: e }),
			/* @__PURE__ */ o(h, {
				cx: e,
				d: -4,
				tilt: -n * 8
			}),
			/* @__PURE__ */ o(h, {
				cx: e,
				d: 13,
				top: !1
			})
		] });
		default: return /* @__PURE__ */ o(g, { cx: e });
	}
}
function v({ cx: e, kind: t, side: n }) {
	return /* @__PURE__ */ s("g", {
		className: "cm-eye",
		"data-eye": t,
		children: [/* @__PURE__ */ o("circle", {
			className: "cm-f-mask cm-s-ink",
			cx: e,
			cy: p,
			r: f,
			fill: "#241F2B",
			strokeWidth: "5"
		}), /* @__PURE__ */ o(_, {
			cx: e,
			kind: t,
			side: n
		})]
	});
}
// ../../web/src/ui/calm/mascot/layers.tsx
var y = "0 0 512 512", b = "translate(46.1 56.1) scale(.82)", x = [
	190,
	226,
	286,
	322
], S = {
	idle: {
		dy: [
			-14,
			4,
			4,
			-14
		],
		len: .3
	},
	listening: {
		dy: [
			-14,
			4,
			4,
			-14
		],
		len: .3
	},
	happy: {
		dy: [
			-18,
			6,
			6,
			-18
		],
		len: .4
	},
	sleepy: {
		dy: [
			0,
			0,
			0,
			0
		],
		len: .45
	},
	breathing: {
		dy: [
			-14,
			4,
			4,
			-14
		],
		len: .3
	},
	focus: {
		dy: [
			0,
			0,
			0,
			0
		],
		len: .7
	},
	steering: {
		dy: [
			0,
			0,
			0,
			0
		],
		len: 1
	},
	tired: {
		dy: [
			7,
			-2,
			-2,
			7
		],
		len: .7,
		rot: [
			10,
			3,
			-3,
			-10
		]
	},
	done: {
		dy: [
			-5,
			2,
			2,
			-5
		],
		len: .85
	},
	offline: {
		dy: [
			4,
			-2,
			3,
			-3
		],
		len: .8
	},
	error: {
		dy: [
			4,
			-2,
			3,
			-3
		],
		len: .8
	},
	loading: {
		dy: [
			0,
			0,
			0,
			0
		],
		len: .6
	}
};
function C() {
	return /* @__PURE__ */ o("svg", {
		className: "cm-layer cm-shadow",
		viewBox: y,
		"aria-hidden": "true",
		focusable: "false",
		children: /* @__PURE__ */ o("ellipse", {
			className: "cm-gshadow",
			cx: "256",
			cy: "452",
			rx: "112",
			ry: "13",
			fill: "#4A3A40",
			opacity: "0.2"
		})
	});
}
function w({ id: e, mood: t, plain: n }) {
	let r = S[t], [i, a] = l[t];
	return /* @__PURE__ */ o("svg", {
		className: "cm-layer cm-face",
		viewBox: y,
		"aria-hidden": "true",
		focusable: "false",
		children: /* @__PURE__ */ s("g", {
			transform: b,
			children: [
				/* @__PURE__ */ s("g", {
					className: "cm-pod cm-podl",
					children: [
						/* @__PURE__ */ o("rect", {
							className: "cm-f-cup cm-s-ink",
							x: "8",
							y: "196",
							width: "68",
							height: "120",
							rx: "30",
							fill: `url(#${e}-cup)`,
							strokeWidth: "6"
						}),
						/* @__PURE__ */ o("rect", {
							className: "cm-f-mask cm-s-ink",
							x: "22",
							y: "212",
							width: "40",
							height: "88",
							rx: "16",
							fill: "#2E2433",
							strokeWidth: "4"
						}),
						/* @__PURE__ */ o("rect", {
							className: "cm-slit",
							x: "35",
							y: "234",
							width: "14",
							height: "10",
							rx: "3"
						}),
						/* @__PURE__ */ o("rect", {
							className: "cm-slit",
							x: "35",
							y: "268",
							width: "14",
							height: "10",
							rx: "3"
						}),
						/* @__PURE__ */ o("path", {
							className: "cm-bevel",
							d: "M20 232V226Q20 212 34 207"
						})
					]
				}),
				/* @__PURE__ */ s("g", {
					className: "cm-pod cm-podr",
					children: [
						/* @__PURE__ */ o("rect", {
							className: "cm-f-cup cm-s-ink",
							x: "436",
							y: "196",
							width: "68",
							height: "120",
							rx: "30",
							fill: `url(#${e}-cup)`,
							strokeWidth: "6"
						}),
						/* @__PURE__ */ o("rect", {
							className: "cm-f-mask cm-s-ink",
							x: "450",
							y: "212",
							width: "40",
							height: "88",
							rx: "16",
							fill: "#2E2433",
							strokeWidth: "4"
						}),
						/* @__PURE__ */ o("rect", {
							className: "cm-slit",
							x: "463",
							y: "234",
							width: "14",
							height: "10",
							rx: "3"
						}),
						/* @__PURE__ */ o("rect", {
							className: "cm-slit",
							x: "463",
							y: "268",
							width: "14",
							height: "10",
							rx: "3"
						}),
						/* @__PURE__ */ o("path", {
							className: "cm-bevel",
							d: "M440 232V226Q440 212 454 207"
						})
					]
				}),
				/* @__PURE__ */ o("circle", {
					className: "cm-f-gold",
					cx: "256",
					cy: "256",
					r: "200",
					fill: `url(#${e}-gold)`
				}),
				!n && /* @__PURE__ */ o("circle", {
					className: "cm-grain",
					cx: "256",
					cy: "256",
					r: "200",
					fill: "#FBD84A",
					filter: `url(#${e}-grain)`
				}),
				!n && /* @__PURE__ */ o("circle", {
					className: "cm-key",
					cx: "256",
					cy: "256",
					r: "200",
					fill: `url(#${e}-key)`
				}),
				!n && /* @__PURE__ */ o("circle", {
					className: "cm-cel",
					cx: "256",
					cy: "256",
					r: "170",
					fill: "none",
					stroke: "#B8741C",
					strokeOpacity: "0.26",
					strokeWidth: "60",
					strokeDasharray: "330 1100",
					transform: "rotate(5 256 256)"
				}),
				!n && /* @__PURE__ */ o("circle", {
					className: "cm-cool",
					cx: "256",
					cy: "256",
					r: "191",
					fill: "none",
					stroke: "#CFE8F4",
					strokeOpacity: "0.28",
					strokeWidth: "4",
					strokeDasharray: "200 1200",
					strokeLinecap: "round",
					transform: "rotate(30 256 256)"
				}),
				!n && /* @__PURE__ */ o("circle", {
					className: "cm-rim",
					cx: "256",
					cy: "256",
					r: "186",
					fill: "none",
					stroke: "#FFF3B0",
					strokeOpacity: "0.7",
					strokeWidth: "12",
					strokeDasharray: "330 1500",
					strokeLinecap: "round",
					transform: "rotate(200 256 256)"
				}),
				/* @__PURE__ */ o("circle", {
					className: "cm-s-ink",
					cx: "256",
					cy: "256",
					r: "200",
					fill: "none",
					stroke: "#3A2A2E",
					strokeWidth: "8"
				}),
				/* @__PURE__ */ o("circle", {
					className: "cm-s-ink",
					cx: "256",
					cy: "256",
					r: "200",
					fill: "none",
					stroke: "#3A2A2E",
					strokeWidth: "6",
					strokeDasharray: "420 1500",
					strokeLinecap: "round",
					transform: "rotate(100 256 256)"
				}),
				/* @__PURE__ */ o("rect", {
					className: "cm-f-mask",
					x: "218",
					y: "146",
					width: "76",
					height: "8",
					rx: "4",
					fill: "#241F2B"
				}),
				/* @__PURE__ */ o("path", {
					className: "cm-f-mask cm-s-ink",
					d: "M104 250Q98 238 112 242L230 272Q241 275 241 288V338Q241 349 231 352L178 368Q166 371 158 363L128 330Q110 312 106 288Q102 268 104 250Z",
					fill: `url(#${e}-mask)`,
					strokeWidth: "11",
					strokeLinejoin: "round"
				}),
				/* @__PURE__ */ o("path", {
					className: "cm-f-mask cm-s-ink",
					d: "M408 250Q414 238 400 242L282 272Q271 275 271 288V338Q271 349 281 352L334 368Q346 371 354 363L384 330Q402 312 406 288Q410 268 408 250Z",
					fill: `url(#${e}-mask)`,
					strokeWidth: "11",
					strokeLinejoin: "round"
				}),
				/* @__PURE__ */ o("path", {
					className: "cm-bevel cm-bevel-m",
					d: "M112 252L232 282M400 252L280 282"
				}),
				/* @__PURE__ */ o("ellipse", {
					className: "cm-gem",
					cx: "256",
					cy: "316",
					rx: "13",
					ry: "16",
					fill: "#00E5A8",
					fillOpacity: "0.35",
					stroke: "#00E5A8",
					strokeWidth: "5"
				}),
				/* @__PURE__ */ o(v, {
					cx: 178,
					kind: i,
					side: -1
				}),
				/* @__PURE__ */ o(v, {
					cx: 334,
					kind: a,
					side: 1
				}),
				/* @__PURE__ */ o("g", {
					className: "cm-mouth",
					style: { "--ml": r.len },
					children: x.map((e, t) => {
						let n = r.dy[t] ?? 0, i = r.rot?.[t] ?? 0, a = 409 + n;
						return /* @__PURE__ */ o("g", {
							transform: i ? `rotate(${i} ${e} ${a})` : void 0,
							children: /* @__PURE__ */ o("path", {
								className: "cm-bar cm-s-ink",
								d: `M${e} ${a - 17 * r.len}V${a + 17 * r.len}`,
								stroke: "#3A2A2E",
								strokeWidth: "9",
								strokeLinecap: "round",
								fill: "none"
							})
						}, e);
					})
				})
			]
		})
	});
}
function T() {
	return /* @__PURE__ */ o("svg", {
		className: "cm-layer cm-motes",
		viewBox: y,
		"aria-hidden": "true",
		focusable: "false",
		children: [
			[
				70,
				110,
				4
			],
			[
				440,
				90,
				3
			],
			[
				400,
				430,
				4
			],
			[
				90,
				410,
				3
			],
			[
				256,
				30,
				3
			],
			[
				470,
				300,
				2
			]
		].map(([e, t, n], r) => /* @__PURE__ */ o("circle", {
			className: "cm-mote",
			style: { animationDelay: `${r * -1.3}s` },
			cx: e,
			cy: t,
			r: n,
			fill: "#FFF3C9"
		}, `${e}-${t}`))
	});
}
function E({ id: e, lite: t }) {
	return /* @__PURE__ */ o("svg", {
		className: "cm-defs",
		width: "0",
		height: "0",
		"aria-hidden": "true",
		focusable: "false",
		children: /* @__PURE__ */ s("defs", { children: [
			/* @__PURE__ */ s("linearGradient", {
				id: `${e}-gold`,
				x1: "0.2",
				y1: "0",
				x2: "0.3",
				y2: "1",
				children: [/* @__PURE__ */ o("stop", {
					offset: "0",
					stopColor: "#FBD84A"
				}), /* @__PURE__ */ o("stop", {
					offset: "1",
					stopColor: "#E8A128"
				})]
			}),
			/* @__PURE__ */ s("linearGradient", {
				id: `${e}-mask`,
				x1: "0",
				y1: "0",
				x2: "0",
				y2: "1",
				children: [/* @__PURE__ */ o("stop", {
					offset: "0",
					stopColor: "#7A5878"
				}), /* @__PURE__ */ o("stop", {
					offset: "1",
					stopColor: "#4B3652"
				})]
			}),
			/* @__PURE__ */ s("linearGradient", {
				id: `${e}-cup`,
				x1: "0",
				y1: "0",
				x2: "0",
				y2: "1",
				children: [/* @__PURE__ */ o("stop", {
					offset: "0",
					stopColor: "#CC7F5E"
				}), /* @__PURE__ */ o("stop", {
					offset: "1",
					stopColor: "#9C4F3A"
				})]
			}),
			/* @__PURE__ */ s("radialGradient", {
				id: `${e}-key`,
				cx: "0.3",
				cy: "0.25",
				r: "0.7",
				children: [/* @__PURE__ */ o("stop", {
					offset: "0",
					stopColor: "#FFF4B8",
					stopOpacity: "0.7"
				}), /* @__PURE__ */ o("stop", {
					offset: "1",
					stopColor: "#FFF4B8",
					stopOpacity: "0"
				})]
			}),
			!t && /* @__PURE__ */ s("filter", {
				id: `${e}-grain`,
				x: "0",
				y: "0",
				width: "1",
				height: "1",
				children: [
					/* @__PURE__ */ o("feTurbulence", {
						type: "fractalNoise",
						baseFrequency: "0.012 0.24",
						numOctaves: "2",
						seed: "4",
						result: "n"
					}),
					/* @__PURE__ */ o("feColorMatrix", {
						in: "n",
						type: "matrix",
						values: "0 0 0 0 0.45  0 0 0 0 0.24  0 0 0 0 0  0.6 0 0 0 -0.14",
						result: "m"
					}),
					/* @__PURE__ */ o("feComposite", {
						in: "m",
						in2: "SourceAlpha",
						operator: "in"
					})
				]
			})
		] })
	});
}
// ../../web/src/ui/calm/mascot/layersExtra.tsx
var D = "0 0 512 512", O = "#3A2A2E";
function k() {
	return /* @__PURE__ */ o("svg", {
		className: "cm-layer cm-band",
		viewBox: D,
		"aria-hidden": "true",
		focusable: "false",
		children: /* @__PURE__ */ s("g", {
			transform: b,
			children: [
				/* @__PURE__ */ o("path", {
					className: "cm-s-ink cm-bandink",
					d: "M42 204C20 -34 492 -34 470 204",
					fill: "none",
					stroke: O,
					strokeWidth: "26",
					strokeLinecap: "round"
				}),
				/* @__PURE__ */ o("path", {
					className: "cm-bandcol",
					d: "M42 204C20 -34 492 -34 470 204",
					fill: "none",
					stroke: "#C27A5A",
					strokeWidth: "15",
					strokeLinecap: "round"
				}),
				/* @__PURE__ */ o("path", {
					d: "M60 190C50 10 462 10 452 190",
					fill: "none",
					stroke: "#FFF3D0",
					strokeOpacity: "0.22",
					strokeWidth: "5",
					strokeLinecap: "round"
				})
			]
		})
	});
}
function ee({ marked: e = !1 }) {
	let t = (e, t, n) => /* @__PURE__ */ o("path", {
		className: "cm-ripple",
		style: { animationDelay: `${n * -1.6}s` },
		d: `M${e + t * 12} 222Q${e + t * 44} 266 ${e + t * 12} 310`,
		fill: "none",
		stroke: "#8FE3D0",
		strokeWidth: "5",
		strokeLinecap: "round"
	}, `${e}-${n}`);
	return /* @__PURE__ */ s("svg", {
		className: "cm-layer cm-ripples",
		"data-prop": e ? "ripples" : void 0,
		viewBox: D,
		"aria-hidden": "true",
		focusable: "false",
		children: [[
			0,
			1,
			2
		].map((e) => t(56, -1, e)), [
			0,
			1,
			2
		].map((e) => t(456, 1, e))]
	});
}
// ../../web/src/ui/calm/mascot/props.tsx
var A = "0 0 512 512", j = "#3A2A2E", M = {
	sleepy: () => /* @__PURE__ */ s("g", {
		fill: "none",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		className: "cm-pk",
		children: [
			/* @__PURE__ */ o("path", {
				className: "cm-zl cm-z1",
				d: "M348 112h26l-26 26h26",
				strokeWidth: "7"
			}),
			/* @__PURE__ */ o("path", {
				className: "cm-zl cm-z2",
				d: "M382 72h19l-19 19h19",
				strokeWidth: "6"
			}),
			/* @__PURE__ */ o("path", {
				className: "cm-zl cm-z3",
				d: "M408 40h13l-13 13h13",
				strokeWidth: "5"
			})
		]
	}),
	breathing: () => /* @__PURE__ */ o("path", {
		className: "cm-wisp",
		d: "M326 396q12-10 24 0t24 0t24 0",
		fill: "none",
		stroke: "#BFE9E3",
		strokeWidth: "5",
		strokeLinecap: "round"
	}),
	focus: () => /* @__PURE__ */ o("path", {
		className: "cm-glow",
		d: "M241 252h30",
		fill: "none",
		stroke: "#9CFFE3",
		strokeWidth: "4",
		strokeLinecap: "round"
	}),
	steering: () => /* @__PURE__ */ o("path", {
		className: "cm-spark",
		d: "M404 160l5 13l13 5l-13 5l-5 13l-5-13l-13-5l13-5z",
		fill: "#00E5A8",
		stroke: j,
		strokeWidth: "2.5",
		strokeLinejoin: "round"
	}),
	tired: () => /* @__PURE__ */ o("path", {
		className: "cm-sweat",
		d: "M372 118C362 134 358 144 366 152C374 158 386 152 384 142C382 134 376 128 372 118Z",
		fill: "#8FD3F0",
		stroke: j,
		strokeWidth: "3.5",
		strokeLinejoin: "round"
	}),
	done: () => /* @__PURE__ */ s("g", {
		className: "cm-fall",
		children: [
			/* @__PURE__ */ o("path", {
				d: "M390 56c12-9 26-3 24 11c-12 6-24 0-24-11z",
				fill: "#8DBE6B",
				stroke: j,
				strokeWidth: "3",
				strokeLinejoin: "round"
			}),
			/* @__PURE__ */ o("path", {
				d: "M392 62q10-2 18-3",
				fill: "none",
				stroke: j,
				strokeWidth: "2",
				strokeLinecap: "round"
			}),
			/* @__PURE__ */ o("path", {
				className: "cm-spark",
				d: "M356 70l4 10l10 4l-10 4l-4 10l-4-10l-10-4l10-4z",
				fill: "#FFF3B0",
				stroke: "#C9772A",
				strokeWidth: "2.5",
				strokeLinejoin: "round"
			})
		]
	}),
	offline: () => /* @__PURE__ */ o("path", {
		className: "cm-cloud",
		d: "M316 82a22 22 0 0 1 8-34a30 30 0 0 1 56-2a22 22 0 0 1 22 36z",
		fill: "#C9CFD9",
		stroke: "#6B7280",
		strokeWidth: "4",
		strokeLinejoin: "round"
	}),
	error: () => /* @__PURE__ */ s("g", {
		className: "cm-q",
		fill: "none",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		children: [/* @__PURE__ */ o("path", {
			d: "M378 76c0-16 28-16 28 0c0 12-14 12-14 26M392 116v2",
			stroke: j,
			strokeWidth: "11"
		}), /* @__PURE__ */ o("path", {
			d: "M378 76c0-16 28-16 28 0c0 12-14 12-14 26M392 116v2",
			stroke: "#FFD23A",
			strokeWidth: "6"
		})]
	})
}, N = {
	sleepy: "zzz",
	breathing: "wisp",
	focus: "glow",
	steering: "spark",
	tired: "sweat",
	done: "leaf",
	offline: "cloud",
	error: "question"
};
function P({ mood: e }) {
	let t = M[e];
	return t ? /* @__PURE__ */ o("svg", {
		className: "cm-layer cm-props",
		viewBox: A,
		"aria-hidden": "true",
		focusable: "false",
		children: /* @__PURE__ */ o("g", {
			className: "cm-prop",
			"data-prop": N[e],
			children: t()
		})
	}) : null;
}
// ../../web/src/ui/calm/mascot/lowPower.ts
var F = 2, I = 2;
function L() {
	if (typeof window > "u") return !1;
	let e = (e) => typeof window.matchMedia == "function" && window.matchMedia(e).matches;
	if (e("(prefers-reduced-data: reduce)") || e("(prefers-reduced-motion: reduce)")) return !0;
	let t = typeof navigator > "u" ? {} : navigator, n = t.deviceMemory, r = t.hardwareConcurrency;
	return typeof n == "number" && n > 0 && n <= F || typeof r == "number" && r > 0 && r <= I;
}
var R = 40, z = 8, B = 4, V = 250;
function H(e, t = 20) {
	let n = e.filter((e) => Number.isFinite(e) && e > 0 && e < V);
	return n.length < R / 2 ? !1 : n.reduce((e, t) => e + t, 0) / n.length > t;
}
var U = !1, W = () => U;
function G(e, t = typeof window > "u" ? void 0 : window.requestAnimationFrame?.bind(window)) {
	if (t === void 0 || U) return () => void 0;
	let n = [], r = 0, i = 0, a = 0, o = !1, s = 0, c = (l) => {
		if (!o) {
			if (r > 0 && (i += 1, i > z && n.push(l - r)), r = l, n.length >= R) {
				if (H(n)) {
					U = !0, o = !0, e();
					return;
				}
				if (n = [], a += 1, a >= B) return;
			}
			s = t(c);
		}
	};
	return s = t(c), () => {
		o = !0, typeof cancelAnimationFrame == "function" && cancelAnimationFrame(s);
	};
}
// ../../web/src/ui/calm/mascot/useLife.ts
var K = /* @__PURE__ */ new Set([
	"idle",
	"listening",
	"steering",
	"tired",
	"offline",
	"error"
]);
function q(e) {
	let t = e >>> 0;
	return () => {
		t = t + 0x6d2b79f5 >>> 0;
		let e = t;
		return e = Math.imul(e ^ e >>> 15, e | 1), e ^= e + Math.imul(e ^ e >>> 7, e | 61), ((e ^ e >>> 14) >>> 0) / 4294967296;
	};
}
function J(e, t) {
	return (4e3 + e * 3e3) * (t ? 1.6 : 1);
}
function Y(t, n, r) {
	e(() => {
		let e = t.current;
		if (r || !e) return;
		let i = q(n.length * 7919 + (n.codePointAt(0) ?? 1)), a = n === "tired", o, s = () => {
			o = setTimeout(() => {
				document.hidden || e.classList.add("cm-blinking"), o = setTimeout(() => {
					e.classList.remove("cm-blinking"), s();
				}, a ? 340 : 170);
			}, J(i(), a));
		}, c = () => {
			e.classList.toggle("cm-paused", document.hidden);
		};
		return c(), document.addEventListener("visibilitychange", c), K.has(n) && s(), () => {
			o !== void 0 && clearTimeout(o), document.removeEventListener("visibilitychange", c), e.classList.remove("cm-blinking", "cm-paused");
		};
	}, [
		t,
		n,
		r
	]);
}
// ../../web/src/ui/calm/mascot/useParallax.ts
var X = 6, Z = 50, Q = (e) => Number.isFinite(e) ? Math.max(-1, Math.min(1, e)) : 0;
function te() {
	return typeof window < "u" && typeof window.matchMedia == "function" && window.matchMedia("(pointer: fine)").matches;
}
async function ne() {
	try {
		return (await navigator.permissions?.query({ name: "accelerometer" }))?.state === "granted";
	} catch {
		return !1;
	}
}
function re(t, n) {
	let i = r(0);
	e(() => {
		let e = t.current;
		if (!n || !e) return;
		let r = (t, n) => {
			let r = Date.now();
			r - i.current < Z || (i.current = r, e.style.setProperty("--ry", `${(Q(t) * X).toFixed(2)}deg`), e.style.setProperty("--rx", `${(-Q(n) * X).toFixed(2)}deg`));
		}, a = (e) => {
			if (e.pointerType === "touch") return;
			let t = window.innerWidth || 1, n = window.innerHeight || 1;
			r(e.clientX / t * 2 - 1, e.clientY / n * 2 - 1);
		}, o = (e) => r((e.gamma ?? 0) / 30, ((e.beta ?? 45) - 45) / 30), s = !1;
		return te() ? window.addEventListener("pointermove", a, { passive: !0 }) : typeof DeviceOrientationEvent < "u" && ne().then((t) => {
			t && e.isConnected && (s = !0, window.addEventListener("deviceorientation", o, { passive: !0 }));
		}), () => {
			window.removeEventListener("pointermove", a), s && window.removeEventListener("deviceorientation", o);
		};
	}, [t, n]);
}
// ../../web/src/ui/calm/mascot/CalmMascot.tsx
function ie() {
	return typeof window < "u" && typeof window.matchMedia == "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
var $ = (e) => e !== void 0 && Number.isFinite(e) ? Math.max(0, Math.min(1, e)) : 0, ae = 96, oe = 72;
function se({ mood: a = "idle", size: c = 220, reducedMotion: l, label: u = "Zonked mascot", breathPhase: d, level: f, situation: p }) {
	let m = `cm${t().replace(/[^a-zA-Z0-9]/g, "")}`, h = r(null), g = l ?? ie(), _ = Number.isFinite(c) ? Math.max(24, Math.min(640, c)) : 220, v = _ <= ae, [y, b] = i(W), x = n(() => g || y || L(), [g, y]);
	e(() => g || x ? void 0 : G(() => b(!0)), [g, x]);
	let S = _ < oe || x, D = d !== void 0 && !g ? {
		scale: String(1 + $(d) * .03),
		translate: `0 ${(-$(d) * 1.2).toFixed(2)}%`
	} : void 0;
	return re(h, !x && !v), Y(h, a, g), /* @__PURE__ */ s("div", {
		ref: h,
		className: `cm-stage cm-${a}${p ? ` cm-s-${p}` : ""}${g ? " cm-still" : ""}${x && !g ? " cm-low" : ""}${v ? " cm-compact" : ""}${d === void 0 ? "" : " cm-driven"}`,
		style: {
			width: _,
			height: _,
			"--bp": $(d),
			"--lv": f === void 0 && a === "listening" ? .35 : $(f)
		},
		role: "img",
		"aria-label": u,
		"data-mood": a,
		"data-situation": p,
		children: [/* @__PURE__ */ o(E, {
			id: m,
			lite: S
		}), /* @__PURE__ */ s("div", {
			className: "cm-body",
			children: [!v && /* @__PURE__ */ o(C, {}), /* @__PURE__ */ o("div", {
				className: "cm-sway",
				style: D,
				children: /* @__PURE__ */ s("div", {
					className: "cm-head",
					children: [
						!v && /* @__PURE__ */ o(ee, { marked: a === "listening" }),
						/* @__PURE__ */ o(w, {
							id: m,
							mood: a,
							plain: S
						}),
						/* @__PURE__ */ o(k, {}),
						/* @__PURE__ */ o(P, { mood: a }),
						!v && /* @__PURE__ */ o(T, {})
					]
				})
			})]
		})]
	});
}
export { c as BreathCue, se as CalmMascot };
