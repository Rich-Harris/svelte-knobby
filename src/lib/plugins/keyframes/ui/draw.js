import { get_ticks } from './ticks.js';
import { mix } from '../utils/number.js';
import { curve } from '../curve.js';
import * as colors from './colors.js';

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {Record<string, import('../types').KeyframeTrack>} value
 * @param {string[]} active_tracks
 * @param {import('../types').Selection} selected
 * @param {{ x: (n: number) => number, y: (n: number) => number }} project
 * @param {{ x: (n: number) => number, y: (n: number) => number }} unproject
 * @param {{ x1: number, x2: number, y1: number, y2: number }} bounds
 * @param {number} playhead
 * @param {import('../types').Snap} snap
 */
export function draw(
	ctx,
	value,
	active_tracks,
	selected,
	project,
	unproject,
	bounds,
	playhead,
	snap
) {
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

	// draw playhead
	ctx.beginPath();
	const x = project.x(playhead);
	line(ctx, x, 0, x, h, 'white', 3);
	line(ctx, x, 0, x, h, '#999', 1);

	Object.entries(value).forEach(([key, track], i) => {
		const is_active = active_tracks.includes(key);
		const color = is_active ? track.$color || colors.palette[i] : 'rgba(0,0,0,0.1)';

		const fn = curve(track);

		ctx.beginPath();
		for (let x = 0; x < w; x += 1) {
			const u = unproject.x(x);
			const v = fn(u);

			const y = project.y(v);

			ctx.lineTo(x, y);
		}

		ctx.strokeStyle = color;
		ctx.lineWidth = is_active ? 2 : 1;
		ctx.stroke();
	});

	if (snap) {
		ctx.setLineDash([2, 2]);
		if (snap.x) {
			const x = project.x(snap.x);
			line(ctx, x, 0, x, h, colors.snap, 1);
		}

		if (snap.y) {
			const y = project.y(snap.y);
			line(ctx, 0, y, w, y, colors.snap, 1);
		}
		ctx.setLineDash([]);
	}

	Object.entries(value).forEach(([key, track], i) => {
		const is_active = active_tracks.includes(key);
		const color = is_active ? track.$color || colors.palette[i] : 'rgba(0,0,0,0.1)';

		for (let i = 0; i < track.points.length; i += 1) {
			const point = track.points[i];

			const x = project.x(point[0]);
			const y = project.y(point[1]);

			const is_selected = selected && selected.key === key && selected.index === i;

			if (is_selected) {
				const prev = track.points[i - 1];
				const next = track.points[i + 1];

				if (prev && prev[1] !== point[1]) {
					const curve = track.curves[i - 1];
					const handle = [mix(prev[0], point[0], curve[2]), mix(prev[1], point[1], curve[3])];

					const hx = project.x(handle[0]);
					const hy = project.y(handle[1]);

					line(ctx, x, y, hx, hy, 'black', 1);
					circle(ctx, hx, hy, 3, 2, 'black', 'white');
				}

				if (next && next[1] !== point[1]) {
					const curve = track.curves[i];
					const handle = [mix(point[0], next[0], curve[0]), mix(point[1], next[1], curve[1])];

					const hx = project.x(handle[0]);
					const hy = project.y(handle[1]);

					line(ctx, x, y, hx, hy, 'black', 1);
					circle(ctx, hx, hy, 3, 2, 'black', 'white');
				}
			}

			circle(ctx, x, y, is_selected ? 5 : 3, 5, 'white', is_selected ? 'black' : color);
		}
	});
}

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} x
 * @param {number} y
 * @param {number} r
 * @param {number} line_width
 * @param {string} stroke
 * @param {string} fill
 */
function circle(ctx, x, y, r, line_width, stroke, fill) {
	ctx.beginPath();
	ctx.arc(x, y, r, 0, Math.PI * 2);
	ctx.strokeStyle = stroke;
	ctx.lineWidth = line_width;
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
