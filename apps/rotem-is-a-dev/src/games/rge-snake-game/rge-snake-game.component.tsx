'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GameEngine } from 'react-game-engine';
import { GameControls } from './components/game-controls';
import { GameOverlay } from './components/game-overlay';
import { FoodRenderer } from './renderers/food-renderer.component';
import { SnakeRenderer } from './renderers/snake-renderer.component';
import { DEFAULT_SNAKE_CONFIG, DIRECTION_MAPS } from './rge-snake-game.constants';
import styles from './rge-snake-game.module.scss';
import type { Direction, Entities, GameEvent, GamePhase, KeyScheme, SnakeGameConfig } from './rge-snake-game.types';
import { checkCollision, checkFood, handleInput, moveSnake } from './systems';
import { resetMoveSnakeTick } from './systems/move-snake.system';

type ResolvedConfig = Required<SnakeGameConfig>;

const resolveConfig = (config?: SnakeGameConfig): ResolvedConfig => ({
	...DEFAULT_SNAKE_CONFIG,
	...config,
});

const buildInitialSnakeBody = (gridCols: number, gridRows: number) => [
	{ x: Math.floor(gridCols / 2), y: Math.floor(gridRows / 2) - 1 },
	{ x: Math.floor(gridCols / 2), y: Math.floor(gridRows / 2) },
	{ x: Math.floor(gridCols / 2), y: Math.floor(gridRows / 2) + 1 },
];

const spawnInitialFood = (snakeBody: { x: number; y: number }[], gridCols: number, gridRows: number) => {
	const occupiedKeys = new Set(snakeBody.map((pos) => `${pos.x},${pos.y}`));
	let position = { x: 0, y: 0 };

	do {
		position = {
			x: Math.floor(Math.random() * gridCols),
			y: Math.floor(Math.random() * gridRows),
		};
	} while (occupiedKeys.has(`${position.x},${position.y}`));

	return position;
};

const createEntities = ({ gridCols, gridRows, cellSize, tickMs }: ResolvedConfig, keyScheme: KeyScheme): Entities => {
	const initialBody = buildInitialSnakeBody(gridCols, gridRows);

	return {
		snake: {
			body: [...initialBody.map((pos) => ({ ...pos }))],
			direction: 'UP' as Direction,
			growing: false,
			cellSize,
			renderer: <SnakeRenderer body={initialBody} cellSize={cellSize} />,
		},
		food: {
			position: spawnInitialFood(initialBody, gridCols, gridRows),
			cellSize,
			renderer: <FoodRenderer position={{ x: 0, y: 0 }} cellSize={cellSize} />,
		},
		board: {
			width: gridCols,
			height: gridRows,
			cellSize,
			tickMs,
			keyScheme,
		},
	};
};

const SYSTEMS = [handleInput, moveSnake, checkFood, checkCollision];

export type RgeSnakeGameProps = {
	config?: SnakeGameConfig;
};

export const RgeSnakeGame = ({ config }: RgeSnakeGameProps) => {
	const resolved = useMemo(() => resolveConfig(config), [config]);

	const [phase, setPhase] = useState<GamePhase>('idle');
	const [score, setScore] = useState(0);
	const [activeDirection, setActiveDirection] = useState<Direction | null>(null);
	const [keyScheme, setKeyScheme] = useState<KeyScheme>('arrows');
	const [entities, setEntities] = useState<Entities>(() => createEntities(resolved, keyScheme));

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
		const newEntities = createEntities(resolved, keyScheme);
		setEntities(newEntities);
		setScore(0);
		setActiveDirection(null);
		setPhase('playing');
		engineRef.current?.swap(newEntities as unknown as Record<string, unknown>);
	}, [resolved, keyScheme]);

	const handleRestart = useCallback(() => {
		handleStart();
	}, [handleStart]);

	const handleDirectionPress = useCallback((direction: Direction) => {
		setActiveDirection(direction);
	}, []);

	const handleToggleKeyScheme = useCallback(() => {
		setKeyScheme((prev) => {
			const next = prev === 'arrows' ? 'wasd' : 'arrows';
			entities.board.keyScheme = next;
			return next;
		});
	}, [entities]);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			const direction = DIRECTION_MAPS[keyScheme][event.key];
			if (direction) setActiveDirection(direction);
		};

		const handleKeyUp = () => setActiveDirection(null);

		globalThis.addEventListener('keydown', handleKeyDown);
		globalThis.addEventListener('keyup', handleKeyUp);

		return () => {
			globalThis.removeEventListener('keydown', handleKeyDown);
			globalThis.removeEventListener('keyup', handleKeyUp);
		};
	}, [keyScheme]);

	const isRunning = phase === 'playing';

	const boardCssVariables = {
		'--board-cols': resolved.gridCols,
		'--board-rows': resolved.gridRows,
		'--board-cell-size': `${resolved.cellSize}px`,
	} as React.CSSProperties;

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
				keyScheme={keyScheme}
				onToggleKeyScheme={handleToggleKeyScheme}
			/>
		</div>
	);
};
