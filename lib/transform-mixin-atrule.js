// tooling
import { list } from 'postcss';
import setVariable from './set-variable';

// transform @mixin at-rules
export default function transformMixinAtrule(atrule, result, opts) {
	// @mixin name and default params ([{ name, value }, ...])
	const [ name, sourceParams ] = atrule.params.split(matchOpeningParen, 2);
	const params = sourceParams
		? list.comma(sourceParams.slice(0, -1)).map(
			param => {
				const parts = list.split(param, ':');
				const paramName  = parts[0].slice(1);
				const paramValue = parts.length > 1 ? parts.slice(1).join(':') : undefined;

				return { name: paramName, value: paramValue };
			}
		)
	: [];

	// set the mixin as a variable on the parent of the atrule
	setVariable(atrule.parent, name, { params, atrule }, opts);

	// remove the @mixin at-rule
	atrule.remove();
}

// match an opening parenthesis
const matchOpeningParen = '(';
