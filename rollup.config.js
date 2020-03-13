import babel from 'rollup-plugin-babel';

export default {
	external: [ 'preact' ],
	plugins: [
		babel({
			babelrc: false,
			sourceMap: true,
			inputSourceMap: true,
			exclude: 'node_modules/**',
			presets: [ '@babel/env' ],
			plugins: [
					'@babel/proposal-class-properties',
					[ '@babel/plugin-transform-react-jsx', { pragma: 'createElement' } ]
			]
		})
	]
};
