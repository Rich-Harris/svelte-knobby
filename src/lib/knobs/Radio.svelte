<script>
	import Knob from '../Knob.svelte';

	export let label;
	export let options;
	export let store;

</script>

<Knob {label}>

	{#each options.options as option}
		<label>
			<input id={option} type="radio" bind:group={$store} value={option} />
			{option}
		</label>
	{/each}

</Knob>
