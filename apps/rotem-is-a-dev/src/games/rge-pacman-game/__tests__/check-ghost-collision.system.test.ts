import { checkGhostCollision } from '../systems/check-ghost-collision.system';
import type { Entities, GhostEntity, SystemArgs } from '../rge-pacman-game.types';
import type { ReactElement } from 'react';


/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

const MOCK_RENDERER = null as unknown as ReactElement;

const createSmallGrid = (): Array<
	Array<'wall' | 'dot' | 'power' | 'empty' | 'ghost-house' | 'ghost-door' | 'tunnel'>
> => [
	['wall', 'wall', 'wall', 'wall', 'wall'],
	['wall', 'dot', 'dot', 'dot', 'wall'],
	['wall', 'dot', 'dot', 'dot', 'wall'],
	['wall', 'dot', 'dot', 'dot', 'wall'],
	['wall', 'wall', 'wall', 'wall', 'wall'],
];

const createMockGhost = (
	name: 'blinky' | 'pinky' | 'inky' | 'clyde',
	overrides?: Partial<GhostEntity>,
): GhostEntity => ({
	name,
	position: { x: 1, y: 1 },
	direction: 'LEFT',
	mode: 'scatter',
	scatterTarget: { x: 0, y: 0 },
	releaseThreshold: 0,
	cellSize: 16,
	renderer: MOCK_RENDERER,
	...overrides,
});

const createMockEntities = (overrides?: Partial<{
	pacmanX: number;
	pacmanY: number;
	score: number;
	ghostsEatenCombo: number;
	blinky: Partial<GhostEntity>;
	pinky: Partial<GhostEntity>;
	inky: Partial<GhostEntity>;
	clyde: Partial<GhostEntity>;
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
		ghostsEatenCombo: overrides?.ghostsEatenCombo ?? 0,
		modeTimer: 0,
		modePhaseIndex: 0,
		currentGhostMode: 'scatter',
		frightenedTimer: 6000,
		dotsEaten: 0,
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
	blinky: createMockGhost('blinky', overrides?.blinky),
	pinky: createMockGhost('pinky', overrides?.pinky),
	inky: createMockGhost('inky', overrides?.inky),
	clyde: createMockGhost('clyde', overrides?.clyde),
	maze: {
		grid: createSmallGrid(),
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

describe('checkGhostCollision', () => {
	describe('no collision', () => {
		it('does not dispatch any event when ghost positions differ from pacman', () => {
			const entities = createMockEntities({
				pacmanX: 2,
				pacmanY: 2,
				blinky: { position: { x: 1, y: 1 } },
				pinky: { position: { x: 3, y: 3 } },
				inky: { position: { x: 1, y: 3 } },
				clyde: { position: { x: 3, y: 1 } },
			});
			const args = createMockArgs();
			checkGhostCollision(entities, args);

			expect(args.dispatch).not.toHaveBeenCalled();
		});
	});

	describe('house and eaten ghosts', () => {
		it('does not trigger collision with house-mode ghosts at same position', () => {
			const entities = createMockEntities({
				pacmanX: 2,
				pacmanY: 2,
				blinky: { position: { x: 2, y: 2 }, mode: 'house' },
			});
			const args = createMockArgs();
			checkGhostCollision(entities, args);

			expect(args.dispatch).not.toHaveBeenCalled();
		});

		it('does not trigger collision with eaten-mode ghosts at same position', () => {
			const entities = createMockEntities({
				pacmanX: 2,
				pacmanY: 2,
				blinky: { position: { x: 2, y: 2 }, mode: 'eaten' },
			});
			const args = createMockArgs();
			checkGhostCollision(entities, args);

			expect(args.dispatch).not.toHaveBeenCalled();
		});
	});

	describe('frightened ghost collision', () => {
		it('sets frightened ghost to eaten mode on collision', () => {
			const entities = createMockEntities({
				pacmanX: 2,
				pacmanY: 2,
				blinky: { position: { x: 2, y: 2 }, mode: 'frightened' },
			});
			const args = createMockArgs();
			checkGhostCollision(entities, args);

			expect(entities.blinky.mode).toBe('eaten');
		});

		it('adds 200 score for the first ghost eaten (combo = 0, multiplier = 2^0 = 1)', () => {
			const entities = createMockEntities({
				pacmanX: 2,
				pacmanY: 2,
				score: 0,
				ghostsEatenCombo: 0,
				blinky: { position: { x: 2, y: 2 }, mode: 'frightened' },
			});
			const args = createMockArgs();
			checkGhostCollision(entities, args);

			expect(entities.board.score).toBe(200);
		});

		it('adds 400 score for the second ghost eaten (combo = 1, multiplier = 2^1 = 2)', () => {
			const entities = createMockEntities({
				pacmanX: 2,
				pacmanY: 2,
				score: 200,
				ghostsEatenCombo: 1,
				blinky: { position: { x: 2, y: 2 }, mode: 'frightened' },
			});
			const args = createMockArgs();
			checkGhostCollision(entities, args);

			expect(entities.board.score).toBe(600);
		});

		it('adds 800 score for the third ghost eaten (combo = 2, multiplier = 2^2 = 4)', () => {
			const entities = createMockEntities({
				pacmanX: 2,
				pacmanY: 2,
				score: 600,
				ghostsEatenCombo: 2,
				blinky: { position: { x: 2, y: 2 }, mode: 'frightened' },
			});
			const args = createMockArgs();
			checkGhostCollision(entities, args);

			expect(entities.board.score).toBe(1400);
		});

		it('adds 1600 score for the fourth ghost eaten (combo = 3, multiplier = 2^3 = 8)', () => {
			const entities = createMockEntities({
				pacmanX: 2,
				pacmanY: 2,
				score: 1400,
				ghostsEatenCombo: 3,
				blinky: { position: { x: 2, y: 2 }, mode: 'frightened' },
			});
			const args = createMockArgs();
			checkGhostCollision(entities, args);

			expect(entities.board.score).toBe(3000);
		});

		it('increments ghostsEatenCombo after eating a frightened ghost', () => {
			const entities = createMockEntities({
				pacmanX: 2,
				pacmanY: 2,
				ghostsEatenCombo: 0,
				blinky: { position: { x: 2, y: 2 }, mode: 'frightened' },
			});
			const args = createMockArgs();
			checkGhostCollision(entities, args);

			expect(entities.board.ghostsEatenCombo).toBe(1);
		});

		it('dispatches score-updated event when a frightened ghost is eaten', () => {
			const entities = createMockEntities({
				pacmanX: 2,
				pacmanY: 2,
				blinky: { position: { x: 2, y: 2 }, mode: 'frightened' },
			});
			const args = createMockArgs();
			checkGhostCollision(entities, args);

			expect(args.dispatch).toHaveBeenCalledWith({ type: 'score-updated' });
		});

		it('handles eating multiple frightened ghosts in sequence', () => {
			const entities = createMockEntities({
				pacmanX: 2,
				pacmanY: 2,
				score: 0,
				ghostsEatenCombo: 0,
				blinky: { position: { x: 2, y: 2 }, mode: 'frightened' },
				pinky: { position: { x: 2, y: 2 }, mode: 'frightened' },
			});
			const args = createMockArgs();
			checkGhostCollision(entities, args);

			// Blinky eaten first: 200 * 2^0 = 200, combo becomes 1
			// Pinky eaten second: 200 * 2^1 = 400, combo becomes 2
			expect(entities.board.score).toBe(600);
			expect(entities.board.ghostsEatenCombo).toBe(2);
			expect(entities.blinky.mode).toBe('eaten');
			expect(entities.pinky.mode).toBe('eaten');
		});
	});

	describe('normal ghost collision', () => {
		it('dispatches pacman-died when colliding with a chase-mode ghost', () => {
			const entities = createMockEntities({
				pacmanX: 2,
				pacmanY: 2,
				blinky: { position: { x: 2, y: 2 }, mode: 'chase' },
			});
			const args = createMockArgs();
			checkGhostCollision(entities, args);

			expect(args.dispatch).toHaveBeenCalledWith({ type: 'pacman-died' });
		});

		it('dispatches pacman-died when colliding with a scatter-mode ghost', () => {
			const entities = createMockEntities({
				pacmanX: 2,
				pacmanY: 2,
				blinky: { position: { x: 2, y: 2 }, mode: 'scatter' },
			});
			const args = createMockArgs();
			checkGhostCollision(entities, args);

			expect(args.dispatch).toHaveBeenCalledWith({ type: 'pacman-died' });
		});

		it('decrements lives on death', () => {
			const entities = createMockEntities({
				pacmanX: 2,
				pacmanY: 2,
				blinky: { position: { x: 2, y: 2 }, mode: 'chase' },
			});
			const args = createMockArgs();
			checkGhostCollision(entities, args);

			expect(entities.board.lives).toBe(2);
		});

		it('sets pacman.dying to true on death', () => {
			const entities = createMockEntities({
				pacmanX: 2,
				pacmanY: 2,
				blinky: { position: { x: 2, y: 2 }, mode: 'chase' },
			});
			const args = createMockArgs();
			checkGhostCollision(entities, args);

			expect(entities.pacman.dying).toBe(true);
		});

		it('returns immediately after dispatching pacman-died (no further ghost checks)', () => {
			const entities = createMockEntities({
				pacmanX: 2,
				pacmanY: 2,
				blinky: { position: { x: 2, y: 2 }, mode: 'chase' },
				pinky: { position: { x: 2, y: 2 }, mode: 'frightened' },
			});
			const args = createMockArgs();
			checkGhostCollision(entities, args);

			// Only one dispatch call (pacman-died for blinky), pinky should remain frightened
			expect(args.dispatch).toHaveBeenCalledTimes(1);
			expect(args.dispatch).toHaveBeenCalledWith({ type: 'pacman-died' });
			expect(entities.pinky.mode).toBe('frightened');
		});
	});
});
