<script>
	export let knobs = [];

	import { draggable } from './draggable.js'
	import { dragCoords } from './dragcoords.js';

	function dragMove(event) {
		dragCoords.update($dragCoords => ([
			$dragCoords[0] + event.detail.dx,
			$dragCoords[1] + event.detail.dy
		]));
	}

</script>

<div class="knobby" style="transform: translate({$dragCoords[0]}px,{$dragCoords[1]}px)">
	<button class="knobby-button move-button" use:draggable on:dragmove={dragMove}>Drag to move</button>
	{#each knobs as { component, ...knob }}
		<svelte:component this={component} {...knob} />
	{/each}
</div>

<style>

	.knobby {
		--bg: #f4f4f4;
		--fg: #333;
		--light: rgba(255, 255, 255, 0.2);
		--dark: rgba(0, 0, 0, 0.05);
		--border-radius: 2px;
		position: fixed;
		z-index: 99999;
		top: 1rem;
		right: 1rem;
		width: 320px;
		padding: 0 0.5rem;
		background-color: var(--bg);
		color: var(--fg);
		border-radius: var(--border-radius);
		box-shadow: inset 2px 2px 4px var(--light), inset -2px -2px 4px var(--dark);
		filter: drop-shadow(2px 3px 4px rgba(0, 0, 0, 0.2));
		font-family: Menlo;
		font-size: 13px;
	}

	.knobby :global(input[type='number']) {
		margin: 0;
		box-sizing: border-box;
		border-radius: var(--border-radius);
		background: var(--bg);
		box-shadow: inset 2px 2px 4px var(--dark), inset -2px -2px 15px var(--light);
		border: 1px solid rgba(0, 0, 0, 0.05);
		padding: 0.2rem 0.4rem;
		font: inherit;
		color: var(--fg);
	}

	:global(.knobby-button) {
		width: calc(100% - 0.5rem);
		border-radius: 16px;
		background: var(--bg);
		box-shadow: 5px 5px 5px var(--dark), -5px -5px 5px var(--light);
		border: 1px solid var(--dark);
		border-radius: var(--border-radius);
		font: inherit;
		margin: 0.5rem 0 0.5rem 0.5rem;
		padding: 0.25rem 0.5rem;
	}

	:global(.knobby-button:active) {
		box-shadow: inset 2px 2px 2px var(--dark), inset -2px -2px 2px var(--light);
	}

	.move-button {
		cursor: move;
		display: block;
		width: calc(100% - 1rem);
	}

</style>
