// tooling
import getReplacedString from './get-replaced-string';
import setVariable from './set-variable';

// process a declaration node
export default function processDecl(decl, result, opts) {
	// update the declaration value with its variables replaced by their corresponding values
	decl.value = getReplacedString(decl.value, decl, result, opts);

	// if the declaration is a variable declaration
	if (isVariableDeclaration(decl)) {
		// set the variable on the parent node
		setVariable(decl.parent, decl.prop.slice(1), decl.value, opts);

		// remove the declaration nodes
		decl.remove();
	}
}

// return whether the declaration property is a variable declaration
const isVariableDeclaration = decl => matchVariable.test(decl.prop);

// match $name
const matchVariable = /^\$[\w-]+$/;
