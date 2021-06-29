<script>
	import { setContext } from 'svelte';
	import Items from './Items.svelte';
	import { extract } from './utils.js';

	export let store;

	setContext('knobby', {
		run: fn => fn(extract($store))
	});
</script>

<Items bind:children={$store.children}/>