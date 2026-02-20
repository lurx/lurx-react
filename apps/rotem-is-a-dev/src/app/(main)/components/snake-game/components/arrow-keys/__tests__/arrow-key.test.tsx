import { render, screen } from '@testing-library/react';
import { ArrowKey } from '../arrow-key.component';

const mockUseSnakeGame = jest.fn();

jest.mock('../../../hooks/use-snake-game.hook', () => ({
	useSnakeGame: () => mockUseSnakeGame(),
}));

const defaultHookValue = {
	activeKey: null,
	snake: [],
	food: [],
	direction: 'UP' as const,
	gameState: 'idle' as const,
	startGame: jest.fn(),
	resetGame: jest.fn(),
};

beforeEach(() => {
	mockUseSnakeGame.mockReturnValue(defaultHookValue);
});

describe('ArrowKey', () => {
	it('renders the Up key with correct aria-label', () => {
		render(<ArrowKey direction="ArrowUp" />);
		expect(screen.getByLabelText('Up')).toBeInTheDocument();
	});

	it('renders the Down key with correct aria-label', () => {
		render(<ArrowKey direction="ArrowDown" />);
		expect(screen.getByLabelText('Down')).toBeInTheDocument();
	});

	it('renders the Left key with correct aria-label', () => {
		render(<ArrowKey direction="ArrowLeft" />);
		expect(screen.getByLabelText('Left')).toBeInTheDocument();
	});

	it('renders the Right key with correct aria-label', () => {
		render(<ArrowKey direction="ArrowRight" />);
		expect(screen.getByLabelText('Right')).toBeInTheDocument();
	});

	it('does not apply pressed style when key is not active', () => {
		mockUseSnakeGame.mockReturnValue({ ...defaultHookValue, activeKey: null });
		render(<ArrowKey direction="ArrowUp" />);
		expect(screen.getByLabelText('Up')).not.toHaveClass('pressed');
	});

	it('applies pressed style when the matching key is active', () => {
		mockUseSnakeGame.mockReturnValue({ ...defaultHookValue, activeKey: 'ArrowUp' });
		render(<ArrowKey direction="ArrowUp" />);
		expect(screen.getByLabelText('Up')).toHaveClass('pressed');
	});

	it('does not apply pressed style when a different key is active', () => {
		mockUseSnakeGame.mockReturnValue({ ...defaultHookValue, activeKey: 'ArrowDown' });
		render(<ArrowKey direction="ArrowUp" />);
		expect(screen.getByLabelText('Up')).not.toHaveClass('pressed');
	});
});
