<script>
	/** @type {import('../types').Config} */
	export let config;

	/** @type {string} */
	export let value;
</script>

<label class="knobby-row">
	<span>{config.label}</span>
	<input bind:value>
</label>

<style>
	input {
		width: 100%;
		height: 100%;
	}
</style>
