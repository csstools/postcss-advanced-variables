// tooling
import getArrayedString from './get-arrayed-string';
import getReplacedString from './get-replaced-string';
import transformNode from './transform-node';
import setVariable from './set-variable';

// transform @each at-rules
export default function transformEachAtrule(atrule, result, opts) {
	// params as an array
	const params = atrule.params.split(matchInOperator);

	// the statement parts (@each NAME in ARRAY, @each NAME ITERATOR in ARRAY)
	const args     = (params[0] || '').trim().split(' ');
	const name     = args[0].trim().slice(1);
	const itername = args.length > 1 ? args[1].trim().slice(1) : null;
	const array    = getArrayedString(getReplacedString(params.slice(1).join(matchInOperator), atrule, result, opts), true);
	const end      = array.length;

	// for each item
	for (let incrementor = 0; incrementor < end; ++incrementor) {
		// set the current iterating variable
		setVariable(atrule, name, array[incrementor], opts);

		// conditionally set the current iterator variable
		if (itername) {
			setVariable(atrule, itername, incrementor, opts);
		}

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

	// remove the current atrule
	atrule.remove();
}

const matchInOperator = ' in ';
