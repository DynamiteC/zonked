import { Q as e, X as t, Z as n, tt as r } from "./chunk-crewLink-B-5l2pQt.mjs";
// ../../web/src/catalog/legacyIds.ts
var i = {
	"android-self-hypnosis": "seed-slow-settle",
	"android-highest-mental-activity": "seed-bright-run",
	"android-unity": "seed-low-hour",
	"android-morphine": "seed-warm-hum",
	"android-learning": "seed-reading-room",
	"android-creativity": "seed-idea-drift",
	"android-wakeful-relax": "seed-gentle-landing",
	"android-schumann": "seed-quiet-ground",
	"android-astral-relax": "seed-evening-slope",
	"android-interval-pulse": "seed-pace-steps",
	"android-hallucination": "seed-soft-fade",
	"android-sleep-induction": "seed-night-descent",
	"android-lucid-dreams": "seed-dream-hour",
	"android-shamanic-rhythm": "seed-campfire-hush",
	"android-smr-sleep": "seed-light-sleep-weave",
	"android-lucid-dreams-2": "seed-long-night",
	"android-adhd-cycle": "seed-steady-blocks",
	"android-self-hypnosis-short": "seed-short-settle",
	"android-wakeful-relax-5": "seed-pause-five",
	"android-schumann-short": "seed-ground-reset",
	"android-lucid-dreams-short": "seed-nap-window",
	"gnaural-power-nap": "seed-midday-rest",
	"gnaural-airplane-aid": "seed-long-trip",
	"gnaural-arrive-sharp": "seed-morning-lift"
}, a = (e) => i[e] ?? e, o = {
	v: 1,
	items: []
};
function s(i, s) {
	if (!e(i) || n(i, "v") !== 1) return o;
	let c = n(i, "items");
	if (!Array.isArray(c)) return o;
	let l = [], u = /* @__PURE__ */ new Set();
	for (let i of c.slice(0, 1e3)) {
		if (!e(i)) continue;
		let o = n(i, "kind"), c = t(n(i, "id")), d = c !== null && o === "template" ? a(c) : c;
		if (o !== "template" && o !== "mix" || d === null) continue;
		let f = `${o}:${d}`;
		if (!u.has(f) && (u.add(f), l.push({
			kind: o,
			id: d,
			at: r(n(i, "at"), 0, s + 864e5, s)
		}), l.length >= 500)) break;
	}
	return {
		v: 1,
		items: l
	};
}
function c(e, t, n) {
	return e.items.some((e) => e.kind === t && e.id === n);
}
function l(e, n, r, i) {
	return c(e, n, r) ? {
		v: 1,
		items: e.items.filter((e) => e.kind !== n || e.id !== r)
	} : t(r) === null || e.items.length >= 500 ? e : {
		v: 1,
		items: [{
			kind: n,
			id: r,
			at: i
		}, ...e.items]
	};
}
function u(e, t, n) {
	return c(e, t, n) ? l(e, t, n, 0) : e;
}
export { l as a, u as i, c as n, s as r, o as t };
