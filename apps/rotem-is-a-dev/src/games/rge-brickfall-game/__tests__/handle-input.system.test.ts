import { handleInput } from '../systems/handle-input.system';
import { createEmptyGrid } from '../rge-brickfall-game.helpers';
import type { Entities, KeyScheme, SystemArgs } from '../rge-brickfall-game.types';

const createMockEntities = (keyScheme: KeyScheme = 'arrows'): Entities =>
	({
		board: {
			width: 10,
			height: 20,
			cellSize: 20,
			tickMs: 800,
			lastGravityTime: 0,
			keyScheme,
			softDropping: false,
			level: 1,
			score: 0,
			linesCleared: 0,
		},
		activePiece: {
			piece: { type: 'T', position: { x: 3, y: 0 }, rotation: 0 },
			cellSize: 20,
		},
		nextPiece: { type: 'I' },
		playfield: { grid: createEmptyGrid(20, 10), clearingRows: [] },
		ghost: { position: { x: 3, y: 18 }, type: 'T', rotation: 0, cellSize: 20 },
	}) as unknown as Entities;

const createMockArgs = (key?: string): SystemArgs =>
	({
		input: key ? [{ name: 'onKeyDown', payload: { key } }] : [],
		events: [],
		dispatch: jest.fn(),
		time: { current: 0, previous: null, delta: 0, previousDelta: null },
	}) as SystemArgs;

describe('handleInput', () => {
	it('moves piece left on ArrowLeft', () => {
		const entities = createMockEntities();
		const result = handleInput(entities, createMockArgs('ArrowLeft'));
		expect(result.activePiece.piece.position.x).toBe(2);
	});

	it('moves piece right on ArrowRight', () => {
		const entities = createMockEntities();
		const result = handleInput(entities, createMockArgs('ArrowRight'));
		expect(result.activePiece.piece.position.x).toBe(4);
	});

	it('does not move left into wall', () => {
		const entities = createMockEntities();
		entities.activePiece.piece.position.x = 0;
		const result = handleInput(entities, createMockArgs('ArrowLeft'));
		expect(result.activePiece.piece.position.x).toBe(0);
	});

	it('rotates piece on ArrowUp', () => {
		const entities = createMockEntities();
		const result = handleInput(entities, createMockArgs('ArrowUp'));
		expect(result.activePiece.piece.rotation).toBe(1);
	});

	it('applies wall kick when rotation collides', () => {
		const entities = createMockEntities();
		entities.activePiece.piece.type = 'I';
		entities.activePiece.piece.position = { x: -1, y: 5 };
		entities.activePiece.piece.rotation = 0;
		const result = handleInput(entities, createMockArgs('ArrowUp'));
		expect(result.activePiece.piece.rotation).toBe(1);
	});

	it('sets softDropping on ArrowDown', () => {
		const entities = createMockEntities();
		const result = handleInput(entities, createMockArgs('ArrowDown'));
		expect(result.board.softDropping).toBe(true);
	});

	it('dispatches lock-piece on hard drop (Space)', () => {
		const entities = createMockEntities();
		const args = createMockArgs(' ');
		handleInput(entities, args);
		expect(args.dispatch).toHaveBeenCalledWith({ type: 'lock-piece' });
	});

	it('moves piece to ghost position on hard drop', () => {
		const entities = createMockEntities();
		entities.activePiece.piece.position = { x: 3, y: 0 };
		handleInput(entities, createMockArgs(' '));
		expect(entities.activePiece.piece.position.y).toBe(18);
	});

	it('updates ghost position after move', () => {
		const entities = createMockEntities();
		entities.activePiece.piece.position = { x: 3, y: 0 };
		handleInput(entities, createMockArgs('ArrowLeft'));
		expect(entities.ghost.position.x).toBe(2);
	});

	it('ignores empty input', () => {
		const entities = createMockEntities();
		const result = handleInput(entities, createMockArgs());
		expect(result.activePiece.piece.position.x).toBe(3);
	});

	it('ignores unknown keys', () => {
		const entities = createMockEntities();
		const result = handleInput(entities, createMockArgs('z'));
		expect(result.activePiece.piece.position.x).toBe(3);
	});

	it('responds to WASD keys when keyScheme is wasd', () => {
		const entities = createMockEntities('wasd');
		const result = handleInput(entities, createMockArgs('a'));
		expect(result.activePiece.piece.position.x).toBe(2);
	});

	it('ignores arrow keys when keyScheme is wasd', () => {
		const entities = createMockEntities('wasd');
		const result = handleInput(entities, createMockArgs('ArrowLeft'));
		expect(result.activePiece.piece.position.x).toBe(3);
	});

	it('handles input event with undefined key', () => {
		const entities = createMockEntities();
		const args = createMockArgs();
		args.input = [{ name: 'onKeyDown', payload: {} }];
		const result = handleInput(entities, args);
		expect(result.activePiece.piece.position.x).toBe(3);
	});

	it('skips input when lines are being cleared', () => {
		const entities = createMockEntities();
		entities.playfield.clearingRows = [19];
		const result = handleInput(entities, createMockArgs('ArrowLeft'));
		expect(result.activePiece.piece.position.x).toBe(3);
	});
});
