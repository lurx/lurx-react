import { moveSnake, resetMoveSnakeTick } from '../systems/move-snake.system';
import type { Entities, SystemArgs } from '../rge-snake-game.types';

const createMockEntities = (
	direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' = 'UP',
	growing = false
): Entities =>
	({
		snake: {
			body: [
				{ x: 7, y: 7 },
				{ x: 7, y: 8 },
				{ x: 7, y: 9 },
			],
			direction,
			growing,
		},
		food: { position: { x: 3, y: 3 } },
		board: { width: 15, height: 15 },
	}) as unknown as Entities;

const createMockArgs = (currentTime: number): SystemArgs =>
	({
		input: [],
		events: [],
		dispatch: jest.fn(),
		time: { current: currentTime, previous: null, delta: 0, previousDelta: null },
	}) as SystemArgs;

beforeEach(() => {
	resetMoveSnakeTick();
});

describe('moveSnake', () => {
	it('moves the snake head in the current direction (UP)', () => {
		const entities = createMockEntities('UP');
		const result = moveSnake(entities, createMockArgs(200));
		expect(result.snake.body[0]).toEqual({ x: 7, y: 6 });
	});

	it('moves the snake head DOWN', () => {
		const entities = createMockEntities('DOWN');
		const result = moveSnake(entities, createMockArgs(200));
		expect(result.snake.body[0]).toEqual({ x: 7, y: 8 });
	});

	it('moves the snake head LEFT', () => {
		const entities = createMockEntities('LEFT');
		const result = moveSnake(entities, createMockArgs(200));
		expect(result.snake.body[0]).toEqual({ x: 6, y: 7 });
	});

	it('moves the snake head RIGHT', () => {
		const entities = createMockEntities('RIGHT');
		const result = moveSnake(entities, createMockArgs(200));
		expect(result.snake.body[0]).toEqual({ x: 8, y: 7 });
	});

	it('removes the tail when not growing', () => {
		const entities = createMockEntities('UP');
		const result = moveSnake(entities, createMockArgs(200));
		expect(result.snake.body).toHaveLength(3);
	});

	it('keeps the tail when growing', () => {
		const entities = createMockEntities('UP', true);
		const result = moveSnake(entities, createMockArgs(200));
		expect(result.snake.body).toHaveLength(4);
		expect(result.snake.growing).toBe(false);
	});

	it('does not move if tick interval has not elapsed', () => {
		const entities = createMockEntities('UP');
		const result = moveSnake(entities, createMockArgs(50));
		expect(result.snake.body[0]).toEqual({ x: 7, y: 7 });
		expect(result.snake.body).toHaveLength(3);
	});

	it('moves again after tick interval elapses', () => {
		const entities = createMockEntities('UP');
		moveSnake(entities, createMockArgs(200));
		expect(entities.snake.body[0]).toEqual({ x: 7, y: 6 });

		const result = moveSnake(entities, createMockArgs(400));
		expect(result.snake.body[0]).toEqual({ x: 7, y: 5 });
	});
});
