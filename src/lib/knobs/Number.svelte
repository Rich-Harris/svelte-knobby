<script>
	export let value;
	export let min = undefined;
	export let max = undefined;
	export let step = undefined;
</script>

<input type="number" bind:value {min} {max} {step}>