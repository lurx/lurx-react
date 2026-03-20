import { fireEvent, render, screen } from '@testing-library/react';
import { GameDialog } from '../game-dialog.component';
import type { Game } from '../../../data/games.types';

let portalRoot: HTMLDivElement;

beforeEach(() => {
	portalRoot = document.createElement('div');
	portalRoot.id = 'portal-root';
	document.body.appendChild(portalRoot);
});

afterEach(() => {
	portalRoot.remove();
});

const mockGame: Game = {
	id: 1,
	number: 1,
	slug: '_snake',
	description: 'Classic snake game.',
	preview: () => <div>Preview</div>,
	game: () => <div data-testid="game-component">Snake Game</div>,
};

describe('GameDialog', () => {
	it('renders the game component when a game is selected', () => {
		render(<GameDialog game={mockGame} onCloseAction={jest.fn()} />);
		expect(screen.getByTestId('game-component')).toBeInTheDocument();
	});

	it('does not render when game is null', () => {
		render(<GameDialog game={null} onCloseAction={jest.fn()} />);
		expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
	});

	it('renders the dialog with correct aria-label', () => {
		render(<GameDialog game={mockGame} onCloseAction={jest.fn()} />);
		expect(screen.getByRole('dialog', { name: 'Play _snake' })).toBeInTheDocument();
	});

	it('calls onClose when the close button is clicked', () => {
		const onClose = jest.fn();
		render(<GameDialog game={mockGame} onCloseAction={onClose} />);

		fireEvent.click(screen.getByLabelText('Close dialog'));

		expect(onClose).toHaveBeenCalled();
	});

	it('calls onClose when overlay is clicked', () => {
		const onClose = jest.fn();
		render(<GameDialog game={mockGame} onCloseAction={onClose} />);

		fireEvent.click(screen.getByTestId('dialog-overlay'));

		expect(onClose).toHaveBeenCalled();
	});

	it('calls onClose when Escape key is pressed', () => {
		const onClose = jest.fn();
		render(<GameDialog game={mockGame} onCloseAction={onClose} />);

		fireEvent.keyDown(document, { key: 'Escape' });

		expect(onClose).toHaveBeenCalled();
	});
});
