import { useCallback, useLayoutEffect, useState } from 'react';
import {
	applySpacing,
	applyTextScale,
	decrementSpacingLevel,
	formatSpacingValue,
	incrementSpacingLevel,
	readStoredLevel,
	readStoredScale,
} from '../../accessibility-widget.helpers';
import {
	DEFAULT_SPACING_LEVEL,
	DEFAULT_TEXT_SCALE,
	LETTER_SPACING_STORAGE_KEY,
	LETTER_SPACING_VALUES,
	LINE_HEIGHT_STORAGE_KEY,
	LINE_HEIGHT_VALUES,
	TEXT_SCALE_STORAGE_KEY,
	TEXT_SCALES,
} from '../../accessibility-widget.types';
import type { SpacingLevel, TextScale } from '../../accessibility-widget.types';
import type { AccessibilitySettings } from './use-accessibility-settings.types';

export function useAccessibilitySettings(): AccessibilitySettings {
	const [textScale, setTextScale] = useState<TextScale>(readStoredScale);
	const [lineHeight, setLineHeight] = useState<SpacingLevel>(() =>
		readStoredLevel(LINE_HEIGHT_STORAGE_KEY),
	);
	const [letterSpacing, setLetterSpacing] = useState<SpacingLevel>(() =>
		readStoredLevel(LETTER_SPACING_STORAGE_KEY),
	);

	useLayoutEffect(() => {
		applyTextScale(textScale);
		localStorage.setItem(TEXT_SCALE_STORAGE_KEY, JSON.stringify(textScale));
	}, [textScale]);

	useLayoutEffect(() => {
		applySpacing(lineHeight, letterSpacing);
		localStorage.setItem(LINE_HEIGHT_STORAGE_KEY, JSON.stringify(lineHeight));
		localStorage.setItem(
			LETTER_SPACING_STORAGE_KEY,
			JSON.stringify(letterSpacing),
		);
	}, [lineHeight, letterSpacing]);

	const currentIndex = TEXT_SCALES.indexOf(textScale);
	const canDecreaseScale = currentIndex > 0;
	const canIncreaseScale = currentIndex < TEXT_SCALES.length - 1;
	const canDecreaseLineHeight = lineHeight > 0;
	const canIncreaseLineHeight = lineHeight < LINE_HEIGHT_VALUES.length - 1;
	const canDecreaseLetterSpacing = letterSpacing > 0;
	const canIncreaseLetterSpacing =
		letterSpacing < LETTER_SPACING_VALUES.length - 1;

	const isTextScaleDefault = textScale === DEFAULT_TEXT_SCALE;
	const isLineHeightDefault = lineHeight === DEFAULT_SPACING_LEVEL;
	const isLetterSpacingDefault = letterSpacing === DEFAULT_SPACING_LEVEL;
	const isAllDefault =
		isTextScaleDefault && isLineHeightDefault && isLetterSpacingDefault;

	const lineHeightDisplayValue = formatSpacingValue(
		LINE_HEIGHT_VALUES,
		lineHeight,
		'',
	);
	const letterSpacingDisplayValue = formatSpacingValue(
		LETTER_SPACING_VALUES,
		letterSpacing,
		'em',
	);

	const decreaseScale = useCallback(() => {
		setTextScale(TEXT_SCALES[currentIndex - 1]);
	}, [currentIndex]);

	const increaseScale = useCallback(() => {
		setTextScale(TEXT_SCALES[currentIndex + 1]);
	}, [currentIndex]);

	const decreaseLineHeight = useCallback(() => {
		setLineHeight(decrementSpacingLevel);
	}, []);

	const increaseLineHeight = useCallback(() => {
		setLineHeight(incrementSpacingLevel);
	}, []);

	const decreaseLetterSpacing = useCallback(() => {
		setLetterSpacing(decrementSpacingLevel);
	}, []);

	const increaseLetterSpacing = useCallback(() => {
		setLetterSpacing(incrementSpacingLevel);
	}, []);

	const resetTextScale = useCallback(() => {
		setTextScale(DEFAULT_TEXT_SCALE);
	}, []);

	const resetLineHeight = useCallback(() => {
		setLineHeight(DEFAULT_SPACING_LEVEL);
	}, []);

	const resetLetterSpacing = useCallback(() => {
		setLetterSpacing(DEFAULT_SPACING_LEVEL);
	}, []);

	const resetAll = useCallback(() => {
		setTextScale(DEFAULT_TEXT_SCALE);
		setLineHeight(DEFAULT_SPACING_LEVEL);
		setLetterSpacing(DEFAULT_SPACING_LEVEL);
	}, []);

	return {
		textScale,
		lineHeightDisplayValue,
		letterSpacingDisplayValue,
		canDecreaseScale,
		canIncreaseScale,
		canDecreaseLineHeight,
		canIncreaseLineHeight,
		canDecreaseLetterSpacing,
		canIncreaseLetterSpacing,
		isTextScaleDefault,
		isLineHeightDefault,
		isLetterSpacingDefault,
		isAllDefault,
		decreaseScale,
		increaseScale,
		decreaseLineHeight,
		increaseLineHeight,
		decreaseLetterSpacing,
		increaseLetterSpacing,
		resetTextScale,
		resetLineHeight,
		resetLetterSpacing,
		resetAll,
	};
}
