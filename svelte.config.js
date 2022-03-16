import mm from 'micromatch';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		package: {
			exports: (filepath) => mm.isMatch(filepath, ['index.js', 'plugins/*/index.js'])
		},

		vite: {
			optimizeDeps: {
				include: ['bezier-easing', 'yootils']
			}
		}
	}
};

export default config;
