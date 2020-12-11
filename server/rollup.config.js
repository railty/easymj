import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import postcss from 'rollup-plugin-postcss'
import autoPreprocess from 'svelte-preprocess';

const production = !process.env.ROLLUP_WATCH;

export default ['cli'].map((name, index) => ({
	input: `src/${name}/main.js`,
	//external: ['socket.io-client'],
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: `../public/svelte/build/${name}.js`,
		globals: {
			//'socket.io-client': 'io'
		}
	},
	plugins: [
		svelte({
			onwarn: (warning, handler) => {
				if (warning.code == 'a11y-missing-attribute' && warning.message == 'A11y: <a> element should have an href attribute') return;
				if (warning.code == 'a11y-invalid-attribute' && warning.message == "A11y: '#' is not a valid href attribute") return;
				console.log("warning:");
				console.log(warning);
				// let Rollup handle all other warnings normally
				handler(warning);
			},
			emitCss: true,
			preprocess: autoPreprocess(),
			compilerOptions: {
				// enable run-time checks when not in production
				dev: !production,
			}			
		}),
		postcss({
			extract: true,
			minimize: true,
			use: [
				['sass', {
					includePaths: [
							'./src'
					]
				}]
			]
		}),
		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration —
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			preferBuiltins: false,
			dedupe: ['svelte']
		}),
		commonjs(),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	}
}));

