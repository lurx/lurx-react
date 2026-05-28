import { render, screen, act } from '@testing-library/react';

const mockCloseGame = jest.fn();
const mockOpenGame = jest.fn();
let mockActiveDirection: string | null = null;

jest.mock('@/app/components/fa-icon', () => ({
	FaIcon: ({ iconName }: { iconName: string }) => (
		<span data-testid="fa-icon" data-icon={iconName} />
	),
}));

jest.mock('../hero.context', () => ({
	useHeroContext: () => ({
		isGameOpen: true,
		openGame: mockOpenGame,
		closeGame: mockCloseGame,
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

const WIN_CLOSE_DELAY_MS = 1000;

beforeEach(() => {
	jest.useFakeTimers();
	mockActiveDirection = null;
	mockCloseGame.mockClear();
	mockOpenGame.mockClear();
	capturedOnScoreChange = undefined;
});

afterEach(() => {
	jest.useRealTimers();
});

describe('HeroGame', () => {
	it('renders the widget shell with snake game', async () => {
		await act(async () => {
			render(<HeroGame />);
		});
		expect(screen.getByTestId('snake-game')).toBeInTheDocument();
		expect(screen.getByText('// use keyboard')).toBeInTheDocument();
		expect(screen.getByText('// arrows to play')).toBeInTheDocument();
	});

	it('closes the game after the player wins (with delay)', async () => {
		await act(async () => {
			render(<HeroGame />);
		});
		screen.getByText('win').click();
		expect(mockCloseGame).not.toHaveBeenCalled();
		act(() => {
			jest.advanceTimersByTime(WIN_CLOSE_DELAY_MS);
		});
		expect(mockCloseGame).toHaveBeenCalledTimes(1);
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
