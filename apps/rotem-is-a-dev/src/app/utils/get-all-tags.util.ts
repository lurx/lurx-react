type Taggable = { tags: string[] };

export function getAllTags<T extends Taggable>(items: T[]): string[] {
	return [...new Set(items.flatMap(item => item.tags))].sort((tagA, tagB) =>
		tagA.localeCompare(tagB),
	);
}
