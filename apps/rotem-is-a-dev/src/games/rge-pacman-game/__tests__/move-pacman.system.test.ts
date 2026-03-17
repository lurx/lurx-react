import { movePacman } from '../systems/move-pacman.system';
import type { SystemArgs } from '../../games.types';
import type { CellType, Entities } from '../rge-pacman-game.types';
import type { ReactElement } from 'react';

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

const MOCK_RENDERER = null as unknown as ReactElement;

/**
 * 5x5 grid with walls on the border and passable cells inside.
 *
 *   W W W W W
 *   W . . . W
 *   W . . . W
 *   W . . . W
 *   W W W W W
 */
const createSmallGrid = (): CellType[][] => [
	['wall', 'wall', 'wall', 'wall', 'wall'],
	['wall', 'dot', 'dot', 'dot', 'wall'],
	['wall', 'dot', 'dot', 'dot', 'wall'],
	['wall', 'dot', 'dot', 'dot', 'wall'],
	['wall', 'wall', 'wall', 'wall', 'wall'],
];

/**
 * 7x3 grid with tunnel cells on the edges for wrapping tests.
 *
 *   W W W W W W W
 *   T . . . . . T
 *   W W W W W W W
 */
const createTunnelGrid = (): CellType[][] => [
	['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
	['tunnel', 'empty', 'empty', 'empty', 'empty', 'empty', 'tunnel'],
	['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
];

const createMockEntities = (overrides?: Partial<{
	pacmanX: number;
	pacmanY: number;
	direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
	nextDirection: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' | null;
	lastPacmanTick: number;
	grid: CellType[][];
	width: number;
	height: number;
}>): Entities => {
	const grid = overrides?.grid ?? createSmallGrid();
	const width = overrides?.width ?? grid[0].length;
	const height = overrides?.height ?? grid.length;

	return {
		board: {
			width,
			height,
			cellSize: 16,
			pacmanTickMs: 80,
			ghostTickMs: 90,
			frightenedTickMs: 120,
			eatenTickMs: 40,
			lastPacmanTick: overrides?.lastPacmanTick ?? 1,
			lastGhostTick: 1,
			keyScheme: 'arrows',
			pendingActions: [],
			score: 0,
			lives: 3,
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
			position: { x: overrides?.pacmanX ?? 2, y: overrides?.pacmanY ?? 2 },
			direction: overrides?.direction ?? 'RIGHT',
			nextDirection: overrides?.nextDirection ?? null,
			dying: false,
			cellSize: 16,
			renderer: MOCK_RENDERER,
		},
		blinky: {
			name: 'blinky',
			position: { x: 1, y: 1 },
			direction: 'LEFT',
			mode: 'scatter',
			scatterTarget: { x: 4, y: 0 },
			releaseThreshold: 0,
			cellSize: 16,
			renderer: MOCK_RENDERER,
		},
		pinky: {
			name: 'pinky',
			position: { x: 2, y: 1 },
			direction: 'DOWN',
			mode: 'house',
			scatterTarget: { x: 0, y: 0 },
			releaseThreshold: 0,
			cellSize: 16,
			renderer: MOCK_RENDERER,
		},
		inky: {
			name: 'inky',
			position: { x: 3, y: 1 },
			direction: 'UP',
			mode: 'house',
			scatterTarget: { x: 4, y: 4 },
			releaseThreshold: 30,
			cellSize: 16,
			renderer: MOCK_RENDERER,
		},
		clyde: {
			name: 'clyde',
			position: { x: 1, y: 3 },
			direction: 'UP',
			mode: 'house',
			scatterTarget: { x: 0, y: 4 },
			releaseThreshold: 60,
			cellSize: 16,
			renderer: MOCK_RENDERER,
		},
		maze: {
			grid,
			dotsRemaining: 9,
			totalDots: 9,
			cellSize: 16,
			renderer: MOCK_RENDERER,
		},
		fruit: {
			position: { x: 2, y: 3 },
			active: false,
			spawnedAt: 0,
			fruitType: 'cherry',
			cellSize: 16,
			renderer: MOCK_RENDERER,
		},
	} as Entities;
};

const createMockArgs = (currentTime: number): SystemArgs => ({
	input: [],
	events: [],
	dispatch: jest.fn(),
	time: { current: currentTime, previous: null, delta: 0, previousDelta: null },
});

/* ------------------------------------------------------------------ */
/*  Tests                                                             */
/* ------------------------------------------------------------------ */

describe('movePacman', () => {
	it('moves pacman in the current direction when tick has elapsed', () => {
		const entities = createMockEntities({
			pacmanX: 2,
			pacmanY: 2,
			direction: 'RIGHT',
			lastPacmanTick: 1,
		});
		const args = createMockArgs(100);
		const result = movePacman(entities, args);

		expect(result.pacman.position).toEqual({ x: 3, y: 2 });
	});

	it('does not move pacman before tick interval has elapsed', () => {
		const entities = createMockEntities({
			pacmanX: 2,
			pacmanY: 2,
			direction: 'RIGHT',
			lastPacmanTick: 1,
		});
		const args = createMockArgs(50);
		const result = movePacman(entities, args);

		expect(result.pacman.position).toEqual({ x: 2, y: 2 });
	});

	it('updates lastPacmanTick after moving', () => {
		const entities = createMockEntities({ lastPacmanTick: 0 });
		const args = createMockArgs(100);
		movePacman(entities, args);

		expect(entities.board.lastPacmanTick).toBe(100);
	});

	it('applies nextDirection when the next move is valid', () => {
		const entities = createMockEntities({
			pacmanX: 2,
			pacmanY: 2,
			direction: 'RIGHT',
			nextDirection: 'DOWN',
			lastPacmanTick: 1,
		});
		const args = createMockArgs(100);
		const result = movePacman(entities, args);

		expect(result.pacman.direction).toBe('DOWN');
		expect(result.pacman.nextDirection).toBeNull();
		expect(result.pacman.position).toEqual({ x: 2, y: 3 });
	});

	it('keeps nextDirection when the next move is blocked', () => {
		// Pacman at (3,1), facing RIGHT, nextDirection UP -> wall at (3,0)
		const entities = createMockEntities({
			pacmanX: 3,
			pacmanY: 1,
			direction: 'RIGHT',
			nextDirection: 'UP',
			lastPacmanTick: 1,
		});
		const args = createMockArgs(100);
		const result = movePacman(entities, args);

		expect(result.pacman.nextDirection).toBe('UP');
		// Pacman is at (3,1) facing RIGHT, but (4,1) is a wall, so it should stop
		expect(result.pacman.position).toEqual({ x: 3, y: 1 });
	});

	it('stops pacman at a wall', () => {
		// Pacman at (3,2) facing RIGHT => wall at (4,2)
		const entities = createMockEntities({
			pacmanX: 3,
			pacmanY: 2,
			direction: 'RIGHT',
			lastPacmanTick: 1,
		});
		const args = createMockArgs(100);
		const result = movePacman(entities, args);

		expect(result.pacman.position).toEqual({ x: 3, y: 2 });
	});

	it('wraps pacman through the left tunnel edge', () => {
		const tunnelGrid = createTunnelGrid();
		const entities = createMockEntities({
			pacmanX: 0,
			pacmanY: 1,
			direction: 'LEFT',
			lastPacmanTick: 1,
			grid: tunnelGrid,
			width: 7,
			height: 3,
		});
		const args = createMockArgs(100);
		const result = movePacman(entities, args);

		expect(result.pacman.position).toEqual({ x: 6, y: 1 });
	});

	it('wraps pacman through the right tunnel edge', () => {
		const tunnelGrid = createTunnelGrid();
		const entities = createMockEntities({
			pacmanX: 6,
			pacmanY: 1,
			direction: 'RIGHT',
			lastPacmanTick: 1,
			grid: tunnelGrid,
			width: 7,
			height: 3,
		});
		const args = createMockArgs(100);
		const result = movePacman(entities, args);

		expect(result.pacman.position).toEqual({ x: 0, y: 1 });
	});

	it('moves pacman again after another tick interval', () => {
		const entities = createMockEntities({
			pacmanX: 1,
			pacmanY: 2,
			direction: 'RIGHT',
			lastPacmanTick: 1,
		});

		movePacman(entities, createMockArgs(100));
		expect(entities.pacman.position).toEqual({ x: 2, y: 2 });

		movePacman(entities, createMockArgs(200));
		expect(entities.pacman.position).toEqual({ x: 3, y: 2 });
	});
});
