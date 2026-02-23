import { useEffect, useState } from 'react';
import type { ThemedToken } from 'shiki/core';

export interface ShikiLine {
	tokens: ThemedToken[];
}

interface UseShikiTokensParams {
	code: string;
	language: 'javascript' | 'typescript' | 'json';
}

export function useShikiTokens({ code, language }: UseShikiTokensParams): Nullable<ShikiLine[]> {
	const [lines, setLines] = useState<Nullable<ShikiLine[]>>(null);

	useEffect(() => {
		let cancelled = false;

		(async () => {
			const { getHighlighter } = await import('./get-highlighter');
			const highlighter = await getHighlighter();

			if (cancelled) return;

			const result = highlighter.codeToTokensBase(code, {
				lang: language,
				theme: 'night-owl',
			});

			setLines(result.map(tokenLine => ({ tokens: tokenLine })));
		})();

		return () => {
			cancelled = true;
		};
	}, [code, language]);

	return lines;
}
