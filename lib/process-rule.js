// tooling
import getReplacedString from './get-replaced-string';

// process a rule node
export default function processRule(rule, result, opts) {
	// update the rule selector with its variables replaced by their corresponding values
	rule.selector = getReplacedString(rule.selector, rule, result, opts);
}
