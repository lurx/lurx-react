import { render, screen, act } from '@testing-library/react';

const mockHandleComplete = jest.fn();
let mockGameCompleted = false;

jest.mock('../hero.context', () => ({
	useHeroContext: () => ({
		gameCompleted: mockGameCompleted,
		handleComplete: mockHandleComplete,
	}),
}));

let capturedOnScoreChange: ((score: number) => void) | undefined;

jest.mock('@/games/rge-snake-game', () => ({
	RgeSnakeGame: ({
		onWin,
		onScoreChange,
	}: {
		onWin: () => void;
		onScoreChange?: (score: number) => void;
	}) => {
		capturedOnScoreChange = onScoreChange;
		return (
			<div data-testid="snake-game">
				<button onClick={onWin}>win</button>
			</div>
		);
	},
}));

import { HeroGame } from '../hero-game.component';

beforeEach(() => {
	mockGameCompleted = false;
	mockHandleComplete.mockClear();
	capturedOnScoreChange = undefined;
});

describe('HeroGame', () => {
	it('renders the widget shell with snake game when game is not completed', async () => {
		await act(async () => {
			render(<HeroGame />);
		});
		expect(screen.getByTestId('snake-game')).toBeInTheDocument();
		expect(screen.getByText('// use keyboard')).toBeInTheDocument();
		expect(screen.getByText('// arrows to play')).toBeInTheDocument();
		expect(screen.getByText('Skip')).toBeInTheDocument();
	});

	it('returns null when game is completed', () => {
		mockGameCompleted = true;
		const { container } = render(<HeroGame />);
		expect(container).toBeEmptyDOMElement();
	});

	it('passes handleComplete as onWin to RgeSnakeGame', async () => {
		await act(async () => {
			render(<HeroGame />);
		});
		screen.getByText('win').click();
		expect(mockHandleComplete).toHaveBeenCalledTimes(1);
	});

	it('calls handleComplete when skip button is clicked', async () => {
		await act(async () => {
			render(<HeroGame />);
		});
		screen.getByText('Skip').click();
		expect(mockHandleComplete).toHaveBeenCalledTimes(1);
	});

	it('does not render widget after game is completed', () => {
		mockGameCompleted = true;
		render(<HeroGame />);
		expect(screen.queryByTestId('snake-game')).not.toBeInTheDocument();
	});

	it('renders decorative arrow keys', async () => {
		await act(async () => {
			render(<HeroGame />);
		});
		expect(screen.getByLabelText('up')).toBeInTheDocument();
		expect(screen.getByLabelText('down')).toBeInTheDocument();
		expect(screen.getByLabelText('left')).toBeInTheDocument();
		expect(screen.getByLabelText('right')).toBeInTheDocument();
	});

	it('renders food dots with correct remaining count', async () => {
		await act(async () => {
			render(<HeroGame />);
		});
		expect(screen.getByText('// food left')).toBeInTheDocument();
		expect(screen.getByLabelText('10 food items remaining')).toBeInTheDocument();
	});

	it('updates food dots when score changes', async () => {
		await act(async () => {
			render(<HeroGame />);
		});

		act(() => {
			capturedOnScoreChange?.(3);
		});

		expect(screen.getByLabelText('7 food items remaining')).toBeInTheDocument();
	});
});
