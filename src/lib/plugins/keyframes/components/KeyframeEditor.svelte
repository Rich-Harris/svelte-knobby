<script>
	import { onMount } from 'svelte';
	import * as yootils from 'yootils';
	import { draw } from '../ui/draw.js';
	import { drag } from '../../../actions/drag.js';
	import { select_handle, select_new_point, select_point } from '../operations/select.js';
	import { context } from '../../../context.js';
	import { fit } from '../ui/fit.js';
	import { smooth } from '../operations/smooth.js';
	import Toggles from './Toggles.svelte';
	import { mix, unmix } from '../utils/number.js';
	import { find_snap } from '../operations/snap.js';
	import { createStack } from 'svelte-undo';

	/** @typedef {import('../types').Keyframes} Keyframes */
	/** @typedef {import('../types').Point} Point */
	/** @typedef {import('../types').Curve} Curve */
	/** @typedef {import('../types').Snap} Snap */

	/** @type {import('../../../types').Config} */
	export let config;

	/** @type {Keyframes} */
	export let value;

	/** @type {(values: any) => number} */
	export let playhead = null;

	const { observe } = context(); // TODO make a typed function for this
	const current_playhead = observe(playhead);

	const stack = createStack({
		value,
		selected: null
	});

	const update_stack = () => stack.push({ value, selected });

	const padding = 20;
	const EPSILON = 0.000001;

	/** @type {string[]} */
	let active_tracks = Object.keys(value);

	/** @type {{ key: string, index: number }} */
	let selected;

	let w = 0;
	let h = 0;
	let cursor = 'grab';
	let snapping = false;

	/** @type {HTMLCanvasElement} */
	let canvas;

	/** @type {CanvasRenderingContext2D} */
	let ctx;

	let bounds = fit(value, active_tracks);

	/** @type {Snap} */
	let snap;

	$: project = {
		x: yootils.linearScale([bounds.x1, bounds.x2], [padding, w - padding]),
		y: yootils.linearScale([bounds.y1, bounds.y2], [h - padding, padding])
	};

	$: unproject = {
		x: project.x.inverse(),
		y: project.y.inverse()
	};

	$: if (selected && !active_tracks.includes(selected.key)) {
		selected = null;
	}

	$: if (ctx)
		draw(ctx, value, active_tracks, selected, project, unproject, bounds, $current_playhead, snap);

	onMount(() => {
		ctx = canvas.getContext('2d');
	});
</script>

<div
	class="keyframe-editor"
	tabindex="0"
	on:keydown={(e) => {
		// TODO nudge selection, undo/redo
		if (e.code === 'KeyS') snapping = true;

		if (e.code === 'KeyZ' && e.metaKey) {
			if (e.shiftKey) {
				({ value, selected } = stack.redo());
			} else {
				({ value, selected } = stack.undo());
			}
		}
	}}
	on:keyup={(e) => {
		if (e.code === 'KeyS') snapping = false;
	}}
>
	<p>{config.label}</p>

	<Toggles {value} bind:active_tracks />

	<div
		class="canvas-container"
		style="cursor: {cursor}"
		bind:clientWidth={w}
		bind:clientHeight={h}
		use:drag={{
			start: (drag) => {
				const { offsetX: ox, offsetY: oy } = drag.start;

				drag.context.multiplier = {
					x: (bounds.x2 - bounds.x1) / (canvas.offsetWidth - padding * 2),
					y: (bounds.y2 - bounds.y1) / (canvas.offsetHeight - padding * 2)
				};

				const handle = select_handle(value, ox, oy, project, selected);

				if (handle) {
					cursor = 'move';

					const curve = value[selected.key].curves[handle.index];
					drag.context.start = [
						mix(handle.a[0], handle.b[0], curve[0 + handle.offset]),
						mix(handle.a[1], handle.b[1], curve[1 + handle.offset])
					];

					drag.context.handle = handle;

					drag.context.bounds = {
						x1: handle.a[0] + EPSILON,
						x2: handle.b[0] - EPSILON
					};

					return;
				}

				selected = select_point(
					value,
					drag.start.offsetX,
					drag.start.offsetY,
					project,
					active_tracks
				);

				if (!selected) {
					const insert = select_new_point(value, ox, oy, project, unproject, active_tracks);

					if (insert) {
						const track = value[insert.key];

						/** @type {readonly Point[]} */
						const points = [
							...track.points.slice(0, insert.index),
							insert.point,
							...track.points.slice(insert.index)
						];

						/** @type {readonly Curve[]} */
						const curves = [
							...track.curves.slice(0, insert.curve_index),
							[0.333, 0.333, 0.667, 0.667],
							...track.curves.slice(insert.curve_index)
						];

						value = {
							...value,
							[insert.key]: {
								...track,
								points,
								curves
							}
						};

						selected = { key: insert.key, index: insert.index };
					}
				}

				if (selected) {
					const track = value[selected.key];

					const point = track.points[selected.index];
					const prev = track.points[selected.index - 1];
					const next = track.points[selected.index + 1];

					drag.context.start = [...point];

					drag.context.bounds = {
						x1: prev ? prev[0] + EPSILON : -Infinity,
						x2: next ? next[0] - EPSILON : +Infinity
					};

					cursor = 'move';
				} else {
					cursor = 'grabbing';
				}
			},
			move: (drag, e) => {
				const { multiplier, handle, start } = drag.context;

				if (selected) {
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

					let x = yootils.clamp(start[0] + dx * multiplier.x, x1, x2);
					let y = start[1] - dy * multiplier.y;

					snap =
						snapping &&
						find_snap(
							x,
							y,
							value,
							selected,
							$current_playhead,
							10 * drag.context.multiplier.x,
							10 * drag.context.multiplier.y
						);

					if (snap) {
						if (snap.x) {
							x = snap.x = yootils.clamp(snap.x, x1, x2);
						}

						if (snap.y) {
							y = snap.y;
						}
					}

					const track = value[selected.key];

					if (handle) {
						value = {
							...value,
							[selected.key]: {
								...track,
								curves: track.curves.map((curve, i) => {
									if (i === handle.index) {
										const u = unmix(handle.a[0], handle.b[0], x);
										const v = unmix(handle.a[1], handle.b[1], y);

										return [
											handle.offset === 0 ? u : curve[0],
											handle.offset === 0 ? v : curve[1],
											handle.offset === 2 ? u : curve[2],
											handle.offset === 2 ? v : curve[3]
										];
									}

									return curve;
								})
							}
						};
					} else {
						value = {
							...value,
							[selected.key]: {
								...track,
								points: track.points.map((point, i) => {
									if (i === selected.index) return [x, y];
									return point;
								})
							}
						};
					}
				} else {
					const dx = drag.dx * multiplier.x;
					const dy = drag.dy * multiplier.y;

					bounds.x1 -= dx;
					bounds.x2 -= dx;
					bounds.y1 += dy;
					bounds.y2 += dy;
				}
			},
			end: (drag) => {
				cursor = 'grab';
				snap = null;

				update_stack();
			}
		}}
		on:pointerdown={(e) => {}}
		on:pointermove={(e) => {
			if (!e.buttons) {
				const { offsetX: ox, offsetY: oy } = e;
				cursor =
					select_handle(value, ox, oy, project, selected) ||
					select_point(value, ox, oy, project, active_tracks)
						? 'move'
						: select_new_point(value, ox, oy, project, unproject, active_tracks)
						? 'cell'
						: 'grab';
			}
		}}
		on:wheel={(e) => {
			if (e.metaKey || e.shiftKey || e.altKey) {
				e.preventDefault();

				const bcr = canvas.getBoundingClientRect();

				if (e.altKey) {
					const dx = (-e.deltaX * (bounds.x2 - bounds.x1)) / bcr.width;
					const dy = (-e.deltaY * (bounds.y2 - bounds.y1)) / bcr.height;

					bounds.x1 -= dx * 0.25;
					bounds.x2 -= dx * 0.25;
					bounds.y1 += dy * 0.25;
					bounds.y2 += dy * 0.25;
				} else {
					const x = e.clientX - bcr.left;
					const y = e.clientY - bcr.top;

					const cx = unproject.x(x);
					const cy = unproject.y(y);

					const amount = Math.pow(Math.exp(e.deltaY), 0.01);

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
		<canvas bind:this={canvas} />
	</div>

	<div class="controls">
		<div class="left">
			{#if selected && active_tracks.includes(selected.key)}
				<input
					type="number"
					value={value[selected.key].points[selected.index][0]}
					on:input={(e) => {
						const track = value[selected.key];
						const x = +e.target.value;
						value = {
							...value,
							[selected.key]: {
								...track,
								points: track.points.map((point, i) => {
									if (i === selected.index) return [x, point[1]];
									return point;
								})
							}
						};
					}}
					on:change={update_stack}
				/>

				<input
					type="number"
					value={value[selected.key].points[selected.index][1]}
					on:input={(e) => {
						const track = value[selected.key];
						const y = +e.target.value;
						value = {
							...value,
							[selected.key]: {
								...track,
								points: track.points.map((point, i) => {
									if (i === selected.index) return [point[0], y];
									return point;
								})
							}
						};
					}}
					on:change={update_stack}
				/>
			{/if}
		</div>

		<div class="right">
			<button
				disabled={$stack.first}
				title="Undo"
				on:click={(e) => {
					({ value, selected } = stack.undo());
				}}
			>
				<svg viewBox="0 0 24 24" aria-label="Undo">
					<path
						fill="currentColor"
						d="M20 13.5C20 17.09 17.09 20 13.5 20H6V18H13.5C16 18 18 16 18 13.5S16 9 13.5 9H7.83L10.91 12.09L9.5 13.5L4 8L9.5 2.5L10.92 3.91L7.83 7H13.5C17.09 7 20 9.91 20 13.5Z"
					/>
				</svg>
			</button>

			<button
				disabled={$stack.last}
				title="Undo"
				on:click={(e) => {
					({ value, selected } = stack.redo());
				}}
			>
				<svg viewBox="0 0 24 24" aria-label="Redo">
					<path
						fill="currentColor"
						d="M10.5 18H18V20H10.5C6.91 20 4 17.09 4 13.5S6.91 7 10.5 7H16.17L13.08 3.91L14.5 2.5L20 8L14.5 13.5L13.09 12.09L16.17 9H10.5C8 9 6 11 6 13.5S8 18 10.5 18Z"
					/>
				</svg>
			</button>

			<button
				on:click={() => (value = smooth(value, active_tracks, selected))}
				title="Smooth {selected ? 'selected point' : 'all points'}"
			>
				<svg viewBox="0 0 24 24" aria-label="Smooth">
					<path
						fill="currentColor"
						d="M18.5,2A1.5,1.5 0 0,1 20,3.5A1.5,1.5 0 0,1 18.5,5C18.27,5 18.05,4.95 17.85,4.85L14.16,8.55L14.5,9C16.69,7.74 19.26,7 22,7L23,7.03V9.04L22,9C19.42,9 17,9.75 15,11.04A3.96,3.96 0 0,1 11.04,15C9.75,17 9,19.42 9,22L9.04,23H7.03L7,22C7,19.26 7.74,16.69 9,14.5L8.55,14.16L4.85,17.85C4.95,18.05 5,18.27 5,18.5A1.5,1.5 0 0,1 3.5,20A1.5,1.5 0 0,1 2,18.5A1.5,1.5 0 0,1 3.5,17C3.73,17 3.95,17.05 4.15,17.15L7.84,13.45C7.31,12.78 7,11.92 7,11A4,4 0 0,1 11,7C11.92,7 12.78,7.31 13.45,7.84L17.15,4.15C17.05,3.95 17,3.73 17,3.5A1.5,1.5 0 0,1 18.5,2M11,9A2,2 0 0,0 9,11A2,2 0 0,0 11,13A2,2 0 0,0 13,11A2,2 0 0,0 11,9Z"
					/>
				</svg>
			</button>

			<button
				disabled={!selected || value[selected.key].points.length === 1}
				title="Remove selected point"
				on:click={() => {
					const track = value[selected.key];

					const curve_index = Math.min(selected.index, track.curves.length - 1);

					value = {
						...value,
						[selected.key]: {
							...track,
							points: track.points.filter((point, i) => i !== selected.index),
							curves: track.curves.filter((curve, i) => i !== curve_index)
						}
					};

					selected = null;

					update_stack();
				}}
			>
				<svg viewBox="0 0 24 24" aria-label="Remove selected point">
					<path
						fill="currentColor"
						d="M9,3V4H4V6H5V19A2,2 0 0,0 7,21H17A2,2 0 0,0 19,19V6H20V4H15V3H9M7,6H17V19H7V6M9,8V17H11V8H9M13,8V17H15V8H13Z"
					/>
				</svg>
			</button>

			<button
				on:click={() => {
					navigator.clipboard.writeText(JSON.stringify(value));
				}}
				title="Copy to clipboard"
			>
				<svg viewBox="0 0 24 24" aria-label="Copy to clipboard">
					<path
						fill="currentColor"
						d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"
					/>
				</svg>
			</button>

			<button on:click={() => (bounds = fit(value, active_tracks))} title="Fit to window">
				<svg viewBox="0 0 24 24" aria-label="Fit to window">
					<path
						fill="currentColor"
						d="M20,2H4C2.89,2 2,2.89 2,4V20C2,21.11 2.89,22 4,22H20C21.11,22 22,21.11 22,20V4C22,2.89 21.11,2 20,2M20,20H4V4H20M13,8V10H11V8H9L12,5L15,8M16,15V13H14V11H16V9L19,12M10,13H8V15L5,12L8,9V11H10M15,16L12,19L9,16H11V14H13V16"
					/>
				</svg>
			</button>
		</div>
	</div>
</div>

<style>
	.keyframe-editor {
		margin: -2px -2px 16px -2px;
		padding: 2px;
	}

	.keyframe-editor:focus-visible {
		outline: none;
	}

	.keyframe-editor:focus-visible::after {
		content: '';
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		border-radius: calc(var(--knobby-internal-border-radius) * 0.25);
		box-shadow: 0 0 0 2px var(--knobby-internal-focus-color);
		z-index: 2;
		pointer-events: none;
	}

	.canvas-container {
		width: 100%;
		height: 200px;
		border-radius: var(
			--knobby-internal-border-radius
		); /* TODO namespace and catalog these values */
		box-shadow: var(--knobby-internal-concave);
		overflow: hidden;
		user-select: none;
		margin: 0 0 8px 0;
	}

	.canvas-container::before {
		content: '';
		position: absolute;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.04);
	}

	canvas {
		width: 100%;
		height: 100%;
		mix-blend-mode: multiply;
	}

	.controls {
		display: flex;
		justify-content: space-between;
	}

	.controls .left {
		display: block;
		/* display: grid;
		grid-template-columns: 1fr 1fr;
		grid-gap: 8px; */
		/* margin-right: 8px; */
	}

	.controls .left input {
		width: 96px;
		height: 32px;
		margin: 0 0 8px 0;
	}

	button {
		width: 32px;
		border-radius: 16px;
		background: var(--knobby-internal-bg);
		box-shadow: var(--knobby-internal-convex);
		border: none;
		border-radius: var(--knobby-internal-border-radius);
		font: inherit;
		padding: 3px;
		margin: 0 0 8px 0;
	}

	button:disabled {
		box-shadow: none;
		opacity: 0.4;
	}

	button:active {
		box-shadow: var(--knobby-internal-concave);
	}

	button svg {
		display: block;
		width: 100%;
		height: 100%;
	}
</style>
