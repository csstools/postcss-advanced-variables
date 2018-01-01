// tooling
import transformNode from './transform-node';

// transform @content at-rules
export default function transformContentAtrule(atrule, result, opts) {
	const closest = getClosestMixin(atrule);

	if (closest) {
		// clone the mixin at-rule
		const clone = closest.original.clone({
			parent:    atrule.parent,
			variables: atrule.variables
		});

		// transform the clone
		transformNode(clone, result, opts);

		// insert the children of the clone before the @content at-rule
		atrule.parent.insertBefore(atrule, clone.nodes);
	}

	// remove the @content at-rule
	atrule.remove();
}

// return the closest @mixin at-rule
const getClosestMixin = node => 'atrule' === node.type && 'mixin' === node.name
	? node
: node.parent && getClosestMixin(node.parent);
