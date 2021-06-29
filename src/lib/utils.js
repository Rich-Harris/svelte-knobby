export function get_opts(state) {
	const { component, value, ...opts } = state;
	return opts;
}

/** @param {import('./types').State} state */
export function extract(state) {
	if (state.children) {
		const value = {};
		for (const key in state.children) {
			value[key] = extract(state.children[key]);
		}
		return value;
	}

	return state.value;
}

export function merge(state, value) {
	if (state.children) {
		const new_state = {
			children: {}
		};

		for (const key in state.children) {
			new_state.children[key] = merge(state.children[key], value[key]);
		}

		return new_state;
	}

	return {
		...state,
		value
	};
}