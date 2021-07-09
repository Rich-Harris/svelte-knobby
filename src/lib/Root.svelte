<script>
	import { setContext } from 'svelte';
	import Items from './Items.svelte';
	import Folder from './knobs/Folder.svelte';
	import { extract, merge } from './utils.js';

	/** @type {import('svelte/store').Writable<any>}*/
	export let store;

	setContext('knobby', {
		run: fn => fn(extract($store)),
		set: values => {
			const merged = merge($store, values);
			store.set(merged);
		}
	});
</script>

<div class="root">
	{#if $store.$label}
		<Folder name={$store.$label} bind:value={$store.value}/>
	{:else}
		<Items bind:value={$store.value}/>
	{/if}
</div>

<style>
	.root {
		padding: 0.5em 0;
		border-bottom: 1px solid var(--dark);
	}

	.root:last-child {
		border: none;
	}
</style>