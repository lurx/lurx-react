import { render, screen } from '@testing-library/react';
import { GamesGrid } from '../games-grid.component';
import type { Game } from '../../../data/games.types';

const mockGames: Game[] = [
	{
		id: 1,
		number: 1,
		slug: '_snake',
		description: 'Snake game.',
		preview: () => <div>Snake preview</div>,
		game: () => <div>Snake game</div>,
	},
	{
		id: 2,
		number: 2,
		slug: '_brickfall',
		description: 'Brickfall game.',
		preview: () => <div>Brickfall preview</div>,
		game: () => <div>Brickfall game</div>,
	},
];

describe('GamesGrid', () => {
	it('renders a card for each game', () => {
		render(<GamesGrid games={mockGames} onPlayAction={jest.fn()} />);
		expect(screen.getByText('_snake')).toBeInTheDocument();
		expect(screen.getByText('_brickfall')).toBeInTheDocument();
	});

	it('renders correct number of game cards', () => {
		render(<GamesGrid games={mockGames} onPlayAction={jest.fn()} />);
		const articles = screen.getAllByRole('article');
		expect(articles).toHaveLength(2);
	});

	it('renders game descriptions', () => {
		render(<GamesGrid games={mockGames} onPlayAction={jest.fn()} />);
		expect(screen.getByText('Snake game.')).toBeInTheDocument();
		expect(screen.getByText('Brickfall game.')).toBeInTheDocument();
	});
});
