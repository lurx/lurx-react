import { handleInput } from '../systems/handle-input.system';
import type { Entities, SystemArgs } from '../rge-pacman-game.types';
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
const createSmallGrid = (): Array<
	Array<'wall' | 'dot' | 'power' | 'empty' | 'ghost-house' | 'ghost-door' | 'tunnel'>
> => [
	['wall', 'wall', 'wall', 'wall', 'wall'],
	['wall', 'dot', 'dot', 'dot', 'wall'],
	['wall', 'dot', 'dot', 'dot', 'wall'],
	['wall', 'dot', 'dot', 'dot', 'wall'],
	['wall', 'wall', 'wall', 'wall', 'wall'],
];

const createMockEntities = (overrides?: Partial<{ pacmanX: number; pacmanY: number; direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'; pendingActions: Array<'UP' | 'DOWN' | 'LEFT' | 'RIGHT'> }>): Entities => {
	const pacmanX = overrides?.pacmanX ?? 2;
	const pacmanY = overrides?.pacmanY ?? 2;
	const direction = overrides?.direction ?? 'LEFT';
	const pendingActions = overrides?.pendingActions ?? [];

	return {
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
			pendingActions,
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
			position: { x: pacmanX, y: pacmanY },
			direction,
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
	} as Entities;
};

const createMockArgs = (): SystemArgs => ({
	input: [],
	events: [],
	dispatch: jest.fn(),
	time: { current: 0, previous: null, delta: 0, previousDelta: null },
});

/* ------------------------------------------------------------------ */
/*  Tests                                                             */
/* ------------------------------------------------------------------ */

describe('handleInput', () => {
	it('returns entities unchanged when no pending actions exist', () => {
		const entities = createMockEntities({ pendingActions: [] });
		const args = createMockArgs();
		const result = handleInput(entities, args);

		expect(result.pacman.direction).toBe('LEFT');
		expect(result.pacman.nextDirection).toBeNull();
	});

	it('applies the last pending action as direction when the move is valid', () => {
		const entities = createMockEntities({
			pacmanX: 2,
			pacmanY: 2,
			direction: 'LEFT',
			pendingActions: ['UP', 'DOWN'],
		});
		const args = createMockArgs();
		const result = handleInput(entities, args);

		expect(result.pacman.direction).toBe('DOWN');
		expect(result.pacman.nextDirection).toBeNull();
	});

	it('stores action as nextDirection when the move is blocked by a wall', () => {
		// Pacman at (1,1) facing LEFT; trying to go UP => wall at (1,0)
		const entities = createMockEntities({
			pacmanX: 1,
			pacmanY: 1,
			direction: 'LEFT',
			pendingActions: ['UP'],
		});
		const args = createMockArgs();
		const result = handleInput(entities, args);

		expect(result.pacman.direction).toBe('LEFT');
		expect(result.pacman.nextDirection).toBe('UP');
	});

	it('clears pendingActions after processing a valid action', () => {
		const entities = createMockEntities({
			pendingActions: ['RIGHT', 'DOWN'],
		});
		const args = createMockArgs();
		handleInput(entities, args);

		expect(entities.board.pendingActions).toEqual([]);
	});

	it('clears pendingActions after processing an invalid action', () => {
		const entities = createMockEntities({
			pacmanX: 1,
			pacmanY: 1,
			pendingActions: ['UP'],
		});
		const args = createMockArgs();
		handleInput(entities, args);

		expect(entities.board.pendingActions).toEqual([]);
	});

	it('uses only the last action when multiple actions are pending', () => {
		const entities = createMockEntities({
			pacmanX: 2,
			pacmanY: 2,
			direction: 'LEFT',
			pendingActions: ['UP', 'RIGHT', 'DOWN'],
		});
		const args = createMockArgs();
		const result = handleInput(entities, args);

		expect(result.pacman.direction).toBe('DOWN');
	});

	it('sets nextDirection to null when a valid move replaces previous nextDirection', () => {
		const entities = createMockEntities({
			pacmanX: 2,
			pacmanY: 2,
			direction: 'LEFT',
			pendingActions: ['RIGHT'],
		});
		entities.pacman.nextDirection = 'UP';
		const args = createMockArgs();
		const result = handleInput(entities, args);

		expect(result.pacman.direction).toBe('RIGHT');
		expect(result.pacman.nextDirection).toBeNull();
	});
});
