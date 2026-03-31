import { prepareWithSegments, layoutWithLines, type LayoutLine } from '@chenglou/pretext';

const FONT = '16px Inter, sans-serif';
const LINE_HEIGHT = 26;

export const TYPOGRAPHY_TEXT =
	'The art of typography has always been about controlling the white space between words as much as the shapes of the letters themselves. When a line-breaking algorithm makes poor decisions, the result is rivers of white that flow vertically through paragraphs, pulling the eye away from the horizontal reading direction and creating an uneven appearance. Professional typesetting uses algorithms that consider all possible breakpoints globally to minimise the worst spacing across the whole paragraph, rather than greedily filling each line before moving to the next.';

export type TypographyResult = {
	greedyLines: LayoutLine[];
	greedySpacings: number[];
	optimalLines: LayoutLine[];
	optimalSpacings: number[];
	maxWidth: number;
};

/**
 * Greedy line breaking: same as CSS — fill each line as much as possible.
 * This is what layoutWithLines does natively.
 */
function greedyLayout(text: string, maxWidth: number): LayoutLine[] {
	const prepared = prepareWithSegments(text, FONT);
	const { lines } = layoutWithLines(prepared, maxWidth, LINE_HEIGHT);

	return lines;
}

/**
 * Balanced layout via binary search:
 * Find the narrowest width that keeps the same line count as greedy,
 * then use that width for layoutWithLines. This produces more balanced lines.
 * (Not a true Knuth-Plass DP algorithm — simpler but effective for demos.)
 */
function optimalLayout(text: string, maxWidth: number, greedyLineCount: number): LayoutLine[] {
	const prepared = prepareWithSegments(text, FONT);

	// Binary search for the narrowest width that doesn't increase line count
	let lo = maxWidth * 0.5;
	let hi = maxWidth;

	while (hi - lo > 0.5) {
		const mid = (lo + hi) / 2;
		const { lineCount } = layoutWithLines(prepared, mid, LINE_HEIGHT);

		if (lineCount <= greedyLineCount) {
			hi = mid;
		} else {
			lo = mid;
		}
	}

	// Use the balanced width — lines will be more even
	const { lines } = layoutWithLines(prepared, Math.ceil(hi), LINE_HEIGHT);

	return lines;
}

/**
 * Compute inter-word spacing for each line when justified to maxWidth.
 * Higher variance = worse typography (rivers).
 */
function computeSpacings(lines: LayoutLine[], maxWidth: number): number[] {
	return lines.map((line, idx) => {
		// Don't justify the last line
		if (idx === lines.length - 1) return 0;

		const words = line.text.trim().split(/\s+/);

		if (words.length <= 1) return 0;

		const gaps = words.length - 1;
		const extraSpace = maxWidth - line.width;

		return extraSpace / gaps;
	});
}

export function computeTypography(maxWidth: number): TypographyResult {
	const greedyLines = greedyLayout(TYPOGRAPHY_TEXT, maxWidth);
	const optimalLines = optimalLayout(TYPOGRAPHY_TEXT, maxWidth, greedyLines.length);

	return {
		greedyLines,
		greedySpacings: computeSpacings(greedyLines, maxWidth),
		optimalLines,
		optimalSpacings: computeSpacings(optimalLines, maxWidth),
		maxWidth,
	};
}

/**
 * Draw justified text on a canvas, coloring inter-word gaps to visualize rivers.
 */
export function drawJustifiedText(
	ctx: CanvasRenderingContext2D,
	lines: LayoutLine[],
	spacings: number[],
	maxWidth: number,
	offsetY: number,
	highlightRivers: boolean,
): void {
	ctx.font = FONT;
	ctx.textBaseline = 'top';

	for (let lineIdx = 0; lineIdx < lines.length; lineIdx++) {
		const line = lines[lineIdx];
		const spacing = spacings[lineIdx];
		const isLastLine = lineIdx === lines.length - 1;
		const lineY = offsetY + lineIdx * LINE_HEIGHT;
		const words = line.text.trim().split(/\s+/);

		if (isLastLine || words.length <= 1) {
			// Left-aligned last line
			ctx.fillStyle = '#f0eae0';
			ctx.fillText(line.text.trim(), 0, lineY);
			continue;
		}

		// Draw justified
		let cursorX = 0;
		const baseSpaceWidth = ctx.measureText(' ').width;
		const totalSpaceWidth = baseSpaceWidth + spacing;

		for (let wordIdx = 0; wordIdx < words.length; wordIdx++) {
			const word = words[wordIdx];

			// Highlight wide gaps (rivers)
			if (highlightRivers && wordIdx > 0 && totalSpaceWidth > baseSpaceWidth * 1.8) {
				ctx.fillStyle = 'rgba(248, 113, 113, 0.2)';
				ctx.fillRect(cursorX - totalSpaceWidth, lineY, totalSpaceWidth, LINE_HEIGHT);
			}

			ctx.fillStyle = '#f0eae0';
			ctx.fillText(word, cursorX, lineY);
			cursorX += ctx.measureText(word).width + totalSpaceWidth;
		}
	}
}
