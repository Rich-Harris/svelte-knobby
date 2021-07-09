<script>
	import Items from '../Items.svelte';
	import { toggle } from '../actions/toggle.js';

	/** @type {string} */
	export let name;

	/** @type {Record<string, any>} */
	export let value;

	let open = true;
</script>

<details use:toggle={value => (open = value)} open>
	<summary>
		<svg viewBox="0 0 24 24">
			{#if open}
				<path fill="currentColor" d="M19,20H4C2.89,20 2,19.1 2,18V6C2,4.89 2.89,4 4,4H10L12,6H19A2,2 0 0,1 21,8H21L4,8V18L6.14,10H23.21L20.93,18.5C20.7,19.37 19.92,20 19,20Z" />
			{:else}
				<path fill="currentColor" d="M10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6H12L10,4Z" />
			{/if}
		</svg>

		{name}
	</summary>

	<div class="folder">
		<Items bind:value/>
	</div>
</details>

<style>
	details {
		margin-left: -0.3rem;
		padding-left: 0.3rem;
	}

	summary {
		display: flex;
		position: relative;
		font-size: 1em;
		list-style: none;
		user-select: none;
		padding: 0.5rem 0;
		margin: 0 0 0.1rem -0.3rem;
		align-items: center;
	}

	summary svg {
		width: 0.8rem;
		height: 0.8rem;
		opacity: 0.2;
		margin: 0 0.3rem 0 0;
		color: var(--flash);
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
		padding: 0 0 0 0.5rem;
		/* border-left: 1px solid hsla(var(--hue), 11%, 90%, 1); */
	}

	.folder::before {
		content: '';
		position: absolute;
		width: 0;
		height: calc(100% + 0.5rem);
		left: 0rem;
		top: -0.5rem;
		border-left: 1px solid var(--dark);
		border-right: 1px solid var(--light);
	}

	summary:focus-visible + .folder::before {
		height: 100%;
		top: 0;
	}
</style>
