/** @typedef {import('../types').Keyframes} Keyframes */
/** @typedef {import('../types').KeyframeTrack} KeyframeTrack */
/** @typedef {import('../types').Selection} Selection */
/** @typedef {import('../types').Point} Point */

/**
 * @param {Keyframes} value
 * @param {string[]} active_tracks
 * @param {Selection} selected
 */
export function smooth(value, active_tracks, selected) {
	if (selected) {
		const track = value[selected.key];

		/** @type {KeyframeTrack} */
		const smoothed = {
			...track,
			points: track.points,
			curves: track.curves.map((curve) => [curve[0], curve[1], curve[2], curve[3]])
		};

		smooth_point(smoothed, selected.index);

		return {
			...value,
			[selected.key]: smoothed
		};
	}

	/** @type {Keyframes} */
	const smoothed = {};

	for (const key in value) {
		const track = value[key];

		if (active_tracks.includes(key)) {
			smoothed[key] = {
				...track,
				points: track.points,
				curves: track.curves.map((curve) => [curve[0], curve[1], curve[2], curve[3]])
			};

			for (let i = 0; i < track.points.length; i += 1) {
				smooth_point(smoothed[key], i);
			}
		} else {
			smoothed[key] = value[key];
		}
	}

	return smoothed;
}

// TODO typescript doesn't like the local mutations... figure out something else

/**
 * @param {KeyframeTrack} track
 * @param {number} index
 */
function smooth_point(track, index) {
	const point = track.points[index];
	const prev = track.points[index - 1];
	const next = track.points[index + 1];

	const prev_curve = track.curves[index - 1];
	const next_curve = track.curves[index];

	if (!prev) {
		// flatten intro
		next_curve[1] = 0;
	} else if (!next) {
		// flatten outro
		prev_curve[3] = 1;
	} else {
		// equalize gradient either side of the point

		/** @type {Point} */
		const prev_handle = [
			(prev[0] - point[0]) * (1 - prev_curve[2]),
			(prev[1] - point[1]) * (1 - prev_curve[3])
		];

		/** @type {Point} */
		const next_handle = [
			(next[0] - point[0]) * next_curve[0],
			(next[1] - point[1]) * next_curve[1]
		];

		// find the mean gradient...
		const prev_gradient = prev_handle[1] / prev_handle[0];
		const next_gradient = next_handle[1] / next_handle[0];
		// const mean = Math.sign(prev_gradient) !== Math.sign(next_gradient) ? 0 : (prev_gradient + next_gradient) / 2;
		const mean = (prev_gradient + next_gradient) / 2;

		// ...and adjust y values of both handles such that both gradients match the mean
		prev_handle[1] = prev_handle[0] * mean;
		next_handle[1] = next_handle[0] * mean;

		prev_curve[2] = 1 - prev_handle[0] / (prev[0] - point[0]);
		prev_curve[3] = 1 - prev_handle[1] / (prev[1] - point[1]);

		next_curve[0] = next_handle[0] / (next[0] - point[0]);
		next_curve[1] = next_handle[1] / (next[1] - point[1]);
	}
}
