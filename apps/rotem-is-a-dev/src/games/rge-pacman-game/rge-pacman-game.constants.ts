import type { Direction, KeyScheme, Position } from '../games.types';
import type { FruitConfig, FruitType, GhostConfig, GhostName, ScatterChasePhase } from './rge-pacman-game.types';

const SPEED_MULTIPLIER = 1.5; // bigger value = slower game

export const GRID_COLS = 28;
export const GRID_ROWS = 31;
export const CELL_SIZE = 25;

export const PACMAN_TICK_MS = 80 * SPEED_MULTIPLIER;
export const GHOST_TICK_MS = 90 * SPEED_MULTIPLIER;
export const FRIGHTENED_TICK_MS = 120 * SPEED_MULTIPLIER;
export const EATEN_TICK_MS = 40 * SPEED_MULTIPLIER;

export const FRIGHTENED_DURATION_MS = 6000;
export const FRIGHTENED_FLASH_MS = 2000;
export const FRUIT_DURATION_MS = 10000;
export const DEATH_SEQUENCE_MS = 1800;

export const PACMAN_COLOR = '#FFE000';
export const WALL_COLOR = '#2121DE';
export const DOT_COLOR = '#FFFFFF';
export const POWER_COLOR = '#FFFFFF';
export const FRIGHTENED_COLOR = '#2121DE';
export const FRIGHTENED_FLASH_COLOR = '#FFFFFF';

export const GHOST_COLORS = {
	blinky: '#FF0000',
	pinky: '#FFB8FF',
	inky: '#00FFFF',
	clyde: '#FFB852',
} satisfies Record<GhostName, string>;

export const DOT_SIZE = 4;
export const POWER_SIZE = 10;

export const PACMAN_START: Position = { x: 14, y: 23 };
export const FRUIT_POSITION: Position = { x: 14, y: 17 };

export const GHOST_CONFIG = {
	blinky: {
		startPosition: { x: 14, y: 11 },
		scatterTarget: { x: 25, y: 0 },
		releaseThreshold: 0,
		startDirection: 'LEFT',
	},
	pinky: {
		startPosition: { x: 14, y: 14 },
		scatterTarget: { x: 2, y: 0 },
		releaseThreshold: 0,
		startDirection: 'DOWN',
	},
	inky: {
		startPosition: { x: 12, y: 14 },
		scatterTarget: { x: 27, y: 30 },
		releaseThreshold: 30,
		startDirection: 'UP',
	},
	clyde: {
		startPosition: { x: 16, y: 14 },
		scatterTarget: { x: 0, y: 30 },
		releaseThreshold: 60,
		startDirection: 'UP',
	},
} satisfies Record<GhostName, GhostConfig>;

export const GHOST_HOUSE_CENTER: Position = { x: 14, y: 14 };
export const GHOST_DOOR_POSITION: Position = { x: 14, y: 12 };

export const DIRECTION_DELTAS = {
	UP: { x: 0, y: -1 },
	DOWN: { x: 0, y: 1 },
	LEFT: { x: -1, y: 0 },
	RIGHT: { x: 1, y: 0 },
} satisfies Record<Direction, Position>;

export const OPPOSITE_DIRECTIONS = {
	UP: 'DOWN',
	DOWN: 'UP',
	LEFT: 'RIGHT',
	RIGHT: 'LEFT',
} satisfies Record<Direction, Direction>;

export const ALL_DIRECTIONS: Direction[] = ['UP', 'DOWN', 'LEFT', 'RIGHT'];

export const ARROW_ACTION_MAP: Record<string, Direction> = {
	ArrowUp: 'UP',
	ArrowDown: 'DOWN',
	ArrowLeft: 'LEFT',
	ArrowRight: 'RIGHT',
};

/* eslint-disable id-length */
export const WASD_ACTION_MAP: Record<string, Direction> = {
	w: 'UP',
	W: 'UP',
	s: 'DOWN',
	S: 'DOWN',
	a: 'LEFT',
	A: 'LEFT',
	d: 'RIGHT',
	D: 'RIGHT',
};
/* eslint-enable id-length */

export const ACTION_MAPS: Record<KeyScheme, Record<string, Direction>> = {
	arrows: ARROW_ACTION_MAP,
	wasd: WASD_ACTION_MAP,
};

/**
 * Scatter/chase phase durations in ms for Level 1.
 * [mode, durationMs] — final chase phase is infinite (0 = infinite).
 */
export const SCATTER_CHASE_PATTERN: ScatterChasePhase[] = [
	{ mode: 'scatter', durationMs: 7000 },
	{ mode: 'chase', durationMs: 20000 },
	{ mode: 'scatter', durationMs: 7000 },
	{ mode: 'chase', durationMs: 20000 },
	{ mode: 'scatter', durationMs: 5000 },
	{ mode: 'chase', durationMs: 20000 },
	{ mode: 'scatter', durationMs: 5000 },
	{ mode: 'chase', durationMs: 0 },
];

export const FRUIT_SPAWN_DOT_THRESHOLDS = [70, 170] as const;

export const FRUIT_CONFIG = {
	cherry: { emoji: '\u{1F352}', score: 100 }, // 🍒
	strawberry: { emoji: '\u{1F353}', score: 300 }, // 🍓
	orange: { emoji: '\u{1F34A}', score: 500 }, // 🍊
	apple: { emoji: '\u{1F34E}', score: 700 }, // 🍎
	melon: { emoji: '\u{1F348}', score: 1000 }, // 🍈
	galaxian: { emoji: '\u{1F680}', score: 2000 }, // 🚀
	bell: { emoji: '\u{1F514}', score: 3000 }, // 🔔
	key: { emoji: '\u{1F511}', score: 5000 }, // 🔑
} satisfies Record<FruitType, FruitConfig>;
export const DOT_SCORE = 10;
export const POWER_SCORE = 50;
export const GHOST_BASE_SCORE = 200;

export const GHOST_DEATH_NUDGE = 0.5;
export const SCORE_SYNC_INTERVAL_MS = 100;
export const INITIAL_LIVES = 3;
export const GHOST_NAMES: GhostName[] = ['blinky', 'pinky', 'inky', 'clyde'];

export const DEFAULT_PACMAN_CONFIG = {
	gridCols: GRID_COLS,
	gridRows: GRID_ROWS,
	cellSize: CELL_SIZE,
};

/**
 * Classic Pac-Man Level 1 maze layout (28x31).
 * 0=wall, 1=dot, 2=power, 3=empty, 4=ghost-house, 5=ghost-door, 6=tunnel
 */
export const LEVEL_1_MAZE: number[][] = [
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
	[0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0],
	[0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
	[0,2,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,2,0],
	[0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
	[0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
	[0,1,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,1,0],
	[0,1,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,1,0],
	[0,1,1,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,1,1,0],
	[0,0,0,0,0,0,1,0,0,0,0,0,3,0,0,3,0,0,0,0,0,1,0,0,0,0,0,0],
	[0,0,0,0,0,0,1,0,0,0,0,0,3,0,0,3,0,0,0,0,0,1,0,0,0,0,0,0],
	[0,0,0,0,0,0,1,0,0,3,3,3,3,3,3,3,3,3,3,0,0,1,0,0,0,0,0,0],
	[0,0,0,0,0,0,1,0,0,3,0,0,0,5,5,0,0,0,3,0,0,1,0,0,0,0,0,0],
	[0,0,0,0,0,0,1,0,0,3,0,4,4,4,4,4,4,0,3,0,0,1,0,0,0,0,0,0],
	[6,3,3,3,3,3,1,3,3,3,0,4,4,4,4,4,4,0,3,3,3,1,3,3,3,3,3,6],
	[0,0,0,0,0,0,1,0,0,3,0,4,4,4,4,4,4,0,3,0,0,1,0,0,0,0,0,0],
	[0,0,0,0,0,0,1,0,0,3,0,0,0,0,0,0,0,0,3,0,0,1,0,0,0,0,0,0],
	[0,0,0,0,0,0,1,0,0,3,3,3,3,3,3,3,3,3,3,0,0,1,0,0,0,0,0,0],
	[0,0,0,0,0,0,1,0,0,3,0,0,0,0,0,0,0,0,3,0,0,1,0,0,0,0,0,0],
	[0,0,0,0,0,0,1,0,0,3,0,0,0,0,0,0,0,0,3,0,0,1,0,0,0,0,0,0],
	[0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0],
	[0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
	[0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
	[0,2,1,1,0,0,1,1,1,1,1,1,1,3,3,1,1,1,1,1,1,1,0,0,1,1,2,0],
	[0,0,0,1,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,1,0,0,0],
	[0,0,0,1,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,1,0,0,0],
	[0,1,1,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,1,1,0],
	[0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0],
	[0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0],
	[0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
	[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
];
