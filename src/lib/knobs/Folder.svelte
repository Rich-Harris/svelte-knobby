<script>
	import Chevron from '../components/Chevron.svelte';
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
		margin: 0 0 0.1rem -0.3rem;
		align-items: center;
	}

	[open] > summary::before {
		transform: rotate(90deg);
	}

	.folder {
		position: relative;
		margin: 0;
		padding: 0 0 0 0.5rem;
		/* border-left: 1px solid hsla(var(--hue), 11%, 90%, 1); */
	}

	.folder::before {
		content: '';
		position: absolute;
		width: 0;
		height: calc(100% + 0.5rem);
		left: 0rem;
		top: -0.5rem;
		border-left: 1px solid var(--dark);
		border-right: 1px solid var(--light);
	}
</style>
