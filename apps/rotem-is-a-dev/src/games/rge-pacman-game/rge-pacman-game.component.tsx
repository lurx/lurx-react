'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GameEngine } from 'react-game-engine';
import { useActiveKey } from '../hooks/use-active-key';
import { GameControls } from './components/game-controls';
import { GameOverlay } from './components/game-overlay';
import { FruitRenderer } from './renderers/fruit-renderer.component';
import { GhostRenderer } from './renderers/ghost-renderer.component';
import { MazeRenderer } from './renderers/maze-renderer.component';
import { PacmanRenderer } from './renderers/pacman-renderer.component';
import {
	ACTION_MAPS,
	CELL_SIZE,
	DEATH_SEQUENCE_MS,
	DEFAULT_PACMAN_CONFIG,
	EATEN_TICK_MS,
	FRIGHTENED_TICK_MS,
	FRUIT_POSITION,
	GHOST_CONFIG,
	GHOST_TICK_MS,
	GRID_COLS,
	GRID_ROWS,
	INITIAL_LIVES,
	LEVEL_1_MAZE,
	PACMAN_START,
	PACMAN_TICK_MS,
	SCORE_SYNC_INTERVAL_MS,
} from './rge-pacman-game.constants';
import { createMazeGrid, getInitialGhostMode, resetPositions } from './rge-pacman-game.helpers';
import styles from './rge-pacman-game.module.scss';
import type { Direction, GameEvent, KeyScheme } from '../games.types';
import type {
	Entities,
	GhostName,
	PacmanGamePhase,
} from './rge-pacman-game.types';
import {
	checkDotCollision,
	checkFruit,
	checkGhostCollision,
	checkWinLose,
	handleInput,
	moveGhosts,
	movePacman,
	updateMode,
} from './systems';

const createEntities = (keyScheme: KeyScheme): Entities => {
	const { grid, totalDots } = createMazeGrid(LEVEL_1_MAZE);

	const entities: Entities = {
		board: {
			width: GRID_COLS,
			height: GRID_ROWS,
			cellSize: CELL_SIZE,
			pacmanTickMs: PACMAN_TICK_MS,
			ghostTickMs: GHOST_TICK_MS,
			frightenedTickMs: FRIGHTENED_TICK_MS,
			eatenTickMs: EATEN_TICK_MS,
			lastPacmanTick: 0,
			lastGhostTick: 0,
			keyScheme,
			pendingActions: [],
			score: 0,
			lives: INITIAL_LIVES,
			ghostsEatenCombo: 0,
			modeTimer: 0,
			modePhaseIndex: 0,
			currentGhostMode: 'scatter',
			frightenedTimer: 0,
			dotsEaten: 0,
			fruitSpawned70: false,
			fruitSpawned170: false,
		},
		pacman: {
			position: { ...PACMAN_START },
			direction: 'LEFT',
			nextDirection: null,
			dying: false,
			cellSize: CELL_SIZE,
			renderer: (
				<PacmanRenderer
					position={{ ...PACMAN_START }}
					direction="LEFT"
					dying={false}
					cellSize={CELL_SIZE}
				/>
			),
		},
		blinky: createGhostEntity('blinky'),
		pinky: createGhostEntity('pinky'),
		inky: createGhostEntity('inky'),
		clyde: createGhostEntity('clyde'),
		maze: {
			grid,
			dotsRemaining: totalDots,
			totalDots,
			cellSize: CELL_SIZE,
			renderer: (
				<MazeRenderer
					grid={grid}
					cellSize={CELL_SIZE}
				/>
			),
		},
		fruit: {
			position: { ...FRUIT_POSITION },
			active: false,
			spawnedAt: 0,
			fruitType: 'cherry',
			cellSize: CELL_SIZE,
			renderer: (
				<FruitRenderer
					position={{ ...FRUIT_POSITION }}
					active={false}
					fruitType="cherry"
					cellSize={CELL_SIZE}
				/>
			),
		},
	};

	return entities;
};

const createGhostEntity = (name: GhostName) => {
	const config = GHOST_CONFIG[name];

	return {
		name,
		position: { ...config.startPosition },
		direction: config.startDirection,
		mode: getInitialGhostMode(name),
		scatterTarget: { ...config.scatterTarget },
		releaseThreshold: config.releaseThreshold,
		cellSize: CELL_SIZE,
		renderer: (
			<GhostRenderer
				name={name}
				position={{ ...config.startPosition }}
				direction={config.startDirection}
				mode={getInitialGhostMode(name)}
				frightenedTimer={0}
				cellSize={CELL_SIZE}
			/>
		),
	};
};

const SYSTEMS = [
	handleInput,
	updateMode,
	movePacman,
	checkDotCollision,
	moveGhosts,
	checkGhostCollision,
	checkFruit,
	checkWinLose,
];

export const RgePacmanGame = () => {
	const [phase, setPhase] = useState<PacmanGamePhase>('idle');
	const [score, setScore] = useState(0);
	const [lives, setLives] = useState(INITIAL_LIVES);
	const [keyScheme, setKeyScheme] = useState<KeyScheme>('arrows');
	const [entities, setEntities] = useState<Entities>(() =>
		createEntities(keyScheme),
	);

	const activeAction = useActiveKey<Direction>(ACTION_MAPS[keyScheme]);

	const engineRef = useRef<GameEngine>(null);

	const handleEvent = useCallback(
		(event: GameEvent) => {
			if (event.type === 'pacman-died') {
				setLives(entities.board.lives);
				setPhase('dying');
			}

			if (event.type === 'level-complete') {
				setScore(entities.board.score);
				setPhase('won');
			}

			if (event.type === 'score-updated') {
				setScore(entities.board.score);
			}
		},
		[entities],
	);

	useEffect(() => {
		if (phase !== 'dying') return;

		const timeout = setTimeout(() => {
			if (entities.board.lives <= 0) {
				setScore(entities.board.score);
				setPhase('lost');
			} else {
				entities.pacman.dying = false;
				resetPositions(entities);
				setPhase('playing');
			}
		}, DEATH_SEQUENCE_MS);

		return () => clearTimeout(timeout);
	}, [phase, entities]);

	const handleStart = useCallback(() => {
		const newEntities = createEntities(keyScheme);
		setEntities(newEntities);
		setScore(0);
		setLives(INITIAL_LIVES);
		setPhase('playing');
		engineRef.current?.swap(newEntities as unknown as Record<string, unknown>);
	}, [keyScheme]);

	const handleRestart = useCallback(() => {
		handleStart();
	}, [handleStart]);

	const handleToggleKeyScheme = useCallback(() => {
		setKeyScheme(prev => {
			const next = prev === 'arrows' ? 'wasd' : 'arrows';
			entities.board.keyScheme = next;
			return next;
		});
	}, [entities]);

	const handleDirectionPress = useCallback((direction: Direction) => {
		entities.board.pendingActions.push(direction);
	}, [entities]);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			const action = ACTION_MAPS[keyScheme][event.key];
			if (action) {
				entities.board.pendingActions.push(action);
			}
		};

		globalThis.addEventListener('keydown', handleKeyDown);

		return () => {
			globalThis.removeEventListener('keydown', handleKeyDown);
		};
	}, [keyScheme, entities]);

	useEffect(() => {
		if (phase !== 'playing') return;

		const interval = setInterval(() => {
			setScore(entities.board.score);
			setLives(entities.board.lives);
		}, SCORE_SYNC_INTERVAL_MS);

		return () => clearInterval(interval);
	}, [phase, entities]);

	const isRunning = phase === 'playing';

	const boardCssVariables = useMemo(
		() =>
			({
				'--board-cols': DEFAULT_PACMAN_CONFIG.gridCols,
				'--board-rows': DEFAULT_PACMAN_CONFIG.gridRows,
				'--board-cell-size': `${DEFAULT_PACMAN_CONFIG.cellSize}px`,
			}),
		[],
	);

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
					lives={lives}
					onStartAction={handleStart}
					onRestartAction={handleRestart}
				/>
			</div>
			<GameControls
				score={score}
				lives={lives}
				activeAction={activeAction}
				keyScheme={keyScheme}
				isPlaying={isRunning}
				onDirectionPressAction={handleDirectionPress}
				onToggleKeySchemeAction={handleToggleKeyScheme}
			/>
		</div>
	);
};
