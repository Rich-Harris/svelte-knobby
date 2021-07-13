import { curve } from './curve.js';
import { mix } from './utils.js';

/**
 * @param {Record<string, import('../types').KeyframeTrack>} value
 * @param {number} ox
 * @param {number} oy
 * @param {import('../types').Scales} project
 * @param {import('../types').Scales} unproject
 * @param {string[]} selected_tracks
 * @param {import('../types').Point[]} selected_points
 * @returns {{
 *   track: import('../types').KeyframeTrack;
 *   index: number;
 *   point: import('../types').Point;
 *   prev: import('../types').Point;
 *   next: import('../types').Point;
 *   curve: import('../types').Curve;
 *   new: boolean;
 * }}
 */
export function select(value, ox, oy, project, unproject, selected_tracks, selected_points) {
	/** @param {import('../types').Point} point */
	function near(point) {
		const x = project.x(point[0]);
		const y = project.y(point[1]);

		const dx = x - ox;
		const dy = y - oy;

		return dx * dx + dy * dy < 100;
	}

	// try to select handle first
	for (const key in value) {
		if (selected_tracks.includes(key)) {
			const track = value[key];
			for (let i = 0; i < track.points.length; i += 1) {
				const point = track.points[i];

				if (selected_points.includes(point)) {
					const prev = track.points[i - 1];
					const next = track.points[i + 1];

					if (prev) {
						const curve = track.curves[i - 1];

						/** @type {import('../types').Point} */
						const handle = [mix(prev[0], point[0], curve[2]), mix(prev[1], point[1], curve[3])];

						if (near(handle)) {
							return {
								track,
								index: i,
								point,
								curve,
								prev,
								next: null,
								new: false
							};
						}
					}

					if (next) {
						const curve = track.curves[i];

						/** @type {import('../types').Point} */
						const handle = [mix(point[0], next[0], curve[0]), mix(point[1], next[1], curve[1])];

						if (near(handle)) {
							return {
								track,
								index: i,
								point,
								curve,
								prev: null,
								next,
								new: false
							};
						}
					}
				}
			}
		}
	}

	// then select existing point
	for (const key in value) {
		const track = value[key];

		for (let index = 0; index < track.points.length; index += 1) {
			const point = track.points[index];
			const x = project.x(point[0]);
			const y = project.y(point[1]);

			const dx = x - ox;
			const dy = y - oy;

			if (dx * dx + dy * dy < 100) {
				return { track, index, point, curve: null, prev: null, next: null, new: false };
			}
		}
	}

	// then select new point
	const x1 = ox - 10; // TODO make this number less magical
	const x2 = ox + 10;

	for (const key in value) {
		const track = value[key];
		const fn = curve(track);

		const candidates = [];

		for (let x = x1; x <= x2; x += 1) {
			const u = unproject.x(x);
			const v = fn(u);

			const y = project.y(v);

			const dx = x - ox;
			const dy = y - oy;

			const d = dx * dx + dy * dy;

			if (d < 100) {
				candidates.push({
					/** @type {import('../types').Point} */
					point: [u, v],
					d
				});
			}
		}

		const closest = candidates.sort((a, b) => a.d - b.d)[0];

		if (closest) {
			const index = track.points.findIndex((point) => point[0] > closest.point[0]);

			return {
				track,
				index,
				point: closest.point,
				new: true,
				curve: null,
				prev: null,
				next: null
			};
		}
	}
}
