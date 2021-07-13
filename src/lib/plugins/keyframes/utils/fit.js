/**
 *
 * @param {Record<string, import('../types').KeyframeTrack>} value
 * @param {string[]} active_tracks
 */
export function fit(value, active_tracks) {
	const bounds = {
		x1: +Infinity,
		x2: -Infinity,
		y1: +Infinity,
		y2: -Infinity
	};

	/** @param {import('../types').Point} point */
	function test(point) {
		if (point[0] < bounds.x1) bounds.x1 = point[0];
		if (point[0] > bounds.x2) bounds.x2 = point[0];
		if (point[1] < bounds.y1) bounds.y1 = point[1];
		if (point[1] > bounds.y2) bounds.y2 = point[1];
	}

	for (const key in value) {
		if (active_tracks.includes(key)) {
			const track = value[key];

			for (let i = 0; i < track.points.length; i += 1) {
				const point = track.points[i];
				const prev = track.points[i - 1];
				const next = track.points[i + 1];

				test(point);

				if (prev) {
					const curve = track.curves[i - 1];
					test([
						prev[0] + (point[0] - prev[0]) * curve[2],
						prev[1] + (point[1] - prev[1]) * curve[3]
					]);
				}

				if (next) {
					const curve = track.curves[i];
					test([
						point[0] + (next[0] - point[0]) * curve[0],
						point[1] + (next[1] - point[1]) * curve[1]
					]);
				}
			}
		}
	}

	// prevent zero-width bounds
	bounds.x1 -= 0.01;
	bounds.x2 += 0.01;
	bounds.y1 -= 0.01;
	bounds.y2 += 0.01;

	return bounds;
}
