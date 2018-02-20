// tooling
import { list } from 'postcss';
import getReplacedString from './get-replaced-string';
import transformNode from './transform-node';
import setVariable from './set-variable';
import waterfall from './waterfall';

// transform @for at-rules
export default function transformForAtrule(rule, opts) {
	// if @for is supported
	if (opts.transform.includes('@for')) {
		// @for options
		const { varname, start, end, increment } = getForOpts(rule, opts);
		const direction = start <= end ? 1 : -1;
		const replacements = [];
		const ruleClones = [];

		// for each iteration
		for (let incrementor = start; incrementor * direction <= end * direction; incrementor += increment * direction) {
			// set the current variable
			setVariable(rule, varname, incrementor, opts);

			// clone the @for at-rule
			const clone = rule.clone({
				parent: rule.parent,
				variables: Object.assign({}, rule.variables)
			});

			ruleClones.push(clone)
		}

		return waterfall(
			ruleClones,
			clone => transformNode(clone, opts).then(
				() => {
					replacements.push(...clone.nodes);
				}
			)
		).then(
			() => {
				// replace the @for at-rule with the replacements
				rule.parent.insertBefore(rule, replacements);

				rule.remove();
			}
		)
	}
}

// return the @for statement options (@for NAME from START through END, @for NAME from START through END by INCREMENT)
const getForOpts = (node, opts) => {
	const params    = list.space(node.params);
	const varname   = params[0].trim().slice(1);
	const start     = Number(getReplacedString(params[2], node, opts));
	const end       = Number(getReplacedString(params[4], node, opts));
	const increment = 6 in params && Number(getReplacedString(params[6], node, opts)) || 1;

	return { varname, start, end, increment };
};
