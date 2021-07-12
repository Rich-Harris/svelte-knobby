import KeyframeEditor from './components/KeyframeEditor.svelte';

export { curve } from './utils/curve.js';

/**
 * @param {{ playhead?: (values: any) => number, tracks: import('./types').KeyframeTrack[] }} value
 * @returns {import('../../types').Node}
 */
export function keyframes({ playhead, tracks }) {
	return {
		$component: KeyframeEditor,
		playhead,
		value: tracks
	};
}
