// tooling
import { list } from 'postcss';
import setVariable from './set-variable';

// transform @mixin at-rules
export default function transformMixinAtrule(rule, opts) {
	// if @mixin is supported
	if (opts.transform.includes('@mixin')) {
		// @mixin options
		const { name, params } = getMixinOpts(rule);

		// set the mixin as a variable on the parent of the @mixin at-rule
		setVariable(rule.parent, `@mixin ${name}`, { params, rule }, opts);

		// remove the @mixin at-rule
		rule.remove();
	}
}

// return the @mixin statement options (@mixin NAME, @mixin NAME(PARAMS))
const getMixinOpts = node => {
	// @mixin name and default params ([{ name, value }, ...])
	const [ name, sourceParams ] = node.params.split(matchOpeningParen, 2);
	const params = sourceParams && sourceParams.slice(0, -1).trim()
		? list.comma(sourceParams.slice(0, -1).trim()).map(
			param => {
				const parts = list.split(param, ':');
				const paramName  = parts[0].slice(1);
				const paramValue = parts.length > 1 ? parts.slice(1).join(':') : undefined;

				return { name: paramName, value: paramValue };
			}
		)
	: [];

	return { name, params };
};

// match an opening parenthesis
const matchOpeningParen = '(';
