<script>
	/** @type {boolean} */
	export let open;
</script>

<svg role="img" class:open viewBox="0 0 24 24">
	<path fill="currentColor" d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
</svg>

<style>
	svg {
		position: relative;
		display: block;
		width: 1em;
		height: 1em;
		transition: transform 0.2s;
	}

	.open {
		transform: rotate(90deg);
	}
</style>