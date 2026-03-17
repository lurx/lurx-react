import { moveGhosts } from '../systems/move-ghosts.system';
import type { CellType, Entities, GhostEntity, SystemArgs } from '../rge-pacman-game.types';
import type { ReactElement } from 'react';

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

const MOCK_RENDERER = null as unknown as ReactElement;

/**
 * 7x7 grid with open interior, ghost-door, and ghost-house cells.
 *
 *   W W W W W W W
 *   W . . . . . W
 *   W . W D W . W     (D = ghost-door at 3,2)
 *   W . W H W . W     (H = ghost-house at 3,3)
 *   W . W W W . W
 *   W . . . . . W
 *   W W W W W W W
 */
const createGhostGrid = (): CellType[][] => [
	['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
	['wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall'],
	['wall', 'empty', 'wall', 'ghost-door', 'wall', 'empty', 'wall'],
	['wall', 'empty', 'wall', 'ghost-house', 'wall', 'empty', 'wall'],
	['wall', 'empty', 'wall', 'wall', 'wall', 'empty', 'wall'],
	['wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall'],
	['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
];

const createMockGhost = (
	name: 'blinky' | 'pinky' | 'inky' | 'clyde',
	overrides?: Partial<GhostEntity>,
): GhostEntity => ({
	name,
	position: { x: 3, y: 1 },
	direction: 'LEFT',
	mode: 'scatter',
	scatterTarget: { x: 0, y: 0 },
	releaseThreshold: 0,
	cellSize: 16,
	renderer: MOCK_RENDERER,
	...overrides,
});

const createMockEntities = (overrides?: Partial<{
	lastGhostTick: number;
	dotsEaten: number;
	currentGhostMode: 'chase' | 'scatter';
	blinky: Partial<GhostEntity>;
	pinky: Partial<GhostEntity>;
	inky: Partial<GhostEntity>;
	clyde: Partial<GhostEntity>;
}>): Entities => ({
	board: {
		width: 7,
		height: 7,
		cellSize: 16,
		pacmanTickMs: 80,
		ghostTickMs: 90,
		frightenedTickMs: 120,
		eatenTickMs: 40,
		lastPacmanTick: 0,
		lastGhostTick: overrides?.lastGhostTick ?? 1,
		keyScheme: 'arrows',
		pendingActions: [],
		score: 0,
		lives: 3,
		ghostsEatenCombo: 0,
		modeTimer: 0,
		modePhaseIndex: 0,
		currentGhostMode: overrides?.currentGhostMode ?? 'scatter',
		frightenedTimer: 0,
		dotsEaten: overrides?.dotsEaten ?? 0,
		fruitSpawned70: false,
		fruitSpawned170: false,
	},
	pacman: {
		position: { x: 5, y: 5 },
		direction: 'LEFT',
		nextDirection: null,
		dying: false,
		cellSize: 16,
		renderer: MOCK_RENDERER,
	},
	blinky: createMockGhost('blinky', overrides?.blinky),
	pinky: createMockGhost('pinky', { mode: 'house', position: { x: 3, y: 3 }, releaseThreshold: 0, ...overrides?.pinky }),
	inky: createMockGhost('inky', { mode: 'house', position: { x: 3, y: 3 }, releaseThreshold: 30, ...overrides?.inky }),
	clyde: createMockGhost('clyde', { mode: 'house', position: { x: 3, y: 3 }, releaseThreshold: 60, ...overrides?.clyde }),
	maze: {
		grid: createGhostGrid(),
		dotsRemaining: 20,
		totalDots: 20,
		cellSize: 16,
		renderer: MOCK_RENDERER,
	},
	fruit: {
		position: { x: 3, y: 5 },
		active: false,
		spawnedAt: 0,
		fruitType: 'cherry',
		cellSize: 16,
		renderer: MOCK_RENDERER,
	},
} as Entities);

const createMockArgs = (currentTime: number): SystemArgs => ({
	input: [],
	events: [],
	dispatch: jest.fn(),
	time: { current: currentTime, previous: null, delta: 0, previousDelta: null },
});

/* ------------------------------------------------------------------ */
/*  Tests                                                             */
/* ------------------------------------------------------------------ */

describe('moveGhosts', () => {
	it('does not move ghosts before tick interval has elapsed', () => {
		const entities = createMockEntities({ lastGhostTick: 1 });
		const blinkyStartPos = { ...entities.blinky.position };
		const args = createMockArgs(50);
		moveGhosts(entities, args);

		expect(entities.blinky.position).toEqual(blinkyStartPos);
	});

	it('moves scatter-mode ghosts when tick has elapsed', () => {
		const entities = createMockEntities({ lastGhostTick: 1 });
		const blinkyStartPos = { ...entities.blinky.position };
		const args = createMockArgs(100);
		moveGhosts(entities, args);

		// Ghost should have moved away from starting position
		const hasMoved =
			entities.blinky.position.x !== blinkyStartPos.x ||
			entities.blinky.position.y !== blinkyStartPos.y;
		expect(hasMoved).toBe(true);
	});

	it('updates lastGhostTick after ghosts move', () => {
		const entities = createMockEntities({ lastGhostTick: 1 });
		const args = createMockArgs(100);
		moveGhosts(entities, args);

		expect(entities.board.lastGhostTick).toBe(100);
	});

	describe('house ghosts', () => {
		it('releases a house ghost when dotsEaten meets its threshold', () => {
			const entities = createMockEntities({
				dotsEaten: 30,
				inky: {
					mode: 'house',
					position: { x: 3, y: 3 },
					releaseThreshold: 30,
					direction: 'UP',
				},
			});
			// The ghost-door is at (3,2), house at (3,3)
			// inky is at (3,3) with release threshold 30, dotsEaten is 30
			const args = createMockArgs(100);
			moveGhosts(entities, args);

			// Ghost should start moving toward the door
			const ghostMoved =
				entities.inky.position.y < 3 || entities.inky.mode !== 'house';
			expect(ghostMoved).toBe(true);
		});

		it('does not release a house ghost before its threshold is met', () => {
			const entities = createMockEntities({
				dotsEaten: 10,
				clyde: {
					mode: 'house',
					position: { x: 3, y: 3 },
					releaseThreshold: 60,
				},
			});
			const args = createMockArgs(100);
			moveGhosts(entities, args);

			expect(entities.clyde.mode).toBe('house');
		});
	});

	describe('frightened ghosts', () => {
		it('moves frightened ghosts with random direction selection', () => {
			jest.spyOn(Math, 'random').mockReturnValue(0);

			const entities = createMockEntities({
				blinky: {
					mode: 'frightened',
					position: { x: 3, y: 1 },
					direction: 'LEFT',
				},
			});
			const startPos = { ...entities.blinky.position };
			const args = createMockArgs(100);
			moveGhosts(entities, args);

			const hasMoved =
				entities.blinky.position.x !== startPos.x ||
				entities.blinky.position.y !== startPos.y;
			expect(hasMoved).toBe(true);

			jest.restoreAllMocks();
		});
	});

	describe('eaten ghosts', () => {
		it('moves eaten ghosts toward the ghost house', () => {
			const entities = createMockEntities({
				blinky: {
					mode: 'eaten',
					position: { x: 5, y: 5 },
					direction: 'LEFT',
				},
			});
			const startPos = { ...entities.blinky.position };
			const args = createMockArgs(100);
			moveGhosts(entities, args);

			// Eaten ghost should move closer to the ghost house center
			const hasMoved =
				entities.blinky.position.x !== startPos.x ||
				entities.blinky.position.y !== startPos.y;
			expect(hasMoved).toBe(true);
		});
	});

	describe('chase/scatter movement', () => {
		it('moves targeting ghosts in chase mode', () => {
			const entities = createMockEntities({
				currentGhostMode: 'chase',
				blinky: {
					mode: 'chase',
					position: { x: 1, y: 1 },
					direction: 'RIGHT',
				},
			});
			const startPos = { ...entities.blinky.position };
			const args = createMockArgs(100);
			moveGhosts(entities, args);

			const hasMoved =
				entities.blinky.position.x !== startPos.x ||
				entities.blinky.position.y !== startPos.y;
			expect(hasMoved).toBe(true);
		});
	});
});
