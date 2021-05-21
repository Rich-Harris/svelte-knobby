<script>
	import * as knobby from '$lib';

	knobby.group('x');

	const a = knobby.range('a', 1, { min: 0, max: 5 });
	const b = knobby.checkbox('b', true);

	const bg = knobby.color('background', '#DCFF7A');
	const fg = knobby.color('foreground', '#5000C7');
</script>

<div class="x" style="--bg: {$bg}; --fg: {$fg}">
	<h2>X</h2>

	<p>a: {$a}</p>
	<p>b: {$b}</p>
</div>

<style>
	.x {
		background-color: var(--bg);
		color: var(--fg);
		padding: 1em;
	}
</style>