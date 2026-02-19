import { fireEvent, render, screen } from '@testing-library/react';
import { HeroSection } from '../hero-section.component';

// Stub SnakeGame to control win/skip callbacks
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
		expect(
			screen.getByText(/Front-end developer/),
		).toBeInTheDocument();
	});

	it('renders the code comment lines', () => {
		render(<HeroSection />);
		expect(
			screen.getByText('// complete the game to continue'),
		).toBeInTheDocument();
		expect(
			screen.getByText('// find my profile on Github:'),
		).toBeInTheDocument();
	});

	it('hides the GitHub link initially', () => {
		render(<HeroSection />);
		const githubLink = screen.queryByRole('link', { name: 'GitHub profile' });
		expect(githubLink?.closest('.hidden') ?? githubLink?.parentElement).toBeTruthy();
	});

	it('reveals GitHub link when skip is triggered', () => {
		render(<HeroSection />);
		fireEvent.click(screen.getByText('skip'));
		const githubLink = screen.getByRole('link', { name: 'GitHub profile' });
		expect(githubLink).toHaveAttribute('href', 'https://github.com/lurx');
	});

	it('reveals GitHub link when win is triggered', () => {
		render(<HeroSection />);
		fireEvent.click(screen.getByText('win'));
		const githubLink = screen.getByRole('link', { name: 'GitHub profile' });
		expect(githubLink).toBeInTheDocument();
	});

	it('renders the snake game', () => {
		render(<HeroSection />);
		expect(screen.getByTestId('snake-game')).toBeInTheDocument();
	});
});
