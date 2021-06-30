<script>
	export let open;
</script>

<svg class:open viewBox="0 0 24 24">
	<path fill="currentColor" d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
</svg>

<style>
	svg {
		position: absolute;
		display: block;
		width: 100%;
		height: 100%;
		transition: transform 0.2s;
	}

	.open {
		transform: rotate(90deg);
	}
</style>