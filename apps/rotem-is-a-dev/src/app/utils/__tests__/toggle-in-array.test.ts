import { toggleInArray } from '../toggle-in-array.util';

describe('toggleInArray', () => {
	describe('adding items', () => {
		it('adds an item when it is not present', () => {
			expect(toggleInArray(['a', 'b'], 'c')).toEqual(['a', 'b', 'c']);
		});

		it('adds an item to an empty array', () => {
			expect(toggleInArray([], 'x')).toEqual(['x']);
		});

		it('works with numbers when adding', () => {
			expect(toggleInArray([1, 2, 3], 4)).toEqual([1, 2, 3, 4]);
		});
	});

	describe('removing items', () => {
		it('removes an item when it is present', () => {
			expect(toggleInArray(['a', 'b', 'c'], 'b')).toEqual(['a', 'c']);
		});

		it('removes a number when it is present', () => {
			expect(toggleInArray([1, 2, 3], 2)).toEqual([1, 3]);
		});
	});

	describe('order preservation', () => {
		it('preserves order of remaining items after removal', () => {
			expect(toggleInArray(['a', 'b', 'c', 'd'], 'b')).toEqual(['a', 'c', 'd']);
		});

		it('appends the new item at the end', () => {
			const result = toggleInArray(['z', 'a'], 'm');
			expect(result.at(-1)).toBe('m');
		});
	});

	describe('immutability', () => {
		it('does not mutate the original array when adding', () => {
			const original = ['a', 'b'];
			toggleInArray(original, 'c');
			expect(original).toEqual(['a', 'b']);
		});

		it('does not mutate the original array when removing', () => {
			const original = ['a', 'b', 'c'];
			toggleInArray(original, 'b');
			expect(original).toEqual(['a', 'b', 'c']);
		});
	});
});
