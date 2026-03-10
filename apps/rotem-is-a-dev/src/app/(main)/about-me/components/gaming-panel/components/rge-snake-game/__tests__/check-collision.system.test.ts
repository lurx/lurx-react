import { checkCollision } from '../systems/check-collision.system';
import type { Entities, SystemArgs } from '../rge-snake-game.types';

const createMockArgs = (): SystemArgs => ({
	input: [],
	events: [],
	dispatch: jest.fn(),
	time: { current: 0, previous: null, delta: 0, previousDelta: null },
});

const createMockEntities = (headX: number, headY: number, body?: { x: number; y: number }[]): Entities =>
	({
		snake: {
			body: body ?? [
				{ x: headX, y: headY },
				{ x: headX, y: headY + 1 },
				{ x: headX, y: headY + 2 },
			],
			direction: 'UP',
			growing: false,
		},
		food: { position: { x: 3, y: 3 } },
		board: { width: 15, height: 15, cellSize: 20, tickMs: 150 },
	}) as unknown as Entities;

describe('checkCollision', () => {
	it('dispatches game-over when head hits left wall', () => {
		const entities = createMockEntities(-1, 5);
		const args = createMockArgs();
		checkCollision(entities, args);
		expect(args.dispatch).toHaveBeenCalledWith({ type: 'game-over' });
	});

	it('dispatches game-over when head hits right wall', () => {
		const entities = createMockEntities(15, 5);
		const args = createMockArgs();
		checkCollision(entities, args);
		expect(args.dispatch).toHaveBeenCalledWith({ type: 'game-over' });
	});

	it('dispatches game-over when head hits top wall', () => {
		const entities = createMockEntities(5, -1);
		const args = createMockArgs();
		checkCollision(entities, args);
		expect(args.dispatch).toHaveBeenCalledWith({ type: 'game-over' });
	});

	it('dispatches game-over when head hits bottom wall', () => {
		const entities = createMockEntities(5, 15);
		const args = createMockArgs();
		checkCollision(entities, args);
		expect(args.dispatch).toHaveBeenCalledWith({ type: 'game-over' });
	});

	it('dispatches game-over when head hits own body', () => {
		const selfCollisionBody = [
			{ x: 5, y: 5 },
			{ x: 6, y: 5 },
			{ x: 6, y: 6 },
			{ x: 5, y: 6 },
			{ x: 5, y: 5 },
		];
		const entities = createMockEntities(5, 5, selfCollisionBody);
		const args = createMockArgs();
		checkCollision(entities, args);
		expect(args.dispatch).toHaveBeenCalledWith({ type: 'game-over' });
	});

	it('does not dispatch when snake is in valid position', () => {
		const entities = createMockEntities(7, 7);
		const args = createMockArgs();
		checkCollision(entities, args);
		expect(args.dispatch).not.toHaveBeenCalled();
	});

	it('dispatches game-won when snake reaches win length', () => {
		const longBody = Array.from({ length: 20 }, (_, index) => ({ x: 7, y: index }));
		const entities = createMockEntities(7, 0, longBody);
		const args = createMockArgs();
		checkCollision(entities, args);
		expect(args.dispatch).toHaveBeenCalledWith({ type: 'game-won' });
	});

	it('does not dispatch game-won when snake is below win length', () => {
		const shortBody = Array.from({ length: 19 }, (_, index) => ({ x: 7, y: index }));
		const entities = createMockEntities(7, 0, shortBody);
		const args = createMockArgs();
		checkCollision(entities, args);
		expect(args.dispatch).not.toHaveBeenCalledWith({ type: 'game-won' });
	});
});
