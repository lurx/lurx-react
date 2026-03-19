import type { StringCaseOption, ToCodeLikeOptions } from './to-code-like.types';

const TO_CODE_LIKE_DEFAULT_OPTIONS: ToCodeLikeOptions = {
	convertCase: 'lowercase',
	prefix: '',
};

function normalizeString(str: string): string {
	return str.trim().replaceAll(/\s+/g, ' ');
}

const toComment = (str: string): string => {
	return `// ${str}`;
};

const toCamelCase = (str: string): string => {
	return str
		.toLowerCase()
		.split(/[\s_-]+/)
		.map((word, index) =>
			index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1),
		)
		.join('');
};

const toSnakeCase = (str: string): string => {
	return str
		.toLowerCase()
		.split(/[\s-]+/)
		.join('_');
};

const toKebabCase = (str: string): string => {
	return str
		.toLowerCase()
		.split(/[\s_]+/)
		.join('-');
};

const stringConverter: Record<StringCaseOption, (str: string) => string> = {
	lowercase: (str: string) => str.toLowerCase(),
	uppercase: (str: string) => str.toUpperCase(),
	camelCase: toCamelCase,
	snake_case: toSnakeCase,
	'kebab-case': toKebabCase,
	comment: toComment,
};

const handleCaseConversion = (
	str: string,
	convertCase?: StringCaseOption,
): string => {
	const normalizedString = normalizeString(str);
	if (!convertCase) return str;

	const converter = stringConverter[convertCase];

	if (!converter) {
		return str;
	}
	return converter(normalizedString);
};

export const toCodeLike = (str: string, options?: ToCodeLikeOptions) => {
	const { prefix, convertCase } = {
		...TO_CODE_LIKE_DEFAULT_OPTIONS,
		...options,
	};
	const convertedString = handleCaseConversion(str, convertCase);
	return `${prefix}${convertedString}`;
};
