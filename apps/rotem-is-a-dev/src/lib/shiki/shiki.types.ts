import type { ThemedToken } from 'shiki/core';

export type ShikiLine = {
	tokens: ThemedToken[];
}

export type UseShikiTokensParams = {
	code: string;
	language: 'javascript' | 'typescript' | 'json';
}

export type HighlightCodeParams = {
	code: string;
	language: 'javascript' | 'typescript' | 'json';
}
