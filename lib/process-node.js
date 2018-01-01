// tooling
import processDecl from './process-decl';
import processAtrule from './process-atrule';
import processEachAtrule from './process-each-atrule';
import processForAtrule from './process-for-atrule';
import processIfAtrule from './process-if-atrule';
import processRule from './process-rule';

// transform all nodes
export default function processNode(node, result, opts) {
	// walk each child of the node
	getNodesArray(node).forEach(
		childNode => {
			if ('decl' === childNode.type) {
				// process a declaration node
				processDecl(childNode, result, opts);
			} else if ('atrule' === childNode.type) {
				if ('each' === childNode.name) {
					// process an each at-rule node
					processEachAtrule(childNode, result, opts);
				} else if ('if' === childNode.name) {
					// process an if at-rule node
					processIfAtrule(childNode, result, opts);
				} else if ('for' === childNode.name) {
					// process a for at-rule node
					processForAtrule(childNode, result, opts);
				} else {
					// process any other at-rule node
					processAtrule(childNode, result, opts);
				}
			} else if ('rule' === childNode.type) {
				// process a rule node
				processRule(childNode, result, opts);
			}

			// walk the child-node if it still has a parent
			if (childNode.parent) {
				processNode(childNode, result, opts);
			}
		}
	);
}

// get the children of a node as an array
const getNodesArray = node => Array.from(Object(node).nodes || []);
