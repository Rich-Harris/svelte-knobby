<script>
	import { onMount, getContext } from 'svelte';
	import bezier from 'bezier-easing';
	import * as yootils from 'yootils';
	import { get_ticks } from './ticks';

	/** @type {string} */
	export let name;

	/** @type {{
	 *   x: (values: any) => number;
	 *   tracks: import('./types').KeyframeTrack[]
	 * }} */
	export let value;

	const { run } = getContext('knobby'); // TODO make a typed function for this

	/** @type {HTMLCanvasElement} */
	let canvas;

	/** @type {CanvasRenderingContext2D} */
	let ctx;

	let bounds = { x1: 0, x2: 0, y1: 0, y2: 0 };

	let cursor = 'grab';

	function fit() {
		bounds.x1 = +Infinity;
		bounds.x2 = -Infinity;
		bounds.y1 = +Infinity;
		bounds.y2 = -Infinity;

		for (const track of value.tracks) {
			for (const point of track.points) {
				if (point[0] < bounds.x1) bounds.x1 = point[0];
				if (point[0] > bounds.x2) bounds.x2 = point[0];
				if (point[1] < bounds.y1) bounds.y1 = point[1];
				if (point[1] > bounds.y2) bounds.y2 = point[1];
			}
		}
	}

	fit();

	/**
	 * @param {import('./types').KeyframeTrack[]} tracks
	 * @param {number} playhead
	*/
	function draw(tracks, playhead) {
		const w = canvas.offsetWidth * devicePixelRatio;
		const h = canvas.offsetHeight * devicePixelRatio;

		canvas.width = w;
		canvas.height = h;

		const padding = 20 * devicePixelRatio;

		const project = {
			x: yootils.linearScale([bounds.x1, bounds.x2], [padding, w - padding]),
			y: yootils.linearScale([bounds.y1, bounds.y2], [h - padding, padding])
		};

		// ticks
		ctx.font = `normal ${10 * devicePixelRatio}px ui-monospace, SFMono-Regular, Menlo, "Roboto Mono", monospace`;
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';

		for (const tick of get_ticks(bounds.x1, bounds.x2)) {
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

		for (const tick of get_ticks(bounds.x1, bounds.x2)) {
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

	$: if (ctx) draw(value.tracks, 0); // TODO rerun x function automatically

	onMount(() => {
		ctx = canvas.getContext('2d');
	});
</script>

<span>{name}</span>

<div class="keyframe-editor" style="cursor: {cursor}">
	<canvas bind:this={canvas}></canvas>
</div>

<style>
	.keyframe-editor {
		width: 100%;
		height: 200px;
		border-radius: var(--border-radius); /* TODO namespace and catalog these values */
		box-shadow: var(--concave);
		overflow: hidden;
	}

	.keyframe-editor::before {
		content: '';
		position: absolute;
		width: 100%;
		height: 100%;
		background: rgba(0,0,0,0.05);
	}

	canvas {
		width: 100%;
		height: 100%;
		mix-blend-mode: multiply;
	}
</style>