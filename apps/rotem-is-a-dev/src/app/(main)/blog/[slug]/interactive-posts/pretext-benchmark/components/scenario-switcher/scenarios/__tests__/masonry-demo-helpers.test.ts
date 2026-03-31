import { prepareCards, computeMasonryLayout } from '../masonry-demo.helpers';
import type { PreparedCard } from '../masonry-demo.helpers';

// ─── Mock @chenglou/pretext ─────────────────────────────────────────────────

const mockPrepared = { __brand: 'prepared' };

jest.mock('@chenglou/pretext', () => ({
	prepare: jest.fn(() => mockPrepared),
	layout: jest.fn(() => ({ height: 44, lineCount: 2 })),
}));

// ─── Tests ──────────────────────────────────────────────────────────────────

describe('prepareCards', () => {
	it('returns exactly 12 cards', () => {
		const cards = prepareCards();

		expect(cards).toHaveLength(12);
	});

	it('each card has text, prepared, and colorIndex properties', () => {
		const cards = prepareCards();

		for (const card of cards) {
			expect(card).toHaveProperty('text');
			expect(card).toHaveProperty('prepared');
			expect(card).toHaveProperty('colorIndex');
		}
	});

	it('each card has a non-empty text string', () => {
		const cards = prepareCards();

		for (const card of cards) {
			expect(typeof card.text).toBe('string');
			expect(card.text.length).toBeGreaterThan(0);
		}
	});

	it('each card has a prepared handle from pretext', () => {
		const cards = prepareCards();

		for (const card of cards) {
			expect(card.prepared).toBe(mockPrepared);
		}
	});

	it('colorIndex cycles through 0-7', () => {
		const cards = prepareCards();

		for (let idx = 0; idx < cards.length; idx++) {
			expect(cards[idx].colorIndex).toBe(idx % 8);
		}
	});

	it('calls prepare for each card text', () => {
		const { prepare } = require('@chenglou/pretext');
		prepare.mockClear();

		prepareCards();

		expect(prepare).toHaveBeenCalledTimes(12);
	});
});

describe('computeMasonryLayout', () => {
	const makeMockCards = (count: number): PreparedCard[] =>
		Array.from({ length: count }, (_, idx) => ({
			text: `Card ${idx}`,
			prepared: mockPrepared as never,
			colorIndex: idx % 8,
		}));

	it('returns positionedCards and contentHeight', () => {
		const cards = makeMockCards(4);
		const result = computeMasonryLayout(cards, 600);

		expect(result).toHaveProperty('positionedCards');
		expect(result).toHaveProperty('contentHeight');
	});

	it('positions all cards', () => {
		const cards = makeMockCards(6);
		const result = computeMasonryLayout(cards, 600);

		expect(result.positionedCards).toHaveLength(6);
	});

	it('assigns cardIndex matching the original index', () => {
		const cards = makeMockCards(4);
		const result = computeMasonryLayout(cards, 600);

		for (let idx = 0; idx < cards.length; idx++) {
			expect(result.positionedCards[idx].cardIndex).toBe(idx);
		}
	});

	describe('column count at different widths', () => {
		it('uses 1 column for very narrow containers', () => {
			const cards = makeMockCards(3);
			const result = computeMasonryLayout(cards, 200);

			// All cards should have x = 0 (single column)
			const uniqueX = new Set(result.positionedCards.map(card => card.x));
			expect(uniqueX.size).toBe(1);
		});

		it('uses multiple columns for wider containers', () => {
			const cards = makeMockCards(6);
			// Width 600 with gap 12 and min col width 200: floor((600+12)/(200+12)) = 2
			const result = computeMasonryLayout(cards, 600);

			const uniqueX = new Set(result.positionedCards.map(card => card.x));
			expect(uniqueX.size).toBeGreaterThan(1);
		});

		it('increases column count with wider containers', () => {
			const cards = makeMockCards(8);
			const narrowResult = computeMasonryLayout(cards, 400);
			const wideResult = computeMasonryLayout(cards, 1000);

			const narrowColumns = new Set(narrowResult.positionedCards.map(card => card.x)).size;
			const wideColumns = new Set(wideResult.positionedCards.map(card => card.x)).size;

			expect(wideColumns).toBeGreaterThanOrEqual(narrowColumns);
		});
	});

	describe('shortest-column assignment', () => {
		it('places the first card at y=0', () => {
			const cards = makeMockCards(1);
			const result = computeMasonryLayout(cards, 600);

			expect(result.positionedCards[0].y).toBe(0);
		});

		it('distributes cards across columns', () => {
			const cards = makeMockCards(4);
			// With 2 columns, cards should alternate between columns initially
			const result = computeMasonryLayout(cards, 424);
			// 424+12 = 436, 436/212 = 2.05 => 2 columns

			const columnsUsed = new Set(result.positionedCards.map(card => card.x));
			expect(columnsUsed.size).toBe(2);
		});
	});

	describe('card positioning', () => {
		it('each positioned card has x, y, width, and height', () => {
			const cards = makeMockCards(3);
			const result = computeMasonryLayout(cards, 600);

			for (const card of result.positionedCards) {
				expect(typeof card.x).toBe('number');
				expect(typeof card.y).toBe('number');
				expect(typeof card.width).toBe('number');
				expect(typeof card.height).toBe('number');
			}
		});

		it('card widths are positive', () => {
			const cards = makeMockCards(3);
			const result = computeMasonryLayout(cards, 600);

			for (const card of result.positionedCards) {
				expect(card.width).toBeGreaterThan(0);
			}
		});

		it('card heights include padding', () => {
			const cards = makeMockCards(1);
			const result = computeMasonryLayout(cards, 600);

			// layout returns height: 44, plus 2 * CARD_PADDING (16) = 44 + 32 = 76
			expect(result.positionedCards[0].height).toBe(76);
		});

		it('x positions are non-negative', () => {
			const cards = makeMockCards(6);
			const result = computeMasonryLayout(cards, 600);

			for (const card of result.positionedCards) {
				expect(card.x).toBeGreaterThanOrEqual(0);
			}
		});
	});

	describe('contentHeight', () => {
		it('returns a positive contentHeight when cards are present', () => {
			const cards = makeMockCards(4);
			const result = computeMasonryLayout(cards, 600);

			expect(result.contentHeight).toBeGreaterThan(0);
		});

		it('returns 0 contentHeight for empty card list', () => {
			const result = computeMasonryLayout([], 600);

			expect(result.contentHeight).toBe(0);
		});

		it('contentHeight increases with more cards', () => {
			const fewCards = makeMockCards(2);
			const manyCards = makeMockCards(12);

			const fewResult = computeMasonryLayout(fewCards, 600);
			const manyResult = computeMasonryLayout(manyCards, 600);

			expect(manyResult.contentHeight).toBeGreaterThan(fewResult.contentHeight);
		});
	});
});
