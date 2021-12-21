<script>
	/** @type {import('../types').Config} */
	export let config;

	/** @type {string} */
	export let value;
</script>

<div class="knobby-row">
	<label for={config.label}>{config.label}</label>
	<div class="color">
		<div class="picker">
			<input id={config.label} type="color" bind:value />
			<span style="background-color: {value}" />
		</div>
		<input bind:value />
	</div>
</div>

<style>
	.color {
		display: grid;
		grid-template-columns: 32px 1fr;
		grid-gap: 4px;
		height: 100%;
	}

	input {
		width: 100%;
		height: 100%;
	}

	.picker {
		width: 100%;
		height: 100%;
		border-radius: var(--knobby-internal-border-radius);
		box-shadow: var(--knobby-internal-convex);
		padding: 2px;
	}

	.picker span {
		display: block;
		width: 100%;
		height: 100%;
		border-radius: var(--knobby-internal-border-radius);
		pointer-events: none;
		box-shadow: inset 2px 2px 3px rgba(0, 0, 0, 0.1), inset -2px -2px 3px rgba(255, 255, 255, 0.05);
	}

	input[type='color'] {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		border: none;
		padding: 0;
		margin: 0;
		background: none;
		opacity: 0.01;
	}

	input[type='color']:focus-visible + span {
		box-shadow: 0 0 0 2px var(--knobby-internal-focus-color);
	}
</style>
