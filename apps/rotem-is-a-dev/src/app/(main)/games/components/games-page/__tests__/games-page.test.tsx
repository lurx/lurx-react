import { fireEvent, render, screen } from '@testing-library/react';
import { GamesPage } from '../games-page.component';

const mockSearchParams = new URLSearchParams();

jest.mock('next/navigation', () => ({
	useSearchParams: () => mockSearchParams,
}));

jest.mock('../../../data/games.data', () => ({
	GAMES: [
		{
			id: 1,
			number: 1,
			slug: '_snake',
			description: 'Snake game.',
			preview: () => <div>Snake preview</div>,
			game: () => <div data-testid="snake-game">Snake Game</div>,
		},
		{
			id: 2,
			number: 2,
			slug: '_brickfall',
			description: 'Brickfall game.',
			preview: () => <div>Brickfall preview</div>,
			game: () => <div data-testid="brickfall-game">Brickfall Game</div>,
		},
	],
}));

let portalRoot: HTMLDivElement;

beforeEach(() => {
	portalRoot = document.createElement('div');
	portalRoot.id = 'portal-root';
	document.body.appendChild(portalRoot);
	mockSearchParams.delete('play-game');
});

afterEach(() => {
	portalRoot.remove();
});

describe('GamesPage', () => {
	it('renders both game cards', () => {
		render(<GamesPage />);
		expect(screen.getByText('_snake')).toBeInTheDocument();
		expect(screen.getByText('_brickfall')).toBeInTheDocument();
	});

	it('opens the game dialog when play button is clicked', () => {
		render(<GamesPage />);

		const playButtons = screen.getAllByRole('button', { name: 'play-game' });
		fireEvent.click(playButtons[0]);

		expect(screen.getByTestId('snake-game')).toBeInTheDocument();
	});

	it('closes the dialog when close button is clicked', () => {
		render(<GamesPage />);

		const playButtons = screen.getAllByRole('button', { name: 'play-game' });
		fireEvent.click(playButtons[0]);
		expect(screen.getByTestId('snake-game')).toBeInTheDocument();

		fireEvent.click(screen.getByLabelText('Close dialog'));
		expect(screen.queryByTestId('snake-game')).not.toBeInTheDocument();
	});

	it('does not show dialog initially', () => {
		render(<GamesPage />);
		expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
	});

	it('opens the snake game via ?play-game=snake query param', () => {
		mockSearchParams.set('play-game', 'snake');
		render(<GamesPage />);
		expect(screen.getByTestId('snake-game')).toBeInTheDocument();
	});

	it('opens the brickfall game via ?play-game=brickfall query param', () => {
		mockSearchParams.set('play-game', 'brickfall');
		render(<GamesPage />);
		expect(screen.getByTestId('brickfall-game')).toBeInTheDocument();
	});

	it('ignores an unknown ?play-game value', () => {
		mockSearchParams.set('play-game', 'unknown');
		render(<GamesPage />);
		expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
	});
});
