<script>
	export let value;
	export let min = undefined;
	export let max = undefined;
	export let step = undefined;
</script>

<div>
	<input type="range" bind:value {min} {max} {step}>
	<input type="number" bind:value {min} {max} {step}>
</div>

<style>
	div {
		display: grid;
		grid-template-columns: 1fr 4em;
		grid-gap: var(--gap);
	}

	input[type=range] {
		width: 100%;
	}
</style>