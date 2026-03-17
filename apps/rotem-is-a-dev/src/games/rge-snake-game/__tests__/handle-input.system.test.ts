import { handleInput } from '../systems/handle-input.system';
import type { SystemArgs } from '../../games.types';
import type { Entities } from '../rge-snake-game.types';

const createMockEntities = (direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT' = 'UP', keyScheme: 'arrows' | 'wasd' = 'arrows'): Entities =>
	({
		snake: {
			body: [{ x: 7, y: 7 }],
			direction,
			growing: false,
		},
		food: { position: { x: 3, y: 3 } },
		board: { width: 15, height: 15, cellSize: 20, tickMs: 150, keyScheme, winLength: 20 },
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

	it.each([
		['UP', 'ArrowDown'],
		['DOWN', 'ArrowUp'],
		['LEFT', 'ArrowRight'],
		['RIGHT', 'ArrowLeft'],
	] as const)('prevents 180-degree reversal from %s via %s', (startDir, key) => {
		const entities = createMockEntities(startDir);
		const result = handleInput(entities, createMockArgs(key));
		expect(result.snake.direction).toBe(startDir);
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

	it.each([
		['arrows', 'w', 'UP'],
		['wasd', 'ArrowRight', 'UP'],
	] as const)('ignores wrong scheme keys (%s scheme, key %s)', (scheme, key, expectedDir) => {
		const entities = createMockEntities('UP', scheme);
		const result = handleInput(entities, createMockArgs(key));
		expect(result.snake.direction).toBe(expectedDir);
	});

	it('responds to WASD keys when keyScheme is wasd', () => {
		const entities = createMockEntities('UP', 'wasd');
		const result = handleInput(entities, createMockArgs('d'));
		expect(result.snake.direction).toBe('RIGHT');
	});
});
