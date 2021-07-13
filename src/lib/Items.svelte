<script>
	import { get_opts } from './utils.js';

	/** @type {Record<string, import('./types').Node>}*/
	export let value;
</script>

<div>
	{#each Object.entries(value) as [name, node]}
		<div class="item">
			<svelte:component this={node.$component} name={node.$label || name} bind:value={value[name].value} {...get_opts(node)}/>
		</div>
	{/each}
</div>

<style>
	.item {
		margin: 0 0 0.3rem 0;
	}
</style>
