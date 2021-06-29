<script>
	export let value;
</script>

<div class="color">
<input type="color" bind:value>
<input bind:value>
</div>

<style>
	.color {
		display: grid;
		grid-template-columns: 4em 1fr;
		grid-gap: 0.5em;
	}

	input {
		width: 100%;
	}
</style>