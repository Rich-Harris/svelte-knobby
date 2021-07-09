<script>
	import { onMount, getContext } from 'svelte';
	import * as yootils from 'yootils';
	import { draw } from './draw';
	import { drag } from '$lib/actions/drag.js';

	/** @type {string} */
	export let name;

	/** @type {{
	 *   x: (values: any) => number;
	 *   tracks: import('./types').KeyframeTrack[]
	 * }} */
	export let value;

	const { run } = getContext('knobby'); // TODO make a typed function for this

	const EPSILON = 0.000001;

	/** @type {Array<[number, number]>} */
	let selected_points = [];

	let w = 0;
	let h = 0;

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
	 * @param {number} x
	 * @param {number} y
	 */
	function select(x, y) {
		const bcr = canvas.getBoundingClientRect();

		const ox = x - bcr.left;
		const oy = y - bcr.top;

		for (const track of value.tracks) {
			for (let index = 0; index < track.points.length; index += 1) {
				const point = track.points[index];
				const x = project.x(point[0]);
				const y = project.y(point[1]);

				const dx = x - ox;
				const dy = y - oy;

				if ((dx * dx + dy * dy) < 100) {
					return { track, index, point };
				}

				// TODO check curve handles, if this point is selected
			}
		}
	}

	const padding = 20;

	$: project = {
		x: yootils.linearScale([bounds.x1, bounds.x2], [padding, w - padding]),
		y: yootils.linearScale([bounds.y1, bounds.y2], [h - padding, padding])
	};

	$: unproject = {
		x: project.x.inverse(),
		y: project.x.inverse()
	}

	$: if (ctx) draw(ctx, value.tracks, selected_points, project, bounds, 0); // TODO rerun x function automatically

	onMount(() => {
		ctx = canvas.getContext('2d');
	});
</script>

<div class="keyframe-editor" tabindex="0" on:keydown={e => {
	console.log(e);
}}>
	<span>{name}</span>

	<div
		class="canvas-container"
		style="cursor: {cursor}"
		bind:clientWidth={w}
		bind:clientHeight={h}
		use:drag={{
			start: drag => {
				const selection = select(drag.start.x, drag.start.y);

				drag.context.selection = selection;
				drag.context.multiplier = {
					x: (bounds.x2 - bounds.x1) / (canvas.offsetWidth - padding * 2),
					y: (bounds.y2 - bounds.y1) / (canvas.offsetHeight - padding * 2)
				}

				// TODO support multiple selections
				selected_points = [];

				if (selection) {
					drag.context.start = [...selection.point];

					const prev = selection.track.points[selection.index - 1];
					const next = selection.track.points[selection.index + 1];

					drag.context.bounds = {
						x1: prev ? prev[0] + EPSILON : -Infinity,
						x2: next ? next[0] - EPSILON : +Infinity
					};

					selected_points = [selection.point];
				}

				cursor = selection ? 'move' : 'grabbing';
			},
			move: (drag, e) => {
				if (drag.context.selection) {
					let dx = drag.x * drag.context.multiplier.x;
					let dy = drag.y * drag.context.multiplier.y;

					const { point } = drag.context.selection;
					const { x1, x2 } = drag.context.bounds;

					if (e.shiftKey) {
						if (Math.abs(drag.x) > Math.abs(drag.y)) {
							dy = 0;
						} else {
							dx = 0;
						}
					}

					// TODO move handles
					point[0] = yootils.clamp(drag.context.start[0] + dx, x1, x2);
					point[1] = drag.context.start[1] - dy;

					value = value;
				} else {
					const dx = drag.dx * drag.context.multiplier.x;
					const dy = drag.dy * drag.context.multiplier.y;

					bounds.x1 -= dx;
					bounds.x2 -= dx;
					bounds.y1 += dy;
					bounds.y2 += dy;
				}
			},
			end: drag => {
				cursor = 'grab';
			}
		}}
		on:pointerdown={e => {

		}}
		on:pointermove={e => {
			if (!e.buttons) {
				cursor = select(e.clientX, e.clientY) ? 'move' : 'grab';
			}
		}}
		on:wheel={e => {
			if (e.metaKey || e.shiftKey || e.altKey) {
				e.preventDefault();

				const bcr = canvas.getBoundingClientRect();

				if (e.altKey) {
					const dx = e.wheelDeltaX * (bounds.x2 - bounds.x1) / bcr.width;
					const dy = e.wheelDeltaY * (bounds.y2 - bounds.y1) / bcr.height;

					bounds.x1 -= dx * 0.25;
					bounds.x2 -= dx * 0.25;
					bounds.y1 += dy * 0.25;
					bounds.y2 += dy * 0.25;
				} else {
					const px = (e.clientX - bcr.left) / bcr.width;
					const py = (e.clientY - bcr.top) / bcr.height;
					const cx = bounds.x1 + px * (bounds.x2 - bounds.x1);
					const cy = bounds.y1 + py * (bounds.y2 - bounds.y1);

					const amount = Math.pow(Math.exp(-e.wheelDeltaY), 0.01);

					if (e.metaKey) {
						// zoom x
						bounds.x1 = cx - amount * (cx - bounds.x1);
						bounds.x2 = cx + amount * (bounds.x2 - cx);
					}

					if (e.shiftKey) {
						// zoom y
						bounds.y1 = cy - amount * (cy - bounds.y1);
						bounds.y2 = cy + amount * (bounds.y2 - cy);
					}
				}
			}
		}}
	>
		<canvas bind:this={canvas}></canvas>
	</div>

	<button on:click={fit}>fit</button>
</div>

<style>
	.keyframe-editor:focus-within {
		position: relative;
		margin: -2px;
		padding: 2px;
		outline: none;
		border-radius: var(--border-radius);
		box-shadow: 0 0 0 2px hsla(var(--hue), 11%, 40%, 0.4);
		z-index: 2;
	}

	.canvas-container {
		width: 100%;
		height: 200px;
		border-radius: var(--border-radius); /* TODO namespace and catalog these values */
		box-shadow: var(--concave);
		overflow: hidden;
		user-select: none;
		margin: 0 0 0.5rem 0;
	}

	.canvas-container::before {
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