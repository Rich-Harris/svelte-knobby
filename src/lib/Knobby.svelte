<script>
	import Root from './Root.svelte';
	import Chevron from './components/Chevron.svelte';
	import { slide } from 'svelte/transition';

	export let stores = [];

	/** @type {HTMLElement} */
	let knobby;

	let top = 16;
	let right = 16;
	let bottom = null;
	let left = null;
	let transform = 'translate(0, 0)';

	let visible = true;

	$: vertical = (top === null ? `bottom: ${bottom}px` : `top: ${top}px`);
	$: horizontal = (left === null ? `right: ${right}px` : `left: ${left}px`);

	function clamp(n, a, b) {
		return Math.max(a, Math.min(b, n));
	}

	function drag(e) {
		if (!e.isPrimary) return;

		const { clientX: x, clientY: y, pointerId } = e;
		const bcr = knobby.getBoundingClientRect();

		const range = {
			left: -bcr.left,
			right: window.innerWidth - bcr.right,
			bottom: window.innerHeight - bcr.bottom,
			top: -bcr.top
		};

		function move(e) {
			if (e.pointerId !== pointerId) return;

			const dx = Math.round(clamp(e.clientX - x, range.left, range.right));
			const dy = Math.round(clamp(e.clientY - y, range.top, range.bottom));

			transform = `translate(${dx}px, ${dy}px)`;
		}

		function up(e) {
			if (e.pointerId !== pointerId) return;

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

			transform = 'translate(0, 0)';

			window.removeEventListener('pointermove', move);
			window.removeEventListener('pointerup', up);
			window.removeEventListener('pointercancel', up);
		}

		window.addEventListener('pointermove', move);
		window.addEventListener('pointerup', up);
		window.addEventListener('pointercancel', up);
	}
</script>

<div bind:this={knobby} class="knobby" style="{vertical}; {horizontal}; transform: {transform}">
	<div class="title-bar">
		<button on:click={() => visible = !visible}>
			<Chevron open={visible}/>
		</button>

		<div class="drag-bar" on:pointerdown={drag}>
			<svg role="img" aria-label="drag handle" viewBox="0 0 24 24">
				<path fill="currentColor" d="M3,15V13H5V15H3M3,11V9H5V11H3M7,15V13H9V15H7M7,11V9H9V11H7M11,15V13H13V15H11M11,11V9H13V11H11M15,15V13H17V15H15M15,11V9H17V11H15M19,15V13H21V15H19M19,11V9H21V11H19Z" />
			</svg>
		</div>
	</div>

	{#if visible}
		<div class="content" transition:slide={{duration:200}}>
			{#each stores as store}
				<Root {store}/>
			{/each}
		</div>
	{/if}
</div>

<style>
	.knobby {
		--hue: 240;
		--bg: hsl(var(--hue), 11%, 95%);
		--fg: hsla(var(--hue), 11%, 40%, 1);
		--gap: 0.5rem;
		--light: rgba(255, 255, 255, 1);
		--dark: hsla(var(--hue), 11%, 88%, 1);
		--border-radius: 0.4rem;

		position: fixed;
		z-index: 99999;
		width: 320px;
		max-height: calc(100% - 2rem);
		background-color: var(--bg);
		color: var(--fg);
		border-radius: var(--border-radius);
		box-shadow: inset 2px 2px 4px var(--light), inset -2px -2px 4px var(--dark);
		filter: drop-shadow(4px 5px 3px rgba(0, 0, 0, 0.1));
		font-family: ui-monospace, SFMono-Regular, Menlo, "Roboto Mono", monospace;
		font-size: 13px;
		overflow-y: auto;
	}

	svg {
		position: absolute;
		width: 100%;
		height: 100%;
	}

	.title-bar {
		--size: 1.8rem;
		display: grid;
		grid-template-columns: var(--size) 1fr var(--size);
		grid-gap: 0.5rem;
		user-select: none;
		height: var(--size);
		align-items: center;
		padding: 0rem 0.4rem;
	}
	.title-bar button {
		width: 100%;
		height: 100%;
		font-size: var(--size);
		padding: 0;
		margin: 0;
		border: none;
		background: none;
		opacity: 0.2;
		transition: opacity 0.2s;
	}

	.title-bar button:hover {
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
		padding: 0 0.8rem;
	}

	.knobby :global(*) {
		position: relative;
		box-sizing: border-box;
	}

	.knobby :global(input),
	.knobby :global(button) {
		font: inherit;
	}

	.knobby :global(input:not([type])),
	.knobby :global(input[type="text"]),
	.knobby :global(input[type="number"]) {
		width: 100%;
		height: 100%;
		margin: 0;
		border-radius: var(--border-radius);
		background: var(--bg);
		box-shadow: inset 2px 2px 8px var(--dark), inset -2px -2px 15px var(--light);
		/* border: 1px solid rgba(0, 0, 0, 0.05); */
		border: none;
		padding: 0.2rem 0.4rem;
		font: inherit;
		color: hsla(var(--hue), 11%, 20%, 1);
	}

</style>
