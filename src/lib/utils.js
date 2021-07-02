export function get_opts(state) {
	const { component, value, ...opts } = state;
	return opts;
}

/** @param {import('./types').State} state */
export function extract(state) {
	if (state.type === 'folder') {
		const value = {};
		for (const key in state.value) {
			value[key] = extract(state.value[key]);
		}
		return value;
	}

	return state.value;
}

export function merge(state, value) {
	if (state.type === 'folder') {
		const new_value = {};

		for (const key in state.value) {
			new_value[key] = merge(state.value[key], value[key]);
		}

		return {
			...state,
			value: new_value
		};
	}

	return {
		...state,
		value
	};
}
