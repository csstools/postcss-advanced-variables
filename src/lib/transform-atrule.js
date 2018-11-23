// tooling
import getReplacedString from './get-replaced-string';

// transform generic at-rules
export default function transformAtrule(rule, opts) {
	// update the at-rule params with its variables replaced by their corresponding values
	rule.params = getReplacedString(rule.params, rule, opts);
}
