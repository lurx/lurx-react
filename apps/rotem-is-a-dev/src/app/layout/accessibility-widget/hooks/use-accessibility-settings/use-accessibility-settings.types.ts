import type { TextScale } from '../../accessibility-widget.types';

export type AccessibilitySettings = {
	textScale: TextScale;
	lineHeightDisplayValue: string;
	letterSpacingDisplayValue: string;
	canDecreaseScale: boolean;
	canIncreaseScale: boolean;
	canDecreaseLineHeight: boolean;
	canIncreaseLineHeight: boolean;
	canDecreaseLetterSpacing: boolean;
	canIncreaseLetterSpacing: boolean;
	isTextScaleDefault: boolean;
	isLineHeightDefault: boolean;
	isLetterSpacingDefault: boolean;
	isAllDefault: boolean;
	decreaseScale: () => void;
	increaseScale: () => void;
	decreaseLineHeight: () => void;
	increaseLineHeight: () => void;
	decreaseLetterSpacing: () => void;
	increaseLetterSpacing: () => void;
	resetTextScale: () => void;
	resetLineHeight: () => void;
	resetLetterSpacing: () => void;
	resetAll: () => void;
};
