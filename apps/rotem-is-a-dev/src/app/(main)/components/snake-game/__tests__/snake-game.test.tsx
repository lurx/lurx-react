import { act, fireEvent, render, screen } from '@testing-library/react';
import { SnakeGame } from '../snake-game.component';

const noop = jest.fn();

beforeEach(() => {
	jest.useFakeTimers();
	noop.mockClear();
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
		// Let the snake travel right into the wall (no key press needed)
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
});
