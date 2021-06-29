<script>
	import { knobby } from '$lib';

	const opts = knobby({
		a: {
			value: 1,
			min: 0,
			max: 5
		},
		b: true,
		bg: '#DCFF7A',
		fg: '#5000C7'
	});
</script>

<div class="x" style="--bg: {$opts.bg}; --fg: {$opts.fg}">
	<h2>X</h2>

	<p>a: {$opts.a}</p>
	<p>b: {$opts.b}</p>
</div>

<style>
	.x {
		background-color: var(--bg);
		color: var(--fg);
		padding: 1em;
	}
</style>