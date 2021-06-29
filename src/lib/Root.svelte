<script>
	import { setContext } from 'svelte';
	import Items from './Items.svelte';
	import { get_opts } from './utils.js';

	export let store;

	setContext('knobby', {
		run: fn => fn(extract($store))
	});
</script>

<svelte:component this={$store.component} bind:value={$store.value} {...get_opts($store)}/>