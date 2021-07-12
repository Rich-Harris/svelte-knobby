import { getContext, setContext } from 'svelte';

const key = {};

/** @returns {import('./types').Context} */
export function context() {
	return getContext(key);
}

/** @param {import('./types').Context} context */
export function init(context) {
	setContext(key, context);
}
