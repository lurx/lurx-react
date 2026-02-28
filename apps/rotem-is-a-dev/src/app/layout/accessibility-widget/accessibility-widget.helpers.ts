import {
	BASE_FONT_SIZE_PX,
	DEFAULT_SPACING_LEVEL,
	DEFAULT_TEXT_SCALE,
	LETTER_SPACING_VALUES,
	LINE_HEIGHT_VALUES,
	MOBILE_BASE_FONT_SIZE_PX,
	MOBILE_BREAKPOINT_PX,
	TEXT_SCALE_STORAGE_KEY,
	TEXT_SCALES,
	type SpacingLevel,
	type TextScale,
} from './accessibility-widget.types';

export function readStoredScale(): TextScale {
	try {
		const stored = localStorage.getItem(TEXT_SCALE_STORAGE_KEY);
		if (stored) {
			const parsed = JSON.parse(stored) as TextScale;
			if (TEXT_SCALES.includes(parsed)) return parsed;
		}
	} catch {
		/* ignore invalid data */
	}
	return DEFAULT_TEXT_SCALE;
}

export function readStoredLevel(key: string): SpacingLevel {
	try {
		const stored = localStorage.getItem(key);
		if (stored) {
			const parsed = JSON.parse(stored) as SpacingLevel;
			if ([0, 1, 2, 3].includes(parsed)) return parsed;
		}
	} catch {
		/* ignore invalid data */
	}
	return DEFAULT_SPACING_LEVEL;
}

export function getBaseFontSize(): number {
	return globalThis.matchMedia(`(max-width: ${MOBILE_BREAKPOINT_PX}px)`).matches
		? MOBILE_BASE_FONT_SIZE_PX
		: BASE_FONT_SIZE_PX;
}

export function applyTextScale(scale: TextScale): void {
	if (scale === DEFAULT_TEXT_SCALE) {
		document.documentElement.style.removeProperty('--root-font-size');
		return;
	}
	const fontSize = (getBaseFontSize() * scale) / 100;
	document.documentElement.style.setProperty(
		'--root-font-size',
		`${fontSize}px`,
	);
}

export function applySpacing(
	lineHeightLevel: SpacingLevel,
	letterSpacingLevel: SpacingLevel,
): void {
	const lineHeightValue = LINE_HEIGHT_VALUES[lineHeightLevel];
	const letterSpacingValue = LETTER_SPACING_VALUES[letterSpacingLevel];

	if (lineHeightLevel === 0) {
		document.documentElement.style.removeProperty('--a11y-line-height');
	} else {
		document.documentElement.style.setProperty(
			'--a11y-line-height',
			String(lineHeightValue),
		);
	}

	if (letterSpacingLevel === 0) {
		document.documentElement.style.removeProperty('--a11y-letter-spacing');
	} else {
		document.documentElement.style.setProperty(
			'--a11y-letter-spacing',
			`${letterSpacingValue}em`,
		);
	}
}

export function formatSpacingValue(
	values: ReadonlyArray<'Normal' | number>,
	level: SpacingLevel,
	suffix: string,
): string {
	const value = values[level];
	if (value === 'Normal') return 'Normal';
	return `${value}${suffix}`;
}
