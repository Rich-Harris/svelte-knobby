<script>
	import { colors } from '../utils/colors.js';

	/** @type {string[]} */
	export let selected_tracks;

	/** @type {Record<string, import('../types').KeyframeTrack>} */
	export let value;
</script>

<div class="toggles">
	{#each Object.keys(value) as key, i}
		<label>
			<input type=checkbox bind:group={selected_tracks} value={key}>
			<span class="checkbox" style="--bg: {value[key].$color || colors[i % colors.length]}"></span>
			<span>{value[key].$label || key}</span>
		</label>
	{/each}
</div>


<style>
	.toggles {
		user-select: none;
		margin: 0 0 0.5rem 0;
	}

	.checkbox {
		position: relative;
		display: inline-block;
		width: calc(1.2rem);
		height: calc(1.2rem);
		left: 1px;
		top: 1px;
		border-radius: var(--border-radius);
		margin: 0 0.4rem 0 0;
		box-shadow: var(--convex);
	}

	label {
		display: inline-flex;
		align-items: center;
		margin: 0 1rem 0 0;
	}

	input {
		display: none;
	}

	input:checked + .checkbox {
		box-shadow: inset 2px 2px 8px rgba(0,0,0,0.3), inset -2px -2px 2px rgba(255,255,255,0.4);
		background: var(--bg);
	}

	input:focus-visible + .checkbox {
		box-shadow: 0 0 0 2px var(--focus-color);
	}

	input {
		/* margin: 0 0.5em 0 0; */
		width: 0;
	}
</style>
