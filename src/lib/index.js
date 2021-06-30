import Number from './components/Number.svelte';
import Range from './components/Range.svelte';
import Boolean from './components/Boolean.svelte';
import String from './components/String.svelte';
import Color from './components/Color.svelte';
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
			// component: Button,
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
		children: {}
	};

	for (const key in state) {
		interpreted.children[key] = interpret(state[key]);
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
	const state = {
		children: {}
	};

	for (const key in initial) {
		state.children[key] = interpret(initial[key]);
	}

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

	function set(values) {
		// changes to the public store need to be reflected in
		// the private store
		updating = true;
		public_store.set(values);
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