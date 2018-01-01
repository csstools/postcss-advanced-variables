// tooling
import { list } from 'postcss';
import getReplacedString from './get-replaced-string';
import transformNode from './transform-node';
import setVariable from './set-variable';

// transform @for at-rules
export default function transformForAtrule(atrule, result, opts) {
	// params as an array
	const params = list.space(atrule.params);

	// the statement parts (@for NAME from START to END by INCREMENT)
	const name      = params[0].trim().slice(1);
	const start     = Number(getReplacedString(params[2], atrule, result, opts));
	const end       = Number(getReplacedString(params[4], atrule, result, opts));
	const increment = 6 in params && Number(getReplacedString(params[6], atrule, result, opts)) || 1;
	const direction = start <= end ? 1 : -1;

	// for each iteration
	for (let incrementor = start; incrementor * direction <= end * direction; incrementor += increment * direction) {
		// set the current iterating variable
		setVariable(atrule, name, String(incrementor), opts);

		// clone the current at-rule
		const clone = atrule.clone({
			parent: atrule.parent,
			variables: atrule.variables
		});

		// transform the cloned children
		transformNode(clone, result, opts);

		// insert the cloned children before the current at-rule
		atrule.parent.insertBefore(atrule, clone.nodes);
	}

	// remove the current at-rule
	atrule.remove();
}
