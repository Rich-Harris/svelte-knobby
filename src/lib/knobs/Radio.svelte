<script>
	import Knob from '../Knob.svelte';

	export let label;
	export let options;
	export let store;

</script>

<Knob {label}>

	{#each options.radioOptions as item, i}
		<label>
			<input id={item} type="radio" name={label} bind:group={$store} value={item} />
			{item}
		</label>
	{/each}

</Knob>
