'use client';

import { FaIcon } from '@/app/components';
import {
	applySpacing,
	applyTextScale,
	formatSpacingValue,
	readStoredLevel,
	readStoredScale,
} from '@/app/layout/accessibility-widget/accessibility-widget.helpers';
import {
	DEFAULT_SPACING_LEVEL,
	DEFAULT_TEXT_SCALE,
	LETTER_SPACING_STORAGE_KEY,
	LETTER_SPACING_VALUES,
	LINE_HEIGHT_STORAGE_KEY,
	LINE_HEIGHT_VALUES,
	TEXT_SCALE_STORAGE_KEY,
	TEXT_SCALES,
	type SpacingLevel,
	type TextScale,
} from '@/app/layout/accessibility-widget/accessibility-widget.types';
import { useCallback, useLayoutEffect, useState } from 'react';
import styles from './accessibility-section.module.scss';

export const AccessibilitySection = () => {
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
		localStorage.setItem(LETTER_SPACING_STORAGE_KEY, JSON.stringify(letterSpacing));
	}, [lineHeight, letterSpacing]);

	const currentIndex = TEXT_SCALES.indexOf(textScale);
	const canDecreaseScale = currentIndex > 0;
	const canIncreaseScale = currentIndex < TEXT_SCALES.length - 1;
	const canDecreaseLineHeight = lineHeight > 0;
	const canIncreaseLineHeight = lineHeight < LINE_HEIGHT_VALUES.length - 1;
	const canDecreaseLetterSpacing = letterSpacing > 0;
	const canIncreaseLetterSpacing = letterSpacing < LETTER_SPACING_VALUES.length - 1;

	const isTextScaleDefault = textScale === DEFAULT_TEXT_SCALE;
	const isLineHeightDefault = lineHeight === DEFAULT_SPACING_LEVEL;
	const isLetterSpacingDefault = letterSpacing === DEFAULT_SPACING_LEVEL;
	const isAllDefault = isTextScaleDefault && isLineHeightDefault && isLetterSpacingDefault;

	const decreaseScale = useCallback(() => {
		setTextScale(TEXT_SCALES[currentIndex - 1]);
	}, [currentIndex]);

	const increaseScale = useCallback(() => {
		setTextScale(TEXT_SCALES[currentIndex + 1]);
	}, [currentIndex]);

	const decreaseLineHeight = useCallback(() => {
		setLineHeight(prev => (prev - 1) as SpacingLevel);
	}, []);

	const increaseLineHeight = useCallback(() => {
		setLineHeight(prev => (prev + 1) as SpacingLevel);
	}, []);

	const decreaseLetterSpacing = useCallback(() => {
		setLetterSpacing(prev => (prev - 1) as SpacingLevel);
	}, []);

	const increaseLetterSpacing = useCallback(() => {
		setLetterSpacing(prev => (prev + 1) as SpacingLevel);
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

	return (
		<div className={styles.section}>
			<div className={styles.sectionHeader}>
				<span className={styles.sectionLabel}>Text size</span>
				<button
					className={styles.sectionReset}
					onClick={resetTextScale}
					disabled={isTextScaleDefault}
					aria-label="Reset text size"
				>
					Reset
				</button>
			</div>
			<div className={styles.controls}>
				<button
					className={styles.stepButton}
					onClick={decreaseScale}
					disabled={!canDecreaseScale}
					aria-label="Decrease text size"
				>
					<FaIcon iconName="minus" iconGroup="fal" />
				</button>
				<span className={styles.value}>{textScale}%</span>
				<button
					className={styles.stepButton}
					onClick={increaseScale}
					disabled={!canIncreaseScale}
					aria-label="Increase text size"
				>
					<FaIcon iconName="plus" iconGroup="fal" />
				</button>
			</div>

			<div className={styles.divider}>
				<div className={styles.sectionHeader}>
					<span className={styles.sectionLabel}>Line height</span>
					<button
						className={styles.sectionReset}
						onClick={resetLineHeight}
						disabled={isLineHeightDefault}
						aria-label="Reset line height"
					>
						Reset
					</button>
				</div>
				<div className={styles.controls}>
					<button
						className={styles.stepButton}
						onClick={decreaseLineHeight}
						disabled={!canDecreaseLineHeight}
						aria-label="Decrease line height"
					>
						<FaIcon iconName="minus" iconGroup="fal" />
					</button>
					<span className={styles.value}>
						{formatSpacingValue(LINE_HEIGHT_VALUES, lineHeight, '')}
					</span>
					<button
						className={styles.stepButton}
						onClick={increaseLineHeight}
						disabled={!canIncreaseLineHeight}
						aria-label="Increase line height"
					>
						<FaIcon iconName="plus" iconGroup="fal" />
					</button>
				</div>
			</div>

			<div className={styles.divider}>
				<div className={styles.sectionHeader}>
					<span className={styles.sectionLabel}>Letter spacing</span>
					<button
						className={styles.sectionReset}
						onClick={resetLetterSpacing}
						disabled={isLetterSpacingDefault}
						aria-label="Reset letter spacing"
					>
						Reset
					</button>
				</div>
				<div className={styles.controls}>
					<button
						className={styles.stepButton}
						onClick={decreaseLetterSpacing}
						disabled={!canDecreaseLetterSpacing}
						aria-label="Decrease letter spacing"
					>
						<FaIcon iconName="minus" iconGroup="fal" />
					</button>
					<span className={styles.value}>
						{formatSpacingValue(LETTER_SPACING_VALUES, letterSpacing, 'em')}
					</span>
					<button
						className={styles.stepButton}
						onClick={increaseLetterSpacing}
						disabled={!canIncreaseLetterSpacing}
						aria-label="Increase letter spacing"
					>
						<FaIcon iconName="plus" iconGroup="fal" />
					</button>
				</div>
			</div>

			<button
				className={styles.resetAllButton}
				onClick={resetAll}
				disabled={isAllDefault}
				aria-label="Reset all"
			>
				Reset all
			</button>
		</div>
	);
};
