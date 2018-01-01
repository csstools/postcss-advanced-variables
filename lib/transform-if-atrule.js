// tooling
import { list } from 'postcss';
import transformNode from './transform-node';
import getReplacedString from './get-replaced-string';

// transform @if at-rules
export default function transformIfAtrule(atrule, result, opts) {
	// params as an array
	const params = list.space(atrule.params);

	// the statement parts (@if LEFT OPERATOR RIGHT)
	const left     = getInterprettedString(getReplacedString(params[0] || '', atrule, result, opts));
	const operator = params[1];
	const right    = getInterprettedString(getReplacedString(params[2] || '', atrule, result, opts));

	// the next node
	const next = Object(atrule.next());

	// evaluate the expression
	if (
		!operator && left ||
		operator === '==' && left === right ||
		operator === '!=' && left !== right ||
		operator === '<'  && left < right ||
		operator === '<=' && left <= right ||
		operator === '>'  && left > right ||
		operator === '>=' && left >= right
	) {
		// transform the current children
		transformNode(atrule, result, opts);

		// insert the current children before the current at-rule
		atrule.parent.insertBefore(atrule, atrule.nodes);

		// conditionally remove the @else statement
		if (isElseAtrule(next)) {
			next.remove();
		}
	} else if (isElseAtrule(next)) {
		// transform the next node children
		transformNode(next, result, opts);

		// insert the next node children before the current at-rule
		atrule.parent.insertBefore(atrule, next.nodes);

		// remove the next node
		next.remove();
	}

	// remove the current at-rule
	atrule.remove();
}

// return whether the node is an else at-rule
const isElseAtrule = node => 'atrule' === node.type && 'else' === node.name;

// return the value as a boolean, number, or string
const getInterprettedString = value => 'true' === value
	? true
: 'false' === value
	? false
: isNaN(value)
	? value
: Number(value);
