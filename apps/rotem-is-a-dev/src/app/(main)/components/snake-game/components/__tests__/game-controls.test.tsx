import { fireEvent, render, screen } from '@testing-library/react';
import { GameControls } from '../game-controls.component';

jest.mock('../../hooks/use-snake-game.hook', () => ({
	useSnakeGame: () => ({
		activeKey: null,
		snake: [],
		food: [],
		direction: 'UP',
		gameState: 'idle',
		startGame: jest.fn(),
		resetGame: jest.fn(),
	}),
}));

describe('GameControls', () => {
	const defaultProps = {
		totalFood: 10,
		displayedRemaining: 10,
		onSkip: jest.fn(),
	};

	beforeEach(() => {
		defaultProps.onSkip.mockClear();
	});

	it('renders the skip button', () => {
		render(<GameControls {...defaultProps} />);
		expect(
			screen.getByRole('button', { name: 'Skip game' }),
		).toBeInTheDocument();
	});

	it('calls onSkip when the skip button is clicked', () => {
		render(<GameControls {...defaultProps} />);
		fireEvent.click(screen.getByRole('button', { name: 'Skip game' }));
		expect(defaultProps.onSkip).toHaveBeenCalledTimes(1);
	});

	it('renders the food left comment', () => {
		render(<GameControls {...defaultProps} />);
		expect(screen.getByText('// food left')).toBeInTheDocument();
	});

	it('renders the correct number of food dot SVGs', () => {
		render(<GameControls {...defaultProps} />);
		expect(
			screen.getByLabelText('10 food items remaining'),
		).toBeInTheDocument();
	});

	it('shows remaining food count in aria-label', () => {
		render(
			<GameControls
				{...defaultProps}
				totalFood={10}
				displayedRemaining={7}
			/>,
		);
		expect(
			screen.getByLabelText('7 food items remaining'),
		).toBeInTheDocument();
	});

	it('renders keyboard instruction comments', () => {
		render(<GameControls {...defaultProps} />);
		expect(screen.getByText('// use keyboard')).toBeInTheDocument();
		expect(screen.getByText('// arrows to play')).toBeInTheDocument();
	});

	it('renders all four arrow key indicators', () => {
		render(<GameControls {...defaultProps} />);
		expect(screen.getByLabelText('Up')).toBeInTheDocument();
		expect(screen.getByLabelText('Down')).toBeInTheDocument();
		expect(screen.getByLabelText('Left')).toBeInTheDocument();
		expect(screen.getByLabelText('Right')).toBeInTheDocument();
	});
});
