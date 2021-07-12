<script>
	import { context } from '../context.js';

	/** @type {string} */
	export let name;

	/** @type {(values?: any) => any} */
	export let value;

	const { run, set } = context();
</script>

<button on:click={() => {
	const new_value = run(value);
	if (new_value) set(new_value);
}}>{name}</button>

<style>
	button {
		width: 100%;
		border-radius: 16px;
		background: var(--bg);
		box-shadow: var(--convex);
		border: none;
		border-radius: var(--border-radius);
		font: inherit;
		margin: 0.5rem 0 0.5rem 0;
		padding: 0.5rem 0.5rem;
	}

	button:active {
		box-shadow: var(--concave);
	}
</style>
