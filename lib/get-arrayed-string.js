// tooling
import { list } from 'postcss';

// return '(hello), (goodbye)' as [[hello], [goodbye]]
export default function getArrayedString(string, useSingleValue) {
	// the string as an array
	const stringArray = getCommaSplitString(string).map(
		substring => matchWrappingParens.test(substring) ? getArrayedString(getStringWithoutWrappingParentheses(substring), false) : substring
	);

	// the string array or its first item
	const returnValue = useSingleValue && 1 === stringArray.length ? stringArray[0] : stringArray;

	return returnValue;
}

// return string split by commas
const getCommaSplitString = string => list.comma(string);

// return string without wrapping parentheses
const getStringWithoutWrappingParentheses = string => string.replace(matchWrappingParens, '$1');

// matching wrapping parentheses
const matchWrappingParens = /^\((.*)\)$/g;
