import babel from 'rollup-plugin-babel';

export default {
	input: 'index.js',
	output: { file: 'index.bundle.js', format: 'cjs' },
	plugins: [
		babel({
			plugins: [
				'array-includes',
				'external-helpers'
			],
			presets: [
				['env', { modules: false, targets: { node: '4' } }]
			]
		})
	]
};
