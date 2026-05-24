import { groupPostsIntoListItems } from '../blog-page.helpers';

type MockPost = {
	slug: string;
	title: string;
	description: string;
	tags: string[];
	date: string;
	content: string;
	series?: string;
	seriesOrder?: number;
};

const makePost = (overrides: Partial<MockPost> = {}): MockPost => ({
	slug: 'default-post',
	title: 'Default Title',
	description: 'Default description',
	tags: [],
	date: '2024-01-01',
	content: '',
	...overrides,
});

describe('groupPostsIntoListItems', () => {
	it('wraps standalone posts as BlogListPost items', () => {
		const posts = [
			makePost({ slug: 'a', date: '2024-01-01' }),
			makePost({ slug: 'b', date: '2024-02-01' }),
		] as never[];

		const result = groupPostsIntoListItems(posts);

		expect(result).toHaveLength(2);
		expect(result.every(item => item.type === 'post')).toBe(true);
	});

	it('groups posts with the same series into a BlogListSeries item', () => {
		const posts = [
			makePost({ slug: 'a', series: 'agentic-ai-development', seriesOrder: 1, date: '2024-01-01' }),
			makePost({ slug: 'b', series: 'agentic-ai-development', seriesOrder: 2, date: '2024-01-02' }),
			makePost({ slug: 'c', date: '2024-01-03' }),
		] as never[];

		const result = groupPostsIntoListItems(posts);
		const seriesItems = result.filter(item => item.type === 'series');
		const postItems = result.filter(item => item.type === 'post');

		expect(seriesItems).toHaveLength(1);
		expect(postItems).toHaveLength(1);

		if (seriesItems[0].type === 'series') {
			expect(seriesItems[0].posts).toHaveLength(2);
			expect(seriesItems[0].meta.slug).toBe('agentic-ai-development');
		}
	});

	it('sorts series posts by seriesOrder within the group', () => {
		const posts = [
			makePost({ slug: 'part-3', series: 'agentic-ai-development', seriesOrder: 3, date: '2024-01-01' }),
			makePost({ slug: 'part-1', series: 'agentic-ai-development', seriesOrder: 1, date: '2024-01-01' }),
			makePost({ slug: 'part-2', series: 'agentic-ai-development', seriesOrder: 2, date: '2024-01-01' }),
		] as never[];

		const result = groupPostsIntoListItems(posts);
		const seriesItem = result.find(item => item.type === 'series');

		if (seriesItem?.type === 'series') {
			expect(seriesItem.posts[0].slug).toBe('part-1');
			expect(seriesItem.posts[1].slug).toBe('part-2');
			expect(seriesItem.posts[2].slug).toBe('part-3');
		}
	});

	it('sorts the final list by date, series using most recent post date', () => {
		const posts = [
			makePost({ slug: 'old-post', date: '2024-01-01' }),
			makePost({ slug: 'part-1', series: 'agentic-ai-development', seriesOrder: 1, date: '2024-06-01' }),
			makePost({ slug: 'new-post', date: '2024-03-01' }),
		] as never[];

		const result = groupPostsIntoListItems(posts);

		expect(result[0].type).toBe('series');
		if (result[1].type === 'post') {
			expect(result[1].post.slug).toBe('new-post');
		}
		if (result[2].type === 'post') {
			expect(result[2].post.slug).toBe('old-post');
		}
	});

	it('treats posts with unknown series slug as standalone', () => {
		const posts = [
			makePost({ slug: 'a', series: 'nonexistent-series', seriesOrder: 1, date: '2024-01-01' }),
		] as never[];

		const result = groupPostsIntoListItems(posts);

		expect(result).toHaveLength(1);
		expect(result[0].type).toBe('post');
	});

	it('returns an empty array for empty input', () => {
		expect(groupPostsIntoListItems([])).toEqual([]);
	});
});
