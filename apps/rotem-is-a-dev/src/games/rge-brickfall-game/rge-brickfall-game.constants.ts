import type { Position } from '../games.types';
import type { BrickfallAction, RotationState, TetrominoType } from './rge-brickfall-game.types';

export const GRID_COLS = 10;
export const GRID_ROWS = 20;
export const CELL_SIZE = 20;
export const BASE_TICK_MS = 800;

export const DEFAULT_BRICKFALL_CONFIG = {
	gridCols: GRID_COLS,
	gridRows: GRID_ROWS,
	cellSize: CELL_SIZE,
	tickMs: BASE_TICK_MS,
};

/* eslint-disable id-length */
export const TETROMINO_COLORS = {
	I: '#00e5ff', // --cyan
	O: '#ffea00', // --yellow
	T: '#c792ea',
	S: '#43d9ad',
	Z: '#ff5370', // alert
	L: '#ffb86a', // orange
	J: '#82aaff',
} satisfies Record<TetrominoType, string>;

export const GLOW_COLORS = {
	I: 'rgba(0, 229, 255, 0.4)',
	O: 'rgba(255, 234, 0, 0.4)',
	T: 'rgba(199, 146, 234, 0.4)',
	S: 'rgba(67, 217, 173, 0.4)',
	Z: 'rgba(255, 83, 112, 0.4)',
	L: 'rgba(255, 184, 106, 0.4)',
	J: 'rgba(130, 170, 255, 0.4)',
} satisfies Record<TetrominoType, string>;

export const TETROMINO_SHAPES = {
	I: {
		0: [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 }],
		1: [{ x: 2, y: 0 }, { x: 2, y: 1 }, { x: 2, y: 2 }, { x: 2, y: 3 }],
		2: [{ x: 0, y: 2 }, { x: 1, y: 2 }, { x: 2, y: 2 }, { x: 3, y: 2 }],
		3: [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 1, y: 3 }],
	},
	O: {
		0: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }],
		1: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }],
		2: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }],
		3: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }],
	},
	T: {
		0: [{ x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }],
		1: [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 2 }],
		2: [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 2 }],
		3: [{ x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 2 }],
	},
	S: {
		0: [{ x: 1, y: 0 }, { x: 2, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }],
		1: [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 2, y: 2 }],
		2: [{ x: 1, y: 1 }, { x: 2, y: 1 }, { x: 0, y: 2 }, { x: 1, y: 2 }],
		3: [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 2 }],
	},
	Z: {
		0: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }],
		1: [{ x: 2, y: 0 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 1, y: 2 }],
		2: [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 2 }],
		3: [{ x: 1, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 0, y: 2 }],
	},
	L: {
		0: [{ x: 2, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }],
		1: [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }, { x: 2, y: 2 }],
		2: [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 0, y: 2 }],
		3: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }],
	},
	J: {
		0: [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }],
		1: [{ x: 1, y: 0 }, { x: 2, y: 0 }, { x: 1, y: 1 }, { x: 1, y: 2 }],
		2: [{ x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 2, y: 2 }],
		3: [{ x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 2 }, { x: 1, y: 2 }],
	},
} satisfies Record<TetrominoType, Record<RotationState, Position[]>>;
/* eslint-enable id-length */

export const SPAWN_POSITION: Position = { x: 3, y: 0 };

export const ALL_TETROMINO_TYPES: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'L', 'J'];

export const GHOST_OPACITY = 0.2;

export const ARROW_ACTION_MAP: Record<string, BrickfallAction> = {
	ArrowLeft: 'LEFT',
	ArrowRight: 'RIGHT',
	ArrowUp: 'ROTATE',
	ArrowDown: 'SOFT_DROP',
	' ': 'HARD_DROP',
};

/* eslint-disable id-length */
export const WASD_ACTION_MAP: Record<string, BrickfallAction> = {
	a: 'LEFT',
	A: 'LEFT',
	d: 'RIGHT',
	D: 'RIGHT',
	w: 'ROTATE',
	W: 'ROTATE',
	s: 'SOFT_DROP',
	S: 'SOFT_DROP',
};
/* eslint-enable id-length */

export const ACTION_MAPS = {
	arrows: ARROW_ACTION_MAP,
	wasd: WASD_ACTION_MAP,
} as const;

export const LINE_SCORES: Record<number, number> = {
	1: 100,
	2: 300,
	3: 500,
	4: 800,
};

export const LINES_PER_LEVEL = 10;
export const TICK_REDUCTION_PER_LEVEL = 60;
export const MIN_TICK_MS = 100;
export const SOFT_DROP_TICK_MS = 50;
export const LINE_CLEAR_BLINK_MS = 500;
