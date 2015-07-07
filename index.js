require('polyfill-regexp-escape');

var postcss = require('postcss');

module.exports = postcss.plugin('postcss-advanced-variables', function (opts) {
	opts = opts || {};

	var matchDecl = /^\$([\w-]+)$/;
	var matchVar = /\$(?:\(([\w-]+)\)|([\w-]+))/;
	var parenWrap = /^\s*\((.*)\)\s*$/;

	function getValueAsValueOrArray(string, node) {
		string = transformVariables(string, node);

		return typeof string === 'string' && parenWrap.test(string) ? postcss.list.comma(string.replace(parenWrap, '$1')).map(function (innerstring) {
			return getValueAsValueOrArray(innerstring);
		}) : string;
	}

	function setVariable(node, name, value) {
		name = name.replace(matchDecl, '$1');

		if (parenWrap.test(value)) {
			value = postcss.list.comma(value.replace(parenWrap, ''));
		}

		node.variables = node.variables || {};

		node.variables[name.replace(matchDecl, '$1')] = value;
	}

	function getVariable(node, name) {
		var variable = node.variables && name in node.variables ? node.variables[name] : node.parent && getVariable(node.parent, name);

		return variable
	}

	function transformVariables(string, node) {
		while (string !== (string = string.replace(matchVar, function ($0, $1, $2) {
			return getVariable(node, $1 || $2);
		}))) {}

		return string;
	}

	function eachDecl(node, parent, index) {
		if (matchDecl.test(node.prop)) {
			node.value = transformVariables(node.value, parent);

			setVariable(parent, node.prop, node.value);

			node.removeSelf();

			--index;
		} else {
			node.prop = transformVariables(node.prop, parent);

			node.value = transformVariables(node.value, parent);
		}

		return index;
	}

	function eachAtForRule(node, parent, index) {
		var params = postcss.list.space(node.params);

		var iterator = params[0].slice(1);
		var start    = +transformVariables(params[2], node);

		setVariable(parent, iterator, start);

		var end      = +transformVariables(params[4], node);
		var dir      = end < start ? -1 : 1;
		var by       = transformVariables(params[6] || 1, node) * dir;

		for (; start * dir <= end * dir; start += by) {
			setVariable(parent, iterator, start);

			var clone = node.clone();

			clone.parent = parent;

			each(clone);

			parent.insertBefore(node, clone.nodes);

			++index;
		}

		node.removeSelf();

		return --index;
	}

	function eachAtEachRule(node, parent, index) {
		var params = node.params.split(' in ');

		var iterator = params[0].slice(1);

		var array = getValueAsValueOrArray(params.slice(1).join(' in '), parent);

		var start = -1;
		var end = array.length;

		while (++start < end) {
			setVariable(parent, iterator, array[start]);

			var clone = node.clone();

			clone.parent = parent;

			each(clone);

			parent.insertBefore(node, clone.nodes);

			++index;
		}

		node.removeSelf();

		return --index;
	}

	function eachAtIfRule(node, parent, index) {
		var params = postcss.list.space(node.params);

		var left = transformVariables(params[0], node);
		var operator = params[1];
		var right = transformVariables(params[2], node);

		if (
			(operator === '==' && left == right) ||
			(operator === '!=' && left != right) ||
			(operator === '<'  && left < right) ||
			(operator === '<='  && left <= right) ||
			(operator === '>'  && left > right) ||
			(operator === '>='  && left >= right)
		) {
			parent.insertBefore(node, node.nodes);
		}

		node.removeSelf();

		return --index;
	}

	function eachAtRule(node, parent, index) {
		if (node.name === 'for') index = eachAtForRule(node, parent, index);
		else if (node.name === 'each') index = eachAtEachRule(node, parent, index);
		else if (node.name === 'if') index = eachAtIfRule(node, parent, index);

		return index;
	}

	function eachRule(node, parent, index) {
		node.selector = transformVariables(node.selector, parent);

		return index;
	}

	function each(parent) {
		for (var index = 0, node; (node = parent.nodes[index]); ++index) {
			if (node.type === 'decl') index = eachDecl(node, parent, index);
			else if (node.type === 'atrule') index = eachAtRule(node, parent, index);
			else if (node.type === 'rule') index = eachRule(node, parent, index);

			if (node.nodes) each(node);
		}
	}

	return function (css) {
		each(css);
	};
});
