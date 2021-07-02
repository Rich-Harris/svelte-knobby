<script>
	import { getContext } from 'svelte';
	import Folder from './knobs/Folder.svelte';
	import { get_opts } from './utils.js';

	export let children;

	const { run, set } = getContext('knobby');
</script>

<div>
	{#each Object.entries(children) as [name, state]}
		{#if state.component}
			<div class="item">
				<span>{name}</span>
				<div>
					<svelte:component this={state.component} bind:value={children[name].value} {...get_opts(state)}/>
				</div>
			</div>
		{:else if state.children}
			<Folder {name} bind:children={children[name].children}/>
		{:else}
			<button on:click={() => {
				const new_value = run(state.value);
				if (new_value) set(new_value);
			}}>{name}</button>
		{/if}
	{/each}
</div>

<style>
	.item {
		display: grid;
		grid-template-columns: 1fr 160px;
		grid-gap: var(--gap);
		align-items: center;
		min-height: 2rem;
		margin: 0 0 0.3rem 0;
	}

	.item span {
		overflow-x: hidden;
		text-overflow: ellipsis;
	}

	.item div {
		display: flex;
		height: 100%;
	}

	button {
		width: 100%;
		border-radius: 16px;
		background: var(--bg);
		box-shadow: var(--convex);
		border: none;
		border-radius: var(--border-radius);
		font: inherit;
		margin: 0.5rem 0 0.5rem 0;
		padding: 0.5rem 0.5rem;
	}

	button:active {
		box-shadow: var(--concave);
	}
</style>