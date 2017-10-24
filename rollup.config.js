import babel from 'rollup-plugin-babel';
import html from 'rollup-plugin-html';
import css from 'rollup-plugin-postcss';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import uglify from 'rollup-plugin-uglify';

export default {
	input: 'src/kite.js',
	output: {
		file: 'lib/kite.js',
		format: 'umd',
		name: 'Kite'
	},
	plugins: [
		resolve(),
		html(),
		css(),
		babel({exclude: 'node_modules/**'}),
		commonjs(),
		uglify(),
	],
	watch: {
		include: 'src/**'
	}
}
