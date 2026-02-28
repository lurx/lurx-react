'use client';

import { useEffect, useRef } from 'react';
import {
	GRID_COLS,
	GRID_ROWS,
	INITIAL_FOOD_COUNT,
	useSnakeGame,
} from './hooks/use-snake-game.hook';
import styles from './snake-game.module.scss';
import type { Position, SnakeGameProps } from './snake-game.types';
import { GameControls } from './components/game-controls.component';

const CELL = 240 / GRID_COLS; // 16px per cell
const SNAKE_COLOR = '#43d9ad';

export const SnakeGame = ({ onWin, onSkip }: SnakeGameProps) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const { snake, food, gameState, startGame, resetGame } =
		useSnakeGame();

	const totalFood = INITIAL_FOOD_COUNT;
	const displayedRemaining = gameState === 'idle' ? totalFood : food.length;

	const handleRestart = () => resetGame();

	function renderGameOverlay() {
		if (gameState === 'idle') {
			return (
				<button
					className={styles.startButton}
					onClick={startGame}
					aria-label="Start game"
					data-hero-text="start-game"
				>
					start-game
				</button>
			);
		}
		if (gameState === 'lost') {
			return (
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
			);
		}
		if (gameState === 'won') {
			return (
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
			);
		}
		return null;
	}

	useEffect(() => {
		if (gameState === 'won') {
			onWin();
		}
	}, [gameState, onWin]);

	// Draw the game onto the canvas every time snake/food changes
	useEffect(() => {
		const canvas = canvasRef.current;
		/* istanbul ignore if -- ref is always set after mount */
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		ctx.clearRect(0, 0, CELL * GRID_COLS, CELL * GRID_ROWS);

		// Food — three concentric circles matching the scoreboard SVG, scaled to cell
		food.forEach((foodItem: Position) => {
			const cx = foodItem.x * CELL + CELL / 2;
			const cy = foodItem.y * CELL + CELL / 2;

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
			for (let index = snake.length - 1; index >= 0; index--) {
				const x = snake[index].x * CELL + CELL / 2;
				const y = snake[index].y * CELL + CELL / 2;
				if (index === snake.length - 1) {
					ctx.moveTo(x, y);
				} else {
					ctx.lineTo(x, y);
				}
			}
			ctx.stroke();
		}
	}, [snake, food]);

	return (
		<div className={styles.widget} data-hero-widget>
			<div className={styles.body}>
				<div className={styles.gridWrapper} data-hero-section="grid">
					<canvas
						ref={canvasRef}
						width={CELL * GRID_COLS}
						height={CELL * GRID_ROWS}
						role="img"
						aria-label="Snake game grid"
						className={styles.gameCanvas}
					/>

					{renderGameOverlay()}
				</div>
				<GameControls
					totalFood={INITIAL_FOOD_COUNT}
					displayedRemaining={displayedRemaining}
					onSkip={onSkip}
				/>
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
