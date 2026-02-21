'use client';

import styles from '../snake-game.module.scss';
import { ArrowKeys } from './arrow-keys/arrow-keys.component';
import { SnakeGameInstructions } from './game-instructions.component';

interface GameControlsProps {
	totalFood: number;
	displayedRemaining: number;
	onSkip: () => void;
}

export const GameControls = ({
	totalFood,
	displayedRemaining,
	onSkip,
}: GameControlsProps) => {
	const foodDots = Array.from({ length: totalFood }, (_, index) => (
		<svg
			key={index}
			xmlns="http://www.w3.org/2000/svg"
			width="21"
			height="21"
			viewBox="0 0 21 21"
			fill="none"
			className={`${styles.foodDot}${
				index >= displayedRemaining ? ` ${styles.eaten}` : ''
			}`}
			aria-hidden="true"
		>
			<circle
				opacity="0.1"
				cx="10.3456"
				cy="10.3456"
				r="10.3456"
				fill="#46ECD5"
			/>
			<circle
				opacity="0.2"
				cx="10.3456"
				cy="10.3456"
				r="7.34558"
				fill="#46ECD5"
			/>
			<circle
				cx="10.3457"
				cy="10.3456"
				r="4"
				fill="#46ECD5"
			/>
		</svg>
	));

	return (
		<div className={styles.controls} data-hero-section="controls">
			<div className={styles.controlsTop}>
				<div className={styles.gameNav}>
					<SnakeGameInstructions />
					<ArrowKeys />
				</div>

				<div className={styles.foodSection}>
					<p className={styles.comment} data-hero-text="food-label">{'// food left'}</p>
					<div
						className={styles.foodDots}
						aria-label={`${displayedRemaining} food items remaining`}
					>
						{foodDots}
					</div>
				</div>
			</div>

			<button
				className={styles.skipButton}
				onClick={() => onSkip()}
				aria-label="Skip game"
				data-hero-text="skip"
			>
				Skip
			</button>
		</div>
	);
};
