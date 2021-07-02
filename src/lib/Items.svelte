<script>
	import { get_opts } from './utils.js';

	export let value;
</script>

<div>
	{#each Object.entries(value) as [name, state]}
		<svelte:component this={state.component} name={state.$label || name} bind:value={value[name].value} {...get_opts(state)}/>
	{/each}
</div>
