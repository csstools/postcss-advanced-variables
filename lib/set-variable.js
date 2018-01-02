// tooling
import getClosestVariable from './get-closest-variable';

// set a variable on a node
export default function setVariable(node, name, value, opts) {
	// if the value is not a default with a value already defined
	if (!matchDefault.test(value) || getClosestVariable(name, node, opts) === undefined) {
		// the value without a default suffix
		const undefaultedValue = matchDefault.test(value)
			? value.replace(matchDefault, '')
		: value;

		// ensure the node has a variables object
		node.variables = node.variables || {};

		// set the variable
		node.variables[name] = undefaultedValue;
	}
}

// match anything ending with a valid !default
const matchDefault = /\s+!default$/;
