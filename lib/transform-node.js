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

// transform all nodes
export default function transformNode(node, opts) {
	// walk the children of the current node
	getNodesArray(node).forEach(
		child => {
			const type = child.type;

			if ('atrule' === type) {
				const name = child.name.toLowerCase();

				if ('content' === name) {
					// transform @content at-rules
					transformContentAtrule(child, opts);
				} else if ('each' === name) {
					// transform @each at-rules
					transformEachAtrule(child, opts);
				} else if ('if' === name) {
					// transform @if at-rules
					transformIfAtrule(child, opts);
				} else if ('import' === name) {
					transformImportAtrule(child, opts);
				} else if ('include' === name) {
					// transform @include at-rules
					transformIncludeAtrule(child, opts);
				} else if ('for' === name) {
					// transform @for at-rules
					transformForAtrule(child, opts);
				} else if ('mixin' === name) {
					// transform @for at-rules
					transformMixinAtrule(child, opts);
				} else {
					// transform all other at-rules
					transformAtrule(child, opts);
				}
			} else if ('decl' === type) {
				// transform declarations
				transformDecl(child, opts);
			} else if ('rule' === type) {
				// transform rule
				transformRule(child, opts);
			}

			// conditionally walk the children of the attached child
			if (child.parent) {
				transformNode(child, opts);
			}
		}
	);
}

// return the children of a node as an array
const getNodesArray = node => Array.from(Object(node).nodes || []);
