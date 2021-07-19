import Number from './knobs/Number.svelte';
import Range from './knobs/Range.svelte';
import Boolean from './knobs/Boolean.svelte';
import Button from './knobs/Button.svelte';
import Folder from './knobs/Folder.svelte';
import String from './knobs/String.svelte';
import Color from './knobs/Color.svelte';

/** @param {any} input */
function is_numeric(input) {
	if (typeof input.value !== 'number') return false;

	for (const key in input) {
		if (key.startsWith('$')) continue;

		if (key === 'min' || key === 'max' || key === 'step') {
			const value = input[key];
			if (value && typeof value !== 'function' && typeof value !== 'number') {
				return false;
			}
		} else if (key !== 'value') {
			return false;
		}
	}

	return true;
}

/**
 * @param {any} input
 * @param {string} $id
 * @returns {import('./types').Node}
 */
export function interpret(input, $id) {
	if (typeof input === 'number') {
		return {
			$component: Number,
			value: input
		};
	}

	if (typeof input === 'boolean') {
		return {
			$component: Boolean,
			value: input
		};
	}

	if (typeof input === 'string') {
		if (/^#[a-fA-F0-9]{6}$/.test(input)) {
			return {
				$component: Color,
				value: input
			};
		}

		return {
			$component: String,
			value: input
		};
	}

	if (typeof input === 'function') {
		return {
			$component: Button,
			value: input
		};
	}

	if (input.$component) return input;

	// try to figure out which component matches
	if (is_numeric(input)) {
		return {
			$component: 'min' in input && 'max' in input ? Range : Number,
			...input
		};
	}

	/** @type {import('./types').Node} */
	const node = {
		$id,
		$folder: true,
		$component: Folder,
		value: {}
	};

	for (const key in input) {
		if (key.startsWith('$')) {
			node[key] = input[key];
		} else {
			node.value[key] = interpret(input[key], $id && `${$id}.${key}`);
		}
	}

	return node;
}
