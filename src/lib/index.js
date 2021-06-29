import Folder from './components/Folder.svelte';
import Number from './components/Number.svelte';
import Range from './components/Range.svelte';
import Boolean from './components/Boolean.svelte';
import String from './components/String.svelte';
import Color from './components/Color.svelte';
import Knobby from './Knobby.svelte';
import { writable } from 'svelte/store';

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
			// component: Button,
			value: state
		};
	}

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
		value: {}
	};

	for (const key in state) {
		interpreted[key] = interpret(state[key]);
	}

	return interpreted;
}

/** @param {import('./types').State} state */
function extract(state) {
	if (state.component === Folder) {
		const value = {};
		for (const key in state.value) {
			value[key] = extract(state.value[key]);
		}
		return value;
	}

	return state.value;
}

function merge(state, value) {
	if (state.component === Folder) {
		const new_state = {};
		for (const key in state.value) {
			new_state[key] = merge(state.value[key], value[key]);
		}
		return new_state;
	}

	return {
		...state,
		value
	};
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
	const value = {};
	for (const key in initial) {
		value[key] = interpret(initial[key]);
	}

	const state = {
		component: Folder,
		value
	};

	let values = extract(state);

	const private_store = writable(state);

	const public_store = writable(extract(state), (set) => {
		// add to the UI
		// TODO would be good if order was preserved when re-adding later
		stores.push(private_store);
		update();

		private_store.subscribe(state => {
			if (updating) return;
			set(values = extract(state));
		});

		return () => {
			const index = stores.indexOf(private_store);
			if (index !== -1) stores.splice(index, 1);
			update();
		};
	});

	let updating = false;

	function set(value) {
		// changes to the public store need to be reflected in
		// the private store
		updating = true;
		private_store.update(state => merge(state, values));
		updating = false;
	}

	return {
		subscribe: public_store.subscribe,
		update: (fn) => {
			set(values = fn(values))
		},
		set
	}
}