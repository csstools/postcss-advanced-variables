// tooling
import { list } from 'postcss';
import getClosestVariable from './get-closest-variable';
import getReplacedString from './get-replaced-string';
import setVariable from './set-variable';
import transformNode from './transform-node';

// transform @include at-rules
export default function transformIncludeAtrule(atrule, result, opts) {
	// @include name and args
	const [ name, sourceArgs ] = atrule.params.split(matchOpeningParen, 2);
	const args = sourceArgs
		? list.comma(sourceArgs.slice(0, -1))
	: [];

	// @mixin params and atrule
	const mixin = getClosestVariable(name, atrule.parent, opts);

	// if a matching @mixin is found
	if (mixin) {
		// set variables from params and args
		mixin.params.forEach(
			(param, index) => {
				const arg = index in args
					? getReplacedString(args[index], atrule, result, opts)
				: param.value;

				setVariable(atrule, param.name, arg, opts);
			}
		);

		// clone the mixin at-rule
		const clone = mixin.atrule.clone({
			original:  atrule,
			parent:    atrule.parent,
			variables: atrule.variables
		});

		// transform the clone
		transformNode(clone, result, opts);

		// insert the children of the clone before the @include at-rule
		atrule.parent.insertBefore(atrule, clone.nodes);
	} else {
		// otherwise, if a mixin has not been resolved
		const unresolvedOption = getUnresolvedOption(opts);
		const message = `Could not resolve the mixin "${name}"`;

		// conditionally throw or warn the user of the unresolved variable
		if ('throw' === unresolvedOption) {
			throw atrule.error(message, { word: name });
		} else if ('warn' === unresolvedOption) {
			atrule.warn(result, message, { word: name });
		}
	}

	// remove the @include at-rule
	atrule.remove();
}

// match an opening parenthesis
const matchOpeningParen = '(';

// get the unresolved variables option
const getUnresolvedOption = opts => matchUnresolvedOptions.test(Object(opts).unresolved) ? String(opts.unresolved).toLowerCase() : 'throw'

// match unresolved variables options
const matchUnresolvedOptions = /^(ignore|throw|warn)$/i;
