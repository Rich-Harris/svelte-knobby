<script>
	import Knob from '../Knob.svelte';

	export let label;
	export let store;

</script>

<Knob {label}>
	<input type="text" bind:value={$store} />
</Knob>