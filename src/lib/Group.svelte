<script>
	export let label;
	export let open;
	export let knobs;

</script>

{#if knobs.length > 0}
	<details {open}>
		<summary>{label}</summary>

		<div class="group">
			{#each knobs as { component, ...knob }}
				<svelte:component this={component} {...knob}/>
			{/each}
		</div>
	</details>
{/if}

<style>
	summary {
		position: relative;
		font-size: 1em;
		padding: 0.5rem 0 0.5rem 1.5rem;
		list-style: none;
		user-select: none;
	}

	summary::before {
		content: '';
		position: absolute;
		left: 2px;
		top: calc(50% - 4px);
		transform-origin: 25% 50%;
		width: 0;
		height: 0;
		border: 4px solid transparent;
		border-left-width: 5px;
		border-right-width: 5px;
		border-top-width: 4px;
		border-bottom-width: 4px;
		border-left-color: currentColor;
		transition: transform 0.1s ease-out;
	}

	[open] summary::before {
		transform: rotate(90deg);
	}

	.group {
		margin: 0 0 1rem 0.2rem;
		border-left: 2px solid var(--dark);
	}
</style>