import type { ReactElement } from 'react';

import type { Direction, GamePhase, KeyScheme, Position, SystemArgs } from '../games.types';

export type PacmanGamePhase = GamePhase<'dying' | 'won'>;

export type GhostName = 'blinky' | 'pinky' | 'inky' | 'clyde';

export type GhostMode = 'chase' | 'scatter' | 'frightened' | 'eaten' | 'house';

export type FruitType = 'cherry' | 'strawberry' | 'orange' | 'apple' | 'melon' | 'galaxian' | 'bell' | 'key';

export type FruitConfig = {
	emoji: string;
	score: number;
};

export type CellType = 'wall' | 'dot' | 'power' | 'empty' | 'ghost-house' | 'ghost-door' | 'tunnel';

export type PacmanEntity = {
	position: Position;
	direction: Direction;
	nextDirection: Direction | null;
	dying: boolean;
	cellSize: number;
	renderer: ReactElement;
};

export type GhostConfig = {
	startPosition: Position;
	scatterTarget: Position;
	releaseThreshold: number;
	startDirection: Direction;
};

export type GhostEntity = {
	name: GhostName;
	position: Position;
	direction: Direction;
	mode: GhostMode;
	scatterTarget: Position;
	releaseThreshold: number;
	cellSize: number;
	renderer: ReactElement;
};

export type MazeEntity = {
	grid: CellType[][];
	dotsRemaining: number;
	totalDots: number;
	cellSize: number;
	renderer: ReactElement;
};

export type FruitEntity = {
	position: Position;
	active: boolean;
	spawnedAt: number;
	fruitType: FruitType;
	cellSize: number;
	renderer: ReactElement;
};

export type BoardEntity = {
	width: number;
	height: number;
	cellSize: number;
	pacmanTickMs: number;
	ghostTickMs: number;
	frightenedTickMs: number;
	eatenTickMs: number;
	lastPacmanTick: number;
	lastGhostTick: number;
	keyScheme: KeyScheme;
	pendingActions: Direction[];
	score: number;
	lives: number;
	ghostsEatenCombo: number;
	modeTimer: number;
	modePhaseIndex: number;
	currentGhostMode: 'chase' | 'scatter';
	frightenedTimer: number;
	dotsEaten: number;
	fruitSpawned70: boolean;
	fruitSpawned170: boolean;
};

export type Entities = {
	board: BoardEntity;
	pacman: PacmanEntity;
	blinky: GhostEntity;
	pinky: GhostEntity;
	inky: GhostEntity;
	clyde: GhostEntity;
	maze: MazeEntity;
	fruit: FruitEntity;
};

export type System = (entities: Entities, args: SystemArgs) => Entities;

export type ScatterChasePhase = {
	mode: 'scatter' | 'chase';
	durationMs: number;
};

export type PacmanRendererProps = {
	position: Position;
	direction: Direction;
	dying: boolean;
	cellSize: number;
};

export type GhostRendererProps = {
	name: GhostName;
	position: Position;
	direction: Direction;
	mode: GhostMode;
	frightenedTimer: number;
	cellSize: number;
};

export type MazeRendererProps = {
	grid: CellType[][];
	cellSize: number;
};

export type FruitRendererProps = {
	position: Position;
	active: boolean;
	fruitType: FruitType;
	cellSize: number;
};
