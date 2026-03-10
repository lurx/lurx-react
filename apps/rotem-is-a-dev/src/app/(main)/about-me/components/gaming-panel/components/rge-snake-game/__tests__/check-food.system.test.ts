import { checkFood } from '../systems/check-food.system';
import type { Entities, SystemArgs } from '../rge-snake-game.types';

const createMockEntities = (
	headX: number,
	headY: number,
	foodX: number,
	foodY: number
): Entities =>
	({
		snake: {
			body: [
				{ x: headX, y: headY },
				{ x: headX, y: headY + 1 },
			],
			direction: 'UP',
			growing: false,
		},
		food: { position: { x: foodX, y: foodY } },
		board: { width: 15, height: 15 },
	}) as unknown as Entities;

const createMockArgs = (): SystemArgs => ({
	input: [],
	events: [],
	dispatch: jest.fn(),
	time: { current: 0, previous: null, delta: 0, previousDelta: null },
});

describe('checkFood', () => {
	it('sets growing to true when head is on food', () => {
		const entities = createMockEntities(5, 5, 5, 5);
		const args = createMockArgs();
		const result = checkFood(entities, args);
		expect(result.snake.growing).toBe(true);
	});

	it('dispatches food-eaten event when food is eaten', () => {
		const entities = createMockEntities(5, 5, 5, 5);
		const args = createMockArgs();
		checkFood(entities, args);
		expect(args.dispatch).toHaveBeenCalledWith({ type: 'food-eaten' });
	});

	it('respawns food at a new position when eaten', () => {
		const entities = createMockEntities(5, 5, 5, 5);
		const args = createMockArgs();
		checkFood(entities, args);
		const { position } = entities.food;
		expect(position).toBeDefined();
		expect(typeof position.x).toBe('number');
		expect(typeof position.y).toBe('number');
	});

	it('does not set growing when head is not on food', () => {
		const entities = createMockEntities(5, 5, 10, 10);
		const args = createMockArgs();
		const result = checkFood(entities, args);
		expect(result.snake.growing).toBe(false);
	});

	it('does not dispatch when head is not on food', () => {
		const entities = createMockEntities(5, 5, 10, 10);
		const args = createMockArgs();
		checkFood(entities, args);
		expect(args.dispatch).not.toHaveBeenCalled();
	});

	it('respawned food is not on the snake body', () => {
		const entities = createMockEntities(5, 5, 5, 5);
		const args = createMockArgs();
		checkFood(entities, args);
		const { position } = entities.food;
		const onSnake = entities.snake.body.some(
			(segment) => segment.x === position.x && segment.y === position.y
		);
		expect(onSnake).toBe(false);
	});
});
