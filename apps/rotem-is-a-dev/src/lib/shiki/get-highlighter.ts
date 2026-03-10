import type { HighlighterCore } from 'shiki/core';

let highlighterPromise: Promise<HighlighterCore> | null = null;

export async function getHighlighter(): Promise<HighlighterCore> {
	highlighterPromise ??= (async () => {
		const { createHighlighterCore } = await import('shiki/core');
		const { createOnigurumaEngine } = await import('shiki/engine/oniguruma');

		return createHighlighterCore({
			themes: [import('shiki/themes/night-owl')],
			langs: [
				import('shiki/langs/javascript'),
				import('shiki/langs/typescript'),
				import('shiki/langs/json'),
				import('shiki/langs/markdown'),
			],
			engine: createOnigurumaEngine(import('shiki/wasm')),
		});
	})();
	return highlighterPromise;
}
