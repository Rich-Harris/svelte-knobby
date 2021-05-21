<script>
	import Knob from '../Knob.svelte';

	export let label;
	export let store;

</script>

<Knob {label}>
	<input type="color" bind:value={$store} />
</Knob>

<style>
	input {
		width: 100%;
		box-sizing: border-box;
		border: 1px solid var(--dark);
		height: 1.5rem;
		padding: 0;
		margin: 0;
	}
</style>
