// tooling
import getArrayedString from './get-arrayed-string';
import getClosestVariable from './get-closest-variable';

// set a variable on a node
export default function setVariable(node, name, value, opts) {
	// if the value is not a default with a value already defined
	if (!isDefault(value) || getClosestVariable(name, node, opts) === undefined) {
		// get the value without its default suffix as the first item of its arrayed value
		const undefaultedValue = 'string' === typeof value ? getArrayedString(value.replace(matchDefault, ''), true) : value;

		// ensure the node has a variables object
		node.variables = node.variables || {};

		// set the variable
		node.variables[name] = undefaultedValue;
	}
}

// return whether the value is a default
const isDefault = value => matchDefault.test(value);

// match anything ending with space and then !default
const matchDefault = /\s+!default$/;
