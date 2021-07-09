/** @param {import('./types').Node} node */
export function get_opts(node) {
	const { component, value, ...opts } = node;
	return opts;
}

/** @param {import('./types').Node} node */
export function extract(node) {
	if (node.type === 'folder') {
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
	if (node.type === 'folder') {
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
