<script>
	import { onMount } from 'svelte';
	import * as yootils from 'yootils';
	import { draw } from '../utils/draw.js';
	import { drag } from '../../../actions/drag.js';
	import { mix } from '../utils/utils.js';
	import { curve } from '../utils/curve.js';
	import { context } from '../../../context.js';
	import Toggles from './Toggles.svelte';

	/** @type {string} */
	export let name;

	/** @type {Record<string, import('../types').KeyframeTrack>} */
	export let value;

	/** @type {(values: any) => number} */
	export let playhead = null;

	const { observe } = context(); // TODO make a typed function for this

	const current_playhead = observe(playhead);

	const EPSILON = 0.000001;

	/** @type {string[]} */
	let selected_tracks = Object.keys(value);

	/** @type {import('../types').Point[]} */
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

		/** @param {import('../types').Point} point */
		function test(point) {
			if (point[0] < bounds.x1) bounds.x1 = point[0];
			if (point[0] > bounds.x2) bounds.x2 = point[0];
			if (point[1] < bounds.y1) bounds.y1 = point[1];
			if (point[1] > bounds.y2) bounds.y2 = point[1];
		}

		for (const key in value) {
			const track = value[key];

			for (let i = 0; i < track.points.length; i += 1) {
				const point = track.points[i];
				const prev = track.points[i - 1];
				const next = track.points[i + 1];

				test(point);

				if (prev) {
					const curve = track.curves[i - 1];
					test([
						prev[0] + (point[0] - prev[0]) * curve[2],
						prev[1] + (point[1] - prev[1]) * curve[3]
					]);
				}

				if (next) {
					const curve = track.curves[i];
					test([
						point[0] + (next[0] - point[0]) * curve[0],
						point[1] + (next[1] - point[1]) * curve[1]
					]);
				}
			}
		}

		// prevent zero-width bounds
		bounds.x1 -= 0.01;
		bounds.x2 += 0.01;
		bounds.y1 -= 0.01;
		bounds.y2 += 0.01;
	}

	fit();

	/**
	 * @param {number} x
	 * @param {number} y
	 * @returns {{
	 *   track: import('../types').KeyframeTrack;
	 *   index: number;
	 *   point: import('../types').Point;
	 *   prev: import('../types').Point;
	 *   next: import('../types').Point;
	 *   curve: import('../types').Curve;
	 *   new: boolean;
	 * }}
	 */
	function select(x, y) {
		const bcr = canvas.getBoundingClientRect();

		const ox = x - bcr.left;
		const oy = y - bcr.top;

		/** @param {import('../types').Point} point */
		function near(point) {
			const x = project.x(point[0]);
			const y = project.y(point[1]);

			const dx = x - ox;
			const dy = y - oy;

			return (dx * dx + dy * dy) < 100;
		}

		// try to select handle first
		for (const key in value) {
			const track = value[key];
			for (let i = 0; i < track.points.length; i += 1) {
				const point = track.points[i];

				if (selected_points.includes(point)) {
					const prev = track.points[i - 1];
					const next = track.points[i + 1];

					if (prev) {
						const curve = track.curves[i - 1];

						/** @type {import('../types').Point} */
						const handle = [mix(prev[0], point[0], curve[2]), mix(prev[1], point[1], curve[3])];

						if (near(handle)) {
							return {
								track,
								index: i,
								point,
								curve,
								prev,
								next: null,
								new: false
							};
						}
					}

					if (next) {
						const curve = track.curves[i];

						/** @type {import('../types').Point} */
						const handle = [mix(point[0], next[0], curve[0]), mix(point[1], next[1], curve[1])];

						if (near(handle)) {
							return {
								track,
								index: i,
								point,
								curve,
								prev: null,
								next,
								new: false
							};
						}
					}
				}
			}
		}

		// then select existing point
		for (const key in value) {
			const track = value[key];

			for (let index = 0; index < track.points.length; index += 1) {
				const point = track.points[index];
				const x = project.x(point[0]);
				const y = project.y(point[1]);

				const dx = x - ox;
				const dy = y - oy;

				if ((dx * dx + dy * dy) < 100) {
					return { track, index, point, curve: null, prev: null, next: null, new: false };
				}
			}
		}

		// then select new point
		const x1 = ox - 10; // TODO make this number less magical
		const x2 = ox + 10;

		for (const key in value) {
			const track = value[key];
			const fn = curve(track);

			const candidates = [];

			for (let x = x1; x <= x2; x += 1) {
				const u = unproject.x(x);
				const v = fn(u);

				const y = project.y(v);

				const dx = x - ox;
				const dy = y - oy;

				const d = (dx * dx + dy * dy);

				if (d < 100) {
					candidates.push({
						/** @type {import('../types').Point} */
						point: [u, v],
						d
					});
				}
			}

			const closest = candidates.sort((a, b) => a.d - b.d)[0];

			if (closest) {
				const index = track.points.findIndex(point => point[0] > closest.point[0]);

				return {
					track,
					index,
					point: closest.point,
					new: true,
					curve: null,
					prev: null,
					next: null
				};
			}
		}
	}

	/** @param {boolean} all */
	function smooth(all) {
		for (const key in value) {
			const track = value[key];

			for (let index = 0; index < track.points.length; index += 1) {
				const point = track.points[index];
				if (all || selected_points.includes(point)) {
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
							(next[0] - point[0]) * (next_curve[0]),
							(next[1] - point[1]) * (next_curve[1])
						];

						// find the mean gradient...
						const prev_gradient = prev_handle[1] / prev_handle[0];
						const next_gradient = next_handle[1] / next_handle[0];
						// const mean = Math.sign(prev_gradient) !== Math.sign(next_gradient) ? 0 : (prev_gradient + next_gradient) / 2;
						const mean = (prev_gradient + next_gradient) / 2;

						// ...and adjust y values of both handles such that both gradients match the mean
						prev_handle[1] = prev_handle[0] * mean;
						next_handle[1] = next_handle[0] * mean;

						prev_curve[2] = 1 - ((prev_handle[0]) / (prev[0] - point[0]));
						prev_curve[3] = 1 - ((prev_handle[1]) / (prev[1] - point[1]));

						next_curve[0] = next_handle[0] / (next[0] - point[0]);
						next_curve[1] = next_handle[1] / (next[1] - point[1]);
					}
				}
			}
		}

		value = value;
	}

	const padding = 20;

	$: project = {
		x: yootils.linearScale([bounds.x1, bounds.x2], [padding, w - padding]),
		y: yootils.linearScale([bounds.y1, bounds.y2], [h - padding, padding])
	};

	$: unproject = {
		x: project.x.inverse(),
		y: project.y.inverse()
	}

	$: if (ctx) draw(ctx, value, selected_tracks, selected_points, project, unproject, bounds, $current_playhead);

	onMount(() => {
		ctx = canvas.getContext('2d');
	});
</script>

<div class="keyframe-editor" tabindex="0" on:keydown={e => {
	// TODO nudge selection, undo/redo
}}>
	<p>{name}</p>

	<Toggles {value} bind:selected_tracks/>

	<div
		class="canvas-container"
		style="cursor: {cursor}"
		bind:clientWidth={w}
		bind:clientHeight={h}
		use:drag={{
			start: drag => {
				drag.context.multiplier = {
					x: (bounds.x2 - bounds.x1) / (canvas.offsetWidth - padding * 2),
					y: (bounds.y2 - bounds.y1) / (canvas.offsetHeight - padding * 2)
				};

				const selection = select(drag.start.x, drag.start.y);

				if (selection && selection.new) {
					selection.track.points.splice(selection.index, 0, selection.point);
					selection.track.curves.splice(selection.index, 0, [0.333, 0.333, 0.667, 0.667]);
				}

				drag.context.selection = selection;

				// TODO support multiple selections
				selected_points = [];

				if (selection) {
					if (selection.curve) {
						drag.context.start = selection.prev ? [selection.curve[2], selection.curve[3]] : [selection.curve[0], selection.curve[1]];

						drag.context.multiplier.x /= (selection.prev ? selection.point[0] - selection.prev[0] : selection.next[0] - selection.point[0]);
						drag.context.multiplier.y /= (selection.prev ? selection.point[1] - selection.prev[1] : selection.next[1] - selection.point[1]);

						drag.context.bounds = {
							x1: EPSILON,
							x2: 1 - EPSILON
						};
					} else {
						drag.context.start = [...selection.point];

						const prev = selection.track.points[selection.index - 1];
						const next = selection.track.points[selection.index + 1];

						drag.context.bounds = {
							x1: prev ? prev[0] + EPSILON : -Infinity,
							x2: next ? next[0] - EPSILON : +Infinity
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

					const { x1, x2 } = drag.context.bounds;

					const x = yootils.clamp(drag.context.start[0] + dx * drag.context.multiplier.x, x1, x2);
					const y = drag.context.start[1] - dy * drag.context.multiplier.y;

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
				const selection = select(e.clientX, e.clientY);
				cursor = selection ? (selection.new ? 'cell' : 'move') : 'grab';
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
					const x = e.clientX - bcr.left;
					const y = e.clientY - bcr.top;

					const cx = unproject.x(x);
					const cy = unproject.y(y);

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

	<button on:click={() => smooth(selected_points.length === 0)} title="Smooth {selected_points.length > 0 ? 'selected point' : 'all points'}" aria-label="Smooth">
		<svg viewBox="0 0 24 24">
			<path fill="currentColor" d="M18.5,2A1.5,1.5 0 0,1 20,3.5A1.5,1.5 0 0,1 18.5,5C18.27,5 18.05,4.95 17.85,4.85L14.16,8.55L14.5,9C16.69,7.74 19.26,7 22,7L23,7.03V9.04L22,9C19.42,9 17,9.75 15,11.04A3.96,3.96 0 0,1 11.04,15C9.75,17 9,19.42 9,22L9.04,23H7.03L7,22C7,19.26 7.74,16.69 9,14.5L8.55,14.16L4.85,17.85C4.95,18.05 5,18.27 5,18.5A1.5,1.5 0 0,1 3.5,20A1.5,1.5 0 0,1 2,18.5A1.5,1.5 0 0,1 3.5,17C3.73,17 3.95,17.05 4.15,17.15L7.84,13.45C7.31,12.78 7,11.92 7,11A4,4 0 0,1 11,7C11.92,7 12.78,7.31 13.45,7.84L17.15,4.15C17.05,3.95 17,3.73 17,3.5A1.5,1.5 0 0,1 18.5,2M11,9A2,2 0 0,0 9,11A2,2 0 0,0 11,13A2,2 0 0,0 13,11A2,2 0 0,0 11,9Z" />
		</svg>
	</button>

	<button disabled={selected_points.length === 0} title="Remove selected point" aria-label="Remove selected point" on:click={() => {
		for (const track of value) {
			let i = track.points.length;
			while (i--) {
				const point = track.points[i];
				if (selected_points.includes(point)) {
					track.points.splice(i, 1);
					track.curves.splice(i, 1);

					selected_points = selected_points.filter(x => x !== point);
				}
			}
		}

		value = value;
	}}>
		<svg style="width:24px;height:24px" viewBox="0 0 24 24">
			<path fill="currentColor" d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z" />
		</svg>
	</button>

	<button on:click={() => {
		navigator.clipboard.writeText(JSON.stringify(value));
	}} title="Copy to clipboard" aria-label="Copy to clipboard">
		<svg style="width:24px;height:24px" viewBox="0 0 24 24">
			<path fill="currentColor" d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z" />
		</svg>
	</button>

	<button on:click={fit} title="Fit to window" aria-label="Fit to window">
		<svg viewBox="0 0 24 24">
			<path fill="currentColor" d="M20,2H4C2.89,2 2,2.89 2,4V20C2,21.11 2.89,22 4,22H20C21.11,22 22,21.11 22,20V4C22,2.89 21.11,2 20,2M20,20H4V4H20M13,8V10H11V8H9L12,5L15,8M16,15V13H14V11H16V9L19,12M10,13H8V15L5,12L8,9V11H10M15,16L12,19L9,16H11V14H13V16" />
		</svg>
	</button>
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
		background: rgba(0,0,0,0.04);
	}

	canvas {
		width: 100%;
		height: 100%;
		mix-blend-mode: multiply;
	}

	button {
		width: 2rem;
		border-radius: 16px;
		background: var(--bg);
		box-shadow: var(--convex);
		border: none;
		border-radius: var(--border-radius);
		font: inherit;
		margin: 0.5rem 0 0.5rem 0;
		padding: 0.2rem;
	}

	button:disabled {
		box-shadow: none;
		opacity: 0.4;
	}

	button:active {
		box-shadow: var(--concave);
	}

	button svg {
		display: block;
		width: 100%;
		height: 100%;
	}
</style>
