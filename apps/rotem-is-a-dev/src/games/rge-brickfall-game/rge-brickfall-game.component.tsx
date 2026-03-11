'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GameEngine } from 'react-game-engine';
import { GameControls } from './components/game-controls';
import { GameOverlay } from './components/game-overlay';
import { GhostRenderer } from './renderers/ghost-renderer.component';
import { PieceRenderer } from './renderers/piece-renderer.component';
import { PlayfieldRenderer } from './renderers/playfield-renderer.component';
import {
	ACTION_MAPS,
	DEFAULT_BRICKFALL_CONFIG,
	SPAWN_POSITION,
} from './rge-brickfall-game.constants';
import {
	createEmptyGrid,
	getGhostPosition,
	randomTetrominoType,
} from './rge-brickfall-game.helpers';
import styles from './rge-brickfall-game.module.scss';
import type {
	BrickfallAction,
	BrickfallGameConfig,
	Entities,
	GameEvent,
	GamePhase,
	KeyScheme,
} from './rge-brickfall-game.types';
import { checkGameOver, gravity, handleInput, lockPiece } from './systems';

type ResolvedConfig = Required<BrickfallGameConfig>;

const resolveConfig = (config?: BrickfallGameConfig): ResolvedConfig => ({
	...DEFAULT_BRICKFALL_CONFIG,
	...config,
});

const createEntities = (
	{ gridCols, gridRows, cellSize, tickMs }: ResolvedConfig,
	keyScheme: KeyScheme,
): Entities => {
	const initialType = randomTetrominoType();
	const nextType = randomTetrominoType();
	const grid = createEmptyGrid(gridRows, gridCols);
	const piece = { type: initialType, position: { ...SPAWN_POSITION }, rotation: 0 as const };
	const ghostPosition = getGhostPosition(piece, grid, gridCols, gridRows);

	return {
		board: {
			width: gridCols,
			height: gridRows,
			cellSize,
			tickMs,
			lastGravityTime: 0,
			keyScheme,
			softDropping: false,
			pendingActions: [],
			level: 1,
			score: 0,
			linesCleared: 0,
			clearingStartTime: 0,
		},
		activePiece: {
			piece,
			cellSize,
			renderer: <PieceRenderer piece={piece} cellSize={cellSize} />,
		},
		nextPiece: {
			type: nextType,
		},
		playfield: {
			grid,
			cellSize,
			clearingRows: [],
			renderer: <PlayfieldRenderer grid={grid} cellSize={cellSize} clearingRows={[]} />,
		},
		ghost: {
			position: ghostPosition,
			type: initialType,
			rotation: 0,
			cellSize,
			renderer: (
				<GhostRenderer
					position={ghostPosition}
					type={initialType}
					rotation={0}
					cellSize={cellSize}
				/>
			),
		},
	};
};

const SYSTEMS = [handleInput, gravity, lockPiece, checkGameOver];

export type RgeBrickfallGameProps = {
	config?: BrickfallGameConfig;
};

export const RgeBrickfallGame = ({ config }: RgeBrickfallGameProps) => {
	const resolved = useMemo(() => resolveConfig(config), [config]);

	const [phase, setPhase] = useState<GamePhase>('idle');
	const [score, setScore] = useState(0);
	const [level, setLevel] = useState(1);
	const [linesCleared, setLinesCleared] = useState(0);
	const [activeAction, setActiveAction] = useState<BrickfallAction | null>(null);
	const [keyScheme, setKeyScheme] = useState<KeyScheme>('arrows');
	const [entities, setEntities] = useState<Entities>(() => createEntities(resolved, keyScheme));

	const engineRef = useRef<GameEngine>(null);

	const handleEvent = useCallback((event: GameEvent) => {
		if (event.type === 'game-over') {
			setPhase('lost');
		}

		if (event.type === 'score-updated') {
			setScore((prev) => prev);
		}
	}, []);

	const syncScoreFromEntities = useCallback(() => {
		setScore(entities.board.score);
		setLevel(entities.board.level);
		setLinesCleared(entities.board.linesCleared);
	}, [entities]);

	const handleStart = useCallback(() => {
		const newEntities = createEntities(resolved, keyScheme);
		setEntities(newEntities);
		setScore(0);
		setLevel(1);
		setLinesCleared(0);
		setActiveAction(null);
		setPhase('playing');
		engineRef.current?.swap(newEntities as unknown as Record<string, unknown>);
	}, [resolved, keyScheme]);

	const handleRestart = useCallback(() => {
		handleStart();
	}, [handleStart]);

	const handleToggleKeyScheme = useCallback(() => {
		setKeyScheme((prev) => {
			const next = prev === 'arrows' ? 'wasd' : 'arrows';
			entities.board.keyScheme = next;
			return next;
		});
	}, [entities]);

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			const action = ACTION_MAPS[keyScheme][event.key];
			if (action) {
				setActiveAction(action);
				entities.board.pendingActions.push(action);

				if (action === 'SOFT_DROP') {
					entities.board.softDropping = true;
				}
			}
		};

		const handleKeyUp = (event: KeyboardEvent) => {
			const action = ACTION_MAPS[keyScheme][event.key];

			if (action === 'SOFT_DROP') {
				entities.board.softDropping = false;
			}

			setActiveAction(null);
		};

		globalThis.addEventListener('keydown', handleKeyDown);
		globalThis.addEventListener('keyup', handleKeyUp);

		return () => {
			globalThis.removeEventListener('keydown', handleKeyDown);
			globalThis.removeEventListener('keyup', handleKeyUp);
		};
	}, [keyScheme, entities]);

	useEffect(() => {
		if (phase !== 'playing') return;

		const interval = setInterval(() => {
			syncScoreFromEntities();
		}, 100);

		return () => clearInterval(interval);
	}, [phase, syncScoreFromEntities]);

	const isRunning = phase === 'playing';

	const boardCssVariables = {
		'--board-cols': resolved.gridCols,
		'--board-rows': resolved.gridRows,
		'--board-cell-size': `${resolved.cellSize}px`,
	} as React.CSSProperties;

	return (
		<div className={styles.wrapper}>
			<div className={styles.board} style={boardCssVariables}>
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
					level={level}
					linesCleared={linesCleared}
					onStart={handleStart}
					onRestart={handleRestart}
				/>
			</div>
			<GameControls
				score={score}
				level={level}
				linesCleared={linesCleared}
				nextPieceType={entities.nextPiece.type}
				activeAction={activeAction}
				keyScheme={keyScheme}
				isPlaying={isRunning}
				onToggleKeyScheme={handleToggleKeyScheme}
			/>
		</div>
	);
};
