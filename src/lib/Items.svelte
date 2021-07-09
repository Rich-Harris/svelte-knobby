<script>
	import { get_opts } from './utils.js';

	/** @type {Record<string, import('./types').Node>}*/
	export let value;
</script>

<div>
	{#each Object.entries(value) as [name, node]}
		<svelte:component this={node.$component} name={node.$label || name} bind:value={value[name].value} {...get_opts(node)}/>
	{/each}
</div>
