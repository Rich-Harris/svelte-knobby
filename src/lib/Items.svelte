<script>
	import { getContext } from 'svelte';
	import Folder from './components/Folder.svelte';
	import { get_opts } from '../utils.js';

	export let value;

	const { run } = getContext('knobby');
</script>

<div>
	{#each Object.entries(value) as [name, state]}
		{#if (state.$visible ? run(state.$visible) : true)}
			{#if state.component}
				<div class="item">
					<span>{name}</span>
					<div>
						<svelte:component this={state.component} bind:value={value[name].value} {...get_opts(state)}/>
					</div>
				</div>
			{:else if state.children}
				<Folder bind:children={value[name].children}/>
			{:else}
				<button on:click={() => run(state.value)}>{name}</button>
			{/if}
		{/if}
	{/each}
</div>

<style>
	.item {
		display: grid;
		grid-template-columns: 1fr 200px;
		grid-gap: 0.5em;
		align-items: center;
		min-height: 2em;
	}
</style>