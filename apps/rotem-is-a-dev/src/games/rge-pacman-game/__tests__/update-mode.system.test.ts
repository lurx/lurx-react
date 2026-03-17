import { updateMode } from '../systems/update-mode.system';
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

const createMockGhost = (name: 'blinky' | 'pinky' | 'inky' | 'clyde', mode: GhostEntity['mode'] = 'scatter'): GhostEntity => ({
	name,
	position: { x: 2, y: 2 },
	direction: 'LEFT',
	mode,
	scatterTarget: { x: 0, y: 0 },
	releaseThreshold: 0,
	cellSize: 16,
	renderer: MOCK_RENDERER,
});

const createMockEntities = (overrides?: Partial<{
	frightenedTimer: number;
	ghostsEatenCombo: number;
	modeTimer: number;
	modePhaseIndex: number;
	currentGhostMode: 'chase' | 'scatter';
	ghostModes: Record<'blinky' | 'pinky' | 'inky' | 'clyde', GhostEntity['mode']>;
}>): Entities => {
	const ghostModes = overrides?.ghostModes ?? {
		blinky: 'scatter' as GhostEntity['mode'],
		pinky: 'scatter' as GhostEntity['mode'],
		inky: 'scatter' as GhostEntity['mode'],
		clyde: 'scatter' as GhostEntity['mode'],
	};

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
			pendingActions: [],
			score: 0,
			lives: 3,
			ghostsEatenCombo: overrides?.ghostsEatenCombo ?? 0,
			modeTimer: overrides?.modeTimer ?? 0,
			modePhaseIndex: overrides?.modePhaseIndex ?? 0,
			currentGhostMode: overrides?.currentGhostMode ?? 'scatter',
			frightenedTimer: overrides?.frightenedTimer ?? 0,
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
		blinky: createMockGhost('blinky', ghostModes.blinky),
		pinky: createMockGhost('pinky', ghostModes.pinky),
		inky: createMockGhost('inky', ghostModes.inky),
		clyde: createMockGhost('clyde', ghostModes.clyde),
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

const createMockArgs = (delta: number): SystemArgs => ({
	input: [],
	events: [],
	dispatch: jest.fn(),
	time: { current: delta, previous: 0, delta, previousDelta: null },
});

/* ------------------------------------------------------------------ */
/*  Tests                                                             */
/* ------------------------------------------------------------------ */

describe('updateMode', () => {
	describe('frightened timer', () => {
		it('decrements the frightened timer by delta', () => {
			const entities = createMockEntities({ frightenedTimer: 6000 });
			const args = createMockArgs(100);
			updateMode(entities, args);

			expect(entities.board.frightenedTimer).toBe(5900);
		});

		it('clamps the frightened timer to 0 when delta exceeds remaining time', () => {
			const entities = createMockEntities({ frightenedTimer: 50 });
			const args = createMockArgs(100);
			updateMode(entities, args);

			expect(entities.board.frightenedTimer).toBe(0);
		});

		it('reverts frightened ghosts to the current ghost mode when timer reaches 0', () => {
			const entities = createMockEntities({
				frightenedTimer: 100,
				currentGhostMode: 'chase',
				ghostModes: {
					blinky: 'frightened',
					pinky: 'frightened',
					inky: 'frightened',
					clyde: 'frightened',
				},
			});
			const args = createMockArgs(200);
			updateMode(entities, args);

			expect(entities.blinky.mode).toBe('chase');
			expect(entities.pinky.mode).toBe('chase');
			expect(entities.inky.mode).toBe('chase');
			expect(entities.clyde.mode).toBe('chase');
		});

		it('does not change non-frightened ghost modes when frightened timer expires', () => {
			const entities = createMockEntities({
				frightenedTimer: 100,
				currentGhostMode: 'chase',
				ghostModes: {
					blinky: 'frightened',
					pinky: 'eaten',
					inky: 'house',
					clyde: 'frightened',
				},
			});
			const args = createMockArgs(200);
			updateMode(entities, args);

			expect(entities.blinky.mode).toBe('chase');
			expect(entities.pinky.mode).toBe('eaten');
			expect(entities.inky.mode).toBe('house');
			expect(entities.clyde.mode).toBe('chase');
		});

		it('resets ghostsEatenCombo when frightened ends', () => {
			const entities = createMockEntities({
				frightenedTimer: 100,
				ghostsEatenCombo: 3,
			});
			const args = createMockArgs(200);
			updateMode(entities, args);

			expect(entities.board.ghostsEatenCombo).toBe(0);
		});

		it('does not advance mode phases while frightened', () => {
			const entities = createMockEntities({
				frightenedTimer: 6000,
				modeTimer: 0,
				modePhaseIndex: 0,
			});
			const args = createMockArgs(100);
			updateMode(entities, args);

			expect(entities.board.modePhaseIndex).toBe(0);
			expect(entities.board.modeTimer).toBe(0);
		});
	});

	describe('scatter/chase phase transitions', () => {
		it('increments the mode timer by delta when not frightened', () => {
			const entities = createMockEntities({ modeTimer: 0, modePhaseIndex: 0 });
			const args = createMockArgs(1000);
			updateMode(entities, args);

			expect(entities.board.modeTimer).toBe(1000);
		});

		it('advances to the next phase when modeTimer exceeds phase duration (scatter -> chase)', () => {
			// Phase 0 is scatter with durationMs 7000
			const entities = createMockEntities({
				modeTimer: 6500,
				modePhaseIndex: 0,
				currentGhostMode: 'scatter',
			});
			const args = createMockArgs(600);
			updateMode(entities, args);

			expect(entities.board.modePhaseIndex).toBe(1);
			expect(entities.board.currentGhostMode).toBe('chase');
			expect(entities.board.modeTimer).toBe(0);
		});

		it('reverses ghost directions on mode transition', () => {
			const entities = createMockEntities({
				modeTimer: 6500,
				modePhaseIndex: 0,
				currentGhostMode: 'scatter',
				ghostModes: {
					blinky: 'scatter',
					pinky: 'scatter',
					inky: 'scatter',
					clyde: 'scatter',
				},
			});
			entities.blinky.direction = 'LEFT';
			entities.pinky.direction = 'UP';
			entities.inky.direction = 'RIGHT';
			entities.clyde.direction = 'DOWN';

			const args = createMockArgs(600);
			updateMode(entities, args);

			expect(entities.blinky.direction).toBe('RIGHT');
			expect(entities.pinky.direction).toBe('DOWN');
			expect(entities.inky.direction).toBe('LEFT');
			expect(entities.clyde.direction).toBe('UP');
		});

		it('does not reverse direction of house or eaten ghosts on transition', () => {
			const entities = createMockEntities({
				modeTimer: 6500,
				modePhaseIndex: 0,
				currentGhostMode: 'scatter',
				ghostModes: {
					blinky: 'scatter',
					pinky: 'house',
					inky: 'eaten',
					clyde: 'scatter',
				},
			});
			entities.pinky.direction = 'DOWN';
			entities.inky.direction = 'UP';

			const args = createMockArgs(600);
			updateMode(entities, args);

			expect(entities.pinky.direction).toBe('DOWN');
			expect(entities.inky.direction).toBe('UP');
		});

		it('does not advance past the final infinite chase phase', () => {
			// The last phase (index 7) has durationMs = 0, meaning infinite
			const entities = createMockEntities({
				modeTimer: 99999,
				modePhaseIndex: 7,
				currentGhostMode: 'chase',
			});
			const args = createMockArgs(100);
			updateMode(entities, args);

			expect(entities.board.modePhaseIndex).toBe(7);
			expect(entities.board.currentGhostMode).toBe('chase');
		});

		it('transitions through chase -> scatter correctly (phase 1 to 2)', () => {
			// Phase 1 is chase with durationMs 20000
			const entities = createMockEntities({
				modeTimer: 19500,
				modePhaseIndex: 1,
				currentGhostMode: 'chase',
				ghostModes: {
					blinky: 'chase',
					pinky: 'chase',
					inky: 'chase',
					clyde: 'chase',
				},
			});

			const args = createMockArgs(600);
			updateMode(entities, args);

			expect(entities.board.modePhaseIndex).toBe(2);
			expect(entities.board.currentGhostMode).toBe('scatter');
		});
	});
});
