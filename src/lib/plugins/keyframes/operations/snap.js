/**
 *
 * @param {number} x
 * @param {number} y
 * @param {import('../types').Keyframes} value
 * @param {import('../types').Selection} selected
 * @param {number} playhead
 * @param {number} threshold_x
 * @param {number} threshold_y
 */
export function find_snap(x, y, value, selected, playhead, threshold_x, threshold_y) {
	const x_candidates = [];
	const y_candidates = [];

	const d = Math.abs(x - playhead);
	if (d < threshold_x) {
		x_candidates.push({ n: playhead, d });
	}

	for (const key in value) {
		const track = value[key];

		for (let i = 0; i < track.points.length; i += 1) {
			if (key === selected.key && i === selected.index) continue;

			const point = track.points[i];
			const dx = Math.abs(point[0] - x);
			const dy = Math.abs(point[1] - y);

			if (dx < threshold_x) {
				x_candidates.push({ n: point[0], d: dx });
			}

			if (dy < threshold_y) {
				y_candidates.push({ n: point[1], d: dy });
			}
		}
	}

	const closest = {
		x: x_candidates.sort((a, b) => a.d - b.d)[0],
		y: y_candidates.sort((a, b) => a.d - b.d)[0]
	};

	return {
		x: closest.x && closest.x.n,
		y: closest.y && closest.y.n
	};
}
