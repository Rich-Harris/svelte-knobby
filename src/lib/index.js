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

function interpret(state) {
	// TODO make this a list that users can add to

	if (typeof state === 'number') {
		return {
			component: Number,
			value: state
		};
	}

	if (typeof state === 'boolean') {
		return {
			component: Boolean,
			value: state
		};
	}

	if (typeof state === 'string') {
		if (/^#[a-fA-F0-9]{6}$/.test(state)) {
			return {
				component: Color,
				value: state
			};
		}

		return {
			component: String,
			value: state
		};
	}

	if (typeof state === 'function') {
		return {
			component: Button,
			value: state
		};
	}

	// TODO proper support for user-supplied components
	if (state.component) {
		return { ...state };
	}

	if (typeof state.value === 'number') {
		if ('min' in state && 'max' in state) {
			return {
				...state,
				component: Range
			};
		}
	}

	// TODO { value: number, min: number, max: number } etc

	const interpreted = {
		component: Folder,
		type: 'folder',
		value: {}
	};

	for (const key in state) {
		if (key.startsWith('$')) {
			interpreted[key] = state[key];
		} else {
			interpreted.value[key] = interpret(state[key]);
		}
	}

	return interpreted;
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
