<script>
	import X from './_/X.svelte';
	import Y from './_/Y.svelte';
	import { knobby } from '$lib';

	const knobs = knobby({
		text: 'Hello world!',
		show_x: true,
		show_y: false,
		alert: value => alert(value.text)
	});
</script>

<h1>{$knobs.text}</h1>

{#if $knobs.show_x}
	<X/>
{/if}

{#if $knobs.show_y}
	<Y/>
{/if}