<script>
	import Knob from '../Knob.svelte';

	export let label;
	export let store;

</script>

<Knob {label}>
	<input id={label} type="checkbox" bind:checked={$store} />
</Knob>
