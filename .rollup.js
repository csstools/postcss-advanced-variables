import babel from 'rollup-plugin-babel';

export default {
	input: 'index.js',
	output: { file: 'index.bundle.js', format: 'cjs' },
	onwarn: (message) => {
		if (!/external dependency/.test(message)) {
			console.error(message);
		}
	},
	plugins: [
		babel({
			plugins: [
				'external-helpers'
			],
			presets: [
				['env', { modules: false, targets: { node: '4' } }]
			]
		})
	]
};
