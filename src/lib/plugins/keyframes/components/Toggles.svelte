<script>
	import { palette } from '../ui/colors.js';

	/** @type {string[]} */
	export let active_tracks;

	/** @type {Record<string, import('../types').KeyframeTrack>} */
	export let value;
</script>

<div class="toggles">
	{#each Object.keys(value) as key, i}
		<label>
			<input type="checkbox" bind:group={active_tracks} value={key} />
			<span
				class="checkbox"
				style="--knobby-internal-bg: {value[key].$color || palette[i % palette.length]}"
			/>
			<span>{value[key].$label || key}</span>
		</label>
	{/each}
</div>

<style>
	.toggles {
		user-select: none;
		margin: 0 0 8px 0;
	}

	.checkbox {
		position: relative;
		display: inline-block;
		width: calc(19px);
		height: calc(19px);
		left: 1px;
		top: 1px;
		border-radius: var(--knobby-internal-border-radius);
		margin: 0 6px 0 0;
		box-shadow: var(--knobby-internal-convex);
	}

	label {
		display: inline-flex;
		align-items: center;
		margin: 0 16px 0 0;
	}

	input {
		display: none;
	}

	input:checked + .checkbox {
		box-shadow: inset 2px 2px 8px rgba(0, 0, 0, 0.3), inset -2px -2px 2px rgba(255, 255, 255, 0.4);
		background: var(--knobby-internal-bg);
	}

	input:focus-visible + .checkbox {
		box-shadow: 0 0 0 2px var(--knobby-internal-focus-color);
	}

	input {
		width: 0;
	}
</style>
