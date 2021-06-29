<script>
	import Items from '../Items.svelte';

	export let children;

	// TODO collapsed, label, etc
</script>

<div class="folder">
	<Items bind:children/>
</div>