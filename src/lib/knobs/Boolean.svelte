<script>
	export let value;
</script>

<label>
	<input type=checkbox bind:checked={value}>
	<span class="checkbox">
		<!-- <svg viewBox="0 0 24 24">
			<path fill="currentColor" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
		</svg> -->

		<svg viewBox="0 0 24 24">
			<path fill="currentColor" d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z" />
		</svg>
	</span>
	<span>{value}</span>
</label>

<style>
	label {
		display: grid;
		grid-template-columns: 0 2rem 1fr;
		align-items: center;
		user-select: none;
	}

	.checkbox {
		position: relative;
		display: inline-block;
		width: calc(2rem - 2px);
		height: calc(2rem - 2px);
		left: 1px;
		top: 1px;
		border-radius: var(--border-radius);
		margin: 0 0.5rem 0 0;
		box-shadow: var(--convex);
	}

	svg {
		position: absolute;
		width: 60%;
		height: 60%;
		left: 20%;
		top: 20%;
		opacity: 0.05;
		color: var(--flash);
	}

	input:checked + .checkbox {
		box-shadow: var(--concave);
	}

	input:checked + .checkbox svg {
		opacity: 0.8;
	}

	span:last-child {
		margin-left: 0.5rem;
	}

	input {
		/* margin: 0 0.5em 0 0; */
		width: 0;
	}
</style>