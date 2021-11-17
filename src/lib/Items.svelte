<script>
	import { get_opts } from './utils.js';

	/** @type {Record<string, import('./types').Node>}*/
	export let value;
</script>

<div>
	{#each Object.entries(value) as [key, node]}
		<div class="item">
			<svelte:component
				this={node.$component}
				bind:value={value[key].value}
				{...get_opts(node, key)}
			/>
		</div>
	{/each}
</div>

<style>
	.item {
		margin: 0 0 5px 0;
	}
</style>
