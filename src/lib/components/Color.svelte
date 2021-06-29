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
		grid-template-columns: 3em 1fr;
		grid-gap: var(--gap);
	}

	input {
		width: 100%;
	}

	input[type=color] {
		height: 100%;
		border: none;
		padding: 0;
		margin: 0;
		background: none;
	}

	::-webkit-color-swatch,
	::-moz-color-swatch {
	border-color: transparent;
	}
</style>