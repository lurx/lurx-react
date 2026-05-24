import { filterByTagsAndSearch } from '../filter-by-tags-and-search.util';

type Item = {
	title: string;
	description: string;
	tags: string[];
};

const items: Item[] = [
	{ title: 'React Hooks', description: 'All about hooks', tags: ['react', 'typescript'] },
	{ title: 'CSS Tricks', description: 'Styling tips', tags: ['css', 'scss'] },
	{ title: 'TypeScript Guide', description: 'Advanced types', tags: ['typescript'] },
];

describe('filterByTagsAndSearch', () => {
	describe('tag filtering', () => {
		it('returns all items when no tags are selected', () => {
			expect(filterByTagsAndSearch(items, [], '')).toHaveLength(3);
		});

		it('returns items that match any of the selected tags', () => {
			const result = filterByTagsAndSearch(items, ['react'], '');
			expect(result).toHaveLength(1);
			expect(result[0].title).toBe('React Hooks');
		});

		it('returns items matching multiple selected tags', () => {
			const result = filterByTagsAndSearch(items, ['react', 'css'], '');
			expect(result).toHaveLength(2);
		});

		it('returns an empty array when no items match selected tags', () => {
			expect(filterByTagsAndSearch(items, ['html'], '')).toHaveLength(0);
		});
	});

	describe('search filtering', () => {
		it('returns all items when search is empty', () => {
			expect(filterByTagsAndSearch(items, [], '')).toHaveLength(3);
		});

		it('filters by title (case-insensitive)', () => {
			const result = filterByTagsAndSearch(items, [], 'react');
			expect(result).toHaveLength(1);
			expect(result[0].title).toBe('React Hooks');
		});

		it('filters by description (case-insensitive)', () => {
			const result = filterByTagsAndSearch(items, [], 'STYLING');
			expect(result).toHaveLength(1);
			expect(result[0].title).toBe('CSS Tricks');
		});

		it('returns an empty array when search matches nothing', () => {
			expect(filterByTagsAndSearch(items, [], 'nonexistent')).toHaveLength(0);
		});
	});

	describe('combined tag and search filtering', () => {
		it('applies both tag and search filters simultaneously', () => {
			const result = filterByTagsAndSearch(items, ['typescript'], 'hooks');
			expect(result).toHaveLength(1);
			expect(result[0].title).toBe('React Hooks');
		});

		it('returns empty when tag matches but search does not', () => {
			expect(filterByTagsAndSearch(items, ['react'], 'css')).toHaveLength(0);
		});

		it('returns empty when search matches but tag does not', () => {
			expect(filterByTagsAndSearch(items, ['css'], 'react')).toHaveLength(0);
		});
	});
});
