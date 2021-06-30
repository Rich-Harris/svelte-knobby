<script>
	import Chevron from '$lib/components/Chevron.svelte';
	import Items from '../Items.svelte';

	export let name;
	export let children;

	let open = true;

	// TODO collapsed, label, etc
</script>

<details bind:open>
	<summary>
		<Chevron {open}/>
		{name}
	</summary>

	<div class="folder">
		<Items bind:children/>
	</div>
</details>

<style>
	summary {
		display: flex;
		position: relative;
		font-size: 1em;
		list-style: none;
		user-select: none;
		padding: 0.5rem 0;
		margin: 0 0 0 -0.3rem;
		align-items: center;
	}

	[open] > summary::before {
		transform: rotate(90deg);
	}

	.folder {
		margin: 0;
		padding: 0 0 0 0.5rem;
		border-left: 1px solid var(--dark);
	}
</style>
