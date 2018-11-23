// tooling
import manageUnresolved from './manage-unresolved';
import transformNode from './transform-node';

// transform @content at-rules
export default function transformContentAtrule(rule, opts) {
	// if @content is supported
	if (opts.transform.includes('@content')) {
		// the closest @mixin at-rule
		const mixin = getClosestMixin(rule);

		// if the @mixin at-rule exists
		if (mixin) {
			// clone the @mixin at-rule
			const clone = mixin.original.clone({
				parent:    rule.parent,
				variables: rule.variables
			});

			// transform the clone children
			return transformNode(clone, opts).then(() => {
				// replace the @content at-rule with the clone children
				rule.parent.insertBefore(rule, clone.nodes);

				rule.remove();
			})

		} else {
			// otherwise, if the @mixin at-rule does not exist
			manageUnresolved(rule, opts, '@content', 'Could not resolve the mixin for @content');
		}
	}
}

// return the closest @mixin at-rule
const getClosestMixin = node => 'atrule' === node.type && 'mixin' === node.name
	? node
: node.parent && getClosestMixin(node.parent);
