import { checkDotCollision } from '../systems/check-dot-collision.system';
import type { CellType, Entities, SystemArgs } from '../rge-pacman-game.types';
import type { ReactElement } from 'react';

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

const MOCK_RENDERER = null as unknown as ReactElement;

/**
 * 5x5 grid for dot collision tests.
 *
 *   W W W W W
 *   W . P . W       (P = power pellet at 2,1)
 *   W . . . W
 *   W . . . W
 *   W W W W W
 */
const createSmallGrid = (): CellType[][] => [
	['wall', 'wall', 'wall', 'wall', 'wall'],
	['wall', 'dot', 'power', 'dot', 'wall'],
	['wall', 'dot', 'dot', 'dot', 'wall'],
	['wall', 'dot', 'empty', 'dot', 'wall'],
	['wall', 'wall', 'wall', 'wall', 'wall'],
];

const createMockEntities = (overrides?: Partial<{
	pacmanX: number;
	pacmanY: number;
	score: number;
	dotsRemaining: number;
	dotsEaten: number;
	frightenedTimer: number;
}>): Entities => ({
	board: {
		width: 5,
		height: 5,
		cellSize: 16,
		pacmanTickMs: 80,
		ghostTickMs: 90,
		frightenedTickMs: 120,
		eatenTickMs: 40,
		lastPacmanTick: 0,
		lastGhostTick: 0,
		keyScheme: 'arrows',
		pendingActions: [],
		score: overrides?.score ?? 0,
		lives: 3,
		ghostsEatenCombo: 0,
		modeTimer: 0,
		modePhaseIndex: 0,
		currentGhostMode: 'scatter',
		frightenedTimer: overrides?.frightenedTimer ?? 0,
		dotsEaten: overrides?.dotsEaten ?? 0,
		fruitSpawned70: false,
		fruitSpawned170: false,
	},
	pacman: {
		position: { x: overrides?.pacmanX ?? 2, y: overrides?.pacmanY ?? 2 },
		direction: 'LEFT',
		nextDirection: null,
		dying: false,
		cellSize: 16,
		renderer: MOCK_RENDERER,
	},
	blinky: {
		name: 'blinky',
		position: { x: 1, y: 1 },
		direction: 'LEFT',
		mode: 'chase',
		scatterTarget: { x: 4, y: 0 },
		releaseThreshold: 0,
		cellSize: 16,
		renderer: MOCK_RENDERER,
	},
	pinky: {
		name: 'pinky',
		position: { x: 3, y: 1 },
		direction: 'DOWN',
		mode: 'chase',
		scatterTarget: { x: 0, y: 0 },
		releaseThreshold: 0,
		cellSize: 16,
		renderer: MOCK_RENDERER,
	},
	inky: {
		name: 'inky',
		position: { x: 3, y: 3 },
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
		grid: createSmallGrid(),
		dotsRemaining: overrides?.dotsRemaining ?? 11,
		totalDots: 11,
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
} as Entities);

const createMockArgs = (): SystemArgs => ({
	input: [],
	events: [],
	dispatch: jest.fn(),
	time: { current: 0, previous: null, delta: 0, previousDelta: null },
});

/* ------------------------------------------------------------------ */
/*  Tests                                                             */
/* ------------------------------------------------------------------ */

describe('checkDotCollision', () => {
	describe('eating dots', () => {
		it('adds 10 to the score when pacman eats a dot', () => {
			const entities = createMockEntities({ pacmanX: 1, pacmanY: 1, score: 0 });
			const args = createMockArgs();
			checkDotCollision(entities, args);

			expect(entities.board.score).toBe(10);
		});

		it('decrements dotsRemaining when a dot is eaten', () => {
			const entities = createMockEntities({ pacmanX: 1, pacmanY: 1, dotsRemaining: 11 });
			const args = createMockArgs();
			checkDotCollision(entities, args);

			expect(entities.maze.dotsRemaining).toBe(10);
		});

		it('increments dotsEaten when a dot is eaten', () => {
			const entities = createMockEntities({ pacmanX: 1, pacmanY: 1, dotsEaten: 5 });
			const args = createMockArgs();
			checkDotCollision(entities, args);

			expect(entities.board.dotsEaten).toBe(6);
		});

		it('sets the cell to empty after eating a dot', () => {
			const entities = createMockEntities({ pacmanX: 1, pacmanY: 1 });
			const args = createMockArgs();
			checkDotCollision(entities, args);

			expect(entities.maze.grid[1][1]).toBe('empty');
		});

		it('dispatches score-updated event when a dot is eaten', () => {
			const entities = createMockEntities({ pacmanX: 1, pacmanY: 1 });
			const args = createMockArgs();
			checkDotCollision(entities, args);

			expect(args.dispatch).toHaveBeenCalledWith({ type: 'score-updated' });
		});
	});

	describe('eating power pellets', () => {
		it('adds 50 to the score when pacman eats a power pellet', () => {
			const entities = createMockEntities({ pacmanX: 2, pacmanY: 1, score: 10 });
			const args = createMockArgs();
			checkDotCollision(entities, args);

			expect(entities.board.score).toBe(60);
		});

		it('decrements dotsRemaining when a power pellet is eaten', () => {
			const entities = createMockEntities({ pacmanX: 2, pacmanY: 1, dotsRemaining: 11 });
			const args = createMockArgs();
			checkDotCollision(entities, args);

			expect(entities.maze.dotsRemaining).toBe(10);
		});

		it('increments dotsEaten when a power pellet is eaten', () => {
			const entities = createMockEntities({ pacmanX: 2, pacmanY: 1, dotsEaten: 10 });
			const args = createMockArgs();
			checkDotCollision(entities, args);

			expect(entities.board.dotsEaten).toBe(11);
		});

		it('sets the cell to empty after eating a power pellet', () => {
			const entities = createMockEntities({ pacmanX: 2, pacmanY: 1 });
			const args = createMockArgs();
			checkDotCollision(entities, args);

			expect(entities.maze.grid[1][2]).toBe('empty');
		});

		it('sets the frightened timer to 6000ms', () => {
			const entities = createMockEntities({ pacmanX: 2, pacmanY: 1, frightenedTimer: 0 });
			const args = createMockArgs();
			checkDotCollision(entities, args);

			expect(entities.board.frightenedTimer).toBe(6000);
		});

		it('resets ghostsEatenCombo to 0 on power pellet', () => {
			const entities = createMockEntities({ pacmanX: 2, pacmanY: 1 });
			entities.board.ghostsEatenCombo = 3;
			const args = createMockArgs();
			checkDotCollision(entities, args);

			expect(entities.board.ghostsEatenCombo).toBe(0);
		});

		it('sets chase/scatter ghosts to frightened mode', () => {
			const entities = createMockEntities({ pacmanX: 2, pacmanY: 1 });
			const args = createMockArgs();
			checkDotCollision(entities, args);

			expect(entities.blinky.mode).toBe('frightened');
			expect(entities.pinky.mode).toBe('frightened');
		});

		it('reverses direction of chase/scatter ghosts on frightened', () => {
			const entities = createMockEntities({ pacmanX: 2, pacmanY: 1 });
			entities.blinky.direction = 'LEFT';
			entities.pinky.direction = 'UP';
			const args = createMockArgs();
			checkDotCollision(entities, args);

			expect(entities.blinky.direction).toBe('RIGHT');
			expect(entities.pinky.direction).toBe('DOWN');
		});

		it('does not change house or eaten ghosts to frightened', () => {
			const entities = createMockEntities({ pacmanX: 2, pacmanY: 1 });
			entities.inky.mode = 'house';
			entities.clyde.mode = 'eaten';
			const args = createMockArgs();
			checkDotCollision(entities, args);

			expect(entities.inky.mode).toBe('house');
			expect(entities.clyde.mode).toBe('eaten');
		});

		it('dispatches score-updated event when a power pellet is eaten', () => {
			const entities = createMockEntities({ pacmanX: 2, pacmanY: 1 });
			const args = createMockArgs();
			checkDotCollision(entities, args);

			expect(args.dispatch).toHaveBeenCalledWith({ type: 'score-updated' });
		});
	});

	describe('no collision', () => {
		it('does not modify score when pacman is on an empty cell', () => {
			const entities = createMockEntities({ pacmanX: 2, pacmanY: 3, score: 100 });
			const args = createMockArgs();
			checkDotCollision(entities, args);

			expect(entities.board.score).toBe(100);
		});

		it('does not dispatch events when pacman is on an empty cell', () => {
			const entities = createMockEntities({ pacmanX: 2, pacmanY: 3 });
			const args = createMockArgs();
			checkDotCollision(entities, args);

			expect(args.dispatch).not.toHaveBeenCalled();
		});

		it('does not decrement dotsRemaining on empty cells', () => {
			const entities = createMockEntities({ pacmanX: 2, pacmanY: 3, dotsRemaining: 11 });
			const args = createMockArgs();
			checkDotCollision(entities, args);

			expect(entities.maze.dotsRemaining).toBe(11);
		});
	});
});
