import { checkWinLose } from '../systems/check-win-lose.system';
import type { Entities, SystemArgs } from '../rge-pacman-game.types';
import type { ReactElement } from 'react';

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

const MOCK_RENDERER = null as unknown as ReactElement;

const createSmallGrid = (): Array<
	Array<'wall' | 'dot' | 'power' | 'empty' | 'ghost-house' | 'ghost-door' | 'tunnel'>
> => [
	['wall', 'wall', 'wall', 'wall', 'wall'],
	['wall', 'empty', 'empty', 'empty', 'wall'],
	['wall', 'empty', 'empty', 'empty', 'wall'],
	['wall', 'empty', 'empty', 'empty', 'wall'],
	['wall', 'wall', 'wall', 'wall', 'wall'],
];

const createMockEntities = (dotsRemaining: number): Entities => ({
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
		position: { x: 2, y: 2 },
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
		dotsRemaining,
		totalDots: 240,
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

describe('checkWinLose', () => {
	it('dispatches level-complete when dotsRemaining is 0', () => {
		const entities = createMockEntities(0);
		const args = createMockArgs();
		checkWinLose(entities, args);

		expect(args.dispatch).toHaveBeenCalledWith({ type: 'level-complete' });
	});

	it('dispatches level-complete exactly once', () => {
		const entities = createMockEntities(0);
		const args = createMockArgs();
		checkWinLose(entities, args);

		expect(args.dispatch).toHaveBeenCalledTimes(1);
	});

	it('does not dispatch when dotsRemaining is greater than 0', () => {
		const entities = createMockEntities(50);
		const args = createMockArgs();
		checkWinLose(entities, args);

		expect(args.dispatch).not.toHaveBeenCalled();
	});

	it('does not dispatch when dotsRemaining is 1', () => {
		const entities = createMockEntities(1);
		const args = createMockArgs();
		checkWinLose(entities, args);

		expect(args.dispatch).not.toHaveBeenCalled();
	});

	it('returns the entities object', () => {
		const entities = createMockEntities(0);
		const args = createMockArgs();
		const result = checkWinLose(entities, args);

		expect(result).toBe(entities);
	});

	it('returns entities unchanged when dots remain', () => {
		const entities = createMockEntities(100);
		const args = createMockArgs();
		const result = checkWinLose(entities, args);

		expect(result).toBe(entities);
		expect(result.maze.dotsRemaining).toBe(100);
	});
});
