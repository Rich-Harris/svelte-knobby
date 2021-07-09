const prefix = 'svelte-knobby';

/**
 * @template T
 * @param {string} key
 * @param {T} fallback
 * @returns {T}
 */
export function get(key, fallback) {
	try {
		const json = localStorage.getItem(`${prefix}:${key}`);
		return json ? JSON.parse(json) : fallback;
	} catch {
		return fallback;
	}
}

/**
 * @param {string} key
 * @param {any} value
 */
export function set(key, value) {
	try {
		localStorage.setItem(`${prefix}:${key}`, JSON.stringify(value));
	} catch {
		// do nothing
	}
}
