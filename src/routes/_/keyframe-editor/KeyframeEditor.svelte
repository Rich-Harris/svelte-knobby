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

	/** @type {Set<[number, number]>} */
	const selected_points = new Set();

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

	const padding = 20;

	$: project = {
		x: yootils.linearScale([bounds.x1, bounds.x2], [padding, w - padding]),
		y: yootils.linearScale([bounds.y1, bounds.y2], [h - padding, padding])
	};

	$: unproject = {
		x: project.x.inverse(),
		y: project.x.inverse()
	}

	$: if (ctx) draw(ctx, value.tracks, project, bounds, 0); // TODO rerun x function automatically

	onMount(() => {
		ctx = canvas.getContext('2d');
	});
</script>

<span>{name}</span>

<div
	class="keyframe-editor"
	style="cursor: {cursor}"
	bind:clientWidth={w}
	bind:clientHeight={h}
	use:drag={{
		start: drag => {
			drag.context.selection = null;
		},
		move: drag => {
			const dx = drag.dx * (bounds.x2 - bounds.x1) / (canvas.offsetWidth);
			const dy = drag.dy * (bounds.y2 - bounds.y1) / (canvas.offsetHeight);
			bounds.x1 -= dx;
			bounds.x2 -= dx;
			bounds.y1 += dy;
			bounds.y2 += dy;
		},
		end: drag => {

		}
	}}
	on:pointerdown={e => {

	}}
	on:mousemove={e => {
		// const bcr = canvas.getBoundingClientRect();
		// const project = {
		// 	x: yootils.linearScale([bounds.x1, bounds.x2], [bcr.left, bcr.right])
		// }

		// for (const track of value.tracks) {
		// 	for (const point of track.points) {
		// 		console.log(point);
		// 	}
		// }
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

<style>
	.keyframe-editor {
		width: 100%;
		height: 200px;
		border-radius: var(--border-radius); /* TODO namespace and catalog these values */
		box-shadow: var(--concave);
		overflow: hidden;
		user-select: none;
		margin: 0 0 0.5rem 0;
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