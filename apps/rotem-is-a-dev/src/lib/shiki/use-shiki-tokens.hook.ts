import { useEffect, useState } from 'react';
import { CODE_THEMES } from './shiki.constants';
import { toShikiLines } from './shiki.helpers';
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

			const result = highlighter.codeToTokens(code, {
				lang: language,
				themes: CODE_THEMES,
				defaultColor: false,
			});

			setLines(toShikiLines(result.tokens));
		})();

		return () => {
			cancelled = true;
		};
	}, [code, language]);

	return lines;
}
