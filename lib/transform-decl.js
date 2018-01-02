// tooling
import getReplacedString from './get-replaced-string';
import setVariable from './set-variable';

// transform declarations
export default function transformDecl(decl, opts) {
	// update the declaration value with its variables replaced by their corresponding values
	decl.value = getReplacedString(decl.value, decl, opts);

	// if the declaration is a variable declaration
	if (isVariableDeclaration(decl)) {
		// set the variable on the parent of the declaration
		setVariable(decl.parent, decl.prop.slice(1), decl.value, opts);

		// remove the declaration
		decl.remove();
	}
}

// return whether the declaration property is a variable declaration
const isVariableDeclaration = decl => matchVariable.test(decl.prop);

// match a variable ($any-name)
const matchVariable = /^\$[\w-]+$/;
