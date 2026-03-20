import { render, screen, fireEvent } from '@testing-library/react';
import { RgePacmanGame } from '../rge-pacman-game.component';

jest.mock('react-game-engine', () => ({
	GameEngine: jest.fn().mockImplementation(({ children, className, running, onEvent }) => (
		<button
			data-testid="game-engine"
			data-running={String(running)}
			className={className}
			type="button"
			onClick={() => onEvent?.({ type: 'score-updated' })}
			onDoubleClick={() => onEvent?.({ type: 'pacman-died' })}
			onContextMenu={(event: React.MouseEvent) => {
				event.preventDefault();
				onEvent?.({ type: 'level-complete' });
			}}
		>
			{children}
		</button>
	)),
}));

jest.mock('../renderers/pacman-renderer.component', () => ({
	PacmanRenderer: () => <div data-testid="pacman-renderer" />,
}));

jest.mock('../renderers/ghost-renderer.component', () => ({
	GhostRenderer: () => <div data-testid="ghost-renderer" />,
}));

jest.mock('../renderers/maze-renderer.component', () => ({
	MazeRenderer: () => <div data-testid="maze-renderer" />,
}));

jest.mock('../renderers/fruit-renderer.component', () => ({
	FruitRenderer: () => <div data-testid="fruit-renderer" />,
}));

jest.mock('../components/game-controls', () => ({
	GameControls: ({ score, lives }: { score: number; lives: number }) => (
		<div data-testid="game-controls">
			<span data-testid="score">SCORE: {score}</span>
			<span data-testid="lives">LIVES: {lives}</span>
		</div>
	),
}));

jest.mock('../components/game-overlay', () => ({
	GameOverlay: ({
		phase,
		score,
		lives,
		onStartAction,
		onRestartAction,
	}: {
		phase: string;
		score: number;
		lives: number;
		onStartAction: () => void;
		onRestartAction: () => void;
	}) => {
		if (phase === 'playing') return null;

		return (
			<div data-testid={`overlay-${phase}`}>
				{phase === 'idle' && (
					<button onClick={onStartAction} type="button">
						START GAME
					</button>
				)}
				{(phase === 'won' || phase === 'lost') && (
					<>
						<span>SCORE: {score}</span>
						<span>LIVES: {lives}</span>
						<button onClick={onRestartAction} type="button">
							{phase === 'won' ? 'PLAY AGAIN' : 'TRY AGAIN'}
						</button>
					</>
				)}
			</div>
		);
	},
}));

jest.mock('../../hooks/use-active-key', () => ({
	useActiveKey: () => null,
}));

jest.mock('../rge-pacman-game.module.scss', () => ({
	wrapper: 'wrapper',
	board: 'board',
	engineContainer: 'engineContainer',
	overlay: 'overlay',
	overlayTitle: 'overlayTitle',
	overlayScore: 'overlayScore',
	overlayButton: 'overlayButton',
	controls: 'controls',
	score: 'score',
	stats: 'stats',
	statLine: 'statLine',
	schemeToggle: 'schemeToggle',
}));

describe('RgePacmanGame', () => {
	it('renders the game engine', () => {
		render(<RgePacmanGame />);
		expect(screen.getByTestId('game-engine')).toBeInTheDocument();
	});

	it('renders the idle overlay on mount', () => {
		render(<RgePacmanGame />);
		expect(screen.getByTestId('overlay-idle')).toBeInTheDocument();
	});

	it('renders game controls', () => {
		render(<RgePacmanGame />);
		expect(screen.getByTestId('game-controls')).toBeInTheDocument();
	});

	it('shows initial score of 0', () => {
		render(<RgePacmanGame />);
		expect(screen.getByTestId('score')).toHaveTextContent('SCORE: 0');
	});

	it('shows initial lives of 3', () => {
		render(<RgePacmanGame />);
		expect(screen.getByTestId('lives')).toHaveTextContent('LIVES: 3');
	});

	it('engine is not running in idle state', () => {
		render(<RgePacmanGame />);
		const engine = screen.getByTestId('game-engine');
		expect(engine).toHaveAttribute('data-running', 'false');
	});

	it('starts the game when START GAME is clicked', () => {
		render(<RgePacmanGame />);
		fireEvent.click(screen.getByText('START GAME'));
		const engine = screen.getByTestId('game-engine');
		expect(engine).toHaveAttribute('data-running', 'true');
	});

	it('removes idle overlay when game starts', () => {
		render(<RgePacmanGame />);
		fireEvent.click(screen.getByText('START GAME'));
		expect(screen.queryByTestId('overlay-idle')).not.toBeInTheDocument();
	});

	it('shows won overlay on level-complete event', () => {
		render(<RgePacmanGame />);
		fireEvent.click(screen.getByText('START GAME'));
		fireEvent.contextMenu(screen.getByTestId('game-engine'));
		expect(screen.getByTestId('overlay-won')).toBeInTheDocument();
	});

	it('stops the engine when game is won', () => {
		render(<RgePacmanGame />);
		fireEvent.click(screen.getByText('START GAME'));
		fireEvent.contextMenu(screen.getByTestId('game-engine'));
		const engine = screen.getByTestId('game-engine');
		expect(engine).toHaveAttribute('data-running', 'false');
	});

	it('restarts the game from won state', () => {
		render(<RgePacmanGame />);
		fireEvent.click(screen.getByText('START GAME'));
		fireEvent.contextMenu(screen.getByTestId('game-engine'));
		fireEvent.click(screen.getByText('PLAY AGAIN'));
		const engine = screen.getByTestId('game-engine');
		expect(engine).toHaveAttribute('data-running', 'true');
		expect(screen.queryByTestId('overlay-won')).not.toBeInTheDocument();
	});
});
