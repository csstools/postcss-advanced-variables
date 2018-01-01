// tooling
import getReplacedString from './get-replaced-string';

export default function processAtrule(atrule, result, opts) {
	// update the atrule params with its variables replaced by their corresponding values
	atrule.params = getReplacedString(atrule.params, atrule, result, opts);
}
