import { fireEvent, render, screen } from '@testing-library/react';

const mockOpenGame = jest.fn();

jest.mock('../../../hero.context', () => ({
	useHeroContext: () => ({
		isGameOpen: false,
		openGame: mockOpenGame,
		closeGame: jest.fn(),
	}),
}));

import { HeroGameTrigger } from '../hero-game-trigger.component';

describe('HeroGameTrigger', () => {
	beforeEach(() => mockOpenGame.mockClear());

	it('renders the terminal-styled label', () => {
		render(<HeroGameTrigger />);
		expect(screen.getByText('> ./play snake.exe')).toBeInTheDocument();
	});

	it('calls openGame when clicked', () => {
		render(<HeroGameTrigger />);
		fireEvent.click(screen.getByRole('button', { name: /play the snake game/i }));
		expect(mockOpenGame).toHaveBeenCalledTimes(1);
	});
});
