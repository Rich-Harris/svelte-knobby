<script>
	import Knob from '../Knob.svelte';

	export let label;
	export let store;
	export let options;

</script>

<Knob {label}>
	<select bind:value={$store}>
		{#each options.options as option}
			<option>{option}</option>
		{/each}
	</select>
</Knob>