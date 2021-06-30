<script>
	export let value;
</script>

<div>
	<input type=checkbox bind:checked={value}>
	<span>{value}</span>
</div>

<style>
	div {
		display: flex;
		align-items: center;
	}

	input {
		margin: 0 0.5em 0 0;
	}
</style>