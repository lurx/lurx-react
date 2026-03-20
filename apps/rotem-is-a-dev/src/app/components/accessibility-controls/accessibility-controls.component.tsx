import { FaIcon } from '@/app/components';
import type { AccessibilityControlsProps } from './accessibility-controls.types';
import styles from './accessibility-controls.module.scss';

export const AccessibilityControls = ({
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
}: AccessibilityControlsProps) => {
	return (
		<>
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
					onClick={decreaseScale}
					disabled={!canDecreaseScale}
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
					onClick={increaseScale}
					disabled={!canIncreaseScale}
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
						{lineHeightDisplayValue}
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
						{letterSpacingDisplayValue}
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
				disabled={isAllDefault}
				aria-label="Reset all"
			>
				Reset all
			</button>
		</>
	);
};
