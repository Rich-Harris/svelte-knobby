/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',

		package: {
			exports: {
				include: ['index.js', 'plugins/*/index.js']
			}
		}
	}
};

export default config;
