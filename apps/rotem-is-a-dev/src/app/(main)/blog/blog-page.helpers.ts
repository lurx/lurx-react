import type { Post } from "@/.velite";

export function formatDate(dateString: string): string {
	return new Date(dateString).toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	});
}

export function getAllTags(posts: Post[]): string[] {
  return [...new Set(posts.flatMap(post => post.tags))].sort();
}

export function filterPosts(
	posts: Post[],
	selectedTags: string[],
	search: string,
): Post[] {
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
