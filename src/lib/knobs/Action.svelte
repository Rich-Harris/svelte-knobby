<script>
	import Knob from '../Knob.svelte';

	export let label;
	export let action;

</script>

<button on:click={action}>{label}</button>

<style>
	button {
		width: 100%;
		border-radius: 16px;
		background: var(--bg);
		box-shadow: 5px 5px 5px var(--dark), -5px -5px 5px var(--light);
		border: 1px solid var(--dark);
		border-radius: var(--border-radius);
		font: inherit;
		margin: 0.5rem 0;
		padding: 0.25rem 0.5rem;
	}

	button:active {
		box-shadow: inset 2px 2px 2px var(--dark), inset -2px -2px 2px var(--light);
	}

</style>
