import { formatDate, getAllTags, filterPosts, groupPostsIntoListItems } from '../blog-page.helpers';

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

describe('formatDate', () => {
	it('formats a date string to en-US long format', () => {
		const result = formatDate('2024-06-15');
		expect(result).toContain('June');
		expect(result).toContain('2024');
	});

	it('includes the day in the output', () => {
		const result = formatDate('2024-06-15');
		expect(result).toContain('15');
	});

	it('formats January correctly', () => {
		const result = formatDate('2023-01-01');
		expect(result).toContain('January');
		expect(result).toContain('2023');
	});
});

describe('getAllTags', () => {
	it('returns an empty array for an empty post list', () => {
		expect(getAllTags([])).toEqual([]);
	});

	it('returns unique tags from a single post', () => {
		const posts = [makePost({ tags: ['react', 'typescript'] })];
		expect(getAllTags(posts as never[])).toEqual(['react', 'typescript']);
	});

	it('deduplicates tags across multiple posts', () => {
		const posts = [
			makePost({ tags: ['react', 'typescript'] }),
			makePost({ tags: ['typescript', 'scss'] }),
		];
		expect(getAllTags(posts as never[])).toEqual(['react', 'scss', 'typescript']);
	});

	it('returns tags in sorted alphabetical order', () => {
		const posts = [makePost({ tags: ['zebra', 'apple', 'mango'] })];
		expect(getAllTags(posts as never[])).toEqual(['apple', 'mango', 'zebra']);
	});

	it('handles posts with no tags', () => {
		const posts = [makePost({ tags: [] }), makePost({ tags: ['react'] })];
		expect(getAllTags(posts as never[])).toEqual(['react']);
	});
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

describe('filterPosts', () => {
	const posts = [
		makePost({ slug: 'a', title: 'React Hooks', description: 'All about hooks', tags: ['react', 'typescript'] }),
		makePost({ slug: 'b', title: 'CSS Tricks', description: 'Styling tips', tags: ['css', 'scss'] }),
		makePost({ slug: 'c', title: 'TypeScript Guide', description: 'Advanced types', tags: ['typescript'] }),
	] as never[];

	describe('tag filtering', () => {
		it('returns all posts when no tags are selected', () => {
			expect(filterPosts(posts, [], '')).toHaveLength(3);
		});

		it('returns posts that match any of the selected tags', () => {
			const result = filterPosts(posts, ['react'], '');
			expect(result).toHaveLength(1);
			expect(result[0].title).toBe('React Hooks');
		});

		it('returns posts matching multiple selected tags', () => {
			const result = filterPosts(posts, ['react', 'css'], '');
			expect(result).toHaveLength(2);
		});

		it('returns an empty array when no posts match selected tags', () => {
			expect(filterPosts(posts, ['html'], '')).toHaveLength(0);
		});
	});

	describe('search filtering', () => {
		it('returns all posts when search is empty', () => {
			expect(filterPosts(posts, [], '')).toHaveLength(3);
		});

		it('filters by title (case-insensitive)', () => {
			const result = filterPosts(posts, [], 'react');
			expect(result).toHaveLength(1);
			expect(result[0].title).toBe('React Hooks');
		});

		it('filters by description (case-insensitive)', () => {
			const result = filterPosts(posts, [], 'STYLING');
			expect(result).toHaveLength(1);
			expect(result[0].title).toBe('CSS Tricks');
		});

		it('returns an empty array when search matches nothing', () => {
			expect(filterPosts(posts, [], 'nonexistent')).toHaveLength(0);
		});
	});

	describe('combined tag and search filtering', () => {
		it('applies both tag and search filters simultaneously', () => {
			const result = filterPosts(posts, ['typescript'], 'hooks');
			expect(result).toHaveLength(1);
			expect(result[0].title).toBe('React Hooks');
		});

		it('returns empty when tag matches but search does not', () => {
			expect(filterPosts(posts, ['react'], 'css')).toHaveLength(0);
		});

		it('returns empty when search matches but tag does not', () => {
			expect(filterPosts(posts, ['css'], 'react')).toHaveLength(0);
		});
	});
});
