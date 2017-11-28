var postcss = require('postcss');

module.exports = postcss.plugin('postcss-advanced-variables', function (opts) {
	opts = Object.assign(
		{
			warnOfUnresolved : true
		},
		opts
	);
	var isOptsVariablesFunc = typeof opts.variables === 'function';

	// Matchers
	// --------

	var isVariableDeclaration = /^\$[\w-]+$/;
	var variablesInString = /(^|[^\\])(?:#\{\$([A-z][\w-]*)\}|\$\(([A-z][\w-]*)\)|\$([A-z][\w-]*))/g;
	var wrappingParen = /^\((.*)\)$/g;
	var isDefaultValue = /\s+!default$/;
	var isKeyframesAtRule = /^(-(moz|o|webkit)-)?keyframes$/;

	// Helpers
	// -------

	// '(hello), (goodbye)' => [[hello], [goodbye]]
	function getArrayedString(string, first) {
		var array = postcss.list.comma(String(string)).map(function (substring) {
			return wrappingParen.test(substring) ? getArrayedString(substring.replace(wrappingParen, '$1')) : substring;
		});

		return first && array.length === 1 ? array[0] : array;
	}

	// $NAME => VALUE
	function getVariable(node, name) {
		var value;
		if (node.variables !== undefined && name in node.variables) {
			value = node.variables[name];
		} else if (node.parent !== undefined) {
			value = getVariable(node.parent, name);
		} else if (isOptsVariablesFunc === true) {
			value = opts.variables(name);
			if (value === null) {
				value = undefined; // Normalize to undefined.
			}
		}
		return value;
	}

	// node.variables[NAME] => 'VALUE'
	function setVariable(node, name, value) {
		node.variables = node.variables || {};

		if (isDefaultValue.test(value)) {
			if (getVariable(node, name)) return;
			else value = value.replace(isDefaultValue, '');
		}

		node.variables[name] = getArrayedString(value, true);
	}

	// 'Hello $NAME' => 'Hello VALUE'
	function getVariableTransformedString(searchNode, string, srcNode, result) {
		return string.replace(variablesInString, function (match, before, name1, name2, name3) {
			var varName = name1 || name2 || name3;
			var value = getVariable(searchNode, varName);

			if (value === undefined && opts.warnOfUnresolved === true) {
				result.warn('Could not resolve variable "$' + varName + '" within "' + string + '"', { node: srcNode });
			}
			return value === undefined ? match : before + value;
		});
	}

	// '4' => 4
	function getNumberIfValid(string) {
		return isNaN(string) ? string : Number(string);
	}

	// Loopers
	// -------

	// run over every node
	function each(parent, result) {
		parent.each(function(node) {
			if (node.type === 'decl')        eachDecl(node, parent, result);
			else if (node.type === 'rule')   eachRule(node, parent, result);
			else if (node.type === 'atrule') eachAtRule(node, parent, result);

			// Process child nodes if not removed (parent will be undefined if removed)
			if (node.nodes !== undefined && node.nodes.length > 0 && node.parent !== undefined) {
				each(node, result);
			}
		});
	}

	// PROPERTY: VALUE
	function eachDecl(node, parent, result) {
		// $NAME: VALUE
		if (isVariableDeclaration.test(node.prop)) {
			node.value = getVariableTransformedString(parent, node.value, node, result);

			setVariable(parent, node.prop.slice(1), node.value);

			node.remove();
		} else {
			node.prop = getVariableTransformedString(parent, node.prop, node, result);

			node.value = getVariableTransformedString(parent, node.value, node, result);
		}
	}

	// SELECTOR {RULE}
	function eachRule(node, parent, result) {
		node.selector = getVariableTransformedString(parent, node.selector, node, result);
	}

	// @NAME PARAMS
	function eachAtRule(node, parent, result) {
		if (node.name === 'for') 			eachAtForRule(node, parent, result);
		else if (node.name === 'each')		eachAtEachRule(node, parent, result);
		else if (node.name === 'if')		eachAtIfRule(node, parent, result);
		else if (node.name === 'media') node.params = getVariableTransformedString(parent, node.params, node, result);
		else if (isKeyframesAtRule.test(node.name)) node.params = getVariableTransformedString(parent, node.params, node, result);
	}

	// @for NAME from START to END by INCREMENT
	function eachAtForRule(node, parent, result) {
		// set params
		var params = postcss.list.space(node.params);

		var name      = params[0].trim().slice(1);
		var start     = +getVariableTransformedString(node, params[2], node, result);
		var end       = +getVariableTransformedString(node, params[4], node, result);
		var increment = 6 in params && +getVariableTransformedString(node, params[6], node, result) || 1;
		var direction = start <= end ? 1 : -1;

		// each iteration
		while (start * direction <= end * direction) {
			// set iterating variable
			setVariable(node, name, start);

			// clone node
			var clone = node.clone({ parent: parent, variables: node.variables });

			// process clone children
			each(clone, result);

			// insert clone child nodes
			parent.insertBefore(node, clone.nodes);

			// increment start
			start += increment * direction;
		}

		// remove node
		node.remove();
	}

	// @each NAME in ARRAY
	function eachAtEachRule(node, parent, result) {
		// set params
		var params = node.params.split(' in ');
		var args = params[0].trim().split(' ');

		var name  = args[0].trim().slice(1);
		var iter  = args.length > 1 ? args[1].trim().slice(1) : null;
		var array = getArrayedString(getVariableTransformedString(node, params.slice(1).join(' in '), node, result), true);
		var start = 0;
		var end   = array.length;

		// each iteration
		while (start < end) {
			// set iterating variable
			setVariable(node, name, array[start]);
			if (iter) {
				setVariable(node, iter, start);
			}

			// clone node
			var clone = node.clone({ parent: parent, variables: node.variables });

			// process clone children
			each(clone, result);

			// insert clone child nodes
			parent.insertBefore(node, clone.nodes);

			// increment start
			++start;
		}

		// remove node
		node.remove();
	}

	// @if LEFT OPERATOR RIGHT
	function eachAtIfRule(node, parent, result) {
		// set params
		var params = postcss.list.space(node.params);

		var left     = getNumberIfValid(getVariableTransformedString(node, params[0], node, result));
		var operator = params[1];
		var right    = getNumberIfValid(getVariableTransformedString(node, params[2], node, result));

		// set next node
		var next = node.next();

		// evaluate expression
		if (
			operator === '==' && left === right ||
			operator === '!=' && left !== right ||
			operator === '<'  && left < right ||
			operator === '<=' && left <= right ||
			operator === '>'  && left > right ||
			operator === '>=' && left >= right
		) {
			// process node children
			each(node, result);

			// insert child nodes
			parent.insertBefore(node, node.nodes);

			// if next node is an else statement
			if (next && next.type === 'atrule' && next.name === 'else') {
				next.remove();
			}
		} else if (next && next.type === 'atrule' && next.name === 'else') {
			// process next children
			each(next, result);

			// insert child nodes
			parent.insertBefore(node, next.nodes);

			// remove next
			next.remove();
		}

		// remove node
		node.remove();
	}

	return function (css, result) {
		// Initialize each global variable.
		if (
			isOptsVariablesFunc === false &&
			opts.variables !== undefined && opts.variables !== null
		) {
			for (var name in opts.variables) {
				setVariable(css, name, opts.variables[name]);
			}
		}
		// Begin processing each css node.
		each(css, result);
	};
});
