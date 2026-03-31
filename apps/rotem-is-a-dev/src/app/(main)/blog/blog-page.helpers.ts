import type { AnyPost } from './blog-page.types';

export function formatDate(dateString: string): string {
	return new Date(dateString).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
}

export function getAllTags(posts: AnyPost[]): Technology[] {
  return [...new Set(posts.flatMap(post => post.tags))].sort((tagA, tagB) => tagA.localeCompare(tagB)) as Technology[];
}

export function filterPosts(
	posts: AnyPost[],
	selectedTags: string[],
	search: string,
): AnyPost[] {
	const searchLower = search.toLowerCase();

	return posts.filter(post => {
		const matchesTags =
			selectedTags.length === 0 ||
			post.tags.some(tag => selectedTags.includes(tag));
		const matchesSearch =
			!search ||
			post.title.toLowerCase().includes(searchLower) ||
			post.description.toLowerCase().includes(searchLower);
		return matchesTags && matchesSearch;
	});
}
