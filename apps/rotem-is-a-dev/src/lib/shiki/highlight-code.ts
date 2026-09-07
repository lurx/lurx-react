import { getHighlighter } from './get-highlighter';
import { toShikiLines } from './shiki.helpers';
import { CODE_THEMES } from './shiki.constants';
import type { HighlightCodeParams, ShikiLine } from './shiki.types';

export async function highlightCode({ code, language }: HighlightCodeParams): Promise<ShikiLine[]> {
	const highlighter = await getHighlighter();

	const result = highlighter.codeToTokens(code, {
		lang: language,
		themes: CODE_THEMES,
		defaultColor: false,
	});

	return toShikiLines(result.tokens);
}
