import { render, screen, fireEvent } from '@testing-library/react';
import { GameOverlay } from '../components/game-overlay';

jest.mock('../rge-brickfall-game.module.scss', () => ({
	overlay: 'overlay',
	overlayTitle: 'overlayTitle',
	overlayScore: 'overlayScore',
	overlayButton: 'overlayButton',
}));

const defaultProps = {
	phase: 'idle' as const,
	score: 0,
	level: 1,
	linesCleared: 0,
	onStart: jest.fn(),
	onRestart: jest.fn(),
};

describe('GameOverlay', () => {
	it('renders idle overlay with BRICKFALL title', () => {
		render(<GameOverlay {...defaultProps} />);
		expect(screen.getByTestId('overlay-idle')).toBeInTheDocument();
		expect(screen.getByText('BRICKFALL')).toBeInTheDocument();
	});

	it('renders START GAME button in idle state', () => {
		render(<GameOverlay {...defaultProps} />);
		expect(screen.getByText('START GAME')).toBeInTheDocument();
	});

	it('calls onStart when START GAME is clicked', () => {
		const onStart = jest.fn();
		render(<GameOverlay {...defaultProps} onStart={onStart} />);
		fireEvent.click(screen.getByText('START GAME'));
		expect(onStart).toHaveBeenCalledTimes(1);
	});

	it('returns null during playing phase', () => {
		const { container } = render(<GameOverlay {...defaultProps} phase="playing" />);
		expect(container.innerHTML).toBe('');
	});

	it('renders lost overlay with GAME OVER title', () => {
		render(<GameOverlay {...defaultProps} phase="lost" score={1500} level={3} linesCleared={25} />);
		expect(screen.getByTestId('overlay-lost')).toBeInTheDocument();
		expect(screen.getByText('GAME OVER')).toBeInTheDocument();
	});

	it('displays score, level, and lines on lost overlay', () => {
		render(<GameOverlay {...defaultProps} phase="lost" score={1500} level={3} linesCleared={25} />);
		expect(screen.getByText('SCORE: 1500')).toBeInTheDocument();
		expect(screen.getByText('LEVEL: 3')).toBeInTheDocument();
		expect(screen.getByText('LINES: 25')).toBeInTheDocument();
	});

	it('renders TRY AGAIN button in lost state', () => {
		render(<GameOverlay {...defaultProps} phase="lost" />);
		expect(screen.getByText('TRY AGAIN')).toBeInTheDocument();
	});

	it('calls onRestart when TRY AGAIN is clicked', () => {
		const onRestart = jest.fn();
		render(<GameOverlay {...defaultProps} phase="lost" onRestart={onRestart} />);
		fireEvent.click(screen.getByText('TRY AGAIN'));
		expect(onRestart).toHaveBeenCalledTimes(1);
	});
});
