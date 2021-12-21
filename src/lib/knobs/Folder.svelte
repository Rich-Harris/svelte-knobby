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
			{#if open}
				<path
					fill="currentColor"
					d="M19,20H4C2.89,20 2,19.1 2,18V6C2,4.89 2.89,4 4,4H10L12,6H19A2,2 0 0,1 21,8H21L4,8V18L6.14,10H23.21L20.93,18.5C20.7,19.37 19.92,20 19,20Z"
				/>
			{:else}
				<path
					fill="currentColor"
					d="M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4Z"
				/>
			{/if}
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
	}

	summary svg {
		width: 13px;
		height: 13px;
		opacity: 0.2;
		margin: 0 5px 0 0;
		color: var(--knobby-internal-flash);
		transition: opacity 0.2s;
	}

	summary:hover svg {
		opacity: 1;
	}

	[open] > summary::before {
		transform: rotate(90deg);
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
		border-left: 1px solid var(--knobby-internal-dark);
		border-right: 1px solid var(--knobby-internal-light);
	}

	summary:focus-visible + .folder::before {
		height: 100%;
		top: 0;
	}
</style>
