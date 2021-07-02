<script>
	export let name;
	export let value;
	export let min = undefined;
	export let max = undefined;
	export let step = undefined;
</script>

<label class="knobby-row">
	<span>{name}</span>
	<input type="number" bind:value {min} {max} {step}>
</label>