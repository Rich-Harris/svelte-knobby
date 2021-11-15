<script>
	// TODO DRY this and Range out?

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
	export let step = get_step(value);

	const { observe } = context();

	const _step = observe(step);
	const _min = observe(min);
	const _max = observe(max);

	const hidden = document.createElement('input');
	hidden.type = 'range';

	/** @param {number} value */
	function get_step(value) {
		const str = String(value);
		if (/e[+-]/.test(str)) return 1;

		if (str.includes('.')) {
			const decimal_places = str.length - (str.indexOf('.') + 1);
			return 1 / Math.pow(10, decimal_places);
		}

		return 1;
	}

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

<label class="knobby-row">
	<span>{config.label}</span>
	<input type="number" bind:value {step} />
</label>

<style>
	input {
		width: 100%;
		height: 100%;
	}
</style>
