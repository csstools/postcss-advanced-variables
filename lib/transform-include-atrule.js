// tooling
import { list } from 'postcss';
import getClosestVariable from './get-closest-variable';
import getReplacedString from './get-replaced-string';
import manageUnresolved from './manage-unresolved';
import setVariable from './set-variable';
import transformNode from './transform-node';

// transform @include at-rules
export default function transformIncludeAtrule(rule, opts) {
	// if @include is supported
	if (opts.transform.includes('@include')) {
		// @include options
		const { name, args } = getIncludeOpts(rule);

		// the closest @mixin variable
		const mixin = getClosestVariable(`@mixin ${name}`, rule.parent, opts);

		// if the @mixin variable exists
		if (mixin) {
			// set @mixin variables on the @include at-rule
			mixin.params.forEach(
				(param, index) => {
					const arg = index in args
						? getReplacedString(args[index], rule, opts)
					: param.value;

					setVariable(rule, param.name, arg, opts);
				}
			);

			// clone the @mixin at-rule
			const clone = mixin.rule.clone({
				original:  rule,
				parent:    rule.parent,
				variables: rule.variables
			});

			// transform the clone children
			return transformNode(clone, opts).then(() => {
				// replace the @include at-rule with the clone children
				rule.parent.insertBefore(rule, clone.nodes);

				rule.remove();
			})
		} else {
			// otherwise, if the @mixin variable does not exist
			manageUnresolved(rule, opts, name, `Could not resolve the mixin for "${name}"`);
		}
	}
}

// return the @include statement options (@include NAME, @include NAME(ARGS))
const getIncludeOpts = node => {
	// @include name and args
	const [ name, sourceArgs ] = node.params.split(matchOpeningParen, 2);
	const args = sourceArgs
		? list.comma(sourceArgs.slice(0, -1))
	: [];

	return { name, args };
};

// match an opening parenthesis
const matchOpeningParen = '(';
