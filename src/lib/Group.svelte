<script>
	export let label;
	export let knobs;

</script>

<section>
	<h1>{label}</h1>

	<div class="group">
		{#each knobs as knob}
			<svelte:component this={knob.component} {...knob}/>
		{/each}
	</div>
</section>

<style>
	h1 {
		font-size: 1em;
	}

	.group {
		margin: 0 0 1rem 0.2rem;
		border-left: 2px solid var(--dark);
	}
</style>