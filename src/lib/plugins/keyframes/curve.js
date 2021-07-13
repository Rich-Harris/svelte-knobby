import bezier from 'bezier-easing';

/** @param {import('./types').KeyframeTrack} track */
export function curve(track) {
	let i = 0;

	const first = track.points[0];
	const last = track.points[track.points.length - 1];

	const curves = track.curves.map((curve, i) => {
		const fn = bezier(curve[0], curve[1], curve[2], curve[3]);

		const a = track.points[i];
		const b = track.points[i + 1];

		const dx = b[0] - a[0];
		const dy = b[1] - a[1];

		return {
			x1: a[0],
			x2: b[0],
			/** @param {number} x */
			fn: (x) => {
				const u = (x - a[0]) / dx;
				const v = fn(u);

				return a[1] + dy * v;
			}
		};
	});

	/** @param {number} x */
	function fn(x) {
		if (x <= first[0]) return first[1];
		if (x >= last[0]) return last[1];

		while (curves[i].x2 < x) i += 1;
		while (curves[i].x1 > x) i -= 1;

		const curve = curves[i];

		return curve.fn(x);
	}

	return fn;
}
