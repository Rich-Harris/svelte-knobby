<script>
	/** @type {string} */
	export let name;

	/** @type {number} */
	export let value;

	/** @type {number} */
	export let step = undefined;
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
