<script>
	import { knobby } from '$lib';
	import Thing from './_/Thing.svelte';

	const controls = knobby({
		// labelled control panels are collapsible
		$label: 'Main options',

		// primitive values are handled automatically
		message: 'Hello World!',
		color: '#ff3e00',
		clicks: 0,
		checked: false,

		// functions become buttons. if state is returned, it will
		// update the store
		increment: value => ({
			...value,
			clicks: value.clicks + 1
		}),

		// specify options by using a { value } object
		constrained: {
			// any object can be given a $label which will
			// appear in place of the property name
			$label: 'labelled input',
			value: 50,
			min: 0,
			max: 100,
			step: 1
		},

		// objects that can't be 'interpreted' (see below)
		// are treated as folders
		folder: {
			$label: 'labelled folder',
			a: 1, // accessed as $controls.folder.a
			b: 2,
			nested: {
				c: 3, // accessed as $controls.folder.nested.c
				d: 4
			}
		}
	});

	// the returned store is writable
	$controls.message = 'Hello Knobby!';
</script>

<h1 style="color: {$controls.color}">{$controls.message}</h1>
<button on:click={() => $controls.clicks += 1}>
	clicks: {$controls.clicks}
</button>

<pre>{JSON.stringify($controls.folder)}</pre>

{#if $controls.checked}
	<Thing/>
{/if}