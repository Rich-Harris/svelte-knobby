<script>
	import Knob from '../Knob.svelte';

	export let label;
	export let options;
	export let store;

</script>

<Knob {label}>

	{#each options.options as item, i}
		<label>
			<input id={item} type="radio" bind:group={$store} value={item} />
			{item}
		</label>
	{/each}

</Knob>
