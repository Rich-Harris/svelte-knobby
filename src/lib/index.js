import Number from './knobs/Number.svelte';
import Range from './knobs/Range.svelte';
import Boolean from './knobs/Boolean.svelte';
import Button from './knobs/Button.svelte';
import Folder from './knobs/Folder.svelte';
import String from './knobs/String.svelte';
import Color from './knobs/Color.svelte';
import Knobby from './Knobby.svelte';
import { writable } from 'svelte/store';
import { extract, merge } from './utils';

/** @param {any} input */
function interpret(input) {
	if (typeof input === 'number') {
		return {
			component: Number,
			value: input
		};
	}

	if (typeof input === 'boolean') {
		return {
			component: Boolean,
			value: input
		};
	}

	if (typeof input === 'string') {
		if (/^#[a-fA-F0-9]{6}$/.test(input)) {
			return {
				component: Color,
				value: input
			};
		}

		return {
			component: String,
			value: input
		};
	}

	if (typeof input === 'function') {
		return {
			component: Button,
			value: input
		};
	}

	// TODO proper support for user-supplied components
	if (input.component) {
		return { ...input };
	}

	if (typeof input.value === 'number') {
		if ('min' in input && 'max' in input) {
			return {
				...input,
				component: Range
			};
		}
	}

	// TODO { value: number, min: number, max: number } etc

	const node = {
		component: Folder,
		type: 'folder',
		value: {}
	};

	for (const key in input) {
		if (key.startsWith('$')) {
			node[key] = input[key];
		} else {
			node.value[key] = interpret(input[key]);
		}
	}

	return node;
}

let controls;
const stores = [];

function update() {
	if (typeof document === 'undefined') return;

	if (!controls) {
		controls = new Knobby({ target: document.body });
	}

	controls.$set({ stores });
}

export function knobby(initial) {
	const node = {
		type: 'folder',
		value: {}
	};

	for (const key in initial) {
		if (key.startsWith('$')) {
			node[key] = initial[key];
		} else {
			node.value[key] = interpret(initial[key]);
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
