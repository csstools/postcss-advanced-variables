// tooling
import getReplacedString from './get-replaced-string';

// transform a rule node
export default function transformRule(rule, result, opts) {
	// update the rule selector with its variables replaced by their corresponding values
	rule.selector = getReplacedString(rule.selector, rule, result, opts);
}
