import { chunk } from '../chunk.snippet';

describe('chunk', () => {
	it('splits an array into chunks of the given size', () => {
		expect(chunk([1, 2, 3, 4, 5], 2)).toEqual([[1, 2], [3, 4], [5]]);
	});

	it('handles an array that divides evenly', () => {
		expect(chunk([1, 2, 3, 4], 2)).toEqual([[1, 2], [3, 4]]);
	});

	it('returns the whole array in one chunk when size >= length', () => {
		expect(chunk([1, 2, 3], 5)).toEqual([[1, 2, 3]]);
	});

	it('returns an empty array for empty input', () => {
		expect(chunk([], 3)).toEqual([]);
	});

	it('throws a RangeError for size <= 0', () => {
		expect(() => chunk([1, 2], 0)).toThrow(RangeError);
		expect(() => chunk([1, 2], -1)).toThrow(RangeError);
	});
});
