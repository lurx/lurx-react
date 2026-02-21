import { groupBy } from '../group-by.snippet';

describe('groupBy', () => {
	it('groups items by a string key', () => {
		const items = [
			{ type: 'alpha', val: 1 },
			{ type: 'beta', val: 2 },
			{ type: 'alpha', val: 3 },
		];
		expect(groupBy(items, 'type')).toEqual({
			alpha: [
				{ type: 'alpha', val: 1 },
				{ type: 'alpha', val: 3 },
			],
			beta: [{ type: 'beta', val: 2 }],
		});
	});

	it('groups items by a numeric key', () => {
		const items = [
			{ score: 10, name: 'alice' },
			{ score: 20, name: 'bob' },
			{ score: 10, name: 'carol' },
		];
		const result = groupBy(items, 'score');
		expect(result['10']).toHaveLength(2);
		expect(result['20']).toHaveLength(1);
	});

	it('returns an empty object for an empty array', () => {
		expect(groupBy([], 'key' as never)).toEqual({});
	});
});
