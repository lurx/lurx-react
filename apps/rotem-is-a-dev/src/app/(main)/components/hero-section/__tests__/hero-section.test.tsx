import { fireEvent, render, screen } from '@testing-library/react';
import { HeroSection } from '../hero-section.component';

jest.mock('@/lib/shiki', () => ({
	useShikiTokens: ({ code }: { code: string }) =>
		code.split('\n').map((line: string) => ({
			tokens: [{ content: line, color: '#d6deeb' }],
		})),
}));

// Stub entry animation context so component renders without provider
jest.mock('../../entry-animation/entry-animation.context', () => ({
	useEntryAnimation: () => ({
		isShellLoaded: true,
		setIsShellLoaded: jest.fn(),
		animationKey: 0,
		triggerReplay: jest.fn(),
	}),
}));

// Stub entry animation so GSAP typewrite doesn't clear text in JSDOM
jest.mock('../use-hero-entry-animation.hook', () => ({
	useHeroEntryAnimation: () => undefined,
}));

// Stub SnakeGame to control win/skip callbacks via HeroGame
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

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

describe('HeroSection', () => {
	it('renders the greeting', () => {
		render(<HeroSection />);
		expect(screen.getByText('Hi all. I am')).toBeInTheDocument();
	});

	it('renders the name', () => {
		render(<HeroSection />);
		expect(screen.getByText('Rotem Horovitz')).toBeInTheDocument();
	});

	it('renders the role with arrow prefix', () => {
		render(<HeroSection />);
		expect(screen.getByText(/front-end developer/)).toBeInTheDocument();
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

	it('renders the snake game initially', () => {
		render(<HeroSection />);
		expect(screen.getByTestId('snake-game')).toBeInTheDocument();
		expect(screen.queryByTestId('hero-snippets')).not.toBeInTheDocument();
	});

	it('hides the snake game and shows snippets when skip is triggered', () => {
		render(<HeroSection />);
		fireEvent.click(screen.getByText('skip'));
		expect(screen.queryByTestId('snake-game')).not.toBeInTheDocument();
		expect(screen.getByTestId('hero-snippets')).toBeInTheDocument();
	});

	it('hides the snake game and shows snippets when win is triggered', () => {
		render(<HeroSection />);
		fireEvent.click(screen.getByText('win'));
		expect(screen.queryByTestId('snake-game')).not.toBeInTheDocument();
		expect(screen.getByTestId('hero-snippets')).toBeInTheDocument();
	});
});
