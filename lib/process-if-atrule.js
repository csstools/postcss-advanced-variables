// tooling
import { list } from 'postcss';
import processNode from './process-node';
import getReplacedString from './get-replaced-string';

// process @if at-rules
export default function processIfAtrule(atrule, result, opts) {
	// params as an array
	const params = list.space(atrule.params);

	// the statement parts (@if LEFT OPERATOR RIGHT)
	const left     = getNumberOrString(getReplacedString(params[0], atrule, result, opts));
	const operator = params[1];
	const right    = getNumberOrString(getReplacedString(params[2], atrule, result, opts));

	// the next node
	var next = Object(atrule.next());

	// evaluate expression
	if (
		operator === '==' && left === right ||
		operator === '!=' && left !== right ||
		operator === '<'  && left < right ||
		operator === '<=' && left <= right ||
		operator === '>'  && left > right ||
		operator === '>=' && left >= right
	) {
		// process the at-rule children
		processNode(atrule, result, opts);

		// insert child nodes before this at-rule
		atrule.parent.insertBefore(atrule, atrule.nodes);

		// conditionally remove the else statement
		if (isElseAtrule(next)) {
			next.remove();
		}
	} else if (isElseAtrule(next)) {
		// process the next node children
		processNode(next, result, opts);

		// insert the next node children before this at-rule
		atrule.parent.insertBefore(atrule, next.nodes);

		// remove the next node
		next.remove();
	}

	// remove this at-rule
	atrule.remove();
}

// return whether the node is an else at-rule
const isElseAtrule = node => 'atrule' === node.type && 'else' === node.name;

// return '4' as 4
const getNumberOrString = value => isNaN(value) ? value : Number(value);
