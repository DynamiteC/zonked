// ../../web/src/ui/recContext.ts
function e(e) {
	let t = Math.max(0, Math.ceil(e)), n = Math.floor(t / 60), r = Math.floor(n / 60), i = (e) => String(e).padStart(2, "0");
	return r > 0 ? `${r}:${i(n % 60)}:${i(t % 60)}` : `${i(n)}:${i(t % 60)}`;
}
export { e as t };
