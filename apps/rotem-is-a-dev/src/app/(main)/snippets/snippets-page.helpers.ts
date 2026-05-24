import type { SnippetItem } from './snippets-page.types';

export function formatDate(dateString: string): string {
	return new Date(dateString).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
}

export function getAllTags(snippets: SnippetItem[]): string[] {
	return [...new Set(snippets.flatMap(snippet => snippet.tags))].sort(
		(tagA, tagB) => tagA.localeCompare(tagB),
	);
}

export function filterSnippets(
	snippets: SnippetItem[],
	selectedTags: string[],
	search: string,
): SnippetItem[] {
	const searchLower = search.toLowerCase();

	return snippets.filter(snippet => {
		const matchesTags =
			selectedTags.length === 0 ||
			snippet.tags.some(tag => selectedTags.includes(tag));
		const matchesSearch =
			!search ||
			snippet.title.toLowerCase().includes(searchLower) ||
			snippet.description.toLowerCase().includes(searchLower);
		return matchesTags && matchesSearch;
	});
}

export function sortSnippetsByDate(snippets: SnippetItem[]): SnippetItem[] {
	return [...snippets].sort(
		(snippetA, snippetB) =>
			new Date(snippetB.date).getTime() - new Date(snippetA.date).getTime(),
	);
}
