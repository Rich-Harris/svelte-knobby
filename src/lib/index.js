import { writable } from 'svelte/store';
import { onDestroy } from 'svelte';
import Knobby from './Knobby.svelte';
import Group from './Group.svelte';
import Action from './knobs/Action.svelte';
import Checkbox from './knobs/Checkbox.svelte';
import Color from './knobs/Color.svelte';
import Range from './knobs/Range.svelte';
import Text from './knobs/Text.svelte';

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
	knobby.$set(root);
}

function create_knob(component, label, initial, options) {
	return {
		component,
		label,
		options,
		store: writable(initial)
	};
}

function add_knob(knob) {
	if (typeof document === 'undefined') return;

	if (!knobby) {
		knobby = new Knobby({ target: document.body });
	}

	const { knobs } = current;

	knobs.push(knob);
	update();

	onDestroy(() => {
		remove(knobs, knob);
		update();
	});
}

function knobber(component) {
	return function (label, initial, options) {
		const knob = create_knob(component, label, initial, options);
		add_knob(knob);
		return knob.store;
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

/**
 * @param {string} label
 * @param {() => void} action
 */
export function action(label, action) {
	add_knob({
		component: Action,
		label,
		action
	});
}

const groups = new Map();

/**
 *
 * @param {string} label
 * @returns
 */
export function group(label) {
	if (!groups.has(label)) {
		const group = {
			component: Group,
			label,
			knobs: []
		};

		groups.set(label, group);

		current = root;
		add_knob(group);
	}

	current = groups.get(label);
}

export function ungroup() {
	current = root;
}
