import { act, renderHook } from '@testing-library/react';
import { GRID_COLS, GRID_ROWS, SNAKE_LENGTH, useSnakeGame } from '../hooks/use-snake-game.hook';

beforeEach(() => {
	jest.useFakeTimers();
});

afterEach(() => {
	jest.useRealTimers();
});

describe('useSnakeGame', () => {
	it('starts in idle state', () => {
		const { result } = renderHook(() => useSnakeGame());
		expect(result.current.gameState).toBe('idle');
	});

	it(`has an initial snake of ${SNAKE_LENGTH} segments`, () => {
		const { result } = renderHook(() => useSnakeGame());
		expect(result.current.snake).toHaveLength(SNAKE_LENGTH);
	});

	it('has no food in idle state', () => {
		const { result } = renderHook(() => useSnakeGame());
		expect(result.current.food).toHaveLength(0);
	});

	it('transitions to playing state after startGame', () => {
		const { result } = renderHook(() => useSnakeGame());
		act(() => result.current.startGame());
		expect(result.current.gameState).toBe('playing');
	});

	it('places 10 food items after startGame', () => {
		const { result } = renderHook(() => useSnakeGame());
		act(() => result.current.startGame());
		expect(result.current.food).toHaveLength(10);
	});

	it('moves snake on each tick', () => {
		const { result } = renderHook(() => useSnakeGame());
		act(() => result.current.startGame());

		const initialHead = { ...result.current.snake[0] };

		act(() => jest.advanceTimersByTime(201));

		expect(result.current.snake[0]).not.toEqual(initialHead);
	});

	it('ignores reverse direction input', () => {
		const { result } = renderHook(() => useSnakeGame());
		act(() => result.current.startGame());

		// Default direction is UP, pressing DOWN should be ignored
		act(() => {
			window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
		});

		expect(result.current.direction).toBe('UP');
	});

	it('accepts a perpendicular direction change', () => {
		const { result } = renderHook(() => useSnakeGame());
		act(() => result.current.startGame());

		act(() => {
			window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
		});

		expect(result.current.direction).toBe('RIGHT');
	});

	it('detects wall collision and sets lost state', () => {
		const { result } = renderHook(() => useSnakeGame());
		act(() => result.current.startGame());

		// Drive into top wall (snake starts facing UP)
		act(() => jest.advanceTimersByTime(150 * (GRID_ROWS + 5)));

		expect(result.current.gameState).toBe('lost');
	});

	it('resets to idle on resetGame', () => {
		const { result } = renderHook(() => useSnakeGame());
		act(() => result.current.startGame());
		act(() => result.current.resetGame());

		expect(result.current.gameState).toBe('idle');
		expect(result.current.food).toHaveLength(0);
		expect(result.current.snake).toHaveLength(SNAKE_LENGTH);
	});

	it('tracks the active key on keydown', () => {
		const { result } = renderHook(() => useSnakeGame());

		act(() => {
			window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
		});

		expect(result.current.activeKey).toBe('ArrowUp');
	});

	it('clears active key on keyup', () => {
		const { result } = renderHook(() => useSnakeGame());

		act(() => {
			window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
			window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowUp' }));
		});

		expect(result.current.activeKey).toBeNull();
	});

	it('grid has correct dimensions', () => {
		expect(GRID_COLS).toBe(15);
		expect(GRID_ROWS).toBe(25);
	});
});
