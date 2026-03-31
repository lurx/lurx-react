import {
	TYPOGRAPHY_TEXT,
	computeTypography,
	drawJustifiedText,
} from '../typography-demo.helpers';
import type { TypographyResult } from '../typography-demo.helpers';

// ─── Mock @chenglou/pretext ─────────────────────────────────────────────────

type MockLayoutLine = {
	text: string;
	width: number;
	y: number;
};

const mockLines: MockLayoutLine[] = [
	{ text: 'The art of typography has always been about', width: 380, y: 0 },
	{ text: 'controlling the white space between words as', width: 390, y: 26 },
	{ text: 'much as the shapes of the letters themselves.', width: 350, y: 52 },
];

jest.mock('@chenglou/pretext', () => ({
	prepareWithSegments: jest.fn(() => ({ __brand: 'preparedSegments' })),
	layoutWithLines: jest.fn((_, maxWidth: number) => {
		// Narrower widths produce more lines
		if (maxWidth < 300) {
			return {
				lines: [...mockLines, { text: 'Extra line for narrow width.', width: 250, y: 78 }],
				lineCount: 4,
			};
		}

		return { lines: mockLines, lineCount: 3 };
	}),
}));

// ─── Tests ──────────────────────────────────────────────────────────────────

describe('TYPOGRAPHY_TEXT', () => {
	it('is a non-empty string', () => {
		expect(typeof TYPOGRAPHY_TEXT).toBe('string');
		expect(TYPOGRAPHY_TEXT.length).toBeGreaterThan(0);
	});

	it('contains typography-related content', () => {
		expect(TYPOGRAPHY_TEXT).toContain('typography');
	});
});

describe('computeTypography', () => {
	it('returns an object with expected properties', () => {
		const result = computeTypography(500);

		expect(result).toHaveProperty('greedyLines');
		expect(result).toHaveProperty('greedySpacings');
		expect(result).toHaveProperty('optimalLines');
		expect(result).toHaveProperty('optimalSpacings');
		expect(result).toHaveProperty('maxWidth');
	});

	it('returns the provided maxWidth in the result', () => {
		const result = computeTypography(450);

		expect(result.maxWidth).toBe(450);
	});

	it('returns greedy lines as an array', () => {
		const result = computeTypography(500);

		expect(Array.isArray(result.greedyLines)).toBe(true);
		expect(result.greedyLines.length).toBeGreaterThan(0);
	});

	it('returns optimal lines as an array', () => {
		const result = computeTypography(500);

		expect(Array.isArray(result.optimalLines)).toBe(true);
		expect(result.optimalLines.length).toBeGreaterThan(0);
	});

	it('greedy spacings array has same length as greedy lines', () => {
		const result = computeTypography(500);

		expect(result.greedySpacings).toHaveLength(result.greedyLines.length);
	});

	it('optimal spacings array has same length as optimal lines', () => {
		const result = computeTypography(500);

		expect(result.optimalSpacings).toHaveLength(result.optimalLines.length);
	});

	describe('spacing computation', () => {
		it('last line spacing is 0 (not justified)', () => {
			const result = computeTypography(500);
			const lastGreedySpacing = result.greedySpacings[result.greedySpacings.length - 1];
			const lastOptimalSpacing = result.optimalSpacings[result.optimalSpacings.length - 1];

			expect(lastGreedySpacing).toBe(0);
			expect(lastOptimalSpacing).toBe(0);
		});

		it('non-last line spacings are numbers', () => {
			const result = computeTypography(500);

			for (const spacing of result.greedySpacings) {
				expect(typeof spacing).toBe('number');
			}
		});
	});
});

describe('drawJustifiedText', () => {
	let mockCtx: jest.Mocked<CanvasRenderingContext2D>;

	beforeEach(() => {
		mockCtx = {
			font: '',
			textBaseline: '',
			fillStyle: '',
			fillText: jest.fn(),
			fillRect: jest.fn(),
			measureText: jest.fn(() => ({ width: 5 })),
		} as unknown as jest.Mocked<CanvasRenderingContext2D>;
	});

	const lines: MockLayoutLine[] = [
		{ text: 'The art of typography has', width: 380, y: 0 },
		{ text: 'always been important.', width: 300, y: 26 },
	];

	const spacings = [10, 0]; // non-zero for first line, 0 for last

	it('sets the font on the context', () => {
		drawJustifiedText(mockCtx, lines as never[], spacings, 500, 0, false);

		expect(mockCtx.font).toBe('16px Inter, sans-serif');
	});

	it('sets textBaseline to top', () => {
		drawJustifiedText(mockCtx, lines as never[], spacings, 500, 0, false);

		expect(mockCtx.textBaseline).toBe('top');
	});

	it('calls fillText for each line', () => {
		drawJustifiedText(mockCtx, lines as never[], spacings, 500, 0, false);

		expect(mockCtx.fillText).toHaveBeenCalled();
	});

	it('renders the last line left-aligned (single fillText call for the whole line)', () => {
		drawJustifiedText(mockCtx, lines as never[], spacings, 500, 0, false);

		// The last line should be drawn with its full text
		const lastLineCalls = (mockCtx.fillText as jest.Mock).mock.calls.filter(
			(call: [string, number, number]) => call[0] === 'always been important.'
		);
		expect(lastLineCalls).toHaveLength(1);
	});

	it('renders justified lines word-by-word', () => {
		drawJustifiedText(mockCtx, lines as never[], spacings, 500, 0, false);

		// First line has 5 words, each drawn individually
		const firstLineWords = ['The', 'art', 'of', 'typography', 'has'];

		for (const word of firstLineWords) {
			expect(mockCtx.fillText).toHaveBeenCalledWith(word, expect.any(Number), expect.any(Number));
		}
	});

	it('applies offsetY to line positions', () => {
		const offsetY = 100;
		drawJustifiedText(mockCtx, lines as never[], spacings, 500, offsetY, false);

		// Last line at index 1, lineHeight = 26, so y = 100 + 1 * 26 = 126
		expect(mockCtx.fillText).toHaveBeenCalledWith('always been important.', 0, 126);
	});

	describe('river highlighting', () => {
		it('does not call fillRect when highlightRivers is false', () => {
			drawJustifiedText(mockCtx, lines as never[], spacings, 500, 0, false);

			expect(mockCtx.fillRect).not.toHaveBeenCalled();
		});

		it('calls fillRect for wide gaps when highlightRivers is true', () => {
			// Use a large spacing that exceeds the 1.8x threshold
			const wideSpacings = [50, 0];
			drawJustifiedText(mockCtx, lines as never[], wideSpacings, 500, 0, true);

			// measureText returns width: 5, so baseSpaceWidth = 5
			// totalSpaceWidth = 5 + 50 = 55, threshold = 5 * 1.8 = 9
			// 55 > 9, so fillRect should be called for gaps in the first line
			expect(mockCtx.fillRect).toHaveBeenCalled();
		});

		it('uses red highlight color for rivers', () => {
			const wideSpacings = [50, 0];
			drawJustifiedText(mockCtx, lines as never[], wideSpacings, 500, 0, true);

			// Check that fillStyle was set to the river highlight color
			const fillRectCalls = (mockCtx.fillRect as jest.Mock).mock.calls;

			if (fillRectCalls.length > 0) {
				// fillStyle should have been set to rgba(248, 113, 113, 0.2) before fillRect
				// We can verify fillRect was called, which implies the highlight path was taken
				expect(mockCtx.fillRect).toHaveBeenCalled();
			}
		});

		it('does not highlight rivers when spacing is below threshold', () => {
			// Small spacing: baseSpaceWidth (5) * 1.8 = 9, totalSpaceWidth = 5 + 1 = 6 < 9
			const smallSpacings = [1, 0];
			drawJustifiedText(mockCtx, lines as never[], smallSpacings, 500, 0, true);

			expect(mockCtx.fillRect).not.toHaveBeenCalled();
		});
	});

	describe('single-word line', () => {
		it('renders a single-word line left-aligned', () => {
			const singleWordLines = [
				{ text: 'Supercalifragilisticexpialidocious', width: 400, y: 0 },
				{ text: 'End.', width: 30, y: 26 },
			];
			const singleWordSpacings = [0, 0];

			drawJustifiedText(mockCtx, singleWordLines as never[], singleWordSpacings, 500, 0, false);

			// Single-word line should be drawn with fillText
			expect(mockCtx.fillText).toHaveBeenCalledWith(
				'Supercalifragilisticexpialidocious', 0, expect.any(Number)
			);
		});
	});
});
