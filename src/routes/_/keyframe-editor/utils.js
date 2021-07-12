/**
 * @param {number} a
 * @param {number} b
 * @param {number} t
 */
export function mix(a, b, t) {
	return a + t * (b - a);
}

/** @param {import('./types').Point} v */
export function mag(v) {
	return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
}
