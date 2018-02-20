// tooling
import getReplacedString from './get-replaced-string';
import getValueAsObject from './get-value-as-object';
import setVariable from './set-variable';
import transformNode from './transform-node';
import waterfall from './waterfall';

// transform @each at-rules
export default function transformEachAtrule(rule, opts) {
	// if @each is supported
	if (opts.transform.includes('@each')) {
		// @each options
		const { varname, incname, list } = getEachOpts(rule, opts);
		const replacements = [];
		const ruleClones = [];

		Object.keys(list).forEach(
			key => {
				// set the current variable
				setVariable(rule, varname, list[key], opts);

				// conditionally set the incremenator variable
				if (incname) {
					setVariable(rule, incname, key, opts);
				}

				// clone the @each at-rule
				const clone = rule.clone({
					parent: rule.parent,
					variables: Object.assign({}, rule.variables)
				});

				ruleClones.push(clone)
			}
		);

		return waterfall(
			ruleClones,
			clone => transformNode(clone, opts).then(
				() => {
					replacements.push(...clone.nodes);
				}
			)
		).then(
			() => {
				// replace the @each at-rule with the replacements
				rule.parent.insertBefore(rule, replacements);

				rule.remove();
			}
		)
	}
}

// return the @each statement options (@each NAME in LIST, @each NAME ITERATOR in LIST)
const getEachOpts = (node, opts) => {
	const params = node.params.split(matchInOperator);
	const args    = (params[0] || '').trim().split(' ');
	const varname = args[0].trim().slice(1);
	const incname = args.length > 1 && args[1].trim().slice(1);
	const rawlist = getValueAsObject(
		getReplacedString(
			params.slice(1).join(matchInOperator),
			node,
			opts
		)
	);
	const list = 'string' === typeof rawlist ? [rawlist] : rawlist;

	return { varname, incname, list };
};

// match the opertor separating the name and iterator from the list
const matchInOperator = ' in ';
