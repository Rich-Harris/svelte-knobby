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
		<input type="range" bind:value min={$_min} max={$_max} {step} />
		<input id={config.label} type="number" bind:value min={$_min} max={$_max} {step} />
	</div>
</div>

<style>
	.inputs {
		display: grid;
		grid-template-columns: 1fr 65px;
		grid-gap: var(--knobby-internal-gap);
		height: 100%;
	}

	input[type='range'] {
		-webkit-appearance: none;
		width: 100%;
		background: transparent;
		border: none;
		padding: 0;
		margin: 0;
	}

	input[type='range']::-webkit-slider-thumb {
		-webkit-appearance: none;
	}

	input[type='range']:focus {
		outline: none; /* Removes the blue border. You should probably do some kind of focus styling for accessibility reasons though. */
	}

	/* thumb */
	input[type='range']::-webkit-slider-thumb {
		-webkit-appearance: none;
		height: 16px;
		width: 16px;
		border-radius: 50%;
		background: hsl(var(--knobby-internal-hue), 50%, 65%);
		cursor: pointer;
		margin-top: -6px; /* You need to specify a margin in Chrome, but in Firefox and IE it is automatic */
		box-shadow: var(--knobby-internal-convex), var(--knobby-internal-convex),
			var(--knobby-internal-convex);
	}

	/* Firefox */
	input[type='range']::-moz-range-thumb {
		height: 16px;
		width: 16px;
		border-radius: 50%;
		background: hsl(var(--knobby-internal-hue), 50%, 65%);
		cursor: pointer;
		box-shadow: var(--knobby-internal-convex), var(--knobby-internal-convex),
			var(--knobby-internal-convex);
	}

	input[type='range']:focus-visible::-webkit-slider-thumb {
		box-shadow: 0 0 0 2px var(--knobby-internal-focus-color);
	}

	input[type='range']:focus-visible::-moz-range-thumb {
		box-shadow: 0 0 0 2px var(--knobby-internal-focus-color);
	}

	/* track — chrome */
	input[type='range']::-webkit-slider-runnable-track {
		width: 100%;
		height: 8px;
		cursor: pointer;
		box-shadow: inset 2px 2px 2px var(--knobby-internal-dark),
			inset -2px -2px 2px var(--knobby-internal-light);
		border-radius: var(--knobby-internal-border-radius);
	}

	/* track — duplicated for FF */
	input[type='range']::-moz-range-track {
		width: 100%;
		height: 8px;
		cursor: pointer;
		box-shadow: inset 2px 2px 2px var(--knobby-internal-dark),
			inset -2px -2px 2px var(--knobby-internal-light);
		border-radius: var(--knobby-internal-border-radius);
	}
</style>
