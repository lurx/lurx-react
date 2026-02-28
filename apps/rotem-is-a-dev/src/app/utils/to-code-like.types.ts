export type ToCodeLikeOptions = {
	prefix?: string;
	convertCase?: StringCaseOption;
}

export type StringCaseOption =
	| 'lowercase'
	| 'uppercase'
	| 'camelCase'
	| 'snake_case'
	| 'kebab-case'
	| 'comment';
