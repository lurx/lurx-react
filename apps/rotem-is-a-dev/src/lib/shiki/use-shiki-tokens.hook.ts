import { useEffect, useState } from 'react';
import type { ShikiLine, UseShikiTokensParams } from './shiki.types';

export type { ShikiLine } from './shiki.types';

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
