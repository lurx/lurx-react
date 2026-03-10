import { render, screen, fireEvent } from '@testing-library/react';
import { GameOverlay } from '../components/game-overlay';

jest.mock('../../rge-snake-game.module.scss', () => ({
	overlay: 'overlay',
	overlayTitle: 'overlayTitle',
	overlayScore: 'overlayScore',
	overlayButton: 'overlayButton',
}));

describe('GameOverlay', () => {
	const defaultProps = {
		phase: 'idle' as const,
		score: 0,
		onStart: jest.fn(),
		onRestart: jest.fn(),
	};

	it('renders idle overlay with START GAME button', () => {
		render(<GameOverlay {...defaultProps} />);
		expect(screen.getByTestId('overlay-idle')).toBeInTheDocument();
		expect(screen.getByText('SNAKE')).toBeInTheDocument();
		expect(screen.getByText('START GAME')).toBeInTheDocument();
	});

	it('calls onStart when START GAME is clicked', () => {
		const onStart = jest.fn();
		render(<GameOverlay {...defaultProps} onStart={onStart} />);
		fireEvent.click(screen.getByText('START GAME'));
		expect(onStart).toHaveBeenCalledTimes(1);
	});

	it('renders nothing during playing phase', () => {
		const { container } = render(<GameOverlay {...defaultProps} phase="playing" />);
		expect(container.innerHTML).toBe('');
	});

	it('renders lost overlay with GAME OVER', () => {
		render(<GameOverlay {...defaultProps} phase="lost" score={7} />);
		expect(screen.getByTestId('overlay-lost')).toBeInTheDocument();
		expect(screen.getByText('GAME OVER')).toBeInTheDocument();
		expect(screen.getByText('SCORE: 7')).toBeInTheDocument();
		expect(screen.getByText('TRY AGAIN')).toBeInTheDocument();
	});

	it('calls onRestart when TRY AGAIN is clicked', () => {
		const onRestart = jest.fn();
		render(<GameOverlay {...defaultProps} phase="lost" onRestart={onRestart} />);
		fireEvent.click(screen.getByText('TRY AGAIN'));
		expect(onRestart).toHaveBeenCalledTimes(1);
	});

	it('renders won overlay with YOU WIN!', () => {
		render(<GameOverlay {...defaultProps} phase="won" score={19} />);
		expect(screen.getByTestId('overlay-won')).toBeInTheDocument();
		expect(screen.getByText('YOU WIN!')).toBeInTheDocument();
		expect(screen.getByText('SCORE: 19')).toBeInTheDocument();
		expect(screen.getByText('PLAY AGAIN')).toBeInTheDocument();
	});

	it('calls onRestart when PLAY AGAIN is clicked', () => {
		const onRestart = jest.fn();
		render(<GameOverlay {...defaultProps} phase="won" onRestart={onRestart} />);
		fireEvent.click(screen.getByText('PLAY AGAIN'));
		expect(onRestart).toHaveBeenCalledTimes(1);
	});
});
