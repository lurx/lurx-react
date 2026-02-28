import { formatDate, getAllTags, filterPosts } from '../blog-page.helpers';

type MockPost = {
	slug: string;
	title: string;
	description: string;
	tags: string[];
	date: string;
	content: string;
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
