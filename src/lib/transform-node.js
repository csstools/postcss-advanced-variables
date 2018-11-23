// tooling
import transformDecl from './transform-decl';
import transformAtrule from './transform-atrule';
import transformEachAtrule from './transform-each-atrule';
import transformIfAtrule from './transform-if-atrule';
import transformImportAtrule from './transform-import-atrule';
import transformIncludeAtrule from './transform-include-atrule';
import transformForAtrule from './transform-for-atrule';
import transformMixinAtrule from './transform-mixin-atrule';
import transformRule from './transform-rule';
import transformContentAtrule from './transform-content-atrule';
import waterfall from './waterfall';

export default function transformNode(node, opts) {
	return waterfall(
		getNodesArray(node),
		child => transformRuleOrDecl(child, opts).then(() => {
			// conditionally walk the children of the attached child
			if (child.parent) {
				return transformNode(child, opts);
			}
		})
	);
}

function transformRuleOrDecl(child, opts) {
	return Promise.resolve().then(() => {
		const type = child.type;

		if ('atrule' === type) {
			const name = child.name.toLowerCase();

			if ('content' === name) {
				// transform @content at-rules
				return transformContentAtrule(child, opts);
			} else if ('each' === name) {
				// transform @each at-rules
				return transformEachAtrule(child, opts);
			} else if ('if' === name) {
				// transform @if at-rules
				return transformIfAtrule(child, opts);
			} else if ('import' === name) {
				return transformImportAtrule(child, opts);
			} else if ('include' === name) {
				// transform @include at-rules
				return transformIncludeAtrule(child, opts);
			} else if ('for' === name) {
				// transform @for at-rules
				return transformForAtrule(child, opts);
			} else if ('mixin' === name) {
				// transform mixin at-rules
				return transformMixinAtrule(child, opts);
			} else {
				// transform all other at-rules
				return transformAtrule(child, opts);
			}
		} else if ('decl' === type) {
			// transform declarations
			return transformDecl(child, opts);
		} else if ('rule' === type) {
			// transform rule
			return transformRule(child, opts);
		}
	})
}

// return the children of a node as an array
const getNodesArray = node => Array.from(Object(node).nodes || []);
