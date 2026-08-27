import type { CSSProperties } from 'react';

export type ShikiToken = {
	content: string;
	style: CSSProperties;
};

export type ShikiLine = {
	tokens: ShikiToken[];
}

export type UseShikiTokensParams = {
	code: string;
	language: 'javascript' | 'typescript' | 'json' | 'markdown';
}

export type HighlightCodeParams = {
	code: string;
	language: 'javascript' | 'typescript' | 'json' | 'markdown';
}
