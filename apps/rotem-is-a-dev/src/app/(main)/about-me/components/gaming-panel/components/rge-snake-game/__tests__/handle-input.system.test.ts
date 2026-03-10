import { handleInput } from '../systems/handle-input.system';
import type { Entities, SystemArgs } from '../rge-snake-game.types';

const createMockEntities = (direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' = 'UP'): Entities =>
	({
		snake: {
			body: [{ x: 7, y: 7 }],
			direction,
			growing: false,
		},
		food: { position: { x: 3, y: 3 } },
		board: { width: 15, height: 15, cellSize: 20, tickMs: 150 },
	}) as unknown as Entities;

const createMockArgs = (key?: string): SystemArgs =>
	({
		input: key ? [{ name: 'onKeyDown', payload: { key } }] : [],
		events: [],
		dispatch: jest.fn(),
		time: { current: 0, previous: null, delta: 0, previousDelta: null },
	}) as SystemArgs;

describe('handleInput', () => {
	it('changes direction when a valid arrow key is pressed', () => {
		const entities = createMockEntities('UP');
		const result = handleInput(entities, createMockArgs('ArrowRight'));
		expect(result.snake.direction).toBe('RIGHT');
	});

	it('prevents 180-degree reversal from UP to DOWN', () => {
		const entities = createMockEntities('UP');
		const result = handleInput(entities, createMockArgs('ArrowDown'));
		expect(result.snake.direction).toBe('UP');
	});

	it('prevents 180-degree reversal from LEFT to RIGHT', () => {
		const entities = createMockEntities('LEFT');
		const result = handleInput(entities, createMockArgs('ArrowRight'));
		expect(result.snake.direction).toBe('LEFT');
	});

	it('prevents 180-degree reversal from RIGHT to LEFT', () => {
		const entities = createMockEntities('RIGHT');
		const result = handleInput(entities, createMockArgs('ArrowLeft'));
		expect(result.snake.direction).toBe('RIGHT');
	});

	it('prevents 180-degree reversal from DOWN to UP', () => {
		const entities = createMockEntities('DOWN');
		const result = handleInput(entities, createMockArgs('ArrowUp'));
		expect(result.snake.direction).toBe('DOWN');
	});

	it('ignores non-arrow key input', () => {
		const entities = createMockEntities('UP');
		const result = handleInput(entities, createMockArgs('Space'));
		expect(result.snake.direction).toBe('UP');
	});

	it('ignores empty input', () => {
		const entities = createMockEntities('UP');
		const result = handleInput(entities, createMockArgs());
		expect(result.snake.direction).toBe('UP');
	});

	it('handles input event with undefined key', () => {
		const entities = createMockEntities('UP');
		const args = createMockArgs();
		args.input = [{ name: 'onKeyDown', payload: {} }];
		const result = handleInput(entities, args);
		expect(result.snake.direction).toBe('UP');
	});

	it('only processes the first valid key when multiple are pressed', () => {
		const entities = createMockEntities('UP');
		const args = createMockArgs();
		args.input = [
			{ name: 'onKeyDown', payload: { key: 'ArrowLeft' } },
			{ name: 'onKeyDown', payload: { key: 'ArrowRight' } },
		];
		const result = handleInput(entities, args);
		expect(result.snake.direction).toBe('LEFT');
	});
});
