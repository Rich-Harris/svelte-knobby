<script>
	import Knob from '../Knob.svelte';

	export let label;
	export let options;
	export let store;

</script>

<Knob {label}>
	<div class="range">
		<input
			type="range"
			bind:value={$store}
			min={options.min}
			max={options.max}
			step={options.step}
		/>
		<input
			type="number"
			bind:value={$store}
			min={options.min}
			max={options.max}
			step={options.step}
		/>
	</div>
</Knob>

<style>
	.range {
		display: grid;
		grid-template-columns: 1fr 6em;
		grid-gap: 0.5rem;
	}

	input {
		width: 100%;
	}

</style>
