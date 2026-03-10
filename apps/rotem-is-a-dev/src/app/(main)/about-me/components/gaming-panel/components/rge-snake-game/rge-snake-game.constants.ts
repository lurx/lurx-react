export const GRID_COLS = 10;
export const GRID_ROWS = 20;
export const CELL_SIZE = 20;
export const TICK_MS = 150;
export const WIN_LENGTH = 20;

export const DEFAULT_SNAKE_CONFIG = {
  gridCols: GRID_COLS,
  gridRows: GRID_ROWS,
  cellSize: CELL_SIZE,
  tickMs: TICK_MS,
}

export const COLORS = {
	snake: '#43d9ad',
	snakeGlow: 'rgba(67, 217, 173, 0.4)',
	food: '#ffb86a',
	foodGlow: 'rgba(255, 184, 106, 0.6)',
} as const;

export const ARROW_DIRECTION_MAP: Record<string, 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'> = {
	ArrowUp: 'UP',
	ArrowDown: 'DOWN',
	ArrowLeft: 'LEFT',
	ArrowRight: 'RIGHT',
};

/* eslint-disable id-length */
export const WASD_DIRECTION_MAP: Record<string, 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'> = {
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

export const DIRECTION_MAPS = {
	arrows: ARROW_DIRECTION_MAP,
	wasd: WASD_DIRECTION_MAP,
} as const;

export const OPPOSITE_DIRECTIONS: Record<string, string> = {
	UP: 'DOWN',
	DOWN: 'UP',
	LEFT: 'RIGHT',
	RIGHT: 'LEFT',
};
