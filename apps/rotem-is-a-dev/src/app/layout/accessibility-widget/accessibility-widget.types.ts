export type TextScale = 100 | 125 | 150 | 175 | 200;

export const TEXT_SCALES: TextScale[] = [100, 125, 150, 175, 200];

export const DEFAULT_TEXT_SCALE: TextScale = 100;

export const BASE_FONT_SIZE_PX = 14;

export const TEXT_SCALE_STORAGE_KEY = 'accessibility-text-scale';

export type SpacingLevel = 0 | 1 | 2 | 3;

export const LINE_HEIGHT_VALUES: ReadonlyArray<'Normal' | number> = [
	'Normal',
	1.5,
	1.75,
	2,
];

export const LETTER_SPACING_VALUES: ReadonlyArray<'Normal' | number> = [
	'Normal',
	0.05,
	0.1,
	0.15,
];

export const DEFAULT_SPACING_LEVEL: SpacingLevel = 0;

export const LINE_HEIGHT_STORAGE_KEY = 'accessibility-line-height';

export const LETTER_SPACING_STORAGE_KEY = 'accessibility-letter-spacing';
