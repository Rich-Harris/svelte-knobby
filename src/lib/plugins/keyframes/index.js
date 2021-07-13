import KeyframeEditor from './components/KeyframeEditor.svelte';

export { curve } from './curve.js';

/**
 * @param {{ playhead?: (values: any) => number, value: Record<string, import('./types').KeyframeTrack> }} options
 * @returns {import('../../types').Node}
 */
export function keyframes({ playhead, value }) {
	return {
		$component: KeyframeEditor,
		playhead,
		value
	};
}
