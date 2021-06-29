<script>
	import { knobby } from '$lib';

	const values = knobby({
		// primitive values are handled automatically
		message: 'Hello World!',
		checked: false,
		color: '#ff3e00',
		clicks: 0,

		// functions become buttons. if state is returned, it will
		// update the store
		increment: value => ({
			...value,
			clicks: value.clicks + 1
		}),

		// specify options by using a { value } object
		constrained: {
			value: 50,
			min: 0,
			max: 100,
			step: 1
		},

		// objects that can't be 'interpreted' (see below)
		// are treated as folders
		group: {
			a: 1, // accessed as $values.group.a
			b: 2,
			nested: {
				c: 3, // accessed as $values.group.nested.c
				d: 4
			}
		}
	});

	// the returned store is writable
	$values.message = 'Hello Knobby!';
</script>

<h1>{$values.message}</h1>
<button on:click={() => $values.clicks += 1}>
	clicks: {$values.clicks}
</button>