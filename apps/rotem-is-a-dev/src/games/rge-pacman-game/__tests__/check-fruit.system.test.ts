import { checkFruit } from '../systems/check-fruit.system';
import type { SystemArgs } from '../../games.types';
import type { Entities } from '../rge-pacman-game.types';
import type { ReactElement } from 'react';

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

const MOCK_RENDERER = null as unknown as ReactElement;

const FRUIT_POSITION = { x: 14, y: 17 };

const createSmallGrid = (): Array<
	Array<'wall' | 'dot' | 'power' | 'empty' | 'ghost-house' | 'ghost-door' | 'tunnel'>
> => [
	['wall', 'wall', 'wall', 'wall', 'wall'],
	['wall', 'dot', 'dot', 'dot', 'wall'],
	['wall', 'dot', 'dot', 'dot', 'wall'],
	['wall', 'dot', 'dot', 'dot', 'wall'],
	['wall', 'wall', 'wall', 'wall', 'wall'],
];

const createMockEntities = (overrides?: Partial<{
	pacmanX: number;
	pacmanY: number;
	score: number;
	dotsEaten: number;
	fruitSpawned70: boolean;
	fruitSpawned170: boolean;
	fruitActive: boolean;
	fruitSpawnedAt: number;
	fruitX: number;
	fruitY: number;
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
		frightenedTimer: 0,
		dotsEaten: overrides?.dotsEaten ?? 0,
		fruitSpawned70: overrides?.fruitSpawned70 ?? false,
		fruitSpawned170: overrides?.fruitSpawned170 ?? false,
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
		mode: 'scatter',
		scatterTarget: { x: 4, y: 0 },
		releaseThreshold: 0,
		cellSize: 16,
		renderer: MOCK_RENDERER,
	},
	pinky: {
		name: 'pinky',
		position: { x: 3, y: 1 },
		direction: 'DOWN',
		mode: 'house',
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
		dotsRemaining: 9,
		totalDots: 9,
		cellSize: 16,
		renderer: MOCK_RENDERER,
	},
	fruit: {
		position: { x: overrides?.fruitX ?? FRUIT_POSITION.x, y: overrides?.fruitY ?? FRUIT_POSITION.y },
		active: overrides?.fruitActive ?? false,
		spawnedAt: overrides?.fruitSpawnedAt ?? 0,
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

describe('checkFruit', () => {
	describe('fruit spawning', () => {
		it('spawns fruit when dotsEaten reaches 70 and fruitSpawned70 is false', () => {
			const entities = createMockEntities({ dotsEaten: 70, fruitSpawned70: false });
			const args = createMockArgs(5000);
			checkFruit(entities, args);

			expect(entities.fruit.active).toBe(true);
			expect(entities.board.fruitSpawned70).toBe(true);
			expect(entities.fruit.position).toEqual(FRUIT_POSITION);
			expect(entities.fruit.spawnedAt).toBe(5000);
		});

		it('spawns fruit when dotsEaten reaches 170 and fruitSpawned170 is false', () => {
			const entities = createMockEntities({
				dotsEaten: 170,
				fruitSpawned70: true,
				fruitSpawned170: false,
			});
			const args = createMockArgs(15000);
			checkFruit(entities, args);

			expect(entities.fruit.active).toBe(true);
			expect(entities.board.fruitSpawned170).toBe(true);
			expect(entities.fruit.spawnedAt).toBe(15000);
		});

		it('does not re-spawn fruit at 70 threshold when fruitSpawned70 is true', () => {
			const entities = createMockEntities({
				dotsEaten: 75,
				fruitSpawned70: true,
				fruitActive: false,
			});
			const args = createMockArgs(5000);
			checkFruit(entities, args);

			expect(entities.fruit.active).toBe(false);
		});

		it('does not re-spawn fruit at 170 threshold when fruitSpawned170 is true', () => {
			const entities = createMockEntities({
				dotsEaten: 175,
				fruitSpawned70: true,
				fruitSpawned170: true,
				fruitActive: false,
			});
			const args = createMockArgs(15000);
			checkFruit(entities, args);

			expect(entities.fruit.active).toBe(false);
		});

		it('does not spawn fruit when dotsEaten is below 70', () => {
			const entities = createMockEntities({ dotsEaten: 50 });
			const args = createMockArgs(5000);
			checkFruit(entities, args);

			expect(entities.fruit.active).toBe(false);
		});
	});

	describe('eating fruit', () => {
		it('adds 100 to the score when pacman eats the fruit', () => {
			const entities = createMockEntities({
				pacmanX: 2,
				pacmanY: 2,
				fruitX: 2,
				fruitY: 2,
				fruitActive: true,
				score: 500,
			});
			const args = createMockArgs(5000);
			checkFruit(entities, args);

			expect(entities.board.score).toBe(600);
		});

		it('deactivates the fruit when eaten', () => {
			const entities = createMockEntities({
				pacmanX: 2,
				pacmanY: 2,
				fruitX: 2,
				fruitY: 2,
				fruitActive: true,
			});
			const args = createMockArgs(5000);
			checkFruit(entities, args);

			expect(entities.fruit.active).toBe(false);
		});

		it('dispatches score-updated event when fruit is eaten', () => {
			const entities = createMockEntities({
				pacmanX: 2,
				pacmanY: 2,
				fruitX: 2,
				fruitY: 2,
				fruitActive: true,
			});
			const args = createMockArgs(5000);
			checkFruit(entities, args);

			expect(args.dispatch).toHaveBeenCalledWith({ type: 'score-updated' });
		});

		it('does not eat fruit when pacman position differs from fruit', () => {
			const entities = createMockEntities({
				pacmanX: 1,
				pacmanY: 1,
				fruitX: 3,
				fruitY: 3,
				fruitActive: true,
				score: 500,
			});
			const args = createMockArgs(5000);
			checkFruit(entities, args);

			expect(entities.board.score).toBe(500);
			expect(entities.fruit.active).toBe(true);
		});
	});

	describe('fruit timeout', () => {
		it('deactivates fruit after FRUIT_DURATION_MS (10000ms) has passed', () => {
			const entities = createMockEntities({
				fruitActive: true,
				fruitSpawnedAt: 1000,
				pacmanX: 1,
				pacmanY: 1,
				fruitX: 3,
				fruitY: 3,
			});
			const args = createMockArgs(11000);
			checkFruit(entities, args);

			expect(entities.fruit.active).toBe(false);
		});

		it('does not deactivate fruit before timeout expires', () => {
			const entities = createMockEntities({
				fruitActive: true,
				fruitSpawnedAt: 1000,
				pacmanX: 1,
				pacmanY: 1,
				fruitX: 3,
				fruitY: 3,
			});
			const args = createMockArgs(5000);
			checkFruit(entities, args);

			expect(entities.fruit.active).toBe(true);
		});

		it('does not dispatch events when fruit times out', () => {
			const entities = createMockEntities({
				fruitActive: true,
				fruitSpawnedAt: 1000,
				pacmanX: 1,
				pacmanY: 1,
				fruitX: 3,
				fruitY: 3,
			});
			const args = createMockArgs(11000);
			checkFruit(entities, args);

			expect(args.dispatch).not.toHaveBeenCalled();
		});
	});
});
