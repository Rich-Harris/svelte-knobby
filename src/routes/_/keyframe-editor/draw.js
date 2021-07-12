import * as yootils from 'yootils';
import bezier from 'bezier-easing';
import { get_ticks } from './ticks.js';
import { mix } from './utils.js';
import { curve } from './curve.js';

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {import('./types').KeyframeTrack[]} tracks
 * @param {Array<[number, number]>} selected_points
 * @param {{ x: (n: number) => number, y: (n: number) => number }} project
 * @param {{ x: (n: number) => number, y: (n: number) => number }} unproject
 * @param {{ x1: number, x2: number, y1: number, y2: number }} bounds
 * @param {number} playhead
 */
export function draw(ctx, tracks, selected_points, project, unproject, bounds, playhead) {
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
		const fn = curve(track);

		ctx.beginPath();
		for (let x = 0; x < w; x += 1) {
			const u = unproject.x(x);
			const v = fn(u);

			const y = project.y(v);

			ctx.lineTo(x, y);
		}
		ctx.stroke();

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

					const hx = project.x(handle[0]);
					const hy = project.y(handle[1]);

					line(ctx, x, y, hx, hy, '#ff3e00', 1);
					circle(ctx, hx, hy, 3, '#ff3e00');
				}

				if (next) {
					const curve = track.curves[i];
					const handle = [mix(point[0], next[0], curve[0]), mix(point[1], next[1], curve[1])];

					const hx = project.x(handle[0]);
					const hy = project.y(handle[1]);

					line(ctx, x, y, hx, hy, '#ff3e00', 1);
					circle(ctx, hx, hy, 3, '#ff3e00');
				}
			}

			circle(ctx, x, y, is_selected ? 4 : 3, is_selected ? '#ff3e00' : 'black');
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
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x1
 * @param {number} y1
 * @param {number} x2
 * @param {number} y2
 * @param {string} stroke
 * @param {number} width
 */
function line(ctx, x1, y1, x2, y2, stroke, width) {
	ctx.beginPath();
	ctx.moveTo(x1, y1);
	ctx.lineTo(x2, y2);

	ctx.strokeStyle = stroke;
	ctx.lineWidth = width;
	ctx.stroke();
}
