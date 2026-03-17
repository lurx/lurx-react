import { handleInput } from '../systems/handle-input.system';
import { createEmptyGrid } from '../rge-brickfall-game.helpers';
import type { SystemArgs } from '../../games.types';
import type { BrickfallAction, Entities } from '../rge-brickfall-game.types';

const createMockEntities = (pendingActions: BrickfallAction[] = []): Entities =>
	({
		board: {
			width: 10,
			height: 20,
			cellSize: 20,
			tickMs: 800,
			lastGravityTime: 0,
			keyScheme: 'arrows',
			softDropping: false,
			pendingActions,
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

describe('handleInput', () => {
	it('moves piece left on LEFT action', () => {
		const entities = createMockEntities(['LEFT']);
		const result = handleInput(entities, createMockArgs());
		expect(result.activePiece.piece.position.x).toBe(2);
	});

	it('moves piece right on RIGHT action', () => {
		const entities = createMockEntities(['RIGHT']);
		const result = handleInput(entities, createMockArgs());
		expect(result.activePiece.piece.position.x).toBe(4);
	});

	it('does not move left into wall', () => {
		const entities = createMockEntities(['LEFT']);
		entities.activePiece.piece.position.x = 0;
		const result = handleInput(entities, createMockArgs());
		expect(result.activePiece.piece.position.x).toBe(0);
	});

	it('rotates piece on ROTATE action', () => {
		const entities = createMockEntities(['ROTATE']);
		const result = handleInput(entities, createMockArgs());
		expect(result.activePiece.piece.rotation).toBe(1);
	});

	it('applies wall kick when rotation collides', () => {
		const entities = createMockEntities(['ROTATE']);
		entities.activePiece.piece.type = 'I';
		entities.activePiece.piece.position = { x: -1, y: 5 };
		entities.activePiece.piece.rotation = 0;
		const result = handleInput(entities, createMockArgs());
		expect(result.activePiece.piece.rotation).toBe(1);
	});

	it('dispatches lock-piece on HARD_DROP action', () => {
		const entities = createMockEntities(['HARD_DROP']);
		const args = createMockArgs();
		handleInput(entities, args);
		expect(args.dispatch).toHaveBeenCalledWith({ type: 'lock-piece' });
	});

	it('moves piece to ghost position on hard drop', () => {
		const entities = createMockEntities(['HARD_DROP']);
		entities.activePiece.piece.position = { x: 3, y: 0 };
		handleInput(entities, createMockArgs());
		expect(entities.activePiece.piece.position.y).toBe(18);
	});

	it('updates ghost position after move', () => {
		const entities = createMockEntities(['LEFT']);
		entities.activePiece.piece.position = { x: 3, y: 0 };
		handleInput(entities, createMockArgs());
		expect(entities.ghost.position.x).toBe(2);
	});

	it('ignores empty pendingActions', () => {
		const entities = createMockEntities();
		const result = handleInput(entities, createMockArgs());
		expect(result.activePiece.piece.position.x).toBe(3);
	});

	it('clears pendingActions after processing', () => {
		const entities = createMockEntities(['LEFT', 'ROTATE']);
		handleInput(entities, createMockArgs());
		expect(entities.board.pendingActions).toEqual([]);
	});

	it('skips input when lines are being cleared', () => {
		const entities = createMockEntities(['LEFT']);
		entities.playfield.clearingRows = [19];
		const result = handleInput(entities, createMockArgs());
		expect(result.activePiece.piece.position.x).toBe(3);
	});
});
