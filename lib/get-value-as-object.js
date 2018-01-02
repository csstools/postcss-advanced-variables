// tooling
import { list } from 'postcss';

// return sass-like arrays as literal arrays ('(hello), (goodbye)' to [[hello], [goodbye]])
export default function getValueAsObject(value) {
	const hasWrappingParens = matchWrappingParens.test(value);
	const unwrappedValue = String(hasWrappingParens ? value.replace(matchWrappingParens, '$1') : value).replace(matchTrailingComma, '');
	const separatedValue = list.comma(unwrappedValue);
	const firstValue = separatedValue[0];

	if (firstValue === value) {
		return value;
	} else {
		const objectValue = {};
		const arrayValue  = [];

		separatedValue.forEach(
			(subvalue, index) => {
				const [ match, key, keyvalue ] = subvalue.match(matchDeclaration) || [];

				if (match) {
					objectValue[key] = getValueAsObject(keyvalue);
				} else {
					arrayValue[index] = getValueAsObject(subvalue);
				}
			}
		);

		const transformedValue = Object.keys(objectValue).length > 0
			? Object.assign(objectValue, arrayValue)
		: arrayValue;

		return transformedValue;
	}
}

// match wrapping parentheses ((), (anything), (anything (anything)))
const matchWrappingParens = /^\(([\W\w]*)\)$/g;

// match a property name (any-possible_name)
const matchDeclaration = /^([\w-]+)\s*:\s*([\W\w]+)\s*$/;

// match a trailing comma
const matchTrailingComma = /\s*,\s*$/;
