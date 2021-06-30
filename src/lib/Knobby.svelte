<script>
	import Root from './Root.svelte';

	export let stores = [];
</script>

<div class="knobby">
	{#each stores as store}
		<Root {store}/>
	{/each}
</div>

<style>
	.knobby {
		--bg: #f4f4f4;
		--fg: #333;
		--gap: 0.5rem;
		--light: rgba(255, 255, 255, 0.2);
		--dark: rgba(0, 0, 0, 0.05);
		--border-radius: 2px;

		position: fixed;
		z-index: 99999;
		top: 1rem;
		right: 1rem;
		width: 320px;
		max-height: calc(100% - 2rem);
		padding: 0 0.5rem;
		background-color: var(--bg);
		color: var(--fg);
		border-radius: var(--border-radius);
		box-shadow: inset 2px 2px 4px var(--light), inset -2px -2px 4px var(--dark);
		filter: drop-shadow(2px 3px 4px rgba(0, 0, 0, 0.2));
		font-family: ui-monospace, SFMono-Regular, Menlo, "Roboto Mono", monospace;
		font-size: 13px;
		overflow-y: auto;
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
		box-shadow: inset 2px 2px 4px var(--dark), inset -2px -2px 15px var(--light);
		border: 1px solid rgba(0, 0, 0, 0.05);
		padding: 0.2rem 0.4rem;
		font: inherit;
		color: var(--fg);
	}

</style>
