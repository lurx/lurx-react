import { fireEvent, render, screen, act } from '@testing-library/react';
import { HeroSection } from '../hero-section.component';

let mockIsMobile = false;

jest.mock('@/hooks', () => ({
	useResponsive: () => ({ isMobile: mockIsMobile, isTablet: false, isDesktop: !mockIsMobile }),
}));

jest.mock('@/lib/shiki', () => ({
	useShikiTokens: ({ code }: { code: string }) =>
		code.split('\n').map((line: string) => ({
			tokens: [{ content: line, color: '#d6deeb' }],
		})),
}));

// Stub the hero entry animation so GSAP typewrite doesn't clear text in JSDOM
jest.mock('../hooks/use-hero-entry-animation.hook', () => ({
	useHeroEntryAnimation: () => true,
}));

// Stub RgeSnakeGame to control win callback via HeroGame
jest.mock('@/games/rge-snake-game', () => ({
	RgeSnakeGame: ({
		onWin,
	}: {
		onWin: () => void;
	}) => (
		<div data-testid="snake-game">
			<button onClick={onWin}>win</button>
		</div>
	),
}));

const WIN_CLOSE_DELAY_MS = 1000;

beforeEach(() => {
	jest.useFakeTimers();
	mockIsMobile = false;
	let portalRoot = document.getElementById('portal-root');
	if (!portalRoot) {
		portalRoot = document.createElement('div');
		portalRoot.id = 'portal-root';
		document.body.appendChild(portalRoot);
	}
});

afterEach(() => {
	jest.useRealTimers();
	const portalRoot = document.getElementById('portal-root');
	if (portalRoot) portalRoot.innerHTML = '';
});

describe('HeroSection', () => {
	it('renders the greeting', () => {
		render(<HeroSection />);
		expect(screen.getByText('Hi, I\'m')).toBeInTheDocument();
	});

	it('renders the name', () => {
		render(<HeroSection />);
		expect(screen.getByText('Rotem Horovitz')).toBeInTheDocument();
	});

	it('renders the role with arrow prefix', () => {
		render(<HeroSection />);
		expect(screen.getByText(/front-end-developer/)).toBeInTheDocument();
	});

	it('renders the github comment', () => {
		render(<HeroSection />);
		expect(
			screen.getByText('// find my profile on Github:'),
		).toBeInTheDocument();
	});

	it('renders the GitHub link immediately', () => {
		render(<HeroSection />);
		expect(
			screen.getByRole('link', { name: 'GitHub profile' }),
		).toHaveAttribute('href', 'https://github.com/lurx');
	});

	it('renders the snippets carousel by default', async () => {
		await act(async () => {
			render(<HeroSection />);
		});
		expect(screen.getByTestId('hero-snippets')).toBeInTheDocument();
		expect(screen.queryByTestId('snake-game')).not.toBeInTheDocument();
	});

	it('renders the play-snake trigger', async () => {
		await act(async () => {
			render(<HeroSection />);
		});
		expect(screen.getByRole('button', { name: /play the snake game/i })).toBeInTheDocument();
	});

	it('opens the game dialog when the trigger is clicked', async () => {
		await act(async () => {
			render(<HeroSection />);
		});
		await act(async () => {
			fireEvent.click(screen.getByRole('button', { name: /play the snake game/i }));
		});
		expect(screen.getByTestId('snake-game')).toBeInTheDocument();
	});

	it('closes the game dialog after the player wins', async () => {
		await act(async () => {
			render(<HeroSection />);
		});
		await act(async () => {
			fireEvent.click(screen.getByRole('button', { name: /play the snake game/i }));
		});
		fireEvent.click(screen.getByText('win'));
		act(() => {
			jest.advanceTimersByTime(WIN_CLOSE_DELAY_MS);
		});
		expect(screen.queryByTestId('snake-game')).not.toBeInTheDocument();
	});

	describe('on mobile', () => {
		beforeEach(() => {
			mockIsMobile = true;
		});

		it('still renders the snippets carousel', async () => {
			await act(async () => {
				render(<HeroSection />);
			});
			expect(screen.getByTestId('hero-snippets')).toBeInTheDocument();
		});

		it('uses the horizontal axis on the carousel', async () => {
			await act(async () => {
				render(<HeroSection />);
			});
			expect(screen.getByTestId('hero-snippets')).toHaveAttribute('data-axis', 'x');
		});

		it('does not render the play-snake trigger', async () => {
			await act(async () => {
				render(<HeroSection />);
			});
			expect(screen.queryByRole('button', { name: /play the snake game/i })).not.toBeInTheDocument();
		});
	});
});
