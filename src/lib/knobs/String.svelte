<script>
	export let name;
	export let value;
</script>

<label class="knobby-row">
	<span>{name}</span>
	<input bind:value>
</label>

