<script>
	import { writable, derived } from 'svelte/store';
	import Items from './Items.svelte';
	import Folder from './knobs/Folder.svelte';
	import { extract, merge } from './utils.js';
	import { init } from './context.js';

	/** @type {import('svelte/store').Writable<any>}*/
	export let store;

	init({
		run: (fn) => fn(extract($store)),
		set: (values) => {
			const merged = merge($store, values);
			store.set(merged);
		},
		observe: (fn) => {
			if (typeof fn !== 'function') {
				return {
					subscribe: writable(fn).subscribe
				};
			}

			return derived(store, ($store) => fn(extract($store)));
		}
	});
</script>

<div class="root">
	{#if $store.$label}
		<Folder config={{ id: $store.$id, label: $store.$label }} bind:value={$store.value} />
	{:else}
		<Items bind:value={$store.value} />
	{/if}
</div>

<style>
	.root {
		padding: 6px 0;
		border-bottom: 1px solid var(--knobby-internal-dark);
	}

	.root:last-child {
		border: none;
	}
</style>
