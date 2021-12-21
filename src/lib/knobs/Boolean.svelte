<script>
	/** @type {import('../types').Config} */
	export let config;

	/** @type {boolean} */
	export let value;
</script>

<div class="knobby-row">
	<label for={config.label}>{config.label}</label>
	<label class="grid">
		<input id={config.label} type="checkbox" bind:checked={value} />
		<span class="checkbox">
			<svg viewBox="0 0 24 24">
				<path
					fill="currentColor"
					d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z"
				/>
			</svg>
		</span>
		<span>{value}</span>
	</label>
</div>

<style>
	.grid {
		display: grid;
		grid-template-columns: 0 32px 1fr;
		align-items: center;
		user-select: none;
	}

	.checkbox {
		position: relative;
		display: inline-block;
		width: calc(32px - 2px);
		height: calc(32px - 2px);
		left: 1px;
		top: 1px;
		border-radius: var(--knobby-internal-border-radius);
		margin: 0 8px 0 0;
		box-shadow: var(--knobby-internal-convex);
	}

	svg {
		position: absolute;
		width: 60%;
		height: 60%;
		left: 20%;
		top: 20%;
		opacity: 0.05;
		color: var(--knobby-internal-flash);
	}

	input:checked + .checkbox {
		box-shadow: inset 1px 1px 4px rgba(0, 0, 0, 0.3), inset -1px -1px 1px rgba(255, 255, 255, 0.4);
		background: hsl(var(--knobby-internal-hue), 50%, 65%);
	}

	input:checked + .checkbox svg {
		opacity: 1;
		color: white;
	}

	.grid span:last-child {
		margin-left: 8px;
	}

	input:checked + .checkbox + span:last-child {
		margin-left: 11px;
	}

	input:focus-visible + .checkbox {
		box-shadow: 0 0 0 2px var(--knobby-internal-focus-color);
	}

	input {
		width: 0;
	}
</style>
