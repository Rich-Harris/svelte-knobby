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
		grid-template-columns: 1fr 5em;
		grid-gap: var(--gap);
	}

	input[type=range] {
		-webkit-appearance: none;
		width: 100%;
		background: transparent;
	}

	input[type=range]::-webkit-slider-thumb {
		-webkit-appearance: none;
	}

	input[type=range]:focus {
		outline: none; /* Removes the blue border. You should probably do some kind of focus styling for accessibility reasons though. */
	}

	/* thumb */
	input[type=range]::-webkit-slider-thumb {
		-webkit-appearance: none;
		height: 1rem;
		width: 1rem;
		border-radius: 50%;
		background: hsla(var(--hue), 11%, 35%, 1);
		cursor: pointer;
		margin-top: -0.35rem; /* You need to specify a margin in Chrome, but in Firefox and IE it is automatic */
		box-shadow: var(--convex), var(--convex), var(--convex);
	}

	/* Firefox */
	input[type=range]::-moz-range-thumb {
		height: 1rem;
		width: 1rem;
		border-radius: 50%;
		background: hsla(var(--hue), 11%, 35%, 1);
		cursor: pointer;
		box-shadow: var(--convex), var(--convex), var(--convex);
	}

	/* track — chrome */
	input[type=range]::-webkit-slider-runnable-track {
		width: 100%;
		height: 0.5rem;
		cursor: pointer;
		box-shadow: inset 2px 2px 2px var(--dark), inset -2px -2px 2px var(--light);
		border-radius: var(--border-radius);
	}

	/* track — duplicated for FF */
	input[type=range]::-moz-range-track {
		width: 100%;
		height: 0.5rem;
		cursor: pointer;
		box-shadow: inset 2px 2px 2px var(--dark), inset -2px -2px 2px var(--light);
		border-radius: var(--border-radius);
	}
</style>