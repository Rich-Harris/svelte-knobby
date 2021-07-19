<script>
	import * as knobby from '$lib';

	// controls are only rendered when they are being
	// used; these will disappear if <Thing/> is unmounted
	const controls = knobby.panel({
		$label: '<Thing> options',
		a: 1,
		b: 2
	});
</script>

<p>{$controls.a} + {$controls.b} = {$controls.a + $controls.b}</p>
