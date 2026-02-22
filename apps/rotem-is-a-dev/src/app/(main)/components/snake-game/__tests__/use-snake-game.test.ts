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

	it('ignores non-arrow keydown events', () => {
		const { result } = renderHook(() => useSnakeGame());

		act(() => {
			window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
		});

		expect(result.current.activeKey).toBeNull();
	});

	it('does not change direction when not playing', () => {
		const { result } = renderHook(() => useSnakeGame());
		// idle state — arrow key should set activeKey but not change direction
		act(() => {
			window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
		});

		expect(result.current.activeKey).toBe('ArrowRight');
		expect(result.current.direction).toBe('UP'); // unchanged
	});

	it('transitions to won state when all food is eaten', () => {
		// Place food in a straight line above the snake head, plus one to the left
		const randomValues = [
			7 / GRID_COLS, 8 / GRID_ROWS, // food 1: (7, 8)
			7 / GRID_COLS, 7 / GRID_ROWS, // food 2: (7, 7)
			7 / GRID_COLS, 6 / GRID_ROWS, // food 3: (7, 6)
			7 / GRID_COLS, 5 / GRID_ROWS, // food 4: (7, 5)
			7 / GRID_COLS, 4 / GRID_ROWS, // food 5: (7, 4)
			7 / GRID_COLS, 3 / GRID_ROWS, // food 6: (7, 3)
			7 / GRID_COLS, 2 / GRID_ROWS, // food 7: (7, 2)
			7 / GRID_COLS, 1 / GRID_ROWS, // food 8: (7, 1)
			7 / GRID_COLS, 0,             // food 9: (7, 0)
			6 / GRID_COLS, 0,             // food 10: (6, 0)
		];
		let callIndex = 0;
		const randomSpy = jest
			.spyOn(Math, 'random')
			.mockImplementation(() => randomValues[callIndex++]);

		const { result } = renderHook(() => useSnakeGame());

		act(() => {
			result.current.startGame();
		});

		// 9 ticks — snake eats food going UP from (7,9) to (7,0)
		act(() => {
			jest.advanceTimersByTime(200 * 9);
		});

		// Turn LEFT to reach the last food at (6, 0)
		act(() => {
			window.dispatchEvent(
				new KeyboardEvent('keydown', { key: 'ArrowLeft' }),
			);
		});

		// One more tick — eats last food → won
		act(() => {
			jest.advanceTimersByTime(200);
		});

		expect(result.current.gameState).toBe('won');
		expect(result.current.food).toHaveLength(0);

		randomSpy.mockRestore();
	});
});
