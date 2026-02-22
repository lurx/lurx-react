import { render, screen } from '@testing-library/react';

const mockStartGame = jest.fn();
const mockResetGame = jest.fn();
let mockSnake = [{ x: 7, y: 12 }];

jest.mock('../hooks/use-snake-game.hook', () => ({
	GRID_COLS: 15,
	GRID_ROWS: 25,
	INITIAL_FOOD_COUNT: 10,
	useSnakeGame: () => ({
		snake: mockSnake,
		food: [],
		gameState: 'won',
		startGame: mockStartGame,
		resetGame: mockResetGame,
	}),
}));

// Mock canvas
const originalGetContext = HTMLCanvasElement.prototype.getContext;
beforeAll(() => {
	HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
		clearRect: jest.fn(),
		beginPath: jest.fn(),
		arc: jest.fn(),
		fill: jest.fn(),
		moveTo: jest.fn(),
		lineTo: jest.fn(),
		stroke: jest.fn(),
		createLinearGradient: jest.fn(() => ({ addColorStop: jest.fn() })),
		fillStyle: '',
		strokeStyle: '',
		lineWidth: 0,
		lineCap: '',
		lineJoin: '',
	})) as unknown as typeof originalGetContext;
});
afterAll(() => {
	HTMLCanvasElement.prototype.getContext = originalGetContext;
});

import { SnakeGame } from '../snake-game.component';

beforeEach(() => {
	mockSnake = [{ x: 7, y: 12 }];
});

describe('SnakeGame — won state', () => {
	it('shows WELL DONE overlay when game is won', () => {
		render(
			<SnakeGame
				onWin={jest.fn()}
				onSkip={jest.fn()}
			/>,
		);
		expect(screen.getByText('WELL DONE!')).toBeInTheDocument();
	});

	it('shows play-again button when game is won', () => {
		render(
			<SnakeGame
				onWin={jest.fn()}
				onSkip={jest.fn()}
			/>,
		);
		expect(screen.getByRole('button', { name: 'Play again' })).toBeInTheDocument();
	});

	it('calls onWin callback when game is won', () => {
		const onWin = jest.fn();
		render(
			<SnakeGame
				onWin={onWin}
				onSkip={jest.fn()}
			/>,
		);
		expect(onWin).toHaveBeenCalled();
	});

	it('skips snake drawing when snake array is empty', () => {
		mockSnake = [];
		render(
			<SnakeGame
				onWin={jest.fn()}
				onSkip={jest.fn()}
			/>,
		);
		expect(screen.getByText('WELL DONE!')).toBeInTheDocument();
	});

	it('handles null canvas context gracefully', () => {
		const prevGetContext = HTMLCanvasElement.prototype.getContext;
		HTMLCanvasElement.prototype.getContext = jest.fn(
			() => null,
		) as unknown as typeof originalGetContext;

		render(
			<SnakeGame
				onWin={jest.fn()}
				onSkip={jest.fn()}
			/>,
		);
		expect(screen.getByText('WELL DONE!')).toBeInTheDocument();

		HTMLCanvasElement.prototype.getContext = prevGetContext;
	});
});
