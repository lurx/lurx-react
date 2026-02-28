import { render, screen } from '@testing-library/react';

const mockHandleComplete = jest.fn();
let mockGameCompleted = false;

jest.mock('../hero.context', () => ({
	useHeroContext: () => ({
		gameCompleted: mockGameCompleted,
		handleComplete: mockHandleComplete,
	}),
}));

jest.mock('../../snake-game/snake-game.component', () => ({
	SnakeGame: ({
		onWin,
		onSkip,
	}: {
		onWin: () => void;
		onSkip: () => void;
	}) => (
		<div data-testid="snake-game">
			<button onClick={onWin}>win</button>
			<button onClick={onSkip}>skip</button>
		</div>
	),
}));

import { HeroGame } from '../hero-game.component';

beforeEach(() => {
	mockGameCompleted = false;
	mockHandleComplete.mockClear();
});

describe('HeroGame', () => {
	it('renders the SnakeGame when game is not completed', () => {
		render(<HeroGame />);
		expect(screen.getByTestId('snake-game')).toBeInTheDocument();
	});

	it('returns null when game is completed', () => {
		mockGameCompleted = true;
		const { container } = render(<HeroGame />);
		expect(container).toBeEmptyDOMElement();
	});

	it('passes handleComplete as onWin to SnakeGame', () => {
		render(<HeroGame />);
		screen.getByText('win').click();
		expect(mockHandleComplete).toHaveBeenCalledTimes(1);
	});

	it('passes handleComplete as onSkip to SnakeGame', () => {
		render(<HeroGame />);
		screen.getByText('skip').click();
		expect(mockHandleComplete).toHaveBeenCalledTimes(1);
	});

	it('does not render SnakeGame after game is completed', () => {
		mockGameCompleted = true;
		render(<HeroGame />);
		expect(screen.queryByTestId('snake-game')).not.toBeInTheDocument();
	});
});
