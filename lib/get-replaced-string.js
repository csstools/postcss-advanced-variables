// tooling
import getClosestVariable from './get-closest-variable';

// return content with its variables replaced by the corresponding values of a node
export default function getReplacedString(string, node, result, opts) {
	const replacedString = string.replace(
		matchVariables,
		(match, before, name1, name2, name3) => {
			// conditionally return an (unescaped) match
			if (before === '\\') {
				return match.slice(1);
			}

			// the first matching variable name
			const name = name1 || name2 || name3;

			// the closest variable value
			const value = getClosestVariable(name, node.parent, opts);

			// if a variable has not been resolved
			if (undefined === value) {
				const unresolvedOption = getUnresolvedOption(opts);
				const message = `Could not resolve the variable "$${name}" within "${string}"`;

				// conditionally throw or warn the user of the unresolved variable
				if ('throw' === unresolvedOption) {
					throw node.error(message, { word: name });
				} else if ('warn' === unresolvedOption) {
					node.warn(result, message, { word: name });
				}

				return match;
			}

			// the stringified value
			const stringifiedValue = `${before}${stringify(value)}`;

			return stringifiedValue;
		}
	);

	return replacedString;
}

// match all $name, $(name), and #{$name} variables (and catch the character before it)
const matchVariables = /(.?)(?:\$([A-z][\w-]*)|\$\(([A-z][\w-]*)\)|#\{\$([A-z][\w-]*)\})/g;

// get the unresolved variables option
const getUnresolvedOption = opts => matchUnresolvedOptions.test(Object(opts).unresolved) ? String(opts.unresolved).toLowerCase() : 'throw'

// match unresolved variables options
const matchUnresolvedOptions = /^(ignore|throw|warn)$/i;

// return a sass stringified variable
const stringify = object => Array.isArray(object)
	? `(${object.map(stringify).join(',')})`
: Object(object) === object
	? Object.keys(object).map(
		key => `${key}:${stringify(object[key])}`
	).join(',')
: String(object);
