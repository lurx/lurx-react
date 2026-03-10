export const GRID_COLS = 10;
export const GRID_ROWS = 20;
export const CELL_SIZE = 20;
export const BOARD_WIDTH = GRID_COLS * CELL_SIZE;
export const BOARD_HEIGHT = GRID_ROWS * CELL_SIZE;
export const TICK_MS = 150;
export const WIN_LENGTH = 20;

export const COLORS = {
	snake: '#43d9ad',
	snakeGlow: 'rgba(67, 217, 173, 0.4)',
	food: '#ffb86a',
	foodGlow: 'rgba(255, 184, 106, 0.6)',
} as const;

export const DIRECTION_MAP: Record<string, 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'> = {
	ArrowUp: 'UP',
	ArrowDown: 'DOWN',
	ArrowLeft: 'LEFT',
	ArrowRight: 'RIGHT',
};

export const OPPOSITE_DIRECTIONS: Record<string, string> = {
	UP: 'DOWN',
	DOWN: 'UP',
	LEFT: 'RIGHT',
	RIGHT: 'LEFT',
};
