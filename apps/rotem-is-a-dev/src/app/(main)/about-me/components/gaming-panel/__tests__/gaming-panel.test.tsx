import { render, screen } from '@testing-library/react';
import { useResponsive } from '@/hooks';
import { GamingPanel } from '../gaming-panel.component';

jest.mock('@/hooks', () => ({
	useResponsive: jest.fn(),
}));

jest.mock('@/app/(main)/components/snake-game', () => ({
	SnakeGame: ({ onWin, onSkip }: { onWin: () => void; onSkip: () => void }) => (
		<div data-testid="snake-game" data-on-win={!!onWin} data-on-skip={!!onSkip}>
			Snake Game
		</div>
	),
}));

const mockUseResponsive = useResponsive as jest.Mock;

beforeEach(() => {
	mockUseResponsive.mockReturnValue({ isMobile: false, isTablet: false, isDesktop: true });
});

describe('GamingPanel', () => {
	it('renders the SnakeGame component', () => {
		render(<GamingPanel />);
		expect(screen.getByTestId('snake-game')).toBeInTheDocument();
	});

	it('passes noop callbacks to SnakeGame', () => {
		render(<GamingPanel />);
		const snakeGame = screen.getByTestId('snake-game');
		expect(snakeGame).toHaveAttribute('data-on-win', 'true');
		expect(snakeGame).toHaveAttribute('data-on-skip', 'true');
	});

	it('renders nothing on mobile', () => {
		mockUseResponsive.mockReturnValue({ isMobile: true, isTablet: false, isDesktop: false });
		const { container } = render(<GamingPanel />);
		expect(container.innerHTML).toBe('');
	});
});
