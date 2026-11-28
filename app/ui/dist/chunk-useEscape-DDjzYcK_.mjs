import { useEffect as e, useRef as t } from "react";
// ../../web/src/ui/calm/useEscape.ts
var n = [];
function r(r, i = !0) {
	let a = t(r);
	a.current = r, e(() => {
		if (!i) return;
		let e = Symbol("dialog");
		n.push(e);
		let t = (t) => {
			t.key === "Escape" && n[n.length - 1] === e && (t.stopPropagation(), a.current());
		};
		return document.addEventListener("keydown", t), () => {
			document.removeEventListener("keydown", t);
			let r = n.indexOf(e);
			r >= 0 && n.splice(r, 1);
		};
	}, [i]);
}
export { r as t };
