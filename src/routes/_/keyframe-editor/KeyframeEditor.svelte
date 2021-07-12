<script>
	import { onMount, getContext } from 'svelte';
	import * as yootils from 'yootils';
	import { draw } from './draw.js';
	import { drag } from '$lib/actions/drag.js';
	import { mix } from './utils.js';

	/** @type {string} */
	export let name;

	/** @type {{
	 *   x: (values: any) => number;
	 *   tracks: import('./types').KeyframeTrack[]
	 * }} */
	export let value;

	const { run } = getContext('knobby'); // TODO make a typed function for this

	const EPSILON = 0.000001;

	/** @type {import('./types').Point[]} */
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
	 * @returns {{
	 *   track: import('./types').KeyframeTrack;
	 *   index: number;
	 *   point: import('./types').Point;
	 *   prev: import('./types').Point;
	 *   next: import('./types').Point;
	 *   curve: import('./types').Curve;
	 * }}
	 */
	function select(x, y) {
		const bcr = canvas.getBoundingClientRect();

		const ox = x - bcr.left;
		const oy = y - bcr.top;

		/** @param {import('./types').Point} point */
		function near(point) {
			const x = project.x(point[0]);
			const y = project.y(point[1]);

			const dx = x - ox;
			const dy = y - oy;

			return (dx * dx + dy * dy) < 100;
		}

		// try to select handle first
		for (const track of value.tracks) {
			for (let i = 0; i < track.points.length; i += 1) {
				const point = track.points[i];

				if (selected_points.includes(point)) {
					const prev = track.points[i - 1];
					const next = track.points[i + 1];

					if (prev) {
						const curve = track.curves[i - 1];

						/** @type {import('./types').Point} */
						const handle = [mix(prev[0], point[0], curve[2]), mix(prev[1], point[1], curve[3])];

						if (near(handle)) {
							return {
								track,
								index: i,
								point,
								curve,
								prev,
								next: null
							};
						}
					}

					if (next) {
						const curve = track.curves[i];

						/** @type {import('./types').Point} */
						const handle = [mix(point[0], next[0], curve[0]), mix(point[1], next[1], curve[1])];

						if (near(handle)) {
							return {
								track,
								index: i,
								point,
								curve,
								prev: null,
								next
							};
						}
					}
				}
			}
		}

		for (const track of value.tracks) {
			for (let index = 0; index < track.points.length; index += 1) {
				const point = track.points[index];
				const x = project.x(point[0]);
				const y = project.y(point[1]);

				const dx = x - ox;
				const dy = y - oy;

				if ((dx * dx + dy * dy) < 100) {
					return { track, index, point, curve: null, prev: null, next: null };
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
	// TODO nudge selection, undo/redo
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

				console.log('selection', selection);

				drag.context.selection = selection;

				// TODO support multiple selections
				selected_points = [];

				if (selection) {
					drag.context.multiplier = {
						x: (bounds.x2 - bounds.x1) / (canvas.offsetWidth - padding * 2),
						y: (bounds.y2 - bounds.y1) / (canvas.offsetHeight - padding * 2)
					};

					if (selection.curve) {
						drag.context.start = selection.prev ? [selection.curve[2], selection.curve[3]] : [selection.curve[0], selection.curve[1]];

						drag.context.multiplier.x /= (selection.prev ? selection.point[0] - selection.prev[0] : selection.next[0] - selection.point[0]);
						drag.context.multiplier.y /= (selection.prev ? selection.point[1] - selection.prev[1] : selection.next[1] - selection.point[1]);

						drag.context.bounds = {
							x1: EPSILON,
							x2: 1 - EPSILON,
							y1: 0,
							y2: 1
						};
					} else {
						drag.context.start = [...selection.point];

						const prev = selection.track.points[selection.index - 1];
						const next = selection.track.points[selection.index + 1];

						drag.context.bounds = {
							x1: prev ? prev[0] + EPSILON : -Infinity,
							x2: next ? next[0] - EPSILON : +Infinity,
							y1: -Infinity,
							y2: +Infinity
						};
					}

					// TODO allow multiple points to be selected
					selected_points = [selection.point];
				}

				cursor = selection ? 'move' : 'grabbing';
			},
			move: (drag, e) => {
				if (drag.context.selection) {
					let dx = drag.x;
					let dy = drag.y;

					if (e.shiftKey) {
						if (Math.abs(drag.x) > Math.abs(drag.y)) {
							dy = 0;
						} else {
							dx = 0;
						}
					}

					const { x1, x2, y1, y2 } = drag.context.bounds;

					const x = yootils.clamp(drag.context.start[0] + dx * drag.context.multiplier.x, x1, x2);
					const y = yootils.clamp(drag.context.start[1] - dy * drag.context.multiplier.y, y1, y2);

					if (drag.context.selection.curve) {
						if (drag.context.selection.prev) {
							drag.context.selection.curve[2] = x;
							drag.context.selection.curve[3] = y;
						} else {
							drag.context.selection.curve[0] = x;
							drag.context.selection.curve[1] = y;
						}
					} else {
						const { point } = drag.context.selection;

						point[0] = x;
						point[1] = y;
					}

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
	.keyframe-editor:focus-visible {
		position: relative;
		margin: -2px;
		padding: 2px;
		outline: none;
		border-radius: calc(var(--border-radius) * 0.25);
		box-shadow: 0 0 0 2px var(--focus-color);
		z-index: 2;
	}

	.keyframe-editor:focus-within > span {
		font-weight: bold;
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