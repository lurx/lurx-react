import { SERIES_META } from './data/blog-series.data';
import type { AnyPost, BlogListItem } from './blog-page.types';

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

export function groupPostsIntoListItems(posts: AnyPost[]): BlogListItem[] {
	const seriesGroups = new Map<string, AnyPost[]>();
	const standalonePosts: AnyPost[] = [];

	for (const post of posts) {
		const seriesSlug = post.series;

		if (seriesSlug && seriesSlug in SERIES_META) {
			const group = seriesGroups.get(seriesSlug);

			if (group) {
				group.push(post);
			} else {
				seriesGroups.set(seriesSlug, [post]);
			}
		} else {
			standalonePosts.push(post);
		}
	}

	const items: BlogListItem[] = standalonePosts.map(post => ({
		type: 'post' as const,
		post,
	}));

	for (const [seriesSlug, seriesPosts] of seriesGroups) {
		const sortedPosts = [...seriesPosts].sort(
			(postA, postB) => (postA.seriesOrder ?? 0) - (postB.seriesOrder ?? 0),
		);

		items.push({
			type: 'series' as const,
			meta: SERIES_META[seriesSlug as keyof typeof SERIES_META],
			posts: sortedPosts,
		});
	}

	items.sort((itemA, itemB) => {
		const dateA = itemA.type === 'post'
			? new Date(itemA.post.date).getTime()
			: Math.max(...itemA.posts.map(post => new Date(post.date).getTime()));
		const dateB = itemB.type === 'post'
			? new Date(itemB.post.date).getTime()
			: Math.max(...itemB.posts.map(post => new Date(post.date).getTime()));

		return dateB - dateA;
	});

	return items;
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
