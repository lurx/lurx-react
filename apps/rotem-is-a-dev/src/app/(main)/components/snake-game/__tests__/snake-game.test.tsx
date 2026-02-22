import { act, fireEvent, render, screen } from '@testing-library/react';
import { SnakeGame } from '../snake-game.component';

const noop = jest.fn();

// Mock canvas context so drawing code executes
const mockGradient = { addColorStop: jest.fn() };
const mockCtx = {
	clearRect: jest.fn(),
	beginPath: jest.fn(),
	arc: jest.fn(),
	fill: jest.fn(),
	moveTo: jest.fn(),
	lineTo: jest.fn(),
	stroke: jest.fn(),
	createLinearGradient: jest.fn(() => mockGradient),
	fillStyle: '',
	strokeStyle: '',
	lineWidth: 0,
	lineCap: '',
	lineJoin: '',
};

const originalGetContext = HTMLCanvasElement.prototype.getContext;
beforeAll(() => {
	HTMLCanvasElement.prototype.getContext = jest.fn(() => mockCtx) as unknown as typeof originalGetContext;
});
afterAll(() => {
	HTMLCanvasElement.prototype.getContext = originalGetContext;
});

beforeEach(() => {
	jest.useFakeTimers();
	noop.mockClear();
	jest.clearAllMocks();
});

afterEach(() => {
	jest.useRealTimers();
});

function advanceGame(ms: number) {
	act(() => {
		jest.advanceTimersByTime(ms);
	});
}

describe('SnakeGame', () => {
	it('renders the game grid', () => {
		render(
			<SnakeGame
				onWin={noop}
				onSkip={noop}
			/>,
		);
		expect(screen.getByRole('img', { name: 'Snake game grid' })).toBeInTheDocument();
	});

	it('renders the start-game button', () => {
		render(
			<SnakeGame
				onWin={noop}
				onSkip={noop}
			/>,
		);
		expect(screen.getByRole('button', { name: 'Start game' })).toBeInTheDocument();
	});

	it('renders the skip button', () => {
		render(
			<SnakeGame
				onWin={noop}
				onSkip={noop}
			/>,
		);
		expect(screen.getByRole('button', { name: 'Skip game' })).toBeInTheDocument();
	});

	it('renders keyboard hint comments', () => {
		render(
			<SnakeGame
				onWin={noop}
				onSkip={noop}
			/>,
		);
		expect(screen.getByText('// use keyboard')).toBeInTheDocument();
		expect(screen.getByText('// arrows to play')).toBeInTheDocument();
		expect(screen.getByText('// food left')).toBeInTheDocument();
	});

	it('renders all four arrow key indicators', () => {
		render(
			<SnakeGame
				onWin={noop}
				onSkip={noop}
			/>,
		);
		expect(screen.getByLabelText('Up')).toBeInTheDocument();
		expect(screen.getByLabelText('Down')).toBeInTheDocument();
		expect(screen.getByLabelText('Left')).toBeInTheDocument();
		expect(screen.getByLabelText('Right')).toBeInTheDocument();
	});

	it('hides start button while playing', () => {
		render(
			<SnakeGame
				onWin={noop}
				onSkip={noop}
			/>,
		);
		const startBtn = screen.getByRole('button', { name: 'Start game' });
		fireEvent.click(startBtn);
		expect(screen.queryByRole('button', { name: 'Start game' })).not.toBeInTheDocument();
	});

	it('calls onSkip when skip button is clicked', () => {
		const onSkip = jest.fn();
		render(
			<SnakeGame
				onWin={noop}
				onSkip={onSkip}
			/>,
		);
		fireEvent.click(screen.getByRole('button', { name: 'Skip game' }));
		expect(onSkip).toHaveBeenCalledTimes(1);
	});

	it('shows game-over overlay on wall collision', () => {
		render(
			<SnakeGame
				onWin={noop}
				onSkip={noop}
			/>,
		);
		act(() => fireEvent.click(screen.getByRole('button', { name: 'Start game' })));
		advanceGame(150 * 20);

		expect(screen.getByText('GAME OVER!')).toBeInTheDocument();
	});

	it('shows start-again button after game over', () => {
		render(
			<SnakeGame
				onWin={noop}
				onSkip={noop}
			/>,
		);
		act(() => fireEvent.click(screen.getByRole('button', { name: 'Start game' })));
		advanceGame(150 * 20);

		expect(screen.getByRole('button', { name: 'Start again' })).toBeInTheDocument();
	});

	it('resets to idle state when start-again is clicked', () => {
		render(
			<SnakeGame
				onWin={noop}
				onSkip={noop}
			/>,
		);
		act(() => fireEvent.click(screen.getByRole('button', { name: 'Start game' })));
		advanceGame(150 * 20);

		act(() => fireEvent.click(screen.getByRole('button', { name: 'Start again' })));
		expect(screen.queryByText('GAME OVER!')).not.toBeInTheDocument();
		expect(screen.getByRole('button', { name: 'Start game' })).not.toBeDisabled();
	});

	it('draws food and snake on the canvas when game starts', () => {
		render(
			<SnakeGame
				onWin={noop}
				onSkip={noop}
			/>,
		);
		act(() => fireEvent.click(screen.getByRole('button', { name: 'Start game' })));
		advanceGame(200);

		expect(mockCtx.clearRect).toHaveBeenCalled();
		expect(mockCtx.arc).toHaveBeenCalled();
		expect(mockCtx.fill).toHaveBeenCalled();
		expect(mockCtx.createLinearGradient).toHaveBeenCalled();
		expect(mockGradient.addColorStop).toHaveBeenCalled();
		expect(mockCtx.stroke).toHaveBeenCalled();
	});
});
