<script>
	/** @type {string} */
	export let label;

</script>

<div class="knob">
	<label for={label}>{label}</label>
	<div>
		<slot />
	</div>
</div>

<style>
	.knob {
		position: relative;
		display: grid;
		grid-template-columns: 80px 1fr;
		grid-gap: 0.5rem;
		align-items: center;
		margin: 0.5rem 0 0.5rem 0;
		padding-left: 0.5rem;
	}

	:global(.knob) + .knob {
		padding-top: 0.5rem;
	}

	:global(.knob) + .knob::after {
		content: '';
		position: absolute;
		width: 100%;
		height: 0;
		top: -1px;
		border-top: 1px solid var(--dark);
		border-bottom: 1px solid var(--light);
	}

</style>
