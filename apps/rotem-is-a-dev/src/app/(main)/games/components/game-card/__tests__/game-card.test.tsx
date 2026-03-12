import { fireEvent, render, screen } from '@testing-library/react';
import { GameCard } from '../game-card.component';
import type { Game } from '../../../data/games.types';

const mockGame: Game = {
	id: 1,
	number: 1,
	slug: '_snake',
	description: 'Classic snake game.',
	preview: () => <div data-testid="preview">Preview</div>,
	game: () => <div data-testid="game">Game</div>,
};

describe('GameCard', () => {
	it('renders the game title with number and slug', () => {
		render(<GameCard game={mockGame} onPlay={jest.fn()} />);
		expect(screen.getByText('Game 1')).toBeInTheDocument();
		expect(screen.getByText('_snake')).toBeInTheDocument();
	});

	it('renders the game description', () => {
		render(<GameCard game={mockGame} onPlay={jest.fn()} />);
		expect(screen.getByText('Classic snake game.')).toBeInTheDocument();
	});

	it('renders the preview component', () => {
		render(<GameCard game={mockGame} onPlay={jest.fn()} />);
		expect(screen.getByTestId('preview')).toBeInTheDocument();
	});

	it('renders the play-game button', () => {
		render(<GameCard game={mockGame} onPlay={jest.fn()} />);
		expect(screen.getByRole('button', { name: 'play-game' })).toBeInTheDocument();
	});

	it('calls onPlay with the game when play button is clicked', () => {
		const onPlay = jest.fn();
		render(<GameCard game={mockGame} onPlay={onPlay} />);

		fireEvent.click(screen.getByRole('button', { name: 'play-game' }));

		expect(onPlay).toHaveBeenCalledWith(mockGame);
	});

	it('renders the article with proper aria-label', () => {
		render(<GameCard game={mockGame} onPlay={jest.fn()} />);
		expect(screen.getByRole('article', { name: 'Game: _snake' })).toBeInTheDocument();
	});
});
