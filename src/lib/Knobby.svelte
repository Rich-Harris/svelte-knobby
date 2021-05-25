<script>
	export let knobs = [];

</script>

<div class="knobby">
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

</style>
