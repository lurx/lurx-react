interface ToCodeLikeOptions {
	// options for the function can be added here in the future
	prefix?: string; // e.g. to add a specific prefix to the output
	convertCase?: StringCaseOption; // e.g. to specify the case conversion
}

type StringCaseOption =
	| 'lowercase'
	| 'uppercase'
	| 'camelCase'
	| 'snake_case'
	| 'kebab-case'
	| 'comment';

const TO_CODE_LIKE_DEFAULT_OPTIONS: ToCodeLikeOptions = {
	convertCase: 'lowercase',
	prefix: '',
};

function normalizeString(str: string): string {
	return str.trim().replace(/\s+/g, ' ');
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
		console.warn(`Unsupported convertCase option: ${convertCase}. Returning original string.`);
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
