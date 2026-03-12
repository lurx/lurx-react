import { render, screen, act } from '@testing-library/react';

const mockHandleComplete = jest.fn();
let mockGameCompleted = false;
let mockActiveDirection: string | null = null;

jest.mock('@/app/components/fa-icon', () => ({
	FaIcon: ({ iconName }: { iconName: string }) => (
		<span data-testid="fa-icon" data-icon={iconName} />
	),
}));

jest.mock('../hero.context', () => ({
	useHeroContext: () => ({
		gameCompleted: mockGameCompleted,
		handleComplete: mockHandleComplete,
	}),
}));

jest.mock('@/games/hooks/use-active-key', () => ({
	useActiveKey: () => mockActiveDirection,
}));

jest.mock('@/games/components/arrow-key-grid', () => ({
	ArrowKeyGrid: ({ items, activeValue }: { items: { value: string; testId?: string }[]; activeValue: string | null }) => (
		<div data-testid="arrow-key-grid" data-active-value={activeValue}>
			{items.map((item: { value: string; testId?: string }) => (
				<div key={item.value} data-testid={item.testId} data-value={item.value} />
			))}
		</div>
	),
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
	mockActiveDirection = null;
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

	it('renders decorative arrow keys via ArrowKeyGrid', async () => {
		await act(async () => {
			render(<HeroGame />);
		});
		expect(screen.getByTestId('arrow-key-grid')).toBeInTheDocument();
		expect(screen.getByTestId('arrow-key-up')).toBeInTheDocument();
		expect(screen.getByTestId('arrow-key-down')).toBeInTheDocument();
		expect(screen.getByTestId('arrow-key-left')).toBeInTheDocument();
		expect(screen.getByTestId('arrow-key-right')).toBeInTheDocument();
	});

	it('passes active direction from useActiveKey to ArrowKeyGrid', async () => {
		mockActiveDirection = 'UP';
		await act(async () => {
			render(<HeroGame />);
		});
		expect(screen.getByTestId('arrow-key-grid')).toHaveAttribute('data-active-value', 'UP');
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
