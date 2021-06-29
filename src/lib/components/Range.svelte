<script>
	export let value;
	export let min = undefined;
	export let max = undefined;
	export let step = undefined;
</script>

<input type="range" bind:value {min} {max} {step}>