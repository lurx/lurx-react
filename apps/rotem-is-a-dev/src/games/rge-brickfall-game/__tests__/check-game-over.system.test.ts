import { checkGameOver } from '../systems/check-game-over.system';
import { createEmptyGrid } from '../rge-brickfall-game.helpers';
import type { SystemArgs } from '../../games.types';
import type { Entities } from '../rge-brickfall-game.types';

const createMockEntities = (): Entities =>
	({
		board: {
			width: 10,
			height: 20,
			cellSize: 20,
			tickMs: 800,
			lastGravityTime: 0,
			keyScheme: 'arrows',
			softDropping: false,
			pendingActions: [],
			level: 1,
			score: 0,
			linesCleared: 0,
			clearingStartTime: 0,
		},
		activePiece: {
			piece: { type: 'T', position: { x: 3, y: 0 }, rotation: 0 },
			cellSize: 20,
		},
		nextPiece: { type: 'I' },
		playfield: { grid: createEmptyGrid(20, 10), clearingRows: [] },
		ghost: { position: { x: 3, y: 18 }, type: 'T', rotation: 0, cellSize: 20 },
	}) as unknown as Entities;

const createMockArgs = (): SystemArgs =>
	({
		input: [],
		events: [],
		dispatch: jest.fn(),
		time: { current: 0, previous: null, delta: 0, previousDelta: null },
	}) as SystemArgs;

describe('checkGameOver', () => {
	it('does not dispatch game-over when piece does not overlap', () => {
		const entities = createMockEntities();
		const args = createMockArgs();
		checkGameOver(entities, args);
		expect(args.dispatch).not.toHaveBeenCalled();
	});

	it('dispatches game-over when piece overlaps occupied cells', () => {
		const entities = createMockEntities();
		entities.playfield.grid[0][4] = '#ff0000';
		const args = createMockArgs();
		checkGameOver(entities, args);
		expect(args.dispatch).toHaveBeenCalledWith({ type: 'game-over' });
	});

	it('does not dispatch when piece cells are above the grid (negative y)', () => {
		const entities = createMockEntities();
		entities.activePiece.piece.position = { x: 3, y: -2 };
		const args = createMockArgs();
		checkGameOver(entities, args);
		expect(args.dispatch).not.toHaveBeenCalled();
	});

	it('returns entities unchanged', () => {
		const entities = createMockEntities();
		const result = checkGameOver(entities, createMockArgs());
		expect(result).toBe(entities);
	});

	it('skips check when lines are being cleared', () => {
		const entities = createMockEntities();
		entities.playfield.clearingRows = [19];
		entities.playfield.grid[0][4] = '#ff0000';
		const args = createMockArgs();
		checkGameOver(entities, args);
		expect(args.dispatch).not.toHaveBeenCalled();
	});
});
