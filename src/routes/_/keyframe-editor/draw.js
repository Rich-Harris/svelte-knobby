import * as yootils from 'yootils';
import bezier from 'bezier-easing';
import { get_ticks } from './ticks';

/**
 * @param {CanvasRenderingContext2D} ctx
 * @param {import('./types').KeyframeTrack[]} tracks
 * @param {{ x1: number, x2: number, y1: number, y2: number }} bounds
 * @param {number} playhead
 */
export function draw(ctx, tracks, bounds, playhead) {
	const w = ctx.canvas.offsetWidth * devicePixelRatio;
	const h = ctx.canvas.offsetHeight * devicePixelRatio;

	ctx.canvas.width = w;
	ctx.canvas.height = h;

	const padding = 20 * devicePixelRatio;

	const project = {
		x: yootils.linearScale([bounds.x1, bounds.x2], [padding, w - padding]),
		y: yootils.linearScale([bounds.y1, bounds.y2], [h - padding, padding])
	};

	// ticks
	ctx.font = `normal ${
		10 * devicePixelRatio
	}px ui-monospace, SFMono-Regular, Menlo, "Roboto Mono", monospace`;
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
		ctx.lineWidth = devicePixelRatio;
		ctx.stroke();

		ctx.strokeStyle = 'white';
		ctx.lineWidth = 3 * devicePixelRatio;
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
		ctx.lineWidth = devicePixelRatio;
		ctx.stroke();

		ctx.strokeStyle = 'white';
		ctx.lineWidth = 3 * devicePixelRatio;
		ctx.fillStyle = 'rgba(0,0,0,0.5)';
		ctx.strokeText(String(tick), padding * 0.5, y + 2 * devicePixelRatio);
		ctx.fillText(String(tick), padding * 0.5, y + 2 * devicePixelRatio);
	}

	ctx.strokeStyle = 'black';
	ctx.lineWidth = devicePixelRatio;

	for (const track of tracks) {
		for (let i = 0; i < track.curves.length; i += 1) {
			const curve = track.curves[i];
			const a = track.points[i];
			const b = track.points[i + 1];
			const fn = bezier(curve[0], curve[1], curve[2], curve[3]);

			const x1 = project.x(a[0]);
			const x2 = project.x(b[0]);

			const x_to_u = yootils.linearScale([x1, x2], [0, 1]);
			const v_to_n = yootils.linearScale([0, 1], [a[1], b[1]]);

			ctx.beginPath();

			for (let x = x1; x < x2; x += 1) {
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

			ctx.beginPath();
			ctx.arc(x, y, 5, 0, Math.PI * 2);
			ctx.strokeStyle = 'white';
			ctx.lineWidth = 8;
			ctx.fillStyle = 'black';
			ctx.stroke();
			ctx.fill();
		}
	}
}
