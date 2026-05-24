import { getAllTags } from '../get-all-tags.util';

type Item = { tags: string[] };

describe('getAllTags', () => {
	it('returns an empty array for an empty list', () => {
		expect(getAllTags<Item>([])).toEqual([]);
	});

	it('returns unique tags from a single item', () => {
		const items: Item[] = [{ tags: ['react', 'typescript'] }];
		expect(getAllTags(items)).toEqual(['react', 'typescript']);
	});

	it('deduplicates tags across multiple items', () => {
		const items: Item[] = [
			{ tags: ['react', 'typescript'] },
			{ tags: ['typescript', 'scss'] },
		];
		expect(getAllTags(items)).toEqual(['react', 'scss', 'typescript']);
	});

	it('returns tags in sorted alphabetical order', () => {
		const items: Item[] = [{ tags: ['zebra', 'apple', 'mango'] }];
		expect(getAllTags(items)).toEqual(['apple', 'mango', 'zebra']);
	});

	it('handles items with no tags', () => {
		const items: Item[] = [{ tags: [] }, { tags: ['react'] }];
		expect(getAllTags(items)).toEqual(['react']);
	});
});
