// tooling
import getArrayedString from './get-arrayed-string';
import getReplacedString from './get-replaced-string';
import processNode from './process-node';
import setVariable from './set-variable';

// transform @each at-rules
export default function processEachAtrule(atrule, result, opts) {
	// params as an array
	const params = atrule.params.split(' in ');

	// the statement parts (@each NAME in ARRAY)
	const args = params[0].trim().split(' ');
	const name  = args[0].trim().slice(1);
	const iter  = args.length > 1 ? args[1].trim().slice(1) : null;
	const array = getArrayedString(getReplacedString(params.slice(1).join(' in '), atrule, result, opts), true);
	const end   = array.length;

	let iterator = 0;

	// each iteration
	while (iterator < end) {
		// set iterating variable
		setVariable(atrule, name, array[iterator], opts);

		if (iter) {
			setVariable(atrule, iter, iterator, opts);
		}

		// clone this atrule
		var clone = atrule.clone({
			parent: atrule.parent,
			variables: atrule.variables
		});

		// process clone children
		processNode(clone, result, opts);

		// insert clone child nodes
		atrule.parent.insertBefore(atrule, clone.nodes);

		// increment incrementor
		++iterator;
	}

	// remove this atrule
	atrule.remove();
}
