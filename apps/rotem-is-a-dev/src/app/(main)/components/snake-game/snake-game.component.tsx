'use client';

import { useEffect, useRef } from 'react';
import { GRID_COLS, GRID_ROWS, INITIAL_FOOD_COUNT, useSnakeGame } from './hooks/use-snake-game.hook';
import styles from './snake-game.module.scss';
import type { Position } from './snake-game.types';

const CELL = 240 / GRID_COLS; // 16px per cell
const SNAKE_COLOR = '#43d9ad';

const KEY_LABELS: Record<string, string> = {
	ArrowUp: '▲',
	ArrowDown: '▼',
	ArrowLeft: '◀',
	ArrowRight: '▶',
};

interface SnakeGameProps {
	onWin: () => void;
	onSkip: () => void;
}

export const SnakeGame = ({ onWin, onSkip }: SnakeGameProps) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const { snake, food, gameState, activeKey, startGame, resetGame } =
		useSnakeGame();

	const totalFood = INITIAL_FOOD_COUNT;
	const displayedRemaining = gameState === 'idle' ? totalFood : food.length;

	const handleRestart = () => resetGame();

	useEffect(() => {
		if (gameState === 'won') {
			onWin();
		}
	}, [gameState, onWin]);

	// Draw the game onto the canvas every time snake/food changes
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		ctx.clearRect(0, 0, CELL * GRID_COLS, CELL * GRID_ROWS);

		// Food — three concentric circles matching the scoreboard SVG, scaled to cell
		food.forEach((f: Position) => {
			const cx = f.x * CELL + CELL / 2;
			const cy = f.y * CELL + CELL / 2;

			ctx.fillStyle = 'rgba(70, 236, 213, 0.1)';
			ctx.beginPath();
			ctx.arc(cx, cy, 7.5, 0, Math.PI * 2);
			ctx.fill();

			ctx.fillStyle = 'rgba(70, 236, 213, 0.2)';
			ctx.beginPath();
			ctx.arc(cx, cy, 5.5, 0, Math.PI * 2);
			ctx.fill();

			ctx.fillStyle = '#46ECD5';
			ctx.beginPath();
			ctx.arc(cx, cy, 3, 0, Math.PI * 2);
			ctx.fill();
		});

		// Snake — smooth rounded polyline with gradient fade from head to tail
		if (snake.length > 0) {
			const headX = snake[0].x * CELL + CELL / 2;
			const headY = snake[0].y * CELL + CELL / 2;
			const tailX = snake[snake.length - 1].x * CELL + CELL / 2;
			const tailY = snake[snake.length - 1].y * CELL + CELL / 2;

			const gradient = ctx.createLinearGradient(headX, headY, tailX, tailY);
			gradient.addColorStop(0, SNAKE_COLOR);
			gradient.addColorStop(1, 'rgba(67, 217, 173, 0)');

			ctx.strokeStyle = gradient;
			ctx.lineWidth = CELL - 3;
			ctx.lineCap = 'round';
			ctx.lineJoin = 'round';

			ctx.beginPath();
			for (let i = snake.length - 1; i >= 0; i--) {
				const x = snake[i].x * CELL + CELL / 2;
				const y = snake[i].y * CELL + CELL / 2;
				if (i === snake.length - 1) {
					ctx.moveTo(x, y);
				} else {
					ctx.lineTo(x, y);
				}
			}
			ctx.stroke();
		}
	}, [snake, food]);

	const foodDots = Array.from({ length: totalFood }, (_, i) => (
		<svg
			key={i}
			xmlns="http://www.w3.org/2000/svg"
			width="21"
			height="21"
			viewBox="0 0 21 21"
			fill="none"
			className={`${styles.foodDot}${i >= displayedRemaining ? ` ${styles.eaten}` : ''}`}
			aria-hidden="true"
		>
			<circle opacity="0.1" cx="10.3456" cy="10.3456" r="10.3456" fill="#46ECD5" />
			<circle opacity="0.2" cx="10.3456" cy="10.3456" r="7.34558" fill="#46ECD5" />
			<circle cx="10.3457" cy="10.3456" r="4" fill="#46ECD5" />
		</svg>
	));

	return (
		<div className={styles.widget}>
			<div className={styles.body}>
				<div className={styles.gridWrapper}>
					<canvas
						ref={canvasRef}
						width={CELL * GRID_COLS}
						height={CELL * GRID_ROWS}
						role="img"
						aria-label="Snake game grid"
						className={styles.gameCanvas}
					/>

					{gameState === 'idle' && (
						<button
							className={styles.startButton}
							onClick={startGame}
							aria-label="Start game"
						>
							start-game
						</button>
					)}

					{gameState === 'lost' && (
						<div className={styles.boardOverlay}>
							<div className={styles.overlayBar} />
							<p className={styles.overlayTitle}>GAME OVER!</p>
							<button
								className={styles.overlayAction}
								onClick={handleRestart}
								aria-label="Start again"
							>
								start-again
							</button>
						</div>
					)}

					{gameState === 'won' && (
						<div className={styles.boardOverlay}>
							<div className={styles.overlayBar} />
							<p className={styles.overlayTitle}>WELL DONE!</p>
							<button
								className={styles.overlayAction}
								onClick={handleRestart}
								aria-label="Play again"
							>
								play-again
							</button>
						</div>
					)}
				</div>

				<div className={styles.controls}>
					<div className={styles.controlsTop}>
						<div className={styles.gameNav}>
							<div className={styles.navComments}>
								<p className={styles.comment}>{'// use keyboard'}</p>
								<p className={styles.comment}>{'// arrows to play'}</p>
							</div>
							<div
								className={styles.arrowKeys}
								aria-label="Arrow key controls"
							>
								{(['ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'] as const).map(
									(key) => {
										const dirClass =
											key === 'ArrowUp'
												? styles.up
												: key === 'ArrowDown'
													? styles.down
													: key === 'ArrowLeft'
														? styles.left
														: styles.right;
										return (
											<div
												key={key}
												className={`${styles.arrowKey} ${dirClass}${activeKey === key ? ` ${styles.pressed}` : ''}`}
												aria-label={key.replace('Arrow', '')}
											>
												{KEY_LABELS[key]}
											</div>
										);
									},
								)}
							</div>
						</div>

						<div className={styles.foodSection}>
							<p className={styles.comment}>{'// food left'}</p>
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
					>
						skip
					</button>
				</div>
			</div>

			<div
				className={styles.bottomScrews}
				aria-hidden="true"
			>
				<span />
				<span />
			</div>
		</div>
	);
};
