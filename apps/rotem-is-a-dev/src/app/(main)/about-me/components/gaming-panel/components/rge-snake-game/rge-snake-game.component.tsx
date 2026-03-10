'use client';

import { useCallback, useRef, useState } from 'react';
import { GameEngine } from 'react-game-engine';
import { GameControls } from './components/game-controls';
import { GameOverlay } from './components/game-overlay';
import { FoodRenderer } from './renderers/food-renderer.component';
import { SnakeRenderer } from './renderers/snake-renderer.component';
import { CELL_SIZE, GRID_COLS, GRID_ROWS } from './rge-snake-game.constants';
import styles from './rge-snake-game.module.scss';
import type { Direction, Entities, GameEvent, GamePhase } from './rge-snake-game.types';
import { checkCollision, checkFood, handleInput, moveSnake } from './systems';
import { resetMoveSnakeTick } from './systems/move-snake.system';

const INITIAL_SNAKE_BODY = [
	{ x: Math.floor(GRID_COLS / 2), y: Math.floor(GRID_ROWS / 2) - 1 },
	{ x: Math.floor(GRID_COLS / 2), y: Math.floor(GRID_ROWS / 2) },
	{ x: Math.floor(GRID_COLS / 2), y: Math.floor(GRID_ROWS / 2) + 1 },
];

const spawnInitialFood = (): { x: number; y: number } => {
	const occupiedKeys = new Set(INITIAL_SNAKE_BODY.map((pos) => `${pos.x},${pos.y}`));
	let position = { x: 0, y: 0 };

	do {
		position = {
			x: Math.floor(Math.random() * GRID_COLS),
			y: Math.floor(Math.random() * GRID_ROWS),
		};
	} while (occupiedKeys.has(`${position.x},${position.y}`));

	return position;
};

const createEntities = (): Entities => ({
	snake: {
		body: [...INITIAL_SNAKE_BODY.map((pos) => ({ ...pos }))],
		direction: 'UP' as Direction,
		growing: false,
		renderer: <SnakeRenderer body={INITIAL_SNAKE_BODY} />,
	},
	food: {
		position: spawnInitialFood(),
		renderer: <FoodRenderer position={{ x: 0, y: 0 }} />,
	},
	board: {
		width: GRID_COLS,
		height: GRID_ROWS,
	},
});

const SYSTEMS = [handleInput, moveSnake, checkFood, checkCollision];

export const RgeSnakeGame = () => {
	const [phase, setPhase] = useState<GamePhase>('idle');
	const [score, setScore] = useState(0);
	const [activeDirection, setActiveDirection] = useState<Direction | null>(null);
	const [entities, setEntities] = useState<Entities>(createEntities);

	const engineRef = useRef<GameEngine>(null);

	const handleEvent = useCallback((event: GameEvent) => {
		if (event.type === 'food-eaten') {
			setScore((prev) => prev + 1);
		}

		if (event.type === 'game-over') {
			setPhase('lost');
		}

		if (event.type === 'game-won') {
			setPhase('won');
		}
	}, []);

	const handleStart = useCallback(() => {
		resetMoveSnakeTick();
		const newEntities = createEntities();
		setEntities(newEntities);
		setScore(0);
		setActiveDirection(null);
		setPhase('playing');
	}, []);

	const handleRestart = useCallback(() => {
		handleStart();
	}, [handleStart]);

	const handleDirectionPress = useCallback((direction: Direction) => {
		setActiveDirection(direction);
	}, []);

	const isRunning = phase === 'playing';

  const boardCssVariables = {
    '--board-cols': GRID_COLS,
    '--board-rows': GRID_ROWS,
    '--board-cell-size': `${CELL_SIZE}px`,
  } as React.CSSProperties;  // Type assertion to satisfy React's CSSProperties type

	return (
		<div className={styles.wrapper}>
			<div
				className={styles.board}
				style={boardCssVariables}
			>
				<GameEngine
					ref={engineRef}
					className={styles.engineContainer}
					systems={SYSTEMS}
					entities={entities}
					running={isRunning}
					onEvent={handleEvent}
				/>
				<GameOverlay
					phase={phase}
					score={score}
					onStart={handleStart}
					onRestart={handleRestart}
				/>
			</div>
			<GameControls
				score={score}
				onDirectionPress={handleDirectionPress}
				activeDirection={activeDirection}
			/>
		</div>
	);
};
