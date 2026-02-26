// tooling
import transformNode from './lib/transform-node';
import resolve from '@csstools/sass-import-resolve';

const matchProtocol = /^(?:[a-zA-Z]+:)?\/\//;

// plugin
const plugin = opts => ({
	postcssPlugin: "postcss-advanced-variables",
	Root(root, { result }) {
		// process options
		const transformOpt = ['@content', '@each', '@else', '@if', '@include', '@import', '@for', '@mixin'].filter(
			feature => !String(Object(opts).disable || '').split(/\s*,\s*|\s+,?\s*|\s,?\s+/).includes(feature)
		);
		const unresolvedOpt = String(Object(opts).unresolved || 'throw').toLowerCase();
		const variablesOpt = Object(opts).variables;
		const importCache = Object(Object(opts).importCache);
		const importFilter = Object(opts).importFilter || (id => {
			return !matchProtocol.test(id);
		});
		const importPaths = [].concat(Object(opts).importPaths || []);
		const importResolve = Object(opts).importResolve || (
			(id, cwd) => resolve(id, { cwd, readFile: true, cache: importCache })
		);
		const importRoot = Object(opts).importRoot || process.cwd();

		return transformNode(root, {
			result,
			importCache,
			importFilter,
			importPaths,
			importResolve,
			importRoot,
			transform: transformOpt,
			unresolved: unresolvedOpt,
			variables: variablesOpt
		});
	},
});

plugin.postcss = true;
export default plugin;
