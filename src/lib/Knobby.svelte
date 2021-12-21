<script>
	import Root from './Root.svelte';
	import * as storage from './storage.js';
	import { toggle } from './actions/toggle.js';
	import { drag } from './actions/drag.js';

	/** @type {Array<import('svelte/store').Writable<any>>}*/
	export let stores = [];

	const min_width = 280;

	/** @type {HTMLElement} */
	let knobby;

	let top = storage.get('top', 16);
	let right = storage.get('right', 16);
	let bottom = storage.get('bottom', null);
	let left = storage.get('left', null);
	let width = storage.get('width', 320);
	let expanded = storage.get('expanded', true);

	// we only want the initial value to have any direct effect on the DOM
	const open = expanded;

	let transform = 'translate(0, 0)';

	$: vertical = top === null ? `bottom: ${bottom}px` : `top: ${top}px`;
	$: horizontal = left === null ? `right: ${right}px` : `left: ${left}px`;

	// persist values to localStorage
	$: storage.set('top', top);
	$: storage.set('right', right);
	$: storage.set('bottom', bottom);
	$: storage.set('left', left);
	$: storage.set('width', width);
	$: storage.set('expanded', expanded);

	/**
	 * @param {number} n
	 * @param {number} a
	 * @param {number} b
	 */
	function clamp(n, a, b) {
		return Math.max(a, Math.min(b, n));
	}

	function update_positions() {
		const bcr = knobby.getBoundingClientRect();

		if (bcr.left < window.innerWidth - bcr.right) {
			left = Math.round(bcr.left);
			right = null;
		} else {
			left = null;
			right = Math.round(window.innerWidth - bcr.right);
		}

		if (bcr.top < window.innerHeight - bcr.bottom) {
			top = Math.round(bcr.top);
			bottom = null;
		} else {
			top = null;
			bottom = Math.round(window.innerHeight - bcr.bottom);
		}

		width = Math.round(width);
	}
</script>

<details
	{open}
	bind:this={knobby}
	class="knobby"
	use:toggle={(value) => (expanded = value)}
	style="{vertical}; {horizontal}; --knobby-internal-panel-width: {width}px; --knobby-internal-column-width: {Math.max(
		width - 200,
		160
	)}px; transform: {transform}"
>
	<summary class="title-bar">
		<span class:open={expanded}>
			<svg role="img" viewBox="0 0 24 24">
				<path
					fill="currentColor"
					stroke="currentColor"
					style="stroke-linejoin: round; stroke-width: 3;"
					d="M5,8L19,8L12,15Z"
				/>
			</svg>
		</span>

		<div
			class="drag-bar"
			on:click={(e) => (e.stopPropagation(), e.preventDefault())}
			use:drag={{
				start: (drag) => {
					const bcr = knobby.getBoundingClientRect();
					drag.context.bounds = {
						left: -bcr.left,
						right: window.innerWidth - bcr.right,
						bottom: window.innerHeight - bcr.bottom,
						top: -bcr.top
					};
				},
				move: (drag) => {
					const x = Math.round(clamp(drag.x, drag.context.bounds.left, drag.context.bounds.right));
					const y = Math.round(clamp(drag.y, drag.context.bounds.top, drag.context.bounds.bottom));

					transform = `translate(${x}px, ${y}px)`;
				},
				end: (drag) => {
					update_positions();
					transform = 'translate(0, 0)';
				}
			}}
		>
			<svg role="img" aria-label="drag handle" viewBox="0 0 24 24">
				<path
					fill="currentColor"
					d="M3,15V13H5V15H3M3,11V9H5V11H3M7,15V13H9V15H7M7,11V9H9V11H7M11,15V13H13V15H11M11,11V9H13V11H11M15,15V13H17V15H15M15,11V9H17V11H15M19,15V13H21V15H19M19,11V9H21V11H19Z"
				/>
			</svg>
		</div>
	</summary>

	<div class="content">
		{#each stores as store}
			<Root {store} />
		{/each}
	</div>

	<div
		class="drag-handle left"
		use:drag={{
			start: (drag) => {
				const bcr = knobby.getBoundingClientRect();

				drag.context.bounds = {
					left: -bcr.left,
					right: bcr.width - min_width
				};

				drag.context.initial = { left, width };
			},
			move: (drag) => {
				const dx = clamp(drag.x, drag.context.bounds.left, drag.context.bounds.right);

				width = drag.context.initial.width - dx;
				if (left !== null) left = drag.context.initial.left + dx;
			},
			end: (drag) => {
				update_positions();
			}
		}}
	/>

	<div
		class="drag-handle right"
		use:drag={{
			start: (drag) => {
				const bcr = knobby.getBoundingClientRect();

				drag.context.bounds = {
					left: -(bcr.width - min_width),
					right: window.innerWidth - bcr.right
				};

				drag.context.initial = { right, width };
			},
			move: (drag) => {
				const dx = clamp(drag.x, drag.context.bounds.left, drag.context.bounds.right);

				width = drag.context.initial.width + dx;
				if (right !== null) right = drag.context.initial.right - dx;
			},
			end: (drag) => {
				update_positions();
			}
		}}
	/>
</details>

<style>
	.knobby {
		/* public properties */
		--knobby-internal-hue: var(--knobby-hue, 240);

		/* colors */
		--knobby-internal-hue: 240;
		--knobby-internal-bg: hsl(var(--knobby-internal-hue), 11%, 95%);
		--knobby-internal-fg: hsla(var(--knobby-internal-hue), 11%, 40%, 1);
		--knobby-internal-light: rgba(255, 255, 255, 1);
		--knobby-internal-dark: hsla(var(--knobby-internal-hue), 11%, 88%, 1);
		--knobby-internal-flash: hsla(var(--knobby-internal-hue), 50%, 40%, 1);
		--knobby-internal-focus-color: hsla(var(--knobby-internal-hue), 11%, 40%);

		/* dimensions */
		--knobby-internal-border-radius: 4px;
		--knobby-internal-gap: 8px;

		/* utilities */
		--knobby-internal-convex: 1px 1px 4px var(--knobby-internal-dark),
			-2px -2px 4px var(--knobby-internal-light);
		--knobby-internal-concave: inset 1px 1px 4px var(--knobby-internal-dark),
			inset -1px -1px 8px var(--knobby-internal-light);

		position: fixed;
		display: flex;
		flex-direction: column;
		z-index: 99999;
		width: var(--knobby-internal-panel-width);
		max-width: calc(100% - 32px);
		max-height: calc(100% - 32px);
		background-color: var(--knobby-internal-bg);
		color: var(--knobby-internal-fg);
		border-radius: var(--knobby-internal-border-radius);
		box-shadow: inset 2px 2px 4px var(--knobby-internal-light),
			inset -2px -2px 4px var(--knobby-internal-dark);
		filter: drop-shadow(1px 2px 2px rgba(0, 0, 0, 0.03));
		font-family: ui-monospace, SFMono-Regular, Menlo, 'Roboto Mono', monospace;
		font-size: 13px;
		transition: filter 0.2s;
	}

	summary span {
		display: block;
		width: 16px;
		height: 16px;
		transform: rotate(-90deg);
		transition: transform 0.2s;
	}

	summary span.open {
		transform: rotate(0deg);
	}

	svg {
		position: absolute;
		width: 100%;
		height: 100%;
	}

	.title-bar {
		--size: 28px;
		display: grid;
		grid-template-columns: var(--size) 1fr var(--size);
		grid-gap: 8px;
		user-select: none;
		height: var(--size);
		align-items: center;
		padding: 0 6px;
		color: var(--knobby-internal-flash);
	}

	.title-bar svg {
		transition: opacity 0.2s;
		opacity: 0.2;
	}

	.title-bar > :hover svg {
		opacity: 1;
	}

	.drag-bar {
		width: 100%;
		height: 100%;
	}

	.drag-bar svg {
		opacity: 0.2;
		transition: opacity 0.2s;
	}

	.drag-bar:hover svg {
		opacity: 1;
	}

	.content {
		padding: 0 20px;
		max-height: calc(100vh - 61px);
		overflow-y: auto;
		overflow-x: hidden;
	}

	.drag-handle {
		position: absolute;
		width: 6px;
		height: 100%;
		top: 0;
		cursor: ew-resize;
		user-select: none;
	}

	.drag-handle.left {
		left: -3px;
	}

	.drag-handle.right {
		right: -3px;
	}

	.knobby :global(*) {
		position: relative;
		box-sizing: border-box;
	}

	.knobby :global(input),
	.knobby :global(button) {
		font: inherit;
		color: inherit;
	}

	.knobby :global(input:not([type])),
	.knobby :global(input[type='text']),
	.knobby :global(input[type='number']) {
		margin: 0;
		border-radius: var(--knobby-internal-border-radius);
		background: var(--knobby-internal-bg);
		box-shadow: var(--knobby-internal-concave);
		border: none;
		padding: 3px 8px;
		font: inherit;
		color: hsla(var(--knobby-internal-hue), 11%, 20%, 1);
	}

	.knobby :global(:focus-visible) {
		outline-color: var(--knobby-internal-focus-color);
	}

	.knobby :global(.knobby-row) {
		display: grid;
		grid-template-columns: 1fr var(--knobby-internal-column-width);
		grid-gap: var(--knobby-internal-gap);
		align-items: center;
		min-height: 32px;
		margin: 0 0 5px 0;
	}

	.knobby :global(.knobby-row:last-child) {
		margin: 0;
	}

	.knobby :global(.knobby-row > :first-child) {
		overflow-x: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		user-select: none;
	}

	.knobby :global(.knobby-row:focus-within > :first-child) {
		font-weight: bold;
	}
</style>
