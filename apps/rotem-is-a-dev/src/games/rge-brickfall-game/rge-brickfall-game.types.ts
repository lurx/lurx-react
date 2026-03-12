import type { ReactElement } from 'react';

import type { GameEvent, GameTime, InputEvent } from '../rge-engine.types';

export type { GameEvent, GameTime, InputEvent };

export type Position = {
	x: number;
	y: number;
};

export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'L' | 'J';

export type RotationState = 0 | 1 | 2 | 3;

export type ActivePiece = {
	type: TetrominoType;
	position: Position;
	rotation: RotationState;
};

export type CellColor = string | null;

export type PlayfieldGrid = CellColor[][];

export type BrickfallAction = 'LEFT' | 'RIGHT' | 'ROTATE' | 'SOFT_DROP' | 'HARD_DROP';

export type KeyScheme = 'arrows' | 'wasd';

export type GamePhase = 'idle' | 'playing' | 'lost';

export type BrickfallGameConfig = {
	gridCols?: number;
	gridRows?: number;
	cellSize?: number;
	tickMs?: number;
};

export type BoardEntity = {
	width: number;
	height: number;
	cellSize: number;
	tickMs: number;
	lastGravityTime: number;
	keyScheme: KeyScheme;
	softDropping: boolean;
	pendingActions: BrickfallAction[];
	level: number;
	score: number;
	linesCleared: number;
	clearingStartTime: number;
};

export type ActivePieceEntity = {
	piece: ActivePiece;
	cellSize: number;
	renderer: ReactElement;
};

export type NextPieceEntity = {
	type: TetrominoType;
};

export type PlayfieldEntity = {
	grid: PlayfieldGrid;
	cellSize: number;
	clearingRows: number[];
	renderer: ReactElement;
};

export type GhostEntity = {
	position: Position;
	type: TetrominoType;
	rotation: RotationState;
	cellSize: number;
	renderer: ReactElement;
};

export type Entities = {
	board: BoardEntity;
	activePiece: ActivePieceEntity;
	nextPiece: NextPieceEntity;
	playfield: PlayfieldEntity;
	ghost: GhostEntity;
};

export type SystemArgs = {
	input: InputEvent[];
	events: GameEvent[];
	dispatch: (event: GameEvent) => void;
	time: GameTime;
};

export type System = (entities: Entities, args: SystemArgs) => Entities;
