import type { ShikiLine } from './use-shiki-tokens.hook';
import { getHighlighter } from './get-highlighter';

interface HighlightCodeParams {
	code: string;
	language: 'javascript' | 'typescript' | 'json';
}

export async function highlightCode({ code, language }: HighlightCodeParams): Promise<ShikiLine[]> {
	const highlighter = await getHighlighter();

	const result = highlighter.codeToTokensBase(code, {
		lang: language,
		theme: 'night-owl',
	});

	return result.map(tokenLine => ({ tokens: tokenLine }));
}
