'use client';

import { useCallback, useState } from 'react';
import dynamic from 'next/dynamic';
import styles from './hero-game.module.scss';
import { useHeroContext } from './hero.context';

const RgeSnakeGame = dynamic(
	() => import('@/games/rge-snake-game').then((mod) => mod.RgeSnakeGame),
	{ ssr: false },
);

const INITIAL_SNAKE_LENGTH = 3;
const HERO_FOOD_TOTAL = 10;

const HERO_SNAKE_CONFIG = {
	cellSize: 16,
	tickMs: 150,
	winLength: INITIAL_SNAKE_LENGTH + HERO_FOOD_TOTAL,
};

const ARROW_KEYS = [
	{ direction: 'up', label: '\u25B2' },
	{ direction: 'left', label: '\u25C0' },
	{ direction: 'down', label: '\u25BC' },
	{ direction: 'right', label: '\u25B6' },
] as const;

export const HeroGame = () => {
	const { gameCompleted, handleComplete } = useHeroContext();
	const [score, setScore] = useState(0);

	const handleScoreChange = useCallback((newScore: number) => {
		setScore(newScore);
	}, []);

	if (gameCompleted) return null;

	const foodRemaining = HERO_FOOD_TOTAL - score;

	return (
		<div className={styles.widget} data-hero-widget>
			<div className={styles.body}>
				<div className={styles.gridWrapper} data-hero-section="grid">
					<RgeSnakeGame
						config={HERO_SNAKE_CONFIG}
						onWin={handleComplete}
						onScoreChange={handleScoreChange}
						hideControls
					/>
				</div>

				<div className={styles.controls} data-hero-section="controls">
					<div className={styles.controlsTop}>
						<div className={styles.gameNav}>
							<div>
								<p className={styles.comment}>{'// use keyboard'}</p>
								<p className={styles.comment}>{'// arrows to play'}</p>
							</div>
							<div className={styles.arrowKeys}>
								{ARROW_KEYS.map(({ direction, label }) => (
									<div
										key={direction}
										className={`${styles.arrowKey} ${styles[direction]}`}
										aria-label={direction}
									>
										{label}
									</div>
								))}
							</div>
						</div>

						<div className={styles.foodSection}>
							<p className={styles.comment} data-hero-text="food-label">{'// food left'}</p>
							<div
								className={styles.foodDots}
								aria-label={`${foodRemaining} food items remaining`}
							>
								{Array.from({ length: HERO_FOOD_TOTAL }, (_, index) => (
									<svg
										key={`food-${index}`}
										xmlns="http://www.w3.org/2000/svg"
										width="21"
										height="21"
										viewBox="0 0 21 21"
										fill="none"
										className={`${styles.foodDot}${index >= foodRemaining ? ` ${styles.eaten}` : ''}`}
										aria-hidden="true"
									>
										<circle opacity="0.1" cx="10.3456" cy="10.3456" r="10.3456" fill="#46ECD5" />
										<circle opacity="0.2" cx="10.3456" cy="10.3456" r="7.34558" fill="#46ECD5" />
										<circle cx="10.3457" cy="10.3456" r="4" fill="#46ECD5" />
									</svg>
								))}
							</div>
						</div>
					</div>

					<button
						className={styles.skipButton}
						onClick={handleComplete}
						type="button"
						aria-label="Skip game"
						data-hero-text="skip"
					>
						Skip
					</button>
				</div>
			</div>

			<div className={styles.bottomScrews} aria-hidden="true">
				<span />
				<span />
			</div>
		</div>
	);
};
