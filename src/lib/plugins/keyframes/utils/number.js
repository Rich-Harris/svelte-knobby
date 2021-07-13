/**
 * @param {number} a
 * @param {number} b
 * @param {number} t
 */
export function mix(a, b, t) {
	return a + t * (b - a);
}

/**
 * @param {number} a
 * @param {number} b
 * @param {number} v
 */
export function unmix(a, b, v) {
	return (v - a) / (b - a);
}
