<script>
	// TODO DRY this and Range out?

	import { context } from '../context.js';

	/** @type {string} */
	export let name;

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

<label class="knobby-row">
	<span>{name}</span>
	<input type="number" bind:value {step}>
</label>

<style>
	input {
		width: 100%;
		height: 100%;
	}
</style>
