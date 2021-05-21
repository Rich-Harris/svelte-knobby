<script>
	import X from './_/X.svelte';
	import Y from './_/Y.svelte';
	import * as knobby from '$lib';

	knobby.group('x');
	const show_x = knobby.checkbox('show', true);

	knobby.group('y');
	const show_y = knobby.checkbox('show', false);

	knobby.ungroup();
	const text = knobby.text('message', 'Hello world!');
	knobby.action('say hello', () => alert($text));

</script>

<h1>{$text}</h1>

{#if $show_x}
	<X/>
{/if}

{#if $show_y}
	<Y/>
{/if}