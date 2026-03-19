import { render, screen, fireEvent } from '@testing-library/react';
import { RgeSnakeGame } from '../rge-snake-game.component';

jest.mock('react-game-engine', () => ({
	GameEngine: jest.fn(({ children, className, running, onEvent, style }) => (
		<button
			data-testid="game-engine"
			data-running={String(running)}
			className={className}
			style={style}
			type="button"
			onClick={() => onEvent?.({ type: 'food-eaten' })}
			onDoubleClick={() => onEvent?.({ type: 'game-over' })}
			onContextMenu={(event: React.MouseEvent) => {
				event.preventDefault();
				onEvent?.({ type: 'game-won' });
			}}
		>
			{children}
		</button>
	)),
}));

jest.mock('../rge-snake-game.module.scss', () => ({
	wrapper: 'wrapper',
	board: 'board',
	engineContainer: 'engineContainer',
	overlay: 'overlay',
	overlayTitle: 'overlayTitle',
	overlayScore: 'overlayScore',
	overlayButton: 'overlayButton',
	controls: 'controls',
	score: 'score',
	arrowGrid: 'arrowGrid',
	arrowButton: 'arrowButton',
	arrowButtonActive: 'arrowButtonActive',
	food: 'food',
}));

describe('RgeSnakeGame', () => {
	it('renders the game board', () => {
		render(<RgeSnakeGame />);
		expect(screen.getByTestId('game-engine')).toBeInTheDocument();
	});

	it('renders the idle overlay on mount', () => {
		render(<RgeSnakeGame />);
		expect(screen.getByTestId('overlay-idle')).toBeInTheDocument();
	});

	it('renders game controls', () => {
		render(<RgeSnakeGame />);
		expect(screen.getByTestId('game-controls')).toBeInTheDocument();
	});

	it('shows initial score of 0', () => {
		render(<RgeSnakeGame />);
		expect(screen.getByTestId('score')).toHaveTextContent('SCORE: 0');
	});

	it('starts the game when START GAME is clicked', () => {
		render(<RgeSnakeGame />);
		fireEvent.click(screen.getByText('START GAME'));
		const engine = screen.getByTestId('game-engine');
		expect(engine).toHaveAttribute('data-running', 'true');
	});

	it('removes idle overlay when game starts', () => {
		render(<RgeSnakeGame />);
		fireEvent.click(screen.getByText('START GAME'));
		expect(screen.queryByTestId('overlay-idle')).not.toBeInTheDocument();
	});

	it('increments score on food-eaten event', () => {
		render(<RgeSnakeGame />);
		fireEvent.click(screen.getByText('START GAME'));
		fireEvent.click(screen.getByTestId('game-engine'));
		expect(screen.getByTestId('score')).toHaveTextContent('SCORE: 1');
	});

	it('shows game-over overlay on game-over event', () => {
		render(<RgeSnakeGame />);
		fireEvent.click(screen.getByText('START GAME'));
		fireEvent.doubleClick(screen.getByTestId('game-engine'));
		expect(screen.getByTestId('overlay-lost')).toBeInTheDocument();
	});

	it('shows won overlay on game-won event', () => {
		render(<RgeSnakeGame />);
		fireEvent.click(screen.getByText('START GAME'));
		fireEvent.contextMenu(screen.getByTestId('game-engine'));
		expect(screen.getByTestId('overlay-won')).toBeInTheDocument();
	});

	it('stops the engine when game is over', () => {
		render(<RgeSnakeGame />);
		fireEvent.click(screen.getByText('START GAME'));
		fireEvent.doubleClick(screen.getByTestId('game-engine'));
		const engine = screen.getByTestId('game-engine');
		expect(engine).toHaveAttribute('data-running', 'false');
	});

	it('restarts the game from game-over state', () => {
		render(<RgeSnakeGame />);
		fireEvent.click(screen.getByText('START GAME'));
		fireEvent.doubleClick(screen.getByTestId('game-engine'));
		fireEvent.click(screen.getByText('TRY AGAIN'));
		const engine = screen.getByTestId('game-engine');
		expect(engine).toHaveAttribute('data-running', 'true');
		expect(screen.queryByTestId('overlay-lost')).not.toBeInTheDocument();
	});

	it('resets score on restart', () => {
		render(<RgeSnakeGame />);
		fireEvent.click(screen.getByText('START GAME'));
		fireEvent.click(screen.getByTestId('game-engine'));
		expect(screen.getByTestId('score')).toHaveTextContent('SCORE: 1');
		fireEvent.doubleClick(screen.getByTestId('game-engine'));
		fireEvent.click(screen.getByText('TRY AGAIN'));
		expect(screen.getByTestId('score')).toHaveTextContent('SCORE: 0');
	});

	it('renders all four arrow control buttons', () => {
		render(<RgeSnakeGame />);
		expect(screen.getByTestId('arrow-up')).toBeInTheDocument();
		expect(screen.getByTestId('arrow-down')).toBeInTheDocument();
		expect(screen.getByTestId('arrow-left')).toBeInTheDocument();
		expect(screen.getByTestId('arrow-right')).toBeInTheDocument();
	});

	it('engine is not running in idle state', () => {
		render(<RgeSnakeGame />);
		const engine = screen.getByTestId('game-engine');
		expect(engine).toHaveAttribute('data-running', 'false');
	});
});
