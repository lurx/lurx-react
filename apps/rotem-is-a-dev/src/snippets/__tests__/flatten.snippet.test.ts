import { flatten } from '../flatten.snippet';

describe('flatten', () => {
	it('flattens a one-level nested array', () => {
		expect(flatten([1, [2, 3], [4]])).toEqual([1, 2, 3, 4]);
	});

	it('flattens deeply nested arrays', () => {
		expect(flatten([1, [2, [3, [4]]]])).toEqual([1, 2, 3, 4]);
	});

	it('returns an empty array for empty input', () => {
		expect(flatten([])).toEqual([]);
	});

	it('handles an already flat array', () => {
		expect(flatten([1, 2, 3])).toEqual([1, 2, 3]);
	});

	it('handles mixed depth nesting', () => {
		expect(flatten([[1], 2, [[3, 4], 5]])).toEqual([1, 2, 3, 4, 5]);
	});
});
