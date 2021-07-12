import * as yootils from 'yootils';
import bezier from 'bezier-easing';
import { get_ticks } from './ticks';

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {import('./types').KeyframeTrack[]} tracks
 * @param {Array<[number, number]>} selected_points
 * @param {{ x: (n: number) => number, y: (n: number) => number }} project
 * @param {{ x1: number, x2: number, y1: number, y2: number }} bounds
 * @param {number} playhead
 */
export function draw(ctx, tracks, selected_points, project, bounds, playhead) {
	const w = ctx.canvas.offsetWidth;
	const h = ctx.canvas.offsetHeight;

	ctx.canvas.width = w * devicePixelRatio;
	ctx.canvas.height = h * devicePixelRatio;
	ctx.scale(devicePixelRatio, devicePixelRatio);

	const padding = 20;

	// ticks
	ctx.font = `normal ${10}px ui-monospace, SFMono-Regular, Menlo, "Roboto Mono", monospace`;
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';

	const margin = {
		x: (bounds.x2 - bounds.x1) * 0.2,
		y: (bounds.y2 - bounds.y1) * 0.2
	};

	for (const tick of get_ticks(bounds.x1 - margin.x, bounds.x2 + margin.x)) {
		const x = project.x(tick);
		ctx.beginPath();
		ctx.moveTo(x, 0);
		ctx.lineTo(x, h);
		ctx.strokeStyle = 'rgba(0,0,0,0.1)';
		ctx.lineWidth = 1;
		ctx.stroke();

		ctx.strokeStyle = 'white';
		ctx.lineWidth = 3;
		ctx.fillStyle = 'rgba(0,0,0,0.5)';
		ctx.strokeText(String(tick), x, h - padding * 0.5);
		ctx.fillText(String(tick), x, h - padding * 0.5);
	}

	for (const tick of get_ticks(bounds.y1 - margin.y, bounds.y2 + margin.y)) {
		const y = project.y(tick);
		ctx.beginPath();
		ctx.moveTo(0, y);
		ctx.lineTo(w, y);
		ctx.strokeStyle = 'rgba(0,0,0,0.1)';
		ctx.lineWidth = 1;
		ctx.stroke();

		ctx.strokeStyle = 'white';
		ctx.lineWidth = 3;
		ctx.fillStyle = 'rgba(0,0,0,0.5)';
		ctx.strokeText(String(tick), padding * 0.5, y + 2);
		ctx.fillText(String(tick), padding * 0.5, y + 2);
	}

	ctx.strokeStyle = 'black';
	ctx.lineWidth = 1;

	for (const track of tracks) {
		for (let i = 0; i < track.curves.length; i += 1) {
			const curve = track.curves[i];
			const a = track.points[i];
			const b = track.points[i + 1];
			const fn = bezier(curve[0], curve[1], curve[2], curve[3]);

			const x1 = Math.floor(project.x(a[0]));
			const x2 = Math.ceil(project.x(b[0]));

			const x_to_u = yootils.linearScale([x1, x2], [0, 1]);
			const v_to_n = yootils.linearScale([0, 1], [a[1], b[1]]);

			ctx.beginPath();

			for (let x = x1; x <= x2; x += 1) {
				const u = x_to_u(x);
				const v = fn(u);

				const n = v_to_n(v);
				const y = project.y(n);

				ctx.lineTo(x, y);
			}

			ctx.stroke();
		}

		for (let i = 0; i < track.points.length; i += 1) {
			const point = track.points[i];

			const x = project.x(point[0]);
			const y = project.y(point[1]);

			const is_selected = selected_points.includes(point);

			if (is_selected) {
				const prev = track.points[i - 1];
				const next = track.points[i + 1];

				if (prev) {
					const curve = track.curves[i - 1];
					const handle = [mix(prev[0], point[0], curve[2]), mix(prev[1], point[1], curve[3])];

					const x = project.x(handle[0]);
					const y = project.y(handle[1]);
					circle(ctx, x, y, 3, 'red');
				}

				if (next) {
					const curve = track.curves[i];
					const handle = [mix(point[0], next[0], curve[0]), mix(point[1], next[1], curve[1])];

					const x = project.x(handle[0]);
					const y = project.y(handle[1]);
					circle(ctx, x, y, 3, 'red');
				}
			}

			circle(ctx, x, y, is_selected ? 4 : 3, is_selected ? 'red' : 'black');
		}
	}
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x
 * @param {number} y
 * @param {number} r
 * @param {string} fill
 */
function circle(ctx, x, y, r, fill) {
	ctx.beginPath();
	ctx.arc(x, y, r, 0, Math.PI * 2);
	ctx.strokeStyle = 'white';
	ctx.lineWidth = 5;
	ctx.fillStyle = fill;
	ctx.stroke();
	ctx.fill();
}

/**
 * @param {number} a
 * @param {number} b
 * @param {number} t
 */
function mix(a, b, t) {
	return a + t * (b - a);
}
