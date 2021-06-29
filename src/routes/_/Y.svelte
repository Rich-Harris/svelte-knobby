<script>
	import { knobby } from '$lib';

	const opts = knobby({
		c: {
			value: 1,
			min: 0,
			max: 1
		},
		d: true,
		bg: '#557899',
		fg: '#ccee33'
	});
</script>

<div class="y" style="--bg: {$opts.bg}; --fg: {$opts.fg}">
	<h2>Y</h2>

	<p>c: {$opts.c}</p>
	<p>d: {$opts.d}</p>
</div>

<style>
	.y {
		background-color: var(--bg);
		color: var(--fg);
		padding: 1em;
	}
</style>