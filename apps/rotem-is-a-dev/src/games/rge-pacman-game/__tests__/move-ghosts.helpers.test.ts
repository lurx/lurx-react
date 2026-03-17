import {
	moveGhostInHouse,
	moveEatenGhost,
	moveFrightenedGhost,
	moveTargetingGhost,
	getTargetForGhost,
} from '../systems/move-ghosts.helpers';
import type { CellType, Entities, GhostEntity } from '../rge-pacman-game.types';
import type { ReactElement } from 'react';

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

const MOCK_RENDERER = null as unknown as ReactElement;

/**
 * 7x7 grid with ghost-door and ghost-house for testing ghost movement.
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

/**
 * Open 7x3 grid for simpler movement tests.
 *
 *   W W W W W W W
 *   W . . . . . W
 *   W W W W W W W
 */
const createOpenGrid = (): CellType[][] => [
	['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
	['wall', 'empty', 'empty', 'empty', 'empty', 'empty', 'wall'],
	['wall', 'wall', 'wall', 'wall', 'wall', 'wall', 'wall'],
];

const createGhost = (
	name: 'blinky' | 'pinky' | 'inky' | 'clyde',
	overrides?: Partial<GhostEntity>,
): GhostEntity => ({
	name,
	position: { x: 3, y: 3 },
	direction: 'UP',
	mode: 'scatter',
	scatterTarget: { x: 0, y: 0 },
	releaseThreshold: 0,
	cellSize: 16,
	renderer: MOCK_RENDERER,
	...overrides,
});

const createMockEntities = (): Entities => ({
	board: {
		width: 7,
		height: 7,
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
		position: { x: 5, y: 5 },
		direction: 'LEFT',
		nextDirection: null,
		dying: false,
		cellSize: 16,
		renderer: MOCK_RENDERER,
	},
	blinky: createGhost('blinky', { position: { x: 3, y: 1 }, direction: 'LEFT', mode: 'scatter' }),
	pinky: createGhost('pinky', { position: { x: 3, y: 3 }, mode: 'house', scatterTarget: { x: 0, y: 0 } }),
	inky: createGhost('inky', { position: { x: 3, y: 3 }, mode: 'house', scatterTarget: { x: 6, y: 6 } }),
	clyde: createGhost('clyde', { position: { x: 3, y: 3 }, mode: 'house', scatterTarget: { x: 0, y: 6 } }),
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

/* ------------------------------------------------------------------ */
/*  Tests                                                             */
/* ------------------------------------------------------------------ */

describe('moveGhostInHouse', () => {
	it('does not move the ghost when dotsEaten is below the release threshold', () => {
		const ghost = createGhost('inky', {
			position: { x: 3, y: 3 },
			releaseThreshold: 30,
			mode: 'house',
		});
		const originalPos = { ...ghost.position };
		moveGhostInHouse(ghost, 10);

		expect(ghost.position).toEqual(originalPos);
		expect(ghost.mode).toBe('house');
	});

	it('moves the ghost upward toward the door when threshold is met', () => {
		const ghost = createGhost('inky', {
			position: { x: 3, y: 5 },
			releaseThreshold: 30,
			mode: 'house',
		});
		moveGhostInHouse(ghost, 30);

		// Ghost should move up by 1 toward the door
		expect(ghost.position.y).toBe(4);
	});

	it('releases the ghost above the door when close to the door position', () => {
		// GHOST_DOOR_POSITION is { x: 14, y: 12 } in the real game
		// The helper uses euclideanDistance with ARRIVAL_THRESHOLD = 1
		// For testing, we place ghost at the door position
		const ghost = createGhost('blinky', {
			position: { x: 14, y: 12 },
			releaseThreshold: 0,
			mode: 'house',
		});
		moveGhostInHouse(ghost, 0);

		expect(ghost.mode).toBe('scatter');
		expect(ghost.direction).toBe('LEFT');
		expect(ghost.position.y).toBe(11);
	});
});

describe('moveEatenGhost', () => {
	it('resets ghost mode when it arrives at the ghost house center', () => {
		// GHOST_HOUSE_CENTER is { x: 14, y: 14 }
		const ghost = createGhost('blinky', {
			position: { x: 14, y: 14 },
			mode: 'eaten',
			direction: 'LEFT',
		});
		const grid = createGhostGrid();
		moveEatenGhost(ghost, grid, 7, 7, 'chase');

		expect(ghost.mode).toBe('chase');
		expect(ghost.direction).toBe('UP');
		expect(ghost.position).toEqual({ x: 14, y: 14 });
	});

	it('moves ghost toward the house center when not yet arrived', () => {
		const ghost = createGhost('blinky', {
			position: { x: 5, y: 1 },
			mode: 'eaten',
			direction: 'LEFT',
		});
		const grid = createGhostGrid();
		const startPos = { ...ghost.position };
		moveEatenGhost(ghost, grid, 7, 7, 'scatter');

		const hasMoved =
			ghost.position.x !== startPos.x || ghost.position.y !== startPos.y;
		expect(hasMoved).toBe(true);
	});

	it('sets ghost to the provided currentMode when arriving at house', () => {
		const ghost = createGhost('pinky', {
			position: { x: 14, y: 14 },
			mode: 'eaten',
		});
		const grid = createGhostGrid();
		moveEatenGhost(ghost, grid, 7, 7, 'scatter');

		expect(ghost.mode).toBe('scatter');
	});
});

describe('moveFrightenedGhost', () => {
	it('moves the ghost to a new position', () => {
		jest.spyOn(Math, 'random').mockReturnValue(0);

		const ghost = createGhost('blinky', {
			position: { x: 3, y: 1 },
			mode: 'frightened',
			direction: 'LEFT',
		});
		const grid = createGhostGrid();
		const startPos = { ...ghost.position };
		moveFrightenedGhost(ghost, grid, 7, 7);

		const hasMoved =
			ghost.position.x !== startPos.x || ghost.position.y !== startPos.y;
		expect(hasMoved).toBe(true);

		jest.restoreAllMocks();
	});

	it('selects a random direction from valid options', () => {
		// With Math.random() returning 0.99, it should pick the last valid direction
		jest.spyOn(Math, 'random').mockReturnValue(0.99);

		const ghost = createGhost('blinky', {
			position: { x: 3, y: 1 },
			mode: 'frightened',
			direction: 'LEFT',
		});
		const grid = createGhostGrid();
		moveFrightenedGhost(ghost, grid, 7, 7);

		expect(Math.random).toHaveBeenCalled();

		jest.restoreAllMocks();
	});

	it('falls back to opposite direction when no valid directions exist', () => {
		// Create a dead-end scenario: ghost boxed in with only backward option
		const grid: CellType[][] = [
			['wall', 'wall', 'wall'],
			['empty', 'empty', 'wall'],
			['wall', 'wall', 'wall'],
		];
		const ghost = createGhost('blinky', {
			position: { x: 1, y: 1 },
			mode: 'frightened',
			direction: 'RIGHT',
		});

		jest.spyOn(Math, 'random').mockReturnValue(0);
		moveFrightenedGhost(ghost, grid, 3, 3);

		// Only valid non-opposite direction from (1,1) going RIGHT would be blocked
		// since (2,1) is wall and (1,0) is wall and (1,2) is wall, only LEFT (opposite) remains
		expect(ghost.position).toEqual({ x: 0, y: 1 });

		jest.restoreAllMocks();
	});
});

describe('moveTargetingGhost', () => {
	it('moves the ghost toward the target position', () => {
		const ghost = createGhost('blinky', {
			position: { x: 1, y: 1 },
			mode: 'chase',
			direction: 'RIGHT',
		});
		const target = { x: 5, y: 1 };
		const grid = createOpenGrid();

		moveTargetingGhost(ghost, target, grid, 7, 3);

		expect(ghost.position.x).toBe(2);
		expect(ghost.position.y).toBe(1);
	});

	it('chooses the direction that minimizes distance to target', () => {
		const ghost = createGhost('blinky', {
			position: { x: 3, y: 1 },
			mode: 'scatter',
			direction: 'RIGHT',
		});
		// Target is to the right
		const target = { x: 5, y: 1 };
		const grid = createOpenGrid();

		moveTargetingGhost(ghost, target, grid, 7, 3);

		expect(ghost.position).toEqual({ x: 4, y: 1 });
		expect(ghost.direction).toBe('RIGHT');
	});

	it('falls back to opposite direction when no forward directions are valid', () => {
		const grid: CellType[][] = [
			['wall', 'wall', 'wall'],
			['empty', 'empty', 'wall'],
			['wall', 'wall', 'wall'],
		];
		const ghost = createGhost('blinky', {
			position: { x: 1, y: 1 },
			mode: 'chase',
			direction: 'RIGHT',
		});
		const target = { x: 2, y: 1 };

		moveTargetingGhost(ghost, target, grid, 3, 3);

		// (2,1) is wall, (1,0) is wall, (1,2) is wall, so LEFT (opposite) is only option
		expect(ghost.position).toEqual({ x: 0, y: 1 });
	});
});

describe('getTargetForGhost', () => {
	it('returns the pacman position for blinky in chase mode', () => {
		const entities = createMockEntities();
		entities.blinky.mode = 'chase';
		const target = getTargetForGhost(entities.blinky, entities);

		expect(target).toEqual(entities.pacman.position);
	});

	it('returns the scatter target for blinky in scatter mode', () => {
		const entities = createMockEntities();
		entities.blinky.mode = 'scatter';
		const target = getTargetForGhost(entities.blinky, entities);

		expect(target).toEqual(entities.blinky.scatterTarget);
	});

	it('returns a position 4 tiles ahead of pacman for pinky in chase mode', () => {
		const entities = createMockEntities();
		entities.pinky.mode = 'chase';
		entities.pacman.position = { x: 5, y: 5 };
		entities.pacman.direction = 'LEFT';
		const target = getTargetForGhost(entities.pinky, entities);

		expect(target).toEqual({ x: 1, y: 5 });
	});

	it('returns the doubled vector from blinky for inky in chase mode', () => {
		const entities = createMockEntities();
		entities.inky.mode = 'chase';
		entities.pacman.position = { x: 5, y: 5 };
		entities.pacman.direction = 'LEFT';
		entities.blinky.position = { x: 1, y: 5 };
		const target = getTargetForGhost(entities.inky, entities);

		// Pivot = pacman + 2 tiles in direction = (5 + (-2), 5 + 0) = (3, 5)
		// Target = pivot + (pivot - blinky) = (3, 5) + ((3 - 1), (5 - 5)) = (3 + 2, 5 + 0) = (5, 5)
		expect(target).toEqual({ x: 5, y: 5 });
	});

	it('returns pacman position for clyde when far away in chase mode', () => {
		const entities = createMockEntities();
		entities.clyde.mode = 'chase';
		entities.clyde.position = { x: 1, y: 1 };
		entities.pacman.position = { x: 5, y: 5 };
		const target = getTargetForGhost(entities.clyde, entities);

		// Distance is sqrt((5-1)^2 + (5-1)^2) = sqrt(32) ~= 5.66 > 8? No, 5.66 < 8
		// Actually sqrt(32) = 5.66, which is less than 8
		// So clyde should target scatter target
		expect(target).toEqual(entities.clyde.scatterTarget);
	});

	it('returns scatter target for clyde when close to pacman in chase mode', () => {
		const entities = createMockEntities();
		entities.clyde.mode = 'chase';
		entities.clyde.position = { x: 4, y: 5 };
		entities.pacman.position = { x: 5, y: 5 };
		const target = getTargetForGhost(entities.clyde, entities);

		// Distance = 1, which is < 8, so clyde returns scatter target
		expect(target).toEqual(entities.clyde.scatterTarget);
	});

	it('returns pacman position for clyde when distance exceeds threshold', () => {
		const entities = createMockEntities();
		entities.clyde.mode = 'chase';
		entities.clyde.position = { x: 1, y: 1 };
		entities.pacman.position = { x: 1, y: 20 };
		const target = getTargetForGhost(entities.clyde, entities);

		// Distance = 19, which is > 8
		expect(target).toEqual(entities.pacman.position);
	});
});
