// tooling
import { list } from 'postcss';
import transformNode from './transform-node';
import getReplacedString from './get-replaced-string';

// transform @if at-rules
export default function transformIfAtrule(rule, opts) {
	// @if options
	const isTruthy = isIfTruthy(rule, opts);
	const next = rule.next();

	// if @if is supported
	if (opts.transform.includes('@if')) {
		// if the expression is truthy
		if (isTruthy) {
			// transform the @if at-rule children
			transformNode(rule, opts);

			// replace the @if at-rule with its children
			rule.parent.insertBefore(rule, rule.nodes);
		}

		// remove the @if at-rule
		rule.remove();
	}

	// if @else is supported
	if (opts.transform.includes('@else') && isElseRule(next)) {
		// if the expression is falsey
		if (!isTruthy) {
			// transform the @else at-rule children
			transformNode(next, opts);

			// replace the @else at-rule with its children
			next.parent.insertBefore(next, next.nodes);
		}

		// remove the @else at-rule
		next.remove();
	}
}

// return whether the @if at-rule is truthy
const isIfTruthy = (node, opts) => {
	// @if statement options (@if EXPRESSION, @if LEFT OPERATOR RIGHT)
	const params = list.space(node.params);
	const left     = getInterprettedString(getReplacedString(params[0] || '', node, opts));
	const operator = params[1];
	const right    = getInterprettedString(getReplacedString(params[2] || '', node, opts));

	// evaluate the expression
	const isTruthy = !operator && left ||
	operator === '==' && left === right ||
	operator === '!=' && left !== right ||
	operator === '<'  && left < right ||
	operator === '<=' && left <= right ||
	operator === '>'  && left > right ||
	operator === '>=' && left >= right;

	return isTruthy;
};

// return the value as a boolean, number, or string
const getInterprettedString = value => 'true' === value
	? true
: 'false' === value
	? false
: isNaN(value)
	? value
: Number(value);

// return whether the node is an else at-rule
const isElseRule = node => Object(node) === node && 'atrule' === node.type && 'else' === node.name;
