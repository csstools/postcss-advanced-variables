// tooling
import transformDecl from './transform-decl';
import transformAtrule from './transform-atrule';
import transformEachAtrule from './transform-each-atrule';
import transformForAtrule from './transform-for-atrule';
import transformIfAtrule from './transform-if-atrule';
import transformRule from './transform-rule';

// transform all nodes
export default function transformNode(node, result, opts) {
	// walk the children of the current node
	getNodesArray(node).forEach(
		childNode => {
			if ('atrule' === childNode.type) {
				if ('each' === childNode.name) {
					// transform @each at-rules
					transformEachAtrule(childNode, result, opts);
				} else if ('if' === childNode.name) {
					// transform @if at-rules
					transformIfAtrule(childNode, result, opts);
				} else if ('for' === childNode.name) {
					// transform @for at-rules
					transformForAtrule(childNode, result, opts);
				} else {
					// transform all other at-rules
					transformAtrule(childNode, result, opts);
				}
			} else if ('decl' === childNode.type) {
				// transform declarations
				transformDecl(childNode, result, opts);
			} else if ('rule' === childNode.type) {
				// transform rule
				transformRule(childNode, result, opts);
			}

			// conditionally walk grandchildren if the current child still has a parent
			if (childNode.parent) {
				transformNode(childNode, result, opts);
			}
		}
	);
}

// return the children of a node as an array
const getNodesArray = node => Array.from(Object(node).nodes || []);
