import { getOpacity } from '../hero-snippets.helpers';

describe('getOpacity', () => {
	describe('active item', () => {
		it('returns 1 when index equals active', () => {
			expect(getOpacity(0, 0, 5)).toBe(1);
		});

		it('returns 1 for the active item anywhere in the list', () => {
			expect(getOpacity(3, 3, 7)).toBe(1);
		});
	});

	describe('adjacent items (dist === 1)', () => {
		it('returns 0.4 for the item one after the active', () => {
			expect(getOpacity(1, 0, 5)).toBe(0.4);
		});

		it('returns 0.4 for the item one before the active', () => {
			expect(getOpacity(4, 0, 5)).toBe(0.4);
		});

		it('returns 0.4 for adjacent items with a different active index', () => {
			expect(getOpacity(2, 3, 7)).toBe(0.4);
			expect(getOpacity(4, 3, 7)).toBe(0.4);
		});
	});

	describe('distant items (dist >= 2)', () => {
		it('returns 0.1 for items two positions away', () => {
			expect(getOpacity(2, 0, 5)).toBe(0.1);
		});

		it('returns 0.1 for items three positions away', () => {
			expect(getOpacity(3, 0, 7)).toBe(0.1);
		});
	});

	describe('wrapping behavior', () => {
		it('treats the last item as adjacent to the first when active is 0', () => {
			// total 5: index 4 is one step before index 0 in circular terms
			expect(getOpacity(4, 0, 5)).toBe(0.4);
		});

		it('treats the first item as adjacent to the last when active is last', () => {
			// total 5, active 4: index 0 is one step after in circular terms
			expect(getOpacity(0, 4, 5)).toBe(0.4);
		});

		it('wraps correctly with total of 3', () => {
			// active 0: index 1 and 2 are both one step away in a ring of 3
			expect(getOpacity(1, 0, 3)).toBe(0.4);
			expect(getOpacity(2, 0, 3)).toBe(0.4);
		});

		it('wraps correctly with an even total', () => {
			// total 6, active 0: index 3 is the furthest point (dist === 3 after fold)
			expect(getOpacity(3, 0, 6)).toBe(0.1);
		});

		it('returns 1 for the active item at the boundary', () => {
			expect(getOpacity(0, 0, 10)).toBe(1);
			expect(getOpacity(9, 9, 10)).toBe(1);
		});
	});

	describe('various total sizes', () => {
		it('works with a total of 2', () => {
			expect(getOpacity(0, 0, 2)).toBe(1);
			expect(getOpacity(1, 0, 2)).toBe(0.4);
		});

		it('works with a total of 4', () => {
			expect(getOpacity(1, 0, 4)).toBe(0.4);
			expect(getOpacity(2, 0, 4)).toBe(0.1);
		});

		it('works with a large total', () => {
			expect(getOpacity(50, 50, 100)).toBe(1);
			expect(getOpacity(51, 50, 100)).toBe(0.4);
			expect(getOpacity(52, 50, 100)).toBe(0.1);
		});
	});
});
