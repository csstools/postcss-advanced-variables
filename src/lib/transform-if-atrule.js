// tooling
import { list } from 'postcss';
import transformNode from './transform-node';
import getReplacedString from './get-replaced-string';

// transform @if at-rules
export default function transformIfAtrule(rule, opts) {
	// @if options
	const isTruthy = isIfTruthy(rule, opts);
	const next = rule.next();

	const transformAndInsertBeforeParent = node => transformNode(node, opts).then(
		() => node.parent.insertBefore(node, node.nodes)
	)

	return ifPromise(
		opts.transform.includes('@if'),
		() => ifPromise(
			isTruthy,
			() => transformAndInsertBeforeParent(rule)
		).then(() => {
			rule.remove();
		})
	).then(() => ifPromise(
		opts.transform.includes('@else') && isElseRule(next),
		() => ifPromise(
			!isTruthy,
			() => transformAndInsertBeforeParent(next)
		).then(() => {
			next.remove();
		})
	))
}

const ifPromise = (condition, trueFunction) => Promise.resolve(condition && trueFunction())

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
