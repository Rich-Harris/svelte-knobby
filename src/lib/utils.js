/** @param {import('./types').Node} node */
export function get_opts(node) {
	/** @type {Record<string, any>} */
	const opts = {};

	for (const key in node) {
		if (!key.startsWith('$')) {
			opts[key] = node[key];
		}
	}

	return opts;
}

/** @param {import('./types').Node} node */
export function extract(node) {
	if (node.$folder) {
		/** @type {Record<string, any>} */
		const value = {};

		for (const key in node.value) {
			value[key] = extract(node.value[key]);
		}

		return value;
	}

	return node.value;
}

/**
 * @param {import('./types').Node} node
 * @param {Record<string, any>} value
 */
export function merge(node, value) {
	if (node.$folder) {
		/** @type {Record<string, any>} */
		const new_value = {};

		for (const key in node.value) {
			new_value[key] = merge(node.value[key], value[key]);
		}

		return {
			...node,
			value: new_value
		};
	}

	return {
		...node,
		value
	};
}
