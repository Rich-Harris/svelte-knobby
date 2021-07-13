/**
 * @param {import('../types').Keyframes} value
 * @param {import('../types').Point[]} selected_points
 */
export function smooth(value, selected_points) {
	for (const key in value) {
		const track = value[key];

		for (let index = 0; index < track.points.length; index += 1) {
			const point = track.points[index];
			if (selected_points.length === 0 || selected_points.includes(point)) {
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

					/** @type {import('../types').Point} */
					const prev_handle = [
						(prev[0] - point[0]) * (1 - prev_curve[2]),
						(prev[1] - point[1]) * (1 - prev_curve[3])
					];

					/** @type {import('../types').Point} */
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
		}
	}

	return value;
}
