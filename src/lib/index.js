import { readable, writable } from 'svelte/store';
import { onDestroy } from 'svelte';
import Knobby from './Knobby.svelte';
import Group from './Group.svelte';
import Action from './knobs/Action.svelte';
import Checkbox from './knobs/Checkbox.svelte';
import Color from './knobs/Color.svelte';
import Range from './knobs/Range.svelte';
import Text from './knobs/Text.svelte';
import Radio from './knobs/Radio.svelte';

let knobby;

const root = {
	knobs: []
};

let current = root;

function remove(array, item) {
	let i = array.length;
	while (i--) {
		if (array[i] === item) {
			array.splice(i, 1);
		}
	}
}

function update() {
	if (typeof document === 'undefined') return;

	if (!knobby) {
		knobby = new Knobby({ target: document.body });
	}

	knobby.$set(root);
}

function knobber(component) {
	return function (label, initial, options) {
		const { knobs } = current;

		// create separate public/private stores so we can
		// track subscriptions to the public store for
		// lifecycle management
		const private_store = writable(initial);

		const public_store = readable(initial, (set) => {
			const unsubscribe = private_store.subscribe(set);

			knobs.push(knob);
			update();

			return () => {
				unsubscribe();

				remove(knobs, knob);
				update();
			};
		});

		const knob = {
			component,
			label,
			options,
			store: private_store
		};

		return public_store;
	};
}

/** @type {import('./types').Knobber<boolean>} */
export const checkbox = knobber(Checkbox);

/** @type {import('./types').Knobber<string>} */
export const color = knobber(Color);

/** @type {import('./types').Knobber<number, { min?: number, max?: number, step?: number }>} */
export const range = knobber(Range);

/** @type {import('./types').Knobber<string>} */
export const text = knobber(Text);

/** @type {import('./types').Knobber<string, { radioOptions?: array }>} */
export const radio = knobber(Radio);

/**
 * @param {string} label
 * @param {() => void} action
 */
export function action(label, action) {
	const { knobs } = current;

	const knob = {
		component: Action,
		label,
		action
	};

	knobs.push(knob);
	update();

	const destroy = () => {
		remove(knobs, knob);
		update();
	};

	try {
		onDestroy(destroy);
	} catch (e) {
		// action was created outside component lifecycle,
		// we can't auto-destroy
	}

	return destroy;
}

const groups = new Map();

/**
 * @param {string} label
 * @param {boolean} [open]
 */
export function group(label, open = true) {
	if (!groups.has(label)) {
		const group = {
			component: Group,
			label,
			open,
			knobs: []
		};

		groups.set(label, group);

		root.knobs.push(group);
	}

	current = groups.get(label);
}

export function ungroup() {
	current = root;
}
