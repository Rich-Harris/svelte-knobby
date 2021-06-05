<script>
	import * as knobby from '$lib';

	knobby.group('y');

	const c = knobby.range('c', 1, { min: 0, max: 5 });
	const d = knobby.checkbox('d', true);

	const bg = knobby.color('background', '#557899');
	const fg = knobby.color('foreground', '#ccee33');

	const e = knobby.select('e', 'a', { options: ['a','b','c','d']});

</script>

<div class="y" style="--bg: {$bg}; --fg: {$fg}">
	<h2>Y</h2>

	<p>c: {$c}</p>
	<p>d: {$d}</p>
	<p>e: {$e}</p>

</div>

<style>
	.y {
		background-color: var(--bg);
		color: var(--fg);
		padding: 1em;
	}
</style>