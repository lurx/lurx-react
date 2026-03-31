import { prepare, layout } from '@chenglou/pretext';

export type ShrinkwrapResult = {
	text: string;
	fitContentWidth: number;
	shrinkwrapWidth: number;
	lineCount: number;
	wastePercent: number;
};

const BUBBLE_FONT = '16px Inter, sans-serif';
const BUBBLE_LINE_HEIGHT = 24;
const BUBBLE_MAX_WIDTH = 320;

/**
 * Binary search for the minimum width that still produces the same line count.
 * This is the "impossible thing" — CSS has no equivalent.
 */
function findShrinkwrapWidth(prepared: ReturnType<typeof prepare>, fitWidth: number, lineHeight: number): number {
	const targetLines = layout(prepared, fitWidth, lineHeight).lineCount;

	let lo = 0;
	let hi = fitWidth;

	while (hi - lo > 0.5) {
		const mid = (lo + hi) / 2;
		const result = layout(prepared, mid, lineHeight);

		if (result.lineCount <= targetLines) {
			hi = mid;
		} else {
			lo = mid;
		}
	}

	return Math.ceil(hi);
}

/**
 * Measures the CSS fit-content width using a hidden DOM element,
 * then uses pretext to find the tightest shrinkwrap.
 */
export function computeShrinkwrap(texts: string[]): ShrinkwrapResult[] {
	// Measure fit-content via DOM (the "traditional" approach)
	const container = document.createElement('div');
	container.style.cssText = `position:absolute;visibility:hidden;font:${BUBBLE_FONT};max-width:${BUBBLE_MAX_WIDTH}px;width:fit-content;line-height:${BUBBLE_LINE_HEIGHT}px`;
	document.body.appendChild(container);

	const results: ShrinkwrapResult[] = texts.map(text => {
		container.textContent = text;
		const fitContentWidth = container.getBoundingClientRect().width;

		const prepared = prepare(text, BUBBLE_FONT);
		const shrinkwrapWidth = findShrinkwrapWidth(prepared, fitContentWidth, BUBBLE_LINE_HEIGHT);
		const { lineCount } = layout(prepared, fitContentWidth, BUBBLE_LINE_HEIGHT);

		const waste = fitContentWidth > 0
			? Math.round(((fitContentWidth - shrinkwrapWidth) / fitContentWidth) * 100)
			: 0;

		return {
			text,
			fitContentWidth: Math.round(fitContentWidth),
			shrinkwrapWidth,
			lineCount,
			wastePercent: waste,
		};
	});

	document.body.removeChild(container);

	return results;
}
