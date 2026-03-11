import { gravity } from '../systems/gravity.system';
import { createEmptyGrid } from '../rge-brickfall-game.helpers';
import type { Entities, SystemArgs } from '../rge-brickfall-game.types';

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

const createMockArgs = (currentTime: number, events: Array<{ type: string }> = []): SystemArgs =>
	({
		input: [],
		events,
		dispatch: jest.fn(),
		time: { current: currentTime, previous: null, delta: 0, previousDelta: null },
	}) as SystemArgs;

describe('gravity', () => {
	it('moves piece down after tick interval', () => {
		const entities = createMockEntities();
		const result = gravity(entities, createMockArgs(900));
		expect(result.activePiece.piece.position.y).toBe(1);
	});

	it('does not move piece before tick interval', () => {
		const entities = createMockEntities();
		const result = gravity(entities, createMockArgs(500));
		expect(result.activePiece.piece.position.y).toBe(0);
	});

	it('dispatches piece-landed when piece cannot move down', () => {
		const entities = createMockEntities();
		entities.activePiece.piece.position = { x: 3, y: 18 };
		const args = createMockArgs(900);
		gravity(entities, args);
		expect(args.dispatch).toHaveBeenCalledWith({ type: 'piece-landed' });
	});

	it('does not move piece when piece-landed is dispatched', () => {
		const entities = createMockEntities();
		entities.activePiece.piece.position = { x: 3, y: 18 };
		gravity(entities, createMockArgs(900));
		expect(entities.activePiece.piece.position.y).toBe(18);
	});

	it('uses soft drop tick when softDropping is true', () => {
		const entities = createMockEntities();
		entities.board.softDropping = true;
		const result = gravity(entities, createMockArgs(60));
		expect(result.activePiece.piece.position.y).toBe(1);
	});

	it('skips if lock-piece event is already present', () => {
		const entities = createMockEntities();
		const args = createMockArgs(900, [{ type: 'lock-piece' }]);
		const result = gravity(entities, args);
		expect(result.activePiece.piece.position.y).toBe(0);
	});

	it('updates lastGravityTime after moving', () => {
		const entities = createMockEntities();
		gravity(entities, createMockArgs(900));
		expect(entities.board.lastGravityTime).toBe(900);
	});

	it('moves again after another tick interval', () => {
		const entities = createMockEntities();
		gravity(entities, createMockArgs(900));
		expect(entities.activePiece.piece.position.y).toBe(1);
		gravity(entities, createMockArgs(1800));
		expect(entities.activePiece.piece.position.y).toBe(2);
	});

	it('skips gravity when lines are being cleared', () => {
		const entities = createMockEntities();
		entities.playfield.clearingRows = [19];
		const result = gravity(entities, createMockArgs(900));
		expect(result.activePiece.piece.position.y).toBe(0);
	});
});
