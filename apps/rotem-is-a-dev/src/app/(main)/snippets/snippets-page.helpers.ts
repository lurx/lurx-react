import type { SnippetItem } from './snippets-page.types';

export function sortSnippetsByDate(snippets: SnippetItem[]): SnippetItem[] {
	return [...snippets].sort(
		(snippetA, snippetB) =>
			new Date(snippetB.date).getTime() - new Date(snippetA.date).getTime(),
	);
}
