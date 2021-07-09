<script>
	import Chevron from '../components/Chevron.svelte';
	import Items from '../Items.svelte';

	/** @type {string} */
	export let name;

	/** @type {Record<string, any>} */
	export let value;

	let open = true;

	/** @type {HTMLDetailsElement} */
	let details;

	/** @type {HTMLSummaryElement} */
	let summary;

	/** @type {Animation} */
	let animation;

	/** @param {MouseEvent} e */
	function toggle(e) {
		if (open) {
			const a = details.offsetHeight;
			const b = summary.offsetHeight;

			animation = details.animate({
				height: [`${a}px`, `${b}px`]
			}, {
				duration: 30 * Math.log(Math.abs(b - a)),
				easing: 'ease-out'
			});

			open = false;

			animation.onfinish = () => {
				details.open = false;
			};
		} else {
			const a = details.offsetHeight;
			if (animation) animation.cancel();
			details.open = true;
			const b = details.offsetHeight;

			animation = details.animate({
				height: [`${a}px`, `${b}px`]
			}, {
				duration: 30 * Math.log(Math.abs(b - a)),
				easing: 'ease-out'
			});

			open = true;

			animation.onfinish = () => {
				details.open = true;
			};
		}
	}
</script>

<details bind:this={details} open>
	<summary bind:this={summary} on:click|preventDefault={toggle}>
		<Chevron {open}/>
		{name}
	</summary>

	<div class="folder">
		<Items bind:value/>
	</div>
</details>

<style>
	details {
		overflow-y: hidden;
		margin-left: -0.3rem;
		padding-left: 0.3rem;
	}

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

	summary:focus-visible + .folder::before {
		height: 100%;
		top: 0;
	}
</style>
