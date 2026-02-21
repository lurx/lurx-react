'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useOnClickOutside } from 'usehooks-ts';
import { FaIcon } from '@/app/components';
import classNames from 'classnames';
import styles from './accessibility-widget.module.scss';
import {
	BASE_FONT_SIZE_PX,
	DEFAULT_TEXT_SCALE,
	TEXT_SCALE_STORAGE_KEY,
	TEXT_SCALES,
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

function applyTextScale(scale: TextScale): void {
	const fontSize = (BASE_FONT_SIZE_PX * scale) / 100;
	document.documentElement.style.setProperty(
		'--root-font-size',
		`${fontSize}px`,
	);
}

export const AccessibilityWidget = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [textScale, setTextScaleState] = useState<TextScale>(readStoredScale);
	const wrapperRef = useRef<HTMLDivElement>(null);

	useOnClickOutside(wrapperRef as React.RefObject<HTMLDivElement>, () =>
		setIsOpen(false),
	);

	useEffect(() => {
		applyTextScale(textScale);
		localStorage.setItem(TEXT_SCALE_STORAGE_KEY, JSON.stringify(textScale));
	}, [textScale]);

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
	const isDefault = textScale === DEFAULT_TEXT_SCALE;

	const decrease = useCallback(() => {
		if (canDecrease) {
			setTextScaleState(TEXT_SCALES[currentIndex - 1]);
		}
	}, [canDecrease, currentIndex]);

	const increase = useCallback(() => {
		if (canIncrease) {
			setTextScaleState(TEXT_SCALES[currentIndex + 1]);
		}
	}, [canIncrease, currentIndex]);

	const reset = useCallback(() => {
		setTextScaleState(DEFAULT_TEXT_SCALE);
	}, []);

	const toggle = useCallback(() => {
		setIsOpen((prev) => !prev);
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
					<span className={styles.sectionLabel}>Text size</span>
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
					<button
						className={styles.resetButton}
						onClick={reset}
						disabled={isDefault}
						aria-label="Reset text size to default"
					>
						Reset
					</button>
				</div>
			)}
		</div>
	);
};
