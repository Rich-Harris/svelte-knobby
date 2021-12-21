<script>
	import { context } from '../context.js';

	/** @type {import('../types').Config} */
	export let config;

	/** @type {(values?: any) => any} */
	export let value;

	const { run, set } = context();
</script>

<button
	on:click={() => {
		const new_value = run(value);
		if (new_value) set(new_value);
	}}>{config.label}</button
>

<style>
	button {
		width: 100%;
		border-radius: 16px;
		background: var(--knobby-internal-bg);
		box-shadow: var(--knobby-internal-convex);
		border: none;
		border-radius: var(--knobby-internal-border-radius);
		font: inherit;
		margin: 2px 0 2px 0;
		padding: 8px 8px;
	}

	button:active {
		box-shadow: var(--knobby-internal-concave);
	}
</style>
