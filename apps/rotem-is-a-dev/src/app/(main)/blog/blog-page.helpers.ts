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
