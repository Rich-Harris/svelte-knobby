<script>
	import { setContext } from 'svelte';
	import Items from './Items.svelte';
	// import Folder from './components/Folder.svelte';
	import { extract, merge } from './utils.js';

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
	<!-- TODO reenable once Vite supports circular dependencies -->
	<!-- {#if $store.$label}
		<Folder name={$store.$label} bind:children={$store.children}/>
	{:else} -->
		<Items bind:children={$store.children}/>
	<!-- {/if} -->
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