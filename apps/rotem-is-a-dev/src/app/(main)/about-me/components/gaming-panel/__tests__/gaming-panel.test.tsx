import { render, screen, act } from '@testing-library/react';
import { useResponsive } from '@/hooks';
import { GamingPanel } from '../gaming-panel.component';

jest.mock('@/hooks', () => ({
	useResponsive: jest.fn(),
}));

jest.mock('@/games/rge-snake-game', () => ({
	RgeSnakeGame: () => <div data-testid="rge-snake-game">RGE Snake Game</div>,
}));

jest.mock('@/games/rge-brickfall-game', () => ({
	RgeBrickfallGame: () => <div data-testid="rge-brickfall-game">RGE Brickfall Game</div>,
}));

const mockUseResponsive = useResponsive as jest.Mock;

beforeEach(() => {
	mockUseResponsive.mockReturnValue({ isMobile: false, isTablet: false, isDesktop: true });
});

describe('GamingPanel', () => {
	it('renders the RgeSnakeGame component by default', async () => {
		await act(async () => {
			render(<GamingPanel activeFileId="snake-game" />);
		});
		expect(screen.getByTestId('rge-snake-game')).toBeInTheDocument();
	});

	it('renders the RgeBrickfallGame when activeFileId is brickfall-game', async () => {
		await act(async () => {
			render(<GamingPanel activeFileId="brickfall-game" />);
		});
		expect(screen.getByTestId('rge-brickfall-game')).toBeInTheDocument();
	});

	it('defaults to snake game when activeFileId is null', async () => {
		await act(async () => {
			render(<GamingPanel activeFileId={null} />);
		});
		expect(screen.getByTestId('rge-snake-game')).toBeInTheDocument();
	});

	it('renders nothing on mobile', () => {
		mockUseResponsive.mockReturnValue({ isMobile: true, isTablet: false, isDesktop: false });
		const { container } = render(<GamingPanel activeFileId="snake-game" />);
		expect(container.innerHTML).toBe('');
	});
});
