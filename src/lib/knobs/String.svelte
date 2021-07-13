<script>
	/** @type {string} */
	export let name;

	/** @type {string} */
	export let value;
</script>

<label class="knobby-row">
	<span>{name}</span>
	<input bind:value>
</label>

<style>
	input {
		width: 100%;
		height: 100%;
	}
</style>
