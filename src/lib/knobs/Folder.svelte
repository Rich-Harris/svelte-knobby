<script>
	import Items from '../Items.svelte';
	import { toggle } from '../actions/toggle.js';
	import * as storage from '../storage.js';

	/** @type {import('../types').Config} */
	export let config;

	/** @type {Record<string, any>} */
	export let value;

	const key = config.id && `open:${config.id}`;

	let open = key ? storage.get(key, true) : true;
	$: if (key) storage.set(key, open);
</script>

<details {open} use:toggle={(value) => (open = value)}>
	<summary>
		<svg viewBox="0 0 24 24">
			<path
				fill="currentColor"
				stroke="currentColor"
				style="stroke-linejoin: round; stroke-width: 3;"
				d="M5,8L19,8L12,15Z"
			/>
		</svg>

		{config.label}
	</summary>

	<div class="folder">
		<Items bind:value />
	</div>
</details>

<style>
	details {
		margin-left: -5px;
		padding-left: 5px;
	}

	summary {
		display: flex;
		position: relative;
		font-size: 13px;
		list-style: none;
		user-select: none;
		padding: 8px 0;
		margin: 0 0 2px -5px;
		align-items: center;
		font-weight: bold;
	}

	summary svg {
		width: 13px;
		height: 13px;
		opacity: 0.2;
		margin: 0 5px 0 0;
		transition: opacity 0.2s, transform 0.1s;
		transform: rotate(-90deg);
	}

	summary:hover svg {
		opacity: 1;
	}

	[open] > summary svg {
		transform: rotate(0);
	}

	.folder {
		position: relative;
		margin: 0;
		padding: 0 0 0 8px;
		/* border-left: 1px solid hsla(var(--knobby-internal-hue), 11%, 90%, 1); */
	}

	.folder::before {
		content: '';
		position: absolute;
		width: 0;
		height: calc(100% + 8px);
		left: 0;
		top: -8px;
	}

	summary:focus-visible + .folder::before {
		height: 100%;
		top: 0;
	}
</style>
