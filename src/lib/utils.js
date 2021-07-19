/**
 * @param {import('./types').Node} node
 * @param {string} label
 */
export function get_opts(node, label) {
	/** @type {Record<string, any>} */
	const opts = {
		config: {
			label
		}
	};

	for (const key in node) {
		if (key === 'config') {
			throw new Error('"config" is a reserved property name');
		}

		if (key.startsWith('$')) {
			opts.config[key.slice(1)] = node[key];
		} else {
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
