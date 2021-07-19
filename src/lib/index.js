import Knobby from './Knobby.svelte';
import { writable } from 'svelte/store';
import { extract, merge } from './utils.js';
import { interpret } from './interpret.js';

/** @typedef {import('./types').Node} Node */

let visible = true;

/** @type {import('svelte').SvelteComponent} */
let controls;

/** @type {Array<import('svelte/store').Writable<any>>} */
const stores = [];

function update() {
	if (typeof document === 'undefined') return;

	if (visible) {
		if (!controls) {
			controls = new Knobby({ target: document.body });
		}

		controls.$set({ stores });
	}
}

/**
 * @param {any} initial
 * @returns {import('svelte/store').Writable<any>}
 */
export function panel(initial) {
	/** @type {import('./types').Node} */
	const node = {
		$id: initial.$id,
		$folder: true,
		$component: null,
		value: {}
	};

	for (const key in initial) {
		if (key.startsWith('$')) {
			node[key] = initial[key];
		} else {
			node.value[key] = interpret(initial[key], initial.$id && `${initial.$id}.${key}`);
		}
	}

	let values = extract(node);

	const private_store = writable(node);

	const public_store = writable(values, (set) => {
		// add to the UI
		// TODO would be good if order was preserved when re-adding later
		stores.push(private_store);
		update();

		private_store.subscribe((node) => {
			if (updating) return;
			set((values = extract(node)));
		});

		return () => {
			const index = stores.indexOf(private_store);
			if (index !== -1) stores.splice(index, 1);
			update();
		};
	});

	let updating = false;

	/** @param {any} values */
	function set(values) {
		// changes to the public store need to be reflected in
		// the private store
		updating = true;
		public_store.set(values);
		private_store.update((node) => merge(node, values));
		updating = false;
	}

	return {
		subscribe: public_store.subscribe,
		update: (fn) => {
			set((values = fn(values)));
		},
		set
	};
}

/** @param {boolean} visibility */
export function toggle(visibility) {
	if (visible === (visible = visibility)) return;

	if (visible) {
		update();
	} else if (controls) {
		controls.$destroy();
		controls = null;
	}
}

export { context } from './context.js';
