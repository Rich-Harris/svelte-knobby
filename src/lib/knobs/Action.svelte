<script>
	import Knob from '../Knob.svelte';

	export let label;
	export let action;

</script>

<button class="knobby-button" on:click={action}>{label}</button>

