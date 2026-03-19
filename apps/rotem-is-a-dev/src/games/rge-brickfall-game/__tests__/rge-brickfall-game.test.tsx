import { render, screen, fireEvent } from '@testing-library/react';
import { RgeBrickfallGame } from '../rge-brickfall-game.component';

jest.mock('react-game-engine', () => ({
	GameEngine: jest.fn(({ children, className, running, onEvent, style }) => (
		<button
			data-testid="game-engine"
			data-running={String(running)}
			className={className}
			style={style}
			type="button"
			onClick={() => onEvent?.({ type: 'score-updated' })}
			onDoubleClick={() => onEvent?.({ type: 'game-over' })}
		>
			{children}
		</button>
	)),
}));

jest.mock('../rge-brickfall-game.module.scss', () => ({
	wrapper: 'wrapper',
	board: 'board',
	engineContainer: 'engineContainer',
	overlay: 'overlay',
	overlayTitle: 'overlayTitle',
	overlayScore: 'overlayScore',
	overlayButton: 'overlayButton',
	controls: 'controls',
	stats: 'stats',
	score: 'score',
	statLine: 'statLine',
	arrowGrid: 'arrowGrid',
	arrowButton: 'arrowButton',
	arrowButtonActive: 'arrowButtonActive',
	schemeToggle: 'schemeToggle',
}));

describe('RgeBrickfallGame', () => {
	it('renders the game board', () => {
		render(<RgeBrickfallGame />);
		expect(screen.getByTestId('game-engine')).toBeInTheDocument();
	});

	it('renders the idle overlay on mount', () => {
		render(<RgeBrickfallGame />);
		expect(screen.getByTestId('overlay-idle')).toBeInTheDocument();
	});

	it('renders game controls', () => {
		render(<RgeBrickfallGame />);
		expect(screen.getByTestId('game-controls')).toBeInTheDocument();
	});

	it('shows initial score of 0', () => {
		render(<RgeBrickfallGame />);
		expect(screen.getByTestId('score')).toHaveTextContent('SCORE: 0');
	});

	it('shows initial level of 1', () => {
		render(<RgeBrickfallGame />);
		expect(screen.getByTestId('level')).toHaveTextContent('LEVEL: 1');
	});

	it('starts the game when START GAME is clicked', () => {
		render(<RgeBrickfallGame />);
		fireEvent.click(screen.getByText('START GAME'));
		const engine = screen.getByTestId('game-engine');
		expect(engine).toHaveAttribute('data-running', 'true');
	});

	it('removes idle overlay when game starts', () => {
		render(<RgeBrickfallGame />);
		fireEvent.click(screen.getByText('START GAME'));
		expect(screen.queryByTestId('overlay-idle')).not.toBeInTheDocument();
	});

	it('shows game-over overlay on game-over event', () => {
		render(<RgeBrickfallGame />);
		fireEvent.click(screen.getByText('START GAME'));
		fireEvent.doubleClick(screen.getByTestId('game-engine'));
		expect(screen.getByTestId('overlay-lost')).toBeInTheDocument();
	});

	it('stops the engine when game is over', () => {
		render(<RgeBrickfallGame />);
		fireEvent.click(screen.getByText('START GAME'));
		fireEvent.doubleClick(screen.getByTestId('game-engine'));
		const engine = screen.getByTestId('game-engine');
		expect(engine).toHaveAttribute('data-running', 'false');
	});

	it('restarts the game from game-over state', () => {
		render(<RgeBrickfallGame />);
		fireEvent.click(screen.getByText('START GAME'));
		fireEvent.doubleClick(screen.getByTestId('game-engine'));
		fireEvent.click(screen.getByText('TRY AGAIN'));
		const engine = screen.getByTestId('game-engine');
		expect(engine).toHaveAttribute('data-running', 'true');
		expect(screen.queryByTestId('overlay-lost')).not.toBeInTheDocument();
	});

	it('renders all five action control buttons', () => {
		render(<RgeBrickfallGame />);
		expect(screen.getByTestId('action-rotate')).toBeInTheDocument();
		expect(screen.getByTestId('action-left')).toBeInTheDocument();
		expect(screen.getByTestId('action-right')).toBeInTheDocument();
		expect(screen.getByTestId('action-soft-drop')).toBeInTheDocument();
		expect(screen.getByTestId('action-hard-drop')).toBeInTheDocument();
	});

	it('engine is not running in idle state', () => {
		render(<RgeBrickfallGame />);
		const engine = screen.getByTestId('game-engine');
		expect(engine).toHaveAttribute('data-running', 'false');
	});

	it('renders next piece preview', () => {
		render(<RgeBrickfallGame />);
		expect(screen.getByTestId('next-piece-preview')).toBeInTheDocument();
	});
});
