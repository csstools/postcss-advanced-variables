// tooling
import transformNode from './lib/transform-node';
import postcss from 'postcss';
import resolve from '@csstools/sass-import-resolve';

// plugin
export default postcss.plugin('postcss-advanced-variables', opts => (root, result) => {
	// process options
	const transformOpt  = ['@content', '@each', '@else', '@if', '@include', '@import', '@for', '@mixin'].filter(
		feature => !String(Object(opts).disable || '').split(/\s*,\s*|\s+,?\s*|\s,?\s+/).includes(feature)
	);
	const unresolvedOpt = String(Object(opts).unresolved || 'throw').toLowerCase();
	const variablesOpt  = Object(opts).variables;
	const importCache   = Object(Object(opts).importCache);
	const importFilter  = Object(opts).filter || (id => {
		return !matchProtocol.test(id);
	});
	const importPaths   = [].concat(Object(opts).importPaths || []);
	const importResolve = Object(opts).resolve || (
		(id, cwd) => resolve(id, { cwd, readFile: true, cache: importCache })
	);
	const importRoot    = Object(opts).importRoot || process.cwd();

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
});

const matchProtocol = /^(?:[A-z]+:)?\/\//;
