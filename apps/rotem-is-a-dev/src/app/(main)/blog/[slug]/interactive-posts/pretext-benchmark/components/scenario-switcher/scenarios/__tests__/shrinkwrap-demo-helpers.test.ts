import { computeShrinkwrap } from '../shrinkwrap-demo.helpers';
import type { ShrinkwrapResult } from '../shrinkwrap-demo.helpers';

// ─── Mock @chenglou/pretext ─────────────────────────────────────────────────

let mockLayoutCallCount = 0;

jest.mock('@chenglou/pretext', () => ({
	prepare: jest.fn(() => ({ __brand: 'prepared' })),
	layout: jest.fn((_: unknown, maxWidth: number) => {
		mockLayoutCallCount++;
		// Simulate: narrower widths cause more lines
		if (maxWidth < 100) return { height: 96, lineCount: 4 };
		if (maxWidth < 200) return { height: 72, lineCount: 3 };

		return { height: 48, lineCount: 2 };
	}),
}));

// ─── Mock DOM ───────────────────────────────────────────────────────────────

const mockContainer = {
	textContent: '',
	style: { cssText: '' },
	getBoundingClientRect: jest.fn(() => ({
		width: 250,
		height: 48,
		top: 0,
		left: 0,
		bottom: 48,
		right: 250,
		x: 0,
		y: 0,
		toJSON: jest.fn(),
	})),
};

beforeEach(() => {
	mockLayoutCallCount = 0;
	jest.spyOn(document, 'createElement').mockReturnValue(mockContainer as unknown as HTMLElement);
	jest.spyOn(document.body, 'appendChild').mockReturnValue(mockContainer as unknown as HTMLElement);
	jest.spyOn(document.body, 'removeChild').mockReturnValue(mockContainer as unknown as HTMLElement);
});

afterEach(() => {
	jest.restoreAllMocks();
});

// ─── Tests ──────────────────────────────────────────────────────────────────

describe('computeShrinkwrap', () => {
	const sampleTexts = [
		'Hello, this is a test message for the shrinkwrap demo.',
		'Another message that needs to be measured.',
	];

	it('returns an array of results matching the input length', () => {
		const results = computeShrinkwrap(sampleTexts);

		expect(results).toHaveLength(2);
	});

	it('each result has the expected shape', () => {
		const results = computeShrinkwrap(sampleTexts);

		for (const result of results) {
			expect(result).toHaveProperty('text');
			expect(result).toHaveProperty('fitContentWidth');
			expect(result).toHaveProperty('shrinkwrapWidth');
			expect(result).toHaveProperty('lineCount');
			expect(result).toHaveProperty('wastePercent');
		}
	});

	it('preserves the original text in each result', () => {
		const results = computeShrinkwrap(sampleTexts);

		expect(results[0].text).toBe(sampleTexts[0]);
		expect(results[1].text).toBe(sampleTexts[1]);
	});

	it('fitContentWidth is a rounded number from getBoundingClientRect', () => {
		const results = computeShrinkwrap(sampleTexts);

		// Mock returns width: 250
		expect(results[0].fitContentWidth).toBe(250);
	});

	it('lineCount is a positive integer', () => {
		const results = computeShrinkwrap(sampleTexts);

		for (const result of results) {
			expect(result.lineCount).toBeGreaterThan(0);
			expect(Number.isInteger(result.lineCount)).toBe(true);
		}
	});

	it('wastePercent is a non-negative number', () => {
		const results = computeShrinkwrap(sampleTexts);

		for (const result of results) {
			expect(result.wastePercent).toBeGreaterThanOrEqual(0);
		}
	});

	describe('binary search convergence', () => {
		it('shrinkwrapWidth is less than or equal to fitContentWidth', () => {
			const results = computeShrinkwrap(sampleTexts);

			for (const result of results) {
				expect(result.shrinkwrapWidth).toBeLessThanOrEqual(result.fitContentWidth);
			}
		});

		it('shrinkwrapWidth is a positive number', () => {
			const results = computeShrinkwrap(sampleTexts);

			for (const result of results) {
				expect(result.shrinkwrapWidth).toBeGreaterThan(0);
			}
		});

		it('calls layout multiple times for binary search', () => {
			computeShrinkwrap(['Single test text.']);

			// At minimum: 1 call for initial lineCount + binary search iterations + 1 final layout
			expect(mockLayoutCallCount).toBeGreaterThan(2);
		});
	});

	describe('DOM cleanup', () => {
		it('creates a hidden container element', () => {
			computeShrinkwrap(sampleTexts);

			expect(document.createElement).toHaveBeenCalledWith('div');
		});

		it('appends the container to the body', () => {
			computeShrinkwrap(sampleTexts);

			expect(document.body.appendChild).toHaveBeenCalled();
		});

		it('removes the container from the body after computation', () => {
			computeShrinkwrap(sampleTexts);

			expect(document.body.removeChild).toHaveBeenCalled();
		});

		it('removeChild is called exactly once', () => {
			computeShrinkwrap(sampleTexts);

			expect(document.body.removeChild).toHaveBeenCalledTimes(1);
		});
	});

	describe('edge cases', () => {
		it('returns an empty array for empty input', () => {
			const results = computeShrinkwrap([]);

			expect(results).toEqual([]);
		});

		it('handles a single text input', () => {
			const results = computeShrinkwrap(['Just one message.']);

			expect(results).toHaveLength(1);
			expect(results[0].text).toBe('Just one message.');
		});

		it('wastePercent is 0 when fitContentWidth is 0', () => {
			mockContainer.getBoundingClientRect.mockReturnValueOnce({
				width: 0,
				height: 0,
				top: 0,
				left: 0,
				bottom: 0,
				right: 0,
				x: 0,
				y: 0,
				toJSON: jest.fn(),
			});

			const results = computeShrinkwrap(['test']);

			expect(results[0].wastePercent).toBe(0);
		});
	});
});
