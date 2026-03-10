import { render, screen, act } from '@testing-library/react';
import { useResponsive } from '@/hooks';
import { GamingPanel } from '../gaming-panel.component';

jest.mock('@/hooks', () => ({
	useResponsive: jest.fn(),
}));

jest.mock('../components/rge-snake-game', () => ({
	RgeSnakeGame: () => <div data-testid="rge-snake-game">RGE Snake Game</div>,
}));

const mockUseResponsive = useResponsive as jest.Mock;

beforeEach(() => {
	mockUseResponsive.mockReturnValue({ isMobile: false, isTablet: false, isDesktop: true });
});

describe('GamingPanel', () => {
	it('renders the RgeSnakeGame component', async () => {
		await act(async () => {
			render(<GamingPanel />);
		});
		expect(screen.getByTestId('rge-snake-game')).toBeInTheDocument();
	});

	it('renders nothing on mobile', () => {
		mockUseResponsive.mockReturnValue({ isMobile: true, isTablet: false, isDesktop: false });
		const { container } = render(<GamingPanel />);
		expect(container.innerHTML).toBe('');
	});
});
