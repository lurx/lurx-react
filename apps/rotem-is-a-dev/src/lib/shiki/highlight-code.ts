import { getHighlighter } from './get-highlighter';
import type { HighlightCodeParams, ShikiLine } from './shiki.types';

export async function highlightCode({ code, language }: HighlightCodeParams): Promise<ShikiLine[]> {
	const highlighter = await getHighlighter();

	const result = highlighter.codeToTokensBase(code, {
		lang: language,
		theme: 'night-owl',
	});

	return result.map(tokenLine => ({ tokens: tokenLine }));
}
