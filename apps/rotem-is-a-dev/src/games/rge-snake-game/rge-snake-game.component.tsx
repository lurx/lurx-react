'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GameEngine } from 'react-game-engine';
import { useActiveKey } from '../hooks/use-active-key';
import { GameControls } from './components/game-controls';
import { GameOverlay } from './components/game-overlay';
import { FoodRenderer } from './renderers/food-renderer.component';
import { SnakeRenderer } from './renderers/snake-renderer.component';
import { DEFAULT_SNAKE_CONFIG, DIRECTION_MAPS } from './rge-snake-game.constants';
import styles from './rge-snake-game.module.scss';
import type { Direction, GameEvent, KeyScheme } from '../games.types';
import type { Entities, SnakeGameConfig, SnakeGamePhase } from './rge-snake-game.types';
import { checkCollision, checkFood, handleInput, moveSnake } from './systems';

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

const createEntities = ({ gridCols, gridRows, cellSize, tickMs, winLength }: ResolvedConfig, keyScheme: KeyScheme): Entities => {
	const initialBody = buildInitialSnakeBody(gridCols, gridRows);

	return {
		snake: {
			body: [...initialBody.map((pos) => ({ ...pos }))],
			direction: 'UP',
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
			lastTickTime: 0,
			keyScheme,
			winLength,
		},
	};
};

const SYSTEMS = [handleInput, moveSnake, checkFood, checkCollision];

export type RgeSnakeGameProps = {
	config?: SnakeGameConfig;
	onWin?: () => void;
	onSkip?: () => void;
	onScoreChange?: (score: number) => void;
	hideControls?: boolean;
};

export const RgeSnakeGame = ({ config, onWin, onSkip, onScoreChange, hideControls }: RgeSnakeGameProps) => {
	const resolved = useMemo(() => resolveConfig(config), [config]);

	const [phase, setPhase] = useState<SnakeGamePhase>('idle');
	const [score, setScore] = useState(0);
	const [keyScheme, setKeyScheme] = useState<KeyScheme>('arrows');
	const [entities, setEntities] = useState<Entities>(() => createEntities(resolved, keyScheme));

	const activeDirection = useActiveKey<Direction>(DIRECTION_MAPS[keyScheme]);

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
		const newEntities = createEntities(resolved, keyScheme);
		setEntities(newEntities);
		setScore(0);
		setPhase('playing');
		engineRef.current?.swap(newEntities as unknown as Record<string, unknown>);
	}, [resolved, keyScheme]);

	const handleRestart = useCallback(() => {
		handleStart();
	}, [handleStart]);

	const handleDirectionPress = useCallback((_direction: Direction) => {
		/* no-op: direction presses are handled by useActiveKey */
	}, []);

	const handleToggleKeyScheme = useCallback(() => {
		setKeyScheme((prev) => {
			const next = prev === 'arrows' ? 'wasd' : 'arrows';
			entities.board.keyScheme = next;
			return next;
		});
	}, [entities]);

	useEffect(() => {
		if (phase === 'won' && onWin) {
			onWin();
		}
	}, [phase, onWin]);

	useEffect(() => {
		onScoreChange?.(score);
	}, [score, onScoreChange]);

	const isRunning = phase === 'playing';

	const boardCssVariables = {
		'--board-cols': resolved.gridCols,
		'--board-rows': resolved.gridRows,
		'--board-cell-size': `${resolved.cellSize}px`,
	};

	const boardElement = (
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
				onStartAction={handleStart}
				onRestartAction={handleRestart}
				onSkipAction={onSkip}
			/>
		</div>
	);

	if (hideControls) return boardElement;

	return (
		<div className={styles.wrapper}>
			{boardElement}
			<GameControls
				score={score}
				onDirectionPressAction={handleDirectionPress}
				activeDirection={activeDirection}
				keyScheme={keyScheme}
				isPlaying={isRunning}
				onToggleKeySchemeAction={handleToggleKeyScheme}
			/>
		</div>
	);
};
