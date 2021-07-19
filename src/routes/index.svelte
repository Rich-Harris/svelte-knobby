<script>
	import * as knobby from '$lib';
	import { keyframes } from '$lib/plugins/keyframes';
	import Thing from './_/Thing.svelte';

	const controls = knobby.panel({
		// labelled control panels are collapsible
		$label: 'Main options',

		// primitive values are handled automatically
		color: '#ff3e00',
		clicks: 0,
		checked: false,

		// functions become buttons. if state is returned, it will
		// update the store
		increment: value => ({
			...value,
			clicks: value.clicks + 1
		}),

		reset: value => ({
			...value,
			clicks: 0
		}),

		one: keyframes({
			playhead: values => values.constrained,
			value: {
				cx: {
					points: [
						[0, 0],
						[50, 20],
						[75, 90],
						[100, 50]
					],
					curves: [
						[0.33, 0.33, 0.67, 0.8],
						[0.33, 0.1, 0.67, 1],
						[0.33, 0, 0.67, 1]
					]
				},
				cy: {
					$label: 'cy (custom label)',
					$color: '#3eff00',
					points: [
						[0, 20],
						[50, 30],
						[60, 40],
						[100, 10]
					],
					curves: [
						[0.33, 0.33, 0.67, 0.8],
						[0.33, 0.1, 0.67, 1],
						[0.33, 0, 0.67, 1]
					]
				}
			}
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
	// $controls.message = 'Hello Knobby!';

	let visible = true;
	$: knobby.toggle(visible);
</script>

<label>
	<input type=checkbox bind:checked={visible}>
	visible
</label>

<pre>{JSON.stringify($controls.one, null, '  ')}</pre>

{#if $controls.checked}
	<Thing/>
{/if}
