export default {
	input: 'src/index.js',
	output: [
		{ file: 'index.js', format: 'cjs', exports: 'auto' },
		{ file: 'index.mjs', format: 'esm', exports: 'auto' }
	],
};
