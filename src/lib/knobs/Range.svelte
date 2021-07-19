<script>
	import { context } from '../context.js';

	/** @type {import('../types').Config} */
	export let config;

	/** @type {number} */
	export let value;

	/** @type {number} */
	export let min = undefined;

	/** @type {number} */
	export let max = undefined;

	/** @type {number} */
	export let step = undefined;

	const { observe } = context();

	const _step = observe(step);
	const _min = observe(min);
	const _max = observe(max);

	const hidden = document.createElement('input');
	hidden.type = 'range';

	$: {
		// turns out it's way easier to do this than actually
		// calculate the new constrained value, given
		// floating point errors etc
		hidden.min = $_min;
		hidden.max = $_max;
		hidden.step = $_step;
		hidden.valueAsNumber = value;

		value = hidden.valueAsNumber;
	}
</script>

<div class="knobby-row">
	<label for={config.label}>{config.label}</label>
	<div class="inputs">
		<input type="range" bind:value min={$_min} max={$_max} {step}>
		<input id={config.label} type="number" bind:value min={$_min} max={$_max} {step}>
	</div>
</div>

<style>
	.inputs {
		display: grid;
		grid-template-columns: 1fr 5em;
		grid-gap: var(--gap);
		height: 100%;
	}

	input[type=range] {
		-webkit-appearance: none;
		width: 100%;
		background: transparent;
		border: none;
		padding: 0;
		margin: 0;
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
		background: hsl(var(--hue), 50%, 65%);
		cursor: pointer;
		margin-top: -0.35rem; /* You need to specify a margin in Chrome, but in Firefox and IE it is automatic */
		box-shadow: var(--convex), var(--convex), var(--convex);
	}

	/* Firefox */
	input[type=range]::-moz-range-thumb {
		height: 1rem;
		width: 1rem;
		border-radius: 50%;
		background: hsl(var(--hue), 50%, 65%);
		cursor: pointer;
		box-shadow: var(--convex), var(--convex), var(--convex);
	}

	input[type=range]:focus-visible::-webkit-slider-thumb {
		box-shadow: 0 0 0 2px var(--focus-color);
	}

	input[type=range]:focus-visible::-moz-range-thumb {
		box-shadow: 0 0 0 2px var(--focus-color);
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
