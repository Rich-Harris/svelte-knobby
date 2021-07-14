import { curve } from '../curve.js';
import { mix } from '../utils/number.js';

/** @typedef {import('../types').Keyframes} Keyframes */
/** @typedef {import('../types').Scales} Scales */
/** @typedef {import('../types').Selection} Selection */
/** @typedef {import('../types').Handle} Handle */
/** @typedef {import('../types').Point} Point */

/**
 * @param {Keyframes} value
 * @param {number} ox
 * @param {number} oy
 * @param {Scales} project
 * @param {string[]} active_tracks
 * @returns {Selection}
 */
export function select_point(value, ox, oy, project, active_tracks) {
	for (const key in value) {
		if (active_tracks.includes(key)) {
			const track = value[key];

			for (let index = 0; index < track.points.length; index += 1) {
				const point = track.points[index];
				const x = project.x(point[0]);
				const y = project.y(point[1]);

				const dx = x - ox;
				const dy = y - oy;

				if (dx * dx + dy * dy < 100) {
					return { key, index };
				}
			}
		}
	}
}

/**
 * @param {Keyframes} value
 * @param {number} ox
 * @param {number} oy
 * @param {Scales} project
 * @param {Selection} selected
 * @returns {Handle}
 */
export function select_handle(value, ox, oy, project, selected) {
	if (!selected) return null;

	const track = value[selected.key];

	const point = track.points[selected.index];
	const prev = track.points[selected.index - 1];
	const next = track.points[selected.index + 1];

	/** @param {Point} point */
	function near(point) {
		const x = project.x(point[0]);
		const y = project.y(point[1]);

		const dx = x - ox;
		const dy = y - oy;

		return dx * dx + dy * dy < 100;
	}

	if (prev && prev[1] !== point[1]) {
		const curve = track.curves[selected.index - 1];

		/** @type {Point} */
		const handle = [mix(prev[0], point[0], curve[2]), mix(prev[1], point[1], curve[3])];

		if (near(handle)) {
			return {
				a: prev,
				b: point,
				index: selected.index - 1,
				offset: 2
			};
		}
	}

	if (next && next[1] !== point[1]) {
		const curve = track.curves[selected.index];

		/** @type {Point} */
		const handle = [mix(point[0], next[0], curve[0]), mix(point[1], next[1], curve[1])];

		if (near(handle)) {
			return {
				a: point,
				b: next,
				index: selected.index,
				offset: 0
			};
		}
	}
}

/**
 * @param {Keyframes} value
 * @param {number} ox
 * @param {number} oy
 * @param {Scales} project
 * @param {Scales} unproject
 * @param {string[]} active_tracks
 * @returns {{ key: string, index: number, curve_index: number, point: readonly Point }}
 */
export function select_new_point(value, ox, oy, project, unproject, active_tracks) {
	const x1 = ox - 10; // TODO make this number less magical
	const x2 = ox + 10;

	for (const key in value) {
		if (active_tracks.includes(key)) {
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
						/** @type {Point} */
						point: [u, v],
						d
					});
				}
			}

			const closest = candidates.sort((a, b) => a.d - b.d)[0];

			if (closest) {
				let index = 0;
				while (track.points[index] && track.points[index][0] < closest.point[0]) {
					index += 1;
				}

				return {
					key,
					index,
					curve_index: Math.min(index, track.curves.length - 1),
					point: closest.point
				};
			}
		}
	}
}
