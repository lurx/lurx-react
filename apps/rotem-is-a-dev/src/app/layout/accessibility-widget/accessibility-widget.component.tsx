'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useOnClickOutside } from '@/hooks';
import { FaIcon } from '@/app/components';
import classNames from 'classnames';
import styles from './accessibility-widget.module.scss';
import {
	BASE_FONT_SIZE_PX,
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
} from './accessibility-widget.types';

function readStoredScale(): TextScale {
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

function readStoredLevel(key: string): SpacingLevel {
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

function applyTextScale(scale: TextScale): void {
	const fontSize = (BASE_FONT_SIZE_PX * scale) / 100;
	document.documentElement.style.setProperty('--root-font-size', `${fontSize}px`);
}

function applySpacing(lineHeightLevel: SpacingLevel, letterSpacingLevel: SpacingLevel): void {
	const lineHeightValue = LINE_HEIGHT_VALUES[lineHeightLevel];
	const letterSpacingValue = LETTER_SPACING_VALUES[letterSpacingLevel];

	if (lineHeightLevel === 0) {
		document.documentElement.style.removeProperty('--a11y-line-height');
	} else {
		document.documentElement.style.setProperty('--a11y-line-height', String(lineHeightValue));
	}

	if (letterSpacingLevel === 0) {
		document.documentElement.style.removeProperty('--a11y-letter-spacing');
	} else {
		document.documentElement.style.setProperty('--a11y-letter-spacing', `${letterSpacingValue}em`);
	}
}

function formatSpacingValue(
	values: ReadonlyArray<'Normal' | number>,
	level: SpacingLevel,
	suffix: string,
): string {
	const value = values[level];
	if (value === 'Normal') return 'Normal';
	return `${value}${suffix}`;
}

export const AccessibilityWidget = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [textScale, setTextScaleState] = useState<TextScale>(readStoredScale);
	const [lineHeight, setLineHeight] = useState<SpacingLevel>(() =>
		readStoredLevel(LINE_HEIGHT_STORAGE_KEY),
	);
	const [letterSpacing, setLetterSpacing] = useState<SpacingLevel>(() =>
		readStoredLevel(LETTER_SPACING_STORAGE_KEY),
	);
	const wrapperRef = useRef<HTMLDivElement>(null);

	useOnClickOutside(wrapperRef, () => setIsOpen(false));

	useEffect(() => {
		applyTextScale(textScale);
		localStorage.setItem(TEXT_SCALE_STORAGE_KEY, JSON.stringify(textScale));
	}, [textScale]);

	useEffect(() => {
		applySpacing(lineHeight, letterSpacing);
		localStorage.setItem(LINE_HEIGHT_STORAGE_KEY, JSON.stringify(lineHeight));
		localStorage.setItem(LETTER_SPACING_STORAGE_KEY, JSON.stringify(letterSpacing));
	}, [lineHeight, letterSpacing]);

	useEffect(() => {
		const handleEscape = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			document.addEventListener('keydown', handleEscape);
		}

		return () => document.removeEventListener('keydown', handleEscape);
	}, [isOpen]);

	const currentIndex = TEXT_SCALES.indexOf(textScale);
	const canDecrease = currentIndex > 0;
	const canIncrease = currentIndex < TEXT_SCALES.length - 1;

	const canDecreaseLineHeight = lineHeight > 0;
	const canIncreaseLineHeight = lineHeight < LINE_HEIGHT_VALUES.length - 1;
	const canDecreaseLetterSpacing = letterSpacing > 0;
	const canIncreaseLetterSpacing = letterSpacing < LETTER_SPACING_VALUES.length - 1;

	const isTextScaleDefault = textScale === DEFAULT_TEXT_SCALE;
	const isLineHeightDefault = lineHeight === DEFAULT_SPACING_LEVEL;
	const isLetterSpacingDefault = letterSpacing === DEFAULT_SPACING_LEVEL;
	const isDefault = isTextScaleDefault && isLineHeightDefault && isLetterSpacingDefault;

	const decrease = useCallback(() => {
		setTextScaleState(TEXT_SCALES[currentIndex - 1]);
	}, [currentIndex]);

	const increase = useCallback(() => {
		setTextScaleState(TEXT_SCALES[currentIndex + 1]);
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
		setTextScaleState(DEFAULT_TEXT_SCALE);
	}, []);

	const resetLineHeight = useCallback(() => {
		setLineHeight(DEFAULT_SPACING_LEVEL);
	}, []);

	const resetLetterSpacing = useCallback(() => {
		setLetterSpacing(DEFAULT_SPACING_LEVEL);
	}, []);

	const resetAll = useCallback(() => {
		setTextScaleState(DEFAULT_TEXT_SCALE);
		setLineHeight(DEFAULT_SPACING_LEVEL);
		setLetterSpacing(DEFAULT_SPACING_LEVEL);
	}, []);

	const toggle = useCallback(() => {
		setIsOpen(prev => !prev);
	}, []);

	return (
		<div
			ref={wrapperRef}
			className={styles.wrapper}
		>
			<button
				className={classNames(styles.trigger, { [styles.active]: isOpen })}
				aria-label="Accessibility options"
				aria-expanded={isOpen}
				onClick={toggle}
			>
				<FaIcon
					iconName="universal-access"
					iconGroup="fal"
				/>
			</button>

			{isOpen && (
				<div
					role="dialog"
					aria-label="Accessibility settings"
					className={styles.panel}
				>
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
					<div className={styles.scaleControls}>
						<button
							className={styles.scaleButton}
							onClick={decrease}
							disabled={!canDecrease}
							aria-label="Decrease text size"
						>
							<FaIcon
								iconName="minus"
								iconGroup="fal"
							/>
						</button>
						<span className={styles.scaleValue}>{textScale}%</span>
						<button
							className={styles.scaleButton}
							onClick={increase}
							disabled={!canIncrease}
							aria-label="Increase text size"
						>
							<FaIcon
								iconName="plus"
								iconGroup="fal"
							/>
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
						<div className={styles.scaleControls}>
							<button
								className={styles.scaleButton}
								onClick={decreaseLineHeight}
								disabled={!canDecreaseLineHeight}
								aria-label="Decrease line height"
							>
								<FaIcon
									iconName="minus"
									iconGroup="fal"
								/>
							</button>
							<span className={styles.scaleValue}>
								{formatSpacingValue(LINE_HEIGHT_VALUES, lineHeight, '')}
							</span>
							<button
								className={styles.scaleButton}
								onClick={increaseLineHeight}
								disabled={!canIncreaseLineHeight}
								aria-label="Increase line height"
							>
								<FaIcon
									iconName="plus"
									iconGroup="fal"
								/>
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
						<div className={styles.scaleControls}>
							<button
								className={styles.scaleButton}
								onClick={decreaseLetterSpacing}
								disabled={!canDecreaseLetterSpacing}
								aria-label="Decrease letter spacing"
							>
								<FaIcon
									iconName="minus"
									iconGroup="fal"
								/>
							</button>
							<span className={styles.scaleValue}>
								{formatSpacingValue(LETTER_SPACING_VALUES, letterSpacing, 'em')}
							</span>
							<button
								className={styles.scaleButton}
								onClick={increaseLetterSpacing}
								disabled={!canIncreaseLetterSpacing}
								aria-label="Increase letter spacing"
							>
								<FaIcon
									iconName="plus"
									iconGroup="fal"
								/>
							</button>
						</div>
					</div>

					<button
						className={styles.resetButton}
						onClick={resetAll}
						disabled={isDefault}
						aria-label="Reset all"
					>
						Reset all
					</button>
				</div>
			)}
		</div>
	);
};
