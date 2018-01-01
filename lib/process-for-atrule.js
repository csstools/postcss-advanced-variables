// tooling
import { list } from 'postcss';
import getReplacedString from './get-replaced-string';
import processNode from './process-node';
import setVariable from './set-variable';

// transform @for at-rules
export default function processForAtrule(atrule, result, opts) {
	// params as an array
	const params = list.space(atrule.params);

	// the statement parts (@for NAME from START to END by INCREMENT)
	const name      = params[0].trim().slice(1);
	const start     = Number(getReplacedString(params[2], atrule, result, opts));
	const end       = Number(getReplacedString(params[4], atrule, result, opts));
	const increment = 6 in params && Number(getReplacedString(params[6], atrule, result, opts)) || 1;
	const direction = start <= end ? 1 : -1;

	// the current incrementor
	let incrementor = start;

	// each iteration
	while (incrementor * direction <= end * direction) {
		// set iterating variable
		setVariable(atrule, name, String(incrementor), opts);

		// clone node
		const clone = atrule.clone({
			parent: atrule.parent,
			variables: atrule.variables
		});

		// process clone children
		processNode(clone, result, opts);

		// insert clone child nodes before this at-rule
		atrule.parent.insertBefore(atrule, clone.nodes);

		// increment the incrementor
		incrementor += increment * direction;
	}

	// remove this at-rule
	atrule.remove();
}
