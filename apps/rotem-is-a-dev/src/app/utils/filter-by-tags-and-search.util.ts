type Filterable = {
	tags: string[];
	title: string;
	description: string;
};

export function filterByTagsAndSearch<T extends Filterable>(
	items: T[],
	selectedTags: string[],
	search: string,
): T[] {
	const searchLower = search.toLowerCase();

	return items.filter(item => {
		const matchesTags =
			selectedTags.length === 0 ||
			item.tags.some(tag => selectedTags.includes(tag));
		const matchesSearch =
			!search ||
			item.title.toLowerCase().includes(searchLower) ||
			item.description.toLowerCase().includes(searchLower);
		return matchesTags && matchesSearch;
	});
}
