import { lockPiece } from '../systems/lock-piece.system';
import { createEmptyGrid } from '../rge-brickfall-game.helpers';
import { LINE_CLEAR_BLINK_MS } from '../rge-brickfall-game.constants';
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
			clearingStartTime: 0,
		},
		activePiece: {
			piece: { type: 'T', position: { x: 3, y: 18 }, rotation: 0 },
			cellSize: 20,
		},
		nextPiece: { type: 'I' },
		playfield: { grid: createEmptyGrid(20, 10), clearingRows: [] },
		ghost: { position: { x: 3, y: 18 }, type: 'T', rotation: 0, cellSize: 20 },
	}) as unknown as Entities;

const createMockArgs = (eventType: string, currentTime = 0): SystemArgs =>
	({
		input: [],
		events: [{ type: eventType }],
		dispatch: jest.fn(),
		time: { current: currentTime, previous: null, delta: 0, previousDelta: null },
	}) as SystemArgs;

describe('lockPiece', () => {
	it('does nothing when no lock events are present', () => {
		const entities = createMockEntities();
		const args: SystemArgs = {
			input: [],
			events: [],
			dispatch: jest.fn(),
			time: { current: 0, previous: null, delta: 0, previousDelta: null },
		};
		const result = lockPiece(entities, args);
		expect(result.playfield.grid[18][3]).toBeNull();
	});

	it('writes active piece cells to the grid on piece-landed', () => {
		const entities = createMockEntities();
		lockPiece(entities, createMockArgs('piece-landed'));
		expect(entities.playfield.grid[18][4]).toBe('#c792ea');
		expect(entities.playfield.grid[19][3]).toBe('#c792ea');
		expect(entities.playfield.grid[19][4]).toBe('#c792ea');
		expect(entities.playfield.grid[19][5]).toBe('#c792ea');
	});

	it('writes active piece cells to the grid on lock-piece', () => {
		const entities = createMockEntities();
		lockPiece(entities, createMockArgs('lock-piece'));
		expect(entities.playfield.grid[19][4]).toBe('#c792ea');
	});

	it('spawns next piece when no full rows exist', () => {
		const entities = createMockEntities();
		entities.nextPiece.type = 'S';
		lockPiece(entities, createMockArgs('piece-landed'));
		expect(entities.activePiece.piece.type).toBe('S');
		expect(entities.activePiece.piece.position).toEqual({ x: 3, y: 0 });
		expect(entities.activePiece.piece.rotation).toBe(0);
	});

	it('generates a new random nextPiece type', () => {
		const entities = createMockEntities();
		lockPiece(entities, createMockArgs('piece-landed'));
		expect(entities.nextPiece.type).toBeDefined();
	});

	it('resets softDropping to false', () => {
		const entities = createMockEntities();
		entities.board.softDropping = true;
		lockPiece(entities, createMockArgs('piece-landed'));
		expect(entities.board.softDropping).toBe(false);
	});

	it('dispatches game-over when spawn collides', () => {
		const entities = createMockEntities();
		entities.nextPiece.type = 'I';
		entities.playfield.grid[1][3] = '#ff0000';
		entities.playfield.grid[1][4] = '#ff0000';
		entities.playfield.grid[1][5] = '#ff0000';
		entities.playfield.grid[1][6] = '#ff0000';
		const args = createMockArgs('piece-landed');
		lockPiece(entities, args);
		expect(args.dispatch).toHaveBeenCalledWith({ type: 'game-over' });
	});

	describe('two-phase line clearing', () => {
		it('sets clearingRows and clearingStartTime when full rows are detected', () => {
			const entities = createMockEntities();
			for (let col = 0; col < 10; col++) {
				if (col !== 4) entities.playfield.grid[19][col] = '#ff0000';
			}
			const args = createMockArgs('piece-landed', 1000);
			lockPiece(entities, args);
			expect(entities.playfield.clearingRows).toEqual([19]);
			expect(entities.board.clearingStartTime).toBe(1000);
		});

		it('does not spawn next piece during clearing phase', () => {
			const entities = createMockEntities();
			for (let col = 0; col < 10; col++) {
				if (col !== 4) entities.playfield.grid[19][col] = '#ff0000';
			}
			const originalNext = entities.nextPiece.type;
			const args = createMockArgs('piece-landed', 1000);
			lockPiece(entities, args);
			expect(entities.nextPiece.type).toBe(originalNext);
		});

		it('does not clear lines before blink timer expires', () => {
			const entities = createMockEntities();
			entities.playfield.clearingRows = [19];
			entities.board.clearingStartTime = 1000;
			for (let col = 0; col < 10; col++) {
				entities.playfield.grid[19][col] = '#ff0000';
			}
			const args = createMockArgs('piece-landed', 1000 + LINE_CLEAR_BLINK_MS - 1);
			lockPiece(entities, args);
			expect(entities.playfield.clearingRows).toEqual([19]);
			expect(entities.playfield.grid[19].every((cell) => cell !== null)).toBe(true);
		});

		it('clears lines and spawns piece after blink timer expires', () => {
			const entities = createMockEntities();
			entities.playfield.clearingRows = [19];
			entities.board.clearingStartTime = 1000;
			for (let col = 0; col < 10; col++) {
				entities.playfield.grid[19][col] = '#ff0000';
			}
			const args = createMockArgs('piece-landed', 1000 + LINE_CLEAR_BLINK_MS);
			lockPiece(entities, args);
			expect(entities.playfield.clearingRows).toEqual([]);
			expect(entities.board.score).toBeGreaterThan(0);
		});

		it('dispatches score-updated after clearing', () => {
			const entities = createMockEntities();
			entities.playfield.clearingRows = [19];
			entities.board.clearingStartTime = 1000;
			for (let col = 0; col < 10; col++) {
				entities.playfield.grid[19][col] = '#ff0000';
			}
			const args = createMockArgs('piece-landed', 1000 + LINE_CLEAR_BLINK_MS);
			lockPiece(entities, args);
			expect(args.dispatch).toHaveBeenCalledWith({ type: 'score-updated' });
		});

		it('updates level based on total lines cleared', () => {
			const entities = createMockEntities();
			entities.board.linesCleared = 9;
			entities.playfield.clearingRows = [19];
			entities.board.clearingStartTime = 1000;
			for (let col = 0; col < 10; col++) {
				entities.playfield.grid[19][col] = '#ff0000';
			}
			lockPiece(entities, createMockArgs('piece-landed', 1000 + LINE_CLEAR_BLINK_MS));
			expect(entities.board.level).toBeGreaterThanOrEqual(2);
		});
	});
});
