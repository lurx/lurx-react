import { render, screen, fireEvent } from '@testing-library/react';
import { GameOverlay } from '../components/game-overlay';

jest.mock('../rge-pacman-game.module.scss', () => ({
	overlay: 'overlay',
	overlayTitle: 'overlayTitle',
	overlayScore: 'overlayScore',
	overlayButton: 'overlayButton',
}));

describe('GameOverlay', () => {
	const defaultProps = {
		phase: 'idle' as const,
		score: 0,
		lives: 3,
		onStartAction: jest.fn(),
		onRestartAction: jest.fn(),
	};

	describe('idle phase', () => {
		it('renders the idle overlay', () => {
			render(<GameOverlay {...defaultProps} />);
			expect(screen.getByTestId('overlay-idle')).toBeInTheDocument();
		});

		it('shows "PAC-MAN" title', () => {
			render(<GameOverlay {...defaultProps} />);
			expect(screen.getByText('PAC-MAN')).toBeInTheDocument();
		});

		it('shows "START GAME" button', () => {
			render(<GameOverlay {...defaultProps} />);
			expect(screen.getByText('START GAME')).toBeInTheDocument();
		});

		it('calls onStart when START GAME is clicked', () => {
			const onStart = jest.fn();
			render(<GameOverlay {...defaultProps} onStartAction={onStart} />);
			fireEvent.click(screen.getByText('START GAME'));
			expect(onStart).toHaveBeenCalledTimes(1);
		});
	});

	describe('playing phase', () => {
		it('returns null when playing', () => {
			const { container } = render(
				<GameOverlay {...defaultProps} phase="playing" />
			);
			expect(container.innerHTML).toBe('');
		});
	});

	describe('won phase', () => {
		it('renders the won overlay', () => {
			render(<GameOverlay {...defaultProps} phase="won" score={2500} />);
			expect(screen.getByTestId('overlay-won')).toBeInTheDocument();
		});

		it('shows "YOU WIN" title', () => {
			render(<GameOverlay {...defaultProps} phase="won" score={2500} />);
			expect(screen.getByText('YOU WIN')).toBeInTheDocument();
		});

		it('shows the score', () => {
			render(<GameOverlay {...defaultProps} phase="won" score={2500} />);
			expect(screen.getByText('SCORE: 2500')).toBeInTheDocument();
		});

		it('shows "PLAY AGAIN" button', () => {
			render(<GameOverlay {...defaultProps} phase="won" />);
			expect(screen.getByText('PLAY AGAIN')).toBeInTheDocument();
		});

		it('calls onRestart when PLAY AGAIN is clicked', () => {
			const onRestart = jest.fn();
			render(
				<GameOverlay
					{...defaultProps}
					phase="won"
					onRestartAction={onRestart}
				/>
			);
			fireEvent.click(screen.getByText('PLAY AGAIN'));
			expect(onRestart).toHaveBeenCalledTimes(1);
		});
	});

	describe('lost phase', () => {
		it('renders the lost overlay', () => {
			render(
				<GameOverlay
					{...defaultProps}
					phase="lost"
					score={1200}
					lives={0}
				/>
			);
			expect(screen.getByTestId('overlay-lost')).toBeInTheDocument();
		});

		it('shows "GAME OVER" title', () => {
			render(
				<GameOverlay
					{...defaultProps}
					phase="lost"
					score={1200}
					lives={0}
				/>
			);
			expect(screen.getByText('GAME OVER')).toBeInTheDocument();
		});

		it('shows the score', () => {
			render(
				<GameOverlay
					{...defaultProps}
					phase="lost"
					score={1200}
					lives={0}
				/>
			);
			expect(screen.getByText('SCORE: 1200')).toBeInTheDocument();
		});

		it('shows the lives', () => {
			render(
				<GameOverlay
					{...defaultProps}
					phase="lost"
					score={1200}
					lives={0}
				/>
			);
			expect(screen.getByText('LIVES: 0')).toBeInTheDocument();
		});

		it('shows "TRY AGAIN" button', () => {
			render(<GameOverlay {...defaultProps} phase="lost" />);
			expect(screen.getByText('TRY AGAIN')).toBeInTheDocument();
		});

		it('calls onRestart when TRY AGAIN is clicked', () => {
			const onRestart = jest.fn();
			render(
				<GameOverlay
					{...defaultProps}
					phase="lost"
					onRestartAction={onRestart}
				/>
			);
			fireEvent.click(screen.getByText('TRY AGAIN'));
			expect(onRestart).toHaveBeenCalledTimes(1);
		});
	});
});
