export function get_opts(state) {
	const { component, value, ...opts } = state;
	return opts;
}